# Progress — Spark Tutor

## Overall Status
**Sprint 3 complete on local `dev` (PR 2-19). Not pushed. Next is review, then PR 2-20. | Live: https://spark-tutor-app.vercel.app**

## v2 Sprint 1 — PR Checklist

| PR | Title | Branch | Status |
|---|---|---|---|
| 2-01 | Grade Band Constants | `feature/grade-band-constants` | ✅ Done |
| 2-02 | Update System Prompt Composer | `feature/grade-band-prompt-layer` | ✅ Done |
| 2-03 | Topic Curriculum Map | `feature/topic-curriculum-map` | ✅ Done |
| 2-04 | Learning Path Firestore Types | `feature/learning-path-types` | ✅ Done |
| 2-05 | Learning Path Firestore Helpers | `feature/learning-path-firestore` | ✅ Done |
| 2-06 | Session Start Reads Learning Path | `feature/session-reads-learning-path` | ✅ Done |
| 2-07 | Sprint 1 Integration Test | `dev` | ✅ Done |

## v2 Sprint 2 — PR Checklist

| PR | Title | Branch | Status |
|---|---|---|---|
| 2-08 | Gemini Flash Client | `feature/gemini-flash-client` | ✅ Done (merged to local `dev`) |
| 2-09 | Evaluator System Prompt | `feature/evaluator-prompt` | ✅ Done (merged to local `dev`) |
| 2-10 | Topic Boundary Detection | `feature/topic-boundary-detection` | ✅ Done (merged to local `dev`) |
| 2-11 | Evaluator API Route | `feature/evaluator-api` | ✅ Done (merged to local `dev`) |
| 2-12 | Wire Evaluator Into Chat Flow | `feature/evaluator-in-chat` | ✅ Done (merged to local `dev`) |
| 2-13 | Next Topic Suggester | `feature/next-topic-suggester` | ✅ Done (merged to local `dev`) |
## v2 Sprint 3 — PR Checklist

| PR | Title | Branch | Status |
|---|---|---|---|
| 2-15 | Learning Path Injects Into Teacher Prompt | `feature/learning-path-prompt-injection` | ✅ Done (merged to local `dev`, pushed) |
| 2-16 | Parent Topic Approval API | `feature/parent-topic-approval` | ✅ Done (merged to local `dev`) |
| 2-17 | Difficulty Adaptation | `feature/difficulty-adaptation` | ✅ Done (merged to local `dev`) |
| 2-18 | Session Start Full Learning Path Integration | `feature/session-full-integration` | ✅ Done (merged to local `dev`) |
| 2-19 | Sprint 3 Integration Test | `dev` | ✅ Done (local `dev`, not pushed) |

---

## v2 Sprint 1 — What Works / What's Left

**Works now**
- Grade-band configs + prompt strings (K–3)
- Chat API accepts optional `grade` and injects Layer 4 (defaults to K)
- Topic curriculum map (`getTopics`)
- LearningPath / TopicMastery / EvaluationResult TypeScript types
- Learning path Admin helpers + client `subscribeToLearningPath`
- Session start reads or creates a learning path and returns `currentTopic`, `currentGrade`, `suggestedNextTopic`, plus a `learningPath` summary
- Chat page stores topic + grade in `useSessionStore` and sends both on every `/api/chat` request
- Sprint 1 live check: session start returns Counting to 10 / K; Firestore `learningPath/math` created; K vs grade 2 Claude language differs
- Gemini Flash `evaluateMastery` returns typed JSON
- Evaluator prompt builder with mastery rubric (71–89 close, 90–100 mastered) and curriculum next-topic hint
- Unreadable evaluator JSON falls back to score 0 / not mastered
- Topic boundary detector (`detectTopicBoundary`) + `topicMessageCount` in the session store
- `POST /api/evaluate` scores a topic, saves `evaluations[]` + mastery history
- Chat fires evaluate at topic boundaries (fire-and-forget; child UI unchanged)
- Next-topic suggester uses TOPIC_MAP + mastery history; rolls to the next grade when the current grade is done
- Sprint 2 live check: 6 Math messages on Counting to 10 → evaluate after message 6 → session `evaluations[]` + learningPath masteryHistory; score 65 / not mastered so no next-topic suggestion; chat completed before evaluate started
- Teacher prompt Layer 5 injects current topic + mastered topics; Claude stays on that topic
- Difficulty follows the last two scores on the current topic: both under 50 → easier, both over 85 → harder, otherwise normal
- Parent can approve a next topic (`POST /api/learning-path/approve`) or clear the suggestion (`POST /api/learning-path/reject`). No dashboard button yet (PR 2-22)

