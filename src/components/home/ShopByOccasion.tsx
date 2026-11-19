'use client';

import React from 'react';
import Link from 'next/link';

interface OccasionItem {
  id: string;
  name: string;
  svgIcon: React.ReactNode;
}

const occasionCategories: OccasionItem[] = [
  {
    id: 'birthday',
    name: 'Birthday',
    svgIcon: (
      <svg className="w-5 h-5 stroke-[#A77B35] fill-none" viewBox="0 0 24 24" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 21v-8a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8" />
        <path d="M4 16s.5-1 2-1 2.5 2 4 2 2.5-2 4-2 2.5 2 4 2 2-1 2-1" />
        <path d="M2 21h20" />
        <path d="M7 8v3" />
        <path d="M12 8v3" />
        <path d="M17 8v3" />
        <path d="M7 4h.01" />
        <path d="M12 4h.01" />
        <path d="M17 4h.01" />
      </svg>
    ),
  },
  {
    id: 'wedding',
    name: 'Wedding',
    svgIcon: (
      <svg className="w-5 h-5 stroke-[#A77B35] fill-none" viewBox="0 0 24 24" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="9" cy="14" r="5" />
        <circle cx="15" cy="11" r="5" />
        <path d="M14 6l1-2" />
        <path d="M16 6l1-2" />
      </svg>
    ),
  },
  {
    id: 'engagement',
    name: 'Engagement',
    svgIcon: (
      <svg className="w-5 h-5 stroke-[#A77B35] fill-none" viewBox="0 0 24 24" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="14" r="6" />
        <path d="M9 8l3-4 3 4" />
        <path d="M10 8h4" />
      </svg>
    ),
  },
  {
    id: 'valentines',
    name: "Valentine's Day",
    svgIcon: (
      <svg className="w-5 h-5 stroke-[#A77B35] fill-none" viewBox="0 0 24 24" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
        <path d="M12 5l1.5 1.5" />
      </svg>
    ),
  },
  {
    id: 'anniversary',
    name: 'Anniversary',
    svgIcon: (
      <svg className="w-5 h-5 stroke-[#A77B35] fill-none" viewBox="0 0 24 24" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="8" width="18" height="4" rx="1" />
        <path d="M12 8v13" />
        <path d="M19 12v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-7" />
        <path d="M7.5 8a2.5 2.5 0 0 1 0-5A4.8 8 0 0 1 12 8a4.8 8 0 0 1 4.5-5 2.5 2.5 0 0 1 0 5" />
      </svg>
    ),
  },
  {
    id: 'baby-shower',
    name: 'Baby Shower',
    svgIcon: (
      <svg className="w-5 h-5 stroke-[#A77B35] fill-none" viewBox="0 0 24 24" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M5 16h14a2 2 0 0 0 2-2V9a5 5 0 0 0-5-5H8a5 5 0 0 0-5 5v5a2 2 0 0 0 2 2z" />
        <circle cx="7" cy="19" r="2" />
        <circle cx="17" cy="19" r="2" />
        <path d="M3 7h3" />
      </svg>
    ),
  },
  {
    id: 'graduation',
    name: 'Graduation',
    svgIcon: (
      <svg className="w-5 h-5 stroke-[#A77B35] fill-none" viewBox="0 0 24 24" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
        <path d="M6 12v5c0 2 3 3 6 3s6-1 6-3v-5" />
      </svg>
    ),
  },
  {
    id: 'festivals',
    name: 'Festivals',
    svgIcon: (
      <svg className="w-5 h-5 stroke-[#A77B35] fill-none" viewBox="0 0 24 24" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 3c-1.5 3-3 4.5-3 6.5a3 3 0 0 0 6 0c0-2-1.5-3.5-3-6.5z" />
        <path d="M4 17a8 8 0 0 0 16 0H4z" />
        <path d="M7 21h10" />
      </svg>
    ),
  },
];

export const ShopByOccasion: React.FC = () => {
  return (
    <section id="occasions" className="w-full bg-[#FAF7F2] border-y border-[#EDE2CF] select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        
        {/* Top delicate floral flourish symbol */}
        <div className="flex justify-center mb-1.5 text-[#A77B35] opacity-80">
          <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
            <path d="M12 2L13.5 8L19.5 9.5L13.5 11L12 17L10.5 11L4.5 9.5L10.5 8L12 2Z" />
          </svg>
        </div>

        {/* Section Heading with subtle decorative gold lines */}
        <div className="flex items-center justify-center gap-4 sm:gap-6 mb-7 sm:mb-9">
          <div className="h-[1px] w-12 sm:w-20 bg-gradient-to-r from-transparent to-[#A77B35]/50" />
          <h2 className="text-xl sm:text-2xl md:text-[26px] font-serif font-medium text-[#2C2114] tracking-tight">
            Shop by Occasion
          </h2>
          <div className="h-[1px] w-12 sm:w-20 bg-gradient-to-l from-transparent to-[#A77B35]/50" />
        </div>

        {/* Occasions Row with subtle vertical divider lines */}
        <div className="flex items-center justify-center overflow-x-auto pb-1 scrollbar-none max-w-6xl mx-auto">
          {occasionCategories.map((item, index) => (
            <React.Fragment key={item.id}>
              <Link
                href={`/templates?occasion=${encodeURIComponent(item.name)}`}
                className="group flex flex-col items-center justify-center py-2 px-3 sm:px-4.5 rounded-xl hover:bg-white/70 transition-all duration-200 text-center flex-1 min-w-[90px]"
              >
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-200 mb-2">
                  {item.svgIcon}
                </div>
                <span className="text-[11.5px] sm:text-[12.5px] font-medium text-[#49341F] group-hover:text-[#8F6E3B] transition-colors whitespace-nowrap leading-tight">
                  {item.name}
                </span>
              </Link>

              {/* Faint vertical divider line between categories (except after the last one) */}
              {index < occasionCategories.length - 1 && (
                <div className="hidden md:block h-7 w-[1px] bg-[#DFCDB0]/60 self-center mx-1 flex-shrink-0" />
              )}
            </React.Fragment>
          ))}
        </div>

      </div>
    </section>
  );
};
