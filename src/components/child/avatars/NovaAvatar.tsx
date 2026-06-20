// NovaAvatar — Nova the owl. Round head, large eyes, feathery body, yellow palette.

interface NovaAvatarProps {
  animationClass?: string;
  size?: number;
}

/** Nova the wise owl — big round eyes, feather tufts, warm yellow palette. */
export function NovaAvatar({ animationClass = '', size = 120 }: NovaAvatarProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Nova the owl"
      className={animationClass}
    >
      {/* Wings */}
      <ellipse cx="22" cy="82" rx="18" ry="26" fill="#CA8A04" transform="rotate(10 22 82)" />
      <ellipse cx="98" cy="82" rx="18" ry="26" fill="#CA8A04" transform="rotate(-10 98 82)" />
      {/* Body */}
      <ellipse cx="60" cy="88" rx="26" ry="22" fill="#EAB308" />
      {/* Chest feathers */}
      <ellipse cx="60" cy="90" rx="16" ry="14" fill="#FEF08A" />
      {/* Head */}
      <circle cx="60" cy="50" r="32" fill="#EAB308" />
      {/* Ear tufts */}
      <polygon points="40,20 32,4 50,16" fill="#CA8A04" />
      <polygon points="80,20 88,4 70,16" fill="#CA8A04" />
      {/* Face disc */}
      <ellipse cx="60" cy="54" rx="24" ry="20" fill="#FEF08A" />
      {/* Eyes — large and round */}
      <circle cx="46" cy="50" r="11" fill="#FEF08A" />
      <circle cx="74" cy="50" r="11" fill="#FEF08A" />
      <circle cx="46" cy="50" r="8" fill="#92400E" />
      <circle cx="74" cy="50" r="8" fill="#92400E" />
      <circle cx="46" cy="50" r="4" fill="#1C1917" />
      <circle cx="74" cy="50" r="4" fill="#1C1917" />
      <circle cx="48" cy="48" r="2" fill="white" />
      <circle cx="76" cy="48" r="2" fill="white" />
      {/* Beak */}
      <polygon points="57,60 63,60 60,68" fill="#CA8A04" />
      {/* Talons */}
      <ellipse cx="46" cy="108" rx="10" ry="5" fill="#CA8A04" />
      <ellipse cx="74" cy="108" rx="10" ry="5" fill="#CA8A04" />
    </svg>
  );
}
