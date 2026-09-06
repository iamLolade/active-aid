import { isActivityRecent } from "./activity.js"
import { minutesToMs, msToRoundedMinutes } from "./time.js"

export function getReminderDecision({ settings, runtime, currentMs = Date.now() }) {
  if (!settings.notificationsEnabled) return { status: "disabled" }

  if (runtime.activeSinceMs == null || runtime.lastActivityMs == null) {
    return { status: "no-activity" }
  }

  if (!isActivityRecent(runtime.lastActivityMs, currentMs)) {
    return { status: "inactive", clearActiveSession: true }
  }

  if (runtime.snoozedUntilMs != null && currentMs < runtime.snoozedUntilMs) {
    return { status: "snoozed" }
  }

  const activeDurationMs = Math.max(0, currentMs - runtime.activeSinceMs)
  if (activeDurationMs < minutesToMs(settings.reminderIntervalMinutes)) {
    return { status: "waiting" }
  }

  return {
    status: "due",
    activeMinutes: msToRoundedMinutes(activeDurationMs),
  }
}
