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
- [ ] Week 2 — RAG Layer
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

### PR 2-01 · Collect Source Documents
**Branch:** `feature/rag-source-docs`

- [ ] Download 5-10 K-1 Math documents from CK-12 (ck12.org → filter Grade K-1)
- [ ] Download 5-10 K-1 Reading/ELA documents from EngageNY or Core Knowledge
- [ ] Download Common Core K-1 standards PDF (Math + ELA)
- [ ] Save all files to `/rag-sources/math/` and `/rag-sources/reading/` (local only, not committed)
- [ ] Create `/rag-sources/README.md` listing all sources with license confirmation
- [ ] Commit: `docs(rag): add rag sources readme with license list`

---

### PR 2-02 · Firebase Vector Search Setup
**Branch:** `feature/vector-search-setup`

- [ ] Enable Firebase Vector Search extension in Firebase Console
- [ ] Create Firestore collection `curriculum_chunks` for storing embedded documents
- [ ] Create `/src/lib/firebase/vectorSearch.ts` — query function that takes text, returns top 3 chunks
- [ ] Test connection with a dummy document in Firestore
- [ ] Commit: `feat(rag): set up firebase vector search collection and query helper`

---

### PR 2-03 · Document Chunking Utility
**Branch:** `feature/doc-chunking`

- [ ] Create `/scripts/rag/chunkDocument.ts` — splits a document into 200-400 word sections
- [ ] Each chunk includes metadata: `{ subject, grade_band, topic, source, chunkIndex }`
- [ ] Test chunker on one Math PDF and one Reading PDF
- [ ] Log chunk count and average word count per chunk
- [ ] Commit: `feat(rag): add document chunking utility with metadata tagging`

---

### PR 2-04 · Gemini Embedding Setup
**Branch:** `feature/gemini-embeddings`

- [ ] Create `/src/lib/gemini/client.ts` — Google Generative AI SDK initialization
- [ ] Create `/src/lib/gemini/embed.ts` — function that takes text, returns embedding vector
- [ ] Test embedding one chunk and log the vector length (should be 768)
- [ ] Commit: `feat(rag): add gemini embedding client and embed function`

---

### PR 2-05 · Document Ingestion Script
**Branch:** `feature/ingestion-script`

- [ ] Create `/scripts/rag/ingestDocuments.ts` — full ingestion pipeline:
  - Read source files from `/rag-sources/`
  - Chunk each document
  - Embed each chunk with Gemini
  - Save chunk + embedding + metadata to Firestore `curriculum_chunks`
- [ ] Add check: skip chunks that already exist in Firestore (never re-embed)
- [ ] Run script on Math sources: `npx ts-node scripts/rag/ingestDocuments.ts --subject math`
- [ ] Verify chunks appear in Firestore console
- [ ] Commit: `feat(rag): add document ingestion script with deduplication check`

---

### PR 2-06 · Ingest Reading Sources
**Branch:** `feature/ingest-reading`

- [ ] Run ingestion script on Reading/ELA sources
- [ ] Verify Reading chunks appear in Firestore with correct `subject: 'reading'` metadata
- [ ] Spot check 3-5 chunks manually in Firebase console for quality
- [ ] Commit: `feat(rag): ingest k-1 reading and ela curriculum chunks`

---

### PR 2-07 · RAG Retrieval API Route
**Branch:** `feature/rag-retrieval`

- [ ] Create `/src/app/api/rag/route.ts` — POST endpoint that:
  - Takes `{ query: string, subject: string }`
  - Embeds the query with Gemini
  - Queries Firebase Vector Search for top 3 matching chunks
  - Filters by `subject` metadata
  - Returns chunks as plain text
- [ ] Test with sample K-1 Math and Reading questions
- [ ] Commit: `feat(rag): add rag retrieval api route with subject filtering`

---

### PR 2-08 · Wire RAG Into Chat
**Branch:** `feature/rag-in-chat`

- [ ] Update `/src/app/api/chat/route.ts`:
  - Before calling Claude, call the RAG retrieval endpoint
  - Inject returned chunks into Layer 3 of the system prompt
  - If no chunks returned, proceed without RAG context (graceful fallback)
- [ ] Test: ask a K-1 math question → verify Claude's answer references curriculum content
- [ ] Commit: `feat(rag): inject retrieved curriculum chunks into claude system prompt`

---

### PR 2-09 · RAG Quality Check
**Branch:** `feature/rag-quality`

- [ ] Create `/scripts/rag/testRetrieval.ts` — runs 10 sample K-1 questions through RAG
- [ ] Log which chunks were retrieved for each question
- [ ] Manually verify at least 8 of 10 retrievals are relevant
- [ ] Adjust chunk size or metadata if retrieval quality is poor
- [ ] Commit: `test(rag): add retrieval quality test script with sample questions`

