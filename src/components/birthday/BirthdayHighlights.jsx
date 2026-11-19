'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Camera, Mail, Gift } from 'lucide-react';

export function BirthdayHighlights({ highlights, onSelectSection }) {
  const defaultHighlights = [
    {
      id: 'wish',
      title: 'My Wish',
      desc: 'A special message from my heart',
      icon: Sparkles,
    },
    {
      id: 'memories',
      title: 'Our Memories',
      desc: 'Some of our best moments together',
      icon: Camera,
    },
    {
      id: 'note',
      title: 'A Little Note',
      desc: 'A heartfelt wax-sealed letter',
      icon: Mail,
    },
    {
      id: 'surprise',
      title: 'Birthday Surprise',
      desc: 'Something special just for you',
      icon: Gift,
    },
  ];

  const items = highlights && highlights.length ? highlights.map((h, i) => {
    const iconMap = { Sparkles, Camera, Mail, Gift };
    return {
      ...h,
      IconComponent: iconMap[h.icon] || defaultHighlights[i % 4].icon,
    };
  }) : defaultHighlights.map(h => ({ ...h, IconComponent: h.icon }));

  const handleClick = (id) => {
    if (onSelectSection) {
      onSelectSection(id);
    } else {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative z-20 py-8 px-4 sm:px-6 bg-[#F9E3DE]/40 border-y border-[#E9CFA9]/40 backdrop-blur-sm select-none">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {items.map((item, index) => {
            const Icon = item.IconComponent || Sparkles;
            return (
              <motion.button
                key={item.id}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                whileHover={{ y: -4, scale: 1.02 }}
                onClick={() => handleClick(item.id)}
                className="p-4 sm:p-5 rounded-2xl bg-white/70 hover:bg-white border border-[#E9CFA9]/60 hover:border-[#B62A42]/40 shadow-sm hover:shadow-md transition-all text-left flex flex-col justify-between cursor-pointer group"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="w-9 h-9 rounded-xl bg-[#FFF3EE] border border-[#E9CFA9] flex items-center justify-center text-[#B62A42] group-hover:bg-[#B62A42] group-hover:text-white transition-colors">
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] font-mono text-[#681C2C]/50 font-bold">
                    0{index + 1}
                  </span>
                </div>

                <div>
                  <h3 className="text-sm sm:text-base font-serif font-bold text-[#481321] group-hover:text-[#B62A42] transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-[11px] text-[#51363A]/80 font-sans mt-0.5 line-clamp-1">
                    {item.desc}
                  </p>
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
