export const INACTIVITY_RESET_MS = 5 * 60 * 1000

export function isActivityRecent(lastActivityMs, currentMs = Date.now()) {
  if (!Number.isFinite(lastActivityMs) || !Number.isFinite(currentMs)) return false
  const elapsedMs = currentMs - lastActivityMs
  return elapsedMs >= 0 && elapsedMs < INACTIVITY_RESET_MS
}
