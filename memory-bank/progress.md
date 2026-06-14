# Progress — Spark Tutor

## Overall Status
**Week 1 of 4 — In Progress**

## Week-by-Week Summary
| Week | Theme | Status |
|---|---|---|
| Week 1 | Foundation & Chat UI | 🔄 In Progress |
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
| 1-05 | Firebase Client Setup | `feature/firebase-client` | ⏳ Next |
| 1-06 | Shared Types | `feature/shared-types` | ⏳ Pending |
| 1-07 | Character Constants | `feature/character-constants` | ⏳ Pending |
| 1-08 | Zustand Stores | `feature/zustand-stores` | ⏳ Pending |
| 1-09 | Auth Layout & Login Page | `feature/auth-pages` | ⏳ Pending |
| 1-10 | Auth Provider & Route Protection | `feature/auth-provider` | ⏳ Pending |
| 1-11 | Character Selection Screen | `feature/character-selection` | ⏳ Pending |
| 1-12 | Claude API Route | `feature/claude-api` | ⏳ Pending |
| 1-13 | Chat UI — Message Bubbles | `feature/chat-bubbles` | ⏳ Pending |
| 1-14 | Chat UI — Input & Session | `feature/chat-input` | ⏳ Pending |
| 1-15 | Week 1 Integration Test & Deploy | `dev` | ⏳ Pending |

---

## What Works Right Now
- Next.js 16.2.9 project scaffolded with TypeScript, Tailwind, ESLint, App Router
- Full `/src` folder structure in place
- Memory bank initialized in `memory-bank/`
- All dependencies installed: Firebase, firebase-admin, @anthropic-ai/sdk, @google/generative-ai, zustand, clsx, tailwind-merge
- Shadcn UI initialized (Tailwind v4 compatible) — card, badge, button, input components ready
- `src/lib/utils.ts` with `cn()` utility created by Shadcn
- Git initialized, pushed to GitHub: https://github.com/CGalentin/spark-tutor
- Branches: `main`, `dev`, `feature/project-scaffold`, `feature/folder-structure`, `feature/dependencies`

## What Does Not Work Yet
- No dependencies installed (Firebase, Claude, Gemini, Zustand, Shadcn)
- No environment variables configured
- No Firebase project connected
- No auth, no database, no AI calls
- No real UI beyond the default Next.js starter page

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
