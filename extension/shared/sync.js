import { SUPABASE_URL, SUPABASE_ANON_KEY, isSyncConfigured } from "./sync-config.js"
import { storageLocalGet, storageLocalSet, storageLocalRemove } from "./chrome-api.js"
import {
  getSettings,
  setSettings,
  getCheckIns,
  getSessionLogs,
  mergeCheckInsFromRemote,
  mergeSessionLogsFromRemote,
} from "./storage.js"

const SYNC_STATE_KEY = "activeaid:sync"
const REFRESH_BUFFER_MS = 60_000

let scheduledSyncTimer = null

function sessionClientEventId(sessionId, completedAt) {
  return `${sessionId}:${completedAt}`
}

function decodeJwtSub(accessToken) {
  const part = accessToken.split(".")[1]
  if (!part) throw new Error("Invalid session token")
  const base64 = part.replace(/-/g, "+").replace(/_/g, "/")
  const padded = base64.padEnd(Math.ceil(base64.length / 4) * 4, "=")
  const payload = JSON.parse(atob(padded))
  if (!payload.sub) throw new Error("Invalid session token")
  return payload.sub
}

async function getSyncState() {
  const stored = await storageLocalGet(SYNC_STATE_KEY)
  const raw = stored?.[SYNC_STATE_KEY] ?? {}
  return {
    enabled: Boolean(raw.enabled),
    email: typeof raw.email === "string" ? raw.email : "",
    accessToken: typeof raw.accessToken === "string" ? raw.accessToken : "",
    refreshToken: typeof raw.refreshToken === "string" ? raw.refreshToken : "",
    expiresAt: Number(raw.expiresAt) || 0,
    lastSyncedAt: Number(raw.lastSyncedAt) || 0,
    lastError: typeof raw.lastError === "string" ? raw.lastError : "",
  }
}

async function setSyncState(partial) {
  const current = await getSyncState()
  const next = { ...current, ...partial }
  await storageLocalSet({ [SYNC_STATE_KEY]: next })
  return next
}

export async function clearSyncState() {
  await storageLocalRemove([SYNC_STATE_KEY])
}

export { isSyncConfigured, getSyncState }

