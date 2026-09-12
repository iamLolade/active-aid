# Supabase (ActiveAid MVP)

## What this includes
- Tables:
  - `wellness_logs` (relief sessions)
  - `discomfort_logs` (daily check-ins)
  - `reminder_settings` (user settings)
- RLS enabled + policies for `authenticated` users (each user can only access their own rows).
- Optional extension cloud sync

## Apply migrations
In the Supabase dashboard **SQL Editor**, run in order:
1. `supabase/migrations/0001_init.sql`
2. `supabase/migrations/0002_sync_client_ids.sql`
3. `supabase/migrations/0003_cloud_data_delete_policies.sql`

## Auth for extension sync (optional)
Cloud sync uses Supabase email + password auth from the extension popup.

1. In Supabase **Authentication → Providers**, enable Email and allow new user sign-ups.
2. Keep **Confirm email** enabled for production. A new extension user creates an account, confirms the email, then returns to ActiveAid to sign in.
3. In **Authentication → URL Configuration**, set **Site URL** to the deployed ActiveAid website rather than the localhost default.
4. Configure custom SMTP before a public release. Supabase's default sender is intended for testing and is heavily rate-limited.
5. Create and confirm a test account from the extension before packaging the release.

## Wire the extension
From the repo root (with `.env` filled in):

```bash
npm run sync:config
```

This writes `extension/shared/sync-config.js` from `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`.

Reload the extension. Settings → **Optional cloud backup** appears when configured.

### Sync behavior
- **Off by default.** Creating an account or signing in authenticates only and does not upload wellness data.
- User must separately turn on **Back up my wellness data** before the first sync.
- Backs up check-ins, completed sessions, and reminder settings (not activity timing or page content).
- **Sync now** and auto-sync (debounced) when backup is enabled.
- First enabled sync merges remote data into local storage, then pushes local changes.
- **Delete cloud backup** turns backup off and deletes the user's backed-up rows. Local data remains on the device.

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
