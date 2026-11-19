'use client';

import React from 'react';
import { MapPin, ExternalLink } from 'lucide-react';

/**
 * IllustratedMapCard Component (Feature 5.5)
 * Handcrafted Royal Jaipur palace territory illustrated in inline SVG.
 * Shows arterial roads, royal garden pavilions, lake, and an animated pulsing gold pin.
 * Click opens the Google Maps link directly.
 */
export const IllustratedMapCard = ({ mapsUrl = 'https://maps.google.com' }) => {
  return (
    <a
      href={mapsUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="group relative block w-full aspect-[16/10] sm:aspect-[16/9] rounded-2xl overflow-hidden border border-[#C5A46D]/40 bg-[#0E1524] shadow-[0_12px_40px_rgba(0,0,0,0.8),inset_0_0_30px_rgba(197,164,109,0.1)] transition-transform duration-300 hover:scale-[1.015] hover:border-[#C5A46D] focus:outline-none"
    >
      {/* Background SVG Map */}
      <svg
        viewBox="0 0 600 360"
        className="w-full h-full object-cover select-none"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <radialGradient id="mapGlow" cx="50%" cy="45%" r="65%">
            <stop offset="0%" stopColor="#1C2740" />
            <stop offset="60%" stopColor="#101726" />
            <stop offset="100%" stopColor="#0A0E18" />
          </radialGradient>
          <linearGradient id="lakeWater" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#183648" />
            <stop offset="100%" stopColor="#0F2432" />
          </linearGradient>
        </defs>

        {/* 1. Map Territory Ground */}
        <rect width="600" height="360" fill="url(#mapGlow)" />

        {/* 2. Topographical Contour Lines (Amber Fort Foothills) */}
        <path d="M 0 60 Q 150 40 300 80 T 600 50" stroke="#C5A46D" strokeWidth="1" strokeOpacity="0.15" fill="none" />
        <path d="M 0 110 Q 180 90 320 130 T 600 95" stroke="#C5A46D" strokeWidth="1" strokeOpacity="0.12" fill="none" />
        <path d="M 0 160 Q 200 130 350 180 T 600 140" stroke="#C5A46D" strokeWidth="1" strokeOpacity="0.1" fill="none" />

        {/* 3. Maota Lake / Water Body */}
        <path
          d="M 40 220 Q 90 190 160 210 Q 220 230 200 290 Q 180 340 100 340 Q 30 340 20 290 Z"
          fill="url(#lakeWater)"
          stroke="#C5A46D"
          strokeWidth="1.2"
          strokeOpacity="0.35"
        />
        <text x="95" y="275" fill="#8CA8BA" fontSize="10" fontFamily="sans-serif" letterSpacing="2" opacity="0.6">
          MAOTA LAKE
        </text>

        {/* 4. Heritage Garden Pavilions Grid */}
        <g stroke="#C5A46D" strokeWidth="0.8" strokeOpacity="0.2" fill="#141E33">
          <rect x="220" y="240" width="30" height="30" rx="3" />
          <rect x="260" y="240" width="30" height="30" rx="3" />
          <rect x="220" y="280" width="30" height="30" rx="3" />
          <rect x="260" y="280" width="30" height="30" rx="3" />
          {/* Water channels in Charbagh garden */}
          <line x1="210" y1="275" x2="300" y2="275" stroke="#183648" strokeWidth="2" />
          <line x1="255" y1="230" x2="255" y2="320" stroke="#183648" strokeWidth="2" />
        </g>
        <text x="225" y="335" fill="#C5A46D" fontSize="9" fontFamily="sans-serif" letterSpacing="1.5" opacity="0.6">
          ROYAL CHARBAGH
        </text>

        {/* 5. Main Arterial Roads (Amer Road, Jaipur Express Highway) */}
        {/* Road 1: Diagonal Main Access Highway */}
        <path
          d="M 0 320 Q 180 240 300 160 T 580 40"
          stroke="#C5A46D"
          strokeWidth="7"
          strokeOpacity="0.25"
          fill="none"
        />
        <path
          d="M 0 320 Q 180 240 300 160 T 580 40"
          stroke="#D8C39A"
          strokeWidth="1"
          strokeDasharray="8 6"
          strokeOpacity="0.7"
          fill="none"
        />

        {/* Road 2: Palace Boulevard Avenue */}
        <path
          d="M 300 160 L 300 230"
          stroke="#C5A46D"
          strokeWidth="5"
          strokeOpacity="0.3"
          fill="none"
        />

        {/* 6. Palace Compound Wall (The Heritage Palace Ground) */}
        <rect
          x="280"
          y="60"
          width="180"
          height="120"
          rx="12"
          fill="#1A2438"
          fillOpacity="0.85"
          stroke="#C5A46D"
          strokeWidth="1.8"
          strokeDasharray="6 3"
        />
        <text x="370" y="100" fill="#FAF5ED" fontSize="12" fontFamily="serif" textAnchor="middle" fontWeight="bold">
          THE HERITAGE PALACE
        </text>
        <text x="370" y="116" fill="#D8C39A" fontSize="9" fontFamily="sans-serif" textAnchor="middle" letterSpacing="1.5">
          JAIPUR, RAJASTHAN
        </text>

        {/* 7. Animated Pulsing Gold Venue Pin */}
        <g transform="translate(370, 140)">
          {/* Pulsing shockwaves */}
          <circle cx="0" cy="0" r="18" fill="#C5A46D" fillOpacity="0.2" className="animate-ping" />
          <circle cx="0" cy="0" r="10" fill="#C5A46D" fillOpacity="0.35" />
          <circle cx="0" cy="0" r="6" fill="#C5A46D" />
          <circle cx="0" cy="0" r="2.5" fill="#101624" />
        </g>
      </svg>

      {/* Floating Interactive Badge */}
      <div className="absolute bottom-3 left-3 right-3 sm:right-auto flex items-center justify-between gap-3 px-4 py-2.5 rounded-xl bg-[#101624]/90 backdrop-blur-md border border-[#C5A46D]/50 group-hover:border-[#C5A46D] transition-colors shadow-lg">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-[#C5A46D] flex items-center justify-center text-[#101624]">
            <MapPin className="w-3.5 h-3.5" />
          </div>
          <div>
            <span className="text-[11px] font-semibold text-[#FAF5ED] block leading-tight">
              Interactive Palace Grounds Map
            </span>
            <span className="text-[9px] text-[#D8C39A] uppercase tracking-wider block">
              Tap to open live navigation ↗
            </span>
          </div>
        </div>
        <ExternalLink className="w-3.5 h-3.5 text-[#C5A46D] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
      </div>
    </a>
  );
};

export default IllustratedMapCard;
