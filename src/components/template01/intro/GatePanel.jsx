'use client';

import React from 'react';

/**
 * GatePanel Component
 * Architectural Royal Indian Palace Double Door Panel.
 * Realistic layered architectural craftsmanship:
 * - Rich Royal Navy-Black carved hardwood finish
 * - Mughal / Rajput cusped jharokha arch with gold leaf inlay
 * - Handcrafted geometric Jaali lattice with back-lit depth
 * - Heavy antique cast-brass lotus medallion and articulated ring knocker
 * - Hand-forged brass stud rivets and structural edge reinforcement brackets
 */
export const GatePanel = ({ side = 'left' }) => {
  const isLeft = side === 'left';

  return (
    <div
      className={`relative w-full h-full bg-[#0D1322] overflow-hidden select-none ${
        isLeft
          ? 'border-r-2 border-[#C5A46D]/80 shadow-[inset_-20px_0_45px_rgba(0,0,0,0.9),inset_6px_0_20px_rgba(197,164,109,0.2)]'
          : 'border-l-2 border-[#C5A46D]/80 shadow-[inset_20px_0_45px_rgba(0,0,0,0.9),inset_-6px_0_20px_rgba(197,164,109,0.2)]'
      }`}
    >
      {/* 1. Heavy Palace Hardwood Grain Texture */}
      <div
        className="absolute inset-0 opacity-90"
        style={{
          background: `
            linear-gradient(${isLeft ? '90deg' : '270deg'}, rgba(13,19,34,0.98) 0%, rgba(20,29,50,0.85) 50%, rgba(10,15,28,0.98) 100%),
            repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,0,0,0.18) 3px, rgba(0,0,0,0.18) 6px)
          `,
        }}
      />

      {/* 2. Ambient Palace Torchlight Glow on Door Surface */}
      <div
        className={`absolute top-1/4 ${
          isLeft ? 'right-0' : 'left-0'
        } w-[350px] h-[350px] bg-[#C5A46D]/10 rounded-full blur-[90px] pointer-events-none`}
      />

      {/* 3. Outer Heavy Architectural Wood Frame with Gold Inlay Borders */}
      <div className="absolute inset-3 sm:inset-5 md:inset-8 border-2 border-[#C5A46D]/60 rounded-t-[110px] sm:rounded-t-[160px] pointer-events-none shadow-[0_0_25px_rgba(0,0,0,0.8)]">
        {/* Inner Fine Filigree Bevel Border */}
        <div className="absolute inset-2 sm:inset-3 border border-[#C5A46D]/35 rounded-t-[100px] sm:rounded-t-[150px]" />

        {/* 4. Top Crown Arch: Rajput / Mughal Cusped Jharokha Arch */}
        <div className="absolute top-0 inset-x-0 h-36 sm:h-52 flex items-center justify-center overflow-hidden">
          <svg
            viewBox="0 0 320 180"
            className="w-full h-full text-[#C5A46D] drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]"
            fill="none"
          >
            {/* Cusped Royal Arch Profile */}
            <path
              d="M 15 180 Q 20 95, 75 60 Q 110 40, 135 20 Q 160 0, 160 0 Q 160 0, 185 20 Q 210 40, 245 60 Q 300 95, 305 180"
              stroke="#D8C39A"
              strokeWidth="3"
            />
            {/* Secondary Inner Arch Foil */}
            <path
              d="M 30 180 Q 35 105, 85 72 Q 115 54, 138 34 Q 160 16, 160 16 Q 160 16, 182 34 Q 205 54, 235 72 Q 285 105, 290 180"
              stroke="#C5A46D"
              strokeWidth="1.5"
              strokeDasharray="4 2"
              opacity="0.85"
            />
            {/* Radiating Rays of Royalty */}
            <path d="M 160 16 L 160 180" stroke="#C5A46D" strokeWidth="1.5" opacity="0.65" />
            <path d="M 160 16 L 95 180" stroke="#C5A46D" strokeWidth="1.2" opacity="0.45" />
            <path d="M 160 16 L 225 180" stroke="#C5A46D" strokeWidth="1.2" opacity="0.45" />
            <path d="M 160 16 L 40 180" stroke="#C5A46D" strokeWidth="1" opacity="0.35" />
            <path d="M 160 16 L 280 180" stroke="#C5A46D" strokeWidth="1" opacity="0.35" />
            {/* Royal Gold Sunburst Finial */}
            <circle cx="160" cy="18" r="8" fill="url(#goldGradFinial)" />
            <circle cx="160" cy="18" r="4" fill="#101624" />
            <defs>
              <radialGradient id="goldGradFinial" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#FFF2D6" />
                <stop offset="50%" stopColor="#C5A46D" />
                <stop offset="100%" stopColor="#8C6D37" />
              </radialGradient>
            </defs>
          </svg>
        </div>

        {/* 5. Center Section: Symmetrical Intricate Royal Jaali Lattice */}
        <div className="absolute top-40 sm:top-56 bottom-40 sm:bottom-56 inset-x-3 sm:inset-x-6 border-2 border-[#C5A46D]/40 rounded-2xl overflow-hidden bg-[#080C16]/85 shadow-[inset_0_4px_25px_rgba(0,0,0,0.95)] flex items-center justify-center p-4">
          {/* Layered Geometric Hexagonal & Floral Jaali Pattern */}
          <div
            className="w-full h-full opacity-35"
            style={{
              backgroundImage: `
                radial-gradient(circle at 50% 50%, #D8C39A 1.5px, transparent 2px),
                linear-gradient(60deg, transparent 47%, #C5A46D 48%, #C5A46D 52%, transparent 53%),
                linear-gradient(-60deg, transparent 47%, #C5A46D 48%, #C5A46D 52%, transparent 53%),
                linear-gradient(0deg, transparent 47%, #C5A46D 48%, #C5A46D 52%, transparent 53%)
              `,
              backgroundSize: '28px 32px, 28px 32px, 28px 32px, 28px 32px',
            }}
          />

          {/* Symmetrical Vertical Carved Gold Railings */}
          <div className="absolute inset-y-0 inset-x-8 flex justify-between pointer-events-none opacity-20">
            <div className="w-[1px] h-full bg-[#C5A46D]" />
            <div className="w-[1px] h-full bg-[#C5A46D]" />
            <div className="w-[1px] h-full bg-[#C5A46D]" />
          </div>

          {/* 6. Heavy Cast Brass Lotus Medallion & Door Knocker */}
          <div
            className={`absolute top-1/2 -translate-y-1/2 flex flex-col items-center z-20 ${
              isLeft ? 'right-4 sm:right-8' : 'left-4 sm:left-8'
            }`}
          >
            {/* Cast Gold / Brass Lotus Medallion Plate */}
            <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-full border-2 border-[#D8C39A] bg-gradient-to-br from-[#1C2842] via-[#101726] to-[#0A0E18] flex items-center justify-center shadow-[0_8px_30px_rgba(0,0,0,0.95),inset_0_2px_4px_rgba(255,255,255,0.4)]">
              {/* Embossed Sunburst Medallion Artwork */}
              <svg viewBox="0 0 100 100" className="w-full h-full text-[#C5A46D]" fill="none">
                <circle cx="50" cy="50" r="44" stroke="#8C6D37" strokeWidth="1.5" />
                <circle cx="50" cy="50" r="38" stroke="#D8C39A" strokeWidth="1" strokeDasharray="3 2" />
                <circle cx="50" cy="50" r="28" stroke="#C5A46D" strokeWidth="2" />
                <circle cx="50" cy="50" r="14" fill="#C5A46D" />
                <circle cx="50" cy="50" r="6" fill="#101624" />
                {/* 12 Radiant Petals */}
                {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg) => (
                  <line
                    key={deg}
                    x1="50"
                    y1="50"
                    x2={50 + 28 * Math.cos((deg * Math.PI) / 180)}
                    y2={50 + 28 * Math.sin((deg * Math.PI) / 180)}
                    stroke="#D8C39A"
                    strokeWidth="1.8"
                  />
                ))}
              </svg>

              {/* Hanging Heavy Brass Ring Knocker */}
              <div className="absolute top-[58px] sm:top-[70px] w-12 h-16 sm:w-14 sm:h-20 rounded-full border-[3.5px] border-[#D8C39A] bg-transparent shadow-[0_10px_16px_rgba(0,0,0,0.85)] flex items-end justify-center pb-2">
                <div className="w-3 h-3 rounded-full bg-[#C5A46D] shadow-inner" />
              </div>
            </div>
          </div>
        </div>

        {/* 7. Bottom Reinforced Wood Base with Antique Brass Rivets */}
        <div className="absolute bottom-4 sm:bottom-7 inset-x-3 sm:inset-x-6 h-28 sm:h-36 border-2 border-[#C5A46D]/40 rounded-b-2xl bg-[#090E1A]/90 flex flex-col justify-around py-3 px-6 shadow-inner">
          <div className="flex items-center justify-around">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-gradient-to-br from-[#FFF0D4] via-[#C5A46D] to-[#5C421A] shadow-[0_3px_8px_rgba(0,0,0,0.9),inset_0_1px_2px_rgba(255,255,255,0.9)] border border-[#8C6D37]"
              />
            ))}
          </div>
          <div className="flex items-center justify-around">
            {[5, 6, 7, 8].map((i) => (
              <div
                key={i}
                className="w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full bg-gradient-to-br from-[#FFF0D4] via-[#C5A46D] to-[#5C421A] shadow-[0_3px_8px_rgba(0,0,0,0.9),inset_0_1px_2px_rgba(255,255,255,0.9)] border border-[#8C6D37]"
              />
            ))}
          </div>
        </div>
      </div>

      {/* 8. Symmetrical Side Edge Bevel & Seam Shadows */}
      <div
        className={`absolute inset-y-0 w-3 pointer-events-none ${
          isLeft
            ? 'right-0 bg-gradient-to-l from-black/95 to-transparent'
            : 'left-0 bg-gradient-to-r from-black/95 to-transparent'
        }`}
      />
    </div>
  );
};

export default GatePanel;
