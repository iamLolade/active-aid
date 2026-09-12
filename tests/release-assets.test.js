import test from "node:test"
import assert from "node:assert/strict"
import { readFile } from "node:fs/promises"

const extensionRoot = new URL("../extension/", import.meta.url)

test("manifest icons exist at their declared PNG dimensions", async () => {
  const manifest = JSON.parse(await readFile(new URL("manifest.json", extensionRoot), "utf8"))

  for (const [size, path] of Object.entries(manifest.icons)) {
    const icon = await readFile(new URL(path, extensionRoot))
    assert.equal(icon.subarray(0, 8).toString("hex"), "89504e470d0a1a0a", `${path} is not PNG`)
    assert.equal(icon.readUInt32BE(16), Number(size), `${path} has the wrong width`)
    assert.equal(icon.readUInt32BE(20), Number(size), `${path} has the wrong height`)
  }
})

test("extension configuration excludes privileged credentials", async () => {
  const config = await readFile(new URL("shared/sync-config.js", extensionRoot), "utf8")

  assert.doesNotMatch(config, /SERVICE_ROLE/i)
})
