'use client';

import React from 'react';

export const HowItWorks: React.FC = () => {
  return (
    <section className="relative w-full bg-[#FAF7F2] py-16 sm:py-24 border-b border-[#EDE2CF] select-none">
      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
          {/* Eyebrow: — ✦ SEAMLESS PROCESS ✦ — */}
          <div className="flex items-center justify-center gap-2.5 sm:gap-3.5 mb-2.5">
            <div className="h-[1px] w-8 sm:w-14 bg-gradient-to-r from-transparent to-[#C5A059]" />
            <span className="text-[#C5A059] text-[10px] sm:text-xs">✦</span>
            <span className="text-[10.5px] sm:text-[11.5px] font-semibold tracking-[0.24em] uppercase text-[#9E7B3B]">
              Seamless Process
            </span>
            <span className="text-[#C5A059] text-[10px] sm:text-xs">✦</span>
            <div className="h-[1px] w-8 sm:w-14 bg-gradient-to-l from-transparent to-[#C5A059]" />
          </div>

          {/* Main Title: Create Your Perfect Web Page in 3 Simple Steps */}
          <h2 className="text-2xl sm:text-3xl md:text-[38px] font-serif font-medium text-[#231C16] tracking-tight leading-tight">
            Create Your Perfect Web Page in{' '}
            <span className="italic font-serif text-[#B88E4B] font-medium whitespace-nowrap">
              3 Simple Steps
            </span>
          </h2>
        </div>

        {/* 3-Card Row with Connecting Hairlines & Diamond Nodes */}
        <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-0 relative">
          
          {/* STEP 1 CARD */}
          <div className="relative w-full max-w-[340px] md:max-w-none md:flex-1 bg-white rounded-[28px] border border-[#EDE4D5] shadow-[0_16px_36px_-6px_rgba(180,140,80,0.12),0_4px_12px_rgba(0,0,0,0.03)] p-8 sm:p-9 text-center flex flex-col items-center overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_24px_44px_-8px_rgba(180,140,80,0.18),0_6px_16px_rgba(0,0,0,0.04)] z-10">
            
            {/* Top-Left Gold Corner Fold Accent */}
            <svg 
              className="absolute top-0 left-0 w-14 h-14 pointer-events-none select-none z-10" 
              viewBox="0 0 56 56" 
              fill="none"
            >
              <path 
                d="M0 0 L0 40 C0 40, 15 40, 29 29 C40 15, 40 0, 40 0 Z" 
                fill="url(#goldGradTL)" 
              />
              <path 
                d="M0 0 L0 40 C11 35, 35 11, 40 0 Z" 
                fill="url(#goldGradTL2)" 
                opacity="0.35" 
              />
              <defs>
                <linearGradient id="goldGradTL" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="#DFBE83" />
                  <stop offset="45%" stopColor="#F5E3BD" />
                  <stop offset="100%" stopColor="#B28A44" />
                </linearGradient>
                <linearGradient id="goldGradTL2" x1="0" y1="40" x2="40" y2="0" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="#FFFFFF" />
                  <stop offset="100%" stopColor="#A77B35" />
                </linearGradient>
              </defs>
            </svg>

            {/* Laurel Crest & Icon Container */}
            <div className="relative w-28 h-20 flex items-center justify-center mb-2">
              
              {/* Laurel Branch Left */}
              <svg className="absolute left-1 top-2.5 w-6 h-14 pointer-events-none" viewBox="0 0 24 54" fill="none">
                <path d="M21 52 C15 42, 6 30, 8 6" stroke="#C5A059" strokeWidth="1.2" strokeLinecap="round" />
                <path d="M18 45 C11 43, 6 40, 4 35 C7 35, 13 38, 16 42" fill="#D4AF37" opacity="0.9" />
                <path d="M14 34 C7 32, 3 28, 2 23 C5 24, 10 27, 13 31" fill="#D4AF37" opacity="0.9" />
                <path d="M11 23 C5 20, 2 15, 3 10 C6 12, 9 16, 10 20" fill="#D4AF37" opacity="0.9" />
                <path d="M9 10 C6 7, 5 3, 7 1 C9 3, 10 6, 9 10" fill="#D4AF37" opacity="0.9" />
              </svg>

              {/* Laurel Branch Right */}
              <svg className="absolute right-1 top-2.5 w-6 h-14 pointer-events-none" viewBox="0 0 24 54" fill="none">
                <path d="M3 52 C9 42, 18 30, 16 6" stroke="#C5A059" strokeWidth="1.2" strokeLinecap="round" />
                <path d="M6 45 C13 43, 18 40, 20 35 C17 35, 11 38, 8 42" fill="#D4AF37" opacity="0.9" />
                <path d="M10 34 C17 32, 21 28, 22 23 C19 24, 14 27, 11 31" fill="#D4AF37" opacity="0.9" />
                <path d="M13 23 C19 20, 22 15, 21 10 C18 12, 15 16, 14 20" fill="#D4AF37" opacity="0.9" />
                <path d="M15 10 C18 7, 19 3, 17 1 C15 3, 14 6, 15 10" fill="#D4AF37" opacity="0.9" />
              </svg>

              {/* Center Circular Badge */}
              <div 
                className="w-[70px] h-[70px] rounded-full border border-[#E8DAC6] flex items-center justify-center relative z-10 shadow-[inset_0_1px_2px_rgba(255,255,255,0.9),0_3px_8px_rgba(180,140,80,0.08)]"
                style={{
                  background: 'radial-gradient(circle at 35% 35%, #FBF6EE 0%, #F3E7D5 100%)',
                }}
              >
                {/* Artist Palette Icon */}
                <svg width="27" height="27" viewBox="0 0 24 24" fill="none" stroke="#8C6837" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="13.5" cy="6.5" r=".5" fill="#8C6837" />
                  <circle cx="17.5" cy="10.5" r=".5" fill="#8C6837" />
                  <circle cx="8.5" cy="7.5" r=".5" fill="#8C6837" />
                  <circle cx="6.5" cy="12.5" r=".5" fill="#8C6837" />
                  <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z" />
                </svg>
              </div>
            </div>

            {/* Swallowtail Ribbon Banner: STEP 01 */}
            <div className="relative inline-flex items-center justify-center px-4 py-0.5 bg-gradient-to-r from-[#DFBE83] via-[#F5E3BD] to-[#CCA45E] shadow-[0_2px_5px_rgba(180,140,80,0.16)] mb-3.5 before:content-[''] before:absolute before:top-0 before:bottom-0 before:-left-1.5 before:w-2 before:bg-inherit before:[clip-path:polygon(100%_0,100%_100%,0_50%)] after:content-[''] after:absolute after:top-0 after:bottom-0 after:-right-1.5 after:w-2 after:bg-inherit after:[clip-path:polygon(0_0,0_100%,100%_50%)]">
              <span className="text-[10px] font-bold tracking-[0.16em] uppercase text-[#3E2F1A]">
                STEP 01
              </span>
            </div>

            {/* Title */}
            <h3 className="font-serif text-[21px] sm:text-[22px] font-medium text-[#231C16] mb-2 tracking-tight">
              Choose a Design
            </h3>

            {/* Description */}
            <p className="text-[13px] sm:text-[13.5px] text-[#726050] leading-relaxed max-w-[240px] mx-auto">
              Explore our collection and find the perfect web page design for your occasion.
            </p>
          </div>

          {/* DESKTOP CONNECTOR 1 -> 2 */}
          <div className="hidden md:flex flex-0 items-center justify-center w-10 lg:w-14 relative z-0">
            <div className="h-[1px] w-full bg-[#DFCDAE] relative flex items-center justify-center">
              <div className="w-2 h-2 bg-[#C5A059] rotate-45 rounded-[0.5px] shadow-2xs" />
            </div>
          </div>

          {/* STEP 2 CARD */}
          <div className="relative w-full max-w-[340px] md:max-w-none md:flex-1 bg-white rounded-[28px] border border-[#EDE4D5] shadow-[0_16px_36px_-6px_rgba(180,140,80,0.12),0_4px_12px_rgba(0,0,0,0.03)] p-8 sm:p-9 text-center flex flex-col items-center overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_24px_44px_-8px_rgba(180,140,80,0.18),0_6px_16px_rgba(0,0,0,0.04)] z-10">
            
            {/* Laurel Crest & Icon Container */}
            <div className="relative w-28 h-20 flex items-center justify-center mb-2">
              
              {/* Laurel Branch Left */}
              <svg className="absolute left-1 top-2.5 w-6 h-14 pointer-events-none" viewBox="0 0 24 54" fill="none">
                <path d="M21 52 C15 42, 6 30, 8 6" stroke="#C5A059" strokeWidth="1.2" strokeLinecap="round" />
                <path d="M18 45 C11 43, 6 40, 4 35 C7 35, 13 38, 16 42" fill="#D4AF37" opacity="0.9" />
                <path d="M14 34 C7 32, 3 28, 2 23 C5 24, 10 27, 13 31" fill="#D4AF37" opacity="0.9" />
                <path d="M11 23 C5 20, 2 15, 3 10 C6 12, 9 16, 10 20" fill="#D4AF37" opacity="0.9" />
                <path d="M9 10 C6 7, 5 3, 7 1 C9 3, 10 6, 9 10" fill="#D4AF37" opacity="0.9" />
              </svg>

              {/* Laurel Branch Right */}
              <svg className="absolute right-1 top-2.5 w-6 h-14 pointer-events-none" viewBox="0 0 24 54" fill="none">
                <path d="M3 52 C9 42, 18 30, 16 6" stroke="#C5A059" strokeWidth="1.2" strokeLinecap="round" />
                <path d="M6 45 C13 43, 18 40, 20 35 C17 35, 11 38, 8 42" fill="#D4AF37" opacity="0.9" />
                <path d="M10 34 C17 32, 21 28, 22 23 C19 24, 14 27, 11 31" fill="#D4AF37" opacity="0.9" />
                <path d="M13 23 C19 20, 22 15, 21 10 C18 12, 15 16, 14 20" fill="#D4AF37" opacity="0.9" />
                <path d="M15 10 C18 7, 19 3, 17 1 C15 3, 14 6, 15 10" fill="#D4AF37" opacity="0.9" />
              </svg>

              {/* Center Circular Badge */}
              <div 
                className="w-[70px] h-[70px] rounded-full border border-[#E8DAC6] flex items-center justify-center relative z-10 shadow-[inset_0_1px_2px_rgba(255,255,255,0.9),0_3px_8px_rgba(180,140,80,0.08)]"
                style={{
                  background: 'radial-gradient(circle at 35% 35%, #FBF6EE 0%, #F3E7D5 100%)',
                }}
              >
                {/* Stylus / Fountain Pen with Underline Icon */}
                <svg width="25" height="25" viewBox="0 0 24 24" fill="none" stroke="#8C6837" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
                  <path d="m15 5 4 4" />
                  <line x1="5" y1="22" x2="19" y2="22" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </div>
            </div>

            {/* Swallowtail Ribbon Banner: STEP 02 */}
            <div className="relative inline-flex items-center justify-center px-4 py-0.5 bg-gradient-to-r from-[#DFBE83] via-[#F5E3BD] to-[#CCA45E] shadow-[0_2px_5px_rgba(180,140,80,0.16)] mb-3.5 before:content-[''] before:absolute before:top-0 before:bottom-0 before:-left-1.5 before:w-2 before:bg-inherit before:[clip-path:polygon(100%_0,100%_100%,0_50%)] after:content-[''] after:absolute after:top-0 after:bottom-0 after:-right-1.5 after:w-2 after:bg-inherit after:[clip-path:polygon(0_0,0_100%,100%_50%)]">
              <span className="text-[10px] font-bold tracking-[0.16em] uppercase text-[#3E2F1A]">
                STEP 02
              </span>
            </div>

            {/* Title */}
            <h3 className="font-serif text-[21px] sm:text-[22px] font-medium text-[#231C16] mb-2 tracking-tight">
              Make It Personal
            </h3>

            {/* Description */}
            <p className="text-[13px] sm:text-[13.5px] text-[#726050] leading-relaxed max-w-[240px] mx-auto">
              Add your names, dates, photos and personal message in our real-time editor.
            </p>
          </div>

          {/* DESKTOP CONNECTOR 2 -> 3 */}
          <div className="hidden md:flex flex-0 items-center justify-center w-10 lg:w-14 relative z-0">
            <div className="h-[1px] w-full bg-[#DFCDAE] relative flex items-center justify-center">
              <div className="w-2 h-2 bg-[#C5A059] rotate-45 rounded-[0.5px] shadow-2xs" />
            </div>
          </div>

          {/* STEP 3 CARD */}
          <div className="relative w-full max-w-[340px] md:max-w-none md:flex-1 bg-white rounded-[28px] border border-[#EDE4D5] shadow-[0_16px_36px_-6px_rgba(180,140,80,0.12),0_4px_12px_rgba(0,0,0,0.03)] p-8 sm:p-9 text-center flex flex-col items-center overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_24px_44px_-8px_rgba(180,140,80,0.18),0_6px_16px_rgba(0,0,0,0.04)] z-10">
            
            {/* Laurel Crest & Icon Container */}
            <div className="relative w-28 h-20 flex items-center justify-center mb-2">
              
              {/* Laurel Branch Left */}
              <svg className="absolute left-1 top-2.5 w-6 h-14 pointer-events-none" viewBox="0 0 24 54" fill="none">
                <path d="M21 52 C15 42, 6 30, 8 6" stroke="#C5A059" strokeWidth="1.2" strokeLinecap="round" />
                <path d="M18 45 C11 43, 6 40, 4 35 C7 35, 13 38, 16 42" fill="#D4AF37" opacity="0.9" />
                <path d="M14 34 C7 32, 3 28, 2 23 C5 24, 10 27, 13 31" fill="#D4AF37" opacity="0.9" />
                <path d="M11 23 C5 20, 2 15, 3 10 C6 12, 9 16, 10 20" fill="#D4AF37" opacity="0.9" />
                <path d="M9 10 C6 7, 5 3, 7 1 C9 3, 10 6, 9 10" fill="#D4AF37" opacity="0.9" />
              </svg>

              {/* Laurel Branch Right */}
              <svg className="absolute right-1 top-2.5 w-6 h-14 pointer-events-none" viewBox="0 0 24 54" fill="none">
                <path d="M3 52 C9 42, 18 30, 16 6" stroke="#C5A059" strokeWidth="1.2" strokeLinecap="round" />
                <path d="M6 45 C13 43, 18 40, 20 35 C17 35, 11 38, 8 42" fill="#D4AF37" opacity="0.9" />
                <path d="M10 34 C17 32, 21 28, 22 23 C19 24, 14 27, 11 31" fill="#D4AF37" opacity="0.9" />
                <path d="M13 23 C19 20, 22 15, 21 10 C18 12, 15 16, 14 20" fill="#D4AF37" opacity="0.9" />
                <path d="M15 10 C18 7, 19 3, 17 1 C15 3, 14 6, 15 10" fill="#D4AF37" opacity="0.9" />
              </svg>

              {/* Center Circular Badge */}
              <div 
                className="w-[70px] h-[70px] rounded-full border border-[#E8DAC6] flex items-center justify-center relative z-10 shadow-[inset_0_1px_2px_rgba(255,255,255,0.9),0_3px_8px_rgba(180,140,80,0.08)]"
                style={{
                  background: 'radial-gradient(circle at 35% 35%, #FBF6EE 0%, #F3E7D5 100%)',
                }}
              >
                {/* Download Tray Icon */}
                <svg width="25" height="25" viewBox="0 0 24 24" fill="none" stroke="#8C6837" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="7 10 12 15 17 10" />
                  <line x1="12" y1="15" x2="12" y2="3" />
                </svg>
              </div>
            </div>

            {/* Swallowtail Ribbon Banner: STEP 03 */}
            <div className="relative inline-flex items-center justify-center px-4 py-0.5 bg-gradient-to-r from-[#DFBE83] via-[#F5E3BD] to-[#CCA45E] shadow-[0_2px_5px_rgba(180,140,80,0.16)] mb-3.5 before:content-[''] before:absolute before:top-0 before:bottom-0 before:-left-1.5 before:w-2 before:bg-inherit before:[clip-path:polygon(100%_0,100%_100%,0_50%)] after:content-[''] after:absolute after:top-0 after:bottom-0 after:-right-1.5 after:w-2 after:bg-inherit after:[clip-path:polygon(0_0,0_100%,100%_50%)]">
              <span className="text-[10px] font-bold tracking-[0.16em] uppercase text-[#3E2F1A]">
                STEP 03
              </span>
            </div>

            {/* Title */}
            <h3 className="font-serif text-[21px] sm:text-[22px] font-medium text-[#231C16] mb-2 tracking-tight">
              Publish & Share Live
            </h3>

            {/* Description */}
            <p className="text-[13px] sm:text-[13.5px] text-[#726050] leading-relaxed max-w-[240px] mx-auto">
              Complete your order and instantly publish your live, interactive event web page to share anywhere.
            </p>

            {/* Bottom-Right Gold Corner Fold Accent */}
            <svg 
              className="absolute bottom-0 right-0 w-14 h-14 pointer-events-none select-none z-10" 
              viewBox="0 0 56 56" 
              fill="none"
            >
              <path 
                d="M56 56 L56 16 C56 16, 41 16, 27 27 C16 41, 16 56, 16 56 Z" 
                fill="url(#goldGradBR)" 
              />
              <path 
                d="M56 56 L56 16 C45 21, 21 45, 16 56 Z" 
                fill="url(#goldGradBR2)" 
                opacity="0.35" 
              />
              <defs>
                <linearGradient id="goldGradBR" x1="56" y1="56" x2="16" y2="16" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="#DFBE83" />
                  <stop offset="45%" stopColor="#F5E3BD" />
                  <stop offset="100%" stopColor="#B28A44" />
                </linearGradient>
                <linearGradient id="goldGradBR2" x1="56" y1="16" x2="16" y2="56" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="#FFFFFF" />
                  <stop offset="100%" stopColor="#A77B35" />
                </linearGradient>
              </defs>
            </svg>

          </div>

        </div>

      </div>
    </section>
  );
};
