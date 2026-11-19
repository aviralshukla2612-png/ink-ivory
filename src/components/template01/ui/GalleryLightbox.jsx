'use client';

import React, { useEffect, useCallback } from 'react';
import Image from 'next/image';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

/**
 * GalleryLightbox Component
 * Editorial fullscreen lightbox modal with keyboard listeners and touch swipe.
 */
export const GalleryLightbox = ({
  images = [],
  currentIndex = 0,
  isOpen = false,
  onClose,
  onNext,
  onPrev,
}) => {
  const currentImage = images[currentIndex];

  const handleKeyDown = useCallback(
    (e) => {
      if (!isOpen) return;
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') onNext();
      if (e.key === 'ArrowLeft') onPrev();
    },
    [isOpen, onClose, onNext, onPrev]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, handleKeyDown]);

  if (!isOpen || !currentImage) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Wedding Photo Lightbox"
      className="fixed inset-0 z-50 bg-[#101624]/95 backdrop-blur-md flex items-center justify-center p-4 sm:p-8 animate-in fade-in duration-300 select-none"
    >
      {/* Top Bar: Counter & Close */}
      <div className="absolute top-5 inset-x-6 sm:inset-x-10 flex items-center justify-between text-[#F7F3EB] z-10">
        <div className="text-xs font-manrope font-semibold tracking-widest uppercase text-[#D8C39A]">
          {currentIndex + 1} / {images.length}
        </div>
        <button
          onClick={onClose}
          aria-label="Close Lightbox"
          className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Prev Button */}
      <button
        onClick={onPrev}
        aria-label="Previous photograph"
        className="absolute left-4 sm:left-8 top-1/2 -translate-y-1/2 p-3 rounded-full bg-[#172039]/80 border border-[#C5A46D]/40 text-[#D8C39A] hover:text-white hover:border-[#C5A46D] transition-all z-10 hover:scale-105"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>

      {/* Main Lightbox Image Viewport */}
      <div className="relative max-w-4xl max-h-[82vh] w-full h-full flex flex-col items-center justify-center">
        <div className="relative w-full h-[70vh] rounded-2xl overflow-hidden shadow-2xl border border-[#C5A46D]/30">
          <Image
            src={currentImage.src}
            alt={currentImage.caption || 'Royal wedding photograph'}
            fill
            sizes="(max-width: 1200px) 100vw, 1200px"
            className="object-contain"
            priority
          />
        </div>

        {/* Caption */}
        {currentImage.caption && (
          <p className="mt-4 text-center font-cormorant italic text-base sm:text-lg text-[#F7F3EB]/90 max-w-lg">
            {currentImage.caption}
          </p>
        )}
      </div>

      {/* Next Button */}
      <button
        onClick={onNext}
        aria-label="Next photograph"
        className="absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 p-3 rounded-full bg-[#172039]/80 border border-[#C5A46D]/40 text-[#D8C39A] hover:text-white hover:border-[#C5A46D] transition-all z-10 hover:scale-105"
      >
        <ChevronRight className="w-6 h-6" />
      </button>
    </div>
  );
};

export default GalleryLightbox;
