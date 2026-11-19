'use client';

import React from 'react';

/**
 * Handcrafted Flattering Indian Wedding Caricatures (Section 6)
 * - Flattering, cute, distinct proportions with soft round features and warm smiles.
 * - Aarav: Warm wheaten Indian skin tone (#D8A882), neatly groomed dark hair, refined royal beard,
 *   wearing a regal ivory sherwani (#FAF5ED) with gold zardozi collar and champagne gold stole.
 * - Riya: Radiant warm fair Indian skin tone (#E4BA97), expressive almond eyes, delicate maang tikka,
 *   gold jhumkas, rose bridal blush, wearing an imperial crimson & gold lehenga (#8B1D2C).
 */

export const GroomCaricature = ({ className = 'w-48 h-56' }) => (
  <svg
    viewBox="0 0 200 240"
    className={`drop-shadow-[0_12px_28px_rgba(0,0,0,0.6)] ${className}`}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      <linearGradient id="groomSherwani" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FFFDF7" />
        <stop offset="50%" stopColor="#F4EDE0" />
        <stop offset="100%" stopColor="#E3D7C1" />
      </linearGradient>
      <linearGradient id="goldBrocade" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#C5A46D" />
        <stop offset="50%" stopColor="#EADBC0" />
        <stop offset="100%" stopColor="#C5A46D" />
      </linearGradient>
      <linearGradient id="groomStole" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#D8C39A" />
        <stop offset="100%" stopColor="#B38D4A" />
      </linearGradient>
    </defs>

    {/* Halo Glow */}
    <circle cx="100" cy="115" r="88" fill="#C5A46D" fillOpacity="0.12" />

    {/* Body / Shoulders: Royal Ivory Sherwani */}
    <path
      d="M 45 235 L 55 168 C 65 152, 135 152, 145 168 L 155 235 Z"
      fill="url(#groomSherwani)"
      stroke="#C5A46D"
      strokeWidth="1.5"
    />

    {/* Mandarin Collar with Gold Trim */}
    <path
      d="M 82 152 L 82 165 C 82 170, 118 170, 118 165 L 118 152 Z"
      fill="url(#goldBrocade)"
      stroke="#8C6D37"
      strokeWidth="1"
    />

    {/* Sherwani Placket & Gold Buttons */}
    <line x1="100" y1="165" x2="100" y2="235" stroke="#C5A46D" strokeWidth="1.5" />
    <circle cx="100" cy="178" r="2.5" fill="#C5A46D" />
    <circle cx="100" cy="192" r="2.5" fill="#C5A46D" />
    <circle cx="100" cy="206" r="2.5" fill="#C5A46D" />
    <circle cx="100" cy="220" r="2.5" fill="#C5A46D" />

    {/* Champagne Gold Dupatta / Stole draped across left shoulder */}
    <path
      d="M 52 170 C 48 190, 50 215, 48 235 L 68 235 C 70 205, 68 185, 72 170 Z"
      fill="url(#groomStole)"
      stroke="#C5A46D"
      strokeWidth="1"
    />

    {/* Neck */}
    <rect x="88" y="138" width="24" height="20" rx="6" fill="#D8A882" />

    {/* Groom Head: Flattering Cute Caricature Face */}
    {/* Ears */}
    <circle cx="58" cy="98" r="8.5" fill="#D8A882" />
    <circle cx="142" cy="98" r="8.5" fill="#D8A882" />

    {/* Face Base */}
    <path
      d="M 64 82 C 60 120, 72 144, 100 144 C 128 144, 140 120, 136 82 C 136 50, 64 50, 64 82 Z"
      fill="#D8A882"
    />

    {/* Handsome Trimmed Beard & Stubble */}
    <path
      d="M 66 98 C 66 128, 76 142, 100 142 C 124 142, 134 128, 134 98 C 126 106, 114 110, 100 110 C 86 110, 74 106, 66 98 Z"
      fill="#2A2421"
      fillOpacity="0.88"
    />

    {/* Cheerful Warm Smile */}
    <path
      d="M 88 120 Q 100 128 112 120"
      stroke="#FAF5ED"
      strokeWidth="2.5"
      strokeLinecap="round"
      fill="none"
    />

    {/* Nose */}
    <path d="M 97 96 Q 100 106 104 106" stroke="#B88660" strokeWidth="2" strokeLinecap="round" fill="none" />

    {/* Expressive Warm Eyes */}
    <ellipse cx="82" cy="92" rx="4.5" ry="5.5" fill="#1C140E" />
    <ellipse cx="118" cy="92" rx="4.5" ry="5.5" fill="#1C140E" />
    {/* Catchlight sparkles */}
    <circle cx="83.5" cy="90.5" r="1.5" fill="#FFFFFF" />
    <circle cx="119.5" cy="90.5" r="1.5" fill="#FFFFFF" />

    {/* Eyebrows */}
    <path d="M 74 83 Q 83 78 91 82" stroke="#1C140E" strokeWidth="3" strokeLinecap="round" fill="none" />
    <path d="M 109 82 Q 117 78 126 83" stroke="#1C140E" strokeWidth="3" strokeLinecap="round" fill="none" />

    {/* Stylish Groom Hairstyle (Voluminous pompadour with tapered fade) */}
    <path
      d="M 60 76 C 58 48, 80 32, 100 32 C 126 32, 144 48, 140 76 C 132 58, 116 52, 100 52 C 82 52, 68 60, 60 76 Z"
      fill="#1C140E"
    />
    <path
      d="M 64 78 Q 78 40 102 38 Q 130 38 138 72 Q 124 48 98 48 Q 78 48 64 78 Z"
      fill="#2E231D"
    />
  </svg>
);

