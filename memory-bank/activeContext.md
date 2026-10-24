# Active Context — Spark Tutor

## Current Status
**Phase 2 PR 3-02 is committed (24 Oct 2026).** Bram's SVG is `BramAvatar.tsx` in commit `84b81b1`. Stella still has no drawing. https://spark-tutor-app.vercel.app does not include either character until a later deploy. The Math suggestion card still says Shapes. Do not click it unless asked. Next work is PR 3-03, Stella's SVG. That is not v1 Week 3.

Do not force-push.

v2 Sprint 3 Agentic Learning Path: PRs 2-01 through 2-19 are on `main`.

v1 MVP (Weeks 1–4) is complete. v2 phase 1 is now the production site at https://spark-tutor-app.vercel.app.

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
  - Merged to local `dev` (fast-forward). Not pushed.

- [x] PR 2-18 · Session Start Full Learning Path Integration (`feature/session-full-integration`)
  - Session start reads the path first. If `parentApproved` is false and `suggestedNextTopic` is set, the session teaches `currentTopic`
  - Session doc stores `currentTopic`, `currentGrade`, and `difficultyHint`
  - Response adds `learningPath` summary (topic, grade, suggestion, parentApproved, difficultyHint, topicsCompleted) and keeps the existing top-level fields
  - Chat page sends `grade` and `currentTopic` on every `/api/chat` request
  - Chat uses that grade for Layer 4 and that topic for Layer 5. A sent topic wins over a newer path topic so a mid-session approval does not change the lesson in progress
  - Merged to local `dev` (fast-forward). Not pushed.

- [x] PR 2-19 · Sprint 3 Integration Test (`dev`)
  - Live math session on Counting to 10: 6 chats, then POST `/api/evaluate` (same call the chat page makes)
  - Score 100, mastered, suggested Counting to 20. Session `evaluations[]` length 1. Session doc stored topic K / normal
  - Off-topic "multiplication and dinosaurs" stayed on a counting question
  - Approve moved currentTopic to Counting to 20, cleared the suggestion, appended Counting to 10 to topicsCompleted
  - New session returned Counting to 20. "What are we learning right now?" → count to 20
  - Two scores under 50 (40 and 30) on Counting to 20 → reply used one hand and fingers, counting 1 to 5
  - `npx tsc --noEmit` and `npm run build` passed
  - Live math path for the test parent is now Counting to 20, with those two low scores last, so the next math chat uses easier until two higher scores land

- [x] PR 2-20 · Mastery Indicator Component (`feature/mastery-indicator`)
  - `src/components/parent/MasteryIndicator.tsx` — SVG ring for a mastery score 0–100
  - Colors: red 0–49 "Building", yellow 50–89 "Almost there", green 90–100 "Mastered!"
  - Green uses `MASTERED_SCORE` (90). Yellow starts at 50, wider than the evaluator close band (71–89)
  - Props: `topic` and `score`. The arc eases over 700ms when `score` changes
  - Shadcn `Badge` for the label. `aria-label` includes the topic, the score, and the label
  - Does not subscribe to Firestore. Not mounted on the dashboard (that is PR 2-21)
  - Checked in a temporary preview (deleted before commit): clicked score buttons 0, 49, 50, 71, 89, 90, 100 and confirmed the label, color, and that the arc eases
  - Merged into local `dev` and pushed to `origin/dev`.

- [x] PR 2-21 · Live Session Panel (`feature/live-session-panel`)
  - `useLiveSession` listens with `subscribeToSessions` and picks the newest session that has no `endedAt`
  - `mastery` is the last score in that session's `evaluations[]`, or 0 before the first score
  - `LiveSessionPanel` sits above session history and passes `topic` and `score` into `MasteryIndicator`
  - Shows topic, grade, stars, and message count. Empty state text is "No active session"
  - Browser check: clicked Start a Session, chose Blip, named Buddy, chose Math, then All Done. The card moved from 4 messages to 0 messages and back to 4. Child chat input was on screen. No chat message was sent
  - Merged into local `dev` and pushed to `origin/dev`.

