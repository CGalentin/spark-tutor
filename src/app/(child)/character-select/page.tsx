// Character selection page — the first screen a child sees.
// Child picks a Spark Squad mascot, gives it a name, then taps "Let's Go!" to start chatting.
// Must be a client component to read and write useChildStore.

'use client';

import { useRouter } from 'next/navigation';
import { CHARACTERS, getCharacterById } from '@/constants/characters';
import { useChildStore } from '@/store/useChildStore';
import { CharacterGrid } from '@/components/child/CharacterGrid';
import { CharacterNameInput } from '@/components/child/CharacterNameInput';

/** Spark Squad character selection and naming screen. */
export default function CharacterSelectPage() {
  const router = useRouter();

  const selectedCharacterId = useChildStore((s) => s.selectedCharacterId);
  const characterName = useChildStore((s) => s.characterName);
  const setSelectedCharacterId = useChildStore((s) => s.setSelectedCharacterId);
  const setCharacterName = useChildStore((s) => s.setCharacterName);

  const selectedCharacter = selectedCharacterId
    ? getCharacterById(selectedCharacterId)
    : undefined;

  function handleConfirm() {
    router.push('/chat');
  }

  return (
    <main className="flex min-h-screen flex-col items-center bg-gradient-to-b from-violet-100 to-white px-4 py-10">
      {/* Header */}
      <div className="mb-2 text-5xl" aria-hidden="true">
        ✨
      </div>
      <h1 className="mb-2 text-center text-3xl font-extrabold text-slate-800">
        Pick your friend!
      </h1>
      <p className="mb-8 text-center text-lg text-slate-500">
        Choose a Spark Squad buddy to learn with.
      </p>

      {/* Character grid — 2 columns, all 6 characters */}
      <CharacterGrid
        characters={CHARACTERS}
        selectedId={selectedCharacterId}
        onSelect={setSelectedCharacterId}
      />

      {/* Name input — only shown after a character is picked */}
      {selectedCharacter !== undefined && (
        <CharacterNameInput
          character={selectedCharacter}
          name={characterName}
          onNameChange={setCharacterName}
          onConfirm={handleConfirm}
        />
      )}
    </main>
  );
}
