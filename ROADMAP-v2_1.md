# Spark Tutor — v2 Roadmap
# Phase 1: AI Intelligence Layer
# No fixed timeline | Work at your own pace

> **How to use this roadmap**
> Same rules as v1 — each PR is a focused 15-minute task with one clear goal.
> Check off tasks as you complete them. Commit after every PR.
> Branch: work on `dev`, merge to `main` only at the end of each sprint.
> Start each Cursor session with: "I'm building Spark Tutor v2. Please reference
> my .cursorrules, CLAUDE.md, and ROADMAP-v2.md. I'm currently on PR [number]."

---

## v2 Feature Overview

| Feature | What It Does | New Tech |
|---|---|---|
| Multi-agent flow | Teacher (Claude) + Evaluator (Gemini Flash) per session | Multi-agent orchestration |
| Agentic learning path | AI decides next topic based on mastery | Persistent agentic state |
| Grade band prompts | Fine-tuned system prompts per grade (K, 1, 2, 3) | Composable prompt layer 4 |
| Real-time mastery UI | Parent sees live confidence scores during session | Firestore onSnapshot |
| Parent topic approval | AI suggests next topic, parent confirms | Human-in-the-loop agentic |

---

## Phase 1 Progress

- [x] Sprint 1 — Foundation (Grade Bands + Data Model)
- [x] Sprint 2 — Evaluator Agent (Gemini Flash)
- [ ] Sprint 3 — Agentic Learning Path
- [ ] Sprint 4 — Parent Dashboard Updates

---

## Sprint 1 — Foundation
> Goal: Grade band prompt system live + new Firestore data model in place.
> No visible changes to the child UI yet — this is all groundwork.

---

### PR 2-01 · Grade Band Constants
**Branch:** `feature/grade-band-constants`

- [x] Create `/src/constants/gradeBands.ts`:
  - Define `GradeBand` type: `'K' | '1' | '2' | '3'`
  - Define `GRADE_BAND_CONFIGS` object with one entry per grade containing:
    - `label` (e.g. "Kindergarten", "Grade 1")
    - `responseLength` ('very-short' | 'short' | 'medium')
    - `vocabularyLevel` ('simple' | 'developing' | 'expanding')
    - `questionComplexity` ('single-step' | 'two-step' | 'multi-step')
    - `encouragementStyle` (short phrase describing tone)
- [x] Create `/src/constants/gradeBandPrompts.ts`:
  - Export `GRADE_BAND_PROMPT` object — one prompt string per grade band
  - K: max 2 sentences, single-step only, very simple words
  - 1: max 3 sentences, simple words, begin two-step thinking
  - 2: max 4 sentences, developing vocabulary, two-step problems
  - 3: max 5 sentences, expanding vocabulary, multi-step reasoning
- [x] Export from `/src/constants/index.ts`
- [x] Verify TypeScript compiles: `npx tsc --noEmit`
- [x] Commit: `feat(constants): add grade band configs and fine-tuned prompt strings`

---

### PR 2-02 · Update System Prompt Composer
**Branch:** `feature/grade-band-prompt-layer`

- [x] Update `/src/lib/claude/buildSystemPrompt.ts`:
  - Add optional `gradeBand?: GradeBand` param to `BuildSystemPromptOptions`
  - Add Layer 4: inject `GRADE_BAND_PROMPT[gradeBand]` between CHARACTER_VOICE and RAG_CONTEXT
  - Default to `'K'` if no grade band provided (backwards compatible)
- [x] Update `/src/app/api/chat/route.ts`:
  - Accept optional `grade` field in request body
  - Pass grade to `buildSystemPrompt()`
- [x] Update `ChatRequest` type in `/src/types/api.ts` — add `grade?: GradeBand`
- [x] Test: send a message with `grade: '2'` — verify Claude uses more complex language
- [x] Verify TypeScript compiles: `npx tsc --noEmit`
- [x] Commit: `feat(api): add grade band as layer 4 of composable system prompt`

---

### PR 2-03 · Topic Curriculum Map
**Branch:** `feature/topic-curriculum-map`

