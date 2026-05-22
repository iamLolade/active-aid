"use client"

import { useEffect, useState } from "react"

export function useActiveSection(sectionIds: readonly string[]) {
  const [active, setActive] = useState<string | null>(null)

  useEffect(() => {
    const elements = sectionIds
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null)

    if (!elements.length) return

    const updateActive = () => {
      if (window.scrollY < 160) {
        setActive(null)
        return
      }

      const midpoint = window.scrollY + window.innerHeight * 0.35
      let current: string | null = null

      for (const el of elements) {
        const top = el.offsetTop
        const bottom = top + el.offsetHeight
        if (midpoint >= top && midpoint < bottom) {
          current = el.id
          break
        }
      }

      setActive(current)
    }

    updateActive()
    window.addEventListener("scroll", updateActive, { passive: true })
    window.addEventListener("resize", updateActive)

    const observer = new IntersectionObserver(updateActive, {
      rootMargin: "-20% 0px -55% 0px",
      threshold: [0, 0.1, 0.25],
    })

    for (const el of elements) observer.observe(el)

    return () => {
      observer.disconnect()
      window.removeEventListener("scroll", updateActive)
      window.removeEventListener("resize", updateActive)
    }
  }, [sectionIds])

  return active
}
