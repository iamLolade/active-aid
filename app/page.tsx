import { LandingHome } from "@/components/landing/landing-home"

export default function Home() {
  return <LandingHome storeUrl={process.env.NEXT_PUBLIC_CHROME_STORE_URL?.trim()} />
}
