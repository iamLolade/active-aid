export const SEVERITIES = [
  { id: "great", label: "Great" },
  { id: "slight", label: "Slight discomfort" },
  { id: "moderate", label: "Moderate discomfort" },
  { id: "severe", label: "Severe discomfort" },
]

export const BODY_AREAS = [
  { id: "neck", label: "Neck" },
  { id: "shoulders", label: "Shoulders" },
  { id: "lower-back", label: "Lower back" },
  { id: "wrists", label: "Wrists" },
  { id: "eyes", label: "Eyes" },
]

export function getSeverityLabel(id) {
  return SEVERITIES.find((s) => s.id === id)?.label ?? id
}

export function getBodyAreaLabel(id) {
  return BODY_AREAS.find((a) => a.id === id)?.label ?? id
}

export function todayDateKey(date = new Date()) {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, "0")
  const d = String(date.getDate()).padStart(2, "0")
  return `${y}-${m}-${d}`
}
