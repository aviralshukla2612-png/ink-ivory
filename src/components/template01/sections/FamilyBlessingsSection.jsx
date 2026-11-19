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
      className="relative min-h-screen w-full flex items-center justify-center pt-28 pb-16 px-6 overflow-hidden select-none"
    >
      {/* Background Graphic: 13_family_blessings.png */}
      <div className="absolute inset-0 w-full h-full pointer-events-none">
        <Image
          src="/13_family_blessings.png"
          alt="Family Blessings Arch Flowers"
          fill
          sizes="100vw"
          className="object-cover object-center"
        />
      </div>

      {/* Pure Floating Typography inside the Arch — NO DARK BOXES */}
      <div className="relative z-10 max-w-2xl w-full mx-auto text-center flex flex-col items-center pt-8 sm:pt-14">
        <p className="font-manrope text-[11px] sm:text-[12px] font-semibold tracking-[0.3em] uppercase text-[#7B5927] mb-2">
          — Sacred Heritage & Lineages —
        </p>

        <h2 className="font-cormorant text-4xl sm:text-6xl font-medium text-[#26180E] leading-[1.05] tracking-tight mb-2 drop-shadow-xs">
          With Blessings From <br />
          <span className="italic font-serif text-[#3E2512]">Our Families</span>
        </h2>

        {/* Delicate Gold Divider */}
        <div className="flex items-center justify-center gap-3 my-4">
          <div className="h-[1px] w-16 bg-gradient-to-r from-transparent to-[#A87B36]" />
          <span className="text-xs text-[#A87B36]">✦</span>
          <div className="h-[1px] w-16 bg-gradient-to-l from-transparent to-[#A87B36]" />
        </div>

        {/* Two Columns Side by Side Matching Image 3 (Tile 13) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 sm:gap-12 w-full mt-6 text-center">
          {/* Bride's Side */}
          <div className="flex flex-col items-center">
            <span className="font-manrope text-[11px] sm:text-[12px] font-semibold tracking-[0.25em] uppercase text-[#8C6527] mb-2">
              {brideSide.title}
            </span>
            <h3 className="font-cormorant text-2xl sm:text-3xl text-[#1C120A] font-medium leading-snug">
              {brideSide.parents}
            </h3>
            <p className="font-serif italic text-xs sm:text-sm text-[#5A3C21] mt-1.5 max-w-xs">
              {brideSide.grandparents}
            </p>
          </div>

          {/* Groom's Side */}
          <div className="flex flex-col items-center">
            <span className="font-manrope text-[11px] sm:text-[12px] font-semibold tracking-[0.25em] uppercase text-[#8C6527] mb-2">
              {groomSide.title}
            </span>
            <h3 className="font-cormorant text-2xl sm:text-3xl text-[#1C120A] font-medium leading-snug">
              {groomSide.parents}
            </h3>
            <p className="font-serif italic text-xs sm:text-sm text-[#5A3C21] mt-1.5 max-w-xs">
              {groomSide.grandparents}
            </p>
          </div>
        </div>

        <p className="font-serif italic text-xs sm:text-sm text-[#523720] max-w-md mx-auto mt-8 leading-relaxed">
          Request the honour of your graceful presence and pious blessings to celebrate this eternal union.
        </p>
      </div>
    </section>
  );
};

export default FamilyBlessingsSection;
