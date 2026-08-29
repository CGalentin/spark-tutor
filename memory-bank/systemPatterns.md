# System Patterns — Spark Tutor

## Architecture Overview
```
Browser (Child or Parent)
        │
        ▼
  Next.js App Router (Vercel)
        │
   ┌────┴─────────────────┐
   │  Client Components   │  ← React UI, Zustand state, Firebase listeners
   │  Server Components   │  ← Data fetching, layout
   └────┬─────────────────┘
        │
   ┌────▼──────────────────────────────────────┐
   │           API Routes (/app/api)            │
   │  /api/chat      → Claude (streaming)       │
   │  /api/summary   → Claude (agentic)         │
   │  /api/rag       → Gemini embed + Firebase  │
   │  /api/mcp/math-problem → Claude MCP tool   │
   │  /api/session/start|end → Firestore        │
   └────┬──────────────────────────────────────┘
        │
   ┌────▼──────────────────────────────────────┐
   │  External Services                         │
   │  Claude (Anthropic) — chat + summary       │
   │  Gemini (Google)    — embeddings only      │
   │  Firebase Auth      — parent auth          │
   │  Firestore          — sessions + summaries │
   │  Firestore (curriculum_chunks) — RAG store  │
   └───────────────────────────────────────────┘
```

## Key Architectural Patterns

### 1. Composable System Prompt (4 Layers)
Every Claude chat call builds the system prompt from four layers (Layer 4 only injected when RAG returns results):
```
Layer 1: BASE_TUTOR_RULES    — never changes; enforces K-1 safety + Socratic method
Layer 2: CHARACTER_VOICE     — loaded from constants/characters.ts by selected character id
Layer 3: SUBJECT_CONTEXT     — which subject (math vs reading) this session covers
Layer 4: RAG_CONTEXT         — top 3 curriculum chunks via in-memory cosine similarity on Firestore
                               (omitted if RAG retrieval fails — graceful fallback)
```
This lets us swap or update any layer without touching the others.
Implemented in: `src/lib/claude/buildSystemPrompt.ts`

### 2. RAG Pipeline
```
Offline (ingestion scripts — run once, not in the app):
  scripts/rag/chunkDocument.ts   → PDF → overlapping 200-400 word chunks + metadata
  scripts/rag/ingestDocuments.ts → chunk → embedText() → saveChunk() to Firestore
                                   (dedup via chunkExists(); safe to re-run)

Online (per child message in /api/chat):
  child message → embedText() → queryByEmbedding(subject, top 3) → inject into Layer 4
```
Corpus: 202 math chunks + 334 reading chunks = 536 total in `curriculum_chunks` Firestore collection.
Cosine similarity is computed in-memory (all subject-filtered chunks fetched, ranked, top-3 returned).
Why not Firebase Vector Search extension? Corpus < 1 000 chunks; no index config needed; upgrade later if needed.

### 3. Dual-LLM Pattern
- **Claude** → all conversation generation (chat + session summaries)
- **Gemini** → embeddings only (never generates text for users)
This separation is intentional: Claude has stronger safety controls and character voice consistency; Gemini is cost-efficient for embedding at scale.

### 4. MCP Tool Pattern
The math problem generator is a Next.js API route that Claude can "call" during a session:
- Input: `{ grade, topic, difficulty }`
- Output to Claude: `{ problem, hint }` — the `answer` field is NEVER sent to client
- Claude receives the problem and hint, then guides the child Socratically toward the answer

### 5. Firestore Data Structure
```
users/{parentUID}/
  sessions/{sessionID}/
    subject: 'math' | 'reading'
    characterType: string
    characterName: string        ← fictional name chosen by child
    startedAt: Timestamp
    endedAt: Timestamp
    messageCount: number
    starsEarned: number
    summary/
      topicsCovered: string[]
      areasForPractice: string[]
      encouragementNote: string
      generatedAt: Timestamp
```
All child session data lives under the parent UID — no child accounts exist.

### 6. API Response Shape
Every API route returns this consistent shape:
```typescript
type ApiResult<T> =
  | { success: true; data: T }
  | { success: false; error: string };
```

### 7. Client vs Server Components Rule
- Default to Server Components
- Only add `'use client'` when needed: `useState`, `useEffect`, event handlers, Zustand, Firebase listeners
- Keep client components as small (leaf node) as possible

### 8. Firestore Access Pattern
- Components NEVER write to Firestore directly
- Client-side reads go through service functions in `/src/lib/firebase/` (using client SDK)
- Server-side reads/writes go through `adminDb` in `/src/lib/firebase/admin.ts` (Admin SDK, API routes only)
- Real-time data (parent dashboard) uses `subscribeToSessions()` → `onSnapshot` with cleanup in `useEffect`

### 10. Session Lifecycle
```
Child picks subject → handleSubjectSelect → POST /api/session/start
  → creates Firestore doc users/{uid}/sessions/{id}
  → returns sessionId → stored in useSessionStore

Each chat message:
  → POST /api/chat (with sessionId)
  → Claude responds
  → FieldValue.increment(1) on messageCount in Firestore

Each star earned:
  → useStars.awardStar() → local store + POST /api/session/star
  → FieldValue.increment(1) on starsEarned in Firestore

Child taps "All Done!":
  → handleEndSession → POST /api/session/end
  → writes endedAt, final starsEarned, messageCount
  → fire-and-forget: POST /api/summary (with messages array)
    → Claude analyzes transcript → JSON summary
    → saves to session.summary (nested field, not subcollection)
  → shows WellDoneScreen

Parent opens dashboard:
  → useSessionHistory → subscribeToSessions → onSnapshot
  → live list of sessions (updates when summary arrives)
```

### 9. Error Handling Pattern
- Every async function wrapped in `try/catch`
- Child-facing: mascot says warm message, retry button shown
- Parent-facing: plain English with retry action
- API routes always return a response — never leave a request hanging

## Route Structure
```
/                          → redirect to /character-select or /login
/(auth)/login              → parent login
/(auth)/signup             → parent signup
/(child)/character-select  → pick + name a Spark Squad character
/(child)/chat              → main tutoring session
/(parent)/dashboard        → parent session history
/privacy                   → privacy policy (COPPA)
```
