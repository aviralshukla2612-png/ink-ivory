'use client';

import React from 'react';
import Image from 'next/image';
import { weddingData } from '@/data/weddingData';
import { Calendar, MapPin } from 'lucide-react';

/**
 * Section 09: Mehendi Ceremony
 * - Background: /09_mehendi_ceremony.png
 * - Desktop: Placed purely on the right ("white / ivory side"), leaving left green canopy & seating open
 * - Mobile portrait: Focused on royal henna lounge (object-[28%_center]), card snugly docked at bottom
 */
export const MehendiSection = () => {
  const mehendi = weddingData.events.find((e) => e.id === 'mehendi') || weddingData.events[1];

  return (
    <section
      id="mehendi"
      className="relative h-full min-h-screen w-full flex flex-col justify-end sm:justify-center items-center sm:items-end pb-6 sm:pb-10 pt-20 sm:pt-28 md:sm:pt-32 px-3.5 sm:px-8 lg:px-12 xl:px-16 overflow-hidden select-none"
    >
      {/* Background Graphic: 09_mehendi_ceremony.png with left-anchored desktop layout */}
      <div className="absolute inset-0 w-full h-full pointer-events-none">
        <Image
          src="/09_mehendi_ceremony.png"
          alt="Mehendi Ceremony Green Drapes Lounge"
          fill
          priority
          sizes="100vw"
          className="object-cover object-[28%_center] sm:object-left"
        />
        {/* Soft atmospheric gradient on mobile to guarantee readability while leaving top 50% decor open */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#FAF6EE]/95 via-[#FAF6EE]/40 to-transparent sm:hidden" />
      </div>

      {/* Responsive Content Container — Strictly on the right side on desktop ("white side") */}
      <div className="editorial-reveal relative z-10 w-[calc(100%-20px)] sm:w-[40%] md:w-[35%] lg:w-[30%] xl:w-[27%] max-w-[360px] sm:max-w-[360px] lg:max-w-[390px] mx-auto sm:ml-auto sm:mr-8 md:sm:mr-14 lg:sm:mr-20 xl:sm:mr-28 text-left flex flex-col items-start bg-[#FAF6EE]/90 sm:bg-transparent backdrop-blur-md sm:backdrop-blur-none border border-[#8C6527]/20 sm:border-0 rounded-2xl sm:rounded-none p-4 sm:p-0 shadow-xl sm:shadow-none">
        <span className="text-[9px] sm:text-[11px] font-manrope font-semibold tracking-[0.26em] uppercase text-[#6B5024] mb-1">
          — Sacred Henna Soirée —
        </span>

        <h2 className="font-cormorant text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-medium text-[#22160C] leading-[1.05] tracking-tight mb-2 drop-shadow-xs">
          Mehendi <br />
          <span className="italic font-cormorant text-[#382313]">Ceremony</span>
        </h2>

        {/* Delicate Gold Divider */}
        <div className="flex items-center gap-2.5 my-1.5">
          <div className="h-[1px] w-8 sm:w-10 bg-gradient-to-r from-[#A87B36] to-transparent" />
          <span className="text-[11px] text-[#A87B36]">✦</span>
          <div className="h-[1px] w-8 sm:w-10 bg-gradient-to-l from-[#A87B36] to-transparent" />
        </div>

        <p className="font-serif italic text-[11px] sm:text-sm text-[#4C331B] leading-relaxed mb-3 max-w-xs">
          {mehendi.description}
        </p>

        {/* Ceremony Details Card */}
        <div className="space-y-2 w-full text-xs font-manrope text-[#22160C]">
          <div className="flex items-center gap-2">
            <Calendar className="w-3.5 h-3.5 text-[#6B5024] shrink-0" />
            <span className="font-medium text-[11px] sm:text-xs text-[#22160C]">
              {mehendi.date} • {mehendi.time}
            </span>
          </div>

          <div className="flex items-start gap-2">
            <MapPin className="w-3.5 h-3.5 text-[#6B5024] shrink-0 mt-0.5" />
            <span className="font-medium text-[11px] sm:text-xs text-[#22160C] leading-tight">
              {mehendi.venue}
            </span>
          </div>
        </div>

        {/* Dress Code Accent */}
        {mehendi.dressCode && (
          <div className="mt-3 pt-2.5 border-t border-[#6B5024]/25 w-full">
            <span className="text-[10px] sm:text-[11px] font-manrope text-[#5C3F1B] font-semibold tracking-wider">
              Dress Code:{' '}
              <span className="font-medium text-[#22160C]">{mehendi.dressCode}</span>
            </span>
          </div>
        )}
      </div>
    </section>
  );
};

export default MehendiSection;
