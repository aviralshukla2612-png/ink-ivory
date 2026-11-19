'use client';

import React, { useRef, useState, useEffect } from 'react';
import Image from 'next/image';
import { GatePanel } from './GatePanel';
import { createGateOpeningTimeline } from '@/animations/gateTimeline';
import { Sparkles, ArrowRight } from 'lucide-react';

/**
 * WeddingGate Component
 * The signature cinematic double palace gate entrance sequence for Template 01.
 * Coordinates the 5-phase GSAP entrance sequence with audio synchronization.
 */
export const WeddingGate = ({ weddingData, onGateOpened, onGateInteraction = () => {} }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);

  const gateWrapperRef = useRef(null);
  const leftGateRef = useRef(null);
  const rightGateRef = useRef(null);
  const introContentRef = useRef(null);
  const palaceBgRef = useRef(null);
  const namesRef = useRef(null);
  const btnRef = useRef(null);

  // Trigger the 5-phase GSAP opening sequence
  const handleOpenInvitation = () => {
    if (hasInteracted) return;
    setHasInteracted(true);

    // Trigger audio immediately on user interaction
    if (typeof onGateInteraction === 'function') {
      onGateInteraction();
    }

    createGateOpeningTimeline({
      gateWrapperRef: gateWrapperRef.current,
      leftGateRef: leftGateRef.current,
      rightGateRef: rightGateRef.current,
      introContentRef: introContentRef.current,
      palaceBgRef: palaceBgRef.current,
      namesRef: namesRef.current,
      btnRef: btnRef.current,
      onComplete: () => {
        setIsOpen(true);
        if (typeof onGateOpened === 'function') {
          onGateOpened();
        }
      },
    });
  };

  // Allow immediate skip directly to celebration
  const handleSkip = () => {
    setIsOpen(true);
    if (typeof onGateInteraction === 'function') {
      onGateInteraction();
    }
    if (typeof onGateOpened === 'function') {
      onGateOpened();
    }
  };

  if (isOpen) return null;

  return (
    <div
      ref={gateWrapperRef}
      className="fixed inset-0 z-50 w-full h-full overflow-hidden bg-[#0A0E18] flex items-center justify-center select-none"
      style={{ perspective: '1400px' }}
    >
      {/* 1. Background Palace Courtyard (Revealed through opening gates) */}
      <div
        ref={palaceBgRef}
        className="absolute inset-0 z-0 pointer-events-none select-none"
      >
        <Image
          src={weddingData.couple.palaceBackground}
          alt="Royal Palace Courtyard"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
        {/* Soft Ambient Palace Lighting Vignette */}
        <div className="absolute inset-0 bg-radial from-transparent via-[#101624]/60 to-[#0A0E18]/90" />
      </div>

      {/* 2. Double Palace Gate Panels (Left & Right) */}
      <div className="absolute inset-0 z-10 flex w-full h-full pointer-events-none">
        {/* Left Gate Panel */}
        <div
          ref={leftGateRef}
          className="w-1/2 h-full flex-shrink-0"
          style={{ willChange: 'transform' }}
        >
          <GatePanel side="left" />
        </div>

        {/* Right Gate Panel */}
        <div
          ref={rightGateRef}
          className="w-1/2 h-full flex-shrink-0"
          style={{ willChange: 'transform' }}
        >
          <GatePanel side="right" />
        </div>
      </div>

      {/* 3. Center Royal Seal & Invitation Card (Floats over gate seam) */}
      <div
        ref={introContentRef}
        className="relative z-20 max-w-lg w-[90%] sm:w-[500px] p-8 sm:p-12 rounded-3xl bg-[#101624]/94 backdrop-blur-md border border-[#C5A46D]/60 shadow-[0_20px_70px_rgba(0,0,0,0.95),0_0_35px_rgba(197,164,109,0.25)] text-center flex flex-col items-center animate-in fade-in zoom-in-95 duration-700"
      >
        {/* Top Gold Crest / Lotus Medallion */}
        <div className="w-12 h-12 rounded-full border border-[#C5A46D] bg-[#172039] flex items-center justify-center mb-4 shadow-[0_0_15px_rgba(197,164,109,0.4)]">
          <Sparkles className="w-5 h-5 text-[#D8C39A]" />
        </div>

        {/* Eyebrow */}
        <div className="flex items-center gap-2 mb-3">
          <span className="w-6 h-px bg-gradient-to-r from-transparent to-[#C5A46D]" />
          <span className="text-[10px] sm:text-[11px] font-manrope font-semibold tracking-[0.3em] uppercase text-[#D8C39A]">
            {weddingData.couple.headline}
          </span>
          <span className="w-6 h-px bg-gradient-to-l from-transparent to-[#C5A46D]" />
        </div>

        {/* Couple Names in Cormorant Garamond with Script Ampersand */}
        <h1
          ref={namesRef}
          className="font-cormorant text-4xl sm:text-5xl md:text-[56px] text-[#FAF5ED] font-light tracking-wide leading-tight mb-3 drop-shadow-[0_2px_14px_rgba(0,0,0,0.9)] flex items-center justify-center gap-2"
        >
          <span>Aarav</span>
          <span className="font-script text-3xl sm:text-4xl md:text-5xl text-[#C5A46D] inline-block -rotate-6 mx-1">
            &
          </span>
          <span>Riya</span>
        </h1>

        {/* Subtitle */}
        <p className="font-playfair italic text-xs sm:text-sm text-[#D8C39A] max-w-sm mb-5 leading-relaxed">
          &ldquo;{weddingData.couple.subheading}&rdquo;
        </p>

        {/* Decorative Divider with Date & Venue */}
        <div className="flex items-center gap-2 mb-7 text-xs text-[#D8C39A]">
          <div className="h-[1px] w-8 sm:w-12 bg-gradient-to-r from-transparent to-[#C5A46D]" />
          <span className="text-[#C5A46D] text-[10px]">✦</span>
          <span className="font-manrope font-semibold tracking-widest text-[#FAF5ED] text-[11px] sm:text-xs">
            {weddingData.couple.dateDisplay}
          </span>
          <span className="text-[#C5A46D] text-[10px]">✦</span>
          <div className="h-[1px] w-8 sm:w-12 bg-gradient-to-l from-transparent to-[#C5A46D]" />
        </div>

        {/* Action Button: "Open Invitation" */}
        <button
          ref={btnRef}
          onClick={handleOpenInvitation}
          disabled={hasInteracted}
          className="group relative inline-flex items-center justify-center gap-2.5 px-8 sm:px-10 py-3.5 sm:py-4 rounded-full bg-gradient-to-r from-[#C5A46D] via-[#D8C39A] to-[#C5A46D] text-[#101624] text-xs sm:text-[13px] font-manrope font-bold uppercase tracking-widest shadow-[0_4px_25px_rgba(197,164,109,0.5)] hover:shadow-[0_6px_35px_rgba(197,164,109,0.7)] transition-all duration-300 hover:scale-[1.03] active:scale-[0.98] focus:outline-none cursor-pointer"
        >
          <span>Open Invitation</span>
          <ArrowRight className="w-4 h-4 stroke-[2.2] group-hover:translate-x-1 transition-transform" />

          {/* Shimmer light sweep */}
          <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/40 to-transparent rounded-full pointer-events-none" />
        </button>

        {/* Quick Skip Button */}
        <button
          onClick={handleSkip}
          className="mt-4 text-[11px] font-manrope text-[#89857E] hover:text-[#D8C39A] transition-colors underline-offset-4 hover:underline cursor-pointer"
        >
          Skip intro to celebration →
        </button>
      </div>
    </div>
  );
};

export default WeddingGate;
