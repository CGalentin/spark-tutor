# Spark Tutor — Project Roadmap
# K-1 AI Tutoring App | MVP Build Sprint
# Updated: June 2026

> **How to use this roadmap**
> Each PR is a focused 15-minute task with one clear goal.
> Check off tasks as you complete them. Commit after every PR.
> Branch: work on `dev`, merge to `main` only at the end of each week.

---

## Progress Overview

- [x] Week 1 — Foundation & Chat UI ✅
- [x] Week 2 — RAG Layer ✅
- [ ] Week 3 — Parent Layer & Agentic Summary
- [ ] Week 4 — MCP Tool & Polish

---

## Week 1 — Foundation & Chat UI
> Goal: A child can pick a character, name it, and have a basic AI conversation by end of week.

---

### PR 1-01 · Project Scaffold ✅
**Branch:** `feature/project-scaffold`

- [x] Run `npx create-next-app@latest spark-tutor --typescript --tailwind --eslint --app --src-dir`
- [x] Copy `.cursorrules` into project root
- [x] Copy `ROADMAP.md` into project root
- [x] Verify dev server runs: `npm run dev`
- [x] Commit: `chore: scaffold next.js project with typescript and tailwind`

---

### PR 1-02 · Folder Structure ✅
**Branch:** `feature/folder-structure`

- [x] Create `/src/components/child/` folder (add `.gitkeep`)
- [x] Create `/src/components/parent/` folder (add `.gitkeep`)
- [x] Create `/src/components/shared/` folder (add `.gitkeep`)
- [x] Create `/src/lib/firebase/` folder (add `.gitkeep`)
- [x] Create `/src/lib/claude/` folder (add `.gitkeep`)
- [x] Create `/src/lib/gemini/` folder (add `.gitkeep`)
- [x] Create `/src/store/` folder (add `.gitkeep`)
- [x] Create `/src/types/` folder (add `.gitkeep`)
- [x] Create `/src/constants/` folder (add `.gitkeep`)
- [x] Create `/src/hooks/` folder (add `.gitkeep`)
- [x] Commit: `chore: create project folder structure`

---

### PR 1-03 · Install Dependencies ✅
**Branch:** `feature/dependencies`

- [x] Install Firebase: `npm install firebase firebase-admin`
- [x] Install Anthropic SDK: `npm install @anthropic-ai/sdk`
- [x] Install Google Generative AI: `npm install @google/generative-ai`
- [x] Install Zustand: `npm install zustand`
- [x] Install Shadcn UI: `npx shadcn@latest init` (choose Default style, Zinc base color)
- [x] Install Shadcn components: `npx shadcn@latest add card badge button input`
- [x] Install utility: `npm install clsx tailwind-merge`
- [x] Verify no TypeScript errors: `npx tsc --noEmit`
- [x] Commit: `chore: install project dependencies`

---

### PR 1-04 · Environment Variables ✅
**Branch:** `feature/env-setup`

- [x] Create `.env.local` in project root (never commit this file)
- [x] Add to `.env.local`:
  ```
  # Firebase Client (NEXT_PUBLIC prefix = safe for browser)
  NEXT_PUBLIC_FIREBASE_API_KEY=
  NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
  NEXT_PUBLIC_FIREBASE_PROJECT_ID=
  NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
  NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
  NEXT_PUBLIC_FIREBASE_APP_ID=

  # Firebase Admin (server-side only — no NEXT_PUBLIC prefix)
  FIREBASE_ADMIN_PROJECT_ID=
  FIREBASE_ADMIN_CLIENT_EMAIL=
  FIREBASE_ADMIN_PRIVATE_KEY=

  # AI APIs (server-side only)
  ANTHROPIC_API_KEY=
  GEMINI_API_KEY=
  ```
- [x] Create `.env.example` with the same keys but empty values
- [x] Verify `.env.local` is listed in `.gitignore`
- [x] Commit: `chore: add env example file and gitignore check`

---

### PR 1-05 · Firebase Client Setup ✅
**Branch:** `feature/firebase-client`

- [x] Create `/src/lib/firebase/config.ts` — Firebase client initialization
- [x] Create `/src/lib/firebase/auth.ts` — Auth helper functions (signIn, signOut, onAuthChange)
- [x] Create `/src/lib/firebase/firestore.ts` — Firestore helper functions (getSession, saveSummary)
- [x] Fill in your Firebase project credentials in `.env.local`
- [x] Verify TypeScript compiles: `npx tsc --noEmit`
- [x] Commit: `feat(firebase): add firebase client config and auth helpers`

---

### PR 1-06 · Shared Types ✅
**Branch:** `feature/shared-types`

- [x] Create `/src/types/character.ts` — CharacterConfig, CharacterVoice types
- [x] Create `/src/types/session.ts` — Session, SessionSummary, Message types
- [x] Create `/src/types/api.ts` — ApiResult<T> type, ChatRequest, ChatResponse types
- [x] Create `/src/types/index.ts` — re-export all types from one place
- [x] Verify TypeScript compiles: `npx tsc --noEmit`
- [x] Commit: `feat(types): add shared typescript types for characters, sessions, and api`

---

### PR 1-07 · Character Constants ✅
**Branch:** `feature/character-constants`

