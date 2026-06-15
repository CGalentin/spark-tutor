// Subject picker shown before the first message in a tutoring session.
// Child chooses Math or Reading — two large, colorful buttons with emoji labels.
// K-1 design: 80px+ touch targets, bright distinct colors, large 24px text.

'use client';

import type { Subject } from '@/types';

interface SubjectSelectorProps {
  /** The custom name the child gave their mascot, used in the prompt text. */
  mascotName: string;
  /** Called when the child taps a subject button. */
  onSelect: (subject: Subject) => void;
}

/** Two-button screen for picking Math or Reading at the start of a session. */
export function SubjectSelector({ mascotName, onSelect }: SubjectSelectorProps) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-8 px-6 py-8">
      <p className="text-center text-2xl font-extrabold text-slate-800">
        What should {mascotName} help you learn today?
      </p>

      <div className="flex w-full max-w-xs flex-col gap-4">
        {/* Math — yellow to match the numbers/counting theme */}
        <button
          onClick={() => onSelect('math')}
          className="flex min-h-[80px] w-full flex-col items-center justify-center gap-1 rounded-3xl bg-yellow-400 px-6 py-4 text-slate-800 transition-all hover:bg-yellow-300 active:scale-95"
        >
          <span className="text-4xl" aria-hidden="true">
            🔢
          </span>
          <span className="text-2xl font-extrabold">Math</span>
        </button>

        {/* Reading — sky blue to match the open, story-telling theme */}
        <button
          onClick={() => onSelect('reading')}
          className="flex min-h-[80px] w-full flex-col items-center justify-center gap-1 rounded-3xl bg-sky-400 px-6 py-4 text-slate-800 transition-all hover:bg-sky-300 active:scale-95"
        >
          <span className="text-4xl" aria-hidden="true">
            📖
          </span>
          <span className="text-2xl font-extrabold">Reading</span>
        </button>
      </div>
    </div>
  );
}