- [x] PR 2-22 · Topic Suggestion Card (`feature/topic-suggestion-card`)
  - `useLearningPath(subject)` listens with `subscribeToLearningPath` and returns the path plus `approveTopic` and `rejectTopic`
  - Approve posts `{ subject, approvedTopic }` to `/api/learning-path/approve`. Reject posts `{ subject }` to `/api/learning-path/reject`
  - The hook also returns `error` when the listener fails. It does not import the Admin learning-path file
  - `TopicSuggestionCard` shows for math and for reading, above `LiveSessionPanel`, only when `suggestedNextTopic` is set and `parentApproved` is false
  - It shows the current topic as the one just finished, the suggested next topic, and the evaluator note
  - That note is on the session evaluation (`topic` + `suggestedNext` match). The learning path document does not store `reasoning`. If none matches, the card says the evaluator did not leave a note
  - Either button hides the card immediately. If the save fails, the card comes back with the error
  - Button text is "Yes, start this next" and "Keep practicing current topic"
  - Browser check: a temporary Math suggestion of Shapes was written so the card could be clicked, then "Keep practicing current topic" was clicked. `POST /api/learning-path/reject` returned 200 and cleared the suggestion. `parentApproved` was put back to true afterward. Current topic stayed Counting to 20. Scores stayed 100, 40, 30. "Yes, start this next" was not clicked, because approve would move the lesson
  - Child check: Blip, named Buddy, Math. Chat input was on screen. All Done ended the session. No chat message was sent. Session start and end both returned 200
  - Merged into local `dev` and pushed to `origin/dev`.

- [x] PR 2-23 · Learning Path History (`feature/learning-path-history`)
  - `LearningPathHistory` sits below session history. Math and Reading each use `useLearningPath` and do not call approve or reject
  - Newest scores first. The latest score on the current topic is marked In progress. Score colors match the ring: red under 50, yellow through 89, green at 90
  - Two Counting to 20 scores share the timestamp `2026-09-26T17:56:08.773Z`. The one later in `masteryHistory` (30) is the in-progress score. The 40 is the earlier try. Counting to 10 is 100, Mastered
  - The five newest stay visible. "Show full history" is rendered only when there are more than five. This parent has three math scores, so that button is not on screen. Hide Math and Hide Reading are the controls that were clicked
  - Reading has no path, so the card says "No reading topics yet."
  - Browser check: Hide Math collapsed the scores and Show Math brought them back. Same for Reading. Child chat: Blip named Buddy, Math, session start 200, the input was on screen, End session returned 200, "Great job today!" showed. No chat message was sent
  - Two earlier tries clicked End before the session id was saved, so those sessions stayed open. They were empty Buddy sessions and were ended afterward with `POST /api/session/end` (200). The older unended sessions were not closed. The learning path was not changed
  - Merged into local `dev` and pushed to `origin/dev`.

- [x] PR 2-24 · Session Summary v2 (`feature/session-summary-v2`)
  - `buildSummaryPrompt` now receives the session's `evaluations` array. The summary route reads that array off the session document. The child client does not send scores
  - Claude is told the topic, whether it was mastered (yes when the score is >= 90), the score, and a suggested focus. Those facts stay inside the existing JSON keys: `topicsCovered`, `areasForPractice`, `encouragementNote`. A missing evaluation tells Claude not to invent a score
  - `SessionSummaryCard` shows the latest evaluation. The badge is red 0–49 "Building", yellow 50–89 "Almost there", green 90–100 "Mastered!". Green uses `MASTERED_SCORE` (90)
  - "Topic mastered" appears only at 90 or above. "Suggested next: [topic]" appears when that evaluation's `suggestedNext` is a non-empty string
  - No evaluation shows the plain line "No mastery score yet". A real score of 0 would still be the red Building badge, because that means the evaluator ran
  - Parent-facing text on this card is 16px. Shadcn `Badge` is used. Files in `src/components/ui/` were not edited
  - Browser check: the Sep 26 Blip session (7 messages, still open) shows Counting to 10, "100 · Mastered!", "Topic mastered", and "Suggested next: Counting to 20". It still says "Summary generating" because that session was never ended. It was not closed
  - Twelve older sessions with no evaluation showed "No mastery score yet", not a zero badge
  - Child check: Blip, named Buddy, Math. Session start 200, the input was on screen, End session returned 200, "Great job today!" showed. No chat message was sent. The new card shows 0 messages, "No mastery score yet", and a short encouragement quote
  - The math learning path was not changed: Counting to 20, suggestion null, parentApproved true, scores 100 then 40 then 30. "Yes, start this next" was not on screen and was not clicked
  - Merged into local `dev` (fast-forward). Not pushed. `origin/dev` was still `75822ba` at the start of PR 2-25.

