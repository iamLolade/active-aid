import {
  getSettings,
  setSettings,
  getRuntimeState,
  setRuntimeState,
  addSessionLog,
  getSessionStats,
  getTodayCheckIn,
  saveCheckIn,
  getWellnessSummary,
} from "../shared/storage.js"
import { formatCountdown, minutesToMs, msToRoundedMinutes, nowMs } from "../shared/time.js"
import { runtimeSendMessage } from "../shared/chrome-api.js"
import { SESSIONS, getSessionById, getTotalDurationSeconds } from "../shared/sessions.js"
import { SEVERITIES, BODY_AREAS, getSeverityLabel } from "../shared/checkins.js"
import { severityIcon } from "./icons.js"

const els = {
  nav: document.getElementById("nav"),
  navBtns: document.querySelectorAll(".navBtn"),
  viewHome: document.getElementById("viewHome"),
  viewCheckIn: document.getElementById("viewCheckIn"),
  viewDashboard: document.getElementById("viewDashboard"),
  viewSession: document.getElementById("viewSession"),
  errorBanner: document.getElementById("errorBanner"),
  errorText: document.getElementById("errorText"),
  statusBadge: document.getElementById("statusBadge"),
  statusMessage: document.getElementById("statusMessage"),
  statusMeta: document.getElementById("statusMeta"),
  checkInHint: document.getElementById("checkInHint"),
  goCheckIn: document.getElementById("goCheckIn"),
  notificationsEnabled: document.getElementById("notificationsEnabled"),
  reminderIntervalMinutes: document.getElementById("reminderIntervalMinutes"),
  snooze10: document.getElementById("snooze10"),
  snooze30: document.getElementById("snooze30"),
  resetTimer: document.getElementById("resetTimer"),
  presets: document.querySelectorAll(".preset"),
  sessionList: document.getElementById("sessionList"),
  sessionStats: document.getElementById("sessionStats"),
  severityGroup: document.getElementById("severityGroup"),
  bodyAreaGroup: document.getElementById("bodyAreaGroup"),
  saveCheckIn: document.getElementById("saveCheckIn"),
  checkInSavedNote: document.getElementById("checkInSavedNote"),
  statGrid: document.getElementById("statGrid"),
  trendList: document.getElementById("trendList"),
  areasCard: document.getElementById("areasCard"),
  areaList: document.getElementById("areaList"),
  sessionBack: document.getElementById("sessionBack"),
  sessionTitle: document.getElementById("sessionTitle"),
  sessionTagline: document.getElementById("sessionTagline"),
  stepProgress: document.getElementById("stepProgress"),
  stepCountdown: document.getElementById("stepCountdown"),
  totalCountdown: document.getElementById("totalCountdown"),
  stepCard: document.getElementById("stepCard"),
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
  stepStartedAt: null,
  tickId: null,
}
const checkInForm = { severity: null, bodyAreas: new Set() }
let activeTab = "home"

await init()

async function init() {
  renderSessionList()
  renderCheckInForm()
  bindNav()
  bindReminders()
  bindSessionPlayer()
  bindCheckIn()
  await hydrate()
  startPolling()
}

function bindNav() {
  els.goCheckIn.addEventListener("click", () => setActiveTab("checkin"))
  els.navBtns.forEach((btn) => {
    btn.addEventListener("click", () => setActiveTab(btn.dataset.view))
  })
}

function setActiveTab(tab) {
  if (player.session) return
  activeTab = tab
  showMainView(tab)
  els.navBtns.forEach((btn) => {
    btn.classList.toggle("navBtn--active", btn.dataset.view === tab)
  })
  if (tab === "insights") void renderDashboard()
  if (tab === "checkin") void loadCheckInForm()
}

function showMainView(tab) {
  els.viewHome.hidden = tab !== "home"
  els.viewCheckIn.hidden = tab !== "checkin"
  els.viewDashboard.hidden = tab !== "insights"
  els.viewSession.hidden = true
  els.nav.hidden = false
}

function bindCheckIn() {
  els.saveCheckIn.addEventListener("click", () => void submitCheckIn())
}

function renderCheckInForm() {
  els.severityGroup.replaceChildren()
  for (const s of SEVERITIES) {
    const btn = document.createElement("button")
    btn.type = "button"
    btn.className = "severityOption"
    btn.dataset.severity = s.id
    btn.setAttribute("role", "radio")
    btn.setAttribute("aria-checked", "false")

    const iconWrap = document.createElement("span")
    iconWrap.className = "severityOptionIcon"
    iconWrap.innerHTML = severityIcon(s.id, 22)

    const label = document.createElement("span")
    label.className = "severityOptionLabel"
    label.textContent = s.label

    btn.append(iconWrap, label)
    btn.addEventListener("click", () => selectSeverity(s.id))
    els.severityGroup.append(btn)
  }

  els.bodyAreaGroup.replaceChildren()
  for (const a of BODY_AREAS) {
    const btn = document.createElement("button")
    btn.type = "button"
    btn.className = "chip"
    btn.dataset.area = a.id
    btn.textContent = a.label
    btn.addEventListener("click", () => toggleBodyArea(a.id))
    els.bodyAreaGroup.append(btn)
  }
}

