/**
 * Supabase connection for optional cloud sync.
 * Run `npm run sync:config` to populate from `.env`, or set values manually.
 */
export const SUPABASE_URL = ""
export const SUPABASE_ANON_KEY = ""

export function isSyncConfigured() {
  return Boolean(SUPABASE_URL && SUPABASE_ANON_KEY)
}
