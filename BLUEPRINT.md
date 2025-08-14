# Fueling Rockets — Evidence-Based Learning Blueprint
Version: 1.0  
Date: 14 Aug 2025

> **Purpose**: This document distills learning science into concrete **product requirements** and **build steps** for Fueling Rockets — from the first MVP through the long-term platform. It is meant to be directly actionable by Product, Design, Engineering, and Content teams.

---

## 0) Executive Summary

Fueling Rockets will deliver **short, interactive, retrieval-first lessons** with **built‑in spacing**, **low‑stakes assessment**, and **adaptive practice**. Every lesson includes **on‑screen actions** and **offline “Notebook Checkpoints.”** Teachers get templates and analytics to apply **evidence-based teaching**; students get a “Learning Coach” that teaches *how to learn* (metacognition).

**Core science baked into v1:**
- Retrieval practice every **3–7 minutes** (first interaction by minute **≤4**).
- Spaced repetition default schedule: **1d → 3d → 7d → 16d → 35d → 75d**, with adaptive shortening/lengthening.
- Interleaving of problem types in practice sets.
- Dual coding (words + visuals) and concrete examples.
- Desirable difficulties: effortful recall, varied practice, delayed feedback where appropriate.
- Cognitive load: micro‑lessons, one or two key ideas per segment.
- Motivation: narrative context, improvement‑based rewards, collaborative challenges.
- Health & development: **Notebook Checkpoints** to encourage handwriting, drawing, and kinesthetic thinking.

------

## 1) Product Vision & Outcomes

### 1.1 Vision
Become the **standard for education** by combining **scientific learning design** with engaging product craft. In 10 years, universities can use a **Fueling Rocket Score (FRS)** to identify mastery, improvement rate, and real‑world project capability.

### 1.2 North‑Star Outcomes
- **Learning**: +20–30% improvement on delayed retention tests (30‑day) vs. traditional textbook study.
- **Equity**: Close performance gaps by delivering adaptive practice and clear teaching supports.
- **Adoption**: Teachers report **time saved** on planning and **higher engagement** in class.
- **Wellbeing**: Encourage **offline writing/drawing** and **healthy study habits** (sleep, spacing, breaks).

------

## 2) Science → Product Rules

### 2.1 Lesson length & interaction cadence
| Age | Segment length (target) | Interactions per segment | First interaction by |
|---|---|---|---|
| K–2 | 4–6 min | ≥2 | ≤3 min |
| 3–5 | 6–8 min | ≥2–3 | ≤3 min |
| 6–8 | 6–10 min | ≥3 | ≤4 min |
| 9–12 | 8–12 min | ≥3 | ≤4 min |

**Rule**: No segment ships without **≥3 active interactions** if ≥8 minutes long. Acceptable interactions: retrieval question, micro‑problem, drag/drop, “explain in your own words,” short reflection, or **Notebook Checkpoint**.

### 2.2 Spaced repetition defaults (adaptive)
Base schedule (per concept/skill “card”):
- **Day 0 (learn)** → **Day 1** → **Day 3** → **Day 7** → **Day 16** → **Day 35** → **Day 75**

Adaptive adjustments:
- **Perfect recall**: next interval × **1.4–1.8**
- **Hesitation / partial**: next interval × **0.8–1.0**
- **Error**: reset to last successful interval or earlier (e.g., Day 1 or same‑day refresh)

Young learners (K–5): optionally add a **same‑day “quick ping”** 2–4 hours after initial learning for ultra‑short reinforcement.

### 2.3 Interleaving (mixed practice)
- Sets should mix **related but distinct** problem types (e.g., fraction addition/subtraction/multiplication) within a session.
- Target **50–70% mixed** practice after initial blocked examples.
- Ensure **varied prompts** (MCQ, short answer, worked example completion, scenario).

### 2.4 Feedback timing
- **Skills/accuracy drills**: immediate feedback to prevent encoding errors.
- **Exam simulation**: delayed feedback (end of set) to build stamina and deeper processing.
- Always provide **explanations** and a link to “review similar items.”

### 2.5 Cognitive load management
- One or two **key ideas** per segment; optional “deep dive” card for advanced students.
- Remove decorative noise; keep language simple without dumbing down content.
- Use **dual coding** (text + graphic/animation).

