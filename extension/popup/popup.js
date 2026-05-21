import { getSettings, setSettings, getRuntimeState, setRuntimeState } from "../shared/storage.js"
import { minutesToMs, formatRelativeTime, msToRoundedMinutes, nowMs } from "../shared/time.js"
import { runtimeSendMessage } from "../shared/chrome-api.js"

const els = {
  statusText: document.getElementById("statusText"),
  activeSinceText: document.getElementById("activeSinceText"),
  lastActivityText: document.getElementById("lastActivityText"),
  snoozedText: document.getElementById("snoozedText"),
  notificationsEnabled: document.getElementById("notificationsEnabled"),
  reminderIntervalMinutes: document.getElementById("reminderIntervalMinutes"),
  snooze10: document.getElementById("snooze10"),
  snooze30: document.getElementById("snooze30"),
  resetTimer: document.getElementById("resetTimer"),
}

await hydrate()
startPolling()

els.notificationsEnabled.addEventListener("change", async () => {
  await setSettings({ notificationsEnabled: els.notificationsEnabled.checked })
  await hydrate()
})

els.reminderIntervalMinutes.addEventListener("change", async () => {
  const minutes = Number(els.reminderIntervalMinutes.value)
  await setSettings({ reminderIntervalMinutes: minutes })
  await hydrate()
})

els.snooze10.addEventListener("click", () => snoozeForMinutes(10))
els.snooze30.addEventListener("click", () => snoozeForMinutes(30))

els.resetTimer.addEventListener("click", async () => {
  await runtimeSendMessage({ type: "activeaid:reset" }).catch(() => undefined)
  await hydrate()
})

async function snoozeForMinutes(minutes) {
  const until = nowMs() + minutesToMs(minutes)
  await setRuntimeState({ snoozedUntilMs: until })
  await hydrate()
}

async function hydrate() {
  const [settings, runtime] = await Promise.all([getSettings(), getRuntimeState()])

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
  els.activeSinceText.textContent = activeMinutes == null ? "—" : `${activeMinutes}m`
  els.lastActivityText.textContent = formatRelativeTime(runtime.lastActivityMs)
  els.snoozedText.textContent = snoozed
}

function startPolling() {
  window.setInterval(() => {
    void hydrate()
  }, 2_000)
}

