'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Volume2, VolumeX, Menu, X, RotateCcw } from 'lucide-react';
import { useLenis } from '@/context/LenisContext';

/**
 * LuxuryFloatingNav Component
 * Floating luxury control pill:
 * - Brand Monogram
 * - Quick Section Navigation Drawer with Lenis scrollTo
 * - Sound toggle
 * - Replay Entrance Gate button
 * - Scroll Progress Indicator
 */
export const LuxuryFloatingNav = ({
  isPlaying = false,
  isMuted = false,
  onToggleSound = () => { },
  onReplayEntrance = () => { },
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const { scrollTo } = useLenis();

  useEffect(() => {
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
      if (totalScroll > 0) {
        setScrollProgress((window.scrollY / totalScroll) * 100);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Welcome', href: '#welcome' },
    { label: 'Our Story', href: '#story' },
    { label: 'Save the Date', href: '#countdown' },
    { label: 'Events Overview', href: '#events' },
    { label: 'Haldi', href: '#haldi' },
    { label: 'Mehendi', href: '#mehendi' },
    { label: 'Sangeet', href: '#sangeet' },
    { label: 'Wedding Ceremony', href: '#wedding' },
    { label: 'Reception', href: '#reception' },
    { label: 'Family Blessings', href: '#blessings' },
    { label: 'Venue & Location', href: '#venue' },
    { label: 'Closing & Wishes', href: '#closing' },
  ];

  const handleNavClick = (href) => {
    setIsOpen(false);
    scrollTo(href, { duration: 1.2 });
  };

  return (
    <>
      {/* Floating Glass Pill (Fixed Top Center) */}
      <nav className="fixed top-5 left-1/2 -translate-x-1/2 z-30 select-none animate-in fade-in duration-500">
        <div className="flex items-center gap-2 sm:gap-3 px-4 sm:px-5 py-2.5 rounded-full bg-[#091321]/85 backdrop-blur-xl border border-[#D6B477]/40 shadow-[0_10px_30px_rgba(0,0,0,0.85),inset_0_0_15px_rgba(214,180,119,0.15)] text-[#FAF5ED]">
          {/* Brand Monogram */}
          <Link
            href="/"
            className="flex items-center gap-1.5 text-xs font-cormorant font-semibold tracking-widest text-[#E7CEA0] hover:text-[#FFFDF7] transition-colors pr-2 border-r border-[#D6B477]/30"
          >
            <span>Ink & Ivory</span>
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
            title={isMuted ? 'Play Royal Shehnai' : 'Mute Music'}
            className="flex items-center gap-1.5 px-2 py-1 rounded-full text-[11px] font-manrope text-[#D6B477] hover:text-[#FFFDF7] hover:bg-white/5 transition-colors cursor-pointer focus:outline-none"
            aria-label="Toggle Background Music"
          >
            {isMuted || !isPlaying ? (
              <VolumeX className="w-3.5 h-3.5" />
            ) : (
              <Volume2 className="w-3.5 h-3.5 animate-pulse text-[#E7CEA0]" />
            )}
            <span className="hidden sm:inline">{isMuted || !isPlaying ? 'Sound Off' : 'Sound On'}</span>
          </button>
        </div>

        {/* Scroll Progress Bar along the bottom of the pill */}
        <div className="w-full h-[2px] bg-white/10 rounded-full mt-1 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-[#D6B477] via-[#E7CEA0] to-[#D6B477] transition-all duration-100 ease-out"
            style={{ width: `${scrollProgress}%` }}
          />
        </div>
      </nav>

      {/* Navigation Drawer Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-40 bg-black/75 backdrop-blur-md flex items-center justify-center p-6 select-none animate-in fade-in duration-300">
          <div className="relative w-full max-w-md bg-[#091321] border border-[#D6B477]/40 rounded-2xl p-6 sm:p-8 shadow-[0_25px_60px_rgba(0,0,0,0.9),inset_0_0_20px_rgba(214,180,119,0.15)] flex flex-col items-center">
            {/* Close Button */}
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 p-2 text-[#E7CEA0] hover:text-[#FFFDF7] rounded-full hover:bg-white/5 cursor-pointer focus:outline-none"
              aria-label="Close Navigation Drawer"
            >
              <X className="w-5 h-5" />
            </button>

            <span className="text-[11px] font-manrope font-semibold tracking-[0.25em] uppercase text-[#D6B477] mb-2">
              Royal Celebration Index
            </span>
            <h3 className="font-cormorant text-2xl font-medium text-[#FAF5ED] mb-6">
              Aarav & Riya
            </h3>

            {/* Links Grid */}
            <div className="grid grid-cols-2 gap-2.5 w-full">
              {navLinks.map((item) => (
                <button
                  key={item.href}
                  type="button"
                  onClick={() => handleNavClick(item.href)}
                  className="py-2.5 px-3 rounded-xl border border-white/10 hover:border-[#D6B477]/60 bg-white/5 hover:bg-[#D6B477]/10 text-xs font-manrope text-[#EFE3CD] hover:text-[#FAF5ED] transition-all text-center cursor-pointer focus:outline-none"
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default LuxuryFloatingNav;
