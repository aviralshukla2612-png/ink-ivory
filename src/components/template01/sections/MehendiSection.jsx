'use client';

import React from 'react';
import Image from 'next/image';
import { weddingData } from '@/data/weddingData';
import { Calendar, MapPin, Sparkles } from 'lucide-react';

/**
 * Section 09: Mehendi Ceremony
 * EXACT MATCH to Image 3 (Tile 09):
 * - Background: /09_mehendi_ceremony.png (Green fabric drapes, traditional seating, flowers)
 * - NO dark gray cards or boxes.
 * - Text floats cleanly on the open right area in deep espresso & rich gold typography:
 *     Mehendi
 *     Ceremony
 *     [Calendar] Wednesday, 16 December 2026 • 4:30 PM
 *     [MapPin] Zenana Floral Gardens, The Heritage Palace
 *     Dress Code: Pastel Greens & Royal Botanicals
 */
export const MehendiSection = () => {
  const mehendi = weddingData.events.find((e) => e.id === 'mehendi') || weddingData.events[1];

  return (
    <section
      id="mehendi"
      className="relative min-h-screen w-full flex items-center justify-end pt-28 pb-16 sm:py-24 md:py-28 px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 overflow-hidden select-none"
    >
      {/* Background Graphic: 09_mehendi_ceremony.png */}
      <div className="absolute inset-0 w-full h-full pointer-events-none">
        <Image
          src="/09_mehendi_ceremony.png"
          alt="Mehendi Ceremony Green Drapes Lounge"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
        {/* Soft atmospheric gradient on mobile to guarantee readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#FAF6EE]/95 via-[#FAF6EE]/60 to-transparent sm:hidden" />
      </div>

      {/* Pure Floating Typography Strictly on Right-Side Cream Parchment (Decor is on left 0-68%) */}
      <div className="editorial-reveal relative z-10 w-full sm:w-[50%] md:w-[40%] lg:w-[32%] xl:w-[28%] max-w-sm sm:max-w-[340px] xl:max-w-[380px] ml-auto text-left flex flex-col items-start bg-[#FAF6EE]/90 sm:bg-transparent backdrop-blur-sm sm:backdrop-blur-none border border-[#8C6527]/20 sm:border-0 rounded-2xl sm:rounded-none p-5 sm:p-0 shadow-lg sm:shadow-none">
        <span className="text-[10px] sm:text-[11px] font-manrope font-semibold tracking-[0.28em] uppercase text-[#6B5024] mb-1.5">
          — Sacred Henna Soirée —
        </span>

        <h2 className="font-cormorant text-3xl sm:text-4xl lg:text-4xl xl:text-5xl font-medium text-[#22160C] leading-[1.0] tracking-tight mb-2 drop-shadow-xs">
          Mehendi <br />
          <span className="italic font-serif text-[#382313]">Ceremony</span>
        </h2>

        {/* Delicate Gold Divider */}
        <div className="flex items-center gap-3 my-2">
          <div className="h-[1px] w-10 bg-gradient-to-r from-[#A87B36] to-transparent" />
          <span className="text-xs text-[#A87B36]">✦</span>
          <div className="h-[1px] w-10 bg-gradient-to-l from-[#A87B36] to-transparent" />
        </div>

        <p className="font-serif italic text-xs sm:text-sm text-[#4C331B] leading-relaxed mb-4 max-w-xs">
          {mehendi.description}
        </p>

        {/* Date & Time */}
        <div className="flex items-center gap-2.5 text-[#22160C] mb-2">
          <Calendar className="w-4 h-4 text-[#8C6527] flex-shrink-0" />
          <span className="font-manrope text-xs sm:text-sm font-semibold tracking-wide">
            {mehendi.date} • {mehendi.time}
          </span>
        </div>

        {/* Venue */}
        <div className="flex items-center gap-2.5 text-[#22160C] mb-3.5">
          <MapPin className="w-4 h-4 text-[#8C6527] flex-shrink-0" />
          <span className="font-manrope text-xs sm:text-sm font-semibold tracking-wide">
            {mehendi.venue}, The Heritage Palace
          </span>
        </div>

        {/* Dress Code */}
        <div className="pt-2 border-t border-[#8C6527]/30 text-xs font-manrope text-[#4C331B]">
          Dress Code: <strong className="text-[#22160C] font-semibold">{mehendi.dressCode}</strong>
        </div>
      </div>
    </section>
  );
};

export default MehendiSection;
