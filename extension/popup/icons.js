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

/** @param {string} d */
function movementPath(d) {
  return `<path d="${d}" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"/>`
}

/** @param {string[]} paths */
function movementPaths(...paths) {
  return paths.map(movementPath).join("")
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

export function iconCalendarDays(size = 24) {
  return iconSvg(
    size,
    strokePaths(
      "M8 2v4",
      "M16 2v4",
      "M3 10h18",
      "M5 4h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Z",
      "M8 14h.01",
      "M12 14h.01",
      "M16 14h.01",
      "M8 18h.01",
      "M12 18h.01"
    )
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

export function iconTimer(size = 24) {
  return iconSvg(
    size,
    strokePaths(
      "M10 2h4",
      "M12 14l3-3",
      "M20 14a8 8 0 1 1-16 0 8 8 0 0 1 16 0Z"
    )
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

export function iconBreakComplete(size = 24) {
  return iconSvg(
    size,
    strokePaths(
      "M21.8 10A10 10 0 1 1 17 3.34",
      "m9 11 3 3L22 4"
    )
  )
}

export function iconDeskActivity(size = 24) {
  return iconSvg(
    size,
    strokePaths(
      "M18 5a2 2 0 0 1 2 2v8.5H4V7a2 2 0 0 1 2-2h12Z",
      "M2 18h20",
      "M9 18v1h6v-1"
    )
  )
}

export function iconStreak(size = 24) {
  return iconSvg(
    size,
    strokePath(
      "M12 3s1 4 4 6.5 3 3.5 3 5.5a7 7 0 0 1-14 0c0-1.1.35-2.1 1-3a5 5 0 0 0 5 0c0-2-1.5-3-1.5-5 0-1.35.83-2.68 2.5-4Z"
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
      '<ellipse cx="12" cy="7" rx="4" ry="5" stroke="currentColor" stroke-width="1.9"/>' +
        movementPaths(
          "M8.7 10.5v2.1c0 1.4-.7 2.3-2.4 3C4.1 16.4 3 18.1 3 21",
          "M15.3 10.5v2.1c0 1.4.7 2.3 2.4 3 2.2.8 3.3 2.5 3.3 5.4",
          "M6 11.5 4.2 10.4",
          "M5.7 14H3.5",
          "m18 11.5 1.8-1.1",
          "M18.3 14h2.2"
        )
    ),
  wrist: (size) =>
    iconSvg(
      size,
      movementPaths(
        "M8 12V8.5a1.5 1.5 0 0 1 3 0V11",
        "M11 11V6.5a1.5 1.5 0 0 1 3 0V11",
        "M14 11V8a1.5 1.5 0 0 1 3 0v5",
        "M8 12 6.8 10.8a1.5 1.5 0 0 0-2.1 2.1l3.7 5A5 5 0 0 0 12.4 20H14a5 5 0 0 0 5-5v-3",
        "m6 17-2 1",
        "M6.2 19.5H4",
        "m18 17 2 1",
        "M17.8 19.5H20"
      )
    ),
  "lower-back": (size) =>
    iconSvg(
      size,
      movementPaths(
        "M5 3c.5 2.8 1 5.6 1 8 0 2.2-.9 3.9-1.5 5.6-.5 1.4-.7 2.8-.7 4.4",
        "M19 3c-.5 2.8-1 5.6-1 8 0 2.2.9 3.9 1.5 5.6.5 1.4.7 2.8.7 4.4",
        "M5.5 18.6c2.2-1.3 4.3-1.3 6.5-.2 2.2-1.1 4.3-1.1 6.5.2",
        "M12 9v2",
        "m8.5 10.5 1.5 1.3",
        "m15.5 10.5-1.5 1.3"
      ) +
        '<circle cx="12" cy="14" r="1.7" stroke="currentColor" stroke-width="1.9"/>' +
        '<circle cx="12" cy="14" r=".55" fill="currentColor"/>'
    ),
  shoulder: (size) =>
    iconSvg(
      size,
      '<circle cx="12" cy="5" r="3" stroke="currentColor" stroke-width="1.9"/>' +
        movementPaths(
          "M9.2 7c-.2 1.6-.9 2.5-2.4 3C4.2 10.9 3 14.2 3 19",
          "M14.8 7c.2 1.6.9 2.5 2.4 3 2.6.9 3.8 4.2 3.8 9",
          "M6.2 14.5V19",
          "M17.8 14.5V19",
          "M4.6 8.6 3 7",
          "M4 11H2",
          "m19.4 8.6 1.6-1.6",
          "M20 11h2"
        )
    ),
  eyes: (size) =>
    iconSvg(
      size,
      movementPaths(
        "M2 13s3.5-6 10-6 10 6 10 6-3.5 6-10 6-10-6-10-6Z",
        "M12 16a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z",
        "M8 4.5 7 3",
        "M12 4V2",
        "m16 4.5 1-1.5"
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
