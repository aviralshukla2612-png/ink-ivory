'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Sparkles, Heart } from 'lucide-react';

export function BirthdayLetter({
  heading = 'A Little Note For You',
  prompt = 'Open Your Letter ♡',
  paragraphs = [],
  recipientName = 'Ananya',
  senderName = 'Kabir',
}) {
  const [isOpen, setIsOpen] = useState(false);

  const defaultParagraphs = [
    `Dear ${recipientName},`,
    'Today is all about celebrating you.',
    'I hope your life is always filled with laughter, beautiful memories, exciting adventures, and people who make you feel as special as you truly are.',
    'Never stop dreaming, smiling, and being the wonderful person you are. The world is a gentler, brighter place with you in it.',
    'Happy Birthday!',
    `With all my love,\n${senderName}`,
  ];

  const letterTextList = paragraphs && paragraphs.length > 0 ? paragraphs : defaultParagraphs;

  return (
    <section id="note" className="py-20 sm:py-28 px-4 sm:px-6 relative overflow-hidden bg-[#FFF3EE]">
      <div className="max-w-4xl mx-auto relative z-10 text-center">
        
        {/* Header */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/70 border border-[#E9CFA9] text-[#B62A42] text-[10px] font-sans font-semibold uppercase tracking-[0.25em] mb-3">
          <Mail className="w-3 h-3" />
          <span>Wax-Sealed Stationery</span>
        </div>

        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-medium text-[#481321]">
          {heading}
        </h2>

        <p className="font-serif italic text-base sm:text-lg text-[#681C2C]/80 mt-2 max-w-md mx-auto">
          A personal message written straight from the heart
        </p>

        {/* Envelope Interaction Container */}
        <div className="mt-12 flex justify-center">
          <div className="relative w-full max-w-lg">
            {!isOpen ? (
              /* CLOSED ENVELOPE STATE */
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setIsOpen(true)}
                className="relative aspect-[16/11] rounded-3xl bg-[#F9E3DE] border-2 border-[#E9CFA9] shadow-[0_20px_50px_rgba(104,28,44,0.12)] p-6 sm:p-8 flex flex-col items-center justify-between cursor-pointer overflow-hidden group select-none"
              >
                {/* Envelope Flap Triangle Graphic */}
                <div className="absolute top-0 left-0 right-0 h-28 bg-[#F4CFCA]/80 border-b border-[#E9CFA9] [clip-path:polygon(0_0,100%_0,50%_100%)] shadow-sm group-hover:brightness-95 transition-all" />

                {/* Subtitle To / From */}
                <div className="relative z-10 w-full flex justify-between text-xs font-serif italic text-[#681C2C]/70">
                  <span>To: {recipientName}</span>
                  <span>Personal &bull; Confidential</span>
                </div>

                {/* Center Burgundy Wax Seal Button */}
                <div className="relative z-20 my-auto flex flex-col items-center">
                  <motion.div
                    animate={{ scale: [1, 1.06, 1] }}
                    transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
                    className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-tr from-[#481321] via-[#681C2C] to-[#B62A42] border-2 border-[#E9CFA9] flex items-center justify-center text-[#FFFCF9] shadow-[0_8px_20px_rgba(104,28,44,0.4)] group-hover:rotate-6 transition-transform"
                  >
                    <Heart className="w-7 h-7 fill-current text-[#FFFCF9]" />
                  </motion.div>
                  <span className="mt-3 text-xs sm:text-sm font-sans font-bold text-[#681C2C] uppercase tracking-wider">
                    {prompt}
                  </span>
                  <span className="text-[10px] text-[#51363A]/60 font-sans mt-0.5">
                    Click to break wax seal &amp; read
                  </span>
                </div>

                {/* Bottom Signature Line */}
                <div className="relative z-10 w-full text-right text-xs font-serif italic text-[#681C2C]/70">
                  From: {senderName}
                </div>
              </motion.div>
            ) : (
              /* OPENED LETTER CARD */
              <motion.div
                initial={{ opacity: 0, y: 30, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                className="relative rounded-3xl bg-[#FFFCF9] border border-[#E9CFA9] p-8 sm:p-12 shadow-[0_25px_60px_rgba(104,28,44,0.12)] text-left"
              >
                {/* Top Corner Seal */}
                <div className="flex items-center justify-between border-b border-[#F4CFCA] pb-4 mb-6">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-[#FFF3EE] border border-[#E9CFA9] flex items-center justify-center text-[#B62A42]">
                      <Heart className="w-4 h-4 fill-current" />
                    </div>
                    <span className="font-serif italic text-sm text-[#681C2C] font-semibold">
                      Ink &amp; Ivory Love Letter
                    </span>
                  </div>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="text-xs font-sans text-[#B62A42] hover:underline cursor-pointer"
                  >
                    Fold letter back
                  </button>
                </div>

                {/* Letter Body Paragraphs */}
                <div className="space-y-4 font-serif text-[#51363A] text-base sm:text-lg leading-relaxed">
                  {letterTextList.map((p, idx) => (
                    <p key={idx} className="whitespace-pre-line">
                      {p}
                    </p>
                  ))}
                </div>

                {/* Sign-off */}
                <div className="mt-8 pt-4 border-t border-[#F4CFCA] flex justify-between items-end">
                  <span className="text-xs text-[#51363A]/60 font-sans">
                    With warmest birthday wishes
                  </span>
                  <span
                    className="text-3xl text-[#681C2C] select-none"
                    style={{ fontFamily: "'Allura', 'Great Vibes', cursive" }}
                  >
                    {senderName}
                  </span>
                </div>
              </motion.div>
            )}
          </div>
        </div>

      </div>
    </section>
  );
}
