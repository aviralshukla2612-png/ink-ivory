'use client';

import React, { useState, useEffect } from 'react';
import { Sparkles } from 'lucide-react';

/**
 * WishLanterns Component (Feature 5.8)
 * "Release a Wish Lantern" interaction:
 * Floating glowing lanterns rise up from the bottom of the screen into the royal night sky.
 * Each lantern has a warm flickering flame, gold ribs, and gentle sway.
 */
export const WishLanterns = ({ onTrigger, active = false }) => {
  const [lanterns, setLanterns] = useState([]);
  const [toastMessage, setToastMessage] = useState('');

  const launchLanterns = () => {
    // Generate 3 glowing lanterns with slightly staggered start positions and delays
    const newLanterns = [
      { id: Date.now() + 1, left: 35 + Math.random() * 8, size: 46, delay: 0, duration: 10 },
      { id: Date.now() + 2, left: 48 + Math.random() * 8, size: 54, delay: 0.8, duration: 11.5 },
      { id: Date.now() + 3, left: 60 + Math.random() * 8, size: 42, delay: 1.6, duration: 9.5 },
    ];

    setLanterns((prev) => [...prev, ...newLanterns]);
    setToastMessage('✨ Your blessing has been released into the night sky for Aarav & Riya!');

    // Clear toast after 4.5s
    setTimeout(() => {
      setToastMessage('');
    }, 4500);

    // Clean up lanterns after animation finishes
    setTimeout(() => {
      setLanterns((prev) => prev.filter((l) => !newLanterns.some((nl) => nl.id === l.id)));
    }, 13000);
  };

  return (
    <>
      {/* 1. Release Button (Rendered within footer or closing section) */}
      <div className="flex flex-col items-center">
        <button
          type="button"
          onClick={launchLanterns}
          className="group relative inline-flex items-center gap-2.5 px-7 py-3 rounded-full bg-[#172039] hover:bg-[#1C2842] border border-[#C5A46D]/60 hover:border-[#C5A46D] text-[#D8C39A] hover:text-[#FAF5ED] text-xs font-manrope font-semibold tracking-widest uppercase shadow-[0_4px_20px_rgba(0,0,0,0.6),0_0_15px_rgba(197,164,109,0.25)] hover:shadow-[0_6px_25px_rgba(197,164,109,0.45)] transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer"
        >
          <span className="text-base">🏮</span>
          <span>Release a Wish Lantern</span>
          <Sparkles className="w-3.5 h-3.5 text-[#C5A46D] group-hover:rotate-12 transition-transform" />
          <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent rounded-full pointer-events-none" />
        </button>

        {/* Blessing Confirmation Toast */}
        {toastMessage && (
          <div className="mt-4 px-5 py-2.5 rounded-full bg-[#101624]/95 border border-[#C5A46D]/80 shadow-[0_8px_30px_rgba(0,0,0,0.8),0_0_20px_rgba(197,164,109,0.3)] text-xs text-[#FAF5ED] font-playfair italic animate-in fade-in slide-in-from-bottom-2 duration-300 flex items-center gap-2">
            <span>{toastMessage}</span>
          </div>
        )}
      </div>

      {/* 2. Floating Sky Lanterns Overlay */}
      {lanterns.length > 0 && (
        <div
          className="fixed inset-0 pointer-events-none z-50 overflow-hidden select-none"
          aria-hidden="true"
        >
          <style jsx>{`
            @keyframes floatUpward {
              0% {
                transform: translate3d(0, 105vh, 0) scale(0.7) rotate(0deg);
                opacity: 0;
              }
              15% {
                opacity: 1;
              }
              50% {
                transform: translate3d(25px, 50vh, 0) scale(1) rotate(4deg);
              }
              75% {
                transform: translate3d(-20px, 25vh, 0) scale(0.9) rotate(-3deg);
              }
              100% {
                transform: translate3d(15px, -15vh, 0) scale(0.65) rotate(2deg);
                opacity: 0;
              }
            }
            @keyframes flameFlicker {
              0%, 100% {
                opacity: 0.85;
                transform: scale(0.95);
              }
              50% {
                opacity: 1;
                transform: scale(1.1);
              }
            }
          `}</style>

          {lanterns.map((l) => (
            <div
              key={l.id}
              className="absolute will-change-transform"
              style={{
                left: `${l.left}%`,
                bottom: 0,
                width: `${l.size}px`,
                height: `${l.size * 1.3}px`,
                animation: `floatUpward ${l.duration}s cubic-bezier(0.35, 0.2, 0.4, 0.95) forwards`,
                animationDelay: `${l.delay}s`,
              }}
            >
              <div className="relative w-full h-full">
                {/* Outer Golden Glow Aura */}
                <div className="absolute inset-0 bg-[#C5A46D]/35 rounded-full blur-xl scale-150" />

                {/* Sky Lantern SVG */}
                <svg viewBox="0 0 40 52" className="w-full h-full drop-shadow-[0_0_15px_rgba(255,200,100,0.9)]">
                  {/* Paper Lantern Body */}
                  <defs>
                    <radialGradient id={`lanternGlow-${l.id}`} cx="50%" cy="65%" r="65%">
                      <stop offset="0%" stopColor="#FFF4D4" stopOpacity="1" />
                      <stop offset="40%" stopColor="#FFC872" stopOpacity="0.95" />
                      <stop offset="85%" stopColor="#D98A2C" stopOpacity="0.85" />
                      <stop offset="100%" stopColor="#8C4A11" stopOpacity="0.9" />
                    </radialGradient>
                  </defs>

                  {/* Lantern Paper Cylinder */}
                  <path
                    d="M 6 12 C 4 28, 6 42, 10 46 L 30 46 C 34 42, 36 28, 34 12 C 34 6, 26 4, 20 4 C 14 4, 6 6, 6 12 Z"
                    fill={`url(#lanternGlow-${l.id})`}
                    stroke="#D8C39A"
                    strokeWidth="0.8"
                  />

                  {/* Top Rim */}
                  <ellipse cx="20" cy="8" rx="13" ry="3" fill="#FFE8B0" fillOpacity="0.6" stroke="#C5A46D" strokeWidth="0.8" />

                  {/* Vertical Bamboo Ribs */}
                  <path d="M 12 8 Q 10 26 14 46" stroke="#9E5D1E" strokeWidth="0.5" strokeOpacity="0.6" fill="none" />
                  <path d="M 20 5 L 20 46" stroke="#9E5D1E" strokeWidth="0.5" strokeOpacity="0.6" fill="none" />
                  <path d="M 28 8 Q 30 26 26 46" stroke="#9E5D1E" strokeWidth="0.5" strokeOpacity="0.6" fill="none" />

                  {/* Bottom Bamboo Ring */}
                  <ellipse cx="20" cy="46" rx="10" ry="2.5" fill="#5E3106" stroke="#C5A46D" strokeWidth="0.8" />

                  {/* Inner Candle Flame */}
                  <circle
                    cx="20"
                    cy="40"
                    r="4.5"
                    fill="#FFFEE0"
                    style={{
                      animation: 'flameFlicker 1.2s ease-in-out infinite',
                    }}
                  />
                  <circle cx="20" cy="40" r="8" fill="#FFB732" fillOpacity="0.5" />
                </svg>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
};

export default WishLanterns;
