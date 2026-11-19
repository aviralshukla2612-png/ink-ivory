'use client';

import React from 'react';
import { X, Sparkles, DoorOpen, Calendar, MapPin, Heart } from 'lucide-react';
import GoldDivider from '../ui/GoldDivider';

export default function MobileMenu({
  isOpen,
  onClose,
  navLinks,
  onReplayEntrance,
  activeSection,
}) {
  if (!isOpen) return null;

  const handleLinkClick = (href) => {
    onClose();
    const id = href.replace('#', '');
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="fixed inset-0 z-50 lg:hidden animate-in fade-in duration-300">
      {/* Dark Backdrop */}
      <div
        className="absolute inset-0 bg-[#0B0F18]/90 backdrop-blur-md"
        onClick={onClose}
      />

      {/* Slide-in Drawer */}
      <div className="absolute right-0 top-0 bottom-0 w-4/5 max-w-sm bg-[#101624] border-l border-[#C5A46D]/30 p-6 flex flex-col justify-between shadow-2xl z-10 overflow-y-auto">
        <div>
          {/* Header */}
          <div className="flex items-center justify-between pb-6 border-b border-[#C5A46D]/20">
            <div>
              <span className="font-cormorant text-2xl text-[#F7F3EB] font-light">
                Aarav & Riya
              </span>
              <p className="text-[10px] tracking-[0.25em] uppercase text-[#C5A46D]">
                18 December 2026
              </p>
            </div>
            <button
              onClick={onClose}
              aria-label="Close menu"
              className="p-2 rounded-full bg-[#172039] text-[#D8C39A] border border-[#C5A46D]/30 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Links List */}
          <nav className="py-8 space-y-4">
            {navLinks.map((link) => {
              const isActive = activeSection === link.href.replace('#', '');
              return (
                <button
                  key={link.href}
                  type="button"
                  onClick={() => handleLinkClick(link.href)}
                  className={`w-full text-left py-2.5 px-4 rounded-xl text-sm tracking-[0.15em] uppercase font-medium transition-all flex items-center justify-between ${
                    isActive
                      ? 'bg-[#C5A46D]/20 text-[#D8C39A] border border-[#C5A46D]/40 font-semibold'
                      : 'text-[#F7F3EB]/80 hover:text-[#C5A46D] hover:bg-[#172039]/60'
                  }`}
                >
                  <span>{link.label}</span>
                  {isActive && <Sparkles className="w-3.5 h-3.5 text-[#C5A46D]" />}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Actions */}
        <div className="pt-6 border-t border-[#C5A46D]/20 space-y-3">
          <button
            type="button"
            onClick={() => {
              onClose();
              if (onReplayEntrance) onReplayEntrance();
            }}
            className="w-full py-3 px-4 rounded-xl border border-[#C5A46D]/40 text-[#D8C39A] text-xs uppercase tracking-[0.2em] font-medium flex items-center justify-center gap-2 hover:bg-[#C5A46D]/15 transition-colors"
          >
            <DoorOpen className="w-4 h-4 text-[#C5A46D]" />
            <span>Replay Grand Entrance</span>
          </button>

          <button
            type="button"
            onClick={() => handleLinkClick('#rsvp')}
            className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-[#C5A46D] to-[#D8C39A] text-[#101624] text-xs uppercase tracking-[0.2em] font-bold shadow-lg"
          >
            RSVP Confirmation
          </button>
        </div>
      </div>
    </div>
  );
}
