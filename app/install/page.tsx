import Image from "next/image"

export default function InstallPage() {
  return (
    <main className="min-h-screen bg-[#f7f4ed] text-[#1f2937]">
      <div className="mx-auto flex max-w-3xl flex-col gap-10 px-6 py-16">
        <header className="flex items-center gap-4">
          <Image
            src="/active-aid_logo.png"
            alt="ActiveAid"
            width={44}
            height={44}
            className="rounded-2xl"
            priority
          />
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Install ActiveAid</h1>
            <p className="text-sm text-[#4b5563]">
              Choose the option that matches your rollout.
            </p>
          </div>
        </header>

        <section className="rounded-2xl border border-[#d1d5db] bg-white p-8 shadow-sm">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-[#4b5563]">
            Option A, Chrome Web Store (recommended)
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-[#4b5563]">
            This is how most users install browser extensions. It supports automatic updates
            and does not require Developer mode.
          </p>
          <p className="mt-3 text-sm leading-relaxed text-[#4b5563]">
            Important: deploying this website does not automatically make the extension
            installable. To use Option A, you (the developer) publish ActiveAid in the Chrome
            Web Store, then users install from that listing link.
          </p>
          <ul className="mt-4 list-disc space-y-2 pl-5 text-sm text-[#4b5563]">
            <li>Upload the packaged zip to the Chrome Web Store Developer Dashboard</li>
            <li>Complete the listing details and privacy disclosures</li>
            <li>Submit for review, then publish</li>
            <li>Share the store listing link with users</li>
          </ul>
          <p className="mt-4 text-xs text-[#4b5563]">
            You can publish publicly, or use an unlisted listing for a smaller beta group.
          </p>
          <p className="mt-4 text-xs text-[#4b5563]">
            Publishing guide:{" "}
            <code className="rounded bg-[#f3efe6] px-1">CHROME_WEB_STORE.md</code>
          </p>
        </section>

        <section className="rounded-2xl border border-[#d1d5db] bg-white p-8 shadow-sm">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-[#4b5563]">
            Option B, Private beta (load unpacked)
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-[#4b5563]">
            This is best for early testers. It requires Developer mode and manual updates.
          </p>
          <ol className="mt-4 list-decimal space-y-2 pl-5 text-sm text-[#4b5563]">
            <li>
              Open{" "}
              <code className="rounded bg-[#f3efe6] px-1">chrome://extensions</code>
            </li>
            <li>Enable Developer mode</li>
            <li>
              Click Load unpacked and select the{" "}
              <code className="rounded bg-[#f3efe6] px-1">extension/</code> folder
            </li>
          </ol>
          <p className="mt-4 text-xs text-[#4b5563]">
            For detailed testing steps, see{" "}
            <code className="rounded bg-[#f3efe6] px-1">extension/README.md</code>.
          </p>
        </section>

        <section className="rounded-2xl border border-[#d1d5db] bg-white p-8 shadow-sm">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-[#4b5563]">
            Packaging
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-[#4b5563]">
            The packaged zip is primarily for Chrome Web Store uploads.
          </p>
          <pre className="mt-4 overflow-x-auto rounded-xl bg-[#1f2937] p-4 text-xs text-white">
            <code>npm run package:extension</code>
          </pre>
          <p className="mt-3 text-xs text-[#4b5563]">
            Output: <code className="rounded bg-[#f3efe6] px-1">dist/activeaid-extension.zip</code>
          </p>
        </section>

        <footer className="text-xs text-[#4b5563]">
          <p>
            Tip: if you want the extension to be installable by normal users without
            Developer mode, use the Chrome Web Store (public or unlisted).
          </p>
        </footer>
      </div>
    </main>
  )
}