### 2.6 Notebook Checkpoints (physical learning)
- At least **1 Notebook Checkpoint per segment** (for 6–12 min segments).
- Clear instruction: *“On paper, sketch the force diagram; take 2 minutes. Then type your final numeric answer.”*
- Optional **photo upload** for credit; OCR later (post‑MVP).

### 2.7 Hints & scaffolds
- Hints are **tiered** (3 levels). Locked until **one sincere attempt** is submitted.
- Level 1: nudge; Level 2: partial strategy; Level 3: worked‑example outline.
- Hint usage reduces points **slightly**, not punitively—reward **learning**, not only perfection.

### 2.8 Motivation & narrative
- Each unit framed as a **mission/quest** (light story). Reward **improvement** streaks as much as raw streaks.
- **Classroom & school challenges**: collaborative goals (class XP targets) and fair leaderboards (normalize by participation).

### 2.9 Metacognition (learn how to learn)
- Short coach tips appear contextually (e.g., “Spacing beats cramming—see this again on Day 3”). 
- Student dashboard includes **“How I’m learning”** panel: retrieval rate, spacing adherence, reflection prompts.

---

## 3) Information Architecture & Data Model (MVP-ready)

### 3.1 Roles
- **Student**, **Teacher**, **Admin** (future: Parent). Auth via **Supabase** (email/password; Google optional).

### 3.2 Core entities
- **Course**: id, title, subject, grade band, description, difficulty, status.
- **Unit**: id, course_id, title, order.
- **Lesson**: id, unit_id, title, est_time, objectives[], age_band, required_materials[], segments[].
- **Segment**: id, lesson_id, duration, key_ideas[], content_blocks[], interactions[].
- **ContentBlock**: type (text, image, video, animation), payload, alt_text.
- **Interaction**: type (mcq, short_answer, drag_drop, explain, reflection, **notebook**), prompt, answer_schema, hints[1..3].
- **Attempt**: user_id, interaction_id, response, correctness, feedback, time_spent, hint_level_used.
- **SRS_Card**: user_id, concept_id, ease, interval_days, due_date, lapses.
- **Classroom**: id, teacher_id, name, school_id, join_code.
- **Enrollment**: classroom_id, user_id, role.
- **Assignment**: classroom_id, lesson_id, due_date, weighting.
- **Points**: user_id, source, amount, timestamp.
- **Leaderboard**: classroom_id, period, ranking_snapshot.
- **FRS (Fueling Rocket Score)**: user_id, subject_id, mastery, improvement_rate, challenge_index, notebook_engagement.

### 3.3 Privacy & compliance
- COPPA/GDPR‑K: verify age; parental consent flows; data minimization; export/delete on request.
- Safe defaults: private classes; anonymized leaderboards beyond classroom (MVP).

---

## 4) UX System (MVP)

### 4.1 Student flows
1. **Onboarding** → choose role, grade band, subject interests.
2. **Home** → “Continue Mission,” quick review (due SRS), class challenge status.
3. **Lesson View** → segmented content with interactions every 3–7 minutes; Notebook Checkpoint; summary + review card scheduled.
4. **Practice** → mixed sets drawn from weak concepts; spaced due stack; test mode.
5. **Coach** → micro‑tips, reflection prompts, study plan adherence.
6. **Profile** → XP, badges, FRS snapshot, notebook engagement.

### 4.2 Teacher flows
1. **Create Class** → invite code; select starter course.
2. **Assign Lesson** → pick due date, options (time, hints allowed).
3. **Live Session** (optional MVP+1) → real‑time quiz/polls.
4. **Analytics** → mastery by concept, common wrong answers, spacing adherence.
5. **Teaching Hub** → 5–10 min micro‑courses; lesson templates with evidence‑based pacing.

### 4.3 Accessibility
- WCAG 2.1 AA; dyslexia‑friendly mode; reduced‑motion; captions; keyboard full support.

---

## 5) Engineering Stack & Conventions

- **Next.js 15 (App Router)**; **TypeScript (strict)**; **Tailwind CSS**.
- **Supabase**: Auth (RLS), Postgres, storage.
- Animations: **Framer Motion** (UI), **GSAP** (complex lesson animations as needed).
- **Separation of concerns**: UI components (client), data load (server components), business logic in `/lib`.
- **Testing**: unit tests for logic (SRS, scoring); integration for auth and assignments.
- **Security**: RLS policies by role; server actions for privileged ops; sanitize inputs; rate‑limit APIs.

