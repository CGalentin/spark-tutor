// Zustand store for child-facing state — character selection and chosen name.
// This is separate from session state so character data persists across subject switches.

'use client';

import { create } from 'zustand';

interface ChildStore {
  /** The id of the selected Spark Squad character (e.g. 'blip', 'nova'). */
  selectedCharacterId: string | null;
  /** The fictional name the child gave their mascot — never a real child name. */
  characterName: string;
  /** Sets the selected character id. */
  setSelectedCharacterId: (id: string) => void;
  /** Sets the name the child chose for their mascot. */
  setCharacterName: (name: string) => void;
  /** Resets character selection back to initial state. */
  resetCharacter: () => void;
}

export const useChildStore = create<ChildStore>((set) => ({
  selectedCharacterId: null,
  characterName: '',

  setSelectedCharacterId: (id) => set({ selectedCharacterId: id }),

  setCharacterName: (name) => set({ characterName: name }),

  resetCharacter: () => set({ selectedCharacterId: null, characterName: '' }),
}));
