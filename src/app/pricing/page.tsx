'use client';

import React from 'react';
import Link from 'next/link';
import { Check, Sparkles, ShieldCheck, Download, ArrowRight } from 'lucide-react';

export default function PricingPage() {
  const plans = [
    {
      name: 'Free Digital Collection',
      price: '₹0',
      period: 'forever',
      description: 'Ideal for casual greetings, simple birthdays, and festive celebrations.',
      featured: false,
      buttonText: 'Browse Free Pages',
      buttonLink: '/templates?filter=free',
      features: [
        'Access to all curated Free Templates',
        'Full real-time text personalization',
        'Instant live web page link',
        'Lifetime access in Ink & Ivory account',
        'Ready to share via WhatsApp & SMS',
      ],
    },
    {
      name: 'Single Premium Web Page',
      price: '₹299',
      period: 'per web page',
      description: 'Our most popular choice. Unlocks master gold-foil designs and wedding suites.',
      featured: true,
      badge: 'Most Popular',
      buttonText: 'Explore Premium Pages',
      buttonLink: '/templates',
      features: [
        'Access to imperial wedding & anniversary suites',
        'Intricate gold-foil botanical borders',
        'Responsive interactive web page with RSVP',
        'Custom photo upload and placement',
        'Unlimited revisions & edits before and after launch',
        'Direct email delivery and instant live link',
      ],
    },
    {
      name: 'Host & Event All-Access',
      price: '₹999',
      period: '1 year access',
      description: 'For wedding planners, families hosting multiple ceremonies, or frequent gifters.',
      featured: false,
      buttonText: 'Get All-Access Pass',
      buttonLink: '/checkout',
      features: [
        'Unlimited downloads across all 100+ templates',
        'Wedding suite (Save the date, Main invite, Reception)',
        'Priority RSVP text formatting assistance',
        'Commercial sharing rights for planners',
        'Dedicated WhatsApp concierge support',
        'Permanent cloud backup of all event stationery',
      ],
    },
  ];

  return (
    <div className="w-full bg-[#F8F4EC] min-h-screen py-12 sm:py-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-[11px] font-semibold tracking-[0.2em] uppercase text-[#8C6837] block mb-2">
            Honest & Transparent
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif font-medium text-[#2C2114] tracking-tight mb-3">
            Simple Digital Pricing
          </h1>
          <p className="text-xs sm:text-sm text-[#6B533E] leading-relaxed">
            Every card is 100% digital with zero printing or shipping fees. Buy once, customize endlessly, and download instantly.
          </p>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch mb-16">
          {plans.map((p) => (
            <div
              key={p.name}
              className={`rounded-3xl p-7 sm:p-8 flex flex-col justify-between transition-all duration-300 relative ${
                p.featured
                  ? 'bg-[#FCFAF6] border-2 border-[#8F6E3B] shadow-luxury-lg md:-translate-y-2'
                  : 'bg-white/80 border border-[#E8DFC8] shadow-sm hover:shadow-luxury'
              }`}
            >
              {p.badge && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#8F6E3B] text-white text-[10px] font-bold uppercase tracking-wider py-1 px-3.5 rounded-full shadow-sm">
                  {p.badge}
                </div>
              )}

              <div>
                <h3 className="font-serif text-lg font-semibold text-[#2C2114] mb-1">
                  {p.name}
                </h3>
                <p className="text-xs text-[#7A634E] mb-5 min-h-[32px]">
                  {p.description}
                </p>

                <div className="flex items-baseline gap-1.5 pb-6 border-b border-[#F2ECE0]">
                  <span className="font-serif text-3xl sm:text-4xl font-bold text-[#2C2114]">
                    {p.price}
                  </span>
                  <span className="text-xs text-[#8C7359]">/ {p.period}</span>
                </div>

                <div className="py-6 space-y-3">
                  <span className="text-[11px] font-bold tracking-wider uppercase text-[#8C6837] block">
                    What&apos;s Included:
                  </span>
                  {p.features.map((feat) => (
                    <div key={feat} className="flex items-start gap-2.5 text-xs text-[#49341F]">
                      <Check className="w-4 h-4 text-[#2E6B3F] flex-shrink-0 mt-0.5" />
                      <span className="leading-snug">{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-[#F2ECE0]">
                <Link
                  href={p.buttonLink}
                  className={`w-full py-3 px-5 rounded-xl text-xs sm:text-[13px] font-semibold flex items-center justify-center gap-2 transition-all ${
                    p.featured
                      ? 'bg-[#8F6E3B] hover:bg-[#7D5F31] text-white shadow-gold'
                      : 'bg-white border border-[#8F6E3B] text-[#8F6E3B] hover:bg-[#FAF7F2]'
                  }`}
                >
                  <span>{p.buttonText}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

            </div>
          ))}
        </div>

        {/* FAQ box */}
        <div className="bg-[#FCFAF6] rounded-3xl p-8 border border-[#DFCEAF] shadow-sm max-w-3xl mx-auto">
          <h2 className="font-serif text-xl font-medium text-[#2C2114] mb-4 text-center">
            Frequently Asked Questions
          </h2>
          <div className="space-y-4 text-xs">
            <div>
              <h4 className="font-semibold text-[#2C2114] mb-1">
                Do you print or ship physical invitations?
              </h4>
              <p className="text-[#6B533E] leading-relaxed">
                No. Ink & Ivory is strictly a digital invitation web page platform. You launch an interactive, fully responsive event web page with a shareable live link immediately after checkout.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-[#2C2114] mb-1">
                Can I edit my web page after publishing?
              </h4>
              <p className="text-[#6B533E] leading-relaxed">
                Yes! Your published pages are saved permanently in your account. You can revisit and customize names, dates, or venues anytime.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-[#2C2114] mb-1">
                How do I share my web page with guests?
              </h4>
              <p className="text-[#6B533E] leading-relaxed">
                Our responsive web pages are optimized for instant one-click sharing via WhatsApp, SMS, Email, or social media.
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

