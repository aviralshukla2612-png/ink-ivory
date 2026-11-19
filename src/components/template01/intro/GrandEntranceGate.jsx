'use client';

import React, { useRef, useState } from 'react';
import Image from 'next/image';
import gsap from 'gsap';
import { Sparkles, ArrowRight, Volume2 } from 'lucide-react';

/**
 * Sections 02 & 03: Grand Entrance & Gate Opening Transition
 * Uses ONLY the authentic high-resolution images:
 * - /02_grand_entrance_closed_gate.png
 * - /03_gate_opening_transition.png
 *
 * Smooth dual-panel split reveal from the center seam:
 * Left panel wipes left, right panel wipes right, revealing the open palace courtyard
 * with a golden light bloom and camera forward zoom.
 */
export const GrandEntranceGate = ({
  weddingData,
  onGateOpened = () => {},
  onGateInteraction = () => {},
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);

  const containerRef = useRef(null);
  const leftPanelRef = useRef(null);
  const rightPanelRef = useRef(null);
  const openBgRef = useRef(null);
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
        setIsOpen(true);
        if (typeof onGateOpened === 'function') {
          onGateOpened();
        }
      },
    });

    // 1. Fade out the CTA button
    tl.to(contentRef.current, {
      opacity: 0,
      y: -20,
      duration: 0.6,
      ease: 'power2.out',
    });

    // 2. Light flare blooms as doors part
    tl.to(
      lightBloomRef.current,
      {
        opacity: 0.8,
        duration: 1.1,
        ease: 'power1.in',
      },
      '-=0.2'
    );

    // 3. Smooth split of the closed gate along the center seam
    tl.to(
      leftPanelRef.current,
      {
        xPercent: -102,
        duration: 2.2,
        ease: 'power2.inOut',
      },
      '-=0.8'
    );

    tl.to(
      rightPanelRef.current,
      {
        xPercent: 102,
        duration: 2.2,
        ease: 'power2.inOut',
      },
      '<'
    );

    // 4. Reveal illuminated open palace courtyard with camera push
    tl.fromTo(
      openBgRef.current,
      { scale: 1.08, opacity: 0.7 },
      { scale: 1.0, opacity: 1, duration: 2.3, ease: 'power2.out' },
      '<'
    );

    // 5. Light bloom recedes
    tl.to(
      lightBloomRef.current,
      {
        opacity: 0,
        duration: 0.8,
        ease: 'power2.out',
      },
      '-=0.6'
    );

    // 6. Smoothly fade entrance container into the Welcome section
    tl.to(
      containerRef.current,
      {
        opacity: 0,
        duration: 0.9,
        ease: 'power2.inOut',
      },
      '+=0.1'
    );
  };

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
      ref={containerRef}
      className="fixed inset-0 z-40 w-full h-full bg-[#091321] overflow-hidden select-none"
    >
      {/* LAYER 1 (Behind): The Open Gate / Illuminated Courtyard (03_gate_opening_transition.png) */}
      <div
        ref={openBgRef}
        className="absolute inset-0 w-full h-full pointer-events-none"
        style={{ willChange: 'transform, opacity' }}
      >
        <Image
          src="/03_gate_opening_transition.png"
          alt="Royal Palace Open Gate"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#091321]/60 via-transparent to-[#091321]/40" />
      </div>

      {/* LAYER 2 (Front Split Panels): Closed Gate (02_grand_entrance_closed_gate.png) */}
      <div className="absolute inset-0 w-full h-full flex pointer-events-none overflow-hidden">
        {/* Left Panel (0 to 50%) */}
        <div
          ref={leftPanelRef}
          className="relative w-1/2 h-full overflow-hidden"
          style={{ willChange: 'transform' }}
        >
          <div className="absolute top-0 left-0 w-[200%] h-full">
            <Image
              src="/02_grand_entrance_closed_gate.png"
              alt="Left Gate Panel"
              fill
              priority
              sizes="100vw"
              className="object-cover object-center"
            />
          </div>
          {/* Subtle center seam shadow */}
          <div className="absolute inset-y-0 right-0 w-4 bg-gradient-to-l from-black/60 to-transparent pointer-events-none" />
        </div>

        {/* Right Panel (50% to 100%) */}
        <div
          ref={rightPanelRef}
          className="relative w-1/2 h-full overflow-hidden"
          style={{ willChange: 'transform' }}
        >
          <div className="absolute top-0 right-0 w-[200%] h-full">
            <Image
              src="/02_grand_entrance_closed_gate.png"
              alt="Right Gate Panel"
              fill
              priority
              sizes="100vw"
              className="object-cover object-center"
            />
          </div>
          {/* Subtle center seam shadow */}
          <div className="absolute inset-y-0 left-0 w-4 bg-gradient-to-r from-black/60 to-transparent pointer-events-none" />
        </div>
      </div>

      {/* Golden Light Bloom Flare (triggers during door parting) */}
      <div
        ref={lightBloomRef}
        className="absolute inset-0 pointer-events-none opacity-0 bg-radial-gradient from-[#FFF3D6] via-[#D6B477]/60 to-transparent mix-blend-screen"
        style={{ willChange: 'opacity' }}
      />

      {/* Ambient Floating Lantern Sparkles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-[#E7CEA0] opacity-60 animate-pulse"
            style={{
              width: `${(i % 3) * 2 + 2}px`,
              height: `${(i % 3) * 2 + 2}px`,
              top: `${15 + (i * 7) % 70}%`,
              left: `${10 + (i * 13) % 80}%`,
              animationDuration: `${2.5 + (i % 4)}s`,
              animationDelay: `${i * 0.3}s`,
              boxShadow: '0 0 8px rgba(231,206,160,0.8)',
            }}
          />
        ))}
      </div>

      {/* CLEAN INTERACTIVE CTA BUTTON (Centered at the bottom, no bulky dark boxes) */}
      <div
        ref={contentRef}
        className="absolute inset-x-0 bottom-12 sm:bottom-16 z-20 flex flex-col items-center text-center px-6 pointer-events-auto"
      >
        <button
          type="button"
          onClick={handleOpenGate}
          className="group relative inline-flex items-center justify-center gap-3 px-8 sm:px-11 py-3.5 sm:py-4 rounded-full bg-gradient-to-r from-[#101B2B]/90 via-[#1A2840]/90 to-[#101B2B]/90 backdrop-blur-md border border-[#D6B477] text-[#FAF5ED] font-cormorant text-xl sm:text-2xl tracking-[0.2em] uppercase shadow-[0_10px_35px_rgba(0,0,0,0.85),0_0_20px_rgba(214,180,119,0.35)] hover:shadow-[0_12px_45px_rgba(214,180,119,0.55)] transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer overflow-hidden"
        >
          {/* Shimmer sweep */}
          <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-[#D6B477]/30 to-transparent pointer-events-none" />

          <Sparkles className="w-4 h-4 text-[#D6B477] animate-pulse" />
          <span className="font-semibold text-[#F7F0E3]">
            Enter Wedding
          </span>
          <ArrowRight className="w-5 h-5 text-[#D6B477] group-hover:translate-x-1 transition-transform" />
        </button>

        {/* Audio note */}
        <div className="mt-3 flex items-center gap-1.5 text-[11px] font-manrope text-[#E7CEA0]/90 drop-shadow-md">
          <Volume2 className="w-3.5 h-3.5 text-[#D6B477]" />
          <span>Includes Royal Shehnai celebration melody</span>
        </div>

        {/* Skip button */}
        <button
          onClick={handleSkip}
          className="mt-3 text-[11px] font-manrope text-[#E7CEA0]/70 hover:text-[#E7CEA0] transition-colors underline-offset-4 hover:underline cursor-pointer"
        >
          Skip intro →
        </button>
      </div>
    </div>
  );
};

export default GrandEntranceGate;
