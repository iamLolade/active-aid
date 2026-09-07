import test from "node:test"
import assert from "node:assert/strict"
import { readFile } from "node:fs/promises"

const popupPath = new URL("../extension/popup/popup.html", import.meta.url)
const popupStylesPath = new URL("../extension/popup/popup.css", import.meta.url)

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
