// 2-column grid of CharacterCards for the Spark Squad selection screen.
// Keeps layout logic separate from individual card logic.

import { CharacterCard } from './CharacterCard';
import type { CharacterConfig } from '@/types';

interface CharacterGridProps {
  characters: CharacterConfig[];
  /** The id of the currently selected character, or null if none selected. */
  selectedId: string | null;
  onSelect: (id: string) => void;
}

/** Renders all Spark Squad characters in a 2-column tap grid. */
export function CharacterGrid({ characters, selectedId, onSelect }: CharacterGridProps) {
  return (
    <div className="grid w-full max-w-sm grid-cols-2 gap-4 mx-auto">
      {characters.map((character) => (
        <CharacterCard
          key={character.id}
          character={character}
          isSelected={selectedId === character.id}
          onSelect={onSelect}
        />
      ))}
    </div>
  );
}
