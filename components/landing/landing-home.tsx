"use client"

import Image from "next/image"
import Link from "next/link"
import { useState } from "react"
import { motion, useReducedMotion } from "framer-motion"
import {
  Check,
  Clock3,
  Cloud,
  EyeOff,
  HardDrive,
  Leaf,
  LockKeyhole,
  ShieldCheck,
} from "lucide-react"
import type { LucideIcon } from "lucide-react"
import { LandingNav } from "@/components/landing/landing-nav"
import { Reveal } from "@/components/landing/reveal"
import { SmoothAnchor } from "@/components/landing/smooth-anchor"
import type { ChromeStoreRelease } from "@/lib/chrome-store"

const FEATURES = [
  {
    num: "01",
    title: "Your timing, your choice",
    body: "Choose your reminder interval, snooze a nudge, pause reminders, or restart the timer whenever you need to.",
  },
  {
    num: "02",
    title: "Useful without an account",
    body: "Reminders, relief sessions, check-ins, and local insights all work without signing in.",
  },
  {
    num: "03",
    title: "Private by default",
    body: "Wellness data stays in your browser unless you sign in and separately enable optional cloud backup.",
  },
] as const

const PRODUCT_STORIES = [
  {
    number: "1",
    title: "Set your rhythm",
    body: "Choose a reminder interval that fits your day, then pause, snooze, or restart it whenever work changes.",
    image: "/screenshots/settings.png",
    alt: "ActiveAid Settings view showing adjustable reminder timing and pause controls",
  },
  {
    number: "2",
    title: "Work until a gentle nudge",
    body: "ActiveAid stays quiet while you work, then offers a clear route to a short guided reset.",
    image: "/screenshots/relief-session.png",
    alt: "ActiveAid Neck Relief session showing step progress, timing, and movement guidance",
  },
  {
    number: "3",
    title: "Check in when it suits you",
    body: "Log how your body feels in a few taps, without turning wellness into another task to manage.",
    image: "/screenshots/check-in.png",
    alt: "ActiveAid daily check-in for recording an overall feeling and areas to note",
  },
  {
    number: "4",
    title: "Notice simple patterns",
    body: "Your local history turns breaks, relief sessions, and check-ins into a useful seven-day view.",
    image: "/screenshots/insight.png",
    alt: "ActiveAid Insights view showing a concise summary of local wellness activity",
  },
] as const

const PRIVACY_POINTS = [
  {
    icon: HardDrive,
    title: "Local by default",
    body: "Reminder settings, check-ins, relief history, and simple insights stay in extension storage on this device.",
  },
  {
    icon: EyeOff,
    title: "Your content is not recorded",
    body: "ActiveAid detects that activity happened. It does not record typed text, page content, URLs, screenshots, or camera data.",
  },
  {
    icon: Cloud,
    title: "Backup requires a separate choice",
    body: "Signing in alone does not upload wellness data. Cloud backup starts only after you explicitly enable it in Settings.",
  },
  {
    icon: ShieldCheck,
    title: "You keep control",
    body: "Export or erase local data at any time. Activity timing never leaves your device, even when backup is enabled.",
  },
] as const

const FAQS = [
  {
    question: "What activity does ActiveAid track?",
    answer:
      "ActiveAid detects that keyboard, mouse, scroll, or tab-focus activity occurred so it can estimate active time. It does not record typed text, page content, URLs, screenshots, or camera data.",
  },
  {
    question: "Do I need an account?",
    answer:
      "No. Reminders, relief sessions, daily check-ins, and local insights work without an account.",
  },
  {
    question: "When does cloud backup start?",
    answer:
      "Signing in does not turn backup on. Backup starts only after you separately enable it in Settings. Check-ins, completed sessions, and reminder settings can then sync, while activity timing stays on your device.",
  },
  {
    question: "Why does ActiveAid need access to webpages?",
    answer:
      "A lightweight content script detects activity timing across the webpages where you work. ActiveAid does not read, store, or transmit page content.",
  },
  {
    question: "Is ActiveAid a medical tool?",
    answer:
      "No. ActiveAid supports workplace wellness habits. It is not a medical, diagnostic, or therapeutic tool. Stop any movement if it hurts and follow your own medical guidance.",
  },
] as const

