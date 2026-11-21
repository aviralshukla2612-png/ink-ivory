'use client';

import React, { useState, useRef, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { birthdayData } from '@/data/birthdayData';
import { BirthdayOpening } from '@/components/birthday/BirthdayOpening';
import { BirthdayHeader } from '@/components/birthday/BirthdayHeader';
import { BirthdayHero } from '@/components/birthday/BirthdayHero';
import { BirthdayHighlights } from '@/components/birthday/BirthdayHighlights';
import { MyWish } from '@/components/birthday/MyWish';
import { MemoriesGallery } from '@/components/birthday/MemoriesGallery';
import { BirthdayLetter } from '@/components/birthday/BirthdayLetter';
import { BirthdaySurprise } from '@/components/birthday/BirthdaySurprise';
import { FinalCelebration } from '@/components/birthday/FinalCelebration';
import { FloatingBalloons } from '@/components/common/FloatingBalloons';
import { GoldenParticles } from '@/components/common/GoldenParticles';

export default function BirthdayPage() {
  const [data, setData] = useState(() => JSON.parse(JSON.stringify(birthdayData)));
  const [showOpening, setShowOpening] = useState(true);
  const [musicPlaying, setMusicPlaying] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');

  const audioRef = useRef(null);

  // Sync initial query params & demo mode
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const params = new URLSearchParams(window.location.search);
    if (params.get('mode') === 'demo') {
      setShowOpening(false);
    }

    if (params.get('names') || params.get('recipientName')) {
      const raw = params.get('names') || params.get('recipientName') || '';
      const parts = raw.split(/&|\band\b/i).map((s) => s.trim());
      setData((prev) => ({
        ...prev,
        senderName: parts[1] || prev.senderName,
        recipientName: parts[0] || prev.recipientName,
      }));
    }

    if (params.get('heading')) {
      setData((prev) => ({
        ...prev,
        hero: { ...prev.hero, heading: params.get('heading') },
      }));
    }

    if (params.get('message')) {
      setData((prev) => ({
        ...prev,
        hero: { ...prev.hero, message: params.get('message') },
      }));
    }

    if (params.get('date')) {
      const dt = params.get('date');
      setData((prev) => ({
        ...prev,
        occasionDate: dt,
        date: dt,
      }));
    }

    if (params.get('photoUrl')) {
      const url = params.get('photoUrl');
      setData((prev) => ({
        ...prev,
        hero: { ...prev.hero, profileImage: url },
      }));
    }

    if (params.get('photoPosY')) {
      const y = parseFloat(params.get('photoPosY')) || 50;
      setData((prev) => ({
        ...prev,
        hero: { ...prev.hero, photoPositionY: y },
      }));
    }

    if (params.get('photoPosX')) {
      const x = parseFloat(params.get('photoPosX')) || 50;
      setData((prev) => ({
        ...prev,
        hero: { ...prev.hero, photoPositionX: x },
      }));
    }

    if (params.get('photoFit')) {
      const fit = params.get('photoFit');
      setData((prev) => ({
        ...prev,
        hero: { ...prev.hero, photoFit: fit },
      }));
    }

    if (params.get('photoScale')) {
      const scale = parseFloat(params.get('photoScale')) || 1;
      setData((prev) => ({
        ...prev,
        hero: { ...prev.hero, photoScale: scale },
      }));
    }

    try {
      const stored = sessionStorage.getItem('ink_ivory_custom_birthday');
      if (stored) {
        const parsed = JSON.parse(stored);
        setData((prev) => {
          const next = { ...prev };
          if (parsed.names) {
            const parts = parsed.names.split(/&|\band\b/i).map((s) => s.trim());
            if (parts.length >= 2) {
              next.recipientName = parts[0];
              next.senderName = parts[1];
            } else {
              next.recipientName = parsed.names;
            }
          }
          if (parsed.headline && next.hero) next.hero.heading = parsed.headline;
          if (parsed.message && next.hero) next.hero.message = parsed.message;
          if (parsed.date) {
            next.occasionDate = parsed.date;
            next.date = parsed.date;
          }
          if (parsed.letterMessage && next.letter) {
            next.letter = {
              ...next.letter,
              paragraphs: [
                `Dear ${next.recipientName},`,
                parsed.letterMessage,
                'Happy Birthday!',
                `With all my love,\n${next.senderName}`,
              ],
            };
          }
          if (parsed.photoUrl && next.hero) next.hero.profileImage = parsed.photoUrl;
          if (parsed.photoPositionY !== undefined && next.hero) next.hero.photoPositionY = parsed.photoPositionY;
          if (parsed.photoPositionX !== undefined && next.hero) next.hero.photoPositionX = parsed.photoPositionX;
          if (parsed.photoFit && next.hero) next.hero.photoFit = parsed.photoFit;
          if (parsed.photoScale !== undefined && next.hero) next.hero.photoScale = parsed.photoScale;
          if (parsed.memories && Array.isArray(parsed.memories) && next.memories) {
            parsed.memories.forEach((m, idx) => {
              if (next.memories[idx]) {
                if (m.date) next.memories[idx].date = m.date;
                if (m.caption) next.memories[idx].caption = m.caption;
              }
            });
          }
          return next;
        });
      }
    } catch (e) {}

    if (params.get('audioSource')) {
      const src = params.get('audioSource');
      setData((prev) => ({
        ...prev,
        music: { ...prev.music, source: src },
      }));
      if (audioRef.current) {
        audioRef.current.src = src;
        audioRef.current.load();
      }
    }

    if (params.get('audioStart') && audioRef.current) {
      audioRef.current.currentTime = parseFloat(params.get('audioStart')) || 0;
    }
  }, []);

  // Listen for Live Studio postMessage updates
  useEffect(() => {
    const handleMessage = (e) => {
      if (!e.data || e.data.type !== 'INK_IVORY_CUSTOM_UPDATE') return;
      const p = e.data.payload || {};

      setData((prev) => {
        const next = { ...prev };
        if (p.names) {
          const parts = p.names.split(/&|\band\b/i).map((s) => s.trim());
          if (parts.length >= 2) {
            next.recipientName = parts[0];
            next.senderName = parts[1];
          } else {
            next.recipientName = p.names;
          }
        }
        if (p.headline) {
          next.hero = { ...next.hero, heading: p.headline };
        }
        if (p.message) {
          next.hero = { ...next.hero, message: p.message };
        }
        if (p.date) {
          next.occasionDate = p.date;
          next.date = p.date;
        }
        if (p.photoUrl && next.hero) {
          next.hero = { ...next.hero, profileImage: p.photoUrl };
        }
        if (p.photoPositionY !== undefined && next.hero) {
          next.hero = { ...next.hero, photoPositionY: p.photoPositionY };
        }
        if (p.photoPositionX !== undefined && next.hero) {
          next.hero = { ...next.hero, photoPositionX: p.photoPositionX };
        }
        if (p.photoFit && next.hero) {
          next.hero = { ...next.hero, photoFit: p.photoFit };
        }
        if (p.photoScale !== undefined && next.hero) {
          next.hero = { ...next.hero, photoScale: p.photoScale };
        }
        if (p.memories && Array.isArray(p.memories) && next.memories) {
          p.memories.forEach((m, idx) => {
            if (next.memories[idx]) {
              if (m.date) next.memories[idx].date = m.date;
              if (m.caption) next.memories[idx].caption = m.caption;
            }
          });
        }
        if (p.letterMessage) {
          next.letter = {
            ...next.letter,
            paragraphs: [
              `Dear ${next.recipientName},`,
              p.letterMessage,
              'Happy Birthday!',
              `With all my love,\n${next.senderName}`,
            ],
          };
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
        return next;
      });
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [musicPlaying]);

  const toggleMusic = () => {
    if (!audioRef.current) return;
    if (musicPlaying) {
      audioRef.current.pause();
      setMusicPlaying(false);
    } else {
      audioRef.current
        .play()
        .then(() => setMusicPlaying(true))
        .catch(() => {});
    }
  };

  const handleOpenExperience = () => {
    setShowOpening(false);
    if (audioRef.current) {
      audioRef.current
        .play()
        .then(() => setMusicPlaying(true))
        .catch(() => {});
    }
  };

  const handleSkipOpening = () => {
    setShowOpening(false);
  };

  const handleScrollTo = (id) => {
    setActiveSection(id);
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="relative min-h-screen bg-[#FFF3EE] text-[#51363A] overflow-x-hidden selection:bg-[#F4CFCA] selection:text-[#681C2C] no-scrollbar">
      {/* Background Audio */}
      <audio
        ref={audioRef}
        src={data.music.source || '/audio/happy-birthday.mp3'}
        loop
        preload="auto"
      />

      {/* Opening Intro Gate */}
      <AnimatePresence>
        {showOpening && (
          <BirthdayOpening
            recipientName={data.recipientName}
            onOpen={handleOpenExperience}
            onSkip={handleSkipOpening}
          />
        )}
      </AnimatePresence>

      {/* Persistent Ambient Particles & Balloons */}
      <GoldenParticles />
      <FloatingBalloons count={7} />

      {/* Navigation Header */}
      <BirthdayHeader
        isPlaying={musicPlaying}
        onToggleMusic={toggleMusic}
        activeSection={activeSection}
        onNavigate={handleScrollTo}
      />

      {/* Section 02: Main Birthday Hero */}
      <BirthdayHero
        recipientName={data.recipientName}
        senderName={data.senderName}
        date={data.occasionDate || data.date}
        heading={data.hero.heading}
        message={data.hero.message}
        buttonText={data.hero.buttonText}
        backgroundImage={data.hero.backgroundImage}
        profileImage={data.hero.profileImage}
        photoPositionY={data.hero.photoPositionY}
        photoPositionX={data.hero.photoPositionX}
        photoFit={data.hero.photoFit}
        photoScale={data.hero.photoScale}
        cakeImage={data.hero.cakeImage}
        teddyImage={data.hero.teddyImage}
        onOpenSurprise={() => handleScrollTo('surprise')}
      />

      {/* Section 03: Birthday Highlights Strip */}
      <BirthdayHighlights
        highlights={data.highlights}
        onSelectSection={handleScrollTo}
      />

      {/* Section 04: My Wish */}
      <MyWish
        heading={data.wish.heading}
        subtitle={data.wish.subtitle}
        paragraphs={data.wish.paragraphs}
        recipientName={data.recipientName}
        senderName={data.senderName}
      />

      {/* Section 05: Our Memories */}
      <MemoriesGallery
        heading={data.memories.heading || 'Our Memories ♡'}
        subtitle={data.memories.subtitle}
        memories={data.memories}
      />

      {/* Section 06: A Little Note */}
      <BirthdayLetter
        heading={data.letter.heading}
        prompt={data.letter.prompt}
        date={data.occasionDate || data.date}
        paragraphs={data.letter.paragraphs}
        recipientName={data.recipientName}
        senderName={data.senderName}
      />

      {/* Section 07: Birthday Surprise */}
      <BirthdaySurprise
        heading={data.surprise.heading}
        subtext={data.surprise.subtext}
        buttonText={data.surprise.buttonText}
        surpriseHeading={data.surprise.surpriseHeading}
        surpriseMessage={data.surprise.surpriseMessage}
        recipientName={data.recipientName}
        senderName={data.senderName}
      />

      {/* Section 08: Final Celebration */}
      <FinalCelebration
        heading={data.finalCelebration.heading}
        quote={data.finalCelebration.quote}
        senderName={data.senderName}
        recipientName={data.recipientName}
        onReplay={() => {
          setShowOpening(true);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />
    </div>
  );
}
