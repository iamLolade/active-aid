import type { Metadata } from "next"
import Link from "next/link"
import { Check, Download, LockKeyhole } from "lucide-react"
import { SiteHeader } from "@/components/site-header"

export const metadata: Metadata = {
  title: "Install ActiveAid",
  description: "Check ActiveAid's Chrome Web Store availability and learn what to expect after installation.",
}

const storeUrl = process.env.NEXT_PUBLIC_CHROME_STORE_URL?.trim()

const EXPECTATIONS = [
  "Review a clear privacy disclosure before activity timing begins.",
  "Use reminders and the core wellness tools without creating an account.",
  "Change reminder settings or clear local data whenever you want.",
] as const

export default function InstallPage() {
  return (
    <main className="min-h-screen bg-[#f7f4ed] text-[#1f2937]">
      <div className="mx-auto max-w-5xl px-6 pb-16 pt-6 md:pb-24 md:pt-8">
        <SiteHeader />

        <section className="mx-auto mt-20 max-w-3xl text-center md:mt-28">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#4b5563]">
            Chrome extension
          </p>
          <h1 className="mt-4 text-4xl font-semibold leading-tight tracking-tight md:text-5xl">
            {storeUrl ? "A gentler workday is one click away." : "ActiveAid is getting ready for Chrome."}
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-[#4b5563]">
            {storeUrl
              ? "Install ActiveAid from the verified Chrome Web Store listing. Updates will arrive automatically through Chrome."
              : "The public listing is not live yet. We are completing release checks so the first public install is clear, reliable, and privacy-conscious."}
          </p>

          {storeUrl ? (
            <a
              href={storeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-8 inline-flex h-12 items-center justify-center gap-2 rounded-full bg-[#6a9d6e] px-7 text-sm font-semibold text-white shadow-sm transition-[background-color,transform,box-shadow] hover:bg-[#5e8f62] hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#6a9d6e] active:scale-[0.98]"
            >
              <Download className="h-4 w-4" aria-hidden="true" />
              Add to Chrome
            </a>
          ) : (
            <div className="mx-auto mt-8 flex w-fit items-center gap-3 rounded-full border border-[#cfdccf] bg-[#edf4ed] px-5 py-3 text-sm font-semibold text-[#36583a]">
              <span className="h-2 w-2 rounded-full bg-[#6a9d6e]" aria-hidden="true" />
              Chrome Web Store release in progress
            </div>
          )}
        </section>

        <section className="mx-auto mt-16 grid max-w-4xl gap-6 md:grid-cols-[1fr_0.8fr]">
          <div className="rounded-3xl border border-[#d1d5db] bg-white p-8 shadow-sm md:p-10">
            <h2 className="text-xl font-semibold tracking-tight">What to expect</h2>
            <ul className="mt-6 space-y-5">
              {EXPECTATIONS.map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm leading-relaxed text-[#4b5563]">
                  <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#e8f0e9] text-[#3d6b42]">
                    <Check className="h-3.5 w-3.5" aria-hidden="true" />
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <aside className="rounded-3xl bg-[#1f2937] p-8 text-white md:p-10">
            <LockKeyhole className="h-6 w-6 text-[#a9c8ac]" aria-hidden="true" />
            <h2 className="mt-5 text-xl font-semibold tracking-tight">Private by default</h2>
            <p className="mt-3 text-sm leading-relaxed text-[#d1d5db]">
              Wellness data stays in your browser unless you separately sign in and enable optional cloud backup. Activity timing is never uploaded.
            </p>
            <Link href="/privacy" className="mt-6 inline-flex text-sm font-semibold text-[#c8ddca] hover:text-white">
              Read the privacy policy →
            </Link>
          </aside>
        </section>

        <footer className="mx-auto mt-16 flex max-w-4xl flex-wrap items-center justify-between gap-4 border-t border-[#d1d5db] pt-8 text-sm text-[#4b5563]">
          <p>ActiveAid supports wellness habits. It is not medical advice.</p>
          <Link href="/" className="font-semibold text-[#3d6b42] hover:text-[#2f5835]">Back to home</Link>
        </footer>
      </div>
    </main>
  )
}
