# ActiveAid MVP — Release Checklist

Use this before sharing the extension or deploying the web app.

## 0. Automated validation
- [ ] `npm run validate` succeeds (tests, lint, and production build)
- [ ] `npm run package:extension` succeeds

## 1. Environment
- [ ] `.env` exists locally (never commit it)
- [ ] `NEXT_PUBLIC_SUPABASE_URL` set
- [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY` set
- [ ] `SUPABASE_SERVICE_ROLE_KEY` set (server only)
- [ ] Supabase migrations applied through `supabase/migrations/0003_cloud_data_delete_policies.sql`
- [ ] Supabase email sign-ups, production Site URL, branded confirmation template, and production SMTP configured

## 2. Backend health
- [ ] `npm run dev` running
- [ ] Open `/api/health/supabase`
- [ ] Response shows `ok: true`, `auth.status: 200`, `rest.status: 200`, `schema.status: 200`
- [ ] `schema.status: 200` confirms the required `wellness_logs.client_event_id` column exists

## 3. Web app
- [ ] `npm run build` succeeds
- [ ] `npm run start` serves the landing page
- [ ] Logo and copy render correctly
- [ ] `/support` renders and its email link opens the configured support address

## 4. Extension (Chrome)
- [ ] Load unpacked from `extension/` (or install packaged zip)
- [ ] Reminders: enable, set interval, receive notification after active time
- [ ] Reminder notification opens the expanded Quick Relief list
- [ ] Five minutes without activity prevents a stale reminder
- [ ] Quick relief: start session, countdown runs, complete session
- [ ] Check-in: save severity + optional body areas
- [ ] Insights: stats update after sessions and check-ins
- [ ] Snooze and reset timer work
- [ ] No em dashes in UI copy; Save check-in CTA has comfortable padding

### 4b. Individual user journey (Phase 4.5)

Run this end-to-end on a fresh install (or after **Erase data on this device** in Settings).

| Step | Action | Expected result |
|------|--------|-----------------|
| 1 | Load unpacked from `extension/` | Extension appears in toolbar |
| 2 | Open popup (first run) | Onboarding shows once; nav hidden |
| 3 | Leave reminders on, tap **Agree and get started** | Today tab appears and activity timing can begin |
| 4 | Today tab (no data yet) | Check-in hint + Quick Relief empty nudge visible |
| 5 | Open **Settings** from bottom navigation | Settings view opens |
| 6 | Start a Quick Relief session and let each timer expire | Steps advance automatically; the final step saves and shows a completion state; **Done** returns to Today |
| 7 | Check-in tab: pick severity, optional areas, **Save check-in** | Saved note appears; Today row updates |
| 8 | Insights tab | Stats, 7-day trend, and areas reflect steps 6–7 |
| 9 | Settings → **Download a data copy** | JSON downloads; check-ins/sessions match Insights; UI states that the file cannot yet be restored |
| 10 | Notification → **Choose a quick reset** | A focused, compact ActiveAid window opens at the expanded Quick Relief list with the first session focused |
| 11 | Notification → **Snooze 10m** / Settings → **Restart activity timer** | Hero status updates (Snoozed / timer restarted) |
| 12 | Stop activity for five minutes before a reminder is due | No stale reminder appears; new activity starts a fresh timer |
| 13 | Settings → **Erase data on this device** → confirm | Onboarding shows again; Insights empty after re-onboarding |
| 14 | Block notifications (Chrome site settings) with reminders on | Banner on Today explains how to re-enable |

### 4c. Keyboard and interaction states

- [ ] Bottom navigation exposes the active destination and every item works by keyboard
- [ ] Arrow keys move and select options in the Overall feeling radio group
- [ ] Session steps move focus to the new instruction; Escape exits and returns focus
- [ ] Local and cloud deletion dialogs focus Cancel, close with Escape, and return focus to their trigger
- [ ] Create-account and sign-in modes are distinct; both password reveal controls work; mismatched confirmation cannot submit
- [ ] Account forms submit with Enter and pending actions cannot be submitted twice
- [ ] Failed check-in and session saves remain recoverable without reopening the popup

### 4d. Optional cloud backup consent

Run with Supabase configured, email confirmation enabled, and production SMTP available.

| Step | Action | Expected result |
|------|--------|-----------------|
| 1 | Create an account with mismatched passwords | Form stays open and identifies the mismatch |
| 2 | Create an account with valid details | Confirmation guidance appears; user is not shown as signed in prematurely |
| 3 | Confirm the email, then sign in from Settings | Account appears; backup remains off; no wellness-data request is sent |
| 4 | Turn on **Back up my wellness data** | First sync begins and completes over encrypted transport |
| 5 | Change a check-in or complete a session | Enabled backup syncs the change |
| 6 | Turn backup off | Future local changes are not uploaded |
| 7 | Force a first-sync failure | Toggle returns to off and stored backup state remains off |
| 8 | Select **Delete cloud backup**, then cancel | No local or cloud data changes |
| 9 | Confirm **Delete cloud backup** | Backup turns off; cloud rows are deleted; local wellness data remains |
| 10 | Sign out | Local sign-in session is cleared; local and existing cloud wellness data remain |

**Code-verified (2026-10-07):** 45 automated tests, lint, production build, and browser-targeted extension packaging pass. Installed-extension, cross-browser, email-delivery, and live-sync sign-off remain manual.

**Manual sign-off:** _________________ Date: _________

## 5. Privacy
- [ ] No typed content, screenshots, or page content logged
- [ ] Activity timing stays local and is never uploaded
- [ ] Signing in alone does not upload wellness data
- [ ] Optional backup uploads only check-ins, completed sessions, and reminder settings after explicit opt-in
- [ ] Users can separately clear local data and delete cloud backup data
- [ ] `/privacy` page live on deployed site (Chrome Web Store policy URL)

## 6. Package extension (Chrome Web Store)
```bash
npm run package:extension
```
Output: `dist/activeaid-extension.zip` (manifest validated before zip)

### 6b. Chrome Web Store listing (Phase 6.2)

- [ ] Deploy web app with `/privacy` reachable
- [ ] Set `NEXT_PUBLIC_SUPPORT_EMAIL` and verify `/support`
- [ ] Run `npm run package:extension`
- [ ] Upload zip in [Developer Dashboard](https://chrome.google.com/webstore/devconsole)
- [ ] Paste listing fields from `store/LISTING.md`
- [ ] Upload screenshots (see `store/LISTING.md`)
- [ ] Complete privacy practices certification (answers in `store/LISTING.md`)
- [ ] Submit for review (unlisted recommended for beta)
- [ ] Set `NEXT_PUBLIC_CHROME_STORE_URL` after approval and redeploy

See `CHROME_WEB_STORE.md` for the full walkthrough.

Notes:
- This zip is **primarily for Chrome Web Store upload**.
- For private testers, the simplest option is still **Load unpacked** from the `extension/` folder.

## 7. Deploy web (Vercel)
1. Push repo to GitHub
2. Import project in Vercel
3. Set environment variables (same as `.env`, without committing):
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `NEXT_PUBLIC_APP_URL` (your production URL)
   - `NEXT_PUBLIC_SUPPORT_EMAIL` (public support inbox)
4. Deploy
5. Verify `https://<your-domain>/api/health/supabase`

## 8. Distribute the extension
### Recommended: Chrome Web Store
- Best user experience (no Developer mode)
- Automatic updates
- You can publish **publicly** or **unlisted** (share link only)

See `CHROME_WEB_STORE.md` for the full walkthrough.

### 8b. Firefox and Edge (Phase 7.2)

- [ ] `npm run package:extension` (produces validated, browser-targeted zips)
- [ ] Load `extension/` unpacked in Edge and load `dist/activeaid-extension-firefox.zip` temporarily in Firefox
- [ ] Verify the Edge and Firefox packages use their expected background manifest entries
- [ ] Run cross-browser QA checklist in `FIREFOX_EDGE.md`
- [ ] Submit `dist/activeaid-extension-edge.zip` to Microsoft Edge Add-ons (unlisted for beta)
- [ ] Submit `dist/activeaid-extension-firefox.zip` to Firefox Add-ons / AMO (unlisted for beta)
- [ ] Set store URLs in production env when approved (optional)

See `FIREFOX_EDGE.md` for testing and publish steps.

### Private beta: load unpacked
- Fastest for early testers
- Requires Developer mode
- Manual updates when you share a new build

## Success metrics (MVP, non-invasive)
Track manually during beta (no third-party analytics required yet):
- Daily extension opens
- Reminders enabled rate
- Sessions completed per day
- Check-ins per day
- 7-day return usage (opened extension again)

Local data already supports: session count, check-in streak, active minutes estimate (extension Insights tab).
