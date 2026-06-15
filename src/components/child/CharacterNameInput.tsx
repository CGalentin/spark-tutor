// Name input shown after a child picks a Spark Squad character.
// K-1 design: large text, big input + button (56px min height), centered layout.
// The page owns the navigation — this component calls onConfirm when "Let's Go!" is tapped.

import type { CharacterConfig } from '@/types';

interface CharacterNameInputProps {
  /** The character that was selected — used to show its emoji and default name as placeholder. */
  character: CharacterConfig;
  /** The current name value, controlled by the parent page via useChildStore. */
  name: string;
  onNameChange: (name: string) => void;
  /** Called when the child taps "Let's Go!" — the page handles navigation. */
  onConfirm: () => void;
}

/** Name entry form shown after a character is selected. */
export function CharacterNameInput({
  character,
  name,
  onNameChange,
  onConfirm,
}: CharacterNameInputProps) {
  const canProceed = name.trim().length > 0;

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter' && canProceed) {
      onConfirm();
    }
  }

  return (
    <div className="mx-auto mt-8 flex w-full max-w-sm flex-col items-center gap-4">
      <p className="text-center text-xl font-bold text-slate-700">
        What will you name your {character.emoji}?
      </p>

      <input
        type="text"
        value={name}
        onChange={(e) => onNameChange(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={character.name}
        maxLength={20}
        autoFocus
        aria-label={`Name for your ${character.name}`}
        className="w-full min-h-[56px] rounded-2xl border-2 border-slate-200 px-4 text-center text-xl font-semibold text-slate-800 placeholder:text-slate-400 focus:border-violet-400 focus:outline-none"
      />

      <button
        onClick={onConfirm}
        disabled={!canProceed}
        className="w-full min-h-[56px] rounded-3xl bg-violet-500 px-6 text-xl font-bold text-white transition-all hover:bg-violet-400 active:scale-95 disabled:cursor-not-allowed disabled:opacity-40 disabled:active:scale-100 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-violet-300 focus-visible:ring-offset-2"
      >
        Let&apos;s Go! 🚀
      </button>
    </div>
  );
}
