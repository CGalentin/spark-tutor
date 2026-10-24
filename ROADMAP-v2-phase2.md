# Spark Tutor — v2 Phase 2 Roadmap
# Curriculum Expansion | Voice | New Characters | New MCP Tools
# Started: October 2026 | No fixed timeline

> **How to use this roadmap**
> Each PR is a focused 15-minute task with one clear goal.
> Check off tasks as you complete them. Commit after every PR.
> Branch: work on `dev`, merge to `main` only at the end of each sprint.
> Start each Cursor session with: "I'm building Spark Tutor v2 Phase 2.
> Please reference my .cursorrules, CLAUDE.md, and ROADMAP-v2-phase2.md.
> I'm currently on PR [number]."

---

## Phase 2 Overview

| Sprint | Focus | Key Deliverable |
|---|---|---|
| Pre-work | Close Phase 1 | PR 2-28 done, clean commit history |
| Sprint 1 | New characters | 2 new Spark Squad members, avatars + animations |
| Sprint 2 | MCP reading tools | Reading quiz + spelling practice, chat + button triggers |
| Sprint 3 | Curriculum expansion | Grades 2-3 + Science, RAG corpus expanded, grade promotion |
| Sprint 4 | Voice | Parent opt-in, Web Speech API input, ElevenLabs TTS output |

---

## Phase 2 Progress

- [ ] Pre-work — Close PR 2-28
- [ ] Sprint 1 — New Spark Squad Characters
- [ ] Sprint 2 — Reading Quiz + Spelling MCP Tools
- [ ] Sprint 3 — Grades 2-3 + Science Curriculum
- [ ] Sprint 4 — Voice Input + ElevenLabs TTS

---

## Pre-Work — Close Phase 1 Cleanly

> Before writing a single line of Phase 2 code, close out the one open
> Phase 1 PR. This keeps your commit history clean and your docs accurate.

---

### PR 2-28 · Update README and CLAUDE.md for v2 Architecture
**Branch:** `docs/v2-readme-update`

- [x] Update `README.md`:
  - [x] Change "K-1" to "K-3" in the description
  - [x] Update tech stack: add Gemini Flash (Evaluator), remove "three-layer prompt"
  - [x] Add Architecture section describing the multi-agent flow:
    - Teacher Agent (Claude Haiku) — mascot voice, Socratic conversation
    - Evaluator Agent (Gemini Flash) — silent mastery scoring every 6 messages
    - Agentic Learning Path — persistent Firestore state, parent approval flow
  - [x] Update portfolio talking points to include v2 patterns
  - [x] Update live URL if changed from https://spark-tutor-app.vercel.app
- [x] Update `CLAUDE.md`:
  - [x] Add Evaluator Agent (Gemini Flash) to the stack section
  - [x] Update prompt layers to 7 (was 3 in original)
  - [x] Add mastery threshold (`MASTERED_SCORE = 90`)
  - [x] Add note on the two separate `GradeBand` types — do not mix them:
    - Tutoring grades: `'K' | '1' | '2' | '3'` in `src/constants/gradeBands.ts`
    - RAG chunk grades: `'K' | '1' | 'K-1'` in `src/types/rag.ts`
  - [x] Add current live learning-path state note (Counting to 20, grade K)
  - [x] Add Gemini Flash model name: `gemini-3.5-flash` (gemini-2.0-flash shut down 1 Jun 2026)
- [ ] Commit any dirty files noted in the brief: `AGENTS.md`, `spark_tutor_build_bible_2.docx`
- [x] Run: `npx tsc --noEmit` — zero errors
- [x] Commit: `docs: update readme and claude.md for v2 phase 1 architecture`
- [ ] Merge `dev` → `main`
- [x] Check Sprint 4 overview box and Phase 1 checklist in `ROADMAP-v2_1.md`

> **Note (24 Oct 2026):** Docs commit `6df4460` is on `docs/v2-readme-update` only. `AGENTS.md` and `spark_tutor_build_bible_2.docx` stayed uncommitted on purpose. `dev` was not merged into `main`. The Phase 1 "Zero ESLint warnings" box stays open. The live 429 box and the three open PR 2-26 boxes stay open.

---

## Sprint 1 — New Spark Squad Characters
> Goal: Two new characters — one boyish, one girlish — fully integrated with
> constants, voice prompt, SVG avatar, three animations, and character select card.
> No API changes. No RAG changes. Pure UI + constants work.

---

### PR 3-01 · Design the Two New Characters
**Branch:** `feature/new-characters-design`

- [x] Decide on the two new characters (suggestions below — pick what excites you):
  - **Boyish options:** a curious raccoon, a friendly bear cub, a bouncy kangaroo
  - **Girlish options:** a glowing jellyfish, a cheerful hedgehog, a starfish
- [x] For each character, define before writing any code:
  - `id` — kebab-case, e.g. `raccoon`
  - `defaultName` — e.g. "Remy"
  - `type` — animal / fantasy / robot
  - `vibe` — boyish / girlish
  - `primaryColor` + `accentColor` — Tailwind class names matching existing pattern
  - `emoji` — temporary placeholder until SVG is done
  - `voicePrompt` — one paragraph: personality, catchphrases, teaching style
  - `elevenlabsVoiceId` — leave as `''` for now, filled in Sprint 4
- [x] Add both characters to `/src/constants/characters.ts`
- [x] Export updated character list from `/src/constants/index.ts`
- [x] Verify TypeScript compiles: `npx tsc --noEmit`
- [x] Commit: `feat(constants): add two new spark squad character definitions`

