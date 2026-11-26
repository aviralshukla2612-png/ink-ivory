'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';

const SHOWCASE_SLIDES = [
  {
    src: '/images/templates/royal-navy-wedding-card.jpg',
    badge: 'ROYAL BESPOKE EDITION',
    title: 'The Royal Navy Wedding',
    subtitle: 'Moving 3D Golden Gates & Sitar',
  },
  {
    src: '/images/templates/udaipur-palace-wedding-card.jpg',
    badge: 'PALACE HERITAGE SUITE',
    title: 'Tara & Kabir — Udaipur Palace',
    subtitle: 'Lakeside Mandap & Fireworks',
  },
  {
    src: '/images/templates/arjun-sia-heritage-card.jpg',
    badge: 'SIGNATURE 8-SECTION STORY',
    title: 'Arjun & Sia — Lake Palace',
    subtitle: 'Blooming Lotus & Marigold Rangoli',
  },
  {
    src: '/images/templates/thirumanam-temple-card.jpg',
    badge: 'SACRED TEMPLE WEDDING',
    title: 'Thirumanam South Indian',
    subtitle: 'Golden Gopuram & Temple Bells',
  },
  {
    src: '/images/birthday/birthday-preview-card.jpg',
    badge: 'CHIC BIRTHDAY CELEBRATION',
    title: 'Golden Birthday Surprise',
    subtitle: 'Festive Confetti & Live Music',
  },
  {
    src: '/images/valentine/valentine-preview-card.jpg',
    badge: 'INTERACTIVE LOVE STORY',
    title: 'Will You Be My Valentine?',
    subtitle: 'Wax Seal Letter & Proposal',
  },
];

export default function Loading() {
  const [count, setCount] = useState(0);
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);
  const [isCrossFading, setIsCrossFading] = useState(false);

  // Dynamic slide switcher: calm, luxurious crossfade every 1100ms (matching Zarvion pacing)
  useEffect(() => {
    const slideTimer = setInterval(() => {
      setIsCrossFading(true);
      setTimeout(() => {
        setActiveSlideIndex((prev) => (prev + 1) % SHOWCASE_SLIDES.length);
        setIsCrossFading(false);
      }, 250);
    }, 1100);

    return () => clearInterval(slideTimer);
  }, []);

  // Numeric counter 0 -> 100: calm, steady, luxurious progression (~3.4 seconds)
  useEffect(() => {
    let current = 0;
    const duration = 3400; // 3.4s smooth, measured count matching Zarvion
    const startTime = Date.now();

    const timer = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(1, elapsed / duration);

      const eased =
        progress < 0.5
          ? 2 * progress * progress
          : 1 - Math.pow(-2 * progress + 2, 2) / 2;

      current = Math.min(100, Math.floor(eased * 100));
      setCount(current);

      if (progress >= 1) {
        clearInterval(timer);
        setCount(100);
      }
    }, 24);

    return () => clearInterval(timer);
  }, []);

  const activeSlide = SHOWCASE_SLIDES[activeSlideIndex] || SHOWCASE_SLIDES[0];

  return (
    <div
      aria-label="Loading bespoke experience"
      aria-busy="true"
      className="fixed inset-0 z-[9999] flex flex-col justify-between bg-[#2A0C16] text-white px-6 sm:px-12 md:px-16 py-8 sm:py-10 select-none overflow-hidden"
    >
      {/* Ambient Radial Backlight Glow */}
      <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#D7B875]/[0.12] rounded-full blur-[120px]" />

      {/* TOP HEADER ROW: Brand Logo on Left, Big Numeric Counter on Right */}
      <header className="relative z-10 flex items-start justify-between w-full">
        {/* Official Luminous Gold Brand Logo Banner */}
        <div className="relative w-40 sm:w-48 h-12 sm:h-14">
          <Image
            src="/logo-dark-bg.png"
            alt="You Are Mine — Digital Invitations"
            fill
            className="object-contain object-left"
            priority
          />
        </div>

        {/* Big Modern Numeric Counter (0 -> 100) */}
        <div className="flex items-start">
          <span className="font-sans text-5xl sm:text-7xl md:text-8xl font-black tracking-tighter text-white tabular-nums drop-shadow-[0_2px_12px_rgba(215,184,117,0.45)] leading-none">
            {String(count).padStart(2, '0')}
          </span>
          <span className="text-xl sm:text-2xl font-bold text-[#D7B875] ml-1.5 mt-1 sm:mt-2">
            %
          </span>
        </div>
      </header>

      {/* CENTER: Illuminated 3D Glass Showcase Portal Frame (Rotating Cards) */}
      <main className="relative z-10 my-auto flex items-center justify-center py-6">
        {/* Ambient Card Backglow */}
        <div className="absolute w-72 sm:w-80 h-96 sm:h-[420px] rounded-3xl bg-[#D7B875]/20 blur-2xl animate-pulse" />

        {/* Glass Card */}
        <div className="relative w-64 sm:w-72 md:w-80 h-84 sm:h-96 md:h-[400px] rounded-2xl overflow-hidden border border-[#D7B875]/50 bg-[#35131D] shadow-[0_12px_36px_rgba(0,0,0,0.5),0_0_24px_rgba(215,184,117,0.3)] transition-transform duration-700">
          {/* Card Visual Artwork (Crossfading) */}
          <div
            className={`absolute inset-0 transition-opacity duration-200 ${
              isCrossFading ? 'opacity-30' : 'opacity-100'
            }`}
          >
            <Image
              src={activeSlide.src}
              alt={activeSlide.title}
              fill
              className="object-cover"
              priority
            />
          </div>

          {/* Gentle Warm Vignette */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#2A0C16]/80 via-transparent to-transparent" />

          {/* Card Inner Content */}
          <div
            className={`absolute inset-0 p-5 flex flex-col justify-between transition-opacity duration-200 ${
              isCrossFading ? 'opacity-40' : 'opacity-100'
            }`}
          >
            <div className="inline-flex items-center gap-1.5 self-start px-3 py-1 rounded-full bg-[#35131D]/90 border border-[#D7B875]/50 backdrop-blur-md">
              <span className="w-1.5 h-1.5 rounded-full bg-[#D7B875] animate-ping" />
              <span className="text-[10px] font-bold tracking-widest text-[#EDE2CF]">
                {activeSlide.badge}
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-[#2A0C16]/90 border border-[#D7B875]/35 backdrop-blur-md">
              <h3 className="font-serif text-sm font-bold text-[#EDE2CF]">
                {activeSlide.title}
              </h3>
              <p className="text-[11px] font-medium text-[#D7B875] mt-0.5">
                {activeSlide.subtitle}
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* BOTTOM SECTION: Ultra-Minimal Slim Neon Golden Progress Bar */}
      <footer className="relative z-10 w-full pb-2">
        <div className="w-full h-1 sm:h-1.5 bg-white/10 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-[#B88E4B] via-[#D7B875] to-white rounded-full transition-all duration-75 ease-out shadow-[0_0_8px_rgba(215,184,117,0.8)]"
            style={{ width: `${count}%` }}
          />
        </div>
      </footer>
    </div>
  );
}
