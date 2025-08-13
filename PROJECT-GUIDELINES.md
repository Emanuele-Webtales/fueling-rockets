# Fueling Rockets — Project Guidelines (MVP)

Last updated: 2025-08-13

## 1) Vision, Mission, Principles

### Vision
Give every student access to top-tier education, regardless of background or location. Support great teachers, catch students who need extra help, and become the global standard for effective, joyful learning.

### Mission (12–18 months)
Deliver engaging, research-backed, mobile-first math lessons with clear teacher visibility and trustworthy analytics, starting with Algebra and Functions.

### Core Principles
- Evidence-based learning: Design aligned with Make it Stick and peer-reviewed research.
- Student-first: Reduce friction, celebrate effort, promote deep understanding.
- Teacher-supportive: Easy assignment, quick progress insight, low overhead.
- Mobile-first accessibility: Works well on low-end devices and small screens.
- Privacy-by-design: GDPR-aware, minimal PII, pseudonymous analytics.
- Simple first: Ship small, reliable slices; expand with real data.
- Future-ready: MVP architecture that can evolve toward full platform ambitions.

## 2) Target Audience and Pilot Scope

- Geography: Italy (GDPR sensitive). Primary language: Italian (initially English UI acceptable if needed; localize key strings when possible).
- Devices: Heavily smartphone usage expected; PCs preferred in class. No reliance on iPads/Macs.
- Grade bands for MVP:
  - Track A: Algebra Basics (middle school, grades ~8–9)
  - Track B: Functions Essentials (high school, grades ~10–12)
- Pilot content (MVP): 8 lessons total
  - Algebra Basics: 5 short lessons (10–12 min each)
  - Functions Essentials: 3 short lessons (12–15 min each)
- Evaluation approach: Compare outcomes with a control group (non-users). For MVP, emphasize reliable in-app metrics; offline/teacher-side assessments optional.

## 3) MVP Scope (What’s In vs Out)

### In (MVP)
- Core Learning Engine (Lesson Player)
  - Activity types: Multiple Choice with rationales, Short Answer with self-check rubric, Interactive Explore (1 slider/visual pattern), Notebook Gate + reflection
  - Progress saving, attempts, quick feedback
  - Focus Mode (no-distractions): full-screen, hides leaderboard/XP, optional reduced motion
- Auth & Roles
  - Supabase auth (email/password or magic link), roles (Student/Teacher/Admin)
  - Classrooms with join codes
- Basic Gamification
  - Points/XP, streaks, 5–7 achievements
  - Class-only leaderboard (toggleable)
- Teacher Essentials
  - Create class, share join code
  - Assign lessons, see per-student completion/accuracy
- Analytics & Reliability
  - Event taxonomy and batching (PostHog or equivalent)
  - Error tracking/perf (Sentry + Web Vitals)
  - Low-bandwidth tolerant UX

### Out (Not in MVP)
- Spaced Repetition (SRS) and flashcard decks
- Global/national leaderboards, inter-school competitions
- SSO integrations (Google/Clever/ClassLink)
- AI Tutor/Scheduler, AI authoring studio
- Offline mode and native apps
- Complex authoring/branching studio beyond JSON schema

## 4) Product Experience Guidelines

- Mobile-first single-column layout; large tap targets; persistent progress bar.
- Focus Mode: hides points/leaderboards, dims chrome, encourages deep work; re-entry prompt if navigating away mid-activity.
- Accessibility: WCAG AA; visible focus states; keyboard and screen reader support; prefers-reduced-motion respected.
- Motion: subtle, purposeful; avoid motion sickness; 60fps targets; degrade gracefully.
- Hints: gated behind a genuine attempt; encourage generation before instruction.
- Notebook Gate: explicit prompt to write/draw in a physical notebook; reflection input required to continue.

## 5) Courses and Lesson Plan (MVP)

### Track A: Algebra Basics (5 lessons)
1. Integers & Operations (order of operations, negatives)
2. Linear Equations (one-variable solving)
3. Ratios & Proportions (unit rates, scaling)
4. Exponents & Roots (laws, estimation)
5. Intro to Functions (inputs/outputs, tables, simple graphs)