> **Note (24 Oct 2026):** Bram the bear cub (`bram`, amber) and Stella the starfish (`stella`, rose). Commit `a7cc3e3` on `feature/new-characters-design`. No SVG yet. The select card shows the emoji. Chat falls back to ✨ until PRs 3-02 and 3-03.

---

### PR 3-02 · SVG Avatar — Boyish Character
**Branch:** `feature/avatar-boyish-new`

- [x] Create `/src/components/child/avatars/[CharacterName]Avatar.tsx`
- [x] SVG guidelines — match the existing six avatars exactly:
  - Simple geometric shapes only — no complex paths or clipPaths
  - `viewBox="0 0 150 150"`
  - Use character's `primaryColor` and `accentColor` from constants
  - Must be recognizable at 48px (character select) AND 96px (chat view)
- [x] Export from `/src/components/child/avatars/index.ts`
- [x] Add to the avatar map used by `getAvatarComponent(id)`
- [x] Verify avatar renders correctly in browser at both sizes
- [x] Commit: `feat(child-ui): add svg avatar for [character name]`

> **Note (24 Oct 2026):** Bram only. File is `BramAvatar.tsx`. Commit `84b81b1`. `viewBox` is `0 0 120 120`, the same as the other six avatars. The roadmap's 150 would have made him a different scale. Fur is amber-600 `#D97706`, muzzle amber-200 `#FDE68A`, features amber-800 `#92400E`, so he stays visible on the amber-500 card. A headless Edge screenshot showed him at 48px and 96px. The signed-in select screen was not clicked. Stella still has no SVG.

---

### PR 3-03 · SVG Avatar — Girlish Character
**Branch:** `feature/avatar-girlish-new`

- [x] Create `/src/components/child/avatars/[CharacterName]Avatar.tsx`
- [x] Follow same SVG guidelines as PR 3-02
- [x] Export from `/src/components/child/avatars/index.ts`
- [x] Add to the avatar map
- [x] Verify renders at both sizes
- [x] Commit: `feat(child-ui): add svg avatar for [character name]`

> **Note (24 Oct 2026):** Stella only. File is `StellaAvatar.tsx`. Commit `63800fa`. Five longer arms, rose-700 `#BE123C` on the rose-400 card, face rose-100 `#FFE4E6`. `viewBox` is `0 0 120 120`. A headless Edge screenshot showed her at 48px and 96px. The signed-in select screen was not clicked.

---

### PR 3-04 · Animations for Both New Characters
**Branch:** `feature/new-character-animations`

- [x] Add three CSS keyframe animations to each new avatar component:
  - `avatar-idle` — gentle float up/down `translateY(0 → -6px → 0)`, 2s loop
  - `avatar-thinking` — slow side-to-side tilt, 3s loop — plays while mascot is typing
  - `avatar-celebrate` — fast bounce + scale up, 0.8s — plays when child earns a star
- [x] Wire `thinking` to `isChatLoading` state via `AnimatedAvatar` (same as existing six)
- [x] Wire `celebrate` to star events in `useSessionStore` (same as existing six)
- [ ] Test animations on mobile (375px, DevTools throttled CPU)
- [x] Commit: `feat(child-ui): add idle, thinking, and celebrate animations to new avatars`

> **Note (24 Oct 2026):** No new CSS. `globals.css` already defines the three classes. Bram and Stella pass `animationClass` through, and chat already switches thinking and celebrate for whichever character is selected. During the sprint test, idle float and thinking tilt were watched at 375px with CPU slowed to 4x. Celebrate in chat was not watched, because no star was awarded. That box stays open.

---

### PR 3-05 · Character Select Screen With 8 Cards
**Branch:** `feature/character-select-8-cards`

- [x] Verify new characters appear on the character select screen
  (if grid is driven by the characters array, no code change needed)
- [x] If grid is hardcoded: update `CharacterGrid.tsx` to include new characters
- [x] Decide on grid layout for 8 cards — options:
  - 2×4 (two columns, four rows) — safest on 375px
  - 4×2 (four columns, two rows) — fits more on screen but cards shrink
  - Recommend: 2×4, same column count as original 2×3
- [x] Verify grid fits cleanly at 375px with no horizontal scroll
- [x] Hover animation: slight scale up (same as existing cards)
- [x] Selected state: ring highlight + avatar celebrate bounce (same as existing)
- [x] No feature commit. The grid was already driven by the character list

> **Note (24 Oct 2026):** `CharacterGrid` already uses `grid-cols-2` and maps `CHARACTERS`. Eight cards make four rows. No layout file changed. Signed in, saw the Shapes card, clicked only "Start a Session", and did not tap "Let's Go!". At 375px the page did not scroll sideways. Bram and Stella showed their SVGs. Hover on Finn set `scale` to 1.05. Bram's selected card had the white ring, grew slightly, and the cub bounced. The Math path was unchanged. The phone-size chat animation box in PR 3-04 stays open.

---

### PR 3-06 · Sprint 1 Test + Deploy
**Branch:** `dev`

- [x] Select each new character, name it, start a Math session
- [x] Verify mascot voice and catchphrases match each character's personality
- [x] Verify idle animation plays in chat view
- [x] Verify thinking animation plays while mascot is responding
- [ ] Verify celebrate animation plays when star is earned
- [x] Verify character select grid looks clean on 375px with 8 cards
- [x] Run: `npx tsc --noEmit` — zero errors
- [x] Run: `npm run build` — zero errors
- [x] Deploy: `vercel --prod`
- [x] Merge `dev` → `main`
- [x] Notes commit records the deploy. The star bounce box stays open

