# Active Context — Spark Tutor

## Current Status
**v2 Sprint 1 — Foundation (Grade Bands + Data Model) — in progress (PR 2-01 through 2-03 done)**

v1 MVP (Weeks 1–4) is complete and live at https://spark-tutor-app.vercel.app.

---

## Completed This Session (Aug 30)

- [x] PR 2-01 · Grade Band Constants (`feature/grade-band-constants`)
  - `src/constants/gradeBands.ts` — `GradeBand` (`'K' | '1' | '2' | '3'`) + `GRADE_BAND_CONFIGS`
  - `src/constants/gradeBandPrompts.ts` — `GRADE_BAND_PROMPT` (K: 2 sentences / single-step; 1: 3 / two-step; 2: 4 / two-step; 3: 5 / multi-step)
  - Barrel export from `src/constants/index.ts`
  - Note: RAG chunk `GradeBand` in `src/types/rag.ts` is still `'K' | '1' | 'K-1'` (curriculum metadata — different type)

- [x] PR 2-02 · Update System Prompt Composer (`feature/grade-band-prompt-layer`)
  - `buildSystemPrompt` takes optional `gradeBand` (defaults to `'K'`)
  - Layer 4 injects `GRADE_BAND_PROMPT[gradeBand]` after character voice, before RAG
  - `ChatRequest.grade?: GradeBand` — `/api/chat` accepts it and validates K/1/2/3
  - Child UI does not send `grade` yet — existing sessions stay Kindergarten until a later PR

- [x] PR 2-03 · Topic Curriculum Map (`feature/topic-curriculum-map`)
  - `src/constants/topicMap.ts` — `TOPIC_MAP` nested as subject → grade → topic[]
  - Math and reading: 5 topics per grade K–3; science: Phase 2 placeholder (same 6 topics all grades)
  - `getTopics(subject, gradeBand)` helper for later learning-path PRs

## Up Next
- PR 2-04 · Learning Path Firestore Types (`feature/learning-path-types`)

---

## v1 Status (complete)
**Week 4 — MCP Tool, Characters & Polish — ✅ COMPLETE (15/15 PRs done)**

---

## Completed This Session (Jun 20)

- [x] PR 4-01 · MCP Math Problem Generator (`feature/mcp-math-tool`)
  - `/api/mcp/math-problem` POST endpoint — accepts `{ grade, topic, difficulty }`, returns `{ problem, hint }` (answer stripped server-side)
  - Added `MathGrade`, `MathDifficulty`, `MathProblemRequest`, `MathProblemResponse` types to `api.ts`

- [x] PR 4-02 · Wire MCP Into Chat Router (`feature/mcp-routing`)
  - `src/lib/mcp/mathProblem.ts`: `generateMathProblem()` (direct Claude call) + `detectsProblemRequest()` (13 trigger phrases)
  - `/api/chat` now routes to MCP before RAG when child asks for a practice problem
  - `buildSystemPrompt.ts` accepts optional `mcpContext` as Layer 5

- [x] PR 4-03 · Character SVG Avatars (`feature/character-avatars`)
  - 6 SVG components in `src/components/child/avatars/` (BlipAvatar, FinnAvatar, ZorroAvatar, LunaAvatar, PipAvatar, NovaAvatar)
  - `index.ts` exports all + `getAvatarComponent(id)` lookup map

- [x] PR 4-04 · Character Animations (`feature/character-animations`)
  - CSS keyframes in `globals.css`: `avatar-idle` (2s float), `avatar-thinking` (3s tilt), `avatar-celebrate` (0.8s bounce)
  - `AnimatedAvatar.tsx` wrapper — applies class, auto-reverts celebration → idle after 1s

- [x] PR 4-05 · Update Character Select With Avatars (`feature/character-select-avatars`)
  - `CharacterCard.tsx` — SVG at 72px, celebration bounce on selected card
  - `MascotAvatar.tsx` — SVG at 96px via `AnimatedAvatar`
  - `chat/page.tsx` — `avatarState` wired to `isChatLoading` (thinking) and star events (celebrating)

- [x] PR 4-06 · Mobile Polish — Child UI (`feature/mobile-polish-child`)
  - `h-dvh` on chat page, `min-h-dvh` on character-select and WellDoneScreen
  - Safe-area inset padding on ChatInput and End Session div
  - Progress bar star badge bumped to `text-base` (16px)

