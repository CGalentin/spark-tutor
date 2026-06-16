// Main tutoring chat screen — child's primary session interface.
// Assembles MascotAvatar, SubjectSelector, ChatMessageList, and ChatInput.
// Streams mascot responses from /api/chat via SSE and detects [STAR EARNED] events.
// Redirects to /character-select if no character is in the store.

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { auth } from '@/lib/firebase/config';
import { useChildStore } from '@/store/useChildStore';
import { useSessionStore } from '@/store/useSessionStore';
import { getCharacterById } from '@/constants/characters';
import { MascotAvatar } from '@/components/child/MascotAvatar';
import { ChatMessageList } from '@/components/child/ChatMessageList';
import { ChatInput } from '@/components/child/ChatInput';
import { SubjectSelector } from '@/components/child/SubjectSelector';
import type { Message, Subject } from '@/types';

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
  const starsEarned = useSessionStore((s) => s.starsEarned);
  const isChatLoading = useSessionStore((s) => s.isChatLoading);
  const addStar = useSessionStore((s) => s.addStar);
  const startSession = useSessionStore((s) => s.startSession);
  const setIsChatLoading = useSessionStore((s) => s.setIsChatLoading);
  const incrementMessageCount = useSessionStore((s) => s.incrementMessageCount);

  // ── Local state ───────────────────────────────────────────────────────────
  const [messages, setMessages] = useState<Message[]>([]);
  const [subject, setSubject] = useState<Subject | null>(null);
  const [chatError, setChatError] = useState<string | null>(null);

  // ── Guard: send child back if they arrived without picking a character ─────
  useEffect(() => {
    if (selectedCharacterId === null) {
      router.replace('/character-select');
    }
  }, [selectedCharacterId, router]);

  const character = selectedCharacterId ? getCharacterById(selectedCharacterId) : undefined;

  // Fall back to the character's default name if the child didn't enter one
  const mascotName =
    character !== undefined
      ? characterName.trim().length > 0
        ? characterName
        : character.name
      : '';

  // ── Handle subject selection ──────────────────────────────────────────────
  function handleSubjectSelect(chosen: Subject) {
    // Generate a client-side session ID; replaced by Firestore ID in a later PR
    const newSessionId = createMessageId();
    startSession(newSessionId, chosen);
    setSubject(chosen);
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
            if (event.starEarned) addStar();
            break streamLoop;
          } else if (event.type === 'error') {
            throw new Error(event.error);
          }
        }
      }
    } catch {
      // Show a warm, child-safe message — never expose technical error details
      setChatError("Hmm, let me think for a second... try asking me again! 🤔");
    } finally {
      setIsChatLoading(false);
    }
  }

  // Render nothing while the redirect to /character-select is in flight
  if (character === undefined) return null;

  return (
    <div className="flex h-screen w-full max-w-full flex-col overflow-x-hidden bg-gradient-to-b from-violet-50 to-white">
      {/* Header: mascot identity + stars earned this session */}
      <header className="shrink-0 border-b border-slate-100 bg-white/80 backdrop-blur-sm">
        <MascotAvatar character={character} mascotName={mascotName} />

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
        </>
      )}
    </div>
  );
}
