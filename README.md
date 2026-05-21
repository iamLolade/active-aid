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
Run `supabase/migrations/0001_init.sql` in the Supabase SQL Editor (see `supabase/README.md`).

### 4. Run web app
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) and verify [http://localhost:3000/api/health/supabase](http://localhost:3000/api/health/supabase).

### 5. Load extension
See `extension/README.md` for Chrome load-unpacked steps.

## Scripts
| Command | Description |
|---------|-------------|
| `npm run dev` | Start Next.js dev server |
| `npm run build` | Production build |
| `npm run start` | Run production server |
| `npm run lint` | ESLint |
| `npm run package:extension` | Zip extension to `dist/activeaid-extension.zip` |

## Release
See [RELEASE.md](./RELEASE.md) for the full QA checklist and Vercel deploy steps.

## Design
- [DESIGN_GUIDELINES.md](./DESIGN_GUIDELINES.md)
- [brand_identity.md](./brand_identity.md)
- [plan.md](./plan.md) (product spec)
