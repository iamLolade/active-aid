"use client"

import Image from "next/image"
import Link from "next/link"
import { useReducedMotion } from "framer-motion"
import { useCallback } from "react"
import { scrollToSection } from "@/components/landing/scroll-to"
import { useActiveSection } from "@/components/landing/use-active-section"

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
    <nav className="sticky top-0 z-20 -mx-6 border-b border-[#e5e7eb]/80 bg-[#f7f4ed]/85 px-6 py-4 backdrop-blur-md md:-mx-0 md:rounded-full md:border md:px-5 md:py-3">
      <div className="flex items-center justify-between gap-4">
        <Link href="/" className="flex min-w-0 items-center gap-3">
          <Image
            src="/active-aid_logo.png"
            alt="ActiveAid"
            width={40}
            height={40}
            className="rounded-2xl"
            priority
          />
          <div className="min-w-0 leading-tight">
            <div className="truncate text-sm font-semibold tracking-tight">ActiveAid</div>
            <div className="hidden truncate text-xs text-[#4b5563] sm:block">
              Wellness while you work
            </div>
          </div>
        </Link>

        <div className="hidden items-center gap-5 text-sm text-[#4b5563] lg:flex">
          {NAV_LINKS.map((link) => (
            <a
              key={link.id}
              href={link.href}
              aria-current={active === link.id ? "location" : undefined}
              onClick={(event) => {
                event.preventDefault()
                navigate(link.id)
              }}
              className={[
                "transition-colors hover:text-[#1f2937]",
                active === link.id ? "font-semibold text-[#1f2937]" : "",
              ].join(" ")}
            >
              {link.label}
            </a>
          ))}
        </div>

        <Link
          href="/install"
          className="inline-flex h-10 shrink-0 items-center justify-center rounded-full bg-[#6a9d6e] px-4 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#5e8f62] sm:px-5"
        >
          Get ActiveAid
        </Link>
      </div>
    </nav>
  )
}
