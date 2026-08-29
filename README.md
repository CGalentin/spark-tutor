# Spark Tutor ⚡

> An AI-powered K-1 tutoring app where children ages 5–6 learn Math and Reading through Socratic conversations with animated mascot characters.

**Live:** [spark-tutor-app.vercel.app](https://spark-tutor-app.vercel.app)

---

## Tech Stack

![Next.js](https://img.shields.io/badge/Next.js-16.2-black?logo=nextdotjs)
![TypeScript](https://img.shields.io/badge/TypeScript-Strict-blue?logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4-38bdf8?logo=tailwindcss)
![Firebase](https://img.shields.io/badge/Firebase-Auth%20%2B%20Firestore-orange?logo=firebase)
![Claude](https://img.shields.io/badge/Claude-Haiku-blueviolet?logo=anthropic)
![Gemini](https://img.shields.io/badge/Gemini-Embeddings-4285F4?logo=google)
![Vercel](https://img.shields.io/badge/Vercel-Deployed-black?logo=vercel)

---

## What It Does

Children pick one of six animated **Spark Squad** characters (Blip 🤖, Finn 🦊, Zorro 🐲, Luna 🐰, Pip 🧚, Nova 🦉), give it a custom name, then have a Socratic AI conversation about Math or Reading. The mascot never just gives answers — it asks guiding questions until the child figures it out.

After each session, parents receive an **AI-generated summary** on their dashboard showing topics covered, areas to practice, and an encouragement note.

---

## Architecture

```
Browser (Child or Parent)
        │
        ▼
  Next.js App Router (Vercel)
        │
   ┌────┴──────────────────────────────────┐
   │  Client Components                    │
   │  Server Components                    │
   └────┬──────────────────────────────────┘
        │
   ┌────▼──────────────────────────────────┐
   │  API Routes                           │
   │  /api/chat        → Claude (SSE)      │
   │  /api/summary     → Claude (agentic)  │
   │  /api/rag         → Gemini + Firebase │
   │  /api/mcp/math-problem → Claude MCP   │
   │  /api/session/*   → Firestore         │
   └────┬──────────────────────────────────┘
        │
   ┌────▼──────────────────────────────────┐
   │  External Services                    │
   │  Claude   — chat, summary, MCP tool   │
   │  Gemini   — embeddings only           │
   │  Firebase — auth + Firestore          │
   │  Upstash  — Redis rate limiting       │
   └───────────────────────────────────────┘
```

### Dual-LLM Pattern
**Claude** handles all text generation (mascot voice, session summaries, MCP math problems). **Gemini** handles embeddings only — it never generates user-facing text. This separation gives Claude's stronger safety controls and character consistency to children, while using Gemini's cost-efficient embedding API for the RAG pipeline.

### RAG Pipeline
536 curriculum chunks (202 math + 334 reading) from open-licensed K-1 PDFs are embedded with Gemini and stored in Firestore. Every child message triggers a cosine similarity search — the top 3 relevant chunks are injected into Claude's system prompt as grounding context, keeping responses accurate to real K-1 curriculum.

### MCP Tool Pattern
When a child asks for a practice problem, `/api/chat` calls `/api/mcp/math-problem` before falling through to RAG. Claude generates a grade-appropriate problem and hint — the **answer is never sent to the client**. Claude then guides the child Socratically toward the answer.

### Agentic Session Summary
When a session ends, `/api/session/end` fire-and-forgets a call to `/api/summary`. Claude analyzes the full session transcript and returns structured JSON: `topicsCovered`, `areasForPractice`, `encouragementNote`. This saves to Firestore and appears live on the parent dashboard via `onSnapshot`.

### Composable System Prompt (5 Layers)
Every Claude call assembles the system prompt from independent layers:
1. `BASE_TUTOR_RULES` — K-1 safety + Socratic method (never changes)
2. `CHARACTER_VOICE` — personality loaded from character config
3. `SUBJECT_CONTEXT` — math vs. reading
4. `RAG_CONTEXT` — top-3 curriculum chunks (omitted on retrieval failure)
5. `MCP_CONTEXT` — practice problem + hint (replaces RAG when triggered)

---

## Portfolio Talking Points

**1. Dual-LLM Architecture Decision**
Using two separate AI providers was a deliberate tradeoff: Claude's Constitutional AI training makes it safer for K-1 children (no harmful content, age-appropriate language), while Gemini's embedding API is significantly cheaper for processing 536 curriculum chunks at ingestion time. Each LLM does only what it's best at.

**2. Agentic Summary with Structured Output**
The parent dashboard summary is fully agentic — no template, no hardcoded fields. Claude reads the raw session transcript and autonomously decides what topics were covered and what the child should practice next. The response is parsed from JSON and saved to Firestore, then rendered live on the dashboard via `onSnapshot`.

**3. Fail-Safe by Design**
Every AI call is wrapped in graceful degradation: RAG failure → Claude still responds without curriculum context. MCP failure → falls through to RAG. Upstash Redis failure → rate limit bypassed, chat continues. Firestore write failure → stream still closes cleanly. The child never sees a crash — only warm mascot messages.

---

## Local Setup

```bash
# 1. Clone the repo
git clone https://github.com/CGalentin/spark-tutor.git
cd spark-tutor

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.example .env.local
# Fill in all values in .env.local (see keys below)

# 4. Start the dev server
npm run dev
# → http://localhost:3000
```

### Required Environment Variables

```bash
# Firebase (client-side — safe for browser)
NEXT_PUBLIC_FIREBASE_API_KEY
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
NEXT_PUBLIC_FIREBASE_PROJECT_ID
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
NEXT_PUBLIC_FIREBASE_APP_ID

# Firebase Admin (server-side only)
FIREBASE_ADMIN_PROJECT_ID
FIREBASE_ADMIN_CLIENT_EMAIL
FIREBASE_ADMIN_PRIVATE_KEY

# AI APIs (server-side only)
ANTHROPIC_API_KEY       # Claude — chat, summaries, MCP tool
GEMINI_API_KEY          # Gemini — embeddings only

# Rate limiting (optional — app works without it)
UPSTASH_REDIS_REST_URL
UPSTASH_REDIS_REST_TOKEN
```

### Re-running the RAG Ingestion (optional)

The Firestore corpus (536 chunks) is already live. To re-ingest from source PDFs:

```bash
# Add PDFs to rag-sources/ (gitignored)
npx ts-node --project tsconfig.scripts.json scripts/rag/ingestDocuments.ts
```

---

## Project Structure

```
src/
├── app/
│   ├── (auth)/          # Login + signup pages
│   ├── (child)/         # Character select + chat
│   ├── (parent)/        # Parent dashboard
│   ├── api/             # All API routes
│   └── privacy/         # COPPA privacy policy
├── components/
│   ├── child/           # Child UI (custom only — no Shadcn)
│   │   └── avatars/     # 6 SVG mascot components
│   ├── parent/          # Parent UI (Shadcn)
│   └── shared/          # ErrorMessage, LoadingSpinner
├── constants/           # Characters, prompts, subjects
├── hooks/               # useAuth, useStars, useSessionHistory
├── lib/
│   ├── claude/          # Client, buildSystemPrompt, buildSummaryPrompt
│   ├── firebase/        # Config, admin, auth, firestore, vectorSearch
│   ├── gemini/          # Client, embed
│   ├── mcp/             # mathProblem (generateMathProblem, detectsProblemRequest)
│   └── upstash/         # ratelimit
├── store/               # Zustand: useAuthStore, useChildStore, useSessionStore
└── types/               # Shared TypeScript types
```

---

*Built with Next.js · Firebase · Claude · Gemini · Tailwind CSS · Vercel*
