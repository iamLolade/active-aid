const ALARM_NAME = "activeaid:tick"
const TICK_MINUTES = 1

const DEFAULT_INACTIVITY_RESET_MINUTES = 5
const NOTIFICATION_SNOOZE_MINUTES = 10

/** Cross-browser namespace: browser (Firefox) or chrome (Chrome/Edge) */
const $ext = typeof browser !== "undefined" ? browser : chrome

const NOTIFICATION_ICON_URL = () =>
  $ext.runtime.getURL("assets/icon-128.png")

const SETTINGS_KEY = "activeaid:settings"
const RUNTIME_KEY = "activeaid:runtime"
const DAILY_KEY = "activeaid:daily"
const ACTIVITY_PING_CAP_MS = 10_000

const DEFAULT_SETTINGS = {
  reminderIntervalMinutes: 90,
  notificationsEnabled: true,
}

function nowMs() {
  return Date.now()
}

function minutesToMs(minutes) {
  return Math.max(0, minutes) * 60_000
}

function msToRoundedMinutes(ms) {
  return Math.max(0, Math.round(ms / 60_000))
}

function ensureAlarm() {
  $ext.alarms.create(ALARM_NAME, { periodInMinutes: TICK_MINUTES })
}

ensureAlarm()

chrome.runtime.onInstalled.addListener(() => {
  ensureAlarm()
  void getSettings()
  void getRuntimeState()
})

chrome.runtime.onStartup?.addListener(() => {
  ensureAlarm()
})

chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name !== ALARM_NAME) return
  void tick()
})

chrome.notifications.onButtonClicked.addListener((notificationId, buttonIndex) => {
  if (!notificationId || !notificationId.startsWith("activeaid:reminder:")) return

  if (buttonIndex === 0) {
    void setRuntimeState({
      snoozedUntilMs: nowMs() + minutesToMs(NOTIFICATION_SNOOZE_MINUTES),
    })
  }

  if (buttonIndex === 1) {
    void resetActiveSession()
  }
})

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (!message || typeof message !== "object") return

  if (message.type === "activeaid:activity") {
    void handleActivityPing()
    sendResponse({ ok: true })
    return true
  }

  if (message.type === "activeaid:reset") {
    void resetActiveSession()
    sendResponse({ ok: true })
    return true
  }

  if (message.type === "activeaid:debug:runTick") {
    void (async () => {
      await tick()
      const runtime = await getRuntimeState()
      sendResponse({ ok: true, runtime })
    })()
    return true
  }

  if (message.type === "activeaid:debug:testNotification") {
    void (async () => {
      const ok = await showReminder(1)
      const runtime = await getRuntimeState()
      sendResponse({ ok, runtime })
    })()
    return true
  }

  if (message.type === "activeaid:debug:getAlarm") {
    $ext.alarms.get(ALARM_NAME, (alarm) => {
      sendResponse({ ok: true, alarm: alarm ?? null })
    })
    return true
  }
})

async function handleActivityPing() {
  const t = nowMs()
  const state = await getRuntimeState()

  const inactiveResetMs = minutesToMs(DEFAULT_INACTIVITY_RESET_MINUTES)
  const lastActivityMs = state.lastActivityMs ?? null

  const shouldStartNewSession =
    state.activeSinceMs == null ||
    lastActivityMs == null ||
    t - lastActivityMs > inactiveResetMs

  if (!shouldStartNewSession && lastActivityMs != null) {
    const delta = Math.min(t - lastActivityMs, ACTIVITY_PING_CAP_MS)
    if (delta > 0) await recordActivityMs(delta)
  }

  await setRuntimeState({
    lastActivityMs: t,
    activeSinceMs: shouldStartNewSession ? t : state.activeSinceMs,
  })
}

async function resetActiveSession() {
  const t = nowMs()
  await setRuntimeState({
    activeSinceMs: t,
    lastActivityMs: t,
    lastReminderMs: null,
  })
}

async function tick() {
  const settings = await getSettings()
  const state = await getRuntimeState()
  const t = nowMs()

  await setRuntimeState({ lastTickMs: t, lastDecision: "tick", lastNotificationError: null })

  if (!settings.notificationsEnabled) {
    await setRuntimeState({ lastDecision: "disabled" })
    return
  }

  if (state.snoozedUntilMs != null && t < state.snoozedUntilMs) {
    await setRuntimeState({ lastDecision: "snoozed" })
    return
  }

  if (state.activeSinceMs == null || state.lastActivityMs == null) {
    await setRuntimeState({ lastDecision: "no-activity" })
    return
  }

  const reminderIntervalMs = minutesToMs(settings.reminderIntervalMinutes)
  const activeDurationMs = t - state.activeSinceMs

  if (activeDurationMs < reminderIntervalMs) {
    await setRuntimeState({ lastDecision: "waiting" })
    return
  }

  const minutes = msToRoundedMinutes(activeDurationMs)
  const ok = await showReminder(minutes)
  if (!ok) return

  await recordReminderShown()

  await setRuntimeState({
    lastReminderMs: t,
    activeSinceMs: t,
    lastDecision: "reminded",
  })
}