### Track B: Functions Essentials (3 lessons)
1. Domain & Range, Graph Interpretation
2. Transformations (shifts, stretches) of basic functions
3. Conceptual Derivative (rate of change, slope) leading toward integrals (preview)

Each lesson: 3–5 activities; at least one Notebook Gate; ends with 2–3 item mastery check.

## 6) Learning Design (Make it Stick)

- Retrieval practice: frequent low-stakes checks across the lesson.
- Generation: student attempts precede explanations; hints unlocked post-attempt.
- Elaboration: short-answer prompts connect new ideas to prior knowledge.
- Interleaving: lightweight mixing within and across lessons when appropriate.
- Spacing: within-lesson spacing; full SRS deferred post-MVP.
- Metacognition: self-check rubric and confidence rating after mastery checks.

## 7) Content Pipeline

- Source of truth: `content/<lesson-slug>/lesson.json` plus `assets/` in storage.
- Authoring: Draft in doc template → convert to JSON using a script → validate via JSON Schema in CI.
- Review: Internal Author Preview route renders JSON; checklist based on research principles.
- Publish: `status: published`, version tag; assets in Supabase Storage.

JSON schema (v1, simplified) example:

```json
{
  "id": "algebra-integers-ops-v1",
  "title": "Integers & Operations",
  "version": 1,
  "status": "draft",
  "estimatedMinutes": 12,
  "sections": [
    {
      "type": "mcq",
      "prompt": "Which expression equals -3 + 5?",
      "choices": ["-8", "2", "-2", "8"],
      "correctIndex": 1,
      "rationales": ["…", "Adding 5 to -3 gives 2", "…", "…"]
    },
    {
      "type": "notebook_gate",
      "prompt": "In your notebook, compute 12 - 19. Show steps.",
      "reflection": { "placeholder": "Write what you noticed…" }
    },
    {
      "type": "short_answer",
      "prompt": "Solve: x + 7 = 12",
      "rubric": ["Shows inverse operation", "States x = 5"],
      "answer": "5"
    },
    {
      "type": "interactive_explore",
      "pattern": "number_line_slider",
      "config": { "min": -10, "max": 10, "target": 2 }
    }
  ]
}
```

## 8) Technical Architecture (High Level)

- Frontend: Next.js 15 App Router, TypeScript, Tailwind CSS, Framer Motion + GSAP
- Backend: Supabase (Auth, Postgres, RLS, Storage, Edge Functions as needed)
- Package manager: pnpm
- Deploy: Vercel (Preview + Production)
- Analytics: PostHog (or telemetry endpoint to Supabase) with batching; PII-minimized
- Error/Perf: Sentry + Web Vitals
- Images/media: Supabase Storage with signed URLs
- Internationalization: Simple string map; Italian/English keys planned
- Feature flags: lightweight config table; kill-switch for leaderboard

Data model (initial):
- `users` (id, role, locale, created_at)
- `classes` (id, name, teacher_id, join_code)
- `enrollments` (user_id, class_id, role)
- `lessons` (id, slug, title, metadata_json, version, status)
- `activities` (id, lesson_id, section_index, type, config_json)
- `submissions` (id, user_id, activity_id, attempt_no, response_json, is_correct, score, time_ms, created_at)
- `progress` (user_id, lesson_id, status, last_activity_ref, percent_complete, updated_at)
- `points_ledger` (id, user_id, activity_id, delta, reason, created_at)
- `achievements` (id, key, name, criteria_json)
- `user_achievements` (user_id, achievement_id, earned_at)
- `class_assignments` (class_id, lesson_id, assigned_at, due_at)
- `analytics_events` (id, session_id, user_id, event_name, payload_json, ts)

Security & RLS (guidelines):
- Students: can read published lessons, write their own submissions and progress.
- Teachers: can read submissions/progress for students in their classes; manage their classes and assignments.
- Admin: elevated read.
- Row filters primarily by `user_id` and `class_id`.

## 9) Analytics & Metrics (Pilot)