- [x] PR 2-25 · Rate Limiting Update (`feature/rate-limiting-v2`)
  - `evaluateRatelimit` is 60 per parent per hour, prefix `rl:evaluate`, on `POST /api/evaluate`
  - `approveRatelimit` is 20 per parent per hour, prefix `rl:approve`, on `POST /api/learning-path/approve`
  - `rejectRatelimit` is 20 per parent per hour, prefix `rl:reject`, on `POST /api/learning-path/reject`
  - Chat stays 30/hour (`rl:chat`). Summary stays 10/hour (`rl:summary`). The three new counters do not share a bucket
  - Each check runs after `verifyAuthToken` and before the body is parsed. A missing token is still 401 and does not count
  - A blocked parent gets HTTP 429 in plain English. Evaluate: "Too many mastery checks. Please wait a bit before the next one." Approve: "Too many topic approvals. Please wait before starting another topic." Reject: "Too many topic updates. Please wait before trying that again."
  - Null limiter or a Redis error still fail open, same as chat and summary
  - No-token curls: evaluate, approve, and reject each returned 401 JSON, not an HTML 404. The dev server on port 3000 was left running
  - A live 429 was not observed. The Redis host in `.env.local` does not resolve (`ENOTFOUND` on 1.1.1.1), and the stored token is only 8 characters, so the limiter throws and the route would let the request through. The parent's evaluate, approve, and reject buckets were not filled. No Gemini call was made. Do not print the URL or token
  - Child check: Blip, named Buddy, Math. Session start 200, "Say something..." was on screen, End session returned 200, "Great job today!" showed. No chat message was sent. Older unended sessions were not closed
  - "Yes, start this next" was not on screen and was not clicked. The math path was not changed
  - Merged into local `dev` (fast-forward). Not pushed. `origin/dev` is still `75822ba`.

- [x] PR 2-26 · Final v2 End-to-End Test (`dev`)
  - The dashboard does not say "No active session". After the test session ended, the live card returned to an older open lesson: Counting to 20, Kindergarten, 0 stars, 4 messages, score 0. Those older sessions were not closed. The Sep 26 Blip session (score 100, summary still generating) was not ended
  - Child check: Blip, named Buddy, Math. Session start 200, Counting to 20, grade K, difficulty hint easier. Six chats each returned 200. No second dev server was started
  - The live ring updated during the open session from 0 / Building to 92 / Mastered!, with 6 messages and 1 star
  - Gemini saved score 92, mastered true, confidence high, suggested next Shapes. The suggestion card appeared and quoted the evaluator note. Approve was not clicked. Reject was not clicked
  - End returned 200. The child saw "Great job today!". The new session card shows "92 · Mastered!", "Topic mastered", "Suggested next: Shapes", and a summary. The practice line is "Learning about shapes". The encouragement note includes the score 92
  - The timeline shows 92 at the top. It is not marked In progress, because that badge is only added when the latest score on the current topic is under 90. Four scores, so "Show full history" stays hidden. Reading still has no path
  - Easier language showed up in this session (fingers, slow counting, extra praise) because the prior Counting to 20 scores were 40 and 30. After the 92, the last two scores on that topic are 30 and 92, so the next Math chat uses the normal hint
  - Grade check used two extra `/api/chat` calls and a fake session id, so they did not write a score. Kindergarten stopped after 10 and asked for the next number. Grade 2 counted through 20, then asked what comes after 10
  - Math path now: current topic Counting to 20, grade K, Counting to 10 completed, suggestion Shapes, parentApproved false. History is 100, then 40, then 30, then 92
  - `npx tsc --noEmit` and `npm run build` passed. Pushed to `origin/dev` on 10 Oct 2026. Not merged to `main`
  - The user said to leave the Shapes card. Do not click either button unless asked

