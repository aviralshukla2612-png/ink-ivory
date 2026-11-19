'use client';

import React from 'react';

export default function PrivacyPolicyPage() {
  return (
    <div className="w-full bg-[#F8F4EC] min-h-screen py-12 sm:py-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl sm:text-4xl font-serif font-medium text-[#2C2114] mb-4">
          Privacy Policy
        </h1>
        <p className="text-xs text-[#8C6837] mb-8">
          Last updated: November 2026 • Ink & Ivory Digital Stationery
        </p>

        <div className="bg-[#FCFAF6] rounded-3xl p-8 border border-[#DFCEAF] shadow-sm space-y-6 text-xs sm:text-sm text-[#49341F] leading-relaxed">
          <section>
            <h2 className="font-serif text-base font-semibold text-[#2C2114] mb-2">
              1. Information We Collect
            </h2>
            <p>
              When you create or customize digital invitation web pages on Ink & Ivory, we collect only the information necessary to host and launch your pages: your name, email address, optional contact number, and the text customized on your event web pages.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-base font-semibold text-[#2C2114] mb-2">
              2. Digital Page Content & Images
            </h2>
            <p>
              Any photos or custom wording you upload to our customization studio are processed solely for generating your personalized event web pages. We do not sell or display your personal family photos or event details publicly.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-base font-semibold text-[#2C2114] mb-2">
              3. Secure Payments
            </h2>
            <p>
              All online transactions are processed through Razorpay using industry-standard 256-bit SSL encryption. Ink & Ivory never stores your payment numbers, CVVs, or banking credentials.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-base font-semibold text-[#2C2114] mb-2">
              4. Contact Us
            </h2>
            <p>
              For privacy inquiries or account data deletion requests, contact privacy@inkandivory.com.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}