export function LandingHome({ release }: { release: ChromeStoreRelease }) {
  const reducedMotion = useReducedMotion()
  const liveStoreUrl = release.status === "live" ? release.storeUrl : undefined
  const isLive = Boolean(liveStoreUrl)
  const primaryHref = liveStoreUrl ?? "/install"
  const primaryLabel = isLive
    ? "Add to Chrome"
    : release.status === "review"
      ? "View review status"
      : "Check availability"
  const installCopy = isLive
    ? {
        title: "Ready when you are",
        body: "Install ActiveAid from its verified Chrome Web Store listing.",
        detail: "Install securely from the Chrome Web Store and receive automatic updates.",
      }
    : release.status === "review"
      ? {
          title: "Chrome Web Store review is underway",
          body: "ActiveAid has been submitted to Google. Installation will open as soon as the listing is approved.",
          detail: "Review is in progress. No manual installation or Developer mode is required.",
        }
      : {
          title: "Chrome availability is coming soon",
          body: "The install page will show the verified Chrome Web Store listing when it is available.",
          detail: "Installation will be handled securely through the Chrome Web Store.",
        }

  return (
    <main className="relative min-h-screen overflow-x-hidden bg-[#f7f4ed] text-[#1f2937]">
      <LandingNav
        primaryHref={primaryHref}
        primaryLabel={primaryLabel}
        primaryExternal={isLive}
      />

      <div className="mx-auto max-w-7xl px-5 pb-16 pt-[72px] sm:px-6 md:pb-24 lg:px-8">
        <header className="grid min-h-[calc(100svh-72px)] items-center gap-12 py-12 lg:grid-cols-[0.96fr_1.04fr] lg:gap-8 lg:py-14">
          <Reveal className="max-w-[640px] text-left">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#3f6846]">
              Workplace wellness, without the extra noise
            </p>
            <h1 className="mt-6 text-balance text-[clamp(2.65rem,4.7vw,4.1rem)] font-semibold leading-[0.99] tracking-[-0.04em] text-[#172133]">
              Small movement breaks that fit your workday.
            </h1>
            <p className="mt-6 max-w-lg text-pretty text-base leading-relaxed text-[#586273] md:text-lg">
              Gentle reminders, short guided relief sessions, daily check-ins, and simple local
              insights. No account required.
            </p>

            <div className="mt-8 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center">
              <PrimaryButton href={primaryHref} external={isLive}>
                {primaryLabel}
              </PrimaryButton>
              <SecondaryButton sectionId="product">See how it works</SecondaryButton>
            </div>
            <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-[#586273]">
              <span className="inline-flex items-center gap-2">
                <LockKeyhole className="h-4 w-4 text-[#3f7547]" aria-hidden="true" />
                Local-first
              </span>
              <span aria-hidden="true" className="hidden h-1 w-1 rounded-full bg-[#a1a7ae] sm:block" />
              <span>No typed content logged</span>
            </div>
            <AvailabilityNote status={release.status} />
          </Reveal>

          <motion.div
            initial={reducedMotion ? false : { opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: "easeOut", delay: 0.08 }}
            className="relative mx-auto flex w-full max-w-[690px] justify-center lg:justify-end"
          >
            <HeroProductVisual />
          </motion.div>
        </header>

        <section id="product" className="scroll-mt-28 mt-20 md:mt-28">
          <Reveal>
            <SectionHeading
              eyebrow="How it fits into your day"
              title="A small reset, right when it helps"
              body="ActiveAid stays quiet while you work, then gives you a clear next step."
            />
          </Reveal>
          <Reveal delay={0.04}>
            <ProductStoryExplorer />
          </Reveal>
        </section>

        <section className="relative left-1/2 mt-24 w-screen -translate-x-1/2 overflow-hidden bg-[#172133] md:mt-32">
          <Reveal>
            <div className="mx-auto grid max-w-7xl gap-12 px-5 py-16 text-white sm:px-6 md:grid-cols-[1.1fr_0.9fr] md:items-end md:py-24 lg:gap-20 lg:px-8">
              <div className="max-w-3xl">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#b8d8b5]">
                  Why ActiveAid
                </p>
                <h2 className="mt-5 text-balance text-4xl font-semibold leading-[1.02] tracking-[-0.035em] md:text-6xl">
                  Support that stays in the background until you need it.
                </h2>
                <p className="mt-6 max-w-2xl text-base leading-relaxed text-[#cbd2dc] md:text-lg">
                  No feed to maintain. No dashboard to keep open. Just a gentle prompt and a useful
                  next step.
                </p>
              </div>

              <div className="border-t border-white/25">
                <WhyLine icon={Leaf}>Works without an account</WhyLine>
                <WhyLine icon={Clock3}>Snooze or pause anytime</WhyLine>
                <WhyLine icon={LockKeyhole}>Your wellness data stays local by default</WhyLine>
              </div>
            </div>
          </Reveal>
        </section>

        <section id="features" className="scroll-mt-28 mt-20 md:mt-28">
          <Reveal>
            <SectionHeading
              eyebrow="Designed for real workdays"
              title="Useful support, with you in control"
              body="The core experience stays simple, private, and easy to adjust as your workday changes."
            />
          </Reveal>
          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {FEATURES.map((feature, index) => (
              <Reveal key={feature.num} delay={index * 0.04}>
                <FeatureCard {...feature} />
              </Reveal>
            ))}
          </div>
        </section>

        <section id="privacy" className="scroll-mt-28 mt-20 md:mt-28">
          <Reveal>
            <div className="grid overflow-hidden border-y border-[#cbd2ca] lg:grid-cols-[0.82fr_1.18fr]">
              <div className="bg-[#172133] p-8 text-white sm:p-10 lg:p-12">
                <LockKeyhole className="h-7 w-7 text-[#b8d8b5]" strokeWidth={1.8} aria-hidden="true" />
                <p className="mt-8 text-xs font-semibold uppercase tracking-[0.16em] text-[#b8d8b5]">
                  Privacy, in plain language
                </p>
                <h2 className="mt-4 max-w-md text-balance text-3xl font-semibold leading-tight tracking-[-0.03em] md:text-4xl">
                  Useful without seeing what you do.
                </h2>
                <p className="mt-5 max-w-md text-sm leading-relaxed text-[#cbd2dc] md:text-base">
                  ActiveAid uses activity timing to schedule reminders. The content of your work is
                  outside its scope.
                </p>
                <Link
                  href="/privacy"
                  className="mt-8 inline-flex text-sm font-semibold text-[#d8ead6] transition-colors hover:text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#b8d8b5]"
                >
                  Read the full privacy policy →
                </Link>
              </div>

              <div className="divide-y divide-[#e1e5df] bg-white px-6 sm:px-8 lg:px-10">
                {PRIVACY_POINTS.map((point) => (
                  <PrivacyPoint key={point.title} {...point} />
                ))}
              </div>
            </div>
          </Reveal>
        </section>

        <section id="faq" className="scroll-mt-28 mt-20 md:mt-28">
          <Reveal>
            <SectionHeading
              eyebrow="Questions, answered"
              title="Clear before you install"
              body="The important details about activity timing, accounts, backup, and privacy."
            />
          </Reveal>
          <div className="mt-10 divide-y divide-[#e5e7eb] rounded-3xl border border-[#d1d5db] bg-white px-6 shadow-sm md:px-8">
            {FAQS.map((item) => (
              <details key={item.question} className="group py-5">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-base font-semibold text-[#1f2937] marker:hidden">
                  <span>{item.question}</span>
                  <span
                    aria-hidden="true"
                    className="text-xl font-normal text-[#527d57] transition-transform group-open:rotate-45"
                  >
                    +
                  </span>
                </summary>
                <p className="mt-3 max-w-3xl text-sm leading-relaxed text-[#4b5563]">
                  {item.answer}
                </p>
              </details>
            ))}
          </div>
        </section>

        <section
          id="install"
          className="relative left-1/2 mt-20 w-screen -translate-x-1/2 scroll-mt-28 bg-[#dfe8dc] md:mt-28"
        >
          <Reveal>
            <div className="mx-auto grid max-w-7xl gap-12 px-5 py-16 sm:px-6 md:py-20 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-20 lg:px-8">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#3f6846]">
                  Chrome extension
                </p>
                <h2 className="mt-4 max-w-xl text-balance text-3xl font-semibold leading-tight tracking-[-0.035em] text-[#172133] md:text-5xl">
                  {installCopy.title}
                </h2>
                <p className="mt-5 max-w-xl text-base leading-relaxed text-[#52605a]">
                  {installCopy.body}
                </p>
                <div className="mt-8 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center">
                  <PrimaryButton href={primaryHref} external={isLive}>
                    {primaryLabel}
                  </PrimaryButton>
                  <span className="text-sm text-[#5b665f]">No account required</span>
                </div>
              </div>

              <div className="border-t border-[#afbead] lg:border-l lg:border-t-0 lg:pl-10">
                <InstallAssurance>{installCopy.detail}</InstallAssurance>
                <InstallAssurance>Review the privacy disclosure before activity timing begins.</InstallAssurance>
                <InstallAssurance>Change reminders or clear local data whenever you want.</InstallAssurance>
              </div>
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
              <FooterLink href="#faq">FAQ</FooterLink>
            </div>
          </div>
        </footer>
      </div>
    </main>
  )
}

function AvailabilityNote({ status }: { status: ChromeStoreRelease["status"] }) {
  const message =
    status === "live"
      ? "Secure install from the Chrome Web Store"
      : status === "review"
        ? "Submitted to the Chrome Web Store for review"
        : "Chrome release details will appear here"

  return (
    <p className="mt-3 flex w-fit items-center gap-2 text-xs text-[#6a7280]">
      {message}
    </p>
  )
}

function PrimaryButton({ href, children, external = false }: { href: string; children: React.ReactNode; external?: boolean }) {
  return (
    <Link
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      className="inline-flex h-12 items-center justify-center rounded-full bg-[#3f7547] px-7 text-sm font-semibold text-white shadow-sm transition-[background-color,transform,box-shadow] duration-200 hover:bg-[#315f38] hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#3f7547] active:scale-[0.98]"
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
      className="inline-flex h-12 items-center justify-center rounded-full border border-[#bfc9bd] bg-transparent px-7 text-sm font-semibold text-[#315f38] transition-[background-color,transform,border-color] duration-200 hover:border-[#96aa97] hover:bg-white/60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#3f7547] active:scale-[0.98]"
    >
      {children}
    </SmoothAnchor>
  )
}

function SectionHeading({
  eyebrow,
  title,
  body,
}: {
  eyebrow: string
  title: string
  body: string
}) {
  return (
    <div className="max-w-2xl">
      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#4b5563]">{eyebrow}</p>
      <h2 className="mt-3 text-2xl font-semibold tracking-tight md:text-3xl">{title}</h2>
      <p className="mt-3 text-sm leading-relaxed text-[#4b5563]">{body}</p>
    </div>
  )
}

function HeroProductVisual() {
  return (
    <figure
      aria-label="ActiveAid extension showing its Today, Check-in, and Insights views"
      className="relative h-[510px] w-full sm:h-[580px] lg:h-[620px]"
    >
      <div aria-hidden="true" className="absolute inset-x-[8%] bottom-[5%] h-[78%] rounded-[2rem] border border-[#d9ddd5] bg-[#e9eee5]" />

      <div className="absolute left-0 top-[18%] hidden aspect-[2/3] w-[43%] overflow-hidden rounded-[1.6rem] border border-white/80 bg-white shadow-[0_24px_55px_rgba(31,41,55,0.12)] sm:block">
        <Image
          src="/screenshots/check-in.png"
          alt=""
          fill
          sizes="(min-width: 1024px) 300px, 240px"
          className="object-cover object-top"
        />
      </div>

      <div className="absolute right-0 top-[12%] hidden aspect-[2/3] w-[43%] overflow-hidden rounded-[1.6rem] border border-white/80 bg-white shadow-[0_24px_55px_rgba(31,41,55,0.12)] sm:block">
        <Image
          src="/screenshots/insight.png"
          alt=""
          fill
          sizes="(min-width: 1024px) 300px, 240px"
          className="object-cover object-top"
        />
      </div>

      <div className="absolute left-1/2 top-1/2 z-10 aspect-[2/3] w-[78%] max-w-[385px] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-[1.9rem] border border-white bg-white shadow-[0_32px_70px_rgba(31,41,55,0.2)] sm:w-[56%]">
        <Image
          src="/screenshots/today.png"
          alt="ActiveAid Today view with activity timing, a daily check-in, and quick relief sessions"
          fill
          priority
          sizes="(min-width: 1024px) 385px, (min-width: 640px) 56vw, 78vw"
          className="object-cover object-top"
        />
      </div>
    </figure>
  )
}

function ProductStoryExplorer() {
  const [activeIndex, setActiveIndex] = useState(0)
  const reducedMotion = useReducedMotion()
  const activeStory = PRODUCT_STORIES[activeIndex]

  return (
    <div className="mt-12 grid overflow-hidden border-y border-[#cbd2ca] md:mt-16 lg:grid-cols-[0.82fr_1.18fr]">
      <div className="divide-y divide-[#d7ddd5] lg:py-8 lg:pr-10">
        {PRODUCT_STORIES.map((story, index) => {
          const selected = index === activeIndex

          return (
            <button
              key={story.number}
              type="button"
              aria-pressed={selected}
              onClick={() => setActiveIndex(index)}
              className={`group relative grid w-full grid-cols-[2.5rem_1fr] gap-4 px-4 py-6 text-left transition-colors duration-200 focus-visible:z-10 focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[#3f7547] sm:px-6 lg:px-4 lg:py-7 ${
                selected ? "bg-[#e8eee6]" : "hover:bg-white/55"
              }`}
            >
              <span
                className={`pt-1 font-mono text-xs font-semibold transition-colors ${
                  selected ? "text-[#315f38]" : "text-[#879087]"
                }`}
              >
                0{story.number}
              </span>
              <span>
                <span className="flex items-center justify-between gap-4">
                  <span className="text-lg font-semibold tracking-tight text-[#172133] sm:text-xl">
                    {story.title}
                  </span>
                  <span
                    aria-hidden="true"
                    className={`h-2.5 w-2.5 shrink-0 rounded-full transition-[background-color,transform] ${
                      selected ? "scale-100 bg-[#3f7547]" : "scale-75 bg-[#c4cbc3] group-hover:scale-100"
                    }`}
                  />
                </span>
                <span className="mt-2 block max-w-md text-sm leading-relaxed text-[#586273]">
                  {story.body}
                </span>
              </span>
            </button>
          )
        })}
      </div>

      <div
        id="product-story-view"
        aria-live="polite"
        className="relative flex min-h-[520px] items-center justify-center overflow-hidden bg-[#dfe8dc] px-6 py-10 sm:min-h-[610px] sm:px-10 lg:min-h-[640px]"
      >
        <div aria-hidden="true" className="absolute inset-y-0 left-[18%] w-px bg-[#c4d1c1]" />
        <div aria-hidden="true" className="absolute inset-y-0 right-[18%] w-px bg-[#c4d1c1]" />
        <div className="absolute left-6 top-6 flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#52705a] sm:left-10 sm:top-8">
          <span>ActiveAid extension</span>
          <span aria-hidden="true" className="h-px w-8 bg-[#93a993]" />
          <span>{activeStory.number} / {PRODUCT_STORIES.length}</span>
        </div>

        <motion.figure
          key={activeStory.image}
          initial={reducedMotion ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: reducedMotion ? 0 : 0.24, ease: "easeOut" }}
          className="relative mt-8 h-[430px] w-[286px] overflow-hidden rounded-[1.7rem] border border-white bg-white shadow-[0_28px_65px_rgba(31,41,55,0.18)] sm:h-[510px] sm:w-[340px] lg:h-[540px] lg:w-[360px]"
        >
          <Image
            src={activeStory.image}
            alt={activeStory.alt}
            fill
            sizes="(min-width: 1024px) 360px, (min-width: 640px) 340px, 286px"
            className="object-cover object-top"
          />
        </motion.figure>
      </div>
    </div>
  )
}

function WhyLine({
  icon: Icon,
  children,
}: {
  icon: typeof Leaf
  children: React.ReactNode
}) {
  return (
    <div className="flex items-center gap-4 border-b border-white/25 py-5 text-sm text-[#f2f4f6] md:text-base">
      <Icon className="h-5 w-5 shrink-0 text-[#b8d8b5]" strokeWidth={1.8} aria-hidden="true" />
      <span>{children}</span>
    </div>
  )
}

function PrivacyPoint({
  icon: Icon,
  title,
  body,
}: {
  icon: LucideIcon
  title: string
  body: string
}) {
  return (
    <div className="grid gap-4 py-7 sm:grid-cols-[3rem_1fr] sm:py-8">
      <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[#e8f0e9] text-[#3f7547]">
        <Icon className="h-5 w-5" strokeWidth={1.8} aria-hidden="true" />
      </span>
      <div>
        <h3 className="text-base font-semibold text-[#172133]">{title}</h3>
        <p className="mt-2 max-w-xl text-sm leading-relaxed text-[#586273]">{body}</p>
      </div>
    </div>
  )
}

function InstallAssurance({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-4 border-b border-[#afbead] py-5 text-sm leading-relaxed text-[#3f5145] last:border-b-0">
      <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#3f7547] text-white">
        <Check className="h-3.5 w-3.5" strokeWidth={2.4} aria-hidden="true" />
      </span>
      <span>{children}</span>
    </div>
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

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link href={href} className="transition-colors duration-200 hover:text-[#1f2937]">
      {children}
    </Link>
  )
}
