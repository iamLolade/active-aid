import { execSync } from "node:child_process"
import { readFileSync, existsSync, copyFileSync } from "node:fs"
import { join } from "node:path"

const root = process.cwd()
const extDir = join(root, "extension")
const distDir = join(root, "dist")
const manifestPath = join(extDir, "manifest.json")

execSync("node scripts/generate-sync-config.mjs", { cwd: root, stdio: "inherit" })

if (!existsSync(manifestPath)) {
  console.error("Missing extension/manifest.json")
  process.exit(1)
}

const manifest = JSON.parse(readFileSync(manifestPath, "utf8"))

if (manifest.manifest_version !== 3) {
  console.error("Extension must use Manifest V3")
  process.exit(1)
}

for (const key of ["name", "version", "description", "icons"]) {
  if (!manifest[key]) {
    console.error(`manifest.json missing required field: ${key}`)
    process.exit(1)
  }
}

if (!manifest.browser_specific_settings?.gecko?.id) {
  console.error("manifest.json missing browser_specific_settings.gecko.id (required for Firefox)")
  process.exit(1)
}

function zipExtension(outPath) {
  execSync(`mkdir -p "${distDir}"`, { cwd: root, stdio: "inherit" })
  execSync(`rm -f "${outPath}"`, { cwd: root, stdio: "inherit" })
  execSync(`zip -r "${outPath}" . -x "*.DS_Store"`, { cwd: extDir, stdio: "inherit" })

  const listing = execSync(`unzip -l "${outPath}"`, { encoding: "utf8" })
  if (!listing.includes("manifest.json")) {
    console.error(`Package verification failed: manifest.json not found in ${outPath}`)
    process.exit(1)
  }
}

const zipPath = join(distDir, "activeaid-extension.zip")
const edgePath = join(distDir, "activeaid-extension-edge.zip")
const firefoxPath = join(distDir, "activeaid-extension-firefox.zip")

zipExtension(zipPath)
copyFileSync(zipPath, edgePath)
copyFileSync(zipPath, firefoxPath)

console.log(`Packaged ActiveAid v${manifest.version}`)
console.log(`  Chrome Web Store → dist/activeaid-extension.zip`)
console.log(`  Microsoft Edge   → dist/activeaid-extension-edge.zip (same build)`)
console.log(`  Firefox (AMO)    → dist/activeaid-extension-firefox.zip (same build)`)