- [x] PR 4-07 · Mobile Polish — Parent UI (`feature/mobile-polish-parent`)
  - `min-h-dvh` on parent layout and auth layout
  - Tighter nav padding on mobile (`px-3 sm:px-4`)
  - SessionSummaryCard header uses `flex-wrap` to avoid overflow

- [x] PR 4-08 · Privacy Policy Page (`feature/privacy-policy`)
  - `/app/privacy/page.tsx` — plain-English COPPA page (what IS and IS NOT collected)
  - COPPA callout box, third-party services section, 30-day deletion SLA, contact email
  - Privacy link in auth layout footer (both login + signup) + "agree to Privacy Policy" in SignupForm footer

- [x] PR 4-09 · Error States & Loading UI (`feature/error-and-loading`)
  - `ErrorMessage.tsx` — two variants: `child` (bright/emoji/big button) and `parent` (plain-English/neutral Shadcn-aligned)
  - `src/app/(child)/chat/loading.tsx` — wraps LoadingSpinner in violet gradient `h-dvh` container
  - `src/app/(child)/chat/error.tsx` — `'use client'` Next.js error boundary; child-friendly message + reset
  - `src/app/(parent)/dashboard/loading.tsx` — LoadingSpinner with "Loading your dashboard..."
  - `src/app/(parent)/dashboard/error.tsx` — `'use client'` Next.js error boundary; parent-friendly message + reset
  - Verified chat/page.tsx line 266 already has warm mascot fallback for API failures

---

## Up Next — Week 4 (continued)

- [x] PR 4-10 · Rate Limiting (`feature/rate-limiting`)
  - `src/lib/upstash/ratelimit.ts` — `chatRatelimit` (30 req/user/hr) + `summaryRatelimit` (10 req/user/hr)
  - Fail-open design: null when env vars absent (local dev safe, no crash)
  - `/api/chat` step 2: rate check before body parse; 429 with child-friendly message
  - `/api/summary` step 2: rate check before body parse; 429 with plain-English message
  - ✅ Upstash credentials filled in `.env.local` and Vercel (Production + Preview)

- [x] PR 4-11 · Prettier & Lint Cleanup (`feature/code-quality`)

- [x] PR 4-12 · Husky Pre-commit Hook (`feature/husky`)
  - Installed `husky@^9.1.7` + `lint-staged@^16.4.0` as devDependencies
  - `npx husky init` → created `.husky/` + added `"prepare": "husky"` to package.json
  - `.husky/pre-commit`: `npx tsc --noEmit && npx prettier --check src/ && npx eslint src/ --ext .ts,.tsx`
  - Added `lint-staged` block to package.json (`prettier --write` + `eslint --fix` on staged `src/**/*.{ts,tsx}`)
  - Hook fired during commit — all 3 checks passed ✅
  - `.prettierrc` created (semi, singleQuote, tabWidth 2, trailingComma all, printWidth 100)
  - `npx prettier --write src/` — 30 files reformatted
  - Removed 3 `console.error` calls; removed unused `updateDoc` import from `firestore.ts`
  - Fixed 8 ESLint errors across 6 files (static-components, set-state-in-effect, unused vars)
  - `npx eslint src/ --ext .ts,.tsx` → 0 errors, 0 warnings ✅
  - `npx tsc --noEmit` → 0 errors ✅

15. **PR 4-15** · Portfolio README (`feature/readme`) ✅ DONE

---

## Active Branch
`feature/topic-curriculum-map` — PR 2-03 complete, not yet merged to `dev`.

## Known Issues / Decisions
- MCP uses grade `'K'` and difficulty `'easy'` as defaults from chat router — could be made dynamic in a future iteration
- Avatar SVG fallback: if `getAvatarComponent(id)` returns null, `AnimatedAvatar` shows ✨ emoji
- `detectsProblemRequest()` only fires for `subject === 'math'` — reading subject still uses RAG only
- PowerShell on Windows 10 — quote paths with `(child)` in git commands
- Git rule: always merge feature branch to dev BEFORE creating next feature branch
- Summary is saved as `session.summary` nested field (not subcollection) — matches `Session` type
- Messages forwarded from client via `/api/session/end` → `/api/summary` (never persisted individually)