async function authRequest(path, body) {
  if (!isSyncConfigured()) throw new Error("Cloud sync is not configured")
  const res = await fetch(`${SUPABASE_URL}${path}`, {
    method: "POST",
    headers: {
      apikey: SUPABASE_ANON_KEY,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) {
    throw new Error(data.error_description || data.msg || data.message || "Sign in failed")
  }
  return data
}

async function apiRequest(path, { method = "GET", token, prefer, body } = {}) {
  if (!isSyncConfigured()) throw new Error("Cloud sync is not configured")
  const headers = {
    apikey: SUPABASE_ANON_KEY,
    Authorization: `Bearer ${token}`,
  }
  if (prefer) headers.Prefer = prefer
  if (body != null) headers["Content-Type"] = "application/json"

  const res = await fetch(`${SUPABASE_URL}${path}`, {
    method,
    headers,
    body: body != null ? JSON.stringify(body) : undefined,
  })

  if (res.status === 204) return null

  const text = await res.text()
  const data = text ? JSON.parse(text) : null
  if (!res.ok) {
    const message =
      (data && (data.message || data.error || data.hint)) || `Request failed (${res.status})`
    throw new Error(message)
  }
  return data
}

function applyAuthResponse(data, email, overrides = {}) {
  const expiresAt = Date.now() + (Number(data.expires_in) || 3600) * 1000
  return setSyncState({
    email,
    accessToken: data.access_token,
    refreshToken: data.refresh_token,
    expiresAt,
    lastError: "",
    ...overrides,
  })
}

export async function signIn(email, password) {
  const trimmedEmail = email.trim()
  if (!trimmedEmail || !password) throw new Error("Email and password are required")

  const data = await authRequest("/auth/v1/token?grant_type=password", {
    email: trimmedEmail,
    password,
  })

  await applyAuthResponse(data, trimmedEmail, {
    enabled: false,
    lastSyncedAt: 0,
  })
  return getSyncState()
}

export async function signOut() {
  cancelScheduledSync()
  const state = await getSyncState()

  try {
    if (state.accessToken && isSyncConfigured()) {
      await apiRequest("/auth/v1/logout", {
        method: "POST",
        token: state.accessToken,
      })
    }
  } catch {
    // Clearing the local session remains the priority when offline.
  } finally {
    await clearSyncState()
  }
}

export async function setSyncEnabled(enabled) {
  const state = await getSyncState()
  if (enabled && !state.accessToken) {
    throw new Error("Sign in before enabling cloud sync")
  }
  if (!enabled) cancelScheduledSync()
  await setSyncState({ enabled: Boolean(enabled), lastError: "" })
}

export async function setSyncError(message) {
  await setSyncState({ lastError: message || "" })
}

async function ensureAccessToken() {
  const state = await getSyncState()
  if (!state.accessToken) throw new Error("Not signed in")

  if (state.expiresAt - REFRESH_BUFFER_MS > Date.now()) {
    return { token: state.accessToken, userId: decodeJwtSub(state.accessToken) }
  }

  if (!state.refreshToken) throw new Error("Session expired. Sign in again.")

  const data = await authRequest("/auth/v1/token?grant_type=refresh_token", {
    refresh_token: state.refreshToken,
  })

  const next = await applyAuthResponse(data, state.email)
  return { token: next.accessToken, userId: decodeJwtSub(next.accessToken) }
}

async function pullRemoteData(token) {
  const [remoteCheckIns, remoteSessions, remoteSettingsRows] = await Promise.all([
    apiRequest("/rest/v1/discomfort_logs?select=date,severity,body_areas,created_at", { token }),
    apiRequest(
      "/rest/v1/wellness_logs?select=session_type,duration_seconds,created_at,client_event_id&order=created_at.desc&limit=200",
      { token }
    ),
    apiRequest("/rest/v1/reminder_settings?select=reminder_interval_minutes,notifications_enabled,updated_at&limit=1", {
      token,
    }),
  ])

  await mergeCheckInsFromRemote(Array.isArray(remoteCheckIns) ? remoteCheckIns : [])
  await mergeSessionLogsFromRemote(Array.isArray(remoteSessions) ? remoteSessions : [])

  const settingsRow = Array.isArray(remoteSettingsRows) ? remoteSettingsRows[0] : null
  return settingsRow
}

async function pushLocalData(token, userId) {
  const [settings, checkIns, sessionLogs] = await Promise.all([
    getSettings(),
    getCheckIns(),
    getSessionLogs(),
  ])

  await apiRequest("/rest/v1/reminder_settings?on_conflict=user_id", {
    method: "POST",
    token,
    prefer: "resolution=merge-duplicates",
    body: {
      user_id: userId,
      reminder_interval_minutes: settings.reminderIntervalMinutes,
      notifications_enabled: settings.notificationsEnabled,
    },
  })

  if (checkIns.length) {
    await apiRequest("/rest/v1/discomfort_logs?on_conflict=user_id,date", {
      method: "POST",
      token,
      prefer: "resolution=merge-duplicates",
      body: checkIns.map((entry) => ({
        user_id: userId,
        date: entry.date,
        severity: entry.severity,
        body_areas: entry.bodyAreas,
        created_at: new Date(entry.createdAt).toISOString(),
      })),
    })
  }

  if (!sessionLogs.length) return

  const existing = await apiRequest(
    "/rest/v1/wellness_logs?select=client_event_id&client_event_id=not.is.null&limit=500",
    { token }
  )
  const existingIds = new Set(
    (Array.isArray(existing) ? existing : [])
      .map((row) => row.client_event_id)
      .filter(Boolean)
  )

  const toInsert = sessionLogs
    .map((log) => ({
      user_id: userId,
      session_type: log.sessionId,
      duration_seconds: log.durationSeconds,
      completed: true,
      created_at: new Date(log.completedAt).toISOString(),
      client_event_id: sessionClientEventId(log.sessionId, log.completedAt),
    }))
    .filter((row) => !existingIds.has(row.client_event_id))

  if (!toInsert.length) return

  await apiRequest("/rest/v1/wellness_logs", {
    method: "POST",
    token,
    body: toInsert,
  })
}

export async function syncNow({ applyRemoteSettingsOnFirstSync = true } = {}) {
  if (!isSyncConfigured()) throw new Error("Cloud sync is not configured")

  const state = await getSyncState()
  if (!state.accessToken) throw new Error("Not signed in")
  if (!state.enabled) throw new Error("Cloud sync is off")

  const { token, userId } = await ensureAccessToken()
  const isFirstSync = !state.lastSyncedAt

  const remoteSettings = await pullRemoteData(token)

  if (
    applyRemoteSettingsOnFirstSync &&
    isFirstSync &&
    remoteSettings &&
    typeof remoteSettings.reminder_interval_minutes === "number"
  ) {
    await setSettings({
      reminderIntervalMinutes: remoteSettings.reminder_interval_minutes,
      notificationsEnabled: Boolean(remoteSettings.notifications_enabled),
    })
  }

  await pushLocalData(token, userId)

  await setSyncState({
    lastSyncedAt: Date.now(),
    lastError: "",
  })

  return getSyncState()
}

export async function deleteCloudData() {
  cancelScheduledSync()
  await setSyncState({ enabled: false, lastError: "" })

  const { token, userId } = await ensureAccessToken()
  const ownRows = `user_id=eq.${encodeURIComponent(userId)}`

  await Promise.all([
    apiRequest(`/rest/v1/wellness_logs?${ownRows}`, { method: "DELETE", token }),
    apiRequest(`/rest/v1/discomfort_logs?${ownRows}`, { method: "DELETE", token }),
    apiRequest(`/rest/v1/reminder_settings?${ownRows}`, { method: "DELETE", token }),
  ])

  return setSyncState({
    enabled: false,
    lastSyncedAt: 0,
    lastError: "",
  })
}

function cancelScheduledSync() {
  if (!scheduledSyncTimer) return
  window.clearTimeout(scheduledSyncTimer)
  scheduledSyncTimer = null
}

export function scheduleSyncIfEnabled() {
  cancelScheduledSync()
  scheduledSyncTimer = window.setTimeout(() => {
    scheduledSyncTimer = null
    void (async () => {
      try {
        const state = await getSyncState()
        if (!state.enabled || !state.accessToken || !isSyncConfigured()) return
        await syncNow()
      } catch {
        // auto-sync is best-effort
      }
    })()
  }, 2500)
}
