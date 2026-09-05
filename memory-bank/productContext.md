# Product Context — Spark Tutor

## Why This App Exists
Young children learn best through guided discovery, not passive instruction. Spark Tutor gives every child in K–3 access to a patient, encouraging AI tutor that never just hands them the answer — it asks questions that help them figure it out themselves (Socratic method). Parents stay in the loop without having to sit in on every session.

v1 shipped for K-1. v2 extends the same product to Grades 2–3 with grade-tuned language, a persistent learning path, and parent approval of the next topic.

## Problems It Solves
| Problem | How Spark Tutor Solves It |
|---|---|
| Kids get bored with static flashcard apps | A named mascot with a personality makes learning feel like a conversation with a friend |
| Parents don't know what their child worked on | Automatic AI-generated session summaries appear on the parent dashboard after every session |
| Generic AI tutors aren't safe for young children | Claude is constrained by BASE_TUTOR_RULES plus a grade-band layer so language stays age-appropriate |
| One voice for every age | Grade-band prompts: K uses 2 short sentences; Grade 3 can use 5 sentences and multi-step questions |
| AI answers aren't grounded in real curriculum | RAG layer retrieves OER curriculum chunks before every Claude response (current corpus is still K-1) |
| Child jumps topics with no memory | v2 learning path stores current topic, mastery scores, and a parent-approved next step |

## The Spark Squad (6 Mascot Characters)
Children pick one character and give it a custom name. The character's personality shapes how Claude responds.

| Character | Type | Personality |
|---|---|---|
| Blip | Robot | Curious, logical, loves counting patterns |
| Finn | Fox | Playful, clever, uses rhymes and wordplay |
| Zorro | Dragon | Brave, enthusiastic, loves big challenges |
| Luna | Bunny | Gentle, nurturing, encouraging and patient |
| Pip | Fairy | Whimsical, imaginative, uses storytelling |
| Nova | Owl | Wise, calm, asks lots of thoughtful questions |

## How a Session Works
1. Parent logs in and opens the app on a tablet/device
2. Child picks a Spark Squad character and gives it a name
3. Child selects a subject (Math or Reading)
4. Child chats with their named mascot — mascot uses Socratic questions to guide learning
5. Stars are awarded when the child reaches correct answers
6. Parent clicks "End Session" — Claude generates a summary automatically
7. Summary appears on parent dashboard within seconds

**v2 (partially built):** chat API already accepts `grade` (K/1/2/3) and injects the matching prompt. The child UI does not send `grade` yet, so live chat still defaults to Kindergarten. Session start reads or creates a learning path per subject and returns `currentTopic` / `currentGrade` / `suggestedNextTopic`; the chat page stores topic and grade in Zustand.

## Key UX Principles
- **Child UI:** Bright colors, large text (18px+), 48px+ touch targets, rounded buttons, single-column layout, no technical errors ever shown to child
- **Parent UI:** Clean, minimal, informative — Shadcn components, neutral palette
- **Mascot errors:** Never say "Error 500" — mascot says "Hmm, let me think... try asking me again!"
