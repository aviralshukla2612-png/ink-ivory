'use client';

import React, { useState, useEffect, useRef } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import { weddingData } from '@/data/weddingData';

// Section 01: Preloader
import Preloader from '@/components/template01/intro/Preloader';

// Sections 02 & 03: Grand Entrance & Physical Gate Opening
import GrandEntranceGate from '@/components/template01/intro/GrandEntranceGate';

// Floating Luxury Navigation
import LuxuryFloatingNav from '@/components/template01/navigation/LuxuryFloatingNav';

// Sections 04–07: Core Invitation & Story
import WelcomeSection from '@/components/template01/sections/WelcomeSection';
import CoupleStorySection from '@/components/template01/sections/CoupleStorySection';
import SaveTheDateSection from '@/components/template01/sections/SaveTheDateSection';
import EventsOverviewSection from '@/components/template01/sections/EventsOverviewSection';

// Sections 08–12: Five Sacred Ceremonies
import HaldiSection from '@/components/template01/sections/HaldiSection';
import MehendiSection from '@/components/template01/sections/MehendiSection';
import SangeetSection from '@/components/template01/sections/SangeetSection';
import WeddingCeremonySection from '@/components/template01/sections/WeddingCeremonySection';
import ReceptionSection from '@/components/template01/sections/ReceptionSection';

// Sections 13–15: Blessings, Destination & Closing (NO RSVP)
import FamilyBlessingsSection from '@/components/template01/sections/FamilyBlessingsSection';
import VenueSection from '@/components/template01/sections/VenueSection';
import ClosingSection from '@/components/template01/sections/ClosingSection';

/**
 * Ink & Ivory — Template 01: Royal Indian Wedding
 * Complete 15-Section Cinematic Digital Wedding Invitation Website
 * - JavaScript implementation (page.jsx)
 * - All 15 background images integrated from /public/
 * - Physical dual-door 3D gate opening transition
 * - Five individual ceremony deep-dives (Haldi, Mehendi, Sangeet, Wedding, Reception)
 * - Absolutely NO RSVP
 * - 100% Configurable data model
 */
export default function Template01Page() {
  const [showPreloader, setShowPreloader] = useState(true);
  const [showGate, setShowGate] = useState(true);
  const [gateKey, setGateKey] = useState(1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  const audioRef = useRef(null);
  const lenisRef = useRef(null);

  // Initialize Lenis Smooth Scrolling & GSAP ScrollTrigger
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Check session storage
    try {
      const gateOpened = sessionStorage.getItem('ink_ivory_gate_opened');
      if (gateOpened === 'true') {
        setShowPreloader(false);
        setShowGate(false);
      }
    } catch (e) {
      // Ignore
    }

    gsap.registerPlugin(ScrollTrigger);

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      smoothWheel: true,
    });
    lenisRef.current = lenis;

    lenis.on('scroll', ScrollTrigger.update);

    const updateLenis = (time) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(updateLenis);
    gsap.ticker.lagSmoothing(0);

    // Audio setup
    const audio = new Audio('/audio/indian-wedding-shehnai.mp3');
    audio.loop = true;
    audio.preload = 'auto';
    audio.volume = 0.5;
    audioRef.current = audio;

    audio.addEventListener('play', () => setIsPlaying(true));
    audio.addEventListener('pause', () => setIsPlaying(false));

    return () => {
      lenis.destroy();
      gsap.ticker.remove(updateLenis);
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = '';
      }
    };
  }, []);

  const handlePreloaderComplete = () => {
    setShowPreloader(false);
  };

  const handleGateInteraction = () => {
    // Start audio on direct user interaction
    if (audioRef.current && !isPlaying) {
      audioRef.current.play().catch(() => {
        // Fallback if browser blocks
      });
    }
  };

  const handleGateOpened = () => {
    setShowGate(false);
    try {
      sessionStorage.setItem('ink_ivory_gate_opened', 'true');
    } catch (e) {
      // Ignore
    }
  };

  const handleReplayEntrance = () => {
    window.scrollTo({ top: 0, behavior: 'instant' });
    setGateKey((prev) => prev + 1);
    setShowGate(true);
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
    <main className="relative min-h-screen bg-[#091321] text-[#F7F0E3] font-manrope selection:bg-[#D6B477] selection:text-[#091321]">
      {/* SECTION 01 — PRELOADER */}
      {showPreloader && (
        <Preloader onComplete={handlePreloaderComplete} />
      )}

      {/* SECTIONS 02 & 03 — GRAND ENTRANCE & DUAL-DOOR GATE OPENING */}
      {showGate && (
        <GrandEntranceGate
          key={gateKey}
          weddingData={weddingData}
          onGateOpened={handleGateOpened}
          onGateInteraction={handleGateInteraction}
        />
      )}

      {/* FLOATING LUXURY CONTROLS (Brand, Menu, Sound, Replay, Progress) */}
      <LuxuryFloatingNav
        isPlaying={isPlaying}
        isMuted={isMuted}
        onToggleSound={toggleSound}
        onReplayEntrance={handleReplayEntrance}
      />

      {/* SECTION 04 — WELCOME / INTRODUCTION */}
      <WelcomeSection />

      {/* SECTION 05 — MEET THE COUPLE / OUR STORY */}
      <CoupleStorySection />

      {/* SECTION 06 — SAVE THE DATE & LIVE COUNTDOWN */}
      <SaveTheDateSection />

      {/* SECTION 07 — WEDDING EVENTS OVERVIEW (5 ARTIFACT BADGES) */}
      <EventsOverviewSection />

      {/* SECTION 08 — HALDI CEREMONY */}
      <HaldiSection />

      {/* SECTION 09 — MEHENDI CEREMONY */}
      <MehendiSection />

      {/* SECTION 10 — SANGEET NIGHT */}
      <SangeetSection />

      {/* SECTION 11 — WEDDING CEREMONY (SAAT PHERE MANDAP) */}
      <WeddingCeremonySection />

      {/* SECTION 12 — RECEPTION GALA */}
      <ReceptionSection />

      {/* SECTION 13 — OUR FAMILIES / BLESSINGS */}
      <FamilyBlessingsSection />

      {/* SECTION 14 — VENUE & LOCATION (GOOGLE MAPS) */}
      <VenueSection />

      {/* SECTION 15 — CLOSING / THANK YOU (WITH WISH LANTERNS) */}
      <ClosingSection />
    </main>
  );
}
