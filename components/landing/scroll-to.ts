import { animate } from "framer-motion"

export const LANDING_NAV_OFFSET = 88
export const LANDING_MOBILE_NAV_OFFSET = 116

export function getLandingNavOffset() {
  return window.innerWidth < 1024 ? LANDING_MOBILE_NAV_OFFSET : LANDING_NAV_OFFSET
}

export function scrollToSection(
  id: string,
  options?: { offset?: number; reducedMotion?: boolean }
) {
  const el = document.getElementById(id)
  if (!el) return

  const offset = options?.offset ?? getLandingNavOffset()
  const top = el.getBoundingClientRect().top + window.scrollY - offset

  if (options?.reducedMotion) {
    window.scrollTo({ top, behavior: "auto" })
    return
  }

  animate(window.scrollY, top, {
    duration: 0.55,
    ease: [0.22, 1, 0.36, 1],
    onUpdate: (y) => window.scrollTo(0, y),
  })
}
