import {
  getSettings,
  setSettings,
  getRuntimeState,
  setRuntimeState,
  addSessionLog,
  getTodayCheckIn,
  saveCheckIn,
  getWellnessSummary,
} from "../shared/storage.js"
import { formatCountdown, minutesToMs, msToRoundedMinutes, nowMs } from "../shared/time.js"
import { runtimeSendMessage } from "../shared/chrome-api.js"
import { SESSIONS, getSessionById, getTotalDurationSeconds } from "../shared/sessions.js"
import {
  SEVERITIES,
  BODY_AREAS,
  getSeverityLabel,
  getSeverityShortLabel,
} from "../shared/checkins.js"
import {
  bodyAreaIcon,
  iconActivity,
  iconBarChart,
  iconBell,
  iconCalendar,
  iconChevronLeft,
  iconChevronRight,
  iconClock,
  iconHeart,
  iconMoreVertical,
  iconPlay,
  iconSettings,
  sessionIcon,
  severityIcon,
} from "./icons.js"

const NAV_TAB_ICONS = {
  home: iconCalendar,
  checkin: iconHeart,
  insights: iconBarChart,
}

/** Featured on Today tab per hero-popup.png */
const HOME_QUICK_RELIEF_IDS = ["neck", "wrist", "lower-back"]

let showAllQuickRelief = false

const els = {
  nav: document.getElementById("nav"),
  navBtns: document.querySelectorAll(".navBtn"),
  viewHome: document.getElementById("viewHome"),
  viewCheckIn: document.getElementById("viewCheckIn"),
  viewDashboard: document.getElementById("viewDashboard"),
  viewSession: document.getElementById("viewSession"),
  errorBanner: document.getElementById("errorBanner"),
  errorText: document.getElementById("errorText"),
  openSettings: document.getElementById("openSettings"),
  openSettingsIcon: document.getElementById("openSettingsIcon"),
  remindersDetails: document.getElementById("remindersDetails"),
  activeValue: document.getElementById("activeValue"),
  heroMeta: document.getElementById("heroMeta"),
  statusPill: document.getElementById("statusPill"),
  statusPillText: document.getElementById("statusPillText"),
  reminderProgress: document.getElementById("reminderProgress"),
  checkInHint: document.getElementById("checkInHint"),
  checkInCtaText: document.getElementById("checkInCtaText"),
  goCheckIn: document.getElementById("goCheckIn"),
  notificationsEnabled: document.getElementById("notificationsEnabled"),
  reminderIntervalMinutes: document.getElementById("reminderIntervalMinutes"),
  snooze10: document.getElementById("snooze10"),
  snooze30: document.getElementById("snooze30"),
  resetTimer: document.getElementById("resetTimer"),
  presets: document.querySelectorAll(".preset"),
  sessionList: document.getElementById("sessionList"),
  severityGroup: document.getElementById("severityGroup"),
  bodyAreaGroup: document.getElementById("bodyAreaGroup"),
  saveCheckIn: document.getElementById("saveCheckIn"),
  checkInSavedNote: document.getElementById("checkInSavedNote"),
  statGrid: document.getElementById("statGrid"),
  trendList: document.getElementById("trendList"),
  areasCard: document.getElementById("areasCard"),
  areasEmpty: document.getElementById("areasEmpty"),
  areaList: document.getElementById("areaList"),
  sessionBack: document.getElementById("sessionBack"),
  sessionTitle: document.getElementById("sessionTitle"),
  sessionTagline: document.getElementById("sessionTagline"),
  stepProgress: document.getElementById("stepProgress"),
  stepCountdown: document.getElementById("stepCountdown"),
  totalCountdown: document.getElementById("totalCountdown"),
  stepCard: document.getElementById("stepCard"),
  stepSegments: document.getElementById("stepSegments"),
  stepIllustration: document.getElementById("stepIllustration"),
  sessionPlayerIcon: document.getElementById("sessionPlayerIcon"),
  stepTitle: document.getElementById("stepTitle"),
  stepInstruction: document.getElementById("stepInstruction"),
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
  renderNavIcons()
  renderCheckInHeaderIcon()
  renderInsightsHeaderIcon()
  renderHeaderChrome()
  renderHomeHeroChrome()
  renderHomeCheckInRowChrome()
  renderQuickReliefChrome()
  renderSessionPlayerChrome()
  renderSessionList()
  renderCheckInForm()
  bindNav()
  bindSettings()
  bindReminders()
  bindSessionPlayer()
  bindCheckIn()
  await hydrate()
  startPolling()
}

