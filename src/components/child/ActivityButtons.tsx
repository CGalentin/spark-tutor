// Kid-sized activity shortcuts above the chat input.
// Each button sends a phrase the chat route already understands — same path as typing.

'use client';

import { cn } from '@/lib/utils';
import type { Subject } from '@/types';

interface ActivityButtonsProps {
  /** Current session subject — controls which buttons are visible. */
  subject: Subject;
  /** Reuses the chat page send path so phrases hit the same triggers as typed text. */
  onSend: (text: string) => void;
  /** Hide all buttons while the mascot is responding. */
  disabled: boolean;
}

/** Bright activity buttons that auto-submit known chat trigger phrases. */
export function ActivityButtons({ subject, onSend, disabled }: ActivityButtonsProps) {
  if (disabled) {
    return null;
  }

  const buttonClasses = cn(
    'flex min-h-[48px] w-full items-center justify-center gap-2 rounded-2xl',
    'px-4 py-3 text-lg font-extrabold text-slate-800 transition-all',
    'hover:brightness-105 active:scale-95',
  );

  return (
    <div className="flex flex-col gap-2 px-4 pb-2 pt-1">
      {subject === 'math' && (
        <button
          type="button"
          onClick={() => onSend('practice problem')}
          className={cn(buttonClasses, 'bg-yellow-400 hover:bg-yellow-300')}
          aria-label="Practice Problem"
        >
          Practice Problem 🔢
        </button>
      )}

      {subject === 'reading' && (
        <button
          type="button"
          onClick={() => onSend('give me a quiz')}
          className={cn(buttonClasses, 'bg-sky-400 hover:bg-sky-300')}
          aria-label="Reading Quiz"
        >
          Reading Quiz 📖
        </button>
      )}

      <button
        type="button"
        onClick={() => onSend('practice spelling')}
        className={cn(buttonClasses, 'bg-emerald-400 hover:bg-emerald-300')}
        aria-label="Spelling Practice"
      >
        Spelling Practice ✏️
      </button>
    </div>
  );
}
