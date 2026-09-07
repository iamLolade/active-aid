import Link from "next/link"
import { BrandLockup } from "@/components/brand-lockup"

export function SiteHeader() {
  return (
    <nav aria-label="Primary" className="flex items-center justify-between gap-4">
      <BrandLockup />
      <div className="flex items-center gap-4 text-sm font-medium text-[#4b5563]">
        <Link className="hover:text-[#1f2937]" href="/privacy">
          Privacy
        </Link>
        <Link
          href="/install"
          className="inline-flex h-10 items-center justify-center rounded-full bg-[#6a9d6e] px-4 font-semibold text-white transition-colors hover:bg-[#5e8f62] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#6a9d6e]"
        >
          Get ActiveAid
        </Link>
      </div>
    </nav>
  )
}