Event taxonomy (examples):
- `session_started` { device, locale, uaClass }
- `lesson_opened` { lesson_id }
- `activity_started` { activity_id, type }
- `activity_completed` { activity_id, type, is_correct, time_ms }
- `hint_requested` { activity_id, after_attempts }
- `lesson_completed` { lesson_id, score, time_ms }
- `confidence_recorded` { level }
- `focus_mode_toggled` { on }

Pilot success criteria:
- ≥80% lesson completion among enrolled students
- Median time-on-task within ±20% of design target
- Positive enjoyment rating (simple in-app emoji scale ≥70% positive)
- Teachers can assign and view progress without assistance

Privacy/GDPR notes (MVP):
- Pseudonymous user IDs; minimize PII collection
- Clear consent flows handled externally by school/admin
- DPA-ready; data retention policy documented
- No third-party sharing beyond processors; remove raw IP after session aggregation

## 10) UI/UX System

- Visual: blend of Duolingo playfulness and Brilliant clarity; flat illustrations + hand-drawn accents
- Typography: large, readable; math-friendly where needed
- Color: high-contrast, friendly palette; colorblind-safe variants
- Components: accessible buttons, radios, sliders; bottom nav on mobile if needed; full-width CTA
- State clarity: instant feedback, progress indicators, recoverable errors

## 11) Roadmap and Timeline (Solo dev + AI, to mid/late September 2025)

Dates assume start 2025-08-13; adjust as needed. Each item lists deliverables, dependencies, estimate.

### Milestone 1 — Foundations & Platform (Aug 13–Aug 18)
- Deliverables: Next.js 15 TS scaffold; Tailwind; Framer Motion/GSAP; pnpm; Supabase project; RLS baseline; Storage; Vercel deploy; Sentry; analytics wiring; design tokens; basic component primitives
- Dependencies: Supabase/Vercel accounts
- Estimate: 4–5 days

### Milestone 2 — Lesson Schema, Content Pipeline, Author Preview (Aug 18–Aug 25)
- Deliverables: JSON Schema v1; validator in CI; content repo structure; asset upload script; Author Preview route rendering lesson JSON
- Dependencies: M1 CI/deploy, Storage
- Estimate: 5–6 days

### Milestone 3 — Lesson Player & Core Interactions (Aug 21–Sep 02) [overlaps M2]
- Deliverables: player shell (progress, nav, autosave); MCQ; Short Answer + self-check; Interactive Explore (1 slider pattern); Notebook Gate; persistence (`submissions`, `progress`)
- Dependencies: M2 schema
- Estimate: 8–9 days

### Milestone 4 — Gamification Essentials + Focus Mode (Sep 01–Sep 05)
- Deliverables: points, streaks, 5–7 achievements; class-only leaderboard (toggle); Focus Mode (reduced chrome, full-screen)
- Dependencies: M3 events & progress
- Estimate: 4–5 days

### Milestone 5 — Teacher Essentials (Sep 04–Sep 10)
- Deliverables: create class, join code, assign lessons, progress dashboard (completion/accuracy)
- Dependencies: M3/M4 data
- Estimate: 5–6 days

### Milestone 6 — Content Buildout & QA (Sep 04–Sep 16) [parallel]
- Deliverables: 8 lessons authored, validated, published; Make it Stick QA; mobile checks
- Dependencies: M2 schema
- Estimate: 8–9 days (parallel with dev)

### Milestone 7 — Pilot Hardening & Launch Prep (Sep 11–Sep 19)
- Deliverables: a11y/perf passes; bug bash; analytics review; teacher onboarding pack (1-pager + 5-min walkthrough video script); playbook for class setup
- Dependencies: prior milestones
- Estimate: 5–6 days

Dependency flow: M1 → M2 → M3 → M4/M5 → M7; M6 runs parallel after M2.

## 12) Detailed Tasks (checklist excerpts)

Security & Data
- Create RLS policies per role; write smoke tests
- Seed data scripts: demo class, teacher, students

Analytics
- Event queue with retry; nightly export to warehouse (optional)
- Dashboard tiles (internal): completion rates, time-on-task

Feature Flags
- Toggle: leaderboard visibility; interactive pattern enable/disable

Testing
- Unit: schema validators, scoring utils
- E2E (Playwright): enroll → complete lesson → teacher sees progress

