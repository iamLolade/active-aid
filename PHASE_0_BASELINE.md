# ActiveAid Phase 0 Baseline

Recorded: 2026-09-06  
Scope: Chrome-first public release preparation  
Repository state before this document: clean `main` branch at `f811559`

This document records the current product before behavior, architecture, or visual changes. It is the reference for future regression checks. Findings are separated into confirmed strengths, confirmed problems, weaker areas, and items that still require real-browser verification.

## 1. Product surfaces

### Browser extension

| Surface | Purpose | Primary implementation |
| --- | --- | --- |
| First-run onboarding | Explain value and privacy, choose whether reminders start enabled | `extension/popup/popup.html`, `extension/popup/popup.js` |
| Today | Show activity status, check-in prompt, and featured relief sessions | `extension/popup/popup.html`, `extension/popup/popup.js` |
| Daily check-in | Record overall feeling and optional body areas | `extension/popup/popup.js`, `extension/shared/checkins.js` |
| Quick Relief | List five short desk-friendly sessions | `extension/shared/sessions.js` |
| Session player | Guide a user through timed steps and record completion | `extension/popup/popup.js` |
| Insights | Show local activity, session, check-in, streak, and body-area summaries | `extension/shared/wellness.js` |
| Settings | Manage reminders, cloud backup, export, and data clearing | `extension/popup/popup.html`, `extension/shared/storage.js`, `extension/shared/sync.js` |
| System notification | Notify after the configured active-work interval | `extension/background/sw.js` |
| Activity timing | Send throttled activity-presence signals without recording content | `extension/content/activity.js` |
| Optional sync | Authenticate and synchronize selected wellness data with Supabase | `extension/shared/sync.js` |

### Website

| Route | Audience | Current purpose | Baseline status |
| --- | --- | --- | --- |
| `/` | End users | Marketing and product overview | Functional and responsive, but uses inaccurate assets and some developer-oriented messaging |
| `/install` | Mixed | Store publishing, packaging, and beta instructions | Functional, but unsuitable as the public installation journey |
| `/privacy` | End users and store review | Data and permission disclosures | Readable, but contradicts current sign-in sync behavior |
| `/api/health/supabase` | Maintainers | Server-side Supabase connectivity check | Functional development/operations endpoint; not an end-user destination |

## 2. Current user journeys

### First run

1. User installs ActiveAid and opens the popup.
2. Onboarding explains reminders, relief sessions, check-ins, and local activity timing.
3. User chooses whether reminders are enabled and selects **Get started**.
4. ActiveAid opens the Today view.

### Reminder and relief

1. Content scripts send activity-presence signals while the user interacts with HTTP or HTTPS pages.
2. The service worker estimates a continuous active period.
3. A notification appears when the configured interval is reached.
4. The notification currently offers **Snooze 10m** and **Reset timer**.
5. To start relief, the user must separately open the extension and choose a session.
6. Completing the final session step records a local session log.

### Daily check-in

1. User opens Check-in from Today or bottom navigation.
2. User chooses one overall feeling.
3. User may select one or more body areas.
4. Saving replaces that day's prior check-in and refreshes Today and Insights.

### Insights

1. User opens Insights from bottom navigation.
2. ActiveAid derives summary values from local check-ins, session logs, and today's activity total.
3. Empty body-area history receives an explanatory next action.

### Settings and local data

1. User can enable reminders and set a custom interval or preset.
2. User can snooze or reset the current timer.
3. User can export local data as JSON.
4. User can clear extension data after a browser-native confirmation.
5. Clearing returns the extension to onboarding.

### Optional cloud backup

1. When Supabase configuration is present, the user sees email and password fields.
2. Selecting **Sign in to sync** authenticates the user.
3. Current behavior immediately runs synchronization during sign-in, before the separate **Enable cloud backup** control can be selected.
4. This behavior contradicts the extension copy and privacy policy and is a public-release blocker.

## 3. Assessment

### Good enough: preserve

- The calm, supportive, non-medical positioning is clear and consistent.
- The sage, cream, slate, and restrained terracotta palette fits the product.
- The local-first core requires no account and gives users export and clear controls.
- Today, Check-in, Insights, Settings, and focused session-player views form a coherent MVP.
- Relief content is short, specific, cautious, and suitable for desk workers.
- Supabase tables use row-level security policies scoped to the authenticated user.
- The Next.js site and vanilla MV3 extension are appropriately lightweight for the current scope.
- Website navigation, heading structure, reduced-motion handling, and 390 px layout are reasonable foundations.

