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
    sm: { imgClass: 'w-8 h-8', textMain: 'text-base', textSub: 'text-[9px]' },
    md: { imgClass: 'w-10 h-10 sm:w-11 sm:h-11', textMain: 'text-xl', textSub: 'text-[10px]' },
    lg: { imgClass: 'w-12 h-12 sm:w-14 sm:h-14', textMain: 'text-2xl', textSub: 'text-xs' },
    xl: { imgClass: 'w-16 h-16 sm:w-20 sm:h-20', textMain: 'text-4xl', textSub: 'text-sm' },
  };

  const currentSize = sizeMap[size];

  return (
    <div id="sentra-properti-logo" className={`flex items-center gap-2.5 sm:gap-3 select-none ${className}`}>
      {/* Logo 3D Gold Emblem yang diupload pengguna */}
      <div className={`${currentSize.imgClass} rounded-full overflow-hidden shrink-0 shadow-md ring-1 ring-amber-400/50 bg-[#0B1E36]`}>
        <img
          src="/assets/aistudio/12502_4a7b0b64.png"
          alt="Logo Sentra Properti"
          className="w-full h-full object-cover scale-102"
        />
      </div>

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
