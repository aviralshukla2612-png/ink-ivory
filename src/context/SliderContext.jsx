'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';

const SLIDES = [
  { id: 'welcome', label: 'Welcome', index: 0 },
  { id: 'save-the-date', label: 'Save the Date', index: 1 },
  { id: 'overview', label: 'Celebrations', index: 2 },
  { id: 'haldi', label: 'Haldi Ceremony', index: 3 },
  { id: 'mehendi', label: 'Mehendi Ceremony', index: 4 },
  { id: 'sangeet', label: 'Sangeet Night', index: 5 },
  { id: 'wedding', label: 'Wedding Ceremony', index: 6 },
  { id: 'reception', label: 'Imperial Reception', index: 7 },
  { id: 'blessings', label: 'Family Blessings', index: 8 },
  { id: 'venue', label: 'Venue & Location', index: 9 },
  { id: 'closing', label: 'Wishes & Closing', index: 10 },
];

const SliderContext = createContext({
  currentSlide: 0,
  totalSlides: SLIDES.length,
  slides: SLIDES,
  goToSlide: () => {},
  nextSlide: () => {},
  prevSlide: () => {},
  isFirstSlide: true,
  isLastSlide: false,
  isAutoPlaying: false,
  toggleAutoPlay: () => {},
});

export const SliderProvider = ({
  children,
  active = true,
  autoAdvance = false,
  autoInterval = 2000,
}) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(autoAdvance);
  const totalSlides = SLIDES.length;
  const isTransitioning = useRef(false);

  const goToSlide = useCallback(
    (index) => {
      if (index >= 0 && index < totalSlides) {
        setCurrentSlide(index);
      }
    },
    [totalSlides]
  );

  const nextSlide = useCallback(() => {
    if (isTransitioning.current) return;
    isTransitioning.current = true;
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
    setTimeout(() => {
      isTransitioning.current = false;
    }, 600);
  }, [totalSlides]);

  const prevSlide = useCallback(() => {
    if (isTransitioning.current) return;
    isTransitioning.current = true;
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
    setTimeout(() => {
      isTransitioning.current = false;
    }, 600);
  }, [totalSlides]);

  const toggleAutoPlay = useCallback(() => {
    setIsAutoPlaying((prev) => !prev);
  }, []);

  // Update autoPlaying state when prop changes
  useEffect(() => {
    setIsAutoPlaying(autoAdvance);
  }, [autoAdvance]);

  // AUTO-ADVANCE: in phone view, automatically scrolls every 2 seconds (looping)
  useEffect(() => {
    if (!active || !isAutoPlaying) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % totalSlides);
    }, autoInterval);

    return () => clearInterval(interval);
  }, [active, isAutoPlaying, autoInterval, totalSlides]);

  // Message listener for parent frame controls (Live Demo Modal)
  useEffect(() => {
    const handleMessage = (e) => {
      if (e.data?.action === 'nextSlide') nextSlide();
      if (e.data?.action === 'prevSlide') prevSlide();
      if (e.data?.action === 'toggleAutoPlay') toggleAutoPlay();
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [nextSlide, prevSlide, toggleAutoPlay]);

  // Keyboard navigation (Arrow keys, Space)
  useEffect(() => {
    if (!active) return;

    const handleKeyDown = (e) => {
      if (['INPUT', 'TEXTAREA'].includes(e.target.tagName)) return;

      if (e.key === 'ArrowRight' || e.key === 'ArrowDown' || e.key === 'PageDown' || e.key === ' ') {
        e.preventDefault();
        nextSlide();
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp' || e.key === 'PageUp') {
        e.preventDefault();
        prevSlide();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [active, nextSlide, prevSlide]);

  // Debounced Wheel / Trackpad navigation (1 slide per deliberate wheel gesture)
  useEffect(() => {
    if (!active) return;

    let wheelTimer = null;
    let accumulatedDelta = 0;

    const handleWheel = (e) => {
      accumulatedDelta += e.deltaY;
      if (wheelTimer) return;

      wheelTimer = setTimeout(() => {
        if (accumulatedDelta > 30) {
          nextSlide();
        } else if (accumulatedDelta < -30) {
          prevSlide();
        }
        accumulatedDelta = 0;
        wheelTimer = null;
      }, 70);
    };

    window.addEventListener('wheel', handleWheel, { passive: true });
    return () => {
      window.removeEventListener('wheel', handleWheel);
      if (wheelTimer) clearTimeout(wheelTimer);
    };
  }, [active, nextSlide, prevSlide]);

  // Touch Swipe navigation (Mobile & Tablet)
  useEffect(() => {
    if (!active) return;

    let touchStartX = 0;
    let touchStartY = 0;

    const handleTouchStart = (e) => {
      touchStartX = e.touches[0].clientX;
      touchStartY = e.touches[0].clientY;
    };

    const handleTouchEnd = (e) => {
      const touchEndX = e.changedTouches[0].clientX;
      const touchEndY = e.changedTouches[0].clientY;
      const diffX = touchStartX - touchEndX;
      const diffY = touchStartY - touchEndY;

      // Check if horizontal swipe is stronger than vertical
      if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 35) {
        if (diffX > 0) {
          nextSlide();
        } else {
          prevSlide();
        }
      }
    };

    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchend', handleTouchEnd, { passive: true });
    return () => {
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [active, nextSlide, prevSlide]);

  return (
    <SliderContext.Provider
      value={{
        currentSlide,
        totalSlides,
        slides: SLIDES,
        goToSlide,
        nextSlide,
        prevSlide,
        isFirstSlide: currentSlide === 0,
        isLastSlide: currentSlide === totalSlides - 1,
        isAutoPlaying,
        toggleAutoPlay,
      }}
    >
      {children}
    </SliderContext.Provider>
  );
};

export const useSlider = () => useContext(SliderContext);
