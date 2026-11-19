'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Clock, Sparkles } from 'lucide-react';
import { KashiWeddingData, WeddingEvent } from '@/data/kashiTemplateData';

interface CelebrationsSlideProps {
  data: KashiWeddingData;
  onSelectEvent: (eventId: string) => void;
  onNext: () => void;
  onPrev: () => void;
}

export const CelebrationsSlide: React.FC<CelebrationsSlideProps> = ({
  data,
  onSelectEvent,
  onNext,
  onPrev,
}) => {
  return (
    <div className="relative flex h-full w-full flex-col items-center justify-between overflow-hidden bg-gradient-to-b from-[#FAF5EC] via-[#F3EAD9] to-[#E9DEC8] text-[#332214] p-5 sm:p-7 select-none">
      {/* Background Subtle Lattice */}
      <div className="absolute inset-0 opacity-[0.06] pointer-events-none">
        <svg width="100%" height="100%">
          <pattern id="lattice-cel" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M20 0 L40 20 L20 40 L0 20 Z" fill="none" stroke="#633C14" strokeWidth="1" />
          </pattern>
          <rect width="100%" height="100%" fill="url(#lattice-cel)" />
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

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="relative z-10 pt-2 text-center"
      >
        <p className="font-serif text-[11px] sm:text-xs tracking-widest text-[#8A612C] uppercase font-semibold">
          From Morning to Night
        </p>
        <h2 className="font-serif text-3xl sm:text-4xl font-normal text-[#2C190D] mt-0.5 tracking-tight">
          The celebrations
        </h2>
        <div className="mx-auto mt-2 flex items-center justify-center gap-2">
          <span className="h-[1px] w-10 bg-[#B58C45]/50" />
          <span className="h-1.5 w-1.5 rounded-full bg-[#B58C45]" />
          <span className="h-[1px] w-10 bg-[#B58C45]/50" />
        </div>
      </motion.div>

      {/* Event Cards Grid */}
      <div className="relative z-10 w-full max-w-[360px] my-auto flex flex-col gap-2.5 px-2">
        {data.events.map((event, idx) => (
          <motion.button
            key={event.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: idx * 0.08 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onSelectEvent(event.id)}
            className="group relative flex items-center justify-between rounded-xl bg-gradient-to-r from-[#FFFFFF] to-[#FCFAF6] px-4 py-2.5 sm:py-3 text-left shadow-sm border border-[#DFC697] hover:border-[#B58C45] hover:shadow-md transition-all"
          >
            <div>
              <div className="flex items-center gap-2">
                <h4 className="font-serif text-base sm:text-[17px] font-semibold text-[#2C190D] group-hover:text-[#8C5D23] transition-colors">
                  {event.name}
                </h4>
                {event.id === 'wedding' && (
                  <span className="rounded-full bg-[#8C5D23]/10 px-2 py-0.5 text-[9.5px] font-semibold text-[#8C5D23] uppercase">
                    Sacred Phere
                  </span>
                )}
              </div>
              <p className="text-[11.5px] text-[#694F38] mt-0.5 font-normal">
                {event.day}, {event.date} • {event.time}
              </p>
            </div>

            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#FAF5EB] text-[#8C5D23] border border-[#DFC697] group-hover:bg-[#8C5D23] group-hover:text-white transition-all text-xs font-bold">
              →
            </span>
          </motion.button>
        ))}
      </div>

      {/* Bottom Hanging Marigold & Mango Leaf Toran Border */}
      <div className="relative z-10 w-full flex flex-col items-center">
        <p className="text-[10px] tracking-wider text-[#7A5B36] uppercase font-medium mb-1.5">
          Tap any ceremony for timings &amp; venue map
        </p>
        
        {/* Decorative Marigold & Mango Leaves SVG Toran Garland */}
        <div className="relative w-full h-10 overflow-hidden flex items-center justify-center pointer-events-none">
          <svg className="w-full h-full text-[#E08D23]" viewBox="0 0 400 40" fill="none">
            {/* Top rope */}
            <path d="M0 8 Q 50 14, 100 8 T 200 8 T 300 8 T 400 8" stroke="#8C6527" strokeWidth="2" />
            {/* Hanging Mango Leaves */}
            <path d="M40 8 Q 45 28, 42 34 Q 40 28, 38 8 Z" fill="#2E6B3A" />
            <path d="M90 8 Q 95 28, 92 34 Q 90 28, 88 8 Z" fill="#2E6B3A" />
            <path d="M140 8 Q 145 28, 142 34 Q 140 28, 138 8 Z" fill="#2E6B3A" />
            <path d="M190 8 Q 195 28, 192 34 Q 190 28, 188 8 Z" fill="#2E6B3A" />
            <path d="M240 8 Q 245 28, 242 34 Q 240 28, 238 8 Z" fill="#2E6B3A" />
            <path d="M290 8 Q 295 28, 292 34 Q 290 28, 288 8 Z" fill="#2E6B3A" />
            <path d="M340 8 Q 345 28, 342 34 Q 340 28, 338 8 Z" fill="#2E6B3A" />

            {/* Marigold flowers */}
            <circle cx="50" cy="12" r="7" fill="#F49D1A" />
            <circle cx="50" cy="12" r="4.5" fill="#E05315" />
            <circle cx="100" cy="12" r="7" fill="#F49D1A" />
            <circle cx="100" cy="12" r="4.5" fill="#E05315" />
            <circle cx="150" cy="12" r="7" fill="#F49D1A" />
            <circle cx="150" cy="12" r="4.5" fill="#E05315" />
            <circle cx="200" cy="12" r="7" fill="#F49D1A" />
            <circle cx="200" cy="12" r="4.5" fill="#E05315" />
            <circle cx="250" cy="12" r="7" fill="#F49D1A" />
            <circle cx="250" cy="12" r="4.5" fill="#E05315" />
            <circle cx="300" cy="12" r="7" fill="#F49D1A" />
            <circle cx="300" cy="12" r="4.5" fill="#E05315" />
            <circle cx="350" cy="12" r="7" fill="#F49D1A" />
            <circle cx="350" cy="12" r="4.5" fill="#E05315" />
          </svg>
        </div>
      </div>
    </div>
  );
};
