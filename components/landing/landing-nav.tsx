"use client"

import Link from "next/link"
import { useReducedMotion } from "framer-motion"
import { useCallback } from "react"
import { scrollToSection } from "@/components/landing/scroll-to"
import { useActiveSection } from "@/components/landing/use-active-section"
import { BrandLockup } from "@/components/brand-lockup"

const SECTION_IDS = ["product", "features", "privacy", "install"] as const

const NAV_LINKS = [
  { id: "product", label: "Product", href: "#product" },
  { id: "features", label: "Features", href: "#features" },
  { id: "privacy", label: "Privacy", href: "#privacy" },
  { id: "install", label: "Install", href: "#install" },
] as const

export function LandingNav() {
  const reducedMotion = useReducedMotion()
  const active = useActiveSection(SECTION_IDS)

  const navigate = useCallback(
    (id: string) => {
      scrollToSection(id, { reducedMotion: reducedMotion ?? false })
    },
    [reducedMotion]
  )

  return (
    <>
      <nav
        aria-label="Landing page"
        className="fixed inset-x-0 top-0 z-50 px-3 pt-3 md:px-6 md:pt-6"
      >
        <div className="mx-auto max-w-6xl overflow-hidden rounded-2xl border border-[#e5e7eb]/90 bg-[#f7f4ed]/95 shadow-sm backdrop-blur-md md:rounded-full">
          <div className="flex items-center justify-between gap-4 px-4 py-3 md:px-5">
            <BrandLockup />

            <SectionLinks active={active} navigate={navigate} className="hidden lg:flex" />

            <Link
              href="/install"
              className="inline-flex h-10 shrink-0 items-center justify-center rounded-full bg-[#6a9d6e] px-4 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#5e8f62] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#6a9d6e] sm:px-5"
            >
              Get ActiveAid
            </Link>
          </div>
          <div className="border-t border-[#e5e7eb]/80 lg:hidden">
            <div className="overflow-x-auto px-3 py-1.5">
              <SectionLinks active={active} navigate={navigate} className="mx-auto flex w-fit" compact />
            </div>
          </div>
        </div>
      </nav>
      <div aria-hidden="true" className="h-[120px] md:h-[132px] lg:h-[88px]" />
    </>
  )
}

function SectionLinks({
  active,
  navigate,
  className,
  compact = false,
}: {
  active: string | null
  navigate: (id: string) => void
  className: string
  compact?: boolean
}) {
  return (
    <div className={`${className} items-center gap-1 text-sm text-[#4b5563]`}>
      {NAV_LINKS.map((link) => {
        const isActive = active === link.id
        return (
          <a
            key={link.id}
            href={link.href}
            aria-current={isActive ? "location" : undefined}
            onClick={(event) => {
              event.preventDefault()
              navigate(link.id)
            }}
            className={[
              "whitespace-nowrap rounded-full py-2 font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[#6a9d6e]",
              compact ? "px-3" : "px-4",
              isActive
                ? "bg-[#e3ede4] text-[#36583a]"
                : "hover:bg-white/70 hover:text-[#1f2937]",
            ].join(" ")}
          >
            {link.label}
          </a>
        )
      })}
    </div>
  )
}
