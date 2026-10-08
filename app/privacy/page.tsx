import type { Metadata } from "next"
import Link from "next/link"
import { Cloud, EyeOff, HardDrive, ShieldCheck } from "lucide-react"
import type { LucideIcon } from "lucide-react"
import { SiteHeader } from "@/components/site-header"

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "How ActiveAid handles data in the browser extension and website. Local-first, no typed content or screenshots.",
}

const PRIVACY_SUMMARY = [
  {
    icon: HardDrive,
    title: "Local by default",
    body: "Wellness data stays in your browser unless you choose cloud backup.",
  },
  {
    icon: EyeOff,
    title: "Your work stays private",
    body: "ActiveAid does not record typed text, page content, URLs, or screenshots.",
  },
  {
    icon: Cloud,
    title: "Backup is a separate choice",
    body: "Signing in alone does not upload your wellness data.",
  },
] as const

const POLICY_GROUPS = [
  {
    label: "Data and storage",
    sections: [
      {
        id: "overview",
        title: "Overview",
        body: "ActiveAid is a workplace wellness browser extension. This policy describes how the extension handles data. ActiveAid is local-first: no account is required and wellness data stays in your browser by default. Activity timing begins only after you review the first-run disclosure and select Agree and get started.",
      },
      {
        id: "stored-on-device",
        title: "What we store (on your device)",
        bullets: [
          "Activity timing signals (keyboard, mouse, scroll, and tab focus) used to estimate active work time and schedule gentle reminders.",
          "Reminder settings (interval, on/off, snooze state).",
          "Daily check-ins you save (overall feeling and optional body areas).",
          "Completed relief session logs (session type, time completed, duration).",
          "Simple daily stats derived from the above (for example, estimated active minutes and breaks taken).",
          "If you sign in for optional cloud backup, your account email and Supabase session tokens are stored locally so you can stay signed in.",
        ],
      },
      {
        id: "not-collected",
        title: "What we do not collect",
        bullets: [
          "What you type or paste into pages.",
          "Page content, URLs you visit, or browsing history content.",
          "Screenshots, camera, microphone, or location data.",
          "Financial, health-records, or identity documents.",
        ],
      },
      {
        id: "data-location",
        title: "Where data lives",
        body: "By default, extension data is stored in browser extension storage on your device. If you sign in and then turn on optional cloud backup, check-ins, completed relief sessions, and reminder settings are also stored in Supabase and encrypted in transit. Activity timing and page content are never uploaded. The marketing website may use standard hosting logs when you visit our pages.",
      },
    ],
  },
  {
    label: "Backup and control",
    sections: [
      {
        id: "cloud-backup",
        title: "Optional cloud backup",
        bullets: [
          "Disabled by default. Creating an account or signing in sends account and authentication data to Supabase but does not upload wellness data.",
          "Backup starts only after you separately turn on Back up my wellness data in Settings.",
          "Uploads only wellness check-ins, completed session logs, and reminder settings.",
          "Does not upload typed content, page content, activity timing samples, or screenshots.",
          "Turning backup off or signing out stops future sync but does not delete existing cloud records.",
          "Delete cloud backup removes your backed-up wellness records and reminder settings while leaving local data on your device.",
        ],
      },
      {
        id: "cloud-provider",
        title: "Cloud service provider",
        body: "ActiveAid uses Supabase to provide optional account authentication and cloud backup. When you use that feature, Supabase processes your account email, authentication data, and the wellness data you choose to back up on ActiveAid's behalf. Your password is sent to Supabase over HTTPS for authentication and is not stored by the extension.",
      },
      {
        id: "retention",
        title: "Retention",
        body: "Local data remains in browser extension storage until you erase it or remove the extension. Optional cloud-backup records remain until you use Delete cloud backup. Signing out does not delete local or cloud wellness records.",
      },
      {
        id: "controls",
        title: "Your controls",
        bullets: [
          "Download my data: save a JSON file of your local data from Settings in the extension popup.",
          "Erase data on this device: remove all data stored by the extension on this device, including the local sign-in session.",
          "Delete cloud backup: remove backed-up check-ins, completed sessions, and reminder settings without deleting local data.",
          "Reminders: turn notifications off anytime in Settings or during first-run onboarding.",
        ],
      },
      {
        id: "permissions",
        title: "Permissions",
        body: "The extension requests alarms and notifications for break reminders, storage for local wellness data, and access to http/https pages so a lightweight content script can detect activity timing. It does not read or store page content.",
      },
    ],
  },
  {
    label: "Policy details",
    sections: [
      {
        id: "limited-use",
        title: "Chrome Web Store Limited Use",
        body: "ActiveAid uses information received through Chrome APIs only to provide and improve its disclosed workplace-wellness features. This use complies with the Chrome Web Store User Data Policy, including the Limited Use requirements. ActiveAid does not sell user data, use it for advertising or credit decisions, or allow human access except when required for security, legal compliance, or support that you explicitly request.",
      },
      {
        id: "children",
        title: "Children",
        body: "ActiveAid is intended for adults in workplace settings. We do not knowingly collect data from children.",
      },
      {
        id: "changes",
        title: "Changes",
        body: "We will update this page and in-extension privacy copy when data practices change.",
      },
      {
        id: "not-medical-advice",
        title: "Not medical advice",
        body: "ActiveAid supports workplace wellness habits. It is not a medical, diagnostic, or therapeutic tool. Stop any movement if it hurts and follow your own medical guidance.",
      },
    ],
  },
] as const