function selectSeverity(id) {
  checkInForm.severity = id || null
  els.severityGroup.querySelectorAll(".severityOption").forEach((option) => {
    const selected = Boolean(id && option.dataset.severity === id)
    option.classList.toggle("severityOption--selected", selected)
    option.setAttribute("aria-checked", selected ? "true" : "false")
  })
}

function toggleBodyArea(id) {
  if (checkInForm.bodyAreas.has(id)) checkInForm.bodyAreas.delete(id)
  else checkInForm.bodyAreas.add(id)
  els.bodyAreaGroup.querySelectorAll(".chip").forEach((chip) => {
    chip.classList.toggle("chip--selected", checkInForm.bodyAreas.has(chip.dataset.area))
  })
}

async function loadCheckInForm() {
  const today = await getTodayCheckIn()
  if (!today) {
    checkInForm.severity = null
    checkInForm.bodyAreas = new Set()
    els.checkInSavedNote.hidden = true
    selectSeverity(null)
  } else {
    checkInForm.severity = today.severity
    checkInForm.bodyAreas = new Set(today.bodyAreas)
    els.checkInSavedNote.hidden = false
    els.checkInSavedNote.textContent = "Saved for today. You can update anytime."
    els.checkInSavedNote.style.color = "#3d6b42"
    selectSeverity(today.severity)
  }
  els.bodyAreaGroup.querySelectorAll(".chip").forEach((chip) => {
    chip.classList.toggle("chip--selected", checkInForm.bodyAreas.has(chip.dataset.area))
  })
}

async function submitCheckIn() {
  if (!checkInForm.severity) {
    els.checkInSavedNote.hidden = false
    els.checkInSavedNote.textContent = "Please choose how you feel overall."
    els.checkInSavedNote.style.color = "#7c3f32"
    return
  }

  await saveCheckIn({
    severity: checkInForm.severity,
    bodyAreas: [...checkInForm.bodyAreas],
  })

  els.checkInSavedNote.hidden = false
  els.checkInSavedNote.textContent = "Saved for today. You can update anytime."
  els.checkInSavedNote.style.color = "#3d6b42"
  await hydrate()
  if (activeTab === "insights") await renderDashboard()
}

async function renderDashboard() {
  const summary = await getWellnessSummary()

  els.statGrid.replaceChildren()
  const stats = [
    { value: String(summary.breaksToday), label: "Breaks taken today" },
    { value: `${summary.activeMinutesToday}m`, label: "Estimated active time" },
    { value: String(summary.checkInStreak), label: "Check-in streak (days)" },
    {
      value: summary.todayCheckIn ? getSeverityLabel(summary.todayCheckIn.severity) : "Not yet",
      label: "Today’s check-in",
    },
  ]

  for (const stat of stats) {
    const card = document.createElement("div")
    card.className = "statCard"
    card.innerHTML = `<p class="statValue">${stat.value}</p><p class="statLabel">${stat.label}</p>`
    els.statGrid.append(card)
  }

  els.trendList.replaceChildren()
  for (const day of summary.discomfortTrend) {
    const li = document.createElement("li")
    const label = day.severity ? day.label : "No check-in"
    li.innerHTML = `<span class="trendDate">${formatShortDate(day.date)}</span><span class="trendLabel">${label}</span>`
    els.trendList.append(li)
  }

  if (summary.topBodyAreas.length === 0) {
    els.areasCard.hidden = true
  } else {
    els.areasCard.hidden = false
    els.areaList.replaceChildren()
    for (const area of summary.topBodyAreas) {
      const li = document.createElement("li")
      li.innerHTML = `<span>${area.label}</span><span>${area.count}×</span>`
      els.areaList.append(li)
    }
  }
}

function formatShortDate(dateKey) {
  const [y, m, d] = dateKey.split("-").map(Number)
  const date = new Date(y, m - 1, d)
  return date.toLocaleDateString([], { weekday: "short", month: "short", day: "numeric" })
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
      await setSettings({ reminderIntervalMinutes: Number(els.reminderIntervalMinutes.value) })
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
  els.sessionStats.textContent =
    stats.todayCount === 0
      ? "No relief sessions yet today."
      : `${stats.todayCount} session${stats.todayCount === 1 ? "" : "s"} completed today. Nice work.`
}

function openSession(sessionId) {
  const session = getSessionById(sessionId)
  if (!session) return
  player.session = session
  player.stepIndex = 0
  player.startedAt = nowMs()
  player.stepStartedAt = nowMs()
  els.sessionTitle.textContent = session.title
  els.sessionTagline.textContent = session.tagline
  els.viewHome.hidden = true
  els.viewCheckIn.hidden = true
  els.viewDashboard.hidden = true
  els.viewSession.hidden = false
  els.nav.hidden = true
  renderStep()
  startSessionTicker()
}

