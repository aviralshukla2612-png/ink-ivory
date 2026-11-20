'use client';

import React from 'react';
import { Heart, Volume2, VolumeX, Sparkles, Calendar } from 'lucide-react';

export default function DatePlannerHeader({ isPlaying, onToggleMusic, activeStep, onNavigate }) {
  const steps = [
    { id: 'date', label: 'Date' },
    { id: 'time', label: 'Time' },
    { id: 'activity', label: 'Activity' },
    { id: 'food', label: 'Food & Vibes' },
    { id: 'summary', label: 'My Choices' },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-40 px-4 sm:px-8 py-3.5 transition-all duration-300">
      <div className="max-w-6xl mx-auto rounded-full bg-[#FFF9F4]/85 backdrop-blur-md border border-[#F3D0C9]/70 shadow-[0_8px_30px_rgb(100,26,42,0.06)] px-4 sm:px-6 py-2.5 flex items-center justify-between">
        {/* Left: Brand / Title */}
        <div
          onClick={() => onNavigate && onNavigate('hero')}
          className="flex items-center gap-2 text-[#45121F] cursor-pointer group"
        >
          <div className="w-7 h-7 rounded-full bg-[#FFF2ED] border border-[#F3D0C9] flex items-center justify-center text-[#B51F3B] group-hover:scale-110 transition-transform">
            <Heart className="w-3.5 h-3.5 fill-current" />
          </div>
          <span className="font-serif text-sm sm:text-base font-semibold tracking-wide text-[#641A2A]">
            Our Date Planner <span className="text-[#B51F3B]">♡</span>
          </span>
        </div>

        {/* Center: Quick Section Links */}
        <nav className="hidden md:flex items-center gap-6">
          {steps.map((s) => (
            <button
              key={s.id}
              onClick={() => onNavigate && onNavigate(s.id)}
              className="text-xs font-sans tracking-wide text-[#50363A]/75 hover:text-[#641A2A] transition-colors cursor-pointer py-1"
            >
              {s.label}
            </button>
          ))}
        </nav>

        {/* Right: Music Toggle */}
        <button
          onClick={onToggleMusic}
          className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#FFF2ED] border border-[#F3D0C9] text-[#641A2A] text-xs font-sans font-medium hover:bg-[#F9E4DE] transition-all cursor-pointer shadow-sm"
          title={isPlaying ? 'Mute Music' : 'Play Music'}
        >
          {isPlaying ? (
            <>
              <div className="flex items-end gap-[2px] h-3">
                <span className="w-[2px] h-2 bg-[#B51F3B] animate-pulse" />
                <span className="w-[2px] h-3 bg-[#B51F3B] animate-pulse delay-75" />
                <span className="w-[2px] h-1.5 bg-[#B51F3B] animate-pulse delay-150" />
              </div>
              <Volume2 className="w-3.5 h-3.5 text-[#B51F3B]" />
              <span className="hidden sm:inline text-[11px] font-semibold">Sound On</span>
            </>
          ) : (
            <>
              <VolumeX className="w-3.5 h-3.5 text-[#50363A]/60" />
              <span className="hidden sm:inline text-[11px] text-[#50363A]/70">Sound Off</span>
            </>
          )}
        </button>
      </div>
    </header>
  );
}
