'use client';

import React from 'react';
import Link from 'next/link';
import { Heart, Trash2, Edit3, ArrowRight } from 'lucide-react';
import { useWishlist } from '@/context/WishlistContext';
import { CardPreview } from '@/components/cards/CardPreview';

export default function WishlistPage() {
  const { wishlist, toggleWishlist } = useWishlist();

  return (
    <div className="w-full bg-[#F8F4EC] min-h-screen py-10 sm:py-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-[#E8DFC8]">
          <div>
            <h1 className="text-2xl sm:text-3xl font-serif font-medium text-[#2C2114]">
              Saved Wishlist
            </h1>
            <p className="text-xs text-[#7A634E] mt-1">
              Your favourite greeting cards and invitation designs saved for upcoming celebrations.
            </p>
          </div>
          <Link
            href="/templates"
            className="text-xs font-semibold text-[#8F6E3B] hover:underline"
          >
            Browse All Templates →
          </Link>
        </div>

        {wishlist.length === 0 ? (
          <div className="bg-[#FCFAF6] rounded-3xl p-12 text-center border border-[#DFCEAF] max-w-md mx-auto shadow-sm">
            <Heart className="w-12 h-12 text-[#A77B35] mx-auto mb-3 opacity-50" />
            <h2 className="font-serif text-lg font-medium text-[#2C2114] mb-1">
              Your wishlist is empty
            </h2>
            <p className="text-xs text-[#7A634E] mb-6">
              Click the heart icon on any card to save it here for later.
            </p>
            <Link
              href="/templates"
              className="px-6 py-2.5 rounded-full bg-[#8F6E3B] text-white text-xs font-semibold"
            >
              Explore Templates
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {wishlist.map((template) => (
              <div
                key={template.id}
                className="bg-[#FCFAF6] rounded-2xl p-4 border border-[#DFCEAF] shadow-luxury flex flex-col justify-between"
              >
                <div>
                  <div className="relative aspect-[4/5] bg-[#F3EDE1] rounded-xl p-3 mb-3 flex items-center justify-center overflow-hidden">
                    <div className="w-[85%]">
                      <CardPreview template={template} className="rounded-lg shadow-sm" />
                    </div>
                    <button
                      onClick={() => toggleWishlist(template)}
                      className="absolute top-3 right-3 p-2 rounded-full bg-white/80 hover:bg-white text-red-500 shadow-sm transition-colors"
                      title="Remove from wishlist"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
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
            ))}
          </div>
        )}

      </div>
    </div>
  );
}

