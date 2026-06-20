// LunaAvatar — Luna the bunny. Long ears, soft pink palette, gentle face.

interface LunaAvatarProps {
  animationClass?: string;
  size?: number;
}

/** Luna the gentle bunny — tall ears, round face, little paws. */
export function LunaAvatar({ animationClass = '', size = 120 }: LunaAvatarProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Luna the bunny"
      className={animationClass}
    >
      {/* Ears */}
      <ellipse cx="42" cy="22" rx="10" ry="22" fill="#F9A8D4" />
      <ellipse cx="78" cy="22" rx="10" ry="22" fill="#F9A8D4" />
      {/* Inner ear */}
      <ellipse cx="42" cy="22" rx="5" ry="16" fill="#FBCFE8" />
      <ellipse cx="78" cy="22" rx="5" ry="16" fill="#FBCFE8" />
      {/* Body */}
      <ellipse cx="60" cy="90" rx="28" ry="22" fill="#F9A8D4" />
      {/* Tummy */}
      <ellipse cx="60" cy="94" rx="16" ry="14" fill="#FBCFE8" />
      {/* Head */}
      <circle cx="60" cy="54" r="30" fill="#F9A8D4" />
      {/* Cheek blush */}
      <ellipse cx="42" cy="62" rx="8" ry="5" fill="#FDA4AF" opacity="0.5" />
      <ellipse cx="78" cy="62" rx="8" ry="5" fill="#FDA4AF" opacity="0.5" />
      {/* Eyes */}
      <circle cx="48" cy="50" r="6" fill="#BE185D" />
      <circle cx="72" cy="50" r="6" fill="#BE185D" />
      <circle cx="50" cy="48" r="2" fill="white" />
      <circle cx="74" cy="48" r="2" fill="white" />
      {/* Nose */}
      <ellipse cx="60" cy="61" rx="4" ry="3" fill="#BE185D" />
      {/* Smile */}
      <path d="M52 66 Q60 74 68 66" stroke="#BE185D" strokeWidth="2.5" strokeLinecap="round" fill="none" />
      {/* Little paws */}
      <ellipse cx="36" cy="106" rx="10" ry="7" fill="#F9A8D4" />
      <ellipse cx="84" cy="106" rx="10" ry="7" fill="#F9A8D4" />
    </svg>
  );
}
