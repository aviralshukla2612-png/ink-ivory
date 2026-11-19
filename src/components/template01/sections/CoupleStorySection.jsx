'use client';

import React from 'react';
import Image from 'next/image';
import { weddingData } from '@/data/weddingData';

/**
 * Section 05: Meet the Couple / Our Story
 * EXACT MATCH to Image 3 (Tile 05):
 * - Background: /05_couple_story.png (couple seated on left overlooking riverside palace at golden hour)
 * - NO dark gray boxes or buttons.
 * - Text placed on the open right side in rich royal espresso & warm gold serif typography:
 *     Our
 *     Story
 *     — ✦ —
 *     Aarav Singhania & Riya Kapoor
 *     Editorial narrative from meeting to proposal under Udaipur stars.
 */
export const CoupleStorySection = () => {
  const { couple, groom, bride } = weddingData;

  return (
    <section
      id="story"
      className="relative min-h-screen w-full flex items-center justify-end py-20 px-6 sm:px-12 md:px-20 overflow-hidden select-none"
    >
      {/* Background Graphic: 05_couple_story.png */}
      <div className="absolute inset-0 w-full h-full pointer-events-none">
        <Image
          src="/05_couple_story.png"
          alt="Couple Story Sunset Lake Palace"
          fill
          sizes="100vw"
          className="object-cover object-center"
        />
      </div>

      {/* Typography on the Right Side (Clear Sky/Water Area) — NO DARK BOXES */}
      <div className="relative z-10 max-w-xl w-full text-center md:text-left flex flex-col items-center md:items-start pl-0 md:pl-10">
        <span className="text-[11px] sm:text-[12px] font-manrope font-semibold tracking-[0.28em] uppercase text-[#7B5927] mb-2">
          — The Journey of Love —
        </span>

        <h2 className="font-cormorant text-5xl sm:text-7xl lg:text-8xl text-[#26180E] font-medium leading-[0.95] tracking-tight drop-shadow-xs">
          Our <br />
          <span className="italic font-serif text-[#3E2512]">Story</span>
        </h2>

        {/* Delicate Gold Divider */}
        <div className="flex items-center gap-3 my-4">
          <div className="h-[1px] w-12 bg-gradient-to-r from-[#A87B36] to-transparent" />
          <span className="text-xs text-[#A87B36]">✦</span>
          <div className="h-[1px] w-12 bg-gradient-to-l from-[#A87B36] to-transparent" />
        </div>

        <h3 className="font-cormorant text-2xl sm:text-3xl text-[#1C120A] font-semibold mb-3">
          {groom.name} & {bride.name}
        </h3>

        <p className="font-serif italic text-base sm:text-lg text-[#5A3C21] leading-relaxed mb-4 max-w-md">
          A rainy afternoon in Mumbai, late-night calls that felt like coming home, and an unforgettable starlit proposal on Lake Pichola.
        </p>

        <p className="font-manrope text-xs sm:text-sm text-[#4E351F] leading-relaxed max-w-md">
          Surrounded by timeless palace walls, sacred Vedic chants, and the warmth of family, we invite you to celebrate as our two worlds become one forever in Jaipur.
        </p>

        <div className="mt-6 flex items-center gap-4 text-xs font-manrope text-[#7B5927] font-semibold uppercase tracking-wider">
          <span>First Met: 2021</span>
          <span>•</span>
          <span>Said Yes: 2024</span>
          <span>•</span>
          <span>Forever: 2026</span>
        </div>
      </div>
    </section>
  );
};

export default CoupleStorySection;
