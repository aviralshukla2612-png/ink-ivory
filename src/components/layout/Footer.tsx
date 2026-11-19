'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Sparkles, ArrowUpRight } from 'lucide-react';

export const Footer: React.FC = () => {
  const pathname = usePathname();

  // Hide global e-commerce footer on standalone cinematic template preview pages
  if (pathname && (pathname.startsWith('/template-01') || pathname.startsWith('/preview'))) {
    return null;
  }
  // Pure unified SVG path data for "CARDLY" in bold geometric sans (zero internal crossing lines)
  const cardlyPath =
    'M192.56 157.94Q175.13 157.94 160.33 152.27Q145.52 146.60 134.71 136.41Q123.89 126.23 117.80 112.27Q111.71 98.30 111.71 81.50Q111.71 64.70 117.80 50.73Q123.89 36.77 134.71 26.59Q145.52 16.40 160.33 10.73Q175.13 5.06 192.56 5.06Q212.94 5.06 229 12.20Q245.06 19.34 255.77 32.78L229.31 56.72Q222.38 48.32 213.77 43.91Q205.16 39.50 194.66 39.50Q182.48 39.50 173.35 44.75Q164.21 50 158.96 59.45Q153.71 68.90 153.71 81.50Q153.71 94.10 158.96 103.55Q164.21 113 173.35 118.25Q182.48 123.50 194.66 123.50Q205.16 123.50 213.77 119.09Q222.38 114.68 229.31 106.28L255.77 130.22Q245.06 143.66 229 150.80Q212.94 157.94 192.56 157.94 M311.36 155L268.94 155L333.82 8L374.77 8L439.88 155L396.62 155L385.06 126.44L322.90 126.44L311.36 155M353.99 48.74L335.08 95.78L372.88 95.78 M507.22 155L465.63 155L465.63 8L531.37 8Q563.71 8 580.92 22.59Q598.14 37.19 598.14 62.39Q598.14 78.56 590.59 90.42Q583.02 102.29 569.16 108.80L601.09 155L556.57 155L529.89 115.94L507.22 115.94L507.22 155M507.22 40.76L507.22 83.81L530.32 83.81Q543.34 83.81 549.74 78.14Q556.14 72.47 556.14 62.39Q556.14 52.10 549.74 46.43Q543.34 40.76 530.32 40.76 M704.55 155L635.04 155L635.04 8L704.55 8Q728.90 8 747.38 17.03Q765.87 26.06 776.26 42.55Q786.65 59.03 786.65 81.50Q786.65 103.97 776.26 120.45Q765.87 136.94 747.38 145.97Q728.90 155 704.55 155M676.62 41.18L676.62 121.82L702.87 121.82Q721.56 121.82 733.11 111.11Q744.65 100.40 744.65 81.50Q744.65 62.60 733.11 51.89Q721.56 41.18 702.87 41.18 M934.22 155L822.50 155L822.50 8L864.08 8L864.08 122.03L934.22 122.03 M1043.35 155L1001.77 155L1001.77 101.87L945.70 8L989.59 8L1024.24 66.38L1059.31 8L1099.63 8L1043.35 102.29';

  return (
    <footer
      id="footer"
      className="relative w-full bg-[#F8F4EC] text-[#382719] pt-8 sm:pt-10 pb-5 sm:pb-6 border-t border-[#EDE2CF] overflow-hidden select-none"
    >
      {/* Top Subtle Luxury Satin Ribbon Graphic */}
      <div className="absolute top-0 inset-x-0 h-5 pointer-events-none opacity-35 select-none overflow-hidden z-0">
        <svg viewBox="0 0 1440 20" fill="none" className="w-full h-full preserve-3d">
          <path
            d="M0,10 C320,20 480,-2 720,8 C960,20 1120,-2 1440,12 L1440,0 L0,0 Z"
            fill="url(#footerTopWaveGrad)"
          />
          <defs>
            <linearGradient id="footerTopWaveGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#DFCEAF" stopOpacity="0.4" />
              <stop offset="50%" stopColor="#C5A059" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#DFCEAF" stopOpacity="0.4" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* ========================================================================= */}
        {/* TOP ROW: LOGO ON TOP LEFT + SOCIAL LINKS IN BIG FONT ON TOP RIGHT         */}
        {/* ========================================================================= */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-3 sm:pb-4">
          {/* Top Left: Cardly Luxury Script Logo */}
          <div className="flex items-center">
            <Link href="/" className="inline-flex items-center gap-2 group focus:outline-none">
              <span className="font-script-luxury text-3xl sm:text-4xl lg:text-[44px] text-[#23180D] group-hover:text-[#8C6837] transition-colors leading-none">
                Cardly
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
        {/* CENTER: GIANT OVERSIZED LIQUID TYPOGRAPHY "CARDLY"                         */}
        {/* Clean, monolithic geometric vector path with continuous Royal Navy wave    */}
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

              {/* Pure Monolithic Vector Path for CARDLY */}
              <path id="cardlyCleanGlyphs" d={cardlyPath} />

              {/* Clip Mask strictly inside the clean letter boundaries */}
              <clipPath id="cardlyLiquidClip">
                <use href="#cardlyCleanGlyphs" />
              </clipPath>
            </defs>

            {/* Layer 1: Solid Luxury Base Fill with Crisp Outer Dark Outline (zero crossing lines) */}
            <use
              href="#cardlyCleanGlyphs"
              fill="url(#letterBaseGrad)"
              stroke="#382719"
              strokeWidth="2.2"
              strokeLinejoin="round"
            />

            {/* Layer 2: Liquid Wave Rising from Bottom to Top (Never completely blank) */}
            <g clipPath="url(#cardlyLiquidClip)">
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
            <use
              href="#cardlyCleanGlyphs"
              fill="none"
              stroke="#382719"
              strokeWidth="2.2"
              strokeLinejoin="round"
              opacity="0.95"
            />
          </svg>
        </div>

        {/* Delicate Hairline Divider */}
        <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-[#C5A059]/35 to-transparent my-3 sm:my-4" />

        {/* ========================================================================= */}
        {/* DOWN SIDE: NAVBAR THING BENEATH BIG CARDLY                                */}
        {/* Copyright notice on left + Navigation links on right                      */}
        {/* ========================================================================= */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-3 sm:gap-4 text-xs font-medium text-[#49341F] pt-1">
          {/* Copyright Notice */}
          <p className="text-[11.5px] sm:text-xs text-[#7A644E]">
            &copy; {new Date().getFullYear()} Cardly. All rights reserved. Exclusively digital stationery.
          </p>

          {/* Navigation Links ("navbar thing") */}
          <nav className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-xs font-medium text-[#49341F]">
            <Link href="/" className="hover:text-[#8C6837] transition-colors">
              Home
            </Link>
            <Link href="/templates" className="hover:text-[#8C6837] transition-colors">
              Templates
            </Link>
            <Link href="/customize/tpl-wedding-navy-01" className="hover:text-[#8C6837] transition-colors">
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
            transform: translateY(75px); /* 35% filled - rich liquid always active */
          }
          35% {
            transform: translateY(18px); /* 75% filled */
          }
          55% {
            transform: translateY(-38px); /* 100% completely full */
          }
          75% {
            transform: translateY(-38px); /* Glistening full state */
          }
          90% {
            transform: translateY(30px); /* Smooth ebb */
          }
          100% {
            transform: translateY(75px); /* Back to baseline */
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
