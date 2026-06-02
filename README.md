# Reading Clever IDM Events Exports — CS Training

An interactive, self-contained onboarding course that teaches new Customer Support
hires how to read a **Clever IDM events export** (the CSV action-history log for a
single user) and judge whether a problem came from Clever or from the data Clever
received.

Built with **Next.js (App Router) + React + Tailwind CSS**. Deployable to Vercel
with zero configuration.

## What's inside

Five short modules (~25 min total) plus a one-page cheat sheet and a scored quiz:

1. **What an events export is** — purpose, one-user scope, CS use cases
2. **The seven columns** — interactive column explorer; Data holds the detail
3. **Reading the Data field** — annotated JSON viewer with a "dim the nulls" toggle that drives home `null ≠ deleted`
4. **Tracing a problem** — the 5-step method, an event timeline, an OU-diff widget, and a `config_string` simulator
5. **Gotchas & glossary** — the common traps and flip-card vocabulary

Modern-pedagogy features: an advance-organizer first look at the full export,
worked-example narrative, retrieval-practice checks with immediate feedback,
self-explanation prompts, an interactive simulator for the core concept, glossary
flip-cards, a scored quiz with two scenario questions, and localStorage progress
tracking.

### The interactive centerpiece

Module 4's **`config_string` simulator** lets a learner type a building code and
toggle the *broken* vs *fixed* template to watch the same account resolve to
`*Restricted` vs `HighSchool` — exactly the bug in the worked example.

## Quick start

```bash
npm install
npm run dev
# open http://localhost:3000
```

Production build:

```bash
npm run build
npm start
```

## Deploy to Vercel

1. Push this folder to a Git repo (GitHub/GitLab/Bitbucket).
2. In Vercel, **New Project → import the repo**. Vercel auto-detects Next.js — no
   settings to change. Build command `next build`, output handled automatically.
3. Deploy. That's it.

Or from the CLI:

```bash
npm i -g vercel
vercel        # preview deploy
vercel --prod # production
```

## The example data is anonymized

The running example is a real export with **all identifying values removed**:

- The teacher is the fictional **Jordan Avery**.
- The district domain is the reserved-for-documentation **`maplewood.example.org`**.
- Every internal ID (Clever ID, destination IDs, SIS ID, district/source IDs,
  hashes) is a fake but structurally valid stand-in.
- Timestamps, building codes, and OU names are kept because the lesson depends on
  them and they aren't identifying once the person and district are scrubbed.

All example data lives in [`lib/events.ts`](lib/events.ts) and
[`lib/config-string.ts`](lib/config-string.ts).

## Project structure

```
app/
  layout.tsx              # shell: progress provider + header + footer
  page.tsx                # course overview / home
  modules/<slug>/page.tsx # the five modules
  cheat-sheet/page.tsx    # one-page reference (printable)
  quiz/page.tsx           # scored final quiz
components/                # interactive widgets (timeline, JSON viewer, simulator, …)
lib/
  events.ts               # anonymized worked-example events
  config-string.ts        # OU template rules + resolver (powers the simulator)
  modules.ts  quiz.ts  glossary.ts  format.ts  types.ts
```

## Customizing

- **Edit a module:** the content is plain JSX in `app/modules/<slug>/page.tsx`.
- **Change the quiz:** edit `lib/quiz.ts`.
- **Swap in a different export:** replace the events in `lib/events.ts` (keep them
  anonymized) and the OU rules in `lib/config-string.ts`.

> Note: this project pins `next@^15.5.19`, which patches CVE-2025-66478. Keep Next
> up to date when deploying.
