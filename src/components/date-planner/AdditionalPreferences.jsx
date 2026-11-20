"use client";

import React from "react";
import { Compass, Sparkles, Heart, DollarSign, MapPin, Feather } from "lucide-react";

export default function AdditionalPreferences({
  environments = [],
  budgets = [],
  locations = [],
  selectedEnvironment,
  selectedBudget,
  selectedLocation,
  specialNotes = "",
  onChangeEnvironment,
  onChangeBudget,
  onChangeLocation,
  onChangeNotes,
}) {
  return (
    <section id="preferences" className="py-16 md:py-24 px-4 bg-gradient-to-b from-transparent to-[#F9E4DE]/30">
      <div className="max-w-4xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#B51F3B]/10 text-[#B51F3B] text-xs tracking-[0.25em] uppercase font-medium mb-3">
            <Compass className="w-3.5 h-3.5" />
            Step 06 &bull; Atmosphere & Details
          </span>
          <h2 className="font-serif text-3xl md:text-4xl text-[#641A2A] font-semibold mb-3">
            Finishing Touches & Setting
          </h2>
          <p className="text-[#50363A]/80 text-sm md:text-base max-w-lg mx-auto">
            Choose the mood and backdrop that make you feel happiest and most comfortable.
          </p>
        </div>

        <div className="space-y-10">
          {/* Environment (Indoor / Outdoor) */}
          <div className="bg-[#FFF9F4] rounded-2xl p-6 md:p-8 border border-[#E7A5A4]/30 shadow-sm">
            <h3 className="font-serif text-xl text-[#641A2A] font-medium mb-4 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#B51F3B]" />
              Preferred Ambience
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {environments.map((env) => {
                const isSelected = selectedEnvironment === env.id;
                return (
                  <button
                    key={env.id}
                    type="button"
                    onClick={() => onChangeEnvironment(env.id)}
                    className={`text-left p-4 rounded-xl border transition-all duration-300 ${
                      isSelected
                        ? "bg-[#641A2A] text-[#FFF9F4] border-[#641A2A] shadow-md scale-[1.01]"
                        : "bg-white/80 hover:bg-white text-[#50363A] border-[#E7A5A4]/40 hover:border-[#B51F3B]/50"
                    }`}
                  >
                    <div className="font-serif font-medium text-base mb-1">
                      {env.title}
                    </div>
                    <div className={`text-xs ${isSelected ? "text-[#FFF9F4]/80" : "text-[#50363A]/70"}`}>
                      {env.desc}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Budget / Vibe */}
          <div className="bg-[#FFF9F4] rounded-2xl p-6 md:p-8 border border-[#E7A5A4]/30 shadow-sm">
            <h3 className="font-serif text-xl text-[#641A2A] font-medium mb-4 flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-[#B51F3B]" />
              Date Style & Vibe
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {budgets.map((b) => {
                const isSelected = selectedBudget === b.id;
                return (
                  <button
                    key={b.id}
                    type="button"
                    onClick={() => onChangeBudget(b.id)}
                    className={`flex flex-col items-center justify-center p-4 rounded-xl border text-center transition-all duration-300 ${
                      isSelected
                        ? "bg-[#B51F3B] text-white border-[#B51F3B] shadow-sm"
                        : "bg-white/80 hover:bg-white text-[#50363A] border-[#E7A5A4]/40 hover:border-[#B51F3B]/50"
                    }`}
                  >
                    <span className="text-2xl mb-1.5">{b.icon}</span>
                    <span className="font-medium text-xs md:text-sm">{b.title}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Location Preference */}
          <div className="bg-[#FFF9F4] rounded-2xl p-6 md:p-8 border border-[#E7A5A4]/30 shadow-sm">
            <h3 className="font-serif text-xl text-[#641A2A] font-medium mb-4 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-[#B51F3B]" />
              Location Wish
            </h3>
            <div className="flex flex-wrap gap-2.5">
              {locations.map((loc) => {
                const isSelected = selectedLocation === loc.id;
                return (
                  <button
                    key={loc.id}
                    type="button"
                    onClick={() => onChangeLocation(loc.id)}
                    className={`px-4 py-2 rounded-full text-xs md:text-sm font-medium border transition-all duration-300 ${
                      isSelected
                        ? "bg-[#641A2A] text-white border-[#641A2A] shadow-sm"
                        : "bg-white/80 hover:bg-white text-[#50363A] border-[#E7A5A4]/40 hover:border-[#B51F3B]/50"
                    }`}
                  >
                    {loc.title}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Special Requests & Love Note */}
          <div className="bg-[#FFF9F4] rounded-2xl p-6 md:p-8 border border-[#E7A5A4]/30 shadow-sm">
            <h3 className="font-serif text-xl text-[#641A2A] font-medium mb-2 flex items-center gap-2">
              <Feather className="w-4 h-4 text-[#B51F3B]" />
              Special Requests or Secret Wishes
            </h3>
            <p className="text-xs text-[#50363A]/70 mb-4">
              Have a favorite flower, a sweet dessert you're craving, or a song you want to hear? Write it here!
            </p>
            <textarea
              value={specialNotes}
              onChange={(e) => onChangeNotes(e.target.value)}
              placeholder="e.g. Can we get Belgian chocolate ice cream after? And I love white lilies..."
              rows={3}
              className="w-full bg-white/90 border border-[#E7A5A4]/50 focus:border-[#B51F3B] focus:ring-2 focus:ring-[#B51F3B]/10 rounded-xl p-3.5 text-sm text-[#50363A] placeholder-[#50363A]/40 outline-none resize-none transition-all"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
