import React from 'react';
import { HeroSection } from '@/components/home/HeroSection';
import { ShopByOccasion } from '@/components/home/ShopByOccasion';
import { FeaturedTemplates } from '@/components/home/FeaturedTemplates';
import { PersonalizeSection } from '@/components/home/PersonalizeSection';
import { HowItWorks } from '@/components/home/HowItWorks';
import { WhyChooseInkAndIvory } from '@/components/home/WhyChooseCardly';
import { Testimonials } from '@/components/home/Testimonials';

export default function HomePage() {
  return (
    <div className="flex flex-col w-full">
      {/* SECTION 2: HERO BANNER (Full Viewport Hero Experience) */}
      <HeroSection />

      {/* SECTION 3: SHOP BY OCCASION (Dedicated Standalone Strip with Botanical & Ribbon Accents) */}
      <ShopByOccasion />

      {/* SECTION 4: FEATURED DESIGNS (Dedicated Gallery Section with bg1.png Background) */}
      <FeaturedTemplates />

      {/* ELEGANT LUXURY GAP BETWEEN THE TWO BACKGROUND ARTWORKS (bg1.png and bg2.png) */}
      <div className="w-full bg-[#FAF7F2] py-12 sm:py-16 md:py-20 flex flex-col items-center justify-center border-y border-[#EDE2CF]/80 select-none">
        <div className="max-w-md w-full px-6 flex items-center justify-center gap-4 opacity-75">
          <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent to-[#A77B35]/50" />
          <div className="flex items-center gap-2 text-[#8C6837]">
            <span className="text-xs">✦</span>
            <span className="font-serif italic text-sm tracking-wider text-[#49341F]">
              Bespoke Digital Invitation Web Pages
            </span>
            <span className="text-xs">✦</span>
          </div>
          <div className="h-[1px] flex-1 bg-gradient-to-l from-transparent to-[#A77B35]/50" />
        </div>
      </div>

      {/* SECTION 5: PERSONALIZE YOUR WEB PAGE (Live Studio with bg2.png Background) */}
      <PersonalizeSection />

      {/* SECTION 6: HOW IT WORKS (3 SIMPLE DIGITAL STEPS) */}
      <HowItWorks />

      {/* SECTION 7: WHY CHOOSE INK & IVORY */}
      <WhyChooseInkAndIvory />

      {/* SECTION 8: CUSTOMER TESTIMONIALS */}
      <Testimonials />
    </div>
  );
}