function closeSession() {
  stopSessionTicker()
  player.session = null
  player.stepIndex = 0
  player.startedAt = null
  player.stepStartedAt = null
  setActiveTab(activeTab)
}

function goToStep(index) {
  if (!player.session) return
  player.stepIndex = Math.min(player.session.steps.length - 1, Math.max(0, index))
  player.stepStartedAt = nowMs()
  renderStep()
}

function renderStep() {
  const session = player.session
  if (!session) return
  const step = session.steps[player.stepIndex]
  const isLast = player.stepIndex === session.steps.length - 1
  els.stepProgress.textContent = `Step ${player.stepIndex + 1} of ${session.steps.length}`
  els.stepTitle.textContent = step.title
  els.stepInstruction.textContent = step.instruction
  els.stepDuration.textContent = `Move gently. Stop if it hurts.`
  els.stepPrev.disabled = player.stepIndex === 0
  els.stepNext.hidden = isLast
  els.stepComplete.hidden = !isLast
  els.stepNext.classList.remove("btn--pulse")
  els.stepComplete.classList.remove("btn--pulse")

  els.stepCard.classList.remove("stepCard--enter")
  // retrigger animation
  void els.stepCard.offsetWidth
  els.stepCard.classList.add("stepCard--enter")
  updateCountdownUI()
}

async function completeSession() {
  const session = player.session
  if (!session || player.startedAt == null) return
  await addSessionLog({
    sessionId: session.id,
    completedAt: nowMs(),
    durationSeconds:
      Math.round((nowMs() - player.startedAt) / 1000) || getTotalDurationSeconds(session),
  })
  closeSession()
  activeTab = "home"
  setActiveTab("home")
  await hydrate()
  els.statusBadge.className = "badge"
  els.statusBadge.textContent = "Session done"
  els.statusMessage.textContent = `${session.title} complete.`
  els.statusMeta.textContent = "Small resets add up. Your body will thank you."
}

function startSessionTicker() {
  stopSessionTicker()
  player.tickId = window.setInterval(() => {
    updateCountdownUI()
  }, 250)
}

function stopSessionTicker() {
  if (player.tickId != null) {
    window.clearInterval(player.tickId)
    player.tickId = null
  }
}

function updateCountdownUI() {
  const session = player.session
  if (!session) return
  const step = session.steps[player.stepIndex]
  const stepStart = player.stepStartedAt ?? nowMs()

  const stepElapsed = (nowMs() - stepStart) / 1000
  const stepRemaining = Math.max(0, step.durationSeconds - stepElapsed)
  els.stepCountdown.textContent = `Step: ${formatCountdown(stepRemaining)}`

  const remainingStepsSeconds = session.steps
    .slice(player.stepIndex + 1)
    .reduce((sum, s) => sum + s.durationSeconds, 0)
  const totalRemaining = stepRemaining + remainingStepsSeconds
  els.totalCountdown.textContent = `Total remaining: ${formatCountdown(totalRemaining)}`

  const isStepDone = stepRemaining <= 0.25
  if (!isStepDone) return

  const isLast = player.stepIndex === session.steps.length - 1
  if (isLast) els.stepComplete.classList.add("btn--pulse")
  else els.stepNext.classList.add("btn--pulse")
}

async function snoozeForMinutes(minutes) {
  await setRuntimeState({ snoozedUntilMs: nowMs() + minutesToMs(minutes) })
  await hydrate()
}

async function hydrate() {
  const [settings, runtime, todayCheckIn] = await Promise.all([
    getSettings(),
    getRuntimeState(),
    getTodayCheckIn(),
  ])

  if (player.session) return

  await renderSessionStats()

  if (todayCheckIn) {
    els.checkInHint.textContent = `Today · ${getSeverityLabel(todayCheckIn.severity)}`
    els.goCheckIn.textContent = "Update"
  } else {
    els.checkInHint.textContent = "Log how your body feels today."
    els.goCheckIn.textContent = "Check in"
  }

  els.notificationsEnabled.checked = settings.notificationsEnabled
  els.reminderIntervalMinutes.value = String(settings.reminderIntervalMinutes)
  updatePresetHighlight()

  const activeMinutes =
    runtime.activeSinceMs != null ? msToRoundedMinutes(nowMs() - runtime.activeSinceMs) : null
  const isSnoozed = runtime.snoozedUntilMs != null && nowMs() < runtime.snoozedUntilMs

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
    els.statusMeta.textContent = "Take your time. No pressure."
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

  if (activeTab === "insights") await renderDashboard()
}

function updatePresetHighlight() {
  const current = Number(els.reminderIntervalMinutes.value)
  els.presets.forEach((btn) => {
    btn.classList.toggle("preset--active", Number(btn.dataset.minutes) === current)
  })
}

function startPolling() {
  window.setInterval(() => void hydrate(), 2_000)
}
