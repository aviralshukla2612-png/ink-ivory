'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Heart, RotateCcw, Sparkles } from 'lucide-react';

export function FinalCelebration({
  heading = 'Happy Birthday, Ananya ♡',
  quote = 'Keep smiling, keep shining and keep being you.',
  senderName = 'Kabir',
  recipientName = 'Ananya',
  onReplay,
}) {
  const displayHeading = heading.replace('[Name]', recipientName);

  return (
    <footer className="py-24 sm:py-32 px-4 sm:px-6 relative overflow-hidden bg-[#FFF3EE] border-t border-[#E9CFA9]/40 text-center select-none">
      {/* Background Soft Blurs */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full max-w-2xl h-72 rounded-full bg-[#F4CFCA]/30 blur-3xl pointer-events-none" />

      <div className="max-w-2xl mx-auto relative z-10 flex flex-col items-center">
        
        {/* Heart Icon Badge */}
        <motion.div
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          className="w-14 h-14 rounded-full bg-gradient-to-tr from-[#681C2C] to-[#B62A42] border-2 border-[#E9CFA9] flex items-center justify-center text-[#FFFCF9] mb-6 shadow-md"
        >
          <Heart className="w-6 h-6 fill-current text-[#FFFCF9]" />
        </motion.div>

        {/* Final Heading */}
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-medium text-[#481321] leading-tight">
          {displayHeading}
        </h2>

        {/* Supporting Quote */}
        <p className="mt-3 text-base sm:text-lg text-[#51363A] font-serif italic max-w-md">
          &ldquo;{quote}&rdquo;
        </p>

        {/* Sender Note */}
        {senderName && (
          <div className="mt-6">
            <span className="text-xs uppercase tracking-[0.25em] text-[#B62A42] font-semibold block">
              Lovingly Designed For You
            </span>
            <span
              className="text-3xl sm:text-4xl text-[#681C2C] block mt-1"
              style={{ fontFamily: "'Allura', 'Great Vibes', cursive" }}
            >
              {senderName}
            </span>
          </div>
        )}

        {/* Replay Button */}
        {onReplay && (
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.98 }}
            onClick={onReplay}
            className="mt-10 px-6 py-3 rounded-full bg-[#FFFCF9] hover:bg-[#F9E3DE] border border-[#E9CFA9] text-[#681C2C] text-xs font-sans font-semibold tracking-wide shadow-sm hover:shadow-md transition-all flex items-center gap-2 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5 text-[#B62A42]" />
            <span>Replay Birthday Surprise</span>
          </motion.button>
        )}

        {/* Brandmark footer */}
        <div className="mt-14 pt-8 border-t border-[#F4CFCA]/80 w-full flex flex-col items-center">
          <span className="font-serif italic text-sm text-[#481321] font-semibold tracking-wider">
            You Are Mine &bull; Digital Stationery
          </span>
          <span className="text-[10px] text-[#51363A]/60 font-sans mt-1">
            Handcrafted with love for life&apos;s special milestones
          </span>
        </div>

      </div>
    </footer>
  );
}