---

### PR 2-10 · Week 2 Integration Test & Deploy
**Branch:** `dev`

- [ ] End-to-end test: full chat session asking 5 Math and 5 Reading questions
- [ ] Verify answers are grounded in curriculum (not generic AI responses)
- [ ] Verify mascot still responds in character voice with Socratic guiding
- [ ] Run TypeScript check: `npx tsc --noEmit`
- [ ] Deploy to Vercel: `vercel --prod`
- [ ] Merge `dev` → `main`
- [ ] Commit: `chore: week 2 complete — rag layer live`

---

## Week 3 — Parent Layer & Agentic Summary
> Goal: Parent can log in and see an automatic summary of every session their child had.

---

### PR 3-01 · Firebase Admin Setup
**Branch:** `feature/firebase-admin`

- [ ] Create `/src/lib/firebase/admin.ts` — Firebase Admin SDK initialization (server-side only)
- [ ] Add Admin credentials to `.env.local`
- [ ] Create `verifyAuthToken` helper — verifies Firebase ID token on API routes
- [ ] Test token verification works from a protected API route
- [ ] Commit: `feat(firebase): add firebase admin sdk and token verification helper`

---

### PR 3-02 · Session Tracking — Start
**Branch:** `feature/session-start`

- [ ] Create `/src/app/api/session/start/route.ts` — POST endpoint:
  - Verifies parent auth token
  - Creates a new session document in Firestore under `users/{parentUID}/sessions/{sessionID}`
  - Returns `sessionId`
- [ ] Call this endpoint when child clicks "Let's Go!" on character select screen
- [ ] Store `sessionId` in `useSessionStore`
- [ ] Commit: `feat(api): add session start endpoint and wire to character select`

---

### PR 3-03 · Session Tracking — Messages
**Branch:** `feature/session-messages`

- [ ] Update `/src/app/api/chat/route.ts`:
  - Accept `sessionId` in request body
  - After each AI response, increment `messagesCount` in Firestore session document
- [ ] Update `useSessionStore` to track `messageCount` locally (for progress bar)
- [ ] Commit: `feat(api): track message count per session in firestore`

---

### PR 3-04 · Stars Logic
**Branch:** `feature/stars-logic`

- [ ] Create `/src/hooks/useStars.ts` — hook that manages star awarding logic
- [ ] Define star trigger: award a star when Claude's response contains a correct-answer indicator
- [ ] Update `useSessionStore.addStar()` and sync star count to Firestore session document
- [ ] Create `/src/components/child/StarBurst.tsx` — animated star that pops when earned
- [ ] Commit: `feat(child-ui): add star awarding logic and starburst animation`

---

### PR 3-05 · Progress Bar
**Branch:** `feature/progress-bar`

- [ ] Create `/src/components/child/SessionProgressBar.tsx`
- [ ] Progress is based on `messageCount` — fills over a 10-message session
- [ ] Show stars earned count alongside the bar
- [ ] Add to chat page above the message list
- [ ] Commit: `feat(child-ui): add session progress bar with star count`

---

### PR 3-06 · Session End Flow
**Branch:** `feature/session-end`

- [ ] Create `/src/components/child/EndSessionButton.tsx` — "All Done!" button
- [ ] Create `/src/app/api/session/end/route.ts` — POST endpoint:
  - Marks session as ended in Firestore (`endedAt` timestamp, final star count)
  - Triggers the agentic summary (calls `/api/summary`)
- [ ] Show "Great job today!" screen to child after session ends
- [ ] Commit: `feat(api): add session end endpoint and well-done screen`

---

### PR 3-07 · Agentic Summary — Claude Call
**Branch:** `feature/agentic-summary`

- [ ] Create `/src/app/api/summary/route.ts` — POST endpoint:
  - Accepts `{ sessionId, messages: Message[] }`
  - Sends full conversation to Claude with summary system prompt
  - Claude extracts: topics covered, areas for practice, encouragement note
  - Returns structured summary object
- [ ] Create `/src/lib/claude/buildSummaryPrompt.ts` — summary-specific prompt
- [ ] Commit: `feat(api): add agentic session summary claude endpoint`

---

### PR 3-08 · Save Summary to Firestore
**Branch:** `feature/save-summary`

- [ ] Update `/src/app/api/summary/route.ts`:
  - Save returned summary to Firestore: `users/{parentUID}/sessions/{sessionID}/summary`
  - Include: `topicsCovered[]`, `areasForPractice[]`, `encouragementNote`, `generatedAt`
