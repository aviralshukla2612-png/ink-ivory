'use client';

import React, { useState, useMemo, Suspense } from 'react';
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
import { CardPreview } from '@/components/cards/CardPreview';
import { useWishlist } from '@/context/WishlistContext';

function TemplatesContent() {
  const searchParams = useSearchParams();
  const initialOccasion = searchParams.get('occasion') || 'All';
  const initialSearch = searchParams.get('search') || '';
  const initialFilter = searchParams.get('filter') || '';

  const [search, setSearch] = useState(initialSearch);
  const [selectedOccasion, setSelectedOccasion] = useState(initialOccasion);
  const [priceFilter, setPriceFilter] = useState<'all' | 'free' | 'premium'>(
    initialFilter === 'free' ? 'free' : 'all'
  );
  const [sortBy, setSortBy] = useState<'featured' | 'popular' | 'price-asc' | 'price-desc'>('featured');
  const [selectedStyle, setSelectedStyle] = useState<string>('all');

  const { isInWishlist, toggleWishlist } = useWishlist();

  const filteredTemplates = useMemo(() => {
    return templatesData
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
        if (selectedOccasion !== 'All' && item.occasion !== selectedOccasion) {
          return false;
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

        {/* Templates Grid */}
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
            {filteredTemplates.map((template) => {
              const isFav = isInWishlist(template.id);
              return (
                <div
                  key={template.id}
                  className="group relative bg-[#FCFAF6] rounded-2xl overflow-hidden border border-[#E8DFC8] shadow-luxury hover:shadow-luxury-lg transition-all duration-300 flex flex-col"
                >
                  {/* Card Visual Container */}
                  <div className="relative aspect-[4/5] w-full overflow-hidden bg-[#F3EDE1] p-4 flex items-center justify-center">
                    <div className="w-[85%] transition-transform duration-500 group-hover:scale-[1.03]">
                      <CardPreview
                        template={template}
                        className="rounded-lg shadow-md"
                        showWatermark={false}
                      />
                    </div>

                    {/* Badge */}
                    <div className="absolute top-3 left-3 z-10 flex items-center gap-1.5">
                      {template.isFree ? (
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wide uppercase bg-[#E8F3EA] text-[#2E6B3F] border border-[#CBE5D3]">
                          Free
                        </span>
                      ) : (
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wide uppercase bg-[#EDE2CF] text-[#8F6E3B] border border-[#DFCDB0]">
                          Premium
                        </span>
                      )}
                    </div>

                    {/* Wishlist Button */}
                    <button
                      onClick={() => toggleWishlist(template)}
                      className="absolute top-3 right-3 z-10 p-2 rounded-full bg-white/80 hover:bg-white backdrop-blur-sm shadow-sm transition-colors text-[#49341F] hover:text-[#A77B35]"
                      aria-label="Add to wishlist"
                    >
                      <Heart
                        className={`w-4 h-4 ${isFav ? 'fill-[#A77B35] text-[#A77B35]' : 'stroke-[1.8]'
                          }`}
                      />
                    </button>

                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-[#2C2114]/25 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3 backdrop-blur-[2px]">
                      <Link
                        href={`/customize/${template.id}`}
                        className="px-4 py-2 bg-[#8F6E3B] hover:bg-[#7D5F31] text-white text-xs font-semibold rounded-lg shadow-gold flex items-center gap-1.5 transition-all transform translate-y-2 group-hover:translate-y-0"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span>Customize</span>
                      </Link>
                      <Link
                        href={`/templates/${template.slug}`}
                        className="px-3.5 py-2 bg-white hover:bg-[#FAF7F2] text-[#49341F] text-xs font-medium rounded-lg shadow-sm flex items-center gap-1.5 transition-all transform translate-y-2 group-hover:translate-y-0"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Details</span>
                      </Link>
                    </div>
                  </div>

                  {/* Info */}
                  <div className="p-4 sm:p-5 flex flex-col flex-1 justify-between bg-white">
                    <div>
                      <div className="flex items-center justify-between text-xs text-[#8C6837] mb-1 font-medium">
                        <span>{template.occasion}</span>
                        <span className="flex items-center gap-1 text-[#695034]">
                          ★ {template.rating} ({template.reviewsCount})
                        </span>
                      </div>

                      <h3 className="font-serif text-base sm:text-lg text-[#2C2114] font-medium leading-snug line-clamp-1 group-hover:text-[#8F6E3B] transition-colors">
                        {template.title}
                      </h3>
                      <p className="text-xs text-[#7A634E] line-clamp-2 mt-1 leading-relaxed">
                        {template.description}
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-4 mt-3 border-t border-[#F2ECE0]">
                      <div className="flex items-baseline gap-1.5">
                        {template.isFree ? (
                          <span className="text-base font-serif font-bold text-[#2E6B3F]">
                            Free
                          </span>
                        ) : (
                          <>
                            <span className="text-base sm:text-lg font-serif font-bold text-[#2C2114]">
                              ₹{template.price}
                            </span>
                            <span className="text-[11px] text-[#99816B] line-through">
                              ₹{template.price + 200}
                            </span>
                          </>
                        )}
                      </div>

                      <Link
                        href={`/customize/${template.id}`}
                        className="text-xs font-semibold text-[#8F6E3B] hover:text-[#6E4F22] flex items-center gap-1 group/btn"
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
        )}

      </div>
    </div>
  );
}

export default function TemplatesPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#F8F4EC] flex items-center justify-center">
          <p className="text-xs font-serif text-[#8C6837] animate-pulse">
            Loading Ink & Ivory Collections...
          </p>
        </div>
      }
    >
      <TemplatesContent />
    </Suspense>
  );
}

