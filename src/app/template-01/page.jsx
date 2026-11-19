'use client';

import React, { useState, useEffect, useRef } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import { weddingData } from '@/data/weddingData';
import { LenisProvider, useLenis } from '@/context/LenisContext';
import { initSectionReveals } from '@/animations/scrollAnimations';

// Section 01: Preloader (Clean CSS radial gradient, no image file)
import Preloader from '@/components/template01/intro/Preloader';

// Sections 02 & 03: Grand Entrance & 3D Gate Opening Transition
import GrandEntranceGate from '@/components/template01/intro/GrandEntranceGate';

// Floating Luxury Navigation
import LuxuryFloatingNav from '@/components/template01/navigation/LuxuryFloatingNav';

// Sections 04–06: Core Invitation & Save the Date
import WelcomeSection from '@/components/template01/sections/WelcomeSection';
import SaveTheDateSection from '@/components/template01/sections/SaveTheDateSection';
import EventsOverviewSection from '@/components/template01/sections/EventsOverviewSection';

// Sections 08–12: Five Sacred Ceremonies (Right-side editorial text)
import HaldiSection from '@/components/template01/sections/HaldiSection';
import MehendiSection from '@/components/template01/sections/MehendiSection';
import SangeetSection from '@/components/template01/sections/SangeetSection';
import WeddingCeremonySection from '@/components/template01/sections/WeddingCeremonySection';
import ReceptionSection from '@/components/template01/sections/ReceptionSection';

// Sections 13–15: Blessings, Destination & Closing (NO RSVP)
import FamilyBlessingsSection from '@/components/template01/sections/FamilyBlessingsSection';
import VenueSection from '@/components/template01/sections/VenueSection';
import ClosingSection from '@/components/template01/sections/ClosingSection';

// Lifecycle State Machine Constants
const LIFECYCLE = {
  PRELOADER: 'PRELOADER',
  CLOSED_GATE: 'CLOSED_GATE',
  ENTERED: 'ENTERED',
};

