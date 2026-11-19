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
  const [showOpening, setShowOpening] = useState(true);
  const [hasAccepted, setHasAccepted] = useState(false);
  const [showCelebrationModal, setShowCelebrationModal] = useState(false);
  const [triggerHeartExplosion, setTriggerHeartExplosion] = useState(false);
  const [musicPlaying, setMusicPlaying] = useState(false);

  const audioRef = useRef(null);
  const proposalRef = useRef(null);

  // Set initial volume
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
    // Start music on first explicit interaction
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

    // Ensure music is playing for the celebration
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
        src={valentineData.music.source}
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
            recipientName={valentineData.recipientName}
          />
        )}
      </AnimatePresence>

      {/* Top Fixed Romantic Navigation Header */}
      <ValentineHeader
        musicPlaying={musicPlaying}
        onToggleMusic={toggleMusic}
        brandName={valentineData.brandName}
        recipientName={valentineData.recipientName}
      />

      {/* Main Valentine Proposal Section (uses /bgv.png) */}
      <ProposalSection
        data={valentineData}
        onAccept={handleAcceptProposal}
        hasAccepted={hasAccepted}
        proposalRef={proposalRef}
      />

      {/* Full-Screen Celebration Modal upon YES */}
      <YesCelebration
        isOpen={showCelebrationModal}
        onClose={() => setShowCelebrationModal(false)}
        onExplore={handleExploreStory}
        data={valentineData}
      />

      {/* Section 03: Our Story */}
      <OurStory story={valentineData.story} />

      {/* Section 04: A Little Note (Love Letter Envelope) */}
      <LoveLetter
        letterData={valentineData.letter}
        recipientName={valentineData.recipientName}
      />

      {/* Section 05: Memory Gallery */}
      <MemoryGallery gallery={valentineData.gallery} />

      {/* Section 06: Why You? */}
      <WhyYou reasons={valentineData.reasons} />

      {/* Section 07: Final Celebration Footer */}
      <FinalCelebration
        celebrationData={valentineData.finalCelebration}
        onReplay={handleReplay}
        senderName={valentineData.senderName}
        recipientName={valentineData.recipientName}
      />
    </div>
  );
}
