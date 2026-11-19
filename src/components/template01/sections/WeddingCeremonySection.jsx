'use client';

import React from 'react';
import Image from 'next/image';
import { weddingData } from '@/data/weddingData';
import { Calendar, MapPin } from 'lucide-react';

/**
 * Section 11: Wedding Ceremony (Saat Phere)
 * - Background: /11_wedding_ceremony.png
 * - Desktop: Anchored strictly on the right ("white / parchment side"), mandap on the left is 100% open
 * - Mobile portrait: Focused on royal mandap (object-[30%_center]), card snugly docked at bottom
 */
export const WeddingCeremonySection = () => {
  const wedding = weddingData.events.find((e) => e.id === 'wedding') || weddingData.events[3];

  return (
    <section
      id="wedding"
      className="relative h-full min-h-screen w-full flex flex-col justify-end sm:justify-center items-center sm:items-end pb-6 sm:pb-10 pt-20 sm:pt-28 md:sm:pt-32 px-3.5 sm:px-8 lg:px-12 xl:px-16 overflow-hidden select-none"
    >
      {/* Background Graphic: 11_wedding_ceremony.png with left-anchored desktop layout */}
      <div className="absolute inset-0 w-full h-full pointer-events-none">
        <Image
          src="/11_wedding_ceremony.png"
          alt="Royal Wedding Mandap Red Gold Sacred Fire"
          fill
          priority
          sizes="100vw"
          className="object-cover object-[30%_center] sm:object-left"
        />
        {/* Soft atmospheric gradient on mobile to guarantee readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#FDF9F2]/95 via-[#FDF9F2]/45 to-transparent sm:hidden" />
      </div>

      {/* Responsive Content Container - Snugly positioned on the white parchment space */}
      <div className="editorial-reveal relative z-10 w-[calc(100%-20px)] sm:w-[40%] md:w-[35%] lg:w-[30%] xl:w-[27%] max-w-[360px] sm:max-w-[360px] lg:max-w-[390px] mx-auto sm:ml-auto sm:mr-8 md:sm:mr-14 lg:sm:mr-20 xl:sm:mr-28 text-left flex flex-col items-start bg-[#FDF9F2]/90 sm:bg-transparent backdrop-blur-md sm:backdrop-blur-none border border-[#8C232A]/20 sm:border-0 rounded-2xl sm:rounded-none p-4 sm:p-0 shadow-xl sm:shadow-none">
        <span className="text-[9px] sm:text-[11px] font-manrope font-semibold tracking-[0.24em] uppercase text-[#8C232A] mb-1">
          — The Sacred Vows (Saat Phere) —
        </span>

        <h2 className="font-cormorant text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-medium text-[#2A1014] leading-[1.05] tracking-tight mb-2 drop-shadow-xs">
          Wedding <br />
          <span className="italic font-cormorant text-[#4A151C]">Ceremony</span>
        </h2>

        {/* Delicate Gold Divider */}
        <div className="flex items-center gap-2.5 my-1.5">
          <div className="h-[1px] w-8 sm:w-10 bg-gradient-to-r from-[#A87B36] to-transparent" />
          <span className="text-[11px] text-[#A87B36]">✦</span>
          <div className="h-[1px] w-8 sm:w-10 bg-gradient-to-l from-[#A87B36] to-transparent" />
        </div>

        <p className="font-serif italic text-xs sm:text-sm md:text-[15px] text-[#522329] leading-relaxed mb-3.5 max-w-xs">
          {wedding.description}
        </p>

        {/* Date & Time */}
        <div className="flex items-center gap-2 text-[#2A1014] mb-2">
          <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#8C232A] flex-shrink-0" />
          <span className="font-manrope text-[11px] sm:text-sm font-semibold tracking-wide">
            {wedding.date} • {wedding.time}
          </span>
        </div>

        {/* Venue */}
        <div className="flex items-center gap-2 text-[#2A1014] mb-3">
          <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#8C232A] flex-shrink-0" />
          <span className="font-manrope text-[11px] sm:text-sm font-semibold tracking-wide">
            {wedding.venue}, The Heritage Palace
          </span>
        </div>

        {/* Dress Code */}
        <div className="pt-2 border-t border-[#8C232A]/25 text-[10px] sm:text-xs font-manrope text-[#522329] w-full">
          Dress Code: <strong className="text-[#2A1014] font-semibold">{wedding.dressCode}</strong>
        </div>
      </div>
    </section>
  );
};

export default WeddingCeremonySection;
