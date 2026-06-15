# Project Brief — Spark Tutor

## What We Are Building
Spark Tutor is a K-1 AI tutoring app for children ages 5–6. Children pick and name a mascot character (the "Spark Squad"), then learn Math and Reading/ELA through Socratic AI conversations. Parents receive automatic session summaries after each session.

## Core Requirements
- Children (K-1, ages 5–6) interact with a named mascot via a chat UI
- Mascot uses Socratic questioning — guides kids toward answers, never just gives them
- Parents create accounts, view a dashboard, and receive auto-generated session summaries
- No child accounts — all data stored under the parent's UID (COPPA compliance)
- App must work on mobile/tablet (375px viewport minimum)

## Users
| User | What They Do |
|---|---|
| Child (ages 5–6) | Picks a character, names it, chats to learn Math or Reading |
| Parent | Creates account, views dashboard, reads session summaries |

## COPPA Rules (Non-Negotiable)
- Never collect child's real name, age, school, photo, or location
- Only identity stored for a child: character type + character name (fictional)
- All session data owned by the parent account (parent UID)
- No features that allow children to communicate with other users

## Success Criteria (MVP)
1. Child can complete a full session: pick character → name it → 5+ message conversation
2. Mascot responds in character voice using Socratic method
3. Parent dashboard shows auto-generated session summaries
4. App deployed live on Vercel with zero build errors
5. Privacy policy page live

## Repository
- GitHub: https://github.com/CGalentin/spark-tutor
- Local: `C:\Users\GauntletAI\Desktop\GauntletAI\TutorApp\spark-tutor`

## Branch Strategy
- `main` — production only, merge at end of each weekly milestone
- `dev` — daily development work
- `feature/*` — individual PR branches