> **Note (24 Oct 2026, deploy):** Production alias https://spark-tutor-app.vercel.app shows all eight cards at 375px, including Bram and Stella's drawings. No sideways scroll. No lesson was started on the live site. `origin/dev` includes `8e2732e`. `origin/main` includes merge `0b3db03`. The three kept decisions are in `CLAUDE.md`.

> **Note (24 Oct 2026):** Bram was named Cub and Stella was named Tide. Each Math visit stayed on Counting to 20, grade K, suggestion Shapes, difficulty normal. Two messages each, then All Done. No mastery check ran. Bram said "Good tracking, cub!" Stella said "keep floating along." At 375px with CPU slowed to 4x, both floated while waiting and tilted while replying. Neither earned a star, so the chat bounce was not seen. `npx tsc --noEmit` and `npm run build` exited 0. The Math path was unchanged.
>
> **Decisions kept on purpose:** Stella's voice prompt stays. Do not force a catchphrase into every reply. Do not run six messages just to earn a star. The name question still uses the emoji ("What will you name your 🐻?"). Leave that sentence for a later small change.

---

## Sprint 2 — Reading Quiz + Spelling MCP Tools
> Goal: Two new MCP tools — reading quiz generator and spelling practice —
> each triggerable via chat phrase AND a dedicated button in the child UI.
> The correct answer / correct spelling NEVER reaches the browser.

---

### PR 3-07 · Reading Quiz MCP Route
**Branch:** `feature/mcp-reading-quiz`

- [x] Create `/src/app/api/mcp/reading-quiz/route.ts` — POST endpoint:
  - Auth: verify Firebase token BEFORE reading body
  - Rate limit: 30 per user per hour (add to Upstash config alongside existing limits)
  - Accepts: `{ sessionId: string, grade: GradeBand, topic: string }`
  - Calls Claude Haiku to generate a short age-appropriate reading passage
  - Generates 3 comprehension questions with 3 answer options each
  - Returns to client: `{ passage: string, questions: QuizQuestion[] }`
  - `QuizQuestion`: `{ question: string, options: string[], hint: string }`
  - Stores correct answer indexes server-side in Firestore temp doc:
    `quiz_sessions/{sessionId}/activeQuiz` → `{ answers: number[], expiresAt: Timestamp }`
  - Correct answer indexes are NEVER included in the client response
- [x] Add types to `/src/types/api.ts`:
  `QuizQuestion`, `ReadingQuizRequest`, `ReadingQuizResponse`
- [x] Test with curl: confirm passage + questions return, confirm no `correctIndex` in response
- [x] Commit: `feat(mcp): add reading quiz generator mcp route — answers server-side only`

> **Note (24 Oct 2026):** Commit `0c2980c`. The route checks the signed-in parent, then a new 30-per-hour limit (`rl:reading-quiz`), then the body. A post with no token and a broken body returned 401. A signed-in broken body returned 400. A missing session returned 404, and Claude was not called. One grade K quiz on Story comprehension returned a short passage and 3 questions. Each question had 3 choices and a hint. The reply did not contain `correctIndex`, `answers`, or `parentUID`. Firestore needs a file name after the `activeQuiz` folder, so the note is `quiz_sessions/{sessionId}/activeQuiz/current`. It holds `answers` (three numbers, each 0, 1, or 2), `expiresAt` (2 hours), and `parentUID`. Client rules deny `quiz_sessions`. The hints are not stored on that note. The Math path was unchanged. The 26 Sep Blip session is still open. Not pushed.

---

### PR 3-08 · Quiz Answer Verification Route
**Branch:** `feature/mcp-quiz-verify`

- [ ] Create `/src/app/api/mcp/reading-quiz/verify/route.ts` — POST endpoint:
  - Auth: verify Firebase token BEFORE reading body
  - Rate limit: 60 per user per hour
  - Accepts: `{ sessionId: string, questionIndex: number, selectedOption: number }`
  - Reads correct answer from `quiz_sessions/{sessionId}/activeQuiz`
  - If correct: returns `{ correct: true, feedback: string }` — feedback is mascot-voiced praise
  - If wrong: returns `{ correct: false, hint: string }` — hint only, guides child to try again
  - NEVER returns which option was correct
  - Deletes the temp doc after all 3 questions are answered
- [ ] Test: submit correct and wrong answers — verify hint vs praise, verify no correct index leaked
- [ ] Commit: `feat(mcp): add quiz answer verification — correct answer never leaves server`

---

### PR 3-09 · Spelling Practice MCP Route
**Branch:** `feature/mcp-spelling`

- [ ] Create `/src/app/api/mcp/spelling/route.ts` — POST endpoint:
  - Auth: verify Firebase token BEFORE reading body
  - Rate limit: 30 per user per hour
  - Accepts: `{ sessionId: string, grade: GradeBand, topic: string, count: number }` (count: 3-5)
  - Returns grade-appropriate spelling words as clues only:
    `{ words: SpellingWord[] }`
  - `SpellingWord`: `{ clue: string, letterCount: number, hint: string }`
  - Stores actual words server-side: `quiz_sessions/{sessionId}/activeSpelling`
  - Actual words NEVER sent to browser
