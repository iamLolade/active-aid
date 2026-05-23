/**
 * Lucide-style inline SVG helpers for the extension popup (vanilla JS).
 * Uses currentColor so icons inherit text color from CSS.
 */

const VIEW = 'viewBox="0 0 24 24"'

/**
 * @param {number} size
 * @param {string} inner
 * @param {{ ariaHidden?: boolean, className?: string }} [options]
 */
export function iconSvg(size, inner, options = {}) {
  const { ariaHidden = true, className = "" } = options
  const classAttr = className ? ` class="${className}"` : ""
  const aria = ariaHidden ? ' aria-hidden="true"' : ""
  return (
    `<svg${classAttr}${aria} xmlns="http://www.w3.org/2000/svg" ` +
    `width="${size}" height="${size}" ${VIEW} fill="none">${inner}</svg>`
  )
}

/** @param {string} d */
function strokePath(d) {
  return `<path d="${d}" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"/>`
}

/** @param {string} d */
function strokePaths(...paths) {
  return paths.map(strokePath).join("")
}

// --- Nav & chrome ---

export function iconHeart(size = 24) {
  return iconSvg(
    size,
    strokePath(
      "M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"
    )
  )
}

export function iconCalendar(size = 24) {
  return iconSvg(
    size,
    strokePaths(
      "M8 2v4M16 2v4M3 10h18M5 4h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Z"
    )
  )
}

export function iconBarChart(size = 24) {
  return iconSvg(
    size,
    strokePaths("M12 20V10M18 20V4M6 20v-4")
  )
}

export function iconSettings(size = 24) {
  return iconSvg(
    size,
    strokePaths(
      "M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2Z",
      "M12 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Z"
    )
  )
}

export function iconClock(size = 24) {
  return iconSvg(
    size,
    strokePaths("M12 6v6l4 2", "M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z")
  )
}

export function iconBell(size = 24) {
  return iconSvg(
    size,
    strokePaths(
      "M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9",
      "M10.3 21a1.94 1.94 0 0 0 3.4 0"
    )
  )
}

export function iconChevronRight(size = 24) {
  return iconSvg(size, strokePath("m9 18 6-6-6-6"))
}

export function iconPlay(size = 24) {
  return iconSvg(
    size,
    '<path d="M10 8.5v7l6-3.5-6-3.5Z" fill="currentColor" stroke="none"/>'
  )
}

// --- Check-in: severity faces ---

const SEVERITY_ICONS = {
  great: (size) => iconSvg(size, strokePaths("M12 22a10 10 0 1 0-10-10 10 10 0 0 0 10 10Z", "M8 14s1.5 2 4 2 4-2 4-2")),
  slight: (size) =>
    iconSvg(size, strokePaths("M12 22a10 10 0 1 0-10-10 10 10 0 0 0 10 10Z", "M8 15h8")),
  moderate: (size) =>
    iconSvg(size, strokePaths("M12 22a10 10 0 1 0-10-10 10 10 0 0 0 10 10Z", "M8 16s1.5-2 4-2 4 2 4 2")),
  severe: (size) =>
    iconSvg(
      size,
      strokePaths(
        "M12 22a10 10 0 1 0-10-10 10 10 0 0 0 10 10Z",
        "M8 17s1.5-3 4-3 4 3 4 3",
        "M9 9h.01M15 9h.01"
      )
    ),
}

/**
 * @param {string} severityId
 * @param {number} [size]
 */
export function severityIcon(severityId, size = 22) {
  return SEVERITY_ICONS[severityId]?.(size) ?? SEVERITY_ICONS.great(size)
}

// --- Check-in: body areas ---

const BODY_AREA_ICONS = {
  neck: (size) =>
    iconSvg(
      size,
      strokePaths(
        "M12 4v2M8 6c0 2 1.5 3.5 4 4v4",
        "M16 6c0 2-1.5 3.5-4 4v4",
        "M10 18h4"
      )
    ),
  shoulders: (size) =>
    iconSvg(size, strokePaths("M6 19c0-3 2.5-5.5 6-5.5s6 2.5 6 5.5", "M8 11c.5-2 2-3.5 4-3.5s3.5 1.5 4 3.5")),
  "lower-back": (size) =>
    iconSvg(
      size,
      strokePaths("M7 4h10M8 5v6c0 2 1.8 3.5 4 3.5s4-1.5 4-3.5V5", "M9 15v5M15 15v5")
    ),
  wrists: (size) =>
    iconSvg(
      size,
      strokePaths(
        "M7 12c0 2.5 2 4.5 5 4.5s5-2 5-4.5V9c0-2-1.5-3.5-4-3.5H9.5C8 5.5 7 7 7 9v3Z",
        "M9 19h6"
      )
    ),
  eyes: (size) =>
    iconSvg(
      size,
      strokePaths(
        "M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z",
        "M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"
      )
    ),
}

/**
 * @param {string} areaId
 * @param {number} [size]
 */
export function bodyAreaIcon(areaId, size = 22) {
  return BODY_AREA_ICONS[areaId]?.(size) ?? iconSvg(size, strokePath("M12 12h.01"))
}

// --- Today: quick relief sessions (ids from sessions.js) ---

const SESSION_ICONS = {
  neck: BODY_AREA_ICONS.neck,
  wrist: BODY_AREA_ICONS.wrists,
  "lower-back": BODY_AREA_ICONS["lower-back"],
  shoulder: BODY_AREA_ICONS.shoulders,
  eyes: BODY_AREA_ICONS.eyes,
}

/**
 * @param {string} sessionId
 * @param {number} [size]
 */
export function sessionIcon(sessionId, size = 22) {
  return SESSION_ICONS[sessionId]?.(size) ?? iconSvg(size, strokePath("M12 12h.01"))
}
