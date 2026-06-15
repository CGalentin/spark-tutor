// Child-facing chat input — large text field and send button for the tutoring session.
// K-1 design: 18px+ text, 48px min touch targets, clear disabled state while mascot is responding.

'use client';

import { useState, type KeyboardEvent } from 'react';
import { cn } from '@/lib/utils';

interface ChatInputProps {
  /** Called when the child submits a message. Receives the trimmed text. */
  onSend: (text: string) => void;
  /** When true, input and send button are disabled (mascot is responding). */
  disabled: boolean;
}

/** Large text input with a Send button for the child chat screen. */
export function ChatInput({ onSend, disabled }: ChatInputProps) {
  const [value, setValue] = useState('');

  const canSend = value.trim().length > 0 && !disabled;

  function handleSend() {
    if (!canSend) return;
    onSend(value.trim());
    setValue('');
  }

  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    // Allow sending with Enter key (not Shift+Enter) for tablet convenience
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  return (
    <div className="flex items-center gap-3 border-t border-slate-200 bg-white px-4 py-3">
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        placeholder="Say something..."
        className={cn(
          'min-h-[48px] flex-1 rounded-2xl border-2 border-slate-200 bg-slate-50',
          'px-4 py-3 text-lg text-slate-800 placeholder:text-slate-400',
          'focus:border-violet-400 focus:outline-none',
          'disabled:cursor-not-allowed disabled:opacity-50',
        )}
        aria-label="Type your message"
      />

      <button
        onClick={handleSend}
        disabled={!canSend}
        className={cn(
          'flex min-h-[48px] min-w-[48px] items-center justify-center rounded-2xl',
          'bg-violet-500 text-2xl text-white transition-all',
          'hover:bg-violet-400 active:scale-95',
          'disabled:cursor-not-allowed disabled:opacity-40',
        )}
        aria-label="Send message"
      >
        🚀
      </button>
    </div>
  );
}
