'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { RotateCcw, Share2, Heart, Check, Sparkles } from 'lucide-react';
import { KashiWeddingData } from '@/data/kashiTemplateData';

interface ClosingReplaySlideProps {
  data: KashiWeddingData;
  onReplay: () => void;
  onPrev: () => void;
}

export const ClosingReplaySlide: React.FC<ClosingReplaySlideProps> = ({
  data,
  onReplay,
  onPrev,
}) => {
  const [copied, setCopied] = useState(false);

  const handleShare = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <div className="relative flex h-full w-full flex-col items-center justify-between overflow-hidden bg-gradient-to-b from-[#14261D] via-[#0E1E16] to-[#06120C] text-[#FDFBF7] p-6 sm:p-8 select-none">
      {/* Background Sacred Geometric Lattice */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <svg width="100%" height="100%">
          <pattern id="close-lattice" x="0" y="0" width="48" height="48" patternUnits="userSpaceOnUse">
            <circle cx="24" cy="24" r="16" fill="none" stroke="#D5B064" strokeWidth="0.8" />
          </pattern>
          <rect width="100%" height="100%" fill="url(#close-lattice)" />
        </svg>
      </div>

      {/* Top Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="relative z-10 pt-4 text-center"
      >
        <button
          onClick={onPrev}
          className="text-[11px] font-serif tracking-widest text-[#D4AF67] hover:text-[#FFE3A8] uppercase transition-colors"
        >
          ← Previous Slide
        </button>
      </motion.div>

      {/* Center Heartfelt Gratitude & Replay CTA */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.15 }}
        className="relative z-10 w-full max-w-[360px] my-auto flex flex-col items-center text-center px-4"
      >
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#E8C77E]/10 border border-[#E8C77E]/30 mb-4">
          <Heart className="h-5 w-5 text-[#E8C77E] fill-[#E8C77E]/20" />
        </div>

        <h3 className="font-serif text-2xl sm:text-3xl font-normal leading-snug text-[#FFF8ED] text-balance">
          {data.closingMessage}
        </h3>

        <div className="my-5 flex items-center gap-2">
          <span className="h-[1px] w-10 bg-[#C49A45]/40" />
          <Sparkles className="h-3 w-3 text-[#E8C77E]" />
          <span className="h-[1px] w-10 bg-[#C49A45]/40" />
        </div>

        <p className="font-serif italic text-lg sm:text-xl text-[#E8C77E] font-light">
          With love, {data.groom.name} &amp; {data.bride.name}
        </p>

        {/* Watch Again Button */}
        <div className="mt-8 flex flex-col items-center gap-3 w-full">
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={onReplay}
            className="flex items-center justify-center gap-2 rounded-full border border-[#E8C77E]/60 bg-[#1A3326]/80 hover:bg-[#224433] px-6 py-2.5 text-[#FDFBF7] font-serif text-xs font-semibold tracking-wider uppercase shadow-md transition-all w-full max-w-[260px]"
          >
            <RotateCcw className="h-3.5 w-3.5 text-[#E8C77E]" />
            <span>Watch the invitation again</span>
          </motion.button>

          {/* Share Invitation Button */}
          <button
            onClick={handleShare}
            className="flex items-center justify-center gap-1.5 rounded-full text-[#D4AF67] hover:text-[#FFF] text-xs font-serif tracking-wide py-1 transition-colors"
          >
            {copied ? (
              <>
                <Check className="h-3.5 w-3.5 text-emerald-400" />
                <span className="text-emerald-400">Invitation link copied!</span>
              </>
            ) : (
              <>
                <Share2 className="h-3.5 w-3.5" />
                <span>Share this web page invitation</span>
              </>
            )}
          </button>
        </div>
      </motion.div>

      {/* Brand Footer */}
      <div className="relative z-10 w-full pt-4 pb-2 border-t border-[#E8C77E]/20 flex flex-col sm:flex-row items-center justify-between text-[11px] text-[#C4AB80] gap-2">
        <div className="flex items-center gap-1.5 font-serif">
          <span>Made with</span>
          <span className="font-bold text-[#F8E7C0]">Ink &amp; Ivory</span>
        </div>

        <Link
          href="/templates"
          className="text-[#E8C77E] hover:underline font-medium font-serif"
        >
          Create your own invitation →
        </Link>
      </div>
    </div>
  );
};
