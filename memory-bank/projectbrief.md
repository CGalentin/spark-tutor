# Project Brief — Spark Tutor

## What We Are Building
Spark Tutor is an AI tutoring app for children in Kindergarten through Grade 3. Children pick and name a mascot character (the "Spark Squad"), then learn Math and Reading/ELA through Socratic AI conversations. Parents receive automatic session summaries after each session.

**v1 (shipped):** K-1 chat, RAG, parent dashboard, MCP math problems — live at https://spark-tutor-app.vercel.app  
**v2 (in progress):** AI Intelligence Layer — grade-band prompts (K–3), agentic learning path, evaluator agent, parent topic approval.

## Core Requirements
- Children (K–3) interact with a named mascot via a chat UI
- Mascot uses Socratic questioning — guides kids toward answers, never just gives them
- Talking style and question difficulty match the child's grade band (K, 1, 2, or 3)
- Parents create accounts, view a dashboard, and receive auto-generated session summaries
- No child accounts — all data stored under the parent's UID (COPPA compliance)
- App must work on mobile/tablet (375px viewport minimum)

## Users
| User | What They Do |
|---|---|
| Child (K–3) | Picks a character, names it, chats to learn Math or Reading |
| Parent | Creates account, views dashboard, reads session summaries; in v2 will approve the next topic |

## COPPA Rules (Non-Negotiable)
- Never collect child's real name, age, school, photo, or location
- Only identity stored for a child: character type + character name (fictional)
- All session data owned by the parent account (parent UID)
- No features that allow children to communicate with other users

## Success Criteria (v1 MVP — complete)
1. Child can complete a full session: pick character → name it → 5+ message conversation
2. Mascot responds in character voice using Socratic method
3. Parent dashboard shows auto-generated session summaries
4. App deployed live on Vercel with zero build errors
5. Privacy policy page live

## Success Criteria (v2 — in progress)
1. Claude's voice and question complexity follow the selected grade band
2. A learning path document exists per parent + subject in Firestore
3. Parent can see and approve the AI-suggested next topic

## Repository
- GitHub: https://github.com/CGalentin/spark-tutor
- Local: `C:\Users\GauntletAI\Desktop\GauntletAI\TutorApp\spark-tutor`

## Branch Strategy
- `main` — production only, merge at end of each sprint
- `dev` — daily development work
- `feature/*` — individual PR branches
