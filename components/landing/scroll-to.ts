import { animate } from "framer-motion"

export const LANDING_NAV_OFFSET = 80
export const LANDING_MOBILE_NAV_OFFSET = 80

export function getLandingNavOffset() {
  return window.innerWidth < 1024 ? LANDING_MOBILE_NAV_OFFSET : LANDING_NAV_OFFSET
}

export function scrollToSection(
  id: string,
  options?: {
    offset?: number
    reducedMotion?: boolean
    focus?: boolean
    updateHash?: boolean
  }
) {
  const el = document.getElementById(id)
  if (!el) return

  const offset = options?.offset ?? getLandingNavOffset()
  const top = el.getBoundingClientRect().top + window.scrollY - offset
  const finishNavigation = () => {
    if (options?.updateHash !== false && window.location.hash !== `#${id}`) {
      window.history.replaceState(null, "", `#${id}`)
    }

    if (options?.focus === false) return

    const hadTabIndex = el.hasAttribute("tabindex")
    if (!hadTabIndex) el.tabIndex = -1
    el.focus({ preventScroll: true })

    if (!hadTabIndex) {
      el.addEventListener("blur", () => el.removeAttribute("tabindex"), { once: true })
    }
  }

  if (options?.reducedMotion) {
    window.scrollTo({ top, behavior: "auto" })
    finishNavigation()
    return
  }

  animate(window.scrollY, top, {
    duration: 0.55,
    ease: [0.22, 1, 0.36, 1],
    onUpdate: (y) => window.scrollTo(0, y),
    onComplete: finishNavigation,
  })
}