- Session start teaches `currentTopic` while a suggestion is waiting, saves topic/grade/difficulty on the session doc, and returns a learning-path summary

- Sprint 3 live check: Counting to 10 scored 100 and suggested Counting to 20; approve switched the path; a new session taught Counting to 20; two scores under 50 produced a fingers-and-one-hand reply

**Not built yet (Sprint 4)**
- Mastery ring, live session panel, topic suggestion card, learning-path history, summary v2, rate limits on the new endpoints

**Still v1 in production**
- Child UI, RAG corpus (K-1 chunks), parent dashboard session list

---

## v1 Week-by-Week Summary
| Week | Theme | Status |
|---|---|---|
| Week 1 | Foundation & Chat UI | ✅ Complete |
| Week 2 | RAG Layer | ✅ Complete (10/10 PRs done) |
| Week 3 | Parent Layer & Agentic Summary | ✅ Complete (11/11 PRs done) |
| Week 4 | MCP Tool & Polish | ✅ Complete (15/15 PRs done) |

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
| 2-04 | Gemini Embedding Setup | `feature/gemini-embeddings` | ✅ Done |
| 2-05 | Document Ingestion Script | `feature/ingestion-script` | ✅ Done |
| 2-06 | Ingest Reading Sources | `feature/ingest-reading` | ✅ Done |
| 2-07 | RAG Retrieval API Route | `feature/rag-retrieval` | ✅ Done |
| 2-08 | Wire RAG Into Chat | `feature/rag-in-chat` | ✅ Done |
| 2-09 | RAG Quality Check | `feature/rag-quality` | ✅ Done |
| 2-10 | Week 2 Integration Test & Deploy | `dev` | ✅ Done |

---

## Week 3 — PR Checklist

| PR | Title | Branch | Status |
|---|---|---|---|
| 3-01 | Firebase Admin Setup | `feature/firebase-admin` | ✅ Done |
| 3-02 | Session Tracking — Start | `feature/session-start` | ✅ Done |
| 3-03 | Session Tracking — Messages | `feature/session-messages` | ✅ Done |
| 3-04 | Stars Logic | `feature/stars-logic` | ✅ Done |
| 3-05 | Progress Bar | `feature/progress-bar` | ✅ Done |
| 3-06 | Session End Flow | `feature/session-end` | ✅ Done |
| 3-07 | Agentic Summary — Claude Call | `feature/agentic-summary` | ✅ Done |
| 3-08 | Save Summary to Firestore | `feature/save-summary` | ✅ Done |
| 3-09 | Parent Dashboard Layout | `feature/parent-dashboard` | ✅ Done |
| 3-10 | Session Summary Card | `feature/summary-card` | ✅ Done |
| 3-11 | Week 3 Integration Test & Deploy | `dev` | ✅ Done |

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

### Week 4 (in progress — Jun 21, 12/15 done)
- **MCP math tool** — `/api/mcp/math-problem` generates grade-appropriate problems; answer never returned to client
- **MCP routing in chat** — `detectsProblemRequest()` triggers MCP before RAG when child asks for a practice problem
- **SVG avatars** — 6 geometric SVG components (`BlipAvatar`, `FinnAvatar`, `ZorroAvatar`, `LunaAvatar`, `PipAvatar`, `NovaAvatar`)
- **Avatar animations** — CSS keyframes: idle float, thinking tilt, celebration bounce (in `globals.css`)
- **AnimatedAvatar** — wrapper component applying correct animation class; celebration auto-reverts to idle
- **CharacterCard + MascotAvatar** — emoji placeholders replaced with SVG avatars; thinking/celebrating wired to chat state
- **Mobile polish (child)** — `h-dvh`, safe-area insets, touch targets verified, font sizes 16px+
- **Mobile polish (parent)** — `min-h-dvh`, nav spacing, `SessionSummaryCard` header wraps on narrow screens
- **Error & loading UI** — `ErrorMessage.tsx` (child + parent variants); `loading.tsx` + `error.tsx` for both chat and dashboard routes
- **Rate limiting** — `src/lib/upstash/ratelimit.ts`; `chatRatelimit` (30/hr) on `/api/chat`, `summaryRatelimit` (10/hr) on `/api/summary`; fail-open when env vars absent
- **Code quality** — `.prettierrc` created; Prettier run over all 80 src files; all ESLint errors + warnings resolved; 3 `console.error` calls removed; unused imports removed
- **Husky pre-commit hook** — `husky@9` + `lint-staged@16` installed; `.husky/pre-commit` runs `tsc --noEmit && prettier --check && eslint`; `lint-staged` config in package.json; hook verified firing on commit
- **Integration test fixes** — Upstash fail-open extended to bad credentials (try/catch); `WellDoneScreen` "Play Again!" button added; Firestore security rules fixed (client reads now allowed); `firestore.rules` committed to repo

