// Scrollable list of chat bubbles for the tutoring session.
// Auto-scrolls to the latest message when the conversation updates.
// Shows a bouncing-dots typing indicator while the mascot is generating a response.

'use client';

import { useEffect, useRef } from 'react';
import { ChatBubble } from './ChatBubble';
import { cn } from '@/lib/utils';
import type { Message } from '@/types';

interface ChatMessageListProps {
  messages: Message[];
  /** The character's Tailwind primary color class — forwarded to ChatBubble for mascot styling. */
  mascotColorClass: string;
  /** When true, shows a typing indicator to signal the mascot is thinking. */
  isTyping: boolean;
}

/** Three-dot typing indicator shown while the mascot generates a response. */
function TypingIndicator({ colorClass }: { colorClass: string }) {
  return (
    <div className="self-start">
      <div className={cn('flex items-center gap-1.5 rounded-3xl rounded-bl-md px-5 py-4', colorClass)}>
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="h-2.5 w-2.5 rounded-full bg-white opacity-80"
            style={{
              animation: 'bounce 1.2s infinite',
              animationDelay: `${i * 0.2}s`,
            }}
          />
        ))}
      </div>
    </div>
  );
}

/** Renders the full conversation as a scrollable list of ChatBubbles. */
export function ChatMessageList({
  messages,
  mascotColorClass,
  isTyping,
}: ChatMessageListProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  // Scroll to the newest message whenever messages update or typing state changes
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  return (
    <div className="flex flex-1 flex-col gap-3 overflow-x-hidden overflow-y-auto px-4 py-4">
      {messages.length === 0 && (
        <p className="text-center text-lg text-slate-400 mt-8">
          Say hi to start learning! 👋
        </p>
      )}

      {messages.map((message) => (
        <ChatBubble
          key={message.id}
          message={message}
          mascotColorClass={mascotColorClass}
        />
      ))}

      {isTyping && <TypingIndicator colorClass={mascotColorClass} />}

      {/* Invisible anchor div — scrolled into view on new messages */}
      <div ref={bottomRef} />
    </div>
  );
}
