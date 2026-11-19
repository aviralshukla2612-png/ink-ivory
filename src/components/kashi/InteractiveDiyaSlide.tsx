'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Flame, ChevronLeft, ChevronRight } from 'lucide-react';
import { KashiWeddingData } from '@/data/kashiTemplateData';

interface InteractiveDiyaSlideProps {
  data: KashiWeddingData;
  onNext: () => void;
  onPrev: () => void;
}

export const InteractiveDiyaSlide: React.FC<InteractiveDiyaSlideProps> = ({
  data,
  onNext,
  onPrev,
}) => {
  const [isLit, setIsLit] = useState<boolean>(false);
  const [blessingsCount, setBlessingsCount] = useState<number>(142);

  const handleLightLamp = () => {
    if (!isLit) {
      setIsLit(true);
      setBlessingsCount((prev) => prev + 1);
    }
  };

  return (
    <div className="relative flex h-full w-full flex-col items-center justify-between overflow-hidden bg-gradient-to-b from-[#10241A] via-[#0C1E15] to-[#06130C] text-[#FDFBF7] p-6 sm:p-8 select-none">
      {/* Background Sacred Geometric Mandala */}
      <div className="absolute inset-0 opacity-15 pointer-events-none">
        <svg width="100%" height="100%">
          <pattern id="diya-mandala" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
            <circle cx="30" cy="30" r="22" fill="none" stroke="#E2B768" strokeWidth="0.8" />
            <circle cx="30" cy="30" r="14" fill="none" stroke="#E2B768" strokeWidth="0.6" strokeDasharray="2 2" />
          </pattern>
          <rect width="100%" height="100%" fill="url(#diya-mandala)" />
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

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="relative z-10 pt-2 text-center"
      >
        <p className="font-serif text-[11px] sm:text-xs tracking-widest text-[#E5C37A] uppercase font-semibold">
          With the blessings of our elders
        </p>
        <h2 className="font-serif text-2xl sm:text-3xl font-normal text-[#FFF8ED] mt-0.5 tracking-tight">
          {data.traditionBlessing}
        </h2>
        <div className="mx-auto mt-2 flex items-center justify-center gap-2">
          <span className="h-[1px] w-8 bg-[#C49A45]/50" />
          <Flame className="h-3 w-3 text-[#FFB347]" />
          <span className="h-[1px] w-8 bg-[#C49A45]/50" />
        </div>
      </motion.div>

      {/* Center Interactive Samai Lamp & Glowing Diyas */}
      <div className="relative z-10 my-auto flex flex-col items-center justify-center">
        {/* Clickable Samai Lamp Area */}
        <div
          onClick={handleLightLamp}
          className="relative cursor-pointer group flex flex-col items-center transition-transform hover:scale-102 active:scale-98"
          title="Click to light the holy lamp"
        >
          {/* Radial Light Bloom Glow when lit */}
          <div
            className={`absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 rounded-full pointer-events-none transition-all duration-1000 ${
              isLit
                ? 'bg-radial from-[#FFB347]/45 via-[#E28723]/25 to-transparent blur-2xl scale-110 opacity-100'
                : 'bg-radial from-[#FFB347]/10 to-transparent blur-xl opacity-40 group-hover:opacity-75'
            }`}
          />

          {/* Samai Lamp Artwork */}
          <div className="relative w-64 h-72 sm:w-72 sm:h-80 select-none">
            <Image
              src="/kashi_samai_lamp.jpg"
              alt="Sacred Indian Brass Samai Oil Lamp"
              fill
              sizes="320px"
              className="object-contain object-center drop-shadow-2xl"
              priority
            />

            {/* Dynamic Flickering Golden Flames Overlay on the wicks */}
            {isLit && (
              <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="absolute inset-0 pointer-events-none"
              >
                {/* Center top tall wick flame */}
                <div className="absolute top-[28%] left-[49.5%] -translate-x-1/2 w-4 h-6 rounded-full bg-gradient-to-t from-[#FF9800] via-[#FFD54F] to-[#FFFFFF] animate-pulse blur-[1px] shadow-[0_0_15px_#FFA726]" />

                {/* Left wick flame */}
                <div className="absolute top-[34%] left-[36%] w-3 h-5 rounded-full bg-gradient-to-t from-[#FF9800] via-[#FFD54F] to-[#FFFFFF] animate-pulse blur-[0.8px] shadow-[0_0_12px_#FFA726]" />
                {/* Mid-left wick flame */}
                <div className="absolute top-[35%] left-[42.5%] w-3 h-5 rounded-full bg-gradient-to-t from-[#FF9800] via-[#FFD54F] to-[#FFFFFF] animate-pulse blur-[0.8px] shadow-[0_0_12px_#FFA726]" />
                {/* Mid-right wick flame */}
                <div className="absolute top-[35%] right-[42.5%] w-3 h-5 rounded-full bg-gradient-to-t from-[#FF9800] via-[#FFD54F] to-[#FFFFFF] animate-pulse blur-[0.8px] shadow-[0_0_12px_#FFA726]" />
                {/* Right wick flame */}
                <div className="absolute top-[34%] right-[36%] w-3 h-5 rounded-full bg-gradient-to-t from-[#FF9800] via-[#FFD54F] to-[#FFFFFF] animate-pulse blur-[0.8px] shadow-[0_0_12px_#FFA726]" />

                {/* Base diyas glow enhancement */}
                <div className="absolute bottom-[27%] left-[13%] w-4 h-4 rounded-full bg-[#FFD54F]/80 animate-ping blur-[1px]" />
                <div className="absolute bottom-[25%] left-[34%] w-4 h-4 rounded-full bg-[#FFD54F]/80 animate-ping blur-[1px] delay-100" />
                <div className="absolute bottom-[25%] right-[34%] w-4 h-4 rounded-full bg-[#FFD54F]/80 animate-ping blur-[1px] delay-200" />
                <div className="absolute bottom-[27%] right-[13%] w-4 h-4 rounded-full bg-[#FFD54F]/80 animate-ping blur-[1px] delay-75" />
              </motion.div>
            )}
          </div>

          {/* Prompt or Gratitude Message */}
          <div className="mt-2 text-center min-h-[48px] flex flex-col items-center justify-center">
            <AnimatePresence mode="wait">
              {isLit ? (
                <motion.div
                  key="lit-state"
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="flex flex-col items-center"
                >
                  <p className="font-serif text-sm sm:text-base font-medium text-[#FFECC7]">
                    Thank you. Your lamp is lit for {data.groom.name} &amp; {data.bride.name}.
                  </p>
                  <p className="text-[11px] text-[#D8B675] mt-0.5 font-light">
                    {blessingsCount} lamps lit with love and blessings today
                  </p>
                </motion.div>
              ) : (
                <motion.div
                  key="unlit-state"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex flex-col items-center"
                >
                  <button
                    onClick={handleLightLamp}
                    className="flex items-center gap-2 rounded-full bg-gradient-to-r from-[#D7A74E] via-[#F3CE81] to-[#C99638] px-5 py-2 text-[#1C1408] font-serif text-xs font-bold tracking-wider uppercase shadow-lg hover:brightness-110 active:scale-95 transition-all"
                  >
                    <Flame className="h-3.5 w-3.5 fill-[#1C1408]" />
                    <span>Tap to light holy lamp</span>
                  </button>
                  <p className="text-[10.5px] text-[#C4AB80] mt-1.5 font-light">
                    Send your warmest prayers to the couple
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Bottom hint */}
      <div className="relative z-10 w-full text-center pb-2">
        <p className="text-[10px] tracking-widest text-[#B59C73] uppercase font-light">
          Swipe or tap arrows to view closing note
        </p>
      </div>
    </div>
  );
};
