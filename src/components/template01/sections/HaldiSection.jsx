'use client';

import React from 'react';
import Image from 'next/image';
import { weddingData } from '@/data/weddingData';
import { Calendar, MapPin } from 'lucide-react';

/**
 * Section 08: Haldi Ceremony
 * - Background: /08_haldi_ceremony.png (Yellow drapes, marigolds, ceremonial bowls)
 * - Mobile portrait: Beautifully docked at bottom leaving top marigolds open
 * - Desktop: Floats cleanly on open right-side negative space
 */
export const HaldiSection = () => {
  const haldi = weddingData.events.find((e) => e.id === 'haldi') || weddingData.events[0];

  return (
    <section
      id="haldi"
      className="relative min-h-screen w-full flex flex-col justify-end sm:justify-center items-center sm:items-end pb-8 sm:pb-0 pt-20 sm:pt-0 px-4 sm:px-8 lg:px-12 xl:px-16 overflow-hidden select-none"
    >
      {/* Background Graphic: 16:9 Haldi Ceremony Asset */}
      <div className="absolute inset-0 w-full h-full pointer-events-none">
        <Image
          src="/08_haldi_ceremony.png"
          alt="Haldi Ceremony Marigold Setting"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
        {/* Soft atmospheric gradient on mobile to guarantee readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#FBF6EC]/95 via-[#FBF6EC]/50 to-transparent sm:hidden" />
      </div>

      {/* Responsive Content Container */}
      <div className="editorial-reveal relative z-10 w-full sm:w-[48%] md:w-[38%] lg:w-[32%] xl:w-[28%] max-w-sm sm:max-w-[340px] xl:max-w-[380px] sm:ml-auto text-left flex flex-col items-start bg-[#FBF6EC]/90 sm:bg-transparent backdrop-blur-md sm:backdrop-blur-none border border-[#8C6527]/20 sm:border-0 rounded-2xl sm:rounded-none p-4 sm:p-0 shadow-xl sm:shadow-none">
        <span className="text-[10px] sm:text-[11px] font-manrope font-semibold tracking-[0.26em] uppercase text-[#8C6527] mb-1">
          — Auspicious Turmeric Ritual —
        </span>

        <h2 className="font-cormorant text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-medium text-[#2C1A0B] leading-[1.0] tracking-tight mb-1.5 drop-shadow-xs">
          Haldi <br />
          <span className="italic font-serif text-[#46280E]">Ceremony</span>
        </h2>

        {/* Delicate Gold Divider */}
        <div className="flex items-center gap-2.5 my-1.5">
          <div className="h-[1px] w-8 sm:w-10 bg-gradient-to-r from-[#A87B36] to-transparent" />
          <span className="text-[11px] text-[#A87B36]">✦</span>
          <div className="h-[1px] w-8 sm:w-10 bg-gradient-to-l from-[#A87B36] to-transparent" />
        </div>

        <p className="font-serif italic text-[11px] sm:text-sm text-[#5C3D1B] leading-relaxed mb-3 max-w-xs">
          {haldi.description}
        </p>

        {/* Date & Time */}
        <div className="flex items-center gap-2 text-[#2C1A0B] mb-1.5">
          <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#8C6527] flex-shrink-0" />
          <span className="font-manrope text-[11px] sm:text-sm font-semibold tracking-wide">
            {haldi.date} • {haldi.time}
          </span>
        </div>

        {/* Venue */}
        <div className="flex items-center gap-2 text-[#2C1A0B] mb-2.5">
          <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#8C6527] flex-shrink-0" />
          <span className="font-manrope text-[11px] sm:text-sm font-semibold tracking-wide">
            {haldi.venue}, The Heritage Palace
          </span>
        </div>

        {/* Dress Code */}
        <div className="pt-1.5 border-t border-[#8C6527]/30 text-[10px] sm:text-xs font-manrope text-[#5C3D1B]">
          Dress Code: <strong className="text-[#2C1A0B] font-semibold">{haldi.dressCode}</strong>
        </div>
      </div>
    </section>
  );
};

export default HaldiSection;
