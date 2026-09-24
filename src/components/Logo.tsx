import React from 'react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'light' | 'dark' | 'color';
  showTagline?: boolean;
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({
  size = 'md',
  variant = 'color',
  showTagline = true,
  className = '',
}) => {
  const sizeMap = {
    sm: { height: 'h-9', textMain: 'text-base', textSub: 'text-[9px]', iconSize: 28 },
    md: { height: 'h-12', textMain: 'text-xl', textSub: 'text-[10px]', iconSize: 36 },
    lg: { height: 'h-16', textMain: 'text-2xl', textSub: 'text-xs', iconSize: 48 },
    xl: { height: 'h-24', textMain: 'text-4xl', textSub: 'text-sm', iconSize: 64 },
  };

  const currentSize = sizeMap[size];

  return (
    <div id="sentra-properti-logo" className={`flex items-center gap-3 select-none ${className}`}>
      {/* SVG Icon with House Outline & Wave Banner from Uploaded Reference */}
      <svg
        width={currentSize.iconSize}
        height={currentSize.iconSize}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0 drop-shadow-sm"
      >
        <defs>
          <linearGradient id="goldGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#E2BD56" />
            <stop offset="50%" stopColor="#C9972C" />
            <stop offset="100%" stopColor="#A8741A" />
          </linearGradient>
          <linearGradient id="goldGrad2" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#A8741A" />
            <stop offset="50%" stopColor="#DFB64C" />
            <stop offset="100%" stopColor="#F9DF88" />
          </linearGradient>
          <filter id="goldGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="1" stdDeviation="1.5" floodColor="#916413" floodOpacity="0.3" />
          </filter>
        </defs>

        {/* Roof Outline 1 (Main Peak with Chimney) */}
        {/* Chimney */}
        <path
          d="M38 32V20H45V36"
          stroke="url(#goldGrad1)"
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* Window 4-pane */}
        <rect
          x="44"
          y="35"
          width="12"
          height="12"
          stroke="url(#goldGrad1)"
          strokeWidth="2.5"
          fill="none"
        />
        <line x1="50" y1="35" x2="50" y2="47" stroke="url(#goldGrad1)" strokeWidth="1.5" />
        <line x1="44" y1="41" x2="56" y2="41" stroke="url(#goldGrad1)" strokeWidth="1.5" />

        {/* Primary House Roof */}
        <path
          d="M20 48L50 18L80 48"
          stroke="url(#goldGrad1)"
          strokeWidth="6"
          strokeLinecap="round"
          strokeLinejoin="round"
          filter="url(#goldGlow)"
        />

        {/* Secondary Inner/Right Roof Offset */}
        <path
          d="M62 30L84 52"
          stroke="url(#goldGrad2)"
          strokeWidth="5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M74 42V52H84"
          stroke="url(#goldGrad1)"
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Dynamic Golden Swoosh / Wave Banner at base */}
        <path
          d="M10 56C25 54 40 50 60 52C75 53 85 58 92 62C84 62 68 59 55 58C35 56 22 62 10 56Z"
          fill="url(#goldGrad1)"
          filter="url(#goldGlow)"
        />
      </svg>

      {/* Typography from Image */}
      <div className="flex flex-col justify-center">
        <div className="flex items-baseline tracking-tight font-black font-['Outfit',sans-serif]">
          <span
            className={`${currentSize.textMain} tracking-wider font-extrabold ${
              variant === 'light'
                ? 'text-white'
                : 'text-[#0B1E36]'
            }`}
          >
            SENTRA
          </span>
          <span
            className={`${currentSize.textMain} ml-1.5 font-black tracking-wider bg-gradient-to-r from-[#C29329] via-[#E2BE57] to-[#B37F1D] bg-clip-text text-transparent`}
          >
            PROPERTI
          </span>
        </div>

        {showTagline && (
          <div
            className={`flex items-center gap-1.5 ${currentSize.textSub} font-semibold uppercase tracking-widest ${
              variant === 'light' ? 'text-amber-200/90' : 'text-[#0B1E36]/90'
            }`}
          >
            <span className="h-[1px] w-2.5 bg-amber-500/70 inline-block"></span>
            <span className="font-bold tracking-[0.18em]">SOLUSI PROPERTI TERPERCAYA</span>
            <span className="h-[1px] w-2.5 bg-amber-500/70 inline-block"></span>
          </div>
        )}
      </div>
    </div>
  );
};
