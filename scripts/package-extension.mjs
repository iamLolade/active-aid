import { execSync } from "node:child_process"
import { readFileSync, existsSync } from "node:fs"
import { join } from "node:path"

const root = process.cwd()
const extDir = join(root, "extension")
const manifestPath = join(extDir, "manifest.json")
const zipPath = join(root, "dist", "activeaid-extension.zip")

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

execSync("mkdir -p dist", { cwd: root, stdio: "inherit" })
execSync(
  'zip -r ../dist/activeaid-extension.zip . -x "*.DS_Store"',
  { cwd: extDir, stdio: "inherit" }
)

const listing = execSync(`unzip -l "${zipPath}"`, { encoding: "utf8" })
if (!listing.includes("manifest.json")) {
  console.error("Package verification failed: manifest.json not found in zip")
  process.exit(1)
}

console.log(`Packaged ActiveAid v${manifest.version} → dist/activeaid-extension.zip`)
