'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Navigation, MapPin, ChevronLeft, ChevronRight, Bell } from 'lucide-react';
import { WeddingEvent } from '@/data/kashiTemplateData';

interface EventDetailSlideProps {
  event: WeddingEvent;
  eventIndex: number;
  totalEvents: number;
  onNext: () => void;
  onPrev: () => void;
  onBackToOverview: () => void;
}

export const EventDetailSlide: React.FC<EventDetailSlideProps> = ({
  event,
  eventIndex,
  totalEvents,
  onNext,
  onPrev,
  onBackToOverview,
}) => {
  return (
    <div className="relative flex h-full w-full flex-col items-center justify-between overflow-hidden bg-gradient-to-b from-[#1C2B22] via-[#14231B] to-[#0A1610] text-[#F7F2E7] p-5 sm:p-7 select-none">
      {/* Background Sacred Geometric Mandala */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <svg width="100%" height="100%">
          <pattern id="vedic-bg" x="0" y="0" width="48" height="48" patternUnits="userSpaceOnUse">
            <circle cx="24" cy="24" r="18" fill="none" stroke="#CBB175" strokeWidth="0.8" />
            <path d="M24 6 L42 24 L24 42 L6 24 Z" fill="none" stroke="#CBB175" strokeWidth="0.8" />
          </pattern>
          <rect width="100%" height="100%" fill="url(#vedic-bg)" />
        </svg>
      </div>

      {/* Side Arrow Navigation Buttons */}
      <button
        onClick={onPrev}
        aria-label="Previous slide"
        className="absolute left-2.5 top-1/2 -translate-y-1/2 z-20 flex h-9 w-9 items-center justify-center rounded-full bg-black/40 text-white/90 backdrop-blur-md transition-all hover:bg-black/60 hover:scale-105 active:scale-95 border border-white/20"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>

      <button
        onClick={onNext}
        aria-label="Next slide"
        className="absolute right-2.5 top-1/2 -translate-y-1/2 z-20 flex h-9 w-9 items-center justify-center rounded-full bg-black/40 text-white/90 backdrop-blur-md transition-all hover:bg-black/60 hover:scale-105 active:scale-95 border border-white/20"
      >
        <ChevronRight className="h-5 w-5" />
      </button>

      {/* Top Hanging Garland & Overview Back Link */}
      <div className="relative z-10 w-full flex flex-col items-center pt-2">
        <button
          onClick={onBackToOverview}
          className="text-[11px] font-serif tracking-widest text-[#D4AF67] hover:text-[#FFE3A8] uppercase flex items-center gap-1 transition-colors"
        >
          <span>← Back to All Celebrations</span>
        </button>

        {/* Hanging Floral Toran SVG */}
        <div className="mt-2 h-7 w-32 flex items-center justify-center pointer-events-none">
          <svg className="w-full h-full text-[#E5A84B]" viewBox="0 0 120 28" fill="none">
            <path d="M10 4 Q 30 18, 60 4 T 110 4" stroke="#D4AF67" strokeWidth="1.5" />
            <circle cx="35" cy="12" r="4.5" fill="#E85D75" />
            <circle cx="60" cy="8" r="4.5" fill="#FFA500" />
            <circle cx="85" cy="12" r="4.5" fill="#E85D75" />
          </svg>
        </div>
      </div>

      {/* Centerpiece Parchment Card */}
      <motion.div
        key={event.id}
        initial={{ opacity: 0, scale: 0.94, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.94 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 w-full max-w-[340px] my-auto"
      >
        <div className="relative rounded-2xl bg-[#FCFAF6] text-[#2C190D] p-6 shadow-2xl border-2 border-[#D7B46F] flex flex-col items-center text-center">
          {/* Inner Dashed Border */}
          <div className="absolute inset-2.5 rounded-xl border border-dashed border-[#D7B46F]/60 pointer-events-none" />

          {/* Slide Indicator */}
          <p className="font-serif text-[11px] font-semibold text-[#8C642A] tracking-widest uppercase mb-1">
            {eventIndex + 1} / {totalEvents}
          </p>

          {/* Event Title */}
          <h3 className="font-serif text-3xl sm:text-4xl font-normal text-[#2C190D] tracking-tight">
            {event.name}
          </h3>

          <div className="my-2.5 flex items-center gap-2">
            <span className="h-[1px] w-8 bg-[#C49A45]/50" />
            <span className="h-1.5 w-1.5 rounded-full bg-[#C49A45]" />
            <span className="h-[1px] w-8 bg-[#C49A45]/50" />
          </div>

          {/* Date & Time */}
          <p className="font-serif text-xs sm:text-[13px] font-semibold tracking-wider text-[#734A1B] uppercase">
            {event.day}, {event.date}
          </p>
          <p className="font-serif text-sm font-bold text-[#8C5E25] mt-0.5">
            {event.time}
          </p>

          {/* Venue */}
          <div className="mt-3.5 flex items-center justify-center gap-1.5 text-xs sm:text-sm font-medium text-[#462F1E]">
            <MapPin className="h-3.5 w-3.5 text-[#B8873B] shrink-0" />
            <span>{event.venue}, {event.city}</span>
          </div>

          {/* Dress code */}
          {event.dressCode && (
            <p className="mt-2 text-[11px] text-[#7A5F45] italic font-light">
              Dress code: {event.dressCode}
            </p>
          )}

          {/* Dual Action Buttons: Directions & Map */}
          <div className="mt-6 flex items-center justify-center gap-3 w-full">
            <a
              href={event.directionsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-full bg-[#FCFAF6] hover:bg-[#F4ECE0] py-2 px-3 text-[#3E2816] font-serif text-xs font-semibold shadow-sm border border-[#D7B46F] active:scale-95 transition-all"
            >
              <Navigation className="h-3.5 w-3.5 text-[#B8873B]" />
              <span>Directions</span>
            </a>

            <a
              href={event.mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-full bg-[#FCFAF6] hover:bg-[#F4ECE0] py-2 px-3 text-[#3E2816] font-serif text-xs font-semibold shadow-sm border border-[#D7B46F] active:scale-95 transition-all"
            >
              <MapPin className="h-3.5 w-3.5 text-[#B8873B]" />
              <span>Map</span>
            </a>
          </div>

          {/* Hanging Swinging Brass Bells (Ghanti) dangling below the card! */}
          <div className="absolute -bottom-8 inset-x-0 flex items-center justify-around px-8 pointer-events-none">
            {[0, 1, 2, 3, 4].map((bellIdx) => (
              <motion.div
                key={bellIdx}
                animate={{
                  rotate: [bellIdx % 2 === 0 ? -6 : 6, bellIdx % 2 === 0 ? 6 : -6, bellIdx % 2 === 0 ? -6 : 6],
                }}
                transition={{
                  duration: 2.2 + bellIdx * 0.3,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
                className="flex flex-col items-center origin-top"
              >
                {/* Bell hanging thread */}
                <span className="h-3 w-[1.5px] bg-[#C59B4E]" />
                {/* Golden Brass Bell body */}
                <div className="relative h-4 w-4 rounded-b-lg bg-gradient-to-b from-[#E7C77E] via-[#B8873B] to-[#785116] shadow-sm flex items-end justify-center">
                  <span className="h-1 w-1 rounded-full bg-[#462F1E] mb-[-2px]" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Bottom hint */}
      <div className="relative z-10 w-full text-center pb-2">
        <p className="text-[10px] tracking-widest text-[#B59C73] uppercase font-light">
          Swipe or use arrows to view other rituals
        </p>
      </div>
    </div>
  );
};