function Template01Content() {
  const [lifecycleState, setLifecycleState] = useState(LIFECYCLE.PRELOADER);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  const audioRef = useRef(null);
  const lenisInstanceRef = useRef(null);
  const mainRef = useRef(null);
  const { setLenis } = useLenis();

  // 1. Check Session Storage on mount
  useEffect(() => {
    if (typeof window === 'undefined') return;

    try {
      const alreadyEntered = sessionStorage.getItem('ink_ivory_gate_opened');
      if (alreadyEntered === 'true') {
        setLifecycleState(LIFECYCLE.ENTERED);
      }
    } catch (e) {
      // Ignore
    }

    // Audio setup
    const audio = new Audio('/audio/indian-wedding-shehnai.mp3');
    audio.loop = true;
    audio.preload = 'auto';
    audio.volume = 0.5;
    audioRef.current = audio;

    audio.addEventListener('play', () => setIsPlaying(true));
    audio.addEventListener('pause', () => setIsPlaying(false));

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = '';
      }
    };
  }, []);

  // 2. Lock / Unlock body scroll based on lifecycleState
  useEffect(() => {
    if (typeof window === 'undefined') return;

    if (lifecycleState !== LIFECYCLE.ENTERED) {
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    };
  }, [lifecycleState]);

  // 3. Initialize single shared Lenis & ScrollTrigger ONLY after entering
  useEffect(() => {
    if (typeof window === 'undefined' || lifecycleState !== LIFECYCLE.ENTERED) return;

    gsap.registerPlugin(ScrollTrigger);

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      smoothWheel: true,
    });
    lenisInstanceRef.current = lenis;
    setLenis(lenis);

    lenis.on('scroll', ScrollTrigger.update);

    const updateLenis = (time) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(updateLenis);
    gsap.ticker.lagSmoothing(0);

    // Initialize editorial scroll reveals once
    const cleanupScrollAnimations = initSectionReveals(mainRef.current || document);

    // Refresh ScrollTrigger after DOM renders
    ScrollTrigger.refresh();

    return () => {
      cleanupScrollAnimations();
      gsap.ticker.remove(updateLenis);
      lenis.destroy();
      setLenis(null);
    };
  }, [lifecycleState, setLenis]);

  // Transition handlers
  const handlePreloaderComplete = () => {
    setLifecycleState(LIFECYCLE.CLOSED_GATE);
  };

  const handleGateInteraction = () => {
    if (audioRef.current && !isPlaying) {
      audioRef.current.play().catch(() => {});
    }
  };

  const handleGateOpened = () => {
    setLifecycleState(LIFECYCLE.ENTERED);
    try {
      sessionStorage.setItem('ink_ivory_gate_opened', 'true');
    } catch (e) {
      // Ignore
    }
  };

  const handleReplayEntrance = () => {
    if (lenisInstanceRef.current) {
      lenisInstanceRef.current.scrollTo(0, { immediate: true });
    } else {
      window.scrollTo({ top: 0, behavior: 'instant' });
    }
    setLifecycleState(LIFECYCLE.CLOSED_GATE);
  };

  const toggleSound = () => {
    if (!audioRef.current) return;
    if (isMuted) {
      audioRef.current.muted = false;
      setIsMuted(false);
      if (!isPlaying) {
        audioRef.current.play().catch(() => {});
      }
    } else {
      audioRef.current.muted = true;
      setIsMuted(true);
    }
  };

  return (
    <main
      ref={mainRef}
      className="relative min-h-screen bg-[#091321] text-[#F7F0E3] font-manrope selection:bg-[#D6B477] selection:text-[#091321]"
    >
      {/* SECTION 01 — PRELOADER (Clean CSS radial gradient, no image) */}
      {lifecycleState === LIFECYCLE.PRELOADER && (
        <Preloader onComplete={handlePreloaderComplete} />
      )}

      {/* SECTIONS 02 & 03 — GRAND ENTRANCE & 3D GATE OPENING */}
      {lifecycleState === LIFECYCLE.CLOSED_GATE && (
        <GrandEntranceGate
          weddingData={weddingData}
          onGateOpened={handleGateOpened}
          onGateInteraction={handleGateInteraction}
        />
      )}

      {/* RENDER INVITATION & NAVIGATION ONLY AFTER ENTERING */}
      {lifecycleState === LIFECYCLE.ENTERED && (
        <>
          {/* FLOATING LUXURY CONTROLS (Brand, Menu, Sound, Replay, Progress) */}
          <LuxuryFloatingNav
            isPlaying={isPlaying}
            isMuted={isMuted}
            onToggleSound={toggleSound}
            onReplayEntrance={handleReplayEntrance}
          />

          {/* SECTION 04 — WELCOME / INTRODUCTION */}
          <WelcomeSection />

          {/* SECTION 05 — SAVE THE DATE & LIVE COUNTDOWN */}
          <SaveTheDateSection />

          {/* SECTION 07 — WEDDING EVENTS OVERVIEW (5 ARTIFACT BADGES) */}
          <EventsOverviewSection />

          {/* SECTION 08 — HALDI CEREMONY (Right Side Text) */}
          <HaldiSection />

          {/* SECTION 09 — MEHENDI CEREMONY (Right Side Text) */}
          <MehendiSection />

          {/* SECTION 10 — SANGEET NIGHT (Right Side Text) */}
          <SangeetSection />

          {/* SECTION 11 — WEDDING CEREMONY (Right Side Text) */}
          <WeddingCeremonySection />

          {/* SECTION 12 — RECEPTION GALA (Right Side Text) */}
          <ReceptionSection />

          {/* SECTION 13 — OUR FAMILIES / BLESSINGS */}
          <FamilyBlessingsSection />

          {/* SECTION 14 — VENUE & LOCATION (GOOGLE MAPS) */}
          <VenueSection />

          {/* SECTION 15 — CLOSING / THANK YOU (WITH WISH LANTERNS) */}
          <ClosingSection />
        </>
      )}
    </main>
  );
}

export default function Template01Page() {
  return (
    <LenisProvider>
      <Template01Content />
    </LenisProvider>
  );
}
