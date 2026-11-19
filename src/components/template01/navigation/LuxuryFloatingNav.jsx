'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Volume2, VolumeX, Menu, X, RotateCcw } from 'lucide-react';
import { useSlider } from '@/context/SliderContext';

/**
 * LuxuryFloatingNav Component
 * Floating luxury control pill:
 * - Brand Monogram
 * - Quick Section Navigation Drawer with Slider goToSlide
 * - Sound toggle
 * - Replay Entrance Gate button
 */
export const LuxuryFloatingNav = ({
  isPlaying = false,
  isMuted = false,
  onToggleSound = () => {},
  onReplayEntrance = () => {},
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const { currentSlide, goToSlide, slides } = useSlider();

  const handleNavClick = (index) => {
    setIsOpen(false);
    goToSlide(index);
  };

  return (
    <>
      {/* Floating Glass Pill (Fixed Top Center) */}
      <nav className="fixed top-4 sm:top-5 left-1/2 -translate-x-1/2 z-40 select-none animate-in fade-in duration-500">
        <div className="flex items-center gap-2 sm:gap-3 px-3.5 sm:px-5 py-2 sm:py-2.5 rounded-full bg-[#091321]/85 backdrop-blur-xl border border-[#D6B477]/40 shadow-[0_10px_30px_rgba(0,0,0,0.85),inset_0_0_15px_rgba(214,180,119,0.15)] text-[#FAF5ED]">
          {/* Brand Monogram */}
          <Link
            href="/"
            className="flex items-center gap-1.5 text-xs font-cormorant font-semibold tracking-widest text-[#E7CEA0] hover:text-[#FFFDF7] transition-colors pr-2 border-r border-[#D6B477]/30"
          >
            <span>Ink &amp; Ivory</span>
          </Link>

          {/* Quick Menu Trigger */}
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center gap-1.5 text-[11px] font-manrope font-semibold tracking-wider text-[#EFE3CD] hover:text-[#D6B477] transition-colors px-2 py-1 rounded-full hover:bg-white/5 cursor-pointer focus:outline-none"
            aria-label="Toggle Navigation Menu"
          >
            {isOpen ? <X className="w-3.5 h-3.5" /> : <Menu className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">Celebration Menu</span>
          </button>

          {/* Replay Entrance Gate */}
          <button
            type="button"
            onClick={onReplayEntrance}
            title="Replay Entrance Gate"
            className="p-1.5 rounded-full text-[#E7CEA0] hover:text-[#FFFDF7] hover:bg-white/5 transition-colors cursor-pointer focus:outline-none"
            aria-label="Replay Entrance Gate"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>

          {/* Sound Toggle */}
          <button
            type="button"
            onClick={onToggleSound}
            title={isMuted ? 'Play Aaj Sajeya' : 'Mute Aaj Sajeya'}
            className="flex items-center gap-1.5 px-2 py-1 rounded-full text-[11px] font-manrope text-[#D6B477] hover:text-[#FFFDF7] hover:bg-white/5 transition-colors cursor-pointer focus:outline-none"
            aria-label="Toggle Background Music"
          >
            {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5 text-[#E7CEA0] animate-pulse" />}
            <span className="hidden md:inline">{isMuted ? 'Sound Off' : 'Sound On'}</span>
          </button>
        </div>
      </nav>

      {/* Slide Navigation Overlay Modal */}
      {isOpen && (
        <div
          className="fixed inset-0 z-50 bg-[#091321]/90 backdrop-blur-2xl flex items-center justify-center p-6 animate-in fade-in duration-300"
          onClick={() => setIsOpen(false)}
        >
          <div
            className="relative max-w-md w-full bg-[#0D192B]/95 border border-[#D6B477]/40 rounded-3xl p-6 sm:p-8 shadow-[0_20px_60px_rgba(0,0,0,0.95)] text-center flex flex-col items-center"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-full text-[#E7CEA0] hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              aria-label="Close menu"
            >
              <X className="w-5 h-5" />
            </button>

            <span className="text-[10px] font-manrope font-semibold tracking-[0.28em] uppercase text-[#D6B477] mb-2">
              — Celebration Menu —
            </span>
            <h3 className="font-cormorant text-2xl sm:text-3xl font-medium text-[#FFFDF7] mb-6">
              Wedding Invitation
            </h3>

            {/* Slide Navigation Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-2.5 w-full">
              {slides.map((s, idx) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => handleNavClick(idx)}
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl border text-xs font-manrope transition-all duration-200 cursor-pointer ${
                    currentSlide === idx
                      ? 'bg-[#D6B477]/20 border-[#D6B477] text-[#FFFDF7] font-semibold'
                      : 'bg-white/5 border-white/10 text-[#EFE3CD] hover:bg-[#D6B477]/10 hover:border-[#D6B477]/40 hover:text-[#FFFDF7]'
                  }`}
                >
                  <span className="truncate">{s.label}</span>
                  <span className="text-[10px] opacity-60 ml-2 font-mono">{String(idx + 1).padStart(2, '0')}</span>
                </button>
              ))}
            </div>

            <p className="font-serif italic text-xs text-[#E7CEA0]/60 mt-6">
              Swipe left / right or use arrow keys to browse 1 page at a time
            </p>
          </div>
        </div>
      )}
    </>
  );
};

export default LuxuryFloatingNav;
