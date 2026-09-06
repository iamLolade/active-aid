import test from "node:test"
import assert from "node:assert/strict"

import { todayDateKey } from "../extension/shared/checkins.js"
import { buildWellnessSummary } from "../extension/shared/wellness.js"

function localDate(year, month, day, hour = 12) {
  return new Date(year, month - 1, day, hour)
}

test("date keys use the local calendar date", () => {
  assert.equal(todayDateKey(localDate(2026, 9, 6)), "2026-09-06")
})

test("wellness summaries are deterministic at a supplied time", () => {
  const currentDate = localDate(2026, 9, 6)
  const currentMs = currentDate.getTime()
  const todayStart = localDate(2026, 9, 6, 0).getTime()

  const checkIns = [
    {
      date: "2026-09-06",
      severity: "slight",
      bodyAreas: ["neck", "shoulders"],
      createdAt: currentMs - 1_000,
    },
    {
      date: "2026-09-05",
      severity: "great",
      bodyAreas: ["neck"],
      createdAt: currentMs - 86_400_000,
    },
    {
      date: "2026-09-03",
      severity: "moderate",
      bodyAreas: ["wrists"],
      createdAt: currentMs - 3 * 86_400_000,
    },
    {
      date: "2026-07-01",
      severity: "great",
      bodyAreas: ["eyes"],
      createdAt: currentMs - 60 * 86_400_000,
    },
  ]
  const sessionLogs = [
    { sessionId: "neck", completedAt: todayStart + 1_000, durationSeconds: 120 },
    { sessionId: "eyes", completedAt: currentMs - 2 * 86_400_000, durationSeconds: 60 },
    { sessionId: "wrist", completedAt: currentMs - 8 * 86_400_000, durationSeconds: 120 },
  ]

  const summary = buildWellnessSummary(
    checkIns,
    sessionLogs,
    { activityMs: 3_600_000, reminders: 2 },
    currentDate
  )

  assert.equal(summary.breaksToday, 1)
  assert.equal(summary.breakMinutesToday, 2)
  assert.equal(summary.sessionsLast7Days, 2)
  assert.equal(summary.activeMinutesToday, 60)
  assert.equal(summary.remindersToday, 2)
  assert.equal(summary.todayCheckIn?.severity, "slight")
  assert.equal(summary.checkInStreak, 2)
  assert.equal(summary.discomfortTrend.length, 7)
  assert.equal(summary.discomfortTrend.at(-1)?.date, "2026-09-06")
  assert.deepEqual(summary.topBodyAreas, [
    { id: "neck", label: "Neck", count: 2 },
    { id: "shoulders", label: "Shoulders", count: 1 },
    { id: "wrists", label: "Wrists", count: 1 },
  ])
})
