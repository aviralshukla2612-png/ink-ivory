'use client';

import React from 'react';
import { Heart, Sparkles, Smile, Compass, Music, Sun } from 'lucide-react';
import { motion } from 'framer-motion';

// Map icon strings to Lucide components
const iconMap = {
  Sparkles: Sparkles,
  Smile: Smile,
  Heart: Heart,
  Compass: Compass,
  Music: Music,
  Sun: Sun,
};

export const WhyYou = ({ reasons = [] }) => {
  return (
    <section id="why-you" className="py-24 px-4 sm:px-6 bg-[#FBE7E3]/60 relative overflow-hidden">
      <div className="max-w-6xl mx-auto relative z-10">
        {/* Section Heading */}
        <div className="text-center max-w-xl mx-auto mb-16">
          <p className="text-xs font-sans font-bold tracking-[0.3em] uppercase text-[#B51F3B] mb-3">
            FROM MY HEART
          </p>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl text-[#641D2B] font-bold tracking-tight mb-4">
            Little Things I Love About You
          </h2>
          <div className="flex items-center justify-center gap-3 my-4 text-[#E9A7A9]">
            <span className="w-12 h-px bg-current"></span>
            <Heart className="w-4 h-4 fill-[#B51F3B] text-[#B51F3B]" />
            <span className="w-12 h-px bg-current"></span>
          </div>
          <p className="font-serif italic text-base sm:text-lg text-[#4B3035]/80">
            Out of a million reasons in the world, here are just a few.
          </p>
        </div>

        {/* Reasons Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {reasons.map((item, index) => {
            const IconComponent = iconMap[item.icon] || Heart;
            const rot = index % 2 === 0 ? -1 : 1.2;

            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.6, delay: index * 0.08 }}
                whileHover={{ y: -6, rotate: 0 }}
                style={{ rotate: `${rot}deg` }}
                className="bg-[#FFFCFA] p-8 rounded-2xl border border-[#F6D3D0] shadow-xl shadow-[#641D2B]/6 flex flex-col items-start transition-all duration-300 relative group"
              >
                {/* Number Badge */}
                <span className="absolute top-6 right-6 text-xs font-sans font-bold tracking-widest text-[#B51F3B]/40 uppercase">
                  0{item.id}
                </span>

                {/* Icon */}
                <div className="w-12 h-12 rounded-full bg-[#FFF4F0] border border-[#F6D3D0] flex items-center justify-center text-[#B51F3B] mb-5 group-hover:scale-110 group-hover:bg-[#B51F3B] group-hover:text-white transition-all duration-300">
                  <IconComponent className="w-5 h-5" />
                </div>

                {/* Reason Title */}
                <h3 className="font-serif text-2xl text-[#641D2B] font-bold mb-3">
                  {item.title}
                </h3>

                {/* Description */}
                <p className="font-serif italic text-base text-[#4B3035]/80 leading-relaxed">
                  &ldquo;{item.description}&rdquo;
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
