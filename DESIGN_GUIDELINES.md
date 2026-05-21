# ActiveAid — Design Guidelines

These guidelines ensure ActiveAid feels **calm, lightweight, supportive, and minimal** across the extension and web dashboard.

## Brand alignment (source of truth)
When in doubt, follow `brand_identity.md`.

## Product tone and positioning
- **Supportive, not pushy**: suggestions over commands; gentle language.
- **Preventative wellness, not medical**: never imply diagnosis, treatment, or cures.
- **Non-intrusive**: respect focus; reminders should be easy to snooze/dismiss.
- **Privacy-first**: avoid anything that feels like surveillance.

### Copy rules
- **Short, human, calm**: one sentence when possible.
- **No fear or guilt**: avoid “damage”, “risk”, “you should”.
- **Prefer questions + options**: “Quick neck reset?” / “Not now”.
- **Be specific**: “Take a 60s wrist break” beats “Take a break”.

## UI principles
- **Minimal by default**: show the next best action; reveal detail on demand.
- **Consistency**: same components, spacing, and tone across surfaces.
- **Clarity over decoration**: use visual polish to reduce effort, not add noise.
- **Fast interactions**: no heavy flows; keep core actions within 1–2 taps.

## Layout and spacing
- **Use a simple scale**: 4 / 8 / 12 / 16 / 24 / 32 px spacing.
- **Avoid dense screens**: favor whitespace and clear grouping.
- **Readable line length**: aim for ~60–80 characters where applicable.

## Typography
- **One primary font family** (project default) with restrained weights.
- **Hierarchy**:
  - Page title: clear and prominent
  - Section title: smaller but distinct
  - Body: comfortable reading size
  - Secondary text: used sparingly
- **Avoid all-caps** for primary UI text.

## Color and visual style
- **Neutral base** with one calm accent color for primary actions.
- **Prefer brand palette**:
  - **Soft Sage Green**: `#7BAE7F` (primary accent)
  - **Deep Slate**: `#1F2937` (primary text)
  - **Warm Cream**: `#F7F4ED` (background)
  - **Soft Gray**: `#E5E7EB` (borders/dividers)
  - **Muted Terracotta**: `#C97B63` (secondary accent; use sparingly)
- **Semantic colors**:
  - Success: completion/affirmation
  - Warning: gentle attention (not alarm)
  - Danger: destructive actions only
- **Avoid aggressive contrast**: keep the overall feel soft; rely on hierarchy.

## Components and interaction patterns
### Buttons
- **Primary**: the single best next step (one per view when possible).
- **Secondary**: alternative actions (snooze, learn more).
- **Tertiary/text**: dismiss/cancel-style actions.
- **Destructive**: clearly labeled, never the default.

### Notifications and reminders
- **Respect focus**: reminders should be lightweight and skippable.
- **Always provide control**: snooze + dismiss + settings path.
- **No nag loops**: avoid repeated prompts in short windows after dismiss.

### Forms and settings
- **Default to sensible settings**; users should rarely need to configure.
- **Explain impact** in plain language (e.g., interval meaning).
- **Prefer toggles and presets** over freeform inputs where possible (especially in the extension popup).

### States
- **Loading**: subtle, brief, non-blocking when possible.
- **Empty**: show a single clear next action (e.g., “Log your first check-in”).
- **Error**: calm message + one recovery action; avoid technical jargon.

## Accessibility
- **Keyboard support** where relevant (especially on web).
- **Focus visibility**: clear focus states for interactive elements.
- **Color is not the only signal**: pair color with text/iconography.
- **Readable tap targets**: minimum ~44×44 px for primary interactions.

## Data and analytics UI
- **Keep metrics simple**: favor trends and totals users can act on.
- **Avoid guilt framing**: no “failed” language; use “missed” or “not yet”.
- **Explain what data means**: short labels; avoid ambiguous charts.

## Content rules for sessions
- **Short and practical**: designed to be completed during work.
- **Step-by-step cards**: one movement per step; clear duration cues.
- **Inclusive language**: offer “if comfortable” / “stop if it hurts”.
- **No medical claims**: keep it in general wellness guidance.

## Explicit “do not” list (must adhere)
- Do not log keystrokes or capture typed content.
- Do not take screenshots or use webcam access.
- Do not use fear-based or medical messaging.
- Do not overwhelm users with dashboards, alerts, or dense settings.