- [x] Create `/src/constants/characters.ts`
- [x] Define all 6 Spark Squad characters with:
  - `id`, `name` (default), `type` (animal/robot/fantasy)
  - `emoji` (placeholder until art is ready)
  - `colors` (primary bg color, accent color — Tailwind class names)
  - `voicePrompt` (the character personality paragraph for Claude system prompt)
- [x] Create `/src/constants/subjects.ts` — subject and grade band constants
- [x] Create `/src/constants/prompts.ts` — BASE_TUTOR_RULES string
- [x] Commit: `feat(constants): add spark squad character definitions and base prompt rules`

---

### PR 1-08 · Zustand Stores ✅
**Branch:** `feature/zustand-stores`

- [x] Create `/src/store/useChildStore.ts` — character selection, character name
- [x] Create `/src/store/useSessionStore.ts` — sessionId, subject, starsEarned, messageCount
- [x] Create `/src/store/useAuthStore.ts` — parentUID, isAuthenticated
- [x] Verify all stores are fully typed with TypeScript interfaces
- [x] Commit: `feat(store): add zustand stores for child, session, and auth state`

---

### PR 1-09 · Auth Layout & Login Page ✅
**Branch:** `feature/auth-pages`

- [x] Create `/src/app/(auth)/layout.tsx` — centered card layout with Spark Tutor branding + privacy footer
- [x] Create `/src/app/(auth)/login/page.tsx` — thin server page wrapping `LoginForm`
- [x] Create `/src/app/(auth)/signup/page.tsx` — thin server page wrapping `SignupForm`
- [x] Create `/src/components/parent/LoginForm.tsx` — Firebase signIn, Shadcn Card/Input/Button, friendly error messages
- [x] Create `/src/components/parent/SignupForm.tsx` — Firebase signUp, confirm password validation, friendly errors
- [x] Update `src/app/page.tsx` — strip Next.js boilerplate, redirect root → `/login`
- [x] Update `src/app/layout.tsx` — set app metadata (title: "Spark Tutor")
- [x] Use Shadcn `Card`, `Input`, `Button` components
- [x] Wire up Firebase Auth signIn and createUser functions
- [x] Verify TypeScript compiles: `npx tsc --noEmit` — zero errors
- [x] Commit: `feat(auth): add auth layout, login and signup pages (PR 1-09)`

---

### PR 1-10 · Auth Provider & Route Protection ✅
**Branch:** `feature/auth-provider`

- [x] Create `/src/components/shared/AuthProvider.tsx` — Firebase onAuthStateChanged listener, hydrates useAuthStore
- [x] Create `/src/components/shared/AuthRouteGuard.tsx` — redirects authenticated parents away from /login and /signup
- [x] Create `/src/components/shared/LoadingSpinner.tsx` — reusable full-screen loading spinner
- [x] Add AuthProvider to `/src/app/layout.tsx` — wraps all routes
- [x] Create `/src/hooks/useAuth.ts` — reads auth state from useAuthStore with individual selectors
- [x] Create `/src/app/(parent)/layout.tsx` — protected layout, redirects unauthenticated users to /login
- [x] Update `/src/app/(auth)/layout.tsx` — wraps children in AuthRouteGuard
- [x] Verify TypeScript compiles: `npx tsc --noEmit` — zero errors
- [x] Commit: `feat(auth): add auth provider and protected route logic (PR 1-10)`

---

### PR 1-11 · Character Selection Screen ✅
**Branch:** `feature/character-selection`

- [x] Create `/src/app/(child)/character-select/page.tsx` — client page, wired to useChildStore, navigates to /chat on confirm
- [x] Create `/src/components/child/CharacterCard.tsx` — emoji, character name, primary color bg, selection ring, 120px min tap target
- [x] Create `/src/components/child/CharacterGrid.tsx` — 2-column grid of all 6 CharacterCards
- [x] Create `/src/components/child/CharacterNameInput.tsx` — large name input + "Let's Go! 🚀" button, disabled until name entered
- [x] Wire selection and name to `useChildStore`
- [x] Verify TypeScript compiles: `npx tsc --noEmit` — zero errors
- [x] Commit: `feat(child-ui): add character selection screen with spark squad grid (PR 1-11)`

---

### PR 1-12 · Claude API Route ✅
**Branch:** `feature/claude-api`

- [x] Create `/src/lib/firebase/admin.ts` — Firebase Admin SDK init, exports `adminAuth` for token verification
- [x] Create `/src/lib/claude/client.ts` — Anthropic SDK singleton (`getAnthropicClient()`)
- [x] Create `/src/lib/claude/buildSystemPrompt.ts` — 3-layer composer: BASE_TUTOR_RULES + CHARACTER_VOICE + SUBJECT_CONTEXT (RAG slot ready for PR 2-05)
- [x] Create `/src/app/api/chat/route.ts` — POST endpoint: verifies Firebase token, streams Claude via SSE (`delta`/`done`/`error` events), detects `[STAR EARNED]`
- [x] Model: `claude-3-5-haiku-20241022`, `max_tokens: 300`, `temperature: 0.7`
- [x] Verify TypeScript compiles: `npx tsc --noEmit` — zero errors
- [x] Commit: `feat(api): add claude chat endpoint with composable system prompt (PR 1-12)`

