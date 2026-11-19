'use client';

import React, { useState } from 'react';
import { Heart, Mail, Sparkles, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const LoveLetter = ({ letterData, recipientName = "Riya" }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <section id="love-letter" className="py-24 px-4 sm:px-6 bg-[#FBE7E3]/50 relative overflow-hidden">
      <div className="max-w-4xl mx-auto relative z-10">
        {/* Section Heading */}
        <div className="text-center max-w-xl mx-auto mb-16">
          <p className="text-xs font-sans font-bold tracking-[0.3em] uppercase text-[#B51F3B] mb-3">
            {letterData.eyebrow || "A LITTLE NOTE"}
          </p>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl text-[#641D2B] font-bold tracking-tight mb-4">
            Words Straight From My Heart
          </h2>
          <div className="flex items-center justify-center gap-3 my-4 text-[#E9A7A9]">
            <span className="w-12 h-px bg-current"></span>
            <Heart className="w-4 h-4 fill-[#B51F3B] text-[#B51F3B]" />
            <span className="w-12 h-px bg-current"></span>
          </div>
          <p className="font-serif italic text-base sm:text-lg text-[#4B3035]/80">
            Click on the envelope to unseal and read what I wrote for you.
          </p>
        </div>

        {/* Interactive Envelope Container */}
        <div className="max-w-2xl mx-auto">
          {!isOpen ? (
            /* SEALED ENVELOPE */
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setIsOpen(true)}
              className="relative cursor-pointer bg-gradient-to-b from-[#FFFDF9] to-[#F8F0E5] rounded-3xl p-8 sm:p-12 border-2 border-[#EAD5BE] shadow-2xl shadow-[#641D2B]/15 flex flex-col items-center justify-center text-center group transition-all"
              style={{ minHeight: '360px' }}
            >
              {/* Envelope Flap Triangle Contour in SVG */}
              <div className="absolute top-0 left-0 right-0 h-40 overflow-hidden pointer-events-none">
                <svg viewBox="0 0 400 160" preserveAspectRatio="none" className="w-full h-full opacity-30">
                  <path d="M0 0 L200 140 L400 0 Z" fill="#EAD5BE" stroke="#D3B89D" strokeWidth="1" />
                </svg>
              </div>

              {/* Burgundy Wax Seal */}
              <div className="relative z-10 mb-6 group-hover:scale-110 transition-transform duration-300">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#8A2038] via-[#641D2B] to-[#45121F] border-2 border-[#FFFCFA] shadow-xl shadow-[#641D2B]/40 flex items-center justify-center text-[#FFFCFA] relative">
                  <Heart className="w-9 h-9 fill-current" />
                  <span className="absolute -bottom-1 text-[9px] uppercase tracking-widest font-sans font-bold text-[#E9A7A9]">
                    SEALED
                  </span>
                </div>
              </div>

              {/* Envelope Front Typography */}
              <div className="relative z-10">
                <span className="text-xs uppercase tracking-[0.3em] font-sans font-bold text-[#B51F3B] block mb-2">
                  CONFIDENTIAL &amp; WITH LOVE
                </span>
                <p className="font-['Allura',cursive] text-3xl sm:text-4xl text-[#641D2B] mb-2">
                  To: Dearest {recipientName}
                </p>
                <p className="font-serif italic text-sm sm:text-base text-[#4B3035]/70">
                  Tap to break the wax seal &amp; unfold
                </p>
              </div>

              {/* Hint badge */}
              <div className="mt-8 inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/70 border border-[#F6D3D0] text-xs font-sans font-semibold text-[#B51F3B]">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Click To Read Love Letter</span>
              </div>
            </motion.div>
          ) : (
            /* UNFOLDED LOVE LETTER */
            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="bg-[#FFFDF9] rounded-3xl p-8 sm:p-14 border border-[#EAD5BE] shadow-2xl shadow-[#641D2B]/10 relative"
            >
              {/* Subtle stationery lines texture */}
              <div className="absolute inset-0 bg-[radial-gradient(#EAD5BE_1px,transparent_1px)] [background-size:24px_24px] opacity-25 rounded-3xl pointer-events-none" />

              {/* Close / Re-seal toggle */}
              <button
                onClick={() => setIsOpen(false)}
                className="absolute top-6 right-6 text-xs uppercase tracking-widest font-sans font-semibold text-[#641D2B]/60 hover:text-[#B51F3B] bg-[#FFF4F0] px-3.5 py-1.5 rounded-full border border-[#F6D3D0] transition-colors"
              >
                Close Letter ✕
              </button>

              <div className="relative z-10">
                {/* Letter Header */}
                <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 border-b border-[#F6D3D0]/60 pb-6 mb-8">
                  <h3 className="font-serif text-3xl sm:text-4xl text-[#641D2B] font-bold">
                    {letterData.heading}
                  </h3>
                  <span className="font-serif italic text-sm text-[#B51F3B]">
                    {letterData.date || "February 14, 2026"}
                  </span>
                </div>

                {/* Letter Body Paragraphs */}
                <div className="space-y-6 font-serif text-lg sm:text-xl text-[#4B3035] leading-relaxed">
                  {letterData.paragraphs.map((paragraph, index) => (
                    <p key={index} className="leading-relaxed">
                      {paragraph}
                    </p>
                  ))}
                </div>

                {/* Handwritten Sign-off */}
                <div className="mt-12 pt-6 border-t border-[#F6D3D0]/60">
                  <p className="font-serif italic text-base text-[#4B3035]/80 mb-2">
                    {letterData.signOff}
                  </p>
                  <p className="font-['Allura',cursive] text-4xl sm:text-5xl text-[#B51F3B] tracking-wide">
                    {letterData.senderSignature}
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
};
