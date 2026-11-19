'use client';

import React, { useState, useEffect, useRef, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
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
  const searchParams = useSearchParams();
  const isDemo = searchParams.get('mode') === 'demo' || searchParams.get('demo') === 'true';
  const viewMode = searchParams.get('view') || 'laptop';
  const autoParam = searchParams.get('auto');
  
  // In demo mode or if auto=true/phone view, auto-advance slides every 2 seconds
  const shouldAutoAdvance = autoParam === 'true' || autoParam === '2000' || (isDemo && viewMode === 'phone');

  // ALWAYS start at CLOSED_GATE in demo mode so user experiences the grand gate entrance first!
  // "when user click on this then it all will start"
  const [lifecycleState, setLifecycleState] = useState(() => {
    return isDemo ? LIFECYCLE.CLOSED_GATE : LIFECYCLE.PRELOADER;
  });

  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);

  const audioRef = useRef(null);
  const mainRef = useRef(null);

  // 1. Audio setup, custom data injection and session check
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Read custom personalization parameters from URL or sessionStorage
    const params = new URLSearchParams(window.location.search);
    let custom = {};
    try {
      const stored = sessionStorage.getItem('ink_ivory_custom_wedding_data');
      if (stored) custom = JSON.parse(stored);
    } catch (e) {}

    const customNames = params.get('names') || custom.names;
    const customDate = params.get('date') || custom.date;
    const customTime = params.get('time') || custom.time;
    const customVenue = params.get('venue') || custom.venue;
    const customCity = params.get('city') || custom.city;
    const customBrideParents = params.get('brideParents') || custom.brideParents;
    const customGroomParents = params.get('groomParents') || custom.groomParents;

    if (customNames) weddingData.couple.names = customNames;
    if (customDate) weddingData.couple.dateDisplay = customDate;
    if (customTime) weddingData.couple.timeDisplay = customTime;
    if (customCity) weddingData.couple.cityDisplay = customCity;
    if (customVenue) weddingData.venue.name = customVenue;
    if (customBrideParents && weddingData.families?.brideSide) {
      weddingData.families.brideSide.parents = customBrideParents;
    }
    if (customGroomParents && weddingData.families?.groomSide) {
      weddingData.families.groomSide.parents = customGroomParents;
    }

    // In demo mode, do NOT skip the gate from sessionStorage
    if (!isDemo) {
      try {
        const alreadyEntered = sessionStorage.getItem('ink_ivory_gate_opened');
        if (alreadyEntered === 'true') {
          setLifecycleState(LIFECYCLE.ENTERED);
        }
      } catch (e) {
        // Ignore
      }
    }

    // Audio setup: Aaj Sajeya (Alaya F & Goldie Sohel - Saregama Music)
    const audioSrc = weddingData.music?.source || '/audio/aaj-sajeya.mp3';
    const audio = new Audio(audioSrc);
    audio.loop = true;
    audio.preload = 'auto';
    audio.volume = 0.6;
    audioRef.current = audio;

    audio.addEventListener('play', () => setIsPlaying(true));
    audio.addEventListener('pause', () => setIsPlaying(false));

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = '';
      }
    };
  }, [isDemo]);

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
    if (audioRef.current) {
      audioRef.current.muted = false;
      setIsMuted(false);
      audioRef.current.play().catch(() => {});
    }
  };

  const handleGateOpened = () => {
    setLifecycleState(LIFECYCLE.ENTERED);
    if (!isDemo) {
      try {
        sessionStorage.setItem('ink_ivory_gate_opened', 'true');
      } catch (e) {
        // Ignore
      }
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
      className="relative w-full h-full min-h-screen bg-[#091321] text-[#F7F0E3] font-manrope selection:bg-[#D6B477] selection:text-[#091321]"
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
        <SliderProvider
          active={lifecycleState === LIFECYCLE.ENTERED}
          autoAdvance={shouldAutoAdvance}
          autoInterval={2000}
        >
          {/* FLOATING LUXURY CONTROLS (Brand, Menu, Sound, Replay) - hide in phone demo mode for cleaner screen */}
          {(!isDemo || viewMode !== 'phone') && (
            <LuxuryFloatingNav
              isPlaying={isPlaying}
              isMuted={isMuted}
              onToggleSound={toggleSound}
              onReplayEntrance={handleReplayEntrance}
            />
          )}

          {/* HORIZONTAL SLIDE DECK (1 PAGE AT A TIME, RIGHT TO LEFT SLIDER) */}
          <HorizontalSlideDeck />
        </SliderProvider>
      )}
    </main>
  );
}

export default function Template01Page() {
  return (
    <Suspense
      fallback={
        <div className="w-screen h-screen bg-[#091321] flex items-center justify-center">
          <div className="w-8 h-8 rounded-full border-2 border-[#D6B477] border-t-transparent animate-spin" />
        </div>
      }
    >
      <Template01Content />
    </Suspense>
  );
}
