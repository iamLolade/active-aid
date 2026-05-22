"use client"

import Image from "next/image"
import Link from "next/link"
import { motion, useReducedMotion } from "framer-motion"
import { LandingNav } from "@/components/landing/landing-nav"
import { Reveal } from "@/components/landing/reveal"
import { SmoothAnchor } from "@/components/landing/smooth-anchor"

export function LandingHome() {
  const reducedMotion = useReducedMotion()

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#f7f4ed] text-[#1f2937]">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10"
      >
        <div className="absolute -left-24 -top-24 h-80 w-80 rounded-full bg-[#7bae7f]/25 blur-3xl" />
        <div className="absolute -right-24 top-24 h-96 w-96 rounded-full bg-[#c97b63]/20 blur-3xl" />
        <div className="absolute bottom-0 left-1/2 h-72 w-152 -translate-x-1/2 rounded-full bg-white/70 blur-3xl" />
      </div>

      <div className="mx-auto max-w-6xl px-6 py-10 md:py-14">
        <LandingNav />

        <header className="mt-12 grid gap-10 md:grid-cols-[1.05fr_0.95fr] md:items-center">
          <Reveal>
            <p className="inline-flex items-center rounded-full border border-[#d1d5db] bg-white/70 px-3 py-1 text-xs font-semibold text-[#4b5563]">
              A calm wellness companion for modern workdays
            </p>
            <h1 className="mt-5 text-4xl font-semibold tracking-tight md:text-5xl">
              Gentle movement prompts.
              <span className="block text-[#4b5563]">
                Better workdays, one small reset at a time.
              </span>
            </h1>
            <p className="mt-5 text-[16px] leading-relaxed text-[#4b5563]">
              ActiveAid helps desk workers reduce preventable discomfort with supportive
              reminders, quick relief sessions, and a daily check-in. Lightweight, private,
              and easy to use consistently.
            </p>

            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <PrimaryButton href="/install">Get the extension</PrimaryButton>
              <SecondaryButton sectionId="features">Explore features</SecondaryButton>
            </div>

            <div className="mt-7 grid gap-3 sm:grid-cols-3">
              <Pill title="No noise" body="Snooze and control built in" />
              <Pill title="No surveillance" body="No typed content or screenshots" />
              <Pill title="Local first" body="Insights stay in your browser" />
            </div>

            <p className="mt-4 text-xs text-[#4b5563]">
              Not a medical tool. If something hurts, stop and follow your own medical
              guidance.
            </p>
          </Reveal>

          <motion.div
            initial={reducedMotion ? false : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="flex justify-center"
          >
            <Image
              src="/hero-popup.png"
              alt="ActiveAid extension popup"
              width={918}
              height={1148}
              className="relative h-auto w-full max-w-[420px] rounded-[28px] border border-[#e5e7eb] bg-white shadow-[0_18px_50px_rgba(31,41,55,0.18)]"
              priority
            />
          </motion.div>
        </header>

        <section id="features" className="scroll-mt-28 mt-16 md:mt-20">
          <Reveal>
            <SectionHeading
              eyebrow="What it does"
              title="Everything you need for gentle, consistent support"
              body="A small set of features that fit naturally into a workday. Nothing noisy. Nothing overwhelming."
            />
          </Reveal>

          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {FEATURES.map((feature, index) => (
              <Reveal key={feature.title} delay={index * 0.04}>
                <FeatureCard title={feature.title} body={feature.body} />
              </Reveal>
            ))}
          </div>
        </section>

        <section id="privacy" className="scroll-mt-28 mt-16 md:mt-20">
          <Reveal>
            <div className="rounded-3xl border border-[#d1d5db] bg-white p-8 shadow-sm transition-shadow duration-200 hover:shadow-md md:p-10">
              <SectionHeading
                eyebrow="Privacy"
                title="Designed to feel safe and non-intrusive"
                body="ActiveAid tracks activity timing to estimate active work time. It does not record content."
                compact
              />
              <div className="mt-6 grid gap-4 md:grid-cols-2">
                <CheckLine>We never record what you type.</CheckLine>
                <CheckLine>No page content is collected.</CheckLine>
                <CheckLine>No screenshots or webcam access.</CheckLine>
                <CheckLine>Insights are stored locally by default.</CheckLine>
              </div>
            </div>
          </Reveal>
        </section>

        <section id="install" className="scroll-mt-28 mt-16 md:mt-20">
          <Reveal>
            <SectionHeading
              eyebrow="Install"
              title="Two ways to roll it out"
              body="For normal users, publish to the Chrome Web Store. For early testers, load unpacked in Developer mode."
            />
          </Reveal>
          <div className="mt-8 grid gap-6 md:grid-cols-2">
            <Reveal delay={0.05}>
              <Card
                title="Option A, Chrome Web Store (recommended)"
                body="The standard install path. One click to install and automatic updates."
                bullets={[
                  "Publish publicly or unlisted",
                  "Users install without Developer mode",
                  "Automatic updates and trust signals",
                ]}
                cta={{ href: "/install", label: "View Web Store steps" }}
              />
            </Reveal>
            <Reveal delay={0.1}>
              <Card
                title="Option B, Private beta (load unpacked)"
                body="Fast for testers. Requires Developer mode and manual updates."
                bullets={[
                  "Load unpacked from the extension folder",
                  "Best for quick iteration",
                  "Manual update process for testers",
                ]}
                cta={{ href: "/install", label: "View beta steps" }}
              />
            </Reveal>
          </div>
        </section>

        <footer className="mt-16 border-t border-[#e5e7eb] pt-8 text-xs text-[#4b5563]">
          <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
            <p>ActiveAid. Wellness while you work.</p>
            <div className="flex items-center gap-4">
              <Link
                href="/install"
                className="transition-colors duration-200 hover:text-[#1f2937]"
              >
                Install
              </Link>
              <Link
                href="/api/health/supabase"
                className="transition-colors duration-200 hover:text-[#1f2937]"
              >
                Backend health
              </Link>
            </div>
          </div>
        </footer>
      </div>
    </main>
  )
}

