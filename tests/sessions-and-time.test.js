import test from "node:test"
import assert from "node:assert/strict"

import { SESSIONS, getSessionById, getTotalDurationSeconds } from "../extension/shared/sessions.js"
import { formatCountdown, minutesToMs, msToRoundedMinutes } from "../extension/shared/time.js"

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
