import {
  storageLocalGet,
  storageLocalSet,
  storageSyncGet,
  storageSyncSet,
} from "./chrome-api.js"

const SETTINGS_KEY = "activeaid:settings"
const RUNTIME_KEY = "activeaid:runtime"

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

