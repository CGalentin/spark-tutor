// BlipAvatar — Blip the robot. Simple geometric SVG, bright blue palette.

interface BlipAvatarProps {
  /** Animation state applied via CSS class — controls idle/thinking/celebration. */
  animationClass?: string;
  size?: number;
}

/** Blip the friendly robot — circular head, antenna, square body, bolts. */
export function BlipAvatar({ animationClass = '', size = 120 }: BlipAvatarProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Blip the robot"
      className={animationClass}
    >
      {/* Body */}
      <rect x="30" y="65" width="60" height="42" rx="8" fill="#3B82F6" />
      {/* Chest panel */}
      <rect x="42" y="75" width="36" height="22" rx="4" fill="#93C5FD" />
      {/* Chest light */}
      <circle cx="60" cy="86" r="5" fill="#BFDBFE" />
      {/* Head */}
      <rect x="28" y="22" width="64" height="46" rx="14" fill="#2563EB" />
      {/* Eyes */}
      <rect x="38" y="35" width="16" height="12" rx="4" fill="#BFDBFE" />
      <rect x="66" y="35" width="16" height="12" rx="4" fill="#BFDBFE" />
      {/* Eye pupils */}
      <circle cx="46" cy="41" r="4" fill="#1E40AF" />
      <circle cx="74" cy="41" r="4" fill="#1E40AF" />
      {/* Smile */}
      <path
        d="M44 56 Q60 66 76 56"
        stroke="#BFDBFE"
        strokeWidth="3"
        strokeLinecap="round"
        fill="none"
      />
      {/* Antenna */}
      <line x1="60" y1="22" x2="60" y2="8" stroke="#2563EB" strokeWidth="4" strokeLinecap="round" />
      <circle cx="60" cy="6" r="5" fill="#60A5FA" />
      {/* Ears */}
      <rect x="18" y="36" width="10" height="18" rx="4" fill="#2563EB" />
      <rect x="92" y="36" width="10" height="18" rx="4" fill="#2563EB" />
    </svg>
  );
}
