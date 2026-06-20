"use client"

import Image from "next/image"
import Link from "next/link"
import { motion, useReducedMotion } from "framer-motion"
import { LandingNav } from "@/components/landing/landing-nav"
import { Reveal } from "@/components/landing/reveal"
import { SmoothAnchor } from "@/components/landing/smooth-anchor"

const PREVIEWS = [
  { src: "/hero-popup.png", alt: "ActiveAid Today tab", label: "Today" },
  { src: "/check-in-tab.png", alt: "ActiveAid check-in tab", label: "Check-in" },
  { src: "/relief-ui.png", alt: "ActiveAid relief session", label: "Quick relief" },
  { src: "/screenshots/extension-today.png", alt: "ActiveAid insights view", label: "Insights" },
] as const

const BROWSERS = ["Chrome", "Edge", "Firefox"] as const

const FEATURES = [
  {
    num: "01",
    title: "Gentle reminders",
    body: "A calm nudge after sustained activity, with snooze and reset built in.",
  },
  {
    num: "02",
    title: "Quick relief sessions",
    body: "Short desk-friendly resets with step-by-step guidance and a supportive countdown.",
  },
  {
    num: "03",
    title: "Daily check-ins",
    body: "Log how you feel in seconds. Build awareness without a heavy workflow.",
  },
  {
    num: "04",
    title: "Simple insights",
    body: "Breaks taken, estimated active time, check-in streak, and a small 7-day trend.",
  },
  {
    num: "05",
    title: "Built for focus",
    body: "No nag loops. No guilt. Small resets you can keep doing.",
  },
  {
    num: "06",
    title: "Local first",
    body: "Your data stays in the browser by default. Optional cloud backup when you want it.",
  },
] as const

const STEPS = [
  { title: "Install", body: "Add ActiveAid from the store or load unpacked for beta testing." },
  { title: "Set your rhythm", body: "Pick a reminder interval. Enable notifications when you are ready." },
  { title: "Reset often", body: "Take quick relief sessions and log a daily check-in. Insights build over time." },
] as const

