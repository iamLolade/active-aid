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
} from "../shared/storage.js"
import {
  isSyncConfigured,
  getSyncState,
  signIn,
  signOut,
  setSyncEnabled,
  syncNow,
  deleteCloudData,
  scheduleSyncIfEnabled,
  setSyncError,
} from "../shared/sync.js"
import { formatCountdown, minutesToMs, msToRoundedMinutes, nowMs } from "../shared/time.js"
import { runtimeSendMessage } from "../shared/chrome-api.js"
import { SESSIONS, getSessionById, getTotalDurationSeconds } from "../shared/sessions.js"
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

const NAV_TAB_ICONS = {
  home: iconCalendar,
  checkin: iconHeart,
  insights: iconBarChart,
  settings: iconSettings,
}

/** Featured on Today tab per hero-popup.png */
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
  settingsViewHeaderIcon: document.getElementById("settingsViewHeaderIcon"),
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
  exportData: document.getElementById("exportData"),
  clearData: document.getElementById("clearData"),
  syncSection: document.getElementById("syncSection"),
  syncHint: document.getElementById("syncHint"),
  syncStatus: document.getElementById("syncStatus"),
  syncSignedOut: document.getElementById("syncSignedOut"),
  syncSignedIn: document.getElementById("syncSignedIn"),
  syncEmail: document.getElementById("syncEmail"),
  syncPassword: document.getElementById("syncPassword"),
  syncSignIn: document.getElementById("syncSignIn"),
  syncEnabled: document.getElementById("syncEnabled"),
  syncNow: document.getElementById("syncNow"),
  syncDeleteCloudData: document.getElementById("syncDeleteCloudData"),
  syncSignOut: document.getElementById("syncSignOut"),
  syncAccount: document.getElementById("syncAccount"),
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
let previousActiveTab = "home"
let pollIntervalId = null

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

  if (!(await isOnboardingComplete())) {
    renderOnboardingChrome()
    showOnboarding()
    return
  }

  await hydrate()
  startPolling()
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
  els.nav.hidden = true
  els.errorBanner.hidden = true
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

  // Show today's session count in hero if any sessions have been done
  const stats = await getSessionStats()
  if (stats.todayCount > 0) {
    let heroMeta = els.heroMeta
    if (heroMeta) {
      const baseText = heroMeta.textContent || ""
      const sessionText =
        stats.todayCount === 1
          ? `${stats.todayCount} session today`
          : `${stats.todayCount} sessions today`
      heroMeta.textContent = `${sessionText} · ${baseText}`
    }
  }
}

function bindSettings() {
  // Settings tab is now a nav button — bindings handled by bindNav
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
  if (tab === "settings") void updateSyncUI()
}

function showMainView(tab) {
  if (!els.viewOnboarding.hidden) return
  els.viewHome.hidden = tab !== "home"
  els.viewCheckIn.hidden = tab !== "checkin"
  els.viewDashboard.hidden = tab !== "insights"
  els.viewSession.hidden = true
  els.viewSettings.hidden = tab !== "settings"
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
    els.checkInSavedNote.classList.add("formNote--error")
    return
  }

  els.checkInSavedNote.classList.remove("formNote--error")

  // Brief saving state
  const saveBtn = els.saveCheckIn
  saveBtn.textContent = "Saving..."
  saveBtn.disabled = true

  await saveCheckIn({
    severity: checkInForm.severity,
    bodyAreas: [...checkInForm.bodyAreas],
  })

  saveBtn.textContent = "Saved ✓"
  saveBtn.classList.add("btn--save-success")

  els.checkInSavedNote.hidden = false
  els.checkInSavedNote.textContent = "Saved for today. You can update anytime."
  els.checkInSavedNote.style.color = "#3d6b42"

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
    scheduleSyncIfEnabled()
  })

  let intervalSaveTimer = null
  els.reminderIntervalMinutes.addEventListener("input", () => {
    updatePresetHighlight()
    if (intervalSaveTimer) window.clearTimeout(intervalSaveTimer)
    intervalSaveTimer = window.setTimeout(async () => {
      await setSettings({ reminderIntervalMinutes: Number(els.reminderIntervalMinutes.value) })
      await hydrate()
      scheduleSyncIfEnabled()
    }, 250)
  })

  els.presets.forEach((btn) => {
    btn.addEventListener("click", async () => {
      const minutes = Number(btn.dataset.minutes)
      els.reminderIntervalMinutes.value = String(minutes)
      await setSettings({ reminderIntervalMinutes: minutes })
      await hydrate()
      scheduleSyncIfEnabled()
    })
  })

  els.snooze10.addEventListener("click", () => snoozeForMinutes(10))
  els.snooze30.addEventListener("click", () => snoozeForMinutes(30))
  els.resetTimer.addEventListener("click", async () => {
    await runtimeSendMessage({ type: "activeaid:reset" }).catch(() => undefined)
    await hydrate()
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
  if (!window.confirm("Clear all local data and reset the extension? This cannot be undone.")) {
    return
  }

  stopSessionTicker()
  player.session = null
  resetLocalUiState()
  await clearAllData()

  // Reset settings to defaults for the current session
  await setSettings({})

  stopPolling()
  showOnboarding()
}

function bindExport() {
  els.exportData?.addEventListener("click", () => void handleExport())
}

function bindSync() {
  els.syncSignIn?.addEventListener("click", () => void handleSyncSignIn())
  els.syncSignOut?.addEventListener("click", () => void handleSyncSignOut())
  els.syncNow?.addEventListener("click", () => void handleSyncNow())
  els.syncDeleteCloudData?.addEventListener("click", () => void handleDeleteCloudData())
  els.syncEnabled?.addEventListener("change", () => void handleSyncEnabledChange())
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
    setSyncStatus(state.lastError || "", state.lastError ? "error" : "muted")
  }
}

