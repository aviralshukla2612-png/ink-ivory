'use client';

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Sparkles } from 'lucide-react';
import { useSlider } from '@/context/SliderContext';

/**
 * WishLanterns Component
 * "Release a Wish Lantern" Interaction:
 * - Clickable floating resting lantern in bottom-right corner (matching user's screenshot).
 * - Clicking the lantern or the "Release a Wish Lantern" button sends lanterns floating upwards
 *   into the night sky with glowing flame, realistic wind sway, and fading into the stars.
 * - Portaled to document.body to escape any slide transform or overflow clipping.
 */
export const WishLanterns = () => {
  const [flyingLanterns, setFlyingLanterns] = useState([]);
  const [toastMessage, setToastMessage] = useState('');
  const [isLanternResting, setIsLanternResting] = useState(true);
  const [mounted, setMounted] = useState(false);
  const { currentSlide, totalSlides } = useSlider();

  const isClosingSlide = currentSlide === totalSlides - 1 || currentSlide === 10;

  useEffect(() => {
    setMounted(true);
  }, []);

  // Launch a single lantern directly from the bottom-right corner where user clicked
  const launchFromCorner = () => {
    const id = Date.now() + Math.random();
    const newLantern = {
      id,
      startX: 84 + Math.random() * 8, // near bottom-right ~84-92%
      size: 54,
      duration: 9 + Math.random() * 2,
      swayAmount: 30 + Math.random() * 15,
    };

    // Temporarily hide resting lantern then fade a new one in
    setIsLanternResting(false);
    setTimeout(() => {
      setIsLanternResting(true);
    }, 1500);

    setFlyingLanterns((prev) => [...prev, newLantern]);
    setToastMessage('✨ Your glowing wish lantern is rising into the night sky for Aarav & Riya!');

    setTimeout(() => {
      setToastMessage('');
    }, 4500);

    setTimeout(() => {
      setFlyingLanterns((prev) => prev.filter((l) => l.id !== id));
    }, 12000);
  };

  // Launch a cluster of 5 lanterns from the central button across the sky
  const launchCluster = () => {
    const now = Date.now();
    const cluster = [
      { id: now + 1, startX: 22 + Math.random() * 6, size: 48, duration: 9.5, swayAmount: -25 },
      { id: now + 2, startX: 36 + Math.random() * 6, size: 54, duration: 10.5, swayAmount: 20 },
      { id: now + 3, startX: 50 + Math.random() * 5, size: 60, duration: 11, swayAmount: -22 },
      { id: now + 4, startX: 64 + Math.random() * 6, size: 52, duration: 10, swayAmount: 25 },
      { id: now + 5, startX: 78 + Math.random() * 6, size: 46, duration: 9, swayAmount: -18 },
    ];

    setFlyingLanterns((prev) => [...prev, ...cluster]);
    setToastMessage('🏮 Your sacred blessings have been released into the midnight sky!');

    setTimeout(() => {
      setToastMessage('');
    }, 4500);

    setTimeout(() => {
      setFlyingLanterns((prev) => prev.filter((l) => !cluster.some((c) => c.id === l.id)));
    }, 13000);
  };

  return (
    <>
      {/* 1. CENTRAL PILL BUTTON matching screenshot: [🏮 RELEASE A WISH LANTERN ✦] */}
      <div className="flex flex-col items-center select-none">
        <button
          type="button"
          onClick={launchCluster}
          className="group relative inline-flex items-center gap-2.5 px-6 sm:px-8 py-3 rounded-full bg-[#121B2E]/90 hover:bg-[#1A263E] border border-[#D6B477]/70 hover:border-[#F4D998] text-[#F3E2BD] hover:text-[#FFFDF7] text-xs font-manrope font-semibold tracking-[0.2em] uppercase shadow-[0_8px_30px_rgba(0,0,0,0.85),0_0_20px_rgba(214,180,119,0.3)] hover:shadow-[0_10px_35px_rgba(214,180,119,0.5)] transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer"
        >
          <span className="text-base">🏮</span>
          <span>Release a Wish Lantern</span>
          <Sparkles className="w-4 h-4 text-[#D6B477] group-hover:rotate-45 transition-transform" />
          <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent rounded-full pointer-events-none" />
        </button>

        {/* Toast confirmation */}
        {toastMessage && (
          <div className="mt-3 px-5 py-2 rounded-full bg-[#0D1524]/95 border border-[#D6B477]/80 shadow-[0_8px_25px_rgba(0,0,0,0.9)] text-xs text-[#FFFDF7] font-serif italic animate-in fade-in duration-300">
            {toastMessage}
          </div>
        )}
      </div>

      {/* 2. PORTALED RESTING LANTERN AND FLYING SKY LANTERNS (Escaping Slide Overflow & Transform) */}
      {mounted &&
        createPortal(
          <>
            {/* Standard Global Keyframes for Sky Lantern Ascent */}
            <style
              dangerouslySetInnerHTML={{
                __html: `
                  @keyframes skyLanternFloat {
                    0% {
                      transform: translate3d(0, 0, 0) scale(0.95);
                      opacity: 0.95;
                    }
                    25% {
                      transform: translate3d(var(--sway-x), -28vh, 0) scale(0.88) rotate(3deg);
                      opacity: 1;
                    }
                    50% {
                      transform: translate3d(calc(var(--sway-x) * -0.6), -58vh, 0) scale(0.75) rotate(-3deg);
                      opacity: 0.95;
                    }
                    75% {
                      transform: translate3d(var(--sway-x), -88vh, 0) scale(0.6) rotate(2deg);
                      opacity: 0.85;
                    }
                    100% {
                      transform: translate3d(calc(var(--sway-x) * -0.3), -125vh, 0) scale(0.35) rotate(-1deg);
                      opacity: 0;
                    }
                  }
                `,
              }}
            />

            {/* Resting Corner Lantern (only shown on the closing slide) */}
            {isClosingSlide && (
              <div className="fixed bottom-6 sm:bottom-8 right-6 sm:right-12 z-[99990] select-none">
                <div
                  onClick={launchFromCorner}
                  className={`group relative cursor-pointer transition-all duration-700 ${
                    isLanternResting ? 'opacity-100 scale-100' : 'opacity-0 scale-75 pointer-events-none'
                  }`}
                  title="Click to release a wish lantern into the sky"
                >
                  {/* Subtle Hover Pulse Aura */}
                  <div className="absolute inset-0 bg-[#FFB732]/35 rounded-full blur-xl scale-125 group-hover:scale-150 group-hover:bg-[#FFB732]/55 transition-all duration-500 animate-pulse" />

                  {/* Lantern SVG Illustration */}
                  <div className="relative w-12 h-16 sm:w-14 sm:h-20 transition-transform duration-300 group-hover:-translate-y-2 group-hover:scale-105">
                    <svg viewBox="0 0 40 52" className="w-full h-full drop-shadow-[0_0_20px_rgba(255,190,80,0.95)]">
                      <defs>
                        <radialGradient id="cornerLanternGlow" cx="50%" cy="65%" r="65%">
                          <stop offset="0%" stopColor="#FFFEE8" />
                          <stop offset="35%" stopColor="#FFC872" />
                          <stop offset="80%" stopColor="#D98A2C" />
                          <stop offset="100%" stopColor="#8C4A11" />
                        </radialGradient>
                      </defs>

                      <path
                        d="M 6 12 C 4 28, 6 42, 10 46 L 30 46 C 34 42, 36 28, 34 12 C 34 6, 26 4, 20 4 C 14 4, 6 6, 6 12 Z"
                        fill="url(#cornerLanternGlow)"
                        stroke="#E7CEA0"
                        strokeWidth="0.8"
                      />
                      <ellipse cx="20" cy="8" rx="13" ry="3" fill="#FFE8B0" fillOpacity="0.7" stroke="#D6B477" strokeWidth="0.8" />
                      <path d="M 12 8 Q 10 26 14 46" stroke="#8C4A11" strokeWidth="0.6" strokeOpacity="0.7" fill="none" />
                      <path d="M 20 5 L 20 46" stroke="#8C4A11" strokeWidth="0.6" strokeOpacity="0.7" fill="none" />
                      <path d="M 28 8 Q 30 26 26 46" stroke="#8C4A11" strokeWidth="0.6" strokeOpacity="0.7" fill="none" />
                      <ellipse cx="20" cy="46" rx="10" ry="2.5" fill="#5E3106" stroke="#D6B477" strokeWidth="0.8" />
                      <circle cx="20" cy="38" r="4.5" fill="#FFFEE0" className="animate-ping" style={{ animationDuration: '2s' }} />
                      <circle cx="20" cy="38" r="6" fill="#FFC872" fillOpacity="0.8" />
                    </svg>
                  </div>

                  {/* Floating Hint Tag */}
                  <span className="absolute -top-7 left-1/2 -translate-x-1/2 whitespace-nowrap text-[9px] font-manrope font-semibold tracking-wider text-[#E7CEA0] opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-[#091321]/90 px-2.5 py-0.5 rounded-full border border-[#D6B477]/40 shadow-sm pointer-events-none">
                    Click to release 🏮
                  </span>
                </div>
              </div>
            )}

            {/* Rising Sky Lanterns Overlay */}
            {flyingLanterns.length > 0 && (
              <div className="fixed inset-0 pointer-events-none z-[99999] overflow-hidden select-none" aria-hidden="true">
                {flyingLanterns.map((l) => (
                  <div
                    key={l.id}
                    className="absolute will-change-transform"
                    style={{
                      left: `${l.startX}%`,
                      bottom: '20px',
                      width: `${l.size}px`,
                      height: `${l.size * 1.3}px`,
                      '--sway-x': `${l.swayAmount}px`,
                      animation: `skyLanternFloat ${l.duration}s cubic-bezier(0.25, 0.1, 0.25, 1) forwards`,
                    }}
                  >
                    <div className="relative w-full h-full">
                      <div className="absolute inset-0 bg-[#FFB732]/45 rounded-full blur-xl scale-150 animate-pulse" />
                      <svg viewBox="0 0 40 52" className="w-full h-full drop-shadow-[0_0_18px_rgba(255,200,90,0.95)]">
                        <defs>
                          <radialGradient id={`skyGlow-${l.id}`} cx="50%" cy="65%" r="65%">
                            <stop offset="0%" stopColor="#FFFEE8" />
                            <stop offset="35%" stopColor="#FFC872" />
                            <stop offset="85%" stopColor="#D98A2C" />
                            <stop offset="100%" stopColor="#8C4A11" />
                          </radialGradient>
                        </defs>
                        <path
                          d="M 6 12 C 4 28, 6 42, 10 46 L 30 46 C 34 42, 36 28, 34 12 C 34 6, 26 4, 20 4 C 14 4, 6 6, 6 12 Z"
                          fill={`url(#skyGlow-${l.id})`}
                          stroke="#E7CEA0"
                          strokeWidth="0.8"
                        />
                        <ellipse cx="20" cy="8" rx="13" ry="3" fill="#FFE8B0" fillOpacity="0.7" stroke="#D6B477" strokeWidth="0.8" />
                        <path d="M 12 8 Q 10 26 14 46" stroke="#8C4A11" strokeWidth="0.6" strokeOpacity="0.7" fill="none" />
                        <path d="M 20 5 L 20 46" stroke="#8C4A11" strokeWidth="0.6" strokeOpacity="0.7" fill="none" />
                        <path d="M 28 8 Q 30 26 26 46" stroke="#8C4A11" strokeWidth="0.6" strokeOpacity="0.7" fill="none" />
                        <ellipse cx="20" cy="46" rx="10" ry="2.5" fill="#5E3106" stroke="#D6B477" strokeWidth="0.8" />
                        <circle cx="20" cy="38" r="4.5" fill="#FFFEE0" />
                        <circle cx="20" cy="38" r="7" fill="#FFC872" fillOpacity="0.7" />
                      </svg>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>,
          document.body
        )}
    </>
  );
};

export default WishLanterns;