---

### PR 1-13 · Chat UI — Message Bubbles ✅
**Branch:** `feature/chat-bubbles`

- [x] Create `/src/components/child/MascotAvatar.tsx` — emoji circle (character primary color), custom mascot name, accent color tag
- [x] Create `/src/components/child/ChatBubble.tsx` — child (right, slate-100) and mascot (left, character color) variants; strips `[STAR EARNED]` from display text
- [x] Create `/src/components/child/ChatMessageList.tsx` — scrollable flex column, auto-scroll on new messages, bouncing 3-dot typing indicator
- [x] Add `@keyframes bounce` to `globals.css` for the typing indicator dots
- [x] Style: 18px+ text, rounded-3xl bubbles, 80% max-width
- [x] Verify TypeScript compiles: `npx tsc --noEmit` — zero errors
- [x] Commit: `feat(child-ui): add chat bubble and message list components (PR 1-13)`

---

### PR 1-14 · Chat UI — Input & Session ✅
**Branch:** `feature/chat-input`

- [x] Create `/src/components/child/ChatInput.tsx` — large text input with Send button (48px touch target)
- [x] Create `/src/app/(child)/chat/page.tsx` — assembles MascotAvatar + ChatMessageList + ChatInput
- [x] Wire ChatInput to POST `/api/chat` and stream response into ChatMessageList
- [x] Show typing indicator while mascot is responding
- [x] Commit: `feat(child-ui): add chat input and wire up full conversation flow`

---

### PR 1-15 · Week 1 Integration Test & Deploy ✅
**Branch:** `dev` (merge all Week 1 features)

- [x] End-to-end test: sign up → select character → name it → have a 5-message conversation ✅ (chat unblocked Jun 15 after BUG 3 fix)
- [x] Verify mascot responds in character voice (Socratic, K-1 language) ✅
- [x] Verify no TypeScript errors: `npx tsc --noEmit` — zero errors confirmed Jun 15
- [x] Verify no console errors in browser ✅
- [x] Deploy to Vercel: `vercel --prod` — fresh production deploy Jun 15, all 10 routes building clean
- [x] Merge `dev` → `main`
- [x] Commit: `chore: week 1 complete — foundation and chat ui live`

---

### Hotfix 1 · Placeholder Dashboard Page ✅
**Branch:** `dev` → merged to `main`

- [x] Create `/src/app/(parent)/dashboard/page.tsx` — protected placeholder with sign-out + "Start Session" button
- [x] Fixes 404 on `/dashboard` — login redirect was broken since Week 1 deploy
- [x] Commit: `fix(parent-ui): add placeholder dashboard page so login redirect has a valid landing`

---

### Hotfix 2 · Firebase Admin ESM Crash ✅
**Branch:** `dev` → merged to `main`

- [x] Add `serverExternalPackages: ['firebase-admin']` to `next.config.ts`
- [x] Downgrade `firebase-admin@14` → `firebase-admin@12` — fixes `ERR_REQUIRE_ESM` caused by `jwks-rsa@4` trying to `require()` the ESM-only `jose@6` in Vercel serverless functions
- [x] Commit: `fix(api): downgrade firebase-admin to v12 to resolve ERR_REQUIRE_ESM from jose@6 in jwks-rsa`

---

### BUG 3 · Deprecated Claude Model ✅ FIXED Jun 15
**File:** `src/app/api/chat/route.ts`

- [x] Model `claude-3-5-haiku-20241022` is retired (EOL was Feb 19, 2026) — Anthropic API rejects all chat requests
- [x] Updated model name to `claude-haiku-4-5-20251001` (current fast/cheap Haiku tier as of Jun 2026)
- [x] Verify chat works end-to-end after model update
- [x] Re-run full PR 1-15 test checklist — all passing
- [x] Deployed fix to Vercel production — `fix(api): update Claude model to claude-haiku-4-5-20251001`

---

### BUG 4 · Anthropic API Out of Credits ✅ FIXED Jun 15

- [x] Root cause: Anthropic account credit balance was $0 — API returned 400 on every chat request
- [x] Fix: Added credits via Anthropic Console → Plans & Billing
- [x] No code changes required

---

### BUG 5 · Child Chat Bubbles Off-Screen ✅ FIXED Jun 15
**Files:** `src/components/child/ChatBubble.tsx`, `src/components/child/ChatMessageList.tsx`

- [x] Root cause: `justify-end` in a flex container referenced a parent width wider than the viewport (body `flex flex-col` without constrained width)
- [x] Fix: Removed full-width wrapper div; bubble is now a direct flex item of the `flex-col` list using `self-center` for child messages and `self-start` for mascot messages — no parent-width dependency
- [x] Child bubble restyled with soft violet-to-indigo gradient + shadow to visually distinguish from mascot bubbles
- [x] Deployed — chat fully functional, all bubbles visible

---

## Week 2 — RAG Layer
> Goal: Mascot answers are grounded in real K-1 curriculum from vetted OER sources.

---

### PR 2-01 · Collect Source Documents ✅
**Branch:** `feature/rag-source-docs`

