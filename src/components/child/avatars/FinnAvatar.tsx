// FinnAvatar — Finn the fox. Triangle ears, bushy tail, orange palette.

interface FinnAvatarProps {
  animationClass?: string;
  size?: number;
}

/** Finn the playful fox — pointed ears, round face, fluffy tail. */
export function FinnAvatar({ animationClass = '', size = 120 }: FinnAvatarProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Finn the fox"
      className={animationClass}
    >
      {/* Body */}
      <ellipse cx="60" cy="88" rx="28" ry="22" fill="#F97316" />
      {/* Chest white patch */}
      <ellipse cx="60" cy="92" rx="14" ry="14" fill="#FED7AA" />
      {/* Head */}
      <circle cx="60" cy="50" r="32" fill="#F97316" />
      {/* Ears (triangle) */}
      <polygon points="34,28 22,4 48,18" fill="#F97316" />
      <polygon points="86,28 98,4 72,18" fill="#F97316" />
      {/* Inner ears */}
      <polygon points="36,26 27,9 46,20" fill="#FBBF24" />
      <polygon points="84,26 93,9 74,20" fill="#FBBF24" />
      {/* Face white muzzle */}
      <ellipse cx="60" cy="58" rx="16" ry="12" fill="#FED7AA" />
      {/* Eyes */}
      <circle cx="48" cy="46" r="6" fill="#1C1917" />
      <circle cx="72" cy="46" r="6" fill="#1C1917" />
      {/* Eye shine */}
      <circle cx="50" cy="44" r="2" fill="white" />
      <circle cx="74" cy="44" r="2" fill="white" />
      {/* Nose */}
      <ellipse cx="60" cy="56" rx="3" ry="2" fill="#92400E" />
      {/* Smile */}
      <path
        d="M52 62 Q60 68 68 62"
        stroke="#92400E"
        strokeWidth="2.5"
        strokeLinecap="round"
        fill="none"
      />
      {/* Tail */}
      <ellipse cx="88" cy="100" rx="14" ry="10" fill="#F97316" transform="rotate(-30 88 100)" />
      <ellipse cx="88" cy="100" rx="7" ry="5" fill="#FED7AA" transform="rotate(-30 88 100)" />
    </svg>
  );
}
