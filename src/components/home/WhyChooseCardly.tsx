'use client';

import React from 'react';
import { Crown, Sliders, Zap, CheckCircle2, ShieldCheck, Bookmark } from 'lucide-react';

export const WhyChooseInkAndIvory: React.FC = () => {
  const benefits = [
    {
      icon: <Crown className="w-5 h-5 sm:w-5.5 sm:h-5.5 text-[#A77B35]" strokeWidth={1.8} />,
      title: 'Premium Designs',
      description: 'Crafted with master typography, gold foil accents, and timeless editorial aesthetics.',
    },
    {
      icon: <Sliders className="w-5 h-5 sm:w-5.5 sm:h-5.5 text-[#A77B35]" strokeWidth={1.8} />,
      title: 'Easy Customization',
      description: 'Effortlessly personalize names, dates, quotes, and colors in real-time.',
    },
    {
      icon: <Zap className="w-5 h-5 sm:w-5.5 sm:h-5.5 text-[#A77B35]" strokeWidth={1.8} />,
      title: 'Instant Web Page Publishing',
      description: 'Zero waiting time. Launch your live invitation web page immediately after checkout ready to share via WhatsApp & SMS.',
    },
    {
      icon: <CheckCircle2 className="w-5 h-5 sm:w-5.5 sm:h-5.5 text-[#A77B35]" strokeWidth={1.8} />,
      title: 'Responsive & Interactive',
      description: 'Flawless responsive layouts optimized for all screens with interactive RSVPs, animations, and map integrations.',
    },
    {
      icon: <ShieldCheck className="w-5 h-5 sm:w-5.5 sm:h-5.5 text-[#A77B35]" strokeWidth={1.8} />,
      title: 'Secure Online Payments',
      description: '100% encrypted, secure transactions powered by Razorpay with all major cards and UPI.',
    },
    {
      icon: <Bookmark className="w-5 h-5 sm:w-5.5 sm:h-5.5 text-[#A77B35]" strokeWidth={1.8} />,
      title: 'Saved in Your Account',
      description: 'Revisit, edit, and manage your live event web pages anytime from your personal account portal.',
    },
  ];

  return (
    <section className="relative w-full bg-[#FAF7F2] py-16 sm:py-24 border-b border-[#EDE2CF] select-none">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
          {/* Eyebrow: — THE INK & IVORY STANDARD — */}
          <div className="flex items-center justify-center gap-3 sm:gap-4 mb-2.5">
            <div className="h-[1px] w-10 sm:w-16 bg-[#C5A059]/60" />
            <span className="text-[10.5px] sm:text-[11.5px] font-semibold tracking-[0.24em] uppercase text-[#9E7B3B]">
              The Ink & Ivory Standard
            </span>
            <div className="h-[1px] w-10 sm:w-16 bg-[#C5A059]/60" />
          </div>

          {/* Main Title: Why Choose Ink & Ivory? */}
          <h2 className="text-2xl sm:text-3xl md:text-[40px] font-serif font-medium text-[#231C16] tracking-tight leading-tight">
            Why Choose{' '}
            <span className="italic font-serif text-[#B88E4B] font-medium">
              Ink & Ivory?
            </span>
          </h2>
        </div>

        {/* 6 Benefit Cards Grid (2 rows x 3 columns on desktop) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {benefits.map((b) => (
            <div
              key={b.title}
              className="bg-white rounded-[22px] border border-[#EDE4D5] shadow-[0_8px_24px_-4px_rgba(180,140,80,0.08),0_2px_6px_rgba(0,0,0,0.02)] p-6 sm:p-6.5 flex items-center gap-4 sm:gap-5 hover:-translate-y-1 hover:shadow-[0_16px_32px_-6px_rgba(180,140,80,0.14),0_4px_10px_rgba(0,0,0,0.03)] hover:border-[#DFCDAE] transition-all duration-300"
            >
              {/* Circular Icon Disc */}
              <div className="w-12 h-12 sm:w-[52px] sm:h-[52px] rounded-full bg-[#FAF4EA] border border-[#EDE2CF]/70 flex items-center justify-center flex-shrink-0 shadow-[inset_0_1px_2px_rgba(255,255,255,0.8)]">
                {b.icon}
              </div>

              {/* Vertical Hairline Divider */}
              <div className="w-[1px] h-11 bg-[#EDE4D5] flex-shrink-0" />

              {/* Card Text Content */}
              <div className="flex-1 min-w-0">
                <h3 className="font-serif font-medium text-[16.5px] sm:text-[17.5px] text-[#231C16] mb-1.5 leading-snug tracking-tight">
                  {b.title}
                </h3>
                <p className="text-[12.5px] sm:text-[13px] text-[#705E4E] leading-relaxed">
                  {b.description}
                </p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export const WhyChooseCardly = WhyChooseInkAndIvory;
export default WhyChooseInkAndIvory;
