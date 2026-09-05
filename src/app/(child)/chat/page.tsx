// Main tutoring chat screen — child's primary session interface.
// Assembles MascotAvatar, SubjectSelector, ChatMessageList, and ChatInput.
// Streams mascot responses from /api/chat via SSE and detects [STAR EARNED] events.
// Redirects to /character-select if no character is in the store.

'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { auth } from '@/lib/firebase/config';
import { useChildStore } from '@/store/useChildStore';
import { useSessionStore } from '@/store/useSessionStore';
import { useStars } from '@/hooks/useStars';
import { getTopics } from '@/constants';
import { getCharacterById } from '@/constants/characters';
import { MascotAvatar } from '@/components/child/MascotAvatar';
import { ChatMessageList } from '@/components/child/ChatMessageList';
import { ChatInput } from '@/components/child/ChatInput';
import { SubjectSelector } from '@/components/child/SubjectSelector';
import { StarBurst } from '@/components/child/StarBurst';
import { SessionProgressBar } from '@/components/child/SessionProgressBar';
import { EndSessionButton } from '@/components/child/EndSessionButton';
import { WellDoneScreen } from '@/components/child/WellDoneScreen';
import type { AvatarAnimationState } from '@/components/child/AnimatedAvatar';
import type { ApiResult, Message, SessionStartResponse, Subject } from '@/types';

/** Discriminated union matching the SSE events emitted by /api/chat. */
type SseEvent =
  | { type: 'delta'; text: string }
  | { type: 'done'; starEarned: boolean }
  | { type: 'error'; error: string };

/** Creates a time-stamped unique ID for message objects. */
function createMessageId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

