function getSupabaseUrl() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  if (!url) throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL")
  return url
}

function supabaseFetch(path: string, apiKey: string, init?: RequestInit) {
  const fullUrl = new URL(path, getSupabaseUrl())
  const headers = new Headers(init?.headers)
  headers.set("apikey", apiKey)
  headers.set("authorization", `Bearer ${apiKey}`)

  return fetch(fullUrl, {
    ...init,
    headers,
    cache: "no-store",
  })
}

export async function supabaseAnonFetch(path: string, init?: RequestInit) {
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!anonKey) throw new Error("Missing NEXT_PUBLIC_SUPABASE_ANON_KEY")
  return supabaseFetch(path, anonKey, init)
}

export async function supabaseAdminFetch(path: string, init?: RequestInit) {
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!serviceRoleKey) throw new Error("Missing SUPABASE_SERVICE_ROLE_KEY")
  return supabaseFetch(path, serviceRoleKey, init)
}

