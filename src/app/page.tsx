import React from 'react';
import { HeroSection } from '@/components/home/HeroSection';
import { ShopByOccasion } from '@/components/home/ShopByOccasion';
import { FeaturedTemplates } from '@/components/home/FeaturedTemplates';
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

      {/* SECTION 5: HOW IT WORKS (3 SIMPLE DIGITAL STEPS) */}
      <HowItWorks />

      {/* SECTION 6: WHY CHOOSE YOU ARE MINE */}
      <WhyChooseInkAndIvory />

      {/* SECTION 7: CUSTOMER TESTIMONIALS */}
      <Testimonials />
    </div>
  );
}
