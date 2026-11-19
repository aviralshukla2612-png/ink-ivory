'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Sparkles, ArrowUpRight } from 'lucide-react';

export const Footer: React.FC = () => {
  const pathname = usePathname();

  // Hide global e-commerce footer on standalone cinematic template preview pages and customize studio
  if (
    pathname &&
    (pathname.startsWith('/template-01') ||
      pathname.startsWith('/template-02') ||
      pathname.startsWith('/template-03') ||
      pathname.startsWith('/preview') ||
      pathname.startsWith('/customize'))
  ) {
    return null;
  }

  return (
    <footer className="w-full bg-[#FAF7F2] border-t border-[#E8DFD1] text-[#23180D] pt-10 pb-6 px-4 sm:px-8 lg:px-14 overflow-hidden relative">
      <div className="max-w-7xl mx-auto flex flex-col">
        {/* ========================================================================= */}
        {/* TOP ROW: LOGO ON TOP LEFT + SOCIAL LINKS IN BIG FONT ON TOP RIGHT         */}
        {/* ========================================================================= */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-3 sm:pb-4">
          {/* Top Left: Ink & Ivory Luxury Script Logo */}
          <div className="flex items-center">
            <Link href="/" className="inline-flex items-center gap-2 group focus:outline-none">
              <span className="font-serif italic font-bold text-3xl sm:text-4xl lg:text-[44px] text-[#23180D] group-hover:text-[#8C6837] transition-colors leading-none tracking-tight">
                Ink &amp; Ivory
              </span>
              <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-[#C5A059] fill-[#C5A059]/20 -mt-2 animate-pulse" />
            </Link>
          </div>

          {/* Top Right: Social Links in Big Font (LinkedIn ↗, Twitter / X ↗, Instagram ↗) */}
          <div className="flex flex-wrap items-center gap-5 sm:gap-8 lg:gap-10">
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noreferrer"
              className="group inline-flex items-center gap-1.5 text-base sm:text-lg lg:text-xl font-medium text-[#23180D] hover:text-[#8C6837] transition-colors"
            >
              <span>LinkedIn</span>
              <ArrowUpRight className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2] text-[#8C6837] transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noreferrer"
              className="group inline-flex items-center gap-1.5 text-base sm:text-lg lg:text-xl font-medium text-[#23180D] hover:text-[#8C6837] transition-colors"
            >
              <span>Twitter / X</span>
              <ArrowUpRight className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2] text-[#8C6837] transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noreferrer"
              className="group inline-flex items-center gap-1.5 text-base sm:text-lg lg:text-xl font-medium text-[#23180D] hover:text-[#8C6837] transition-colors"
            >
              <span>Instagram</span>
              <ArrowUpRight className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2] text-[#8C6837] transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* CENTER: GIANT OVERSIZED LIQUID TYPOGRAPHY "INK & IVORY"                   */}
        {/* Regal serif typography with continuous Royal Navy wave                     */}
        {/* ========================================================================= */}
        <div className="w-full relative my-1 sm:my-2 select-none">
          <svg
            viewBox="0 0 1200 175"
            className="w-full h-auto max-h-[145px] sm:max-h-[175px] overflow-visible select-none pointer-events-none"
            preserveAspectRatio="xMidYMid meet"
          >
            <defs>
              {/* Primary Signature Royal Navy & Sapphire Gradient */}
              <linearGradient id="liquidGradNavy" x1="0%" y1="0%" x2="100%" y2="80%">
                <stop offset="0%" stopColor="#0B1323" />
                <stop offset="28%" stopColor="#14213D" />
                <stop offset="60%" stopColor="#1E3A8A" />
                <stop offset="85%" stopColor="#2563EB" />
                <stop offset="100%" stopColor="#38BDF8" />
              </linearGradient>

              {/* Secondary Background Liquid Wave Gradient */}
              <linearGradient id="liquidBackGradNavy" x1="0%" y1="100%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#08101E" stopOpacity="0.75" />
                <stop offset="50%" stopColor="#1E3A8A" stopOpacity="0.6" />
                <stop offset="100%" stopColor="#0F172A" stopOpacity="0.45" />
              </linearGradient>

              {/* Base Letter Fill Gradient (subtle luxury warm parchment tone) */}
              <linearGradient id="letterBaseGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#FAF7F2" />
                <stop offset="100%" stopColor="#F3EDE1" />
              </linearGradient>

              {/* Seamless Repeating Horizontal Wave 1 (Front Wave, repeats every 1200px) */}
              <path
                id="frontWavePath"
                d="
                  M 0 42
                  C 150 15, 300 68, 450 42
                  C 600 15, 750 68, 900 42
                  C 1050 15, 1200 68, 1200 42
                  C 1350 15, 1500 68, 1650 42
                  C 1800 15, 1950 68, 2100 42
                  C 2250 15, 2400 68, 2400 42
                  L 2400 400
                  L 0 400
                  Z
                "
              />

              {/* Seamless Repeating Horizontal Wave 2 (Back Wave with offset phase) */}
              <path
                id="backWavePath"
                d="
                  M 0 48
                  C 180 75, 360 20, 540 48
                  C 720 75, 900 20, 1080 48
                  C 1260 75, 1440 20, 1620 48
                  C 1800 75, 1980 20, 2160 48
                  C 2340 75, 2400 35, 2400 48
                  L 2400 400
                  L 0 400
                  Z
                "
              />

              {/* Clip Mask strictly inside the text boundaries */}
              <clipPath id="inkIvoryLiquidClip">
                <text
                  x="50%"
                  y="125"
                  textAnchor="middle"
                  fontFamily="'Cormorant Garamond', 'Cinzel', 'Playfair Display', Georgia, serif"
                  fontSize="122"
                  fontWeight="800"
                  letterSpacing="0.12em"
                >
                  INK &amp; IVORY
                </text>
              </clipPath>
            </defs>

            {/* Layer 1: Solid Luxury Base Fill with Crisp Outer Dark Outline */}
            <text
              x="50%"
              y="125"
              textAnchor="middle"
              fontFamily="'Cormorant Garamond', 'Cinzel', 'Playfair Display', Georgia, serif"
              fontSize="122"
              fontWeight="800"
              letterSpacing="0.12em"
              fill="url(#letterBaseGrad)"
              stroke="#382719"
              strokeWidth="2.2"
              strokeLinejoin="round"
            >
              INK &amp; IVORY
            </text>

            {/* Layer 2: Liquid Wave Rising from Bottom to Top */}
            <g clipPath="url(#inkIvoryLiquidClip)">
              <g className="cardly-liquid-rise">
                {/* Secondary Wave for depth & dimension */}
                <use
                  href="#backWavePath"
                  className="cardly-wave-back"
                  fill="url(#liquidBackGradNavy)"
                />
                {/* Primary Royal Navy Liquid Wave */}
                <use
                  href="#frontWavePath"
                  className="cardly-wave-front"
                  fill="url(#liquidGradNavy)"
                />
              </g>
            </g>

            {/* Layer 3: Razor-sharp outer perimeter outline on top */}
            <text
              x="50%"
              y="125"
              textAnchor="middle"
              fontFamily="'Cormorant Garamond', 'Cinzel', 'Playfair Display', Georgia, serif"
              fontSize="122"
              fontWeight="800"
              letterSpacing="0.12em"
              fill="none"
              stroke="#382719"
              strokeWidth="2.2"
              strokeLinejoin="round"
              opacity="0.95"
            >
              INK &amp; IVORY
            </text>
          </svg>
        </div>

        {/* Delicate Hairline Divider */}
        <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-[#C5A059]/35 to-transparent my-3 sm:my-4" />

        {/* ========================================================================= */}
        {/* DOWN SIDE: NAVBAR THING BENEATH BIG INK & IVORY                            */}
        {/* Copyright notice on left + Navigation links on right                      */}
        {/* ========================================================================= */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-3 sm:gap-4 text-xs font-medium text-[#49341F] pt-1">
          {/* Copyright Notice */}
          <p className="text-[11.5px] sm:text-xs text-[#7A644E]">
            &copy; {new Date().getFullYear()} Ink &amp; Ivory. All rights reserved. Bespoke luxury digital stationery.
          </p>

          {/* Navigation Links ("navbar thing") */}
          <nav className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-xs font-medium text-[#49341F]">
            <Link href="/" className="hover:text-[#8C6837] transition-colors">
              Home
            </Link>
            <Link href="/templates" className="hover:text-[#8C6837] transition-colors">
              Templates
            </Link>
            <Link href="/customize/template-01" className="hover:text-[#8C6837] transition-colors">
              Custom Studio
            </Link>
            <Link href="/pricing" className="hover:text-[#8C6837] transition-colors">
              Pricing
            </Link>
            <Link href="/contact" className="hover:text-[#8C6837] transition-colors">
              Support
            </Link>
            <Link href="/privacy" className="hover:text-[#8C6837] transition-colors">
              Privacy
            </Link>
            <Link href="/terms" className="hover:text-[#8C6837] transition-colors">
              Terms
            </Link>
          </nav>
        </div>
      </div>

      {/* Embedded CSS Animations for High-Performance 60fps Liquid Physics */}
      <style jsx>{`
        /* Continuous horizontal wave ripple (Front) */
        @keyframes waveHorizontalFront {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-1200px);
          }
        }

        /* Continuous horizontal wave ripple (Back) */
        @keyframes waveHorizontalBack {
          0% {
            transform: translateX(-600px);
          }
          100% {
            transform: translateX(600px);
          }
        }

        /* 
          Continuous tide-like liquid wave cycle:
          - Keeps a minimum 30% baseline liquid at all times so it NEVER looks empty/blank!
          - Smoothly swells to 100% full immersion, glistens, and ebbs back to baseline.
        */
        @keyframes liquidRiseCycle {
          0% {
            transform: translateY(75px);
          }
          35% {
            transform: translateY(18px);
          }
          55% {
            transform: translateY(-38px);
          }
          75% {
            transform: translateY(-38px);
          }
          90% {
            transform: translateY(30px);
          }
          100% {
            transform: translateY(75px);
          }
        }

        .cardly-liquid-rise {
          animation: liquidRiseCycle 7.5s cubic-bezier(0.4, 0, 0.2, 1) infinite;
          will-change: transform;
        }

        .cardly-wave-front {
          animation: waveHorizontalFront 4.2s linear infinite;
          will-change: transform;
        }

        .cardly-wave-back {
          animation: waveHorizontalBack 6.5s linear infinite;
          will-change: transform;
        }

        @media (prefers-reduced-motion: reduce) {
          .cardly-liquid-rise,
          .cardly-wave-front,
          .cardly-wave-back {
            animation: none !important;
          }
          .cardly-liquid-rise {
            transform: translateY(20px) !important;
          }
        }
      `}</style>
    </footer>
  );
};
