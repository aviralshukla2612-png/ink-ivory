'use client';

import React, { useEffect, useState } from 'react';

/**
 * GlitterStars Component (Feature 5.11)
 * 28 subtle four-point sparkles in champagne gold (#C5A46D) and ivory white (#FAF5ED).
 * Each twinkles softly at its own pace. Elegant, never busy.
 * pointer-events: none; disabled if prefers-reduced-motion.
 */
export const GlitterStars = () => {
  const [stars, setStars] = useState([]);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mediaQuery.matches);
    const handler = (e) => setReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handler);

    // 28 sparkles
    const generated = Array.from({ length: 28 }, (_, i) => {
      const isGold = i % 2 === 0;
      return {
        id: i,
        top: Math.random() * 100, // % of viewport
        left: Math.random() * 100, // % of viewport
        size: 7 + Math.random() * 9, // 7-16px
        duration: 2.4 + Math.random() * 3.2, // 2.4 - 5.6s
        delay: Math.random() * 4,
        color: isGold ? '#D8C39A' : '#FAF5ED',
        maxOpacity: 0.45 + Math.random() * 0.45,
      };
    });

    setStars(generated);

    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  if (reducedMotion || stars.length === 0) return null;

  return (
    <div
      className="fixed inset-0 pointer-events-none z-10 overflow-hidden select-none"
      aria-hidden="true"
    >
      <style jsx>{`
        @keyframes twinkleGlow {
          0%, 100% {
            opacity: 0.05;
            transform: scale(0.6) rotate(0deg);
          }
          50% {
            opacity: var(--star-max-opacity);
            transform: scale(1.15) rotate(45deg);
          }
        }
      `}</style>

      {stars.map((s) => (
        <div
          key={s.id}
          className="absolute will-change-transform"
          style={{
            top: `${s.top}%`,
            left: `${s.left}%`,
            width: `${s.size}px`,
            height: `${s.size}px`,
            '--star-max-opacity': s.maxOpacity,
            animation: `twinkleGlow ${s.duration}s ease-in-out infinite`,
            animationDelay: `${s.delay}s`,
          }}
        >
          {/* Four-point sparkle star SVG */}
          <svg viewBox="0 0 24 24" fill={s.color} className="w-full h-full drop-shadow-[0_0_6px_rgba(197,164,109,0.7)]">
            <path d="M12 0 Q12 9 3 12 Q12 15 12 24 Q12 15 21 12 Q12 9 12 0 Z" />
          </svg>
        </div>
      ))}
    </div>
  );
};

export default GlitterStars;