- [ ] Test: end a session, check Firestore console for saved summary
- [ ] Commit: `feat(api): save agentic session summary to firestore`

---

### PR 3-09 · Parent Dashboard Layout
**Branch:** `feature/parent-dashboard`

- [ ] Create `/src/app/(parent)/dashboard/page.tsx` — parent dashboard route
- [ ] Create `/src/app/(parent)/layout.tsx` — parent layout with simple nav (Dashboard | Logout)
- [ ] Create `/src/components/parent/DashboardHeader.tsx` — welcome message, child character name
- [ ] Use Shadcn `Card` component for layout sections
- [ ] Commit: `feat(parent-ui): add parent dashboard layout and header`

---

### PR 3-10 · Session Summary Card
**Branch:** `feature/summary-card`

- [ ] Create `/src/components/parent/SessionSummaryCard.tsx`:
  - Shows: date, subject, stars earned, topics covered, areas for practice, encouragement note
  - Uses Shadcn `Card`, `Badge` components
- [ ] Create `/src/hooks/useSessionHistory.ts` — fetches sessions from Firestore using `onSnapshot`
- [ ] Render list of `SessionSummaryCard` on dashboard, most recent first
- [ ] Commit: `feat(parent-ui): add session summary card and session history hook`

---

### PR 3-11 · Week 3 Integration Test & Deploy
**Branch:** `dev`

- [ ] End-to-end test: full session → end session → check parent dashboard for summary
- [ ] Verify summary contains relevant topics (not generic text)
- [ ] Verify stars and message count saved correctly in Firestore
- [ ] Run TypeScript check: `npx tsc --noEmit`
- [ ] Deploy to Vercel: `vercel --prod`
- [ ] Merge `dev` → `main`
- [ ] Commit: `chore: week 3 complete — parent dashboard and agentic summary live`

---

## Week 4 — MCP Tool, Characters & Polish
> Goal: Fully polished, portfolio-ready app with MCP math generator and character art live on Vercel.

---

### PR 4-01 · MCP Math Problem Generator
**Branch:** `feature/mcp-math-tool`

- [ ] Create `/src/app/api/mcp/math-problem/route.ts` — POST endpoint:
  - Accepts `{ grade: 'K' | '1', topic: string, difficulty: 'easy' | 'medium' }`
  - Uses Claude to generate a grade-appropriate math problem
  - Returns `{ problem: string, hint: string }` — answer is NEVER returned to client
  - Stores answer server-side in a short-lived cache (or Firestore temp doc)
- [ ] Commit: `feat(mcp): add math problem generator mcp tool endpoint`

---

### PR 4-02 · Wire MCP Into Chat Router
**Branch:** `feature/mcp-routing`

- [ ] Update `/src/app/api/chat/route.ts`:
  - Detect when child asks for a practice problem ("give me a problem", "can I try one?")
  - Route to MCP math problem generator instead of RAG
  - Inject returned `problem` and `hint` into Claude's system prompt context
- [ ] Test: ask for a math problem in chat → verify a grade-appropriate problem appears
- [ ] Commit: `feat(api): wire mcp math tool into chat routing logic`

---

### PR 4-03 · Character SVG Avatars
**Branch:** `feature/character-avatars`

- [ ] Create `/src/components/child/avatars/BlipAvatar.tsx` — Blip the robot (simple SVG)
- [ ] Create `/src/components/child/avatars/FinnAvatar.tsx` — Finn the fox
- [ ] Create `/src/components/child/avatars/ZorroAvatar.tsx` — Zorro the dragon
- [ ] Create `/src/components/child/avatars/LunaAvatar.tsx` — Luna the bunny
- [ ] Create `/src/components/child/avatars/PipAvatar.tsx` — Pip the fairy
- [ ] Create `/src/components/child/avatars/NovaAvatar.tsx` — Nova the owl
- [ ] Each avatar: simple geometric SVG shapes, ~150x150px, bright colors
- [ ] Commit: `feat(child-ui): add svg avatars for all 6 spark squad characters`

---

### PR 4-04 · Character Animations
**Branch:** `feature/character-animations`

- [ ] Add CSS keyframe animations to each avatar:
  - Idle: gentle bounce (translateY 0 → -6px → 0, 2s loop)
  - Thinking: slow side-to-side tilt (3s loop) — plays while mascot is typing
  - Celebration: fast bounce + scale up — plays when child earns a star
- [ ] Wire thinking animation to `isChatLoading` state in chat page
- [ ] Wire celebration animation to `useSessionStore` star events
- [ ] Commit: `feat(child-ui): add idle, thinking, and celebration animations to avatars`