### Weak: improve deliberately

- `popup.js` and `popup.css` have grown large enough to slow safe iteration.
- The Today view and navigation need a fresh hierarchy review after reminder behavior is fixed.
- The public landing page prioritizes technical installation details before a clear end-user path.
- Settings uses a browser-native confirmation for destructive clearing instead of an accessible product dialog.
- Empty, offline, pending, and recoverable error states are incomplete across sync and reminder flows.
- The landing page release badge is hardcoded and can drift from the extension manifest.
- Public claims of Edge and Firefox support are stronger than the recorded manual verification.

### Broken or misleading: fix before public release

- Signing in immediately synchronizes local wellness data despite copy saying cloud backup is off until enabled.
- The privacy page and Chrome Web Store material describe a local-only MVP while sync is implemented.
- Reminder ticks do not reject stale `lastActivityMs`, so a notification can appear after the user stops working.
- The reminder notification does not provide a direct route into a relief intervention.
- The landing page labels an older reminder/settings screenshot as the Insights view.
- The website renders a large composition image as a small logo, making the mark nearly illegible.
- `/install` exposes maintainer instructions, environment-variable names, and repository filenames to end users.

### Unknown: verify in a fresh Chrome profile

- Notification permission denial and recovery behavior.
- Notification timing through browser restart, device sleep, midnight rollover, and several active tabs.
- Whether a notification can reliably open the popup or a specific relief session in supported Chrome versions.
- Packaged extension behavior under Chrome MV3 content-security policy, including the remote Google Fonts request.
- Supabase sign-in, token refresh, merge direction, offline recovery, and account deletion.
- Keyboard and screen-reader behavior inside the installed extension popup.
- Store-review acceptance of the current all-sites host permission and its justification.
- Edge and Firefox parity. These are not required for the Chrome-first release.

## 4. Version ownership

| Version | Current value | Meaning | Source of truth |
| --- | --- | --- | --- |
| Extension release | `0.2.0` | Chrome package and store update version | `extension/manifest.json` |
| Private npm package | `0.1.0` | Internal Next.js repository package version | `package.json` |
| Export schema | `1` | Shape of exported local data | `extension/shared/storage.js` |
| Landing badge | `v0.2` | Marketing display only | Currently hardcoded; should be removed or maintained intentionally |

The private npm package version does not need to match the extension release. Chrome release procedures must use the manifest version.

## 5. Asset inventory

No asset should be deleted until its replacement is available and all references are updated.

### Keep

| Asset | Reason |
| --- | --- |
| `extension/assets/icon.svg` | Editable source for the extension mark |
| `extension/assets/icon-16.png` | Manifest icon |
| `extension/assets/icon-32.png` | Manifest icon |
| `extension/assets/icon-48.png` | Manifest and popup icon |
| `extension/assets/icon-128.png` | Manifest and notification icon |
| `app/favicon.ico` | Active website favicon; visually verify during brand cleanup |

### Replace with accurate production assets

| Asset | Current issue |
| --- | --- |
| `public/active-aid_logo.png` | 1536 x 1024 composition with a bronze background, unsuitable as a 40 x 40 navigation logo |
| `public/hero-popup.png` | Polished composition rather than a verified release capture |
| `public/check-in-tab.png` | Polished composition rather than a verified release capture |
| `public/relief-ui.png` | Polished composition rather than a verified release capture |
| `public/screenshots/extension-today.png` | Older interface and incorrectly labeled as Insights on the landing page |

### Remove after references or replacements are resolved

| Asset | Classification |
| --- | --- |
| `public/active-aid-pop-up.png` | Unreferenced alternate popup composition |
| `public/screenshots/extension-paused.png` | Unreferenced older interface capture |
| `public/screenshots/red-section.png` | Unreferenced development/debug capture |
| `public/file.svg` | Unreferenced default Next.js asset |
| `public/globe.svg` | Unreferenced default Next.js asset |
| `public/next.svg` | Unreferenced default Next.js asset |
| `public/vercel.svg` | Unreferenced default Next.js asset |
| `public/window.svg` | Unreferenced default Next.js asset |

