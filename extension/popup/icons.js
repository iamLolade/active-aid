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

export function iconHeartHandshake(size = 24) {
  return iconSvg(
    size,
    strokePath(
      "M19.414 14.414C21 12.828 22 11.5 22 9.5a5.5 5.5 0 0 0-9.591-3.676.6.6 0 0 1-.818.001A5.5 5.5 0 0 0 2 9.5c0 2.3 1.5 4 3 5.5l5.535 5.362a2 2 0 0 0 2.879.052 2.12 2.12 0 0 0-.004-3 2.124 2.124 0 1 0 3-3 2.124 2.124 0 0 0 3.004 0 2 2 0 0 0 0-2.828l-1.881-1.882a2.41 2.41 0 0 0-3.409 0l-1.71 1.71a2 2 0 0 1-2.828 0 2 2 0 0 1 0-2.828l2.823-2.762"
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

export function iconInsights(size = 24) {
  return iconSvg(
    size,
    strokePaths(
      "M12 16v5",
      "M16 14.64V21",
      "M20 10.66V21",
      "m22 3-8.65 8.65a.5.5 0 0 1-.71 0L9.35 8.35a.5.5 0 0 0-.7 0L2 15",
      "M4 18.46V21",
      "M8 14.66V21"
    )
  )
}

export function iconCloudCheck(size = 24) {
  return iconSvg(
    size,
    strokePaths(
      "m17 15-5.5 5.5L9 18",
      "M5.52 16.07A7 7 0 1 1 15.71 8h1.79A4.5 4.5 0 0 1 21 15.33"
    )
  )
}

export function iconLogOut(size = 24) {
  return iconSvg(
    size,
    strokePaths(
      "m16 17 5-5-5-5",
      "M21 12H9",
      "M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"
    )
  )
}

export function iconTrash(size = 24) {
  return iconSvg(
    size,
    strokePaths(
      "M10 11v6",
      "M14 11v6",
      "M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6",
      "M3 6h18",
      "M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"
    )
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

export function iconMoreVertical(size = 24) {
  return iconSvg(
    size,
    '<circle cx="12" cy="5" r="1.25" fill="currentColor" stroke="none"/>' +
      '<circle cx="12" cy="12" r="1.25" fill="currentColor" stroke="none"/>' +
      '<circle cx="12" cy="19" r="1.25" fill="currentColor" stroke="none"/>'
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

export function iconChevronLeft(size = 24) {
  return iconSvg(size, strokePath("m15 18-6-6 6-6"))
}

export function iconPlay(size = 24) {
  return iconSvg(
    size,
    '<path d="M10 8.5v7l6-3.5-6-3.5Z" fill="currentColor" stroke="none"/>'
  )
}

export function iconActivity(size = 24) {
  return iconSvg(
    size,
    strokePath(
      "M22 12h-2.48a2 2 0 0 0-1.93 1.46l-2.35 8.36a2 2 0 0 1-3.86 0l-2.35-8.36A2 2 0 0 0 6.49 12H2"
    )
  )
}

// --- Check-in: severity faces ---

const FACE_OUTLINE = "M12 22a10 10 0 1 0-10-10 10 10 0 0 0 10 10Z"
const FACE_EYES = "M9 9h.01M15 9h.01"

const SEVERITY_ICONS = {
  great: (size) => iconSvg(size, strokePaths(FACE_OUTLINE, FACE_EYES, "M8 14s1.5 2 4 2 4-2 4-2")),
  slight: (size) =>
    iconSvg(size, strokePaths(FACE_OUTLINE, FACE_EYES, "M8 15h8")),
  moderate: (size) =>
    iconSvg(size, strokePaths(FACE_OUTLINE, FACE_EYES, "M8 16s1.5-2 4-2 4 2 4 2")),
  severe: (size) =>
    iconSvg(size, strokePaths(FACE_OUTLINE, FACE_EYES, "M8 17s1.5-3 4-3 4 3 4 3")),
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
  neck: (size) => MOVEMENT_ICONS.neck(size),
  shoulders: (size) => MOVEMENT_ICONS.shoulder(size),
  "lower-back": (size) => MOVEMENT_ICONS["lower-back"](size),
  wrists: (size) => MOVEMENT_ICONS.wrist(size),
  eyes: (size) => MOVEMENT_ICONS.eyes(size),
}

/**
 * @param {string} areaId
 * @param {number} [size]
 */
export function bodyAreaIcon(areaId, size = 22) {
  return BODY_AREA_ICONS[areaId]?.(size) ?? iconSvg(size, strokePath("M12 12h.01"))
}

// --- Today: quick relief sessions (ids from sessions.js) ---

const MOVEMENT_ICONS = {
  neck: (size) =>
    iconSvg(
      size,
      strokePath(
        "M13.5 3a6 6 0 0 0-6 6v2a6 6 0 0 0 3 5.2V21M10.5 17h4v-3h3v-2h2l-2-3a6 6 0 0 0-4-6M15 8h.01"
      )
    ),
  wrist: (size) =>
    iconSvg(
      size,
      strokePaths(
        "M8 12V8.5a1.5 1.5 0 0 1 3 0V11",
        "M11 11V6.5a1.5 1.5 0 0 1 3 0V11",
        "M14 11V8a1.5 1.5 0 0 1 3 0v5",
        "M8 12 6.8 10.8a1.5 1.5 0 0 0-2.1 2.1l3.7 5A5 5 0 0 0 12.4 20H14a5 5 0 0 0 5-5v-3"
      )
    ),
  "lower-back": (size) =>
    iconSvg(
      size,
      '<circle cx="8" cy="5" r="2.25" stroke="currentColor" stroke-width="1.75"/>' +
        strokePaths("M8 7.5v6l4 2.5h6", "M5 12h3M5 12v8", "M12 16v4M18 16v4", "M10 9.5c2.8.2 4.5 1.8 4.5 4.5")
    ),
  shoulder: (size) =>
    iconSvg(
      size,
      '<circle cx="12" cy="5" r="2.7" stroke="currentColor" stroke-width="1.75"/>' +
        strokePaths("M12 7.7v5.8", "M4.5 20c.6-4 3.2-6.1 7.5-6.1s6.9 2.1 7.5 6.1") +
        '<path d="M5.8 17c.5-1.3 1.4-2.2 2.7-2.7M18.2 17c-.5-1.3-1.4-2.2-2.7-2.7" stroke="currentColor" stroke-width="3" stroke-linecap="round"/>'
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
 * @param {string} sessionId
 * @param {number} [size]
 */
export function sessionIcon(sessionId, size = 22) {
  return MOVEMENT_ICONS[sessionId]?.(size) ?? iconSvg(size, strokePath("M12 12h.01"))
}
