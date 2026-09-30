import {
  getSettings,
  setSettings,
  getRuntimeState,
  setRuntimeState,
  addSessionLog,
  getTodayCheckIn,
  saveCheckIn,
  getSessionStats,
  getWellnessSummary,
  isOnboardingComplete,
  completeOnboarding,
  exportAllData,
  clearAllData,
  consumeQuickReliefIntent,
} from "../shared/storage.js"
import {
  isSyncConfigured,
  getSyncState,
  signUp,
  signIn,
  signOut,
  setSyncEnabled,
  syncNow,
  deleteCloudData,
  scheduleSyncIfEnabled,
  setSyncError,
} from "../shared/sync.js"
import { formatCountdown, minutesToMs, msToRoundedMinutes, nowMs } from "../shared/time.js"
import { isActivityRecent } from "../shared/activity.js"
import { runtimeSendMessage } from "../shared/browser-api.js"
import {
  SESSIONS,
  getSessionById,
  getSessionTimerAction,
  getTotalDurationSeconds,
} from "../shared/sessions.js"
import {
  SEVERITIES,
  BODY_AREAS,
  getSeverityLabel,
  getSeverityShortLabel,
  todayDateKey,
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
  iconPlay,
  iconSettings,
  sessionIcon,
  severityIcon,
} from "./icons.js"
import { createConfirmationDialog } from "./confirmation-dialog.js"

const NAV_TAB_ICONS = {
  home: iconCalendar,
  checkin: iconHeart,
  insights: iconBarChart,
  settings: iconSettings,
}

const HOME_QUICK_RELIEF_IDS = ["neck", "wrist", "lower-back"]

let showAllQuickRelief = false

const els = {
  nav: document.getElementById("nav"),
  navBtns: document.querySelectorAll(".navBtn"),
  viewHome: document.getElementById("viewHome"),
  viewOnboarding: document.getElementById("viewOnboarding"),
  onboardingReminders: document.getElementById("onboardingReminders"),
  onboardingComplete: document.getElementById("onboardingComplete"),
  viewCheckIn: document.getElementById("viewCheckIn"),
  viewDashboard: document.getElementById("viewDashboard"),
  viewSession: document.getElementById("viewSession"),
  viewSettings: document.getElementById("viewSettings"),
  errorBanner: document.getElementById("errorBanner"),
  errorText: document.getElementById("errorText"),
  errorDismiss: document.getElementById("errorDismiss"),
  confirmDialog: document.getElementById("confirmDialog"),
  settingsViewHeaderIcon: document.getElementById("settingsViewHeaderIcon"),
  activeValue: document.getElementById("activeValue"),
  heroMeta: document.getElementById("heroMeta"),
  heroSessionMeta: document.getElementById("heroSessionMeta"),
  statusPill: document.getElementById("statusPill"),
  statusPillText: document.getElementById("statusPillText"),
  reminderProgress: document.getElementById("reminderProgress"),
  checkInHint: document.getElementById("checkInHint"),
  checkInCtaText: document.getElementById("checkInCtaText"),
  goCheckIn: document.getElementById("goCheckIn"),
  notificationsEnabled: document.getElementById("notificationsEnabled"),
  reminderTimingSummary: document.getElementById("reminderTimingSummary"),
  reminderStatus: document.getElementById("reminderStatus"),
  reminderIntervalMinutes: document.getElementById("reminderIntervalMinutes"),
  snooze10: document.getElementById("snooze10"),
  snooze30: document.getElementById("snooze30"),
  resetTimer: document.getElementById("resetTimer"),
  exportData: document.getElementById("exportData"),
  clearData: document.getElementById("clearData"),
  dataStatus: document.getElementById("dataStatus"),
  syncSection: document.getElementById("syncSection"),
  syncSummaryHint: document.getElementById("syncSummaryHint"),
  syncHint: document.getElementById("syncHint"),
  syncStatus: document.getElementById("syncStatus"),
  syncSignedOut: document.getElementById("syncSignedOut"),
  syncSignedIn: document.getElementById("syncSignedIn"),
  syncEmail: document.getElementById("syncEmail"),
  syncPassword: document.getElementById("syncPassword"),
  syncPasswordHint: document.getElementById("syncPasswordHint"),
  syncPasswordToggle: document.getElementById("syncPasswordToggle"),
  syncConfirmField: document.getElementById("syncConfirmField"),
  syncConfirmPassword: document.getElementById("syncConfirmPassword"),
  syncConfirmPasswordToggle: document.getElementById("syncConfirmPasswordToggle"),
  syncAuthHint: document.getElementById("syncAuthHint"),
  syncAuthSubmit: document.getElementById("syncAuthSubmit"),
  syncModeCreate: document.getElementById("syncModeCreate"),
  syncModeSignIn: document.getElementById("syncModeSignIn"),
  syncEnabled: document.getElementById("syncEnabled"),
  syncNow: document.getElementById("syncNow"),
  syncDeleteCloudData: document.getElementById("syncDeleteCloudData"),
  syncSignOut: document.getElementById("syncSignOut"),
  syncAccount: document.getElementById("syncAccount"),
  presets: document.querySelectorAll(".preset"),
  sessionList: document.getElementById("sessionList"),
  quickReliefSection: document.getElementById("quickReliefSection"),
  sessionStats: document.getElementById("sessionStats"),
  severityGroup: document.getElementById("severityGroup"),
  bodyAreaGroup: document.getElementById("bodyAreaGroup"),
  saveCheckIn: document.getElementById("saveCheckIn"),
  checkInFooter: document.getElementById("checkInFooter"),
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
  stepAutoAdvanceNote: document.getElementById("stepAutoAdvanceNote"),
  stepPrev: document.getElementById("stepPrev"),
  stepNext: document.getElementById("stepNext"),
  stepComplete: document.getElementById("stepComplete"),
  stepCompleteLabel: document.getElementById("stepCompleteLabel"),
}

