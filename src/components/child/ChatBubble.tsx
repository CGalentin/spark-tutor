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

  return (
    <div className="flex w-full">
      <div
        className={cn(
          // Layout + sizing — ml-auto pushes child bubbles to the right,
          // mr-auto keeps mascot bubbles on the left
          'max-w-[80%] rounded-3xl px-5 py-3',
          isChild ? 'ml-auto' : 'mr-auto',
          // Typography — 18px minimum for K-1 readability
          'text-[18px] leading-relaxed font-medium',
          // Child bubble: neutral light bg, dark text
          isChild && 'rounded-br-md bg-slate-100 text-slate-800',
          // Mascot bubble: character color bg, white text
          !isChild && cn('rounded-bl-md text-white', mascotColorClass),
        )}
      >
        {displayText}
      </div>
    </div>
  );
}
