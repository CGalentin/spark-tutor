// Mascot avatar shown at the top of the chat screen.
// Displays the character's emoji and the name the child gave it.
// K-1 design: large emoji, big readable name, character's accent color.

import { cn } from '@/lib/utils';
import type { CharacterConfig } from '@/types';

interface MascotAvatarProps {
  character: CharacterConfig;
  /** The custom name the child gave their mascot (from useChildStore). */
  mascotName: string;
}

/** Displays the selected mascot's emoji and chosen name at the top of the chat. */
export function MascotAvatar({ character, mascotName }: MascotAvatarProps) {
  const displayName = mascotName.trim().length > 0 ? mascotName : character.name;

  return (
    <div className="flex flex-col items-center gap-2 py-4">
      {/* Character emoji — large so children can identify their mascot at a glance */}
      <div
        className={cn(
          'flex h-20 w-20 items-center justify-center rounded-full text-5xl',
          character.colors.primary,
        )}
        role="img"
        aria-label={`${displayName} the ${character.type}`}
      >
        {character.emoji}
      </div>

      {/* Mascot name badge */}
      <div className="flex flex-col items-center gap-0.5">
        <span className="text-xl font-extrabold text-slate-800">{displayName}</span>
        <span className={cn('text-sm font-semibold', character.colors.accent)}>
          your Spark Squad buddy ✨
        </span>
      </div>
    </div>
  );
}
