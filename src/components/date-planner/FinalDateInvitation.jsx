"use client";

import React, { useState, useEffect, useRef } from "react";
import { Heart, Copy, Check, Sparkles, MessageCircle, X } from "lucide-react";
import { triggerLoveAndCrackersBlast } from "./LoveFirecrackerBlast";

export default function FinalDateInvitation({
  plannerState,
  data,
  isOpen,
  onClose,
}) {
  const [copied, setCopied] = useState(false);
  const [autoSent, setAutoSent] = useState(false);
  const hasDispatchedRef = useRef(false);

  const {
    date,
    timePeriod,
    timeSlot,
    activities = [],
    cuisines = [],
    environment,
    budget,
    location,
    notes,
  } = plannerState;

  const formattedDate = !date
    ? "A special day chosen together"
    : isNaN(new Date(date).getTime())
    ? date
    : new Date(date).toLocaleDateString("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
        year: "numeric",
      });

  const resolvedPeriod = data.timePeriods?.find((p) => p.id === timePeriod)?.title || "Golden Sunset";
  const resolvedEnv = data.environments?.find((e) => e.id === environment)?.title || "";

  const activityTitles = (data.activities || [])
    .filter((a) => activities.includes(a.id))
    .map((a) => a.title)
    .join(" & ");

  const cuisineTitles = (data.cuisines || [])
    .filter((c) => cuisines.includes(c.id))
    .map((c) => c.name)
    .join(", ");

  // Riya is sending her choices to Aarav
  const recipientGirl = data.recipientName || "Riya";
  const senderBoy = data.senderName || "Aarav";

  // Formulate WhatsApp message sent from Riya directly to Aarav
  const shareMessage =
    `Hey ${senderBoy}! ♡\n\n` +
    `I've planned our date just the way I love! Here is what I chose for us:\n\n` +
    `📅 *Our Day:* ${formattedDate}\n` +
    `⏰ *Timing:* ${resolvedPeriod} ${timeSlot ? `(${timeSlot})` : ""}\n` +
    (activityTitles ? `✨ *Activities:* ${activityTitles}\n` : "") +
    (cuisineTitles ? `🍷 *Dining:* ${cuisineTitles}\n` : "") +
    (resolvedEnv ? `🕯️ *Setting:* ${resolvedEnv}\n` : "") +
    (notes ? `\n💌 *My Secret Wish:* "${notes}"\n` : "") +
    `\nCan't wait for our date! Sealed with love ♡\n\n` +
    `Forever yours,\n${recipientGirl} ♡\n\n` +
    `_You Are Mine • Bespoke Romantic Date Planner_`;

  const cleanPhone = (data.senderPhone || data.phone || "").replace(/[^0-9]/g, "");
  const whatsappUrl = cleanPhone
    ? `https://api.whatsapp.com/send?phone=${cleanPhone}&text=${encodeURIComponent(shareMessage)}`
    : `https://api.whatsapp.com/send?text=${encodeURIComponent(shareMessage)}`;

  // Trigger celebration blast and automatic WhatsApp dispatch to Aarav
  useEffect(() => {
    if (isOpen) {
      triggerLoveAndCrackersBlast();

      // Automatically dispatch to Aarav once when opened
      if (!hasDispatchedRef.current) {
        hasDispatchedRef.current = true;
        const timer = setTimeout(() => {
          try {
            window.open(whatsappUrl, "_blank", "noopener,noreferrer");
            setAutoSent(true);
          } catch (e) {
            console.log("Auto-popup blocked by browser, user can click button", e);
          }
        }, 700);
        return () => clearTimeout(timer);
      }
    } else {
      hasDispatchedRef.current = false;
    }
  }, [isOpen, whatsappUrl]);

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(shareMessage);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-md animate-fade-in overflow-y-auto">
      {/* Luxury Stationery Card */}
      <div className="relative w-full max-w-lg bg-[#FFFBF7] rounded-[28px] sm:rounded-[36px] p-5 sm:p-8 border-2 border-[#E7A5A4]/40 shadow-[0_25px_80px_rgba(100,26,42,0.4)] my-auto overflow-hidden">
        {/* Close Icon Top Right */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-[#641A2A]/50 hover:text-[#641A2A] hover:bg-[#641A2A]/10 transition-colors z-20 cursor-pointer"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Delicate Golden Inner Filigree Ring */}
        <div className="absolute inset-2 sm:inset-3 border border-[#E7A5A4]/35 rounded-[22px] sm:rounded-[30px] pointer-events-none" />

        {/* Real Embossed Wax Seal Badge with Confetti Blast */}
        <div className="flex justify-center -mt-8 sm:-mt-12 mb-3">
          <button
            type="button"
            onClick={triggerLoveAndCrackersBlast}
            className="relative w-16 h-16 rounded-full bg-gradient-to-br from-[#872236] via-[#B51F3B] to-[#501320] shadow-[0_8px_25px_rgba(181,31,59,0.5)] flex items-center justify-center border-4 border-[#FFFBF7] ring-2 ring-[#B51F3B]/30 hover:scale-110 active:scale-95 transition-transform cursor-pointer"
            title="Click for celebration blast!"
          >
            <Heart className="w-7 h-7 text-white fill-white drop-shadow-sm animate-pulse" />
          </button>
        </div>

        {/* Brand Eyebrow & Confirmation Title */}
        <div className="text-center mb-4 px-2">
          <span className="text-[10px] font-sans uppercase tracking-[0.28em] text-[#B51F3B] font-semibold">
            Sealed With Love &bull; Sent to {senderBoy}
          </span>
          <h3 className="font-serif italic text-2xl sm:text-3xl text-[#641A2A] font-bold mt-1">
            Choices Automatically Sent to {senderBoy}! ♡
          </h3>
          <p className="text-xs text-[#50363A]/80 font-sans mt-1.5 max-w-sm mx-auto leading-relaxed">
            {senderBoy} has been notified of your date choices directly on WhatsApp. You don&apos;t have to do anything else!
          </p>
        </div>

        {/* Romantic Letter Prose (From Riya to Aarav) */}
        <div className="relative bg-white/85 rounded-2xl p-4 sm:p-5 border border-[#E7A5A4]/35 shadow-xs mb-4 text-[#50363A]">
          <p className="font-serif italic text-base sm:text-lg text-[#641A2A] mb-2 font-semibold">
            My Dearest {senderBoy},
          </p>

          <p className="text-xs sm:text-sm font-sans leading-relaxed text-[#50363A]/85 mb-2.5">
            I loved planning every second of this! On{" "}
            <strong className="text-[#641A2A] font-semibold">{formattedDate}</strong>, let&apos;s meet in the{" "}
            <strong className="text-[#641A2A] font-semibold">{resolvedPeriod}</strong>
            {timeSlot ? ` (${timeSlot})` : ""}.
          </p>

          <p className="text-xs sm:text-sm font-sans leading-relaxed text-[#50363A]/85 mb-2.5">
            For our date, I would adore{" "}
            <strong className="text-[#641A2A] font-semibold">{activityTitles || "spending time together"}</strong>
            {cuisineTitles ? (
              <>
                {" "}and treating ourselves to{" "}
                <strong className="text-[#641A2A] font-semibold">{cuisineTitles}</strong>
              </>
            ) : null}
            {resolvedEnv ? ` in a romantic ${resolvedEnv.toLowerCase()} atmosphere` : ""}.
          </p>

          {notes && notes.trim() && (
            <div className="pt-2 pb-1 border-t border-[#E7A5A4]/30 font-serif italic text-xs text-[#B51F3B]">
              💌 &ldquo;{notes}&rdquo;
            </div>
          )}

          <div className="text-right mt-3 font-serif italic text-sm text-[#641A2A]">
            With all my love,<br />
            <span className="font-bold text-base">{recipientGirl} ♡</span>
          </div>
        </div>

        {/* Compact Summary Badges */}
        <div className="flex flex-wrap justify-center gap-1.5 mb-4 text-[11px] font-sans font-medium text-[#641A2A]">
          {date && (
            <span className="px-2.5 py-1 rounded-full bg-[#FFF2ED] border border-[#E7A5A4]/40">
              📅 {formattedDate.split(",")[0] || formattedDate}
            </span>
          )}
          <span className="px-2.5 py-1 rounded-full bg-[#FFF2ED] border border-[#E7A5A4]/40">
            ⏰ {resolvedPeriod}
          </span>
          {activityTitles && (
            <span className="px-2.5 py-1 rounded-full bg-[#FFF2ED] border border-[#E7A5A4]/40">
              ✨ {activityTitles.split("&")[0]?.trim()}
            </span>
          )}
          {cuisineTitles && (
            <span className="px-2.5 py-1 rounded-full bg-[#FFF2ED] border border-[#E7A5A4]/40">
              🍷 {cuisineTitles.split(",")[0]}
            </span>
          )}
        </div>

        {/* Actions */}
        <div className="space-y-2.5">
          {/* Reopen WhatsApp Chat button if user wants to see chat again */}
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={triggerLoveAndCrackersBlast}
            className="w-full flex items-center justify-center gap-2.5 py-3.5 px-5 rounded-full bg-gradient-to-r from-[#25D366] to-[#128C7E] hover:from-[#20BE5A] hover:to-[#0F7569] text-white font-medium text-xs sm:text-sm transition-all shadow-[0_8px_25px_rgba(37,211,102,0.35)] hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
          >
            <MessageCircle className="w-4 h-4" />
            <span className="font-semibold tracking-wide">
              {autoSent
                ? `Sent to ${senderBoy} on WhatsApp • Open Chat ♡`
                : `Send Directly to ${senderBoy} on WhatsApp ♡`}
            </span>
          </a>

          <div className="grid grid-cols-3 gap-2 pt-1">
            <button
              type="button"
              onClick={handleCopy}
              className="flex items-center justify-center gap-1 py-2.5 px-2 rounded-full border border-[#E7A5A4]/60 text-xs font-medium text-[#50363A] bg-white hover:bg-white/80 transition-all cursor-pointer shadow-xs truncate"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-green-600 shrink-0" /> : <Copy className="w-3.5 h-3.5 text-[#B51F3B] shrink-0" />}
              <span className="truncate">{copied ? "Copied!" : "Copy"}</span>
            </button>

            <button
              type="button"
              onClick={triggerLoveAndCrackersBlast}
              className="flex items-center justify-center gap-1 py-2.5 px-2 rounded-full border border-[#E7A5A4]/60 text-xs font-medium text-[#B51F3B] bg-[#FFF2ED] hover:bg-[#FCEAE5] transition-all cursor-pointer shadow-xs truncate"
              title="Trigger celebration fireworks and love blast!"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#B51F3B] shrink-0" />
              <span className="truncate">Love Blast 🎆</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="flex items-center justify-center gap-1 py-2.5 px-2 rounded-full bg-[#641A2A] text-white text-xs font-medium hover:bg-[#501320] transition-all cursor-pointer shadow-xs truncate"
            >
              <Check className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate">Done ♡</span>
            </button>
          </div>
        </div>

        {/* Delicate Brand Footer */}
        <div className="text-center mt-4 text-[9px] text-[#50363A]/50 tracking-widest uppercase">
          You Are Mine &bull; Bespoke Romantic Stationery
        </div>
      </div>
    </div>
  );
}
