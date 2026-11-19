'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Heart, X, ZoomIn, Calendar } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const MemoryGallery = ({ gallery = [] }) => {
  const [activePhoto, setActivePhoto] = useState(null);

  return (
    <section id="memory-gallery" className="py-24 px-4 sm:px-6 bg-[#FFF4F0] relative overflow-hidden">
      <div className="max-w-6xl mx-auto relative z-10">
        {/* Section Heading */}
        <div className="text-center max-w-xl mx-auto mb-16">
          <p className="text-xs font-sans font-bold tracking-[0.3em] uppercase text-[#B51F3B] mb-3">
            SNAPSHOTS OF US
          </p>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl text-[#641D2B] font-bold tracking-tight mb-4">
            Memory Gallery
          </h2>
          <div className="flex items-center justify-center gap-3 my-4 text-[#E9A7A9]">
            <span className="w-12 h-px bg-current"></span>
            <Heart className="w-4 h-4 fill-[#B51F3B] text-[#B51F3B]" />
            <span className="w-12 h-px bg-current"></span>
          </div>
          <p className="font-serif italic text-base sm:text-lg text-[#4B3035]/80">
            A small collection of our favourite smiles, places, and memories.
          </p>
        </div>

        {/* Polaroids Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10">
          {gallery.map((item, index) => {
            const rot = item.rotation || (index % 2 === 0 ? -2.2 : 2.5);

            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ scale: 1.04, rotate: 0, zIndex: 20 }}
                style={{ rotate: `${rot}deg` }}
                onClick={() => setActivePhoto(item)}
                className="cursor-pointer bg-[#FFFCFA] p-4 pb-6 rounded-xl shadow-xl shadow-[#641D2B]/10 border border-[#F6D3D0] transition-all duration-300 relative group flex flex-col"
              >
                {/* Washi tape decal in top center */}
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-16 h-6 bg-[#F6D3D0]/60 backdrop-blur-xs border border-white/50 rotate-[-2deg] rounded-xs shadow-xs pointer-events-none" />

                {/* Photo frame */}
                <div className="relative aspect-square w-full rounded-lg overflow-hidden bg-[#FBE7E3] mb-4">
                  <Image
                    src={item.image}
                    alt={item.caption}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                    <ZoomIn className="w-8 h-8 drop-shadow-md" />
                  </div>
                </div>

                {/* Handwritten Caption */}
                <div className="text-center pt-1">
                  <p className="font-['Allura',cursive] text-2xl text-[#641D2B] leading-tight mb-1">
                    {item.caption}
                  </p>
                  <span className="text-[11px] font-sans font-bold tracking-widest uppercase text-[#B51F3B]/70">
                    {item.date}
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {activePhoto && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActivePhoto(null)}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4"
          >
            <motion.div
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.85, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-2xl w-full bg-[#FFFCFA] rounded-2xl p-4 sm:p-6 shadow-2xl border border-[#F6D3D0] flex flex-col items-center"
            >
              <button
                onClick={() => setActivePhoto(null)}
                className="absolute top-4 right-4 text-[#641D2B] p-2 rounded-full hover:bg-[#FFF4F0] transition-colors"
                title="Close"
              >
                <X className="w-6 h-6" />
              </button>

              <div className="relative aspect-square sm:aspect-[4/3] w-full rounded-xl overflow-hidden mb-4 bg-[#FBE7E3]">
                <Image
                  src={activePhoto.image}
                  alt={activePhoto.caption}
                  fill
                  className="object-cover"
                />
              </div>

              <div className="text-center w-full">
                <p className="font-['Allura',cursive] text-3xl sm:text-4xl text-[#641D2B] mb-1">
                  {activePhoto.caption}
                </p>
                <span className="text-xs font-sans font-bold tracking-widest uppercase text-[#B51F3B]">
                  {activePhoto.date}
                </span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};
