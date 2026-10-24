// StellaAvatar — Stella the starfish. Five arms, rose palette, friendly face.
// Arm color is rose-700 so she stays visible on the rose-400 character card.
// The face is rose-100. Eyes and smile use rose-800.

interface StellaAvatarProps {
  animationClass?: string;
  size?: number;
}

/** Stella the starfish — five arms around a smiling face. */
export function StellaAvatar({ animationClass = '', size = 120 }: StellaAvatarProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Stella the starfish"
      className={animationClass}
    >
      {/* Arms. Longer than they are wide, so she reads as a starfish. */}
      <ellipse cx="60" cy="28" rx="8" ry="26" fill="#BE123C" transform="rotate(0 60 60)" />
      <ellipse cx="60" cy="28" rx="8" ry="26" fill="#BE123C" transform="rotate(72 60 60)" />
      <ellipse cx="60" cy="28" rx="8" ry="26" fill="#BE123C" transform="rotate(144 60 60)" />
      <ellipse cx="60" cy="28" rx="8" ry="26" fill="#BE123C" transform="rotate(216 60 60)" />
      <ellipse cx="60" cy="28" rx="8" ry="26" fill="#BE123C" transform="rotate(288 60 60)" />
      {/* Face */}
      <circle cx="60" cy="60" r="16" fill="#FFE4E6" />
      {/* Eyes */}
      <circle cx="52" cy="56" r="5" fill="#9F1239" />
      <circle cx="68" cy="56" r="5" fill="#9F1239" />
      <circle cx="54" cy="54" r="1.5" fill="white" />
      <circle cx="70" cy="54" r="1.5" fill="white" />
      {/* Smile */}
      <path
        d="M52 66 Q60 73 68 66"
        stroke="#9F1239"
        strokeWidth="2.5"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
}
