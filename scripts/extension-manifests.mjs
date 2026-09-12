export const BROWSER_TARGETS = ["chrome", "edge", "firefox"]

function cloneManifest(manifest) {
  return JSON.parse(JSON.stringify(manifest))
}

export function createBrowserManifest(sourceManifest, target) {
  if (!BROWSER_TARGETS.includes(target)) {
    throw new Error(`Unsupported browser target: ${target}`)
  }

  const serviceWorker = sourceManifest.background?.service_worker
  if (!serviceWorker) {
    throw new Error("Source manifest must define background.service_worker")
  }

  const manifest = cloneManifest(sourceManifest)
  const backgroundType = sourceManifest.background.type ?? "module"

  if (target === "firefox") {
    if (!manifest.browser_specific_settings?.gecko?.id) {
      throw new Error("Firefox manifest requires browser_specific_settings.gecko.id")
    }

    manifest.background = {
      scripts: [serviceWorker],
      type: backgroundType,
    }
    return manifest
  }

  manifest.background = {
    service_worker: serviceWorker,
    type: backgroundType,
  }
  delete manifest.browser_specific_settings
  return manifest
}
