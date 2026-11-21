'use client';

import React, { useState, useRef, useEffect } from 'react';
import { valentineData } from '@/data/valentineData';
import { ValentineHeader } from '@/components/valentine/ValentineHeader';
import { OpeningExperience } from '@/components/valentine/OpeningExperience';
import { ProposalSection } from '@/components/valentine/ProposalSection';
import { YesCelebration } from '@/components/valentine/YesCelebration';
import { OurStory } from '@/components/valentine/OurStory';
import { LoveLetter } from '@/components/valentine/LoveLetter';
import { MemoryGallery } from '@/components/valentine/MemoryGallery';
import { WhyYou } from '@/components/valentine/WhyYou';
import { FinalCelebration } from '@/components/valentine/FinalCelebration';
import { HeartParticles } from '@/components/common/HeartParticles';
import { RosePetals } from '@/components/common/RosePetals';
import { AnimatePresence } from 'framer-motion';

export default function ValentinePage() {
  const [data, setData] = useState(() => {
    // Clone valentineData for local reactivity
    return JSON.parse(JSON.stringify(valentineData));
  });

  const [showOpening, setShowOpening] = useState(true);
  const [hasAccepted, setHasAccepted] = useState(false);
  const [showCelebrationModal, setShowCelebrationModal] = useState(false);
  const [triggerHeartExplosion, setTriggerHeartExplosion] = useState(false);
  const [musicPlaying, setMusicPlaying] = useState(false);

  const audioRef = useRef(null);
  const proposalRef = useRef(null);

  // Check URL params on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      // Skip opening if in studio demo mode
      if (urlParams.get('mode') === 'demo') {
        setShowOpening(false);
      }
      if (urlParams.get('recipientName') || urlParams.get('names')) {
        const rawNames = urlParams.get('recipientName') || urlParams.get('names') || '';
        const parts = rawNames.split(/&|\band\b/i).map(s => s.trim());
        setData((prev) => ({
          ...prev,
          senderName: parts[0] || prev.senderName,
          recipientName: parts[1] || parts[0] || prev.recipientName,
        }));
      }
      if (urlParams.get('date')) {
        const d = urlParams.get('date');
        setData((prev) => ({
          ...prev,
          date: d,
          letter: { ...prev.letter, date: d },
        }));
      }
      // Check stored custom values
      try {
        const stored = sessionStorage.getItem('ink_ivory_custom_valentine');
        if (stored) {
          const parsed = JSON.parse(stored);
          setData((prev) => {
            const next = { ...prev };
            if (parsed.names) {
              const parts = parsed.names.split(/&|\band\b/i).map(s => s.trim());
              if (parts.length >= 2) {
                next.senderName = parts[0];
                next.recipientName = parts[1];
              } else {
                next.recipientName = parsed.names;
              }
            }
            if (parsed.date) {
              next.date = parsed.date;
              if (next.letter) next.letter.date = parsed.date;
              if (next.story && next.story[4]) next.story[4].date = parsed.date;
            }
            if (parsed.headline && next.proposal) next.proposal.heading = parsed.headline;
            if (parsed.message && next.proposal) next.proposal.subheading = parsed.message;
            if (parsed.letterMessage && next.letter) next.letter.paragraphs = [parsed.letterMessage];
            if (parsed.story && Array.isArray(parsed.story) && next.story) {
              parsed.story.forEach((st, idx) => {
                if (next.story[idx]) {
                  if (st.title) next.story[idx].title = st.title;
                  if (st.date) next.story[idx].date = st.date;
                  if (st.description) next.story[idx].description = st.description;
                }
              });
            }
            return next;
          });
        }
      } catch (e) {}
      if (urlParams.get('audioSource')) {
        const src = urlParams.get('audioSource');
        setData((prev) => ({
          ...prev,
          music: { ...prev.music, source: src },
        }));
        if (audioRef.current) {
          audioRef.current.src = src;
          audioRef.current.load();
        }
      }
    }
  }, []);

  // Listen for Live Studio postMessage updates
  useEffect(() => {
    const handleMessage = (e) => {
      if (!e.data) return;
      if (e.data.type === 'INK_IVORY_CUSTOM_UPDATE') {
        const p = e.data.payload || {};
        setData((prev) => {
          const updated = { ...prev };
          if (p.names) {
            const parts = p.names.split(/&|\band\b/i).map(s => s.trim());
            if (parts.length >= 2) {
              updated.senderName = parts[0];
              updated.recipientName = parts[1];
            } else {
              updated.recipientName = p.names;
            }
          }
          if (p.headline) {
            updated.proposal.heading = p.headline;
          }
          if (p.message) {
            updated.proposal.subheading = p.message;
          }
          if (p.letterMessage) {
            updated.letter.paragraphs = [p.letterMessage];
          }
          if (p.date) {
            updated.date = p.date;
            if (updated.letter) updated.letter.date = p.date;
            if (updated.story && updated.story[4]) updated.story[4].date = p.date;
          }
          if (p.story && Array.isArray(p.story) && updated.story) {
            p.story.forEach((st, idx) => {
              if (updated.story[idx]) {
                if (st.title) updated.story[idx].title = st.title;
                if (st.date) updated.story[idx].date = st.date;
                if (st.description) updated.story[idx].description = st.description;
              }
            });
          }
          if (p.audioSource && audioRef.current) {
            if (!audioRef.current.src.endsWith(p.audioSource)) {
              audioRef.current.src = p.audioSource;
              audioRef.current.load();
              if (musicPlaying) {
                audioRef.current.play().catch(() => {});
              }
            }
          }
          if (p.audioStartTime !== undefined && audioRef.current) {
            audioRef.current.currentTime = parseFloat(p.audioStartTime);
          }
          return updated;
        });
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [musicPlaying]);

  // Set initial audio volume
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = 0.6;
    }
  }, []);

  const toggleMusic = () => {
    if (!audioRef.current) return;
    if (musicPlaying) {
      audioRef.current.pause();
      setMusicPlaying(false);
    } else {
      audioRef.current
        .play()
        .then(() => setMusicPlaying(true))
        .catch((err) => console.warn('Audio play blocked:', err));
    }
  };

  const handleOpenInvitation = () => {
    setShowOpening(false);
    if (audioRef.current && !musicPlaying) {
      audioRef.current
        .play()
        .then(() => setMusicPlaying(true))
        .catch((err) => console.warn('Audio play blocked:', err));
    }
  };

  const handleSkipOpening = () => {
    setShowOpening(false);
  };

  const handleAcceptProposal = () => {
    setHasAccepted(true);
    setTriggerHeartExplosion(true);
    setShowCelebrationModal(true);

    if (audioRef.current && !musicPlaying) {
      audioRef.current
        .play()
        .then(() => setMusicPlaying(true))
        .catch(() => {});
    }
  };

  const handleExploreStory = () => {
    const el = document.getElementById('our-story');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleReplay = () => {
    setHasAccepted(false);
    setShowCelebrationModal(false);
    setTriggerHeartExplosion(false);
    if (proposalRef.current) {
      proposalRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="relative min-h-screen bg-[#FFF4F0] text-[#4B3035] selection:bg-[#F6D3D0] selection:text-[#641D2B]">
      {/* Background Audio */}
      <audio
        ref={audioRef}
        src={data.music.source}
        loop
        preload="auto"
      />

      {/* Ambient Falling Rose Petals */}
      <RosePetals active={true} count={24} />

      {/* Heart Explosion Particle Burst upon YES */}
      <HeartParticles
        trigger={triggerHeartExplosion}
        onComplete={() => setTriggerHeartExplosion(false)}
      />

      {/* Opening Intro Experience */}
      <AnimatePresence>
        {showOpening && (
          <OpeningExperience
            onOpen={handleOpenInvitation}
            onSkip={handleSkipOpening}
            recipientName={data.recipientName}
          />
        )}
      </AnimatePresence>

      {/* Top Fixed Romantic Navigation Header */}
      <ValentineHeader
        musicPlaying={musicPlaying}
        onToggleMusic={toggleMusic}
        brandName={data.brandName}
        recipientName={data.recipientName}
      />

      {/* Main Valentine Proposal Section (uses /bgv.png) */}
      <ProposalSection
        data={data}
        onAccept={handleAcceptProposal}
        hasAccepted={hasAccepted}
        proposalRef={proposalRef}
      />

      {/* Full-Screen Celebration Modal upon YES */}
      <YesCelebration
        isOpen={showCelebrationModal}
        onClose={() => setShowCelebrationModal(false)}
        onExplore={handleExploreStory}
        data={data}
      />

      {/* Section 03: Our Story */}
      <OurStory story={data.story} />

      {/* Section 04: A Little Note (Love Letter Envelope) */}
      <LoveLetter
        letterData={data.letter}
        recipientName={data.recipientName}
      />

      {/* Section 05: Memory Gallery */}
      <MemoryGallery gallery={data.gallery} />

      {/* Section 06: Why You? */}
      <WhyYou reasons={data.reasons} />

      {/* Section 07: Final Celebration Footer */}
      <FinalCelebration
        celebrationData={data.finalCelebration}
        onReplay={handleReplay}
        senderName={data.senderName}
        recipientName={data.recipientName}
      />
    </div>
  );
}