Performance
- Lazy-load interactives; optimize images; reduce-motion variants

## 13) Risks & Mitigations

- Solo bandwidth risk: keep scope tight; reuse patterns; daily timeboxing; leverage AI for boilerplate/tests/content
- Animation/time sink: limit to 1 interactive pattern; add later
- Device variability: test on low-end Android + Chromebook; perf budgets
- Auth/DB misconfig: start with minimal RLS; add tests; use seed data
- Scope creep: enforce “Out (Not in MVP)” list; create backlog, not mid-sprint expansions

## 14) Success Metrics (Pilot)

- Student: completion rate ≥80%; enjoyment ≥70%; improvement in quick checks across lesson
- Teacher: assignment without assistance; dashboard clarity score from interviews
- Reliability: <1% error rate on activity submissions; p95 interaction latency <150ms local

## 15) Engineering Conventions

- Package manager: pnpm
- Framer usage: ES modules only; avoid `require()`
- Code quality: strict TypeScript; ESLint/Prettier; CI gates for typecheck + tests
- Environments: `.env.local` for dev; Vercel for prod with Supabase keys
- Branching: `main` protected; PRs with checklist (Make it Stick + a11y + perf)
- Commits: Conventional Commits (feat, fix, chore, docs, refactor, test, ci)

## 16) Teacher Onboarding (MVP)

- 1-pager: create class → share join code → assign lesson → view progress
- Quick-start video (≤5 min): narrated walkthrough
- In-app tips: minimal, focus-mode friendly

## 17) Experimental Design (Lightweight)

- Control vs treatment at class level if possible; otherwise rotational exposure
- Collect baseline quiz (teacher-provided or 3–5 in-app items) where feasible
- Compare completion/time-on-task/accuracy between groups; respect privacy constraints

## 18) Open Questions & Assumptions

- Language: finalize Italian vs English for MVP UI copy
- School partnerships: identify 1–2 willing schools/teachers
- Consent: managed offline by admin; app shows minimal consent status
- Content count/time: confirm 8 lessons target and durations

## 19) Work Rhythm (Solo + AI)

- Daily: 90-minute deep work block (dev), 60-minute content block, 30-minute QA/ops
- Use AI for: scaffolding, test generation, translation/localization, content drafting
- End-of-day: update checklist; cut scope if slipping; never slip quality on RLS/privacy

---

This document defines the MVP scope, architecture, lesson formats, analytics, roadmap, risks, and operating guidelines to reach a September pilot with a single developer supported by AI. Adjust dates and counts based on school partner commitments.

## 20) Fast-Start TODOs (Priority Checklist)

Use this as your day-by-day execution list. Keep scope tight; ship thin vertical slices that go end-to-end (auth → lesson → submit → analytics → teacher view).

