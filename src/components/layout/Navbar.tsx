'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import {
  Home,
  LayoutGrid,
  Calendar,
  PenLine,
  Tag,
  ChevronDown,
  Heart,
  ShoppingBag,
  User,
  ArrowRight,
  Menu,
  X,
  Sparkles,
  Gift,
} from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { occasionsList } from '@/data/templates';

type NavSection = 'home' | 'templates' | 'occasions' | 'create' | 'pricing';

// Elegant champagne gold wave underline for the active navigation item
const GoldActiveUnderline: React.FC = () => (
  <span className="absolute -bottom-2 left-0 right-0 flex justify-center pointer-events-none select-none">
    <svg
      className="w-full max-w-[80px] h-[5px] text-[#C5A059]"
      viewBox="0 0 80 5"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M2 2.8C18 4.6 34 1 50 2.8C60 3.8 70 1.8 78 2.8"
        stroke="url(#navbarGoldGrad)"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
      <defs>
        <linearGradient id="navbarGoldGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#A87A36" stopOpacity="0.3" />
          <stop offset="20%" stopColor="#C5A059" stopOpacity="1" />
          <stop offset="50%" stopColor="#E4C887" stopOpacity="1" />
          <stop offset="80%" stopColor="#C5A059" stopOpacity="1" />
          <stop offset="100%" stopColor="#A87A36" stopOpacity="0.3" />
        </linearGradient>
      </defs>
    </svg>
  </span>
);