---

## 6) Content Standards & Templates

### 6.1 Lesson template
- **Title & Objectives** (1–3 concise outcomes).
- **Why it matters** (relevance/story hook).
- **Segment A (6–12 min)**: key idea, dual‑coded content, **≥1 Notebook Checkpoint**, **≥1 retrieval**.
- **Segment B**: as above, with **interleaving** if possible.
- **Segment C (optional)**.
- **Summary card**: student writes 1–2 sentence explanation (retrieval + elaboration).
- **Auto‑schedule** SRS cards for key ideas.

### 6.2 Interaction template
- Prompt, answer schema, distractors (for MCQ), **3‑tier hints**, feedback rules, link to review.

### 6.3 Teaching template
- Suggested pacing, discussion prompts, common misconceptions, extension tasks, assessment rubric.

---

## 7) Metrics & Evidence of Impact

### 7.1 Learning KPIs
- Immediate quiz accuracy vs. **7‑day** and **30‑day** delayed tests (target uplift ≥20%).
- Retrieval rate (% lessons with full interactions completed).
- SRS adherence (% of due reviews completed on time).

### 7.2 Engagement & Adoption
- DAU/MAU, session length, lesson completion, challenge participation.
- Classes created, active classrooms, teacher NPS.

### 7.3 Wellbeing
- Notebook engagement rate; reduced‑motion adoption; average late hours usage (monitor for sleep hygiene).

---

## 8) Research Ops & A/B Tests (MVP+1 onward)

- **Spacing intervals**: test base vs. slightly longer/shorter early gaps.
- **Hint gating**: after 1 vs. 2 attempts.
- **Interleaving ratio**: 30%, 50%, 70% mix.
- **Feedback timing**: immediate vs. end‑of‑set for certain topics.
- **Notebook Checkpoint**: with vs. without photo upload on retention.

Ethics: age‑appropriate consent, parental notices, opt‑out, secure storage.

---

## 9) Roadmap — From MVP to Platform

### Phase 0 (Now → mid‑Sept 2025): **MVP Pilot**
**Goal**: Working app with 2–3 courses, 6–9 lessons total, live in 1–3 classrooms.
- Auth (Supabase), roles (Student/Teacher), class creation, enrollment.
- Lesson engine: segments, content blocks, interactions, hints, **Notebook Checkpoints**.
- Practice: light SRS (1d/3d/7d only for MVP), mixed practice sets.
- Gamification: XP, class leaderboard, improvement badges.
- Dashboards: basic student view; teacher analytics (accuracy, time‑on‑task, common errors).
- Teaching Hub v0: 3 micro‑courses (retrieval, spacing, feedback).

**Deliverables checklist**
- [ ] Figma UI kit + lesson templates  
- [ ] DB schema + RLS policies  
- [ ] Lesson engine components (client) + server actions  
- [ ] SRS scheduler (light) + due queue UI  
- [ ] Teacher: assign lesson + view analytics  
- [ ] Pilot content (2–3 courses × 3 lessons)  
- [ ] Instrumentation + privacy/consent flows  

### Phase 1 (Oct–Dec 2025): **Evidence & Scale**
- Full SRS schedule (1→75d) with adaptive ease.
- Authoring tools for teachers (quiz builder, hint tiers).
- Live Class Mode (quizzes/polls, real‑time results).
- Student “Learning Coach” & metacognition panel.
- Parent access (read‑only progress).
- A/B testing infra; early PRD for **FRS**.

### Phase 2 (2026): **Programs & Credentials**
- Test prep mode, cumulative exams, targeted review plans.
- School & inter‑school tournaments (“Rocket Olympics”).
- Summer Passion Projects module + public showcases.
- **FRS v1** composite scoring; external sharing; early university partners.

### Phase 3 (2027+): **Intelligent Platform**
- AI tutor with Socratic scaffolding; adaptive lesson branching.
- Advanced analytics for schools; curriculum mapping.
- Offline mode; mobile apps; internationalization at scale.
- Future: AR/VR labs; FR Registry; research partnerships.

---

## 10) Detailed Week Plan to MVP (Aug 14 → Sept 19, 2025)

