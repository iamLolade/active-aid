(function () {
  const PING_THROTTLE_MS = 10_000
  let lastPingMs = 0

  /**
   * Cross-browser runtime check for content script context.
   * Uses browser.* (Firefox) or chrome.* (Chrome/Edge).
   */
  const runtime = typeof browser !== "undefined" ? browser.runtime : chrome.runtime

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

  window.addEventListener("mousemove", maybePing, passive)
  window.addEventListener("mousedown", maybePing, passive)
  window.addEventListener("keydown", maybePing, passive)
  window.addEventListener("scroll", maybePing, passive)

  document.addEventListener(
    "visibilitychange",
    () => {
      if (document.visibilityState === "visible") maybePing()
    },
    passive
  )
})()
