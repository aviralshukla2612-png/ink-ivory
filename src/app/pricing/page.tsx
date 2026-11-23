'use client';

import React from 'react';
import Link from 'next/link';
import { Check, Sparkles, ShieldCheck, ArrowRight, HeartHandshake, Zap, Lock } from 'lucide-react';

export default function PricingPage() {
  const inclusions = [
    'Access to any template across all categories (Weddings, Birthdays, Valentine\'s & Dates)',
    'Full real-time personalization (names, stories, ceremonies, dates & venues)',
    'Interactive wax-seal envelope opening animation with custom couple monogram',
    'Background music player with your chosen song & smooth autoplay',
    'Guest RSVP collection & attendance confirmation',
    'Live event countdown timer (days, hours, minutes)',
    'High-resolution couple photo gallery & custom photo placement',
    'Interactive 1-click Google Maps navigation to your celebration venue',
    'Instant 1-click sharing ready for WhatsApp, SMS, and Instagram',
    'Responsive across all devices — guests need no app to view',
    'Unlimited edits & revisions before and after publishing',
    '100% ad-free, private, luxury celebration experience',
  ];

  const faqs = [
    {
      q: 'Are there any monthly or yearly subscription fees?',
      a: 'No! We never charge recurring subscriptions, monthly renewals, or annual fees. You pay a single flat price of ₹299 per card, and that is it.',
    },
    {
      q: 'Does the ₹299 price apply to every template?',
      a: 'Yes! Every design in our collection — Royal Palace Weddings, South Indian Temple Muhurtham, Interactive Proposals, and Birthdays — is ₹299. No hidden tiers or upsells.',
    },
    {
      q: 'Can I edit my invitation after publishing?',
      a: 'Yes! Your invitation is saved permanently in your account. You can edit names, timings, dates, venue details, or photos anytime at no extra cost.',
    },
    {
      q: 'Do guests need to install an app to view the invitation?',
      a: 'No app is needed. When you share your custom link (e.g. youaremine.online/invite/your-names) via WhatsApp or SMS, guests simply tap to open the full interactive invitation in their browser.',
    },
    {
      q: 'Do you ship printed physical invitations?',
      a: 'You Are Mine is strictly a bespoke digital invitation platform. We deliver interactive web pages that can be viewed and shared anywhere in the world instantly.',
    },
  ];

  return (
    <div className="w-full bg-[#F8F4EC] min-h-screen py-12 sm:py-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
          <span className="text-[11px] font-semibold tracking-[0.25em] uppercase text-[#8C6837] block mb-2.5">
            HONEST & TRANSPARENT
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif font-medium text-[#2C2114] tracking-tight mb-3">
            Simple, All-Inclusive Pricing
          </h1>
          <p className="text-xs sm:text-sm text-[#6B533E] leading-relaxed">
            One flat price for all cards. No monthly fees, no yearly subscriptions, and zero hidden costs.
          </p>
        </div>

        {/* Single Luxury Pricing Card */}
        <div className="max-w-2xl mx-auto mb-16">
          <div className="bg-[#FCFAF6] rounded-3xl p-8 sm:p-12 border-2 border-[#8F6E3B] shadow-luxury-lg relative">
            
            {/* Top Badge */}
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-[#8F6E3B] text-white text-[11px] font-bold uppercase tracking-wider py-1.5 px-5 rounded-full shadow-md flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Flat Rate • All Templates Included</span>
            </div>

            {/* Card Heading */}
            <div className="text-center pb-6 border-b border-[#F2ECE0]">
              <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-[#2C2114] mb-2">
                Digital Invitation Suite
              </h2>
              <p className="text-xs sm:text-sm text-[#7A634E] max-w-md mx-auto">
                Pay once, customize every detail, and get your custom live invitation web page instantly.
              </p>

              {/* Price Display */}
              <div className="mt-6 flex items-center justify-center gap-3">
                <span className="text-sm sm:text-base text-[#99816B] line-through font-serif">
                  ₹999
                </span>
                <span className="font-serif text-4xl sm:text-5xl font-bold text-[#2C2114]">
                  ₹299
                </span>
                <span className="text-xs sm:text-sm text-[#8C7359] font-medium">
                  / per card
                </span>
                <span className="bg-[#2E6B3F]/10 text-[#2E6B3F] text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
                  70% OFF
                </span>
              </div>
              <p className="text-[11px] text-[#8C7359] mt-2">
                One-time payment • Lifetime account access • No recurring fees
              </p>
            </div>

            {/* Inclusions List */}
            <div className="py-8">
              <span className="text-[11px] font-bold tracking-wider uppercase text-[#8C6837] block mb-5">
                Everything Included In Every Card:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {inclusions.map((item, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 text-xs text-[#49341F]">
                    <div className="w-4 h-4 rounded-full bg-[#2E6B3F]/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Check className="w-3 h-3 text-[#2E6B3F]" />
                    </div>
                    <span className="leading-snug">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA Button */}
            <div className="pt-6 border-t border-[#F2ECE0] flex flex-col items-center gap-3">
              <Link
                href="/templates"
                className="w-full py-4 px-6 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all bg-[#8F6E3B] hover:bg-[#7D5F31] text-white shadow-gold"
              >
                <span>Browse Templates &amp; Start Creating</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              
              <div className="flex items-center gap-4 text-[11px] text-[#7A634E] mt-2">
                <span className="flex items-center gap-1">
                  <Lock className="w-3.5 h-3.5 text-[#8F6E3B]" />
                  Secure Checkout
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Zap className="w-3.5 h-3.5 text-[#8F6E3B]" />
                  Instant Activation
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#2E6B3F]" />
                  Zero Subscriptions
                </span>
              </div>
            </div>

          </div>
        </div>

        {/* Trust Points */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-16">
          <div className="bg-white/80 rounded-2xl p-6 border border-[#E8DFC8] text-center">
            <div className="w-10 h-10 rounded-full bg-[#8F6E3B]/10 text-[#8F6E3B] flex items-center justify-center mx-auto mb-3">
              <Zap className="w-5 h-5" />
            </div>
            <h3 className="font-serif text-base font-semibold text-[#2C2114] mb-1">
              No Recurring Charges
            </h3>
            <p className="text-xs text-[#7A634E] leading-relaxed">
              You only pay once when you publish your card. We never bill your card monthly or annually.
            </p>
          </div>

          <div className="bg-white/80 rounded-2xl p-6 border border-[#E8DFC8] text-center">
            <div className="w-10 h-10 rounded-full bg-[#8F6E3B]/10 text-[#8F6E3B] flex items-center justify-center mx-auto mb-3">
              <HeartHandshake className="w-5 h-5" />
            </div>
            <h3 className="font-serif text-base font-semibold text-[#2C2114] mb-1">
              Unlimited Post-Launch Edits
            </h3>
            <p className="text-xs text-[#7A634E] leading-relaxed">
              Need to change the venue timing or wording later? Edit your card whenever you want for free.
            </p>
          </div>

          <div className="bg-white/80 rounded-2xl p-6 border border-[#E8DFC8] text-center">
            <div className="w-10 h-10 rounded-full bg-[#8F6E3B]/10 text-[#8F6E3B] flex items-center justify-center mx-auto mb-3">
              <ShieldCheck className="w-5 h-5 text-[#2E6B3F]" />
            </div>
            <h3 className="font-serif text-base font-semibold text-[#2C2114] mb-1">
              Share With Unlimited Guests
            </h3>
            <p className="text-xs text-[#7A634E] leading-relaxed">
              Share your link with 10 or 10,000 guests via WhatsApp or SMS. There are zero guest limits.
            </p>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="bg-[#FCFAF6] rounded-3xl p-8 sm:p-10 border border-[#DFCEAF] shadow-sm max-w-3xl mx-auto">
          <h2 className="font-serif text-2xl font-medium text-[#2C2114] mb-6 text-center">
            Frequently Asked Questions
          </h2>
          <div className="space-y-5 text-xs sm:text-sm">
            {faqs.map((f, i) => (
              <div key={i} className="pb-4 border-b border-[#F0E6D2] last:border-0 last:pb-0">
                <h3 className="font-semibold text-[#2C2114] mb-1.5">
                  {f.q}
                </h3>
                <p className="text-[#6B533E] leading-relaxed">
                  {f.a}
                </p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