async function handleSyncSignIn() {
  try {
    setSyncStatus("Signing in...")
    await signIn(els.syncEmail?.value ?? "", els.syncPassword?.value ?? "")
    await hydrate()
    setSyncStatus("Signed in. Cloud backup is still off.", "ok")
  } catch (err) {
    const message = err instanceof Error ? err.message : "Sign in failed"
    setSyncStatus(message, "error")
    await setSyncError(message)
  } finally {
    if (els.syncPassword) els.syncPassword.value = ""
  }
}

async function handleSyncSignOut() {
  await signOut()
  if (els.syncEnabled) els.syncEnabled.checked = false
  if (els.syncPassword) els.syncPassword.value = ""
  setSyncStatus("")
  await hydrate()
}

async function handleSyncNow() {
  try {
    setSyncStatus("Syncing...")
    await syncNow()
    await hydrate()
  } catch (err) {
    const message = err instanceof Error ? err.message : "Sync failed"
    setSyncStatus(message, "error")
    await setSyncError(message)
  }
}

async function handleSyncEnabledChange() {
  const enabled = Boolean(els.syncEnabled?.checked)
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
  }
}

async function handleDeleteCloudData() {
  const confirmed = window.confirm(
    "Delete all cloud backup data? Your data on this device will stay here, and cloud backup will be turned off."
  )
  if (!confirmed) return

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
}

async function handleExport() {
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
  } catch {
    els.errorBanner.hidden = false
    els.errorText.textContent = "Could not export data. Try again."
  }
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
  els.sessionTitle.textContent = session.title
  els.sessionTagline.textContent = session.tagline
  renderSessionPlayerIcon(session.id)
  els.viewHome.hidden = true
  els.viewCheckIn.hidden = true
  els.viewDashboard.hidden = true
  els.viewSettings.hidden = true
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

  // Brief completion state before closing
  els.stepTitle.textContent = `${session.title} complete!`
  els.stepInstruction.textContent = "Small resets add up. Taking a moment to breathe helps."
  els.stepCard.classList.remove("stepCard--enter")
  void els.stepCard.offsetWidth
  els.stepCard.classList.add("stepCard--enter")
  els.stepComplete.disabled = true
  els.stepComplete.textContent = "Done ✓"
  els.stepComplete.classList.add("btn--complete")

  // Save the session
  await addSessionLog({
    sessionId: session.id,
    completedAt: nowMs(),
    durationSeconds:
      Math.round((nowMs() - player.startedAt) / 1000) || getTotalDurationSeconds(session),
  })

  // Brief pause so user sees the completion state
  await new Promise((r) => setTimeout(r, 1200))

  closeSession()
  activeTab = previousActiveTab || "home"
  setActiveTab(activeTab)
  await hydrate()
  scheduleSyncIfEnabled()
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

  els.notificationsEnabled.checked = settings.notificationsEnabled
  els.reminderIntervalMinutes.value = String(settings.reminderIntervalMinutes)
  updatePresetHighlight()

  const activeMinutes =
    runtime.activeSinceMs != null ? msToRoundedMinutes(nowMs() - runtime.activeSinceMs) : null
  const isSnoozed = runtime.snoozedUntilMs != null && nowMs() < runtime.snoozedUntilMs

  void updateHeroStatus({ settings, runtime, activeMinutes, isSnoozed })
  void updateTodayNudges(todayCheckIn)
  void updateSyncUI()

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
  stopPolling()
  pollIntervalId = window.setInterval(() => void hydrate(), 2_000)
}

function stopPolling() {
  if (pollIntervalId != null) {
    window.clearInterval(pollIntervalId)
    pollIntervalId = null
  }
}