const confirmAction = createConfirmationDialog(els.confirmDialog)

const player = {
  session: null,
  stepIndex: 0,
  startedAt: null,
  stepStartedAt: null,
  tickId: null,
  isCompleting: false,
  isCompleted: false,
  returnFocus: null,
}
const checkInForm = { severity: null, bodyAreas: new Set() }
let activeTab = "home"
let previousActiveTab = "home"
let pollIntervalId = null
let uiErrorMessage = ""
let syncAuthMode = "create"

const isWindowSurface =
  new URLSearchParams(window.location.search).get("surface") === "window"
document.documentElement.classList.toggle("windowSurface", isWindowSurface)

await init()

async function init() {
  renderNavIcons()
  renderCheckInHeaderIcon()
  renderInsightsHeaderIcon()
  renderSettingsViewHeaderIcon()
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
  bindOnboarding()
  bindExport()
  bindClear()
  bindSync()
  bindErrorBanner()

  if (!(await isOnboardingComplete())) {
    renderOnboardingChrome()
    showOnboarding()
    return
  }

  await hydrate()
  await handleQuickReliefIntent()
  startPolling()
}

function bindErrorBanner() {
  els.errorDismiss?.addEventListener("click", () => {
    uiErrorMessage = ""
    renderErrorBanner("")
  })
}

function renderErrorBanner(message) {
  if (!els.errorBanner || !els.errorText) return
  els.errorBanner.hidden = !message
  els.errorText.textContent = message
}

function showUiError(message) {
  uiErrorMessage = message
  renderErrorBanner(message)
}

async function runButtonAction(button, pendingLabel, action) {
  if (!button || button.disabled) return undefined

  const originalHtml = button.innerHTML
  button.disabled = true
  button.setAttribute("aria-busy", "true")
  button.textContent = pendingLabel

  try {
    return await action()
  } finally {
    button.innerHTML = originalHtml
    button.disabled = false
    button.removeAttribute("aria-busy")
  }
}

function setDataStatus(message, tone = "ok") {
  if (!els.dataStatus) return
  els.dataStatus.hidden = !message
  els.dataStatus.textContent = message
  els.dataStatus.classList.toggle("dataStatus--error", tone === "error")
}

function setReminderStatus(message, tone = "ok") {
  if (!els.reminderStatus) return
  els.reminderStatus.hidden = !message
  els.reminderStatus.textContent = message
  els.reminderStatus.classList.toggle("reminderStatus--error", tone === "error")
}

function renderOnboardingChrome() {
  const reminders = document.getElementById("onboardIconReminders")
  const relief = document.getElementById("onboardIconRelief")
  const checkin = document.getElementById("onboardIconCheckin")
  if (reminders) reminders.innerHTML = iconBell(18)
  if (relief) relief.innerHTML = iconPlay(18)
  if (checkin) checkin.innerHTML = iconHeart(18)
}

function bindOnboarding() {
  els.onboardingComplete?.addEventListener("click", () => void finishOnboarding())
}

function showOnboarding() {
  els.viewOnboarding.hidden = false
  els.viewHome.hidden = true
  els.viewCheckIn.hidden = true
  els.viewDashboard.hidden = true
  els.viewSession.hidden = true
  els.viewSettings.hidden = true
  els.checkInFooter.hidden = true
  els.nav.hidden = true
  uiErrorMessage = ""
  renderErrorBanner("")
}

