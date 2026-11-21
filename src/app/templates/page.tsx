'use client';

import React, { useState, useMemo, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import {
  Search,
  Filter,
  Sparkles,
  Heart,
  Edit3,
  Eye,
  ArrowRight,
  SlidersHorizontal,
} from 'lucide-react';
import { templatesData, occasionsList } from '@/data/templates';
import { TemplateCard } from '@/components/cards/TemplateCard';
import { LiveDemoModal } from '@/components/templates/LiveDemoModal';
import { Template } from '@/types';
import { useWishlist } from '@/context/WishlistContext';

function TemplatesContent() {
  const searchParams = useSearchParams();
  const initialOccasion = searchParams.get('occasion') || 'All';
  const initialSearch = searchParams.get('search') || '';
  const initialFilter = searchParams.get('filter') || '';

  const [templatesList, setTemplatesList] = useState<Template[]>(templatesData);
  const [search, setSearch] = useState(initialSearch);
  const [selectedOccasion, setSelectedOccasion] = useState(initialOccasion);
  const [priceFilter, setPriceFilter] = useState<'all' | 'free' | 'premium'>(
    initialFilter === 'free' ? 'free' : 'all'
  );
  const [sortBy, setSortBy] = useState<'featured' | 'popular' | 'price-asc' | 'price-desc'>('featured');
  const [selectedStyle, setSelectedStyle] = useState<string>('all');
  const [activeDemoTemplate, setActiveDemoTemplate] = useState<Template | null>(null);

  const { isInWishlist, toggleWishlist } = useWishlist();

  // Sync real-time admin-managed prices and templates from /api/templates
  useEffect(() => {
    fetch('/api/templates')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.data)) {
          setTemplatesList(data.data);
        }
      })
      .catch((e) => console.error('Failed to load live templates:', e));
  }, []);

  const filteredTemplates = useMemo(() => {
    return templatesList
      .filter((item) => {
        // Search filter
        if (search.trim()) {
          const q = search.toLowerCase();
          const matchTitle = item.title.toLowerCase().includes(q);
          const matchOccasion = item.occasion.toLowerCase().includes(q);
          const matchDesc = item.description.toLowerCase().includes(q);
          const matchTags = item.tags.some((t) => t.toLowerCase().includes(q));
          if (!matchTitle && !matchOccasion && !matchDesc && !matchTags) return false;
        }

        // Occasion filter
        if (selectedOccasion !== 'All') {
          const matchOccasion = item.occasion.toLowerCase() === selectedOccasion.toLowerCase();
          const matchTag = item.tags.some((t) => t.toLowerCase() === selectedOccasion.toLowerCase());
          const matchUseIt = item.useItFor?.toLowerCase().includes(selectedOccasion.toLowerCase());
          if (!matchOccasion && !matchTag && !matchUseIt) return false;
        }

        // Price filter
        if (priceFilter === 'free' && !item.isFree) return false;
        if (priceFilter === 'premium' && item.isFree) return false;

        // Style filter
        if (selectedStyle !== 'all') {
          if (!item.tags.includes(selectedStyle)) return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'popular') return b.reviewsCount - a.reviewsCount;
        if (sortBy === 'price-asc') return a.price - b.price;
        if (sortBy === 'price-desc') return b.price - a.price;
        return (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0);
      });
  }, [search, selectedOccasion, priceFilter, sortBy, selectedStyle]);

  const allStyles = ['Gold Foil', 'Botanical', 'Luxury', 'Romantic', 'Navy', 'Modern'];

  return (
    <div className="w-full bg-[#F8F4EC] min-h-screen py-10 sm:py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Page Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-[11px] font-semibold tracking-[0.2em] uppercase text-[#8C6837] block mb-2">
            The Digital Collection
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif font-medium text-[#2C2114] tracking-tight mb-3">
            Digital Invitation Web Page Templates
          </h1>
          <p className="text-sm sm:text-base text-[#6B533E] font-normal leading-relaxed">
            Personalize and publish bespoke, interactive invitation web pages for every special celebration.
          </p>
        </div>

        {/* Filter & Search Bar */}
        <div className="bg-[#FCFAF6] rounded-2xl border border-[#DFCEAF] p-4 sm:p-6 shadow-sm mb-10">
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">

            {/* Search Input */}
            <div className="relative flex-1">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by occasion, style, or name..."
                className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm rounded-xl border border-[#DFCEAF] bg-white text-[#2C2114] placeholder-[#99816B] focus:outline-none focus:ring-1 focus:ring-[#A77B35]"
              />
              <Search className="w-4 h-4 text-[#99816B] absolute left-3.5 top-1/2 -translate-y-1/2" />
            </div>

            {/* Quick Filter Controls */}
            <div className="flex flex-wrap items-center gap-2.5">

              {/* Price Filter */}
              <select
                value={priceFilter}
                onChange={(e) => setPriceFilter(e.target.value as any)}
                className="px-3 py-2.5 text-xs rounded-xl border border-[#DFCEAF] bg-white text-[#49341F] focus:outline-none focus:ring-1 focus:ring-[#A77B35]"
              >
                <option value="all">All Prices</option>
                <option value="free">Free Templates Only</option>
                <option value="premium">Premium Only</option>
              </select>

              {/* Style Tag */}
              <select
                value={selectedStyle}
                onChange={(e) => setSelectedStyle(e.target.value)}
                className="px-3 py-2.5 text-xs rounded-xl border border-[#DFCEAF] bg-white text-[#49341F] focus:outline-none focus:ring-1 focus:ring-[#A77B35]"
              >
                <option value="all">All Aesthetics</option>
                {allStyles.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>

              {/* Sort By */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-3 py-2.5 text-xs rounded-xl border border-[#DFCEAF] bg-white text-[#49341F] focus:outline-none focus:ring-1 focus:ring-[#A77B35]"
              >
                <option value="featured">Sort: Featured</option>
                <option value="popular">Sort: Most Popular</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
              </select>

            </div>
          </div>

          {/* Occasion Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pt-4 mt-4 border-t border-[#F0E6D4] scrollbar-none">
            <button
              onClick={() => setSelectedOccasion('All')}
              className={`px-4 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${selectedOccasion === 'All'
                ? 'bg-[#8F6E3B] text-white shadow-sm'
                : 'bg-[#EDE2CF]/60 text-[#49341F] hover:bg-[#EDE2CF]'
                }`}
            >
              All Occasions
            </button>
            {occasionsList.map((occ) => (
              <button
                key={occ.name}
                onClick={() => setSelectedOccasion(occ.name)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${selectedOccasion === occ.name
                  ? 'bg-[#8F6E3B] text-white shadow-sm'
                  : 'bg-[#EDE2CF]/60 text-[#49341F] hover:bg-[#EDE2CF]'
                  }`}
              >
                {occ.name}
              </button>
            ))}
          </div>
        </div>

        {/* Results Counter */}
        <div className="flex items-center justify-between mb-6 text-xs text-[#7A634E]">
          <span>
            Showing <strong className="text-[#2C2114]">{filteredTemplates.length}</strong> designs
          </span>
          {(selectedOccasion !== 'All' || search || priceFilter !== 'all' || selectedStyle !== 'all') && (
            <button
              onClick={() => {
                setSearch('');
                setSelectedOccasion('All');
                setPriceFilter('all');
                setSelectedStyle('all');
              }}
              className="text-[#8F6E3B] hover:underline"
            >
              Clear filters
            </button>
          )}
        </div>

        {/* Templates Grid Matching media_1795069195323_63f764fa.jpg */}
        {filteredTemplates.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-[#DFCEAF] max-w-md mx-auto">
            <Sparkles className="w-8 h-8 text-[#A77B35] mx-auto mb-3 opacity-60" />
            <h3 className="font-serif text-lg font-medium text-[#2C2114] mb-1">
              No matching templates found
            </h3>
            <p className="text-xs text-[#7A634E] mb-5">
              Try adjusting your search terms or filters to explore more of our collection.
            </p>
            <button
              onClick={() => {
                setSearch('');
                setSelectedOccasion('All');
                setPriceFilter('all');
                setSelectedStyle('all');
              }}
              className="px-5 py-2 text-xs font-semibold rounded-full bg-[#8F6E3B] text-white"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {filteredTemplates.map((template) => (
              <TemplateCard
                key={template.id}
                template={template}
                onOpenDemo={(tpl) => setActiveDemoTemplate(tpl)}
              />
            ))}
          </div>
        )}

      </div>

      {/* Live Demo Modal with Phone and Laptop View */}
      {activeDemoTemplate && (
        <LiveDemoModal
          isOpen={!!activeDemoTemplate}
          onClose={() => setActiveDemoTemplate(null)}
          template={activeDemoTemplate}
        />
      )}
    </div>
  );
}

export default function TemplatesPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#F8F4EC] flex items-center justify-center">
          <p className="text-xs font-serif text-[#8C6837] animate-pulse">
            Loading You Are Mine Collections...
          </p>
        </div>
      }
    >
      <TemplatesContent />
    </Suspense>
  );
}