- [x] Create `/src/constants/topicMap.ts`:
  - Define `TopicMap` — nested object: `subject → gradeBand → topic[]`
  - Math topics per grade:
    - K: Counting to 10, Counting to 20, Shapes, Comparing numbers, Simple addition
    - 1: Addition to 20, Subtraction to 20, Place value, Measurement, Time and money
    - 2: Addition to 100, Subtraction to 100, Place value to 1000, Multiplication intro, Fractions intro
    - 3: Multiplication, Division, Fractions, Area and perimeter, Data and graphs
  - Reading topics per grade:
    - K: Letter sounds, Sight words, Phonics basics, Simple sentences, Story comprehension
    - 1: Blending sounds, Reading fluency, Vocabulary, Story elements, Main idea
    - 2: Reading comprehension, Context clues, Compare and contrast, Author's purpose, Nonfiction
    - 3: Inferencing, Text evidence, Literary devices, Summary writing, Research skills
  - Science topics per grade (placeholder for Phase 2):
    - K-3: Living things, Weather, Human body, Animals, Plants, Earth and sky
- [x] Export from `/src/constants/index.ts`
- [x] Commit: `feat(constants): add topic curriculum map for math and reading k-3`

---

### PR 2-04 · Learning Path Firestore Types
**Branch:** `feature/learning-path-types`

- [x] Create `/src/types/learningPath.ts`:
  ```ts
  interface TopicMastery {
    topic: string;
    subject: string;
    grade: GradeBand;
    score: number;          // 0-100
    mastered: boolean;      // score >= 90
    evaluatedAt: Timestamp;
  }

  interface LearningPath {
    subject: string;
    currentGrade: GradeBand;
    currentTopic: string;
    topicsCompleted: string[];
    masteryHistory: TopicMastery[];
    suggestedNextTopic: string | null;
    parentApproved: boolean;
    parentApprovedAt: Timestamp | null;
    lastEvaluatedAt: Timestamp | null;
  }

  interface EvaluationResult {
    topic: string;
    score: number;
    mastered: boolean;
    confidence: 'low' | 'medium' | 'high';
    suggestedNext: string | null;
    reasoning: string;       // Gemini's brief explanation — shown to parent only
  }
  ```
- [x] Export from `/src/types/index.ts`
- [x] Verify TypeScript compiles: `npx tsc --noEmit`
- [x] Commit: `feat(types): add LearningPath, TopicMastery, and EvaluationResult types`

---

### PR 2-05 · Learning Path Firestore Helpers
**Branch:** `feature/learning-path-firestore`

- [x] Add to `/src/lib/firebase/firestore.ts` (server-side admin functions):
  - `getLearningPath(parentUID, subject)` → `LearningPath | null`
  - `createLearningPath(parentUID, subject, initialTopic, grade)` → creates doc
  - `updateLearningPath(parentUID, subject, updates)` → partial update
  - `saveMasteryResult(parentUID, subject, result: TopicMastery)` → appends to history
  - `subscribeToLearningPath(parentUID, subject, callback)` → onSnapshot for dashboard
- [x] All server functions use `adminDb` (Firebase Admin) — never the client SDK
- [x] All functions fully typed — no `any`
- [x] Verify TypeScript compiles: `npx tsc --noEmit`
- [x] Commit: `feat(firebase): add learning path firestore helpers with admin sdk`

---

### PR 2-06 · Session Start Reads Learning Path
**Branch:** `feature/session-reads-learning-path`

- [x] Update `/src/app/api/session/start/route.ts`:
  - After creating session doc, call `getLearningPath(parentUID, subject)`
  - If no learning path exists: create one with the first topic from `TopicMap`
  - Return `learningPath` data alongside `sessionId` in response
- [x] Update `SessionStartResponse` type — add `currentTopic`, `currentGrade`, `suggestedNextTopic`
- [x] Update `chat/page.tsx` — store `currentTopic` and `currentGrade` from session start response in `useSessionStore`
- [x] Update `useSessionStore` — add `currentTopic: string`, `currentGrade: GradeBand` fields
- [x] Verify TypeScript compiles: `npx tsc --noEmit`
- [x] Commit: `feat(api): session start reads learning path and returns current topic and grade`

