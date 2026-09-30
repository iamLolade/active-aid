import test from "node:test"
import assert from "node:assert/strict"
import { readFile } from "node:fs/promises"

const popupPath = new URL("../extension/popup/popup.html", import.meta.url)
const popupStylesPath = new URL("../extension/popup/popup.css", import.meta.url)
const popupScriptPath = new URL("../extension/popup/popup.js", import.meta.url)

test("popup IDs are unique and navigation targets exist", async () => {
  const html = await readFile(popupPath, "utf8")
  const ids = [...html.matchAll(/\sid="([^"]+)"/g)].map((match) => match[1])
  const controls = [...html.matchAll(/\saria-controls="([^"]+)"/g)].map((match) => match[1])

  assert.equal(new Set(ids).size, ids.length)
  for (const target of controls) assert.ok(ids.includes(target), `Missing #${target}`)
})

test("popup uses only packaged styles and scripts", async () => {
  const html = await readFile(popupPath, "utf8")

  assert.doesNotMatch(html, /https?:\/\//)
  assert.match(html, /href="\.\/popup\.css"/)
  assert.match(html, /src="\.\/popup\.js"/)
})

test("hidden banners stay out of the popup layout", async () => {
  const css = await readFile(popupStylesPath, "utf8")

  assert.match(css, /\.banner\[hidden\]\s*{[^}]*display:\s*none\s*!important;/s)
})

test("destructive actions use the accessible confirmation dialog", async () => {
  const html = await readFile(popupPath, "utf8")

  assert.match(html, /<dialog[^>]+aria-labelledby="confirmDialogTitle"/)
  assert.match(html, /aria-describedby="confirmDialogDescription"/)
  assert.match(html, /id="confirmDialogCancel"[^>]+value="cancel"/)
  assert.match(html, /id="confirmDialogSubmit"[^>]+value="confirm"/)
})

test("cloud backup starts with account creation and accessible password controls", async () => {
  const html = await readFile(popupPath, "utf8")

  assert.match(html, /id="syncModeCreate"[^>]+aria-pressed="true"/)
  assert.match(html, /id="syncModeSignIn"[^>]+aria-pressed="false"/)
  assert.match(html, /id="syncPasswordToggle"[^>]+aria-label="Show password"/)
  assert.match(
    html,
    /id="syncConfirmPasswordToggle"[^>]+aria-label="Show confirmed password"/,
  )
  assert.match(html, /id="syncConfirmPassword"[^>]+required/s)
  assert.match(html, /id="syncAuthSubmit"[^>]*>Create account</)
})

test("reminder presets expose selected state and local data actions explain their scope", async () => {
  const html = await readFile(popupPath, "utf8")

  assert.equal((html.match(/class="preset"[^>]+aria-pressed="false"/g) ?? []).length, 3)
  assert.match(html, />Data on this device</)
  assert.match(html, /No account is required\./)
  assert.match(html, />Download a data copy</)
  assert.match(html, /It cannot be restored in ActiveAid yet\./)
  assert.match(html, />Erase data on this device</)
  assert.match(html, /Cloud backup stays\./)
  assert.ok(html.indexOf("Data on this device") < html.indexOf("Cloud backup"))
  assert.equal((html.match(/class="card settingsCard settingsDisclosure"/g) ?? []).length, 3)
  assert.match(html, /id="syncSummaryHint">Off · No account required</)
})

test("relief player explains automatic step progression", async () => {
  const [html, script] = await Promise.all([
    readFile(popupPath, "utf8"),
    readFile(popupScriptPath, "utf8"),
  ])

  assert.match(html, /id="stepAutoAdvanceNote"/)
  assert.match(html, /The next step starts automatically when the timer ends\./)
  assert.match(html, /class="stepCardBody" aria-live="polite" aria-atomic="true"/)
  assert.match(script, /player\.isCompleted = true/)
  assert.match(script, /Session saved\. Choose Done when you're ready\./)
  assert.match(script, /async function finishCompletedSession\(\)/)
  assert.doesNotMatch(script, /Brief pause so user sees the completion state/)
})

test("insight labels stay concise in the compact metric grid", async () => {
  const script = await readFile(popupScriptPath, "utf8")

  for (const label of [
    "Breaks today",
    "Relief today",
    "Sessions in 7 days",
    "Active today",
    "Check-in streak",
    "Today’s check-in",
  ]) {
    assert.match(script, new RegExp(`label: "${label}"`))
  }
})

test("Today hero separates activity, sessions, and reminder status", async () => {
  const [html, script] = await Promise.all([
    readFile(popupPath, "utf8"),
    readFile(popupScriptPath, "utf8"),
  ])

  assert.match(html, /src="\.\.\/assets\/icon\.svg"/)
  assert.match(html, />Activity today</)
  assert.match(html, /id="heroSessionMeta" hidden/)
  assert.match(html, /id="heroMeta">Checking in/)
  assert.match(script, /"1 relief session"/)
  assert.doesNotMatch(script, /heroMeta\.textContent = `\$\{sessionText\} ·/)
})

test("check-in keeps its save action visible and uses compact labels", async () => {
  const [html, script, styles] = await Promise.all([
    readFile(popupPath, "utf8"),
    readFile(popupScriptPath, "utf8"),
    readFile(popupStylesPath, "utf8"),
  ])
  const footerIndex = html.indexOf('id="checkInFooter"')

  assert.ok(footerIndex > html.indexOf("</main>"))
  assert.ok(footerIndex < html.indexOf('<nav class="nav"'))
  assert.match(html, /id="checkInFooter" hidden/)
  assert.match(html, /<span class="optionalBadge">Optional<\/span>/)
  assert.match(script, /label\.textContent = getSeverityShortLabel\(s\.id\)/)
  assert.match(script, /btn\.setAttribute\("aria-label", s\.label\)/)
  assert.match(styles, /\.checkInFooter \{[\s\S]*flex: 0 0 auto;[\s\S]*border-top:/)
})
