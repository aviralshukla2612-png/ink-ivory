'use client';

import React from 'react';
import Image from 'next/image';
import { weddingData } from '@/data/weddingData';
import { Calendar, MapPin, Sparkles } from 'lucide-react';

/**
 * Section 10: Sangeet Night
 * EXACT MATCH to Image 3 (Tile 10):
 * - Background: /10_sangeet_night.png (Purple/navy evening atmosphere, luxury stage, fairy lights)
 * - NO dark gray cards or boxes.
 * - Text floats cleanly on the open right area in radiant champagne gold & warm ivory typography:
 *     Sangeet
 *     Night
 *     [Calendar] Thursday, 17 December 2026 • 7:30 PM
 *     [MapPin] Sheesh Mahal Grand Ballroom
 *     Dress Code: Indo-Western Glitz & Velvet Elegance
 */
export const SangeetSection = () => {
  const sangeet = weddingData.events.find((e) => e.id === 'sangeet') || weddingData.events[2];

  return (
    <section
      id="sangeet"
      className="relative min-h-screen w-full flex items-center justify-center md:justify-end py-24 md:py-28 px-6 sm:px-12 md:px-16 lg:px-24 overflow-hidden select-none"
    >
      {/* Background Graphic: 10_sangeet_night.png */}
      <div className="absolute inset-0 w-full h-full pointer-events-none">
        <Image
          src="/10_sangeet_night.png"
          alt="Sangeet Night Stage Purple Navy Fairy Lights"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
        {/* Soft atmospheric gradient on mobile to guarantee readability over night celebrations */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#091321]/95 via-[#091321]/70 to-transparent md:hidden" />
      </div>

      {/* Pure Floating Typography on Right — NO DARK BOXES */}
      <div className="relative z-10 max-w-lg md:max-w-md lg:max-w-lg w-full text-center md:text-left flex flex-col items-center md:items-start pl-0 md:pl-4">
        <span className="text-[11px] sm:text-[12px] font-manrope font-semibold tracking-[0.28em] uppercase text-[#E7CEA0] mb-2">
          — An Evening of Music & Dance —
        </span>

        <h2 className="font-cormorant text-4xl sm:text-5xl md:text-6xl font-medium text-[#FFFDF7] leading-[1.0] tracking-tight mb-2 drop-shadow-md">
          Sangeet <br />
          <span className="italic font-serif text-[#D6B477]">Night</span>
        </h2>

        {/* Delicate Gold Divider */}
        <div className="flex items-center gap-3 my-3">
          <div className="h-[1px] w-12 bg-gradient-to-r from-[#D6B477] to-transparent" />
          <span className="text-xs text-[#D6B477]">✦</span>
          <div className="h-[1px] w-12 bg-gradient-to-l from-[#D6B477] to-transparent" />
        </div>

        <p className="font-serif italic text-sm sm:text-base text-[#EFE3CD] leading-relaxed mb-6 max-w-sm drop-shadow-sm">
          {sangeet.description}
        </p>

        {/* Date & Time */}
        <div className="flex items-center gap-3 text-[#FFFDF7] mb-3">
          <Calendar className="w-5 h-5 text-[#D6B477] flex-shrink-0" />
          <span className="font-manrope text-xs sm:text-sm font-semibold tracking-wide">
            {sangeet.date} • {sangeet.time}
          </span>
        </div>

        {/* Venue */}
        <div className="flex items-center gap-3 text-[#FFFDF7] mb-5">
          <MapPin className="w-5 h-5 text-[#D6B477] flex-shrink-0" />
          <span className="font-manrope text-xs sm:text-sm font-semibold tracking-wide">
            {sangeet.venue}, The Heritage Palace
          </span>
        </div>

        {/* Dress Code */}
        <div className="pt-3 border-t border-[#D6B477]/30 text-xs font-manrope text-[#E7CEA0]">
          Dress Code: <strong className="text-[#FFFDF7] font-semibold">{sangeet.dressCode}</strong>
        </div>
      </div>
    </section>
  );
};

export default SangeetSection;