**Week 1 (Aug 14–20)**  
- Finalize MVP scope, UI kit, lesson templates, DB schema, auth flows.  
- Build: Auth + roles, class creation, enrollment.  
- Content: Draft 3 lessons (math/science) with full interactions + notebook steps.

**Week 2 (Aug 21–27)**  
- Build: Lesson engine (segments, interactions, hints); SRS light; dashboards (student basic).  
- Content: 3 more lessons; QA for accessibility & reduced motion.  
- Teacher Hub v0: retrieval & spacing micro‑courses.

**Week 3 (Aug 28–Sept 3)**  
- Build: Teacher analytics v1; mixed practice sets; class leaderboard.  
- Content: finalize 6–9 lessons across 2–3 courses.  
- Pilot setup: select classrooms, consent templates, instrumentation.

**Week 4 (Sept 4–10)**  
- Pilot dry‑runs; bug fixes; performance polish; add narrative framing and improvement badges.  
- Prepare data dashboards for learning KPIs.

**Week 5 (Sept 11–19)**  
- Launch pilot; monitor; daily triage; ship hotfixes.  
- Start collecting retention baselines (7‑day follow‑ups).

---

## 11) Risk Register & Mitigations

- **Scope creep** → Lock MVP scope; weekly change‑control.  
- **Content bottleneck** → Templates + authoring pipeline; reuse patterns.  
- **School IT constraints** → Web first, low bandwidth mode, minimal dependencies.  
- **Privacy/compliance** → Parental consent flows; data minimization; RLS guardrails.  
- **Engagement drop** → Narrative missions; improvement‑based rewards; interleaving variety.  
- **Over‑animation** → Respect reduced‑motion; keep FPS friendly; prioritize clarity.

---

## 12) Appendices

### A) SRS Pseudocode (adaptive SM‑2 style, simplified)
```
onReview(card, quality):
  if quality < 3: 
    card.interval = 1
    card.ease = max(1.3, card.ease - 0.2)
  else:
    if card.repetitions == 0: card.interval = 1
    elif card.repetitions == 1: card.interval = 3
    else: card.interval = round(card.interval * card.ease)
    card.ease = card.ease + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02))
  card.repetitions += 1
  card.due = today + card.interval
```

### B) Lesson QA Checklist
- Objectives clear, 1–3 key ideas  
- First interaction ≤4 minutes  
- ≥3 interactions per 8–12 min segment  
- ≥1 Notebook Checkpoint per segment  
- Dual coding present; examples concrete and varied  
- Hints (3 tiers) linked; feedback authored  
- SRS cards created for key ideas  
- Accessibility pass (contrast, tab order, ARIA, captions)  
- Reduced‑motion works; mobile layout verified

### C) Teacher Micro‑Course Outlines
1. **Retrieval Practice**: what, why, how to embed every 5–7 min; examples.  
2. **Spacing & Interleaving**: schedules, classroom routines, app defaults.  
3. **Feedback that Sticks**: immediate vs delayed; worked examples; error framing.  

### D) “How to Learn” Student Micro‑Series
- Memory 101; desirable difficulties; spacing vs cramming.  
- How to self‑test; how to explain/teach a concept.  
- Planning, sleep, breaks; handling frustration; growth mindset.

---

## 13) Ownership Map (RACI Snapshot)

| Area | Product | Design | Eng | Content | Data | Legal |
|---|---|---|---|---|---|---|
| MVP Scope & KPIs | R | C | C | C | C | I |
| UI Kit & Templates | C | R | C | C | I | I |
| Auth & Roles | C | I | R | I | I | C |
| Lesson Engine | C | C | R | C | I | I |
| SRS & Practice | C | I | R | C | C | I |
| Teacher Hub | R | C | C | R | I | I |
| Privacy/Consent | I | I | C | I | I | R |

**R** = Responsible, **A** = Accountable, **C** = Consulted, **I** = Informed

---

## 14) Final Notes

- Build the smallest thing that **proves learning gains**.  
- Make every minute **active** and **purposeful**.  
- Keep the door open for teachers and students to **co‑create** with you.  
- Measure what matters: **long‑term retention**, not just immediate correctness.

> If we respect the science and craft delightful experiences, Fueling Rockets can genuinely change how the world learns.

