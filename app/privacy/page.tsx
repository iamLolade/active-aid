import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Privacy Policy | ActiveAid",
  description:
    "How ActiveAid handles data in the browser extension and website. Local-first, no typed content or screenshots.",
}

const SECTIONS = [
  {
    title: "Overview",
    body: "ActiveAid is a workplace wellness browser extension. This policy describes what the extension stores on your device. The MVP is local-first: no account is required and wellness data stays in your browser by default.",
  },
  {
    title: "What we store (on your device)",
    bullets: [
      "Activity timing signals (keyboard, mouse, scroll, and tab focus) used to estimate active work time and schedule gentle reminders.",
      "Reminder settings (interval, on/off, snooze state).",
      "Daily check-ins you save (overall feeling and optional body areas).",
      "Completed relief session logs (session type, time completed, duration).",
      "Simple daily stats derived from the above (for example, estimated active minutes and breaks taken).",
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
    body: "By default, extension data is stored in browser extension storage on your device. If you opt in to optional cloud backup, check-ins, completed relief sessions, and reminder settings are also stored in your Supabase account (encrypted in transit). Activity timing and page content are never uploaded. The marketing website may use standard hosting logs when you visit our pages.",
  },
  {
    title: "Optional cloud backup",
    bullets: [
      "Disabled by default. You choose to sign in and enable it in extension Settings.",
      "Uploads only wellness check-ins, completed session logs, and reminder settings.",
      "Does not upload typed content, page content, activity timing samples, or screenshots.",
      "You can sign out or clear local data anytime; cloud rows remain until you delete your account in Supabase.",
    ],
  },
  {
    title: "Your controls",
    bullets: [
      "Export: download a JSON file of your local data from Settings in the extension popup.",
      "Clear: remove all local extension data from Settings (with confirmation).",
      "Reminders: turn notifications off anytime in Settings or during first-run onboarding.",
    ],
  },
  {
    title: "Permissions",
    body: "The extension requests alarms and notifications for break reminders, storage for local wellness data, and access to http/https pages so a lightweight content script can detect activity timing. It does not read or store page content.",
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
      <div className="mx-auto flex max-w-3xl flex-col gap-10 px-6 py-16">
        <header className="flex items-center gap-4">
          <Link href="/">
            <Image
              src="/active-aid_logo.png"
              alt="ActiveAid"
              width={44}
              height={44}
              className="rounded-2xl"
              priority
            />
          </Link>
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Privacy Policy</h1>
            <p className="text-sm text-[#4b5563]">
              Last updated: June 2026 · ActiveAid browser extension (MVP)
            </p>
          </div>
        </header>

        {SECTIONS.map((section) => (
          <section
            key={section.title}
            className="rounded-2xl border border-[#d1d5db] bg-white p-8 shadow-sm"
          >
            <h2 className="text-lg font-semibold tracking-tight">{section.title}</h2>
            {"body" in section && section.body ? (
              <p className="mt-3 text-sm leading-relaxed text-[#4b5563]">{section.body}</p>
            ) : null}
            {"bullets" in section && section.bullets ? (
              <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed text-[#4b5563]">
                {section.bullets.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            ) : null}
          </section>
        ))}

        <footer className="flex flex-wrap gap-4 text-sm text-[#4b5563]">
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
