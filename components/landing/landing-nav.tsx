"use client"

import Link from "next/link"
import { useReducedMotion } from "framer-motion"
import { Menu, X } from "lucide-react"
import { useCallback, useEffect, useState } from "react"
import { scrollToSection } from "@/components/landing/scroll-to"
import { useActiveSection } from "@/components/landing/use-active-section"
import { BrandLockup } from "@/components/brand-lockup"

const SECTION_IDS = ["product", "features", "privacy", "faq"] as const

const NAV_LINKS = [
  { id: "product", label: "Product", href: "#product" },
  { id: "features", label: "Features", href: "#features" },
  { id: "privacy", label: "Privacy", href: "#privacy" },
  { id: "faq", label: "FAQ", href: "#faq" },
] as const

export function LandingNav({
  primaryHref,
  primaryLabel,
  primaryExternal = false,
}: {
  primaryHref: string
  primaryLabel: string
  primaryExternal?: boolean
}) {
  const reducedMotion = useReducedMotion()
  const active = useActiveSection(SECTION_IDS)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    if (!menuOpen) return

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false)
    }

    window.addEventListener("keydown", closeOnEscape)
    return () => window.removeEventListener("keydown", closeOnEscape)
  }, [menuOpen])

  const navigate = useCallback(
    (id: string) => {
      setMenuOpen(false)
      scrollToSection(id, { reducedMotion: reducedMotion ?? false })
    },
    [reducedMotion]
  )

  return (
    <nav
      aria-label="Landing page"
      className="fixed inset-x-0 top-0 z-50 border-b border-[#dedbd2] bg-[#f7f4ed]/95 backdrop-blur-md"
    >
      <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
        <div className="flex h-[72px] items-center justify-between gap-4">
          <BrandLockup />

          <SectionLinks active={active} navigate={navigate} className="hidden md:flex" />

          <div className="flex items-center gap-2">
            <Link
              href={primaryHref}
              target={primaryExternal ? "_blank" : undefined}
              rel={primaryExternal ? "noopener noreferrer" : undefined}
              className="hidden h-10 shrink-0 items-center justify-center rounded-full bg-[#3f7547] px-5 text-sm font-semibold text-white shadow-sm transition-[background-color,transform] hover:bg-[#315f38] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#3f7547] active:scale-[0.98] sm:inline-flex"
            >
              {primaryLabel}
            </Link>

            <button
              type="button"
              aria-expanded={menuOpen}
              aria-controls="landing-mobile-menu"
              aria-label={menuOpen ? "Close navigation" : "Open navigation"}
              onClick={() => setMenuOpen((open) => !open)}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#cfcdc5] bg-white text-[#1f2937] transition-colors hover:bg-[#efebe2] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#3f7547] md:hidden"
            >
              {menuOpen ? <X className="h-5 w-5" aria-hidden="true" /> : <Menu className="h-5 w-5" aria-hidden="true" />}
            </button>
          </div>
        </div>

        <div
          id="landing-mobile-menu"
          hidden={!menuOpen}
          className="border-t border-[#dedbd2] pb-5 pt-3 md:hidden"
        >
          <SectionLinks active={active} navigate={navigate} className="flex flex-col items-stretch" />
          <Link
            href={primaryHref}
            target={primaryExternal ? "_blank" : undefined}
            rel={primaryExternal ? "noopener noreferrer" : undefined}
            onClick={() => setMenuOpen(false)}
            className="mt-3 inline-flex h-11 w-full items-center justify-center rounded-full bg-[#3f7547] px-5 text-sm font-semibold text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#3f7547] sm:hidden"
          >
            {primaryLabel}
          </Link>
        </div>
      </div>
    </nav>
  )
}

function SectionLinks({
  active,
  navigate,
  className,
}: {
  active: string | null
  navigate: (id: string) => void
  className: string
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
              "relative whitespace-nowrap rounded-lg px-3 py-2.5 font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[#3f7547] md:rounded-none md:px-3 md:py-6",
              isActive
                ? "bg-[#e8eee6] text-[#315f38] md:bg-transparent md:after:absolute md:after:inset-x-3 md:after:bottom-0 md:after:h-0.5 md:after:bg-[#3f7547]"
                : "hover:bg-white/70 hover:text-[#1f2937] md:hover:bg-transparent",
            ].join(" ")}
          >
            {link.label}
          </a>
        )
      })}
    </div>
  )
}
