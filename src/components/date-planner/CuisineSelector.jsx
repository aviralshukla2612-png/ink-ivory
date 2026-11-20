'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Utensils, Check } from 'lucide-react';

export default function CuisineSelector({
  cuisines = [],
  selectedCuisines = [],
  onToggleCuisine,
}) {
  return (
    <div id="food" className="p-6 sm:p-8 rounded-3xl bg-[#FFF9F4]/90 border border-[#F3D0C9] shadow-sm select-none">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-[#F3D0C9]/60">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-[#FFF2ED] border border-[#F3D0C9] flex items-center justify-center text-[#B51F3B]">
            <Utensils className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-lg sm:text-xl font-serif font-bold text-[#45121F]">
              4. Choose Your Food &amp; Cuisine ♡
            </h3>
            <p className="text-xs text-[#50363A]/75 font-sans">
              What culinary flavors make your heart happy?
            </p>
          </div>
        </div>
      </div>

      {/* Cuisines Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-3 mb-6">
        {cuisines.map((c) => {
          const isSelected = selectedCuisines.includes(c.id);

          return (
            <motion.div
              key={c.id}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onToggleCuisine(c.id)}
              className={`p-3.5 sm:p-4 rounded-2xl border text-left cursor-pointer transition-all duration-300 flex items-center justify-between ${
                isSelected
                  ? 'bg-gradient-to-tr from-[#FFF2ED] to-[#F9E4DE] border-[#B51F3B] shadow-sm ring-1 ring-[#B51F3B]'
                  : 'bg-white/80 border-[#F3D0C9]/70 hover:bg-white hover:border-[#E7A5A4]'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <span className="text-xl sm:text-2xl">{c.emoji}</span>
                <div>
                  <h4 className="font-serif font-bold text-sm text-[#45121F]">
                    {c.name}
                  </h4>
                  <p className="text-[10px] text-[#50363A]/60 font-sans line-clamp-1">
                    {c.desc}
                  </p>
                </div>
              </div>

              {isSelected && (
                <div className="w-5 h-5 rounded-full bg-[#B51F3B] text-white flex items-center justify-center shadow-xs">
                  <Check className="w-3 h-3 stroke-[2.5]" />
                </div>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
