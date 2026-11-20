'use client';

import React, { useState } from 'react';
import { Mail, MessageSquare, Phone, CheckCircle2 } from 'lucide-react';

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="w-full bg-[#F8F4EC] min-h-screen py-12 sm:py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-[11px] font-semibold tracking-[0.2em] uppercase text-[#8C6837] block mb-2">
            We Are Here For You
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif font-medium text-[#2C2114] tracking-tight mb-3">
            Contact & Concierge
          </h1>
          <p className="text-sm text-[#6B533E]">
            Have a question regarding personalizing your event web pages or publishing your live links? Our team is delighted to assist.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          
          <div className="md:col-span-5 bg-[#FCFAF6] rounded-3xl p-6 sm:p-8 border border-[#DFCEAF] shadow-luxury space-y-6">
            <h3 className="font-serif text-lg font-medium text-[#2C2114]">
              Customer Concierge
            </h3>
            
            <div className="space-y-4 text-xs text-[#574330]">
              <div className="flex items-start gap-3">
                <Mail className="w-4 h-4 text-[#A77B35] mt-0.5" />
                <div>
                  <strong className="block text-[#2C2114]">Email Concierge</strong>
                  <span>support@youaremine.com</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <MessageSquare className="w-4 h-4 text-[#A77B35] mt-0.5" />
                <div>
                  <strong className="block text-[#2C2114]">WhatsApp Support</strong>
                  <span>+91 98765 43210 (Mon-Sat, 9am - 8pm)</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone className="w-4 h-4 text-[#A77B35] mt-0.5" />
                <div>
                  <strong className="block text-[#2C2114]">Bespoke Inquiries</strong>
                  <span>hello@youaremine.com</span>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-[#FAF7F2] border border-[#E8DFC8] text-[11px] text-[#7A634E] leading-relaxed">
              <strong>Need instant page access?</strong> You can access and manage your event web pages anytime by visiting <a href="/account" className="text-[#8F6E3B] underline">My Account</a>.
            </div>
          </div>

          <div className="md:col-span-7 bg-[#FCFAF6] rounded-3xl p-6 sm:p-8 border border-[#DFCEAF] shadow-luxury">
            {submitted ? (
              <div className="text-center py-10 space-y-3">
                <CheckCircle2 className="w-12 h-12 text-[#2E6B3F] mx-auto" />
                <h3 className="font-serif text-xl font-medium text-[#2C2114]">
                  Message Received
                </h3>
                <p className="text-xs text-[#6B533E] max-w-sm mx-auto">
                  Thank you for reaching out. An You Are Mine concierge will reply to your email within 2-4 business hours.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                <div>
                  <label className="block font-semibold text-[#49341F] mb-1">Your Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Priyam Roy"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#DFCEAF] bg-white text-[#2C2114]"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-[#49341F] mb-1">Email Address</label>
                  <input
                    type="email"
                    required
                    placeholder="priyam@example.com"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#DFCEAF] bg-white text-[#2C2114]"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-[#49341F] mb-1">Subject</label>
                  <input
                    type="text"
                    required
                    placeholder="Customization assistance / Wedding suite inquiry"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#DFCEAF] bg-white text-[#2C2114]"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-[#49341F] mb-1">Message</label>
                  <textarea
                    rows={4}
                    required
                    placeholder="How can we assist with your special moment?"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#DFCEAF] bg-white text-[#2C2114]"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 rounded-xl bg-[#8F6E3B] hover:bg-[#7D5F31] text-white font-semibold shadow-gold transition-colors"
                >
                  Send Message
                </button>
              </form>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}

