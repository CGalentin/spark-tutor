# Active Context — Spark Tutor

## Current Status
**PR 2-17 is committed on `feature/difficulty-adaptation` (26 Sep 2026). Not merged. Waiting for review, then "continue" before merging to local `dev` or starting PR 2-18.**

v2 Sprint 3 Agentic Learning Path: PRs 2-01 through 2-16 are merged to local `dev`. `origin/dev` is still at PR 2-15 — do not force-push. Do not merge to `main`. Do not `vercel --prod` unless asked.

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

- [x] PR 2-04 · Learning Path Firestore Types (`feature/learning-path-types`)
  - `src/types/learningPath.ts` — `TopicMastery`, `LearningPath`, `EvaluationResult`
  - Firestore path (documented): `users/{parentUID}/learningPath/{subject}`
  - Uses tutoring `GradeBand` (K–3) and client Firestore `Timestamp` (safe for dashboard + API)

- [x] PR 2-05 · Learning Path Firestore Helpers (`feature/learning-path-firestore`)
  - Admin CRUD in `src/lib/firebase/learningPath.ts` (server-only — firestore.ts is imported by client hooks)
  - `getLearningPath` / `createLearningPath` / `updateLearningPath` / `saveMasteryResult` via `adminDb`
  - `subscribeToLearningPath` on client `firestore.ts` for the parent dashboard
  - Path: `users/{parentUID}/learningPath/{subject}`

- [x] PR 2-06 · Session Start Reads Learning Path (`feature/session-reads-learning-path`)
  - `/api/session/start` reads `getLearningPath` after creating the session doc
  - If missing: `createLearningPath` with first TOPIC_MAP topic for that subject at grade K
  - Response now includes `currentTopic`, `currentGrade`, `suggestedNextTopic` with `sessionId`
  - `useSessionStore` stores `currentTopic` + `currentGrade`; chat page writes them on start
  - Child UI still does not send `grade` on `/api/chat` (defaults to K)

- [x] PR 2-07 · Sprint 1 Integration Test (`dev`)
  - `/api/session/start` returned `currentTopic: "Counting to 10"`, `currentGrade: "K"`, `suggestedNextTopic: null`
  - Firestore `users/{uid}/learningPath/math` created with the same topic and grade
  - Grade K chat: simple counting language ("show me your three apples", "count them out loud")
  - Grade 2 chat: more structured two-step teaching ("When we count, we start at 1...")
  - `npx tsc --noEmit` and `npm run build` both passed

- [x] PR 2-08 · Gemini Flash Client (`feature/gemini-flash-client`)
  - `getGeminiFlashClient()` is a separate singleton from the embedding client
  - Model: `gemini-3.5-flash` (`gemini-2.0-flash` shut down 1 Jun 2026)
  - `evaluateMastery(messages, topic, grade)` → typed `EvaluationResult`
  - Smoke test with a counting transcript returned valid JSON (score 50, mastered false)

- [x] PR 2-09 · Evaluator System Prompt (`feature/evaluator-prompt`)
  - `buildEvaluatorPrompt({ topic, grade, messages })` — rubric, curriculum sequence, JSON-only contract
  - Rubric: 0–40 struggling, 41–70 partial, 71–89 close, 90–100 mastered (`MASTERED_SCORE` = 90)
  - `evaluateMastery` uses the new prompt; unreadable JSON returns a fallback (score 0, mastered false)
  - Not wired into chat yet (PR 2-12)

- [x] PR 2-10 · Topic Boundary Detection (`feature/topic-boundary-detection`)
  - `src/lib/mcp/topicBoundary.ts` — `detectTopicBoundary(messageCount, messages)` + `TOPIC_BLOCK_SIZE = 6`
  - True on every 6 child messages, or if the last child message says "I'm done" / "next topic" / "something else"
  - `useSessionStore.topicMessageCount` with increment/reset; not wired into chat yet (PR 2-12)

- [x] PR 2-11 · Evaluator API Route (`feature/evaluator-api`)
  - `POST /api/evaluate` — auth, `evaluateMastery`, save `evaluations[]` on the session, `saveMasteryResult`
  - If mastered: local `suggestNextTopic()` from TOPIC_MAP + `parentApproved: false` (upgraded in PR 2-13)
  - Types: `EvaluateRequest`, `EvaluateResponse` — still not called from chat (PR 2-12)

- [x] PR 2-12 · Wire Evaluator Into Chat Flow (`feature/evaluator-in-chat`)
  - After each mascot reply: increment `topicMessageCount`, `detectTopicBoundary`, fire-and-forget POST `/api/evaluate`
  - Reset `topicMessageCount` when evaluation fires; failures are silent — no child UI change

- [x] PR 2-13 · Next Topic Suggester (`feature/next-topic-suggester`)
  - `src/lib/gemini/suggestNextTopic.ts` — first unmastered TOPIC_MAP topic in the current grade; if none, first topic of the next grade
  - Uses `MASTERED_SCORE` (90) + `completedTopics` / `masteryHistory` (not Gemini)
  - `/api/evaluate` calls it when `mastered: true`, saves `learningPath.suggestedNextTopic`, local helper removed
  - Grade 3 with everything mastered stays on the last listed topic (must return a string)
  - Merged to local `dev`

