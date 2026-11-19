'use client';

import React from 'react';
import { GoldDivider } from './GoldDivider';

/**
 * SectionHeading Component
 * Editorial royal typography pairing:
 * - Eyebrow with gold tracking
 * - Cormorant Garamond / Playfair title
 * - Refined script or italic subtitle
 * - GoldDivider
 */
export const SectionHeading = ({
  eyebrow,
  title,
  subtitle,
  centered = true,
  theme = 'light', // 'light' (ivory background) | 'dark' (navy background)
  className = '',
}) => {
  const isDark = theme === 'dark';

  return (
    <div
      className={`max-w-2xl mb-10 sm:mb-14 ${
        centered ? 'text-center mx-auto' : 'text-left'
      } ${className}`}
    >
      {/* Eyebrow */}
      {eyebrow && (
        <span
          className={`block text-[10.5px] sm:text-[11.5px] font-manrope font-semibold tracking-[0.28em] uppercase mb-2.5 ${
            isDark ? 'text-[#D8C39A]' : 'text-[#A77B35]'
          }`}
        >
          — {eyebrow} —
        </span>
      )}

      {/* Main Title */}
      <h2
        className={`font-cormorant text-3xl sm:text-4xl md:text-5xl font-medium tracking-tight leading-[1.15] mb-3 ${
          isDark ? 'text-[#FAF5ED]' : 'text-[#172039]'
        }`}
      >
        {title}
      </h2>

      {/* Subtitle / Script flourish */}
      {subtitle && (
        <p
          className={`text-sm sm:text-base font-serif italic max-w-lg mb-4 ${
            centered ? 'mx-auto' : ''
          } ${isDark ? 'text-[#D8C39A]/90' : 'text-[#70583F]'}`}
        >
          {subtitle}
        </p>
      )}

      {/* Gold Divider */}
      <GoldDivider centered={centered} />
    </div>
  );
};

export default SectionHeading;
