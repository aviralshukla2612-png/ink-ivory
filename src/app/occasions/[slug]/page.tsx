'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Sparkles, Heart, Edit3 } from 'lucide-react';
import { templatesData, occasionsList } from '@/data/templates';
import { CardPreview } from '@/components/cards/CardPreview';
import { useWishlist } from '@/context/WishlistContext';
import { Template } from '@/types';

export default function OccasionPage() {
  const params = useParams();
  const slug = (params?.slug as string) || '';
  const [allTemplates, setAllTemplates] = useState<Template[]>(templatesData);

  useEffect(() => {
    fetch('/api/templates')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.data)) {
          setAllTemplates(data.data);
        }
      })
      .catch((e) => console.error('Failed to load occasion templates:', e));
  }, []);

  // Match occasion name from slug
  const matchedOccasion = occasionsList.find(
    (o) => o.name.toLowerCase().replace(/['\s]+/g, '-') === slug.toLowerCase()
  ) || {
    name: slug.charAt(0).toUpperCase() + slug.slice(1).replace(/-/g, ' '),
    description: 'Bespoke digital invitation web pages and event portals.',
  };

  const templates = allTemplates.filter(
    (t) =>
      t.occasion.toLowerCase().replace(/['\s]+/g, '-') === slug.toLowerCase() ||
      t.tags.some((tag) => tag.toLowerCase() === slug.toLowerCase())
  );

  const displayList = templates.length > 0 ? templates : allTemplates.slice(0, 4);
  const { isInWishlist, toggleWishlist } = useWishlist();

  return (
    <div className="w-full bg-[#F8F4EC] min-h-screen py-10 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb */}
        <div className="mb-6 flex items-center gap-2 text-xs text-[#8C6837]">
          <Link href="/templates" className="hover:underline flex items-center gap-1">
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>All Templates</span>
          </Link>
          <span>/</span>
          <span className="text-[#49341F] font-medium">{matchedOccasion.name}</span>
        </div>

        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-[11px] font-semibold tracking-[0.2em] uppercase text-[#8C6837] block mb-2">
            Occasion Suite
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif font-medium text-[#2C2114] tracking-tight mb-3">
            {matchedOccasion.name} Cards
          </h1>
          <p className="text-xs sm:text-sm text-[#6B533E] leading-relaxed">
            {matchedOccasion.description || 'Celebrate this precious milestone with our digital invitations and greeting cards.'}
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {displayList.map((template) => {
            const isFav = isInWishlist(template.id);
            return (
              <div
                key={template.id}
                className="bg-[#FCFAF6] rounded-2xl p-4 border border-[#DFCEAF] shadow-luxury flex flex-col justify-between"
              >
                <div>
                  <div className="aspect-[4/5] bg-[#F3EDE1] rounded-xl p-3 mb-3 flex items-center justify-center overflow-hidden">
                    <div className="w-[85%]">
                      <CardPreview template={template} className="rounded-lg shadow-sm" />
                    </div>
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#8F6E3B]">
                    {template.occasion}
                  </span>
                  <h3 className="font-serif text-base font-medium text-[#2C2114] line-clamp-1">
                    {template.title}
                  </h3>
                  <p className="text-xs text-[#7A634E] line-clamp-2 mt-0.5">
                    {template.description}
                  </p>
                </div>

                <div className="pt-4 mt-4 border-t border-[#F2ECE0] flex items-center justify-between">
                  <span className="font-serif font-bold text-base text-[#2C2114]">
                    {template.isFree ? 'Free' : `₹${template.price}`}
                  </span>

                  <Link
                    href={`/customize/${template.id}`}
                    className="px-4 py-2 rounded-xl bg-[#8F6E3B] hover:bg-[#7D5F31] text-white text-xs font-semibold shadow-gold flex items-center gap-1.5 transition-colors"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Customize</span>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
}

