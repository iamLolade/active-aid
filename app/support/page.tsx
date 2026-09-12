import type { Metadata } from "next"
import Link from "next/link"
import { Bell, Database, LifeBuoy, ShieldCheck } from "lucide-react"
import { SiteHeader } from "@/components/site-header"

export const metadata: Metadata = {
  title: "Support",
  description: "Get help with ActiveAid installation, reminders, local data, and privacy controls.",
}

const supportEmail = process.env.NEXT_PUBLIC_SUPPORT_EMAIL?.trim()

const HELP_TOPICS = [
  {
    icon: Bell,
    title: "A reminder did not appear",
    body: "Confirm reminders are on in ActiveAid Settings, Chrome notifications are allowed, and you are active on a normal http or https page. Five minutes without activity resets the active session.",
  },
  {
    icon: Database,
    title: "A check-in or session did not save",
    body: "Close and reopen the popup, then try once more. If the problem continues, export your local data from Settings before clearing anything.",
  },
  {
    icon: ShieldCheck,
    title: "Manage or remove your data",
    body: "Use Settings to export or clear local data. If cloud backup is enabled, deleting cloud data is a separate action and does not remove local records.",
  },
] as const

export default function SupportPage() {
  return (
    <main className="min-h-screen bg-[#f7f4ed] text-[#1f2937]">
      <div className="mx-auto max-w-5xl px-6 pb-16 pt-6 md:pb-24 md:pt-8">
        <SiteHeader />

        <header className="mx-auto mt-16 max-w-3xl text-center md:mt-20">
          <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-[#e3ede4] text-[#36583a]">
            <LifeBuoy className="h-6 w-6" aria-hidden="true" />
          </span>
          <p className="mt-6 text-xs font-semibold uppercase tracking-[0.14em] text-[#4b5563]">Support</p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight md:text-5xl">How can we help?</h1>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-[#4b5563]">
            Start with these quick checks. They cover the most common reminder, data, and privacy questions.
          </p>
        </header>

        <section className="mx-auto mt-12 grid max-w-4xl gap-4">
          {HELP_TOPICS.map(({ icon: Icon, title, body }) => (
            <article key={title} className="flex gap-4 rounded-2xl border border-[#d1d5db] bg-white p-6 shadow-sm md:p-7">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#edf4ed] text-[#527d57]">
                <Icon className="h-5 w-5" aria-hidden="true" />
              </span>
              <div>
                <h2 className="text-base font-semibold">{title}</h2>
                <p className="mt-2 text-sm leading-relaxed text-[#4b5563]">{body}</p>
              </div>
            </article>
          ))}
        </section>

        <section className="mx-auto mt-8 flex max-w-4xl flex-col items-start justify-between gap-5 rounded-3xl bg-[#1f2937] p-8 text-white sm:flex-row sm:items-center">
          <div>
            <h2 className="text-lg font-semibold">Still need help?</h2>
            <p className="mt-2 max-w-xl text-sm leading-relaxed text-[#d1d5db]">
              {supportEmail
                ? "Send a short description of what happened and include your Chrome version. Do not send exported wellness data unless requested."
                : "Direct support contact will be available before the public Chrome release."}
            </p>
          </div>
          {supportEmail ? (
            <a
              href={`mailto:${supportEmail}`}
              className="inline-flex h-11 shrink-0 items-center justify-center rounded-full bg-[#7bae7f] px-6 text-sm font-semibold text-white hover:bg-[#6a9d6e] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              Email support
            </a>
          ) : null}
        </section>

        <footer className="mx-auto mt-10 flex max-w-4xl flex-wrap gap-5 text-sm font-semibold text-[#3d6b42]">
          <Link href="/">Home</Link>
          <Link href="/install">Install</Link>
          <Link href="/privacy">Privacy</Link>
        </footer>
      </div>
    </main>
  )
}
