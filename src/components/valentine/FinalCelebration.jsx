'use client';

import React from 'react';
import Link from 'next/link';
import { Heart, RotateCcw, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

export const FinalCelebration = ({
  celebrationData,
  onReplay,
  senderName = "Aarav",
  recipientName = "Riya",
}) => {
  return (
    <footer className="py-24 px-4 sm:px-6 bg-gradient-to-b from-[#FFF4F0] via-[#FBE7E3] to-[#F6D3D0] relative overflow-hidden text-center">
      {/* Decorative ambient glowing background */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-gradient-to-t from-[#B51F3B]/10 to-transparent blur-3xl pointer-events-none" />

      <div className="max-w-3xl mx-auto relative z-10 flex flex-col items-center">
        {/* Heart Medallion */}
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#B51F3B] to-[#641D2B] flex items-center justify-center text-white shadow-xl shadow-[#B51F3B]/30 mb-6 border-2 border-white">
          <Heart className="w-8 h-8 fill-current animate-pulse" />
        </div>

        {/* Small Eyebrow Badge */}
        <span className="inline-block px-4 py-1.5 rounded-full bg-[#B51F3B]/10 border border-[#B51F3B]/25 text-xs font-sans font-bold tracking-[0.25em] text-[#B51F3B] uppercase mb-4">
          {celebrationData.badge || "TOGETHER FOREVER"}
        </span>

        {/* Heading */}
        <h2 className="font-serif text-4xl sm:text-5xl md:text-6xl text-[#641D2B] font-bold tracking-tight mb-4">
          {celebrationData.heading}
        </h2>

        {/* Names */}
        <p className="font-['Allura',cursive] text-3xl sm:text-4xl text-[#B51F3B] mb-4">
          {senderName} &amp; {recipientName}
        </p>

        {/* Supporting Message */}
        <p className="font-serif italic text-lg sm:text-xl text-[#4B3035]/85 max-w-lg mb-10 leading-relaxed">
          &ldquo;{celebrationData.subheading}&rdquo;
        </p>

        {/* Replay Proposal Button */}
        <button
          onClick={onReplay}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white/80 hover:bg-white text-[#641D2B] border border-[#F6D3D0] shadow-sm font-sans font-semibold text-xs uppercase tracking-widest transition-all mb-16 hover:shadow-md"
        >
          <RotateCcw className="w-4 h-4" />
          <span>{celebrationData.replayButtonText || "Ask Me Again ↺"}</span>
        </button>

        {/* You Are Mine Brand Credit */}
        <div className="border-t border-[#641D2B]/15 pt-8 w-full max-w-md flex flex-col items-center gap-2 text-xs font-sans text-[#641D2B]/60">
          <p className="tracking-widest uppercase font-semibold text-[#641D2B]/75">
            Crafted with love by You Are Mine
          </p>
          <p className="text-[11px] text-[#641D2B]/50">
            Exclusive Digital Stationery &amp; Romantic Experiences
          </p>
          <Link
            href="/"
            className="text-[11px] text-[#B51F3B] hover:underline mt-1 font-semibold"
          >
            Create Your Own Digital Valentine &rarr;
          </Link>
        </div>
      </div>
    </footer>
  );
};
