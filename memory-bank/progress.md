# Progress — Spark Tutor

## Overall Status
**Week 1 of 4 — Complete ✅ (15/15 PRs done) | Live: https://spark-tutor-app.vercel.app**

## Week-by-Week Summary
| Week | Theme | Status |
|---|---|---|
| Week 1 | Foundation & Chat UI | ✅ Complete |
| Week 2 | RAG Layer | ⏳ Not Started |
| Week 3 | Parent Layer & Agentic Summary | ⏳ Not Started |
| Week 4 | MCP Tool & Polish | ⏳ Not Started |

---

## Week 1 — PR Checklist

| PR | Title | Branch | Status |
|---|---|---|---|
| 1-01 | Project Scaffold | `feature/project-scaffold` | ✅ Done |
| 1-02 | Folder Structure | `feature/folder-structure` | ✅ Done |
| 1-03 | Install Dependencies | `feature/dependencies` | ✅ Done |
| 1-04 | Environment Variables | `feature/env-setup` | ✅ Done |
| 1-05 | Firebase Client Setup | `feature/firebase-client` | ✅ Done |
| 1-06 | Shared Types | `feature/shared-types` | ✅ Done |
| 1-07 | Character Constants | `feature/character-constants` | ✅ Done |
| 1-08 | Zustand Stores | `feature/zustand-stores` | ✅ Done |
| 1-09 | Auth Layout & Login Page | `feature/auth-pages` | ✅ Done |
| 1-10 | Auth Provider & Route Protection | `feature/auth-provider` | ✅ Done |
| 1-11 | Character Selection Screen | `feature/character-selection` | ✅ Done |
| 1-12 | Claude API Route | `feature/claude-api` | ✅ Done |
| 1-13 | Chat UI — Message Bubbles | `feature/chat-bubbles` | ✅ Done |
| 1-14 | Chat UI — Input & Session | `feature/chat-input` | ✅ Done |
| 1-15 | Week 1 Integration Test & Deploy | `dev` | ✅ Done |

---

## What Works Right Now
- Next.js 16.2.9 scaffolded — TypeScript strict mode, Tailwind v4, ESLint, App Router
- Full `/src` folder structure: `components/child|parent|shared`, `lib/firebase|claude|gemini`, `store`, `types`, `constants`, `hooks`
- Memory bank initialized in `memory-bank/`
- All npm dependencies installed and verified (zero TypeScript errors)
- Shadcn UI initialized — `Card`, `Badge`, `Button`, `Input` components in `src/components/ui/`
- `src/lib/utils.ts` — `cn()` utility for Tailwind class merging
- `src/lib/firebase/config.ts` — Firebase singleton init (auth + db exported)
- `src/lib/firebase/auth.ts` — signIn, signUp, signOut, onAuthChange
- `src/lib/firebase/firestore.ts` — getSession, getSessions, saveSummary
- `src/types/` — CharacterConfig, Session, Message, ApiResult<T>, all shared types exported from index.ts
- `src/constants/characters.ts` — all 6 Spark Squad characters with voicePrompts
- `src/constants/prompts.ts` — BASE_TUTOR_RULES, SUMMARY_SYSTEM_PROMPT
- `src/constants/subjects.ts` — Subject, GradeBand, MAX_SESSION_STARS, TARGET_SESSION_MESSAGES
- `src/store/useChildStore.ts` — character selection state
- `src/store/useSessionStore.ts` — active session state
- `src/store/useAuthStore.ts` — auth state mirror
- Firebase project `spark-tutor-96f9c`: Auth (Email/Password) + Firestore (Standard, production mode) live
- All `.env.local` keys filled (Firebase client + admin, Anthropic, Gemini)
- GitHub: https://github.com/CGalentin/spark-tutor — branches: main, dev, all feature branches
- `src/app/(auth)/layout.tsx` — centered auth layout with Spark Tutor branding + privacy footer
- `src/app/(auth)/login/page.tsx` + `src/components/parent/LoginForm.tsx` — parent login with Firebase signIn, friendly error messages, link to /signup
- `src/app/(auth)/signup/page.tsx` + `src/components/parent/SignupForm.tsx` — parent signup with Firebase signUp, confirm password, friendly error messages
- Root `src/app/page.tsx` redirects to `/login`
- `src/components/shared/AuthProvider.tsx` — Firebase onAuthStateChanged listener, hydrates useAuthStore
- `src/components/shared/AuthRouteGuard.tsx` — redirects authenticated parents away from /login and /signup
- `src/components/shared/LoadingSpinner.tsx` — reusable full-screen loading state
- `src/hooks/useAuth.ts` — reads auth state from useAuthStore with individual selectors
- `src/app/(parent)/layout.tsx` — protected layout: unauthenticated users redirected to /login
- Root `src/app/layout.tsx` wraps all pages in AuthProvider

## What Works Right Now (Week 1 additions)
- `src/components/child/ChatInput.tsx` — large input + 🚀 send button, 48px touch targets, Enter-key support
- `src/components/child/SubjectSelector.tsx` — Math 🔢 / Reading 📖 picker, 80px touch targets
- `src/app/(child)/chat/page.tsx` — full chat page: MascotAvatar + SubjectSelector + ChatMessageList + ChatInput; SSE streaming from /api/chat; [STAR EARNED] detection; redirect guard to /character-select
- Vercel deployment live: https://spark-tutor-app.vercel.app (all 11 env vars set, zero build errors, publicly accessible)
- dev → main merged for Week 1 milestone

## What Does Not Work Yet
- No parent dashboard
- No RAG layer (Week 2)
- No Firestore session persistence (session ID is client-side only until PR 2-xx)
- No agentic session summary (Week 3)
- No MCP math tool (Week 4)

## Completion Checklist (Final MVP Gate)
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