async function finishOnboarding() {
  const enableReminders = Boolean(els.onboardingReminders?.checked)
  await setSettings({ notificationsEnabled: enableReminders })
  if (enableReminders && typeof Notification !== "undefined") {
    try {
      await Notification.requestPermission()
    } catch {
      // best effort; blocked state is handled on Today tab
    }
  }
  await completeOnboarding()
  els.viewOnboarding.hidden = true
  activeTab = "home"
  setActiveTab("home")
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

function renderSettingsViewHeaderIcon() {
  const slot = els.settingsViewHeaderIcon
  if (slot) slot.innerHTML = iconSettings(22)
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

async function updateHeroStatus({ settings, runtime, activeMinutes, isSnoozed }) {
  els.statusPill?.classList.remove("statusPill--muted", "statusPill--warm")
  let progressRatio = 0

  if (els.activeValue) {
    els.activeValue.textContent = formatActiveMinutes(activeMinutes ?? 0)
  }

  if (!settings.notificationsEnabled) {
    els.statusPill?.classList.add("statusPill--muted")
    if (els.statusPillText) els.statusPillText.textContent = "Reminders off"
    if (els.heroMeta) {
      els.heroMeta.textContent = "Turn reminders on whenever you're ready."
    }
  } else if (isSnoozed) {
    els.statusPill?.classList.add("statusPill--warm")
    if (els.statusPillText) els.statusPillText.textContent = "Snoozed"
    const until = new Date(runtime.snoozedUntilMs).toLocaleTimeString([], {
      hour: "numeric",
      minute: "2-digit",
    })
    if (els.heroMeta) els.heroMeta.textContent = `Paused until ${until}`
  } else if (activeMinutes == null) {
    if (els.statusPillText) els.statusPillText.textContent = "Reminders on"
    if (els.heroMeta) {
      els.heroMeta.textContent = `Next reminder after ${settings.reminderIntervalMinutes} min of activity`
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
          ? `Next reminder in ${remaining} min`
          : "A reminder may appear soon"
    }
  }

  if (els.reminderProgress) {
    els.reminderProgress.style.width = `${Math.round(progressRatio * 100)}%`
  }

  const stats = await getSessionStats()
  if (els.heroSessionMeta) {
    els.heroSessionMeta.hidden = stats.todayCount === 0
    els.heroSessionMeta.textContent =
      stats.todayCount === 1
        ? "1 relief session"
        : `${stats.todayCount} relief sessions`
  }
}

function bindSettings() {
  // Settings tab is now a nav button — bindings handled by bindNav
}

function bindNav() {
  els.goCheckIn.addEventListener("click", () => {
    exitQuickReliefLaunchMode()
    setActiveTab("checkin")
  })
  document.getElementById("scrollQuickRelief")?.addEventListener("click", () => {
    showAllQuickRelief = !showAllQuickRelief
    renderSessionList()
    updateQuickReliefToggleLabel()
    if (showAllQuickRelief) {
      els.sessionList?.lastElementChild?.scrollIntoView({ block: "nearest", behavior: "smooth" })
    }
  })
  els.navBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      exitQuickReliefLaunchMode()
      setActiveTab(btn.dataset.view)
    })
  })
}

function exitQuickReliefLaunchMode() {
  els.viewHome?.classList.remove("view--quick-relief-launch")
}

function setActiveTab(tab) {
  if (player.session) return
  activeTab = tab
  showMainView(tab)
  els.navBtns.forEach((btn) => {
    const isActive = btn.dataset.view === tab
    btn.classList.toggle("navBtn--active", isActive)
    if (isActive) btn.setAttribute("aria-current", "page")
    else btn.removeAttribute("aria-current")
  })
  if (tab === "insights") void renderDashboard()
  if (tab === "checkin") void loadCheckInForm()
  if (tab === "settings") void updateSyncUI()
}

function showMainView(tab) {
  if (!els.viewOnboarding.hidden) return
  els.viewHome.hidden = tab !== "home"
  els.viewCheckIn.hidden = tab !== "checkin"
  els.viewDashboard.hidden = tab !== "insights"
  els.viewSession.hidden = true
  els.viewSettings.hidden = tab !== "settings"
  els.checkInFooter.hidden = tab !== "checkin"
  els.nav.hidden = false
}

function bindCheckIn() {
  els.saveCheckIn.addEventListener("click", () => void submitCheckIn())
  els.severityGroup.addEventListener("keydown", handleSeverityKeydown)
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
    btn.tabIndex = checkInForm.severity === s.id || (!checkInForm.severity && s === SEVERITIES[0]) ? 0 : -1

    const iconWrap = document.createElement("span")
    iconWrap.className = "severityOptionIcon"
    iconWrap.innerHTML = severityIcon(s.id, 24)

    const label = document.createElement("span")
    label.className = "severityOptionLabel"
    label.textContent = getSeverityShortLabel(s.id)
    btn.setAttribute("aria-label", s.label)

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
  const selectedId = SEVERITIES.some((severity) => severity.id === id) ? id : null
  checkInForm.severity = selectedId
  const options = [...els.severityGroup.querySelectorAll(".severityOption")]
  options.forEach((option, index) => {
    const selected = Boolean(selectedId && option.dataset.severity === selectedId)
    option.classList.toggle("severityOption--selected", selected)
    option.setAttribute("aria-checked", selected ? "true" : "false")
    option.tabIndex = selected || (!selectedId && index === 0) ? 0 : -1
  })
  els.severityGroup.removeAttribute("aria-invalid")
}

