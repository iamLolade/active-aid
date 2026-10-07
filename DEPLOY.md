# ActiveAid — Chrome Web Store Deployment Guide

Use this when you're ready to publish the extension on the Chrome Web Store. Choose **Public** for a searchable end-user release or **Unlisted** for a link-only beta. Both receive automatic updates.

---

## Prerequisites

- [ ] GitHub account with repo created
- [ ] Vercel account (free)
- [ ] Google account + one-time \$5 [Chrome Web Store Developer registration](https://chrome.google.com/webstore/devconsole)
- [ ] Supabase project already set up (credentials in `.env`)
- [ ] Public support inbox ready for account and data requests

---

## Step 1: Push to GitHub

```bash
# From the project root
git add -A
git commit -m "MVP 0.2.0"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/activeaid.git
git push -u origin main
```

> `.env` is already in `.gitignore` — no secrets will be committed.

---

## Step 2: Deploy web app to Vercel

1. Go to [vercel.com](https://vercel.com) → **Add New Project** → Import your GitHub repo
2. Add these environment variables:

   | Key | Value |
   |-----|-------|
   | `NEXT_PUBLIC_SUPABASE_URL` | your Supabase project URL |
   | `NEXT_PUBLIC_SUPABASE_ANON_KEY` | your Supabase anon key |
   | `SUPABASE_SERVICE_ROLE_KEY` | your Supabase service role key |
   | `NEXT_PUBLIC_APP_URL` | `https://activeaid.vercel.app` (or whatever Vercel assigns) |
   | `NEXT_PUBLIC_SUPPORT_EMAIL` | your public support inbox |

3. Click **Deploy**
4. Verify:
   - `https://activeaid.vercel.app/api/health/supabase` → `{ "ok": true, ... }`
   - `https://activeaid.vercel.app/privacy` → privacy policy renders
   - `https://activeaid.vercel.app/support` → support guidance and contact link render

### Finish Supabase authentication for production

Before packaging the extension:

1. Run `supabase/migrations/0001_init.sql`, `0002_sync_client_ids.sql`, and `0003_cloud_data_delete_policies.sql` in order.
2. In **Authentication → Providers → Email**, allow new user sign-ups and keep email confirmation enabled.
3. In **Authentication → URL Configuration**, set the Site URL to the deployed ActiveAid website.
4. In **Authentication → Email Templates → Confirm signup**, use the subject `Confirm your ActiveAid email` and paste `supabase/templates/confirmation.html` into the message body.
5. Configure a production SMTP provider with `ActiveAid` as the sender name; the default Supabase sender is only suitable for limited testing.
6. Create an account from the extension, confirm the email, sign in, and verify that cloud backup remains off until explicitly enabled.

---

## Step 3: Package the extension

```bash
npm run package:extension
```

Output: `dist/activeaid-extension.zip`

---

## Step 4: Submit to Chrome Web Store

1. Go to [Chrome Web Store Developer Dashboard](https://chrome.google.com/webstore/devconsole)
2. Click **New item**
3. Upload `dist/activeaid-extension.zip`

### Listing fields

Paste from [`store/LISTING.md`](./store/LISTING.md):

| Field | Value |
|-------|-------|
| **Name** | ActiveAid |
| **Category** | Well-being |
| **Short description** | `Gentle wellness reminders, desk relief sessions, and daily check-ins. Local-first. No account required.` |
| **Detailed description** | *(paste full description from `store/LISTING.md`)* |
| **Homepage URL** | `https://activeaid.vercel.app` |
| **Support URL** | `https://activeaid.vercel.app/support` |
| **Privacy policy URL** | `https://activeaid.vercel.app/privacy` |

### Screenshots

Run `npm run store:assets`, then upload the generated screenshots from `public/store/screenshots/` and promo tiles from `public/store/promos/`.

| Screen | What to capture |
|--------|----------------|
| Today tab | The main popup with hero card, check-in row, and Quick Relief sessions |
| Check-in tab | Severity options and body area chips |
| Insights tab | Stats grid, 7-day trend, and most noted areas |
| Session player | A step view during a Quick Relief session |

### Privacy certification

Answer consistently with `app/privacy/page.tsx`:

| Question | Answer |
|----------|--------|
| Does the extension collect user data? | **Yes** (activity timing for reminders; user-entered check-ins/sessions) |
| Is data sold to third parties? | **No** |
| Is data used for unrelated purposes? | **No** |
| Is data encrypted in transit? | **Yes** when optional cloud backup is enabled; otherwise data stays local. |
| Can users request data deletion? | **Yes** (Erase data on this device and Delete cloud backup in Settings) |

### Distribution

- Choose **Public** when the listing, support path, privacy policy, and release checklist are ready for end users.
- Choose **Unlisted** for a link-only beta before the public launch.

### Submit

Click **Submit for review**. Review timing is controlled by the Chrome Web Store.

---

## Step 5: Share the release

After approval, share the Chrome Web Store URL:

```
https://chromewebstore.google.com/detail/activeaid/XXXXXXXXXX
```

The user clicks **Add to Chrome** — no Developer mode and no manual updates.

---

## Updating later

```bash
# 1. Bump version in extension/manifest.json
# 2. Re-package
npm run package:extension
# 3. Upload new zip in Developer Dashboard → Submit for review
```

---

## What users need

Just the store link. They install in 2 clicks:
1. Click **Add to Chrome**
2. Pin the extension from the puzzle icon in the toolbar

That's it. All data stays local by default.
