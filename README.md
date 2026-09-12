# ActiveAid

A lightweight workplace wellness companion for desk workers: gentle movement reminders, quick relief sessions, daily check-ins, and simple insights.

## What's in this repo
- **`extension/`** — Chrome extension (MVP core product)
- **`app/`** — Next.js web app (landing + Supabase health check)
- **`supabase/`** — Database migration and setup docs

## Quick start (local)

### 1. Install dependencies
```bash
npm install
```

### 2. Environment
Copy `.env.example` to `.env` and add your Supabase credentials.

### 3. Apply database migration
Apply the migrations through `supabase/migrations/0003_cloud_data_delete_policies.sql` in order (see `supabase/README.md`).

### 4. Run web app
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000), verify the [support page](http://localhost:3000/support), and check [backend health](http://localhost:3000/api/health/supabase).

### 5. Load extension
See `extension/README.md` for Chrome load-unpacked steps.

## Scripts
| Command | Description |
|---------|-------------|
| `npm run dev` | Start Next.js dev server |
| `npm run build` | Production build |
| `npm run start` | Run production server |
| `npm run lint` | ESLint |
| `npm test` | Run deterministic extension logic tests |
| `npm run validate` | Run tests, lint, and the production build |
| `npm run package:extension` | Create validated, browser-targeted zips in `dist/` |
| `npm run sync:config` | Write extension Supabase config from `.env` |

## Release
See [RELEASE.md](./RELEASE.md) for the full QA checklist and Vercel deploy steps.

Chrome Web Store: [CHROME_WEB_STORE.md](./CHROME_WEB_STORE.md) and listing draft [store/LISTING.md](./store/LISTING.md).

Firefox and Edge: [FIREFOX_EDGE.md](./FIREFOX_EDGE.md).

## Design
- [DESIGN_GUIDELINES.md](./DESIGN_GUIDELINES.md)
- [brand_identity.md](./brand_identity.md)
- [plan.md](./plan.md) (product spec)
- [PHASE_0_BASELINE.md](./PHASE_0_BASELINE.md) (release-improvement baseline and regression checklist)