- [x] PR 2-14 · Sprint 2 Integration Test (`dev`)
  - 6-message Math session on "Counting to 10" (grade K); topic boundary fired only after message 6
  - `POST /api/evaluate` ran after the 6th mascot reply returned (separate ~6s request; chat 6 took ~15s and did not wait on Flash)
  - Firestore session `evaluations[]` length 1 (score 65, mastered false)
  - Firestore `learningPath/math` masteryHistory grew 0 → 1; `lastEvaluatedAt` set
  - Not mastered, so `suggestedNextTopic` stayed null (correct — suggester only runs at score >= 90)
  - `npx tsc --noEmit` and `npm run build` passed; `vercel --prod` skipped per request

- [x] PR 2-15 · Learning Path Injects Into Teacher Prompt (`feature/learning-path-prompt-injection`)
  - `LearningPathContext` type: currentTopic, masteredTopics, difficultyHint (`'easier' | 'normal' | 'harder'`)
  - `buildSystemPrompt` Layer 5 (after grade band, before RAG); RAG is Layer 6, MCP is Layer 7
  - `/api/chat` fetches `getLearningPath` per request; missing path skips the layer
  - `difficultyHint` is always `'normal'` until PR 2-17
  - Live check: off-topic "multiplication and dinosaurs" → Blip stayed on counting to 10

- [x] PR 2-16 · Parent Topic Approval API (`feature/parent-topic-approval`)
  - `POST /api/learning-path/approve` — `{ subject, approvedTopic }` moves `currentTopic`, sets `parentApproved` true, stamps `parentApprovedAt`, clears `suggestedNextTopic`, appends the previous topic to `topicsCompleted[]`
  - `POST /api/learning-path/reject` — `{ subject }` clears `suggestedNextTopic` only; `currentTopic` stays
  - Both verify the Firebase auth token and return `ApiResult` (`{ approved: true, newTopic }` / `{ rejected: true }`)
  - Types: `ApproveTopicRequest`, `ApproveTopicResponse`, `RejectTopicRequest`, `RejectTopicResponse`
  - Does not change `currentGrade` (a next-grade suggestion still leaves the stored grade as-is)
  - Not called from the child UI — parent dashboard wires these in PR 2-22
  - Merged to local `dev` (fast-forward). Not pushed.

- [x] PR 2-17 · Difficulty Adaptation (`feature/difficulty-adaptation`)
  - `getDifficultyHint(masteryHistory, currentTopic)` in `src/lib/claude/adaptDifficulty.ts`
  - Last two scores on the current topic both < 50 → `easier`; both > 85 → `harder`; otherwise `normal`
  - Fewer than two scores on that topic stays `normal`
  - `/api/chat` passes that hint into Layer 5 (no longer hardcoded)
  - Easier/harder append a teaching line on the learning-path layer. Normal keeps the grade-band prompt in Layer 4
  - Not merged yet

## Up Next (wait for review, then "continue")
- Merge `feature/difficulty-adaptation` into local `dev`, then PR 2-18 · Session Start Full Learning Path Integration (`feature/session-full-integration`)

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
`feature/difficulty-adaptation` — PR 2-17 committed, not merged. Local `dev` includes PR 2-16. `origin/dev` is behind local `dev`. Do not force-push. Do not merge until "continue".

## Known Issues / Decisions
- Evaluator uses `gemini-3.5-flash` (`gemini-2.0-flash` shut down 1 Jun 2026). Prompt lives in `buildEvaluatorPrompt.ts`.
- `MASTERED_SCORE` is 90 — `mastered` is true only when the evaluator score is 90 or higher.
- Unreadable evaluator JSON falls back to score 0 / mastered false so a bad model reply never auto-advances.
- Chat fires `/api/evaluate` at topic boundaries (every 6 child messages or "I'm done" / "next topic" / "something else"). Failures are silent — child UI unchanged.
- Next-topic pick is `suggestNextTopic()` (curriculum map + mastery history, including next-grade rollover). `topicsCompleted[]` stays empty until a parent approves a move; approve then appends the topic being left.
- Approve does not change `currentGrade`. Reject only clears `suggestedNextTopic` (`parentApproved` stays whatever it already was).
- Sprint 2 live run scored 65 on Counting to 10 (not mastered), so `suggestedNextTopic` stayed null. `vercel --prod` was skipped.
- Child UI does not send `grade` yet — `/api/chat` defaults to Kindergarten
- Teacher prompt Layer 5 difficulty comes from `getDifficultyHint`: last two scores on the current topic, both under 50 → easier, both over 85 → harder, otherwise normal. One score stays normal.
- New learning paths default to grade K and the first TopicMap topic; existing paths are reused as-is
- `suggestedNextTopic` is returned from session start but not stored in Zustand yet (Sprint 3/4)
- MCP uses grade `'K'` and difficulty `'easy'` as defaults from chat router — could be made dynamic in a future iteration
- Avatar SVG fallback: if `getAvatarComponent(id)` returns null, `AnimatedAvatar` shows ✨ emoji
- `detectsProblemRequest()` only fires for `subject === 'math'` — reading subject still uses RAG only
- PowerShell on Windows 10 — quote paths with `(child)` in git commands
- Git rule: always merge feature branch to dev BEFORE creating next feature branch
- Summary is saved as `session.summary` nested field (not subcollection) — matches `Session` type
- Messages forwarded from client via `/api/session/end` → `/api/summary` (never persisted individually)
