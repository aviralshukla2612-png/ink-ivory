'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Heart } from 'lucide-react';

export default function DatePickerSection({ selectedDate, onSelectDate }) {
  // Current viewing month/year
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  // Days in month calculation
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayIndex = new Date(currentYear, currentMonth, 1).getDay();

  const handlePrevMonth = () => {
    if (currentMonth === today.getMonth() && currentYear === today.getFullYear()) return;
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear((y) => y - 1);
    } else {
      setCurrentMonth((m) => m - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear((y) => y + 1);
    } else {
      setCurrentMonth((m) => m + 1);
    }
  };

  const handleDateClick = (day) => {
    const chosen = new Date(currentYear, currentMonth, day);
    // Format: e.g. "Saturday, 14 February 2026"
    const options = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' };
    const formatted = chosen.toLocaleDateString('en-US', options);
    onSelectDate(formatted);
  };

  return (
    <div id="date" className="p-6 sm:p-8 rounded-3xl bg-[#FFF9F4]/90 border border-[#F3D0C9] shadow-sm select-none">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-[#F3D0C9]/60">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-[#FFF2ED] border border-[#F3D0C9] flex items-center justify-center text-[#B51F3B]">
            <CalendarIcon className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-lg sm:text-xl font-serif font-bold text-[#45121F]">
              1. Choose Our Date ♡
            </h3>
            <p className="text-xs text-[#50363A]/75 font-sans">
              Pick the special day that suits your schedule best
            </p>
          </div>
        </div>

        {selectedDate && (
          <span className="hidden sm:inline-block px-3 py-1 rounded-full bg-[#B51F3B]/10 border border-[#B51F3B]/20 text-[#B51F3B] text-xs font-serif font-bold">
            {selectedDate}
          </span>
        )}
      </div>

      {/* Calendar Controls */}
      <div className="max-w-md mx-auto">
        <div className="flex items-center justify-between mb-4 px-2">
          <button
            onClick={handlePrevMonth}
            disabled={currentMonth === today.getMonth() && currentYear === today.getFullYear()}
            className="p-1.5 rounded-full hover:bg-[#F9E4DE] text-[#641A2A] disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <span className="font-serif font-bold text-base sm:text-lg text-[#45121F]">
            {monthNames[currentMonth]} {currentYear}
          </span>

          <button
            onClick={handleNextMonth}
            className="p-1.5 rounded-full hover:bg-[#F9E4DE] text-[#641A2A] transition-colors cursor-pointer"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Days of Week Header */}
        <div className="grid grid-cols-7 gap-1 text-center mb-2">
          {daysOfWeek.map((d, i) => (
            <span
              key={d}
              className={`text-[11px] font-sans font-semibold uppercase tracking-wider ${
                i === 0 || i === 6 ? 'text-[#B51F3B]/70' : 'text-[#50363A]/60'
              }`}
            >
              {d}
            </span>
          ))}
        </div>

        {/* Calendar Grid Cells */}
        <div className="grid grid-cols-7 gap-1 sm:gap-1.5 text-center">
          {/* Empty spacer cells */}
          {Array.from({ length: firstDayIndex }).map((_, i) => (
            <div key={`empty-${i}`} className="h-9 sm:h-10" />
          ))}

          {/* Days */}
          {Array.from({ length: daysInMonth }).map((_, i) => {
            const dayNum = i + 1;
            const thisDate = new Date(currentYear, currentMonth, dayNum);
            const isPast =
              thisDate < new Date(today.getFullYear(), today.getMonth(), today.getDate());
            
            // Check if matches selected
            const dateStr = thisDate.toLocaleDateString('en-US', {
              weekday: 'long',
              day: 'numeric',
              month: 'long',
              year: 'numeric',
            });
            const isSelected = selectedDate === dateStr;

            return (
              <motion.button
                key={`day-${dayNum}`}
                whileTap={{ scale: 0.94 }}
                disabled={isPast}
                onClick={() => handleDateClick(dayNum)}
                className={`h-9 sm:h-10 rounded-xl text-xs sm:text-sm font-sans font-medium flex items-center justify-center transition-all cursor-pointer relative ${
                  isSelected
                    ? 'bg-[#B51F3B] text-white shadow-md font-bold'
                    : isPast
                    ? 'text-[#50363A]/25 cursor-not-allowed'
                    : 'text-[#45121F] hover:bg-[#F3D0C9]/40'
                }`}
              >
                {dayNum}
                {isSelected && (
                  <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-[#E7A5A4] border border-white" />
                )}
              </motion.button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
