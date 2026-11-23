'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Play, Heart, Camera, Calendar, ArrowRight, Ban, Film, BookOpen, Layers } from 'lucide-react';
import { Template } from '@/types';
import { useWishlist } from '@/context/WishlistContext';

interface TemplateCardProps {
  template: Template;
  onOpenDemo: (template: Template) => void;
}

export const TemplateCard: React.FC<TemplateCardProps> = ({ template, onOpenDemo }) => {
  const { isInWishlist, toggleWishlist } = useWishlist();
  const isFav = isInWishlist(template.id);

  // Badge configuration matching reference screenshot
  const badgeText = template.badge || (template.tags.includes('Luxury') ? '🎬 MOVING' : '📖 STORY • 11 PAGES');
  const tierText = template.tier || (template.price >= 400 ? 'SIGNATURE' : 'PREMIUM');
  const photoOption = template.photoOption || (template.price >= 400 ? 'Couple photo or two separate' : 'No photo needed');
  const useItFor = template.useItFor || 'Use it for: Wedding, Engagement, Mehendi +2';

  return (
    <div className="group relative bg-[#111827] rounded-2xl overflow-hidden border border-[#232F46] hover:border-[#E5A842]/60 shadow-[0_10px_30px_rgba(0,0,0,0.5)] hover:shadow-[0_16px_40px_rgba(0,0,0,0.7)] transition-all duration-300 flex flex-col">
      
      {/* 1. VISUAL CARD ARTWORK (Portrait Aspect Ratio matching reference) */}
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-[#0A0F1A] select-none">
        <Image
          src={template.previewImage || '/02_grand_entrance_closed_gate.png'}
          alt={template.title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
        />

        {/* Soft dark vignette gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#111827] via-transparent to-black/40 pointer-events-none" />

        {/* Top Left Badge: [🎬 MOVING] / [📖 STORY • 11 PAGES] */}
        <div className="absolute top-3 left-3 z-10">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-semibold tracking-wider uppercase bg-black/65 backdrop-blur-md text-[#F4E6D0] border border-white/20 shadow-md">
            {badgeText.includes('MOVING') ? (
              <Film className="w-3 h-3 text-[#E5A842]" />
            ) : badgeText.includes('STORY') ? (
              <BookOpen className="w-3 h-3 text-[#E5A842]" />
            ) : (
              <Layers className="w-3 h-3 text-[#E5A842]" />
            )}
            <span>{badgeText}</span>
          </span>
        </div>

        {/* Top Right Wishlist Heart */}
        <button
          onClick={() => toggleWishlist(template)}
          className="absolute top-3 right-3 z-10 p-2 rounded-full bg-black/50 hover:bg-black/70 backdrop-blur-md border border-white/15 text-[#E2D5BE] hover:text-[#E5A842] shadow-md transition-colors"
          aria-label="Add to wishlist"
        >
          <Heart
            className={`w-4 h-4 ${isFav ? 'fill-[#E5A842] text-[#E5A842]' : 'stroke-[1.8]'}`}
          />
        </button>

        {/* Centered Floating Pill Button: [▶ Live demo] (Matching Screenshot) */}
        <div className="absolute bottom-5 inset-x-0 flex items-center justify-center z-10 px-4">
          <button
            type="button"
            onClick={() => onOpenDemo(template)}
            className="group/btn inline-flex items-center gap-2 px-5 py-2 rounded-full bg-[#FFFDF8] hover:bg-[#FAF3E0] text-[#0F172A] shadow-[0_8px_25px_rgba(0,0,0,0.65)] hover:shadow-[0_10px_30px_rgba(229,168,66,0.4)] transition-all transform hover:scale-105 active:scale-95 cursor-pointer font-medium text-xs sm:text-[13px]"
          >
            <span className="w-5 h-5 rounded-full bg-[#E5A842] flex items-center justify-center text-[#0F172A] group-hover/btn:rotate-12 transition-transform shadow-xs">
              <Play className="w-2.5 h-2.5 fill-[#0F172A] ml-0.5" />
            </span>
            <span className="font-semibold tracking-wide">Live demo</span>
          </button>
        </div>
      </div>

      {/* 2. CARD DETAILS & SPECS (Matching Reference Screenshot) */}
      <div className="p-4 sm:p-5 flex flex-col flex-1 justify-between bg-[#111827] text-left">
        <div>
          {/* Couple Name & Design Title (Luxury Tiered Display) */}
          <div className="mb-2 min-h-[44px] flex flex-col justify-center">
            {template.title.includes('—') ? (
              <>
                <span className="text-[11px] font-sans font-semibold text-[#E5A842] tracking-wider uppercase line-clamp-1">
                  {template.title.split('—')[0].trim()}
                </span>
                <h3 className="font-serif text-base sm:text-lg text-[#FFFDF8] font-semibold leading-tight line-clamp-1 group-hover:text-[#E5A842] transition-colors">
                  {template.title.split('—')[1].trim()}
                </h3>
              </>
            ) : (
              <h3 className="font-serif text-base sm:text-lg text-[#FFFDF8] font-semibold leading-snug line-clamp-2 group-hover:text-[#E5A842] transition-colors">
                {template.title}
              </h3>
            )}
          </div>

          {/* Price & Tier (e.g. ₹299 with ₹999 crossed out) */}
          <div className="flex items-center gap-2 mb-3">
            <span className="font-serif text-lg sm:text-xl font-bold text-[#FFFDF8]">
              ₹{template.price}
            </span>
            <span className="text-xs line-through text-[#94A3B8]/80 font-medium">
              ₹{template.originalPrice || template.originalPriceINR || 999}
            </span>
            <span className="text-[10px] bg-[#E5A842]/20 text-[#E5A842] border border-[#E5A842]/40 px-1.5 py-0.5 rounded font-bold">
              {template.discountBadge || '70% OFF'}
            </span>
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold uppercase tracking-wider text-[#E5A842] ml-auto">
              <span>✦</span>
              <span>{tierText}</span>
            </span>
          </div>

          {/* Feature Specs */}
          <div className="space-y-1.5 text-xs text-[#94A3B8] font-manrope">
            {/* Feature 1: Photo requirement */}
            <div className="flex items-center gap-2">
              {photoOption.includes('No photo') ? (
                <Ban className="w-3.5 h-3.5 text-[#64748B] shrink-0" />
              ) : (
                <Camera className="w-3.5 h-3.5 text-[#E5A842] shrink-0" />
              )}
              <span className="truncate">{photoOption}</span>
            </div>

            {/* Feature 2: Occasions / Usage */}
            <div className="flex items-center gap-2">
              <Calendar className="w-3.5 h-3.5 text-[#64748B] shrink-0" />
              <span className="truncate">{useItFor}</span>
            </div>
          </div>
        </div>

        {/* Golden Action Button: [Use this design →] */}
        <div className="pt-4 mt-3 border-t border-[#1E293B]">
          <Link
            href={`/customize/${template.id}`}
            className="w-full py-2.5 rounded-xl bg-[#E5A842] hover:bg-[#D49832] text-[#0F172A] font-semibold text-xs sm:text-sm tracking-wide transition-all shadow-[0_4px_16px_rgba(229,168,66,0.3)] hover:shadow-[0_6px_22px_rgba(229,168,66,0.45)] flex items-center justify-center gap-1.5 group/btn2"
          >
            <span>Use this design</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover/btn2:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>

    </div>
  );
};

export default TemplateCard;
