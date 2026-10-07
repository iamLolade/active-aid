import { supabaseAdminFetch, supabaseAnonFetch } from "@/lib/supabaseAdmin"

export const dynamic = "force-dynamic"

export async function GET() {
  const startedAt = Date.now()

  const envOk =
    Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL) &&
    Boolean(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) &&
    Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY)

  if (!envOk) {
    return Response.json(
      {
        ok: false,
        error: "Missing required Supabase environment variables.",
      },
      { status: 500 }
    )
  }

  // Auth health requires the anon apikey on most Supabase projects.
  const authRes = await supabaseAnonFetch("/auth/v1/health", { method: "GET" }).catch(
    (err) => ({ ok: false, status: 0, statusText: String(err) }) as Response
  )

  // PostgREST check (validates service role key is usable)
  const restRes = await supabaseAdminFetch("/rest/v1/", { method: "GET" }).catch(
    (err) => ({ ok: false, status: 0, statusText: String(err) }) as Response
  )

  // Confirms the table and sync-deduplication column required by the extension exist.
  const schemaRes = await supabaseAdminFetch(
    "/rest/v1/wellness_logs?select=id,client_event_id&limit=1",
    { method: "GET" }
  ).catch((err) => ({ ok: false, status: 0, statusText: String(err) }) as Response)

  const durationMs = Date.now() - startedAt

  return Response.json({
    ok: authRes.ok && restRes.ok && schemaRes.ok,
    durationMs,
    auth: { ok: authRes.ok, status: authRes.status },
    rest: { ok: restRes.ok, status: restRes.status },
    schema: { ok: schemaRes.ok, status: schemaRes.status },
  })
}