function handleSeverityKeydown(event) {
  if (!["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(event.key)) return

  const options = [...els.severityGroup.querySelectorAll(".severityOption")]
  const currentIndex = options.indexOf(document.activeElement)
  if (currentIndex < 0) return

  event.preventDefault()
  const direction = event.key === "ArrowLeft" || event.key === "ArrowUp" ? -1 : 1
  const nextIndex = (currentIndex + direction + options.length) % options.length
  const nextOption = options[nextIndex]
  selectSeverity(nextOption.dataset.severity)
  nextOption.focus()
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
    els.checkInSavedNote.classList.remove("formNote--error")
    selectSeverity(null)
  } else {
    checkInForm.severity = today.severity
    checkInForm.bodyAreas = new Set(today.bodyAreas)
    els.checkInSavedNote.hidden = false
    els.checkInSavedNote.textContent = "Saved for today. You can update anytime."
    els.checkInSavedNote.classList.remove("formNote--error")
    selectSeverity(today.severity)
  }
  syncBodyAreaSelection()
}

async function submitCheckIn() {
  if (!checkInForm.severity) {
    els.severityGroup.setAttribute("aria-invalid", "true")
    els.checkInSavedNote.hidden = false
    els.checkInSavedNote.textContent = "Please choose how you feel overall."
    els.checkInSavedNote.classList.add("formNote--error")
    els.severityGroup.querySelector('[tabindex="0"]')?.focus()
    return
  }

  els.checkInSavedNote.classList.remove("formNote--error")

  // Brief saving state
  const saveBtn = els.saveCheckIn
  saveBtn.textContent = "Saving..."
  saveBtn.disabled = true
  saveBtn.setAttribute("aria-busy", "true")

  try {
    await saveCheckIn({
      severity: checkInForm.severity,
      bodyAreas: [...checkInForm.bodyAreas],
    })
  } catch {
    saveBtn.textContent = "Save check-in"
    saveBtn.disabled = false
    saveBtn.removeAttribute("aria-busy")
    els.checkInSavedNote.hidden = false
    els.checkInSavedNote.textContent = "Could not save your check-in. Try again."
    els.checkInSavedNote.classList.add("formNote--error")
    return
  }

  saveBtn.textContent = "Saved ✓"
  saveBtn.removeAttribute("aria-busy")
  saveBtn.classList.add("btn--save-success")

  els.checkInSavedNote.hidden = false
  els.checkInSavedNote.textContent = "Saved for today. You can update anytime."

  // Reset button after a moment
  setTimeout(() => {
    saveBtn.textContent = "Save check-in"
    saveBtn.disabled = false
    saveBtn.classList.remove("btn--save-success")
  }, 1500)

  await hydrate()
  scheduleSyncIfEnabled()
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
    label: "Breaks today",
    iconHtml: iconPlay(20),
  })
  appendStatCard({
    value: `${summary.breakMinutesToday} min`,
    label: "Relief today",
    iconHtml: iconClock(20),
  })
  appendStatCard({
    value: String(summary.sessionsLast7Days),
    label: "Sessions in 7 days",
    iconHtml: iconBarChart(20),
  })
  appendStatCard({
    value: `${summary.activeMinutesToday} min`,
    label: "Active today",
    iconHtml: iconActivity(20),
  })
  appendStatCard({
    value: String(summary.checkInStreak),
    label: "Check-in streak",
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
    const enabled = els.notificationsEnabled.checked
    try {
      await setSettings({ notificationsEnabled: enabled })
      await hydrate()
      setReminderStatus(enabled ? "Reminders are on." : "Reminders are off.")
      scheduleSyncIfEnabled()
    } catch {
      await hydrate()
      setReminderStatus("Could not update reminders. Try again.", "error")
    }
  })

  els.reminderIntervalMinutes.addEventListener("input", () => {
    updatePresetHighlight()
  })

  els.reminderIntervalMinutes.addEventListener("change", async () => {
    if (!els.reminderIntervalMinutes.checkValidity()) {
      setReminderStatus("Choose an interval between 1 and 240 minutes.", "error")
      return
    }
    const minutes = els.reminderIntervalMinutes.valueAsNumber
    try {
      await setSettings({ reminderIntervalMinutes: minutes })
      await hydrate()
      setReminderStatus(`Saved: every ${minutes} minutes of activity.`)
      scheduleSyncIfEnabled()
    } catch {
      setReminderStatus("Could not save the reminder interval. Try again.", "error")
    }
  })

  els.presets.forEach((btn) => {
    btn.addEventListener("click", async () => {
      const minutes = Number(btn.dataset.minutes)
      els.reminderIntervalMinutes.value = String(minutes)
      try {
        await setSettings({ reminderIntervalMinutes: minutes })
        await hydrate()
        setReminderStatus(`Saved: every ${minutes} minutes of activity.`)
        scheduleSyncIfEnabled()
      } catch {
        setReminderStatus("Could not save the reminder interval. Try again.", "error")
      }
    })
  })

  els.snooze10.addEventListener("click", () => snoozeForMinutes(10))
  els.snooze30.addEventListener("click", () => snoozeForMinutes(30))
  els.resetTimer.addEventListener("click", async () => {
    try {
      await runtimeSendMessage({ type: "activeaid:reset" })
      await hydrate()
      setReminderStatus("Activity timer restarted.")
    } catch {
      setReminderStatus("Could not restart the activity timer. Try again.", "error")
    }
  })
}

function bindClear() {
  els.clearData?.addEventListener("click", () => void handleClear())
}

function resetLocalUiState() {
  checkInForm.severity = null
  checkInForm.bodyAreas = new Set()
  showAllQuickRelief = false
  updateQuickReliefToggleLabel()
  renderSessionList()
}

