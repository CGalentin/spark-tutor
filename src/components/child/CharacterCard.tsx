// Single Spark Squad character card — displayed in the 2x3 selection grid.
// K-1 design: large emoji, big tap target (120px min), bright character color, visible selection ring.

import { cn } from '@/lib/utils';
import type { CharacterConfig } from '@/types';

interface CharacterCardProps {
  character: CharacterConfig;
  isSelected: boolean;
  /** Called with the character's id when the card is tapped. */
  onSelect: (id: string) => void;
}

/** Tappable character card for the Spark Squad selection grid. */
export function CharacterCard({ character, isSelected, onSelect }: CharacterCardProps) {
  return (
    <button
      onClick={() => onSelect(character.id)}
      aria-pressed={isSelected}
      aria-label={`Choose ${character.name}`}
      className={cn(
        // Layout
        'flex flex-col items-center justify-center gap-2',
        // Sizing — minimum 120px so tiny fingers can tap reliably
        'min-h-[120px] w-full rounded-3xl p-4',
        // Color — each character has its own primary bg
        character.colors.primary,
        // Interaction
        'transition-all duration-150 hover:scale-105 active:scale-95',
        'focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white focus-visible:ring-offset-2',
        // Selected state — white ring makes the pick obvious
        isSelected && 'ring-4 ring-white ring-offset-2 scale-105 shadow-lg',
      )}
    >
      <span className="text-5xl leading-none" role="img" aria-hidden="true">
        {character.emoji}
      </span>
      <span className="text-lg font-bold text-white drop-shadow-sm">
        {character.name}
      </span>
    </button>
  );
}
