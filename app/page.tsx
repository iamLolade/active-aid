import { LandingHome } from "@/components/landing/landing-home"
import { getChromeStoreRelease } from "@/lib/chrome-store"

export default function Home() {
  return <LandingHome release={getChromeStoreRelease()} />
}
