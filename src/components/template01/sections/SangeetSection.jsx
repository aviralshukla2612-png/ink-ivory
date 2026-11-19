'use client';

import React from 'react';
import Image from 'next/image';
import { weddingData } from '@/data/weddingData';
import { Calendar, MapPin } from 'lucide-react';

/**
 * Section 10: Sangeet Night
 * - Background: /10_sangeet_night.png (Purple/navy evening atmosphere, luxury stage, chandeliers)
 * - Mobile portrait: Beautifully docked at bottom leaving top chandeliers & stage open
 * - Desktop: Floats cleanly on open right-side negative space
 */
export const SangeetSection = () => {
  const sangeet = weddingData.events.find((e) => e.id === 'sangeet') || weddingData.events[2];

  return (
    <section
      id="sangeet"
      className="relative min-h-screen w-full flex flex-col justify-end sm:justify-center items-center sm:items-end pb-8 sm:pb-0 pt-20 sm:pt-0 px-4 sm:px-8 lg:px-12 xl:px-16 overflow-hidden select-none"
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
        {/* Soft atmospheric gradient on mobile to guarantee readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#091321]/95 via-[#091321]/50 to-transparent sm:hidden" />
      </div>

      {/* Responsive Content Container */}
      <div className="editorial-reveal relative z-10 w-full sm:w-[48%] md:w-[38%] lg:w-[32%] xl:w-[28%] max-w-sm sm:max-w-[340px] xl:max-w-[380px] sm:ml-auto text-left flex flex-col items-start bg-[#091321]/85 sm:bg-transparent backdrop-blur-md sm:backdrop-blur-none border border-[#D6B477]/30 sm:border-0 rounded-2xl sm:rounded-none p-4 sm:p-0 shadow-xl sm:shadow-none">
        <span className="text-[10px] sm:text-[11px] font-manrope font-semibold tracking-[0.26em] uppercase text-[#E7CEA0] mb-1">
          — An Evening of Music &amp; Dance —
        </span>

        <h2 className="font-cormorant text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-medium text-[#FFFDF7] leading-[1.0] tracking-tight mb-1.5 drop-shadow-md">
          Sangeet <br />
          <span className="italic font-serif text-[#D6B477]">Night</span>
        </h2>

        {/* Delicate Gold Divider */}
        <div className="flex items-center gap-2.5 my-1.5">
          <div className="h-[1px] w-8 sm:w-10 bg-gradient-to-r from-[#D6B477] to-transparent" />
          <span className="text-[11px] text-[#D6B477]">✦</span>
          <div className="h-[1px] w-8 sm:w-10 bg-gradient-to-l from-[#D6B477] to-transparent" />
        </div>

        <p className="font-serif italic text-[11px] sm:text-sm text-[#EFE3CD] leading-relaxed mb-3 max-w-xs drop-shadow-sm">
          {sangeet.description}
        </p>

        {/* Date & Time */}
        <div className="flex items-center gap-2 text-[#FFFDF7] mb-1.5">
          <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#D6B477] flex-shrink-0" />
          <span className="font-manrope text-[11px] sm:text-sm font-semibold tracking-wide">
            {sangeet.date} • {sangeet.time}
          </span>
        </div>

        {/* Venue */}
        <div className="flex items-center gap-2 text-[#FFFDF7] mb-2.5">
          <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#D6B477] flex-shrink-0" />
          <span className="font-manrope text-[11px] sm:text-sm font-semibold tracking-wide">
            {sangeet.venue}, The Heritage Palace
          </span>
        </div>

        {/* Dress Code */}
        <div className="pt-1.5 border-t border-[#D6B477]/30 text-[10px] sm:text-xs font-manrope text-[#E7CEA0]">
          Dress Code: <strong className="text-[#FFFDF7] font-semibold">{sangeet.dressCode}</strong>
        </div>
      </div>
    </section>
  );
};

export default SangeetSection;
