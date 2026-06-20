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
- **Settings** (gear or **More options**): reminders, privacy copy, **Export data**, and **Clear my data**.
- **Optional cloud backup** (when Supabase is configured): sign in to sync check-ins, sessions, and settings across devices.
- See `RELEASE.md` section **4b** for the full individual user journey QA checklist.

Configure sync: `npm run sync:config` (see `supabase/README.md`).

## Package for stores
```bash
npm run package:extension
```
Produces zips for Chrome, Edge, and Firefox. See [FIREFOX_EDGE.md](../FIREFOX_EDGE.md) and [CHROME_WEB_STORE.md](../CHROME_WEB_STORE.md).

## Privacy
This MVP tracks **timing of activity signals only** (e.g., that *some* activity occurred), and does not log typed content, page content, screenshots, or camera data.
