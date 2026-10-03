# ActiveAid MVP — Development README

````md
# ActiveAid

ActiveAid is a lightweight workplace wellness extension designed to support workplace wellness habits for desk workers.

The goal is simple:

Help users take better care of their bodies while they work.

This MVP focuses on:
- smart movement reminders,
- quick mobility sessions,
- discomfort tracking,
- and lightweight wellness analytics.

The product is intentionally designed to feel:
- subtle,
- supportive,
- non-intrusive,
- and easy to use daily.

---

# Vision

Modern desk work can involve:
- neck discomfort,
- lower back discomfort,
- wrist discomfort,
- eye fatigue,
- and long periods without movement.

Many people go long stretches without pausing or noticing how their bodies feel.

ActiveAid supports workplace wellness habits by encouraging gentle movement awareness during work sessions.

It is not a medical, diagnostic, or therapeutic tool.

ActiveAid is focused on:
- workplace wellness habits,
- movement awareness,
- and desk-friendly reset support.

---

# MVP Goal

The MVP exists to validate one core idea:

> Will people consistently engage with lightweight wellness prompts and movement sessions while working?

We are NOT optimizing for:
- enterprise scale,
- AI complexity,
- monetization,
- or advanced health tracking.

The focus is:
- usability,
- consistency,
- and user value.

---

# Target Users

Initial users include:
- software engineers,
- designers,
- remote workers,
- students,
- founders,
- office workers,
- freelancers.

Anyone spending long hours in front of screens.

---

# Core MVP Features

## 1. Smart Activity Detection

Track prolonged work sessions using browser activity.

Example:
- user works continuously for 90 minutes,
- extension triggers a wellness reminder.

This should remain lightweight and privacy-friendly.

### Detect:
- keyboard activity,
- mouse activity,
- browser focus,
- inactivity periods.

### Avoid:
- invasive tracking,
- screenshots,
- webcam access,
- keystroke logging.

---

## 2. Wellness Break Reminders

The extension gently reminds users to take short movement breaks.

### Example prompts:
- "Quick neck reset?"
- "Time to stretch your wrists."
- "You’ve been active for 90 minutes."

### User controls:
- snooze,
- dismiss,
- customize reminder intervals.

The tone should feel calm and supportive, not aggressive.

---

## 3. Quick Relief Sessions

Provide short guided movement flows.

### Initial sessions:
- Neck Relief
- Wrist Relief
- Lower Back Reset
- Shoulder Release
- Eye Relaxation

### Session format:
- GIFs,
- lightweight videos,
- illustrations,
- step-by-step movement cards.

Keep sessions:
- short,
- practical,
- easy to complete during work.

---

## 4. Daily Body Check-In

Users can log how they feel daily.

### Example:
"How does your body feel today?"

### Options:
- Great
- Slight discomfort
- Moderate discomfort
- Severe discomfort

### Body areas:
- neck,
- shoulders,
- lower back,
- wrists,
- eyes.

This creates:
- personalization,
- trend tracking,
- future recommendation data.

---

## 5. Wellness Dashboard

Users can see simple wellness insights.

### Initial dashboard metrics:
- breaks taken,
- active work duration,
- discomfort trends,
- movement streaks,
- most affected body areas.

The dashboard should remain clean and minimal.

---

# Recommended Tech Stack

## Frontend
- Next.js
- TypeScript
- Tailwind CSS

---

## Browser Extension
- Plasmo Framework

Why Plasmo?
- React-friendly,
- modern DX,
- TypeScript support,
- easy browser extension setup.

---

## Backend
- Supabase

Use Supabase for:
- database,
- auth,
- storage,
- analytics logs,
- optional realtime support later.

---

## Database
- PostgreSQL (via Supabase)

---

## Hosting
- Vercel

---

# Project Structure

Suggested structure:

```bash
activeaid/
│
├── apps/
│   ├── web/                 # Next.js dashboard + landing page
│   └── extension/           # Plasmo browser extension
│
├── packages/
│   ├── ui/                  # Shared UI components
│   ├── types/               # Shared TypeScript types
│   └── utils/               # Shared utilities
│
├── supabase/
│   ├── migrations/
│   └── schema.sql
│
└── README.md
````

---

# MVP Architecture

## Extension Responsibilities

The extension handles:

* activity tracking,
* reminders,
* quick mobility sessions,
* local state,
* notification logic.

---

## Web Dashboard Responsibilities

The web app handles:

* onboarding,
* analytics dashboard,
* account management,
* wellness history.

---

## Backend Responsibilities

Supabase handles:

* user auth,
* database storage,
* wellness logs,
* optional sync across devices.

---

# Suggested Development Phases

# Phase 1 — Extension Foundation

## Goals

* initialize Plasmo project,
* create extension popup UI,
* implement activity tracking,
* implement reminder system.

### Deliverables

* working extension,
* notification trigger,
* customizable timer.

---

# Phase 2 — Wellness Sessions

## Goals

* add guided movement flows,
* build relief session UI,
* add session completion tracking.

### Deliverables

* 5 starter recovery sessions,
* completion logging.

---

# Phase 3 — Check-Ins + Dashboard

## Goals

* create daily discomfort check-ins,
* build dashboard,
* store analytics.

### Deliverables

* basic wellness analytics,
* trends view,
* body discomfort tracking.

---

# Phase 4 — Polish

## Goals

* onboarding flow,
* improved animations,
* settings panel,
* UX refinement.

### Deliverables

* production-ready MVP,
* clean UI/UX,
* stable extension experience.

---

# Initial Database Tables

## users

```sql
id
email
created_at
```

---

## wellness_logs

```sql
id
user_id
session_type
duration
completed
created_at
```

---

## discomfort_logs

```sql
id
user_id
severity
body_area
notes
created_at
```

---

## reminder_settings

```sql
id
user_id
reminder_interval
notifications_enabled
created_at
```

---

# UI/UX Principles

The product should feel:

* calm,
* lightweight,
* supportive,
* minimal.

Avoid:

* corporate wellness vibes,
* aggressive productivity pressure,
* noisy notifications,
* overwhelming dashboards.

The experience should integrate naturally into a workday.

---

# Important Product Rules

## DO NOT:

* claim medical diagnosis,
* claim treatment or cures,
* use fear-based messaging,
* overcomplicate the MVP.

---

## Focus On:

* consistency,
* movement awareness,
* small daily improvements,
* simplicity.

---

# Future Roadmap (Post-MVP)

Potential future features:

* adaptive reminder timing,
* AI-assisted recommendations,
* posture integrations,
* team wellness dashboards,
* workplace analytics,
* mobile companion app,
* wearable integrations.

These are NOT MVP priorities.

---

# Success Metrics

The MVP should measure:

* daily active usage,
* completed wellness sessions,
* reminder engagement,
* user retention,
* repeated check-ins.

The main question:

> Do users genuinely find the product useful enough to continue using it?

---

# Final Notes

The purpose of ActiveAid is not to become another productivity app.

The goal is to create a lightweight wellness companion that helps people build healthier work habits through small but consistent interventions.

Keep the MVP:

* focused,
* useful,
* simple,
* and fast to ship.

```
```
