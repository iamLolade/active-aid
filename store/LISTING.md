# Chrome Web Store listing draft (ActiveAid)

Copy fields into the [Chrome Web Store Developer Dashboard](https://chrome.google.com/webstore/devconsole) when uploading `dist/activeaid-extension.zip`.

Replace `{APP_URL}` with your deployed site (e.g. `https://activeaid.app` from `NEXT_PUBLIC_APP_URL`).

---

## Package

```bash
npm run package:extension
```

Upload: `dist/activeaid-extension.zip`  
Current version: see `extension/manifest.json` (`version` field)

---

## Listing fields

| Field | Value |
|-------|-------|
| **Name** | ActiveAid |
| **Category** | Productivity |
| **Language** | English |
| **Homepage URL** | `{APP_URL}` |
| **Support URL** | `{APP_URL}/install` |
| **Privacy policy URL** | `{APP_URL}/privacy` |

### Short description (max 132 characters)

```
Gentle wellness reminders, desk relief sessions, and daily check-ins. Local-first. No account required.
```

(96 characters)

### Detailed description

```
ActiveAid is a calm wellness companion for desk workers.

It helps you build healthier work habits with gentle movement reminders, short guided relief sessions at your desk, and a simple daily check-in. Everything stays on your device by default. No account required.

WHAT YOU GET
• Gentle reminders after sustained activity (with snooze and reset)
• Quick relief sessions for neck, wrist, lower back, and more
• Daily check-in to log how your body feels
• Simple Insights from your local data (streaks, trends, breaks)

PRIVACY FIRST
• We track activity timing only (keyboard, mouse, and tab focus) to schedule breaks
• We never log what you type, page content, screenshots, or camera data
• Check-ins and session history are stored locally in your browser
• Export or clear your data anytime from Settings

NOT MEDICAL ADVICE
ActiveAid supports wellness habits. It is not a medical or diagnostic tool. Stop any movement if it hurts and follow your own medical guidance.

Install, open the popup, and get started in under a minute.
```

---

## Single purpose

```
ActiveAid provides workplace wellness reminders and guided desk relief sessions based on activity timing on web pages the user visits.
```

---

## Permission justifications (dashboard questionnaire)

| Permission | Justification |
|------------|---------------|
| **alarms** | Run periodic background checks so reminders can fire after the user’s chosen active-time interval. |
| **notifications** | Show gentle break reminders when sustained activity reaches the user’s interval. |
| **storage** | Save reminder settings, check-ins, session history, and onboarding state locally on the device. |
| **Host permissions (http/https)** | Detect activity timing signals (keyboard, mouse, scroll, tab focus) on pages the user visits to estimate active work time. No page content is read, stored, or transmitted. |

---

## Privacy practices (certification)

Answer consistently with `{APP_URL}/privacy` and extension behavior:

| Question | Answer |
|----------|--------|
| Does the extension collect user data? | **Yes** |
| Is collection required for core functionality? | **Yes** (activity timing for reminders; user-entered check-ins/sessions) |
| Is data sold to third parties? | **No** |
| Is data used for purposes unrelated to the extension? | **No** |
| Is data encrypted in transit? | **N/A** for MVP (data stays local; no backend sync by default) |
| Can users request data deletion? | **Yes** (Clear my data in Settings) |

**Data types collected (local only):**
- Activity timing signals (not content)
- User wellness check-ins (severity, optional body areas)
- Completed relief session logs
- Reminder settings

**Not collected:** typed content, page content, browsing history content, screenshots, camera, location, financial info.

---

## Screenshots (store upload)

Use 1280×800 or 640×400 PNG/JPEG. Suggested sources in this repo:

| Screen | Suggested file |
|--------|----------------|
| Today tab | `public/screenshots/extension-today.png` or `public/hero-popup.png` |
| Check-in | `public/check-in-tab.png` |
| Quick relief / session player | `public/relief-ui.png` |
| Insights (capture from extension after test data) | Capture manually after QA |

Tip: crop to the popup (~400px wide) centered on a neutral background if needed.

---

## Distribution

**Recommended for beta:** Unlisted (share link only, not searchable).

After approval, set `NEXT_PUBLIC_CHROME_STORE_URL` in production env and redeploy the web app so `/install` can link directly to the listing.

---

## Update checklist

1. Increment `version` in `extension/manifest.json`
2. `npm run package:extension`
3. Upload new zip in Developer Dashboard
4. Submit for review