async function handleClear() {
  const confirmed = await confirmAction({
    title: "Erase data on this device?",
    description:
      "This removes activity totals, check-ins, completed sessions, settings, and sign-in from this device. Cloud backup data is not deleted.",
    confirmLabel: "Erase local data",
  })
  if (!confirmed) return

  try {
    await runButtonAction(els.clearData, "Clearing...", async () => {
      await clearAllData()
      stopSessionTicker()
      player.session = null
      resetLocalUiState()
      stopPolling()
      showOnboarding()
    })
  } catch {
    showUiError("Could not clear local data. Try again.")
  }
}

function bindExport() {
  els.exportData?.addEventListener("click", () => void handleExport())
}

function bindSync() {
  els.syncSignedOut?.addEventListener("submit", (event) => {
    event.preventDefault()
    void handleSyncAuthSubmit()
  })
  els.syncModeCreate?.addEventListener("click", () => setSyncAuthMode("create"))
  els.syncModeSignIn?.addEventListener("click", () => setSyncAuthMode("signin"))
  els.syncConfirmPassword?.addEventListener("input", () => {
    els.syncConfirmPassword.setCustomValidity("")
  })
  bindPasswordToggle(els.syncPasswordToggle, els.syncPassword, "password")
  bindPasswordToggle(
    els.syncConfirmPasswordToggle,
    els.syncConfirmPassword,
    "confirmed password"
  )
  els.syncSignOut?.addEventListener("click", () => void handleSyncSignOut())
  els.syncNow?.addEventListener("click", () => void handleSyncNow())
  els.syncDeleteCloudData?.addEventListener("click", () => void handleDeleteCloudData())
  els.syncEnabled?.addEventListener("change", () => void handleSyncEnabledChange())
  setSyncAuthMode("create", { clearStatus: false })
}

function bindPasswordToggle(button, input, label) {
  button?.addEventListener("click", () => {
    setPasswordVisibility(input, button, input?.type === "password", label)
  })
}

function setPasswordVisibility(input, button, visible, label = "password") {
  if (!input || !button) return
  input.type = visible ? "text" : "password"
  button.textContent = visible ? "Hide" : "Show"
  button.setAttribute("aria-label", `${visible ? "Hide" : "Show"} ${label}`)
  button.setAttribute("aria-pressed", String(visible))
}

function clearSyncPasswords() {
  if (els.syncPassword) els.syncPassword.value = ""
  if (els.syncConfirmPassword) {
    els.syncConfirmPassword.value = ""
    els.syncConfirmPassword.setCustomValidity("")
  }
  setPasswordVisibility(els.syncPassword, els.syncPasswordToggle, false, "password")
  setPasswordVisibility(
    els.syncConfirmPassword,
    els.syncConfirmPasswordToggle,
    false,
    "confirmed password"
  )
}

function setSyncAuthMode(mode, { clearStatus = true } = {}) {
  syncAuthMode = mode === "signin" ? "signin" : "create"
  const isCreate = syncAuthMode === "create"

  els.syncModeCreate?.classList.toggle("authModeButton--active", isCreate)
  els.syncModeCreate?.setAttribute("aria-pressed", String(isCreate))
  els.syncModeSignIn?.classList.toggle("authModeButton--active", !isCreate)
  els.syncModeSignIn?.setAttribute("aria-pressed", String(!isCreate))

  if (els.syncConfirmField) els.syncConfirmField.hidden = !isCreate
  if (els.syncConfirmPassword) els.syncConfirmPassword.required = isCreate
  if (els.syncPassword) {
    els.syncPassword.autocomplete = isCreate ? "new-password" : "current-password"
    els.syncPassword.minLength = isCreate ? 8 : 1
  }
  if (els.syncPasswordHint) {
    els.syncPasswordHint.textContent = isCreate
      ? "Use at least 8 characters."
      : "Enter the password for this account."
  }
  if (els.syncAuthHint) {
    els.syncAuthHint.textContent = isCreate
      ? "Create an account only if you want optional cloud backup. After confirming your email, return here to sign in and enable backup."
      : "Sign in to manage optional cloud backup. Signing in does not turn backup on."
  }
  if (els.syncAuthSubmit) {
    els.syncAuthSubmit.textContent = isCreate ? "Create account" : "Sign in"
  }

  clearSyncPasswords()
  if (clearStatus) {
    setSyncStatus("")
    void setSyncError("")
  }
}

function setSyncStatus(message, tone = "muted") {
  if (!els.syncStatus) return
  if (!message) {
    els.syncStatus.hidden = true
    els.syncStatus.textContent = ""
    els.syncStatus.classList.remove("syncStatus--error", "syncStatus--ok")
    return
  }
  els.syncStatus.hidden = false
  els.syncStatus.textContent = message
  els.syncStatus.classList.toggle("syncStatus--error", tone === "error")
  els.syncStatus.classList.toggle("syncStatus--ok", tone === "ok")
}

