"use client";

import React from "react";
import Image from "next/image";
import { Heart, Sparkles, ArrowDown } from "lucide-react";

export default function DatePlannerHero({
  recipientName = "Riya",
  senderName = "Aarav",
  date = "",
  heading = "Our Perfect Date ♡",
  eyebrow = "LET'S PLAN",
  description = "Tell me what you'd love most, and I'll plan every detail for an unforgettable time together.",
  onStartPlanning,
}) {
  return (
    <section className="relative min-h-[85vh] sm:min-h-[92vh] flex items-center justify-center px-4 py-12 sm:py-20 overflow-hidden bg-gradient-to-b from-[#FFF2ED] via-[#F9E4DE] to-[#FFF2ED]">
      {/* Background Subtle Gradient & Glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#E7A5A4]/20 rounded-full blur-3xl" />
        <div className="absolute bottom-10 left-10 w-80 h-80 bg-[#B51F3B]/10 rounded-full blur-2xl" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto flex flex-col lg:flex-row items-center gap-8 lg:gap-16">
        {/* Left Column: Romantic Content */}
        <div className="flex-1 text-center lg:text-left">
          {/* Eyebrow Pill */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#B51F3B]/10 border border-[#B51F3B]/20 text-[#B51F3B] text-xs font-semibold tracking-[0.25em] uppercase mb-4 sm:mb-6 shadow-sm">
            <Heart className="w-3.5 h-3.5 fill-[#B51F3B]" />
            {eyebrow}
          </div>

          {/* Heading */}
          <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl text-[#641A2A] font-bold tracking-tight leading-[1.15] mb-4 sm:mb-5">
            {heading}
          </h1>

          {/* Personalized Message */}
          <p className="text-sm sm:text-lg text-[#50363A]/85 max-w-xl mx-auto lg:mx-0 font-normal leading-relaxed mb-4">
            {description}
          </p>

          <div className="font-serif italic text-lg sm:text-xl text-[#B51F3B] mb-6 sm:mb-8">
            For {recipientName} &bull; With love, {senderName}
            {date && (
              <span className="block text-xs sm:text-sm font-sans font-semibold tracking-wide text-[#641A2A] mt-2">
                ✦ Planned Date: {date} ✦
              </span>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center justify-center lg:justify-start">
            <button
              type="button"
              onClick={onStartPlanning}
              className="w-full sm:w-auto flex items-center justify-center gap-2.5 px-8 sm:px-9 py-3.5 sm:py-4 rounded-full bg-gradient-to-r from-[#B51F3B] to-[#641A2A] hover:from-[#9c1830] hover:to-[#4e1320] text-[#FFF9F4] font-medium text-sm sm:text-base shadow-[0_10px_25px_rgba(181,31,59,0.35)] hover:shadow-[0_15px_35px_rgba(181,31,59,0.45)] hover:scale-[1.03] active:scale-[0.98] transition-all cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-amber-200" />
              <span>Customize Our Date ♡</span>
              <ArrowDown className="w-4 h-4 ml-1" />
            </button>
          </div>
        </div>

        {/* Right Column: Romantic Visual Composition */}
        <div className="flex-1 relative w-full max-w-[290px] sm:max-w-md lg:max-w-lg aspect-square">
          {/* Main Sunset Date Photo with luxury border & shadow */}
          <div className="relative w-full h-full rounded-3xl overflow-hidden border-8 border-[#FFF9F4] shadow-2xl rotate-1 hover:rotate-0 transition-transform duration-500">
            <Image
              src="/images/date-planner/sunset-date.jpg"
              alt="Romantic Sunset Date"
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
            <div className="absolute bottom-4 left-4 right-4 text-white text-xs font-serif italic text-center drop-shadow-md">
              &ldquo;Every moment with you is my favorite memory.&rdquo;
            </div>
          </div>

          {/* Overlapping Floating Rose & Candle Accent */}
          <div className="absolute -bottom-6 -left-6 w-36 h-36 sm:w-44 sm:h-44 rounded-2xl overflow-hidden border-4 border-[#FFF9F4] shadow-xl -rotate-6 hidden sm:block">
            <Image
              src="/images/date-planner/rose-candle.png"
              alt="Candlelight & Roses"
              fill
              className="object-cover"
            />
          </div>

          {/* Wax Seal Floating Badge */}
          <div className="absolute -top-4 -right-4 w-20 h-20 rounded-full bg-gradient-to-br from-[#B51F3B] to-[#641A2A] text-white p-2 shadow-xl flex flex-col items-center justify-center rotate-12 border-2 border-[#FFF9F4]">
            <Heart className="w-5 h-5 fill-white mb-0.5" />
            <span className="text-[9px] uppercase tracking-wider font-serif font-bold text-center">
              You Are Mine
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