- [x] PR 2-27 · v2 Production Deploy (`main`)
  - No new environment variable names. Vercel Production already had the 13 names the app reads, including the two Upstash names. `.env.local` was not edited
  - `npm run build` exited 0. `vercel --prod` aliased https://spark-tutor-app.vercel.app
  - Live check was a short visit, not another 6-message chat. The dashboard showed the Shapes card and the older open lesson: Counting to 20, Kindergarten, 0 stars, 4 messages
  - Child check: Blip, named Buddy, Math. Session start 200 stayed on Counting to 20, grade K, suggestion Shapes. The input "Say something..." was on screen. No chat message was sent. End returned 200 and "Great job today!" showed
  - Approve was not clicked. Reject was not clicked. The Sep 26 Blip session was not ended. Older unended sessions were not closed
  - Math path was unchanged after the visit: Counting to 20, suggestion Shapes, parentApproved false, topicsCompleted only Counting to 10, history 100 then 40 then 30 then 92
  - Merged `dev` into `main` and pushed `main`. Not a force-push

- [x] PR 2-28 · Update README and CLAUDE.md (`docs/v2-readme-update`)
  - `README.md` now describes the live K–3 app: Claude Haiku as the Teacher, Gemini Flash (`gemini-3.5-flash`) as the silent Evaluator, seven prompt layers, the Firestore learning path, and the parent approval path. The live URL is still https://spark-tutor-app.vercel.app. The stored RAG chunks are still the K–1 set of 536
  - `CLAUDE.md` keeps the earlier "Key Files to Read" lines and adds the Evaluator, `MASTERED_SCORE` of 90, the two `GradeBand` types, the model name `gemini-3.5-flash`, and the current Math path
  - `npx tsc --noEmit` exited 0
  - Commit `6df4460` includes only `README.md` and `CLAUDE.md`. `AGENTS.md` and `spark_tutor_build_bible_2.docx` stayed uncommitted
  - `dev` was not merged into `main`. No production deploy

- [x] PR 3-01 · Design the Two New Characters (`feature/new-characters-design`)
  - Bram (`bram`): bear cub, amber `bg-amber-500` / `text-amber-800`, emoji 🐻, sturdy explorer voice
  - Stella (`stella`): starfish, rose `bg-rose-400` / `text-rose-600`, emoji ⭐, bright tide-pool voice
  - `elevenlabsVoiceId` is `''` on all 8 characters. The type union now includes `'bear'` and `'starfish'`
  - `npx tsc --noEmit` exited 0. Commit `a7cc3e3`
  - Select cards fall back to the emoji. Chat `AnimatedAvatar` falls back to ✨. Do not draw the SVGs in this PR

- [x] PR 3-02 · SVG Avatar — Bram (`feature/avatar-boyish-new`)
  - `src/components/child/avatars/BramAvatar.tsx` — round ears, snout, belly, paws. `viewBox="0 0 120 120"` to match the other six
  - `bram` is in `getAvatarComponent`. Commit `84b81b1`
  - Headless Edge showed the cub at 48px and 96px on an amber card. The signed-in app was not clicked

## Up Next
- Next code work is Phase 2 PR 3-03: the SVG avatar for Stella, on branch `feature/avatar-girlish-new`. Do not confuse this with v1 Week 3.
- The Shapes card stays. Do not click "Yes, start this next" or "Keep practicing current topic" unless the user asks in that message. Approve would leave Counting to 20 and append it to `topicsCompleted`. Reject would only clear Shapes, and it would leave `parentApproved` false.
- Do not redo the 6-message test. Do not redo PR 2-25 to close the live 429 box. Do not force-push. Do not merge to `main`. Do not deploy again unless asked.

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
Local `dev` includes Bram's avatar after `feature/avatar-boyish-new` is merged in. It is ahead of `origin/dev` (`54c23f0`) and has not been pushed. `main` is the live branch. Do not force-push. Do not merge to `main`. Do not deploy again unless the user asks.

