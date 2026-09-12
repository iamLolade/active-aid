# ActiveAid Extension (MVP)

Cross-browser MV3 extension for **Chrome**, **Edge**, and **Firefox**, packaged with a compatible manifest for each browser.

## Load unpacked

### Chrome
1. Open `chrome://extensions`
2. Enable **Developer mode**
3. **Load unpacked** → select the `extension/` folder

### Microsoft Edge
1. Open `edge://extensions`
2. Enable **Developer mode**
3. **Load unpacked** → select the `extension/` folder

### Firefox (112+)
Run `npm run package:extension` from the project root first.

1. Open `about:debugging#/runtime/this-firefox`
2. **Load Temporary Add-on…** → pick `dist/activeaid-extension-firefox.zip`
3. Re-load after browser restart (temporary add-ons do not persist)

## Quick test
- Open any `https://` webpage and interact (mouse/keyboard).
- Open the popup, enable reminders, and pick an interval (30 / 60 / 90 presets).
- After your chosen interval of continuous activity, you should receive a gentle notification.
- Select **Choose a quick reset** (or the notification body) to open a focused, compact ActiveAid window at the expanded Quick Relief list. **Snooze 10m** delays the next nudge.
- Stop interacting for five minutes and confirm stale activity does not produce a reminder.

## Wellness sessions
- In the popup, open **Quick relief** and start any session (neck, wrist, lower back, shoulder, eyes).
- Step through the guided cards and tap **Complete session**.
- Completion is saved locally; the popup shows how many sessions you finished today.

## Check-ins & insights
- Use the **Check-in** tab to log how your body feels (severity + optional body areas).
- Open **Insights** for breaks taken, estimated active time, check-in streak, 7-day trends, and top noted areas.
- All data stays in local browser storage (no account required).

## Trust & control
- First run shows onboarding once (privacy + optional reminders).
- Activity timing begins only after the user reviews onboarding and selects **Agree and get started**.
- **Settings** in bottom navigation: reminder timing, privacy copy, **Download my data**, and **Erase data on this device**.
- Destructive local and cloud actions use an in-product confirmation dialog with keyboard cancellation and focus return.
- **Optional cloud backup** (when Supabase is configured): create an account or sign in, then separately turn on **Back up my wellness data** to sync check-ins, completed sessions, and reminder settings.
- Creating an account or signing in does not upload wellness data. **Delete cloud backup** removes backed-up records without deleting local wellness data.
- See `RELEASE.md` section **4b** for the full individual user journey QA checklist.

Configure sync: `npm run sync:config` (see `supabase/README.md`).

## Validate changes
```bash
npm test
npm run validate
```

The tests cover reminder decisions and inactivity boundaries, wellness-summary date logic, time helpers, and relief-session catalog integrity. Installed notification, permission, dialog, keyboard, and browser-lifecycle behavior still requires the manual release checklist.

## Package for stores
```bash
npm run package:extension
```
Produces targeted zips for Chrome, Edge, and Firefox from the shared source. The packaging script generates browser-specific manifests without modifying `extension/manifest.json` or its development sync configuration. See [FIREFOX_EDGE.md](../FIREFOX_EDGE.md) and [CHROME_WEB_STORE.md](../CHROME_WEB_STORE.md).

## Privacy
This MVP tracks **timing of activity signals only** (e.g., that *some* activity occurred), and does not log typed content, page content, screenshots, or camera data. Activity timing never leaves the device. Optional cloud backup uploads only check-ins, completed sessions, and reminder settings after explicit opt-in.
