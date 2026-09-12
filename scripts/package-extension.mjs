import { execFileSync } from "node:child_process"
import {
  cpSync,
  existsSync,
  mkdtempSync,
  mkdirSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs"
import { tmpdir } from "node:os"
import { dirname, join } from "node:path"
import { BROWSER_TARGETS, createBrowserManifest } from "./extension-manifests.mjs"

const root = process.cwd()
const extDir = join(root, "extension")
const distDir = join(root, "dist")
const manifestPath = join(extDir, "manifest.json")

function fail(message) {
  throw new Error(message)
}

if (!existsSync(manifestPath)) {
  fail("Missing extension/manifest.json")
}

const sourceManifest = JSON.parse(readFileSync(manifestPath, "utf8"))

if (sourceManifest.manifest_version !== 3) {
  fail("Extension must use Manifest V3")
}

for (const key of ["name", "version", "description", "icons"]) {
  if (!sourceManifest[key]) {
    fail(`manifest.json missing required field: ${key}`)
  }
}

if (!/^\d+(\.\d+){0,3}$/.test(sourceManifest.version)) {
  fail("manifest.json version must contain one to four dot-separated integers")
}

const requiredFiles = [
  "background/sw.js",
  "content/activity.js",
  "popup/popup.html",
  "popup/popup.css",
  "popup/popup.js",
  "shared/sync-config.js",
]

function validateExtension(extensionDir, manifest, target) {
  for (const file of requiredFiles) {
    if (!existsSync(join(extensionDir, file))) {
      fail(`Required extension file is missing: ${file}`)
    }
  }

  for (const [size, iconPath] of Object.entries(manifest.icons)) {
    const absolutePath = join(extensionDir, iconPath)
    if (!existsSync(absolutePath)) fail(`Manifest icon is missing: ${iconPath}`)

    const icon = readFileSync(absolutePath)
    const isPng = icon.subarray(0, 8).toString("hex") === "89504e470d0a1a0a"
    const width = isPng ? icon.readUInt32BE(16) : 0
    const height = isPng ? icon.readUInt32BE(20) : 0
    if (!isPng || width !== Number(size) || height !== Number(size)) {
      fail(`Manifest icon ${iconPath} must be a ${size}x${size} PNG`)
    }
  }

  const syncConfig = readFileSync(join(extensionDir, "shared/sync-config.js"), "utf8")
  if (/SERVICE_ROLE/i.test(syncConfig)) {
    fail("Extension sync configuration must never contain a service-role credential")
  }

  if (target === "firefox") {
    if (manifest.background?.service_worker || !manifest.background?.scripts?.length) {
      fail("Firefox package must use background.scripts")
    }
    if (!manifest.browser_specific_settings?.gecko?.id) {
      fail("Firefox package must include browser_specific_settings.gecko.id")
    }
    return
  }

  if (!manifest.background?.service_worker || manifest.background?.scripts) {
    fail(`${target} package must use background.service_worker`)
  }
  if (manifest.browser_specific_settings) {
    fail(`${target} package must not include Firefox-specific settings`)
  }
}

function verifyArchive(outPath, expectedManifest) {
  const listing = execFileSync("unzip", ["-l", outPath], { encoding: "utf8" })
  if (!listing.includes("manifest.json")) {
    fail(`Package verification failed: manifest.json not found in ${outPath}`)
  }
  for (const forbidden of [".env", ".DS_Store", "node_modules/"]) {
    if (listing.includes(forbidden)) fail(`Package contains forbidden content: ${forbidden}`)
  }

  const archivedManifest = JSON.parse(
    execFileSync("unzip", ["-p", outPath, "manifest.json"], { encoding: "utf8" }),
  )
  if (JSON.stringify(archivedManifest) !== JSON.stringify(expectedManifest)) {
    fail(`Packaged manifest does not match the ${outPath} target`)
  }
}

function packageExtension(target, outPath) {
  const stagingDir = mkdtempSync(join(tmpdir(), `activeaid-${target}-`))

  try {
    cpSync(extDir, stagingDir, { recursive: true })

    const manifest = createBrowserManifest(sourceManifest, target)
    writeFileSync(join(stagingDir, "manifest.json"), `${JSON.stringify(manifest, null, 2)}\n`)

    const syncConfigPath = join(stagingDir, "shared/sync-config.js")
    execFileSync(process.execPath, [join(root, "scripts/generate-sync-config.mjs"), syncConfigPath], {
      cwd: root,
      stdio: "inherit",
    })

    validateExtension(stagingDir, manifest, target)
    mkdirSync(dirname(outPath), { recursive: true })
    rmSync(outPath, { force: true })
    execFileSync("zip", ["-r", outPath, ".", "-x", "*.DS_Store"], {
      cwd: stagingDir,
      stdio: "inherit",
    })
    verifyArchive(outPath, manifest)
  } finally {
    rmSync(stagingDir, { recursive: true, force: true })
  }
}

const outputPaths = {
  chrome: join(distDir, "activeaid-extension.zip"),
  edge: join(distDir, "activeaid-extension-edge.zip"),
  firefox: join(distDir, "activeaid-extension-firefox.zip"),
}

for (const target of BROWSER_TARGETS) {
  packageExtension(target, outputPaths[target])
}

console.log(`Packaged ActiveAid v${sourceManifest.version}`)
console.log("  Chrome Web Store → dist/activeaid-extension.zip (Chromium manifest)")
console.log("  Microsoft Edge   → dist/activeaid-extension-edge.zip (Chromium manifest)")
console.log("  Firefox (AMO)    → dist/activeaid-extension-firefox.zip (Firefox manifest)")
