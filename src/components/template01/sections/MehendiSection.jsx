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
      className="relative min-h-screen w-full flex items-center justify-center md:justify-end py-24 md:py-28 px-6 sm:px-12 md:px-16 lg:px-24 overflow-hidden select-none"
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
        {/* Soft atmospheric gradient on mobile to guarantee readability over detailed backgrounds */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#FAF6EE]/95 via-[#FAF6EE]/70 to-transparent md:hidden" />
      </div>

      {/* Pure Floating Typography on Right — NO DARK BOXES */}
      <div className="relative z-10 max-w-lg md:max-w-md lg:max-w-lg w-full text-center md:text-left flex flex-col items-center md:items-start pl-0 md:pl-4">
        <span className="text-[11px] sm:text-[12px] font-manrope font-semibold tracking-[0.28em] uppercase text-[#6B5024] mb-2">
          — Sacred Henna Soirée —
        </span>

        <h2 className="font-cormorant text-4xl sm:text-5xl md:text-6xl font-medium text-[#22160C] leading-[1.0] tracking-tight mb-2 drop-shadow-xs">
          Mehendi <br />
          <span className="italic font-serif text-[#382313]">Ceremony</span>
        </h2>

        {/* Delicate Gold Divider */}
        <div className="flex items-center gap-3 my-3">
          <div className="h-[1px] w-12 bg-gradient-to-r from-[#A87B36] to-transparent" />
          <span className="text-xs text-[#A87B36]">✦</span>
          <div className="h-[1px] w-12 bg-gradient-to-l from-[#A87B36] to-transparent" />
        </div>

        <p className="font-serif italic text-sm sm:text-base text-[#4C331B] leading-relaxed mb-6 max-w-sm">
          {mehendi.description}
        </p>

        {/* Date & Time */}
        <div className="flex items-center gap-3 text-[#22160C] mb-3">
          <Calendar className="w-5 h-5 text-[#8C6527] flex-shrink-0" />
          <span className="font-manrope text-xs sm:text-sm font-semibold tracking-wide">
            {mehendi.date} • {mehendi.time}
          </span>
        </div>

        {/* Venue */}
        <div className="flex items-center gap-3 text-[#22160C] mb-5">
          <MapPin className="w-5 h-5 text-[#8C6527] flex-shrink-0" />
          <span className="font-manrope text-xs sm:text-sm font-semibold tracking-wide">
            {mehendi.venue}, The Heritage Palace
          </span>
        </div>

        {/* Dress Code */}
        <div className="pt-3 border-t border-[#8C6527]/30 text-xs font-manrope text-[#4C331B]">
          Dress Code: <strong className="text-[#22160C] font-semibold">{mehendi.dressCode}</strong>
        </div>
      </div>
    </section>
  );
};

export default MehendiSection;
