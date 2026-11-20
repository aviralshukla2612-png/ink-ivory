'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Sun, SunMedium, Sunset, Moon, Clock } from 'lucide-react';

export default function TimeSelector({ timePeriods = [], selectedPeriod, selectedSlot, onSelectPeriod, onSelectSlot }) {
  const iconMap = {
    Sun,
    SunMedium,
    Sunset,
    Moon,
  };

  const activePeriodObj = timePeriods.find((p) => p.id === selectedPeriod) || timePeriods[2]; // Default evening

  return (
    <div id="time" className="p-6 sm:p-8 rounded-3xl bg-[#FFF9F4]/90 border border-[#F3D0C9] shadow-sm select-none">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-[#F3D0C9]/60">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-[#FFF2ED] border border-[#F3D0C9] flex items-center justify-center text-[#B51F3B]">
            <Clock className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-lg sm:text-xl font-serif font-bold text-[#45121F]">
              2. Select Our Time ♡
            </h3>
            <p className="text-xs text-[#50363A]/75 font-sans">
              Choose the vibe: sunrise warmth, afternoon glow, golden sunset, or starry night
            </p>
          </div>
        </div>
      </div>

      {/* 4 Time Period Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
        {timePeriods.map((period) => {
          const Icon = iconMap[period.icon] || Sunset;
          const isSelected = selectedPeriod === period.id;

          return (
            <motion.div
              key={period.id}
              whileHover={{ y: -3 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                onSelectPeriod(period.id);
                if (period.slots && period.slots.length > 0) {
                  onSelectSlot(period.slots[0]);
                }
              }}
              className={`p-4 rounded-2xl border text-left cursor-pointer transition-all duration-300 flex flex-col justify-between ${
                isSelected
                  ? 'bg-gradient-to-tr from-[#FFF2ED] to-[#F9E4DE] border-[#B51F3B] shadow-md ring-1 ring-[#B51F3B]'
                  : 'bg-white/80 border-[#F3D0C9]/70 hover:bg-white hover:border-[#E7A5A4]'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center transition-colors ${
                    isSelected
                      ? 'bg-[#B51F3B] text-white shadow-sm'
                      : 'bg-[#FFF2ED] text-[#B51F3B] border border-[#F3D0C9]'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </div>
                {isSelected && (
                  <span className="text-[10px] font-sans font-bold uppercase tracking-wider text-[#B51F3B] px-2 py-0.5 rounded-full bg-[#B51F3B]/10">
                    Active
                  </span>
                )}
              </div>

              <div>
                <h4 className="font-serif font-bold text-base text-[#45121F]">
                  {period.title}
                </h4>
                <p className="text-[11px] text-[#50363A]/75 font-sans mt-0.5 line-clamp-2 leading-relaxed">
                  {period.subtitle}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Specific Time Slot Pills for Active Period */}
      {activePeriodObj && activePeriodObj.slots && (
        <div className="pt-4 border-t border-[#F3D0C9]/50">
          <span className="text-xs font-sans font-semibold uppercase tracking-wider text-[#641A2A] block mb-3">
            Suggested Time Windows ({activePeriodObj.title}):
          </span>
          <div className="flex flex-wrap gap-2.5">
            {activePeriodObj.slots.map((slot) => {
              const isSlotSelected = selectedSlot === slot;
              return (
                <button
                  key={slot}
                  onClick={() => onSelectSlot(slot)}
                  className={`px-4 py-2 rounded-full text-xs font-sans font-medium transition-all cursor-pointer ${
                    isSlotSelected
                      ? 'bg-[#B51F3B] text-white shadow-sm font-semibold scale-105'
                      : 'bg-white border border-[#F3D0C9] text-[#45121F] hover:bg-[#FFF2ED]'
                  }`}
                >
                  {slot}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
