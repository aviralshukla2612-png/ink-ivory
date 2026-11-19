'use client';

import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Smartphone,
  Laptop,
  Play,
  Pause,
  Sparkles,
  ExternalLink,
} from 'lucide-react';
import { Template } from '@/types';

interface LiveDemoModalProps {
  isOpen: boolean;
  onClose: () => void;
  template: Template;
  initialDevice?: 'phone' | 'laptop';
}

export const LiveDemoModal: React.FC<LiveDemoModalProps> = ({
  isOpen,
  onClose,
  template,
  initialDevice = 'phone',
}) => {
  const [device, setDevice] = useState<'phone' | 'laptop'>(initialDevice);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [mounted, setMounted] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Sync initial device when modal opens
  useEffect(() => {
    if (isOpen) {
      setDevice(initialDevice);
      setIsAutoPlaying(true);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen, initialDevice]);

  // Handle ESC key to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !mounted) return null;

  const baseUrl = template.liveDemoUrl || '/template-01';
  const demoUrl =
    device === 'phone'
      ? `${baseUrl}?mode=demo&view=phone&auto=${isAutoPlaying ? '2000' : 'false'}`
      : `${baseUrl}?mode=demo&view=laptop`;

  const handlePrev = () => {
    iframeRef.current?.contentWindow?.postMessage({ action: 'prevSlide' }, '*');
  };

  const handleNext = () => {
    iframeRef.current?.contentWindow?.postMessage({ action: 'nextSlide' }, '*');
  };

  const toggleAutoPlay = () => {
    const nextState = !isAutoPlaying;
    setIsAutoPlaying(nextState);
    iframeRef.current?.contentWindow?.postMessage({ action: 'toggleAutoPlay' }, '*');
  };

  return createPortal(
    <div
      className="fixed inset-0 z-[99999] bg-[#070B12]/95 backdrop-blur-xl flex flex-col text-[#F8F4EC] select-none animate-in fade-in duration-300"
      role="dialog"
      aria-modal="true"
    >
      {/* 1. TOP CONTROL BAR (Matching User's Reference Screenshot) */}
      <header className="h-16 px-4 sm:px-8 border-b border-[#232F46] bg-[#0E1524]/90 flex items-center justify-between gap-4 z-20 shrink-0">
        
        {/* Left: Back + Navigation Arrows */}
        <div className="flex items-center gap-2 sm:gap-4">
          <button
            onClick={onClose}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-[#CBD5E1] hover:text-white bg-[#192236] hover:bg-[#222E48] border border-[#2B3A59] transition-all cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Back</span>
          </button>

          <div className="flex items-center gap-1 bg-[#151D2E] p-1 rounded-lg border border-[#24314A]">
            <button
              onClick={handlePrev}
              title="Previous Slide"
              className="p-1.5 rounded text-[#94A3B8] hover:text-white hover:bg-[#202B40] transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-[11px] text-[#64748B] px-1 font-mono">|</span>
            <button
              onClick={handleNext}
              title="Next Slide"
              className="p-1.5 rounded text-[#94A3B8] hover:text-white hover:bg-[#202B40] transition-colors cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <span className="hidden md:inline-block font-serif text-sm text-[#E2D5BE] truncate max-w-[200px]">
            {template.title}
          </span>
        </div>

        {/* Center: Device View Switcher */}
        <div className="flex items-center bg-[#131B2C] p-1 rounded-full border border-[#263450] shadow-inner">
          <button
            onClick={() => setDevice('phone')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer ${
              device === 'phone'
                ? 'bg-[#E5A842] text-[#0E1524] font-semibold shadow-md'
                : 'text-[#94A3B8] hover:text-[#E2D5BE]'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>Phone</span>
            <span className="hidden sm:inline text-[10px] px-1.5 py-0.2 rounded-full bg-black/20">
              Auto 2s
            </span>
          </button>

          <button
            onClick={() => setDevice('laptop')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer ${
              device === 'laptop'
                ? 'bg-[#E5A842] text-[#0E1524] font-semibold shadow-md'
                : 'text-[#94A3B8] hover:text-[#E2D5BE]'
            }`}
          >
            <Laptop className="w-3.5 h-3.5" />
            <span>Laptop</span>
            <span className="hidden sm:inline text-[10px] px-1.5 py-0.2 rounded-full bg-black/20">
              Scroll
            </span>
          </button>
        </div>

        {/* Right: Golden Action Button */}
        <div className="flex items-center gap-3">
          <Link
            href={`/customize/${template.id}`}
            onClick={onClose}
            className="px-4 sm:px-6 py-2 rounded-xl bg-[#E5A842] hover:bg-[#D49832] text-[#0E1524] font-semibold text-xs sm:text-sm tracking-wide shadow-[0_4px_18px_rgba(229,168,66,0.35)] transition-all transform hover:scale-[1.02] active:scale-[0.98] flex items-center gap-1.5"
          >
            <span>Choose this design</span>
            <span className="font-sans">→</span>
          </Link>
        </div>
      </header>

      {/* 2. MAIN PREVIEW VIEWPORT */}
      <main className="flex-1 overflow-hidden relative flex flex-col items-center justify-center p-3 sm:p-6 bg-radial from-[#121B2C]/80 via-[#09101C] to-[#05080E]">
        
        {/* Background Ambient Glow */}
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
          <div className="w-[500px] h-[500px] bg-[#E5A842]/10 rounded-full blur-[140px]" />
        </div>

        {/* =========================================================================
            PHONE VIEW (Realistic Smartphone Mockup + Auto-scroll every 2 seconds)
            ========================================================================= */}
        {device === 'phone' && (
          <div className="flex flex-col items-center justify-center h-full max-h-full">
            
            {/* Realistic iPhone / Smartphone Frame */}
            <div className="relative w-[340px] sm:w-[380px] h-[680px] sm:h-[750px] max-h-[78vh] rounded-[48px] border-[10px] border-[#181F2C] shadow-[0_25px_60px_rgba(0,0,0,0.9),0_0_35px_rgba(229,168,66,0.15)] bg-black overflow-hidden flex flex-col">
              
              {/* Dynamic Island / Speaker Pill */}
              <div className="absolute top-2.5 left-1/2 -translate-x-1/2 z-30 w-24 h-4 bg-[#181F2C] rounded-full flex items-center justify-end px-3">
                <div className="w-2 h-2 rounded-full bg-[#0E1524]" />
              </div>

              {/* Live Web Invitation Iframe */}
              <iframe
                ref={iframeRef}
                src={demoUrl}
                title="Live Mobile Wedding Invitation Demo"
                className="w-full h-full border-none bg-[#091321]"
              />
            </div>

            {/* Bottom Floating Status Bar */}
            <div className="mt-3 flex items-center gap-3 bg-[#111827]/90 px-4 py-1.5 rounded-full border border-[#2B3A59] shadow-lg text-xs text-[#CBD5E1]">
              <div className="flex items-center gap-1.5">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#E5A842] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#E5A842]"></span>
                </span>
                <span className="text-[11px] font-medium text-[#E2D5BE]">
                  {isAutoPlaying ? 'Auto-advancing every 2s' : 'Auto-advance paused'}
                </span>
              </div>

              <span className="text-[#475569]">|</span>

              <button
                onClick={toggleAutoPlay}
                className="p-1 rounded hover:bg-[#1E293B] text-[#E5A842] transition-colors flex items-center gap-1 cursor-pointer"
                title={isAutoPlaying ? 'Pause Auto-slide' : 'Resume Auto-slide'}
              >
                {isAutoPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                <span className="text-[10px] font-semibold">{isAutoPlaying ? 'Pause' : 'Resume'}</span>
              </button>
            </div>
          </div>
        )}

        {/* =========================================================================
            LAPTOP VIEW (Widescreen + Manual Scroll Viewport)
            ========================================================================= */}
        {device === 'laptop' && (
          <div className="flex flex-col items-center justify-center w-full h-full max-h-full max-w-6xl">
            
            {/* Widescreen Laptop Screen Mockup */}
            <div className="relative w-full h-[80vh] max-h-[80vh] rounded-2xl border-[6px] border-[#1C2536] shadow-[0_20px_50px_rgba(0,0,0,0.9),0_0_40px_rgba(229,168,66,0.12)] bg-[#091321] overflow-hidden flex flex-col">
              
              {/* Laptop Top Bezel with Camera */}
              <div className="h-5 bg-[#1C2536] flex items-center justify-center px-4 shrink-0">
                <div className="w-1.5 h-1.5 rounded-full bg-[#0F172A]" />
              </div>

              {/* Live Web Invitation Iframe */}
              <iframe
                ref={iframeRef}
                src={demoUrl}
                title="Live Laptop Wedding Invitation Demo"
                className="w-full h-full border-none bg-[#091321]"
              />
            </div>

            {/* Bottom Interaction Hint */}
            <div className="mt-2 text-[11px] text-[#94A3B8] font-manrope flex items-center gap-2">
              <span>🖱 Scroll with mouse wheel or trackpad to change pages</span>
              <span>•</span>
              <span>Use ‹ Previous / Next › to navigate</span>
            </div>
          </div>
        )}

      </main>
    </div>,
    document.body
  );
};

export default LiveDemoModal;
