'use client';

import React, { useState, useRef } from 'react';
import { Heart, Sparkles, ArrowDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const ProposalSection = ({
  data,
  onAccept,
  hasAccepted,
  proposalRef,
}) => {
  const [noIndex, setNoIndex] = useState(0);
  const [noPos, setNoPos] = useState({ x: 0, y: 0 });
  const [noCount, setNoCount] = useState(0);
  const containerRef = useRef(null);

  const responses = data.proposal.noResponses || [
    "Are you sure? 🥺",
    "Think again! 💭",
    "One more chance? 💕",
    "Pretty please? ♡",
    "Give YES a chance! ✨",
    "You know you want to say yes! 😉",
    "My heart can't take this! 💔",
    "Just click Yes already! 🌹"
  ];

  // Playful evasive movement within bounds
  const moveNoButton = () => {
    if (hasAccepted) return;
    const maxX = 120;
    const maxY = 60;
    // Generate new offset avoiding near-zero
    const newX = (Math.random() > 0.5 ? 1 : -1) * (40 + Math.random() * (maxX - 40));
    const newY = (Math.random() > 0.5 ? 1 : -1) * (20 + Math.random() * (maxY - 20));

    setNoPos({ x: newX, y: newY });
    setNoIndex((prev) => (prev + 1) % responses.length);
    setNoCount((prev) => prev + 1);
  };

  return (
    <section
      id="proposal-hero"
      ref={proposalRef}
      className="relative min-h-screen w-full flex flex-col items-center justify-center pt-24 pb-16 px-4 sm:px-6 overflow-hidden"
      style={{
        backgroundImage: `linear-gradient(rgba(255, 244, 240, 0.45), rgba(251, 231, 227, 0.65)), url('/bgv.png')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      {/* Soft romantic vignette overlay to make typography pop */}
      <div className="absolute inset-0 bg-radial-vignette pointer-events-none opacity-60" />

      {/* Main Proposal Card Container */}
      <div
        ref={containerRef}
        className="relative z-10 max-w-2xl w-full text-center py-10 px-6 sm:px-10 rounded-3xl bg-white/70 backdrop-blur-md border border-white/80 shadow-2xl shadow-[#641D2B]/10 flex flex-col items-center"
      >
        {/* Decorative Top Heart Icon */}
        <div className="w-12 h-12 rounded-full bg-[#FFF4F0] border border-[#F6D3D0] flex items-center justify-center text-[#B51F3B] mb-4 shadow-sm">
          <Heart className="w-6 h-6 fill-current animate-pulse" />
        </div>

        {/* Small Eyebrow */}
        <p className="text-xs sm:text-sm font-sans font-bold tracking-[0.3em] uppercase text-[#B51F3B] mb-3">
          {data.proposal.eyebrow}
        </p>

        {/* Main Heading */}
        <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-[#641D2B] font-bold tracking-tight leading-[1.1] mb-4">
          {data.proposal.heading}
        </h1>

        {/* Delicate handwritten sub-note */}
        <p className="font-['Allura',cursive] text-2xl sm:text-3xl text-[#B51F3B] mb-8">
          For {data.recipientName}, with all my love
        </p>

        {/* Interactive Proposal Buttons */}
        {!hasAccepted ? (
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 w-full max-w-md relative min-h-[90px]">
            {/* YES BUTTON */}
            <motion.button
              whileHover={{ scale: 1.06, boxShadow: "0 10px 30px rgba(181,31,59,0.35)" }}
              whileTap={{ scale: 0.96 }}
              onClick={onAccept}
              className="w-full sm:w-auto px-9 py-4 rounded-full bg-gradient-to-r from-[#B51F3B] via-[#C42A45] to-[#641D2B] text-white font-sans font-bold text-base sm:text-lg tracking-wider uppercase shadow-xl shadow-[#B51F3B]/30 flex items-center justify-center gap-2.5 transition-all relative overflow-hidden group"
            >
              <span className="absolute top-0 -left-[100%] w-1/2 h-full bg-gradient-to-r from-transparent via-white/40 to-transparent skew-x-12 animate-[shine_3s_infinite]" />
              <Heart className="w-5 h-5 fill-current" />
              <span>{data.proposal.yesText}</span>
              <Sparkles className="w-4 h-4 text-[#F6D3D0]" />
            </motion.button>

            {/* PLAYFUL NO BUTTON */}
            <motion.button
              animate={{ x: noPos.x, y: noPos.y }}
              transition={{ type: "spring", stiffness: 350, damping: 25 }}
              onMouseEnter={moveNoButton}
              onClick={moveNoButton}
              onTouchStart={moveNoButton}
              className="w-full sm:w-auto px-7 py-3.5 rounded-full bg-white/80 hover:bg-white text-[#641D2B] font-sans font-semibold text-sm sm:text-base border border-[#F6D3D0] shadow-md shadow-[#641D2B]/5 flex items-center justify-center gap-2 transition-colors cursor-pointer select-none"
            >
              <span>{noCount > 0 ? responses[noIndex] : data.proposal.noText}</span>
            </motion.button>
          </div>
        ) : (
          /* Accepted State Ribbon */
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center gap-3 py-3"
          >
            <div className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#B51F3B]/10 border border-[#B51F3B]/30 text-[#B51F3B] font-sans font-bold text-sm tracking-widest uppercase">
              <Heart className="w-4 h-4 fill-current" />
              <span>SHE SAID YES! 💕</span>
            </div>
            <p className="font-serif italic text-lg text-[#641D2B]">
              The beginning of our forever chapter.
            </p>
          </motion.div>
        )}

        {/* Playful hint text if NO was chased multiple times */}
        {noCount >= 3 && !hasAccepted && (
          <p className="text-xs font-sans text-[#B51F3B] tracking-wide mt-4 animate-fade-in">
            (P.s. Saying Yes is the easiest decision you&apos;ll make today! ♡)
          </p>
        )}

        {/* Scroll indicator down to Our Story */}
        <button
          onClick={() => {
            const el = document.getElementById('our-story');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }}
          className="mt-8 flex items-center gap-1.5 text-xs uppercase tracking-widest font-sans font-semibold text-[#641D2B]/60 hover:text-[#641D2B] transition-colors"
        >
          <span>Read Our Story</span>
          <ArrowDown className="w-3.5 h-3.5 animate-bounce" />
        </button>
      </div>
    </section>
  );
};