async function updateSyncUI() {
  if (!els.syncSection) return

  if (!isSyncConfigured()) {
    els.syncSection.hidden = true
    return
  }

  els.syncSection.hidden = false
  const state = await getSyncState()
  const signedIn = Boolean(state.accessToken)

  if (els.syncSignedOut) els.syncSignedOut.hidden = signedIn
  if (els.syncSignedIn) els.syncSignedIn.hidden = !signedIn

  if (signedIn) {
    if (els.syncSummaryHint) {
      const accountLabel = state.email ? `Signed in as ${state.email}` : "Signed in"
      els.syncSummaryHint.textContent = `${state.enabled ? "On" : "Off"} · ${accountLabel}`
    }
    if (els.syncAccount) {
      els.syncAccount.textContent = state.email ? `Signed in as ${state.email}` : "Signed in"
    }
    if (els.syncEnabled) els.syncEnabled.checked = state.enabled
    if (els.syncNow) els.syncNow.hidden = !state.enabled
    if (state.lastError) {
      setSyncStatus(state.lastError, "error")
    } else if (!state.enabled) {
      setSyncStatus("Cloud backup is off. Nothing will be uploaded.")
    } else if (state.lastSyncedAt) {
      const when = new Date(state.lastSyncedAt).toLocaleString([], {
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit",
      })
      setSyncStatus(`Last synced ${when}.`, "ok")
    } else {
      setSyncStatus("Cloud backup is on.", "ok")
    }
  } else {
    if (els.syncSummaryHint) els.syncSummaryHint.textContent = "Off · No account required"
    if (state.lastError) setSyncStatus(state.lastError, "error")
  }
}

async function handleSyncAuthSubmit() {
  const isCreate = syncAuthMode === "create"

  if (isCreate && els.syncPassword?.value !== els.syncConfirmPassword?.value) {
    els.syncConfirmPassword?.setCustomValidity("Passwords do not match")
    els.syncConfirmPassword?.reportValidity()
    return
  }

  try {
    const result = await runButtonAction(
      els.syncAuthSubmit,
      isCreate ? "Creating account..." : "Signing in...",
      async () => {
        setSyncStatus(isCreate ? "Creating your account..." : "Signing in...")
        if (isCreate) {
          return signUp(els.syncEmail?.value ?? "", els.syncPassword?.value ?? "")
        }
        await signIn(els.syncEmail?.value ?? "", els.syncPassword?.value ?? "")
        return { status: "signed-in" }
      }
    )

    clearSyncPasswords()
    await setSyncError("")

    if (result?.status === "confirmation-required") {
      setSyncAuthMode("signin", { clearStatus: false })
      setSyncStatus(
        "Check your email to confirm your account, then return here and sign in.",
        "ok"
      )
      return
    }

    await hydrate()
    setSyncStatus(
      isCreate
        ? "Account created. Cloud backup is still off."
        : "Signed in. Cloud backup is still off.",
      "ok"
    )
  } catch (err) {
    clearSyncPasswords()
    const message = err instanceof Error ? err.message : "Could not access your account"
    setSyncStatus(message, "error")
    await setSyncError(message)
  }
}

async function handleSyncSignOut() {
  await runButtonAction(els.syncSignOut, "Signing out...", async () => {
    try {
      await signOut()
      if (els.syncEnabled) els.syncEnabled.checked = false
      setSyncAuthMode("signin", { clearStatus: false })
      setSyncStatus("")
      await hydrate()
    } catch {
      setSyncStatus("Could not sign out. Try again.", "error")
    }
  })
}

async function handleSyncNow() {
  await runButtonAction(els.syncNow, "Syncing...", async () => {
    try {
      setSyncStatus("Syncing...")
      await syncNow()
      await hydrate()
    } catch (err) {
      const message = err instanceof Error ? err.message : "Sync failed"
      setSyncStatus(message, "error")
      await setSyncError(message)
    }
  })
}

async function handleSyncEnabledChange() {
  const enabled = Boolean(els.syncEnabled?.checked)
  if (els.syncEnabled) {
    els.syncEnabled.disabled = true
    els.syncEnabled.setAttribute("aria-busy", "true")
  }
  try {
    await setSyncEnabled(enabled)
    if (enabled) {
      setSyncStatus("Syncing...")
      await syncNow()
    }
    await hydrate()
  } catch (err) {
    if (els.syncEnabled) els.syncEnabled.checked = false
    if (enabled) await setSyncEnabled(false).catch(() => undefined)
    const message = err instanceof Error ? err.message : "Could not enable sync"
    setSyncStatus(message, "error")
    await setSyncError(message)
  } finally {
    if (els.syncEnabled) {
      els.syncEnabled.disabled = false
      els.syncEnabled.removeAttribute("aria-busy")
    }
  }
}

async function handleDeleteCloudData() {
  const confirmed = await confirmAction({
    title: "Delete cloud backup?",
    description:
      "This permanently deletes your backed-up wellness data and turns cloud backup off. Local data on this device stays here.",
    confirmLabel: "Delete cloud data",
  })
  if (!confirmed) return

  await runButtonAction(els.syncDeleteCloudData, "Deleting...", async () => {
    try {
      setSyncStatus("Deleting cloud backup data...")
      await deleteCloudData()
      await hydrate()
      setSyncStatus("Cloud backup data deleted. Local data is still on this device.", "ok")
    } catch (err) {
      if (els.syncEnabled) els.syncEnabled.checked = false
      if (els.syncNow) els.syncNow.hidden = true
      const message = err instanceof Error ? err.message : "Could not delete cloud backup data"
      setSyncStatus(message, "error")
      await setSyncError(message)
    }
  })
}

