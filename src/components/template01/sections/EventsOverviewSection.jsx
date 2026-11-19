'use client';

import React from 'react';
import Image from 'next/image';
import { weddingData } from '@/data/weddingData';
import { useSlider } from '@/context/SliderContext';

/**
 * Section 07: Wedding Events Overview
 * - 5 Gold wireframe arched badges side-by-side:
 *     Haldi | Mehendi | Sangeet | Wedding | Reception
 * - Clicking any ceremony slides directly to that page in the horizontal presentation
 */
export const EventsOverviewSection = () => {
  const { events } = weddingData;
  const { goToSlide } = useSlider();

  const handleScrollToEvent = (eventId) => {
    const slideMap = {
      haldi: 3,
      mehendi: 4,
      sangeet: 5,
      wedding: 6,
      reception: 7,
    };
    if (slideMap[eventId] !== undefined) {
      goToSlide(slideMap[eventId]);
    }
  };

  const getEventIcon = (id) => {
    switch (id) {
      case 'haldi':
        return (
          <svg className="w-5 h-5 sm:w-6 sm:h-6 text-[#D6B477]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
            <circle cx="12" cy="12" r="4" />
            <path d="M12 2v2 M12 20v2 M4.93 4.93l1.41 1.41 M17.66 17.66l1.41 1.41 M2 12h2 M20 12h2 M6.34 17.66l-1.41 1.41 M19.07 4.93l-1.41 1.41" />
          </svg>
        );
      case 'mehendi':
        return (
          <svg className="w-5 h-5 sm:w-6 sm:h-6 text-[#D6B477]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
            <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" />
            <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
          </svg>
        );
      case 'sangeet':
        return (
          <svg className="w-5 h-5 sm:w-6 sm:h-6 text-[#D6B477]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
            <path d="M9 18V5l12-2v13" />
            <circle cx="6" cy="18" r="3" />
            <circle cx="18" cy="16" r="3" />
          </svg>
        );
      case 'wedding':
        return (
          <svg className="w-5 h-5 sm:w-6 sm:h-6 text-[#D6B477]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
            <circle cx="9" cy="12" r="5" />
            <circle cx="15" cy="12" r="5" />
            <path d="M9 7l1-2h4l1 2" strokeDasharray="2 2" />
          </svg>
        );
      case 'reception':
        return (
          <svg className="w-5 h-5 sm:w-6 sm:h-6 text-[#D6B477]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
            <path d="M3 21h18 M4 21V10l8-6 8 6v11 M9 21v-6h6v6" />
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <section
      id="events"
      className="relative h-full min-h-screen w-full flex flex-col items-center justify-center pt-16 sm:pt-28 pb-10 sm:pb-16 px-4 sm:px-6 bg-[#091321] text-[#F7F0E3] overflow-hidden select-none"
    >
      {/* Background Graphic: 07_wedding_events_overview.png */}
      <div className="absolute inset-0 w-full h-full pointer-events-none">
        <Image
          src="/07_wedding_events_overview.png"
          alt="Wedding Events Overview Arches"
          fill
          sizes="100vw"
          className="object-cover object-center"
        />
      </div>

      <div className="relative z-10 max-w-5xl w-full mx-auto text-center flex flex-col items-center pt-4 sm:pt-8">
        {/* Eyebrow */}
        <p className="font-manrope text-[9px] sm:text-[12px] font-semibold tracking-[0.3em] uppercase text-[#E7CEA0] mb-1 sm:mb-2">
          — Five Sacred Chapters —
        </p>

        {/* Title: Wedding Celebrations */}
        <h2 className="font-cormorant text-2xl sm:text-5xl md:text-7xl font-medium text-[#FFFDF7] leading-[0.95] tracking-tight mb-4 sm:mb-10 drop-shadow-md">
          Wedding <br />
          <span className="italic font-serif text-[#D6B477]">Celebrations</span>
        </h2>

        {/* 5 Wireframe Arched Badges matching Image 3 (Tile 07) */}
        <div className="flex flex-wrap justify-center sm:grid sm:grid-cols-5 gap-2 sm:gap-6 max-w-4xl w-full">
          {events.map((evt) => (
            <button
              key={evt.id}
              type="button"
              onClick={() => handleScrollToEvent(evt.id)}
              className="group relative flex flex-col items-center justify-between py-2.5 sm:py-6 px-2 sm:px-4 w-[28%] sm:w-auto rounded-t-[28px] sm:rounded-t-[50px] rounded-b-xl border border-[#D6B477]/50 hover:border-[#D6B477] bg-[#091321]/40 hover:bg-[#091321]/60 backdrop-blur-xs transition-all duration-300 hover:-translate-y-2 cursor-pointer focus:outline-none"
            >
              {/* Inner Arch Silhouette */}
              <div className="w-6 h-6 sm:w-10 sm:h-10 rounded-full border border-[#D6B477]/40 flex items-center justify-center mb-1 sm:mb-4 group-hover:scale-110 group-hover:border-[#D6B477] transition-all">
                {getEventIcon(evt.id)}
              </div>

              {/* Event Name */}
              <h3 className="font-cormorant text-[11px] sm:text-xl md:text-2xl font-semibold text-[#F7F0E3] group-hover:text-[#FFFDF7] tracking-wide mb-0.5 sm:mb-1">
                {evt.name.replace(/^(The\s+)/, '').split(' ')[0]}
              </h3>

              <span className="text-[7.5px] sm:text-[10px] font-manrope text-[#E7CEA0]/80 group-hover:text-[#E7CEA0] uppercase tracking-wider">
                {evt.date.split(',')[1]?.trim().slice(0, 6) || 'Dec 2026'}
              </span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};

export default EventsOverviewSection;
