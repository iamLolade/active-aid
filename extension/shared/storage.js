import {
  storageLocalGet,
  storageLocalSet,
  storageSyncGet,
  storageSyncSet,
} from "./chrome-api.js"

const SETTINGS_KEY = "activeaid:settings"
const RUNTIME_KEY = "activeaid:runtime"
const SESSION_LOGS_KEY = "activeaid:sessionLogs"

const MAX_SESSION_LOGS = 200

const DEFAULT_SETTINGS = {
  reminderIntervalMinutes: 90,
  notificationsEnabled: true,
}

export async function getSettings() {
  const stored = await storageSyncGet(SETTINGS_KEY)
  const raw = stored?.[SETTINGS_KEY]
  return normalizeSettings(raw)
}

export async function setSettings(partial) {
  const current = await getSettings()
  const next = normalizeSettings({ ...current, ...partial })
  await storageSyncSet({ [SETTINGS_KEY]: next })
  return next
}

export async function getRuntimeState() {
  const stored = await storageLocalGet(RUNTIME_KEY)
  const raw = stored?.[RUNTIME_KEY]

  return {
    activeSinceMs: numberOrNull(raw?.activeSinceMs),
    lastActivityMs: numberOrNull(raw?.lastActivityMs),
    lastReminderMs: numberOrNull(raw?.lastReminderMs),
    snoozedUntilMs: numberOrNull(raw?.snoozedUntilMs),
    lastTickMs: numberOrNull(raw?.lastTickMs),
    lastDecision: stringOrNull(raw?.lastDecision),
    lastNotificationError: stringOrNull(raw?.lastNotificationError),
  }
}

export async function setRuntimeState(partial) {
  const current = await getRuntimeState()
  const next = {
    ...current,
    ...partial,
  }
  await storageLocalSet({ [RUNTIME_KEY]: next })
  return next
}

function normalizeSettings(raw) {
  const reminderIntervalMinutes = clampInt(
    raw?.reminderIntervalMinutes ?? DEFAULT_SETTINGS.reminderIntervalMinutes,
    1,
    240
  )

  const notificationsEnabled =
    raw?.notificationsEnabled ?? DEFAULT_SETTINGS.notificationsEnabled

  return {
    reminderIntervalMinutes,
    notificationsEnabled: Boolean(notificationsEnabled),
  }
}

function clampInt(value, min, max) {
  const n = Number(value)
  if (!Number.isFinite(n)) return min
  return Math.min(max, Math.max(min, Math.round(n)))
}

function numberOrNull(value) {
  const n = Number(value)
  return Number.isFinite(n) ? n : null
}

function stringOrNull(value) {
  if (typeof value !== "string") return null
  const s = value.trim()
  return s.length ? s : null
}

/** @typedef {{ sessionId: string, completedAt: number, durationSeconds: number }} SessionLog */

export async function getSessionLogs() {
  const stored = await storageLocalGet(SESSION_LOGS_KEY)
  const raw = stored?.[SESSION_LOGS_KEY]
  if (!Array.isArray(raw)) return []
  return raw
    .map(normalizeSessionLog)
    .filter(Boolean)
    .slice(0, MAX_SESSION_LOGS)
}

export async function addSessionLog(entry) {
  const logs = await getSessionLogs()
  const next = [
    {
      sessionId: String(entry.sessionId),
      completedAt: Number(entry.completedAt) || Date.now(),
      durationSeconds: Math.max(0, Math.round(Number(entry.durationSeconds) || 0)),
    },
    ...logs,
  ].slice(0, MAX_SESSION_LOGS)
  await storageLocalSet({ [SESSION_LOGS_KEY]: next })
  return next
}

export async function getSessionStats() {
  const logs = await getSessionLogs()
  const startOfDay = new Date()
  startOfDay.setHours(0, 0, 0, 0)

  const todayCount = logs.filter((l) => l.completedAt >= startOfDay.getTime()).length
  const last = logs[0] ?? null

  return {
    totalCount: logs.length,
    todayCount,
    lastCompletedAt: last?.completedAt ?? null,
    lastSessionId: last?.sessionId ?? null,
  }
}

function normalizeSessionLog(raw) {
  if (!raw || typeof raw !== "object") return null
  const sessionId = typeof raw.sessionId === "string" ? raw.sessionId : null
  const completedAt = numberOrNull(raw.completedAt)
  if (!sessionId || completedAt == null) return null
  return {
    sessionId,
    completedAt,
    durationSeconds: Math.max(0, Math.round(Number(raw.durationSeconds) || 0)),
  }
}

