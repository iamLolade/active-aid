"use client"

import Image from "next/image"
import Link from "next/link"
import { useReducedMotion } from "framer-motion"
import { useCallback } from "react"
import { scrollToSection } from "@/components/landing/scroll-to"
import { useActiveSection } from "@/components/landing/use-active-section"

const SECTION_IDS = ["features", "privacy", "install"] as const

const NAV_LINKS = [
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
    <nav className="flex items-center justify-between">
      <Link href="/" className="flex items-center gap-3">
        <Image
          src="/active-aid_logo.png"
          alt="ActiveAid"
          width={40}
          height={40}            className="rounded-2xl"
            priority
          />
          <div className="leading-tight">
            <div className="text-sm font-semibold tracking-tight">ActiveAid</div>
            <div className="text-xs text-[#4b5563]">Wellness while you work</div>
          </div>
        </Link>

      <div className="hidden items-center gap-6 text-sm text-[#4b5563] md:flex">
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
        <Link
          href="/install"
          className="inline-flex h-10 items-center justify-center rounded-full bg-[#6a9d6e] px-5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#5e8f62]"
        >
          Get ActiveAid
        </Link>
      </div>
    </nav>
  )
}
