# Chrome Web Store listing draft (ActiveAid)

Copy fields into the [Chrome Web Store Developer Dashboard](https://chrome.google.com/webstore/devconsole) when uploading `dist/activeaid-extension.zip`.

Replace `{APP_URL}` with your deployed site (e.g. `https://activeaid.app` from `NEXT_PUBLIC_APP_URL`).
Set `NEXT_PUBLIC_SUPPORT_EMAIL` on the deployed site before submission so the support page offers a direct contact method.

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
| **Category** | Well-being |
| **Language** | English |
| **Homepage URL** | `{APP_URL}` |
| **Support URL** | `{APP_URL}/support` |
| **Privacy policy URL** | `{APP_URL}/privacy` |

### Short description (max 132 characters)

```
Gentle wellness reminders, desk relief sessions, and daily check-ins. Local-first. No account required.
```

(96 characters)

### Detailed description

```
ActiveAid is a calm wellness companion for desk workers.

ActiveAid supports workplace wellness habits with gentle movement reminders, short guided relief sessions at your desk, and a simple daily check-in. Everything stays on your device by default. No account required.

WHAT YOU GET
• Gentle reminders after sustained activity, with a direct path to Quick Relief
• Quick relief sessions for neck, wrist, lower back, and more
• Daily check-in to log how your body feels
• Simple Insights from your local data (streaks, trends, breaks)

PRIVACY FIRST
• After first-run consent, we track activity timing only (keyboard, mouse, scroll, and tab focus) to schedule breaks
• We never log what you type, page content, screenshots, or camera data
• Check-ins and session history are stored locally in your browser
• Optional cloud backup starts only after you sign in and separately turn it on
• Activity timing is never uploaded
• Export local data, clear local data, or delete cloud backup data anytime from Settings

NOT MEDICAL ADVICE
ActiveAid supports workplace wellness habits. It is not a medical, diagnostic, or therapeutic tool. Stop any movement if it hurts and follow your own medical guidance.

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
| **storage** | Save reminder settings, check-ins, session history, onboarding state, and an optional cloud-backup sign-in session locally on the device. |
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
| Is data encrypted in transit? | **Yes** when the user enables optional cloud backup; otherwise data stays local. |
| Can users request data deletion? | **Yes** (Erase data on this device and Delete cloud backup in Settings) |

**Data handled locally by the extension:**
- Activity timing signals (not content)
- User wellness check-ins (severity, optional body areas)
- Completed relief session logs
- Reminder settings
- Account email and session tokens when the user signs in for optional cloud backup

**Optional cloud backup, only after explicit opt-in:**
- User wellness check-ins
- Completed relief session logs
- Reminder settings

Activity timing is never uploaded. Cloud-backup traffic is encrypted in transit. Users can delete backed-up records from Settings without deleting local data.

**Dashboard data-type selections:**
- **Health information:** wellness check-ins, optional body areas, and completed relief sessions
- **Personally identifiable information:** account email used for optional cloud backup
- **Authentication information:** session tokens used for optional cloud backup

Use the closest labels shown in the current dashboard. Do not select browsing history unless ActiveAid begins recording URLs, domains, page titles, or page content.

**Not collected:** typed content, page content, browsing history content, screenshots, camera, location, financial info.

**Consent and limited use:**
- Activity timing begins only after the user reviews the first-run disclosure and selects **Agree and get started**.
- Optional cloud backup begins only after a separate in-product opt-in.
- User data is used only to provide and improve ActiveAid's disclosed workplace-wellness features.
- User data is not sold, used for advertising or credit decisions, or made available for routine human review.

---

## Screenshots (store upload)

Generate the store-ready screenshots after updating the source captures in `public/screenshots/`:

```bash
npm run store:assets
```

Upload these opaque 1280×800 JPEG files in order:

1. `public/store/screenshots/01-today.jpg`
2. `public/store/screenshots/02-check-in.jpg`
3. `public/store/screenshots/03-insights.jpg`
4. `public/store/screenshots/04-settings.jpg`

The source captures must come from the packaged release candidate. Do not replace them with fabricated UI or captures from an earlier interface.

## Promotional tiles

Upload the generated opaque JPEG assets:

- **Small promo tile (440×280):** `public/store/promos/small-promo.jpg`
- **Marquee promo tile (1400×560):** `public/store/promos/marquee-promo.jpg`

The small promo tile is required. The marquee tile is optional but ready to upload.

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