const FEATURES = [
  {
    title: "Gentle reminders",
    body: "A calm nudge after sustained activity, with snooze and reset built in.",
  },
  {
    title: "Quick relief sessions",
    body: "Short, desk-friendly sessions with step-by-step guidance and a supportive countdown.",
  },
  {
    title: "Daily check-ins",
    body: "Log how you feel in seconds and build awareness without a heavy workflow.",
  },
  {
    title: "Simple insights",
    body: "See breaks taken, estimated active time, a check-in streak, and a small trend view.",
  },
  {
    title: "Built for focus",
    body: "No nag loops. No pressure. Just small resets you can keep doing.",
  },
  {
    title: "Calm by design",
    body: "A minimal, breathable UI that avoids corporate wellness vibes.",
  },
] as const

function PrimaryButton({
  href,
  children,
}: {
  href: string
  children: React.ReactNode
}) {
  return (
    <Link
      href={href}
      className="inline-flex h-11 items-center justify-center rounded-full bg-[#6a9d6e] px-6 text-sm font-semibold text-white shadow-sm transition-[background-color,transform,box-shadow] duration-200 hover:bg-[#5e8f62] hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#6a9d6e] active:scale-[0.98]"
    >
      {children}
    </Link>
  )
}

function SecondaryButton({
  sectionId,
  children,
}: {
  sectionId: string
  children: React.ReactNode
}) {
  return (
    <SmoothAnchor
      sectionId={sectionId}
      className="inline-flex h-11 items-center justify-center rounded-full border border-[#d1d5db] bg-white px-6 text-sm font-semibold text-[#1f2937] transition-[background-color,transform] duration-200 hover:bg-[#f3efe6] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#6a9d6e] active:scale-[0.98]"
    >
      {children}
    </SmoothAnchor>
  )
}

function SectionHeading({
  eyebrow,
  title,
  body,
  compact,
}: {
  eyebrow: string
  title: string
  body: string
  compact?: boolean
}) {
  return (
    <div className={compact ? "" : "max-w-2xl"}>
      <p className="text-xs font-semibold uppercase tracking-wide text-[#4b5563]">
        {eyebrow}
      </p>
      <h2 className="mt-3 text-2xl font-semibold tracking-tight md:text-3xl">
        {title}
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-[#4b5563]">{body}</p>
    </div>
  )
}

function Pill({ title, body }: { title: string; body: string }) {
  return (
    <div className="rounded-2xl border border-[#d1d5db] bg-white/70 p-4 shadow-sm transition-[box-shadow,transform] duration-200 hover:-translate-y-0.5 hover:shadow-md">
      <p className="text-sm font-semibold text-[#1f2937]">{title}</p>
      <p className="mt-1 text-xs text-[#4b5563]">{body}</p>
    </div>
  )
}

function FeatureCard({ title, body }: { title: string; body: string }) {
  return (
    <div className="h-full rounded-2xl border border-[#d1d5db] bg-white p-6 shadow-sm transition-[box-shadow,transform,border-color] duration-200 hover:-translate-y-0.5 hover:border-[#c5d0c6] hover:shadow-md">
      <h3 className="text-[15px] font-semibold text-[#1f2937]">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-[#4b5563]">{body}</p>
    </div>
  )
}

function CheckLine({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-3 rounded-2xl border border-[#e5e7eb] bg-[#f7f4ed] p-5">
      <span className="mt-0.5 inline-flex h-6 w-6 items-center justify-center rounded-full bg-[#e8f0e9] text-[#3d6b42]">
        ✓
      </span>
      <p className="text-sm leading-relaxed text-[#4b5563]">{children}</p>
    </div>
  )
}

function Card({
  title,
  body,
  bullets,
  cta,
}: {
  title: string
  body: string
  bullets: string[]
  cta: { href: string; label: string }
}) {
  return (
    <div className="h-full rounded-3xl border border-[#d1d5db] bg-white p-8 shadow-sm transition-[box-shadow,transform] duration-200 hover:-translate-y-0.5 hover:shadow-md">
      <h3 className="text-lg font-semibold tracking-tight">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-[#4b5563]">{body}</p>
      <ul className="mt-5 space-y-2 text-sm text-[#4b5563]">
        {bullets.map((b) => (
          <li key={b} className="flex items-start gap-2">
            <span className="mt-1 text-[#6a9d6e]">•</span>
            <span>{b}</span>
          </li>
        ))}
      </ul>
      <Link
        href={cta.href}
        className="mt-6 inline-flex h-11 items-center justify-center rounded-full border border-[#d1d5db] bg-white px-6 text-sm font-semibold text-[#1f2937] transition-[background-color,transform] duration-200 hover:bg-[#f3efe6] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#6a9d6e] active:scale-[0.98]"
      >
        {cta.label}
      </Link>
    </div>
  )
}
