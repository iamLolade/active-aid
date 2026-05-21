# ActiveAid MVP — Release Checklist

Use this before sharing the extension or deploying the web app.

## 1. Environment
- [ ] `.env` exists locally (never commit it)
- [ ] `NEXT_PUBLIC_SUPABASE_URL` set
- [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY` set
- [ ] `SUPABASE_SERVICE_ROLE_KEY` set (server only)
- [ ] Supabase migration applied: `supabase/migrations/0001_init.sql`

## 2. Backend health
- [ ] `npm run dev` running
- [ ] Open `/api/health/supabase`
- [ ] Response shows `ok: true`, `auth.status: 200`, `rest.status: 200`, `schema.status: 200`

## 3. Web app
- [ ] `npm run build` succeeds
- [ ] `npm run start` serves the landing page
- [ ] Logo and copy render correctly

## 4. Extension (Chrome)
- [ ] Load unpacked from `extension/` (or install packaged zip)
- [ ] Reminders: enable, set interval, receive notification after active time
- [ ] Quick relief: start session, countdown runs, complete session
- [ ] Check-in: save severity + optional body areas
- [ ] Insights: stats update after sessions and check-ins
- [ ] Snooze and reset timer work
- [ ] No em dashes in UI copy; Save check-in CTA has comfortable padding

## 5. Privacy
- [ ] No typed content, screenshots, or page content logged
- [ ] Only activity timing + user-entered check-in data stored locally

## 6. Package extension (optional)
```bash
npm run package:extension
```
Output: `dist/activeaid-extension.zip`

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
4. Deploy
5. Verify `https://<your-domain>/api/health/supabase`

## 8. Distribute the extension
### Recommended: Chrome Web Store
- Best user experience (no Developer mode)
- Automatic updates
- You can publish **publicly** or **unlisted** (share link only)

See `CHROME_WEB_STORE.md` for the full step-by-step publishing checklist.

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
