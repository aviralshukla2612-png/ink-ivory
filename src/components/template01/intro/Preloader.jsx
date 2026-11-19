'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';

/**
 * Section 01: Preloader
 * Uses /01_preloader.png
 * - Deep navy full-screen background with gold botanical corner filigree
 * - Elegant animated SVG lotus symbol with stroke reveal & scale
 * - Circular gold progress ring with percentage
 * - Fades smoothly into Section 02 (Grand Entrance)
 */
export const Preloader = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [isFadingOut, setIsFadingOut] = useState(false);

  useEffect(() => {
    // Smooth progress counter over 2.2s
    const startTime = Date.now();
    const duration = 2200;

    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const pct = Math.min(100, Math.round((elapsed / duration) * 100));
      setProgress(pct);

      if (pct >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          setIsFadingOut(true);
          setTimeout(() => {
            if (typeof onComplete === 'function') {
              onComplete();
            }
          }, 600);
        }, 300);
      }
    }, 25);

    return () => clearInterval(interval);
  }, [onComplete]);

  const handleSkip = () => {
    setIsFadingOut(true);
    setTimeout(() => {
      if (typeof onComplete === 'function') {
        onComplete();
      }
    }, 300);
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#091321] transition-opacity duration-700 select-none ${
        isFadingOut ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      {/* Background Graphic: 01_preloader.png */}
      <div className="absolute inset-0 pointer-events-none">
        <Image
          src="/01_preloader.png"
          alt="Ink & Ivory Preloader"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center opacity-90"
        />
        <div className="absolute inset-0 bg-radial-gradient from-transparent via-[#091321]/40 to-[#091321]/80" />
      </div>

      {/* Central Content */}
      <div className="relative z-10 flex flex-col items-center text-center px-6 max-w-md">
        {/* Animated Sacred Lotus Symbol */}
        <div className="relative w-28 h-28 sm:w-32 sm:h-32 mb-6 flex items-center justify-center">
          {/* Subtle Ambient Pulse Halo */}
          <div className="absolute inset-0 rounded-full bg-[#D6B477]/15 blur-2xl animate-pulse" />

          {/* SVG Lotus */}
          <svg
            viewBox="0 0 100 80"
            className="w-20 h-20 text-[#D6B477] drop-shadow-[0_0_12px_rgba(214,180,119,0.6)] animate-in zoom-in-75 duration-1000 ease-out"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Center Petal */}
            <path
              d="M50 10 C46 32 42 48 50 65 C58 48 54 32 50 10 Z"
              stroke="#D6B477"
              strokeWidth="1.8"
              fill="url(#lotusGoldCenter)"
            />
            {/* Inner Left Petal */}
            <path
              d="M50 25 C36 36 28 50 42 66 C47 52 48 40 50 25 Z"
              stroke="#D6B477"
              strokeWidth="1.6"
              fill="url(#lotusGoldSide)"
            />
            {/* Inner Right Petal */}
            <path
              d="M50 25 C64 36 72 50 58 66 C53 52 52 40 50 25 Z"
              stroke="#D6B477"
              strokeWidth="1.6"
              fill="url(#lotusGoldSide)"
            />
            {/* Outer Left Petal */}
            <path
              d="M45 42 C24 45 12 55 32 70 C39 60 42 50 45 42 Z"
              stroke="#D6B477"
              strokeWidth="1.4"
              fill="url(#lotusGoldSide)"
            />
            {/* Outer Right Petal */}
            <path
              d="M55 42 C76 45 88 55 68 70 C61 60 58 50 55 42 Z"
              stroke="#D6B477"
              strokeWidth="1.4"
              fill="url(#lotusGoldSide)"
            />
            {/* Base Ornamental Lotus Cradle */}
            <path
              d="M26 69 Q50 78 74 69"
              stroke="#E7CEA0"
              strokeWidth="1.8"
              strokeLinecap="round"
            />
            <circle cx="50" cy="74" r="2" fill="#E7CEA0" />

            <defs>
              <linearGradient id="lotusGoldCenter" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#E7CEA0" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#D6B477" stopOpacity="0.8" />
              </linearGradient>
              <linearGradient id="lotusGoldSide" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#D6B477" stopOpacity="0.15" />
                <stop offset="100%" stopColor="#D6B477" stopOpacity="0.6" />
              </linearGradient>
            </defs>
          </svg>

          {/* Circular SVG Progress Ring */}
          <svg className="absolute -inset-2 w-32 h-32 sm:w-36 sm:h-36 -rotate-90">
            <circle
              cx="50%"
              cy="50%"
              r="46%"
              stroke="#D6B477"
              strokeWidth="1.5"
              strokeOpacity="0.2"
              fill="none"
            />
            <circle
              cx="50%"
              cy="50%"
              r="46%"
              stroke="url(#progressGrad)"
              strokeWidth="2"
              fill="none"
              strokeLinecap="round"
              style={{
                strokeDasharray: 380,
                strokeDashoffset: 380 - (380 * progress) / 100,
                transition: 'stroke-dashoffset 40ms linear',
              }}
            />
            <defs>
              <linearGradient id="progressGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#D6B477" />
                <stop offset="100%" stopColor="#FFF2D6" />
              </linearGradient>
            </defs>
          </svg>
        </div>

        {/* Brand & Loading Label */}
        <span className="text-[11px] font-manrope font-semibold tracking-[0.3em] uppercase text-[#E7CEA0] mb-2">
          Ink & Ivory
        </span>
        <h2 className="font-cormorant text-xl sm:text-2xl text-[#F7F0E3] font-medium tracking-wide mb-3">
          Royal Wedding Invitation
        </h2>

        {/* Numeric Counter */}
        <div className="flex items-center gap-2 text-xs font-manrope text-[#D6B477]/80 mb-5">
          <span className="w-8 text-right font-medium">{progress}%</span>
          <span className="w-1.5 h-1.5 rounded-full bg-[#D6B477] animate-ping" />
        </div>

        {/* Skip button for guests */}
        <button
          onClick={handleSkip}
          className="text-[11px] font-manrope text-[#E7CEA0]/60 hover:text-[#E7CEA0] transition-colors underline-offset-4 hover:underline cursor-pointer"
        >
          Skip intro →
        </button>
      </div>
    </div>
  );
};

export default Preloader;
