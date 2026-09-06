import test from "node:test"
import assert from "node:assert/strict"

import { INACTIVITY_RESET_MS, isActivityRecent } from "../extension/shared/activity.js"
import { getReminderDecision } from "../extension/shared/reminders.js"

const NOW = 1_000_000
const settings = { notificationsEnabled: true, reminderIntervalMinutes: 30 }

function decide(runtime, overrides = {}) {
  return getReminderDecision({
    settings: { ...settings, ...overrides },
    runtime,
    currentMs: NOW,
  })
}

test("activity is recent until the inactivity boundary", () => {
  assert.equal(isActivityRecent(NOW - INACTIVITY_RESET_MS + 1, NOW), true)
  assert.equal(isActivityRecent(NOW - INACTIVITY_RESET_MS, NOW), false)
  assert.equal(isActivityRecent(NOW + 1, NOW), false)
  assert.equal(isActivityRecent(null, NOW), false)
})

test("disabled and missing activity do not produce reminders", () => {
  assert.deepEqual(decide({}, { notificationsEnabled: false }), { status: "disabled" })
  assert.deepEqual(decide({ activeSinceMs: null, lastActivityMs: null }), {
    status: "no-activity",
  })
})

test("stale activity clears the active session", () => {
  assert.deepEqual(
    decide({
      activeSinceMs: NOW - 60 * 60_000,
      lastActivityMs: NOW - INACTIVITY_RESET_MS,
    }),
    { status: "inactive", clearActiveSession: true }
  )
})

test("snoozed and waiting activity remain non-notifying", () => {
  const active = {
    activeSinceMs: NOW - 20 * 60_000,
    lastActivityMs: NOW - 1_000,
  }

  assert.deepEqual(decide({ ...active, snoozedUntilMs: NOW + 1 }), { status: "snoozed" })
  assert.deepEqual(decide(active), { status: "waiting" })
})

test("activity at the configured interval is due", () => {
  assert.deepEqual(
    decide({
      activeSinceMs: NOW - 30 * 60_000,
      lastActivityMs: NOW - 1_000,
    }),
    { status: "due", activeMinutes: 30 }
  )
})
