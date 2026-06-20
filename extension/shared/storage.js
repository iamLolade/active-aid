import {
  storageLocalGet,
  storageLocalSet,
  storageLocalRemove,
  storageSyncGet,
  storageSyncSet,
  storageSyncRemove,
} from "./chrome-api.js"
import { todayDateKey } from "./checkins.js"
import { buildWellnessSummary } from "./wellness.js"

const SETTINGS_KEY = "activeaid:settings"
const RUNTIME_KEY = "activeaid:runtime"
const SESSION_LOGS_KEY = "activeaid:sessionLogs"
const CHECKINS_KEY = "activeaid:checkins"
const DAILY_KEY = "activeaid:daily"
const ONBOARDING_KEY = "activeaid:onboarding"

const MAX_SESSION_LOGS = 200
const MAX_CHECKINS = 400

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

/** @typedef {{ date: string, severity: string, bodyAreas: string[], createdAt: number }} CheckInLog */

export async function getCheckIns() {
  const stored = await storageLocalGet(CHECKINS_KEY)
  const raw = stored?.[CHECKINS_KEY]
  if (!Array.isArray(raw)) return []
  return raw.map(normalizeCheckIn).filter(Boolean).slice(0, MAX_CHECKINS)
}

export async function getTodayCheckIn() {
  const today = todayDateKey()
  const checkIns = await getCheckIns()
  return checkIns.find((c) => c.date === today) ?? null
}

export async function saveCheckIn({ severity, bodyAreas }) {
  const today = todayDateKey()
  const checkIns = await getCheckIns()
  const filtered = checkIns.filter((c) => c.date !== today)
  const entry = {
    date: today,
    severity: String(severity),
    bodyAreas: Array.isArray(bodyAreas) ? bodyAreas.map(String) : [],
    createdAt: Date.now(),
  }
  const next = [entry, ...filtered].slice(0, MAX_CHECKINS)
  await storageLocalSet({ [CHECKINS_KEY]: next })
  return entry
}

export async function getDailyStats() {
  const stored = await storageLocalGet(DAILY_KEY)
  const raw = stored?.[DAILY_KEY]
  return normalizeDaily(raw)
}

export async function recordActivityMs(deltaMs) {
  const daily = await getDailyStats()
  const next = {
    date: todayDateKey(),
    activityMs: daily.activityMs + Math.max(0, Math.round(deltaMs)),
    reminders: daily.reminders,
  }
  await storageLocalSet({ [DAILY_KEY]: next })
  return next
}

export async function recordReminderShown() {
  const daily = await getDailyStats()
  const next = {
    date: todayDateKey(),
    activityMs: daily.activityMs,
    reminders: daily.reminders + 1,
  }
  await storageLocalSet({ [DAILY_KEY]: next })
  return next
}

export async function getWellnessSummary() {
  const [checkIns, sessionLogs, daily] = await Promise.all([
    getCheckIns(),
    getSessionLogs(),
    getDailyStats(),
  ])
  return buildWellnessSummary(checkIns, sessionLogs, daily)
}

export async function exportAllData() {
  const [settings, runtime, sessionLogs, checkIns, daily, onboarding] = await Promise.all([
    getSettings(),
    getRuntimeState(),
    getSessionLogs(),
    getCheckIns(),
    getDailyStats(),
    isOnboardingComplete(),
  ])

  return {
    exportedAt: new Date().toISOString(),
    version: 1,
    data: {
      settings,
      runtime: {
        snoozedUntilMs: runtime.snoozedUntilMs,
        lastReminderMs: runtime.lastReminderMs,
      },
      sessionLogs,
      checkIns,
      daily,
      onboardingComplete: onboarding,
    },
  }
}

export async function clearAllData() {
  await Promise.all([
    storageLocalRemove([RUNTIME_KEY, SESSION_LOGS_KEY, CHECKINS_KEY, DAILY_KEY, ONBOARDING_KEY]),
    storageSyncRemove([SETTINGS_KEY]),
  ])
}

export async function isOnboardingComplete() {
  const stored = await storageLocalGet(ONBOARDING_KEY)
  return Boolean(stored?.[ONBOARDING_KEY]?.complete)
}

export async function completeOnboarding() {
  await storageLocalSet({
    [ONBOARDING_KEY]: { complete: true, completedAt: Date.now() },
  })
}

function normalizeCheckIn(raw) {
  if (!raw || typeof raw !== "object") return null
  const date = typeof raw.date === "string" ? raw.date : null
  const severity = typeof raw.severity === "string" ? raw.severity : null
  const createdAt = numberOrNull(raw.createdAt)
  if (!date || !severity || createdAt == null) return null
  const bodyAreas = Array.isArray(raw.bodyAreas)
    ? raw.bodyAreas.filter((a) => typeof a === "string")
    : []
  return { date, severity, bodyAreas, createdAt }
}

function normalizeDaily(raw) {
  const today = todayDateKey()
  if (!raw || raw.date !== today) {
    return { date: today, activityMs: 0, reminders: 0 }
  }
  return {
    date: today,
    activityMs: Math.max(0, Math.round(Number(raw.activityMs) || 0)),
    reminders: Math.max(0, Math.round(Number(raw.reminders) || 0)),
  }
}

