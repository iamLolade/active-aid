export function nowMs() {
  return Date.now()
}

export function minutesToMs(minutes) {
  return Math.max(0, minutes) * 60_000
}

export function msToRoundedMinutes(ms) {
  return Math.max(0, Math.round(ms / 60_000))
}

export function formatRelativeTime(ms) {
  if (ms == null) return "Not yet"

  const deltaMs = nowMs() - ms
  if (deltaMs < 30_000) return "just now"

  const mins = Math.floor(deltaMs / 60_000)
  if (mins < 60) return `${mins}m ago`

  const hours = Math.floor(mins / 60)
  return `${hours}h ago`
}

export function formatCountdown(seconds) {
  const s = Math.max(0, Math.floor(seconds))
  const mm = String(Math.floor(s / 60)).padStart(2, "0")
  const ss = String(s % 60).padStart(2, "0")
  return `${mm}:${ss}`
}

