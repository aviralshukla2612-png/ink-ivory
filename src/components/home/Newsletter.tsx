'use client';

import React, { useState } from 'react';
import { Mail, CheckCircle2 } from 'lucide-react';

export const Newsletter: React.FC = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail('');
    }
  };

  return (
    <section className="w-full bg-[#FAF7F2] py-16 sm:py-20 border-t border-[#EDE2CF]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        
        <span className="text-[11px] font-semibold tracking-[0.2em] uppercase text-[#8C6837] block mb-2">
          Curated Updates
        </span>
        
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif font-medium text-[#2C2114] tracking-tight mb-3">
          Make Every Moment More Special.
        </h2>
        
        <p className="text-xs sm:text-sm text-[#6B533E] max-w-lg mx-auto mb-8 leading-relaxed">
          Subscribe to discover new designs, seasonal collections and exclusive offers.
        </p>

        {subscribed ? (
          <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#E8F3EA] text-[#2E6B3F] text-xs font-medium border border-[#CBE5D3] animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-[#2E6B3F]" />
            <span>Thank you for joining Ink & Ivory. Check your inbox for your 10% welcome gift.</span>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row items-center justify-center gap-2.5 max-w-md mx-auto">
            <div className="relative w-full">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address..."
                className="w-full pl-10 pr-4 py-3 text-xs rounded-full border border-[#DFCEAF] bg-[#FFFFFF] text-[#2C2114] placeholder-[#99816B] focus:outline-none focus:ring-1 focus:ring-[#A77B35] shadow-sm"
              />
              <Mail className="w-4 h-4 text-[#99816B] absolute left-3.5 top-1/2 -translate-y-1/2" />
            </div>

            <button
              type="submit"
              className="w-full sm:w-auto px-7 py-3 rounded-full bg-[#8F6E3B] hover:bg-[#7D5F31] text-white text-xs font-semibold whitespace-nowrap shadow-sm transition-all duration-200"
            >
              Subscribe
            </button>
          </form>
        )}

      </div>
    </section>
  );
};