### Day 0–1: Accounts, Scaffold, CI/CD
- [x] Create GitHub repo and Vercel project; connect for preview deployments ([repo](https://github.com/Emanuele-Webtales/fueling-rockets.git))
- [x] Create Supabase project; note `SUPABASE_URL`, `ANON_KEY` (service role only in server env)
- [x] Create Storage bucket `lesson-assets`
- [ ] Create Sentry and PostHog projects; copy DSN and API keys
- [x] Initialize Next.js 15 App Router + TypeScript + Tailwind using pnpm
- [x] Add Framer Motion and GSAP (ES modules only; avoid `require()`)
- [x] Add ESLint (strict TS), Prettier, Husky pre-commit (lint-staged)
- [x] Add GitHub Actions: `pnpm i`, `pnpm typecheck`, `pnpm lint`, `pnpm test --if-present`
- [x] Configure Vercel env vars: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SENTRY_DSN`, `NEXT_PUBLIC_POSTHOG_KEY` (local `.env` done)
- [x] Create routes: `/login`, `/app`, `/lesson/[slug]`, placeholder pages render

### Day 2: Auth, Roles, Basic Shell
- [x] Implement Supabase email/password and magic link auth (with signup)
- [x] Add onboarding: display name and role (student/teacher with access code)
- [ ] Admin role (later)
- [x] Add layout shell with mobile-first nav, progress bar placeholder
- [ ] Implement Focus Mode toggle (hide chrome, full-screen, reduced motion)

### Day 3: DB Schema (Minimum Set) + RLS
- [x] Create tables: `users`, `classes`, `enrollments`, `lessons`, `activities`, `submissions`, `progress`, `class_assignments` (see `db/schema.sql`)
- [x] Write initial RLS: students read published lessons, write own submissions/progress; teachers read class data (see `db/schema.sql`)
- [x] Seed script: demo class + published lesson and activities (see `db/seed.sql`)
- [ ] Storage: confirm signed URL policy for `lesson-assets`

### Day 4: Content Pipeline v1
- [ ] Define JSON Schema v1 for lessons and activities (MCQ, short_answer, notebook_gate, interactive_explore: number_line_slider)
- [ ] Add `content/<slug>/lesson.json` structure; commit first draft for Algebra 1 lesson
- [ ] Add CI validation step for JSON Schema
- [ ] Build Author Preview route `/author/preview?slug=<slug>` that renders JSON locally

### Day 5–6: Lesson Player Core
- [ ] Player shell: load lesson JSON by slug, render sections, show progress bar
- [ ] Implement MCQ with rationales; require attempt before hint
- [ ] Implement Short Answer with self-check rubric; capture response + self-rating
- [ ] Implement Notebook Gate (prompt + reflection textarea); block until reflection entered
- [ ] Persist to `submissions` and update `progress` after each section
- [ ] Emit analytics: `lesson_opened`, `activity_started`, `activity_completed`, `hint_requested`, `lesson_completed`

### Day 7: Interactive Explore + Focus/Perf
- [ ] Build `number_line_slider` interactive; respect `prefers-reduced-motion`
- [ ] Lazy-load heavy interaction code; ensure 60fps on low-end Android
- [ ] Add e2e happy-path test: login → open lesson → complete MCQ/SA/Notebook Gate → reach completion

### Day 8: Gamification Essentials
- [ ] Implement points ledger: +XP per activity, bonus for streak
- [ ] Add streak tracking and 5–7 simple achievements
- [ ] Add class-only leaderboard; feature flag to hide/show

### Day 9–10: Teacher Essentials
- [ ] Create class, copy/join via code (student flow)
- [ ] Assign lesson to class (simple modal)
- [ ] Progress dashboard: list students with completion and accuracy by lesson
- [ ] Analytics tiles (internal): completion rate, median time-on-task

### Day 11–12: Content and QA
- [ ] Author and validate 5 Algebra Basics lessons and 3 Functions lessons
- [ ] Review each against Make it Stick checklist (retrieval, generation, Notebook Gate)
- [ ] Mobile QA on Android Chrome, iOS Safari; fix layout/tap targets
- [ ] Accessibility pass: keyboard nav, screen reader labels, contrast

### Day 13–14: Hardening & Pilot Pack
- [ ] Bug bash: triage and close P0/P1 issues
- [ ] Perf budgets: image sizes, route chunks, bundle analysis
- [ ] Teacher onboarding 1-pager and 5-min walkthrough script
- [ ] Final data collection sanity check (events present, dashboards readable)

### Ongoing Daily
- [ ] Track scope changes; move non-critical items to backlog
- [ ] Maintain seed data for quick demos
- [ ] Keep Focus Mode default for student mobile sessions

### Definition of Done (MVP)
- [ ] A student can enroll, complete any of the 8 lessons fully on mobile, and see points/streaks
- [ ] A teacher can create a class, assign a lesson, and view completion/accuracy per student
- [ ] Events captured for key interactions and visible in analytics
- [ ] RLS protects data by user/class; seed users work end-to-end
- [ ] A11y and performance meet baseline (AA contrast; p95 interaction <150ms local)

### Backlog (Post-MVP Candidates)
- [ ] SSO (Google/Clever) and district rostering
- [ ] Spaced Repetition (SRS) and flashcards
- [ ] AI Tutor/Hints, AI Scheduler, AI authoring tools
- [ ] School/global leaderboards and competitions
- [ ] Offline mode and native apps


