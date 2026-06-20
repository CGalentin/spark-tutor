# Active Context — Spark Tutor

## Current Status
**Week 4 — MCP Tool, Characters & Polish — IN PROGRESS (7/15 PRs done)**

---

## Completed This Session (Jun 20)

- [x] PR 4-01 · MCP Math Problem Generator (`feature/mcp-math-tool`)
  - `/api/mcp/math-problem` POST endpoint — accepts `{ grade, topic, difficulty }`, returns `{ problem, hint }` (answer stripped server-side)
  - Added `MathGrade`, `MathDifficulty`, `MathProblemRequest`, `MathProblemResponse` types to `api.ts`

- [x] PR 4-02 · Wire MCP Into Chat Router (`feature/mcp-routing`)
  - `src/lib/mcp/mathProblem.ts`: `generateMathProblem()` (direct Claude call) + `detectsProblemRequest()` (13 trigger phrases)
  - `/api/chat` now routes to MCP before RAG when child asks for a practice problem
  - `buildSystemPrompt.ts` accepts optional `mcpContext` as Layer 5

- [x] PR 4-03 · Character SVG Avatars (`feature/character-avatars`)
  - 6 SVG components in `src/components/child/avatars/` (BlipAvatar, FinnAvatar, ZorroAvatar, LunaAvatar, PipAvatar, NovaAvatar)
  - `index.ts` exports all + `getAvatarComponent(id)` lookup map

- [x] PR 4-04 · Character Animations (`feature/character-animations`)
  - CSS keyframes in `globals.css`: `avatar-idle` (2s float), `avatar-thinking` (3s tilt), `avatar-celebrate` (0.8s bounce)
  - `AnimatedAvatar.tsx` wrapper — applies class, auto-reverts celebration → idle after 1s

- [x] PR 4-05 · Update Character Select With Avatars (`feature/character-select-avatars`)
  - `CharacterCard.tsx` — SVG at 72px, celebration bounce on selected card
  - `MascotAvatar.tsx` — SVG at 96px via `AnimatedAvatar`
  - `chat/page.tsx` — `avatarState` wired to `isChatLoading` (thinking) and star events (celebrating)

- [x] PR 4-06 · Mobile Polish — Child UI (`feature/mobile-polish-child`)
  - `h-dvh` on chat page, `min-h-dvh` on character-select and WellDoneScreen
  - Safe-area inset padding on ChatInput and End Session div
  - Progress bar star badge bumped to `text-base` (16px)

- [x] PR 4-07 · Mobile Polish — Parent UI (`feature/mobile-polish-parent`)
  - `min-h-dvh` on parent layout and auth layout
  - Tighter nav padding on mobile (`px-3 sm:px-4`)
  - SessionSummaryCard header uses `flex-wrap` to avoid overflow

---

## Up Next — Week 4 (continued)

8. **PR 4-08** · Privacy Policy Page (`feature/privacy-policy`) ← START HERE
   - `/app/privacy/page.tsx` — COPPA content (what IS and IS NOT collected)
   - Link already in auth layout footer — needs the page to exist
9. **PR 4-09** · Error States & Loading UI (`feature/error-and-loading`)
10. **PR 4-10** · Rate Limiting (`feature/rate-limiting`)
11. **PR 4-11** · Prettier & Lint Cleanup (`feature/code-quality`)
12. **PR 4-12** · Husky Pre-commit Hook (`feature/husky`)
13. **PR 4-13** · Final End-to-End Test (`dev`)
14. **PR 4-14** · Vercel Production Deploy (`main`)
15. **PR 4-15** · Portfolio Case Study & README (`feature/readme`)

---

## Active Branch
`dev` — create `feature/privacy-policy` from `dev` at start of next session

## Known Issues / Decisions
- MCP uses grade `'K'` and difficulty `'easy'` as defaults from chat router — could be made dynamic in a future iteration
- Avatar SVG fallback: if `getAvatarComponent(id)` returns null, `AnimatedAvatar` shows ✨ emoji
- `detectsProblemRequest()` only fires for `subject === 'math'` — reading subject still uses RAG only
- PowerShell on Windows 10 — quote paths with `(child)` in git commands
- Git rule: always merge feature branch to dev BEFORE creating next feature branch
- Summary is saved as `session.summary` nested field (not subcollection) — matches `Session` type
- Messages forwarded from client via `/api/session/end` → `/api/summary` (never persisted individually)
