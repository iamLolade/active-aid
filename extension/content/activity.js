(function () {
  const ONBOARDING_KEY = "activeaid:onboarding"
  const PING_THROTTLE_MS = 10_000
  let lastPingMs = 0
  let trackingEnabled = false

  /**
   * Cross-browser runtime check for content script context.
   * Uses browser.* (Firefox) or chrome.* (Chrome/Edge).
   */
  const api = typeof browser !== "undefined" ? browser : chrome
  const runtime = api.runtime

  function maybePing() {
    const t = Date.now()
    if (t - lastPingMs < PING_THROTTLE_MS) return
    lastPingMs = t

    try {
      runtime.sendMessage({ type: "activeaid:activity" })
    } catch {
      // ignore
    }
  }

  const passive = { passive: true }
  const trackedEvents = ["mousemove", "mousedown", "keydown", "scroll"]

  function handleVisibilityChange() {
    if (document.visibilityState === "visible") maybePing()
  }

  function setTrackingEnabled(enabled) {
    if (trackingEnabled === enabled) return
    trackingEnabled = enabled

    for (const eventName of trackedEvents) {
      const method = enabled ? "addEventListener" : "removeEventListener"
      window[method](eventName, maybePing, passive)
    }

    const method = enabled ? "addEventListener" : "removeEventListener"
    document[method]("visibilitychange", handleVisibilityChange, passive)
  }

  async function readTrackingConsent() {
    if (typeof browser !== "undefined") {
      const stored = await api.storage.local.get(ONBOARDING_KEY)
      return Boolean(stored?.[ONBOARDING_KEY]?.complete)
    }

    return new Promise((resolve) => {
      api.storage.local.get(ONBOARDING_KEY, (stored) => {
        resolve(Boolean(stored?.[ONBOARDING_KEY]?.complete))
      })
    })
  }

  api.storage.onChanged.addListener((changes, areaName) => {
    if (areaName !== "local" || !changes[ONBOARDING_KEY]) return
    setTrackingEnabled(Boolean(changes[ONBOARDING_KEY].newValue?.complete))
  })

  void readTrackingConsent().then(setTrackingEnabled).catch(() => undefined)
})()
