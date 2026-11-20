'use client';

import React, { useEffect, useState, useRef } from 'react';

/**
 * Section 01: Preloader
 * - Pure luxury deep midnight navy with golden stardust gradient (NO background image)
 * - Preloads critical gate & intro assets
 * - Animated sacred gold lotus bloom
 * - Circular gold progress counter
 * - Reliable skip functionality with full timer cleanup
 */
export const Preloader = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [isFadingOut, setIsFadingOut] = useState(false);
  const onCompleteRef = useRef(onComplete);

  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  useEffect(() => {
    let isCancelled = false;

    // 1. Preload entrance assets in the background
    const criticalAssets = [
      '/02_grand_entrance_closed_gate.png',
      '/04_welcome_intro.png',
    ];

    criticalAssets.forEach((src) => {
      if (typeof window !== 'undefined') {
        const img = new window.Image();
        img.src = src;
      }
    });

    // 2. Smooth progress increment
    const duration = 1800; // 1.8s
    const startTime = performance.now();

    const updateProgress = () => {
      if (isCancelled) return;
      const elapsed = performance.now() - startTime;
      const current = Math.min(100, Math.round((elapsed / duration) * 100));
      setProgress(current);

      if (current < 100) {
        requestAnimationFrame(updateProgress);
      } else {
        const timeoutA = setTimeout(() => {
          if (isCancelled) return;
          setIsFadingOut(true);

          const timeoutB = setTimeout(() => {
            if (isCancelled) return;
            if (typeof onCompleteRef.current === 'function') {
              onCompleteRef.current();
            }
          }, 500);

          return () => clearTimeout(timeoutB);
        }, 200);

        return () => clearTimeout(timeoutA);
      }
    };

    const animFrame = requestAnimationFrame(updateProgress);

    return () => {
      isCancelled = true;
      cancelAnimationFrame(animFrame);
    };
  }, []);

  const handleSkip = () => {
    setIsFadingOut(true);
    setTimeout(() => {
      if (typeof onCompleteRef.current === 'function') {
        onCompleteRef.current();
      }
    }, 250);
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#091321] transition-opacity duration-600 select-none ${
        isFadingOut ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
      style={{
        background: 'radial-gradient(circle at center, #0e1e38 0%, #08111e 60%, #040810 100%)',
      }}
    >
      {/* Decorative Gold Botanical Corner Flourishes (Pure SVG Vectors) */}
      <div className="absolute top-6 left-6 w-24 h-24 pointer-events-none opacity-40">
        <svg viewBox="0 0 100 100" fill="none" stroke="#D6B477" strokeWidth="1.2">
          <path d="M10 10 H90 M10 10 V90" />
          <path d="M18 18 H70 M18 18 V70" strokeWidth="0.8" />
          <circle cx="10" cy="10" r="4" fill="#D6B477" />
          <path d="M25 25 Q45 10 70 25 Q85 45 70 70" strokeWidth="0.6" strokeDasharray="2 2" />
        </svg>
      </div>

      <div className="absolute top-6 right-6 w-24 h-24 pointer-events-none opacity-40 rotate-90">
        <svg viewBox="0 0 100 100" fill="none" stroke="#D6B477" strokeWidth="1.2">
          <path d="M10 10 H90 M10 10 V90" />
          <path d="M18 18 H70 M18 18 V70" strokeWidth="0.8" />
          <circle cx="10" cy="10" r="4" fill="#D6B477" />
        </svg>
      </div>

      <div className="absolute bottom-6 left-6 w-24 h-24 pointer-events-none opacity-40 -rotate-90">
        <svg viewBox="0 0 100 100" fill="none" stroke="#D6B477" strokeWidth="1.2">
          <path d="M10 10 H90 M10 10 V90" />
          <path d="M18 18 H70 M18 18 V70" strokeWidth="0.8" />
          <circle cx="10" cy="10" r="4" fill="#D6B477" />
        </svg>
      </div>

      <div className="absolute bottom-6 right-6 w-24 h-24 pointer-events-none opacity-40 rotate-180">
        <svg viewBox="0 0 100 100" fill="none" stroke="#D6B477" strokeWidth="1.2">
          <path d="M10 10 H90 M10 10 V90" />
          <path d="M18 18 H70 M18 18 V70" strokeWidth="0.8" />
          <circle cx="10" cy="10" r="4" fill="#D6B477" />
        </svg>
      </div>

      {/* Central Content */}
      <div className="relative z-10 flex flex-col items-center text-center px-6 max-w-md">
        {/* Animated Sacred Lotus Symbol */}
        <div className="relative w-28 h-28 sm:w-32 sm:h-32 mb-6 flex items-center justify-center">
          <div className="absolute inset-0 rounded-full bg-[#D6B477]/15 blur-2xl animate-pulse" />

          <svg
            viewBox="0 0 100 80"
            className="w-24 h-24 sm:w-28 sm:h-28 text-[#D6B477] drop-shadow-[0_0_15px_rgba(214,180,119,0.7)]"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Center Petal */}
            <path
              d="M50 8 C44 28 40 45 50 64 C60 45 56 28 50 8 Z"
              stroke="#D6B477"
              strokeWidth="1.8"
              fill="rgba(214,180,119,0.25)"
              className="transition-all duration-700"
            />
            {/* Left Inner Petal */}
            <path
              d="M50 22 C34 33 26 48 40 65 C46 51 47 38 50 22 Z"
              stroke="#D6B477"
              strokeWidth="1.5"
              fill="rgba(214,180,119,0.18)"
            />
            {/* Right Inner Petal */}
            <path
              d="M50 22 C66 33 74 48 60 65 C54 51 53 38 50 22 Z"
              stroke="#D6B477"
              strokeWidth="1.5"
              fill="rgba(214,180,119,0.18)"
            />
            {/* Left Outer Petal */}
            <path
              d="M44 38 C26 46 16 58 32 70 C39 58 41 48 44 38 Z"
              stroke="#E7CEA0"
              strokeWidth="1.2"
              fill="rgba(214,180,119,0.12)"
            />
            {/* Right Outer Petal */}
            <path
              d="M56 38 C74 46 84 58 68 70 C61 58 59 48 56 38 Z"
              stroke="#E7CEA0"
              strokeWidth="1.2"
              fill="rgba(214,180,119,0.12)"
            />
            {/* Base Golden Arc */}
            <path
              d="M24 68 Q50 78 76 68"
              stroke="#E7CEA0"
              strokeWidth="1.8"
              strokeLinecap="round"
            />
          </svg>
        </div>

        {/* Brand Name */}
        <h1 className="font-cormorant text-2xl sm:text-3xl font-medium tracking-[0.25em] uppercase text-[#F7F0E3] mb-2 drop-shadow-sm">
          You Are Mine
        </h1>
        <p className="font-serif italic text-xs sm:text-sm text-[#D6B477] tracking-widest uppercase mb-8">
          Digital Wedding Invitations
        </p>

        {/* Progress Ring with Percentage */}
        <div className="flex flex-col items-center gap-3">
          <div className="relative w-16 h-16 flex items-center justify-center">
            <svg className="w-16 h-16 -rotate-90" viewBox="0 0 64 64">
              <circle
                cx="32"
                cy="32"
                r="28"
                stroke="rgba(214, 180, 119, 0.2)"
                strokeWidth="2"
                fill="none"
              />
              <circle
                cx="32"
                cy="32"
                r="28"
                stroke="#D6B477"
                strokeWidth="2.5"
                strokeDasharray={175.9}
                strokeDashoffset={175.9 - (175.9 * progress) / 100}
                strokeLinecap="round"
                fill="none"
                className="transition-all duration-150 ease-out"
              />
            </svg>
            <span className="absolute font-manrope text-xs font-semibold text-[#E7CEA0]">
              {progress}%
            </span>
          </div>
          <span className="text-[11px] font-manrope text-[#FAF5ED]/70 tracking-widest uppercase">
            Opening Auspicious Celebration...
          </span>
        </div>

        {/* Skip Button */}
        <button
          type="button"
          onClick={handleSkip}
          className="mt-8 text-xs font-manrope text-[#D6B477]/70 hover:text-[#FFFDF7] uppercase tracking-widest transition-colors py-1 px-4 border border-[#D6B477]/30 hover:border-[#D6B477] rounded-full cursor-pointer focus:outline-none"
        >
          Skip Intro
        </button>
      </div>
    </div>
  );
};

export default Preloader;
