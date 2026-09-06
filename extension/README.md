# ActiveAid Extension (MVP)

Cross-browser MV3 extension for **Chrome**, **Edge**, and **Firefox**.

## Load unpacked

### Chrome
1. Open `chrome://extensions`
2. Enable **Developer mode**
3. **Load unpacked** → select the `extension/` folder

### Microsoft Edge
1. Open `edge://extensions`
2. Enable **Developer mode**
3. **Load unpacked** → select the `extension/` folder

### Firefox (109+)
1. Open `about:debugging#/runtime/this-firefox`
2. **Load Temporary Add-on…** → pick `extension/manifest.json`
3. Re-load after browser restart (temporary add-ons do not persist)

## Quick test
- Open any `https://` webpage and interact (mouse/keyboard).
- Open the popup, enable reminders, and pick an interval (30 / 60 / 90 presets).
- After your chosen interval of continuous activity, you should receive a gentle notification.
- Select **Choose a quick reset** (or the notification body) to open ActiveAid at the expanded Quick Relief list. **Snooze 10m** delays the next nudge.
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
- **Settings** in bottom navigation: reminders, privacy copy, **Export data**, and **Clear my data**.
- **Optional cloud backup** (when Supabase is configured): signing in does not upload data. Turn on **Back up my wellness data** separately to sync check-ins, completed sessions, and reminder settings.
- **Delete cloud backup data** removes backed-up records without deleting local wellness data.
- See `RELEASE.md` section **4b** for the full individual user journey QA checklist.

Configure sync: `npm run sync:config` (see `supabase/README.md`).

## Package for stores
```bash
npm run package:extension
```
Produces zips for Chrome, Edge, and Firefox. See [FIREFOX_EDGE.md](../FIREFOX_EDGE.md) and [CHROME_WEB_STORE.md](../CHROME_WEB_STORE.md).

## Privacy
This MVP tracks **timing of activity signals only** (e.g., that *some* activity occurred), and does not log typed content, page content, screenshots, or camera data. Activity timing never leaves the device. Optional cloud backup uploads only check-ins, completed sessions, and reminder settings after explicit opt-in.
