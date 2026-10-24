# Spark Tutor ⚡

> An AI-powered K–3 tutoring app where children in Kindergarten through Grade 3 learn Math and Reading through Socratic conversations with animated mascot characters.

**Live:** [spark-tutor-app.vercel.app](https://spark-tutor-app.vercel.app)

---

## Tech Stack

![Next.js](https://img.shields.io/badge/Next.js-16.2-black?logo=nextdotjs)
![TypeScript](https://img.shields.io/badge/TypeScript-Strict-blue?logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4-38bdf8?logo=tailwindcss)
![Firebase](https://img.shields.io/badge/Firebase-Auth%20%2B%20Firestore-orange?logo=firebase)
![Claude](https://img.shields.io/badge/Claude-Haiku-blueviolet?logo=anthropic)
![Gemini](https://img.shields.io/badge/Gemini-Embeddings-4285F4?logo=google)
![Gemini Flash](https://img.shields.io/badge/Gemini_Flash-Evaluator-4285F4?logo=google)
![Vercel](https://img.shields.io/badge/Vercel-Deployed-black?logo=vercel)

The Teacher is Claude Haiku. The Evaluator is Gemini Flash (`gemini-3.5-flash`). Gemini embeddings are a separate job: they only turn curriculum text into vectors for search.

---

## What It Does

Children pick one of six animated **Spark Squad** characters (Blip 🤖, Finn 🦊, Zorro 🐲, Luna 🐰, Pip 🧚, Nova 🦉), give it a custom name, then have a Socratic AI conversation about Math or Reading. The mascot never just gives answers — it asks guiding questions until the child figures it out. The Teacher's sentence length and question style follow the child's grade band: Kindergarten, Grade 1, Grade 2, or Grade 3.

A second agent scores the lesson in the background. The child never sees that score. The parent does, on the dashboard, and the parent decides when the next topic starts.

After each session, parents receive an **AI-generated summary** showing topics covered, areas to practice, and an encouragement note. When the Evaluator has run, the session card also shows the mastery score.

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
   ┌────▼──────────────────────────────────────────┐
   │  API Routes                                   │
   │  /api/chat        → Teacher (Claude, SSE)     │
   │  /api/evaluate    → Evaluator (Gemini Flash)  │
   │  /api/summary     → Claude (agentic)          │
   │  /api/rag         → Gemini embeddings         │
   │  /api/mcp/math-problem → Claude MCP           │
   │  /api/session/*   → Firestore                 │
   │  /api/learning-path/approve|reject            │
   │       → parent confirms the next topic        │
   └────┬──────────────────────────────────────────┘
        │
   ┌────▼──────────────────────────────────────────┐
   │  External Services                            │
   │  Claude        — Teacher voice, summary, MCP  │
   │  Gemini Flash  — silent mastery scores        │
   │  Gemini        — embeddings only              │
   │  Firebase      — auth + Firestore             │
   │  Upstash       — Redis rate limiting          │
   └───────────────────────────────────────────────┘
```

### Multi-agent flow

Two models share one lesson, and they do not do each other's job.

**Teacher Agent (Claude Haiku)** talks to the child. It uses the mascot's voice and the Socratic method. It stays on the current topic until a parent approves a change.

**Evaluator Agent (Gemini Flash)** is silent. Every 6 child messages, the chat page calls `/api/evaluate` without waiting on it, so the conversation does not pause. Flash returns a mastery score from 0 to 100. A score of 90 or higher means the topic is mastered. The model name in code is `gemini-3.5-flash`.

**Agentic learning path** is one Firestore document per parent and subject (`users/{parentUID}/learningPath/{subject}`). It stores the current grade, the current topic, finished topics, and the score history. When a topic is mastered, the path stores a suggested next topic and sets `parentApproved` to false. The child keeps practicing the current topic.

**Parent approval** is the only way the topic changes. The dashboard shows a card with two choices: start the suggested topic, or keep practicing. Approve writes the new topic and adds the topic being left to `topicsCompleted`. Reject clears the suggestion and leaves the current topic in place. The Evaluator never moves the topic on its own.

```
Child message
    → Teacher (Claude Haiku) replies in the mascot's voice
    → every 6 child messages, Evaluator (Gemini Flash) scores mastery
    → a score of 90 or higher saves a suggested next topic in Firestore
    → parent approves that topic, or keeps the current one
    → the next session teaches whichever topic the parent left in place
```

### Teacher and Evaluator

**Claude** writes every sentence the child reads: mascot chat, session summaries, and MCP math problems. **Gemini embeddings** never write those sentences. **Gemini Flash** only scores mastery for the parent. Flash notes stay off the child chat screen. Claude's safety controls and character voice stay on the conversation. Gemini stays on the cheaper jobs: search vectors and silent scoring.

### RAG Pipeline

536 curriculum chunks (202 math + 334 reading) from open-licensed K–1 PDFs are embedded with Gemini and stored in Firestore. Every child message triggers a cosine similarity search — the top 3 relevant chunks are injected into Claude's system prompt as grounding context. The grade-band prompts and the topic map already cover Kindergarten through Grade 3. The stored chunk set is still the K–1 corpus.

### MCP Tool Pattern

When a child asks for a practice problem, `/api/chat` calls the math-problem tool before falling through to RAG. Claude generates a grade-appropriate problem and hint — the **answer is never sent to the client**. Claude then guides the child Socratically toward the answer.

### Agentic Session Summary

When a session ends, `/api/session/end` fire-and-forgets a call to `/api/summary`. Claude reads the transcript and, when they exist, the session's mastery scores. It returns structured JSON: `topicsCovered`, `areasForPractice`, `encouragementNote`. This saves to Firestore and appears live on the parent dashboard via `onSnapshot`. The session card reads the score from the saved evaluation, not from Claude's JSON.

### Composable System Prompt (7 Layers)

Every Teacher call assembles the system prompt from independent layers. Learning path, RAG, and MCP are left out when they do not apply:

1. `BASE_TUTOR_RULES` — safety + Socratic method (never changes)
2. `CHARACTER_VOICE` — personality loaded from the character config
3. `SUBJECT_CONTEXT` — math vs. reading
4. `GRADE_BAND` — how to talk for K, 1, 2, or 3 (defaults to Kindergarten)
5. `LEARNING_PATH` — current topic, topics already mastered, and a difficulty hint
6. `RAG_CONTEXT` — top-3 curriculum chunks (omitted on retrieval failure)
7. `MCP_CONTEXT` — practice problem + hint (replaces RAG when triggered)

The difficulty hint looks at the last two scores on the current topic. Both under 50 means easier language. Both over 85 means a slightly harder variation. Any other pair, including a mix of a low score and a high score, stays on the normal grade-band voice.

---

## Portfolio Talking Points

**1. Dual-LLM Architecture Decision**
Claude teaches. Gemini embeddings search the curriculum. Gemini Flash scores mastery and never speaks to the child. Claude's Constitutional AI training is the safer voice for K–3 children. Gemini is the cheaper worker for 536 chunk embeddings and for a silent score after every topic block.

**2. Agentic Summary with Structured Output**
The parent dashboard summary is fully agentic — no template, no hardcoded fields. Claude reads the raw session transcript and autonomously decides what topics were covered and what the child should practice next. The response is parsed from JSON and saved to Firestore, then rendered live on the dashboard via `onSnapshot`.

**3. Fail-Safe by Design**
Every AI call is wrapped in graceful degradation: RAG failure → Claude still responds without curriculum context. MCP failure → falls through to RAG. Evaluator failure → the chat continues and the child sees nothing. Upstash Redis failure → rate limit bypassed, chat continues. Firestore write failure → stream still closes cleanly. The child never sees a crash — only warm mascot messages.

**4. Multi-agent Orchestration**
The Teacher and the Evaluator are separate on purpose. Claude keeps the mascot voice and the lesson. Gemini Flash only judges mastery. The child UI fires the score in the background, so a slow score cannot freeze the chat.

**5. Human-in-the-loop Agentic Design**
The Evaluator can suggest the next topic. It cannot start that topic. The suggestion waits on the parent dashboard until the parent confirms it or chooses to keep practicing. The parent is the gate between an AI recommendation and the next lesson.

**6. Difficulty Adaptation from Mastery History**
The Teacher does not use one difficulty for the whole grade. It reads the last two scores on the current topic and shifts the prompt: easier, normal, or harder. A single score is not enough to shift. The grade-band layer still sets the ceiling for sentence length and vocabulary.

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
ANTHROPIC_API_KEY       # Claude — Teacher chat, summaries, MCP tool
GEMINI_API_KEY          # Gemini — embeddings and the Flash evaluator

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
│   ├── api/             # Chat, evaluate, summary, RAG, MCP, session, learning-path
│   └── privacy/         # COPPA privacy policy
├── components/
│   ├── child/           # Child UI (custom only — no Shadcn)
│   │   └── avatars/     # 6 SVG mascot components
│   ├── parent/          # Parent UI (Shadcn): live session, suggestion, history
│   └── shared/          # ErrorMessage, LoadingSpinner
├── constants/           # Characters, prompts, grade bands, topic map
├── hooks/               # useAuth, useStars, useSessionHistory, useLiveSession, useLearningPath
├── lib/
│   ├── claude/          # Teacher prompt (7 layers), difficulty hint, summary prompt
│   ├── firebase/        # Config, admin, auth, firestore, learning path, vectorSearch
│   ├── gemini/          # Embeddings, Flash client, evaluateMastery, suggestNextTopic
│   ├── mcp/             # mathProblem + topic-boundary detector
│   └── upstash/         # ratelimit
├── store/               # Zustand: useAuthStore, useChildStore, useSessionStore
└── types/               # Shared TypeScript types, including MASTERED_SCORE (90)
```

---

*Built with Next.js · Firebase · Claude · Gemini · Tailwind CSS · Vercel*
