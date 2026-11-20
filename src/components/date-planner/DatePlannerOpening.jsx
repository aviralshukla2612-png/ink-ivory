'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Heart, Sparkles, CalendarHeart } from 'lucide-react';
import { RosePetals } from '@/components/common/RosePetals';

export default function DatePlannerOpening({ recipientName = 'Riya', onOpen, onSkip }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.05 }}
      transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#FFF2ED] px-4 overflow-hidden select-none"
    >
      <RosePetals count={26} />

      {/* Warm Ambient Romantic Radial Glows */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#F3D0C9]/45 via-transparent to-[#F9E4DE]/40" />
      <div className="absolute w-[500px] h-[500px] rounded-full bg-[#E7A5A4]/20 blur-3xl pointer-events-none -top-24 -left-24 animate-pulse" />
      <div className="absolute w-[500px] h-[500px] rounded-full bg-[#F3D0C9]/30 blur-3xl pointer-events-none -bottom-24 -right-24 animate-pulse" />

      {/* Skip Button */}
      <button
        onClick={onSkip}
        className="absolute top-6 right-6 text-[11px] font-sans uppercase tracking-[0.22em] text-[#641A2A]/70 hover:text-[#641A2A] px-3.5 py-1.5 rounded-full border border-[#641A2A]/15 hover:border-[#641A2A]/40 bg-white/50 backdrop-blur-md transition-all duration-300 z-20 cursor-pointer"
      >
        Skip Opening
      </button>

      {/* Main Luxury Opening Card */}
      <motion.div
        initial={{ y: 28, opacity: 0, scale: 0.95 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        transition={{ delay: 0.25, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 max-w-md w-full bg-[#FFF9F4]/95 backdrop-blur-xl border border-[#F3D0C9] rounded-3xl p-8 sm:p-10 shadow-[0_20px_60px_-15px_rgba(100,26,42,0.14)] text-center flex flex-col items-center"
      >
        {/* Top Heart Badge Accent */}
        <div className="flex items-center justify-center gap-2 mb-6">
          <span className="w-10 h-[1px] bg-gradient-to-r from-transparent to-[#B51F3B]" />
          <div className="w-8 h-8 rounded-full bg-[#FFF2ED] border border-[#F3D0C9] flex items-center justify-center text-[#B51F3B] shadow-sm">
            <CalendarHeart className="w-4 h-4 animate-bounce" />
          </div>
          <span className="w-10 h-[1px] bg-gradient-to-l from-transparent to-[#B51F3B]" />
        </div>

        {/* Small Brand Pill */}
        <span className="text-[11px] font-sans font-medium uppercase tracking-[0.28em] text-[#B51F3B] mb-3">
          You Are Mine &bull; Date Invitation
        </span>

        {/* Main Heading */}
        <h2 className="text-3xl sm:text-4xl font-serif font-medium text-[#45121F] leading-tight mb-3">
          Someone wants to plan something special with you...
        </h2>

        {/* Subtitle */}
        <p className="text-xs sm:text-sm text-[#50363A]/80 font-sans leading-relaxed mb-8 max-w-xs">
          Let&apos;s create our perfect date together, tailored exclusively to what makes you smile most,{' '}
          <strong className="text-[#641A2A] font-semibold">{recipientName}</strong>.
        </p>

        {/* Glowing Heart Envelope Graphic */}
        <motion.div
          animate={{ scale: [1, 1.06, 1], rotate: [0, 2, -2, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          className="relative w-20 h-20 rounded-2xl bg-gradient-to-tr from-[#FFF2ED] to-[#F9E4DE] border border-[#F3D0C9] flex items-center justify-center mb-8 shadow-inner"
        >
          <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-[#B51F3B] to-[#641A2A] text-[#FFF9F4] flex items-center justify-center shadow-lg">
            <Heart className="w-6 h-6 fill-current animate-pulse text-[#FFF9F4]" />
          </div>
          <Sparkles className="w-4 h-4 text-[#D9A441] absolute -top-1 -right-1 animate-spin" style={{ animationDuration: '6s' }} />
        </motion.div>

        {/* Primary CTA Button */}
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.98 }}
          onClick={onOpen}
          className="w-full py-4 px-6 rounded-full bg-gradient-to-r from-[#641A2A] via-[#B51F3B] to-[#641A2A] text-[#FFF9F4] font-sans font-medium text-sm tracking-wide shadow-[0_10px_28px_-6px_rgba(181,31,59,0.45)] hover:shadow-[0_14px_36px_-6px_rgba(181,31,59,0.65)] transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer group"
        >
          <span>Plan Our Date</span>
          <span className="text-lg group-hover:translate-x-1 transition-transform">♡</span>
        </motion.button>

        <span className="text-[10px] text-[#50363A]/60 font-sans mt-4">
          Tap to begin interactive date planning
        </span>
      </motion.div>
    </motion.div>
  );
}
