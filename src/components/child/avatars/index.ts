// Central export for all Spark Squad SVG avatar components.
// Use getAvatarComponent(characterId) to look up the right avatar by character ID.

import type { ComponentType } from 'react';
import { BlipAvatar } from './BlipAvatar';
import { FinnAvatar } from './FinnAvatar';
import { ZorroAvatar } from './ZorroAvatar';
import { LunaAvatar } from './LunaAvatar';
import { PipAvatar } from './PipAvatar';
import { NovaAvatar } from './NovaAvatar';

export { BlipAvatar } from './BlipAvatar';
export { FinnAvatar } from './FinnAvatar';
export { ZorroAvatar } from './ZorroAvatar';
export { LunaAvatar } from './LunaAvatar';
export { PipAvatar } from './PipAvatar';
export { NovaAvatar } from './NovaAvatar';

/** Props shared by all avatar components. */
export interface AvatarProps {
  animationClass?: string;
  size?: number;
}

/** Map of character ID → avatar component. */
const AVATAR_MAP: Record<string, ComponentType<AvatarProps>> = {
  blip: BlipAvatar,
  finn: FinnAvatar,
  zorro: ZorroAvatar,
  luna: LunaAvatar,
  pip: PipAvatar,
  nova: NovaAvatar,
};

/** Returns the SVG avatar component for a given character ID, or null if not found. */
export function getAvatarComponent(characterId: string): ComponentType<AvatarProps> | null {
  return AVATAR_MAP[characterId] ?? null;
}