function renderNavIcons() {
  els.navBtns.forEach((btn) => {
    const render = NAV_TAB_ICONS[btn.dataset.view]
    const slot = btn.querySelector(".navBtnIcon")
    if (render && slot) slot.innerHTML = render(18)
  })
}

function renderCheckInHeaderIcon() {
  const slot = document.getElementById("checkInHeaderIcon")
  if (slot) slot.innerHTML = iconHeart(22)
}

function renderInsightsHeaderIcon() {
  const slot = document.getElementById("insightsHeaderIcon")
  if (slot) slot.innerHTML = iconBarChart(22)
}

function renderHeaderChrome() {
  if (els.openSettingsIcon) els.openSettingsIcon.innerHTML = iconSettings(18)
  const moreIcon = document.getElementById("openMoreIcon")
  if (moreIcon) moreIcon.innerHTML = iconMoreVertical(18)
}

function renderHomeHeroChrome() {
  const heroIcon = document.getElementById("heroIcon")
  const pillIcon = document.getElementById("statusPillIcon")
  if (heroIcon) heroIcon.innerHTML = iconClock(22)
  if (pillIcon) pillIcon.innerHTML = iconBell(16)
}

function renderHomeCheckInRowChrome() {
  const rowIcon = document.getElementById("homeCheckInIcon")
  const chevron = document.querySelector("#goCheckIn .pillBtnIcon")
  if (rowIcon) rowIcon.innerHTML = iconHeart(22)
  if (chevron) chevron.innerHTML = iconChevronRight(16)
}

function renderQuickReliefChrome() {
  const chevron = document.querySelector("#scrollQuickRelief .textBtnIcon")
  if (chevron) chevron.innerHTML = iconChevronRight(14)
  updateQuickReliefToggleLabel()
}

function renderSessionPlayerChrome() {
  const back = document.getElementById("sessionBackIcon")
  const stepTimer = document.getElementById("stepTimerIcon")
  const totalIcon = document.getElementById("totalRemainingIcon")
  const prevIcon = document.getElementById("stepPrevIcon")
  const nextIcon = document.getElementById("stepNextIcon")
  const completeIcon = document.getElementById("stepCompleteIcon")
  if (back) back.innerHTML = iconChevronLeft(16)
  if (stepTimer) stepTimer.innerHTML = iconClock(14)
  if (totalIcon) totalIcon.innerHTML = iconClock(14)
  if (prevIcon) prevIcon.innerHTML = iconChevronLeft(16)
  if (nextIcon) nextIcon.innerHTML = iconChevronRight(16)
  if (completeIcon) completeIcon.innerHTML = iconChevronRight(16)
}

function renderSessionPlayerIcon(sessionId) {
  if (els.sessionPlayerIcon) els.sessionPlayerIcon.innerHTML = sessionIcon(sessionId, 24)
}

function renderStepSegments() {
  const session = player.session
  if (!session || !els.stepSegments) return
  const total = session.steps.length
  const current = player.stepIndex + 1
  els.stepSegments.replaceChildren()
  els.stepSegments.setAttribute("aria-valuemin", "1")
  els.stepSegments.setAttribute("aria-valuemax", String(total))
  els.stepSegments.setAttribute("aria-valuenow", String(current))
  session.steps.forEach((_, index) => {
    const seg = document.createElement("span")
    seg.className = `stepSegment${index <= player.stepIndex ? " stepSegment--active" : ""}`
    els.stepSegments.append(seg)
  })
}

