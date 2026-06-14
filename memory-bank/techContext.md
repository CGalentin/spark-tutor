# Tech Context — Spark Tutor

## Tech Stack

| Layer | Technology | Version | Purpose |
|---|---|---|---|
| Framework | Next.js | 16.2.9 | App Router, API routes, SSR/SSG |
| Language | TypeScript | Latest (strict mode) | Type safety across entire codebase |
| Styling | Tailwind CSS | v4 | Utility-first CSS |
| UI Components | Shadcn UI | Latest | Parent dashboard + auth screens only |
| State Management | Zustand | Latest | Global state (auth, session, character) |
| Auth + DB | Firebase Auth + Firestore | Latest | Parent accounts, session storage |
| Vector Search | Firebase Vector Search | Extension | RAG curriculum chunk storage + retrieval |
| Chat LLM | Claude (Anthropic) | API | Mascot voice, Socratic Q&A, session summaries |
| Embedding LLM | Gemini (Google AI Studio) | API | Embeddings only — never generates user-facing text |
| Deployment | Vercel | — | Hosting, edge functions, environment variables |

## Key Dependencies (to be installed in PR 1-03)
```
firebase              ← client SDK
firebase-admin        ← server-side Admin SDK
@anthropic-ai/sdk     ← Claude API client
@google/generative-ai ← Gemini embedding client
zustand               ← state management
clsx                  ← conditional classnames
tailwind-merge        ← merge Tailwind classes without conflicts
shadcn/ui             ← component library (init via CLI)
```

## Environment Variables
All stored in `.env.local` (never committed). See `.env.example` for required keys.

```
# Firebase Client (NEXT_PUBLIC_ = safe for browser)
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
ANTHROPIC_API_KEY
GEMINI_API_KEY
```

## TypeScript Conventions
- Strict mode enabled in `tsconfig.json` — never disable
- No `any` types — ever
- `interface` for object shapes, `type` for unions and primitives
- Shared types exported from `/src/types/index.ts`
- All API routes use `ApiResult<T>` return type

## File & Component Conventions
- Max 500 lines per file, max 200 lines per component
- Components: `PascalCase` — `CharacterCard.tsx`
- Hooks: `camelCase` with `use` prefix — `useSessionStore.ts`
- Utilities: `camelCase` — `buildSystemPrompt.ts`
- Constants: `SCREAMING_SNAKE_CASE` — `MAX_SESSION_STARS`
- API routes: `kebab-case` folders — `math-problem/`

## Claude API Settings
- Child chat: `max_tokens: 300`, `temperature: 0.7`
- Session summary: `max_tokens: 600`
- Always stream responses for child chat (better UX)
- System prompt composed from 3 layers: BASE_TUTOR_RULES + CHARACTER_VOICE + RAG_CONTEXT

## Tailwind Class Ordering Convention
`layout → spacing → sizing → color → typography → effects`

## Development Environment
- OS: Windows 10
- Shell: PowerShell (no bash heredoc syntax — use simple `-m "message"` for git commits)
- Node: managed via npm
- IDE: Cursor