const POLICY_GROUP_OFFSETS = POLICY_GROUPS.map((_, groupIndex) =>
  POLICY_GROUPS.slice(0, groupIndex).reduce(
    (sectionCount, group) => sectionCount + group.sections.length,
    0
  )
)

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-[#f7f4ed] text-[#1f2937]">
      <div className="mx-auto max-w-7xl px-5 pb-16 pt-5 sm:px-6 md:pb-24 md:pt-7 lg:px-8">
        <SiteHeader currentPage="privacy" />

        <header className="mt-14 grid gap-10 border-b border-[#cbd2ca] pb-12 md:mt-20 md:pb-16 lg:grid-cols-[1fr_0.82fr] lg:items-end lg:gap-20">
          <div className="max-w-3xl">
            <div className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.16em] text-[#3f6846]">
              <ShieldCheck className="h-4 w-4" aria-hidden="true" />
              Your data
            </div>
            <h1 className="mt-5 text-balance text-4xl font-semibold leading-[1.02] tracking-[-0.04em] text-[#172133] sm:text-5xl md:text-6xl">
              Privacy, explained plainly.
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-relaxed text-[#586273] md:text-lg">
              Understand what ActiveAid stores, what it never records, and what changes only when
              you choose optional cloud backup.
            </p>
          </div>

          <div className="border-l-2 border-[#6a9d6e] pl-6">
            <p className="text-sm font-semibold text-[#172133]">Privacy Policy</p>
            <p className="mt-2 text-sm leading-relaxed text-[#586273]">
              Applies to the ActiveAid browser extension and public website.
            </p>
            <p className="mt-5 text-xs font-medium uppercase tracking-[0.12em] text-[#6a7280]">
              Last updated September 2026
            </p>
          </div>
        </header>

        <section aria-label="Privacy summary" className="grid border-b border-[#cbd2ca] md:grid-cols-3">
          {PRIVACY_SUMMARY.map((item, index) => (
            <PrivacySummary key={item.title} {...item} bordered={index > 0} />
          ))}
        </section>

        <details className="mt-10 border-y border-[#cbd2ca] py-2 lg:hidden">
          <summary className="flex min-h-12 cursor-pointer list-none items-center justify-between rounded-md py-2 text-sm font-semibold text-[#315f38] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#3f7547]">
            On this page
            <span aria-hidden="true" className="text-lg font-normal">+</span>
          </summary>
          <PolicyLinks className="pb-4 pt-2" />
        </details>

        <div className="mt-10 grid gap-12 lg:mt-16 lg:grid-cols-[14rem_minmax(0,1fr)] lg:items-start lg:gap-16">
          <aside className="hidden lg:block">
            <nav aria-label="Privacy policy sections" className="sticky top-8 max-h-[calc(100vh-4rem)] overflow-y-auto border-l border-[#cbd2ca] pl-5 pr-3">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#6a7280]">On this page</p>
              <PolicyLinks className="mt-5" />
            </nav>
          </aside>

          <article className="overflow-hidden rounded-[1.75rem] border border-[#d1d5db] bg-white shadow-sm">
            {POLICY_GROUPS.map((group, groupIndex) => (
              <div key={group.label}>
                <div className="border-b border-[#e1e5df] bg-[#eef3ec] px-6 py-4 sm:px-8 md:px-10">
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#52705a]">
                    {group.label}
                  </p>
                </div>
                {group.sections.map((section, sectionIndex) => (
                  <PolicySection
                    key={section.id}
                    number={POLICY_GROUP_OFFSETS[groupIndex] + sectionIndex + 1}
                    section={section}
                  />
                ))}
              </div>
            ))}
          </article>
        </div>

        <footer className="mt-12 flex flex-col gap-6 border-t border-[#cbd2ca] pt-8 sm:flex-row sm:items-center sm:justify-between">
          <p className="max-w-xl text-sm leading-relaxed text-[#586273]">
            Questions about this policy or your data controls? The support page explains the next steps.
          </p>
          <div className="flex flex-wrap gap-x-6 text-sm font-semibold text-[#315f38]">
            <FooterLink href="/">Home</FooterLink>
            <FooterLink href="/support">Support</FooterLink>
            <FooterLink href="/install">Install</FooterLink>
          </div>
        </footer>
      </div>
    </main>
  )
}