- [ ] Create `/src/app/api/mcp/spelling/verify/route.ts` — POST endpoint:
  - Auth: verify Firebase token BEFORE reading body
  - Rate limit: 60 per user per hour
  - Accepts: `{ sessionId: string, wordIndex: number, attempt: string }`
  - Case-insensitive comparison against stored word
  - Returns: `{ correct: boolean, feedback: string }` — no correct spelling in response
- [ ] Add types to `/src/types/api.ts`: `SpellingWord`, `SpellingRequest`, `SpellingResponse`
- [ ] Commit: `feat(mcp): add spelling practice mcp route — words stored server-side only`

---

### PR 3-10 · Wire MCP Tools Into Chat Router
**Branch:** `feature/mcp-reading-chat-trigger`

- [ ] Update `/src/app/api/chat/route.ts`:
  - Add reading quiz trigger detection (subject must be reading OR science):
    - Trigger phrases: "quiz", "give me a quiz", "test me", "reading quiz", "comprehension"
  - Add spelling trigger detection (any subject):
    - Trigger phrases: "spelling", "spell", "practice spelling", "spelling words", "spell a word"
  - When triggered: call the relevant MCP route, inject result into Claude's context
  - Claude presents the activity in character voice — child never sees raw JSON
  - Math trigger already exists — do NOT break it
- [ ] Test all three MCP triggers independently: math, reading quiz, spelling
- [ ] Commit: `feat(api): wire reading quiz and spelling triggers into chat router`

---

### PR 3-11 · Activity Buttons in Child UI
**Branch:** `feature/mcp-activity-buttons`

- [ ] Create `/src/components/child/ActivityButtons.tsx`:
  - Three buttons, shown above the chat input:
    - "Practice Problem 🔢" — visible only when `subject === 'math'`
    - "Reading Quiz 📖" — visible only when `subject === 'reading'` or `subject === 'science'`
    - "Spelling Practice ✏️" — visible for all subjects
  - Minimum 48px height, rounded-2xl, bright colors matching the child UI palette
  - Clicking a button inserts the trigger phrase into chat and auto-submits
    (routes through the existing chat flow — no separate handler needed)
  - Buttons hidden while `isChatLoading` is true (mascot is responding)
- [ ] Add `ActivityButtons` to `chat/page.tsx` — position above `ChatInput`
- [ ] Verify on 375px — buttons, input, and send button all fit without overlap
- [ ] Commit: `feat(child-ui): add activity buttons for quiz and spelling above chat input`

---

### PR 3-12 · Sprint 2 Test + Deploy
**Branch:** `dev`

- [ ] Reading quiz via button: click → verify passage + 3 questions appear in chat
  → answer one correctly, one wrongly → verify praise vs hint
- [ ] Spelling via button: click → verify clue + letter count appear
  → attempt correct and wrong → verify feedback
- [ ] Math problem: still works via chat phrase (no regression)
- [ ] All three chat phrase triggers work without buttons
- [ ] Open browser DevTools Network tab — verify answer / word never appears in any response
- [ ] Check Upstash dashboard — verify new rate limit buckets exist
- [ ] Run: `npx tsc --noEmit` — zero errors
- [ ] Run: `npm run build` — zero errors
- [ ] Deploy: `vercel --prod`
- [ ] Merge `dev` → `main`
- [ ] Commit: `chore: sprint 2 complete — reading quiz and spelling mcp tools live`

---

## Sprint 3 — Grades 2-3 + Science Curriculum Expansion
> Goal: RAG corpus expanded to grades 2-3 and Science K-3.
> Science subject button in child UI.
> Grade promotion when parent approves a cross-grade topic.
> The Shapes card, Math history, and all open sessions must survive untouched.

---

### PR 3-13 · Download + Organize New Source Documents
**Branch:** `feature/curriculum-sources-grades-2-3`

> Manual step outside Cursor. Set aside 30-45 minutes before writing code.

- [ ] Create local folders (gitignored — not committed):
  - `/rag-sources/math/grade-2/`
  - `/rag-sources/math/grade-3/`
  - `/rag-sources/reading/grade-2/`
  - `/rag-sources/reading/grade-3/`
  - `/rag-sources/science/k-1/`
  - `/rag-sources/science/grade-2/`
  - `/rag-sources/science/grade-3/`
- [ ] Download from CK-12 (ck12.org → filter by grade and subject, free PDFs):
  - 5-8 Grade 2 Math: addition/subtraction to 100, place value, intro fractions
  - 5-8 Grade 3 Math: multiplication, division, fractions, area and perimeter
  - 5-8 Grade 2 Reading/ELA: comprehension, context clues, compare/contrast, nonfiction
  - 5-8 Grade 3 Reading/ELA: inference, text evidence, literary devices, summary
- [ ] Download Science from CK-12 or Smithsonian Learning Lab (CC-licensed):
  - K-1 Science: living things, weather, human body, animals, plants, earth and sky
  - Grade 2-3 Science: same topics at increasing depth
- [ ] Confirm every file is CC-licensed or public domain before ingesting
- [ ] Update `/rag-sources/README.md` — list each new source with URL and license
- [ ] Commit: `docs(rag): add grade 2-3 and science source list with license confirmations`

---

### PR 3-14 · Update Science Topic Map
**Branch:** `feature/science-topic-map`

