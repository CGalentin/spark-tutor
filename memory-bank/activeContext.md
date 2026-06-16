# Active Context — Spark Tutor

## Current Status
**Week 1 — Foundation & Chat UI COMPLETE** (15/15 PRs done — live at https://spark-tutor-app.vercel.app)

## Completed PRs
- [x] PR 1-01 · Project Scaffold — Next.js 16.2.9 + TypeScript + Tailwind + ESLint, `.cursorrules` and `ROADMAP.md` in project root, pushed to GitHub
- [x] PR 1-02 · Folder Structure — All `/src` subdirectories created with `.gitkeep`, memory bank initialized
- [x] PR 1-03 · Install Dependencies — Firebase, firebase-admin, @anthropic-ai/sdk, @google/generative-ai, zustand, clsx, tailwind-merge, Shadcn UI (card, badge, button, input). Zero TS errors.
- [x] PR 1-04 · Environment Variables — `.env.local` created (gitignored, all 11 keys filled), `.env.example` committed. `.gitignore` updated with `!.env.example` exception.
- [x] PR 1-05 · Firebase Client Setup — `src/lib/firebase/config.ts` (singleton init), `auth.ts` (signIn, signUp, signOut, onAuthChange), `firestore.ts` (getSession, getSessions, saveSummary). Zero TS errors.
- [x] PR 1-06 · Shared Types — `src/types/character.ts` (CharacterConfig, CharacterVoice), `session.ts` (Session, SessionSummary, Message, Subject, MessageRole), `api.ts` (ApiResult<T>, ChatRequest, ChatResponse, SummaryRequest, SummaryResponse), `index.ts` (central re-export). Zero TS errors.
- [x] PR 1-07 · Character Constants — `src/constants/characters.ts` (all 6 Spark Squad: Blip🤖 Finn🦊 Zorro🐲 Luna🐰 Pip🧚 Nova🦉 with voicePrompts + Tailwind colors), `subjects.ts` (Subject, GradeBand, MAX_SESSION_STARS=10, TARGET_SESSION_MESSAGES=10), `prompts.ts` (BASE_TUTOR_RULES, SUMMARY_SYSTEM_PROMPT). Zero TS errors.
- [x] PR 1-08 · Zustand Stores — `src/store/useChildStore.ts` (selectedCharacterId, characterName), `useSessionStore.ts` (sessionId, subject, starsEarned, messageCount, isChatLoading, isSessionEnding), `useAuthStore.ts` (parentUID, parentEmail, isAuthenticated, isAuthLoading). All fully typed. Zero TS errors.
- [x] PR 1-09 · Auth Layout & Login Page — `src/app/(auth)/layout.tsx` (centered branding layout), `src/app/(auth)/login/page.tsx` + `src/components/parent/LoginForm.tsx` (Firebase signIn, Shadcn Card/Input/Button, friendly error messages), `src/app/(auth)/signup/page.tsx` + `src/components/parent/SignupForm.tsx` (Firebase signUp, confirm password). Root `page.tsx` redirects to `/login`. Metadata updated. Zero TS errors.
- [x] PR 1-10 · Auth Provider & Route Protection — `src/components/shared/AuthProvider.tsx` (Firebase onAuthStateChanged → useAuthStore), `src/components/shared/AuthRouteGuard.tsx` (redirects authenticated users away from /login), `src/components/shared/LoadingSpinner.tsx`, `src/hooks/useAuth.ts`, `src/app/(parent)/layout.tsx` (guards parent routes → /login), root `layout.tsx` wrapped with AuthProvider. Zero TS errors.
- [x] PR 1-11 · Character Selection Screen — `src/app/(child)/character-select/page.tsx`, `CharacterCard.tsx` (emoji, color, selection ring), `CharacterGrid.tsx` (2-col grid), `CharacterNameInput.tsx` (name entry + "Let's Go!" button). Wired to useChildStore. Zero TS errors.
- [x] PR 1-12 · Claude API Route — `src/lib/firebase/admin.ts` (Admin SDK, token verification), `src/lib/claude/client.ts` (Anthropic singleton), `src/lib/claude/buildSystemPrompt.ts` (3-layer: BASE_TUTOR_RULES + CHARACTER_VOICE + SUBJECT_CONTEXT), `src/app/api/chat/route.ts` (POST, auth-verified, SSE streaming, `[STAR EARNED]` detection). Zero TS errors.
- [x] PR 1-13 · Chat UI — Message Bubbles — `MascotAvatar.tsx` (emoji circle + name badge), `ChatBubble.tsx` (child right/mascot left, strips `[STAR EARNED]`), `ChatMessageList.tsx` (auto-scroll, bouncing typing indicator). `globals.css` bounce keyframe added. Zero TS errors.
- [x] PR 1-14 · Chat UI — Input & Session — `ChatInput.tsx` (large input + 🚀 send button, 48px touch targets), `SubjectSelector.tsx` (Math/Reading 80px buttons), `src/app/(child)/chat/page.tsx` (full chat page: SSE streaming, star detection, redirect guard). Zero TS errors.
- [x] PR 1-15 · Week 1 Integration Test & Deploy — TypeScript clean, production build clean, all 11 env vars pushed to Vercel, live at https://spark-tutor-app.vercel.app, dev→main merged.

## Currently Working On
- **Week 2 RAG Layer — PR 2-01** (`feature/rag-source-docs`) — ready to start next session

## PR 1-15 Test Status — ALL PASSING ✅ (fully verified Jun 15)
- [x] TypeScript: `npx tsc --noEmit` — zero errors
- [x] Deploy: `vercel --prod` — production live, all routes clean
- [x] Merge dev → main — done
- [x] Login → dashboard → character select → name → subject → 5-message Socratic chat ✅
- [x] Mascot responds in character voice (Socratic, K-1 language) ✅
- [x] No console errors in browser ✅
- [x] Child message bubbles visible and styled correctly ✅

## All Bugs Found During PR 1-15 Testing (Jun 15 — ALL RESOLVED)

### BUG 1 — FIXED ✅
- `/dashboard` 404 — created placeholder page

### BUG 2 — FIXED ✅
- `firebase-admin@14` ESM crash — downgraded to v12, added `serverExternalPackages`

### BUG 3 — FIXED ✅
- `claude-3-5-haiku-20241022` EOL — updated to `claude-haiku-4-5-20251001`

### BUG 4 — FIXED ✅
- Anthropic account out of credits — topped up via Anthropic Console billing

### BUG 5 — FIXED ✅
- Child chat bubbles rendering off-screen right — switched from `justify-end` wrapper to `self-center` direct flex item; restyled with violet gradient

## Up Next (Week 2 — in order)
1. **PR 2-01** · Collect Source Documents — download K-1 Math + Reading/ELA OER docs to `/rag-sources/`
2. **PR 2-02** · Firebase Vector Search Setup — enable extension, create `curriculum_chunks` collection
3. **PR 2-03** · Document Chunking Utility — 200-400 word chunks with subject/grade metadata
4. **PR 2-04** · Gemini Embedding Setup — `src/lib/gemini/client.ts` + `embed.ts`
5. **PR 2-05** · Document Ingestion Script — full pipeline: chunk → embed → save to Firestore
6. Continue through PR 2-10 (see ROADMAP.md Week 2 section)

## Active Branch
`main` — create `feature/rag-source-docs` from `dev` at start of next session

## Known Issues / Blockers
- None — Week 1 fully verified and deployed, chat working end-to-end

## Recent Decisions & Notes
- Next.js 16.2.9 — Turbopack enabled by default in dev mode (acceptable)
- GitHub repo: https://github.com/CGalentin/spark-tutor (public, MIT license)
- Shell: PowerShell on Windows 10 — NO bash heredoc syntax, use simple `-m "message"` for all git commits
- Shadcn 4.11.0 with Tailwind v4 — `src/lib/utils.ts` has `cn()` utility, `components.json` at project root
- Firebase project: `spark-tutor-96f9c` — Auth (Email/Password enabled), Firestore (Standard edition, production mode)
- **Git workflow rule:** Always merge completed feature branch into `dev` BEFORE creating the next feature branch
- `[STAR EARNED]` phrase in Claude response signals a star should be awarded to the child
- Child UI uses custom components (NOT Shadcn) — large text (18px+), 48px+ touch targets, rounded-3xl, bright colors
- Parent UI uses Shadcn components — clean, minimal, neutral palette

## Current Status
**Week 1 complete ✅ — beginning Week 2 RAG Layer**
