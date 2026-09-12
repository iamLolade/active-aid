import test from "node:test"
import assert from "node:assert/strict"
import { readFile } from "node:fs/promises"
import {
  BROWSER_TARGETS,
  createBrowserManifest,
} from "../scripts/extension-manifests.mjs"

const sourceManifest = JSON.parse(
  await readFile(new URL("../extension/manifest.json", import.meta.url), "utf8"),
)

test("browser package targets remain explicit", () => {
  assert.deepEqual(BROWSER_TARGETS, ["chrome", "edge", "firefox"])
})

for (const target of ["chrome", "edge"]) {
  test(`${target} manifest uses a service worker without Firefox settings`, () => {
    const manifest = createBrowserManifest(sourceManifest, target)

    assert.equal(manifest.background.service_worker, "background/sw.js")
    assert.equal(manifest.background.type, "module")
    assert.equal(manifest.background.scripts, undefined)
    assert.equal(manifest.browser_specific_settings, undefined)
  })
}

test("Firefox manifest uses a module background script with its Gecko ID", () => {
  const manifest = createBrowserManifest(sourceManifest, "firefox")

  assert.deepEqual(manifest.background.scripts, ["background/sw.js"])
  assert.equal(manifest.background.type, "module")
  assert.equal(manifest.background.service_worker, undefined)
  assert.equal(manifest.browser_specific_settings.gecko.id, "activeaid@activeaid.app")
  assert.equal(manifest.browser_specific_settings.gecko.strict_min_version, "112.0")
})

test("manifest generation does not mutate the shared source manifest", () => {
  const original = JSON.stringify(sourceManifest)

  createBrowserManifest(sourceManifest, "firefox")

  assert.equal(JSON.stringify(sourceManifest), original)
})

test("unknown browser package targets fail clearly", () => {
  assert.throws(
    () => createBrowserManifest(sourceManifest, "safari"),
    /Unsupported browser target: safari/,
  )
})