export function LandingHome() {
  const reducedMotion = useReducedMotion()

  return (
    <main className="relative min-h-screen overflow-x-hidden bg-[#f7f4ed] text-[#1f2937]">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-[#7bae7f]/20 blur-3xl" />
        <div className="absolute -right-32 top-20 h-[28rem] w-[28rem] rounded-full bg-[#c97b63]/15 blur-3xl" />
        <div className="absolute bottom-0 left-1/2 h-80 w-[36rem] -translate-x-1/2 rounded-full bg-white/60 blur-3xl" />
      </div>

      <div className="mx-auto max-w-6xl px-6 pb-16 pt-6 md:pb-24 md:pt-8">
        <LandingNav />

        <header className="mt-14 md:mt-20">
          <Reveal className="mx-auto max-w-3xl text-center">
            <p className="inline-flex items-center rounded-full border border-[#d1d5db] bg-white/80 px-3 py-1 text-xs font-semibold text-[#4b5563] backdrop-blur-sm">
              Wellness while you work · v0.2
            </p>
            <h1 className="mt-6 text-4xl font-semibold leading-[1.08] tracking-tight md:text-6xl md:leading-[1.05]">
              Gentle movement prompts.
              <span className="mt-2 block text-[#4b5563]">
                Better workdays, one small reset at a time.
              </span>
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-[#4b5563] md:text-lg">
              ActiveAid helps desk workers reduce preventable discomfort with supportive
              reminders, quick relief sessions, and a daily check-in. Lightweight, private,
              and easy to use consistently.
            </p>

            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <PrimaryButton href="/install">Get the extension</PrimaryButton>
              <SecondaryButton sectionId="product">See the product</SecondaryButton>
            </div>

            <InstallStrip />
          </Reveal>

          <motion.div
            initial={reducedMotion ? false : { opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: "easeOut", delay: 0.08 }}
            className="relative mx-auto mt-14 flex justify-center md:mt-16"
          >
            <div className="absolute inset-x-8 top-8 -z-10 h-40 rounded-full bg-[#7bae7f]/15 blur-3xl" />
            <Image
              src="/hero-popup.png"
              alt="ActiveAid extension popup on Today tab"
              width={918}
              height={1148}
              className="h-auto w-full max-w-[380px] rounded-[28px] border border-[#e5e7eb] bg-white shadow-[0_24px_60px_rgba(31,41,55,0.16)] md:max-w-[420px]"
              priority
            />
          </motion.div>
        </header>

        <section id="product" className="scroll-mt-28 mt-20 md:mt-28">
          <Reveal>
            <SectionHeading
              eyebrow="Product"
              title="Four tabs. One calm popup."
              body="Everything lives in a lightweight extension popup designed for quick daily use."
              centered
            />
          </Reveal>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {PREVIEWS.map((preview, index) => (
              <Reveal key={preview.label} delay={index * 0.05}>
                <PreviewCard {...preview} />
              </Reveal>
            ))}
          </div>
        </section>

        <section className="mt-20 md:mt-28">
          <Reveal>
            <div className="rounded-3xl border border-[#d1d5db] bg-white/70 p-8 backdrop-blur-sm md:p-10">
              <p className="text-center text-xs font-semibold uppercase tracking-[0.14em] text-[#4b5563]">
                Works in your browser
              </p>
              <h2 className="mt-3 text-center text-2xl font-semibold tracking-tight md:text-3xl">
                One extension. Chrome, Edge, and Firefox.
              </h2>
              <p className="mx-auto mt-3 max-w-xl text-center text-sm leading-relaxed text-[#4b5563]">
                Same MV3 build across Chromium and Firefox. Install from your store of choice
                or load unpacked while you test.
              </p>
              <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                {BROWSERS.map((browser) => (
                  <span
                    key={browser}
                    className="rounded-full border border-[#d1d5db] bg-[#f7f4ed] px-5 py-2 text-sm font-semibold text-[#1f2937]"
                  >
                    {browser}
                  </span>
                ))}
              </div>
            </div>
          </Reveal>
        </section>

        <section className="mt-20 md:mt-28">
          <Reveal>
            <div className="overflow-hidden rounded-[2rem] bg-[#1f2937] px-8 py-14 text-white md:px-14 md:py-16">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#9ca3af]">
                Why ActiveAid
              </p>
              <h2 className="mt-4 max-w-3xl text-3xl font-semibold leading-tight tracking-tight md:text-5xl md:leading-[1.08]">
                Skip the dashboard
                <span className="block text-[#9ca3af]">nobody opens.</span>
              </h2>
              <p className="mt-5 max-w-2xl text-sm leading-relaxed text-[#d1d5db] md:text-base">
                Most wellness tools feel like another app to manage. ActiveAid lives where you
                already work: a small popup, gentle reminders, and desk-friendly resets without
                corporate noise or surveillance.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <TrustChip>No typed content logged</TrustChip>
                <TrustChip>Snooze built in</TrustChip>
                <TrustChip>Local first</TrustChip>
              </div>
            </div>
          </Reveal>
        </section>

        <section id="features" className="scroll-mt-28 mt-20 md:mt-28">
          <Reveal>
            <SectionHeading
              eyebrow="Features"
              title="Everything you need for gentle, consistent support"
              body="A small set of capabilities that fit naturally into a workday. Nothing noisy. Nothing overwhelming."
            />
          </Reveal>
          <div className="mt-10 grid gap-4 md:grid-cols-2">
            {FEATURES.map((feature, index) => (
              <Reveal key={feature.num} delay={index * 0.04}>
                <FeatureCard {...feature} />
              </Reveal>
            ))}
          </div>
        </section>

        <section className="mt-20 md:mt-28">
          <Reveal>
            <SectionHeading
              eyebrow="How it works"
              title="Up and running in under a minute"
              body="No account required for the core experience. Install, open the popup, and get started."
            />
          </Reveal>
          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {STEPS.map((step, index) => (
              <Reveal key={step.title} delay={index * 0.05}>
                <StepCard index={index + 1} {...step} />
              </Reveal>
            ))}
          </div>
        </section>

        <section id="privacy" className="scroll-mt-28 mt-20 md:mt-28">
          <Reveal>
            <div className="rounded-3xl border border-[#d1d5db] bg-white p-8 shadow-sm md:p-10">
              <SectionHeading
                eyebrow="Privacy"
                title="Designed to feel safe and non-intrusive"
                body="ActiveAid tracks activity timing to estimate active work time. It does not record content."
                compact
              />
              <div className="mt-8 grid gap-4 md:grid-cols-2">
                <CheckLine>We never record what you type.</CheckLine>
                <CheckLine>No page content is collected.</CheckLine>
                <CheckLine>No screenshots or webcam access.</CheckLine>
                <CheckLine>Insights stay local unless you opt in to cloud backup.</CheckLine>
              </div>
              <Link
                href="/privacy"
                className="mt-8 inline-flex text-sm font-semibold text-[#3d6b42] transition-colors hover:text-[#2f5835]"
              >
                Read the privacy policy →
              </Link>
            </div>
          </Reveal>
        </section>

        <section id="install" className="scroll-mt-28 mt-20 md:mt-28">
          <Reveal>
            <SectionHeading
              eyebrow="Install"
              title="Two ways to roll it out"
              body="For normal users, publish to the Chrome Web Store. For early testers, load unpacked in Developer mode."
            />
          </Reveal>
          <div className="mt-10 grid gap-6 md:grid-cols-2">
            <Reveal delay={0.05}>
              <InstallCard
                title="Chrome Web Store (recommended)"
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
              <InstallCard
                title="Private beta (load unpacked)"
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

        <footer className="mt-20 border-t border-[#e5e7eb] pt-10">
          <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
            <div>
              <p className="text-sm font-semibold text-[#1f2937]">ActiveAid</p>
              <p className="mt-1 text-sm text-[#4b5563]">Wellness while you work.</p>
              <p className="mt-3 max-w-sm text-xs leading-relaxed text-[#4b5563]">
                Not a medical tool. If something hurts, stop and follow your own medical guidance.
              </p>
            </div>
            <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-[#4b5563]">
              <FooterLink href="/install">Install</FooterLink>
              <FooterLink href="/privacy">Privacy</FooterLink>
              <FooterLink href="#features">Features</FooterLink>
              <FooterLink href="/api/health/supabase">Backend health</FooterLink>
            </div>
          </div>
        </footer>
      </div>
    </main>
  )
}

function InstallStrip() {
  return (
    <div className="mx-auto mt-8 max-w-xl overflow-hidden rounded-2xl border border-[#d1d5db] bg-[#1f2937] text-left shadow-sm">
      <div className="flex items-center gap-2 border-b border-[#374151] px-4 py-2">
        <span className="h-2.5 w-2.5 rounded-full bg-[#f87171]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#fbbf24]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#4ade80]" />
        <span className="ml-2 text-[11px] font-medium text-[#9ca3af]">Install</span>
      </div>
      <div className="flex items-center justify-between gap-3 px-4 py-3 font-mono text-xs text-[#e5e7eb] md:text-sm">
        <code className="truncate">npm run package:extension</code>
        <Link
          href="/install"
          className="shrink-0 rounded-full bg-[#6a9d6e] px-3 py-1.5 text-[11px] font-semibold text-white transition-colors hover:bg-[#5e8f62] md:text-xs"
        >
          Guide
        </Link>
      </div>
    </div>
  )
}

function PrimaryButton({ href, children }: { href: string; children: React.ReactNode }) {
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
  centered,
}: {
  eyebrow: string
  title: string
  body: string
  compact?: boolean
  centered?: boolean
}) {
  return (
    <div className={[compact ? "" : "max-w-2xl", centered ? "mx-auto text-center" : ""].join(" ")}>
      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#4b5563]">{eyebrow}</p>
      <h2 className="mt-3 text-2xl font-semibold tracking-tight md:text-3xl">{title}</h2>
      <p className={[ "mt-3 text-sm leading-relaxed text-[#4b5563]", centered ? "mx-auto" : "" ].join(" ")}>
        {body}
      </p>
    </div>
  )
}

function PreviewCard({
  src,
  alt,
  label,
}: {
  src: string
  alt: string
  label: string
}) {
  return (
    <div className="group overflow-hidden rounded-2xl border border-[#d1d5db] bg-white shadow-sm transition-[box-shadow,transform,border-color] duration-200 hover:-translate-y-0.5 hover:border-[#c5d0c6] hover:shadow-md">
      <div className="border-b border-[#e5e7eb] bg-[#f7f4ed] px-4 py-2">
        <p className="text-xs font-semibold text-[#4b5563]">{label}</p>
      </div>
      <div className="flex justify-center bg-[#f3efe6] p-4">
        <Image
          src={src}
          alt={alt}
          width={400}
          height={500}
          className="h-auto w-full max-w-[180px] rounded-2xl border border-[#e5e7eb] bg-white shadow-sm transition-transform duration-200 group-hover:scale-[1.02]"
        />
      </div>
    </div>
  )
}

function TrustChip({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-full border border-[#374151] bg-[#111827] px-4 py-1.5 text-xs font-medium text-[#e5e7eb]">
      {children}
    </span>
  )
}

function FeatureCard({ num, title, body }: { num: string; title: string; body: string }) {
  return (
    <div className="flex h-full gap-4 rounded-2xl border border-[#d1d5db] bg-white p-6 shadow-sm transition-[box-shadow,transform,border-color] duration-200 hover:-translate-y-0.5 hover:border-[#c5d0c6] hover:shadow-md">
      <span className="font-mono text-xs font-semibold text-[#6a9d6e]">{num}</span>
      <div>
        <h3 className="text-[15px] font-semibold text-[#1f2937]">{title}</h3>
        <p className="mt-2 text-sm leading-relaxed text-[#4b5563]">{body}</p>
      </div>
    </div>
  )
}

function StepCard({
  index,
  title,
  body,
}: {
  index: number
  title: string
  body: string
}) {
  return (
    <div className="h-full rounded-2xl border border-[#d1d5db] bg-white/80 p-6 backdrop-blur-sm">
      <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-[#e8f0e9] text-sm font-semibold text-[#3d6b42]">
        {index}
      </span>
      <h3 className="mt-4 text-base font-semibold text-[#1f2937]">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-[#4b5563]">{body}</p>
    </div>
  )
}

function CheckLine({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-3 rounded-2xl border border-[#e5e7eb] bg-[#f7f4ed] p-5">
      <span className="mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#e8f0e9] text-[#3d6b42]">
        ✓
      </span>
      <p className="text-sm leading-relaxed text-[#4b5563]">{children}</p>
    </div>
  )
}

function InstallCard({
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
    <div className="flex h-full flex-col rounded-3xl border border-[#d1d5db] bg-white p-8 shadow-sm transition-[box-shadow,transform] duration-200 hover:-translate-y-0.5 hover:shadow-md">
      <h3 className="text-lg font-semibold tracking-tight">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-[#4b5563]">{body}</p>
      <ul className="mt-5 flex-1 space-y-2 text-sm text-[#4b5563]">
        {bullets.map((bullet) => (
          <li key={bullet} className="flex items-start gap-2">
            <span className="mt-1 text-[#6a9d6e]">•</span>
            <span>{bullet}</span>
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

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link href={href} className="transition-colors duration-200 hover:text-[#1f2937]">
      {children}
    </Link>
  )
}
