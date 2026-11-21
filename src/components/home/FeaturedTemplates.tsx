'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Sparkles, ArrowRight } from 'lucide-react';
import { templatesData } from '@/data/templates';
import { TemplateCard } from '@/components/cards/TemplateCard';
import { LiveDemoModal } from '@/components/templates/LiveDemoModal';
import { Template } from '@/types';

export const FeaturedTemplates: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('All');
  const [activeDemoTemplate, setActiveDemoTemplate] = useState<Template | null>(null);
  const [allTemplates, setAllTemplates] = useState<Template[]>(templatesData);

  // Sync real-time admin-managed prices and templates from /api/templates
  useEffect(() => {
    fetch('/api/templates')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.data)) {
          setAllTemplates(data.data);
        }
      })
      .catch((e) => console.error('Failed to load featured templates:', e));
  }, []);

  const tabs = ['All', 'Wedding', 'Anniversary', 'Engagement', 'Birthday', "Valentine's Day"];

  // Core interactive templates with live admin prices
  const primaryTemplates = [
    allTemplates.find((t) => t.id === 'tpl-wedding-navy-01'),
    allTemplates.find((t) => t.id === 'tpl-anniversary-gold-02'),
    allTemplates.find((t) => t.id === 'tpl-engagement-garden-03'),
    allTemplates.find((t) => t.id === 'tpl-wedding-paper-palace-04'),
    allTemplates.find((t) => t.id === 'tpl-birthday-botanical-04'),
    allTemplates.find((t) => t.id === 'tpl-valentine-interactive-05'),
    allTemplates.find((t) => t.id === 'tpl-date-planner-07'),
  ].filter(Boolean) as Template[];

  // Filter templates: Show all interactive templates on 'All', or filter precisely by category
  const displayTemplates =
    activeTab === 'All'
      ? primaryTemplates
      : primaryTemplates.filter((t) => {
        const tabLower = activeTab.toLowerCase();
        const matchOccasion = t.occasion.toLowerCase() === tabLower;
        const matchTag = t.tags?.some((tag) => tag.toLowerCase() === tabLower);
        const matchUseIt = t.useItFor?.toLowerCase().includes(tabLower);
        // Special alias matching
        if (activeTab === "Valentine's Day" && (t.occasion === "Valentine's Day" || t.tags.includes('Romantic') || t.id.includes('valentine') || t.id.includes('date-planner'))) {
          return true;
        }
        if (activeTab === 'Anniversary' && (t.tags.includes('Anniversary') || t.useItFor?.includes('Save the date') || t.id.includes('anniversary') || t.id.includes('date-planner'))) {
          return true;
        }
        if (activeTab === 'Engagement' && (t.tags.includes('Engagement') || t.useItFor?.includes('Engagement') || t.id.includes('engagement') || t.id.includes('wedding-navy'))) {
          return true;
        }
        return matchOccasion || matchTag || matchUseIt;
      });

  const cardsToShow = displayTemplates.length > 0 ? displayTemplates : primaryTemplates;

  return (
    <section id="templates" className="relative w-full overflow-hidden bg-[#FAF7F2] py-16 sm:py-24 border-b border-[#EDE2CF]">
      {/* Background artwork: bg1.webp (optimized high-efficiency asset) */}
      <div className="absolute inset-0 z-0 pointer-events-none select-none">
        <Image
          src="/bg1.webp"
          alt="You Are Mine luxury stationery background"
          fill
          sizes="100vw"
          className="object-cover object-top"
          loading="lazy"
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
                className={`px-4 py-1.5 rounded-full text-xs transition-all duration-150 cursor-pointer ${activeTab === tab
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

        {/* Responsive Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7">
          {cardsToShow.map((template) => (
            <TemplateCard
              key={template.id}
              template={template}
              onOpenDemo={(tpl) => setActiveDemoTemplate(tpl)}
            />
          ))}
        </div>

      </div>

      {/* Live Demo Modal with Phone Auto-scroll (2s) and Laptop View */}
      {activeDemoTemplate && (
        <LiveDemoModal
          isOpen={!!activeDemoTemplate}
          onClose={() => setActiveDemoTemplate(null)}
          template={activeDemoTemplate}
        />
      )}
    </section>
  );
};
