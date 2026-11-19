'use client';

import React from 'react';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
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
  const searchParams = useSearchParams();
  const queryNames = searchParams?.get('names');
  const queryDate = searchParams?.get('date');
  const queryCity = searchParams?.get('city');

  let sessionCustom = {};
  if (typeof window !== 'undefined') {
    try {
      const stored = sessionStorage.getItem('ink_ivory_custom_wedding_data');
      if (stored) sessionCustom = JSON.parse(stored);
    } catch (e) {}
  }

  const coupleNames = queryNames || sessionCustom.names || couple?.names || 'Aarav & Riya';
  const dateDisplay = queryDate || sessionCustom.date || couple?.dateDisplay || 'Friday, 18 December 2026';
  const cityDisplay = queryCity || sessionCustom.city || couple?.cityDisplay || 'Jaipur, Rajasthan';

  return (
    <section
      id="welcome"
      className="relative h-full min-h-screen w-full flex flex-col items-center justify-center pt-8 sm:pt-12 pb-14 sm:pb-24 px-3.5 sm:px-6 overflow-hidden select-none"
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

      {/* Pure Floating Typography inside the Arch — Grand, majestic, perfectly centered in clear golden sky */}
      <div className="relative z-10 max-w-2xl w-full mx-auto text-center flex flex-col items-center px-3 sm:px-6">
        {/* Sanskrit Invocation */}
        {shloka?.enabled && (
          <div className="mb-1.5 sm:mb-2 text-center">
            <span className="font-serif text-[11px] sm:text-base text-[#7B5927] tracking-widest font-medium drop-shadow-[0_1px_2px_rgba(255,255,255,0.85)]">
              {shloka.sanskrit}
            </span>
          </div>
        )}

        {/* Eyebrow */}
        <p className="font-manrope text-[9px] sm:text-[13px] font-semibold tracking-[0.28em] uppercase text-[#8C6527] mb-1 drop-shadow-[0_1px_2px_rgba(255,255,255,0.85)]">
          — Auspicious Wedding Invitation —
        </p>

        {/* You are Cordially Invited */}
        <h2 className="font-cormorant text-2xl sm:text-5xl md:text-6xl font-medium text-[#26180E] leading-[0.98] tracking-tight mb-1 drop-shadow-[0_2px_4px_rgba(255,255,255,0.9)]">
          You are <br />
          <span className="italic font-serif text-[#3E2512]">Cordially Invited</span>
        </h2>
        <p className="font-serif text-[11px] sm:text-lg md:text-xl text-[#7B5927] my-1 sm:my-1.5 italic drop-shadow-[0_1px_2px_rgba(255,255,255,0.85)]">
          to celebrate the wedding celebration of
        </p>

        {/* Royal Gold Fleuron Divider */}
        <div className="flex items-center justify-center gap-2.5 sm:gap-3 my-1 sm:my-1.5 select-none pointer-events-none">
          <div className="h-[1px] w-8 sm:w-20 bg-gradient-to-r from-transparent to-[#A87B36]" />
          <span className="text-xs text-[#A87B36]">✦</span>
          <div className="h-[1px] w-8 sm:w-20 bg-gradient-to-l from-transparent to-[#A87B36]" />
        </div>

        {/* Couple Names — Grand, prominent, royal typography */}
        <h1 className="font-cormorant text-3xl sm:text-6xl md:text-7xl lg:text-8xl font-semibold text-[#1C120A] tracking-tight my-0.5 sm:my-1 drop-shadow-[0_2px_4px_rgba(255,255,255,0.95)]">
          {coupleNames}
        </h1>

        {/* Date & City */}
        <p className="font-manrope text-[10px] sm:text-sm md:text-[15px] font-semibold tracking-[0.22em] uppercase text-[#5A3C21] mt-1 sm:mt-1.5 drop-shadow-[0_1px_2px_rgba(255,255,255,0.9)]">
          {dateDisplay} • {cityDisplay}
        </p>
      </div>
    </section>
  );
};

export default WelcomeSection;
