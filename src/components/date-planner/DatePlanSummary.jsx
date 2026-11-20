"use client";

import React from "react";
import { Calendar, Clock, Sparkles, Utensils, Film, Heart, Compass, Send } from "lucide-react";
import { triggerLoveAndCrackersBlast } from "./LoveFirecrackerBlast";

export default function DatePlanSummary({
  plannerState,
  data,
  onConfirmDate,
  onReset,
}) {
  const {
    date,
    timePeriod,
    timeSlot,
    activities = [],
    cuisines = [],
    dietary = [],
    movieGenres = [],
    movieVenue,
    environment,
    budget,
    location,
    notes,
  } = plannerState;

  // Helpers to resolve titles
  const formattedDate = !date
    ? null
    : isNaN(new Date(date).getTime())
    ? date
    : new Date(date).toLocaleDateString("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
        year: "numeric",
      });

  const resolvedPeriod = data.timePeriods?.find((p) => p.id === timePeriod);
  const resolvedEnv = data.environments?.find((e) => e.id === environment);
  const resolvedBudget = data.budgets?.find((b) => b.id === budget);
  const resolvedLoc = data.locations?.find((l) => l.id === location);
  const resolvedVenue = data.movieVenues?.find((v) => v.id === movieVenue);

  const selectedActivitiesList = (data.activities || []).filter((a) =>
    activities.includes(a.id)
  );

  const selectedCuisinesList = (data.cuisines || []).filter((c) =>
    cuisines.includes(c.id)
  );

  const selectedMovieGenresList = (data.movieGenres || []).filter((g) =>
    movieGenres.includes(g.id)
  );

  // Check completion score
  let completedSteps = 0;
  if (date) completedSteps++;
  if (timePeriod || timeSlot) completedSteps++;
  if (activities.length > 0) completedSteps++;
  if (cuisines.length > 0) completedSteps++;
  if (environment || budget || location) completedSteps++;

  const isCompleteEnough = completedSteps >= 2;

  return (
    <section id="summary" className="py-16 px-4 bg-[#FFF2ED]">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#B51F3B]/10 text-[#B51F3B] text-xs tracking-widest uppercase font-medium mb-2">
            <Heart className="w-3.5 h-3.5 fill-[#B51F3B]" />
            Live Itinerary
          </span>
          <h2 className="font-serif text-3xl md:text-4xl text-[#641A2A] font-semibold">
            Our Date Blueprint
          </h2>
          <p className="text-[#50363A]/70 text-sm mt-1">
            Every choice you make shapes our unforgettable rendezvous.
          </p>
        </div>

        {/* Paper Invitation Card */}
        <div className="relative bg-[#FFF9F4] rounded-3xl p-6 md:p-10 border border-[#E7A5A4]/40 shadow-xl overflow-hidden">
          {/* Subtle Decorative Stamp / Seal */}
          <div className="absolute top-5 right-5 w-14 h-14 rounded-full bg-[#641A2A]/10 border border-[#641A2A]/20 flex items-center justify-center rotate-12 pointer-events-none">
            <div className="text-[9px] font-serif text-[#641A2A] text-center uppercase tracking-widest leading-tight font-bold">
              You Are Mine<br />Date
            </div>
          </div>

          {/* Heading */}
          <div className="border-b border-[#E7A5A4]/30 pb-5 mb-6">
            <span className="text-xs uppercase tracking-[0.2em] text-[#B51F3B] font-semibold">
              Planned with Love
            </span>
            <h3 className="font-serif text-2xl md:text-3xl text-[#641A2A] font-semibold mt-1">
              {data.recipientName || "My Favorite Person"} &amp; {data.senderName || "Me"}
            </h3>
            <p className="text-xs text-[#50363A]/60 mt-1">
              Progress: {completedSteps} of 5 preferences selected
            </p>
          </div>

          {/* List of Details */}
          <div className="space-y-4 text-sm text-[#50363A]">
            {/* 1. Date */}
            <div className="flex items-start gap-3.5 p-3 rounded-xl bg-white/70 border border-[#E7A5A4]/20">
              <Calendar className="w-5 h-5 text-[#B51F3B] shrink-0 mt-0.5" />
              <div>
                <span className="block text-xs uppercase tracking-wider text-[#641A2A]/70 font-semibold">
                  Date
                </span>
                <span className="font-medium text-[#641A2A]">
                  {formattedDate || "Choose a date on the calendar above"}
                </span>
              </div>
            </div>

            {/* 2. Time */}
            <div className="flex items-start gap-3.5 p-3 rounded-xl bg-white/70 border border-[#E7A5A4]/20">
              <Clock className="w-5 h-5 text-[#B51F3B] shrink-0 mt-0.5" />
              <div>
                <span className="block text-xs uppercase tracking-wider text-[#641A2A]/70 font-semibold">
                  Time of Day &amp; Slot
                </span>
                <span className="font-medium text-[#641A2A]">
                  {resolvedPeriod ? `${resolvedPeriod.title} ` : "Anytime"}
                  {timeSlot ? `(${timeSlot})` : ""}
                  {!resolvedPeriod && !timeSlot && "Pick your favored timing"}
                </span>
              </div>
            </div>

            {/* 3. Activities */}
            <div className="flex items-start gap-3.5 p-3 rounded-xl bg-white/70 border border-[#E7A5A4]/20">
              <Sparkles className="w-5 h-5 text-[#B51F3B] shrink-0 mt-0.5" />
              <div>
                <span className="block text-xs uppercase tracking-wider text-[#641A2A]/70 font-semibold">
                  What We'll Do
                </span>
                {selectedActivitiesList.length > 0 ? (
                  <div className="flex flex-wrap gap-1.5 mt-1">
                    {selectedActivitiesList.map((a) => (
                      <span
                        key={a.id}
                        className="px-2.5 py-1 rounded-full bg-[#B51F3B]/10 text-[#B51F3B] text-xs font-medium"
                      >
                        {a.title}
                      </span>
                    ))}
                  </div>
                ) : (
                  <span className="text-[#50363A]/60 italic text-xs">
                    No activities selected yet
                  </span>
                )}
              </div>
            </div>

            {/* 4. Food & Cuisine (if chosen) */}
            {selectedCuisinesList.length > 0 && (
              <div className="flex items-start gap-3.5 p-3 rounded-xl bg-white/70 border border-[#E7A5A4]/20">
                <Utensils className="w-5 h-5 text-[#B51F3B] shrink-0 mt-0.5" />
                <div>
                  <span className="block text-xs uppercase tracking-wider text-[#641A2A]/70 font-semibold">
                    Cuisines &amp; Treats
                  </span>
                  <div className="flex flex-wrap gap-1.5 mt-1">
                    {selectedCuisinesList.map((c) => (
                      <span
                        key={c.id}
                        className="px-2.5 py-1 rounded-full bg-[#641A2A]/10 text-[#641A2A] text-xs font-medium"
                      >
                        {c.emoji} {c.name}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* 5. Movie details (if movie selected) */}
            {activities.includes("movie") && (selectedMovieGenresList.length > 0 || resolvedVenue) && (
              <div className="flex items-start gap-3.5 p-3 rounded-xl bg-white/70 border border-[#E7A5A4]/20">
                <Film className="w-5 h-5 text-[#B51F3B] shrink-0 mt-0.5" />
                <div>
                  <span className="block text-xs uppercase tracking-wider text-[#641A2A]/70 font-semibold">
                    Movie Choices
                  </span>
                  <span className="text-xs text-[#50363A]">
                    {selectedMovieGenresList.map((g) => g.title).join(", ")}
                    {resolvedVenue ? ` • ${resolvedVenue.title}` : ""}
                  </span>
                </div>
              </div>
            )}

            {/* 6. Setting / Location */}
            {(resolvedEnv || resolvedBudget || resolvedLoc) && (
              <div className="flex items-start gap-3.5 p-3 rounded-xl bg-white/70 border border-[#E7A5A4]/20">
                <Compass className="w-5 h-5 text-[#B51F3B] shrink-0 mt-0.5" />
                <div>
                  <span className="block text-xs uppercase tracking-wider text-[#641A2A]/70 font-semibold">
                    Atmosphere &amp; Style
                  </span>
                  <div className="flex flex-wrap gap-2 text-xs font-medium text-[#641A2A] mt-1">
                    {resolvedEnv && <span>• {resolvedEnv.title}</span>}
                    {resolvedBudget && <span>• {resolvedBudget.title}</span>}
                    {resolvedLoc && <span>• {resolvedLoc.title}</span>}
                  </div>
                </div>
              </div>
            )}

            {/* 7. Special Notes */}
            {notes && notes.trim().length > 0 && (
              <div className="p-3.5 rounded-xl bg-[#FFF2ED] border border-[#E7A5A4]/40 text-xs italic text-[#50363A]">
                &ldquo;{notes}&rdquo;
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="mt-8 pt-6 border-t border-[#E7A5A4]/30 flex flex-col sm:flex-row gap-3">
            <button
              type="button"
              onClick={() => {
                triggerLoveAndCrackersBlast();
                onConfirmDate();
              }}
              disabled={!isCompleteEnough}
              className={`flex-1 flex items-center justify-center gap-2 py-3.5 px-4 sm:px-6 rounded-full font-serif font-bold text-xs sm:text-sm transition-all shadow-md ${
                isCompleteEnough
                  ? "bg-gradient-to-r from-[#B51F3B] to-[#641A2A] hover:opacity-95 text-white hover:scale-[1.02] cursor-pointer"
                  : "bg-[#B51F3B]/40 text-white/70 cursor-not-allowed"
              }`}
            >
              <Heart className="w-4 h-4 fill-white shrink-0" />
              <span>Seal Choices &amp; Send to {data.senderName || "Aarav"} ♡</span>
            </button>

            <button
              type="button"
              onClick={onReset}
              className="py-3 px-5 rounded-full border border-[#E7A5A4]/60 text-xs font-medium text-[#50363A] hover:bg-white/60 transition-all text-center cursor-pointer"
            >
              Reset Choices
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
