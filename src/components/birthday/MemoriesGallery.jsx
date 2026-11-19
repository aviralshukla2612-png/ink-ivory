'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, X, ChevronLeft, ChevronRight, Calendar, Sparkles } from 'lucide-react';
import Image from 'next/image';

export function MemoriesGallery({
  heading = 'Our Memories ♡',
  subtitle = 'A gallery of moments that mean everything to us',
  memories = [],
}) {
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(null);

  const defaultMemories = [
    {
      id: 1,
      image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=800&auto=format&fit=crop&q=80',
      caption: "That spontaneous sunset walk where we couldn't stop laughing.",
      date: 'Spring Evening',
      rotation: -2,
    },
    {
      id: 2,
      image: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800&auto=format&fit=crop&q=80',
      caption: 'Coffee dates that turn into hours of heartfelt conversations.',
      date: 'Autumn Days',
      rotation: 2,
    },
    {
      id: 3,
      image: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=800&auto=format&fit=crop&q=80',
      caption: 'Under fairy lights, celebrating how magical life can be with you.',
      date: 'December Magic',
      rotation: -3,
    },
    {
      id: 4,
      image: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&auto=format&fit=crop&q=80',
      caption: "Here's to another year of dreams, joy, and unforgettable stories.",
      date: 'Golden Hour',
      rotation: 1.5,
    },
  ];

  const photoList = memories && memories.length > 0 ? memories : defaultMemories;

  const handlePrev = (e) => {
    e?.stopPropagation();
    setSelectedPhotoIndex((prev) => (prev > 0 ? prev - 1 : photoList.length - 1));
  };

  const handleNext = (e) => {
    e?.stopPropagation();
    setSelectedPhotoIndex((prev) => (prev < photoList.length - 1 ? prev + 1 : 0));
  };

  return (
    <section id="memories" className="py-20 sm:py-28 px-4 sm:px-6 relative overflow-hidden bg-[#F9E3DE]/35">
      <div className="max-w-6xl mx-auto relative z-10">
        
        {/* Section Heading */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/70 border border-[#E9CFA9] text-[#B62A42] text-[10px] font-sans font-semibold uppercase tracking-[0.25em] mb-3">
            <Camera className="w-3 h-3" />
            <span>Golden Highlights</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-medium text-[#481321]">
            {heading}
          </h2>

          <p className="font-serif italic text-base sm:text-lg text-[#681C2C]/80 mt-2 max-w-md mx-auto">
            {subtitle}
          </p>

          <div className="flex items-center justify-center gap-2 mt-4">
            <span className="w-12 h-[1px] bg-gradient-to-r from-transparent to-[#B62A42]" />
            <Sparkles className="w-3.5 h-3.5 text-[#B62A42]" />
            <span className="w-12 h-[1px] bg-gradient-to-l from-transparent to-[#B62A42]" />
          </div>
        </div>

        {/* Polaroid Memory Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 items-stretch">
          {photoList.map((photo, index) => {
            const rot = photo.rotation || (index % 2 === 0 ? -2 : 2);
            return (
              <motion.div
                key={photo.id || index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ delay: index * 0.12, duration: 0.7 }}
                whileHover={{ y: -8, scale: 1.03, rotate: 0 }}
                onClick={() => setSelectedPhotoIndex(index)}
                style={{ rotate: `${rot}deg` }}
                className="bg-white rounded-2xl p-4 shadow-[0_12px_30px_rgba(104,28,44,0.08)] border border-[#E9CFA9]/60 hover:shadow-xl transition-all duration-300 flex flex-col justify-between cursor-pointer group"
              >
                {/* Simulated Wooden Clip on Top */}
                <div className="w-4 h-7 rounded-sm bg-[#E9CFA9] border border-[#D9A441] shadow-xs mx-auto -mt-6 mb-2 relative z-10" />

                {/* Photo Image Frame */}
                <div className="relative w-full aspect-[4/4.5] rounded-xl overflow-hidden bg-[#FFF3EE]">
                  <Image
                    src={photo.image}
                    alt={photo.caption || 'Memory'}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-[#681C2C]/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="px-3 py-1 rounded-full bg-white/90 text-[#681C2C] text-xs font-sans font-medium shadow-sm">
                      View Full Size
                    </span>
                  </div>
                </div>

                {/* Polaroid Text & Date */}
                <div className="pt-3.5 pb-1 text-center flex-1 flex flex-col justify-between">
                  <p className="font-serif italic text-sm text-[#481321] leading-snug">
                    {photo.caption}
                  </p>
                  {photo.date && (
                    <div className="flex items-center justify-center gap-1.5 text-[11px] font-sans text-[#681C2C]/60 mt-2 font-medium">
                      <Calendar className="w-3 h-3 text-[#B62A42]" />
                      <span>{photo.date}</span>
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>

      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {selectedPhotoIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedPhotoIndex(null)}
            className="fixed inset-0 z-50 bg-[#2D0A14]/85 backdrop-blur-md p-4 sm:p-8 flex items-center justify-center select-none"
          >
            {/* Close Button */}
            <button
              onClick={() => setSelectedPhotoIndex(null)}
              className="absolute top-6 right-6 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors z-20 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Prev Button */}
            <button
              onClick={handlePrev}
              className="absolute left-4 sm:left-8 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/10 hover:bg-white/25 text-white flex items-center justify-center transition-colors z-20 cursor-pointer"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            {/* Next Button */}
            <button
              onClick={handleNext}
              className="absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/10 hover:bg-white/25 text-white flex items-center justify-center transition-colors z-20 cursor-pointer"
            >
              <ChevronRight className="w-6 h-6" />
            </button>

            {/* Modal Card Content */}
            <motion.div
              initial={{ scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.92, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-2xl w-full bg-white rounded-3xl p-4 sm:p-6 shadow-2xl flex flex-col items-center"
            >
              <div className="relative w-full aspect-[4/3] sm:aspect-[16/10] rounded-2xl overflow-hidden bg-[#F9E3DE]">
                <Image
                  src={photoList[selectedPhotoIndex].image}
                  alt={photoList[selectedPhotoIndex].caption || 'Enlarged Memory'}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="pt-4 text-center">
                <p className="font-serif italic text-lg sm:text-xl text-[#481321]">
                  {photoList[selectedPhotoIndex].caption}
                </p>
                {photoList[selectedPhotoIndex].date && (
                  <span className="text-xs font-sans text-[#B62A42] font-semibold mt-1 block">
                    {photoList[selectedPhotoIndex].date}
                  </span>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
