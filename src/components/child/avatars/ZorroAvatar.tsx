// ZorroAvatar — Zorro the dragon. Horns, wings, bright green palette.

interface ZorroAvatarProps {
  animationClass?: string;
  size?: number;
}

/** Zorro the brave dragon — horns, scales, little wings. */
export function ZorroAvatar({ animationClass = '', size = 120 }: ZorroAvatarProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Zorro the dragon"
      className={animationClass}
    >
      {/* Wings */}
      <ellipse cx="22" cy="72" rx="18" ry="26" fill="#86EFAC" transform="rotate(20 22 72)" />
      <ellipse cx="98" cy="72" rx="18" ry="26" fill="#86EFAC" transform="rotate(-20 98 72)" />
      {/* Body */}
      <ellipse cx="60" cy="88" rx="26" ry="20" fill="#22C55E" />
      {/* Belly scales */}
      <ellipse cx="60" cy="90" rx="14" ry="12" fill="#BBF7D0" />
      {/* Head */}
      <ellipse cx="60" cy="50" rx="30" ry="28" fill="#22C55E" />
      {/* Horns */}
      <polygon points="42,24 36,4 48,18" fill="#16A34A" />
      <polygon points="78,24 84,4 72,18" fill="#16A34A" />
      {/* Snout */}
      <ellipse cx="60" cy="60" rx="14" ry="10" fill="#4ADE80" />
      {/* Nostrils */}
      <circle cx="55" cy="62" r="2.5" fill="#16A34A" />
      <circle cx="65" cy="62" r="2.5" fill="#16A34A" />
      {/* Eyes */}
      <circle cx="46" cy="44" r="7" fill="#FBBF24" />
      <circle cx="74" cy="44" r="7" fill="#FBBF24" />
      <circle cx="46" cy="44" r="4" fill="#1C1917" />
      <circle cx="74" cy="44" r="4" fill="#1C1917" />
      <circle cx="48" cy="42" r="2" fill="white" />
      <circle cx="76" cy="42" r="2" fill="white" />
      {/* Smile */}
      <path
        d="M50 66 Q60 74 70 66"
        stroke="#16A34A"
        strokeWidth="2.5"
        strokeLinecap="round"
        fill="none"
      />
      {/* Spines on head */}
      <polygon points="56,22 52,12 60,18" fill="#16A34A" />
      <polygon points="64,22 60,12 68,18" fill="#16A34A" />
    </svg>
  );
}