async function showReminder(activeMinutes) {
  const notificationId = `activeaid:reminder:${Date.now()}`

  try {
    await notificationsCreate(notificationId, {
      type: "basic",
      iconUrl: NOTIFICATION_ICON_URL(),
      title: "ActiveAid",
      message: `You’ve been active for about ${activeMinutes} minutes. Want a quick movement break?`,
      priority: 0,
      buttons: [{ title: `Snooze ${NOTIFICATION_SNOOZE_MINUTES}m` }, { title: "Reset timer" }],
    })
    return true
  } catch (err) {
    await setRuntimeState({
      lastNotificationError: err && err.message ? String(err.message) : String(err),
      lastDecision: "notification-error",
    })
    return false
  }
}

function notificationsCreate(notificationId, options) {
  return new Promise((resolve, reject) => {
    $ext.notifications.create(notificationId, options, (createdId) => {
      const err = $ext.runtime.lastError
      if (err) return reject(err)
      resolve(createdId)
    })
  })
}

function storageSyncGet(key) {
  return new Promise((resolve, reject) => {
    $ext.storage.sync.get(key, (result) => {
      const err = $ext.runtime.lastError
      if (err) return reject(err)
      resolve(result)
    })
  })
}

function storageLocalGet(key) {
  return new Promise((resolve, reject) => {
    $ext.storage.local.get(key, (result) => {
      const err = $ext.runtime.lastError
      if (err) return reject(err)
      resolve(result)
    })
  })
}

function storageLocalSet(items) {
  return new Promise((resolve, reject) => {
    $ext.storage.local.set(items, () => {
      const err = $ext.runtime.lastError
      if (err) return reject(err)
      resolve()
    })
  })
}

async function getSettings() {
  const stored = await storageSyncGet(SETTINGS_KEY)
  const raw = stored && stored[SETTINGS_KEY]
  return normalizeSettings(raw)
}

async function getRuntimeState() {
  const stored = await storageLocalGet(RUNTIME_KEY)
  const raw = stored && stored[RUNTIME_KEY]

  return {
    activeSinceMs: numberOrNull(raw && raw.activeSinceMs),
    lastActivityMs: numberOrNull(raw && raw.lastActivityMs),
    lastReminderMs: numberOrNull(raw && raw.lastReminderMs),
    snoozedUntilMs: numberOrNull(raw && raw.snoozedUntilMs),
    lastTickMs: numberOrNull(raw && raw.lastTickMs),
    lastDecision: stringOrNull(raw && raw.lastDecision),
    lastNotificationError: stringOrNull(raw && raw.lastNotificationError),
  }
}

async function setRuntimeState(partial) {
  const current = await getRuntimeState()
  const next = Object.assign({}, current, partial)
  await storageLocalSet({ [RUNTIME_KEY]: next })
  return next
}

function normalizeSettings(raw) {
  const reminderIntervalMinutes = clampInt(
    raw && raw.reminderIntervalMinutes != null
      ? raw.reminderIntervalMinutes
      : DEFAULT_SETTINGS.reminderIntervalMinutes,
    1,
    240
  )

  const notificationsEnabled =
    raw && raw.notificationsEnabled != null
      ? Boolean(raw.notificationsEnabled)
      : DEFAULT_SETTINGS.notificationsEnabled

  return { reminderIntervalMinutes, notificationsEnabled }
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

function todayDateKey(date) {
  const d = date || new Date()
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, "0")
  const day = String(d.getDate()).padStart(2, "0")
  return y + "-" + m + "-" + day
}

async function getDailyStats() {
  const stored = await storageLocalGet(DAILY_KEY)
  const raw = stored && stored[DAILY_KEY]
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

async function recordActivityMs(deltaMs) {
  const daily = await getDailyStats()
  await storageLocalSet({
    [DAILY_KEY]: {
      date: daily.date,
      activityMs: daily.activityMs + Math.max(0, Math.round(deltaMs)),
      reminders: daily.reminders,
    },
  })
}

async function recordReminderShown() {
  const daily = await getDailyStats()
  await storageLocalSet({
    [DAILY_KEY]: {
      date: daily.date,
      activityMs: daily.activityMs,
      reminders: daily.reminders + 1,
    },
  })
}

