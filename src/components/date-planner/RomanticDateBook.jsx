"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar as CalendarIcon,
  Clock,
  Heart,
  Sparkles,
  Utensils,
  ChevronLeft,
  ChevronRight,
  Sun,
  SunMedium,
  Sunset,
  Moon,
  Film,
  Coffee,
  Footprints,
  Gamepad2,
  Check,
  Compass,
  Feather,
} from "lucide-react";
import { triggerLoveAndCrackersBlast } from "./LoveFirecrackerBlast";

export default function RomanticDateBook({
  plannerState,
  data,
  onSelectDate,
  onSelectPeriod,
  onSelectSlot,
  onToggleActivity,
  onToggleCuisine,
  onSelectEnvironment,
  onChangeNotes,
  onReviewPlan,
}) {
  const [activeChapter, setActiveChapter] = useState(1);

  // Calendar state for Chapter 1
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  const daysOfWeek = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
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
    const options = { weekday: "long", day: "numeric", month: "long", year: "numeric" };
    onSelectDate(chosen.toLocaleDateString("en-US", options));
    // Automatically advance to Chapter 2 ("The Hour") smoothly
    setTimeout(() => {
      setActiveChapter(2);
      const bookEl = document.getElementById("planner-book");
      if (bookEl) {
        bookEl.scrollIntoView({ behavior: "smooth", block: "nearest" });
      }
    }, 320);
  };

  const handleTimePeriodClick = (p) => {
    onSelectPeriod(p.id);
    if (p.slots?.[0]) onSelectSlot(p.slots[0]);
    // Automatically advance to Chapter 3 ("Activities")
    setTimeout(() => {
      setActiveChapter(3);
      const bookEl = document.getElementById("planner-book");
      if (bookEl) {
        bookEl.scrollIntoView({ behavior: "smooth", block: "nearest" });
      }
    }, 320);
  };

  const handleSlotClick = (slot) => {
    onSelectSlot(slot);
    // Automatically advance to Chapter 3 ("Activities")
    setTimeout(() => {
      setActiveChapter(3);
      const bookEl = document.getElementById("planner-book");
      if (bookEl) {
        bookEl.scrollIntoView({ behavior: "smooth", block: "nearest" });
      }
    }, 320);
  };

  const handleActivityClick = (actId) => {
    onToggleActivity(actId);
    // Automatically advance to Chapter 4 ("Feast")
    setTimeout(() => {
      setActiveChapter(4);
    }, 450);
  };

  const handleCuisineClick = (cId) => {
    onToggleCuisine(cId);
    // Automatically advance to Chapter 5 ("Setting & Secret Wish")
    setTimeout(() => {
      setActiveChapter(5);
    }, 450);
  };

  const periodIcons = {
    morning: Sun,
    afternoon: SunMedium,
    evening: Sunset,
    night: Moon,
  };

  const activityIcons = {
    movie: Film,
    dinner: Utensils,
    cafe: Coffee,
    walk: Footprints,
    games: Gamepad2,
    surprise: Sparkles,
  };

  const currentPeriodObj =
    data.timePeriods?.find((p) => p.id === plannerState.timePeriod) || data.timePeriods?.[2];

  const chapters = [
    { num: 1, title: "Our Day", icon: "📅" },
    { num: 2, title: "The Hour", icon: "⏰" },
    { num: 3, title: "Activities", icon: "✨" },
    { num: 4, title: "Feast", icon: "🍷" },
    { num: 5, title: "Secret Wish", icon: "💌" },
  ];

  return (
    <div id="planner-book" className="max-w-2xl w-full mx-auto px-3 sm:px-6 py-4 sm:py-6 pb-16 sm:pb-24">
      {/* Intimate Stationery Book Container */}
      <div className="relative bg-[#FFF9F4] rounded-[24px] sm:rounded-[36px] border-2 border-[#E7A5A4]/40 p-3.5 sm:p-6 md:p-8 pb-6 sm:pb-8 shadow-[0_25px_70px_-15px_rgba(100,26,42,0.12)] overflow-hidden">
        {/* Subtle Decorative Golden Border Accent */}
        <div className="absolute inset-2 sm:inset-3 border border-[#E7A5A4]/30 rounded-[20px] sm:rounded-[26px] pointer-events-none" />

        {/* Top Romantic Chapter Tabs */}
        <div className="relative z-10 flex items-center justify-between gap-1 overflow-x-auto scrollbar-none mb-4 sm:mb-6 pb-2.5 sm:pb-4 border-b border-[#E7A5A4]/30">
          {chapters.map((ch) => {
            const isActive = activeChapter === ch.num;
            return (
              <button
                key={ch.num}
                type="button"
                onClick={() => setActiveChapter(ch.num)}
                className={`flex-1 min-w-[58px] sm:min-w-0 flex flex-col items-center py-1.5 sm:py-2 px-1 rounded-2xl transition-all duration-300 cursor-pointer ${
                  isActive
                    ? "bg-[#641A2A] text-white shadow-md scale-105"
                    : "text-[#50363A]/70 hover:bg-[#FFF2ED] hover:text-[#641A2A]"
                }`}
              >
                <span className="text-base sm:text-lg mb-0.5">{ch.icon}</span>
                <span className="text-[10px] sm:text-xs font-serif font-semibold tracking-wide">
                  {ch.title}
                </span>
                {isActive && (
                  <span className="w-1.5 h-1.5 rounded-full bg-[#B51F3B] mt-1" />
                )}
              </button>
            );
          })}
        </div>

        {/* Dynamic Chapter Content with Silky Transitions */}
        <div className="relative z-10 min-h-[350px] flex flex-col justify-between">
          <AnimatePresence mode="wait">
            {/* CHAPTER 1: THE DATE */}
            {activeChapter === 1 && (
              <motion.div
                key="chapter-1"
                initial={{ opacity: 0, x: 12 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -12 }}
                transition={{ duration: 0.35 }}
                className="space-y-4"
              >
                <div className="text-center">
                  <span className="text-[11px] uppercase tracking-[0.25em] text-[#B51F3B] font-semibold">
                    Chapter I &bull; Setting The Day
                  </span>
                  <h3 className="font-serif text-2xl sm:text-3xl text-[#641A2A] font-bold mt-0.5">
                    When Shall We Meet? ♡
                  </h3>
                  <p className="text-xs sm:text-sm text-[#50363A]/70 mt-0.5 max-w-sm mx-auto">
                    Choose a day that feels easy and joyful for you, {data.recipientName || "My Love"}.
                  </p>
                </div>

                {/* Compact Mini Calendar */}
                <div className="w-full max-w-[320px] sm:max-w-sm mx-auto bg-white/85 rounded-2xl p-2.5 sm:p-4 border border-[#E7A5A4]/40 shadow-xs">
                  <div className="flex items-center justify-between mb-2 px-1">
                    <button
                      type="button"
                      onClick={handlePrevMonth}
                      disabled={
                        currentMonth === today.getMonth() && currentYear === today.getFullYear()
                      }
                      className="p-1 rounded-full text-[#641A2A] hover:bg-[#FFF2ED] disabled:opacity-20 cursor-pointer"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <span className="font-serif font-bold text-sm sm:text-base text-[#641A2A]">
                      {monthNames[currentMonth]} {currentYear}
                    </span>
                    <button
                      type="button"
                      onClick={handleNextMonth}
                      className="p-1 rounded-full text-[#641A2A] hover:bg-[#FFF2ED] cursor-pointer"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="grid grid-cols-7 gap-1 text-center mb-1">
                    {daysOfWeek.map((d, i) => (
                      <span
                        key={d}
                        className={`text-[10px] font-semibold uppercase ${
                          i === 0 || i === 6 ? "text-[#B51F3B]" : "text-[#50363A]/50"
                        }`}
                      >
                        {d}
                      </span>
                    ))}
                  </div>

                  <div className="grid grid-cols-7 gap-1 text-center">
                    {Array.from({ length: firstDayIndex }).map((_, i) => (
                      <div key={`empty-${i}`} className="h-6 sm:h-7" />
                    ))}
                    {Array.from({ length: daysInMonth }).map((_, i) => {
                      const dayNum = i + 1;
                      const thisDate = new Date(currentYear, currentMonth, dayNum);
                      const isPast =
                        thisDate < new Date(today.getFullYear(), today.getMonth(), today.getDate());
                      const dateStr = thisDate.toLocaleDateString("en-US", {
                        weekday: "long",
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      });
                      const isSelected = plannerState.date === dateStr;

                      return (
                        <button
                          key={dayNum}
                          type="button"
                          disabled={isPast}
                          onClick={() => handleDateClick(dayNum)}
                          className={`h-6 w-6 sm:h-7 sm:w-7 mx-auto rounded-full text-[11px] sm:text-xs font-medium flex items-center justify-center transition-all ${
                            isSelected
                              ? "bg-[#B51F3B] text-white font-bold shadow-sm scale-110"
                              : isPast
                              ? "text-gray-300 cursor-not-allowed"
                              : "text-[#50363A] hover:bg-[#FFF2ED] hover:text-[#B51F3B] cursor-pointer"
                          }`}
                        >
                          {dayNum}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {plannerState.date && (
                  <div className="text-center">
                    <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#B51F3B]/10 text-[#B51F3B] text-xs font-serif font-bold">
                      <Heart className="w-3.5 h-3.5 fill-[#B51F3B]" />
                      {plannerState.date}
                    </span>
                  </div>
                )}
              </motion.div>
            )}

            {/* CHAPTER 2: THE HOUR */}
            {activeChapter === 2 && (
              <motion.div
                key="chapter-2"
                initial={{ opacity: 0, x: 12 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -12 }}
                transition={{ duration: 0.35 }}
                className="space-y-6"
              >
                <div className="text-center">
                  <span className="text-[11px] uppercase tracking-[0.25em] text-[#B51F3B] font-semibold">
                    Chapter II &bull; Golden Hour
                  </span>
                  <h3 className="font-serif text-2xl sm:text-3xl text-[#641A2A] font-bold mt-1">
                    The Mood &amp; Timing 🕯️
                  </h3>
                  <p className="text-xs sm:text-sm text-[#50363A]/70 mt-1 max-w-sm mx-auto">
                    What time of day makes you feel warmest and most relaxed?
                  </p>
                </div>

                {/* 4 Time Cards */}
                <div className="grid grid-cols-2 gap-3 max-w-md mx-auto">
                  {data.timePeriods?.map((p) => {
                    const Icon = periodIcons[p.id] || Sunset;
                    const isSelected = plannerState.timePeriod === p.id;
                    return (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => handleTimePeriodClick(p)}
                        className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                          isSelected
                            ? "bg-[#641A2A] text-white border-[#641A2A] shadow-md scale-[1.02]"
                            : "bg-white/80 border-[#E7A5A4]/40 hover:bg-white text-[#50363A]"
                        }`}
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <Icon className={`w-4 h-4 ${isSelected ? "text-amber-200" : "text-[#B51F3B]"}`} />
                          <span className="font-serif font-bold text-sm">{p.title}</span>
                        </div>
                        <p className={`text-[10px] leading-tight ${isSelected ? "text-white/80" : "text-[#50363A]/60"}`}>
                          {p.subtitle}
                        </p>
                      </button>
                    );
                  })}
                </div>

                {/* Time Slots Pills */}
                {currentPeriodObj?.slots && (
                  <div className="pt-2 text-center">
                    <span className="text-[11px] uppercase font-semibold text-[#641A2A]/70 tracking-wider block mb-2">
                      Specific Window:
                    </span>
                    <div className="flex flex-wrap justify-center gap-2">
                      {currentPeriodObj.slots.map((slot) => {
                        const isSlotSelected = plannerState.timeSlot === slot;
                        return (
                          <button
                            key={slot}
                            type="button"
                            onClick={() => handleSlotClick(slot)}
                            className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all cursor-pointer ${
                              isSlotSelected
                                ? "bg-[#B51F3B] text-white border-[#B51F3B] shadow-xs"
                                : "bg-white/70 border-[#E7A5A4]/50 text-[#50363A] hover:bg-white"
                            }`}
                          >
                            {slot}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </motion.div>
            )}

            {/* CHAPTER 3: WHAT WOULD MAKE YOU SMILE */}
            {activeChapter === 3 && (
              <motion.div
                key="chapter-3"
                initial={{ opacity: 0, x: 12 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -12 }}
                transition={{ duration: 0.35 }}
                className="space-y-6"
              >
                <div className="text-center">
                  <span className="text-[11px] uppercase tracking-[0.25em] text-[#B51F3B] font-semibold">
                    Chapter III &bull; What We&apos;ll Do
                  </span>
                  <h3 className="font-serif text-2xl sm:text-3xl text-[#641A2A] font-bold mt-1">
                    What Would Make You Smile? ✨
                  </h3>
                  <p className="text-xs sm:text-sm text-[#50363A]/70 mt-1 max-w-sm mx-auto">
                    Pick whatever you&apos;d love to do together. Select one or combine them!
                  </p>
                </div>

                {/* Compact Activity Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 sm:gap-3">
                  {data.activities?.map((act) => {
                    const Icon = activityIcons[act.id] || Sparkles;
                    const isSelected = plannerState.activities?.includes(act.id);
                    return (
                      <button
                        key={act.id}
                        type="button"
                        onClick={() => handleActivityClick(act.id)}
                        className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                          isSelected
                            ? "bg-gradient-to-tr from-[#641A2A] to-[#872236] text-white border-[#641A2A] shadow-md scale-[1.02]"
                            : "bg-white/80 border-[#E7A5A4]/40 hover:bg-white text-[#50363A]"
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${isSelected ? "bg-white/20 text-white" : "bg-[#FFF2ED] text-[#B51F3B]"}`}>
                            <Icon className="w-3.5 h-3.5" />
                          </div>
                          {isSelected && <Check className="w-3.5 h-3.5 text-amber-200" />}
                        </div>
                        <div>
                          <span className="font-serif font-bold text-xs sm:text-sm block">
                            {act.title}
                          </span>
                          <span className={`text-[10px] line-clamp-1 mt-0.5 ${isSelected ? "text-white/80" : "text-[#50363A]/60"}`}>
                            {act.tag}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Smooth Continue Pill */}
                {plannerState.activities?.length > 0 && (
                  <div className="flex justify-center pt-2">
                    <button
                      type="button"
                      onClick={() => setActiveChapter(4)}
                      className="px-6 py-2.5 rounded-full bg-gradient-to-r from-[#B51F3B] to-[#641A2A] text-white text-xs font-serif font-bold shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer inline-flex items-center gap-2"
                    >
                      <span>Continue to Feast 🍷</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </motion.div>
            )}

            {/* CHAPTER 4: A FEAST FOR TWO */}
            {activeChapter === 4 && (
              <motion.div
                key="chapter-4"
                initial={{ opacity: 0, x: 12 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -12 }}
                transition={{ duration: 0.35 }}
                className="space-y-6"
              >
                <div className="text-center">
                  <span className="text-[11px] uppercase tracking-[0.25em] text-[#B51F3B] font-semibold">
                    Chapter IV &bull; A Feast For Two
                  </span>
                  <h3 className="font-serif text-2xl sm:text-3xl text-[#641A2A] font-bold mt-1">
                    What Are You Craving? 🍷
                  </h3>
                  <p className="text-xs sm:text-sm text-[#50363A]/70 mt-1 max-w-sm mx-auto">
                    Delicious bites, warm treats, or sweet desserts for our table.
                  </p>
                </div>

                {/* Cuisine Capsules */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-2.5">
                  {data.cuisines?.map((c) => {
                    const isSelected = plannerState.cuisines?.includes(c.id);
                    return (
                      <button
                        key={c.id}
                        type="button"
                        onClick={() => handleCuisineClick(c.id)}
                        className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex items-center gap-2.5 ${
                          isSelected
                            ? "bg-[#641A2A] text-white border-[#641A2A] shadow-sm scale-[1.02]"
                            : "bg-white/80 border-[#E7A5A4]/40 hover:bg-white text-[#50363A]"
                        }`}
                      >
                        <span className="text-xl shrink-0">{c.emoji}</span>
                        <div className="overflow-hidden">
                          <span className="font-serif font-bold text-xs block truncate">
                            {c.name}
                          </span>
                          <span className={`text-[9px] block truncate ${isSelected ? "text-white/70" : "text-[#50363A]/50"}`}>
                            {c.desc}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Smooth Continue Pill */}
                {plannerState.cuisines?.length > 0 && (
                  <div className="flex justify-center pt-2">
                    <button
                      type="button"
                      onClick={() => setActiveChapter(5)}
                      className="px-6 py-2.5 rounded-full bg-gradient-to-r from-[#B51F3B] to-[#641A2A] text-white text-xs font-serif font-bold shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer inline-flex items-center gap-2"
                    >
                      <span>Continue to Setting &amp; Secret Wish 💌</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </motion.div>
            )}

            {/* CHAPTER 5: ATMOSPHERE & SECRET WISH */}
            {activeChapter === 5 && (
              <motion.div
                key="chapter-5"
                initial={{ opacity: 0, x: 12 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -12 }}
                transition={{ duration: 0.35 }}
                className="space-y-5"
              >
                <div className="text-center">
                  <span className="text-[11px] uppercase tracking-[0.25em] text-[#B51F3B] font-semibold">
                    Chapter V &bull; The Backdrop
                  </span>
                  <h3 className="font-serif text-2xl sm:text-3xl text-[#641A2A] font-bold mt-1">
                    Setting &amp; Secret Wishes 💌
                  </h3>
                  <p className="text-xs sm:text-sm text-[#50363A]/70 mt-1 max-w-sm mx-auto">
                    Tell me the setting you fancy, and whisper any sweet request for our date.
                  </p>
                </div>

                {/* Setting Pills */}
                <div className="flex flex-wrap justify-center gap-2">
                  {data.environments?.map((env) => {
                    const isSelected = plannerState.environment === env.id;
                    return (
                      <button
                        key={env.id}
                        type="button"
                        onClick={() => onSelectEnvironment(env.id)}
                        className={`px-4 py-2 rounded-full text-xs font-serif font-semibold border transition-all cursor-pointer ${
                          isSelected
                            ? "bg-[#641A2A] text-white border-[#641A2A] shadow-xs"
                            : "bg-white/80 border-[#E7A5A4]/50 text-[#50363A] hover:bg-white"
                        }`}
                      >
                        {env.title}
                      </button>
                    );
                  })}
                </div>

                {/* Handwritten Secret Wish Box */}
                <div className="bg-white/90 rounded-2xl p-4 border border-[#E7A5A4]/40 shadow-xs">
                  <div className="flex items-center gap-1.5 text-xs font-serif font-bold text-[#641A2A] mb-1.5">
                    <Feather className="w-3.5 h-3.5 text-[#B51F3B]" />
                    <span>A Sweet Wish For Me? (Optional)</span>
                  </div>
                  <textarea
                    value={plannerState.notes || ""}
                    onChange={(e) => onChangeNotes(e.target.value)}
                    placeholder="e.g. Can we get chocolate fondue after? And play our favorite song..."
                    rows={2}
                    className="w-full bg-[#FFF9F4] border border-[#E7A5A4]/40 focus:border-[#B51F3B] rounded-xl p-3 text-xs text-[#50363A] placeholder-[#50363A]/40 outline-none resize-none transition-all font-serif italic"
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Bottom Navigation Ribbon */}
          <div className="mt-4 sm:mt-6 pt-3 sm:pt-4 border-t border-[#E7A5A4]/30 flex items-center justify-between gap-2 sm:gap-3">
            {activeChapter > 1 ? (
              <button
                type="button"
                onClick={() => {
                  setActiveChapter((c) => Math.max(1, c - 1));
                  const bookEl = document.getElementById("planner-book");
                  if (bookEl) bookEl.scrollIntoView({ behavior: "smooth", block: "nearest" });
                }}
                className="px-3.5 sm:px-4 py-2 rounded-full border border-[#E7A5A4]/60 text-xs font-medium text-[#50363A] hover:bg-white transition-all cursor-pointer flex items-center gap-1 shadow-2xs"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
                Previous
              </button>
            ) : (
              <div />
            )}

            {activeChapter < 5 ? (
              <button
                type="button"
                onClick={() => {
                  setActiveChapter((c) => Math.min(5, c + 1));
                  const bookEl = document.getElementById("planner-book");
                  if (bookEl) bookEl.scrollIntoView({ behavior: "smooth", block: "nearest" });
                }}
                className="px-5 sm:px-6 py-2.5 rounded-full bg-gradient-to-r from-[#B51F3B] to-[#641A2A] text-white text-xs font-medium shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer flex items-center gap-1.5 ml-auto"
              >
                <span>
                  {activeChapter === 1 && plannerState.date
                    ? "Next: The Hour ⏰"
                    : activeChapter === 2
                    ? "Next: Activities ✨"
                    : activeChapter === 3
                    ? "Next: Feast 🍷"
                    : activeChapter === 4
                    ? "Next: Secret Wish 💌"
                    : "Next Chapter"}
                </span>
                <Heart className="w-3.5 h-3.5 fill-white" />
              </button>
            ) : (
              <button
                type="button"
                onClick={() => {
                  triggerLoveAndCrackersBlast();
                  onReviewPlan();
                }}
                className="px-5 sm:px-8 py-2.5 sm:py-3 rounded-full bg-gradient-to-r from-[#B51F3B] via-[#D83A56] to-[#641A2A] text-white text-xs sm:text-sm font-serif font-bold shadow-[0_10px_25px_rgba(181,31,59,0.4)] hover:shadow-[0_15px_35px_rgba(181,31,59,0.5)] hover:scale-[1.03] active:scale-[0.98] transition-all cursor-pointer flex items-center gap-2 ml-auto"
              >
                <span>Seal My Choices &amp; Send to {data?.senderName || "Aarav"} ♡</span>
                <Sparkles className="w-4 h-4 text-amber-200 animate-pulse" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
