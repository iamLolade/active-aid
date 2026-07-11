# ActiveAid — Chrome Web Store Deployment Guide

Use this when you're ready to publish the extension on the Chrome Web Store as **Unlisted** (private link, not searchable). Your team installs with one click and gets automatic updates.

---

## Prerequisites

- [ ] GitHub account with repo created
- [ ] Vercel account (free)
- [ ] Google account + one-time \$5 [Chrome Web Store Developer registration](https://chrome.google.com/webstore/devconsole)
- [ ] Supabase project already set up (credentials in `.env`)

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

3. Click **Deploy**
4. Verify:
   - `https://activeaid.vercel.app/api/health/supabase` → `{ "ok": true, ... }`
   - `https://activeaid.vercel.app/privacy` → privacy policy renders

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
| **Category** | Productivity |
| **Short description** | `Gentle wellness reminders, desk relief sessions, and daily check-ins. Local-first. No account required.` |
| **Detailed description** | *(paste full description from `store/LISTING.md`)* |
| **Homepage URL** | `https://activeaid.vercel.app` |
| **Support URL** | `https://activeaid.vercel.app/install` |
| **Privacy policy URL** | `https://activeaid.vercel.app/privacy` |

### Screenshots

Use 1280×800 or 640×400 PNG/JPEG. Suggested captures from the popup:

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
| Is data encrypted in transit? | **N/A for MVP** (data stays local; no backend sync by default) |
| Can users request data deletion? | **Yes** (Clear my data in Settings) |

### Distribution

Choose **Unlisted** (not searchable, shareable link only).

### Submit

Click **Submit for review**. Unlisted reviews are typically faster (hours, not days).

---

## Step 5: Share with your team

After approval, share the Chrome Web Store URL:

```
https://chromewebstore.google.com/detail/activeaid/XXXXXXXXXX
```

Your teammate clicks **Add to Chrome** — no Developer mode, no manual updates.

---

## Updating later

```bash
# 1. Bump version in extension/manifest.json
# 2. Re-package
npm run package:extension
# 3. Upload new zip in Developer Dashboard → Submit for review
```

---

## What your team member needs

Just the store link. They install in 2 clicks:
1. Click **Add to Chrome**
2. Pin the extension from the puzzle icon in the toolbar

That's it. All data stays local by default.
