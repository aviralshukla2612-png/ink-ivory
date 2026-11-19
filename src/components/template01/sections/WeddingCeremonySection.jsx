'use client';

import React from 'react';
import Image from 'next/image';
import { weddingData } from '@/data/weddingData';
import { Calendar, MapPin, Sparkles } from 'lucide-react';

/**
 * Section 11: Wedding Ceremony (Saat Phere)
 * EXACT MATCH to Image 3 (Tile 11):
 * - Background: /11_wedding_ceremony.png (Traditional red and champagne-gold mandap, sacred fire, pillars)
 * - NO dark gray cards or boxes.
 * - Text floats cleanly on the open right area in regal deep burgundy/espresso & gold typography:
 *     Wedding
 *     Ceremony
 *     [Calendar] Friday, 18 December 2026 • 5:00 PM Onwards
 *     [MapPin] Palace Central Lakeside Mandap
 *     Dress Code: Regal Traditional Indian • Ivory, Navy & Gold
 */
export const WeddingCeremonySection = () => {
  const wedding = weddingData.events.find((e) => e.id === 'wedding') || weddingData.events[3];

  return (
    <section
      id="wedding"
      className="relative min-h-screen w-full flex items-center justify-end py-24 md:py-28 px-6 sm:px-12 md:px-16 lg:px-24 overflow-hidden select-none"
    >
      {/* Background Graphic: 11_wedding_ceremony.png */}
      <div className="absolute inset-0 w-full h-full pointer-events-none">
        <Image
          src="/11_wedding_ceremony.png"
          alt="Royal Wedding Mandap Red Gold Sacred Fire"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
        {/* Soft atmospheric gradient on mobile to guarantee readability over ceremonial mandap */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#FDF9F2]/95 via-[#FDF9F2]/70 to-transparent md:hidden" />
      </div>

      {/* Pure Floating Typography Strictly on Right Side — NO DARK BOXES */}
      <div className="editorial-reveal relative z-10 max-w-lg md:max-w-md lg:max-w-lg w-full ml-auto text-left flex flex-col items-start pr-0 md:pr-4">
        <span className="text-[11px] sm:text-[12px] font-manrope font-semibold tracking-[0.28em] uppercase text-[#8C232A] mb-2">
          — The Sacred Vows (Saat Phere) —
        </span>

        <h2 className="font-cormorant text-4xl sm:text-5xl md:text-6xl font-medium text-[#2A1014] leading-[1.0] tracking-tight mb-2 drop-shadow-xs">
          Wedding <br />
          <span className="italic font-serif text-[#4A151C]">Ceremony</span>
        </h2>

        {/* Delicate Gold Divider */}
        <div className="flex items-center gap-3 my-3">
          <div className="h-[1px] w-12 bg-gradient-to-r from-[#A87B36] to-transparent" />
          <span className="text-xs text-[#A87B36]">✦</span>
          <div className="h-[1px] w-12 bg-gradient-to-l from-[#A87B36] to-transparent" />
        </div>

        <p className="font-serif italic text-sm sm:text-base text-[#522329] leading-relaxed mb-6 max-w-sm">
          {wedding.description}
        </p>

        {/* Date & Time */}
        <div className="flex items-center gap-3 text-[#2A1014] mb-3">
          <Calendar className="w-5 h-5 text-[#8C232A] flex-shrink-0" />
          <span className="font-manrope text-xs sm:text-sm font-semibold tracking-wide">
            {wedding.date} • {wedding.time}
          </span>
        </div>

        {/* Venue */}
        <div className="flex items-center gap-3 text-[#2A1014] mb-5">
          <MapPin className="w-5 h-5 text-[#8C232A] flex-shrink-0" />
          <span className="font-manrope text-xs sm:text-sm font-semibold tracking-wide">
            {wedding.venue}, The Heritage Palace
          </span>
        </div>

        {/* Dress Code */}
        <div className="pt-3 border-t border-[#8C232A]/30 text-xs font-manrope text-[#522329]">
          Dress Code: <strong className="text-[#2A1014] font-semibold">{wedding.dressCode}</strong>
        </div>
      </div>
    </section>
  );
};

export default WeddingCeremonySection;
