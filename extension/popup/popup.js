import { getSettings, setSettings, getRuntimeState, setRuntimeState } from "../shared/storage.js"
import { minutesToMs, formatRelativeTime, msToRoundedMinutes, nowMs } from "../shared/time.js"
import { runtimeSendMessage } from "../shared/chrome-api.js"

const els = {
  statusText: document.getElementById("statusText"),
  lastTickText: document.getElementById("lastTickText"),
  lastDecisionText: document.getElementById("lastDecisionText"),
  activeSinceText: document.getElementById("activeSinceText"),
  lastActivityText: document.getElementById("lastActivityText"),
  snoozedText: document.getElementById("snoozedText"),
  errorRow: document.getElementById("errorRow"),
  lastErrorText: document.getElementById("lastErrorText"),
  alarmText: document.getElementById("alarmText"),
  notificationsEnabled: document.getElementById("notificationsEnabled"),
  reminderIntervalMinutes: document.getElementById("reminderIntervalMinutes"),
  snooze10: document.getElementById("snooze10"),
  snooze30: document.getElementById("snooze30"),
  resetTimer: document.getElementById("resetTimer"),
  runTick: document.getElementById("runTick"),
  testNotification: document.getElementById("testNotification"),
}

await hydrate()
startPolling()

els.notificationsEnabled.addEventListener("change", async () => {
  await setSettings({ notificationsEnabled: els.notificationsEnabled.checked })
  await hydrate()
})

let intervalSaveTimer = null
els.reminderIntervalMinutes.addEventListener("input", () => {
  if (intervalSaveTimer) window.clearTimeout(intervalSaveTimer)
  intervalSaveTimer = window.setTimeout(async () => {
    const minutes = Number(els.reminderIntervalMinutes.value)
    await setSettings({ reminderIntervalMinutes: minutes })
    await hydrate()
  }, 250)
})

els.snooze10.addEventListener("click", () => snoozeForMinutes(10))
els.snooze30.addEventListener("click", () => snoozeForMinutes(30))

els.resetTimer.addEventListener("click", async () => {
  const res = await runtimeSendMessage({ type: "activeaid:reset" }).catch((err) => ({
    ok: false,
    error: err?.message ? String(err.message) : String(err),
  }))
  if (res && res.ok === false && res.error) {
    els.errorRow.style.display = "flex"
    els.lastErrorText.textContent = res.error
  }
  await hydrate()
})

els.runTick.addEventListener("click", async () => {
  const res = await runtimeSendMessage({ type: "activeaid:debug:runTick" }).catch((err) => ({
    ok: false,
    error: err?.message ? String(err.message) : String(err),
  }))
  if (res && res.ok === false && res.error) {
    els.errorRow.style.display = "flex"
    els.lastErrorText.textContent = res.error
  }
  await hydrate()
})

els.testNotification.addEventListener("click", async () => {
  const res = await runtimeSendMessage({ type: "activeaid:debug:testNotification" }).catch((err) => ({
    ok: false,
    error: err?.message ? String(err.message) : String(err),
  }))
  if (res && res.ok === false && res.error) {
    els.errorRow.style.display = "flex"
    els.lastErrorText.textContent = res.error
  }
  await hydrate()
})

async function snoozeForMinutes(minutes) {
  const until = nowMs() + minutesToMs(minutes)
  await setRuntimeState({ snoozedUntilMs: until })
  await hydrate()
}

async function hydrate() {
  const [settings, runtime, alarmInfo] = await Promise.all([
    getSettings(),
    getRuntimeState(),
    runtimeSendMessage({ type: "activeaid:debug:getAlarm" }).catch(() => null),
  ])

  els.notificationsEnabled.checked = settings.notificationsEnabled
  els.reminderIntervalMinutes.value = String(settings.reminderIntervalMinutes)

  const activeMinutes =
    runtime.activeSinceMs != null ? msToRoundedMinutes(nowMs() - runtime.activeSinceMs) : null

  const snoozed =
    runtime.snoozedUntilMs != null && nowMs() < runtime.snoozedUntilMs
      ? `until ${new Date(runtime.snoozedUntilMs).toLocaleTimeString([], {
          hour: "numeric",
          minute: "2-digit",
        })}`
      : "no"

  const status = settings.notificationsEnabled ? "enabled" : "paused"

  els.statusText.textContent = status
  els.lastTickText.textContent = formatRelativeTime(runtime.lastTickMs)
  els.lastDecisionText.textContent = runtime.lastDecision ?? "—"
  els.activeSinceText.textContent = activeMinutes == null ? "—" : `${activeMinutes}m`
  els.lastActivityText.textContent = formatRelativeTime(runtime.lastActivityMs)
  els.snoozedText.textContent = snoozed

  const scheduledTime = alarmInfo?.alarm?.scheduledTime
  els.alarmText.textContent =
    typeof scheduledTime === "number"
      ? `~${Math.max(0, Math.round((scheduledTime - nowMs()) / 1000))}s`
      : "not scheduled"

  if (runtime.lastNotificationError) {
    els.errorRow.style.display = "flex"
    els.lastErrorText.textContent = runtime.lastNotificationError
  } else {
    els.errorRow.style.display = "none"
    els.lastErrorText.textContent = "—"
  }
}

function startPolling() {
  window.setInterval(() => {
    void hydrate()
  }, 2_000)
}

