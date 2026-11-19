'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Heart, Sparkles, Quote } from 'lucide-react';

export function MyWish({
  heading = 'A Wish From My Heart ♡',
  subtitle = 'Because you deserve every ounce of joy in the universe',
  paragraphs = [],
  recipientName = 'Ananya',
  senderName = 'Kabir',
}) {
  const defaultParagraphs = [
    'On your special day, I wish you endless happiness, beautiful opportunities, vibrant health, and countless reasons to smile.',
    'May every dream you carry come closer to reality, and may life surprise you with unforgettable adventures and quiet moments of contentment.',
  ];

  const contentParagraphs = paragraphs && paragraphs.length > 0 ? paragraphs : defaultParagraphs;

  return (
    <section id="wish" className="py-20 sm:py-28 px-4 sm:px-6 relative overflow-hidden bg-[#FFF3EE]">
      {/* Background Soft Glows */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-80 h-80 rounded-full bg-[#F4CFCA]/30 blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 right-0 -translate-y-1/2 w-80 h-80 rounded-full bg-[#E9CFA9]/25 blur-3xl pointer-events-none" />

      <div className="max-w-4xl mx-auto relative z-10">
        
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/70 border border-[#E9CFA9] text-[#B62A42] text-[10px] font-sans font-semibold uppercase tracking-[0.25em] mb-3">
            <Sparkles className="w-3 h-3" />
            <span>Heartfelt Blessing</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-medium text-[#481321] leading-tight">
            {heading}
          </h2>

          <p className="font-serif italic text-base sm:text-lg text-[#681C2C]/80 mt-2 max-w-lg mx-auto">
            {subtitle}
          </p>

          <div className="flex items-center justify-center gap-3 mt-4">
            <span className="w-16 h-[1px] bg-gradient-to-r from-transparent to-[#E9CFA9]" />
            <Heart className="w-3.5 h-3.5 text-[#B62A42] fill-current" />
            <span className="w-16 h-[1px] bg-gradient-to-l from-transparent to-[#E9CFA9]" />
          </div>
        </div>

        {/* Wish Stationery Card */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="relative rounded-3xl bg-[#FFFCF9] border border-[#E9CFA9]/80 p-8 sm:p-14 shadow-[0_20px_50px_rgba(104,28,44,0.08)]"
        >
          {/* Subtle Top Gold Corner Accents */}
          <div className="absolute top-4 left-4 w-6 h-6 border-t-2 border-l-2 border-[#E9CFA9]" />
          <div className="absolute top-4 right-4 w-6 h-6 border-t-2 border-r-2 border-[#E9CFA9]" />
          <div className="absolute bottom-4 left-4 w-6 h-6 border-b-2 border-l-2 border-[#E9CFA9]" />
          <div className="absolute bottom-4 right-4 w-6 h-6 border-b-2 border-r-2 border-[#E9CFA9]" />

          {/* Quote Icon */}
          <div className="w-12 h-12 rounded-full bg-[#FFF3EE] border border-[#E9CFA9] flex items-center justify-center text-[#B62A42] mx-auto mb-6 shadow-sm">
            <Quote className="w-5 h-5 opacity-80" />
          </div>

          {/* Recipient Salute */}
          <div className="text-center mb-6">
            <span className="text-xs uppercase tracking-[0.25em] text-[#B62A42] font-semibold">
              Dearest
            </span>
            <h3 className="text-2xl sm:text-3xl font-serif text-[#481321] font-bold mt-1">
              {recipientName}
            </h3>
          </div>

          {/* Message Paragraphs */}
          <div className="space-y-4 text-center max-w-2xl mx-auto">
            {contentParagraphs.map((para, i) => (
              <p
                key={i}
                className="text-base sm:text-lg text-[#51363A] font-serif leading-relaxed"
              >
                {para}
              </p>
            ))}
          </div>

          {/* Sender Signature */}
          <div className="mt-10 pt-6 border-t border-[#F4CFCA]/60 flex flex-col items-center justify-center text-center">
            <span className="font-serif italic text-sm text-[#51363A]/70">
              With deepest affection and warm wishes,
            </span>
            <span
              className="text-3xl sm:text-4xl text-[#681C2C] mt-2 select-none"
              style={{ fontFamily: "'Allura', 'Great Vibes', cursive" }}
            >
              {senderName}
            </span>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
