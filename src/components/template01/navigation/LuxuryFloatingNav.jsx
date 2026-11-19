'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Volume2, VolumeX, Menu, X, RotateCcw, Sparkles } from 'lucide-react';

/**
 * LuxuryFloatingNav Component
 * Minimal floating luxury control pill:
 * - Brand Monogram
 * - Quick Section Navigation Drawer
 * - Sound toggle
 * - Replay Entrance Gate button
 * - Scroll Progress Indicator
 */
export const LuxuryFloatingNav = ({
  isPlaying = false,
  isMuted = false,
  onToggleSound = () => {},
  onReplayEntrance = () => {},
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

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
    { label: 'Wedding (Phere)', href: '#wedding' },
    { label: 'Reception', href: '#reception' },
    { label: 'Family Blessings', href: '#blessings' },
    { label: 'Venue & Maps', href: '#venue' },
    { label: 'Thank You', href: '#closing' },
  ];

  const handleNavClick = (href) => {
    setIsOpen(false);
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      {/* Floating Glass Pill (Fixed Top Center) */}
      <nav className="fixed top-5 left-1/2 -translate-x-1/2 z-30 select-none animate-in fade-in duration-500">
        <div className="flex items-center gap-2 sm:gap-3 px-4 sm:px-5 py-2.5 rounded-full bg-[#091321]/80 backdrop-blur-xl border border-[#D6B477]/40 shadow-[0_10px_30px_rgba(0,0,0,0.85),inset_0_0_15px_rgba(214,180,119,0.15)] text-[#FAF5ED]">
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

        {/* Top Slim Scroll Progress Line */}
        <div className="w-full h-[2px] bg-white/10 rounded-full mt-1.5 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-[#D6B477] via-[#FFF3D6] to-[#D6B477] transition-all duration-150"
            style={{ width: `${scrollProgress}%` }}
          />
        </div>
      </nav>

      {/* Slide-in Fullscreen / Modal Navigation Drawer */}
      {isOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-40 bg-[#091321]/95 backdrop-blur-xl flex flex-col items-center justify-center p-6 animate-in fade-in duration-300 select-none"
        >
          {/* Close Button */}
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className="absolute top-6 right-6 p-3 rounded-full bg-[#101B2B] border border-[#D6B477]/40 text-[#D6B477] hover:text-white transition-colors cursor-pointer"
            aria-label="Close menu"
          >
            <X className="w-5 h-5" />
          </button>

          <span className="text-[11px] font-manrope font-semibold tracking-[0.3em] uppercase text-[#D6B477] mb-2">
            The Royal Invitation Journey
          </span>
          <h3 className="font-cormorant text-3xl sm:text-4xl text-[#F7F0E3] font-medium mb-8">
            Invitation Sections
          </h3>

          {/* Links Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 max-w-xl w-full">
            {navLinks.map((link) => (
              <button
                key={link.href}
                type="button"
                onClick={() => handleNavClick(link.href)}
                className="p-3.5 rounded-xl bg-[#101B2B]/70 border border-[#D6B477]/30 hover:border-[#D6B477] text-left text-xs sm:text-sm font-manrope text-[#EFE3CD] hover:text-[#FFFDF7] transition-all hover:scale-102 cursor-pointer"
              >
                {link.label}
              </button>
            ))}
          </div>

          <div className="mt-8 text-center">
            <button
              type="button"
              onClick={() => {
                setIsOpen(false);
                onReplayEntrance();
              }}
              className="inline-flex items-center gap-2 text-xs font-manrope text-[#D6B477] hover:text-[#FFFDF7] underline-offset-4 hover:underline cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Replay Entrance Gate Sequence</span>
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default LuxuryFloatingNav;
