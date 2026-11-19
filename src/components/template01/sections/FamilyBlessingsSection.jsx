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
      className="relative min-h-screen w-full flex flex-col items-center justify-center pt-36 sm:pt-40 md:pt-44 pb-16 px-4 sm:px-6 overflow-hidden select-none"
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

      {/* Pure Floating Typography strictly INSIDE the Card Boundaries (Well below top garland, within side borders) */}
      <div className="editorial-reveal relative z-10 max-w-[420px] sm:max-w-[460px] md:max-w-[490px] w-full mx-auto text-center flex flex-col items-center px-2 sm:px-4">
        <p className="font-manrope text-[10px] sm:text-[11px] font-semibold tracking-[0.24em] uppercase text-[#7B5927] mb-1">
          — Sacred Heritage & Lineages —
        </p>

        <h2 className="font-cormorant text-2xl sm:text-3xl md:text-4xl font-medium text-[#26180E] leading-tight mb-1.5 drop-shadow-xs">
          With Blessings From <br />
          <span className="italic font-serif text-[#3E2512]">Our Families</span>
        </h2>

        {/* Delicate Gold Divider */}
        <div className="flex items-center justify-center gap-2.5 my-2">
          <div className="h-[1px] w-10 sm:w-14 bg-gradient-to-r from-transparent to-[#A87B36]" />
          <span className="text-[11px] text-[#A87B36]">✦</span>
          <div className="h-[1px] w-10 sm:w-14 bg-gradient-to-l from-transparent to-[#A87B36]" />
        </div>

        {/* Two Columns Side by Side Strictly inside the Card's Gold Border */}
        <div className="grid grid-cols-2 gap-3 sm:gap-6 w-full mt-3 sm:mt-4 text-center">
          {/* Bride's Side */}
          <div className="flex flex-col items-center px-1">
            <span className="font-manrope text-[9px] sm:text-[10px] font-semibold tracking-[0.18em] uppercase text-[#8C6527] mb-1">
              {brideSide.title}
            </span>
            <h3 className="font-cormorant text-xs sm:text-sm md:text-[15px] text-[#1C120A] font-semibold leading-snug">
              Mrs. Gayatri &amp; <br />
              Dr. Harshvardhan Kapoor
            </h3>
            <p className="font-serif italic text-[10px] sm:text-[11px] text-[#5A3C21] mt-1 leading-snug">
              {brideSide.grandparents}
            </p>
          </div>

          {/* Groom's Side */}
          <div className="flex flex-col items-center px-1">
            <span className="font-manrope text-[9px] sm:text-[10px] font-semibold tracking-[0.18em] uppercase text-[#8C6527] mb-1">
              {groomSide.title}
            </span>
            <h3 className="font-cormorant text-xs sm:text-sm md:text-[15px] text-[#1C120A] font-semibold leading-snug">
              Mrs. Sunita &amp; <br />
              Mr. Vikramaditya Singhania
            </h3>
            <p className="font-serif italic text-[10px] sm:text-[11px] text-[#5A3C21] mt-1 leading-snug">
              {groomSide.grandparents}
            </p>
          </div>
        </div>

        <p className="font-serif italic text-[11px] sm:text-xs text-[#523720] max-w-[340px] sm:max-w-[380px] mx-auto mt-4 sm:mt-5 leading-relaxed">
          Request the honour of your graceful presence and pious blessings to celebrate this eternal union.
        </p>
      </div>
    </section>
  );
};

export default FamilyBlessingsSection;