---

### PR 4-05 · Update Character Select With Avatars
**Branch:** `feature/character-select-avatars`

- [ ] Replace emoji placeholders in `CharacterCard` with real SVG avatars
- [ ] Add hover animation to each card (slight scale up)
- [ ] Add selected state: ring highlight + avatar celebration bounce
- [ ] Test on mobile viewport (375px) — verify 2-column grid fits cleanly
- [ ] Commit: `feat(child-ui): replace emoji placeholders with svg avatars on character select`

---

### PR 4-06 · Mobile Polish — Child UI
**Branch:** `feature/mobile-polish-child`

- [ ] Test entire child flow on 375px viewport
- [ ] Verify all touch targets are minimum 48x48px
- [ ] Verify font sizes are minimum 18px throughout child UI
- [ ] Fix any overflow or layout issues on small screens
- [ ] Verify chat input stays visible above keyboard on mobile (use `dvh` units)
- [ ] Commit: `style(child-ui): mobile polish and touch target audit`

---

### PR 4-07 · Mobile Polish — Parent UI
**Branch:** `feature/mobile-polish-parent`

- [ ] Test parent dashboard on 375px viewport
- [ ] Verify session summary cards stack cleanly on mobile
- [ ] Verify login/signup forms are usable on mobile
- [ ] Fix any overflow or spacing issues
- [ ] Commit: `style(parent-ui): mobile polish for dashboard and auth screens`

---

### PR 4-08 · Privacy Policy Page
**Branch:** `feature/privacy-policy`

- [ ] Create `/src/app/privacy/page.tsx`
- [ ] Content must cover:
  - [ ] What is collected: parent email, session activity data
  - [ ] What is NOT collected: child's real name, age, photo, location, or any PII
  - [ ] How data is used: only to show session summaries to the parent
  - [ ] Data retention: sessions stored until parent deletes account
  - [ ] Contact email for data requests
- [ ] Add privacy policy link to login/signup pages
- [ ] Commit: `docs: add privacy policy page covering coppa data practices`

---

### PR 4-09 · Error States & Loading UI
**Branch:** `feature/error-and-loading`

- [ ] Create `/src/components/shared/LoadingSpinner.tsx` — fun spinning star for child UI
- [ ] Create `/src/components/shared/ErrorMessage.tsx` — child-friendly error with retry button
- [ ] Add `loading.tsx` to `/app/(child)/chat/` route segment
- [ ] Add `error.tsx` to `/app/(child)/chat/` route segment
- [ ] Add `loading.tsx` to `/app/(parent)/dashboard/` route segment
- [ ] Verify mascot shows friendly message on API failure (not a raw error)
- [ ] Commit: `feat(shared): add loading and error state components for child and parent`

---

### PR 4-10 · Rate Limiting
**Branch:** `feature/rate-limiting`

- [ ] Install Upstash rate limiter: `npm install @upstash/ratelimit @upstash/redis`
- [ ] Add Upstash credentials to `.env.local` and `.env.example`
- [ ] Add rate limiting to `/api/chat` — max 30 requests per user per hour
- [ ] Add rate limiting to `/api/summary` — max 10 per user per hour
- [ ] Return `429 Too Many Requests` with friendly message when limit hit
- [ ] Commit: `feat(api): add rate limiting to ai endpoints with upstash`

---

### PR 4-11 · Prettier & Lint Cleanup
**Branch:** `feature/code-quality`

- [ ] Create `.prettierrc`:
  ```json
  {
    "semi": true,
    "singleQuote": true,
    "tabWidth": 2,
    "trailingComma": "all",
    "printWidth": 100
  }
  ```
- [ ] Run Prettier across all files: `npx prettier --write src/`
- [ ] Fix all ESLint warnings: `npx eslint src/ --fix`
- [ ] Run final TypeScript check: `npx tsc --noEmit`
- [ ] Remove any remaining `console.log` statements from production code
- [ ] Commit: `chore: prettier formatting and lint cleanup across all files`

---

### PR 4-12 · Husky Pre-commit Hook
**Branch:** `feature/husky`

- [ ] Install Husky: `npm install --save-dev husky lint-staged`
- [ ] Run: `npx husky init`
- [ ] Configure `.husky/pre-commit` to run:
  - `npx tsc --noEmit` (TypeScript check)
  - `npx prettier --check src/` (formatting check)
  - `npx eslint src/` (lint check)
- [ ] Test: make a change with a TypeScript error, try to commit — should be blocked
- [ ] Commit: `chore: add husky pre-commit hooks for ts, prettier, and eslint`

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
