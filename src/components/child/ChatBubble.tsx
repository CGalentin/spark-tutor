// Single chat message bubble for the child tutoring UI.
// Two visual variants: child messages (right-aligned, slate) and mascot messages (left-aligned, character color).
// K-1 design: 18px+ text, rounded-3xl, clear visual separation between speakers.

import { cn } from '@/lib/utils';
import type { Message } from '@/types';

interface ChatBubbleProps {
  message: Message;
  /** The character's Tailwind primary color class (e.g. 'bg-blue-400') for mascot bubbles. */
  mascotColorClass: string;
}

/**
 * Strips the internal [STAR EARNED] signal from text before displaying it.
 * The star signal is for the app logic, not something the child should see.
 */
function cleanDisplayText(text: string): string {
  return text.replace(/\[STAR EARNED\]/g, '').trim();
}

/** Renders a single chat message as a styled bubble. */
export function ChatBubble({ message, mascotColorClass }: ChatBubbleProps) {
  const isChild = message.role === 'child';
  const displayText = cleanDisplayText(message.content);

  // align-self: flex-end places the child bubble on the RIGHT side of the
  // flex-col list; align-self: flex-start keeps mascot bubbles on the LEFT.
  // This avoids any reliance on parent-width calculations.
  return (
    <div
      className={cn(
        'max-w-[75%] rounded-3xl px-5 py-3',
        // Typography — 18px minimum for K-1 readability
        'text-[18px] leading-relaxed font-medium',
        // Positioning — self-end = right side, self-start = left side
        isChild ? 'self-end rounded-br-md bg-slate-100 text-slate-800' : cn('self-start rounded-bl-md text-white', mascotColorClass),
      )}
    >
      {displayText}
    </div>
  );
}
