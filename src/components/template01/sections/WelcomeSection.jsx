'use client';

import React from 'react';
import Image from 'next/image';
import { weddingData } from '@/data/weddingData';

/**
 * Section 04: Welcome / Introduction
 * EXACT MATCH to Image 3 (Tile 04):
 * - Background: /04_welcome_intro.png (ivory arch framing river & palace at sunset, peacock on right)
 * - NO dark gray boxes or cards.
 * - Text floats directly on the clean ivory sky area in royal espresso & gold serif typography:
 *     You are
 *     Cordially Invited
 *     to the
 *     Wedding Celebration
 *     — ✦ —
 *     Aarav & Riya
 *     Friday, 18 December 2026 • Jaipur, Rajasthan
 */
export const WelcomeSection = () => {
  const { couple, shloka } = weddingData;

  return (
    <section
      id="welcome"
      className="relative min-h-screen w-full flex items-center justify-center py-20 px-6 overflow-hidden select-none"
    >
      {/* Background Graphic: 04_welcome_intro.png */}
      <div className="absolute inset-0 w-full h-full pointer-events-none">
        <Image
          src="/04_welcome_intro.png"
          alt="Welcome Arch River Palace Sunset"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
      </div>

      {/* Pure Floating Typography inside the Arch — NO DARK BOXES */}
      <div className="relative z-10 max-w-2xl w-full mx-auto text-center flex flex-col items-center pt-8 sm:pt-12">
        {/* Sanskrit Invocation */}
        {shloka?.enabled && (
          <div className="mb-4 text-center">
            <span className="font-serif text-sm sm:text-base text-[#7B5927] tracking-widest font-medium drop-shadow-xs">
              {shloka.sanskrit}
            </span>
          </div>
        )}

        {/* Eyebrow */}
        <p className="font-manrope text-[11px] sm:text-[12px] font-semibold tracking-[0.28em] uppercase text-[#8C6527] mb-3">
          — Wedding Invitation —
        </p>

        {/* You are Cordially Invited to the Wedding Celebration */}
        <h2 className="font-cormorant text-4xl sm:text-5xl md:text-6xl text-[#26180E] font-medium leading-[1.12] mb-1 tracking-tight drop-shadow-xs">
          You are <br />
          <span className="italic font-serif text-[#3E2512]">Cordially Invited</span>
        </h2>
        <p className="font-serif text-base sm:text-xl text-[#7B5927] mt-1 mb-5 italic">
          to the Wedding Celebration of
        </p>

        {/* Royal Gold Fleuron Divider */}
        <div className="flex items-center justify-center gap-3 my-2 select-none pointer-events-none">
          <div className="h-[1px] w-12 sm:w-20 bg-gradient-to-r from-transparent to-[#A87B36]" />
          <span className="text-xs text-[#A87B36]">✦</span>
          <div className="h-[1px] w-12 sm:w-20 bg-gradient-to-l from-transparent to-[#A87B36]" />
        </div>

        {/* Couple Names */}
        <h1 className="font-cormorant text-4xl sm:text-6xl md:text-7xl font-semibold text-[#1C120A] tracking-tight mt-2 mb-2 drop-shadow-xs">
          {couple.names}
        </h1>

        {/* Date & City */}
        <p className="font-manrope text-xs sm:text-sm font-semibold tracking-[0.2em] uppercase text-[#6B4D1B]">
          {couple.dateDisplay} • {couple.cityDisplay}
        </p>

        {/* Warm Greeting */}
        <p className="font-serif italic text-xs sm:text-sm text-[#4E351F] max-w-md mx-auto mt-5 leading-relaxed">
          Together with their families, invite you to witness the beginning of their forever.
        </p>
      </div>
    </section>
  );
};

export default WelcomeSection;