### Generated or local-only

| Path | Treatment |
| --- | --- |
| `.next/` | Generated and ignored |
| `dist/*.zip` | Generated store packages and ignored |
| `.env` | Local secrets/configuration and ignored |
| `.DS_Store` | Local operating-system metadata; do not commit |
| `extension/shared/sync-config.js` | Generated configuration currently tracked; revisit its release-safe generation in the privacy phase |

## 6. Regression checklist

### Installation and onboarding

- [ ] Fresh install displays onboarding once.
- [ ] Navigation stays hidden during onboarding.
- [ ] Reminder choice is saved correctly.
- [ ] Clearing all data returns to onboarding.

### Activity and reminders

- [ ] Activity presence is detected without recording keys, text, URLs, or page content.
- [ ] Continuous active time increases predictably.
- [ ] Five minutes of inactivity ends the active session.
- [ ] No reminder appears while inactive.
- [ ] Reminder interval presets and custom values persist.
- [ ] Reminders-off, snoozed, waiting, due, and notification-error states render correctly.
- [ ] Snooze and reset have distinct, documented behavior.
- [ ] Notification actions lead to the expected next state.

### Relief sessions

- [ ] All five sessions open from the list.
- [ ] Back, Previous, Next, and Complete behave correctly.
- [ ] Step and total countdowns are accurate.
- [ ] Completion records one session with a sensible duration.
- [ ] Exiting early does not record a completion.
- [ ] Completion returns to the originating view and updates Insights.

### Check-ins and insights

- [ ] Overall feeling is required and keyboard-selectable.
- [ ] Body areas are optional and multi-selectable.
- [ ] One check-in per local date is created or updated.
- [ ] Today reflects the saved check-in.
- [ ] Insights totals, streak, seven-day trend, and body areas update accurately.
- [ ] Empty states provide a useful next action.

### Privacy and data controls

- [ ] No wellness data is transmitted before explicit opt-in.
- [ ] Enabling cloud backup requires an authenticated user and informed consent.
- [ ] Disabling cloud backup stops automatic synchronization.
- [ ] Exported JSON matches local state and has a stable schema version.
- [ ] Clear-data confirmation is explicit, accessible, and cancelable.
- [ ] Local clearing and cloud deletion are described as separate actions.

### Website

- [ ] `/`, `/install`, and `/privacy` render at 360, 390, 768, 1024, 1280, and 1440 px.
- [ ] The logo is sharp and legible.
- [ ] Product screenshots match the packaged extension.
- [ ] Navigation and anchor active states are accurate.
- [ ] Installation copy is end-user focused.
- [ ] Privacy, support, and store links are correct.
- [ ] No developer-only health or packaging controls are presented as end-user actions.

### Release validation

- [ ] `npm run lint` passes.
- [ ] Automated tests pass.
- [ ] `npm run build` passes.
- [ ] `npm run package:extension` passes.
- [ ] The packaged zip is tested in a fresh Chrome profile.
- [ ] The deployed privacy policy matches packaged behavior.
- [ ] Store listing copy and permission disclosures match packaged behavior.

## 7. Baseline validation record

Confirmed on 2026-09-06:

- Repository was clean before this baseline document was added.
- `npm run lint` passed.
- `npm run build` passed with routes `/`, `/install`, `/privacy`, and `/api/health/supabase`.
- The homepage and installation page rendered without horizontal overflow at 390 px.
- Existing image assets were inspected and their code references checked.
- There is currently no automated test script.
- Installed-extension notification, sync, keyboard, and cross-browser behavior remain unverified and must not be described as passed.

## 8. Phase 0 exit criteria

- [x] Product surfaces are mapped.
- [x] Existing journeys are documented.
- [x] Findings are classified as good enough, weak, broken/misleading, or unknown.
- [x] Asset status is recorded before deletion.
- [x] Version ownership is explicit.
- [x] A reusable regression checklist exists.
- [ ] Fresh-profile extension screenshots exist for every production view.
- [ ] Installed-extension runtime behavior has been manually verified in Chrome.

The two open items require loading the packaged extension into a fresh Chrome profile. They are intentionally recorded as unverified rather than inferred from mockups or source code. They should be completed before Phase 1 is declared release-ready, but they do not block beginning the Phase 1 privacy correction.
