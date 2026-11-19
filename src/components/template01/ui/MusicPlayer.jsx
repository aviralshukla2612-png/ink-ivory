'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX, Music, Play, Pause } from 'lucide-react';

/**
 * MusicPlayer Component
 * Floating luxury audio player playing authentic Indian wedding instrumental music
 * (Ustad Bismillah Khan - Shehnai & Sitar Royal Wedding Dhun).
 * Respects browser autoplay policies: starts seamlessly upon user gate interaction or direct tap.
 */
export const MusicPlayer = ({ autoStartTrigger = false }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef(null);

  // Set up audio instance on client
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const audio = new Audio('/audio/indian-wedding-shehnai.mp3');
    audio.loop = true;
    audio.preload = 'auto';
    audio.volume = 0.5;
    audioRef.current = audio;

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    const handleEnded = () => setIsPlaying(false);

    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
      audio.removeEventListener('ended', handleEnded);
      audio.pause();
      audio.src = '';
    };
  }, []);

  // When guest clicks "Open Invitation", trigger playback smoothly
  useEffect(() => {
    if (autoStartTrigger && audioRef.current && !isPlaying) {
      audioRef.current.play()
        .then(() => {
          setIsPlaying(true);
        })
        .catch((err) => {
          // Autoplay policy prevented playback until explicit user interaction
          console.info('Audio autoplay pending user tap:', err);
        });
    }
  }, [autoStartTrigger, isPlaying]);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play()
        .then(() => {
          setIsPlaying(true);
        })
        .catch((err) => {
          console.warn('Playback error:', err);
        });
    }
  };

  const toggleMute = () => {
    if (!audioRef.current) return;
    if (isMuted) {
      audioRef.current.muted = false;
      setIsMuted(false);
    } else {
      audioRef.current.muted = true;
      setIsMuted(true);
    }
  };

  return (
    <aside
      aria-label="Wedding Music Player"
      className="fixed bottom-6 right-6 z-40 select-none animate-in fade-in duration-500"
    >
      <div className="flex items-center gap-3 px-4 py-2.5 rounded-full bg-[#172039]/95 backdrop-blur-md border border-[#C5A46D]/60 text-[#F7F3EB] shadow-2xl transition-all hover:border-[#C5A46D] hover:shadow-[0_0_25px_rgba(197,164,109,0.35)]">
        {/* Play/Pause Button */}
        <button
          onClick={togglePlay}
          aria-label={isPlaying ? 'Pause celebration music' : 'Play celebration music'}
          className="w-8 h-8 rounded-full bg-gradient-to-r from-[#C5A46D] to-[#D8C39A] text-[#101624] flex items-center justify-center hover:scale-105 active:scale-95 transition-transform shadow-md focus:outline-none cursor-pointer"
        >
          {isPlaying ? (
            <Pause className="w-3.5 h-3.5 fill-current" />
          ) : (
            <Play className="w-3.5 h-3.5 fill-current translate-x-0.5" />
          )}
        </button>

        {/* Music Info & Visualizer */}
        <div className="flex flex-col pr-1 min-w-[130px]">
          <div className="flex items-center gap-1.5">
            <Music className={`w-3 h-3 text-[#C5A46D] ${isPlaying ? 'animate-pulse' : ''}`} />
            <span className="text-[10px] font-manrope font-semibold tracking-wider uppercase text-[#C5A46D]">
              Indian Shehnai & Sitar
            </span>
          </div>
          <span className="text-[9px] text-[#D8C39A]/80 truncate max-w-[150px]">
            {isPlaying ? 'Playing • Shehnai Dhun' : 'Tap to Play Music'}
          </span>

          {/* Soundwave equalizer bars */}
          <div className="flex items-end gap-0.5 h-2.5 mt-1">
            {[45, 90, 50, 100, 70, 35, 85, 60].map((h, i) => (
              <span
                key={i}
                className={`w-0.5 rounded-full bg-[#C5A46D] transition-all duration-300 ${
                  isPlaying && !isMuted ? 'animate-pulse' : 'opacity-25'
                }`}
                style={{
                  height: isPlaying && !isMuted ? `${h}%` : '20%',
                  animationDelay: `${i * 100}ms`,
                }}
              />
            ))}
          </div>
        </div>

        {/* Mute Toggle */}
        <button
          onClick={toggleMute}
          disabled={!isPlaying}
          aria-label={isMuted ? 'Unmute celebration music' : 'Mute celebration music'}
          className="p-1.5 rounded-full text-[#D8C39A] hover:text-white hover:bg-white/5 transition-colors disabled:opacity-30 focus:outline-none cursor-pointer"
        >
          {isMuted ? (
            <VolumeX className="w-4 h-4 stroke-[2]" />
          ) : (
            <Volume2 className="w-4 h-4 stroke-[2]" />
          )}
        </button>
      </div>
    </aside>
  );
};

export default MusicPlayer;
