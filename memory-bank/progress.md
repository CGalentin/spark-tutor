# Progress — Spark Tutor

## Overall Status
**Week 2 of 4 — In Progress (3/10 PRs done) | Live: https://spark-tutor-app.vercel.app**

## Week-by-Week Summary
| Week | Theme | Status |
|---|---|---|
| Week 1 | Foundation & Chat UI | ✅ Complete |
| Week 2 | RAG Layer | 🔄 In Progress (3/10 done) |
| Week 3 | Parent Layer & Agentic Summary | ⏳ Not Started |
| Week 4 | MCP Tool & Polish | ⏳ Not Started |

---

## Week 1 — PR Checklist (All Done)

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

## Week 2 — PR Checklist

| PR | Title | Branch | Status |
|---|---|---|---|
| 2-01 | Collect Source Documents | `feature/rag-source-docs` | ✅ Done |
| 2-02 | Firebase Vector Search Setup | `feature/vector-search-setup` | ✅ Done |
| 2-03 | Document Chunking Utility | `feature/doc-chunking` | ✅ Done |
| 2-04 | Gemini Embedding Setup | `feature/gemini-embeddings` | ⏳ Next |
| 2-05 | Document Ingestion Script | `feature/ingestion-script` | ⏳ |
| 2-06 | Ingest Reading Sources | `feature/ingest-reading` | ⏳ |
| 2-07 | RAG Retrieval API Route | `feature/rag-retrieval` | ⏳ |
| 2-08 | Wire RAG Into Chat | `feature/rag-in-chat` | ⏳ |
| 2-09 | RAG Quality Check | `feature/rag-quality` | ⏳ |
| 2-10 | Week 2 Integration Test & Deploy | `dev` | ⏳ |

---

## What Works Right Now

### Week 1 (complete)
- Next.js 16.2.9, TypeScript strict mode, Tailwind v4, App Router
- Full `/src` folder structure established
- Firebase Auth (Email/Password) + Firestore live (`spark-tutor-96f9c`)
- All 6 Spark Squad characters (Blip🤖 Finn🦊 Zorro🐲 Luna🐰 Pip🧚 Nova🦉)
- Zustand stores: `useChildStore`, `useSessionStore`, `useAuthStore`
- Auth flow: signup → login → dashboard (placeholder) → character select → name → subject
- Claude chat route (`/api/chat`): SSE streaming, `[STAR EARNED]` detection, model `claude-haiku-4-5-20251001`
- Full chat UI: MascotAvatar, ChatBubble (child/mascot), ChatMessageList (auto-scroll, typing indicator), ChatInput, SubjectSelector
- Vercel deployment: https://spark-tutor-app.vercel.app — zero build errors, all routes working

### Week 2 — In Progress
- **RAG source documents** — 17 PDFs downloaded locally to `rag-sources/` (9 math, 8 reading), CC-licensed, gitignored
- **CurriculumChunk types** — `src/types/rag.ts` (`CurriculumChunk`, `RankedChunk`, `GradeBand`)
- **vectorSearch.ts** — `saveChunk()`, `chunkExists()`, `queryByEmbedding()` (cosine similarity), `countChunks()`
- **chunkDocument.ts** — PDF → text extraction → 200–400 word chunks with 50-word overlap + full metadata

## What Does Not Work Yet
- RAG layer not wired to chat (PRs 2-04 through 2-08 remaining)
- No parent dashboard (placeholder only — Week 3)
- No Firestore session persistence (client-side only — Week 3)
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