async function handleExport() {
  await runButtonAction(els.exportData, "Exporting...", async () => {
    try {
      const data = await exportAllData()
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `activeaid-export-${todayDateKey()}.json`
      document.body.append(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
      setDataStatus("Downloaded a copy of your local ActiveAid data.")
    } catch {
      setDataStatus("Could not export data. Try again.", "error")
    }
  })
}

function bindSessionPlayer() {
  els.sessionBack.addEventListener("click", () => {
    if (player.isCompleted) void finishCompletedSession()
    else closeSession()
  })
  els.stepPrev.addEventListener("click", () => goToStep(player.stepIndex - 1))
  els.stepNext.addEventListener("click", () => goToStep(player.stepIndex + 1))
  els.stepComplete.addEventListener("click", () => {
    if (player.isCompleted) void finishCompletedSession()
    else void completeSession()
  })
  document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape" || !player.session || els.confirmDialog.open) return
    if (player.isCompleted) void finishCompletedSession()
    else closeSession()
  })
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
    icon.className = `sessionIcon sessionIcon--${session.id}`
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

async function updateTodayNudges(todayCheckIn) {
  if (todayCheckIn) {
    els.checkInHint.textContent = `Today · ${getSeverityLabel(todayCheckIn.severity)}`
    if (els.checkInCtaText) els.checkInCtaText.textContent = "Update"
  } else {
    els.checkInHint.textContent = "Log how your body feels today."
    if (els.checkInCtaText) els.checkInCtaText.textContent = "Check in"
  }

  if (!els.sessionStats) return
  const stats = await getSessionStats()
  const hasSessions = stats.totalCount > 0
  els.sessionStats.hidden = hasSessions
  if (!hasSessions) {
    els.sessionStats.textContent =
      "Not yet. Start a session above for a gentle movement break."
  }
}

function openSession(sessionId) {
  const session = getSessionById(sessionId)
  if (!session) return
  player.session = session
  previousActiveTab = activeTab
  player.stepIndex = 0
  player.startedAt = nowMs()
  player.stepStartedAt = nowMs()
  player.isCompleting = false
  player.isCompleted = false
  player.returnFocus = document.activeElement
  els.sessionTitle.textContent = session.title
  els.sessionTagline.textContent = session.tagline
  renderSessionPlayerIcon(session.id)
  els.viewHome.hidden = true
  els.viewCheckIn.hidden = true
  els.viewDashboard.hidden = true
  els.viewSettings.hidden = true
  els.checkInFooter.hidden = true
  els.viewSession.hidden = false
  els.nav.hidden = true
  renderStep()
  els.stepTitle.focus()
  startSessionTicker()
}

async function handleQuickReliefIntent() {
  if (!(await consumeQuickReliefIntent())) return

  activeTab = "home"
  showAllQuickRelief = true
  setActiveTab("home")
  els.viewHome?.classList.add("view--quick-relief-launch")
  renderSessionList()
  updateQuickReliefToggleLabel()
  els.sessionList?.querySelector("button")?.focus({ preventScroll: true })
}

function closeSession() {
  const returnFocus = player.returnFocus
  stopSessionTicker()
  player.session = null
  player.stepIndex = 0
  player.startedAt = null
  player.stepStartedAt = null
  player.isCompleting = false
  player.isCompleted = false
  player.returnFocus = null
  els.stepPrev.hidden = false
  setActiveTab(activeTab)
  if (returnFocus instanceof HTMLElement && returnFocus.isConnected) returnFocus.focus()
}

function goToStep(index, { focusTitle = true } = {}) {
  if (!player.session) return
  player.stepIndex = Math.min(player.session.steps.length - 1, Math.max(0, index))
  player.stepStartedAt = nowMs()
  renderStep()
  if (player.tickId == null) startSessionTicker()
  if (focusTitle) els.stepTitle.focus()
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
  els.stepPrev.hidden = false
  els.stepNext.hidden = isLast
  els.stepComplete.hidden = !isLast
  els.stepComplete.disabled = false
  if (els.stepCompleteLabel) els.stepCompleteLabel.textContent = "Complete"
  if (els.stepAutoAdvanceNote) {
    els.stepAutoAdvanceNote.textContent = isLast
      ? "Your session saves when the timer ends. You choose when to finish."
      : "The next step starts automatically when the timer ends."
  }
  els.stepNext.classList.remove("btn--pulse")
  els.stepComplete.classList.remove("btn--pulse", "btn--complete")

  els.stepCard.classList.remove("stepCard--enter")
  // retrigger animation
  void els.stepCard.offsetWidth
  els.stepCard.classList.add("stepCard--enter")
  updateCountdownUI()
}

