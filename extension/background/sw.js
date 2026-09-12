import {
  alarmsCreate,
  alarmsGet,
  getURL,
  notificationsCreate,
  tabsCreate,
  windowsCreate,
  onAlarm,
  onInstalled,
  onMessage,
  onNotificationButtonClicked,
  onNotificationClicked,
  onStartup,
} from "../shared/browser-api.js"
import {
  getSettings,
  getRuntimeState,
  setRuntimeState,
  recordActivityMs,
  recordReminderShown,
  isOnboardingComplete,
  setQuickReliefIntent,
} from "../shared/storage.js"
import { minutesToMs, nowMs } from "../shared/time.js"
import { isActivityRecent } from "../shared/activity.js"
import { getReminderDecision } from "../shared/reminders.js"

const ALARM_NAME = "activeaid:tick"
const TICK_MINUTES = 1

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
    void openQuickRelief()
  }

  if (buttonIndex === 1) {
    void setRuntimeState({
      snoozedUntilMs: nowMs() + minutesToMs(NOTIFICATION_SNOOZE_MINUTES),
    })
  }
})

onNotificationClicked((notificationId) => {
  if (!notificationId || !notificationId.startsWith("activeaid:reminder:")) return
  void openQuickRelief()
})

onMessage((message, _sender, sendResponse) => {
  if (!message || typeof message !== "object") return

  if (message.type === "activeaid:activity") {
    void handleActivityPing()
    sendResponse({ ok: true })
    return true
  }

  if (message.type === "activeaid:reset") {
    void (async () => {
      await resetActiveSession()
      sendResponse({ ok: true })
    })()
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
  if (!(await isOnboardingComplete())) return

  const t = nowMs()
  const state = await getRuntimeState()

  const lastActivityMs = state.lastActivityMs ?? null

  const shouldStartNewSession =
    state.activeSinceMs == null ||
    lastActivityMs == null ||
    !isActivityRecent(lastActivityMs, t)

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

async function openQuickRelief() {
  await setQuickReliefIntent()
  const url = `${getURL("popup/popup.html")}?surface=window`

  try {
    await windowsCreate({
      url,
      type: "popup",
      focused: true,
      width: 432,
      height: 720,
    })
  } catch {
    try {
      await tabsCreate({ url })
    } catch {
      // The intent remains available when the user next opens ActiveAid.
    }
  }
}

async function tick() {
  const settings = await getSettings()
  const state = await getRuntimeState()
  const t = nowMs()
  const decision = getReminderDecision({ settings, runtime: state, currentMs: t })

  await setRuntimeState({
    lastTickMs: t,
    lastDecision: decision.status,
    lastNotificationError: null,
    ...(decision.clearActiveSession ? { activeSinceMs: null } : {}),
  })

  if (decision.status !== "due") return

  const ok = await showReminder(decision.activeMinutes)
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
      buttons: [
        { title: "Choose a quick reset" },
        { title: `Snooze ${NOTIFICATION_SNOOZE_MINUTES}m` },
      ],
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
