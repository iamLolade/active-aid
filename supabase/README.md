# Supabase (ActiveAid MVP)

## What this includes
- Tables:
  - `wellness_logs` (relief sessions)
  - `discomfort_logs` (daily check-ins)
  - `reminder_settings` (user settings)
- RLS enabled + policies for `authenticated` users (each user can only access their own rows).

## Apply the migration
In the Supabase dashboard:
1. Go to **SQL Editor**
2. Paste and run: `supabase/migrations/0001_init.sql`

Afterwards, you can verify tables exist under **Table Editor**.

## Verify from the app
With `npm run dev` running, open:

`http://localhost:3000/api/health/supabase`

Expected response:
- `ok: true`
- `auth.status: 200`
- `rest.status: 200`
- `schema.status: 200` (after migration is applied)

## Environment variables
This repo expects (via `.env`, not committed):
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY` (server-only; never expose to the browser)

