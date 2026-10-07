import test from "node:test"
import assert from "node:assert/strict"
import { readFile } from "node:fs/promises"

const projectFile = (path) => new URL(`../${path}`, import.meta.url)

test("health check verifies the sync column required by cloud backup", async () => {
  const [route, migration] = await Promise.all([
    readFile(projectFile("app/api/health/supabase/route.ts"), "utf8"),
    readFile(projectFile("supabase/migrations/0002_sync_client_ids.sql"), "utf8"),
  ])

  assert.match(route, /select=id,client_event_id&limit=1/)
  assert.match(route, /authRes\.ok && restRes\.ok && schemaRes\.ok/)
  assert.match(migration, /add column if not exists client_event_id text/)
})

test("confirmation email template is branded and keeps the Supabase confirmation link", async () => {
  const template = await readFile(
    projectFile("supabase/templates/confirmation.html"),
    "utf8",
  )

  assert.match(template, /ActiveAid/)
  assert.match(template, /Wellness while you work\./)
  assert.match(template, /Confirm email address/)
  assert.match(template, /{{ \.ConfirmationURL }}/)
  assert.doesNotMatch(template, /<script/i)
})
