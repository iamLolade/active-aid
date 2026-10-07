export type ChromeStoreStatus = "unavailable" | "review" | "live"

export type ChromeStoreRelease = {
  status: ChromeStoreStatus
  storeUrl?: string
}

export function getChromeStoreRelease(): ChromeStoreRelease {
  const storeUrl = process.env.NEXT_PUBLIC_CHROME_STORE_URL?.trim() || undefined
  const configuredStatus = process.env.NEXT_PUBLIC_CHROME_STORE_STATUS?.trim().toLowerCase()

  if (configuredStatus === "live" && storeUrl) {
    return { status: "live", storeUrl }
  }

  if (configuredStatus === "review" || configuredStatus === "live") {
    return { status: "review", storeUrl }
  }

  if (configuredStatus === "unavailable") {
    return { status: "unavailable" }
  }

  if (storeUrl) return { status: "review", storeUrl }

  return { status: "unavailable" }
}
