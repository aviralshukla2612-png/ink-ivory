'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Film, Utensils, Coffee, Footprints, Gamepad2, Sparkles, Check, Heart } from 'lucide-react';

export default function ActivitySelector({ activities = [], selectedActivities = [], onToggleActivity }) {
  const iconMap = {
    Film,
    Utensils,
    Coffee,
    Footprints,
    Gamepad2,
    Sparkles,
  };

  return (
    <div id="activity" className="p-6 sm:p-8 rounded-3xl bg-[#FFF9F4]/90 border border-[#F3D0C9] shadow-sm select-none">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-[#F3D0C9]/60">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-[#FFF2ED] border border-[#F3D0C9] flex items-center justify-center text-[#B51F3B]">
            <Heart className="w-4 h-4 fill-current" />
          </div>
          <div>
            <h3 className="text-lg sm:text-xl font-serif font-bold text-[#45121F]">
              3. What Would You Like To Do? ♡
            </h3>
            <p className="text-xs text-[#50363A]/75 font-sans">
              Select one or combine multiple activities you&apos;d adore experiencing
            </p>
          </div>
        </div>
      </div>

      {/* Activities Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {activities.map((act) => {
          const Icon = iconMap[act.icon] || Sparkles;
          const isSelected = selectedActivities.includes(act.id);

          return (
            <motion.div
              key={act.id}
              whileHover={{ y: -3, scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onToggleActivity(act.id)}
              className={`p-5 rounded-2xl border text-left cursor-pointer transition-all duration-300 relative flex flex-col justify-between ${
                isSelected
                  ? 'bg-gradient-to-tr from-[#FFF2ED] via-white to-[#F9E4DE] border-[#B51F3B] shadow-md ring-1 ring-[#B51F3B]'
                  : 'bg-white/80 border-[#F3D0C9]/70 hover:bg-white hover:border-[#E7A5A4]'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
                    isSelected
                      ? 'bg-[#B51F3B] text-white shadow-sm'
                      : 'bg-[#FFF2ED] text-[#B51F3B] border border-[#F3D0C9]'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                </div>

                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center transition-all ${
                    isSelected
                      ? 'bg-[#B51F3B] text-white scale-110 shadow-xs'
                      : 'border border-[#F3D0C9] text-transparent'
                  }`}
                >
                  <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                </div>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-serif font-bold text-base text-[#45121F]">
                    {act.title}
                  </h4>
                  {act.tag && (
                    <span className="text-[10px] font-sans font-semibold text-[#B51F3B] px-2 py-0.5 rounded-full bg-[#B51F3B]/10">
                      {act.tag}
                    </span>
                  )}
                </div>
                <p className="text-xs text-[#50363A]/75 font-sans leading-relaxed">
                  {act.desc}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
