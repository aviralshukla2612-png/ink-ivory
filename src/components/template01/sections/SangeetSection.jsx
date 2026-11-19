'use client';

import React from 'react';
import Image from 'next/image';
import { weddingData } from '@/data/weddingData';
import { Calendar, MapPin } from 'lucide-react';

/**
 * Section 10: Sangeet Night
 * - Background: /10_sangeet_night.png
 * - Desktop: Placed purely on the right ("open midnight space"), leaving left royal ballroom stage & chandeliers open
 * - Mobile portrait: Focused on royal ballroom (object-[30%_center]), card snugly docked at bottom
 */
export const SangeetSection = () => {
  const sangeet = weddingData.events.find((e) => e.id === 'sangeet') || weddingData.events[2];

  return (
    <section
      id="sangeet"
      className="relative h-full min-h-screen w-full flex flex-col justify-end sm:justify-center items-center sm:items-end pb-5 sm:pb-0 pt-16 sm:pt-0 px-3.5 sm:px-8 lg:px-12 xl:px-16 overflow-hidden select-none"
    >
      {/* Background Graphic: 10_sangeet_night.png with left-anchored desktop layout */}
      <div className="absolute inset-0 w-full h-full pointer-events-none">
        <Image
          src="/10_sangeet_night.png"
          alt="Sangeet Night Stage Purple Navy Fairy Lights"
          fill
          priority
          sizes="100vw"
          className="object-cover object-[30%_center] sm:object-left"
        />
        {/* Soft atmospheric gradient on mobile to guarantee readability while leaving top 50% chandeliers open */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#091321]/95 via-[#091321]/40 to-transparent sm:hidden" />
      </div>

      {/* Responsive Content Container — Strictly on the right side on desktop */}
      <div className="editorial-reveal relative z-10 w-[calc(100%-20px)] sm:w-[38%] md:w-[32%] lg:w-[28%] xl:w-[26%] max-w-[340px] sm:max-w-[320px] lg:max-w-[350px] mx-auto sm:ml-auto sm:mr-8 md:sm:mr-14 lg:sm:mr-20 xl:sm:mr-28 text-left flex flex-col items-start bg-[#091321]/90 sm:bg-transparent backdrop-blur-md sm:backdrop-blur-none border border-[#D6B477]/30 sm:border-0 rounded-2xl sm:rounded-none p-4 sm:p-0 shadow-xl sm:shadow-none">
        <span className="text-[9px] sm:text-[11px] font-manrope font-semibold tracking-[0.26em] uppercase text-[#E7CEA0] mb-1">
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

        {/* Ceremony Details Card */}
        <div className="space-y-2 w-full text-xs font-manrope text-[#FDF9F2]">
          <div className="flex items-center gap-2">
            <Calendar className="w-3.5 h-3.5 text-[#D6B477] shrink-0" />
            <span className="font-medium text-[11px] sm:text-xs text-[#FFFDF7]">
              {sangeet.date} • {sangeet.time}
            </span>
          </div>

          <div className="flex items-start gap-2">
            <MapPin className="w-3.5 h-3.5 text-[#D6B477] shrink-0 mt-0.5" />
            <span className="font-medium text-[11px] sm:text-xs text-[#FAF5ED] leading-tight">
              {sangeet.venue}
            </span>
          </div>
        </div>

        {/* Dress Code Accent */}
        {sangeet.dressCode && (
          <div className="mt-3 pt-2.5 border-t border-[#D6B477]/25 w-full">
            <span className="text-[10px] sm:text-[11px] font-manrope text-[#D6B477] font-semibold tracking-wider">
              Dress Code:{' '}
              <span className="font-medium text-[#FFFDF7]">{sangeet.dressCode}</span>
            </span>
          </div>
        )}
      </div>
    </section>
  );
};

export default SangeetSection;
