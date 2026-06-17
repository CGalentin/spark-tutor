# Active Context — Spark Tutor

## Current Status
**Week 2 — RAG Layer — COMPLETE ✅ (10/10 PRs done)**
**Week 3 — Parent Layer & Agentic Summary — NOT STARTED ← START HERE**

---

## Completed This Session (Jun 17)

- [x] PR 2-04 · Gemini Embedding Setup (`feature/gemini-embeddings`)
  - `src/lib/gemini/client.ts` — GoogleGenerativeAI singleton
  - `src/lib/gemini/embed.ts` — `embedText(text)` using `gemini-embedding-001` (3072 dims)
  - `scripts/rag/testEmbed.ts` — smoke test confirming vector length = 3072
  - **Model change**: `text-embedding-004` is retired — `gemini-embedding-001` (3072 dims) is the current stable model

- [x] PR 2-05 · Document Ingestion Script (`feature/ingestion-script`)
  - `scripts/rag/ingestDocuments.ts` — full pipeline: chunk → embed → save to Firestore
  - 9 math PDFs → 202 chunks saved to Firestore
  - Deduplication via `chunkExists()` — safe to re-run

- [x] PR 2-06 · Ingest Reading Sources (`feature/ingest-reading`)
  - 8 reading PDFs → 334 chunks saved to Firestore
  - **Total corpus**: 202 math + 334 reading = 536 chunks in `curriculum_chunks`

- [x] PR 2-07 · RAG Retrieval API Route (`feature/rag-retrieval`)
  - `src/app/api/rag/route.ts` — POST `{ query, subject }` → embed → cosine search → top-3 texts
  - Added `RagRequest`, `RagResponse` types to `src/types/api.ts`; exported from `src/types/index.ts`

- [x] PR 2-08 · Wire RAG Into Chat (`feature/rag-in-chat`)
  - `src/app/api/chat/route.ts` updated — embeds child message, fetches top-3 chunks, injects into Layer 3
  - Graceful fallback: if RAG fails, chat continues without curriculum context

- [x] PR 2-09 · RAG Quality Check (`feature/rag-quality`)
  - `scripts/rag/testRetrieval.ts` — 10 sample K-1 questions, all 10/10 PASS
  - Similarity scores: 0.66–0.75; correct topic labels and sources surfaced

- [x] PR 2-10 · Week 2 Integration Test & Deploy (`dev`)
  - `npx tsc --noEmit` — zero errors ✅
  - `npm run build` — zero errors, 9 routes building (incl. `/api/rag`) ✅
  - Deployed to Vercel production: https://spark-tutor-app.vercel.app ✅
  - `dev` → `main` merged ✅

---

## Up Next — Week 3: Parent Layer & Agentic Summary

1. **PR 3-01** · Firebase Admin Setup (`feature/firebase-admin`) ← START HERE
   - `src/lib/firebase/admin.ts` — Firebase Admin SDK init + `verifyAuthToken` helper
   - Note: admin.ts may already exist from PR 1-12 (`adminAuth`); check before creating

2. **PR 3-02** · Session Tracking — Start (`feature/session-start`)
   - `src/app/api/session/start/route.ts` — creates Firestore session under `users/{parentUID}/sessions/{sessionID}`

3. **PR 3-03** · Session Tracking — Messages (`feature/session-messages`)
   - Update `/api/chat` to accept `sessionId`, increment `messagesCount` in Firestore

4. **PR 3-04** · Stars Logic (`feature/stars-logic`)
   - `src/hooks/useStars.ts`, sync star count to Firestore, `StarBurst.tsx` animation

5. **PR 3-05** · Progress Bar (`feature/progress-bar`)
   - `SessionProgressBar.tsx` — fills over 10-message session, shows stars

6. **PR 3-06** · Session End Flow (`feature/session-end`)
   - `EndSessionButton.tsx`, `/api/session/end/route.ts`, triggers agentic summary

7. **PR 3-07** · Agentic Summary — Claude Call (`feature/agentic-summary`)
   - `src/app/api/summary/route.ts` — sends conversation to Claude, gets structured summary

8. **PR 3-08** · Save Summary to Firestore (`feature/save-summary`)
   - Save summary to `users/{parentUID}/sessions/{sessionID}/summary`

9. **PR 3-09** · Parent Dashboard Layout (`feature/parent-dashboard`)
   - Real dashboard with Shadcn Card layout, DashboardHeader

10. **PR 3-10** · Session Summary Card (`feature/summary-card`)
    - `SessionSummaryCard.tsx`, `useSessionHistory.ts` with `onSnapshot`

11. **PR 3-11** · Week 3 Integration Test & Deploy (`dev`)

---

## Active Branch
`main` (just merged) — create `feature/firebase-admin` from `dev` at start of next session

## Known Issues / Decisions
- `gemini-embedding-001` produces 3072-dim vectors (not 768 — `text-embedding-004` is retired)
- In-memory cosine similarity confirmed fast enough — 536 chunks loaded and ranked in <1s
- CKLA Instructional Companion PDFs are mostly image-based → low chunk counts (3–4 chunks each)
  → Teacher Guide + scope/sequence PDFs yield the most text (126 + 31 + 16 chunks)
- PowerShell on Windows 10 — no bash heredoc; use `-m "message"` for git commits
- Git rule: always merge feature branch to dev BEFORE creating next feature branch
- `/api/chat` now adds ~1–2s latency per request due to Gemini embed call before Claude
  → Acceptable for MVP; can cache query embeddings in v2

## Recent Decisions & Notes
- PR 3-01 (`admin.ts`) may already be partially done from Week 1 PR 1-12 — verify first
- The `buildSystemPrompt` `ragContext` slot was already wired in PR 1-12; PR 2-08 just fills it
- Week 3 adds Firestore persistence for sessions — currently everything is client-side only