function PrivacySummary({
  icon: Icon,
  title,
  body,
  bordered,
}: {
  icon: LucideIcon
  title: string
  body: string
  bordered: boolean
}) {
  return (
    <div className={`flex gap-4 py-7 md:px-7 md:py-8 ${bordered ? "border-t border-[#cbd2ca] md:border-l md:border-t-0" : ""}`}>
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#e8f0e9] text-[#3f7547]">
        <Icon className="h-5 w-5" strokeWidth={1.8} aria-hidden="true" />
      </span>
      <div>
        <h2 className="text-sm font-semibold text-[#172133]">{title}</h2>
        <p className="mt-1.5 text-sm leading-relaxed text-[#586273]">{body}</p>
      </div>
    </div>
  )
}

function PolicyLinks({ className }: { className?: string }) {
  return (
    <div className={className}>
      {POLICY_GROUPS.map((group) => (
        <div key={group.label} className="mb-5 last:mb-0">
          <p className="text-xs font-semibold text-[#172133]">{group.label}</p>
          <div className="mt-2 grid gap-1">
            {group.sections.map((section) => (
              <a
                key={section.id}
                href={`#${section.id}`}
                className="flex min-h-11 items-center rounded-md py-1 text-sm leading-snug text-[#586273] transition-colors hover:text-[#315f38] focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[#3f7547] motion-reduce:transition-none"
              >
                {section.title}
              </a>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

function PolicySection({
  number,
  section,
}: {
  number: number
  section: (typeof POLICY_GROUPS)[number]["sections"][number]
}) {
  return (
    <section id={section.id} className="scroll-mt-8 border-b border-[#e1e5df] px-6 py-8 last:border-b-0 sm:px-8 md:px-10 md:py-10">
      <div className="grid gap-3 sm:grid-cols-[2.5rem_1fr] sm:gap-5">
        <span className="font-mono text-xs font-semibold text-[#6a9d6e]" aria-hidden="true">
          {String(number).padStart(2, "0")}
        </span>
        <div>
          <h2 className="text-xl font-semibold tracking-[-0.02em] text-[#172133]">{section.title}</h2>
          {"body" in section && section.body ? (
            <p className="mt-4 max-w-3xl text-sm leading-7 text-[#4b5563]">{section.body}</p>
          ) : null}
          {"bullets" in section && section.bullets ? (
            <ul className="mt-5 grid max-w-3xl gap-3 text-sm leading-7 text-[#4b5563]">
              {section.bullets.map((item) => (
                <li key={item} className="grid grid-cols-[0.5rem_1fr] gap-3">
                  <span aria-hidden="true" className="mt-[0.7rem] h-1.5 w-1.5 rounded-full bg-[#6a9d6e]" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      </div>
    </section>
  )
}

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-sm transition-colors hover:text-[#172133] focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-[#3f7547] motion-reduce:transition-none"
    >
      {children}
    </Link>
  )
}
