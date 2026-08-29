// MascotAvatar — shown at the top of the chat screen.
// Renders the child's chosen mascot with animated SVG and a name badge.
// Animation state (idle / thinking / celebrating) is driven by props.

import { cn } from '@/lib/utils';
import type { CharacterConfig } from '@/types';
import { AnimatedAvatar, type AvatarAnimationState } from './AnimatedAvatar';

interface MascotAvatarProps {
  character: CharacterConfig;
  /** The custom name the child gave their mascot (from useChildStore). */
  mascotName: string;
  /** Current animation state — wired to isChatLoading and star events from chat page. */
  animationState?: AvatarAnimationState;
}

/** Displays the selected mascot with animated SVG and the child's chosen name. */
export function MascotAvatar({
  character,
  mascotName,
  animationState = 'idle',
}: MascotAvatarProps) {
  const displayName = mascotName.trim().length > 0 ? mascotName : character.name;

  return (
    <div className="flex flex-col items-center gap-2 py-4">
      {/* Animated SVG avatar */}
      <div
        className={cn(
          'flex items-center justify-center rounded-full p-2',
          character.colors.primary,
        )}
        aria-label={`${displayName} the ${character.type}`}
      >
        <AnimatedAvatar characterId={character.id} animationState={animationState} size={96} />
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
