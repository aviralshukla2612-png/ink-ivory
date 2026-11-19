'use client';

import React from 'react';
import Image from 'next/image';
import { weddingData } from '@/data/weddingData';
import { Calendar, MapPin } from 'lucide-react';

/**
 * Section 12: Reception Gala
 * - Background: /12_reception.png
 * - Desktop: Placed purely on the right ("midnight sky side"), leaving left lake & illuminated palace terrace open
 * - Mobile portrait: Focused on royal terrace (object-[32%_center]), card snugly docked at bottom
 */
export const ReceptionSection = () => {
  const reception = weddingData.events.find((e) => e.id === 'reception') || weddingData.events[4];

  return (
    <section
      id="reception"
      className="relative h-full min-h-screen w-full flex flex-col justify-end sm:justify-center items-center sm:items-end pb-5 sm:pb-0 pt-16 sm:pt-0 px-3.5 sm:px-10 lg:px-16 xl:px-24 overflow-hidden select-none"
    >
      {/* Background Graphic: 12_reception.png with responsive focal point */}
      <div className="absolute inset-0 w-full h-full pointer-events-none">
        <Image
          src="/12_reception.png"
          alt="Imperial Reception Gala Dining Chandeliers"
          fill
          priority
          sizes="100vw"
          className="object-cover object-[32%_center] sm:object-center"
        />
        {/* Soft atmospheric gradient on mobile to guarantee readability while leaving top 50% palace open */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#091321]/95 via-[#091321]/40 to-transparent sm:hidden" />
      </div>

      {/* Responsive Content Container — Strictly on the right side on desktop */}
      <div className="editorial-reveal relative z-10 w-[calc(100%-20px)] sm:w-[48%] md:w-[40%] lg:w-[34%] xl:w-[30%] max-w-[340px] sm:max-w-[380px] xl:max-w-[420px] mx-auto sm:ml-auto sm:mr-0 text-left flex flex-col items-start bg-[#091321]/90 sm:bg-transparent backdrop-blur-md sm:backdrop-blur-none border border-[#D6B477]/30 sm:border-0 rounded-2xl sm:rounded-none p-4 sm:p-0 shadow-xl sm:shadow-none">
        <span className="text-[9px] sm:text-[11px] font-manrope font-semibold tracking-[0.26em] uppercase text-[#E7CEA0] mb-1">
          — An Evening of Celebration —
        </span>

        <h2 className="font-cormorant text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-medium text-[#FFFDF7] leading-[1.0] tracking-tight mb-1.5 drop-shadow-md">
          Imperial <br />
          <span className="italic font-serif text-[#D6B477]">Reception</span>
        </h2>

        {/* Delicate Gold Divider */}
        <div className="flex items-center gap-2.5 my-1.5">
          <div className="h-[1px] w-8 sm:w-10 bg-gradient-to-r from-[#D6B477] to-transparent" />
          <span className="text-[11px] text-[#D6B477]">✦</span>
          <div className="h-[1px] w-8 sm:w-10 bg-gradient-to-l from-[#D6B477] to-transparent" />
        </div>

        <p className="font-serif italic text-[11px] sm:text-sm text-[#EFE3CD] leading-relaxed mb-3 max-w-xs drop-shadow-sm">
          {reception.description}
        </p>

        {/* Ceremony Details Card */}
        <div className="space-y-2 w-full text-xs font-manrope text-[#FDF9F2]">
          <div className="flex items-center gap-2">
            <Calendar className="w-3.5 h-3.5 text-[#D6B477] shrink-0" />
            <span className="font-medium text-[11px] sm:text-xs text-[#FFFDF7]">
              {reception.date} • {reception.time}
            </span>
          </div>

          <div className="flex items-start gap-2">
            <MapPin className="w-3.5 h-3.5 text-[#D6B477] shrink-0 mt-0.5" />
            <span className="font-medium text-[11px] sm:text-xs text-[#FAF5ED] leading-tight">
              {reception.venue}
            </span>
          </div>
        </div>

        {/* Dress Code Accent */}
        {reception.dressCode && (
          <div className="mt-3 pt-2.5 border-t border-[#D6B477]/25 w-full">
            <span className="text-[10px] sm:text-[11px] font-manrope text-[#D6B477] font-semibold tracking-wider">
              Dress Code:{' '}
              <span className="font-medium text-[#FFFDF7]">{reception.dressCode}</span>
            </span>
          </div>
        )}
      </div>
    </section>
  );
};

export default ReceptionSection;
