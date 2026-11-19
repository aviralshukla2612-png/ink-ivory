'use client';

import React from 'react';
import { Gift, Volume2, VolumeX, Sparkles } from 'lucide-react';

export function BirthdayHeader({ isPlaying, onToggleMusic, activeSection, onNavigate }) {
  const navItems = [
    { id: 'hero', label: 'Home' },
    { id: 'wish', label: 'My Wish' },
    { id: 'memories', label: 'Our Memories' },
    { id: 'note', label: 'A Little Note' },
    { id: 'surprise', label: 'Surprise' },
  ];

  const handleNavClick = (id) => {
    if (onNavigate) {
      onNavigate(id);
    } else {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-40 px-4 sm:px-8 py-3.5 transition-all duration-300">
      <div className="max-w-6xl mx-auto rounded-full bg-[#FFFCF9]/80 backdrop-blur-md border border-[#E9CFA9]/40 shadow-[0_8px_30px_rgb(104,28,44,0.06)] px-4 sm:px-6 py-2.5 flex items-center justify-between">
        {/* Left: Brand / Title */}
        <div
          onClick={() => handleNavClick('hero')}
          className="flex items-center gap-2 text-[#481321] cursor-pointer group"
        >
          <div className="w-7 h-7 rounded-full bg-[#FFF3EE] border border-[#E9CFA9] flex items-center justify-center text-[#B62A42] group-hover:rotate-12 transition-transform">
            <Gift className="w-3.5 h-3.5" />
          </div>
          <span className="font-serif text-sm sm:text-base font-semibold tracking-wide text-[#681C2C]">
            Birthday Wish <span className="text-[#B62A42]">♡</span>
          </span>
        </div>

        {/* Center: Navigation Links */}
        <nav className="hidden md:flex items-center gap-6">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className={`text-xs font-sans tracking-wide transition-colors cursor-pointer relative py-1 ${
                activeSection === item.id
                  ? 'text-[#681C2C] font-semibold'
                  : 'text-[#51363A]/75 hover:text-[#681C2C]'
              }`}
            >
              {item.label}
              {activeSection === item.id && (
                <span className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-[#B62A42] rounded-full" />
              )}
            </button>
          ))}
        </nav>

        {/* Right: Music Toggle */}
        <button
          onClick={onToggleMusic}
          className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#FFF3EE] border border-[#E9CFA9]/70 text-[#681C2C] text-xs font-sans font-medium hover:bg-[#F9E3DE] transition-all cursor-pointer shadow-sm"
          title={isPlaying ? 'Mute Music' : 'Play Music'}
        >
          {isPlaying ? (
            <>
              <div className="flex items-end gap-[2px] h-3">
                <span className="w-[2px] h-2 bg-[#B62A42] animate-pulse" />
                <span className="w-[2px] h-3 bg-[#B62A42] animate-pulse delay-75" />
                <span className="w-[2px] h-1.5 bg-[#B62A42] animate-pulse delay-150" />
              </div>
              <Volume2 className="w-3.5 h-3.5 text-[#B62A42]" />
              <span className="hidden sm:inline text-[11px] font-semibold">Sound On</span>
            </>
          ) : (
            <>
              <VolumeX className="w-3.5 h-3.5 text-[#51363A]/60" />
              <span className="hidden sm:inline text-[11px] text-[#51363A]/70">Sound Off</span>
            </>
          )}
        </button>
      </div>
    </header>
  );
}
