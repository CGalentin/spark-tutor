// Types for the Spark Squad characters.
// CharacterConfig is the full definition used in constants and UI.
// CharacterVoice is the subset passed into the Claude system prompt builder.

/** The full definition of a Spark Squad mascot character. */
export interface CharacterConfig {
  /** Unique identifier — used as a key in constants and stored in Firestore. */
  id: string;
  /** Default display name before the child renames it. */
  name: string;
  /** The animal/robot/fantasy type — used for selecting the SVG avatar. */
  type: 'robot' | 'fox' | 'dragon' | 'bunny' | 'fairy' | 'owl' | 'bear' | 'starfish';
  /** Emoji placeholder used until an SVG avatar exists for this character. */
  emoji: string;
  /** Tailwind class names for theming the character's card and chat UI. */
  colors: {
    primary: string;
    accent: string;
  };
  /** The personality paragraph injected as Layer 2 of the Claude system prompt. */
  voicePrompt: string;
  /** ElevenLabs voice id. Empty until the voice sprint fills it in. */
  elevenlabsVoiceId: string;
}

/** The subset of a character's data needed to build the Claude system prompt. */
export interface CharacterVoice {
  characterId: string;
  voicePrompt: string;
}
