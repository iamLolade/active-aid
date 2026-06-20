import {
  alarmsCreate,
  alarmsGet,
  getURL,
  notificationsCreate,
  onAlarm,
  onInstalled,
  onMessage,
  onNotificationButtonClicked,
  onStartup,
} from "../shared/browser-api.js"
import {
  getSettings,
  getRuntimeState,
  setRuntimeState,
  recordActivityMs,
  recordReminderShown,
} from "../shared/storage.js"
import { minutesToMs, msToRoundedMinutes, nowMs } from "../shared/time.js"

const ALARM_NAME = "activeaid:tick"
const TICK_MINUTES = 1

const DEFAULT_INACTIVITY_RESET_MINUTES = 5
const NOTIFICATION_SNOOZE_MINUTES = 10
const ACTIVITY_PING_CAP_MS = 10_000

function ensureAlarm() {
  void alarmsCreate(ALARM_NAME, { periodInMinutes: TICK_MINUTES })
}

ensureAlarm()

onInstalled(() => {
  ensureAlarm()
  void getSettings()
  void getRuntimeState()
})

onStartup(() => {
  ensureAlarm()
})

onAlarm((alarm) => {
  if (alarm.name !== ALARM_NAME) return
  void tick()
})

onNotificationButtonClicked((notificationId, buttonIndex) => {
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

onMessage((message, _sender, sendResponse) => {
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
    void (async () => {
      const alarm = await alarmsGet(ALARM_NAME)
      sendResponse({ ok: true, alarm: alarm ?? null })
    })()
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
      iconUrl: getURL("assets/icon-128.png"),
      title: "ActiveAid",
      message: `You've been active for about ${activeMinutes} minutes. Want a quick movement break?`,
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