function updateQuickReliefToggleLabel() {
  const label = document.getElementById("quickReliefToggleLabel")
  if (label) label.textContent = showAllQuickRelief ? "Show less" : "View all"
}

function formatActiveMinutes(totalMinutes) {
  const minutes = Math.max(0, Math.round(totalMinutes))
  if (minutes < 60) return `${minutes}m`
  const hours = Math.floor(minutes / 60)
  const remaining = minutes % 60
  return remaining === 0 ? `${hours}h` : `${hours}h ${remaining}m`
}

function updateHeroStatus({ settings, runtime, activeMinutes, isSnoozed }) {
  els.statusPill?.classList.remove("statusPill--muted", "statusPill--warm")
  let progressRatio = 0

  if (els.activeValue) {
    els.activeValue.textContent =
      activeMinutes == null ? "—" : formatActiveMinutes(activeMinutes)
  }

  if (!settings.notificationsEnabled) {
    els.statusPill?.classList.add("statusPill--muted")
    if (els.statusPillText) els.statusPillText.textContent = "Reminders off"
    if (els.heroMeta) {
      els.heroMeta.textContent = "Turn them on when you're ready for a gentle nudge."
    }
  } else if (isSnoozed) {
    els.statusPill?.classList.add("statusPill--warm")
    if (els.statusPillText) els.statusPillText.textContent = "Snoozed"
    const until = new Date(runtime.snoozedUntilMs).toLocaleTimeString([], {
      hour: "numeric",
      minute: "2-digit",
    })
    if (els.heroMeta) els.heroMeta.textContent = `We'll check back around ${until}.`
  } else if (activeMinutes == null) {
    if (els.statusPillText) els.statusPillText.textContent = "Reminders on"
    if (els.heroMeta) {
      els.heroMeta.textContent = `Next gentle reminder after ${settings.reminderIntervalMinutes} min of activity.`
    }
  } else {
    if (els.statusPillText) els.statusPillText.textContent = "Reminders on"
    const remaining = Math.max(0, settings.reminderIntervalMinutes - activeMinutes)
    progressRatio =
      settings.reminderIntervalMinutes > 0
        ? Math.min(1, activeMinutes / settings.reminderIntervalMinutes)
        : 0
    if (els.heroMeta) {
      els.heroMeta.textContent =
        remaining > 0
          ? `Next gentle reminder in ${remaining} min`
          : "A reminder may appear soon."
    }
  }

  if (els.reminderProgress) {
    els.reminderProgress.style.width = `${Math.round(progressRatio * 100)}%`
  }
}

function bindSettings() {
  els.openSettings?.addEventListener("click", () => {
    if (!els.remindersDetails) return
    els.remindersDetails.open = true
    els.remindersDetails.scrollIntoView({ block: "start", behavior: "smooth" })
    els.remindersDetails.querySelector("summary")?.focus()
  })
}

function bindNav() {
  els.goCheckIn.addEventListener("click", () => setActiveTab("checkin"))
  document.getElementById("scrollQuickRelief")?.addEventListener("click", () => {
    showAllQuickRelief = !showAllQuickRelief
    renderSessionList()
    updateQuickReliefToggleLabel()
    if (showAllQuickRelief) {
      els.sessionList?.lastElementChild?.scrollIntoView({ block: "nearest", behavior: "smooth" })
    }
  })
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
    iconWrap.innerHTML = severityIcon(s.id, 24)

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
    btn.className = "bodyAreaChip"
    btn.dataset.area = a.id
    btn.setAttribute("aria-pressed", "false")

    const iconWrap = document.createElement("span")
    iconWrap.className = "bodyAreaChipIcon"
    iconWrap.innerHTML = bodyAreaIcon(a.id, 20)

    const label = document.createElement("span")
    label.className = "bodyAreaChipLabel"
    label.textContent = a.label

    btn.append(iconWrap, label)
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
  syncBodyAreaSelection()
}