- [ ] Update `/src/constants/topicMap.ts`:
  - Replace the six science placeholder strings with real topic names per grade:
    - K: Living and non-living things, Types of weather, Parts of the body, Animal habitats, Plant parts, Sun moon and stars
    - 1: Plant and animal needs, Seasonal changes, The five senses, Animal life cycles, How plants grow, Earth and space
    - 2: Ecosystems, Weather patterns, Body systems, Adaptations, Photosynthesis, Landforms and water
    - 3: Food chains, Climate vs weather, Human body systems, Animal behavior, Plant reproduction, Earth's resources
- [ ] Verify topic format matches Math and Reading entries exactly
- [ ] Run: `npx tsc --noEmit` — zero errors
- [ ] Commit: `feat(constants): replace science placeholders with real k-3 topic names`

---

### PR 3-15 · Ingest Grades 2-3 Math + Reading Chunks
**Branch:** `feature/ingest-grades-2-3`

- [ ] Check current chunk count before ingesting: query Firestore `curriculum_chunks` count
- [ ] Run ingestion script on each new source folder:
  ```
  npx ts-node -P tsconfig.scripts.json scripts/rag/ingestDocuments.ts --subject math --grade 2
  npx ts-node -P tsconfig.scripts.json scripts/rag/ingestDocuments.ts --subject math --grade 3
  npx ts-node -P tsconfig.scripts.json scripts/rag/ingestDocuments.ts --subject reading --grade 2
  npx ts-node -P tsconfig.scripts.json scripts/rag/ingestDocuments.ts --subject reading --grade 3
  ```
- [ ] Verify new chunks in Firestore — check `subject` and `gradeBand` metadata correct
- [ ] Note new total chunk count (was 536 before this sprint)
- [ ] Spot-check 5 grade 2 chunks and 5 grade 3 chunks for quality and accuracy
- [ ] Deduplication check: re-running script must not create duplicate chunks
- [ ] Commit: `feat(rag): ingest grades 2-3 math and reading curriculum chunks`

---

### PR 3-16 · Ingest Science Chunks
**Branch:** `feature/ingest-science`

- [ ] Run ingestion on Science sources:
  ```
  npx ts-node -P tsconfig.scripts.json scripts/rag/ingestDocuments.ts --subject science --grade K
  npx ts-node -P tsconfig.scripts.json scripts/rag/ingestDocuments.ts --subject science --grade 1
  npx ts-node -P tsconfig.scripts.json scripts/rag/ingestDocuments.ts --subject science --grade 2
  npx ts-node -P tsconfig.scripts.json scripts/rag/ingestDocuments.ts --subject science --grade 3
  ```
- [ ] Verify science chunks in Firestore with `subject: 'science'` metadata
- [ ] Note final total chunk count after all Phase 2 ingestion
- [ ] Spot-check 5 science chunks across different grades
- [ ] Commit: `feat(rag): ingest science curriculum chunks for grades k-3`

---

### PR 3-17 · Science Subject — Types + Session Flow
**Branch:** `feature/science-subject-type`

- [ ] Add `'science'` to the subject union type in `/src/types/session.ts`
- [ ] Update `useSessionStore` — `subject` field now includes `'science'`
- [ ] Update `/src/app/api/session/start/route.ts`:
  - Handle `subject: 'science'` — create or read `learningPath/science`
  - Science path starts at grade K, first topic from updated science topic map
- [ ] Update `/src/app/api/chat/route.ts`:
  - Layer 3 (SUBJECT_CONTEXT) now has three branches: math / reading / science
  - Science context: guide Claude to relate concepts to the natural world at K-3 level
- [ ] Verify RAG retrieval correctly filters by `subject: 'science'`
- [ ] Run: `npx tsc --noEmit` — zero errors
- [ ] Commit: `feat(api): add science subject type and session flow`

---

### PR 3-18 · Science Subject Button in Child UI
**Branch:** `feature/science-subject-button`

- [ ] Add Science button to the subject picker in the child UI:
  - Label: "Science 🔬" (or a simple leaf/atom icon)
  - Minimum 48px height, rounded-2xl, matches existing button style
  - Position: alongside Math and Reading buttons
- [ ] Update subject picker to pass `'science'` to session start
- [ ] Verify subject picker looks correct on 375px with three options
- [ ] Commit: `feat(child-ui): add science subject button to subject picker`

---

### PR 3-19 · Grade Promotion on Approve
**Branch:** `feature/grade-promotion`

- [ ] Create `/src/lib/mcp/getTopicGrade.ts`:
  - `getTopicGrade(subject, topic)` → `GradeBand | null`
  - Searches `topicMap[subject]` across all grades to find which grade owns a topic
  - Returns null if topic not found (safe fallback)
- [ ] Update `/src/app/api/learning-path/approve/route.ts`:
  - After setting `currentTopic`, call `getTopicGrade(subject, approvedTopic)`
  - If the returned grade differs from `currentGrade`: update `currentGrade` in the same
    atomic Firestore write
  - Log grade promotion: `console.info('Grade promoted:', { from, to, subject, topic })`
  - Add `gradeChanged: boolean` and `newGrade?: GradeBand` to `ApproveResponse` type
- [ ] CRITICAL: Verify existing data is safe:
  - Approve of a same-grade topic must NOT change `currentGrade`
  - The Shapes card (same grade K as Counting to 20) must not trigger grade change
  - Test manually before deploying
- [ ] Commit: `feat(api): auto-promote grade on approve when topic crosses grade boundary`

---

### PR 3-20 · Grade + Subject Badge in Child UI
**Branch:** `feature/grade-subject-badge`

