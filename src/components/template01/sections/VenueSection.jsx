'use client';

import React from 'react';
import Image from 'next/image';
import { weddingData } from '@/data/weddingData';
import { MapPin, Navigation, ExternalLink } from 'lucide-react';

/**
 * Section 14: Venue & Location
 * EXACT MATCH to Image 3 (Tile 14):
 * - Background: /14_venue_location.png (Illuminated twilight lake palace, floating diyas)
 * - NO dark gray cards or boxes.
 * - Text floats cleanly on the water & palace scenery:
 *     Venue
 *     The Heritage Palace & Gardens, Jaipur
 *     Amber Fort Foothills, Amer Road • Jaipur, Rajasthan
 *     [View on Maps ↗] (Gold pill button)
 */
export const VenueSection = () => {
  const { venue } = weddingData;

  return (
    <section
      id="venue"
      className="relative min-h-screen w-full flex items-end justify-center pb-24 sm:pb-28 px-6 overflow-hidden select-none"
    >
      {/* Background Graphic: 14_venue_location.png */}
      <div className="absolute inset-0 w-full h-full pointer-events-none">
        <Image
          src="/14_venue_location.png"
          alt="Venue Location Twilight Lake Palace Diyas"
          fill
          sizes="100vw"
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#091321]/80 via-transparent to-[#091321]/30" />
      </div>

      {/* Pure Floating Typography & CTA — NO DARK BOXES */}
      <div className="relative z-10 max-w-xl w-full mx-auto text-center flex flex-col items-center">
        <span className="text-[11px] sm:text-[12px] font-manrope font-semibold tracking-[0.3em] uppercase text-[#E7CEA0] mb-2 drop-shadow-md">
          — The Royal Destination —
        </span>

        <h2 className="font-cormorant text-5xl sm:text-7xl font-medium text-[#FFFDF7] leading-[0.95] tracking-tight mb-2 drop-shadow-md">
          Venue
        </h2>

        <h3 className="font-cormorant text-2xl sm:text-3xl text-[#D6B477] font-semibold mb-1 drop-shadow-sm">
          {venue.name}
        </h3>

        <p className="font-manrope text-xs sm:text-sm text-[#FAF5ED] mb-6 drop-shadow-sm">
          {venue.address}, {venue.city}
        </p>

        {/* View on Maps Button */}
        <a
          href={venue.googleMapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="group inline-flex items-center gap-2.5 px-8 py-3.5 rounded-full bg-gradient-to-r from-[#D6B477] via-[#E7CEA0] to-[#D6B477] text-[#091321] font-manrope text-xs sm:text-sm font-bold tracking-widest uppercase shadow-[0_6px_25px_rgba(214,180,119,0.5)] hover:shadow-[0_8px_35px_rgba(214,180,119,0.7)] transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer"
        >
          <Navigation className="w-4 h-4" />
          <span>View on Maps</span>
          <ExternalLink className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
        </a>
      </div>
    </section>
  );
};

export default VenueSection;