function syncBodyAreaSelection() {
  els.bodyAreaGroup.querySelectorAll(".bodyAreaChip").forEach((chip) => {
    const selected = checkInForm.bodyAreas.has(chip.dataset.area)
    chip.classList.toggle("bodyAreaChip--selected", selected)
    chip.setAttribute("aria-pressed", selected ? "true" : "false")
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
  syncBodyAreaSelection()
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

/**
 * @param {{ value: string, label: string, iconHtml: string }} stat
 */
function appendStatCard(stat) {
  const card = document.createElement("div")
  card.className = "statCard"
  card.setAttribute("role", "listitem")
  card.setAttribute("aria-label", `${stat.label}: ${stat.value}`)

  const icon = document.createElement("span")
  icon.className = "insightsIconTile statCardIcon"
  icon.setAttribute("aria-hidden", "true")
  icon.innerHTML = stat.iconHtml

  const body = document.createElement("div")
  body.className = "statCardBody"

  const value = document.createElement("p")
  value.className = "statValue"
  value.textContent = stat.value

  const label = document.createElement("p")
  label.className = "statLabel"
  label.textContent = stat.label

  body.append(value, label)
  card.append(icon, body)
  els.statGrid.append(card)
}

/**
 * @param {{ id: string, label: string, count: number }} area
 */
function appendAreaRow(area) {
  const li = document.createElement("li")
  li.className = "areaRow insightsRow"
  li.setAttribute("aria-label", `${area.label}, noted ${area.count} times`)

  const left = document.createElement("div")
  left.className = "areaRowLeft"

  const icon = document.createElement("span")
  icon.className = "insightsIconTile areaRowIcon"
  icon.setAttribute("aria-hidden", "true")
  icon.innerHTML = bodyAreaIcon(area.id, 18)

  const label = document.createElement("span")
  label.className = "areaRowLabel"
  label.textContent = area.label

  left.append(icon, label)

  const count = document.createElement("span")
  count.className = "areaRowCount"
  count.textContent = `${area.count}×`

  li.append(left, count)
  els.areaList.append(li)
}

function severityIndex(severityId) {
  if (severityId === "great") return 0
  if (severityId === "slight") return 1
  if (severityId === "moderate") return 2
  if (severityId === "severe") return 3
  return null
}

function severityTone(severityId) {
  if (severityId === "great") return "good"
  if (severityId === "slight") return "ok"
  if (severityId === "moderate") return "warn"
  if (severityId === "severe") return "bad"
  return "none"
}

async function renderDashboard() {
  const summary = await getWellnessSummary()

  els.statGrid.replaceChildren()
  appendStatCard({
    value: String(summary.breaksToday),
    label: "Breaks taken today",
    iconHtml: iconPlay(20),
  })
  appendStatCard({
    value: `${summary.breakMinutesToday}m`,
    label: "Relief minutes today",
    iconHtml: iconClock(20),
  })
  appendStatCard({
    value: String(summary.sessionsLast7Days),
    label: "Relief sessions (7 days)",
    iconHtml: iconBarChart(20),
  })
  appendStatCard({
    value: `${summary.activeMinutesToday}m`,
    label: "Estimated active time",
    iconHtml: iconActivity(20),
  })
  appendStatCard({
    value: String(summary.checkInStreak),
    label: "Check-in streak (days)",
    iconHtml: iconCalendar(20),
  })
  appendStatCard({
    value: summary.todayCheckIn
      ? getSeverityShortLabel(summary.todayCheckIn.severity)
      : "Not yet",
    label: "Today’s check-in",
    iconHtml: summary.todayCheckIn
      ? severityIcon(summary.todayCheckIn.severity, 20)
      : iconHeart(20),
  })

  els.trendList.replaceChildren()
  for (const day of summary.discomfortTrend) {
    const mood = day.severity ? day.label : "Not logged"
    const li = document.createElement("li")
    li.className = "trendRow insightsRow"
    li.setAttribute("aria-label", `${formatShortDate(day.date)}: ${mood}`)

    const left = document.createElement("div")
    left.className = "trendLeft"

    const date = document.createElement("span")
    date.className = "trendDate"
    date.textContent = formatShortDate(day.date)

    const viz = document.createElement("span")
    viz.className = `trendViz trendViz--${severityTone(day.severity)}`
    viz.setAttribute("aria-hidden", "true")

    const idx = severityIndex(day.severity)
    for (let i = 0; i < 4; i++) {
      const seg = document.createElement("span")
      seg.className = `trendSeg${idx === i ? " trendSeg--active" : ""}`
      viz.append(seg)
    }

    left.append(date, viz)

    const pill = document.createElement("span")
    pill.className = `trendPill trendPill--${severityTone(day.severity)}`
    pill.textContent = mood

    li.append(left, pill)
    els.trendList.append(li)
  }

  els.areaList.replaceChildren()
  if (summary.topBodyAreas.length === 0) {
    els.areasEmpty.hidden = false
    els.areaList.hidden = true
  } else {
    els.areasEmpty.hidden = true
    els.areaList.hidden = false
    for (const area of summary.topBodyAreas) {
      appendAreaRow(area)
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
  const sessions = showAllQuickRelief
    ? SESSIONS
    : SESSIONS.filter((session) => HOME_QUICK_RELIEF_IDS.includes(session.id))
  for (const session of sessions) {
    const btn = document.createElement("button")
    btn.type = "button"
    btn.className = "sessionRow"

    const left = document.createElement("div")
    left.className = "sessionRowLeft"

    const icon = document.createElement("span")
    icon.className = "sessionIcon"
    icon.setAttribute("aria-hidden", "true")
    icon.innerHTML = sessionIcon(session.id, 22)

    const text = document.createElement("div")
    text.className = "sessionRowText"

    const title = document.createElement("p")
    title.className = "sessionRowTitle"
    title.textContent = session.title

    const meta = document.createElement("p")
    meta.className = "sessionRowMeta"
    meta.textContent = session.tagline

    text.append(title, meta)
    left.append(icon, text)

    const right = document.createElement("div")
    right.className = "sessionRowRight"

    const duration = document.createElement("span")
    duration.className = "durationPill"
    duration.textContent = `${session.durationMinutes} min`

    const play = document.createElement("span")
    play.className = "playCircle"
    play.setAttribute("aria-hidden", "true")
    play.innerHTML = iconPlay(14)

    right.append(duration, play)
    btn.append(left, right)
    btn.addEventListener("click", () => openSession(session.id))
    els.sessionList.append(btn)
  }
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
  renderSessionPlayerIcon(session.id)
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
  if (els.stepIllustration) els.stepIllustration.innerHTML = sessionIcon(session.id, 24)
  renderStepSegments()
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
  els.statusPill?.classList.remove("statusPill--muted", "statusPill--warm")
  if (els.statusPillText) els.statusPillText.textContent = "Session done"
  if (els.heroMeta) {
    els.heroMeta.textContent = `${session.title} complete. Small resets add up.`
  }
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
  els.stepCountdown.textContent = formatCountdown(stepRemaining)

  const remainingStepsSeconds = session.steps
    .slice(player.stepIndex + 1)
    .reduce((sum, s) => sum + s.durationSeconds, 0)
  const totalRemaining = stepRemaining + remainingStepsSeconds
  els.totalCountdown.textContent = formatCountdown(totalRemaining)

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

  if (todayCheckIn) {
    els.checkInHint.textContent = `Today · ${getSeverityLabel(todayCheckIn.severity)}`
    if (els.checkInCtaText) els.checkInCtaText.textContent = "Update"
  } else {
    els.checkInHint.textContent = "Log how your body feels today."
    if (els.checkInCtaText) els.checkInCtaText.textContent = "Check in"
  }

  els.notificationsEnabled.checked = settings.notificationsEnabled
  els.reminderIntervalMinutes.value = String(settings.reminderIntervalMinutes)
  updatePresetHighlight()

  const activeMinutes =
    runtime.activeSinceMs != null ? msToRoundedMinutes(nowMs() - runtime.activeSinceMs) : null
  const isSnoozed = runtime.snoozedUntilMs != null && nowMs() < runtime.snoozedUntilMs

  updateHeroStatus({ settings, runtime, activeMinutes, isSnoozed })

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