- [x] Download 9 K-1 Math documents — EngageNY (archive.org) instead of CK-12 (CK-12 PDFs require account login; EngageNY is the same CC-licensed OER standard)
- [x] Download 8 K-1 Reading/ELA documents from EngageNY/CKLA (archive.org)
- [x] Download Common Core K-1 standards PDF (Math + ELA — direct from corestandards.org)
- [x] All files saved to `/rag-sources/math/` and `/rag-sources/reading/` (local only, gitignored)
- [x] Created `/rag-sources/README.md` — lists all 17 sources with URLs, descriptions, and CC license confirmation; includes PowerShell re-download commands
- [x] `.gitignore` updated: excludes `*.pdf`, `*.zip`, `*.docx` in rag-sources; README committed
- [x] Commit: `docs(rag): add rag sources readme with license list`

---

### PR 2-02 · Firebase Vector Search Setup ✅
**Branch:** `feature/vector-search-setup`

- [x] Skipped Firebase Vector Search extension — using in-memory cosine similarity instead (corpus is <1 000 chunks; no index configuration required; can upgrade to Firestore findNearest() later)
- [x] `curriculum_chunks` Firestore collection will be created on first write (no manual console setup needed)
- [x] Created `src/types/rag.ts` — `CurriculumChunk`, `RankedChunk`, `GradeBand` types; exported from `src/types/index.ts`
- [x] Created `src/lib/firebase/vectorSearch.ts` — `saveChunk()`, `chunkExists()`, `queryByEmbedding()` (cosine similarity), `countChunks()` — all server-side only
- [x] Commit: `feat(rag): set up firebase vector search collection and query helper`

---

### PR 2-03 · Document Chunking Utility ✅
**Branch:** `feature/doc-chunking`

- [x] Installed `pdf-parse@1.1.1` (pinned to v1 — v2 changed the API entirely) + `ts-node` as devDependencies
- [x] Created `tsconfig.scripts.json` — CommonJS module resolution for ts-node scripts outside the Next.js bundler
- [x] Created `scripts/rag/chunkDocument.ts` — `extractTextFromPdf()`, `splitIntoChunks()`, `chunkDocument()`, CLI entry point
- [x] Each chunk includes metadata: `{ subject, gradeBand, topic, source, chunkIndex, createdAt }`
- [x] Tested on Math PDF: 156 chunks, avg 308 words ✅
- [x] Tested on Reading PDF: 4 chunks, avg 274 words ✅ (low count expected — IC PDFs are image-heavy)
- [x] Commit: `feat(rag): add document chunking utility with metadata tagging`

---

### PR 2-04 · Gemini Embedding Setup ✅
**Branch:** `feature/gemini-embeddings`

- [x] Create `/src/lib/gemini/client.ts` — Google Generative AI SDK initialization
- [x] Create `/src/lib/gemini/embed.ts` — function that takes text, returns embedding vector
- [x] Tested embedding one chunk — vector length is **3072** (not 768 — `text-embedding-004` is retired; using `gemini-embedding-001`)
- [x] Created `scripts/rag/testEmbed.ts` — smoke test confirming vector length ✅
- [x] Commit: `feat(rag): add gemini embedding client and embed function`

---

### PR 2-05 · Document Ingestion Script ✅
**Branch:** `feature/ingestion-script`

- [x] Created `/scripts/rag/ingestDocuments.ts` — full ingestion pipeline with source manifest:
  - Reads all PDFs from `/rag-sources/` via hardcoded manifest (subject + grade + topic per file)
  - Chunks each document via `chunkDocument()`
  - Embeds each chunk with `embedText()` (Gemini)
  - Saves chunk + embedding + metadata to Firestore `curriculum_chunks`
- [x] Deduplication via `chunkExists()` — safe to re-run without duplicating data
- [x] Run on Math sources: **202 chunks saved** to Firestore ✅
- [x] Commit: `feat(rag): add document ingestion script with deduplication check`

---

### PR 2-06 · Ingest Reading Sources ✅
**Branch:** `feature/ingest-reading`

- [x] Run ingestion script on Reading/ELA sources: **334 chunks saved** to Firestore ✅
- [x] All chunks have correct `subject: 'reading'` metadata
- [x] Total corpus: **536 chunks** (202 math + 334 reading) in `curriculum_chunks` collection
- [x] Commit: `feat(rag): ingest k-1 reading and ela curriculum chunks`

---

### PR 2-07 · RAG Retrieval API Route ✅
**Branch:** `feature/rag-retrieval`

- [x] Created `/src/app/api/rag/route.ts` — POST endpoint:
  - Takes `{ query: string, subject: string }`
  - Embeds query with Gemini (`embedText()`)
  - Queries Firestore `curriculum_chunks` via in-memory cosine similarity (`queryByEmbedding()`)
  - Filters by `subject` metadata; returns top-3 chunks as plain text
- [x] Added `RagRequest`, `RagResponse` types to `src/types/api.ts`; exported from `src/types/index.ts`
- [x] Commit: `feat(rag): add rag retrieval api route with subject filtering`

---

### PR 2-08 · Wire RAG Into Chat ✅
**Branch:** `feature/rag-in-chat`

