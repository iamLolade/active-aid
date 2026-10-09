import Link from "next/link"
import { BrandLockup } from "@/components/brand-lockup"

export function SiteHeader({ currentPage }: { currentPage?: "privacy" | "install" }) {
  return (
    <nav
      aria-label="Primary"
      className="sticky top-0 z-50 flex min-h-[72px] items-center justify-between gap-4 border-b border-[#dedbd2] bg-[#f7f4ed]/95 backdrop-blur-md"
    >
      <BrandLockup />
      <div className="flex items-center gap-4 text-sm font-medium text-[#4b5563]">
        <Link
          href="/privacy"
          aria-current={currentPage === "privacy" ? "page" : undefined}
          className={`min-h-11 items-center rounded-md px-2 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#6a9d6e] ${
            currentPage === "privacy"
              ? "hidden bg-[#e8eee6] text-[#315f38] sm:inline-flex"
              : "inline-flex hover:text-[#1f2937]"
          }`}
        >
          Privacy
        </Link>
        <Link
          href="/install"
          aria-current={currentPage === "install" ? "page" : undefined}
          className="inline-flex h-11 items-center justify-center rounded-full bg-[#6a9d6e] px-4 font-semibold text-white transition-colors hover:bg-[#5e8f62] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#6a9d6e]"
        >
          Get ActiveAid
        </Link>
      </div>
    </nav>
  )
}
