import { getSettings, setSettings, getRuntimeState, setRuntimeState } from "../shared/storage.js"
import { minutesToMs, msToRoundedMinutes, nowMs } from "../shared/time.js"
import { runtimeSendMessage } from "../shared/chrome-api.js"

const els = {
  errorBanner: document.getElementById("errorBanner"),
  errorText: document.getElementById("errorText"),
  statusBadge: document.getElementById("statusBadge"),
  statusMessage: document.getElementById("statusMessage"),
  statusMeta: document.getElementById("statusMeta"),
  notificationsEnabled: document.getElementById("notificationsEnabled"),
  reminderIntervalMinutes: document.getElementById("reminderIntervalMinutes"),
  snooze10: document.getElementById("snooze10"),
  snooze30: document.getElementById("snooze30"),
  resetTimer: document.getElementById("resetTimer"),
  presets: document.querySelectorAll(".preset"),
}

await hydrate()
startPolling()

els.notificationsEnabled.addEventListener("change", async () => {
  await setSettings({ notificationsEnabled: els.notificationsEnabled.checked })
  await hydrate()
})

let intervalSaveTimer = null
els.reminderIntervalMinutes.addEventListener("input", () => {
  updatePresetHighlight()
  if (intervalSaveTimer) window.clearTimeout(intervalSaveTimer)
  intervalSaveTimer = window.setTimeout(async () => {
    const minutes = Number(els.reminderIntervalMinutes.value)
    await setSettings({ reminderIntervalMinutes: minutes })
    await hydrate()
  }, 250)
})

els.presets.forEach((btn) => {
  btn.addEventListener("click", async () => {
    const minutes = Number(btn.dataset.minutes)
    els.reminderIntervalMinutes.value = String(minutes)
    await setSettings({ reminderIntervalMinutes: minutes })
    await hydrate()
  })
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
  updatePresetHighlight()

  const activeMinutes =
    runtime.activeSinceMs != null ? msToRoundedMinutes(nowMs() - runtime.activeSinceMs) : null

  const isSnoozed =
    runtime.snoozedUntilMs != null && nowMs() < runtime.snoozedUntilMs

  els.statusBadge.className = "badge"
  if (!settings.notificationsEnabled) {
    els.statusBadge.textContent = "Paused"
    els.statusBadge.classList.add("badge--paused")
    els.statusMessage.textContent = "Reminders are off for now."
    els.statusMeta.textContent = "Turn them on when you’re ready for a gentle nudge."
  } else if (isSnoozed) {
    els.statusBadge.textContent = "Snoozed"
    els.statusBadge.classList.add("badge--snoozed")
    const until = new Date(runtime.snoozedUntilMs).toLocaleTimeString([], {
      hour: "numeric",
      minute: "2-digit",
    })
    els.statusMessage.textContent = `We’ll check back around ${until}.`
    els.statusMeta.textContent = "Take your time — no pressure."
  } else if (activeMinutes == null) {
    els.statusBadge.textContent = "Reminders on"
    els.statusMessage.textContent = "Move a little on any tab to start tracking."
    els.statusMeta.textContent = `Next reminder after ${settings.reminderIntervalMinutes} minutes of activity.`
  } else {
    els.statusBadge.textContent = "Reminders on"
    els.statusMessage.textContent = `You’ve been active for about ${activeMinutes} minute${activeMinutes === 1 ? "" : "s"}.`
    const remaining = Math.max(0, settings.reminderIntervalMinutes - activeMinutes)
    els.statusMeta.textContent =
      remaining > 0
        ? `Next gentle reminder in about ${remaining} minute${remaining === 1 ? "" : "s"}.`
        : "A reminder may appear soon."
  }

  if (runtime.lastNotificationError) {
    els.errorBanner.hidden = false
    els.errorText.textContent =
      "We couldn’t show a reminder just now. Try reloading the extension."
  } else {
    els.errorBanner.hidden = true
    els.errorText.textContent = ""
  }
}

function updatePresetHighlight() {
  const current = Number(els.reminderIntervalMinutes.value)
  els.presets.forEach((btn) => {
    const mins = Number(btn.dataset.minutes)
    btn.classList.toggle("preset--active", mins === current)
  })
}

function startPolling() {
  window.setInterval(() => {
    void hydrate()
  }, 2_000)
}
