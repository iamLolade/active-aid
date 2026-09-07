import type { Metadata } from "next"
import Link from "next/link"
import { SiteHeader } from "@/components/site-header"

export const metadata: Metadata = {
  title: "Privacy Policy | ActiveAid",
  description:
    "How ActiveAid handles data in the browser extension and website. Local-first, no typed content or screenshots.",
}

const SECTIONS = [
  {
    title: "Overview",
    body: "ActiveAid is a workplace wellness browser extension. This policy describes how the extension handles data. ActiveAid is local-first: no account is required and wellness data stays in your browser by default. Activity timing begins only after you review the first-run disclosure and select Agree and get started.",
  },
  {
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
    title: "What we do not collect",
    bullets: [
      "What you type or paste into pages.",
      "Page content, URLs you visit, or browsing history content.",
      "Screenshots, camera, microphone, or location data.",
      "Financial, health-records, or identity documents.",
    ],
  },
  {
    title: "Where data lives",
    body: "By default, extension data is stored in browser extension storage on your device. If you sign in and then turn on optional cloud backup, check-ins, completed relief sessions, and reminder settings are also stored in Supabase and encrypted in transit. Activity timing and page content are never uploaded. The marketing website may use standard hosting logs when you visit our pages.",
  },
  {
    title: "Optional cloud backup",
    bullets: [
      "Disabled by default. Signing in sends account and authentication data to Supabase but does not upload wellness data.",
      "Backup starts only after you separately turn on Back up my wellness data in Settings.",
      "Uploads only wellness check-ins, completed session logs, and reminder settings.",
      "Does not upload typed content, page content, activity timing samples, or screenshots.",
      "Turning backup off or signing out stops future sync but does not delete existing cloud records.",
      "Delete cloud backup data removes your backed-up wellness records and reminder settings while leaving local data on your device.",
    ],
  },
  {
    title: "Cloud service provider",
    body: "ActiveAid uses Supabase to provide optional account authentication and cloud backup. When you use that feature, Supabase processes your account email, authentication data, and the wellness data you choose to back up on ActiveAid's behalf. Your password is sent to Supabase over HTTPS for authentication and is not stored by the extension.",
  },
  {
    title: "Retention",
    body: "Local data remains in browser extension storage until you clear it or remove the extension. Optional cloud-backup records remain until you use Delete cloud backup data. Signing out does not delete local or cloud wellness records.",
  },
  {
    title: "Your controls",
    bullets: [
      "Export: download a JSON file of your local data from Settings in the extension popup.",
      "Clear local data: remove all data stored by the extension on this device, including the local sign-in session.",
      "Delete cloud backup data: remove backed-up check-ins, completed sessions, and reminder settings without deleting local data.",
      "Reminders: turn notifications off anytime in Settings or during first-run onboarding.",
    ],
  },
  {
    title: "Permissions",
    body: "The extension requests alarms and notifications for break reminders, storage for local wellness data, and access to http/https pages so a lightweight content script can detect activity timing. It does not read or store page content.",
  },
  {
    title: "Chrome Web Store Limited Use",
    body: "ActiveAid uses information received through Chrome APIs only to provide and improve its disclosed workplace-wellness features. This use complies with the Chrome Web Store User Data Policy, including the Limited Use requirements. ActiveAid does not sell user data, use it for advertising or credit decisions, or allow human access except when required for security, legal compliance, or support that you explicitly request.",
  },
  {
    title: "Children",
    body: "ActiveAid is intended for adults in workplace settings. We do not knowingly collect data from children.",
  },
  {
    title: "Changes",
    body: "We will update this page and in-extension privacy copy when data practices change.",
  },
  {
    title: "Not medical advice",
    body: "ActiveAid supports wellness habits. It is not a medical or diagnostic tool. Stop any movement if it hurts and follow your own medical guidance.",
  },
] as const

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-[#f7f4ed] text-[#1f2937]">
      <div className="mx-auto max-w-5xl px-6 pb-16 pt-6 md:pb-24 md:pt-8">
        <SiteHeader />
        <header className="mx-auto mt-16 max-w-3xl md:mt-20">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#4b5563]">Your data</p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight md:text-4xl">Privacy Policy</h1>
          <p className="mt-3 text-sm text-[#4b5563]">
            Last updated: September 2026 · ActiveAid browser extension
          </p>
        </header>

        <div className="mx-auto mt-10 grid max-w-3xl gap-4">
          {SECTIONS.map((section) => (
            <section key={section.title} className="rounded-2xl border border-[#d1d5db] bg-white p-7 shadow-sm md:p-8">
              <h2 className="text-lg font-semibold tracking-tight">{section.title}</h2>
              {"body" in section && section.body ? <p className="mt-3 text-sm leading-relaxed text-[#4b5563]">{section.body}</p> : null}
              {"bullets" in section && section.bullets ? (
                <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed text-[#4b5563]">
                  {section.bullets.map((item) => <li key={item}>{item}</li>)}
                </ul>
              ) : null}
            </section>
          ))}
        </div>

        <footer className="mx-auto mt-10 flex max-w-3xl flex-wrap gap-4 text-sm text-[#4b5563]">
          <Link href="/" className="font-semibold text-[#3d6b42] hover:underline">
            Home
          </Link>
          <Link href="/install" className="font-semibold text-[#3d6b42] hover:underline">
            Install
          </Link>
        </footer>
      </div>
    </main>
  )
}
