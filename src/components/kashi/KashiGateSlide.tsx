'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Sparkles, ChevronRight } from 'lucide-react';
import { KashiWeddingData } from '@/data/kashiTemplateData';

interface KashiGateSlideProps {
  data: KashiWeddingData;
  onContinue: () => void;
}

export const KashiGateSlide: React.FC<KashiGateSlideProps> = ({ data, onContinue }) => {
  return (
    <div className="relative flex h-full w-full flex-col items-center justify-between overflow-hidden bg-gradient-to-b from-[#0E281E] via-[#091F17] to-[#04110C] text-[#FDF9F2] p-6 sm:p-8 select-none">
      {/* Background Sacred Geometric Aura / Sunburst rays */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-35">
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[520px] h-[520px] rounded-full bg-gradient-to-b from-[#C49A45]/30 to-transparent blur-3xl" />
        <svg
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] text-[#A67B2C]/15 animate-spin"
          style={{ animationDuration: '90s' }}
          viewBox="0 0 100 100"
          fill="none"
          stroke="currentColor"
        >
          <circle cx="50" cy="50" r="48" strokeWidth="0.3" strokeDasharray="1.5 1.5" />
          <circle cx="50" cy="50" r="38" strokeWidth="0.25" />
          <circle cx="50" cy="50" r="28" strokeWidth="0.3" strokeDasharray="3 2" />
        </svg>
      </div>

      {/* Top Blessing Header */}
      <motion.div
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="relative z-10 pt-4 text-center"
      >
        <p className="font-serif text-xs sm:text-[13px] tracking-wider text-[#E8C77E] uppercase font-medium">
          {data.traditionBlessing}
        </p>
        <div className="mx-auto mt-2 flex items-center justify-center gap-2">
          <span className="h-[1px] w-8 bg-gradient-to-r from-transparent via-[#C49A45] to-transparent" />
          <Sparkles className="h-3 w-3 text-[#E8C77E]" />
          <span className="h-[1px] w-8 bg-gradient-to-r from-transparent via-[#C49A45] to-transparent" />
        </div>
      </motion.div>

      {/* Center Couple Identity & Wedding Announcement */}
      <motion.div
        initial={{ opacity: 0, scale: 0.94 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.9, delay: 0.2, ease: 'easeOut' }}
        className="relative z-10 flex flex-col items-center text-center my-auto px-4"
      >
        <h1 className="font-serif text-5xl sm:text-6xl font-normal tracking-tight text-[#FFF8ED] drop-shadow-md">
          {data.groom.name}
        </h1>
        <span className="font-serif italic text-2xl sm:text-3xl text-[#E8C77E] my-1 font-light">
          &amp;
        </span>
        <h1 className="font-serif text-5xl sm:text-6xl font-normal tracking-tight text-[#FFF8ED] drop-shadow-md">
          {data.bride.name}
        </h1>

        <div className="mt-4 flex items-center gap-2">
          <span className="h-[1px] w-10 bg-[#C49A45]/40" />
          <span className="h-1.5 w-1.5 rounded-full bg-[#E8C77E]" />
          <span className="h-[1px] w-10 bg-[#C49A45]/40" />
        </div>

        <p className="mt-4 font-serif text-xs sm:text-sm tracking-wide text-[#DFD3C0] font-light italic">
          invite you to celebrate their wedding
        </p>

        {/* Date Badge Pill */}
        <div className="mt-5 rounded-full border border-[#D5A953]/70 bg-[#143326]/80 px-5 py-2 shadow-inner">
          <p className="font-serif text-[11px] sm:text-xs font-semibold tracking-widest text-[#F8E7C0] uppercase">
            {data.weddingDate.formatted}
          </p>
        </div>

        <p className="mt-2.5 text-[12px] tracking-wide text-[#C7B9A2] font-normal">
          {data.primaryVenue.name}, {data.primaryVenue.city}
        </p>
      </motion.div>

      {/* Bottom Mor Pankh (Peacock Feather Fan) Arch & CONTINUE Button */}
      <div className="relative z-10 w-full flex flex-col items-center justify-end pb-2">
        {/* Peacock Fan Illustration Arch */}
        <div className="relative w-full h-36 sm:h-40 overflow-hidden flex items-end justify-center pointer-events-none">
          <Image
            src="/kashi_peacock_arch.jpg"
            alt="Traditional Indian Mor Pankh peacock fan artwork"
            width={562}
            height={260}
            className="w-full max-w-[420px] object-contain object-bottom drop-shadow-2xl"
            priority
          />
        </div>

        {/* Continue Button */}
        <motion.button
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.96 }}
          onClick={onContinue}
          className="relative -mt-6 z-20 flex items-center gap-2 rounded-full bg-gradient-to-r from-[#D7A74E] via-[#F3CE81] to-[#C99638] px-7 py-3 text-[#1C1408] font-serif text-xs sm:text-sm font-bold tracking-widest uppercase shadow-luxury hover:shadow-luxury-lg transition-all border border-[#FFF0CF]"
        >
          <span>Continue</span>
          <ChevronRight className="h-4 w-4 stroke-[2.5]" />
        </motion.button>
      </div>
    </div>
  );
};
