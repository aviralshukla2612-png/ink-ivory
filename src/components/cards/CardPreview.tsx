'use client';

import React from 'react';
import { Template, EditableFields, DesignConfig } from '@/types';

interface CardPreviewProps {
  template: Template;
  customization?: Partial<EditableFields>;
  designConfig?: Partial<DesignConfig>;
  className?: string;
  showWatermark?: boolean;
}

export const CardPreview: React.FC<CardPreviewProps> = ({
  template,
  customization,
  designConfig,
  className = '',
  showWatermark = false,
}) => {
  const fields = { ...template.defaultFields, ...customization };
  const config = { ...template.designConfig, ...designConfig };

  const isDark =
    config.themeColor === '#121E35' ||
    config.themeColor === '#361219' ||
    config.themeColor === '#0E1726' ||
    config.themeColor === '#301808';

  return (
    <div
      className={`relative overflow-hidden transition-all duration-300 shadow-luxury select-none flex flex-col justify-between p-6 sm:p-8 ${className}`}
      style={{
        backgroundColor: config.themeColor || '#FAF7F0',
        color: config.textColor || '#49341F',
        aspectRatio: config.orientation === 'square' ? '1 / 1' : '3 / 4',
      }}
    >
      {/* Background Texture / Subtle Gradient */}
      <div
        className="absolute inset-0 pointer-events-none opacity-40 mix-blend-overlay"
        style={{
          background:
            'radial-gradient(circle at 50% 30%, rgba(255,255,255,0.15) 0%, rgba(0,0,0,0.15) 100%)',
        }}
      />

      {/* Decorative Border Frame */}
      <div
        className="absolute inset-3 sm:inset-4 pointer-events-none border"
        style={{
          borderColor: config.accentColor || '#A77B35',
          opacity: 0.65,
        }}
      >
        {/* Inner thin border */}
        <div
          className="absolute inset-1 sm:inset-1.5 border"
          style={{
            borderColor: config.accentColor || '#A77B35',
            opacity: 0.4,
          }}
        />

        {/* Corner Floral / Ornate Flourishes */}
        <div
          className="absolute -top-1.5 -left-1.5 w-3 h-3 border-t-2 border-l-2"
          style={{ borderColor: config.accentColor || '#A77B35' }}
        />
        <div
          className="absolute -top-1.5 -right-1.5 w-3 h-3 border-t-2 border-r-2"
          style={{ borderColor: config.accentColor || '#A77B35' }}
        />
        <div
          className="absolute -bottom-1.5 -left-1.5 w-3 h-3 border-b-2 border-l-2"
          style={{ borderColor: config.accentColor || '#A77B35' }}
        />
        <div
          className="absolute -bottom-1.5 -right-1.5 w-3 h-3 border-b-2 border-r-2"
          style={{ borderColor: config.accentColor || '#A77B35' }}
        />
      </div>

      {/* TOP HEADER */}
      <div className="relative z-10 text-center pt-2 sm:pt-4">
        {fields.eyebrow && (
          <p
            className="text-[9px] sm:text-[10px] tracking-[0.25em] font-semibold uppercase mb-1.5 opacity-85"
            style={{ color: config.accentColor || '#A77B35' }}
          >
            {fields.eyebrow}
          </p>
        )}
        {fields.headline && (
          <h4
            className="text-xs sm:text-sm font-serif italic tracking-wide opacity-90"
            style={{ color: isDark ? '#EDE2CF' : '#5C442D' }}
          >
            {fields.headline}
          </h4>
        )}
      </div>

      {/* CENTER: NAMES & KEY TEXT */}
      <div className="relative z-10 text-center my-auto py-3">
        <h2
          className={`font-serif leading-tight tracking-tight drop-shadow-sm ${
            config.orientation === 'square'
              ? 'text-xl sm:text-2xl md:text-3xl'
              : 'text-2xl sm:text-3xl md:text-4xl'
          }`}
          style={{
            color: isDark ? '#FFFFFF' : '#2A1B0E',
            fontFamily: config.fontFamily === 'script' ? "'Alex Brush', cursive" : "'Playfair Display', serif",
          }}
        >
          {fields.names}
        </h2>

        {/* Small gold flourish symbol */}
        <div className="flex items-center justify-center gap-2 my-2 sm:my-3 opacity-75">
          <span className="h-[1px] w-6 bg-current" style={{ color: config.accentColor }} />
          <span className="text-xs" style={{ color: config.accentColor }}>✦</span>
          <span className="h-[1px] w-6 bg-current" style={{ color: config.accentColor }} />
        </div>

        {/* Date & Time */}
        {fields.date && (
          <p
            className="text-[11px] sm:text-xs font-medium tracking-wider uppercase mb-1"
            style={{ color: config.accentColor || '#D7B875' }}
          >
            {fields.date}
          </p>
        )}
        {fields.time && (
          <p className="text-[10px] sm:text-[11px] opacity-80 tracking-wide font-sans">
            {fields.time}
          </p>
        )}

        {/* Message */}
        {fields.message && (
          <p
            className="text-[10px] sm:text-[11px] leading-relaxed max-w-[85%] mx-auto mt-2.5 opacity-85 italic font-serif"
            style={{ color: isDark ? '#E5D6C1' : '#49341F' }}
          >
            &ldquo;{fields.message}&rdquo;
          </p>
        )}
      </div>

      {/* BOTTOM: VENUE, HOST & RSVP */}
      <div className="relative z-10 text-center pb-2 sm:pb-3 space-y-1">
        {fields.venue && (
          <p
            className="text-[10px] sm:text-[11px] font-medium tracking-wide uppercase"
            style={{ color: isDark ? '#FFFFFF' : '#332313' }}
          >
            {fields.venue}
          </p>
        )}
        {fields.city && (
          <p className="text-[9px] sm:text-[10px] opacity-75 tracking-wider font-sans">
            {fields.city}
          </p>
        )}
        {fields.rsvp && (
          <p
            className="text-[8.5px] sm:text-[9.5px] tracking-wide pt-1 opacity-70"
            style={{ color: config.accentColor }}
          >
            {fields.rsvp}
          </p>
        )}
      </div>

      {/* Watermark for preview if enabled */}
      {showWatermark && (
        <div className="absolute inset-0 z-20 pointer-events-none flex items-center justify-center opacity-15 rotate-[-30deg]">
          <span className="text-4xl sm:text-5xl font-script-luxury text-[#49341F] tracking-widest font-bold">
            Ink & Ivory Preview
          </span>
        </div>
      )}
    </div>
  );
};

