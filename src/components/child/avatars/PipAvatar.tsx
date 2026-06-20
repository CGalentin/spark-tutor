// PipAvatar — Pip the fairy. Wings, wand, purple/sparkle palette.

interface PipAvatarProps {
  animationClass?: string;
  size?: number;
}

/** Pip the whimsical fairy — delicate wings, wand with a star. */
export function PipAvatar({ animationClass = '', size = 120 }: PipAvatarProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Pip the fairy"
      className={animationClass}
    >
      {/* Wings */}
      <ellipse cx="26" cy="60" rx="20" ry="28" fill="#DDD6FE" opacity="0.85" transform="rotate(15 26 60)" />
      <ellipse cx="94" cy="60" rx="20" ry="28" fill="#DDD6FE" opacity="0.85" transform="rotate(-15 94 60)" />
      <ellipse cx="30" cy="80" rx="12" ry="18" fill="#EDE9FE" opacity="0.7" transform="rotate(20 30 80)" />
      <ellipse cx="90" cy="80" rx="12" ry="18" fill="#EDE9FE" opacity="0.7" transform="rotate(-20 90 80)" />
      {/* Body */}
      <ellipse cx="60" cy="88" rx="18" ry="16" fill="#A855F7" />
      {/* Dress sparkle */}
      <ellipse cx="60" cy="92" rx="12" ry="10" fill="#C084FC" />
      {/* Head */}
      <circle cx="60" cy="50" r="26" fill="#A855F7" />
      {/* Hair */}
      <ellipse cx="60" cy="32" rx="26" ry="10" fill="#7E22CE" />
      {/* Eyes */}
      <circle cx="50" cy="48" r="5.5" fill="#EDE9FE" />
      <circle cx="70" cy="48" r="5.5" fill="#EDE9FE" />
      <circle cx="50" cy="48" r="3" fill="#581C87" />
      <circle cx="70" cy="48" r="3" fill="#581C87" />
      <circle cx="51" cy="46" r="1.5" fill="white" />
      <circle cx="71" cy="46" r="1.5" fill="white" />
      {/* Cheeks */}
      <ellipse cx="40" cy="55" rx="6" ry="4" fill="#F0ABFC" opacity="0.6" />
      <ellipse cx="80" cy="55" rx="6" ry="4" fill="#F0ABFC" opacity="0.6" />
      {/* Smile */}
      <path d="M50 58 Q60 66 70 58" stroke="#7E22CE" strokeWidth="2.5" strokeLinecap="round" fill="none" />
      {/* Wand */}
      <line x1="90" y1="30" x2="104" y2="16" stroke="#FBBF24" strokeWidth="3" strokeLinecap="round" />
      <polygon points="104,8 107,16 99,14 106,20 98,18" fill="#FBBF24" />
      {/* Sparkles */}
      <circle cx="16" cy="28" r="3" fill="#FDE68A" />
      <circle cx="106" cy="50" r="2" fill="#FDE68A" />
      <circle cx="20" cy="90" r="2" fill="#FDE68A" />
    </svg>
  );
}