- [ ] Create `/src/components/child/GradeSubjectBadge.tsx`:
  - Displays current grade and subject as a read-only label
  - Grade display: `'K'` → "Kindergarten", `'1'` → "Grade 1", `'2'` → "Grade 2", `'3'` → "Grade 3"
  - Subject display: "Math", "Reading", "Science"
  - Example output: "Math · Kindergarten" or "Science · Grade 2"
  - Minimum 18px font, subtle styling — informational, not prominent
  - NOT a picker — read-only only
- [ ] Read `currentGrade` and `subject` from `useSessionStore`
- [ ] Add `GradeSubjectBadge` to `chat/page.tsx` — position below mascot avatar, above message list
- [ ] Verify on 375px — badge fits without crowding the layout
- [ ] Commit: `feat(child-ui): add read-only grade and subject badge to chat screen`

---

### PR 3-21 · Sprint 3 Test + Deploy
**Branch:** `dev`

- [ ] Science session: select Science → verify path created at K → chat 6 messages
  → verify evaluate fires → check Firestore for science mastery entry
- [ ] Grade 2 retrieval: temporarily set `currentGrade: '2'` in Firestore for test parent
  → start session → verify Claude uses 4-sentence, two-step responses → reset to K after
- [ ] Grade promotion: set up a test where approved topic is grade 2
  → call approve → verify `currentGrade` updated in Firestore
- [ ] Safety check: approve a same-grade topic → verify `currentGrade` unchanged
- [ ] CRITICAL: Verify in Firestore that:
  - Counting to 20 (current topic) — unchanged
  - Shapes suggestion — still present, `parentApproved: false` — unchanged
  - Old open sessions — still open, untouched
- [ ] Run: `npx tsc --noEmit` — zero errors
- [ ] Run: `npm run build` — zero errors
- [ ] Deploy: `vercel --prod`
- [ ] Merge `dev` → `main`
- [ ] Commit: `chore: sprint 3 complete — grades 2-3 and science live`

---

## Sprint 4 — Voice Input + ElevenLabs TTS
> Goal: Parent-controlled voice mode — off by default, opt-in with COPPA disclosure.
> Child speaks via Web Speech API. Mascot responds via ElevenLabs TTS.
> Each character has a distinct voice. API key stays server-side always.

---

### PR 3-22 · ElevenLabs Account + Voice Assignment
**Branch:** `feature/elevenlabs-setup`

> Manual setup step. Do this before writing any code.

- [ ] Create an ElevenLabs account at elevenlabs.io (free tier available)
- [ ] Browse the voice library — find one voice per character that fits personality:
  - Blip (robot, energetic): bright upbeat voice
  - Finn (fox, clever): warm, slightly playful
  - Zorro (dragon, brave): enthusiastic, encouraging
  - Luna (bunny, gentle): soft, calm
  - Pip (fairy, bubbly): light, excitable
  - Nova (owl, wise): measured, warm
  - [New boyish character]: match personality
  - [New girlish character]: match personality
- [ ] Copy each Voice ID from ElevenLabs → save in a private note (do NOT commit)
- [ ] Add `elevenlabsVoiceId: string` to `CharacterConfig` interface in `/src/types/character.ts`
- [ ] Fill in voice IDs for all 8 characters in `/src/constants/characters.ts`
- [ ] Add `ELEVENLABS_API_KEY=` to `.env.local` with your key
- [ ] Add `ELEVENLABS_API_KEY=` to `.env.example` (empty value)
- [ ] Run: `npx tsc --noEmit` — zero errors
- [ ] Commit: `feat(constants): add elevenlabs voice ids to all spark squad character configs`

---

### PR 3-23 · Voice Settings Firestore + Types
**Branch:** `feature/voice-settings-firestore`

- [ ] Add `VoiceSettings` interface to `/src/types/session.ts`:
  ```ts
  interface VoiceSettings {
    voiceEnabled: boolean;
    voiceConsentAt: Timestamp | null;  // when parent confirmed COPPA disclosure
    speechRate: number;                 // 0.8–1.2, default 1.0
  }
  ```
- [ ] Add Firestore helpers to `/src/lib/firebase/firestore.ts`:
  - `getVoiceSettings(parentUID)` → `VoiceSettings | null`
  - `updateVoiceSettings(parentUID, settings: Partial<VoiceSettings>)` → void
  - Document path: `users/{parentUID}/settings/voice`
- [ ] Add `voiceEnabled` boolean to `useChildStore`:
  - Populated from Firestore when parent dashboard loads
  - Defaults to `false` — voice off unless parent explicitly enabled it
- [ ] Run: `npx tsc --noEmit` — zero errors
- [ ] Commit: `feat(firebase): add voice settings document type and firestore helpers`

---

### PR 3-24 · Parent Voice Opt-In UI
**Branch:** `feature/parent-voice-settings`

- [ ] Create `/src/components/parent/VoiceSettingsCard.tsx`:
  - Shadcn `Card` with a `Switch` labeled "Voice mode"
  - Off by default — switch starts unchecked
  - When toggled ON: open a Shadcn `Dialog` before saving:
    - Title: "About voice mode"
    - Body: "Voice input uses your browser's built-in speech recognition (provided by your browser, e.g. Google Chrome or Apple Safari). Audio is processed by your browser's provider and is not recorded or stored by Spark Tutor. No voice data reaches our servers."
    - Buttons: "Enable voice mode" (saves + timestamps consent) and "Cancel" (reverts toggle)
  - When toggled OFF: disables immediately, no modal needed, clears `voiceConsentAt`
  - Current state shown clearly: "Voice is off" / "Voice is on — tap the mic to speak"
