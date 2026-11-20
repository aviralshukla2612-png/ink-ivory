'use client';

import React from 'react';
import { motion } from 'framer-motion';

// =========================================================================
// BESPOKE LUXURY ICONS FOR YOU ARE MINE CELEBRATION
// Dual-tone gold foil, deep burgundy, and soft blush accents
// =========================================================================

function WishIcon() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="transition-transform duration-300 group-hover:scale-110"
    >
      <defs>
        <linearGradient id="wishGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFF3D6" />
          <stop offset="45%" stopColor="#E9CFA9" />
          <stop offset="85%" stopColor="#D9A441" />
          <stop offset="100%" stopColor="#B62A42" />
        </linearGradient>
      </defs>
      {/* 8-Point Ornate Radiant Starburst */}
      <path
        d="M12 1.5L13.8 8C14.3 9.7 15.6 11 17.3 11.5L23.5 12.5L17.3 13.5C15.6 14 14.3 15.3 13.8 17L12 23.5L10.2 17C9.7 15.3 8.4 14 6.7 13.5L0.5 12.5L6.7 11.5C8.4 11 9.7 9.7 10.2 8L12 1.5Z"
        fill="url(#wishGrad)"
        stroke="#681C2C"
        strokeWidth="0.8"
        strokeLinejoin="round"
      />
      {/* Center glowing jewel */}
      <circle cx="12" cy="12.5" r="2.4" fill="#FFFCF9" />
      <circle cx="12" cy="12.5" r="1.3" fill="#B62A42" />
      {/* Delicate floating sparkles */}
      <path d="M19.5 3.5L20 5L21.5 5.5L20 6L19.5 7.5L19 6L17.5 5.5L19 5L19.5 3.5Z" fill="#D9A441" />
      <path d="M4.5 18L5 19.2L6.2 19.6L5 20L4.5 21.2L4 20L2.8 19.6L4 19.2L4.5 18Z" fill="#E9CFA9" />
    </svg>
  );
}

function MemoriesIcon() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="transition-transform duration-300 group-hover:scale-110"
    >
      <defs>
        <linearGradient id="camGold" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFF8ED" />
          <stop offset="45%" stopColor="#E9CFA9" />
          <stop offset="100%" stopColor="#D9A441" />
        </linearGradient>
      </defs>
      {/* Vintage Polaroid Camera Body */}
      <rect x="2" y="5.5" width="20" height="15.5" rx="4" fill="url(#camGold)" stroke="#681C2C" strokeWidth="1.2" />
      {/* Top Rangefinder Flash */}
      <path d="M7.5 5.5V3.8C7.5 3.3 7.9 2.9 8.4 2.9H12.6C13.1 2.9 13.5 3.3 13.5 3.8V5.5" fill="#681C2C" />
      <circle cx="10.5" cy="4.2" r="0.8" fill="#FFD875" />
      {/* Shutter Accent Button */}
      <rect x="16.5" y="3.5" width="3" height="2" rx="0.6" fill="#B62A42" />
      {/* Circular Outer Lens Ring */}
      <circle cx="12" cy="13.2" r="5.2" fill="#FFFCF9" stroke="#681C2C" strokeWidth="1.1" />
      {/* Lens Core with Golden Heart Aperture */}
      <circle cx="12" cy="13.2" r="3.4" fill="#681C2C" />
      <path
        d="M12 14.8L10.8 13.7C9.7 12.6 9.7 11.5 10.6 10.8C11.1 10.4 11.7 10.6 12 11.1C12.3 10.6 12.9 10.4 13.4 10.8C14.3 11.5 14.3 12.6 13.2 13.7L12 14.8Z"
        fill="#FFD875"
      />
      {/* Glass Shimmer */}
      <path d="M14.2 11.2A3.2 3.2 0 0 0 10.2 10.8" stroke="#FFF" strokeWidth="0.8" strokeLinecap="round" />
    </svg>
  );
}

function NoteIcon() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="transition-transform duration-300 group-hover:scale-110"
    >
      <defs>
        <linearGradient id="envGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="100%" stopColor="#F9E3DE" />
        </linearGradient>
      </defs>
      {/* Envelope Body */}
      <rect x="2" y="4.5" width="20" height="15.5" rx="3" fill="url(#envGrad)" stroke="#681C2C" strokeWidth="1.2" />
      {/* Subtle Bottom Fold Flaps */}
      <path d="M2.5 19L9.5 12.5" stroke="#D9A441" strokeWidth="0.9" strokeLinecap="round" />
      <path d="M21.5 19L14.5 12.5" stroke="#D9A441" strokeWidth="0.9" strokeLinecap="round" />
      {/* Flap Triangle */}
      <path d="M2.5 5.5L12 13.5L21.5 5.5" fill="#F4CFCA" stroke="#681C2C" strokeWidth="1.1" strokeLinejoin="round" />
      {/* Authentic Burgundy Wax Seal with Gold Heart */}
      <circle cx="12" cy="13.2" r="3.5" fill="#B62A42" stroke="#481321" strokeWidth="0.8" />
      <path
        d="M12 14.7L11 13.7C10.1 12.8 10.1 11.8 10.8 11.2C11.3 10.8 11.8 10.9 12 11.4C12.2 10.9 12.7 10.8 13.2 11.2C13.9 11.8 13.9 12.8 13 13.7L12 14.7Z"
        fill="#FFD875"
      />
    </svg>
  );
}

