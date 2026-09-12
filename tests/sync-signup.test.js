import test from "node:test"
import assert from "node:assert/strict"

function createChromeMock() {
  const local = new Map()
  const sync = new Map()

  function area(store) {
    return {
      get(key, callback) {
        callback({ [key]: store.get(key) })
      },
      set(items, callback) {
        for (const [key, value] of Object.entries(items)) store.set(key, value)
        callback()
      },
      remove(keys, callback) {
        for (const key of Array.isArray(keys) ? keys : [keys]) store.delete(key)
        callback()
      },
    }
  }

  return {
    runtime: { lastError: null },
    storage: {
      local: area(local),
      sync: area(sync),
    },
  }
}

test("sign up supports the email-confirmation flow without pretending the user is signed in", async (t) => {
  const originalChrome = globalThis.chrome
  const originalFetch = globalThis.fetch
  globalThis.chrome = createChromeMock()

  let request = null
  globalThis.fetch = async (url, options) => {
    request = { url: String(url), options }
    return {
      ok: true,
      async json() {
        return { user: { id: "new-user" } }
      },
    }
  }

  t.after(() => {
    globalThis.chrome = originalChrome
    globalThis.fetch = originalFetch
  })

  const { signUp, getSyncState } = await import(
    new URL(`../extension/shared/sync.js?test=${Date.now()}`, import.meta.url)
  )
  const result = await signUp("  person@example.com  ", "long-enough-password")
  const state = await getSyncState()

  assert.deepEqual(result, {
    status: "confirmation-required",
    email: "person@example.com",
  })
  assert.match(request.url, /\/auth\/v1\/signup$/)
  assert.deepEqual(JSON.parse(request.options.body), {
    email: "person@example.com",
    password: "long-enough-password",
  })
  assert.equal(state.accessToken, "")
  assert.equal(state.enabled, false)
})

test("sign up rejects passwords shorter than the public form requirement", async () => {
  const { signUp } = await import(
    new URL(`../extension/shared/sync.js?password=${Date.now()}`, import.meta.url)
  )

  await assert.rejects(() => signUp("person@example.com", "short"), /at least 8 characters/)
})
