import Image from "next/image"

export default function Home() {
  return (
    <main className="min-h-screen bg-[#f7f4ed] text-[#1f2937]">
      <div className="mx-auto flex max-w-xl flex-col gap-10 px-6 py-16">
        <header className="flex items-center gap-4">
          <Image
            src="/active-aid_logo.png"
            alt="ActiveAid"
            width={48}
            height={48}
            className="rounded-xl"
            priority
          />
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">ActiveAid</h1>
            <p className="text-sm text-[#4b5563]">Wellness while you work.</p>
          </div>
        </header>

        <section className="rounded-2xl border border-[#d1d5db] bg-white p-6 shadow-sm">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-[#4b5563]">
            Browser extension (MVP)
          </h2>
          <p className="mt-3 text-[15px] leading-relaxed text-[#1f2937]">
            Install the Chrome extension for gentle movement reminders, quick relief
            sessions, daily check-ins, and local wellness insights.
          </p>
          <ol className="mt-4 list-decimal space-y-2 pl-5 text-sm text-[#4b5563]">
            <li>Open <code className="rounded bg-[#f3efe6] px-1">chrome://extensions</code></li>
            <li>Enable Developer mode</li>
            <li>Load unpacked and select the <code className="rounded bg-[#f3efe6] px-1">extension/</code> folder</li>
          </ol>
          <p className="mt-4 text-xs text-[#4b5563]">
            See <code className="rounded bg-[#f3efe6] px-1">extension/README.md</code> for
            testing steps.
          </p>
        </section>

        <section className="rounded-2xl border border-[#d1d5db] bg-white p-6 shadow-sm">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-[#4b5563]">
            Backend status
          </h2>
          <p className="mt-3 text-sm text-[#4b5563]">
            After deploy, verify Supabase connectivity:
          </p>
          <a
            href="/api/health/supabase"
            className="mt-3 inline-block text-sm font-semibold text-[#5e8f62] underline underline-offset-2"
          >
            /api/health/supabase
          </a>
        </section>

        <p className="text-xs text-[#4b5563]">
          Privacy: we track activity timing only, never what you type.
        </p>
      </div>
    </main>
  )
}
