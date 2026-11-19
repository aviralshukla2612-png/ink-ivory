'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { weddingData } from '@/data/weddingData';
import { Calendar, DownloadCloud } from 'lucide-react';
import { downloadWeddingCalendar } from '@/utils/calendar';

/**
 * Section 06: Save the Date
 * EXACT MATCH to Image 3 (Tile 06):
 * - Background: /06_save_the_date.png (Ivory arch surrounded by blooming trees, palace landscape)
 * - NO dark gray cards or boxes.
 * - Text centered inside the arch in deep royal espresso & gold serif typography:
 *     Save
 *     the Date
 *     [Calendar Icon]
 *     Friday, 18 December 2026 • Jaipur, Rajasthan
 *     Live Countdown (Days / Hours / Minutes / Seconds)
 */
export const SaveTheDateSection = () => {
  const { couple } = weddingData;

  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const targetDate = new Date(couple.weddingDateISO || '2026-12-18T17:00:00+05:30').getTime();

    const calculateTime = () => {
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      setTimeLeft({
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((difference % (1000 * 60)) / 1000),
      });
    };

    calculateTime();
    const timer = setInterval(calculateTime, 1000);
    return () => clearInterval(timer);
  }, [couple.weddingDateISO]);

  const handleDownloadCalendar = () => {
    downloadWeddingCalendar(weddingData);
  };

  return (
    <section
      id="countdown"
      className="relative min-h-screen w-full flex items-center justify-center pt-28 pb-16 px-6 overflow-hidden select-none"
    >
      {/* Background Graphic: 06_save_the_date.png */}
      <div className="absolute inset-0 w-full h-full pointer-events-none">
        <Image
          src="/06_save_the_date.png"
          alt="Save the Date Palace Arch"
          fill
          sizes="100vw"
          className="object-cover object-center"
        />
      </div>

      {/* Pure Floating Typography inside the Arch — Snugly framed inside central arch opening */}
      <div className="relative z-10 max-w-[340px] sm:max-w-[380px] md:max-w-[420px] w-full mx-auto text-center flex flex-col items-center pt-8 sm:pt-12">
        <p className="font-manrope text-[10px] sm:text-[11px] font-semibold tracking-[0.26em] uppercase text-[#7B5927] mb-1.5 drop-shadow-[0_1px_1px_rgba(255,255,255,0.8)]">
          — Mark Your Calendar —
        </p>

        {/* Heading: Save the Date */}
        <h2 className="font-cormorant text-4xl sm:text-5xl md:text-6xl font-medium text-[#26180E] leading-[0.95] tracking-tight mb-2 drop-shadow-[0_1px_2px_rgba(255,255,255,0.9)]">
          Save <br />
          <span className="italic font-serif text-[#3E2512]">the Date</span>
        </h2>

        {/* Calendar Icon & Date */}
        <div className="flex items-center gap-2 text-[#7B5927] my-1.5 drop-shadow-[0_1px_1px_rgba(255,255,255,0.8)]">
          <Calendar className="w-4 h-4 text-[#8C6527]" />
          <span className="font-cormorant text-xl sm:text-2xl font-semibold text-[#1C120A]">
            {couple.dateDisplay}
          </span>
        </div>

        <p className="font-manrope text-[10px] sm:text-xs font-semibold tracking-[0.16em] uppercase text-[#6B4D1B] mb-4 drop-shadow-[0_1px_1px_rgba(255,255,255,0.8)]">
          {couple.timeDisplay} • {couple.cityDisplay}
        </p>

        {/* Clean Numerical Countdown Row (Snug width, never hits side pillars) */}
        <div className="flex items-center justify-center gap-2.5 sm:gap-4 my-2 text-center w-full max-w-[320px] sm:max-w-[360px]">
          {[
            { label: 'Days', val: timeLeft.days },
            { label: 'Hours', val: timeLeft.hours },
            { label: 'Mins', val: timeLeft.minutes },
            { label: 'Secs', val: timeLeft.seconds },
          ].map((item, idx) => (
            <React.Fragment key={item.label}>
              {idx > 0 && (
                <span className="font-cormorant text-lg sm:text-2xl text-[#A87B36] opacity-50 pb-2">
                  :
                </span>
              )}
              <div className="flex flex-col items-center">
                <span className="font-cormorant text-2xl sm:text-3xl md:text-4xl font-semibold text-[#26180E] leading-none mb-0.5 drop-shadow-[0_1px_2px_rgba(255,255,255,0.9)]">
                  {String(item.val).padStart(2, '0')}
                </span>
                <span className="text-[9px] sm:text-[10px] font-manrope font-semibold tracking-[0.15em] uppercase text-[#7B5927]">
                  {item.label}
                </span>
              </div>
            </React.Fragment>
          ))}
        </div>

        {/* Add to Calendar Action Button */}
        <button
          type="button"
          onClick={handleDownloadCalendar}
          className="mt-5 group inline-flex items-center gap-2 px-5 sm:px-7 py-2.5 rounded-full bg-[#3B2513] hover:bg-[#2A180A] text-[#FAF5ED] font-manrope text-[11px] font-semibold tracking-wider uppercase shadow-md transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer"
        >
          <Calendar className="w-3.5 h-3.5 text-[#E7CEA0]" />
          <span>Add to Calendar</span>
          <DownloadCloud className="w-3.5 h-3.5 text-[#E7CEA0] group-hover:translate-y-0.5 transition-transform" />
        </button>
      </div>
    </section>
  );
};

export default SaveTheDateSection;
