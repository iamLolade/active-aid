"use client"

import { useEffect, useState } from "react"
import { getLandingNavOffset } from "@/components/landing/scroll-to"

export function useActiveSection(sectionIds: readonly string[]) {
  const [active, setActive] = useState<string | null>(null)

  useEffect(() => {
    const elements = sectionIds
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null)

    if (!elements.length) return

    const updateActive = () => {
      const navOffset = getLandingNavOffset()
      const activationLine = navOffset + 48

      if (elements[0].getBoundingClientRect().top > activationLine) {
        setActive(null)
        return
      }

      let current = elements[0].id

      for (const el of elements) {
        if (el.getBoundingClientRect().top > activationLine) break
        current = el.id
      }

      setActive(current)
    }

    let animationFrame = 0
    const scheduleUpdate = () => {
      if (animationFrame) return
      animationFrame = window.requestAnimationFrame(() => {
        animationFrame = 0
        updateActive()
      })
    }

    updateActive()
    window.addEventListener("scroll", scheduleUpdate, { passive: true })
    window.addEventListener("resize", scheduleUpdate)

    return () => {
      window.cancelAnimationFrame(animationFrame)
      window.removeEventListener("scroll", scheduleUpdate)
      window.removeEventListener("resize", scheduleUpdate)
    }
  }, [sectionIds])

  return active
}