function SurpriseIcon() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="transition-transform duration-300 group-hover:scale-110"
    >
      <defs>
        <linearGradient id="giftBody" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#B62A42" />
          <stop offset="65%" stopColor="#681C2C" />
          <stop offset="100%" stopColor="#481321" />
        </linearGradient>
        <linearGradient id="goldRibbon" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#FFF2D6" />
          <stop offset="50%" stopColor="#E9CFA9" />
          <stop offset="100%" stopColor="#D9A441" />
        </linearGradient>
      </defs>
      {/* Lower Gift Box */}
      <rect x="3" y="9.5" width="18" height="11.5" rx="2.5" fill="url(#giftBody)" stroke="#E9CFA9" strokeWidth="0.9" />
      {/* Vertical Golden Satin Ribbon */}
      <rect x="10.5" y="9.5" width="3" height="11.5" fill="url(#goldRibbon)" />
      {/* Box Lid with Overhang */}
      <rect x="2" y="6.6" width="20" height="3.5" rx="1.5" fill="#B62A42" stroke="#E9CFA9" strokeWidth="0.9" />
      <rect x="10.5" y="6.6" width="3" height="3.5" fill="url(#goldRibbon)" />
      {/* Grand Multi-Loop Silk Bow */}
      <path
        d="M12 6.6C9.2 6.6 7 4.5 7.8 2.8C8.5 1.5 10.6 2.8 12 5.2"
        fill="url(#goldRibbon)"
        stroke="#681C2C"
        strokeWidth="0.6"
      />
      <path
        d="M12 6.6C14.8 6.6 17 4.5 16.2 2.8C15.5 1.5 13.4 2.8 12 5.2"
        fill="url(#goldRibbon)"
        stroke="#681C2C"
        strokeWidth="0.6"
      />
      {/* Ribbon Center Knot */}
      <circle cx="12" cy="6" r="1.5" fill="#FFD875" stroke="#681C2C" strokeWidth="0.5" />
      {/* Golden Celebration Sparkle */}
      <path d="M19 2.5L19.5 3.5L20.5 4L19.5 4.5L19 5.5L18.5 4.5L17.5 4L18.5 3.5L19 2.5Z" fill="#D9A441" />
    </svg>
  );
}

// =========================================================================
// MAIN HIGHLIGHTS COMPONENT
// =========================================================================

export function BirthdayHighlights({ highlights, onSelectSection }) {
  const defaultHighlights = [
    {
      id: 'wish',
      title: 'My Wish',
      desc: 'A special message from my heart',
      IconComponent: WishIcon,
    },
    {
      id: 'memories',
      title: 'Our Memories',
      desc: 'Some of our best moments together',
      IconComponent: MemoriesIcon,
    },
    {
      id: 'note',
      title: 'A Little Note',
      desc: 'A heartfelt wax-sealed letter',
      IconComponent: NoteIcon,
    },
    {
      id: 'surprise',
      title: 'Birthday Surprise',
      desc: 'Something special just for you',
      IconComponent: SurpriseIcon,
    },
  ];

  const items = highlights && highlights.length ? highlights.map((h, i) => {
    const iconLookup = {
      wish: WishIcon,
      Sparkles: WishIcon,
      memories: MemoriesIcon,
      Camera: MemoriesIcon,
      note: NoteIcon,
      Mail: NoteIcon,
      surprise: SurpriseIcon,
      Gift: SurpriseIcon,
    };
    return {
      ...h,
      IconComponent: iconLookup[h.id] || iconLookup[h.icon] || defaultHighlights[i % 4].IconComponent,
    };
  }) : defaultHighlights;

  const handleClick = (id) => {
    if (onSelectSection) {
      onSelectSection(id);
    } else {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative z-20 py-10 px-4 sm:px-6 bg-[#F9E3DE]/35 border-y border-[#E9CFA9]/45 backdrop-blur-sm select-none">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {items.map((item, index) => {
            const Icon = item.IconComponent || WishIcon;
            return (
              <motion.button
                key={item.id}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                whileHover={{ y: -5, scale: 1.02 }}
                onClick={() => handleClick(item.id)}
                className="p-5 sm:p-6 rounded-3xl bg-[#FFFCF9]/90 hover:bg-white border border-[#E9CFA9]/70 hover:border-[#B62A42]/50 shadow-[0_8px_24px_rgba(104,28,44,0.06)] hover:shadow-[0_16px_36px_rgba(104,28,44,0.12)] transition-all duration-300 text-left flex flex-col justify-between cursor-pointer group relative overflow-hidden"
              >
                {/* Subtle Top Gold Highlight Line on Card */}
                <div className="absolute top-0 left-6 right-6 h-[2px] bg-gradient-to-r from-transparent via-[#E9CFA9] to-transparent group-hover:via-[#B62A42] transition-colors" />

                {/* Top Row: Luxury Icon Medallion + Step Pill */}
                <div className="flex items-center justify-between mb-4">
                  {/* Luxury Contoured Medallion Container */}
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#FFF3EE] via-[#FFFCF9] to-[#F9E3DE] border border-[#E9CFA9] shadow-[0_4px_12px_rgba(104,28,44,0.06)] flex items-center justify-center group-hover:border-[#B62A42]/50 group-hover:shadow-[0_8px_20px_rgba(182,42,66,0.18)] transition-all duration-300">
                    <Icon />
                  </div>

                  {/* Elegant Number Pill */}
                  <span className="px-2.5 py-0.5 rounded-full bg-[#FFF3EE] border border-[#E9CFA9]/70 text-[10px] font-mono font-bold text-[#681C2C]/75 group-hover:text-[#B62A42] group-hover:border-[#B62A42]/30 transition-colors">
                    0{index + 1}
                  </span>
                </div>

                {/* Bottom Row: Typography */}
                <div className="pt-1">
                  <h3 className="text-base sm:text-lg font-serif font-bold text-[#481321] group-hover:text-[#B62A42] transition-colors leading-snug">
                    {item.title}
                  </h3>
                  <p className="text-xs text-[#51363A]/80 font-sans mt-1 line-clamp-1 leading-relaxed">
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
