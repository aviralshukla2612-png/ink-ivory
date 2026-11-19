'use client';

import React from 'react';
import Image from 'next/image';
import { weddingData } from '@/data/weddingData';
import { Calendar, MapPin, Sparkles } from 'lucide-react';

/**
 * Section 12: Reception Gala
 * EXACT MATCH to Image 3 (Tile 12):
 * - Background: /12_reception.png (Dining tables, floral centerpieces, chandeliers, lake)
 * - NO dark gray cards or boxes.
 * - Text floats cleanly on the open right area in radiant champagne gold & warm ivory typography:
 *     Reception
 *     [Calendar] Saturday, 19 December 2026 • 7:30 PM
 *     [MapPin] Maharaja Royal Banquet Terraces
 *     Dress Code: Black Tie / Royal Formal Elegance
 */
export const ReceptionSection = () => {
  const reception = weddingData.events.find((e) => e.id === 'reception') || weddingData.events[4];

  return (
    <section
      id="reception"
      className="relative min-h-screen w-full flex items-center justify-end pt-28 pb-16 sm:py-24 md:py-28 px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 overflow-hidden select-none"
    >
      {/* Background Graphic: 12_reception.png */}
      <div className="absolute inset-0 w-full h-full pointer-events-none">
        <Image
          src="/12_reception.png"
          alt="Imperial Reception Gala Dining Chandeliers"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
        {/* Soft atmospheric gradient on mobile to guarantee readability over gala night */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#091321]/95 via-[#091321]/60 to-transparent sm:hidden" />
      </div>

      {/* Pure Floating Typography Strictly on Right-Side Starry Navy Sky (Decor is on left 0-68%) */}
      <div className="editorial-reveal relative z-10 w-full sm:w-[50%] md:w-[40%] lg:w-[32%] xl:w-[28%] max-w-sm sm:max-w-[340px] xl:max-w-[380px] ml-auto text-left flex flex-col items-start bg-[#091321]/90 sm:bg-transparent backdrop-blur-sm sm:backdrop-blur-none border border-[#D6B477]/30 sm:border-0 rounded-2xl sm:rounded-none p-5 sm:p-0 shadow-lg sm:shadow-none">
        <span className="text-[10px] sm:text-[11px] font-manrope font-semibold tracking-[0.28em] uppercase text-[#E7CEA0] mb-1.5">
          — An Evening of Celebration —
        </span>

        <h2 className="font-cormorant text-3xl sm:text-4xl lg:text-4xl xl:text-5xl font-medium text-[#FFFDF7] leading-[1.0] tracking-tight mb-2 drop-shadow-md">
          Imperial <br />
          <span className="italic font-serif text-[#D6B477]">Reception</span>
        </h2>

        {/* Delicate Gold Divider */}
        <div className="flex items-center gap-3 my-2">
          <div className="h-[1px] w-10 bg-gradient-to-r from-[#D6B477] to-transparent" />
          <span className="text-xs text-[#D6B477]">✦</span>
          <div className="h-[1px] w-10 bg-gradient-to-l from-[#D6B477] to-transparent" />
        </div>

        <p className="font-serif italic text-xs sm:text-sm text-[#EFE3CD] leading-relaxed mb-4 max-w-xs drop-shadow-sm">
          {reception.description}
        </p>

        {/* Date & Time */}
        <div className="flex items-center gap-2.5 text-[#FFFDF7] mb-2">
          <Calendar className="w-4 h-4 text-[#D6B477] flex-shrink-0" />
          <span className="font-manrope text-xs sm:text-sm font-semibold tracking-wide">
            {reception.date} • {reception.time}
          </span>
        </div>

        {/* Venue */}
        <div className="flex items-center gap-2.5 text-[#FFFDF7] mb-3.5">
          <MapPin className="w-4 h-4 text-[#D6B477] flex-shrink-0" />
          <span className="font-manrope text-xs sm:text-sm font-semibold tracking-wide">
            {reception.venue}, The Heritage Palace
          </span>
        </div>

        {/* Dress Code */}
        <div className="pt-2 border-t border-[#D6B477]/30 text-xs font-manrope text-[#E7CEA0]">
          Dress Code: <strong className="text-[#FFFDF7] font-semibold">{reception.dressCode}</strong>
        </div>
      </div>
    </section>
  );
};

export default ReceptionSection;
