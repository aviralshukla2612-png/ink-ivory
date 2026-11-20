"use client";

import React, { useState, useEffect, useRef } from "react";
import { AnimatePresence } from "framer-motion";
import { datePlannerData as defaultData } from "@/data/datePlannerData";
import { RosePetals } from "@/components/common/RosePetals";

// Components
import DatePlannerOpening from "@/components/date-planner/DatePlannerOpening";
import DatePlannerHeader from "@/components/date-planner/DatePlannerHeader";
import DatePlannerHero from "@/components/date-planner/DatePlannerHero";
import RomanticDateBook from "@/components/date-planner/RomanticDateBook";
import DatePlanSummary from "@/components/date-planner/DatePlanSummary";
import FinalDateInvitation from "@/components/date-planner/FinalDateInvitation";

export default function DatePlannerPage() {
  const [data, setData] = useState(() => JSON.parse(JSON.stringify(defaultData)));
  const [showOpening, setShowOpening] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showInvitationModal, setShowInvitationModal] = useState(false);

  // Audio ref
  const audioRef = useRef(null);

  // User planner choices state
  const [plannerState, setPlannerState] = useState({
    date: null,
    timePeriod: "evening",
    timeSlot: "6:30 PM – 8:30 PM",
    activities: ["dinner", "cafe"],
    cuisines: ["italian"],
    movieGenres: ["romantic"],
    movieVenue: "cinema",
    environment: "indoor",
    budget: "moderate",
    location: "citycenter",
    notes: "",
  });

  // Sync query params safely on mount
  useEffect(() => {
    if (typeof window === "undefined") return;

    const params = new URLSearchParams(window.location.search);

    // Skip opening if in studio demo mode or explicitly requested
    if (params.get("mode") === "demo" || params.get("skipOpening") === "true") {
      setShowOpening(false);
    }

    const recipient = params.get("recipient") || params.get("recipientName");
    const sender = params.get("sender") || params.get("senderName");
    const names = params.get("names");
    const heading = params.get("heading") || params.get("headline");
    const description = params.get("description") || params.get("message");
    const eyebrow = params.get("eyebrow");
    const songUrl = params.get("songUrl") || params.get("audioSource");

    let rName = recipient;
    let sName = sender;
    if (names && !rName) {
      const parts = names.split("&");
      rName = parts[0]?.trim();
      if (parts[1]?.trim()) sName = parts[1].trim();
    }

    setData((prev) => ({
      ...prev,
      recipientName: rName || prev.recipientName,
      senderName: sName || prev.senderName,
      heading: heading || prev.heading,
      description: description || prev.description,
      eyebrow: eyebrow || prev.eyebrow,
      music: {
        ...prev.music,
        src: songUrl || prev.music?.src,
      },
    }));
  }, []);

  // Listen to postMessage for live updates from /customize studio
  useEffect(() => {
    const handleMessage = (event) => {
      if (event.data?.type === "INK_IVORY_CUSTOM_UPDATE" && event.data?.payload) {
        const payload = event.data.payload;

        let rName = payload.recipientName;
        let sName = payload.senderName;
        if (payload.names) {
          const parts = payload.names.split("&");
          if (parts[0]?.trim()) rName = parts[0].trim();
          if (parts[1]?.trim()) sName = parts[1].trim();
        }

        const newSongUrl = payload.songUrl || payload.audioSource;
        const newSongTitle = payload.songTitle;

        setData((prev) => ({
          ...prev,
          recipientName: rName || prev.recipientName,
          senderName: sName || prev.senderName,
          heading: payload.heading || payload.headline || prev.heading,
          description: payload.description || payload.message || prev.description,
          eyebrow: payload.eyebrow || prev.eyebrow,
          music: {
            ...prev.music,
            src: newSongUrl || prev.music?.src,
            title: newSongTitle || prev.music?.title,
          },
        }));

        if (newSongUrl && audioRef.current) {
          audioRef.current.src = newSongUrl;
          if (isPlaying) {
            audioRef.current.play().catch(() => {});
          }
        }
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [isPlaying]);

  // Handle music play/pause toggle
  const toggleMusic = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().then(() => setIsPlaying(true)).catch((e) => console.log("Audio play blocked", e));
    }
  };

  // Start experience on opening screen click
  const handleOpenInvitation = () => {
    setShowOpening(false);
    if (audioRef.current && !isPlaying) {
      audioRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
    }
  };

  // State update handlers
  const handleSelectDate = (dateStr) => {
    setPlannerState((prev) => ({ ...prev, date: dateStr }));
  };

  const handleSelectPeriod = (periodId) => {
    const period = data.timePeriods.find((p) => p.id === periodId);
    setPlannerState((prev) => ({
      ...prev,
      timePeriod: periodId,
      timeSlot: period?.slots?.[0] || "",
    }));
  };

  const handleSelectSlot = (slotStr) => {
    setPlannerState((prev) => ({ ...prev, timeSlot: slotStr }));
  };

  const handleToggleActivity = (activityId) => {
    setPlannerState((prev) => {
      const exists = prev.activities.includes(activityId);
      const next = exists
        ? prev.activities.filter((id) => id !== activityId)
        : [...prev.activities, activityId];
      return { ...prev, activities: next };
    });
  };

  const handleToggleCuisine = (cuisineId) => {
    setPlannerState((prev) => {
      const exists = prev.cuisines.includes(cuisineId);
      const next = exists
        ? prev.cuisines.filter((id) => id !== cuisineId)
        : [...prev.cuisines, cuisineId];
      return { ...prev, cuisines: next };
    });
  };

  const handleSelectEnvironment = (envId) => {
    setPlannerState((prev) => ({ ...prev, environment: envId }));
  };

  const handleChangeNotes = (notesText) => {
    setPlannerState((prev) => ({ ...prev, notes: notesText }));
  };

  const handleReset = () => {
    setPlannerState({
      date: null,
      timePeriod: "evening",
      timeSlot: "6:30 PM – 8:30 PM",
      activities: [],
      cuisines: [],
      movieGenres: [],
      movieVenue: "cinema",
      environment: "indoor",
      budget: "moderate",
      location: "citycenter",
      notes: "",
    });
  };

  const handleNavigate = (id) => {
    if (id === "hero") {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    const el = document.getElementById(id) || document.getElementById("planner-book");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleStartPlanning = () => {
    const el = document.getElementById("planner-book");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="relative min-h-screen bg-[#FFF2ED] text-[#50363A] font-sans antialiased selection:bg-[#B51F3B]/20 selection:text-[#641A2A] overflow-x-hidden">
      {/* Background Falling Rose Petals */}
      <RosePetals count={18} />

      {/* Background Audio */}
      <audio
        ref={audioRef}
        src={data.music?.src || data.music?.source || "/audio/valentine-theme.mp3"}
        loop
        preload="auto"
      />

      {/* Opening Envelope Experience Screen */}
      <AnimatePresence>
        {showOpening && (
          <DatePlannerOpening
            recipientName={data.recipientName}
            senderName={data.senderName}
            onOpen={handleOpenInvitation}
            onSkip={() => setShowOpening(false)}
          />
        )}
      </AnimatePresence>

      {/* Header Bar */}
      <DatePlannerHeader
        isPlaying={isPlaying}
        onToggleMusic={toggleMusic}
        musicTitle={data.music?.title}
        onNavigate={handleNavigate}
      />

      <main className="relative z-10">
        {/* Hero Section */}
        <DatePlannerHero
          recipientName={data.recipientName}
          senderName={data.senderName}
          heading={data.heading}
          eyebrow={data.eyebrow}
          description={data.description}
          onStartPlanning={handleStartPlanning}
        />

        {/* Intimate Romantic Date Book (Guided Chapter-by-Chapter) */}
        <RomanticDateBook
          plannerState={plannerState}
          data={data}
          onSelectDate={handleSelectDate}
          onSelectPeriod={handleSelectPeriod}
          onSelectSlot={handleSelectSlot}
          onToggleActivity={handleToggleActivity}
          onToggleCuisine={handleToggleCuisine}
          onSelectEnvironment={handleSelectEnvironment}
          onChangeNotes={handleChangeNotes}
          onReviewPlan={() => setShowInvitationModal(true)}
        />

        {/* Live Blueprint Paper Card */}
        <DatePlanSummary
          plannerState={plannerState}
          data={data}
          onConfirmDate={() => setShowInvitationModal(true)}
          onReset={handleReset}
        />
      </main>

      {/* Celebratory Luxury Love Letter Modal */}
      <FinalDateInvitation
        plannerState={plannerState}
        data={data}
        isOpen={showInvitationModal}
        onClose={() => setShowInvitationModal(false)}
      />

      {/* Simple Luxury Footer */}
      <footer className="py-12 px-4 text-center border-t border-[#E7A5A4]/30 bg-[#FFF9F4] relative z-10">
        <div className="font-serif text-xl text-[#641A2A] font-semibold mb-1">
          You Are Mine
        </div>
        <p className="text-xs text-[#50363A]/60 max-w-sm mx-auto font-sans">
          Crafting unforgettable moments, bespoke digital stationery &amp; celebrations of love.
        </p>
      </footer>
    </div>
  );
}
