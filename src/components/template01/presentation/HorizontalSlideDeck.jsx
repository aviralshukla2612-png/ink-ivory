'use client';

import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useSlider } from '@/context/SliderContext';

// 11 Wedding Slides
import WelcomeSection from '@/components/template01/sections/WelcomeSection';
import SaveTheDateSection from '@/components/template01/sections/SaveTheDateSection';
import EventsOverviewSection from '@/components/template01/sections/EventsOverviewSection';
import HaldiSection from '@/components/template01/sections/HaldiSection';
import MehendiSection from '@/components/template01/sections/MehendiSection';
import SangeetSection from '@/components/template01/sections/SangeetSection';
import WeddingCeremonySection from '@/components/template01/sections/WeddingCeremonySection';
import ReceptionSection from '@/components/template01/sections/ReceptionSection';
import FamilyBlessingsSection from '@/components/template01/sections/FamilyBlessingsSection';
import VenueSection from '@/components/template01/sections/VenueSection';
import ClosingSection from '@/components/template01/sections/ClosingSection';

export const HorizontalSlideDeck = () => {
  const { currentSlide, nextSlide, prevSlide, isFirstSlide, isLastSlide } = useSlider();

  return (
    <div className="relative w-full h-full min-h-screen overflow-hidden bg-[#091321] select-none">
      {/* 1. HORIZONTAL SLIDE TRACK (Right to Left 1 page at a time) */}
      <div
        className="flex w-full h-full transition-transform duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] will-change-transform"
        style={{ transform: `translateX(-${currentSlide * 100}%)` }}
      >
        {/* SLIDE 01: WELCOME / INTRO */}
        <div className="w-full h-full min-w-full min-h-screen flex-shrink-0 relative overflow-hidden">
          <WelcomeSection />
        </div>

        {/* SLIDE 02: SAVE THE DATE */}
        <div className="w-full h-full min-w-full min-h-screen flex-shrink-0 relative overflow-hidden">
          <SaveTheDateSection />
        </div>

        {/* SLIDE 03: CELEBRATIONS OVERVIEW */}
        <div className="w-full h-full min-w-full min-h-screen flex-shrink-0 relative overflow-hidden">
          <EventsOverviewSection />
        </div>

        {/* SLIDE 04: HALDI CEREMONY */}
        <div className="w-full h-full min-w-full min-h-screen flex-shrink-0 relative overflow-hidden">
          <HaldiSection />
        </div>

        {/* SLIDE 05: MEHENDI CEREMONY */}
        <div className="w-full h-full min-w-full min-h-screen flex-shrink-0 relative overflow-hidden">
          <MehendiSection />
        </div>

        {/* SLIDE 06: SANGEET NIGHT */}
        <div className="w-full h-full min-w-full min-h-screen flex-shrink-0 relative overflow-hidden">
          <SangeetSection />
        </div>

        {/* SLIDE 07: WEDDING CEREMONY */}
        <div className="w-full h-full min-w-full min-h-screen flex-shrink-0 relative overflow-hidden">
          <WeddingCeremonySection />
        </div>

        {/* SLIDE 08: IMPERIAL RECEPTION */}
        <div className="w-full h-full min-w-full min-h-screen flex-shrink-0 relative overflow-hidden">
          <ReceptionSection />
        </div>

        {/* SLIDE 09: FAMILY BLESSINGS */}
        <div className="w-full h-full min-w-full min-h-screen flex-shrink-0 relative overflow-hidden">
          <FamilyBlessingsSection />
        </div>

        {/* SLIDE 10: VENUE & LOCATION */}
        <div className="w-full h-full min-w-full min-h-screen flex-shrink-0 relative overflow-hidden">
          <VenueSection />
        </div>

        {/* SLIDE 11: CLOSING & WISH LANTERNS */}
        <div className="w-full h-full min-w-full min-h-screen flex-shrink-0 relative overflow-hidden">
          <ClosingSection />
        </div>
      </div>

      {/* 2. FLOATING LEFT CHEVRON (PREVIOUS SLIDE) */}
      {!isFirstSlide && (
        <button
          type="button"
          onClick={prevSlide}
          className="fixed left-3 sm:left-6 top-1/2 -translate-y-1/2 z-40 w-11 h-11 sm:w-13 sm:h-13 rounded-full bg-[#091321]/80 hover:bg-[#101b2d] backdrop-blur-md border border-[#D6B477]/40 hover:border-[#D6B477] text-[#E7CEA0] hover:text-[#FFFDF7] shadow-[0_4px_24px_rgba(0,0,0,0.85),0_0_15px_rgba(214,180,119,0.2)] flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 cursor-pointer focus:outline-none group"
          aria-label="Previous Slide"
        >
          <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 group-hover:-translate-x-0.5 transition-transform" />
        </button>
      )}

      {/* 3. FLOATING RIGHT CHEVRON (NEXT SLIDE) */}
      {!isLastSlide && (
        <button
          type="button"
          onClick={nextSlide}
          className="fixed right-3 sm:right-6 top-1/2 -translate-y-1/2 z-40 w-11 h-11 sm:w-13 sm:h-13 rounded-full bg-[#091321]/80 hover:bg-[#101b2d] backdrop-blur-md border border-[#D6B477]/40 hover:border-[#D6B477] text-[#E7CEA0] hover:text-[#FFFDF7] shadow-[0_4px_24px_rgba(0,0,0,0.85),0_0_15px_rgba(214,180,119,0.2)] flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 cursor-pointer focus:outline-none group"
          aria-label="Next Slide"
        >
          <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 group-hover:translate-x-0.5 transition-transform" />
        </button>
      )}
    </div>
  );
};

export default HorizontalSlideDeck;
