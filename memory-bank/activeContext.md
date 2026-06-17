# Active Context — Spark Tutor

## Current Status
**Week 3 — Parent Layer & Agentic Summary — COMPLETE ✅ (11/11 PRs done)**
**Week 4 — MCP Tool, Characters & Polish — NOT STARTED ← START HERE**

---

## Completed This Session (Jun 17)

- [x] PR 3-01 · Firebase Admin Setup (`feature/firebase-admin`)
  - Added `adminDb` (Admin Firestore) export to `admin.ts`
  - Added `verifyAuthToken(authHeader)` helper — shared by all API routes
  - All future API routes use `verifyAuthToken` instead of inline token checking

- [x] PR 3-02 · Session Tracking — Start (`feature/session-start`)
  - `/api/session/start` creates Firestore session doc, returns real sessionId
  - `chat/page.tsx` `handleSubjectSelect` calls the endpoint; falls back to local ID on failure
  - Added `SessionStartRequest`, `SessionStartResponse`, `SessionEndRequest`, `SessionEndResponse` types

- [x] PR 3-03 · Session Tracking — Messages (`feature/session-messages`)
  - `/api/chat` refactored to use `verifyAuthToken` (no more inline token verification)
  - Each AI response increments `messageCount` in Firestore via `FieldValue.increment(1)`

- [x] PR 3-04 · Stars Logic (`feature/stars-logic`)
  - `useStars.ts` hook: `awardStar()` updates store + syncs to Firestore via `/api/session/star`
  - `StarBurst.tsx`: full-screen overlay, CSS keyframe pop animation
  - Chat page wired to `useStars`, `StarBurst` overlays on star earn

- [x] PR 3-05 · Progress Bar (`feature/progress-bar`)
  - `SessionProgressBar.tsx`: gradient bar filling over 10 messages + star count badge
  - Added to chat page above `ChatMessageList`

- [x] PR 3-06 · Session End Flow (`feature/session-end`)
  - `EndSessionButton.tsx`: "All Done! 🎉" button
  - `WellDoneScreen.tsx`: full-screen celebration with star count
  - `/api/session/end`: writes `endedAt` + final counts; triggers `/api/summary` fire-and-forget (with messages forwarded)

- [x] PR 3-07 · Agentic Summary (`feature/agentic-summary`)
  - `buildSummaryPrompt.ts`: formats session transcript as Claude user message (separate from `buildSystemPrompt.ts`)
  - `/api/summary`: verifies token, fetches session metadata from Firestore, sends transcript to Claude, parses JSON, saves to Firestore

- [x] PR 3-08 · Save Summary to Firestore (`feature/save-summary`)
  - Summary saved as nested field `session.summary` — matches `Session` type
  - `firestore.ts` updated: replaced old `saveSummary()` subcollection approach with `subscribeToSessions()` using `onSnapshot`

- [x] PR 3-09 · Parent Dashboard Layout (`feature/parent-dashboard`)
  - `DashboardHeader.tsx`: welcome + parent email + Start Session CTA
  - Parent layout updated with nav bar (Dashboard | Sign Out)
  - Dashboard page replaced placeholder with real layout

- [x] PR 3-10 · Session Summary Card (`feature/summary-card`)
  - `useSessionHistory.ts`: `onSnapshot` real-time subscription with cleanup
  - `SessionSummaryCard.tsx`: Shadcn Card + Badge; date, subject, stars, topics, encouragement
  - Dashboard wired to show live session list; "generating" state while summary is being created

- [x] PR 3-11 · Week 3 Integration Test & Deploy (`dev`)
  - `npx tsc --noEmit` — zero errors ✅
  - `npm run build` — 13 routes building clean ✅
  - Deployed to https://spark-tutor-app.vercel.app ✅
  - `dev` → `main` merged ✅

---

## Up Next — Week 4: MCP Tool, Characters & Polish

1. **PR 4-01** · MCP Math Problem Generator (`feature/mcp-math-tool`) ← START HERE
   - `/api/mcp/math-problem` — accepts `{ grade, topic, difficulty }`, returns `{ problem, hint }` (answer never sent to client)

2. **PR 4-02** · Wire MCP Into Chat Router (`feature/mcp-routing`)
   - Detect problem requests in `/api/chat`, inject MCP output into system prompt

3. **PR 4-03** · Character SVG Avatars (`feature/character-avatars`)
   - Simple geometric SVG for all 6 Spark Squad characters

4. **PR 4-04** · Character Animations (`feature/character-animations`)
   - Idle bounce, thinking tilt, celebration scale

5. **PR 4-05** · Update Character Select With Avatars (`feature/character-select-avatars`)
   - Replace emoji placeholders with real SVG avatars

6. **PR 4-06** · Mobile Polish — Child UI (`feature/mobile-polish-child`)
7. **PR 4-07** · Mobile Polish — Parent UI (`feature/mobile-polish-parent`)
8. **PR 4-08** · Privacy Policy Page (`feature/privacy-policy`)
9. **PR 4-09** · Error States & Loading UI (`feature/error-and-loading`)
10. **PR 4-10** · Rate Limiting (`feature/rate-limiting`)
11. **PR 4-11** · Prettier & Lint Cleanup (`feature/code-quality`)
12. **PR 4-12** · Husky Pre-commit Hook (`feature/husky`)
13. **PR 4-13** · Final End-to-End Test (`dev`)
14. **PR 4-14** · Vercel Production Deploy (`main`)
15. **PR 4-15** · Portfolio Case Study & README (`feature/readme`)

---

## Active Branch
`dev` — create `feature/mcp-math-tool` from `dev` at start of next session

## Known Issues / Decisions
- Summary is saved as `session.summary` nested field (not a Firestore subcollection) — matches `Session` type, cleaner for dashboard reads
- Messages are passed from client through `/api/session/end` → `/api/summary` (client-side in-memory, not persisted individually)
- `/api/session/star` route added for Firestore star sync (fire-and-forget from `useStars`)
- Star sync via API route (never direct Firestore from client) — consistent with service layer pattern
- PowerShell on Windows 10 — quote paths with `(child)` in git commands
- Git rule: always merge feature branch to dev BEFORE creating next feature branch
