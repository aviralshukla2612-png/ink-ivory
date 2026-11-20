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

  // Hide global e-commerce navbar on admin portal, public invitations, template previews, and customize studio
  if (
    pathname &&
    (pathname.startsWith('/admin') ||
      pathname.startsWith('/invite') ||
      pathname.startsWith('/template-01') ||
      pathname.startsWith('/template-02') ||
      pathname.startsWith('/template-03') ||
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
    <header className="sticky top-0 z-50 w-full h-[88px] sm:h-[98px] lg:h-[108px] bg-[#F8F4EC] border-b border-[#EDE2CF] flex items-center shadow-2xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex items-center justify-between gap-4">

          {/* LEFT: Logo (Prominent & Luxurious) */}
          <div className="flex items-center py-1 flex-shrink-0">
            <Link href="/" onClick={handleHomeClick} className="group flex items-center focus:outline-none">
              <Image
                src="/logo.webp"
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

          {/* MOBILE CONTROLS */}
          <div className="flex lg:hidden items-center gap-3">
            {/* Mobile Wishlist */}
            <Link href="/wishlist" className="relative p-1 text-[#2E2014]">
              <Heart className="w-[18px] h-[18px] stroke-[1.8]" />
              {totalWishlist > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-[#1C2C24] text-white text-[9px] font-semibold w-3.5 h-3.5 rounded-full flex items-center justify-center">
                  {totalWishlist}
                </span>
              )}
            </Link>

            {/* Mobile Cart */}
            <Link href="/cart" className="relative p-1 text-[#2E2014]">
              <ShoppingBag className="w-[18px] h-[18px] stroke-[1.8]" />
              {totalItems > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-[#1C2C24] text-white text-[9px] font-semibold w-3.5 h-3.5 rounded-full flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </Link>

            {/* Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-1 text-[#2E2014] hover:text-[#A77B35] focus:outline-none"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* MOBILE NAVIGATION DRAWER */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-[#EDE2CF] mt-2 pt-3 pb-4 space-y-1.5 bg-[#F8F4EC] animate-in fade-in duration-100">
            <Link
              href="/"
              onClick={(e) => {
                setMobileMenuOpen(false);
                handleHomeClick(e);
              }}
              className={`flex items-center gap-2.5 px-3 py-2 text-xs font-medium rounded-lg transition-colors ${activeSection === 'home'
                  ? 'bg-[#EDE2CF]/60 text-[#1C2C24] font-semibold border-l-2 border-[#C5A059]'
                  : 'text-[#49341F] hover:bg-[#F3EDE1]'
                }`}
            >
              <Home className="w-4 h-4 stroke-[1.8]" />
              <span>Home</span>
            </Link>

            <Link
              href="/templates"
              onClick={(e) => {
                setMobileMenuOpen(false);
                handleTemplatesClick(e);
              }}
              className={`flex items-center gap-2.5 px-3 py-2 text-xs font-medium rounded-lg transition-colors ${activeSection === 'templates'
                  ? 'bg-[#EDE2CF]/60 text-[#1C2C24] font-semibold border-l-2 border-[#C5A059]'
                  : 'text-[#49341F] hover:bg-[#F3EDE1]'
                }`}
            >
              <LayoutGrid className="w-4 h-4 stroke-[1.8]" />
              <span>Invitation Templates</span>
            </Link>

            <Link
              href="/templates"
              onClick={(e) => {
                setMobileMenuOpen(false);
                handleOccasionsClick(e);
              }}
              className={`flex items-center gap-2.5 px-3 py-2 text-xs font-medium rounded-lg transition-colors ${activeSection === 'occasions'
                  ? 'bg-[#EDE2CF]/60 text-[#1C2C24] font-semibold border-l-2 border-[#C5A059]'
                  : 'text-[#49341F] hover:bg-[#F3EDE1]'
                }`}
            >
              <Calendar className="w-4 h-4 stroke-[1.8]" />
              <span>By Occasion</span>
            </Link>

            <Link
              href="/customize/tpl-wedding-navy-01"
              onClick={(e) => {
                setMobileMenuOpen(false);
                handleCreateClick(e);
              }}
              className={`flex items-center gap-2.5 px-3 py-2 text-xs font-medium rounded-lg transition-colors ${activeSection === 'create'
                  ? 'bg-[#EDE2CF]/60 text-[#1C2C24] font-semibold border-l-2 border-[#C5A059]'
                  : 'text-[#49341F] hover:bg-[#F3EDE1]'
                }`}
            >
              <PenLine className="w-4 h-4 stroke-[1.8]" />
              <span>Create Your Page</span>
            </Link>

            <Link
              href="/pricing"
              onClick={() => setMobileMenuOpen(false)}
              className={`flex items-center gap-2.5 px-3 py-2 text-xs font-medium rounded-lg transition-colors ${activeSection === 'pricing'
                  ? 'bg-[#EDE2CF]/60 text-[#1C2C24] font-semibold border-l-2 border-[#C5A059]'
                  : 'text-[#49341F] hover:bg-[#F3EDE1]'
                }`}
            >
              <Tag className="w-4 h-4 stroke-[1.8]" />
              <span>Pricing</span>
            </Link>

            <div className="pt-2 px-1">
              <Link
                href="/account"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full flex items-center justify-center gap-2 py-2 rounded-full bg-[#1C2C24] text-white text-xs font-medium hover:bg-[#121c17] transition-all shadow-xs"
              >
                <User className="w-4 h-4 stroke-[1.8]" />
                <span>Login to Account</span>
                <ArrowRight className="w-3.5 h-3.5 stroke-[1.8]" />
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
