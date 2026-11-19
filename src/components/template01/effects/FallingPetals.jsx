'use client';

import React, { useEffect, useState } from 'react';

/**
 * FallingPetals Component (Feature 5.10)
 * Gentle falling petals across the page after the reveal.
 * 10 on phones, 18 on desktop, slow fall with natural organic sway.
 * Color & shapes: Royal Rose Velvet (#8B1D2C), Soft Blush (#D48B8B), and Royal Gold Foil (#C5A46D).
 * pointer-events: none; disabled if prefers-reduced-motion.
 */
export const FallingPetals = () => {
  const [petals, setPetals] = useState([]);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Check prefers-reduced-motion
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mediaQuery.matches);
    const handler = (e) => setReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handler);

    // Count: 10 on phone (<640px), 18 on desktop
    const isMobile = window.innerWidth < 640;
    const count = isMobile ? 10 : 18;

    const petalPalette = [
      { fill: '#8B1D2C', opacity: 0.75, type: 'rose' },
      { fill: '#A3283B', opacity: 0.65, type: 'rose' },
      { fill: '#D48B8B', opacity: 0.55, type: 'rose-light' },
      { fill: '#C5A46D', opacity: 0.6, type: 'gold' },
      { fill: '#D8C39A', opacity: 0.7, type: 'gold' },
    ];

    const generated = Array.from({ length: count }, (_, i) => {
      const palette = petalPalette[i % petalPalette.length];
      const duration = 12 + Math.random() * 10; // 12-22s for very gentle floating
      const delay = Math.random() * 15;
      const startX = Math.random() * 100; // 0-100vw
      const swayAmplitude = 25 + Math.random() * 45; // 25-70px
      const scale = 0.6 + Math.random() * 0.6; // 0.6 to 1.2
      const rotationSpeed = 6 + Math.random() * 8;

      return {
        id: i,
        ...palette,
        duration,
        delay,
        startX,
        swayAmplitude,
        scale,
        rotationSpeed,
      };
    });

    setPetals(generated);

    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  if (reducedMotion || petals.length === 0) return null;

  return (
    <div
      className="fixed inset-0 pointer-events-none z-20 overflow-hidden select-none"
      aria-hidden="true"
    >
      <style jsx>{`
        @keyframes fallAndSway {
          0% {
            transform: translate3d(0, -10vh, 0) rotate(0deg) rotateY(0deg);
            opacity: 0;
          }
          10% {
            opacity: var(--petal-opacity);
          }
          90% {
            opacity: var(--petal-opacity);
          }
          100% {
            transform: translate3d(var(--sway-x), 115vh, 0) rotate(360deg) rotateY(720deg);
            opacity: 0;
          }
        }
      `}</style>

      {petals.map((p) => (
        <div
          key={p.id}
          className="absolute will-change-transform"
          style={{
            left: `${p.startX}vw`,
            top: 0,
            '--petal-opacity': p.opacity,
            '--sway-x': `${p.swayAmplitude}px`,
            animation: `fallAndSway ${p.duration}s cubic-bezier(0.25, 0.46, 0.45, 0.94) infinite`,
            animationDelay: `${p.delay}s`,
            transform: `scale(${p.scale})`,
          }}
        >
          <svg
            width="20"
            height="24"
            viewBox="0 0 20 24"
            fill="none"
            style={{
              filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.35))',
            }}
          >
            {p.type === 'gold' ? (
              // Gold Marigold Flake / Petal
              <path
                d="M10 0 C16 4, 20 12, 17 19 C14 24, 6 24, 3 19 C0 12, 4 4, 10 0 Z"
                fill={p.fill}
              />
            ) : (
              // Royal Rose Petal
              <path
                d="M10 1 C16 4, 19 11, 16 18 C13 23, 7 23, 4 18 C1 11, 4 4, 10 1 Z"
                fill={p.fill}
              />
            )}
            {/* Subtle petal vein line */}
            <path
              d="M10 2 Q10 12 10 20"
              stroke="#FFF"
              strokeWidth="0.5"
              strokeOpacity="0.3"
            />
          </svg>
        </div>
      ))}
    </div>
  );
};

export default FallingPetals;