export const Navbar: React.FC = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { totalItems } = useCart();
  const { totalWishlist } = useWishlist();

  const [activeSection, setActiveSection] = useState<NavSection>('home');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [templatesDropdown, setTemplatesDropdown] = useState(false);
  const [occasionsDropdown, setOccasionsDropdown] = useState(false);

  // Dynamic active section detection (route-based + homepage scroll spy)
  useEffect(() => {
    if (pathname === '/pricing') {
      setActiveSection('pricing');
      return;
    }
    if (pathname.startsWith('/customize')) {
      setActiveSection('create');
      return;
    }
    if (pathname.startsWith('/templates')) {
      setActiveSection('templates');
      return;
    }
    if (pathname !== '/') {
      setActiveSection('home');
      return;
    }

    // Scroll spy on homepage
    const handleScroll = () => {
      const scrollPos = window.scrollY + 180;
      const heroEl = document.getElementById('hero');
      const occasionsEl = document.getElementById('occasions');
      const templatesEl = document.getElementById('templates');
      const studioEl = document.getElementById('create-card');

      if (studioEl && scrollPos >= studioEl.offsetTop) {
        setActiveSection('create');
      } else if (templatesEl && scrollPos >= templatesEl.offsetTop) {
        setActiveSection('templates');
      } else if (occasionsEl && scrollPos >= occasionsEl.offsetTop) {
        setActiveSection('occasions');
      } else {
        setActiveSection('home');
      }
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [pathname]);

  // Never render navbar inside an iframe or demo preview
  if (typeof window !== 'undefined' && window.self !== window.top) {
    return null;
  }

  // Hide global e-commerce navbar on admin portal, public invitations, template previews, and customize studio
  if (
    pathname &&
    (pathname.startsWith('/admin') ||
      pathname.startsWith('/invite') ||
      pathname.startsWith('/template-') ||
      pathname.startsWith('/valentine') ||
      pathname.startsWith('/birthday') ||
      pathname.startsWith('/date-planner') ||
      pathname.startsWith('/preview') ||
      pathname.startsWith('/customize'))
  ) {
    return null;
  }

  // Click handlers for homepage in-page navigation
  const handleHomeClick = (e: React.MouseEvent) => {
    if (pathname === '/') {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
      setActiveSection('home');
    }
  };

  const handleOccasionsClick = (e: React.MouseEvent) => {
    if (pathname === '/') {
      const occasionsEl = document.getElementById('occasions');
      if (occasionsEl) {
        e.preventDefault();
        occasionsEl.scrollIntoView({ behavior: 'smooth' });
        setActiveSection('occasions');
      }
    }
  };

  const handleTemplatesClick = (e: React.MouseEvent) => {
    if (pathname === '/') {
      const templatesEl = document.getElementById('templates');
      if (templatesEl) {
        e.preventDefault();
        templatesEl.scrollIntoView({ behavior: 'smooth' });
        setActiveSection('templates');
      }
    }
  };

  const handleCreateClick = (e: React.MouseEvent) => {
    if (pathname === '/') {
      const studioEl = document.getElementById('create-card');
      if (studioEl) {
        e.preventDefault();
        studioEl.scrollIntoView({ behavior: 'smooth' });
        setActiveSection('create');
      }
    }
  };

  return (
    <>
      <header className="sticky top-0 z-50 w-full h-[88px] sm:h-[98px] lg:h-[108px] bg-[#F8F4EC] border-b border-[#EDE2CF] flex items-center shadow-2xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex items-center justify-between gap-4">

          {/* LEFT: Logo (Prominent & Luxurious) */}
          <div className="flex items-center py-1 flex-shrink-0">
            <Link href="/" onClick={handleHomeClick} className="group flex items-center focus:outline-none">
              <Image
                src="/logo.webp?v=3"
                alt="You Are Mine"
                width={360}
                height={120}
                className="h-16 sm:h-[80px] lg:h-[94px] w-auto object-contain transition-transform group-hover:scale-[1.03]"
                priority
              />
            </Link>
          </div>

          {/* CENTER: Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center justify-center gap-6 xl:gap-8 text-[13.5px]">
            {/* 1. Home */}
            <Link
              href="/"
              onClick={handleHomeClick}
              className={`relative flex items-center gap-1.5 py-1.5 transition-colors ${activeSection === 'home'
                  ? 'text-[#1C2C24] font-semibold'
                  : 'text-[#49341F] font-medium hover:text-[#A77B35]'
                }`}
            >
              <Home className="w-4 h-4 stroke-[1.8]" />
              <span>Home</span>
              {activeSection === 'home' && <GoldActiveUnderline />}
            </Link>

            {/* 2. Invitation Templates */}
            <div
              className="relative"
              onMouseEnter={() => setTemplatesDropdown(true)}
              onMouseLeave={() => setTemplatesDropdown(false)}
            >
              <Link
                href="/templates"
                onClick={handleTemplatesClick}
                className={`relative flex items-center gap-1.5 py-1.5 transition-colors ${activeSection === 'templates'
                    ? 'text-[#1C2C24] font-semibold'
                    : 'text-[#49341F] font-medium hover:text-[#A77B35]'
                  }`}
              >
                <LayoutGrid className="w-4 h-4 stroke-[1.8]" />
                <span>Invitation Templates</span>
                <ChevronDown className="w-3.5 h-3.5 opacity-80" />
                {activeSection === 'templates' && <GoldActiveUnderline />}
              </Link>

              {templatesDropdown && (
                <div className="absolute top-full left-0 w-60 bg-[#FCFAF6] border border-[#E7DCBA] rounded-xl shadow-luxury-lg py-2 z-50 animate-in fade-in duration-100">
                  <div className="px-3 py-1 text-[10px] font-semibold text-[#A77B35] uppercase tracking-wider border-b border-[#EFE7D5]">
                    Collections
                  </div>
                  <Link
                    href="/templates?filter=featured"
                    className="flex items-center gap-2 px-3 py-2 text-xs text-[#49341F] hover:bg-[#F3EDE1] transition-colors"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-[#A77B35]" />
                    <span>Featured Designs</span>
                  </Link>
                  <Link
                    href="/templates?filter=free"
                    className="flex items-center gap-2 px-3 py-2 text-xs text-[#49341F] hover:bg-[#F3EDE1] transition-colors"
                  >
                    <Gift className="w-3.5 h-3.5 text-[#A77B35]" />
                    <span>Free Digital Pages</span>
                  </Link>
                  <Link
                    href="/templates"
                    className="flex items-center gap-2 px-3 py-2 text-xs text-[#49341F] hover:bg-[#F3EDE1] transition-colors"
                  >
                    <LayoutGrid className="w-3.5 h-3.5 text-[#A77B35]" />
                    <span>All Templates (60+)</span>
                  </Link>
                </div>
              )}
            </div>

            {/* 3. By Occasion */}
            <div
              className="relative"
              onMouseEnter={() => setOccasionsDropdown(true)}
              onMouseLeave={() => setOccasionsDropdown(false)}
            >
              <Link
                href="/templates"
                onClick={handleOccasionsClick}
                className={`relative flex items-center gap-1.5 py-1.5 transition-colors ${activeSection === 'occasions'
                    ? 'text-[#1C2C24] font-semibold'
                    : 'text-[#49341F] font-medium hover:text-[#A77B35]'
                  }`}
              >
                <Calendar className="w-4 h-4 stroke-[1.8]" />
                <span>By Occasion</span>
                <ChevronDown className="w-3.5 h-3.5 opacity-80" />
                {activeSection === 'occasions' && <GoldActiveUnderline />}
              </Link>

              {occasionsDropdown && (
                <div className="absolute top-full -left-8 w-64 bg-[#FCFAF6] border border-[#E7DCBA] rounded-xl shadow-luxury-lg py-2 z-50 animate-in fade-in duration-100 grid grid-cols-2 gap-1 p-2">
                  {occasionsList.map((occ) => (
                    <Link
                      key={occ.name}
                      href={`/templates?occasion=${encodeURIComponent(occ.name)}`}
                      className="px-2 py-1.5 text-xs text-[#49341F] hover:bg-[#F3EDE1] rounded-lg transition-colors flex items-center justify-between"
                    >
                      <span>{occ.name}</span>
                      <span className="text-[10px] text-[#A77B35]">✦</span>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* 4. Create Your Page */}
            <Link
              href="/customize/tpl-wedding-navy-01"
              onClick={handleCreateClick}
              className={`relative flex items-center gap-1.5 py-1.5 transition-colors ${activeSection === 'create'
                  ? 'text-[#1C2C24] font-semibold'
                  : 'text-[#49341F] font-medium hover:text-[#A77B35]'
                }`}
            >
              <PenLine className="w-4 h-4 stroke-[1.8]" />
              <span>Create Your Page</span>
              {activeSection === 'create' && <GoldActiveUnderline />}
            </Link>

            {/* 5. Pricing */}
            <Link
              href="/pricing"
              className={`relative flex items-center gap-1.5 py-1.5 transition-colors ${activeSection === 'pricing'
                  ? 'text-[#1C2C24] font-semibold'
                  : 'text-[#49341F] font-medium hover:text-[#A77B35]'
                }`}
            >
              <Tag className="w-4 h-4 stroke-[1.8]" />
              <span>Pricing</span>
              {activeSection === 'pricing' && <GoldActiveUnderline />}
            </Link>
          </nav>

          {/* RIGHT: Action Items (Wishlist, Cart, Login) */}
          <div className="hidden lg:flex items-center gap-3 xl:gap-4 flex-shrink-0">
            {/* Wishlist Icon */}
            <Link
              href="/wishlist"
              className="relative p-1 text-[#2E2014] hover:text-[#A77B35] transition-colors"
              title="Saved Wishlist"
            >
              <Heart className="w-[18px] h-[18px] stroke-[1.8]" />
              {totalWishlist > 0 && (
                <span className="absolute -top-1.5 -right-2 bg-[#1C2C24] text-white text-[9.5px] font-semibold w-4 h-4 rounded-full flex items-center justify-center ring-1 ring-[#F8F4EC] shadow-2xs">
                  {totalWishlist}
                </span>
              )}
            </Link>

            {/* Shopping Bag Icon */}
            <Link
              href="/cart"
              className="relative p-1 text-[#2E2014] hover:text-[#A77B35] transition-colors"
              title="Shopping Bag"
            >
              <ShoppingBag className="w-[18px] h-[18px] stroke-[1.8]" />
              {totalItems > 0 && (
                <span className="absolute -top-1.5 -right-2 bg-[#1C2C24] text-white text-[9.5px] font-semibold w-4 h-4 rounded-full flex items-center justify-center ring-1 ring-[#F8F4EC] shadow-2xs">
                  {totalItems}
                </span>
              )}
            </Link>

            {/* Hairline Divider */}
            <div className="h-4.5 w-[1px] bg-[#DFCDAE] mx-0.5" />

            {/* Login Pill Button */}
            <Link
              href="/account"
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-[#1C2C24] text-white text-xs font-medium hover:bg-[#121c17] transition-all duration-150 shadow-xs"
            >
              <User className="w-3.5 h-3.5 stroke-[1.8]" />
              <span>Login</span>
              <ArrowRight className="w-3.5 h-3.5 stroke-[1.8]" />
            </Link>
          </div>
        </div>
      </div>
    </header>

      {/* MOBILE APPLICATION BOTTOM NAVIGATION BAR (Docked at bottom of phone view) */}
      <nav
        aria-label="Mobile app navigation"
        className="fixed bottom-0 inset-x-0 z-40 lg:hidden bg-[#FAF7F2]/95 backdrop-blur-md border-t border-[#E8DFC8] px-2 py-1.5 shadow-[0_-4px_20px_rgba(0,0,0,0.06)] select-none"
        style={{ paddingBottom: 'max(env(safe-area-inset-bottom), 0.5rem)' }}
      >
        <div className="flex items-center justify-around max-w-md mx-auto">
          {/* 1. Home */}
          <Link
            href="/"
            onClick={handleHomeClick}
            className={`flex flex-col items-center justify-center py-1 px-2 min-w-[56px] transition-colors ${activeSection === 'home' ? 'text-[#8F6E3B]' : 'text-[#6B533E] hover:text-[#2C2114]'
              }`}
          >
            <Home className="w-5 h-5 stroke-[2]" />
            <span className="text-[10px] font-semibold mt-0.5">Home</span>
          </Link>

          {/* 2. Templates */}
          <Link
            href="/templates"
            onClick={handleTemplatesClick}
            className={`flex flex-col items-center justify-center py-1 px-2 min-w-[56px] transition-colors ${activeSection === 'templates' ? 'text-[#8F6E3B]' : 'text-[#6B533E] hover:text-[#2C2114]'
              }`}
          >
            <LayoutGrid className="w-5 h-5 stroke-[2]" />
            <span className="text-[10px] font-semibold mt-0.5">Templates</span>
          </Link>

          {/* 3. Create (App Highlight Button) */}
          <Link
            href="/customize/tpl-wedding-navy-01"
            onClick={handleCreateClick}
            className="flex flex-col items-center justify-center -mt-4 group"
          >
            <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-[#8F6E3B] to-[#C5A059] text-white flex items-center justify-center shadow-lg shadow-[#8F6E3B]/30 group-hover:scale-105 transition-transform">
              <PenLine className="w-5 h-5 stroke-[2.2]" />
            </div>
            <span className="text-[10px] font-bold text-[#8F6E3B] mt-0.5">Create</span>
          </Link>

          {/* 4. Cart */}
          <Link
            href="/cart"
            className={`flex flex-col items-center justify-center py-1 px-2 min-w-[56px] relative transition-colors ${pathname === '/cart' ? 'text-[#8F6E3B]' : 'text-[#6B533E] hover:text-[#2C2114]'
              }`}
          >
            <div className="relative">
              <ShoppingBag className="w-5 h-5 stroke-[2]" />
              {totalItems > 0 && (
                <span className="absolute -top-1.5 -right-2 w-4 h-4 rounded-full bg-[#B62A42] text-white text-[9px] font-bold flex items-center justify-center shadow-xs">
                  {totalItems}
                </span>
              )}
            </div>
            <span className="text-[10px] font-semibold mt-0.5">Cart</span>
          </Link>

          {/* 5. Menu (Opens Bottom Sheet) */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            className={`flex flex-col items-center justify-center py-1 px-2 min-w-[56px] transition-colors cursor-pointer ${mobileMenuOpen ? 'text-[#8F6E3B]' : 'text-[#6B533E] hover:text-[#2C2114]'
              }`}
            aria-label="Open mobile menu"
          >
            <Menu className="w-5 h-5 stroke-[2]" />
            <span className="text-[10px] font-semibold mt-0.5">Menu</span>
          </button>
        </div>
      </nav>

      {/* MOBILE APPLICATION BOTTOM SHEET DRAWER */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50">
          {/* Soft Dark Backdrop */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
            onClick={() => setMobileMenuOpen(false)}
          />

          {/* Bottom Sheet Card */}
          <div
            className="fixed inset-x-0 bottom-0 z-50 bg-[#FAF7F2] border-t border-[#DFCEAF] rounded-t-3xl shadow-2xl p-5 pb-8 space-y-4 animate-in slide-in-from-bottom duration-300 max-h-[85vh] overflow-y-auto"
            style={{ paddingBottom: 'max(env(safe-area-inset-bottom), 2rem)' }}
          >
            {/* Pull Bar Indicator */}
            <div className="w-12 h-1.5 bg-[#D5C4A6] rounded-full mx-auto" />

            {/* Sheet Header */}
            <div className="flex items-center justify-between pb-3 border-b border-[#E8DFC8]">
              <div className="flex items-center gap-2.5">
                <Image
                  src="/logo.webp?v=3"
                  alt="You Are Mine"
                  width={32}
                  height={32}
                  className="h-8 w-auto object-contain"
                />
                <div>
                  <span className="font-serif text-sm font-bold tracking-wider text-[#1C2C24] block">
                    YOU ARE MINE
                  </span>
                  <span className="text-[10px] text-[#8F6E3B]">Digital Invitation Studio</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                className="w-8 h-8 rounded-full bg-[#EFE7D5] hover:bg-[#E4D9C5] text-[#49341F] flex items-center justify-center transition-colors cursor-pointer"
                aria-label="Close menu"
              >
                <X className="w-4 h-4 stroke-[2]" />
              </button>
            </div>

            {/* Main Navigation Links */}
            <div className="space-y-1.5 pt-1">
              <Link
                href="/"
                onClick={(e) => {
                  setMobileMenuOpen(false);
                  handleHomeClick(e);
                }}
                className={`flex items-center gap-3 px-3.5 py-2.5 text-xs font-medium rounded-xl transition-colors ${activeSection === 'home'
                    ? 'bg-[#8F6E3B]/10 text-[#8F6E3B] font-bold border-l-3 border-[#8F6E3B]'
                    : 'text-[#49341F] hover:bg-[#F3EDE1]'
                  }`}
              >
                <Home className="w-4.5 h-4.5 stroke-[1.8]" />
                <span className="text-xs">Home</span>
              </Link>

              <Link
                href="/templates"
                onClick={(e) => {
                  setMobileMenuOpen(false);
                  handleTemplatesClick(e);
                }}
                className={`flex items-center gap-3 px-3.5 py-2.5 text-xs font-medium rounded-xl transition-colors ${activeSection === 'templates'
                    ? 'bg-[#8F6E3B]/10 text-[#8F6E3B] font-bold border-l-3 border-[#8F6E3B]'
                    : 'text-[#49341F] hover:bg-[#F3EDE1]'
                  }`}
              >
                <LayoutGrid className="w-4.5 h-4.5 stroke-[1.8]" />
                <span className="text-xs">Invitation Templates</span>
              </Link>

              <Link
                href="/templates"
                onClick={(e) => {
                  setMobileMenuOpen(false);
                  handleOccasionsClick(e);
                }}
                className={`flex items-center gap-3 px-3.5 py-2.5 text-xs font-medium rounded-xl transition-colors ${activeSection === 'occasions'
                    ? 'bg-[#8F6E3B]/10 text-[#8F6E3B] font-bold border-l-3 border-[#8F6E3B]'
                    : 'text-[#49341F] hover:bg-[#F3EDE1]'
                  }`}
              >
                <Calendar className="w-4.5 h-4.5 stroke-[1.8]" />
                <span className="text-xs">By Occasion</span>
              </Link>

              <Link
                href="/customize/tpl-wedding-navy-01"
                onClick={(e) => {
                  setMobileMenuOpen(false);
                  handleCreateClick(e);
                }}
                className={`flex items-center gap-3 px-3.5 py-2.5 text-xs font-medium rounded-xl transition-colors ${activeSection === 'create'
                    ? 'bg-[#8F6E3B]/10 text-[#8F6E3B] font-bold border-l-3 border-[#8F6E3B]'
                    : 'text-[#49341F] hover:bg-[#F3EDE1]'
                  }`}
              >
                <PenLine className="w-4.5 h-4.5 stroke-[1.8]" />
                <span className="text-xs">Create Your Page</span>
              </Link>

              <Link
                href="/pricing"
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-3.5 py-2.5 text-xs font-medium rounded-xl transition-colors ${activeSection === 'pricing'
                    ? 'bg-[#8F6E3B]/10 text-[#8F6E3B] font-bold border-l-3 border-[#8F6E3B]'
                    : 'text-[#49341F] hover:bg-[#F3EDE1]'
                  }`}
              >
                <Tag className="w-4.5 h-4.5 stroke-[1.8]" />
                <span className="text-xs">Pricing &amp; Plans</span>
              </Link>

              <Link
                href="/wishlist"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between px-3.5 py-2.5 text-xs font-medium rounded-xl text-[#49341F] hover:bg-[#F3EDE1] transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Heart className="w-4.5 h-4.5 stroke-[1.8]" />
                  <span>Wishlist</span>
                </div>
                {totalWishlist > 0 && (
                  <span className="px-2 py-0.5 rounded-full bg-[#B62A42] text-white text-[10px] font-bold">
                    {totalWishlist}
                  </span>
                )}
              </Link>

              <Link
                href="/cart"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between px-3.5 py-2.5 text-xs font-medium rounded-xl text-[#49341F] hover:bg-[#F3EDE1] transition-colors"
              >
                <div className="flex items-center gap-3">
                  <ShoppingBag className="w-4.5 h-4.5 stroke-[1.8]" />
                  <span>My Cart</span>
                </div>
                {totalItems > 0 && (
                  <span className="px-2 py-0.5 rounded-full bg-[#8F6E3B] text-white text-[10px] font-bold">
                    {totalItems} items
                  </span>
                )}
              </Link>
            </div>

            {/* Quick Occasion Shortcuts */}
            <div className="pt-2 border-t border-[#E8DFC8]">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#8F6E3B] block mb-2">
                Popular Occasions
              </span>
              <div className="flex items-center gap-1.5 flex-wrap">
                {occasionsList.slice(0, 5).map((occ) => {
                  const slug = occ.name.toLowerCase().replace(/['\s]+/g, '-').replace(/^-|-$/g, '');
                  return (
                    <Link
                      key={occ.name}
                      href={`/occasions/${slug}`}
                      onClick={() => setMobileMenuOpen(false)}
                      className="px-2.5 py-1 rounded-full bg-[#F2ECE0] text-[#5C4523] text-[10.5px] font-medium hover:bg-[#EAE2D2] transition-colors"
                    >
                      {occ.name}
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Account Login CTA */}
            <div className="pt-2">
              <Link
                href="/account"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-[#1C2C24] to-[#2D4539] hover:from-[#121c17] hover:to-[#1C2C24] text-white text-xs font-bold transition-all shadow-md active:scale-[0.99]"
              >
                <User className="w-4 h-4 stroke-[1.8]" />
                <span>Login to My Account</span>
                <ArrowRight className="w-3.5 h-3.5 stroke-[1.8]" />
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
