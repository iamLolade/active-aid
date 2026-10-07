import test from "node:test"
import assert from "node:assert/strict"

import {
  SESSIONS,
  getSessionById,
  getSessionTimerAction,
  getTotalDurationSeconds,
} from "../extension/shared/sessions.js"
import { formatCountdown, minutesToMs, msToRoundedMinutes } from "../extension/shared/time.js"
import {
  bodyAreaIcon,
  iconBreakComplete,
  iconCalendarDays,
  iconDeskActivity,
  iconStreak,
  iconTimer,
  sessionIcon,
  severityIcon,
} from "../extension/popup/icons.js"

test("the relief-session catalog has unique, usable entries", () => {
  assert.equal(SESSIONS.length, 5)
  assert.equal(new Set(SESSIONS.map((session) => session.id)).size, SESSIONS.length)

  for (const session of SESSIONS) {
    assert.ok(session.title.length > 0)
    assert.ok(session.steps.length > 0)
    assert.ok(session.steps.every((step) => step.durationSeconds > 0))
    assert.ok(getTotalDurationSeconds(session) > 0)
    assert.equal(getSessionById(session.id), session)
  }
})

test("time helpers clamp and format values consistently", () => {
  assert.equal(minutesToMs(2), 120_000)
  assert.equal(minutesToMs(-1), 0)
  assert.equal(msToRoundedMinutes(89_000), 1)
  assert.equal(formatCountdown(125.9), "02:05")
  assert.equal(formatCountdown(-1), "00:00")
})

test("relief session timers advance and complete automatically", () => {
  assert.equal(getSessionTimerAction(1, 0, 4), "wait")
  assert.equal(getSessionTimerAction(0, 0, 4), "next")
  assert.equal(getSessionTimerAction(0, 3, 4), "complete")
})

test("relief sessions use distinct, recognizable icon artwork", () => {
  const icons = SESSIONS.map((session) => sessionIcon(session.id))

  assert.equal(new Set(icons).size, SESSIONS.length)
  assert.ok(icons.every((icon) => icon.includes("<svg")))
})

test("check-in severity icons render complete facial expressions", () => {
  const severityIds = ["great", "slight", "moderate", "severe"]

  for (const severityId of severityIds) {
    assert.ok(severityIcon(severityId).includes("M9 9h.01M15 9h.01"))
  }
})

test("check-in body areas reuse the quick-relief artwork", () => {
  const sharedIcons = {
    neck: "neck",
    shoulders: "shoulder",
    "lower-back": "lower-back",
    wrists: "wrist",
    eyes: "eyes",
  }

  for (const [areaId, sessionId] of Object.entries(sharedIcons)) {
    assert.equal(bodyAreaIcon(areaId), sessionIcon(sessionId))
  }
})

test("insight metrics use distinct, purpose-specific artwork", () => {
  const icons = [
    iconBreakComplete(),
    iconTimer(),
    iconCalendarDays(),
    iconDeskActivity(),
    iconStreak(),
  ]

  assert.equal(new Set(icons).size, icons.length)
  assert.ok(icons.every((icon) => icon.includes("<svg")))
})
