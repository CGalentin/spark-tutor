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
- **PR 1-15 manual testing BLOCKED** — chat is broken due to deprecated Claude model
- Week 2 (RAG Layer) has NOT started — blocked until PR 1-15 tests all pass

## PR 1-15 Test Status
- [x] TypeScript: `npx tsc --noEmit` — zero errors (verified Jun 15)
- [x] Deploy: `vercel --prod` — fresh production deploy live, all 10 routes clean (Jun 15)
- [x] Merge dev → main — done
- [ ] End-to-end test: login → dashboard → character select → chat → 5-message conversation — BLOCKED (see below)
- [ ] Verify mascot responds in character voice (Socratic, K-1 language) — BLOCKED
- [ ] Verify no console errors in browser — BLOCKED

## Bugs Found During PR 1-15 Testing (Jun 15 session)

### BUG 1 — FIXED ✅
- **What**: `/dashboard` page did not exist → every successful login hit a 404
- **Cause**: Dashboard was never created (Week 3 feature), but login always redirects to /dashboard
- **Fix**: Created placeholder `src/app/(parent)/dashboard/page.tsx` with sign-out + start session buttons
- **Commit**: `fix(parent-ui): add placeholder dashboard page so login redirect has a valid landing`

### BUG 2 — FIXED ✅
- **What**: `POST /api/chat` returned 500 on every request — chat completely broken
- **Cause**: `firebase-admin@14` uses `jwks-rsa@4` → `jose@6` (ESM-only). Vercel serverless bundler runs CommonJS and cannot `require()` ESM modules.
- **Fix**: Downgraded to `firebase-admin@12` (uses `jwks-rsa@3` → `jose@4`, CJS-compatible). Also added `serverExternalPackages: ['firebase-admin']` to `next.config.ts`.
- **Commits**: 
  - `fix(api): add firebase-admin to serverExternalPackages to fix ERR_REQUIRE_ESM in Vercel`
  - `fix(api): downgrade firebase-admin to v12 to resolve ERR_REQUIRE_ESM from jose@6 in jwks-rsa`

### BUG 3 — NOT YET FIXED ❌ ← NEXT SESSION STARTS HERE
- **What**: Chat still shows "Hmm, let me think for a second... try asking me again!" after BUG 2 was fixed
- **Cause**: Model `claude-3-5-haiku-20241022` reached end-of-life February 19, 2026. As of June 2026 it is fully retired. Anthropic API rejects every request with a deprecation warning. The stream error event triggers the child-safe error message.
- **Fix needed**: Update model name in `src/app/api/chat/route.ts` from `claude-3-5-haiku-20241022` to a current Anthropic model (e.g. `claude-haiku-4-5` or equivalent current fast/cheap model).
- **File to edit**: `src/app/api/chat/route.ts` line ~106: `model: 'claude-3-5-haiku-20241022'`

## Up Next (Next Session — in order)
1. Fix BUG 3: update Claude model in `src/app/api/chat/route.ts` to a live model
2. Re-deploy and test end-to-end: login → dashboard → character select → name → chat → 5 messages
3. Check browser console for errors
4. Mark PR 1-15 complete in ROADMAP and memory bank
5. Then begin Week 2: PR 2-01 · Collect Source Documents (`feature/rag-source-docs`)

## Active Branch
`dev` — in sync with `main`

## Known Issues / Blockers
- BUG 3: Deprecated Claude model `claude-3-5-haiku-20241022` blocks all chat functionality

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

## Known Issues / Blockers
- `/dashboard` 404 was just fixed via hotfix — awaiting confirmation that login flow works end-to-end on live app