### Week 3 (complete — Jun 17)
- **verifyAuthToken helper** — shared token verification across all protected API routes
- **Session lifecycle** — `/api/session/start` (creates Firestore doc) → `/api/session/star` (increments stars) → `/api/session/end` (closes session, triggers summary)
- **Message count tracking** — `/api/chat` increments `messageCount` in Firestore per AI response
- **Stars logic** — `useStars.ts` hook + `StarBurst.tsx` animation + Firestore sync
- **Progress bar** — `SessionProgressBar.tsx` fills over 10 messages, shows star badge
- **WellDoneScreen** — full-screen celebration after session ends
- **Agentic summary** — `buildSummaryPrompt.ts` + `/api/summary` sends session transcript to Claude, parses JSON, saves to Firestore
- **Parent dashboard** — nav bar layout, `DashboardHeader`, Shadcn `Card` layout
- **Session summary card** — `useSessionHistory.ts` (onSnapshot), `SessionSummaryCard.tsx` (Shadcn Card + Badge)
- **13 routes** building clean on Vercel production

### Week 2 (complete — Jun 17)
- **RAG source documents** — 17 PDFs in `rag-sources/` (9 math, 8 reading), CC-licensed, gitignored
- **CurriculumChunk types** — `src/types/rag.ts` (`CurriculumChunk`, `RankedChunk`, `GradeBand`)
- **vectorSearch.ts** — `saveChunk()`, `chunkExists()`, `queryByEmbedding()` (in-memory cosine similarity), `countChunks()`
- **chunkDocument.ts** — PDF → text extraction → 200–400 word chunks with 50-word overlap + full metadata
- **Gemini embedding** — `src/lib/gemini/client.ts` + `embed.ts` using `gemini-embedding-001` (3072-dim vectors)
- **Firestore corpus** — 202 math chunks + 334 reading chunks = **536 total chunks** in `curriculum_chunks` collection
- **Ingestion script** — `scripts/rag/ingestDocuments.ts` — full pipeline with deduplication (never re-embeds)
- **RAG retrieval route** — `src/app/api/rag/route.ts` — POST `{ query, subject }` → embed → cosine search → top-3 text
- **RAG wired into chat** — `/api/chat` now calls Gemini embed + Firestore query before building Claude system prompt
- **Quality verified** — `scripts/rag/testRetrieval.ts` — 10/10 sample K-1 questions return relevant chunks (score 0.66–0.75)
- **Model note**: `text-embedding-004` retired; `gemini-embedding-001` is the current stable model (3072 dims)

## Week 4 — PR Checklist (In Progress)

| PR | Title | Branch | Status |
|---|---|---|---|
| 4-01 | MCP Math Problem Generator | `feature/mcp-math-tool` | ✅ Done |
| 4-02 | Wire MCP Into Chat Router | `feature/mcp-routing` | ✅ Done |
| 4-03 | Character SVG Avatars | `feature/character-avatars` | ✅ Done |
| 4-04 | Character Animations | `feature/character-animations` | ✅ Done |
| 4-05 | Update Character Select + MascotAvatar | `feature/character-select-avatars` | ✅ Done |
| 4-06 | Mobile Polish — Child UI | `feature/mobile-polish-child` | ✅ Done |
| 4-07 | Mobile Polish — Parent UI | `feature/mobile-polish-parent` | ✅ Done |
| 4-08 | Privacy Policy Page | `feature/privacy-policy` | ✅ Done |
| 4-09 | Error States & Loading UI | `feature/error-and-loading` | ✅ Done |
| 4-10 | Rate Limiting | `feature/rate-limiting` | ✅ Done |
| 4-11 | Prettier & Lint Cleanup | `feature/code-quality` | ✅ Done |
| 4-12 | Husky Pre-commit Hook | `feature/husky` | ⏳ Pending |
| 4-13 | Final End-to-End Test | `dev` | ⏳ Pending |
| 4-14 | Vercel Production Deploy | `main` | ⏳ Pending |
| 4-15 | Portfolio README | `feature/readme` | ⏳ Pending |

---

## What Does Not Work Yet
- Nothing blocking — all tooling in place; PRs 4-13 through 4-15 are final testing + deploy + docs

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