async function completeSession() {
  const session = player.session
  if (!session || player.startedAt == null || player.isCompleting) return

  player.isCompleting = true
  stopSessionTicker()

  els.stepPrev.disabled = true
  els.stepComplete.disabled = true
  els.stepComplete.setAttribute("aria-busy", "true")
  if (els.stepCompleteLabel) els.stepCompleteLabel.textContent = "Saving..."

  try {
    await addSessionLog({
      sessionId: session.id,
      completedAt: nowMs(),
      durationSeconds:
        Math.round((nowMs() - player.startedAt) / 1000) || getTotalDurationSeconds(session),
    })
  } catch {
    player.isCompleting = false
    els.stepPrev.disabled = player.stepIndex === 0
    els.stepComplete.disabled = false
    els.stepComplete.removeAttribute("aria-busy")
    if (els.stepCompleteLabel) els.stepCompleteLabel.textContent = "Try again"
    showUiError("Could not save this session. Try completing it again.")
    return
  }

  uiErrorMessage = ""
  renderErrorBanner("")
  player.isCompleting = false
  player.isCompleted = true
  els.stepComplete.removeAttribute("aria-busy")
  els.stepComplete.disabled = false
  els.stepPrev.hidden = true
  els.stepNext.hidden = true
  els.stepComplete.hidden = false
  if (els.stepCompleteLabel) els.stepCompleteLabel.textContent = "Done"
  els.stepComplete.classList.add("btn--complete")
  els.stepProgress.textContent = "Session complete"
  els.stepCountdown.textContent = "00:00"
  els.totalCountdown.textContent = "00:00"
  els.stepTitle.textContent = `${session.title} complete!`
  els.stepInstruction.textContent = "Small resets add up. Taking a moment to breathe helps."
  if (els.stepAutoAdvanceNote) {
    els.stepAutoAdvanceNote.textContent = "Session saved. Choose Done when you're ready."
  }
  els.stepCard.classList.remove("stepCard--enter")
  void els.stepCard.offsetWidth
  els.stepCard.classList.add("stepCard--enter")
  els.stepComplete.focus()
  scheduleSyncIfEnabled()
}

async function finishCompletedSession() {
  const session = player.session
  if (!session || !player.isCompleted) return

  closeSession()
  activeTab = previousActiveTab || "home"
  setActiveTab(activeTab)
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
  els.stepCountdown.textContent = formatCountdown(Math.ceil(stepRemaining))

  const remainingStepsSeconds = session.steps
    .slice(player.stepIndex + 1)
    .reduce((sum, s) => sum + s.durationSeconds, 0)
  const totalRemaining = stepRemaining + remainingStepsSeconds
  els.totalCountdown.textContent = formatCountdown(Math.ceil(totalRemaining))

  const timerAction = getSessionTimerAction(
    stepRemaining,
    player.stepIndex,
    session.steps.length
  )
  if (timerAction === "next") {
    goToStep(player.stepIndex + 1, { focusTitle: false })
  } else if (timerAction === "complete") {
    void completeSession()
  }
}

async function snoozeForMinutes(minutes) {
  try {
    await setRuntimeState({ snoozedUntilMs: nowMs() + minutesToMs(minutes) })
    await hydrate()
    setReminderStatus(`Reminders paused for ${minutes} minutes.`)
  } catch {
    setReminderStatus("Could not pause reminders. Try again.", "error")
  }
}

async function hydrate() {
  const [settings, runtime, todayCheckIn] = await Promise.all([
    getSettings(),
    getRuntimeState(),
    getTodayCheckIn(),
  ])

  if (player.session) return

  renderReminderSettings(settings)

  const currentMs = nowMs()
  const activeMinutes =
    runtime.activeSinceMs != null && isActivityRecent(runtime.lastActivityMs, currentMs)
      ? msToRoundedMinutes(currentMs - runtime.activeSinceMs)
      : null
  const isSnoozed = runtime.snoozedUntilMs != null && currentMs < runtime.snoozedUntilMs

  void updateHeroStatus({ settings, runtime, activeMinutes, isSnoozed })
  void updateTodayNudges(todayCheckIn)
  void updateSyncUI()

  if (runtime.lastNotificationError) {
    renderErrorBanner("We couldn’t show a reminder just now. Try reloading the extension.")
  } else {
    renderErrorBanner(uiErrorMessage)
  }

  if (activeTab === "insights") await renderDashboard()
}

function updatePresetHighlight() {
  const current = Number(els.reminderIntervalMinutes.value)
  els.presets.forEach((btn) => {
    const selected = Number(btn.dataset.minutes) === current
    btn.classList.toggle("preset--active", selected)
    btn.setAttribute("aria-pressed", String(selected))
  })
}

function renderReminderSettings(settings) {
  if (els.notificationsEnabled) els.notificationsEnabled.checked = settings.notificationsEnabled
  if (els.reminderIntervalMinutes) {
    els.reminderIntervalMinutes.value = String(settings.reminderIntervalMinutes)
  }
  if (els.reminderTimingSummary) {
    els.reminderTimingSummary.textContent = `Every ${settings.reminderIntervalMinutes} minutes of activity.`
  }
  updatePresetHighlight()
}

function startPolling() {
  stopPolling()
  pollIntervalId = window.setInterval(() => void hydrate(), 2_000)
}

function stopPolling() {
  if (pollIntervalId != null) {
    window.clearInterval(pollIntervalId)
    pollIntervalId = null
  }
}