## Known Issues / Decisions
- `MasteryIndicator` takes `topic` and `score` only. `useLiveSession` listens and passes the score in. Do not subscribe inside the ring.
- A session with no `endedAt` counts as live. After the PR 2-26 session was ended, the dashboard again shows an older open lesson: Counting to 20, Kindergarten, 0 stars, 4 messages, score 0. Do not close those sessions unless asked.
- Evaluator uses `gemini-3.5-flash` (`gemini-2.0-flash` shut down 1 Jun 2026). Prompt lives in `buildEvaluatorPrompt.ts`.
- `MASTERED_SCORE` is 90 — `mastered` is true only when the evaluator score is 90 or higher.
- Unreadable evaluator JSON falls back to score 0 / mastered false so a bad model reply never auto-advances.
- Chat fires `/api/evaluate` at topic boundaries (every 6 child messages or "I'm done" / "next topic" / "something else"). Failures are silent — child UI unchanged.
- Next-topic pick is `suggestNextTopic()` (curriculum map + mastery history, including next-grade rollover). `topicsCompleted[]` stays empty until a parent approves a move; approve then appends the topic being left.
- Approve does not change `currentGrade`. Reject only clears `suggestedNextTopic` (`parentApproved` stays whatever it already was).
- The evaluator's `reasoning` is stored on session `evaluations[]`, not on the learning path. `TopicSuggestionCard` matches `evaluation.topic` to `currentTopic` and `evaluation.suggestedNext` to `suggestedNextTopic`. A seeded suggestion with no matching evaluation shows the fallback sentence.
- Counting to 20 scores 40 and 30 share `evaluatedAt` `2026-09-26T17:56:08.773Z`. The timeline breaks the tie by list order, so 30 is In progress. `CardTitle` is a `div`, not a heading.
- The chat page shows the input as soon as Math is chosen, before `/api/session/start` finishes. `handleEndSession` does nothing while `sessionId` is still null. Wait for start 200 before clicking End.
- Do not click "Yes, start this next" unless the user asks. The card is visible: suggested next is Shapes, current topic is still Counting to 20, and `parentApproved` is false. Approve would move the topic and append Counting to 20 to `topicsCompleted`. Do not click "Keep practicing current topic" unless asked. Reject would clear Shapes and would not set `parentApproved` back to true.
- The card hides as soon as a button is clicked. A cold dev compile of approve/reject can take about 2 seconds. Wait for HTTP 200 and a later Firestore read before treating a still-present suggestion as a failed save.
- On this Windows machine, `next dev` has returned an HTML 404 for `POST /api/session/start` and `POST /api/session/end` while the route files were present and sibling routes returned 401. That was a stale Turbopack compile, not a missing route. Restart `npm run dev` or touch the route file, then re-check. Do not leave a `console.log` in the route. The chat page still shows the input if start returns 404, because it falls back to a client session id — confirm the network status is 200.
- Browser checks in Cursor here have no built-in browser tool. Use playwright-core from a temp folder (not a project dependency), Chrome channel, a custom token, and the Firebase CDN client with the default app name so sign-in persists. Do not print tokens or `.env` values. Do not commit temp scripts.
- Sprint 2 live run scored 65 on Counting to 10 (not mastered), so `suggestedNextTopic` stayed null. `vercel --prod` was skipped.
- Child UI sends `grade` (the session's `currentGrade`) and `currentTopic` on every `/api/chat` request. If `grade` is omitted, the API still defaults to Kindergarten
- The PR 2-26 Math test appended score 92 on Counting to 20 at `2026-10-10T23:03:46.508Z`. The last two scores on that topic are now 30 and 92, so the next Math chat uses the normal hint. The easier hint was confirmed in the test session itself, before this score was saved
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
- The summary prompt reads `evaluations` from the session document. The card badge uses the latest evaluation, not Claude's JSON. No evaluation is "No mastery score yet", not score 0
- The unended Sep 26 Blip session still has the only older evaluation: Counting to 10, score 100, suggestedNext Counting to 20. Its card still says "Summary generating". Do not end it. The 10 Oct 2026 Buddy session is ended and has its own evaluation: Counting to 20, score 92, suggestedNext Shapes
- Playwright `networkidle` never finishes on the dashboard because Firestore listeners stay open. Use `domcontentloaded`. Temp browser scripts must be `.cjs` — `.mjs` cannot `require`
- Evaluate, approve, and reject are rate limited after auth and before the body parse. A Redis error fail-opens. The host in `.env.local` does not resolve, so a local 429 could not be shown and no parent bucket was filled. Do not lower the caps to force a 429. Do not send real evaluate calls just to fill the bucket
