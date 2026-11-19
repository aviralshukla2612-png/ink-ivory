'use client';

import React, { useRef, useState } from 'react';
import Image from 'next/image';
import gsap from 'gsap';
import { Sparkles, ArrowRight } from 'lucide-react';

/**
 * Sections 02 & 03: Grand Entrance & Physical Gate Opening Transition
 * - Photorealistic 16:9 royal Indian palace entrance
 * - Left and right door panels with 3D perspective rotation (outer hinges)
 * - Interior golden light flare and camera push-in
 * - Seamless transition into the wedding website
 */
export const GrandEntranceGate = ({
  weddingData,
  onGateOpened = () => {},
  onGateInteraction = () => {},
}) => {
  const [hasInteracted, setHasInteracted] = useState(false);

  const containerRef = useRef(null);
  const leftDoorRef = useRef(null);
  const rightDoorRef = useRef(null);
  const contentRef = useRef(null);
  const lightBloomRef = useRef(null);

  const handleOpenGate = () => {
    if (hasInteracted) return;
    setHasInteracted(true);

    if (typeof onGateInteraction === 'function') {
      onGateInteraction();
    }

    const tl = gsap.timeline({
      defaults: { ease: 'power2.inOut' },
      onComplete: () => {
        if (typeof onGateOpened === 'function') {
          onGateOpened();
        }
      },
    });

    // 1. Fade out the CTA content
    tl.to(contentRef.current, {
      opacity: 0,
      y: -25,
      duration: 0.5,
      ease: 'power2.out',
    });

    // 2. Light flare blooms from center seam
    tl.to(
      lightBloomRef.current,
      {
        opacity: 0.95,
        scale: 1.3,
        duration: 0.8,
        ease: 'power2.in',
      },
      '-=0.2'
    );

    // 3. 3D Door opening outwards from center seam
    tl.to(
      leftDoorRef.current,
      {
        rotateY: -75,
        xPercent: -40,
        opacity: 0,
        duration: 1.6,
        ease: 'power3.inOut',
      },
      '-=0.6'
    );

    tl.to(
      rightDoorRef.current,
      {
        rotateY: 75,
        xPercent: 40,
        opacity: 0,
        duration: 1.6,
        ease: 'power3.inOut',
      },
      '<='
    );

    // 4. Camera forward zoom push into the palace
    tl.to(
      containerRef.current,
      {
        scale: 1.08,
        opacity: 0,
        duration: 0.8,
        ease: 'power2.inOut',
      },
      '-=0.6'
    );
  };

  const handleSkip = () => {
    if (typeof onGateInteraction === 'function') {
      onGateInteraction();
    }
    if (typeof onGateOpened === 'function') {
      onGateOpened();
    }
  };

  const couple = weddingData?.couple || { names: 'Aarav & Riya' };

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-40 w-full h-full bg-[#091321] overflow-hidden select-none"
      style={{ perspective: '1400px' }}
    >
      {/* 3D Gate Doors Container (Split into Left & Right Panels) */}
      <div className="absolute inset-0 w-full h-full flex pointer-events-none overflow-hidden">
        {/* Left Gate Panel */}
        <div
          ref={leftDoorRef}
          className="relative w-1/2 h-full overflow-hidden origin-left"
          style={{ transformStyle: 'preserve-3d', willChange: 'transform, opacity' }}
        >
          <div className="absolute top-0 left-0 w-[200%] h-full">
            <Image
              src="/02_grand_entrance_closed_gate.png"
              alt="Grand Entrance Palace Gate - Left"
              fill
              priority
              sizes="100vw"
              className="object-cover object-center"
            />
          </div>
          {/* Subtle 3D edge shading */}
          <div className="absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-black/60 to-transparent pointer-events-none" />
        </div>

        {/* Right Gate Panel */}
        <div
          ref={rightDoorRef}
          className="relative w-1/2 h-full overflow-hidden origin-right"
          style={{ transformStyle: 'preserve-3d', willChange: 'transform, opacity' }}
        >
          <div className="absolute top-0 right-0 w-[200%] h-full">
            <Image
              src="/02_grand_entrance_closed_gate.png"
              alt="Grand Entrance Palace Gate - Right"
              fill
              priority
              sizes="100vw"
              className="object-cover object-center"
            />
          </div>
          {/* Subtle 3D edge shading */}
          <div className="absolute inset-y-0 left-0 w-8 bg-gradient-to-r from-black/60 to-transparent pointer-events-none" />
        </div>
      </div>

      {/* Center Golden Light Flare / Bloom (Revealed when doors crack open) */}
      <div
        ref={lightBloomRef}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[70vw] h-[80vh] rounded-full bg-gradient-to-r from-transparent via-[#FFF1C5] to-transparent blur-3xl opacity-0 pointer-events-none z-20"
      />

      {/* Atmospheric Vignette Overlay */}
      <div className="absolute inset-0 bg-radial-gradient from-transparent via-black/20 to-black/70 pointer-events-none z-10" />

      {/* Central Royal Invitation Badge & Gate Opener CTA */}
      <div
        ref={contentRef}
        className="relative z-30 flex flex-col items-center justify-center h-full px-4 text-center select-none"
      >
        <div className="max-w-[340px] sm:max-w-xl w-full flex flex-col items-center p-6 sm:p-10 rounded-2xl bg-[#091321]/85 backdrop-blur-md border border-[#D6B477]/40 shadow-[0_20px_60px_rgba(0,0,0,0.9),inset_0_0_30px_rgba(214,180,119,0.15)] animate-in fade-in zoom-in-95 duration-700">
          <div className="flex items-center gap-2 px-3 py-1 rounded-full border border-[#D6B477]/30 bg-[#D6B477]/10 text-[#E7CEA0] text-[10px] sm:text-[11px] font-manrope font-semibold tracking-[0.25em] uppercase mb-3">
            <Sparkles className="w-3.5 h-3.5 text-[#D6B477]" />
            <span>Royal Palace Invitation</span>
          </div>

          <p className="font-serif italic text-xs sm:text-sm text-[#D6B477] tracking-widest uppercase mb-1.5">
            The Wedding Celebration of
          </p>

          <h2 className="font-cormorant text-3xl sm:text-5xl md:text-6xl text-[#FAF5ED] font-medium leading-[1.0] tracking-tight mb-3 drop-shadow-md">
            {couple.names}
          </h2>

          <div className="flex items-center justify-center gap-3 my-2 mb-4 sm:mb-6">
            <div className="h-[1px] w-12 sm:w-16 bg-gradient-to-r from-transparent to-[#D6B477]" />
            <span className="text-xs text-[#D6B477]">✦</span>
            <div className="h-[1px] w-12 sm:w-16 bg-gradient-to-l from-transparent to-[#D6B477]" />
          </div>

          <p className="font-manrope text-[11px] sm:text-sm text-[#EFE3CD] leading-relaxed mb-6 sm:mb-8 max-w-xs sm:max-w-md">
            Step through the royal palace gates to immerse in sacred Vedic rituals, riverside festivities, and joyous wedding ceremonies.
          </p>

          {/* Enter Royal Celebration CTA Button */}
          <button
            type="button"
            onClick={handleOpenGate}
            className="group relative inline-flex items-center justify-center gap-2.5 px-6 sm:px-10 py-3 sm:py-4 rounded-full bg-gradient-to-r from-[#D6B477] via-[#E7CEA0] to-[#D6B477] text-[#091321] font-manrope text-xs sm:text-sm font-bold tracking-widest uppercase shadow-[0_10px_30px_rgba(214,180,119,0.4)] hover:shadow-[0_15px_40px_rgba(214,180,119,0.6)] transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer focus:outline-none"
          >
            <span>Enter Royal Celebration</span>
            <ArrowRight className="w-4 h-4 text-[#091321] group-hover:translate-x-1 transition-transform" />
          </button>

          {/* Quick Skip button */}
          <button
            type="button"
            onClick={handleSkip}
            className="mt-4 text-[10px] sm:text-[11px] font-manrope text-[#D6B477]/70 hover:text-[#FFFDF7] tracking-widest uppercase transition-colors underline underline-offset-4 cursor-pointer focus:outline-none"
          >
            Direct Access (Skip)
          </button>
        </div>
      </div>
    </div>
  );
};

export default GrandEntranceGate;
