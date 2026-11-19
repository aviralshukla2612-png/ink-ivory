'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { KashiWeddingData } from '@/data/kashiTemplateData';

interface KashiHeroSlideProps {
  data: KashiWeddingData;
  onNext: () => void;
  onPrev: () => void;
}

export const KashiHeroSlide: React.FC<KashiHeroSlideProps> = ({ data, onNext, onPrev }) => {
  // Rotating announcements in the bottom oval plaque
  const [announcementIdx, setAnnouncementIdx] = useState<number>(0);

  const announcements = [
    {
      title: 'With the blessings of',
      subtitle: 'Lord Ganesha',
    },
    {
      title: `${data.events[0].name} Ceremony`,
      subtitle: `${data.events[0].day}, ${data.events[0].date} • ${data.events[0].time}`,
      venue: `${data.events[0].venue}`,
    },
    {
      title: `${data.events[3].name} (Phere)`,
      subtitle: `${data.events[3].day}, ${data.events[3].date} • ${data.events[3].time}`,
      venue: `${data.events[3].venue}`,
    },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setAnnouncementIdx((prev) => (prev + 1) % announcements.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [announcements.length]);

  return (
    <div className="relative flex h-full w-full flex-col items-center justify-between overflow-hidden bg-[#241712] select-none">
      {/* Background Kashi Ghat Varanasi Scene Image */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <Image
          src="/kashi_card_crop.jpg"
          alt="Sacred Varanasi Kashi Ghat Sunset on River Ganga"
          fill
          sizes="(max-width: 768px) 100vw, 560px"
          className="object-cover object-center"
          priority
        />
        {/* Soft atmospheric gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/20" />
      </div>

      {/* Side Arrow Navigation Buttons */}
      <button
        onClick={onPrev}
        aria-label="Previous slide"
        className="absolute left-2.5 top-1/2 -translate-y-1/2 z-20 flex h-9 w-9 items-center justify-center rounded-full bg-black/45 text-white/90 backdrop-blur-md transition-all hover:bg-black/70 hover:scale-105 active:scale-95 border border-white/20"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>

      <button
        onClick={onNext}
        aria-label="Next slide"
        className="absolute right-2.5 top-1/2 -translate-y-1/2 z-20 flex h-9 w-9 items-center justify-center rounded-full bg-black/45 text-white/90 backdrop-blur-md transition-all hover:bg-black/70 hover:scale-105 active:scale-95 border border-white/20"
      >
        <ChevronRight className="h-5 w-5" />
      </button>

      {/* Top Section: Space for the carved medallion artwork already in the background */}
      <div className="relative z-10 w-full h-[38%] pointer-events-none" />

      {/* Center Couple Names Overlay */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 flex flex-col items-center text-center px-4"
      >
        <h2 className="font-serif text-3xl sm:text-4xl font-normal text-[#2C1810] tracking-tight drop-shadow-sm">
          {data.groom.name} <span className="italic font-light text-[#8A5B2D]">&amp;</span> {data.bride.name}
        </h2>
        <p className="mt-1 font-serif text-xs sm:text-[13px] text-[#42291E] tracking-wide font-normal italic">
          invite you to celebrate their wedding
        </p>
      </motion.div>

      {/* Bottom Oval Floral Plaque with Rotating Inscriptions */}
      <div className="relative z-10 w-full pb-8 sm:pb-10 flex flex-col items-center justify-center px-6">
        <div className="relative w-full max-w-[340px] h-32 sm:h-36 flex items-center justify-center">
          {/* Subtle backing glow */}
          <div className="absolute inset-4 rounded-full bg-[#FFECC7]/30 blur-md pointer-events-none" />

          {/* Rotating Text Content inside the plaque */}
          <AnimatePresence mode="wait">
            <motion.div
              key={announcementIdx}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              transition={{ duration: 0.6, ease: 'easeInOut' }}
              className="relative z-10 flex flex-col items-center justify-center text-center px-6 max-w-[260px]"
            >
              <p className="font-serif text-[11px] sm:text-xs text-[#7B4D21] font-semibold tracking-wider uppercase">
                {announcements[announcementIdx].title}
              </p>
              <p className="font-serif text-base sm:text-lg text-[#3E2211] font-bold leading-tight mt-0.5">
                {announcements[announcementIdx].subtitle}
              </p>
              {announcements[announcementIdx].venue && (
                <p className="text-[10px] sm:text-[11px] text-[#694220] mt-1 font-medium">
                  {announcements[announcementIdx].venue}
                </p>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Swipe or click hint */}
        <p className="text-[10.5px] tracking-widest text-[#FFF2D6] drop-shadow-md uppercase font-medium mt-1">
          Tap arrows or swipe to turn page
        </p>
      </div>
    </div>
  );
};
