'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Heart, Sparkles, ArrowRight } from 'lucide-react';
import { templatesData } from '@/data/templates';
import { useWishlist } from '@/context/WishlistContext';

export const FeaturedTemplates: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('All');
  const { isInWishlist, toggleWishlist } = useWishlist();

  const tabs = ['All', 'Wedding', 'Anniversary', 'Engagement', 'Birthday', "Valentine's Day"];

  // Filter templates: Show 3 main cards like the reference screenshot
  const displayTemplates = activeTab === 'All'
    ? templatesData.slice(0, 3)
    : templatesData.filter((t) => t.occasion === activeTab || t.tags.includes(activeTab)).slice(0, 3);

  // If filtered returns less than 3, pad with others
  const cardsToShow = displayTemplates.length > 0 ? displayTemplates : templatesData.slice(0, 3);

  return (
    <section id="templates" className="relative w-full overflow-hidden bg-[#FAF7F2] py-16 sm:py-24 border-b border-[#EDE2CF]">
      {/* Background artwork: bg1.png */}
      <div className="absolute inset-0 z-0 pointer-events-none select-none">
        <Image
          src="/bg1.png"
          alt="Ink & Ivory luxury stationery background"
          fill
          sizes="100vw"
          className="object-cover object-top"
          quality={95}
        />
        {/* Soft bottom fade into the transitional gap */}
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#FAF7F2] to-transparent pointer-events-none" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-10">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#EDE2CF]/80 border border-[#DFCDB0] text-[#7D5F31] text-[10.5px] font-semibold tracking-widest uppercase mb-3 shadow-2xs">
            <Sparkles className="w-3 h-3 text-[#A77B35]" />
            Curated Web Page Designs
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-[40px] font-serif font-medium text-[#23180D] tracking-tight mb-2.5">
            Featured Designs
          </h2>
          <p className="text-xs sm:text-[13.5px] text-[#695034] font-normal leading-relaxed">
            Discover beautifully designed web pages for every meaningful occasion.
          </p>
        </div>

        {/* Filter Pills + View All Link */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-8 sm:mb-10 px-1">
          <div className="flex flex-wrap items-center gap-2">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-1.5 rounded-full text-xs transition-all duration-150 ${
                  activeTab === tab
                    ? 'bg-[#8F6E3B] text-white font-semibold shadow-xs'
                    : 'bg-[#EDE2CF]/60 text-[#49341F] font-medium hover:bg-[#EDE2CF]'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <Link
            href="/templates"
            className="text-xs sm:text-[13px] font-semibold text-[#8F6E3B] hover:text-[#735323] flex items-center gap-1 group/all transition-colors"
          >
            <span>View All Templates</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover/all:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        {/* 3 Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-7">
          {cardsToShow.map((template, idx) => {
            const isFav = isInWishlist(template.id);
            const cardImgSrc = template.previewImage || `/templates/card${(idx % 3) + 1}.jpg`;

            return (
              <div
                key={template.id}
                className="group bg-white rounded-2xl overflow-hidden border border-[#E8DFC8] shadow-luxury hover:shadow-luxury-lg transition-all duration-300 flex flex-col"
              >
                {/* Visual Card Artwork Presentation */}
                <div className="relative aspect-[305/178] w-full overflow-hidden bg-[#FBF8F2] select-none">
                  <Image
                    src={cardImgSrc}
                    alt={template.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover object-center group-hover:scale-[1.03] transition-transform duration-500 ease-out"
                    priority={idx < 3}
                  />

                  {/* Interactive Wishlist Heart Button */}
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      toggleWishlist(template);
                    }}
                    className={`absolute top-2.5 right-2.5 z-10 w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center transition-all ${
                      isFav
                        ? 'bg-white shadow-xs text-[#A77B35]'
                        : 'bg-transparent hover:bg-white/40 text-transparent hover:text-[#A77B35]'
                    }`}
                    aria-label={isFav ? 'Remove from wishlist' : 'Add to wishlist'}
                  >
                    <Heart
                      className={`w-3.5 h-3.5 ${
                        isFav ? 'fill-[#A77B35] text-[#A77B35]' : 'stroke-[#A77B35] stroke-[2]'
                      }`}
                    />
                  </button>
                </div>

                {/* Card Information Panel */}
                <div className="p-5 flex flex-col flex-1 justify-between bg-white">
                  <div>
                    <h3 className="font-serif text-[17px] text-[#2C2114] font-medium leading-snug group-hover:text-[#8F6E3B] transition-colors mb-1.5">
                      {template.title}
                    </h3>
                    <p className="text-[12px] text-[#7A634E] line-clamp-2 leading-relaxed">
                      {template.description}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-4 mt-3 border-t border-[#F2ECE0]">
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-[17px] font-serif font-bold text-[#2C2114]">
                        ₹{template.price}
                      </span>
                      <span className="text-[11.5px] text-[#99816B] line-through font-normal">
                        ₹{template.price + 200}
                      </span>
                    </div>

                    <Link
                      href={`/customize/${template.id}`}
                      className="text-xs font-semibold text-[#8F6E3B] hover:text-[#6E4F22] flex items-center gap-1 group/btn transition-colors"
                    >
                      <span>Customize</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 transition-transform" />
                    </Link>
                  </div>
                </div>

              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
