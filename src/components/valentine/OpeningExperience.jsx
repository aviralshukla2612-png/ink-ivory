'use client';

import React, { useState } from 'react';
import { Heart, Sparkles, MailOpen } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const OpeningExperience = ({ onOpen, onSkip, recipientName = "Riya" }) => {
  const [isOpening, setIsOpening] = useState(false);

  const handleStart = () => {
    setIsOpening(true);
    setTimeout(() => {
      onOpen();
    }, 850);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.05 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-b from-[#FFF4F0] via-[#FBE7E3] to-[#F6D3D0] p-4 overflow-hidden select-none"
    >
      {/* Decorative ambient glowing circles */}
      <div className="absolute w-[500px] h-[500px] rounded-full bg-gradient-to-tr from-[#E9A7A9]/30 to-[#F6D3D0]/20 blur-3xl pointer-events-none -top-20 -left-20" />
      <div className="absolute w-[500px] h-[500px] rounded-full bg-gradient-to-bl from-[#B51F3B]/10 to-transparent blur-3xl pointer-events-none -bottom-20 -right-20" />

      {/* Skip Button in Top Right */}
      <button
        onClick={onSkip}
        className="absolute top-6 right-6 text-xs uppercase tracking-widest font-sans font-semibold text-[#641D2B]/60 hover:text-[#641D2B] bg-white/40 hover:bg-white/80 border border-[#641D2B]/15 px-4 py-2 rounded-full backdrop-blur-sm transition-all"
      >
        Skip Intro ✕
      </button>

      {/* Center Interactive Envelope & Love Letter Card */}
      <div className="max-w-md w-full text-center relative z-10 flex flex-col items-center">
        {/* Pulsing Sacred Heart Medallion */}
        <motion.div
          animate={{ scale: [1, 1.08, 1] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
          className="w-20 h-20 rounded-full bg-gradient-to-br from-[#B51F3B] to-[#641D2B] flex items-center justify-center text-white shadow-xl shadow-[#B51F3B]/25 mb-6 border-2 border-[#FFFCFA]"
        >
          <Heart className="w-10 h-10 fill-current" />
        </motion.div>

        {/* Delicate Handwritten Greeting */}
        <span className="font-['Allura',cursive] text-3xl sm:text-4xl text-[#B51F3B] mb-2 block">
          Dearest {recipientName},
        </span>

        {/* Main Anticipation Eyebrow & Title */}
        <p className="text-xs tracking-[0.3em] font-sans font-bold uppercase text-[#641D2B]/75 mb-3">
          AN YOU ARE MINE ROMANTIC PROPOSAL
        </p>

        <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl text-[#641D2B] font-bold leading-tight mb-4">
          Someone has a very special question for you...
        </h1>

        <p className="font-serif italic text-base sm:text-lg text-[#4B3035]/80 max-w-sm mb-8 leading-relaxed">
          A sealed digital love letter waiting to be opened with all the tenderness in the world.
        </p>

        {/* Interactive Open Invitation Button */}
        <motion.button
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleStart}
          disabled={isOpening}
          className="relative group overflow-hidden px-8 py-4 rounded-full bg-gradient-to-r from-[#B51F3B] via-[#C42A45] to-[#641D2B] text-white font-sans font-bold text-sm sm:text-base tracking-wider uppercase shadow-xl shadow-[#B51F3B]/35 flex items-center gap-3 transition-all"
        >
          {/* Continuous metallic light shine effect */}
          <span className="absolute top-0 -left-[100%] w-1/2 h-full bg-gradient-to-r from-transparent via-white/40 to-transparent skew-x-12 group-hover:animate-none animate-[shine_3s_infinite]" />
          <MailOpen className="w-5 h-5 text-[#F6D3D0]" />
          <span>Open My Love Letter</span>
          <Sparkles className="w-4 h-4 text-[#F6D3D0]" />
        </motion.button>

        {/* Bottom subtle note */}
        <span className="text-[11px] font-sans text-[#641D2B]/50 tracking-wider uppercase mt-6">
          Press to begin the music &amp; experience ♡
        </span>
      </div>
    </motion.div>
  );
};
