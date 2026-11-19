'use client';

import React from 'react';
import Image from 'next/image';
import { Heart, Calendar, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

export const OurStory = ({ story = [] }) => {
  return (
    <section id="our-story" className="py-24 px-4 sm:px-6 bg-[#FFF4F0] relative overflow-hidden">
      {/* Background ambient accents */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-b from-[#FBE7E3]/60 to-transparent blur-3xl pointer-events-none" />

      <div className="max-w-5xl mx-auto relative z-10">
        {/* Section Heading */}
        <div className="text-center max-w-xl mx-auto mb-20">
          <p className="text-xs font-sans font-bold tracking-[0.3em] uppercase text-[#B51F3B] mb-3">
            OUR JOURNEY TOGETHER
          </p>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl text-[#641D2B] font-bold tracking-tight mb-4">
            Every Love Story Has Its Moments
          </h2>
          <div className="flex items-center justify-center gap-3 my-4 text-[#E9A7A9]">
            <span className="w-12 h-px bg-current"></span>
            <Heart className="w-4 h-4 fill-[#B51F3B] text-[#B51F3B]" />
            <span className="w-12 h-px bg-current"></span>
          </div>
          <p className="font-serif italic text-base sm:text-lg text-[#4B3035]/80">
            From an ordinary afternoon to the greatest adventure of my life.
          </p>
        </div>

        {/* Timeline Container */}
        <div className="relative">
          {/* Central Vertical Timeline Line */}
          <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-[#B51F3B] via-[#E9A7A9] to-[#B51F3B] -translate-x-1/2 opacity-40" />

          <div className="space-y-16 sm:space-y-24">
            {story.map((item, index) => {
              const isEven = index % 2 === 0;

              return (
                <div
                  key={item.title}
                  className={`flex flex-col md:flex-row items-center gap-8 md:gap-14 ${
                    isEven ? 'md:flex-row-reverse' : ''
                  }`}
                >
                  {/* Photo Card */}
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.7, delay: index * 0.1 }}
                    className="w-full md:w-1/2 flex justify-center"
                  >
                    <div className="relative p-3 bg-white rounded-2xl shadow-xl shadow-[#641D2B]/8 border border-[#F6D3D0] max-w-sm w-full group hover:-translate-y-1 transition-transform duration-300">
                      <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-[#FBE7E3]">
                        <Image
                          src={item.image}
                          alt={item.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-700"
                        />
                        <div className="absolute top-3 left-3 bg-white/85 backdrop-blur-sm px-3 py-1 rounded-full text-[11px] font-sans font-bold uppercase tracking-wider text-[#641D2B]">
                          {item.tag}
                        </div>
                      </div>
                    </div>
                  </motion.div>

                  {/* Central Heart Marker on Desktop */}
                  <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 w-10 h-10 rounded-full bg-[#FFF4F0] border-2 border-[#B51F3B] items-center justify-center text-[#B51F3B] shadow-md z-10">
                    <Heart className="w-4 h-4 fill-current" />
                  </div>

                  {/* Story Details Card */}
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.7, delay: index * 0.1 + 0.1 }}
                    className={`w-full md:w-1/2 text-center ${
                      isEven ? 'md:text-right' : 'md:text-left'
                    }`}
                  >
                    <div className="inline-flex items-center gap-2 text-xs font-sans font-bold tracking-widest uppercase text-[#B51F3B] bg-[#FBE7E3]/60 px-3 py-1 rounded-full mb-3">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{item.date}</span>
                    </div>

                    <h3 className="font-serif text-2xl sm:text-3xl text-[#641D2B] font-bold mb-3">
                      {item.title}
                    </h3>

                    <p className="font-serif italic text-base sm:text-lg text-[#4B3035]/85 leading-relaxed max-w-md mx-auto md:mx-0">
                      &ldquo;{item.description}&rdquo;
                    </p>
                  </motion.div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