- [x] Updated `/src/app/api/chat/route.ts`:
  - Before calling Claude, calls `embedText()` on the child message then `queryByEmbedding()` directly (server-to-server function call — no HTTP round-trip to `/api/rag`)
  - Injects returned chunks into Layer 4 of the system prompt via `buildSystemPrompt({ ragContext })`
  - Graceful fallback: RAG errors are caught silently; chat continues without curriculum context
- [x] Commit: `feat(rag): inject retrieved curriculum chunks into claude system prompt`

---

### PR 2-09 · RAG Quality Check ✅
**Branch:** `feature/rag-quality`

- [x] Created `/scripts/rag/testRetrieval.ts` — runs 10 sample K-1 questions through full embed → query pipeline
- [x] Logs retrieved chunk topic, source filename, and similarity score for each question
- [x] Result: **10/10 passed** — all retrievals returned relevant curriculum content ✅
- [x] Similarity scores: 0.66–0.75; correct topic labels and source files surfaced every time
- [x] No chunk size or metadata adjustments needed
- [x] Commit: `test(rag): add retrieval quality test script with sample questions`

---

### PR 2-10 · Week 2 Integration Test & Deploy ✅
**Branch:** `dev`

- [x] Run TypeScript check: `npx tsc --noEmit` — zero errors ✅
- [x] Production build: `npm run build` — zero errors, 9 routes building clean (incl. `/api/rag`) ✅
- [x] Deploy to Vercel: `vercel --prod` — live at https://spark-tutor-app.vercel.app ✅
- [x] Merge `dev` → `main` ✅
- [x] Commit: `chore: week 2 complete — rag layer live`

---

## Week 3 — Parent Layer & Agentic Summary
> Goal: Parent can log in and see an automatic summary of every session their child had.

---

### PR 3-01 · Firebase Admin Setup ✅
**Branch:** `feature/firebase-admin`

- [x] `admin.ts` already existed from PR 1-12 — added `adminDb` (Admin Firestore) export
- [x] `verifyAuthToken(authHeader)` helper added — extracts Bearer token, calls `adminAuth.verifyIdToken()`, returns uid
- [x] Commit: `feat(firebase): add verifyAuthToken helper to firebase admin module`

---

### PR 3-02 · Session Tracking — Start ✅
**Branch:** `feature/session-start`

- [x] Created `/src/app/api/session/start/route.ts` — verifies token, creates Firestore session doc, returns `sessionId`
- [x] Added `SessionStartRequest`, `SessionStartResponse`, `SessionEndRequest`, `SessionEndResponse` types to `api.ts`
- [x] Updated `chat/page.tsx` `handleSubjectSelect` — calls `/api/session/start` to get real Firestore ID, falls back to local ID on failure
- [x] Commit: `feat(api): add session start endpoint and wire to chat subject selection`

---

### PR 3-03 · Session Tracking — Messages ✅
**Branch:** `feature/session-messages`

- [x] Refactored `/api/chat` to use `verifyAuthToken` helper (replaces inline token verification)
- [x] After each AI response: increments `messageCount` in Firestore via `FieldValue.increment(1)`
- [x] `sessionId` accepted from request body; Firestore write is non-fatal (chat continues on failure)
- [x] Commit: `feat(api): refactor chat to use verifyAuthToken and increment session message count`

---

### PR 3-04 · Stars Logic ✅
**Branch:** `feature/stars-logic`

- [x] Created `src/hooks/useStars.ts` — `awardStar()` updates local store + calls `/api/session/star` to sync Firestore
- [x] Created `/src/app/api/session/star/route.ts` — increments `starsEarned` via `FieldValue.increment(1)`
- [x] Created `src/components/child/StarBurst.tsx` — full-screen overlay with CSS keyframe pop animation
- [x] Chat page wired to `useStars` — `awardStar()` called on `[STAR EARNED]`, `StarBurst` triggered
- [x] Commit: `feat(child-ui): add star awarding logic with starburst animation and firestore sync`

---

### PR 3-05 · Progress Bar ✅
**Branch:** `feature/progress-bar`

- [x] Created `src/components/child/SessionProgressBar.tsx` — gradient bar, fills over 10 messages, shows star badge
- [x] Added above message list in chat page (below header, above `ChatMessageList`)
- [x] Commit: `feat(child-ui): add session progress bar with star count display`

---

### PR 3-06 · Session End Flow ✅
**Branch:** `feature/session-end`

- [x] Created `src/components/child/EndSessionButton.tsx` — "All Done! 🎉" button, min 48px touch target
- [x] Created `src/components/child/WellDoneScreen.tsx` — full-screen celebration with stars earned
- [x] Created `/src/app/api/session/end/route.ts` — writes `endedAt` + final star/message counts; triggers `/api/summary` fire-and-forget
- [x] `handleEndSession` in `chat/page.tsx` — calls `/api/session/end` with messages, shows `WellDoneScreen`
- [x] Commit: `feat(api): add session end endpoint, end session button, and well-done screen`

---

### PR 3-07 · Agentic Summary — Claude Call ✅
**Branch:** `feature/agentic-summary`

- [x] Created `src/lib/claude/buildSummaryPrompt.ts` — formats session transcript as Claude user message
- [x] Created `/src/app/api/summary/route.ts` — verifies token, fetches session, sends transcript to Claude, parses JSON response
- [x] Falls back to generic summary if Claude returns unexpected format
- [x] Commit: `feat(api): add agentic session summary claude endpoint with buildSummaryPrompt`

