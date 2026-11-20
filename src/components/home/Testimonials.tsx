'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';
import { Star, ChevronLeft, ChevronRight } from 'lucide-react';

export const Testimonials: React.FC = () => {
  const reviews = [
    {
      name: 'Riya & Arjun K.',
      occasion: 'Royal Navy Wedding Web Page',
      stars: 5,
      review:
        '“We shared our wedding web page digitally with over 300 guests across 4 countries. Everyone commented on how incredibly regal and luxurious the live presentation looked. Saved us so much time and stress!”',
      initials: 'RA',
    },
    {
      name: 'Dr. Meera Malhotra',
      occasion: 'Silver Anniversary Web Page',
      stars: 5,
      review:
        '“The typography and botanical gold borders are exquisite. Being able to customize our personal page in minutes and share the live link directly on WhatsApp was wonderful.”',
      initials: 'MM',
    },
    {
      name: 'Kabir & Tanya',
      occasion: 'Engagement Announcement Web Page',
      stars: 5,
      review:
        '“You Are Mine is by far the most elegant digital invitation platform we came across. The editor was super smooth and the live web page looked breathtaking on high-density mobile screens.”',
      initials: 'KT',
    },
    {
      name: 'Ananya Sen',
      occasion: '30th Birthday Celebration Page',
      stars: 5,
      review:
        '“I personalized my birthday event web page in under 3 minutes. The gold foil details and editorial layout made it look like a custom commission from a luxury studio. Absolutely in love!”',
      initials: 'AS',
    },
    {
      name: 'Rohan & Pooja Mehta',
      occasion: 'Regal Baby Shower Page',
      stars: 5,
      review:
        '“Our family loved the interactive web page presentation. Publishing the page and sharing it instantly over WhatsApp was a breeze. We received compliments from every single guest!”',
      initials: 'RP',
    },
  ];

  // Starting with Dr. Meera Malhotra as center (index 1) to match the reference mockup
  const [centerIndex, setCenterIndex] = useState(1);
  const [isPaused, setIsPaused] = useState(false);
  const touchStartX = useRef<number | null>(null);

  const prevReview = useCallback(() => {
    setCenterIndex((prev) => (prev === 0 ? reviews.length - 1 : prev - 1));
  }, [reviews.length]);

  const nextReview = useCallback(() => {
    setCenterIndex((prev) => (prev === reviews.length - 1 ? 0 : prev + 1));
  }, [reviews.length]);

  // Smooth Auto-Scroll every 2 seconds (pauses ONLY when mouse directly hovers the cards)
  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      nextReview();
    }, 2000);
    return () => clearInterval(interval);
  }, [nextReview, isPaused]);

  // Mobile Touch Swipe Handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX.current - touchEndX;

    if (diff > 40) {
      nextReview();
    } else if (diff < -40) {
      prevReview();
    }
    touchStartX.current = null;
  };

  // Indices for left, center, and right cards
  const leftIndex = (centerIndex - 1 + reviews.length) % reviews.length;
  const rightIndex = (centerIndex + 1) % reviews.length;

  const visibleCards = [
    { review: reviews[leftIndex], isCenter: false, role: 'left', index: leftIndex },
    { review: reviews[centerIndex], isCenter: true, role: 'center', index: centerIndex },
    { review: reviews[rightIndex], isCenter: false, role: 'right', index: rightIndex },
  ];

  return (
    <section className="relative w-full py-16 sm:py-24 border-b border-[#EDE2CF] select-none overflow-hidden bg-[#FAF7F2]">
      {/* Background Artwork: testimonialbg.png with NO gradient fog overlay */}
      <div className="absolute inset-0 z-0 pointer-events-none select-none">
        <Image
          src="/testimonialbg.png"
          alt="You Are Mine luxury testimonial background"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
          quality={95}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-12">
          {/* Eyebrow: — REAL EXPERIENCES — */}
          <div className="flex items-center justify-center gap-3 sm:gap-4 mb-2">
            <div className="h-[1px] w-10 sm:w-16 bg-[#C5A059]/60" />
            <span className="text-[10.5px] sm:text-[11.5px] font-semibold tracking-[0.24em] uppercase text-[#9E7B3B]">
              Real Experiences
            </span>
            <div className="h-[1px] w-10 sm:w-16 bg-[#C5A059]/60" />
          </div>

          {/* Main Title: Loved by Our Customers */}
          <h2 className="text-2xl sm:text-3xl md:text-[42px] font-serif font-medium text-[#231C16] tracking-tight leading-tight">
            Loved by{' '}
            <span className="italic font-serif text-[#B88E4B] font-medium">
              Our Customers
            </span>
          </h2>

          {/* Center Gold Crest Ornament */}
          <div className="flex items-center justify-center mt-2.5 text-[#C5A059]">
            <span className="text-xs tracking-widest opacity-90">❖</span>
          </div>
        </div>

        {/* 3-Card Carousel with Side Navigation Arrows */}
        <div className="relative max-w-6xl mx-auto flex items-center justify-center gap-2 sm:gap-4 lg:gap-6">

          {/* Previous Arrow Button */}
          <button
            onClick={prevReview}
            aria-label="Previous review"
            className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white/95 border border-[#DFCDAE] text-[#8C6837] shadow-[0_4px_14px_rgba(180,140,80,0.14)] flex items-center justify-center hover:bg-[#FAF4EA] hover:border-[#C5A059] hover:scale-105 active:scale-95 transition-all duration-200 flex-shrink-0 cursor-pointer z-20 backdrop-blur-xs"
          >
            <ChevronLeft className="w-5 h-5 stroke-[2.2]" />
          </button>

          {/* Cards Viewport with Generous Padding to Prevent ANY Border or Shadow Clipping */}
          <div
            className="w-full flex-1 py-5 px-1 sm:px-2"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            {/* Desktop: 3 Cards Row / Mobile: 1 Centered Card */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 lg:gap-6 items-stretch">
              {visibleCards.map(({ review, isCenter, role, index }) => (
                <div
                  key={`${review.name}-${index}`}
                  onClick={() => !isCenter && setCenterIndex(index)}
                  className={`transition-all duration-500 ease-out flex ${role === 'left' ? 'hidden md:flex' : ''
                    } ${role === 'right' ? 'hidden md:flex' : ''
                    }`}
                >
                  {/* Card Container without scaling clipping */}
                  <div
                    className={`w-full bg-white rounded-[24px] p-6 sm:p-7 text-left flex flex-col justify-between transition-all duration-300 ${isCenter
                      ? 'border-2 border-[#C5A059] shadow-[0_16px_36px_-6px_rgba(180,140,80,0.22),0_4px_12px_rgba(0,0,0,0.03)] ring-1 ring-[#C5A059]/30'
                      : 'border border-[#EDE4D5] shadow-[0_8px_24px_-6px_rgba(180,140,80,0.08)] opacity-95 hover:border-[#C5A059]/60 cursor-pointer'
                      }`}
                  >
                    <div>
                      {/* 5 Golden Stars (Left-Aligned) */}
                      <div className="flex items-center gap-1 mb-3.5 text-[#A77B35]">
                        {[...Array(review.stars)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 fill-[#A77B35] text-[#A77B35]" />
                        ))}
                      </div>

                      {/* Review Quote (Serif Italic) */}
                      <p className="text-[13px] sm:text-[13.5px] text-[#2C2114] leading-[1.65] font-serif italic mb-6">
                        {review.review}
                      </p>
                    </div>

                    {/* Reviewer Details (Left-Aligned with Top Hairline) */}
                    <div className="flex items-center gap-3 pt-4 border-t border-[#EDE4D5]/80">
                      <div className="w-9 h-9 rounded-full bg-[#EFE7D8] text-[#8C6D37] font-serif font-bold text-xs flex items-center justify-center flex-shrink-0">
                        {review.initials}
                      </div>
                      <div className="min-w-0">
                        <h3 className="font-bold text-[13.5px] sm:text-[14px] text-[#231C16] leading-tight">
                          {review.name}
                        </h3>
                        <p className="text-[11px] sm:text-[11.5px] text-[#8C7359] mt-0.5 truncate">
                          {review.occasion}
                        </p>
                      </div>
                    </div>

                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Next Arrow Button */}
          <button
            onClick={nextReview}
            aria-label="Next review"
            className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white/95 border border-[#DFCDAE] text-[#8C6837] shadow-[0_4px_14px_rgba(180,140,80,0.14)] flex items-center justify-center hover:bg-[#FAF4EA] hover:border-[#C5A059] hover:scale-105 active:scale-95 transition-all duration-200 flex-shrink-0 cursor-pointer z-20 backdrop-blur-xs"
          >
            <ChevronRight className="w-5 h-5 stroke-[2.2]" />
          </button>

        </div>

        {/* Bottom Pagination Dots */}
        <div className="flex items-center justify-center gap-2 mt-8">
          {reviews.map((_, i) => (
            <button
              key={i}
              onClick={() => setCenterIndex(i)}
              aria-label={`Go to review ${i + 1}`}
              className={`transition-all duration-300 cursor-pointer rounded-full ${centerIndex === i
                ? 'w-2.5 h-2.5 bg-[#A77B35] ring-2 ring-[#DFCDAE]'
                : 'w-2 h-2 bg-[#DFCDAE] hover:bg-[#C5A059]'
                }`}
            />
          ))}
        </div>

      </div>
    </section>
  );
};
