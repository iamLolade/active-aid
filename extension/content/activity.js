(function () {
  const PING_THROTTLE_MS = 10_000
  let lastPingMs = 0

  function maybePing() {
    const t = Date.now()
    if (t - lastPingMs < PING_THROTTLE_MS) return
    lastPingMs = t

    try {
      chrome.runtime.sendMessage({ type: "activeaid:activity" })
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

