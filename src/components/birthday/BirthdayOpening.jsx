'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Gift, Heart } from 'lucide-react';
import { GoldenParticles } from '@/components/common/GoldenParticles';

export function BirthdayOpening({ recipientName = 'Ananya', onOpen, onSkip }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.04 }}
      transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#FFF3EE] px-4 overflow-hidden select-none"
    >
      <GoldenParticles />

      {/* Subtle radial ambient blush glows */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#F4CFCA]/40 via-transparent to-[#F9E3DE]/30" />
      <div className="absolute w-[500px] h-[500px] rounded-full bg-[#E9CFA9]/20 blur-3xl pointer-events-none -top-24 -left-24 animate-pulse" />
      <div className="absolute w-[500px] h-[500px] rounded-full bg-[#F4CFCA]/30 blur-3xl pointer-events-none -bottom-24 -right-24 animate-pulse" />

      {/* Skip Button */}
      <button
        onClick={onSkip}
        className="absolute top-6 right-6 text-[11px] font-sans uppercase tracking-[0.22em] text-[#681C2C]/70 hover:text-[#681C2C] px-3.5 py-1.5 rounded-full border border-[#681C2C]/15 hover:border-[#681C2C]/40 bg-white/40 backdrop-blur-md transition-all duration-300 z-20 cursor-pointer"
      >
        Skip Opening
      </button>

      {/* Main Invitation Card Box */}
      <motion.div
        initial={{ y: 24, opacity: 0, scale: 0.96 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        transition={{ delay: 0.25, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 max-w-md w-full bg-[#FFFCF9]/90 backdrop-blur-xl border border-[#E9CFA9]/60 rounded-3xl p-8 sm:p-10 shadow-[0_20px_60px_-15px_rgba(104,28,44,0.12)] text-center flex flex-col items-center"
      >
        {/* Top Gold Ornament */}
        <div className="flex items-center justify-center gap-2 mb-6">
          <span className="w-10 h-[1px] bg-gradient-to-r from-transparent to-[#E9CFA9]" />
          <div className="w-7 h-7 rounded-full bg-[#FFF3EE] border border-[#E9CFA9] flex items-center justify-center text-[#B62A42] shadow-sm">
            <Gift className="w-3.5 h-3.5 animate-bounce" />
          </div>
          <span className="w-10 h-[1px] bg-gradient-to-l from-transparent to-[#E9CFA9]" />
        </div>

        {/* Small Teaser Tag */}
        <span className="text-[11px] font-sans font-medium uppercase tracking-[0.28em] text-[#B62A42] mb-3">
          You Are Mine &bull; Birthday Edition
        </span>

        {/* Heading */}
        <h2 className="text-3xl sm:text-4xl font-serif font-medium text-[#481321] leading-tight mb-3">
          Something Special Is Waiting For You...
        </h2>

        {/* Recipient note */}
        <p className="text-xs sm:text-sm text-[#51363A]/80 font-sans leading-relaxed mb-8 max-w-xs">
          A bespoke digital birthday surprise crafted with love, memories, and heartfelt wishes for{' '}
          <strong className="text-[#681C2C] font-semibold">{recipientName}</strong>.
        </p>

        {/* Glowing Gift Envelope Icon */}
        <motion.div
          animate={{ scale: [1, 1.05, 1], rotate: [0, 1.5, -1.5, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          className="relative w-20 h-20 rounded-2xl bg-gradient-to-tr from-[#FFF3EE] to-[#F9E3DE] border border-[#E9CFA9] flex items-center justify-center mb-8 shadow-inner"
        >
          <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-[#B62A42] to-[#681C2C] text-[#FFFCF9] flex items-center justify-center shadow-lg">
            <Heart className="w-6 h-6 fill-current animate-pulse text-[#FFFCF9]" />
          </div>
          <Sparkles className="w-4 h-4 text-[#E9CFA9] absolute -top-1 -right-1 animate-spin" style={{ animationDuration: '6s' }} />
        </motion.div>

        {/* Primary CTA Button */}
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.98 }}
          onClick={onOpen}
          className="w-full py-4 px-6 rounded-full bg-gradient-to-r from-[#681C2C] via-[#B62A42] to-[#681C2C] text-[#FFFCF9] font-sans font-medium text-sm tracking-wide shadow-[0_8px_25px_-5px_rgba(182,42,66,0.4)] hover:shadow-[0_12px_32px_-5px_rgba(182,42,66,0.6)] transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer group"
        >
          <span>Open Your Birthday Surprise</span>
          <span className="text-lg group-hover:translate-x-1 transition-transform">♡</span>
        </motion.button>

        <span className="text-[10px] text-[#51363A]/60 font-sans mt-4">
          Tap to unveil celebration with music &amp; memories
        </span>
      </motion.div>
    </motion.div>
  );
}
