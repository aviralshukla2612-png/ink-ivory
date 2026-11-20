'use client';

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Heart,
  Edit3,
  ShoppingBag,
  Download,
  ShieldCheck,
  Sparkles,
  ArrowLeft,
  Check,
  Star,
} from 'lucide-react';
import { templatesData } from '@/data/templates';
import { CardPreview } from '@/components/cards/CardPreview';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';

export default function TemplateDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params?.slug as string;

  const template = templatesData.find((t) => t.slug === slug) || templatesData[0];
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();

  const isFav = isInWishlist(template.id);

  const handleAddToCart = () => {
    addToCart(template);
    router.push('/cart');
  };

  return (
    <div className="w-full bg-[#F8F4EC] min-h-screen py-10 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb */}
        <div className="mb-8 flex items-center gap-2 text-xs text-[#8C6837]">
          <Link href="/templates" className="hover:underline flex items-center gap-1">
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to All Templates</span>
          </Link>
          <span>/</span>
          <span className="text-[#49341F] font-medium">{template.title}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          
          {/* LEFT: Large Card Showcase (Col 7) */}
          <div className="lg:col-span-7 bg-[#FCFAF6] rounded-3xl p-6 sm:p-10 border border-[#DFCEAF] shadow-luxury flex flex-col items-center justify-center relative">
            <div className="w-full max-w-md my-auto">
              <CardPreview
                template={template}
                className="rounded-xl shadow-luxury-lg border border-[#A77B35]/30"
              />
            </div>

            <div className="mt-6 flex items-center justify-between w-full pt-4 border-t border-[#EFE7D5] text-xs text-[#8C7359]">
              <span className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#A77B35]" />
                Live visual preview (Pre-customization)
              </span>
              <span>Aspect ratio: {template.designConfig.orientation}</span>
            </div>
          </div>

          {/* RIGHT: Details & Actions (Col 5) */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Header info */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="px-3 py-1 rounded-full text-[11px] font-bold tracking-wider uppercase bg-[#EDE2CF] text-[#8F6E3B]">
                  {template.occasion}
                </span>
                <button
                  onClick={() => toggleWishlist(template)}
                  className="p-2 rounded-full border border-[#DFCEAF] bg-white hover:bg-[#FAF7F2] transition-colors text-[#49341F]"
                  title="Wishlist"
                >
                  <Heart
                    className={`w-4 h-4 ${isFav ? 'fill-[#A77B35] text-[#A77B35]' : 'stroke-[1.8]'}`}
                  />
                </button>
              </div>

              <h1 className="text-2xl sm:text-3xl font-serif font-medium text-[#2C2114] leading-tight mb-2">
                {template.title}
              </h1>

              {/* Rating */}
              <div className="flex items-center gap-2 text-xs text-[#695034]">
                <div className="flex items-center text-[#A77B35]">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-current" />
                  ))}
                </div>
                <span className="font-semibold text-[#2C2114]">{template.rating}</span>
                <span>•</span>
                <span>{template.reviewsCount} verified reviews</span>
              </div>
            </div>

            {/* Price */}
            <div className="p-4 rounded-2xl bg-[#FCFAF6] border border-[#E8DFC8]">
              <div className="flex items-baseline gap-2">
                {template.isFree ? (
                  <span className="text-2xl sm:text-3xl font-serif font-bold text-[#2E6B3F]">
                    Free
                  </span>
                ) : (
                  <>
                    <span className="text-2xl sm:text-3xl font-serif font-bold text-[#2C2114]">
                      ₹{template.price}
                    </span>
                    <span className="text-sm text-[#99816B] line-through">
                      ₹{template.price + 200}
                    </span>
                    <span className="text-xs font-semibold text-[#2E6B3F] bg-[#E8F3EA] px-2 py-0.5 rounded-full">
                      Digital Edition
                    </span>
                  </>
                )}
              </div>
              <p className="text-[11px] text-[#7A634E] mt-1">
                One-time purchase • Unlimited edits & downloads in PNG & PDF
              </p>
            </div>

            {/* Description */}
            <p className="text-xs sm:text-sm text-[#574330] leading-relaxed">
              {template.description}
            </p>

            {/* CTA Buttons */}
            <div className="space-y-3 pt-2">
              <Link
                href={`/customize/${template.id}`}
                className="w-full py-3.5 px-6 rounded-xl bg-[#8F6E3B] hover:bg-[#7D5F31] text-white text-xs sm:text-sm font-semibold shadow-gold flex items-center justify-center gap-2 transition-all"
              >
                <Edit3 className="w-4 h-4" />
                <span>Customize This Card</span>
              </Link>

              <button
                onClick={handleAddToCart}
                className="w-full py-3.5 px-6 rounded-xl bg-white hover:bg-[#FAF7F2] border border-[#8F6E3B] text-[#8F6E3B] text-xs sm:text-sm font-semibold shadow-sm flex items-center justify-center gap-2 transition-all"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Add to Cart & Checkout</span>
              </button>
            </div>

            {/* Digital Delivery Feature List (STRICTLY NO SHIPPING) */}
            <div className="pt-4 border-t border-[#E8DFC8] space-y-2.5">
              <div className="flex items-center gap-2 text-xs text-[#49341F]">
                <Check className="w-4 h-4 text-[#2E6B3F]" />
                <span>Instant High-Resolution PNG & Vector PDF Download</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-[#49341F]">
                <Check className="w-4 h-4 text-[#2E6B3F]" />
                <span>Fully editable names, dates, times, venues & messages</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-[#49341F]">
                <Check className="w-4 h-4 text-[#2E6B3F]" />
                <span>Ready to share on WhatsApp, Email, & Social Media</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-[#49341F]">
                <ShieldCheck className="w-4 h-4 text-[#A77B35]" />
                <span>Lifetime access in your You Are Mine customer account</span>
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}

