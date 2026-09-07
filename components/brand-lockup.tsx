import Image from "next/image"
import Link from "next/link"

export function BrandLockup() {
  return (
    <Link
      href="/"
      aria-label="ActiveAid home"
      className="group flex min-w-0 items-center gap-3 rounded-lg focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#6a9d6e]"
    >
      <Image
        src="/activeaid-mark.svg"
        alt=""
        width={48}
        height={48}
        className="h-10 w-10"
        priority
      />
      <span className="min-w-0 leading-tight">
        <span className="block truncate text-sm font-semibold tracking-tight text-[#1f2937]">
          ActiveAid
        </span>
        <span className="hidden truncate text-xs text-[#4b5563] sm:block">
          Wellness while you work
        </span>
      </span>
    </Link>
  )
}
