'use client';

import React from 'react';
import Image from 'next/image';
import { weddingData } from '@/data/weddingData';
import { Calendar, MapPin, Sparkles } from 'lucide-react';

/**
 * Section 08: Haldi Ceremony
 * EXACT MATCH to Image 3 (Tile 08):
 * - Background: /08_haldi_ceremony.png (Yellow drapes, marigolds, ceremonial bowls)
 * - NO dark gray cards or boxes.
 * - Text floats cleanly on the open right area in rich warm bronze-brown & gold typography:
 *     Haldi
 *     Ceremony
 *     [Calendar] Wednesday, 16 December 2026 • 10:30 AM
 *     [MapPin] Suraj Bagh Courtyard, The Heritage Palace
 *     Dress Code: Sunshine Yellow & Floral Traditional
 */
export const HaldiSection = () => {
  const haldi = weddingData.events.find((e) => e.id === 'haldi') || weddingData.events[0];

  return (
    <section
      id="haldi"
      className="relative min-h-screen w-full flex items-center justify-end py-20 px-6 sm:px-12 md:px-20 overflow-hidden select-none"
    >
      {/* Background Graphic: 08_haldi_ceremony.png */}
      <div className="absolute inset-0 w-full h-full pointer-events-none">
        <Image
          src="/08_haldi_ceremony.png"
          alt="Haldi Ceremony Marigold Setting"
          fill
          sizes="100vw"
          className="object-cover object-center"
        />
      </div>

      {/* Pure Floating Typography on Right — NO DARK BOXES */}
      <div className="relative z-10 max-w-lg w-full text-center md:text-left flex flex-col items-center md:items-start pl-0 md:pl-8">
        <span className="text-[11px] sm:text-[12px] font-manrope font-semibold tracking-[0.28em] uppercase text-[#8C6527] mb-2">
          — Auspicious Turmeric Ritual —
        </span>

        <h2 className="font-cormorant text-5xl sm:text-7xl font-medium text-[#2C1A0B] leading-[0.95] tracking-tight mb-2 drop-shadow-xs">
          Haldi <br />
          <span className="italic font-serif text-[#46280E]">Ceremony</span>
        </h2>

        {/* Delicate Gold Divider */}
        <div className="flex items-center gap-3 my-3">
          <div className="h-[1px] w-12 bg-gradient-to-r from-[#A87B36] to-transparent" />
          <span className="text-xs text-[#A87B36]">✦</span>
          <div className="h-[1px] w-12 bg-gradient-to-l from-[#A87B36] to-transparent" />
        </div>

        <p className="font-serif italic text-sm sm:text-base text-[#5C3D1B] leading-relaxed mb-6 max-w-sm">
          {haldi.description}
        </p>

        {/* Date & Time */}
        <div className="flex items-center gap-3 text-[#2C1A0B] mb-3">
          <Calendar className="w-5 h-5 text-[#8C6527] flex-shrink-0" />
          <span className="font-manrope text-xs sm:text-sm font-semibold tracking-wide">
            {haldi.date} • {haldi.time}
          </span>
        </div>

        {/* Venue */}
        <div className="flex items-center gap-3 text-[#2C1A0B] mb-5">
          <MapPin className="w-5 h-5 text-[#8C6527] flex-shrink-0" />
          <span className="font-manrope text-xs sm:text-sm font-semibold tracking-wide">
            {haldi.venue}, The Heritage Palace
          </span>
        </div>

        {/* Dress Code */}
        <div className="pt-3 border-t border-[#8C6527]/30 text-xs font-manrope text-[#5C3D1B]">
          Dress Code: <strong className="text-[#2C1A0B] font-semibold">{haldi.dressCode}</strong>
        </div>
      </div>
    </section>
  );
};

export default HaldiSection;
