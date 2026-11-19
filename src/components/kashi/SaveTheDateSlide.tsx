'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, ChevronLeft, ChevronRight, Check } from 'lucide-react';
import { KashiWeddingData } from '@/data/kashiTemplateData';

interface SaveTheDateSlideProps {
  data: KashiWeddingData;
  onNext: () => void;
  onPrev: () => void;
}

export const SaveTheDateSlide: React.FC<SaveTheDateSlideProps> = ({ data, onNext, onPrev }) => {
  // Calendar dates for February 2027: Feb 1 is a Monday (1 to 28)
  const daysOfWeek = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
  const dates = Array.from({ length: 28 }, (_, i) => i + 1);

  const googleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
    `${data.groom.name} & ${data.bride.name}'s Wedding`
  )}&dates=20270213T140000Z/20270213T190000Z&details=${encodeURIComponent(
    `We invite you to celebrate the sacred union of ${data.groom.name} & ${data.bride.name} at ${data.primaryVenue.name}, ${data.primaryVenue.city}.`
  )}&location=${encodeURIComponent(`${data.primaryVenue.name}, ${data.primaryVenue.city}`)}`;

  return (
    <div className="relative flex h-full w-full flex-col items-center justify-between overflow-hidden bg-gradient-to-b from-[#F7F0E3] via-[#EFE5D3] to-[#E5D7BF] text-[#332214] p-6 sm:p-8 select-none">
      {/* Background Sacred Jali / Lattice pattern */}
      <div className="absolute inset-0 opacity-[0.07] pointer-events-none">
        <svg width="100%" height="100%">
          <pattern id="jali-pattern" x="0" y="0" width="36" height="36" patternUnits="userSpaceOnUse">
            <path d="M18 0 L36 18 L18 36 L0 18 Z" fill="none" stroke="#633C14" strokeWidth="1" />
            <circle cx="18" cy="18" r="6" fill="none" stroke="#633C14" strokeWidth="0.8" />
          </pattern>
          <rect width="100%" height="100%" fill="url(#jali-pattern)" />
        </svg>
      </div>

      {/* Side Arrow Navigation Buttons */}
      <button
        onClick={onPrev}
        aria-label="Previous slide"
        className="absolute left-2.5 top-1/2 -translate-y-1/2 z-20 flex h-9 w-9 items-center justify-center rounded-full bg-black/15 text-[#3D2513] backdrop-blur-md transition-all hover:bg-black/25 hover:scale-105 active:scale-95 border border-[#9A7432]/30"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>

      <button
        onClick={onNext}
        aria-label="Next slide"
        className="absolute right-2.5 top-1/2 -translate-y-1/2 z-20 flex h-9 w-9 items-center justify-center rounded-full bg-black/15 text-[#3D2513] backdrop-blur-md transition-all hover:bg-black/25 hover:scale-105 active:scale-95 border border-[#9A7432]/30"
      >
        <ChevronRight className="h-5 w-5" />
      </button>

      {/* Section Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="relative z-10 pt-3 text-center"
      >
        <p className="font-serif text-[11px] sm:text-xs tracking-widest text-[#8A612C] uppercase font-semibold">
          Mark Your Calendar
        </p>
        <h2 className="font-serif text-3xl sm:text-4xl font-normal text-[#2C190D] mt-0.5 tracking-tight">
          Save the date
        </h2>
        <div className="mx-auto mt-2 flex items-center justify-center gap-2">
          <span className="h-[1px] w-10 bg-[#B58C45]/50" />
          <span className="h-1.5 w-1.5 rounded-full bg-[#B58C45]" />
          <span className="h-[1px] w-10 bg-[#B58C45]/50" />
        </div>
      </motion.div>

      {/* Hanging Parchment Calendar Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.94, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.15 }}
        className="relative z-10 w-full max-w-[340px] my-auto"
      >
        {/* Gold hanging wall pins */}
        <div className="absolute -top-3 left-10 z-20 flex flex-col items-center">
          <div className="h-3 w-3 rounded-full bg-gradient-to-b from-[#E7C77E] to-[#8C601E] shadow-sm border border-[#FFF0CF]" />
          <div className="h-3 w-[1.5px] bg-[#8C601E]/60" />
        </div>
        <div className="absolute -top-3 right-10 z-20 flex flex-col items-center">
          <div className="h-3 w-3 rounded-full bg-gradient-to-b from-[#E7C77E] to-[#8C601E] shadow-sm border border-[#FFF0CF]" />
          <div className="h-3 w-[1.5px] bg-[#8C601E]/60" />
        </div>

        {/* Parchment Box */}
        <div className="relative rounded-2xl bg-[#FCFAF6] p-6 shadow-luxury border-2 border-[#DFC697] text-[#2C190D]">
          {/* Inner dashed luxury border */}
          <div className="absolute inset-2.5 rounded-xl border border-dashed border-[#DFC697]/60 pointer-events-none" />

          {/* Month & Year Title */}
          <div className="text-center mb-4">
            <h3 className="font-serif text-xl sm:text-2xl font-medium text-[#462913]">
              {data.weddingDate.month}{' '}
              <span className="text-[#966B2F] font-normal">{data.weddingDate.year}</span>
            </h3>
          </div>

          {/* Days of Week Header */}
          <div className="grid grid-cols-7 gap-1 text-center font-serif text-[11px] font-semibold text-[#8C6B3B] mb-2">
            {daysOfWeek.map((day, i) => (
              <span key={i} className="py-1">
                {day}
              </span>
            ))}
          </div>

          {/* Days Grid */}
          <div className="grid grid-cols-7 gap-1 text-center font-serif text-xs sm:text-[13px] text-[#422915]">
            {dates.map((date) => {
              const isWeddingDay = date === data.weddingDate.date;
              return (
                <div key={date} className="relative flex items-center justify-center py-1.5">
                  {isWeddingDay ? (
                    <div className="relative flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-[#4A2D16] to-[#2B1707] text-[#FBEED3] font-bold shadow-md ring-2 ring-[#DFBA73] ring-offset-1">
                      <span>{date}</span>
                    </div>
                  ) : (
                    <span className="text-[#593C24]/85 hover:text-[#966B2F] transition-colors">
                      {date}
                    </span>
                  )}
                </div>
              );
            })}
          </div>

          {/* Highlight Subtitle */}
          <div className="mt-4 pt-3 border-t border-[#EBD6B0] text-center">
            <p className="font-serif text-xs font-semibold text-[#5A381B] tracking-wide">
              {data.weddingDate.dayOfWeek}, {data.weddingDate.date} {data.weddingDate.month}
            </p>
          </div>
        </div>
      </motion.div>

      {/* Footer Venue & Add to Calendar CTA */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="relative z-10 pb-3 flex flex-col items-center text-center gap-3"
      >
        <p className="font-serif text-sm font-medium text-[#4B301B]">
          {data.primaryVenue.name}, {data.primaryVenue.city}
        </p>

        <a
          href={googleCalendarUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-full bg-[#3B2514] px-4 py-2 text-[#F7ECD4] font-serif text-[11.5px] font-semibold tracking-wide shadow-md hover:bg-[#52351E] active:scale-95 transition-all border border-[#B58C45]/40"
        >
          <Calendar className="h-3.5 w-3.5 text-[#E4BF77]" />
          <span>Add to Google Calendar</span>
        </a>
      </motion.div>
    </div>
  );
};
