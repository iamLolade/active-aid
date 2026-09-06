# Firefox and Edge — testing and publishing

ActiveAid uses one MV3 codebase for Chrome, Edge, and Firefox. The same zip from `npm run package:extension` uploads to all three stores.

Cross-browser APIs live in `extension/shared/browser-api.js`. Chrome and Edge ignore `browser_specific_settings.gecko` in `manifest.json`.

---

## Package

```bash
npm run package:extension
```

Outputs (identical builds):

| File | Store |
|------|-------|
| `dist/activeaid-extension.zip` | Chrome Web Store |
| `dist/activeaid-extension-edge.zip` | Microsoft Edge Add-ons |
| `dist/activeaid-extension-firefox.zip` | Firefox Add-ons (AMO) |

---

## Local testing

### Chrome
1. `chrome://extensions` → Developer mode → **Load unpacked** → select `extension/`
2. Run `RELEASE.md` section **4b** (individual journey)

### Microsoft Edge
1. `edge://extensions` → Developer mode → **Load unpacked** → select `extension/`
2. Same QA as Chrome (Chromium-based; same MV3 behavior)

### Firefox
Requires Firefox **109+** (MV3 service workers).

1. Open `about:debugging#/runtime/this-firefox`
2. Click **Load Temporary Add-on…**
3. Select any file inside `extension/` (e.g. `manifest.json`)
4. Run the same journey QA:
   - Onboarding → Today → Quick Relief session → Check-in → Insights
   - Reminders, snooze, reset timer
   - Export / Clear data in Settings

**Note:** Temporary add-ons are removed when Firefox closes. For persistent local testing, use AMO unlisted/self-distribution after review, or reload each session.

---

## Publish

### Microsoft Edge Add-ons
1. [Partner Center](https://partner.microsoft.com/dashboard) → Edge extensions
2. Submit `dist/activeaid-extension-edge.zip`
3. Reuse listing copy from `store/LISTING.md`
4. Privacy policy URL: `{APP_URL}/privacy`
5. Distribution: **Unlisted** for beta, public when ready

Edge accepts the same MV3 package as Chrome in most cases.

### Firefox Add-ons (AMO)
1. [Firefox Developer Hub](https://addons.mozilla.org/developers/)
2. Submit `dist/activeaid-extension-firefox.zip`
3. **Gecko ID** (in manifest): `activeaid@activeaid.app`
4. Reuse listing copy from `store/LISTING.md` (adjust store name references if needed)
5. Privacy policy URL: `{APP_URL}/privacy`
6. Complete AMO privacy questionnaire consistently with the local-first and optional cloud-backup behavior
7. Choose **Unlisted** for beta

Firefox review may ask about `host_permissions`: explain activity timing only, no page content (see permission justifications in `store/LISTING.md`).

---

## Cross-browser QA checklist

Run on each browser before publishing:

- [ ] Onboarding shows once; **Agree and get started** lands on Today
- [ ] No activity timing begins before onboarding consent
- [ ] Activity timer updates after mouse/keyboard on a web page
- [ ] Reminder notification fires after interval (or use debug tick if needed)
- [ ] Snooze and reset timer update hero status
- [ ] Quick Relief session completes and logs locally
- [ ] Check-in saves; Insights updates
- [ ] Export downloads JSON; Clear data resets to onboarding
- [ ] Blocked notifications show banner on Today (when reminders on)

---

## Updates

1. Increment `version` in `extension/manifest.json`
2. `npm run package:extension`
3. Upload new zip to each store dashboard you use

See also:
- [CHROME_WEB_STORE.md](./CHROME_WEB_STORE.md)
- [store/LISTING.md](./store/LISTING.md)
