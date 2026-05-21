import { todayDateKey, getSeverityLabel, getBodyAreaLabel } from "./checkins.js"

/**
 * @param {import("./storage.js").CheckInLog[]} checkIns
 * @param {import("./storage.js").SessionLog[]} sessionLogs
 * @param {{ activityMs: number, reminders: number }} daily
 */
export function buildWellnessSummary(checkIns, sessionLogs, daily) {
  const today = todayDateKey()
  const startOfDay = new Date()
  startOfDay.setHours(0, 0, 0, 0)
  const dayStart = startOfDay.getTime()

  const sessionsToday = sessionLogs.filter((l) => l.completedAt >= dayStart)
  const breaksToday = sessionsToday.length
  const breakMinutesToday = Math.round(
    sessionsToday.reduce((sum, l) => sum + l.durationSeconds, 0) / 60
  )

  const activeMinutesToday = Math.round((daily.activityMs ?? 0) / 60_000)

  const todayCheckIn = checkIns.find((c) => c.date === today) ?? null
  const checkInStreak = computeCheckInStreak(checkIns, today)

  const last7 = lastNDays(7)
  const discomfortTrend = last7.map((date) => {
    const entry = checkIns.find((c) => c.date === date)
    return entry
      ? { date, severity: entry.severity, label: getSeverityLabel(entry.severity) }
      : { date, severity: null, label: "Not logged" }
  })

  const areaCounts = countBodyAreas(checkIns, 30)
  const topBodyAreas = Object.entries(areaCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([id, count]) => ({ id, label: getBodyAreaLabel(id), count }))

  return {
    breaksToday,
    breakMinutesToday,
    activeMinutesToday,
    remindersToday: daily.reminders ?? 0,
    todayCheckIn,
    checkInStreak,
    discomfortTrend,
    topBodyAreas,
  }
}

function computeCheckInStreak(checkIns, today) {
  const dates = new Set(checkIns.map((c) => c.date))
  let streak = 0
  let cursor = new Date(today)

  for (let i = 0; i < 365; i++) {
    const key = todayDateKey(cursor)
    if (!dates.has(key)) break
    streak++
    cursor.setDate(cursor.getDate() - 1)
  }

  return streak
}

function countBodyAreas(checkIns, days) {
  const since = Date.now() - days * 86_400_000
  const counts = {}

  for (const entry of checkIns) {
    if (entry.createdAt < since) continue
    for (const area of entry.bodyAreas) {
      counts[area] = (counts[area] ?? 0) + 1
    }
  }

  return counts
}

function lastNDays(n) {
  const out = []
  const d = new Date()
  for (let i = n - 1; i >= 0; i--) {
    const copy = new Date(d)
    copy.setDate(copy.getDate() - i)
    out.push(todayDateKey(copy))
  }
  return out
}
