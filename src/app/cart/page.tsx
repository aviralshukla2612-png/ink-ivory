'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ShoppingBag,
  Trash2,
  Edit3,
  ArrowRight,
  ShieldCheck,
  Tag,
  ArrowLeft,
  Sparkles,
} from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { CardPreview } from '@/components/cards/CardPreview';

export default function CartPage() {
  const router = useRouter();
  const {
    cart,
    removeFromCart,
    clearCart,
    totalPrice,
    totalItems,
    discount,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
  } = useCart();

  const [couponInput, setCouponInput] = useState('');
  const [couponError, setCouponError] = useState('');

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError('');
    if (!couponInput.trim()) return;

    const success = applyCoupon(couponInput);
    if (!success) {
      setCouponError('Invalid promo code. Try INK10 or WEDDING20');
    } else {
      setCouponInput('');
    }
  };

  const rawTotal = cart.reduce((sum, item) => sum + item.template.price, 0);

  return (
    <div className="w-full bg-[#F8F4EC] min-h-screen py-10 sm:py-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-[#E8DFC8]">
          <div>
            <h1 className="text-2xl sm:text-3xl font-serif font-medium text-[#2C2114]">
              Your Digital Cart
            </h1>
            <p className="text-xs text-[#7A634E] mt-1">
              {totalItems} {totalItems === 1 ? 'item' : 'items'} ready for instant digital download
            </p>
          </div>

          <Link
            href="/templates"
            className="text-xs font-semibold text-[#8F6E3B] hover:underline flex items-center gap-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Continue Shopping</span>
          </Link>
        </div>

        {cart.length === 0 ? (
          <div className="bg-[#FCFAF6] rounded-3xl p-12 text-center border border-[#DFCEAF] max-w-lg mx-auto shadow-sm">
            <ShoppingBag className="w-12 h-12 text-[#A77B35] mx-auto mb-4 opacity-50" />
            <h2 className="font-serif text-xl font-medium text-[#2C2114] mb-2">
              Your cart is empty
            </h2>
            <p className="text-xs text-[#7A634E] mb-6 leading-relaxed">
              Explore our bespoke digital invitation collections and find the perfect web page design for your special celebration.
            </p>
            <Link
              href="/templates"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-[#8F6E3B] text-white text-xs font-semibold shadow-gold"
            >
              <span>Explore Collections</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

            {/* Cart Items List (Col 8) */}
            <div className="lg:col-span-8 space-y-4">
              {cart.map((item) => (
                <div
                  key={item.customizedId}
                  className="bg-[#FCFAF6] rounded-2xl p-5 border border-[#E8DFC8] shadow-sm flex flex-col sm:flex-row items-center gap-5"
                >
                  {/* Thumbnail */}
                  <div className="w-20 sm:w-24 aspect-[3/4] rounded-xl overflow-hidden shadow-sm border border-[#DFCEAF] flex-shrink-0 relative bg-[#111827]">
                    <img
                      src={item.template?.previewImage || '/images/templates/royal-navy-wedding-card.webp'}
                      alt={item.template?.title || 'Card thumbnail'}
                      className="w-full h-full object-cover object-center"
                    />
                  </div>

                  {/* Info */}
                  <div className="flex-1 text-center sm:text-left space-y-1">
                    <div className="flex items-center justify-center sm:justify-start gap-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#8F6E3B] bg-[#EDE2CF] px-2 py-0.5 rounded-full">
                        {item.template.occasion}
                      </span>
                      <span className="text-[10px] text-[#2E6B3F] font-semibold bg-[#E8F3EA] px-2 py-0.5 rounded-full">
                        Digital License
                      </span>
                    </div>

                    <h3 className="font-serif text-base sm:text-lg font-medium text-[#2C2114]">
                      {item.template.title}
                    </h3>

                    <p className="text-xs text-[#7A634E]">
                      Customized for:{' '}
                      <strong className="text-[#49341F]">
                        {item.customization?.names || item.template.defaultFields.names}
                      </strong>
                    </p>

                    <div className="text-[11px] text-[#8C7359] pt-1">
                      Includes High-Res 300 DPI PNG & Print-Ready PDF
                    </div>
                  </div>

                  {/* Price & Actions */}
                  <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto pt-3 sm:pt-0 border-t sm:border-t-0 border-[#F2ECE0] gap-3">
                    <div className="text-right">
                      <div className="flex items-center gap-1.5 justify-end">
                        <span className="text-xs text-[#99816B] line-through font-medium">₹{item.template.originalPrice || 999}</span>
                        <span className="text-base sm:text-lg font-serif font-bold text-[#2C2114]">
                          {item.template.isFree ? 'Free' : `₹${item.template.price}`}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Link
                        href={`/customize/${item.template.id}?cartItemId=${item.customizedId}${
                          item.draftId ? `&draftId=${item.draftId}` : ''
                        }`}
                        className="p-1.5 rounded-lg border border-[#DFCEAF] text-[#6B533E] hover:text-[#8F6E3B] hover:bg-white text-xs flex items-center gap-1"
                        title="Edit Customization"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span className="text-[11px]">Edit</span>
                      </Link>

                      <button
                        onClick={() => removeFromCart(item.customizedId!)}
                        className="p-1.5 rounded-lg border border-[#DFCEAF] text-[#8C4343] hover:bg-red-50 text-xs flex items-center gap-1"
                        title="Remove from Cart"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                </div>
              ))}

              <div className="flex justify-between items-center pt-2">
                <button
                  onClick={clearCart}
                  className="text-xs text-[#8C4343] hover:underline"
                >
                  Clear all items
                </button>
                <div className="text-xs text-[#7A634E]">
                  All purchases are digital and available immediately upon confirmation.
                </div>
              </div>
            </div>

            {/* Order Summary (Col 4) */}
            <div className="lg:col-span-4 bg-[#FCFAF6] rounded-3xl p-6 border border-[#DFCEAF] shadow-luxury space-y-6">
              <h2 className="font-serif text-lg font-medium text-[#2C2114] pb-3 border-b border-[#EFE7D5]">
                Order Summary
              </h2>

              {/* Promo Code Box */}
              <div>
                <form onSubmit={handleApplyCoupon} className="space-y-2">
                  <label className="block text-xs font-medium text-[#49341F] flex items-center gap-1.5">
                    <Tag className="w-3.5 h-3.5 text-[#A77B35]" />
                    <span>Have a Promo Code?</span>
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value)}
                      placeholder="INK10"
                      className="flex-1 px-3 py-2 text-xs rounded-xl border border-[#DFCEAF] bg-white text-[#2C2114] uppercase focus:outline-none focus:ring-1 focus:ring-[#A77B35]"
                    />
                    <button
                      type="submit"
                      className="px-4 py-2 bg-[#8F6E3B] text-white text-xs font-semibold rounded-xl hover:bg-[#7D5F31]"
                    >
                      Apply
                    </button>
                  </div>
                  {couponError && (
                    <p className="text-[10px] text-red-600">{couponError}</p>
                  )}
                  {appliedCoupon && (
                    <div className="flex items-center justify-between text-xs text-[#2E6B3F] bg-[#E8F3EA] p-2 rounded-lg">
                      <span>Code &quot;{appliedCoupon}&quot; active!</span>
                      <button
                        type="button"
                        onClick={removeCoupon}
                        className="text-red-500 hover:underline font-bold"
                      >
                        ✕
                      </button>
                    </div>
                  )}
                </form>
              </div>

              {/* Price Calculation */}
              <div className="space-y-2.5 text-xs text-[#574330] pt-2 border-t border-[#EFE7D5]">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-serif font-medium text-[#2C2114]">₹{rawTotal}</span>
                </div>

                {discount > 0 && (
                  <div className="flex justify-between text-[#2E6B3F] font-medium">
                    <span>Promotional Discount</span>
                    <span>-₹{discount}</span>
                  </div>
                )}

                <div className="flex justify-between text-[#2E6B3F]">
                  <span>Digital Delivery</span>
                  <span>Free Instant Access</span>
                </div>

                <div className="flex justify-between text-base font-serif font-bold text-[#2C2114] pt-3 border-t border-[#EFE7D5]">
                  <span>Total Amount</span>
                  <span>₹{totalPrice}</span>
                </div>
              </div>

              {/* Checkout CTA */}
              <button
                onClick={() => router.push('/checkout')}
                className="w-full py-3.5 px-6 rounded-xl bg-[#8F6E3B] hover:bg-[#7D5F31] text-white text-xs sm:text-sm font-semibold shadow-gold flex items-center justify-center gap-2 transition-all duration-200"
              >
                <span>Proceed to Digital Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              {/* Guarantees */}
              <div className="text-center pt-2 space-y-1 text-[11px] text-[#7A634E]">
                <div className="flex items-center justify-center gap-1.5 text-[#2E6B3F] font-medium">
                  <ShieldCheck className="w-4 h-4" />
                  <span>100% Secure Checkout via Razorpay</span>
                </div>
                <p>Instant PNG & PDF high-res downloads after payment.</p>
              </div>

            </div>

          </div>
        )}

      </div>
    </div>
  );
}

