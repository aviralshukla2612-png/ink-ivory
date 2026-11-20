'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Edit3 } from 'lucide-react';

export const HeroSection: React.FC = () => {
  return (
    <section id="hero" className="relative w-full h-[calc(100vh-68px)] sm:h-[calc(100vh-76px)] min-h-[560px] max-h-[860px] overflow-hidden bg-[#F8F4EC] flex items-center">
      {/* Background Image: Covers entire hero area seamlessly with responsive modern WebP */}
      <div className="absolute inset-0 z-0 pointer-events-none select-none">
        <picture className="w-full h-full block">
          <source media="(max-width: 767px)" srcSet="/herobg-mobile.webp" type="image/webp" />
          <source media="(min-width: 768px)" srcSet="/herobg.webp" type="image/webp" />
          <img
            src="/herobg.webp"
            alt="You Are Mine luxury digital invitation web pages composition"
            fetchPriority="high"
            decoding="async"
            className="w-full h-full object-cover object-[85%_center] xl:object-right"
          />
        </picture>
        {/* Soft left gradient overlay for contrast */}
        <div className="absolute inset-y-0 left-0 w-full lg:w-[48%] bg-gradient-to-r from-[#F8F4EC]/90 via-[#F8F4EC]/60 to-transparent pointer-events-none" />
      </div>

      {/* Hero Content Container */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 flex items-center h-full">
        <div className="w-full lg:w-[48%] xl:w-[45%] flex flex-col justify-center">
          
          {/* Eyebrow text */}
          <div className="mb-2.5 sm:mb-3">
            <span className="text-[10.5px] sm:text-[11.5px] font-semibold tracking-[0.24em] text-[#8C6837] uppercase">
              Personalized Event Web Pages
            </span>
          </div>

          {/* Main Headline with dedicated vertical spacing between Line 1 and Line 2 */}
          <h1 className="flex flex-col gap-2.5 sm:gap-3.5 lg:gap-4 mb-4 sm:mb-5">
            <span className="hero-headline text-3xl sm:text-4xl md:text-[40px] lg:text-[44px] xl:text-[48px] leading-tight tracking-tight">
              Elegant Web Pages for
            </span>
            <span className="text-3xl sm:text-4xl md:text-[40px] lg:text-[44px] xl:text-[48px] leading-tight tracking-tight">
              <span className="hero-headline text-[#261A0F]">Life&apos;s</span>{' '}
              <span className="hero-special-moments">
                Special Moments
              </span>
            </span>
          </h1>

          {/* Supporting description */}
          <p className="text-xs sm:text-[13.5px] lg:text-sm text-[#574330] leading-[1.6] max-w-md mb-6 sm:mb-7 font-normal">
            Create sophisticated, bespoke web pages for weddings, engagements,
            anniversaries and milestone celebrations.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-wrap items-center gap-3 sm:gap-4 mb-6 sm:mb-8">
            {/* Primary Button */}
            <Link
              href="/templates"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 text-xs sm:text-[13px] font-semibold text-white bg-[#8C6D37] hover:bg-[#785C2D] rounded-lg shadow-xs hover:shadow-gold transition-all duration-150 group"
            >
              <span>Explore Collections</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </Link>

            {/* Secondary Button */}
            <Link
              href="/customize/tpl-wedding-navy-01"
              className="inline-flex items-center justify-center gap-2 px-5 py-3 text-xs sm:text-[13px] font-medium text-[#49341F] bg-white hover:bg-[#FCFAF6] border border-[#8C6D37]/50 hover:border-[#8C6D37] rounded-lg shadow-xs transition-all duration-150"
            >
              <Edit3 className="w-3.5 h-3.5 text-[#8C6D37]" />
              <span>Create Your Page</span>
            </Link>
          </div>

          {/* Benefits Row matching screenshot icons */}
          <div className="flex flex-wrap items-center gap-5 sm:gap-7 pt-1 text-[#49341F]">
            {/* Premium Designs (Diamond) */}
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 stroke-[#8C6D37] fill-none" viewBox="0 0 24 24" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 3h12l4 6-10 12L2 9z" />
                <path d="M10 3l2 6 2-6" />
                <path d="M2 9h20" />
              </svg>
              <span className="text-[11.5px] sm:text-xs font-medium text-[#3E2B19]">
                Premium Designs
              </span>
            </div>

            {/* Fully Customizable (Pen/Sliders) */}
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 stroke-[#8C6D37] fill-none" viewBox="0 0 24 24" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 20h9" />
                <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
              </svg>
              <span className="text-[11.5px] sm:text-xs font-medium text-[#3E2B19]">
                Fully Customizable
              </span>
            </div>

            {/* Instant Digital Download */}
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 stroke-[#8C6D37] fill-none" viewBox="0 0 24 24" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
              <span className="text-[11.5px] sm:text-xs font-medium text-[#3E2B19]">
                Instant Live Publishing
              </span>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