---

### PR 2-07 · Sprint 1 Integration Test
**Branch:** `dev`

- [x] Start a session — verify `currentTopic` and `currentGrade` are returned from `/api/session/start`
- [x] Send a message with grade K — verify Claude uses simple K-level language
- [x] Send a message with grade 2 — verify Claude uses more complex language
- [x] Check Firestore console — verify `learningPath` document created under `users/{uid}/learningPath/math`
- [x] Verify TypeScript compiles: `npx tsc --noEmit`
- [x] Verify build passes: `npm run build`
- [x] Commit: `chore: sprint 1 complete — grade bands and learning path foundation`

---

## Sprint 2 — Evaluator Agent
> Goal: Gemini Flash silently scores child mastery at each topic boundary.
> Parent can see evaluation results in Firestore (dashboard UI comes in Sprint 4).

---

### PR 2-08 · Gemini Flash Client
**Branch:** `feature/gemini-flash-client`

- [x] Update `/src/lib/gemini/client.ts`:
  - Add `getGeminiFlashClient()` alongside existing embedding client
  - Use model: `gemini-2.0-flash` (fast, cheap, already in your Google AI Studio account)
  - Keep embedding client and Flash client as separate singletons
- [x] Create `/src/lib/gemini/evaluate.ts`:
  - Export `evaluateMastery(messages, topic, grade)` → `EvaluationResult`
  - Takes the last N messages (topic block), topic name, and grade band
  - Returns structured JSON: score, mastered, confidence, suggestedNext, reasoning
- [x] Test: call `evaluateMastery` with a sample conversation — verify JSON response
- [x] Verify TypeScript compiles: `npx tsc --noEmit`
- [x] Commit: `feat(gemini): add gemini flash client and evaluateMastery function`

