import React from 'react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'full' | 'icon' | 'white';
  className?: string;
}

export const DigiHubLogo: React.FC<LogoProps> = ({ size = 'md', variant = 'full', className = '' }) => {
  const sizeMap = {
    sm: { icon: 24, text: 'text-base', sub: 'text-[9px]' },
    md: { icon: 36, text: 'text-xl', sub: 'text-[11px]' },
    lg: { icon: 48, text: 'text-2xl', sub: 'text-xs' },
    xl: { icon: 64, text: 'text-3xl', sub: 'text-sm' },
  };

  const currentSize = sizeMap[size];

  return (
    <div className={`flex items-center gap-2.5 select-none ${className}`} id="digihub-logo">
      {/* Brand Icon: Shield + CCTV Lens + Network Convergence */}
      <div className="relative flex-shrink-0 flex items-center justify-center">
        <svg
          width={currentSize.icon}
          height={currentSize.icon}
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="drop-shadow-sm transition-transform hover:scale-105 duration-300"
        >
          <defs>
            <linearGradient id="shieldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#0284c7" />
              <stop offset="35%" stopColor="#06b6d4" />
              <stop offset="70%" stopColor="#8b5cf6" />
              <stop offset="100%" stopColor="#f97316" />
            </linearGradient>
            <linearGradient id="lensGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#06b6d4" />
              <stop offset="50%" stopColor="#10b981" />
              <stop offset="100%" stopColor="#0284c7" />
            </linearGradient>
            <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Outer Security Shield */}
          <path
            d="M50 8L86 22V50C86 72 70 88 50 94C30 88 14 72 14 50V22L50 8Z"
            stroke="url(#shieldGrad)"
            strokeWidth="5"
            strokeLinejoin="round"
            fill="#0f172a"
          />

          {/* Connected Network Nodes */}
          <line x1="50" y1="22" x2="30" y2="38" stroke="#06b6d4" strokeWidth="2" strokeDasharray="2 2" />
          <line x1="50" y1="22" x2="70" y2="38" stroke="#8b5cf6" strokeWidth="2" strokeDasharray="2 2" />
          <line x1="30" y1="38" x2="50" y2="52" stroke="#10b981" strokeWidth="2" />
          <line x1="70" y1="38" x2="50" y2="52" stroke="#f97316" strokeWidth="2" />
          <line x1="50" y1="52" x2="50" y2="78" stroke="#0284c7" strokeWidth="2.5" />

          {/* Network Node Dots */}
          <circle cx="50" cy="22" r="3.5" fill="#06b6d4" />
          <circle cx="30" cy="38" r="3" fill="#10b981" />
          <circle cx="70" cy="38" r="3" fill="#8b5cf6" />
          <circle cx="50" cy="78" r="3.5" fill="#f97316" />

          {/* CCTV Aperture / Center Security Eye */}
          <circle cx="50" cy="52" r="14" fill="#090d16" stroke="url(#lensGrad)" strokeWidth="3" />
          <circle cx="50" cy="52" r="7" fill="#0284c7" />
          <circle cx="48" cy="50" r="2.5" fill="#ffffff" opacity="0.9" />

          {/* Active Live Pulse Ring */}
          <circle cx="50" cy="52" r="19" stroke="#10b981" strokeWidth="1.5" strokeOpacity="0.6" strokeDasharray="4 3" />
        </svg>
      </div>

      {/* Brand Text */}
      {variant !== 'icon' && (
        <div className="flex flex-col leading-tight">
          <div className="flex items-center gap-1.5">
            <span className={`font-black tracking-tight ${currentSize.text} ${variant === 'white' ? 'text-white' : 'text-slate-900'}`}>
              DIGI
            </span>
            <span className={`font-extrabold tracking-tight px-1.5 py-0.5 rounded text-white bg-gradient-to-r from-sky-600 via-cyan-600 to-emerald-600 ${currentSize.text}`}>
              Hub
            </span>
          </div>
          <span className={`font-semibold tracking-wider uppercase text-sky-600 dark:text-sky-400 ${currentSize.sub}`}>
            CCTV & Network Solutions
          </span>
        </div>
      )}
    </div>
  );
};
