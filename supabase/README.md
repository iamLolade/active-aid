# Supabase (ActiveAid MVP)

## What this includes
- Tables:
  - `wellness_logs` (relief sessions)
  - `discomfort_logs` (daily check-ins)
  - `reminder_settings` (user settings)
- RLS enabled + policies for `authenticated` users (each user can only access their own rows).
- Optional extension cloud sync (Phase 8.1)

## Apply migrations
In the Supabase dashboard **SQL Editor**, run in order:
1. `supabase/migrations/0001_init.sql`
2. `supabase/migrations/0002_sync_client_ids.sql`

## Auth for extension sync (optional)
Cloud sync uses Supabase email + password auth from the extension popup.

1. In Supabase **Authentication → Providers**, enable Email.
2. For local testing, you may disable **Confirm email** (or confirm users manually in the dashboard).
3. Create a test user (**Authentication → Users → Add user**) or sign up via the Auth API.

## Wire the extension
From the repo root (with `.env` filled in):

```bash
npm run sync:config
```

This writes `extension/shared/sync-config.js` from `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`.

Reload the extension. Settings → **Optional cloud backup** appears when configured.

### Sync behavior
- **Off by default.** User signs in and toggles **Enable cloud backup**.
- Backs up check-ins, completed sessions, and reminder settings (not activity timing or page content).
- **Sync now** and auto-sync (debounced) when backup is enabled.
- First sign-in merges remote data into local storage, then pushes local changes.

## Verify from the app
With `npm run dev` running, open:

`http://localhost:3000/api/health/supabase`

Expected response:
- `ok: true`
- `auth.status: 200`
- `rest.status: 200`
- `schema.status: 200` (after migrations are applied)

## Environment variables
This repo expects (via `.env`, not committed):
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY` (server-only; never expose to the browser)

The anon key is also embedded in the extension zip for optional sync (expected with RLS).
