// BramAvatar — Bram the bear cub. Round ears, amber fur, dark snout.
// Hex colors match Tailwind amber-600 fur, amber-200 muzzle, and amber-800 features
// so the cub stays visible on the amber-500 character card.

interface BramAvatarProps {
  animationClass?: string;
  size?: number;
}

/** Bram the bear cub — round ears, short snout, sturdy body. */
export function BramAvatar({ animationClass = '', size = 120 }: BramAvatarProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Bram the bear cub"
      className={animationClass}
    >
      {/* Ears */}
      <circle cx="38" cy="30" r="14" fill="#D97706" />
      <circle cx="82" cy="30" r="14" fill="#D97706" />
      <circle cx="38" cy="30" r="7" fill="#FDE68A" />
      <circle cx="82" cy="30" r="7" fill="#FDE68A" />
      {/* Body */}
      <ellipse cx="60" cy="96" rx="28" ry="18" fill="#D97706" />
      {/* Belly */}
      <ellipse cx="60" cy="100" rx="16" ry="11" fill="#FDE68A" />
      {/* Head */}
      <circle cx="60" cy="54" r="28" fill="#D97706" />
      {/* Snout */}
      <ellipse cx="60" cy="66" rx="14" ry="11" fill="#FDE68A" />
      {/* Eyes */}
      <circle cx="48" cy="50" r="6" fill="#92400E" />
      <circle cx="72" cy="50" r="6" fill="#92400E" />
      <circle cx="50" cy="48" r="2" fill="white" />
      <circle cx="74" cy="48" r="2" fill="white" />
      {/* Nose */}
      <ellipse cx="60" cy="62" rx="5" ry="4" fill="#92400E" />
      {/* Smile */}
      <path
        d="M52 70 Q60 76 68 70"
        stroke="#92400E"
        strokeWidth="2.5"
        strokeLinecap="round"
        fill="none"
      />
      {/* Paws */}
      <ellipse cx="36" cy="110" rx="10" ry="6" fill="#D97706" />
      <ellipse cx="84" cy="110" rx="10" ry="6" fill="#D97706" />
    </svg>
  );
}
