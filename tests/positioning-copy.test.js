import test from "node:test"
import assert from "node:assert/strict"
import { readFile } from "node:fs/promises"

const projectFile = (path) => new URL(`../${path}`, import.meta.url)

const positioningFiles = [
  "plan.md",
  "brand_identity.md",
  "DESIGN_GUIDELINES.md",
  "store/LISTING.md",
  "components/landing/landing-home.tsx",
  "app/privacy/page.tsx",
  "app/install/page.tsx",
  "extension/popup/popup.html",
]

const publicCopyFiles = [
  "store/LISTING.md",
  "components/landing/landing-home.tsx",
  "app/privacy/page.tsx",
  "app/install/page.tsx",
  "extension/popup/popup.html",
]

test("positioning copy avoids prevention claims", async () => {
  for (const path of positioningFiles) {
    const content = await readFile(projectFile(path), "utf8")

    assert.doesNotMatch(content, /\bprevent(?:ative|ive)\b/i, `${path} uses prevention language`)
  }
})

test("public copy uses the approved non-medical positioning", async () => {
  for (const path of publicCopyFiles) {
    const content = await readFile(projectFile(path), "utf8")

    assert.match(content, /ActiveAid supports workplace wellness habits\./)
    assert.match(content, /It is not a medical, diagnostic, or\s+therapeutic tool\./)
  }
})
