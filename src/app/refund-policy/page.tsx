'use client';

import React from 'react';

export default function RefundPolicyPage() {
  return (
    <div className="w-full bg-[#F8F4EC] min-h-screen py-12 sm:py-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl sm:text-4xl font-serif font-medium text-[#2C2114] mb-4">
          Refund & Cancellation Policy
        </h1>
        <p className="text-xs text-[#8C6837] mb-8">
          Policy for Digital Goods • Ink & Ivory
        </p>

        <div className="bg-[#FCFAF6] rounded-3xl p-8 border border-[#DFCEAF] shadow-sm space-y-6 text-xs sm:text-sm text-[#49341F] leading-relaxed">
          <section>
            <h2 className="font-serif text-base font-semibold text-[#2C2114] mb-2">
              1. Nature of Digital Invitation Web Pages
            </h2>
            <p>
              Because Ink & Ivory provides instant-access live digital event web pages and published links, orders are generally non-refundable once payment is completed and live web hosting is activated.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-base font-semibold text-[#2C2114] mb-2">
              2. Full Preview Before Launch
            </h2>
            <p>
              To ensure 100% satisfaction, Ink & Ivory provides a real-time live interactive editor and full preview where you can verify all text, spelling, dates, and color choices prior to checkout.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-base font-semibold text-[#2C2114] mb-2">
              3. Technical Defects & Assistance
            </h2>
            <p>
              If you experience any technical defect during page hosting or link generation, our concierge team will resolve your page or issue a full credit or refund within 24 hours. Contact support@inkandivory.com.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}

