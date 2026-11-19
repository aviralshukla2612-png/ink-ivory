'use client';

import React from 'react';
import Link from 'next/link';
import { Sparkles, Heart, ShieldCheck, Download, ArrowRight } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="w-full bg-[#F8F4EC] min-h-screen py-12 sm:py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-[11px] font-semibold tracking-[0.2em] uppercase text-[#8C6837] block mb-2">
            Our Story & Philosophy
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif font-medium text-[#2C2114] tracking-tight mb-4">
            About Ink & Ivory
          </h1>
          <p className="text-sm sm:text-base text-[#6B533E] leading-relaxed">
            Where timeless stationery elegance meets the interactive grace of digital event web pages.
          </p>
        </div>

        <div className="bg-[#FCFAF6] rounded-3xl p-8 sm:p-12 border border-[#DFCEAF] shadow-luxury space-y-8 text-xs sm:text-sm text-[#49341F] leading-relaxed">
          <p>
            Ink & Ivory was born out of a simple, beautiful belief: <em>life&apos;s most sacred moments deserve invitation web pages of extraordinary elegance, without the waste, delays, or physical friction of traditional print-and-mail logistics.</em>
          </p>

          <div className="p-6 rounded-2xl bg-[#FAF7F2] border border-[#E8DFC8] space-y-2">
            <h3 className="font-serif text-base font-semibold text-[#2C2114]">
              Our Digital-First Philosophy
            </h3>
            <p className="text-[#6B533E]">
              We are exclusively a luxury digital invitation web page and event portal boutique. When you customize an Ink & Ivory design, you launch a responsive, interactive web page immediately — ready to share in seconds via WhatsApp, SMS, or email.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
            <div className="p-4 rounded-xl border border-[#DFCEAF] bg-white text-center">
              <Sparkles className="w-6 h-6 text-[#A77B35] mx-auto mb-2" />
              <h4 className="font-serif font-semibold text-[#2C2114] mb-1">Bespoke Design</h4>
              <p className="text-[11px] text-[#7A634E]">Every web page template is crafted with ornate gold foil and botanical flourishes.</p>
            </div>
            <div className="p-4 rounded-xl border border-[#DFCEAF] bg-white text-center">
              <Download className="w-6 h-6 text-[#A77B35] mx-auto mb-2" />
              <h4 className="font-serif font-semibold text-[#2C2114] mb-1">Zero Waiting</h4>
              <p className="text-[11px] text-[#7A634E]">No couriers, no printing delays. Launch your live web page immediately after checkout.</p>
            </div>
            <div className="p-4 rounded-xl border border-[#DFCEAF] bg-white text-center">
              <ShieldCheck className="w-6 h-6 text-[#A77B35] mx-auto mb-2" />
              <h4 className="font-serif font-semibold text-[#2C2114] mb-1">Eco-Conscious</h4>
              <p className="text-[11px] text-[#7A634E]">100% paperless digital elegance preserving our forests and planet.</p>
            </div>
          </div>

          <div className="text-center pt-8 border-t border-[#F2ECE0]">
            <Link
              href="/templates"
              className="inline-flex items-center gap-2 px-7 py-3 rounded-full bg-[#8F6E3B] text-white text-xs font-semibold shadow-gold"
            >
              <span>Explore The Collection</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}

