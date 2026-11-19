'use client';

import React from 'react';
import Image from 'next/image';
import { weddingData } from '@/data/weddingData';
import WishLanterns from '../effects/WishLanterns';

/**
 * Section 15: Closing / Thank You
 * EXACT MATCH to Image 3 (Tile 15):
 * - Background: /15_closing_thank_you.png (Midnight-blue river panorama, floating diyas, lanterns)
 * - NO dark gray cards or boxes.
 * - Text centered over the river and distant palace in radiant gold & ivory:
 *     Thank You
 *     for being a part of our celebration
 *     [Gold Lotus Motif]
 *     Aarav & Riya
 */
export const ClosingSection = () => {
  const { couple } = weddingData;

  return (
    <section
      id="closing"
      className="relative min-h-screen w-full flex flex-col items-center justify-center pt-16 sm:pt-28 pb-12 sm:pb-16 px-4 sm:px-6 overflow-hidden select-none"
    >
      {/* Background Graphic: 15_closing_thank_you.png */}
      <div className="absolute inset-0 w-full h-full pointer-events-none">
        <Image
          src="/15_closing_thank_you.png"
          alt="Closing Midnight River Ghat Diyas"
          fill
          sizes="100vw"
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-radial-gradient from-transparent via-[#091321]/30 to-[#091321]/70" />
      </div>

      {/* Pure Floating Typography — NO DARK BOXES */}
      <div className="relative z-10 max-w-2xl w-full mx-auto text-center flex flex-col items-center">
        {/* Title: Thank You */}
        <h2 className="font-cormorant text-4xl sm:text-7xl md:text-8xl font-medium text-[#FFFDF7] leading-[0.95] tracking-tight mb-2 drop-shadow-[0_4px_24px_rgba(0,0,0,0.9)]">
          Thank You
        </h2>

        <p className="font-serif italic text-base sm:text-2xl md:text-3xl text-[#D6B477] mb-4 sm:mb-6 drop-shadow-md">
          for being a part of our celebration
        </p>

        {/* Sacred Gold Lotus Icon */}
        <div className="w-10 h-10 sm:w-16 sm:h-16 my-1.5 sm:my-2 flex items-center justify-center">
          <svg
            viewBox="0 0 100 80"
            className="w-10 h-10 sm:w-14 sm:h-14 text-[#D6B477] drop-shadow-[0_0_12px_rgba(214,180,119,0.7)]"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M50 10 C46 32 42 48 50 65 C58 48 54 32 50 10 Z"
              stroke="#D6B477"
              strokeWidth="2"
              fill="rgba(214,180,119,0.3)"
            />
            <path
              d="M50 25 C36 36 28 50 42 66 C47 52 48 40 50 25 Z"
              stroke="#D6B477"
              strokeWidth="1.6"
              fill="rgba(214,180,119,0.2)"
            />
            <path
              d="M50 25 C64 36 72 50 58 66 C53 52 52 40 50 25 Z"
              stroke="#D6B477"
              strokeWidth="1.6"
              fill="rgba(214,180,119,0.2)"
            />
            <path
              d="M26 69 Q50 78 74 69"
              stroke="#E7CEA0"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </div>

        {/* Couple Names */}
        <p className="font-cormorant text-2xl sm:text-3xl md:text-4xl text-[#FAF5ED] font-semibold mt-2 sm:mt-3 mb-6 sm:mb-8 tracking-wide drop-shadow-md">
          {couple.names}
        </p>

        {/* Release a Wish Lantern */}
        <div className="pt-2">
          <WishLanterns />
        </div>

        <div className="mt-14 flex items-center justify-center gap-2 text-[10px] sm:text-[11px] font-manrope text-[#E7CEA0]/60 uppercase tracking-[0.25em]">
          <span>Ink & Ivory</span>
          <span>•</span>
          <span>Digital Wedding Invitations</span>
        </div>
      </div>
    </section>
  );
};

export default ClosingSection;
