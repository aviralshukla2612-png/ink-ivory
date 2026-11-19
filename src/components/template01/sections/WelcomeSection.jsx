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
      className="relative min-h-screen w-full flex flex-col items-center justify-center pt-20 sm:pt-24 pb-36 sm:pb-44 px-4 sm:px-6 overflow-hidden select-none"
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

      {/* Pure Floating Typography inside the Arch — Held high in clear golden sky, well above stone balustrade */}
      <div className="relative z-10 max-w-lg w-full mx-auto text-center flex flex-col items-center">
        {/* Sanskrit Invocation */}
        {shloka?.enabled && (
          <div className="mb-2 text-center">
            <span className="font-serif text-xs sm:text-sm text-[#7B5927] tracking-widest font-medium drop-shadow-[0_1px_2px_rgba(255,255,255,0.85)]">
              {shloka.sanskrit}
            </span>
          </div>
        )}

        {/* Eyebrow */}
        <p className="font-manrope text-[10px] sm:text-[11px] font-semibold tracking-[0.26em] uppercase text-[#8C6527] mb-1.5 drop-shadow-[0_1px_2px_rgba(255,255,255,0.85)]">
          — Wedding Invitation —
        </p>

        {/* You are Cordially Invited to the Wedding Celebration */}
        <h2 className="font-cormorant text-3xl sm:text-4xl md:text-5xl text-[#26180E] font-medium leading-[1.08] mb-0.5 tracking-tight drop-shadow-[0_1px_3px_rgba(255,255,255,0.9)]">
          You are <br />
          <span className="italic font-serif text-[#3E2512]">Cordially Invited</span>
        </h2>
        <p className="font-serif text-xs sm:text-sm text-[#6B4D1B] my-1 italic drop-shadow-[0_1px_2px_rgba(255,255,255,0.85)]">
          to the Wedding Celebration of
        </p>

        {/* Royal Gold Fleuron Divider */}
        <div className="flex items-center justify-center gap-3 my-1.5 select-none pointer-events-none">
          <div className="h-[1px] w-10 sm:w-16 bg-gradient-to-r from-transparent to-[#A87B36]" />
          <span className="text-[11px] text-[#A87B36]">✦</span>
          <div className="h-[1px] w-10 sm:w-16 bg-gradient-to-l from-transparent to-[#A87B36]" />
        </div>

        {/* Couple Names */}
        <h1 className="font-cormorant text-3xl sm:text-4xl md:text-5xl font-semibold text-[#1C120A] tracking-tight mb-1 drop-shadow-[0_1px_3px_rgba(255,255,255,0.9)]">
          {couple.names}
        </h1>

        {/* Date & City */}
        <p className="font-manrope text-[10px] sm:text-xs font-semibold tracking-[0.2em] uppercase text-[#5A3C21] drop-shadow-[0_1px_2px_rgba(255,255,255,0.85)]">
          {couple.dateDisplay} • {couple.cityDisplay}
        </p>

        {/* Warm Greeting — High contrast, sits completely above stone railing */}
        <p className="font-serif italic text-xs sm:text-[13px] text-[#2C1A0B] font-medium max-w-sm mx-auto mt-3 leading-relaxed drop-shadow-[0_1px_3px_rgba(255,255,255,0.95)]">
          Together with their families, invite you to witness the beginning of their forever.
        </p>
      </div>
    </section>
  );
};

export default WelcomeSection;