- [ ] Create `/src/app/api/settings/voice/route.ts` — POST endpoint:
  - Auth: verify Firebase token BEFORE reading body
  - Rate limit: 20 per user per hour
  - Accepts: `{ voiceEnabled: boolean, consentTimestamp?: string }`
  - When enabling: requires `consentTimestamp` to be present (proof modal was shown)
  - Saves to `users/{parentUID}/settings/voice`
- [ ] Add `VoiceSettingsCard` to parent dashboard below `LearningPathHistory`
- [ ] Commit: `feat(parent-ui): add voice opt-in card with coppa disclosure modal`

---

### PR 3-25 · ElevenLabs TTS API Route
**Branch:** `feature/elevenlabs-tts-route`

- [ ] Create `/src/app/api/tts/route.ts` — POST endpoint:
  - Auth: verify Firebase token BEFORE reading body
  - Auth step 2: verify `voiceSettings.voiceEnabled === true` in Firestore
    (server-side check — never trust client state alone)
  - Rate limit: 60 per user per hour (TTS costs money — protect it)
  - Accepts: `{ text: string, characterId: string }`
  - Server looks up `elevenlabsVoiceId` from character constants — never trust client to send voice ID
  - Sanitize text: strip HTML, markdown symbols, limit to 500 characters
  - Calls ElevenLabs API with voice ID and sanitized text
  - Streams audio back as `Content-Type: audio/mpeg`
  - ELEVENLABS_API_KEY never leaves the server
- [ ] Add `ELEVENLABS_API_KEY` to Vercel environment variables now
- [ ] Test with curl: verify audio blob returned, verify key not in any response header
- [ ] Commit: `feat(api): add elevenlabs tts route — key server-side, audio streamed to client`

---

### PR 3-26 · Web Speech API Input Hook
**Branch:** `feature/web-speech-input`

- [ ] Install types if needed: `npm install --save-dev @types/web`
- [ ] Create `/src/hooks/useSpeechInput.ts`:
  - Uses `window.SpeechRecognition || window.webkitSpeechRecognition`
  - Returns: `{ isListening, transcript, startListening, stopListening, isSupported, error }`
  - `isSupported`: false when browser lacks the API — mic button will hide
  - Language: `'en-US'`
  - Auto-stops after 8 seconds of silence (prevents infinite listening)
  - On final result: fires `onTranscript(transcript)` callback
  - On error: sets `error` state, logs to console, never shows browser error code to child
  - Comment in code: "Audio is processed by the browser's speech provider. Spark Tutor does not store voice data."
- [ ] Run: `npx tsc --noEmit` — zero errors
- [ ] Commit: `feat(hooks): add useSpeechInput hook wrapping web speech api`

---

### PR 3-27 · Microphone Button in Child UI
**Branch:** `feature/microphone-button`

- [ ] Create `/src/components/child/MicrophoneButton.tsx`:
  - Renders ONLY when `voiceEnabled === true` in `useChildStore`
  - When `isSupported === false`: renders nothing (no error shown to child)
  - Large circular button, minimum 56px, sits left of Send button
  - Three visual states:
    - Idle: microphone icon, character's accent color
    - Listening: pulsing red ring animation, "Listening..." label
    - Processing: spinner
  - On tap: calls `startListening()`
  - When transcript arrives: sets chat input value + auto-submits (same as typing)
  - `aria-label="Speak your answer"`, `aria-pressed` reflects listening state
- [ ] Update `ChatInput.tsx` to render `MicrophoneButton` alongside Send button
- [ ] Verify: when voice is OFF (default) — mic button completely absent, layout unchanged
- [ ] Verify on 375px: mic + send buttons fit without overlap
- [ ] Commit: `feat(child-ui): add microphone button — renders only when voice is enabled`

---

### PR 3-28 · TTS Playback After Mascot Response
**Branch:** `feature/tts-playback`

- [ ] Create `/src/hooks/useTTSPlayback.ts`:
  - `playTTS(text: string, characterId: string)` — fetches `/api/tts`, plays audio blob
  - `stopTTS()` — stops current playback
  - `isPlaying: boolean` — true while audio is playing
  - Pre-process text before sending: strip markdown (`**bold**`, `*italic*`), strip emoji,
    strip `[STAR EARNED]` tokens, trim to 500 chars
  - On error: logs silently — chat continues uninterrupted, no child-facing error
  - Prevents overlap: stop current audio before starting new playback
- [ ] Update `chat/page.tsx`:
  - After each complete mascot message (stream done), call `playTTS` if `voiceEnabled`
  - Pass `characterId` from `useChildStore`
- [ ] Update `MascotAvatar.tsx` (or `AnimatedAvatar.tsx`):
  - If `isPlaying`: show subtle pulsing border on avatar (speaking indicator)
  - Tapping avatar while speaking: calls `stopTTS()`
- [ ] Commit: `feat(child-ui): add tts playback after mascot responses via elevenlabs`

---

### PR 3-29 · Voice Mode End-to-End Test
**Branch:** `feature/voice-e2e-test`

- [ ] Parent dashboard:
  - [ ] Toggle voice ON → verify COPPA disclosure modal appears
  - [ ] Click "Enable voice mode" → verify toggle stays on, Firestore updated with `voiceConsentAt`
  - [ ] Toggle voice OFF → verify Firestore updated, no modal
