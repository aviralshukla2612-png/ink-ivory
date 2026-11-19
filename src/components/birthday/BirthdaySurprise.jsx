'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Gift, Sparkles, Heart, Star } from 'lucide-react';
import { BirthdayConfetti } from '@/components/common/BirthdayConfetti';

export function BirthdaySurprise({
  heading = 'Ready For Your Surprise?',
  subtext = 'Tap the golden ribbon to unwrap your special gift',
  buttonText = 'Open Gift ♡',
  surpriseHeading = 'YOU DESERVE ALL THE HAPPINESS IN THE WORLD!',
  surpriseMessage = 'May this year be your most beautiful, inspiring, and magical chapter yet. Keep shining bright!',
  recipientName = 'Ananya',
  senderName = 'Kabir',
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  const handleOpenGift = () => {
    setIsOpen(true);
    setShowConfetti(true);
  };

  return (
    <section id="surprise" className="py-20 sm:py-28 px-4 sm:px-6 relative overflow-hidden bg-[#F9E3DE]/40">
      {/* Confetti Trigger */}
      <BirthdayConfetti active={showConfetti} onComplete={() => setShowConfetti(false)} />

      {/* Ambient Glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-[#E9CFA9]/30 blur-3xl pointer-events-none" />

      <div className="max-w-3xl mx-auto relative z-10 text-center">
        
        {/* Header */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/70 border border-[#E9CFA9] text-[#B62A42] text-[10px] font-sans font-semibold uppercase tracking-[0.25em] mb-3">
          <Gift className="w-3 h-3" />
          <span>Interactive Surprise</span>
        </div>

        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-medium text-[#481321]">
          {heading}
        </h2>

        <p className="font-serif italic text-base sm:text-lg text-[#681C2C]/80 mt-2 max-w-md mx-auto">
          {subtext}
        </p>

        {/* Gift Box Container */}
        <div className="mt-12 flex justify-center">
          <div className="relative w-full max-w-md">
            {!isOpen ? (
              /* CLOSED 3D GIFT BOX */
              <motion.div
                whileHover={{ scale: 1.04, y: -4 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleOpenGift}
                className="relative mx-auto w-64 h-64 sm:w-72 sm:h-72 rounded-3xl bg-gradient-to-tr from-[#681C2C] via-[#B62A42] to-[#681C2C] shadow-[0_25px_60px_rgba(104,28,44,0.35)] p-6 flex flex-col items-center justify-center cursor-pointer group select-none border-2 border-[#E9CFA9]"
              >
                {/* Horizontal & Vertical Gold Ribbons */}
                <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-10 bg-gradient-to-r from-[#D9A441] via-[#E9CFA9] to-[#D9A441] shadow-md border-x border-[#FFFDF7]/40" />
                <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-10 bg-gradient-to-b from-[#D9A441] via-[#E9CFA9] to-[#D9A441] shadow-md border-y border-[#FFFDF7]/40" />

                {/* Ribbon Bow on Top */}
                <motion.div
                  animate={{ scale: [1, 1.1, 1], rotate: [0, 4, -4, 0] }}
                  transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                  className="relative z-20 w-16 h-16 rounded-full bg-[#E9CFA9] border-2 border-[#FFFDF7] flex items-center justify-center text-[#681C2C] shadow-lg group-hover:scale-115 transition-transform"
                >
                  <Sparkles className="w-8 h-8 text-[#681C2C]" />
                </motion.div>

                {/* Floating Tag */}
                <div className="relative z-20 mt-6 px-4 py-1.5 rounded-full bg-white/90 backdrop-blur-sm border border-[#E9CFA9] text-[#681C2C] text-xs font-sans font-bold shadow-md">
                  {buttonText}
                </div>
              </motion.div>
            ) : (
              /* REVEALED SURPRISE CELEBRATION CARD */
              <motion.div
                initial={{ opacity: 0, scale: 0.85, y: 30 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                className="relative rounded-3xl bg-gradient-to-b from-[#FFFCF9] to-[#FFF3EE] border-2 border-[#E9CFA9] p-8 sm:p-12 shadow-[0_25px_60px_rgba(104,28,44,0.18)] text-center overflow-hidden"
              >
                {/* Bursting Glow */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-48 rounded-full bg-[#E9CFA9]/40 blur-2xl pointer-events-none" />

                {/* Golden Badge Icon */}
                <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-[#681C2C] to-[#B62A42] border-2 border-[#E9CFA9] flex items-center justify-center text-white mx-auto mb-6 shadow-lg animate-bounce">
                  <Star className="w-8 h-8 fill-[#E9CFA9] text-[#E9CFA9]" />
                </div>

                <span className="text-xs uppercase tracking-[0.28em] text-[#B62A42] font-sans font-semibold">
                  A Special Birthday Revelation
                </span>

                {/* Surprise Main Heading */}
                <h3 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold text-[#481321] leading-tight mt-3 mb-4">
                  {surpriseHeading}
                </h3>

                {/* Message */}
                <p className="text-sm sm:text-base text-[#51363A] font-serif leading-relaxed max-w-md mx-auto">
                  {surpriseMessage}
                </p>

                <div className="mt-8 pt-6 border-t border-[#F4CFCA] flex flex-col sm:flex-row items-center justify-between gap-4">
                  <span className="font-serif italic text-sm text-[#681C2C]">
                    For our radiant {recipientName} &bull; With love from {senderName}
                  </span>
                  <button
                    onClick={() => {
                      setShowConfetti(true);
                    }}
                    className="px-4 py-2 rounded-full bg-[#FFF3EE] hover:bg-[#F9E3DE] border border-[#E9CFA9] text-xs font-sans font-semibold text-[#681C2C] flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-[#B62A42]" />
                    <span>Launch Confetti Again</span>
                  </button>
                </div>
              </motion.div>
            )}
          </div>
        </div>

      </div>
    </section>
  );
}
