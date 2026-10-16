import React from 'react';

interface LogoProps {
  className?: string;
  size?: number;
  showText?: boolean;
}

export const NexaloraLogo: React.FC<LogoProps> = ({
  className = '',
  size = 32,
  showText = true,
}) => {
  return (
    <div className={`inline-flex items-center gap-2.5 select-none ${className}`}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 56 56"
        width={size}
        height={size}
        fill="none"
        className="shrink-0"
      >
        <defs>
          <linearGradient id="portalGradMark" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#0284C7" />
            <stop offset="50%" stopColor="#5B5BD6" />
            <stop offset="100%" stopColor="#EC4899" />
          </linearGradient>
        </defs>

        {/* Outer Soft Glow Circle */}
        <circle cx="28" cy="28" r="28" fill="#EEF2FF" />

        {/* Compass Pointer Arc */}
        <path
          d="M12 28 A 16 16 0 0 1 44 28"
          stroke="url(#portalGradMark)"
          strokeWidth="4.5"
          strokeLinecap="round"
        />

        {/* Forward Compass Needle pointing to Top-Right */}
        <polygon points="28,28 39,17 29,13 24,24" fill="#5B5BD6" />
        <polygon points="28,28 17,39 27,43 32,32" fill="#93C5FD" />

        {/* Central Star Core */}
        <circle cx="28" cy="28" r="3.5" fill="#FFFFFF" />
        <circle cx="28" cy="28" r="1.5" fill="#312E81" />
      </svg>
      {showText && (
        <span className="font-bold text-[18px] tracking-tight text-[#111827]">
          NEXALORA
        </span>
      )}
    </div>
  );
};