- [ ] Child UI with voice ON:
  - [ ] Verify microphone button appears
  - [ ] Tap mic → speak a short phrase → verify transcript populates chat input → verify auto-submit
  - [ ] Verify mascot responds → verify audio plays in character's voice
  - [ ] Tap mascot avatar while speaking → verify audio stops
- [ ] Child UI with voice OFF (default):
  - [ ] Verify ZERO change to text-only experience — no mic button, no audio
- [ ] Browser that doesn't support Web Speech API:
  - [ ] Verify mic button is hidden, no error shown to child
- [ ] Security checks via DevTools:
  - [ ] Verify `ELEVENLABS_API_KEY` never appears in any Network request or response
  - [ ] Verify `/api/tts` returns 401 if called without auth token
  - [ ] Verify `/api/tts` returns 403 if voice is disabled for that parent
- [ ] Commit: `test: voice mode end-to-end test pass`

---

### PR 3-30 · Sprint 4 Deploy + Phase 2 README
**Branch:** `dev`

- [ ] Run: `npx tsc --noEmit` — zero errors
- [ ] Run: `npx eslint src/ --ext .ts,.tsx` — zero warnings
- [ ] Run: `npm run build` — zero errors
- [ ] Add `ELEVENLABS_API_KEY` to Vercel environment variable settings (if not already added)
- [ ] Deploy: `vercel --prod`
- [ ] Smoke test live URL:
  - New character select screen (8 cards)
  - Reading quiz button → quiz appears
  - Science subject → session starts
  - Voice opt-in → mic appears → speech → mascot speaks back
- [ ] Update `README.md`:
  - Add Spark Squad section with all 8 characters
  - Add voice section: Web Speech API + ElevenLabs TTS
  - Add Science subject
  - Update grades to K-3
  - Add new MCP tools (reading quiz, spelling practice)
  - Update portfolio talking points with Phase 2 patterns
- [ ] Update `CLAUDE.md`:
  - Add ElevenLabs to stack + voice settings Firestore path
  - Add Web Speech API note: browser-side processing, not stored by Spark Tutor
  - Add new MCP routes with their rate limits
  - Add 8 characters to Spark Squad list
- [ ] Merge `dev` → `main`
- [ ] Commit: `chore: phase 2 complete — voice, science, grades 2-3, new characters, new mcp tools live`

---

## Phase 2 Completion Checklist

### Pre-work
- [x] PR 2-28 complete — README and CLAUDE.md describe v2 Phase 1 accurately
- [ ] `ROADMAP-v2_1.md` Sprint 4 overview and Phase 1 checklist fully checked

### Sprint 1 — Characters
- [ ] 2 new characters with full constants including `elevenlabsVoiceId`
- [ ] SVG avatar for each — recognizable at 48px and 96px
- [ ] All 3 animations: idle, thinking, celebrate
- [x] Character select grid works on 375px with 8 cards
- [ ] New character voice prompts match personality in actual chat

### Sprint 2 — MCP Tools
- [ ] Reading quiz: passage + questions generated, correct answer indexes server-side only
- [ ] Spelling practice: clue + letter count only, actual word server-side only
- [ ] Both trigger via chat phrase AND activity button
- [ ] Math problem tool regression-free
- [ ] All new routes: auth before body, rate limit, no answer in response

### Sprint 3 — Curriculum
- [ ] Grades 2-3 Math + Reading chunks ingested (CK-12/EngageNY)
- [ ] Science K-3 chunks ingested
- [ ] Science topic map has real topic names (no placeholders)
- [ ] Science subject button in child UI
- [ ] Grade promotion on approve when topic crosses grade boundary
- [ ] Same-grade approve does NOT change `currentGrade`
- [ ] Read-only grade/subject badge in child UI
- [ ] Existing data untouched: Counting to 20 topic, Shapes suggestion, old open sessions

### Sprint 4 — Voice
- [ ] Voice OFF by default — text-only experience identical to Phase 1
- [ ] Parent opt-in toggle with COPPA disclosure modal
- [ ] Consent timestamp stored in Firestore
- [ ] Mic button appears only when voice enabled
- [ ] Web Speech API: transcript auto-submits to chat
- [ ] ElevenLabs TTS plays after each mascot response
- [ ] Each character has distinct voice via ElevenLabs voice ID
- [ ] Tap mascot avatar stops TTS playback
- [ ] `ELEVENLABS_API_KEY` never in browser — TTS route server-side only
- [ ] Graceful fallback: mic hidden on unsupported browser, TTS error silent

### Quality Gates
- [ ] Zero TypeScript errors
- [ ] Zero ESLint warnings
- [ ] All new routes: auth before body read, rate limit before AI call
- [ ] Components under 200 lines, files under 500 lines
- [ ] No modifications to `src/components/ui/`
- [ ] Mobile tested end-to-end at 375px
- [ ] README and CLAUDE.md updated and accurate for Phase 2

---

## Coming in Phase 3 (future planning)
- Sibling profiles: multiple children under one parent account, switchable from dashboard
- Teacher dashboard: classroom mode, multiple student tracking
- Streak tracking and achievement badges
- Freemium model: free base tier, paid Science + voice upgrades

---

*Spark Tutor Phase 2 | Next.js · Firebase · Claude · Gemini · ElevenLabs · Tailwind · Vercel*
