'use client';

import React, { useState, useEffect } from 'react';
import { Menu, DoorOpen, Sparkles } from 'lucide-react';
import { weddingData } from '@/data/weddingData';
import MobileMenu from './MobileMenu';

export default function WeddingNavbar({ onReplayEntrance }) {
  const { couple } = weddingData;
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');

  const navLinks = [
    { label: 'Couple', href: '#couple' },
    { label: 'Story', href: '#story' },
    { label: 'Events', href: '#events' },
    { label: 'Countdown', href: '#countdown' },
    { label: 'Gallery', href: '#gallery' },
    { label: 'Venue', href: '#venue' },
    { label: 'Guestbook', href: '#wishes' },
    { label: 'RSVP', href: '#rsvp' },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);

      // Simple active section detection
      const sections = ['hero', 'couple', 'story', 'events', 'countdown', 'gallery', 'venue', 'wishes', 'rsvp'];
      for (const sectionId of sections) {
        const el = document.getElementById(sectionId);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 200 && rect.bottom >= 200) {
            setActiveSection(sectionId);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLinkClick = (e, href) => {
    e.preventDefault();
    const id = href.replace('#', '');
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 ${
          isScrolled
            ? 'bg-[#101624]/90 backdrop-blur-md border-b border-[#C5A46D]/25 py-3 shadow-xl'
            : 'bg-transparent py-5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          {/* Left: Monogram / Initials */}
          <a
            href="#hero"
            onClick={(e) => handleLinkClick(e, '#hero')}
            className="group flex items-center gap-2.5 text-[#F7F3EB]"
          >
            <div className="w-9 h-9 rounded-full border border-[#C5A46D]/60 bg-[#172039]/80 flex items-center justify-center text-[#D8C39A] group-hover:border-[#C5A46D] transition-colors shadow-md">
              <span className="font-cormorant text-base font-bold tracking-wider">
                A&R
              </span>
            </div>
            <div className="hidden sm:block">
              <span className="font-cormorant text-lg text-[#F7F3EB] tracking-wide font-light block leading-none">
                Aarav & Riya
              </span>
              <span className="text-[9px] uppercase tracking-[0.3em] text-[#C5A46D] font-mono">
                Jaipur 2026
              </span>
            </div>
          </a>

          {/* Center: Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-6 xl:gap-8">
            {navLinks.map((link) => {
              const isActive = activeSection === link.href.replace('#', '');
              return (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={(e) => handleLinkClick(e, link.href)}
                  className={`text-xs uppercase tracking-[0.2em] transition-all duration-300 font-medium relative py-1 ${
                    isActive
                      ? 'text-[#D8C39A]'
                      : 'text-[#F7F3EB]/75 hover:text-[#C5A46D]'
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#C5A46D] to-transparent" />
                  )}
                </a>
              );
            })}
          </nav>

          {/* Right: Actions */}
          <div className="flex items-center gap-3">
            {/* Replay Entrance Button */}
            <button
              type="button"
              onClick={onReplayEntrance}
              title="Replay Cinematic Grand Entrance"
              aria-label="Replay Cinematic Grand Entrance"
              className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full border border-[#C5A46D]/40 text-[#D8C39A] text-[11px] uppercase tracking-[0.15em] font-medium hover:bg-[#C5A46D]/15 hover:border-[#C5A46D] transition-all duration-300 backdrop-blur-sm"
            >
              <DoorOpen className="w-3.5 h-3.5 text-[#C5A46D]" />
              <span className="hidden md:inline">Replay Entrance</span>
            </button>

            {/* Quick RSVP CTA */}
            <a
              href="#rsvp"
              onClick={(e) => handleLinkClick(e, '#rsvp')}
              className="px-5 py-2 rounded-full bg-gradient-to-r from-[#C5A46D] via-[#D8C39A] to-[#C5A46D] text-[#101624] font-semibold text-[11px] tracking-[0.2em] uppercase shadow-md hover:shadow-[#C5A46D]/30 transition-all duration-300 hover:scale-105"
            >
              RSVP
            </a>

            {/* Mobile Hamburger Menu Button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              aria-label="Open navigation menu"
              className="lg:hidden p-2 rounded-xl bg-[#172039]/80 border border-[#C5A46D]/30 text-[#D8C39A] hover:text-[#F7F3EB] transition-colors"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Slide-out Navigation Drawer */}
      <MobileMenu
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        navLinks={navLinks}
        onReplayEntrance={onReplayEntrance}
        activeSection={activeSection}
      />
    </>
  );
}