/** Child tutoring chat page — the main session screen. */
export default function ChatPage() {
  const router = useRouter();

  // ── Character (from store) ────────────────────────────────────────────────
  const selectedCharacterId = useChildStore((s) => s.selectedCharacterId);
  const characterName = useChildStore((s) => s.characterName);

  // ── Session (from store) ──────────────────────────────────────────────────
  const sessionId = useSessionStore((s) => s.sessionId);
  const messageCount = useSessionStore((s) => s.messageCount);
  const isChatLoading = useSessionStore((s) => s.isChatLoading);
  const isSessionEnding = useSessionStore((s) => s.isSessionEnding);
  const startSession = useSessionStore((s) => s.startSession);
  const setIsChatLoading = useSessionStore((s) => s.setIsChatLoading);
  const setIsSessionEnding = useSessionStore((s) => s.setIsSessionEnding);
  const incrementMessageCount = useSessionStore((s) => s.incrementMessageCount);
  const endSession = useSessionStore((s) => s.endSession);

  // ── Stars (hook handles local state + Firestore sync) ─────────────────────
  const { starsEarned, awardStar } = useStars();

  // ── Local state ───────────────────────────────────────────────────────────
  const [messages, setMessages] = useState<Message[]>([]);
  const [subject, setSubject] = useState<Subject | null>(null);
  const [chatError, setChatError] = useState<string | null>(null);
  // starBurstTriggered flips to true for one render cycle to trigger the animation
  const [starBurstTriggered, setStarBurstTriggered] = useState(false);
  // sessionEnded drives the WellDoneScreen — stays true until the user navigates away
  const [sessionEnded, setSessionEnded] = useState(false);
  // mascot animation state — thinking while loading, celebrating on star, idle otherwise
  const [avatarState, setAvatarState] = useState<AvatarAnimationState>('idle');

  const handleStarBurstComplete = useCallback(() => setStarBurstTriggered(false), []);

  // ── Guard: send child back if they arrived without picking a character ─────
  useEffect(() => {
    if (selectedCharacterId === null) {
      router.replace('/character-select');
    }
  }, [selectedCharacterId, router]);

  // ── Sync mascot animation to loading state ────────────────────────────────
  // The avatar thinks while the AI is generating a response.
  // avatarState cannot be purely derived from isChatLoading: it also transitions to
  // 'celebrating' via handleSend on star events, so a useEffect sync is the right pattern.
  useEffect(() => {
    if (isChatLoading) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setAvatarState('thinking');
    } else if (avatarState === 'thinking') {
      setAvatarState('idle');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isChatLoading]);

  const character = selectedCharacterId ? getCharacterById(selectedCharacterId) : undefined;

  // Fall back to the character's default name if the child didn't enter one
  const mascotName =
    character !== undefined
      ? characterName.trim().length > 0
        ? characterName
        : character.name
      : '';

  // ── Handle subject selection ──────────────────────────────────────────────
  // Creates the session, then stores the learning-path topic and grade from the response.
  async function handleSubjectSelect(chosen: Subject) {
    if (character === undefined) return;

    setSubject(chosen);

    try {
      const token = await auth.currentUser?.getIdToken();
      if (token === undefined || token === '') {
        throw new Error('Not authenticated.');
      }

      const response = await fetch('/api/session/start', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          characterType: character.id,
          characterName: characterName.trim(),
          subject: chosen,
        }),
      });

      const result = (await response.json()) as ApiResult<SessionStartResponse>;

      if (!result.success) {
        throw new Error('Failed to start session.');
      }

      startSession(
        result.data.sessionId,
        chosen,
        result.data.currentTopic,
        result.data.currentGrade,
      );
    } catch {
      // Fall back to a client-side ID so the child can still chat even if the API fails.
      // Kindergarten + first curriculum topic keep the store typed without a real path.
      const fallbackTopic = getTopics(chosen, 'K')[0] ?? '';
      startSession(createMessageId(), chosen, fallbackTopic, 'K');
    }
  }

  // ── End the session and show the WellDone screen ─────────────────────────
  async function handleEndSession() {
    if (sessionId === null || isSessionEnding) return;

    setIsSessionEnding(true);

    try {
      const token = await auth.currentUser?.getIdToken();
      if (token !== undefined && token !== '') {
        await fetch('/api/session/end', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ sessionId, starsEarned, messageCount, messages }),
        });
      }
    } catch {
      // End-session failure must not block the child from seeing the WellDone screen
    } finally {
      setSessionEnded(true);
      endSession();
      setIsSessionEnding(false);
    }
  }

  // ── Send a message and stream the mascot's response via SSE ───────────────
  async function handleSend(text: string) {
    if (character === undefined || subject === null) return;

    setChatError(null);

    // Snapshot history before adding the new child message —
    // the API expects prior history; it appends the current message itself
    const historySnapshot = [...messages];

    const childMessage: Message = {
      id: createMessageId(),
      role: 'child',
      content: text,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, childMessage]);
    incrementMessageCount();
    setIsChatLoading(true);

    try {
      // Parent must be signed in (COPPA: no child accounts)
      const token = await auth.currentUser?.getIdToken();
      if (token === undefined || token === '') {
        throw new Error('Not authenticated — parent must be signed in.');
      }

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          message: text,
          sessionId: sessionId ?? createMessageId(),
          characterId: character.id,
          subject,
          messages: historySnapshot,
        }),
      });

      if (!response.ok || response.body === null) {
        throw new Error(`API error ${response.status}`);
      }

      // ── Parse the SSE stream ─────────────────────────────────────────────
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';
      let accumulatedText = '';

      streamLoop: while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        // Keep the last (potentially incomplete) line in the buffer
        buffer = lines.pop() ?? '';

        for (const line of lines) {
          if (!line.startsWith('data: ')) continue;

          const rawJson = line.slice(6).trim();
          if (rawJson === '') continue;

          let event: SseEvent;
          try {
            event = JSON.parse(rawJson) as SseEvent;
          } catch {
            continue;
          }

          if (event.type === 'delta') {
            accumulatedText += event.text;
          } else if (event.type === 'done') {
            // Add the complete mascot reply once the stream closes
            const mascotMessage: Message = {
              id: createMessageId(),
              role: 'mascot',
              content: accumulatedText,
              timestamp: new Date(),
            };
            setMessages((prev) => [...prev, mascotMessage]);

            // Claude embeds [STAR EARNED] in the text when the child nails an answer
            if (event.starEarned) {
              setStarBurstTriggered(true);
              setAvatarState('celebrating');
              await awardStar();
            }
            break streamLoop;
          } else if (event.type === 'error') {
            throw new Error(event.error);
          }
        }
      }
    } catch {
      // Show a warm, child-safe message — never expose technical error details
      setChatError('Hmm, let me think for a second... try asking me again! 🤔');
    } finally {
      setIsChatLoading(false);
    }
  }

  // Render nothing while the redirect to /character-select is in flight
  if (character === undefined) return null;

  // Show the celebration screen after the session ends
  if (sessionEnded) {
    return <WellDoneScreen mascotName={mascotName} starsEarned={starsEarned} />;
  }

  return (
    <div className="flex h-dvh flex-col bg-gradient-to-b from-violet-50 to-white">
      {/* Star burst overlay — triggered once per star earned */}
      <StarBurst triggered={starBurstTriggered} onComplete={handleStarBurstComplete} />
      {/* Header: mascot identity + stars earned this session */}
      <header className="shrink-0 border-b border-slate-100 bg-white/80 backdrop-blur-sm">
        <MascotAvatar character={character} mascotName={mascotName} animationState={avatarState} />

        {/* Stars row — only visible after the first star is earned */}
        {starsEarned > 0 && (
          <div
            className="flex justify-center gap-0.5 pb-3"
            aria-label={`${starsEarned} star${starsEarned === 1 ? '' : 's'} earned`}
          >
            {Array.from({ length: Math.min(starsEarned, 10) }).map((_, i) => (
              <span key={i} className="text-xl" aria-hidden="true">
                ⭐
              </span>
            ))}
          </div>
        )}
      </header>

      {subject === null ? (
        /* Subject picker — shown until the child chooses Math or Reading */
        <SubjectSelector mascotName={mascotName} onSelect={handleSubjectSelect} />
      ) : (
        <>
          {/* Session progress bar — fills over 10 messages, shows star count */}
          <div className="shrink-0 border-b border-slate-100">
            <SessionProgressBar />
          </div>

          {/* Scrollable message list fills remaining vertical space */}
          <ChatMessageList
            messages={messages}
            mascotColorClass={character.colors.primary}
            isTyping={isChatLoading}
          />

          {/* Friendly, child-safe error banner — shown if the AI call fails */}
          {chatError !== null && (
            <div className="shrink-0 px-4 pb-2">
              <p className="rounded-2xl bg-amber-50 px-4 py-3 text-center text-lg font-medium text-amber-700">
                {chatError}
              </p>
            </div>
          )}

          {/* Chat input pinned to the bottom */}
          <div className="shrink-0">
            <ChatInput onSend={handleSend} disabled={isChatLoading} />
          </div>

          {/* End session button below chat input */}
          <div className="shrink-0 px-4 pb-[max(16px,env(safe-area-inset-bottom))]">
            <EndSessionButton
              disabled={isChatLoading || isSessionEnding}
              onEndSession={handleEndSession}
            />
          </div>
        </>
      )}
    </div>
  );
}
