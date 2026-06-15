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
   │  Firebase Vector    — RAG chunk storage    │
   └───────────────────────────────────────────┘
```

## Key Architectural Patterns

### 1. Composable System Prompt (3 Layers)
Every Claude chat call builds the system prompt from three separate layers:
```
Layer 1: BASE_TUTOR_RULES    — never changes; enforces K-1 safety + Socratic method
Layer 2: CHARACTER_VOICE     — loaded from constants/characters.ts by selected character id
Layer 3: RAG_CONTEXT         — top 3 curriculum chunks from Firebase Vector Search
```
This lets us swap or update any layer without touching the others.

### 2. Dual-LLM Pattern
- **Claude** → all conversation generation (chat + session summaries)
- **Gemini** → embeddings only (never generates text for users)
This separation is intentional: Claude has stronger safety controls and character voice consistency; Gemini is cost-efficient for embedding at scale.

### 3. MCP Tool Pattern
The math problem generator is a Next.js API route that Claude can "call" during a session:
- Input: `{ grade, topic, difficulty }`
- Output to Claude: `{ problem, hint }` — the `answer` field is NEVER sent to client
- Claude receives the problem and hint, then guides the child Socratically toward the answer

### 4. Firestore Data Structure
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

### 5. API Response Shape
Every API route returns this consistent shape:
```typescript
type ApiResult<T> =
  | { success: true; data: T }
  | { success: false; error: string };
```

### 6. Client vs Server Components Rule
- Default to Server Components
- Only add `'use client'` when needed: `useState`, `useEffect`, event handlers, Zustand, Firebase listeners
- Keep client components as small (leaf node) as possible

### 7. Firestore Access Pattern
- Components NEVER write to Firestore directly
- All reads/writes go through service functions in `/src/lib/firebase/`
- Real-time data (parent dashboard) uses `onSnapshot` with cleanup in `useEffect`

### 8. Error Handling Pattern
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
