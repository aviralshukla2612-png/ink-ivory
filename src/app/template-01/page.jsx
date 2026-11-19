'use client';

import React, { useState, useEffect, useRef } from 'react';
import { weddingData } from '@/data/weddingData';
import { SliderProvider } from '@/context/SliderContext';

// Section 01: Preloader (Clean CSS radial gradient, no image file)
import Preloader from '@/components/template01/intro/Preloader';

// Sections 02 & 03: Grand Entrance & 3D Gate Opening Transition
import GrandEntranceGate from '@/components/template01/intro/GrandEntranceGate';

// Floating Luxury Navigation
import LuxuryFloatingNav from '@/components/template01/navigation/LuxuryFloatingNav';

// Horizontal Presentation: 1 Page At A Time (Right to Left Slider)
import HorizontalSlideDeck from '@/components/template01/presentation/HorizontalSlideDeck';

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
  const mainRef = useRef(null);

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

  // 2. Lock body scroll — Template 01 is a full-screen horizontal slide deck (1 page at a time)
  useEffect(() => {
    if (typeof window === 'undefined') return;
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    };
  }, []);

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

      {/* RENDER INVITATION HORIZONTAL SLIDER & NAVIGATION ONLY AFTER ENTERING */}
      {lifecycleState === LIFECYCLE.ENTERED && (
        <SliderProvider active={lifecycleState === LIFECYCLE.ENTERED}>
          {/* FLOATING LUXURY CONTROLS (Brand, Menu, Sound, Replay) */}
          <LuxuryFloatingNav
            isPlaying={isPlaying}
            isMuted={isMuted}
            onToggleSound={toggleSound}
            onReplayEntrance={handleReplayEntrance}
          />

          {/* HORIZONTAL SLIDE DECK (1 PAGE AT A TIME, RIGHT TO LEFT SLIDER) */}
          <HorizontalSlideDeck />
        </SliderProvider>
      )}
    </main>
  );
}

export default function Template01Page() {
  return <Template01Content />;
}
