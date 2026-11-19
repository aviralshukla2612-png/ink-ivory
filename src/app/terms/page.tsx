'use client';

import React from 'react';

export default function TermsPage() {
  return (
    <div className="w-full bg-[#F8F4EC] min-h-screen py-12 sm:py-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl sm:text-4xl font-serif font-medium text-[#2C2114] mb-4">
          Terms & Conditions
        </h1>
        <p className="text-xs text-[#8C6837] mb-8">
          Effective as of November 2026 • Ink & Ivory Digital Invitation Platform
        </p>

        <div className="bg-[#FCFAF6] rounded-3xl p-8 border border-[#DFCEAF] shadow-sm space-y-6 text-xs sm:text-sm text-[#49341F] leading-relaxed">
          <section>
            <h2 className="font-serif text-base font-semibold text-[#2C2114] mb-2">
              1. Digital Invitation Web Pages Only
            </h2>
            <p>
              Ink & Ivory provides exclusively digital invitation web pages and event portals. No physical cards, envelopes, or printed materials are shipped. Purchases grant you an immediate published live web page with interactive guest RSVP and shareable links.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-base font-semibold text-[#2C2114] mb-2">
              2. Personal Use License
            </h2>
            <p>
              Publishing an event web page grants you a perpetual, non-exclusive license to use, host, send, and distribute that personalized page for your personal, non-commercial events (weddings, birthdays, anniversaries, graduations, etc.).
            </p>
          </section>

          <section>
            <h2 className="font-serif text-base font-semibold text-[#2C2114] mb-2">
              3. Intellectual Property
            </h2>
            <p>
              All page templates, typography pairings, botanical illustrations, and brand assets remain the intellectual property of Ink & Ivory and its artists. Reselling Ink & Ivory templates as raw editable assets is strictly prohibited.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}

