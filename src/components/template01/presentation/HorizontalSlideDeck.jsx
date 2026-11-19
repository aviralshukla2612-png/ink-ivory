'use client';

import React from 'react';
import { useSearchParams } from 'next/navigation';
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

const SLIDE_COMPONENTS = [
  WelcomeSection,
  SaveTheDateSection,
  EventsOverviewSection,
  HaldiSection,
  MehendiSection,
  SangeetSection,
  WeddingCeremonySection,
  ReceptionSection,
  FamilyBlessingsSection,
  VenueSection,
  ClosingSection,
];

export const HorizontalSlideDeck = () => {
  const { currentSlide, nextSlide, prevSlide, isFirstSlide, isLastSlide } = useSlider();
  const searchParams = useSearchParams();
  const isPhoneView = searchParams.get('view') === 'phone';

  return (
    <div className="relative w-full h-full min-h-screen overflow-hidden bg-[#091321] select-none">
      {/* 1. ABSOLUTE SLIDE DECK: 100% width per slide, ZERO scrollbar drift, ZERO adjacent slide leaks */}
      {SLIDE_COMPONENTS.map((Component, idx) => {
        const offset = idx - currentSlide;
        const isNearby = Math.abs(offset) <= 2;

        return (
          <div
            key={idx}
            className="absolute inset-0 w-full h-full overflow-hidden will-change-transform transition-transform duration-700 ease-[cubic-bezier(0.25,1,0.5,1)]"
            style={{
              transform: `translate3d(${offset * 100}%, 0, 0)`,
              visibility: isNearby ? 'visible' : 'hidden',
              pointerEvents: offset === 0 ? 'auto' : 'none',
            }}
          >
            {isNearby && <Component />}
          </div>
        );
      })}

      {/* 2. FLOATING LEFT CHEVRON (PREVIOUS SLIDE) - Desktop/Laptop only, never covers phone text */}
      {!isPhoneView && !isFirstSlide && (
        <button
          type="button"
          onClick={prevSlide}
          className="hidden md:flex fixed left-4 lg:left-8 top-1/2 -translate-y-1/2 z-40 w-11 h-11 lg:w-13 lg:h-13 rounded-full bg-[#091321]/80 hover:bg-[#101b2d] backdrop-blur-md border border-[#D6B477]/40 hover:border-[#D6B477] text-[#E7CEA0] hover:text-[#FFFDF7] shadow-[0_4px_24px_rgba(0,0,0,0.85),0_0_15px_rgba(214,180,119,0.2)] items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 cursor-pointer focus:outline-none group"
          aria-label="Previous Slide"
        >
          <ChevronLeft className="w-5 h-5 lg:w-6 lg:h-6 group-hover:-translate-x-0.5 transition-transform" />
        </button>
      )}

      {/* 3. FLOATING RIGHT CHEVRON (NEXT SLIDE) - Desktop/Laptop only, never covers phone text */}
      {!isPhoneView && !isLastSlide && (
        <button
          type="button"
          onClick={nextSlide}
          className="hidden md:flex fixed right-4 lg:right-8 top-1/2 -translate-y-1/2 z-40 w-11 h-11 lg:w-13 lg:h-13 rounded-full bg-[#091321]/80 hover:bg-[#101b2d] backdrop-blur-md border border-[#D6B477]/40 hover:border-[#D6B477] text-[#E7CEA0] hover:text-[#FFFDF7] shadow-[0_4px_24px_rgba(0,0,0,0.85),0_0_15px_rgba(214,180,119,0.2)] items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 cursor-pointer focus:outline-none group"
          aria-label="Next Slide"
        >
          <ChevronRight className="w-5 h-5 lg:w-6 lg:h-6 group-hover:translate-x-0.5 transition-transform" />
        </button>
      )}
    </div>
  );
};

export default HorizontalSlideDeck;
