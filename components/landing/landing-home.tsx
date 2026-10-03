"use client"

import Link from "next/link"
import { motion, useReducedMotion } from "framer-motion"
import { Activity, Bell, ChevronRight, Clock3, HeartPulse, LockKeyhole } from "lucide-react"
import { LandingNav } from "@/components/landing/landing-nav"
import { Reveal } from "@/components/landing/reveal"
import { SmoothAnchor } from "@/components/landing/smooth-anchor"

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
  { title: "Install", body: "Add ActiveAid to Chrome when the public listing is available." },
  { title: "Choose your rhythm", body: "Review the privacy disclosure, then choose whether to enable reminders." },
  { title: "Take a small reset", body: "Open a suggested relief session from a reminder or whenever you need one." },
] as const

export function LandingHome({ storeUrl }: { storeUrl?: string }) {
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

        <header className="mt-10 md:mt-14">
          <Reveal className="mx-auto max-w-3xl text-center">
            <p className="inline-flex items-center rounded-full border border-[#d1d5db] bg-white/80 px-3 py-1 text-xs font-semibold text-[#4b5563] backdrop-blur-sm">
              A calm wellness companion for desk work
            </p>
            <h1 className="mt-5 text-4xl font-semibold leading-[1.08] tracking-tight md:text-6xl md:leading-[1.05]">
              Gentle movement prompts.
              <span className="mt-2 block text-[#4b5563]">
                Better workdays, one small reset at a time.
              </span>
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-[#4b5563] md:text-lg">
              ActiveAid supports workplace wellness habits with gentle reminders, guided relief
              sessions, and a simple daily check-in. It is lightweight, local-first, and designed
              to stay out of your way.
            </p>

            <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <PrimaryButton href={storeUrl || "/install"} external={Boolean(storeUrl)}>
                {storeUrl ? "Add to Chrome" : "Check availability"}
              </PrimaryButton>
              <SecondaryButton sectionId="product">See the product</SecondaryButton>
            </div>

            <AvailabilityNote available={Boolean(storeUrl)} />
          </Reveal>

          <motion.div
            initial={reducedMotion ? false : { opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: "easeOut", delay: 0.08 }}
            className="relative mx-auto mt-10 flex justify-center md:mt-12"
          >
            <div className="absolute inset-x-8 top-8 -z-10 h-40 rounded-full bg-[#7bae7f]/15 blur-3xl" />
            <ProductPreview />
          </motion.div>
        </header>

        <section id="product" className="scroll-mt-28 mt-20 md:mt-28">
          <Reveal>
            <SectionHeading
              eyebrow="Product"
              title="From reminder to relief, without breaking your flow"
              body="Each prompt gives you a clear next step. Open a short session, snooze, or carry on with your day."
              centered
            />
          </Reveal>
          <div className="mt-10 grid gap-4 md:grid-cols-3">
            <JourneyCard icon={Bell} title="A gentle nudge" body="Reminders appear only after your chosen amount of active time." />
            <JourneyCard icon={HeartPulse} title="One clear action" body="Go straight to a short, desk-friendly relief session when you want it." />
            <JourneyCard icon={Activity} title="A useful pattern" body="Check-ins and completed sessions build simple, private insights over time." />
          </div>
        </section>

        <section className="mt-20 md:mt-28">
          <Reveal>
            <div className="rounded-3xl border border-[#d1d5db] bg-white/70 p-8 backdrop-blur-sm md:p-10">
              <p className="text-center text-xs font-semibold uppercase tracking-[0.14em] text-[#4b5563]">
                Release focus
              </p>
              <h2 className="mt-3 text-center text-2xl font-semibold tracking-tight md:text-3xl">
                Built for a careful Chrome launch.
              </h2>
              <p className="mx-auto mt-3 max-w-xl text-center text-sm leading-relaxed text-[#4b5563]">
                ActiveAid is being prepared for the Chrome Web Store. Other browser releases
                will follow after their behavior has been fully verified.
              </p>
              <div className="mx-auto mt-7 flex w-fit items-center gap-3 rounded-full border border-[#cfdccf] bg-[#edf4ed] px-4 py-2 text-sm font-semibold text-[#36583a]">
                <span className="h-2 w-2 rounded-full bg-[#6a9d6e]" aria-hidden="true" />
                Chrome Web Store release in progress
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
              title="A simple start, with you in control"
              body="No account is required for the core experience. Activity timing starts only after you review the disclosure and agree."
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
              title={storeUrl ? "Ready when you are" : "Public release is being prepared"}
              body={storeUrl ? "Install ActiveAid from its verified Chrome Web Store listing." : "The Chrome listing is not live yet. The install page will link directly to the verified listing when it is available."}
            />
          </Reveal>
          <Reveal delay={0.05}>
            <div className="mt-10 flex flex-col items-start justify-between gap-6 rounded-3xl border border-[#d1d5db] bg-white p-8 shadow-sm sm:flex-row sm:items-center">
              <div>
                <p className="text-base font-semibold text-[#1f2937]">Chrome extension</p>
                <p className="mt-2 max-w-2xl text-sm leading-relaxed text-[#4b5563]">
                  {storeUrl ? "Install securely from the Chrome Web Store and receive automatic updates." : "Install from the Chrome Web Store for automatic updates and a familiar permission flow once the listing is live."}
                </p>
              </div>
              <PrimaryButton href={storeUrl || "/install"} external={Boolean(storeUrl)}>
                {storeUrl ? "Add to Chrome" : "View release status"}
              </PrimaryButton>
            </div>
          </Reveal>
        </section>

        <footer className="mt-20 border-t border-[#e5e7eb] pt-10">
          <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
            <div>
              <p className="text-sm font-semibold text-[#1f2937]">ActiveAid</p>
              <p className="mt-1 text-sm text-[#4b5563]">Wellness while you work.</p>
              <p className="mt-3 max-w-sm text-xs leading-relaxed text-[#4b5563]">
                ActiveAid supports workplace wellness habits. It is not a medical, diagnostic, or
                therapeutic tool. If something hurts, stop and follow your own medical guidance.
              </p>
            </div>
            <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-[#4b5563]">
              <FooterLink href="/install">Install</FooterLink>
              <FooterLink href="/privacy">Privacy</FooterLink>
              <FooterLink href="/support">Support</FooterLink>
              <FooterLink href="#features">Features</FooterLink>
            </div>
          </div>
        </footer>
      </div>
    </main>
  )
}

function AvailabilityNote({ available }: { available: boolean }) {
  return (
    <p className="mx-auto mt-4 flex w-fit items-center gap-2 text-sm text-[#4b5563]">
      <LockKeyhole className="h-4 w-4 text-[#527d57]" aria-hidden="true" />
      {available ? "Secure install from the Chrome Web Store" : "Chrome Web Store release in progress"}
    </p>
  )
}

function PrimaryButton({ href, children, external = false }: { href: string; children: React.ReactNode; external?: boolean }) {
  return (
    <Link
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
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

function ProductPreview() {
  return (
    <div aria-label="Illustration of the ActiveAid extension home view" className="w-full max-w-[410px] overflow-hidden rounded-[28px] border border-[#d1d5db] bg-[#f8faf8] text-left shadow-[0_24px_60px_rgba(31,41,55,0.16)]">
      <div className="border-b border-[#e5e7eb] bg-white px-6 py-5">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#dfeadf] text-[#36583a]"><Activity className="h-5 w-5" aria-hidden="true" /></span>
          <div><p className="font-semibold">ActiveAid</p><p className="text-xs text-[#6b7280]">Wellness while you work.</p></div>
        </div>
      </div>
      <div className="space-y-3 p-5">
        <div className="rounded-2xl bg-[#e9f1e9] p-5">
          <div className="flex items-start justify-between gap-4"><div><p className="text-xs text-[#4b5563]">You&apos;ve been active for</p><p className="mt-1 text-4xl font-semibold tracking-tight">0m</p></div><span className="rounded-full bg-white/80 px-3 py-1 text-xs font-semibold text-[#36583a]">Reminders on</span></div>
          <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-white"><div className="h-full w-0 rounded-full bg-[#6a9d6e]" /></div>
        </div>
        <div className="flex items-center gap-3 rounded-2xl border border-[#e5e7eb] bg-white p-4">
          <HeartPulse className="h-5 w-5 text-[#527d57]" aria-hidden="true" />
          <div className="min-w-0 flex-1"><p className="text-sm font-semibold">Daily check-in</p><p className="truncate text-xs text-[#6b7280]">Log how your body feels today.</p></div>
          <span className="flex items-center text-xs font-semibold text-[#36583a]">Check in <ChevronRight className="h-4 w-4" aria-hidden="true" /></span>
        </div>
        <div className="rounded-2xl border border-[#e5e7eb] bg-white p-4">
          <div className="flex items-center justify-between"><p className="text-sm font-semibold">Quick Relief</p><span className="text-xs font-semibold text-[#527d57]">View all</span></div>
          <p className="mt-1 text-xs text-[#6b7280]">Short guided resets you can do at your desk.</p>
          <div className="mt-3 flex items-center gap-3 rounded-xl bg-[#f7f4ed] p-3"><Clock3 className="h-5 w-5 text-[#c97b63]" aria-hidden="true" /><div className="flex-1"><p className="text-xs font-semibold">Neck &amp; shoulder reset</p><p className="text-[11px] text-[#6b7280]">2 min · 4 gentle steps</p></div><ChevronRight className="h-4 w-4 text-[#6b7280]" aria-hidden="true" /></div>
        </div>
      </div>
    </div>
  )
}

function JourneyCard({ icon: Icon, title, body }: { icon: typeof Bell; title: string; body: string }) {
  return (
    <Reveal>
      <div className="h-full rounded-2xl border border-[#d1d5db] bg-white p-6 shadow-sm">
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#e8f0e9] text-[#3d6b42]"><Icon className="h-5 w-5" aria-hidden="true" /></span>
        <h3 className="mt-5 text-base font-semibold">{title}</h3>
        <p className="mt-2 text-sm leading-relaxed text-[#4b5563]">{body}</p>
      </div>
    </Reveal>
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

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link href={href} className="transition-colors duration-200 hover:text-[#1f2937]">
      {children}
    </Link>
  )
}
