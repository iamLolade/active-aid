"use client"

import { useReducedMotion } from "framer-motion"
import type { ComponentPropsWithoutRef } from "react"
import { scrollToSection } from "@/components/landing/scroll-to"

type SmoothAnchorProps = ComponentPropsWithoutRef<"a"> & {
  sectionId: string
}

export function SmoothAnchor({
  sectionId,
  href,
  onClick,
  children,
  ...props
}: SmoothAnchorProps) {
  const reducedMotion = useReducedMotion()

  return (
    <a
      href={href ?? `#${sectionId}`}
      onClick={(event) => {
        event.preventDefault()
        scrollToSection(sectionId, { reducedMotion: reducedMotion ?? false })
        onClick?.(event)
      }}
      {...props}
    >
      {children}
    </a>
  )
}
