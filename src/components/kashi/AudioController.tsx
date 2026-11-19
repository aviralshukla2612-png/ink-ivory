'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX } from 'lucide-react';

interface AudioControllerProps {
  autoStartTrigger?: boolean;
}

export const AudioController: React.FC<AudioControllerProps> = ({ autoStartTrigger }) => {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const audio = new Audio('/audio/kashi-theme.mp3');
    audio.loop = true;
    audio.volume = 0.65;
    audioRef.current = audio;

    audio.addEventListener('play', () => setIsPlaying(true));
    audio.addEventListener('pause', () => setIsPlaying(false));

    return () => {
      audio.pause();
      audio.src = '';
    };
  }, []);

  // When autoStartTrigger becomes true (user clicks "CONTINUE")
  useEffect(() => {
    if (autoStartTrigger && audioRef.current && !isPlaying) {
      audioRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch(() => {
          // Autoplay policy prevented playback, user can toggle manually
          setIsPlaying(false);
        });
    }
  }, [autoStartTrigger]);

  const toggleAudio = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch(() => setIsPlaying(false));
    }
  };

  return (
    <div className="absolute bottom-4 right-4 z-40">
      <button
        onClick={toggleAudio}
        aria-label={isPlaying ? 'Pause auspicious Shehnai wedding music' : 'Play auspicious Shehnai wedding music'}
        className="group relative flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-[#E2B768] via-[#B8873B] to-[#86591C] p-0.5 shadow-xl transition-all duration-300 hover:scale-105 active:scale-95 border border-[#FFE7B3]/60"
      >
        <div className="flex h-full w-full items-center justify-center rounded-full bg-[#1A1208]/85 backdrop-blur-md">
          {isPlaying ? (
            <div className="flex items-end justify-center gap-0.5 h-4 w-4">
              <span className="w-0.5 rounded-full bg-[#F4D086] animate-pulse h-2.5" />
              <span className="w-0.5 rounded-full bg-[#FFE7B3] animate-pulse h-4 delay-75" />
              <span className="w-0.5 rounded-full bg-[#E2B768] animate-pulse h-1.5 delay-150" />
              <span className="w-0.5 rounded-full bg-[#D79F42] animate-pulse h-3 delay-100" />
            </div>
          ) : (
            <VolumeX className="h-4 w-4 text-[#E2B768]" />
          )}
        </div>
        {/* Soft golden aura glow */}
        <span
          className={`absolute -inset-1 rounded-full bg-[#E2B768]/20 blur-sm pointer-events-none transition-opacity ${
            isPlaying ? 'opacity-100 animate-pulse' : 'opacity-0'
          }`}
        />
      </button>
    </div>
  );
};