---

### PR 3-08 · Save Summary to Firestore ✅
**Branch:** `feature/save-summary`

- [x] Summary saved as nested field `session.summary` (matches `Session` type's `summary?: SessionSummary`)
- [x] Fields saved: `topicsCovered[]`, `areasForPractice[]`, `encouragementNote`, `generatedAt: Timestamp.now()`
- [x] Updated `firestore.ts` — replaced `saveSummary()` with `subscribeToSessions()` using `onSnapshot` for real-time dashboard
- [x] Commit: `feat(api): save agentic session summary to firestore as nested session field`

---

### PR 3-09 · Parent Dashboard Layout ✅
**Branch:** `feature/parent-dashboard`

- [x] Created `src/components/parent/DashboardHeader.tsx` — welcome message, parent email, Start Session CTA
- [x] Updated `/src/app/(parent)/layout.tsx` — added nav bar (Dashboard | Sign Out) above page content
- [x] Updated `/src/app/(parent)/dashboard/page.tsx` — real layout with `DashboardHeader` + Shadcn `Card`
- [x] Commit: `feat(parent-ui): add parent dashboard layout with nav bar and DashboardHeader`

---

### PR 3-10 · Session Summary Card ✅
**Branch:** `feature/summary-card`

- [x] Created `src/hooks/useSessionHistory.ts` — `onSnapshot` subscription with cleanup, loading/error states
- [x] Created `src/components/parent/SessionSummaryCard.tsx` — Shadcn `Card` + `Badge`; shows date, subject, stars, topics, encouragement
- [x] Updated `dashboard/page.tsx` — renders live session list via `useSessionHistory`; shows "generating" state if summary not yet ready
- [x] Commit: `feat(parent-ui): add session summary card and session history hook with onSnapshot`

---

### PR 3-11 · Week 3 Integration Test & Deploy ✅
**Branch:** `dev`

- [x] `npx tsc --noEmit` — zero errors ✅
- [x] `npm run build` — zero errors, 13 routes building (6 new API routes) ✅
- [x] Deploy to Vercel production: https://spark-tutor-app.vercel.app ✅
- [x] `dev` → `main` merged ✅
- [x] Commit: `chore: week 3 complete — parent dashboard and agentic summary live`

---

## Week 4 — MCP Tool, Characters & Polish
> Goal: Fully polished, portfolio-ready app with MCP math generator and character art live on Vercel.

---

### PR 4-01 · MCP Math Problem Generator ✅
**Branch:** `feature/mcp-math-tool`

- [x] Created `/src/app/api/mcp/math-problem/route.ts` — POST endpoint
  - Accepts `{ grade: 'K' | '1', topic: string, difficulty: 'easy' | 'medium' }`
  - Uses Claude to generate a grade-appropriate math problem
  - Returns `{ problem: string, hint: string }` — answer is NEVER returned to client
  - Added `MathGrade`, `MathDifficulty`, `MathProblemRequest`, `MathProblemResponse` types to `api.ts`
- [x] Commit: `feat(mcp): add math problem generator mcp tool endpoint`

---

### PR 4-02 · Wire MCP Into Chat Router ✅
**Branch:** `feature/mcp-routing`

- [x] Created `src/lib/mcp/mathProblem.ts` — server-side MCP logic (direct call, no HTTP round-trip)
  - `generateMathProblem(grade, topic, difficulty)` — calls Claude, strips answer before returning
  - `detectsProblemRequest(message)` — 13 trigger phrase patterns for K-1 children
- [x] Updated `/src/app/api/chat/route.ts` — MCP routing before RAG
  - Detects problem requests ("give me a problem", "can I try one?", etc.)
  - Injects problem + hint as Layer 5 of system prompt; RAG skipped when MCP fires
- [x] Updated `buildSystemPrompt.ts` — added optional `mcpContext` param (Layer 5)
- [x] Commit: `feat(api): wire mcp math tool into chat routing logic`

---

### PR 4-03 · Character SVG Avatars ✅
**Branch:** `feature/character-avatars`

- [x] Created `src/components/child/avatars/BlipAvatar.tsx` — Blip the robot
- [x] Created `src/components/child/avatars/FinnAvatar.tsx` — Finn the fox
- [x] Created `src/components/child/avatars/ZorroAvatar.tsx` — Zorro the dragon
- [x] Created `src/components/child/avatars/LunaAvatar.tsx` — Luna the bunny
- [x] Created `src/components/child/avatars/PipAvatar.tsx` — Pip the fairy
- [x] Created `src/components/child/avatars/NovaAvatar.tsx` — Nova the owl
- [x] Created `src/components/child/avatars/index.ts` — central export + `getAvatarComponent(id)` lookup
- [x] Each avatar: geometric SVG shapes, 120x120 viewBox, bright character-matched colors
- [x] Commit: `feat(child-ui): add svg avatars for all 6 spark squad characters`

---

### PR 4-04 · Character Animations ✅
**Branch:** `feature/character-animations`

- [x] Added CSS keyframe animations to `globals.css`:
  - `avatar-idle` — gentle float up/down, 2s loop
  - `avatar-thinking` — side-to-side tilt, 3s loop — plays while mascot is typing
  - `avatar-celebrate` — fast bounce + scale-up, 0.8s — plays when child earns a star
- [x] Created `src/components/child/AnimatedAvatar.tsx` — wrapper that applies correct CSS class
  - Celebration auto-reverts to idle after 1s
  - Falls back to ✨ emoji if character ID not found
- [x] Commit: `feat(child-ui): add idle, thinking, and celebration animations to avatars`

---

### PR 4-05 · Update Character Select With Avatars ✅
**Branch:** `feature/character-select-avatars`

- [x] Updated `CharacterCard.tsx` — replaced emoji with SVG avatar (72px), celebration bounce on selected card
- [x] Updated `MascotAvatar.tsx` — replaced emoji with `AnimatedAvatar` (96px) inside colored circle
- [x] Updated `chat/page.tsx` — wires `avatarState` ('idle'/'thinking'/'celebrating') to loading + star events
- [x] Commit: `feat(child-ui): replace emoji placeholders with svg avatars on character select`

---

### PR 4-06 · Mobile Polish — Child UI ✅
**Branch:** `feature/mobile-polish-child`

- [x] `h-screen` → `h-dvh` on chat page — keyboard doesn't push content off-screen on iOS
- [x] `min-h-screen` → `min-h-dvh` on character-select page and WellDoneScreen
- [x] `SessionProgressBar` star badge: `text-sm` → `text-base` (16px minimum)
- [x] `ChatInput` bottom padding: uses `env(safe-area-inset-bottom)` for notched phones
- [x] End-session div: safe-area bottom padding
- [x] Commit: `style(child-ui): mobile polish and touch target audit`

---

### PR 4-07 · Mobile Polish — Parent UI ✅
**Branch:** `feature/mobile-polish-parent`

- [x] `min-h-screen` → `min-h-dvh` in parent layout and auth layout
- [x] Parent nav bar: tighter `px-3` on mobile, `sm:px-4` at wider breakpoint
- [x] Main content area: `py-6 sm:py-8` for better mobile spacing
- [x] `SessionSummaryCard` header: `flex-wrap` so badge doesn't collide with title on narrow screens
- [x] Commit: `style(parent-ui): mobile polish for dashboard and auth screens`

---

### PR 4-08 · Privacy Policy Page ✅
**Branch:** `feature/privacy-policy`

- [x] Created `/src/app/privacy/page.tsx` — plain-English COPPA policy with:
  - What IS collected: parent email, session activity data, fictional character name
  - What is NOT collected: child real name, age, photo, location, any PII
  - How data is used: only to display session summaries to the parent
  - Data retention: stored until parent deletes account (30-day deletion SLA)
  - Third-party services: Firebase, Anthropic Claude, Vercel
  - Contact: privacy@spark-tutor.app
  - COPPA callout box prominently placed at the top
- [x] Privacy link already in auth layout footer (shared by login + signup)
- [x] Added "By creating an account you agree to our Privacy Policy" to `SignupForm` footer
- [x] `npx tsc --noEmit` — zero errors ✅
- [x] Commit: `docs: add privacy policy page covering coppa data practices`

---

### PR 4-09 · Error States & Loading UI ✅
**Branch:** `feature/error-and-loading`

- [x] `LoadingSpinner.tsx` already existed at `src/components/shared/` — not recreated
- [x] Created `src/components/shared/ErrorMessage.tsx` — child variant (bright, emoji, big retry button) + parent variant (plain-English, Shadcn-aligned neutral style)
- [x] Added `src/app/(child)/chat/loading.tsx` — wraps `LoadingSpinner` in `h-dvh` violet gradient container
- [x] Added `src/app/(child)/chat/error.tsx` — Next.js `'use client'` error boundary; uses `ErrorMessage` variant="child" with reset callback
- [x] Added `src/app/(parent)/dashboard/loading.tsx` — wraps `LoadingSpinner` with "Loading your dashboard..." message
- [x] Added `src/app/(parent)/dashboard/error.tsx` — Next.js `'use client'` error boundary; uses `ErrorMessage` variant="parent" with reset callback
- [x] Verified: `chat/page.tsx` line 266 already shows `"Hmm, let me think for a second... try asking me again! 🤔"` on API failure ✅
- [x] `npx tsc --noEmit` — zero errors ✅
- [x] Commit: `feat(shared): add loading and error state components for child and parent`

---

### PR 4-10 · Rate Limiting ✅
**Branch:** `feature/rate-limiting`

- [x] Installed `@upstash/ratelimit` and `@upstash/redis` (4 packages added)
- [x] Created `src/lib/upstash/ratelimit.ts` — `chatRatelimit` (30 req/user/hour) + `summaryRatelimit` (10 req/user/hour); fail-open design when env vars absent (safe for local dev)
- [x] Added `UPSTASH_REDIS_REST_URL` + `UPSTASH_REDIS_REST_TOKEN` placeholders to `.env.example` and `.env.local`
- [x] Applied `chatRatelimit` to `/api/chat` as step 2 (after auth verify, before body parse) — returns 429 with child-friendly message
- [x] Applied `summaryRatelimit` to `/api/summary` as step 2 — returns 429 with plain-English message
- [x] 429 responses are caught by existing client error handling (`response.ok` check triggers warm mascot fallback)
- [x] `npx tsc --noEmit` — zero errors ✅
- [x] Commit: `feat(api): add rate limiting to ai endpoints with upstash`
- ⚠️ **Action required:** Create a free Upstash database at https://console.upstash.com/ and fill in `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN` in `.env.local` and Vercel env vars before deploying

---

### PR 4-11 · Prettier & Lint Cleanup ✅
**Branch:** `feature/code-quality`

- [x] Created `.prettierrc` — `semi: true, singleQuote: true, tabWidth: 2, trailingComma: "all", printWidth: 100`
- [x] Ran `npx prettier --write src/` — 30 files reformatted, all unchanged files confirmed clean
- [x] Removed 3 `console.error` calls (`firestore.ts` ×2, `api/rag/route.ts` ×1)
- [x] Removed unused `updateDoc` import from `firestore.ts`
- [x] Fixed `session/start/route.ts` — `catch (err)` → `catch` (err was unused)
- [x] Fixed `AnimatedAvatar.tsx` — `useMemo` for stable avatar component ref + targeted `eslint-disable` for intentional `setState-in-effect` animation pattern
- [x] Fixed `CharacterCard.tsx` — targeted `eslint-disable` for `static-components` on JSX line
- [x] Fixed `StarBurst.tsx` — targeted `eslint-disable` for intentional `setState-in-effect` animation trigger
- [x] Fixed `useSessionHistory.ts` — targeted `eslint-disable` for intentional `setState-in-effect` in onSnapshot setup
- [x] Fixed `chat/page.tsx` — targeted `eslint-disable` for intentional avatar sync via `useEffect`
- [x] `npx eslint src/ --ext .ts,.tsx` — **0 errors, 0 warnings** ✅
- [x] `npx tsc --noEmit` — **0 errors** ✅
- [x] Commit: `feat(shared): add prettierrc, run prettier, fix all eslint warnings and remove console.logs`

---

### PR 4-12 · Husky Pre-commit Hook ✅
**Branch:** `feature/husky`

- [x] Installed `husky@^9.1.7` + `lint-staged@^16.4.0` as devDependencies
- [x] Ran `npx husky init` — created `.husky/` directory + added `"prepare": "husky"` to package.json
- [x] Configured `.husky/pre-commit`: `npx tsc --noEmit && npx prettier --check src/ && npx eslint src/ --ext .ts,.tsx`
- [x] Added `lint-staged` config block to package.json (`prettier --write` + `eslint --fix` on `src/**/*.{ts,tsx}`)
- [x] Verified: pre-commit hook fired during commit — all 3 checks passed (tsc 0 errors, prettier all clean, eslint 0 errors)
- [x] Commit: `chore: add husky pre-commit hook with tsc, prettier, and eslint`

---

### PR 4-13 · Final End-to-End Test
**Branch:** `dev`

- [ ] Full flow test 1 (Math): signup → select Blip → name it → 10-message math session → end → check parent summary
- [ ] Full flow test 2 (Reading): login → select Nova → name it → 10-message reading session → end → check parent summary
- [ ] Test MCP: ask for a practice problem in both sessions — verify grade-appropriate problems appear
- [ ] Test RAG: ask curriculum questions — verify answers reference real content
- [ ] Test error states: disconnect network mid-chat — verify friendly error appears
- [ ] Test on mobile (375px) end to end
- [ ] Commit: `test: final end-to-end test pass across all flows`

---

### PR 4-14 · Vercel Production Deploy
**Branch:** `main`

- [ ] Add all environment variables to Vercel project settings (Dashboard → Settings → Environment Variables)
- [ ] Set `NODE_ENV=production` in Vercel
- [ ] Run final build check: `npm run build` — must complete with zero errors
- [ ] Deploy: `vercel --prod`
- [ ] Smoke test live URL: character select → chat → parent dashboard
- [ ] Commit: `chore: production deploy to vercel`

---

### PR 4-15 · Portfolio Case Study & README
**Branch:** `feature/readme`

- [ ] Create `README.md` with:
  - [ ] Project title, one-line description, and live URL
  - [ ] Screenshot or GIF of the app (character select + chat)
  - [ ] Tech stack badges
  - [ ] Architecture section (dual-LLM, RAG, MCP, agentic summary)
  - [ ] Three portfolio talking points (dual-LLM decision, agentic summary, composable prompt)
  - [ ] Local setup instructions (clone → env vars → npm install → npm run dev)
- [ ] Merge `dev` → `main`
- [ ] Commit: `docs: add portfolio readme with architecture and setup instructions`

---

## Completion Checklist

- [ ] All 4 weeks complete
- [ ] Live on Vercel with zero build errors
- [ ] README with live URL ready for portfolio
- [ ] Privacy policy page live
- [ ] No TypeScript errors
- [ ] No console.logs in production
- [ ] Mobile tested at 375px
- [ ] Parent dashboard shows real agentic summaries
- [ ] MCP math tool working in chat
- [ ] RAG retrieval grounded in OER curriculum

---

*Built with Next.js · Firebase · Claude · Gemini · Tailwind CSS · Vercel*