> **Model note:** `gemini-2.0-flash` was shut down 1 Jun 2026. This PR uses `gemini-3.5-flash` (Google's current Flash replacement). Smoke test: `npx ts-node --project tsconfig.scripts.json scripts/gemini/testEvaluate.ts`

---

### PR 2-09 · Evaluator System Prompt
**Branch:** `feature/evaluator-prompt`

- [x] Create `/src/lib/gemini/buildEvaluatorPrompt.ts`:
  - Takes `{ topic, grade, messages }` 
  - Returns a structured prompt instructing Gemini Flash to:
    - Score mastery 0-100 based on child's responses in the conversation
    - Mark `mastered: true` if score >= 90
    - Rate confidence as low/medium/high
    - Suggest the most logical next topic from the curriculum map
    - Respond ONLY in valid JSON — no preamble, no markdown fences
  - Include grading rubric in prompt:
    - 0-40: Child is struggling, needs more practice on this topic
    - 41-70: Child shows partial understanding, needs reinforcement
    - 71-89: Child is close, one more topic block recommended
    - 90-100: Child has mastered this topic, ready to advance
- [x] Add JSON parse safety — wrap in try/catch, return fallback result on parse failure
- [x] Verify TypeScript compiles: `npx tsc --noEmit`
- [x] Commit: `feat(gemini): add evaluator system prompt builder with mastery rubric`

---

### PR 2-10 · Topic Boundary Detection
**Branch:** `feature/topic-boundary-detection`

- [x] Create `/src/lib/mcp/topicBoundary.ts`:
  - Export `detectTopicBoundary(messageCount, messages)` → `boolean`
  - Returns true when: messageCount is a multiple of 6 (every 6 child messages = one topic block)
  - Secondary trigger: child explicitly says "I'm done" / "next topic" / "something else"
  - Export `TOPIC_BLOCK_SIZE = 6` constant
- [x] Add `topicMessageCount` to `useSessionStore` — tracks messages within current topic block
- [x] Verify TypeScript compiles: `npx tsc --noEmit`
- [x] Commit: `feat(session): add topic boundary detection at every 6 child messages`

---

### PR 2-11 · Evaluator API Route
**Branch:** `feature/evaluator-api`

- [x] Create `/src/app/api/evaluate/route.ts` — POST endpoint:
  - Accepts `{ sessionId, messages, topic, grade, subject }`
  - Verifies Firebase auth token
  - Calls `evaluateMastery(messages, topic, grade)` via Gemini Flash
  - Saves `EvaluationResult` to Firestore session doc under `evaluations[]`
  - Updates `learningPath` with mastery result via `saveMasteryResult()`
  - If mastered: calls `suggestNextTopic()` and saves suggestion to `learningPath.suggestedNextTopic`
  - Sets `learningPath.parentApproved = false` (awaiting parent confirmation)
  - Returns `{ evaluated: true, result: EvaluationResult }`
- [x] Add `EvaluateRequest`, `EvaluateResponse` types to `/src/types/api.ts`
- [x] Verify TypeScript compiles: `npx tsc --noEmit`
- [x] Commit: `feat(api): add evaluator api route powered by gemini flash`

---

### PR 2-12 · Wire Evaluator Into Chat Flow
**Branch:** `feature/evaluator-in-chat`

- [x] Update `chat/page.tsx`:
  - After each mascot response, increment `topicMessageCount` in store
  - Call `detectTopicBoundary()` — if true, fire POST to `/api/evaluate` (non-blocking)
  - Evaluator call is fire-and-forget from child UI — never blocks the chat
  - Reset `topicMessageCount` to 0 after evaluation fires
- [x] Child never sees any indication the Evaluator ran — no UI change to child chat
- [x] Add error boundary: if `/api/evaluate` fails, log silently and continue chat
- [x] Verify TypeScript compiles: `npx tsc --noEmit`
- [x] Commit: `feat(chat): wire evaluator into chat flow at topic boundaries`

---

### PR 2-13 · Next Topic Suggester
**Branch:** `feature/next-topic-suggester`

- [x] Create `/src/lib/gemini/suggestNextTopic.ts`:
  - `suggestNextTopic(subject, grade, completedTopics, masteryHistory)` → `string`
  - Uses `TopicMap` to find unmastered topics in current grade
  - Picks the most logical next topic based on curriculum sequence
  - If all topics in current grade mastered: suggests first topic of next grade
  - Returns topic name as a plain string
- [x] Update `/src/app/api/evaluate/route.ts`:
  - Call `suggestNextTopic()` when `mastered: true`
  - Save suggestion to `learningPath.suggestedNextTopic` in Firestore
- [x] Verify TypeScript compiles: `npx tsc --noEmit`
- [x] Commit: `feat(gemini): add next topic suggester using curriculum map and mastery history`

---

### PR 2-14 · Sprint 2 Integration Test
**Branch:** `dev`

- [x] Run a 6-message chat session on a Math topic
- [x] Verify `/api/evaluate` is called after message 6 (check Network tab)
- [x] Check Firestore — verify `evaluations[]` array populated in session doc
- [x] Check Firestore — verify `learningPath` updated with mastery result
- [x] If mastered: verify `suggestedNextTopic` populated in `learningPath`
- [x] Verify chat never paused or blocked during evaluation
- [x] Verify TypeScript compiles: `npx tsc --noEmit`
- [x] Verify build passes: `npm run build`
- [ ] Deploy to Vercel: `vercel --prod`
- [x] Commit: `chore: sprint 2 complete — evaluator agent live with gemini flash`

---

## Sprint 3 — Agentic Learning Path
> Goal: The Teacher Agent adapts based on the Evaluator's mastery scores.
> Parent approves topic suggestions from the dashboard (UI in Sprint 4).

---

### PR 2-15 · Learning Path Injects Into Teacher Prompt
**Branch:** `feature/learning-path-prompt-injection`

- [x] Update `/src/lib/claude/buildSystemPrompt.ts`:
  - Add optional `learningPathContext?: LearningPathContext` param
  - Add Layer 5 (after grade band, before RAG):
    ```
    Current topic: ${currentTopic}
    Topics this child has already mastered: ${masteredTopics.join(', ')}
    Difficulty level: ${difficultyHint}
    Focus exclusively on ${currentTopic} until the child shows understanding.
    Do not introduce new topics — let the parent decide when to advance.
    ```
- [x] Create `LearningPathContext` type in `/src/types/learningPath.ts`
- [x] Update `/src/app/api/chat/route.ts`:
  - Fetch learning path at start of each chat request
  - Pass learning path context into `buildSystemPrompt()`
- [x] Test: verify Claude stays on current topic and doesn't wander
- [x] Verify TypeScript compiles: `npx tsc --noEmit`
- [x] Commit: `feat(api): inject learning path context into teacher agent system prompt`

---

### PR 2-16 · Parent Topic Approval API
**Branch:** `feature/parent-topic-approval`

- [ ] Create `/src/app/api/learning-path/approve/route.ts` — POST endpoint:
  - Accepts `{ subject, approvedTopic }`
  - Verifies Firebase auth token
  - Updates `learningPath`:
    - `currentTopic` → `approvedTopic`
    - `parentApproved` → `true`
    - `parentApprovedAt` → `Timestamp.now()`
    - `suggestedNextTopic` → `null` (clear the suggestion)
    - Appends previous topic to `topicsCompleted[]`
  - Returns `{ approved: true, newTopic: approvedTopic }`
- [ ] Create `/src/app/api/learning-path/reject/route.ts` — POST endpoint:
  - Accepts `{ subject }` — parent wants to keep current topic
  - Clears `suggestedNextTopic` without changing `currentTopic`
  - Returns `{ rejected: true }`
- [ ] Add types to `/src/types/api.ts`
- [ ] Verify TypeScript compiles: `npx tsc --noEmit`
- [ ] Commit: `feat(api): add parent topic approval and rejection endpoints`

---

### PR 2-17 · Difficulty Adaptation
**Branch:** `feature/difficulty-adaptation`

- [ ] Create `/src/lib/claude/adaptDifficulty.ts`:
  - `getDifficultyHint(masteryHistory, currentTopic)` → `'easier' | 'normal' | 'harder'`
  - If last 2 scores on this topic < 50: return 'easier'
  - If last 2 scores on this topic > 85: return 'harder'  
  - Otherwise: return 'normal'
- [ ] Update `GRADE_BAND_PROMPT` injection in `buildSystemPrompt.ts`:
  - Append difficulty hint to Learning Path layer:
    - 'easier': "Use more visual descriptions, break into smaller steps, extra encouragement"
    - 'normal': standard grade band prompt
    - 'harder': "Challenge with slightly harder variations, ask follow-up questions"
- [ ] Verify TypeScript compiles: `npx tsc --noEmit`
- [ ] Commit: `feat(api): add difficulty adaptation based on mastery score history`

---

### PR 2-18 · Session Start Full Learning Path Integration
**Branch:** `feature/session-full-integration`

- [ ] Update `/src/app/api/session/start/route.ts`:
  - Check `learningPath.parentApproved` — if false and `suggestedNextTopic` exists,
    session starts on current topic (not the suggested one) until parent approves
  - Save `currentTopic`, `currentGrade`, `difficultyHint` to session doc at start
  - Return full learning path summary in `SessionStartResponse`
- [ ] Update chat page to pass `currentGrade` and `currentTopic` with every chat request
- [ ] Update chat API route to use these values in prompt composition
- [ ] Verify TypeScript compiles: `npx tsc --noEmit`
- [ ] Commit: `feat(api): full learning path integration in session start flow`

---

### PR 2-19 · Sprint 3 Integration Test
**Branch:** `dev`

- [ ] Full flow test:
  - Start session → chat 6 messages on Math topic → verify evaluation fires
  - Check Firestore: mastery scored + next topic suggested
  - Verify Teacher Agent stays focused on current topic in next messages
  - Call approve endpoint manually (via Postman or curl) → verify topic updates
  - Start new session → verify Teacher prompt now references new approved topic
- [ ] Test difficulty adaptation:
  - Manually set a low mastery score in Firestore → verify Teacher uses easier language
- [ ] Verify TypeScript compiles: `npx tsc --noEmit`
- [ ] Verify build passes: `npm run build`
- [ ] Commit: `chore: sprint 3 complete — agentic learning path fully wired`

---

## Sprint 4 — Parent Dashboard Updates
> Goal: Parent sees live mastery scores and can approve topic suggestions
> directly from the dashboard — no Postman required.

---

### PR 2-20 · Mastery Indicator Component
**Branch:** `feature/mastery-indicator`

- [ ] Create `/src/components/parent/MasteryIndicator.tsx`:
  - Circular progress ring (SVG) showing current topic mastery score 0-100
  - Color coded: red (0-49) → yellow (50-89) → green (90-100)
  - Shows topic name, score, and confidence label ('Building', 'Almost there', 'Mastered!')
  - Animates smoothly when score updates via onSnapshot
  - Uses Shadcn `Badge` for confidence label
- [ ] Verify accessible: includes `aria-label` with score for screen readers
- [ ] Verify TypeScript compiles: `npx tsc --noEmit`
- [ ] Commit: `feat(parent-ui): add mastery indicator component with animated progress ring`

---

### PR 2-21 · Live Session Panel
**Branch:** `feature/live-session-panel`

- [ ] Create `/src/components/parent/LiveSessionPanel.tsx`:
  - Shows when a session is currently active (detected via Firestore `endedAt: null`)
  - Displays: current topic, current grade, stars earned so far, message count
  - Embeds `MasteryIndicator` — updates in real time via `onSnapshot`
  - Shows "No active session" state when child is not currently learning
- [ ] Create `/src/hooks/useLiveSession.ts`:
  - `onSnapshot` on latest session doc (where `endedAt` is null)
  - Returns `{ isActive, currentSession, mastery }`
- [ ] Add `LiveSessionPanel` to parent dashboard above session history
- [ ] Verify TypeScript compiles: `npx tsc --noEmit`
- [ ] Commit: `feat(parent-ui): add live session panel with real-time mastery indicator`

---

### PR 2-22 · Topic Suggestion Card
**Branch:** `feature/topic-suggestion-card`

- [ ] Create `/src/components/parent/TopicSuggestionCard.tsx`:
  - Appears when `learningPath.suggestedNextTopic` is not null and `parentApproved` is false
  - Shows: current topic completed, suggested next topic, brief reason from Evaluator
  - Two action buttons:
    - "Yes, start this next ✓" → calls `/api/learning-path/approve`
    - "Keep practicing current topic" → calls `/api/learning-path/reject`
  - Card disappears after either action (optimistic UI update)
  - Uses Shadcn `Card`, `Button` components
- [ ] Create `/src/hooks/useLearningPath.ts`:
  - `onSnapshot` subscription to `learningPath` doc
  - Returns `{ learningPath, approveTopic, rejectTopic, isLoading }`
- [ ] Add `TopicSuggestionCard` to parent dashboard — renders above `LiveSessionPanel`
- [ ] Verify TypeScript compiles: `npx tsc --noEmit`
- [ ] Commit: `feat(parent-ui): add topic suggestion card with approve and reject actions`

---

### PR 2-23 · Learning Path History View
**Branch:** `feature/learning-path-history`

- [ ] Create `/src/components/parent/LearningPathHistory.tsx`:
  - Timeline of mastered topics with scores and dates
  - Groups by subject (Math | Reading)
  - Shows current topic in progress with live score
  - Collapses to show last 5 entries by default, expandable to full history
  - Uses Shadcn `Card`, `Badge`, `Collapsible` components
- [ ] Add to parent dashboard below session history
- [ ] Verify TypeScript compiles: `npx tsc --noEmit`
- [ ] Commit: `feat(parent-ui): add learning path history timeline to parent dashboard`

---

### PR 2-24 · Session Summary v2
**Branch:** `feature/session-summary-v2`

- [ ] Update `/src/lib/claude/buildSummaryPrompt.ts`:
  - Add mastery evaluation data to summary context
  - Claude now includes in summary: topic mastered yes/no, score achieved, suggested focus for next session
- [ ] Update `SessionSummaryCard.tsx`:
  - Add mastery score badge (color coded red/yellow/green)
  - Add "Topic mastered ✓" indicator when score >= 90
  - Add "Suggested next: [topic]" line when suggestion exists
- [ ] Verify TypeScript compiles: `npx tsc --noEmit`
- [ ] Commit: `feat(parent-ui): update session summary with mastery scores and topic suggestion`

---

### PR 2-25 · Rate Limiting Update
**Branch:** `feature/rate-limiting-v2`

- [ ] Add rate limit to `/api/evaluate` — max 60 per user per hour (fires frequently)
- [ ] Add rate limit to `/api/learning-path/approve` — max 20 per user per hour
- [ ] Add rate limit to `/api/learning-path/reject` — max 20 per user per hour
- [ ] Verify all new endpoints return 429 with plain-English message on limit hit
- [ ] Verify TypeScript compiles: `npx tsc --noEmit`
- [ ] Commit: `feat(api): add rate limiting to all v2 ai and learning path endpoints`

---

### PR 2-26 · Final v2 End-to-End Test
**Branch:** `dev`

- [ ] Full flow test:
  - [ ] Login as parent → dashboard shows no active session
  - [ ] Start session as child (K, Math) → dashboard shows LiveSessionPanel
  - [ ] Send 6 messages → verify MasteryIndicator updates in real time on dashboard
  - [ ] If mastered: verify TopicSuggestionCard appears on dashboard
  - [ ] Approve topic from dashboard → verify next session uses new topic
  - [ ] End session → verify updated SessionSummaryCard shows mastery score
  - [ ] Check LearningPathHistory — verify mastered topic appears in timeline
- [ ] Test difficulty adaptation: low mastery → verify easier language in next session
- [ ] Test grade band: grade 2 session → verify more complex Claude responses
- [ ] Test reject flow: reject topic suggestion → verify current topic stays active
- [ ] Verify TypeScript compiles: `npx tsc --noEmit`
- [ ] Verify build passes: `npm run build`
- [ ] Commit: `test: final v2 phase 1 end-to-end test pass`

---

### PR 2-27 · v2 Production Deploy
**Branch:** `main`

- [ ] Add any new environment variables to Vercel project settings
- [ ] `npm run build` — zero errors ✅
- [ ] `vercel --prod`
- [ ] Smoke test live URL — full child + parent flow
- [ ] Merge `dev` → `main`
- [ ] Commit: `chore: v2 phase 1 production deploy — AI intelligence layer live`

---

### PR 2-28 · Update README and Portfolio Docs
**Branch:** `feature/readme-v2`

- [ ] Update `README.md`:
  - [ ] Add v2 architecture section (multi-agent diagram)
  - [ ] Add new portfolio talking points:
    - Multi-agent orchestration (Teacher + Evaluator separation of concerns)
    - Human-in-the-loop agentic design (parent confirms AI suggestions)
    - Difficulty adaptation via mastery history
  - [ ] Update tech stack (add Gemini Flash for Evaluator)
  - [ ] Update live URL if changed
- [ ] Update `CLAUDE.md` with v2 architecture notes
- [ ] Commit: `docs: update readme and claude.md for v2 phase 1 architecture`

---

## v2 Phase 1 Completion Checklist

- [x] Grade band prompts working for K, 1, 2, 3
- [x] Gemini Flash Evaluator scoring mastery after every 6 messages
- [x] Learning path persisted in Firestore per subject
- [ ] Teacher Agent adapts based on current topic and mastery history
- [ ] Difficulty adapts based on score history (easier/normal/harder)
- [ ] Parent sees live mastery indicator during active sessions
- [ ] Parent receives and can act on topic suggestions
- [ ] Session summaries include mastery scores
- [ ] All new endpoints rate limited
- [x] Zero TypeScript errors
- [ ] Zero ESLint warnings
- [ ] Live on Vercel with zero build errors
- [ ] README updated with v2 architecture

---

## Coming in Phase 2 (future roadmap)
- Voice input (Web Speech API) + mascot TTS responses
- Science subject + grades 2-3 curriculum expansion
- New MCP tools: reading quiz generator, spelling practice
- More Spark Squad characters

---

*Spark Tutor v2 | Built with Next.js · Firebase · Claude · Gemini · Tailwind CSS · Vercel*
