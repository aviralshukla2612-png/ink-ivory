'use client';

import React from 'react';
import { Heart, Sparkles, ArrowDown, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const YesCelebration = ({ isOpen, onClose, onExplore, data }) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md p-4"
      >
        {/* Modal Card */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.8, opacity: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="relative max-w-lg w-full bg-gradient-to-b from-[#FFFCFA] to-[#FFF4F0] border-2 border-[#E9A7A9] rounded-3xl p-8 sm:p-10 text-center shadow-2xl shadow-[#B51F3B]/30 flex flex-col items-center"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-5 right-5 text-[#641D2B]/50 hover:text-[#641D2B] p-1 rounded-full transition-colors"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Celebration Heart Icon with Floating Sparkles */}
          <div className="relative mb-6">
            <motion.div
              animate={{ scale: [1, 1.15, 1] }}
              transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
              className="w-24 h-24 rounded-full bg-gradient-to-br from-[#B51F3B] to-[#641D2B] flex items-center justify-center text-white shadow-xl shadow-[#B51F3B]/40 border-4 border-white"
            >
              <Heart className="w-12 h-12 fill-current" />
            </motion.div>
            <Sparkles className="absolute -top-2 -right-2 w-7 h-7 text-[#D9A521] animate-spin-slow" />
            <Sparkles className="absolute -bottom-2 -left-2 w-6 h-6 text-[#B51F3B] animate-pulse" />
          </div>

          {/* Small Eyebrow */}
          <p className="text-xs font-sans font-bold tracking-[0.3em] uppercase text-[#B51F3B] mb-2">
            SHE SAID YES! 💕
          </p>

          {/* Headline */}
          <h2 className="font-serif text-3xl sm:text-4xl text-[#641D2B] font-bold leading-tight mb-4">
            {data.proposal.successHeadline}
          </h2>

          {/* Supporting Text */}
          <p className="font-serif italic text-base sm:text-lg text-[#4B3035]/85 leading-relaxed mb-8 max-w-md">
            &ldquo;{data.proposal.successSupporting}&rdquo;
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center gap-3 w-full justify-center">
            <button
              onClick={() => {
                onClose();
                if (onExplore) onExplore();
              }}
              className="w-full sm:w-auto px-7 py-3.5 rounded-full bg-gradient-to-r from-[#B51F3B] to-[#641D2B] text-white font-sans font-bold text-sm tracking-wider uppercase shadow-lg shadow-[#B51F3B]/30 flex items-center justify-center gap-2 hover:brightness-110 transition-all"
            >
              <span>{data.proposal.exploreButtonText}</span>
              <ArrowDown className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="w-full sm:w-auto px-6 py-3.5 rounded-full bg-white/80 hover:bg-white text-[#641D2B] border border-[#F6D3D0] font-sans font-semibold text-sm transition-colors"
            >
              Stay on Question
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
