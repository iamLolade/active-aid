# Chrome Web Store publishing guide (ActiveAid)

Standard path for letting users install without Developer mode.

## Quick links
- **Listing copy (paste into dashboard):** [`store/LISTING.md`](./store/LISTING.md)
- **Privacy policy URL:** `{APP_URL}/privacy` (deploy `app/privacy/page.tsx` first)
- **Package output:** `dist/activeaid-extension.zip` (also `dist/activeaid-extension-edge.zip`, `dist/activeaid-extension-firefox.zip`)
- **Firefox / Edge:** [FIREFOX_EDGE.md](./FIREFOX_EDGE.md)

## Overview
- Publish once (public or unlisted).
- Users install from the listing (“Add to Chrome”).
- Updates are automatic after you upload a new version.

Deploying the website does **not** publish the extension.

## 1. Prerequisites
- Google account + Chrome Web Store Developer registration (one-time fee)
- Production-ready MV3 package (see below)
- Deployed web app with `/privacy` live (required for privacy policy URL)
- Deployed `/support` page with `NEXT_PUBLIC_SUPPORT_EMAIL` configured

## 2. Package the extension

```bash
npm run package:extension
```

This validates `extension/manifest.json` and creates targeted store zips from the shared codebase. Chrome and Edge receive service-worker manifests; Firefox receives its compatible background-script manifest. See [FIREFOX_EDGE.md](./FIREFOX_EDGE.md).

## 3. Prepare store assets

| Asset | Status |
|-------|--------|
| Icons 16 / 32 / 48 / 128 | Included in zip (`extension/assets/`) |
| Screenshots | Capture the packaged release candidate using the verified states in `store/LISTING.md` |
| Listing copy | `store/LISTING.md` |

Run `npm run store:assets`. Upload the 1280×800 screenshots from `public/store/screenshots/` and promo tiles from `public/store/promos/`.

## 4. Create listing in Developer Dashboard

1. [Chrome Web Store Developer Dashboard](https://chrome.google.com/webstore/devconsole) → **New item**
2. Upload `dist/activeaid-extension.zip`
3. Copy fields from `store/LISTING.md`:
   - Name, descriptions, category
   - Homepage, `/support`, and **privacy policy** URLs
   - Single purpose + permission justifications
   - Privacy practices certification
4. Upload screenshots
5. Choose **Unlisted** for beta, or **Public** when ready

## 5. Privacy disclosures

Must match extension behavior and [`app/privacy/page.tsx`](./app/privacy/page.tsx):

- No typed content, page content, screenshots, or camera data
- Activity timing begins after first-run consent, is stored locally, and is never uploaded
- Check-ins, completed sessions, and reminder settings are stored locally by default
- Optional cloud backup requires sign-in followed by a separate opt-in and uses encrypted transport
- Local export, local clearing, and cloud-backup deletion are available in Settings

## 6. After approval

1. Copy the store listing URL
2. Set `NEXT_PUBLIC_CHROME_STORE_URL` in production env
3. Redeploy the web app so `/install` shows the **Add to Chrome** link

## 7. Updates

1. Increment `version` in `extension/manifest.json`
2. `npm run package:extension`
3. Upload the new zip in the dashboard
4. Submit for review

See also [`RELEASE.md`](./RELEASE.md) for full QA before each release.
