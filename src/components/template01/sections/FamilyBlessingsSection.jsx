'use client';

import React from 'react';
import Image from 'next/image';
import { weddingData } from '@/data/weddingData';

/**
 * Section 13: Our Families / Blessings
 * EXACT MATCH to Image 3 (Tile 13):
 * - Background: /13_family_blessings.png (Refined ivory arch with floral borders & lanterns)
 * - NO dark gray cards or boxes.
 * - Text centered inside the arch in deep royal espresso & gold serif typography:
 *     With Blessings From
 *     Our Families
 *     — ✦ —
 *     Bride's Family                Groom's Family
 *     Mrs. Gayatri &                Mrs. Sunita &
 *     Dr. Harshvardhan Kapoor       Mr. Vikramaditya Singhania
 */
export const FamilyBlessingsSection = () => {
  const { families } = weddingData;
  const { brideSide, groomSide } = families;

  return (
    <section
      id="blessings"
      className="relative min-h-screen w-full flex items-center justify-center pt-28 pb-16 px-4 sm:px-6 overflow-hidden select-none"
    >
      {/* Background Graphic: 13_family_blessings.png */}
      <div className="absolute inset-0 w-full h-full pointer-events-none">
        <Image
          src="/13_family_blessings.png"
          alt="Family Blessings Arch Flowers"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
      </div>

      {/* Pure Floating Typography strictly INSIDE the Card Boundaries */}
      <div className="editorial-reveal relative z-10 max-w-lg sm:max-w-xl w-full mx-auto text-center flex flex-col items-center px-4 sm:px-6 pt-4 sm:pt-8">
        <p className="font-manrope text-[10px] sm:text-[11px] font-semibold tracking-[0.28em] uppercase text-[#7B5927] mb-1.5">
          — Sacred Heritage & Lineages —
        </p>

        <h2 className="font-cormorant text-3xl sm:text-4xl md:text-5xl font-medium text-[#26180E] leading-[1.05] tracking-tight mb-2 drop-shadow-xs">
          With Blessings From <br />
          <span className="italic font-serif text-[#3E2512]">Our Families</span>
        </h2>

        {/* Delicate Gold Divider */}
        <div className="flex items-center justify-center gap-3 my-2 sm:my-3">
          <div className="h-[1px] w-12 sm:w-16 bg-gradient-to-r from-transparent to-[#A87B36]" />
          <span className="text-xs text-[#A87B36]">✦</span>
          <div className="h-[1px] w-12 sm:w-16 bg-gradient-to-l from-transparent to-[#A87B36]" />
        </div>

        {/* Two Columns Side by Side Strictly inside the Card's Gold Border */}
        <div className="grid grid-cols-2 gap-4 sm:gap-8 w-full mt-4 sm:mt-5 text-center">
          {/* Bride's Side */}
          <div className="flex flex-col items-center px-1 sm:px-2">
            <span className="font-manrope text-[10px] sm:text-[11px] font-semibold tracking-[0.2em] uppercase text-[#8C6527] mb-1">
              {brideSide.title}
            </span>
            <h3 className="font-cormorant text-base sm:text-lg md:text-xl text-[#1C120A] font-semibold leading-snug">
              {brideSide.parents}
            </h3>
            <p className="font-serif italic text-[11px] sm:text-xs text-[#5A3C21] mt-1 leading-relaxed">
              {brideSide.grandparents}
            </p>
          </div>

          {/* Groom's Side */}
          <div className="flex flex-col items-center px-1 sm:px-2">
            <span className="font-manrope text-[10px] sm:text-[11px] font-semibold tracking-[0.2em] uppercase text-[#8C6527] mb-1">
              {groomSide.title}
            </span>
            <h3 className="font-cormorant text-base sm:text-lg md:text-xl text-[#1C120A] font-semibold leading-snug">
              {groomSide.parents}
            </h3>
            <p className="font-serif italic text-[11px] sm:text-xs text-[#5A3C21] mt-1 leading-relaxed">
              {groomSide.grandparents}
            </p>
          </div>
        </div>

        <p className="font-serif italic text-xs sm:text-sm text-[#523720] max-w-sm mx-auto mt-6 sm:mt-8 leading-relaxed">
          Request the honour of your graceful presence and pious blessings to celebrate this eternal union.
        </p>
      </div>
    </section>
  );
};

export default FamilyBlessingsSection;