export const BrideCaricature = ({ className = 'w-48 h-56' }) => (
  <svg
    viewBox="0 0 200 240"
    className={`drop-shadow-[0_12px_28px_rgba(0,0,0,0.6)] ${className}`}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      <linearGradient id="brideLehenga" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#9E1B2E" />
        <stop offset="50%" stopColor="#801020" />
        <stop offset="100%" stopColor="#5E0B16" />
      </linearGradient>
      <linearGradient id="goldZari" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#C5A46D" />
        <stop offset="50%" stopColor="#FFF2D6" />
        <stop offset="100%" stopColor="#C5A46D" />
      </linearGradient>
    </defs>

    {/* Halo Glow */}
    <circle cx="100" cy="115" r="88" fill="#C5A46D" fillOpacity="0.12" />

    {/* Body / Shoulders: Imperial Crimson & Gold Lehenga Choli */}
    <path
      d="M 48 235 L 58 172 C 68 156, 132 156, 142 172 L 152 235 Z"
      fill="url(#brideLehenga)"
      stroke="#C5A46D"
      strokeWidth="1.5"
    />

    {/* Gold Zari Neck Border & Royal Kundan Choker Necklace */}
    <path
      d="M 78 162 Q 100 178 122 162"
      stroke="url(#goldZari)"
      strokeWidth="4"
      strokeLinecap="round"
      fill="none"
    />
    {/* Hanging Kundan pearls */}
    {[84, 92, 100, 108, 116].map((x) => (
      <circle key={x} cx={x} cy="172" r="2.2" fill="#FAF5ED" stroke="#C5A46D" strokeWidth="0.8" />
    ))}

    {/* Sheer Red Net Dupatta with Scalloped Gold Borders over head */}
    <path
      d="M 38 78 C 30 130, 36 210, 46 235 L 56 235 C 48 200, 45 140, 52 88 Z"
      fill="#8B1D2C"
      fillOpacity="0.85"
    />
    <path
      d="M 162 78 C 170 130, 164 210, 154 235 L 144 235 C 152 200, 155 140, 148 88 Z"
      fill="#8B1D2C"
      fillOpacity="0.85"
    />

    {/* Neck */}
    <rect x="89" y="138" width="22" height="20" rx="6" fill="#E4BA97" />

    {/* Bride Head: Graceful Cute Caricature Face */}
    {/* Ears & Gold Jhumkas */}
    <circle cx="60" cy="102" r="7.5" fill="#E4BA97" />
    <circle cx="140" cy="102" r="7.5" fill="#E4BA97" />
    {/* Left Jhumka */}
    <path d="M 57 106 L 57 114 Q 57 120 52 122 L 62 122 Q 57 120 57 114" fill="#C5A46D" stroke="#FAF5ED" strokeWidth="0.5" />
    {/* Right Jhumka */}
    <path d="M 143 106 L 143 114 Q 143 120 138 122 L 148 122 Q 143 120 143 114" fill="#C5A46D" stroke="#FAF5ED" strokeWidth="0.5" />

    {/* Face Base */}
    <path
      d="M 66 84 C 62 122, 74 142, 100 142 C 126 142, 138 122, 134 84 C 134 52, 66 52, 66 84 Z"
      fill="#E4BA97"
    />

    {/* Rosy Bridal Cheeks */}
    <ellipse cx="76" cy="112" rx="7" ry="4" fill="#E88B8B" fillOpacity="0.5" />
    <ellipse cx="124" cy="112" rx="7" ry="4" fill="#E88B8B" fillOpacity="0.5" />

    {/* Radiant Warm Smile with Rose Lips */}
    <path
      d="M 88 122 Q 100 132 112 122"
      stroke="#A8283B"
      strokeWidth="3"
      strokeLinecap="round"
      fill="#C94459"
    />

    {/* Cute Small Nose & Gold Nath (Nose Ring) */}
    <path d="M 98 100 Q 100 108 103 108" stroke="#C4936E" strokeWidth="1.8" strokeLinecap="round" fill="none" />
    <circle cx="95" cy="107" r="3.2" stroke="#C5A46D" strokeWidth="1" fill="none" />

    {/* Almond Eyes with Kohl / Eyeliner */}
    <ellipse cx="82" cy="94" rx="5" ry="6" fill="#1C140E" />
    <ellipse cx="118" cy="94" rx="5" ry="6" fill="#1C140E" />
    {/* Winged liner */}
    <path d="M 74 94 Q 82 87 90 94" stroke="#000" strokeWidth="2.5" fill="none" strokeLinecap="round" />
    <path d="M 110 94 Q 118 87 126 94" stroke="#000" strokeWidth="2.5" fill="none" strokeLinecap="round" />
    {/* Sparkle highlights */}
    <circle cx="83.5" cy="92.5" r="1.8" fill="#FFFFFF" />
    <circle cx="119.5" cy="92.5" r="1.8" fill="#FFFFFF" />

    {/* Arched Eyebrows & Red Bindi */}
    <path d="M 74 84 Q 82 79 90 83" stroke="#1C140E" strokeWidth="2.2" strokeLinecap="round" fill="none" />
    <path d="M 110 83 Q 118 79 126 84" stroke="#1C140E" strokeWidth="2.2" strokeLinecap="round" fill="none" />
    <circle cx="100" cy="85" r="2.2" fill="#8B1D2C" />

    {/* Bridal Updo Hair & Jasmine Gajra Flowers */}
    <path
      d="M 60 76 C 58 44, 78 34, 100 34 C 122 34, 142 44, 140 76 C 132 56, 116 50, 100 50 C 84 50, 68 56, 60 76 Z"
      fill="#1C140E"
    />
    {/* Jasmine floral garland */}
    <circle cx="64" cy="52" r="3.5" fill="#FAF5ED" />
    <circle cx="72" cy="44" r="3.5" fill="#FAF5ED" />
    <circle cx="82" cy="38" r="3.5" fill="#FAF5ED" />
    <circle cx="118" cy="38" r="3.5" fill="#FAF5ED" />
    <circle cx="128" cy="44" r="3.5" fill="#FAF5ED" />
    <circle cx="136" cy="52" r="3.5" fill="#FAF5ED" />

    {/* Delicate Royal Gold Maang Tikka */}
    <line x1="100" y1="36" x2="100" y2="72" stroke="#C5A46D" strokeWidth="1.5" />
    <circle cx="100" cy="74" r="4.5" fill="#C5A46D" stroke="#FAF5ED" strokeWidth="1" />
    <circle cx="100" cy="74" r="1.8" fill="#8B1D2C" />
  </svg>
);

export const CoupleTogetherCaricature = ({ className = 'w-64 h-72' }) => (
  <div className={`relative flex items-center justify-center ${className}`}>
    <div className="flex items-center -space-x-8">
      <GroomCaricature className="w-40 sm:w-48 h-52 sm:h-60 transform -rotate-2" />
      <BrideCaricature className="w-40 sm:w-48 h-52 sm:h-60 transform rotate-2 z-10" />
    </div>
  </div>
);

export default { GroomCaricature, BrideCaricature, CoupleTogetherCaricature };
