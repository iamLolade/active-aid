import { getSettings, setSettings, getRuntimeState, setRuntimeState, addSessionLog, getSessionStats } from "../shared/storage.js"
import { minutesToMs, msToRoundedMinutes, nowMs } from "../shared/time.js"
import { runtimeSendMessage } from "../shared/chrome-api.js"
import { SESSIONS, getSessionById, getTotalDurationSeconds } from "../shared/sessions.js"

const els = {
  viewHome: document.getElementById("viewHome"),
  viewSession: document.getElementById("viewSession"),
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
  sessionList: document.getElementById("sessionList"),
  sessionStats: document.getElementById("sessionStats"),
  sessionBack: document.getElementById("sessionBack"),
  sessionTitle: document.getElementById("sessionTitle"),
  sessionTagline: document.getElementById("sessionTagline"),
  stepProgress: document.getElementById("stepProgress"),
  stepTitle: document.getElementById("stepTitle"),
  stepInstruction: document.getElementById("stepInstruction"),
  stepDuration: document.getElementById("stepDuration"),
  stepPrev: document.getElementById("stepPrev"),
  stepNext: document.getElementById("stepNext"),
  stepComplete: document.getElementById("stepComplete"),
}

const player = {
  session: null,
  stepIndex: 0,
  startedAt: null,
}

await init()

async function init() {
  renderSessionList()
  bindReminders()
  bindSessionPlayer()
  await hydrate()
  startPolling()
}

function bindReminders() {
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
}

function bindSessionPlayer() {
  els.sessionBack.addEventListener("click", () => closeSession())
  els.stepPrev.addEventListener("click", () => goToStep(player.stepIndex - 1))
  els.stepNext.addEventListener("click", () => goToStep(player.stepIndex + 1))
  els.stepComplete.addEventListener("click", () => void completeSession())
}

function renderSessionList() {
  els.sessionList.replaceChildren()

  for (const session of SESSIONS) {
    const btn = document.createElement("button")
    btn.type = "button"
    btn.className = "sessionBtn"
    btn.dataset.sessionId = session.id

    const title = document.createElement("span")
    title.className = "sessionBtnTitle"
    title.textContent = session.title

    const meta = document.createElement("span")
    meta.className = "sessionBtnMeta"
    meta.textContent = `${session.durationMinutes} min · ${session.tagline}`

    btn.append(title, meta)
    btn.addEventListener("click", () => openSession(session.id))
    els.sessionList.append(btn)
  }
}

async function renderSessionStats() {
  const stats = await getSessionStats()
  if (stats.todayCount === 0) {
    els.sessionStats.textContent = "No relief sessions yet today."
    return
  }

  const label = stats.todayCount === 1 ? "session" : "sessions"
  els.sessionStats.textContent = `${stats.todayCount} ${label} completed today. Nice work.`
}

function showView(view) {
  els.viewHome.hidden = view !== "home"
  els.viewSession.hidden = view !== "session"
}

function openSession(sessionId) {
  const session = getSessionById(sessionId)
  if (!session) return

  player.session = session
  player.stepIndex = 0
  player.startedAt = nowMs()

  els.sessionTitle.textContent = session.title
  els.sessionTagline.textContent = session.tagline

  showView("session")
  renderStep()
}

function closeSession() {
  player.session = null
  player.stepIndex = 0
  player.startedAt = null
  showView("home")
}

function goToStep(index) {
  if (!player.session) return
  const max = player.session.steps.length - 1
  player.stepIndex = Math.min(max, Math.max(0, index))
  renderStep()
}

function renderStep() {
  const session = player.session
  if (!session) return

  const step = session.steps[player.stepIndex]
  const total = session.steps.length
  const isLast = player.stepIndex === total - 1

  els.stepProgress.textContent = `Step ${player.stepIndex + 1} of ${total}`
  els.stepTitle.textContent = step.title
  els.stepInstruction.textContent = step.instruction
  els.stepDuration.textContent = `About ${step.durationSeconds} seconds`

  els.stepPrev.disabled = player.stepIndex === 0
  els.stepNext.hidden = isLast
  els.stepComplete.hidden = !isLast
}

async function completeSession() {
  const session = player.session
  if (!session || player.startedAt == null) return

  const durationSeconds = Math.round((nowMs() - player.startedAt) / 1000)
  await addSessionLog({
    sessionId: session.id,
    completedAt: nowMs(),
    durationSeconds: durationSeconds || getTotalDurationSeconds(session),
  })

  closeSession()
  await hydrate()

  els.statusBadge.className = "badge"
  els.statusBadge.textContent = "Session done"
  els.statusMessage.textContent = `${session.title} complete.`
  els.statusMeta.textContent = "Small resets add up — your body will thank you."
}

async function snoozeForMinutes(minutes) {
  const until = nowMs() + minutesToMs(minutes)
  await setRuntimeState({ snoozedUntilMs: until })
  await hydrate()
}

async function hydrate() {
  const [settings, runtime] = await Promise.all([getSettings(), getRuntimeState()])
  await renderSessionStats()

  if (player.session) return

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
