// AnimatedAvatar — wraps any Spark Squad SVG avatar with the correct CSS animation.
// Animation state is driven by props: idle (default), thinking, or celebration.
// All three classes are defined in globals.css as @keyframes with corresponding classes.

'use client';

import { useEffect, useState } from 'react';
import { getAvatarComponent } from './avatars';

/** The three avatar animation states. */
export type AvatarAnimationState = 'idle' | 'thinking' | 'celebrating';

interface AnimatedAvatarProps {
  /** Character ID — must match one of the 6 Spark Squad IDs. */
  characterId: string;
  /** Drives which animation plays. Defaults to 'idle'. */
  animationState?: AvatarAnimationState;
  size?: number;
}

/** Maps animation state to the CSS class defined in globals.css. */
function getAnimationClass(state: AvatarAnimationState): string {
  switch (state) {
    case 'thinking':
      return 'avatar-thinking';
    case 'celebrating':
      return 'avatar-celebrate';
    default:
      return 'avatar-idle';
  }
}

/**
 * Renders the SVG avatar for a given character with the appropriate CSS animation.
 * The celebration animation auto-reverts to idle after one play cycle.
 */
export function AnimatedAvatar({
  characterId,
  animationState = 'idle',
  size = 120,
}: AnimatedAvatarProps) {
  // Track animation class separately so celebration can revert to idle after one cycle
  const [currentClass, setCurrentClass] = useState<string>(getAnimationClass(animationState));

  useEffect(() => {
    setCurrentClass(getAnimationClass(animationState));

    if (animationState === 'celebrating') {
      // After one celebration cycle (0.8s + small buffer), return to idle
      const timer = setTimeout(() => {
        setCurrentClass('avatar-idle');
      }, 1000);
      return () => clearTimeout(timer);
    }

    return undefined;
  }, [animationState]);

  const AvatarComponent = getAvatarComponent(characterId);

  if (AvatarComponent === null) {
    return (
      <div
        className="flex h-[120px] w-[120px] items-center justify-center rounded-full bg-slate-200 text-4xl"
        aria-label="mascot avatar"
      >
        ✨
      </div>
    );
  }

  return <AvatarComponent animationClass={currentClass} size={size} />;
}
