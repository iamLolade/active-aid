import test from "node:test"
import assert from "node:assert/strict"
import { readFile } from "node:fs/promises"

const workerPath = new URL("../extension/background/sw.js", import.meta.url)
const popupScriptPath = new URL("../extension/popup/popup.js", import.meta.url)
const popupStylesPath = new URL("../extension/popup/popup.css", import.meta.url)

test("toolbar popup bounds its content so long views can scroll", async () => {
  const styles = await readFile(popupStylesPath, "utf8")

  assert.match(styles, /body \{[\s\S]*height: 600px;[\s\S]*overflow: hidden;/)
  assert.match(styles, /\.app \{[\s\S]*height: 100%;[\s\S]*overflow: hidden;/)
  assert.match(styles, /\.main \{[\s\S]*min-height: 0;[\s\S]*overflow-y: auto;/)
  assert.match(styles, /\.nav \{[\s\S]*flex: 0 0 auto;/)
})

test("quick-reset notification actions open a compact window with a durable tab fallback", async () => {
  const source = await readFile(workerPath, "utf8")
  const handler = source.slice(
    source.indexOf("async function openQuickRelief()"),
    source.indexOf("async function tick()"),
  )

  assert.ok(handler.indexOf("await setQuickReliefIntent()") >= 0)
  assert.ok(handler.indexOf("await windowsCreate") > handler.indexOf("await setQuickReliefIntent()"))
  assert.ok(handler.indexOf("await tabsCreate") > handler.indexOf("await windowsCreate"))
  assert.match(handler, /type: "popup"/)
  assert.match(handler, /focused: true/)
  assert.match(handler, /getURL\("popup\/popup\.html"\)/)
  assert.match(handler, /\?surface=window/)
  assert.doesNotMatch(handler, /openActionPopup/)
})

test("notification window keeps navigation visible while long views scroll", async () => {
  const [script, styles] = await Promise.all([
    readFile(popupScriptPath, "utf8"),
    readFile(popupStylesPath, "utf8"),
  ])

  assert.match(script, /URLSearchParams\(window\.location\.search\)/)
  assert.match(script, /classList\.toggle\("windowSurface", isWindowSurface\)/)
  assert.match(styles, /html\.windowSurface[\s\S]*height: 100%/)
  assert.match(styles, /\.main \{[\s\S]*min-height: 0;[\s\S]*overflow-y: auto;/)
  assert.match(styles, /\.nav \{[\s\S]*flex: 0 0 auto;/)
})

test("notification Quick Relief mode starts at the top without scrolling the Today page", async () => {
  const source = await readFile(popupScriptPath, "utf8")
  const handler = source.slice(
    source.indexOf("async function handleQuickReliefIntent()"),
    source.indexOf("function closeSession()"),
  )

  assert.match(handler, /classList\.add\("view--quick-relief-launch"\)/)
  assert.doesNotMatch(handler, /scrollIntoView/)
  assert.match(handler, /focus\(\{ preventScroll: true \}\)/)
})
