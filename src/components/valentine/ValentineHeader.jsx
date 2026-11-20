'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Heart, Volume2, VolumeX, Sparkles, ArrowLeft } from 'lucide-react';

export const ValentineHeader = ({
  musicPlaying,
  onToggleMusic,
  brandName = "My Valentine",
  recipientName = "Riya",
}) => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 ${
        scrolled
          ? 'bg-[#FFF4F0]/90 backdrop-blur-md shadow-sm border-b border-[#F6D3D0]/50 py-2.5'
          : 'bg-transparent py-4'
      }`}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-between">
        {/* Brand / Logo */}
        <div className="flex items-center gap-2.5">
          <Link
            href="/"
            className="flex items-center gap-1.5 text-xs text-[#641D2B]/70 hover:text-[#641D2B] transition-colors mr-2 pr-3 border-r border-[#641D2B]/20"
            title="Return to You Are Mine collection"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span className="hidden sm:inline font-sans">You Are Mine</span>
          </Link>

          <button
            onClick={() => scrollTo('proposal-hero')}
            className="flex items-center gap-2 text-left group"
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#B51F3B] to-[#641D2B] flex items-center justify-center text-white shadow-sm group-hover:scale-105 transition-transform">
              <Heart className="w-4 h-4 fill-current animate-pulse" />
            </div>
            <div>
              <span className="font-serif font-bold text-lg text-[#641D2B] tracking-wide block leading-none">
                {brandName}
              </span>
              <span className="text-[10px] tracking-widest text-[#B51F3B] uppercase font-sans font-semibold">
                For {recipientName} ♡
              </span>
            </div>
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-7 text-xs font-sans font-semibold tracking-wider text-[#4B3035]/80 uppercase">
          <button
            onClick={() => scrollTo('proposal-hero')}
            className="hover:text-[#B51F3B] transition-colors"
          >
            The Question
          </button>
          <button
            onClick={() => scrollTo('our-story')}
            className="hover:text-[#B51F3B] transition-colors"
          >
            Our Story
          </button>
          <button
            onClick={() => scrollTo('love-letter')}
            className="hover:text-[#B51F3B] transition-colors"
          >
            A Little Note
          </button>
          <button
            onClick={() => scrollTo('memory-gallery')}
            className="hover:text-[#B51F3B] transition-colors"
          >
            Gallery
          </button>
          <button
            onClick={() => scrollTo('why-you')}
            className="hover:text-[#B51F3B] transition-colors"
          >
            Why You
          </button>
        </nav>

        {/* Music Controller */}
        <div className="flex items-center gap-2">
          <button
            onClick={onToggleMusic}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full border text-xs font-sans font-semibold transition-all duration-300 ${
              musicPlaying
                ? 'bg-[#B51F3B] text-white border-[#B51F3B] shadow-sm'
                : 'bg-white/70 text-[#641D2B] border-[#F6D3D0] hover:bg-white'
            }`}
            title={musicPlaying ? "Pause romantic soundtrack" : "Play romantic soundtrack"}
          >
            {musicPlaying ? (
              <>
                <Volume2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Music Playing</span>
                {/* Animated sound wave bars */}
                <div className="flex items-center gap-0.5 ml-0.5">
                  <span className="w-0.5 h-2.5 bg-white animate-bounce" style={{ animationDelay: '0s' }}></span>
                  <span className="w-0.5 h-3.5 bg-white animate-bounce" style={{ animationDelay: '0.15s' }}></span>
                  <span className="w-0.5 h-2 bg-white animate-bounce" style={{ animationDelay: '0.3s' }}></span>
                </div>
              </>
            ) : (
              <>
                <VolumeX className="w-3.5 h-3.5 opacity-60" />
                <span className="hidden sm:inline">Play Soundtrack</span>
              </>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
