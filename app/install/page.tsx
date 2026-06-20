import Image from "next/image"
import Link from "next/link"

const storeUrl = process.env.NEXT_PUBLIC_CHROME_STORE_URL?.trim()

export default function InstallPage() {
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
            <h1 className="text-2xl font-semibold tracking-tight">Install ActiveAid</h1>
            <p className="text-sm text-[#4b5563]">
              Wellness while you work. Pick the install path that fits your setup.
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
          {storeUrl ? (
            <a
              href={storeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-5 inline-flex h-11 items-center justify-center rounded-full bg-[#6a9d6e] px-6 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#5e8f62]"
            >
              Add to Chrome
            </a>
          ) : (
            <p className="mt-3 text-sm leading-relaxed text-[#4b5563]">
              The store listing is not linked yet. After you publish, set{" "}
              <code className="rounded bg-[#f3efe6] px-1">NEXT_PUBLIC_CHROME_STORE_URL</code>{" "}
              in production and redeploy.
            </p>
          )}
          <ul className="mt-4 list-disc space-y-2 pl-5 text-sm text-[#4b5563]">
            <li>Upload the packaged zip to the Chrome Web Store Developer Dashboard</li>
            <li>
              Use listing copy from{" "}
              <code className="rounded bg-[#f3efe6] px-1">store/LISTING.md</code>
            </li>
            <li>
              Set privacy policy URL to{" "}
              <code className="rounded bg-[#f3efe6] px-1">/privacy</code> on your deployed site
            </li>
            <li>Submit for review, then publish (public or unlisted)</li>
          </ul>
          <p className="mt-4 text-xs text-[#4b5563]">
            Publishing guide:{" "}
            <code className="rounded bg-[#f3efe6] px-1">CHROME_WEB_STORE.md</code>
          </p>
        </section>

        <section className="rounded-2xl border border-[#d1d5db] bg-white p-8 shadow-sm">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-[#4b5563]">
            Option A2, Microsoft Edge and Firefox
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-[#4b5563]">
            The same MV3 build publishes to Edge Add-ons and Firefox Add-ons (AMO). One
            package script produces store-ready zips for all three browsers.
          </p>
          <p className="mt-4 text-xs text-[#4b5563]">
            Testing and publish steps:{" "}
            <code className="rounded bg-[#f3efe6] px-1">FIREFOX_EDGE.md</code>
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
            Store-ready zips for Chrome, Edge, and Firefox. The script validates the manifest
            before zipping.
          </p>
          <pre className="mt-4 overflow-x-auto rounded-xl bg-[#1f2937] p-4 text-xs text-white">
            <code>npm run package:extension</code>
          </pre>
          <p className="mt-3 text-xs text-[#4b5563]">
            Output:{" "}
            <code className="rounded bg-[#f3efe6] px-1">dist/activeaid-extension.zip</code>,{" "}
            <code className="rounded bg-[#f3efe6] px-1">dist/activeaid-extension-edge.zip</code>,{" "}
            <code className="rounded bg-[#f3efe6] px-1">dist/activeaid-extension-firefox.zip</code>
          </p>
        </section>

        <footer className="flex flex-wrap gap-4 text-xs text-[#4b5563]">
          <Link href="/privacy" className="font-semibold text-[#3d6b42] hover:underline">
            Privacy policy
          </Link>
          <Link href="/" className="font-semibold text-[#3d6b42] hover:underline">
            Back to home
          </Link>
        </footer>
      </div>
    </main>
  )
}
