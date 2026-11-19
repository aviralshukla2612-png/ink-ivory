'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Heart } from 'lucide-react';
import { KashiWeddingData } from '@/data/kashiTemplateData';

interface FamilyLineageSlideProps {
  data: KashiWeddingData;
  onNext: () => void;
  onPrev: () => void;
}

export const FamilyLineageSlide: React.FC<FamilyLineageSlideProps> = ({ data, onNext, onPrev }) => {
  return (
    <div className="relative flex h-full w-full flex-col items-center justify-between overflow-hidden bg-gradient-to-b from-[#F9F4EB] via-[#F1E6D3] to-[#E6D8BF] text-[#332214] p-6 sm:p-8 select-none">
      {/* Background Sacred Geometric Lattice */}
      <div className="absolute inset-0 opacity-[0.06] pointer-events-none">
        <svg width="100%" height="100%">
          <pattern id="fam-lattice" x="0" y="0" width="36" height="36" patternUnits="userSpaceOnUse">
            <path d="M18 0 L36 18 L18 36 L0 18 Z" fill="none" stroke="#633C14" strokeWidth="1" />
          </pattern>
          <rect width="100%" height="100%" fill="url(#fam-lattice)" />
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
          Together With Our Families
        </p>
        <h2 className="font-serif text-3xl sm:text-4xl font-normal text-[#2C190D] mt-0.5 tracking-tight">
          The Parivaar
        </h2>
        <div className="mx-auto mt-2 flex items-center justify-center gap-2">
          <span className="h-[1px] w-10 bg-[#B58C45]/50" />
          <span className="h-1.5 w-1.5 rounded-full bg-[#B58C45]" />
          <span className="h-[1px] w-10 bg-[#B58C45]/50" />
        </div>
      </motion.div>

      {/* Lineage Details Container */}
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.15 }}
        className="relative z-10 w-full max-w-[340px] my-auto flex flex-col items-center text-center gap-3.5 px-3 py-2"
      >
        {/* Groom Lineage */}
        <div className="flex flex-col items-center">
          <p className="font-serif text-xs font-bold tracking-widest text-[#8C5D23] uppercase">
            {data.groom.name}
          </p>
          <p className="font-serif text-[11px] text-[#7A6148] italic font-light">Son of</p>
          <p className="font-serif text-base font-medium text-[#2C190D] leading-snug">
            {data.groom.mother} &amp; {data.groom.father}
          </p>
          <p className="font-serif text-[10.5px] tracking-wider text-[#8C6D4C] uppercase mt-0.5">
            {data.groom.city}
          </p>
        </div>

        {/* Divider dot */}
        <div className="flex items-center gap-2">
          <span className="h-[1px] w-8 bg-[#C49A45]/40" />
          <span className="h-1 w-1 rounded-full bg-[#C49A45]" />
          <span className="h-[1px] w-8 bg-[#C49A45]/40" />
        </div>

        {/* Bride Lineage */}
        <div className="flex flex-col items-center">
          <p className="font-serif text-xs font-bold tracking-widest text-[#8C5D23] uppercase">
            {data.bride.name}
          </p>
          <p className="font-serif text-[11px] text-[#7A6148] italic font-light">Daughter of</p>
          <p className="font-serif text-base font-medium text-[#2C190D] leading-snug">
            {data.bride.mother} &amp; {data.bride.father}
          </p>
          <p className="font-serif text-[10.5px] tracking-wider text-[#8C6D4C] uppercase mt-0.5">
            {data.bride.city}
          </p>
        </div>

        {/* Divider dot */}
        <div className="flex items-center gap-2">
          <span className="h-[1px] w-8 bg-[#C49A45]/40" />
          <span className="h-1 w-1 rounded-full bg-[#C49A45]" />
          <span className="h-[1px] w-8 bg-[#C49A45]/40" />
        </div>

        {/* In Loving Memory */}
        {data.inLovingMemoryOf.length > 0 && (
          <div className="flex flex-col items-center">
            <p className="font-serif text-[10.5px] font-semibold tracking-widest text-[#9C5821] uppercase">
              In Loving Memory Of
            </p>
            {data.inLovingMemoryOf.map((ancestor, i) => (
              <p key={i} className="font-serif text-[14.5px] font-medium text-[#382315] mt-0.5">
                {ancestor}
              </p>
            ))}
          </div>
        )}

        {/* Divider dot */}
        <div className="flex items-center gap-2">
          <span className="h-[1px] w-8 bg-[#C49A45]/40" />
          <span className="h-1 w-1 rounded-full bg-[#C49A45]" />
          <span className="h-[1px] w-8 bg-[#C49A45]/40" />
        </div>

        {/* Hosted By */}
        <div className="flex flex-col items-center">
          <p className="font-serif text-[10.5px] font-semibold tracking-widest text-[#8C5D23] uppercase">
            Hosted By
          </p>
          <p className="font-serif text-base font-medium text-[#2C190D] mt-0.5">
            {data.hostedBy}
          </p>
        </div>
      </motion.div>

      {/* Bottom Hint */}
      <div className="relative z-10 w-full text-center pb-2">
        <p className="text-[10px] tracking-widest text-[#8C6D4C] uppercase font-light">
          Swipe or tap arrows to send your blessings
        </p>
      </div>
    </div>
  );
};
