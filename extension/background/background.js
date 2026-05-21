import { getSettings, setRuntimeState, getRuntimeState } from "../shared/storage.js"
import { minutesToMs, msToRoundedMinutes, nowMs } from "../shared/time.js"
import { notificationsCreate } from "../shared/chrome-api.js"

const ALARM_NAME = "activeaid:tick"
const TICK_MINUTES = 1

const DEFAULT_INACTIVITY_RESET_MINUTES = 5
const NOTIFICATION_SNOOZE_MINUTES = 10

chrome.runtime.onInstalled.addListener(async () => {
  chrome.alarms.create(ALARM_NAME, { periodInMinutes: TICK_MINUTES })

  await getSettings()
  await getRuntimeState()
})

chrome.notifications.onButtonClicked.addListener((notificationId, buttonIndex) => {
  if (!notificationId?.startsWith("activeaid:reminder:")) return

  if (buttonIndex === 0) {
    void setRuntimeState({
      snoozedUntilMs: nowMs() + minutesToMs(NOTIFICATION_SNOOZE_MINUTES),
    })
  }

  if (buttonIndex === 1) {
    void resetActiveSession()
  }
})

chrome.notifications.onClicked.addListener((_notificationId) => {
  if (chrome.action?.openPopup) {
    void chrome.action.openPopup()
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
})

chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name !== ALARM_NAME) return
  void tick()
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
  if (!settings.notificationsEnabled) return

  const state = await getRuntimeState()
  const t = nowMs()

  if (state.snoozedUntilMs != null && t < state.snoozedUntilMs) return
  if (state.activeSinceMs == null || state.lastActivityMs == null) return

  const reminderIntervalMs = minutesToMs(settings.reminderIntervalMinutes)
  const activeDurationMs = t - state.activeSinceMs

  if (activeDurationMs < reminderIntervalMs) return

  const minutes = msToRoundedMinutes(activeDurationMs)
  await showReminder(minutes)

  await setRuntimeState({
    lastReminderMs: t,
    activeSinceMs: t,
  })
}

async function showReminder(activeMinutes) {
  const notificationId = `activeaid:reminder:${Date.now()}`

  await notificationsCreate(notificationId, {
    type: "basic",
    iconUrl: chrome.runtime.getURL("assets/icon.svg"),
    title: "ActiveAid",
    message: `You’ve been active for about ${activeMinutes} minutes. Want a quick movement break?`,
    priority: 0,
    buttons: [{ title: `Snooze ${NOTIFICATION_SNOOZE_MINUTES}m` }, { title: "Reset timer" }],
  })
}

