'use client';

import React from 'react';

/**
 * GoldDivider Component
 * Elegant champagne gold ornamental divider for royal editorial sections.
 */
export const GoldDivider = ({ className = '', centered = true, compact = false }) => {
  return (
    <div
      className={`flex items-center gap-3 select-none pointer-events-none ${
        centered ? 'justify-center mx-auto' : 'justify-start'
      } ${className}`}
    >
      <div
        className={`h-[1px] bg-gradient-to-r from-transparent via-[#C5A46D]/60 to-[#C5A46D] ${
          compact ? 'w-10 sm:w-16' : 'w-16 sm:w-28'
        }`}
      />
      <div className="flex items-center gap-1.5 text-[#C5A46D]">
        <span className="text-[10px] sm:text-xs opacity-75">✦</span>
        <div className="w-1.5 h-1.5 rotate-45 bg-[#C5A46D] shadow-[0_0_8px_rgba(197,164,109,0.6)]" />
        <span className="text-[10px] sm:text-xs opacity-75">✦</span>
      </div>
      <div
        className={`h-[1px] bg-gradient-to-l from-transparent via-[#C5A46D]/60 to-[#C5A46D] ${
          compact ? 'w-10 sm:w-16' : 'w-16 sm:w-28'
        }`}
      />
    </div>
  );
};

export default GoldDivider;
