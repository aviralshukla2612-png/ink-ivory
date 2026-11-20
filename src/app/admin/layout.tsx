'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Layers,
  Sparkles,
  Tag,
  Users,
  FileText,
  Globe,
  ShoppingBag,
  Percent,
  Image as LucideImage,
  LifeBuoy,
  ShieldAlert,
  FileCode,
  Settings,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
  Search,
  ExternalLink,
  LogOut,
  Lock,
  Loader2,
  ShieldCheck,
  User,
  AlertCircle,
} from 'lucide-react';
import { AdminRole, AdminPermission } from '@/lib/security/rbac';
import { AdminProvider, useAdmin } from '@/context/AdminContext';

// Navigation section definition
interface NavItem {
  name: string;
  href: string;
  icon: React.ElementType;
  permission?: AdminPermission;
  badge?: string;
}

interface NavSection {
  title: string;
  items: NavItem[];
}

const NAV_SECTIONS: NavSection[] = [
  {
    title: 'Core Management',
    items: [
      { name: 'Dashboard', href: '/admin', icon: LayoutDashboard, permission: 'DASHBOARD_VIEW' },
      { name: 'Templates Catalog', href: '/admin/templates', icon: Layers, permission: 'TEMPLATES_VIEW' },
      { name: 'Section Builder', href: '/admin/builder', icon: Sparkles, permission: 'TEMPLATES_MANAGE', badge: 'v2' },
      { name: 'Categories', href: '/admin/categories', icon: Tag, permission: 'CATEGORIES_MANAGE' },
    ],
  },
  {
    title: 'Customer Relations',
    items: [
      { name: 'Customers', href: '/admin/customers', icon: Users, permission: 'CUSTOMERS_VIEW' },
      { name: 'Customer Drafts', href: '/admin/drafts', icon: FileText, permission: 'DRAFTS_VIEW' },
      { name: 'Live Publications', href: '/admin/publications', icon: Globe, permission: 'PUBLICATIONS_VIEW' },
    ],
  },
  {
    title: 'Commerce & Finance',
    items: [
      { name: 'Orders & Payments', href: '/admin/orders', icon: ShoppingBag, permission: 'FINANCIALS_VIEW' },
      { name: 'Coupons & Promos', href: '/admin/coupons', icon: Percent, permission: 'COUPONS_MANAGE' },
    ],
  },
  {
    title: 'Operations & Staff',
    items: [
      { name: 'Media Library', href: '/admin/media', icon: LucideImage, permission: 'MEDIA_MANAGE' },
      { name: 'Support Inquiries', href: '/admin/support', icon: LifeBuoy, permission: 'SUPPORT_MANAGE' },
      { name: 'Staff & Roles', href: '/admin/staff', icon: ShieldAlert, permission: 'STAFF_MANAGE' },
      { name: 'Audit Logs', href: '/admin/audit', icon: FileCode, permission: 'AUDIT_LOGS_VIEW' },
      { name: 'Platform Settings', href: '/admin/settings', icon: Settings, permission: 'SETTINGS_MANAGE' },
    ],
  },
];

function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { actor, isAuthenticated, loading, hasPermission, logout, checkSession } = useAdmin();

  // Shell UI state
  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(false);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Login form state
  const [loginMode, setLoginMode] = useState<'credentials' | 'key'>('credentials');
  const [emailInput, setEmailInput] = useState<string>('admin@youaremine.com');
  const [passwordInput, setPasswordInput] = useState<string>('');
  const [keyInput, setKeyInput] = useState<string>('');
  const [authError, setAuthError] = useState<string | null>(null);
  const [authenticating, setAuthenticating] = useState<boolean>(false);

  // Handle Login submission
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthenticating(true);
    setAuthError(null);

    const payload =
      loginMode === 'credentials'
        ? { email: emailInput.trim(), password: passwordInput.trim() }
        : { adminKey: keyInput.trim() };

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(payload),
      });
      const data = await res.json();

      if (res.ok && data.success) {
        setPasswordInput('');
        setKeyInput('');
        await checkSession();
      } else {
        setAuthError(data.error || 'Authentication rejected. Access denied.');
      }
    } catch (err) {
      setAuthError('Authentication server unreachable. Please verify network.');
    } finally {
      setAuthenticating(false);
    }
  };

  // Breadcrumbs generation
  const getBreadcrumbs = () => {
    const parts = pathname.split('/').filter(Boolean);
    if (parts.length <= 1) return [{ label: 'Dashboard', href: '/admin' }];

    return parts.map((part, index) => {
      const href = '/' + parts.slice(0, index + 1).join('/');
      const label = part.charAt(0).toUpperCase() + part.slice(1).replace(/-/g, ' ');
      return { label, href };
    });
  };

  // Loading Screen
  if (loading) {
    return (
      <div className="min-h-screen bg-[#1A1612] flex flex-col items-center justify-center p-4">
        <div className="w-12 h-12 rounded-full border-2 border-[#D4AF37] border-t-transparent animate-spin mb-4" />
        <p className="font-serif text-[#FAF8F5] text-sm tracking-widest uppercase">
          You Are Mine Administrative Portal
        </p>
        <span className="text-[11px] text-[#A69B8D] mt-1">Verifying encrypted security credentials...</span>
      </div>
    );
  }

  // Unauthenticated Gate Screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#14110E] flex items-center justify-center p-4 relative overflow-hidden">
        {/* Ambient background glow */}
        <div className="absolute top-1/4 -left-20 w-96 h-96 bg-[#D4AF37]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-[#641A2A]/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-md w-full bg-[#1C1814] border border-[#382E24] rounded-3xl p-8 sm:p-10 shadow-2xl text-center">
          {/* Brand Monogram */}
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#D4AF37] to-[#8C6D23] flex items-center justify-center mx-auto mb-5 shadow-lg border border-[#F3E7C4]/30">
            <Lock className="w-7 h-7 text-[#1C1814]" />
          </div>

          <span className="text-[11px] uppercase tracking-[0.3em] font-semibold text-[#D4AF37] block mb-2">
            You Are Mine Security Gateway
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl font-medium text-[#FAF8F5] mb-2 tracking-tight">
            Executive Admin Access
          </h1>
          <p className="text-xs text-[#A69B8D] leading-relaxed mb-5 font-normal">
            Sign in with your executive credentials to manage invitation templates, customer orders, and financial operations.
          </p>

          {/* Quick Credential Hint Banner */}
          <div className="mb-5 p-3 rounded-xl bg-[#28221B]/80 border border-[#D4AF37]/30 text-left">
            <div className="text-[10px] uppercase tracking-wider font-semibold text-[#D4AF37] flex items-center gap-1.5 mb-1">
              <Sparkles className="w-3 h-3 text-[#D4AF37]" />
              Executive Default Credentials
            </div>
            <div className="text-[11px] text-[#FAF8F5] font-mono flex flex-col gap-0.5">
              <div>Email: <span className="text-[#D4AF37]">admin@youaremine.com</span></div>
              <div>Password: <span className="text-[#D4AF37]">admin123</span></div>
            </div>
          </div>

          <form onSubmit={handleLoginSubmit} className="space-y-4 text-left">
            {loginMode === 'credentials' ? (
              <>
                <div>
                  <label className="block text-[11px] uppercase tracking-wider font-semibold text-[#C4B7A6] mb-1.5">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    placeholder="admin@youaremine.com"
                    required
                    className="w-full px-4 py-3 rounded-xl bg-[#28221B] border border-[#44382B] text-sm text-[#FAF8F5] placeholder-[#776B5D] focus:outline-none focus:ring-2 focus:ring-[#D4AF37] transition-all"
                  />
                </div>

                <div>
                  <label className="block text-[11px] uppercase tracking-wider font-semibold text-[#C4B7A6] mb-1.5">
                    Password
                  </label>
                  <input
                    type="password"
                    value={passwordInput}
                    onChange={(e) => setPasswordInput(e.target.value)}
                    placeholder="••••••••••••"
                    required
                    className="w-full px-4 py-3 rounded-xl bg-[#28221B] border border-[#44382B] text-sm text-[#FAF8F5] placeholder-[#776B5D] focus:outline-none focus:ring-2 focus:ring-[#D4AF37] transition-all"
                  />
                </div>
              </>
            ) : (
              <div>
                <label className="block text-[11px] uppercase tracking-wider font-semibold text-[#C4B7A6] mb-1.5">
                  Master Security Key
                </label>
                <input
                  type="password"
                  value={keyInput}
                  onChange={(e) => setKeyInput(e.target.value)}
                  placeholder="Enter secret authorization key"
                  required
                  className="w-full px-4 py-3 rounded-xl bg-[#28221B] border border-[#44382B] text-sm text-[#FAF8F5] placeholder-[#776B5D] focus:outline-none focus:ring-2 focus:ring-[#D4AF37] transition-all"
                />
              </div>
            )}

            {authError && (
              <div className="p-3 rounded-xl bg-red-950/60 border border-red-800 text-red-200 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
                <span>{authError}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={authenticating}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#B38F24] hover:from-[#E5C158] hover:to-[#C49E33] text-[#1C1814] font-semibold text-xs uppercase tracking-widest transition-all shadow-lg hover:shadow-[#D4AF37]/20 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {authenticating ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Verifying Credentials...</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  <span>Unlock Admin Portal</span>
                </>
              )}
            </button>

            <div className="text-center pt-2">
              <button
                type="button"
                onClick={() => {
                  setLoginMode(loginMode === 'credentials' ? 'key' : 'credentials');
                  setAuthError(null);
                }}
                className="text-[11px] text-[#A69B8D] hover:text-[#D4AF37] underline transition-colors"
              >
                {loginMode === 'credentials'
                  ? 'Or sign in using Master Security Key'
                  : 'Or sign in using Email & Password'}
              </button>
            </div>
          </form>

          <div className="mt-8 pt-6 border-t border-[#2C241D] flex items-center justify-center gap-2 text-[10.5px] text-[#7A6E5F]">
            <Lock className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>Protected by HMAC-SHA256 Token Signing &amp; Rate Limiting</span>
          </div>
        </div>
      </div>
    );
  }

  // Role Badge Color Picker
  const getRoleBadgeStyle = (role: AdminRole) => {
    switch (role) {
      case 'SUPER_ADMIN':
        return 'bg-[#D4AF37]/15 text-[#D4AF37] border-[#D4AF37]/30';
      case 'ADMIN':
        return 'bg-amber-500/15 text-amber-300 border-amber-500/30';
      case 'FINANCE':
        return 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30';
      case 'CONTENT_MANAGER':
        return 'bg-purple-500/15 text-purple-300 border-purple-500/30';
      case 'SUPPORT':
        return 'bg-blue-500/15 text-blue-300 border-blue-500/30';
      default:
        return 'bg-[#D4AF37]/15 text-[#D4AF37] border-[#D4AF37]/30';
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F2EB] flex flex-col md:flex-row antialiased text-[#2C2114]">
      {/* ============================================================== */}
      {/* DESKTOP SIDEBAR                                                */}
      {/* ============================================================== */}
      <aside
        className={`hidden md:flex flex-col bg-[#1A1612] border-r border-[#2B231B] text-[#FAF8F5] transition-all duration-300 select-none z-30 shrink-0 ${
          sidebarCollapsed ? 'w-20' : 'w-72'
        }`}
      >
        {/* Top Brand Monogram */}
        <div className="h-20 flex items-center justify-between px-5 border-b border-[#2B231B]">
          <Link href="/admin" className="flex items-center gap-3 overflow-hidden">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#D4AF37] to-[#8C6D23] flex items-center justify-center font-serif font-bold text-sm text-[#1C1814] shrink-0 shadow-md tracking-wider">
              YAM
            </div>
            {!sidebarCollapsed && (
              <div className="flex flex-col">
                <span className="font-serif tracking-[0.18em] font-medium text-sm text-[#FAF8F5] leading-tight">
                  YOU ARE MINE
                </span>
                <span className="text-[10px] text-[#A69B8D] uppercase tracking-wider font-sans">
                  Admin Portal
                </span>
              </div>
            )}
          </Link>

          <button
            type="button"
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="p-1.5 rounded-lg text-[#A69B8D] hover:text-[#FAF8F5] hover:bg-[#28221B] transition-colors cursor-pointer"
            title={sidebarCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
          >
            {sidebarCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Navigation Items (Scrollable) */}
        <div className="flex-1 overflow-y-auto px-3 py-6 space-y-6 scrollbar-thin scrollbar-thumb-[#2B231B]">
          {NAV_SECTIONS.map((section) => {
            const visibleItems = section.items.filter(
              (item) => !item.permission || hasPermission(item.permission)
            );

            if (visibleItems.length === 0) return null;

            return (
              <div key={section.title} className="space-y-1">
                {!sidebarCollapsed && (
                  <div className="px-3 pb-1 text-[10px] uppercase tracking-[0.2em] font-semibold text-[#827566]">
                    {section.title}
                  </div>
                )}

                {visibleItems.map((item) => {
                  const isActive = pathname === item.href;
                  const Icon = item.icon;

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      title={sidebarCollapsed ? item.name : undefined}
                      className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all group ${
                        isActive
                          ? 'bg-gradient-to-r from-[#D4AF37] to-[#B38F24] text-[#1C1814] font-semibold shadow-md'
                          : 'text-[#C7BCAD] hover:bg-[#28221B] hover:text-[#FAF8F5]'
                      }`}
                    >
                      <Icon
                        className={`w-4 h-4 shrink-0 transition-transform group-hover:scale-110 ${
                          isActive ? 'text-[#1C1814]' : 'text-[#A69B8D] group-hover:text-[#D4AF37]'
                        }`}
                      />
                      {!sidebarCollapsed && (
                        <div className="flex-1 flex items-center justify-between">
                          <span>{item.name}</span>
                          {item.badge && (
                            <span
                              className={`text-[9.5px] font-bold px-1.5 py-0.5 rounded-full uppercase tracking-wider ${
                                isActive
                                  ? 'bg-[#1C1814]/20 text-[#1C1814]'
                                  : 'bg-[#D4AF37]/20 text-[#D4AF37]'
                              }`}
                            >
                              {item.badge}
                            </span>
                          )}
                        </div>
                      )}
                    </Link>
                  );
                })}
              </div>
            );
          })}
        </div>

        {/* Sidebar Footer: Staff Card & Role */}
        <div className="p-4 border-t border-[#2B231B] bg-[#15120F]">
          {!sidebarCollapsed ? (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-[#2B231B] flex items-center justify-center text-[#D4AF37]">
                    <User className="w-4 h-4" />
                  </div>
                  <div className="flex flex-col overflow-hidden max-w-[130px]">
                    <span className="text-xs font-medium text-[#FAF8F5] truncate">
                      {actor?.email || 'admin@youaremine.com'}
                    </span>
                    <span
                      className={`text-[9.5px] font-semibold px-2 py-0.5 rounded-md border w-fit mt-0.5 uppercase tracking-wider ${getRoleBadgeStyle(
                        actor?.role || 'SUPER_ADMIN'
                      )}`}
                    >
                      {actor?.role || 'SUPER_ADMIN'}
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={logout}
                  title="Log Out"
                  className="p-2 rounded-lg text-[#A69B8D] hover:text-red-400 hover:bg-red-950/30 transition-colors cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-3">
              <button
                type="button"
                onClick={logout}
                title="Log Out"
                className="p-2 rounded-lg text-[#A69B8D] hover:text-red-400 hover:bg-red-950/30 transition-colors cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </aside>

      {/* ============================================================== */}
      {/* MOBILE DRAWER (OVERLAY)                                        */}
      {/* ============================================================== */}
      {mobileDrawerOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div
            className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
            onClick={() => setMobileDrawerOpen(false)}
          />

          <div className="relative w-4/5 max-w-xs bg-[#1A1612] text-[#FAF8F5] flex flex-col h-full z-10 shadow-2xl">
            <div className="h-16 flex items-center justify-between px-5 border-b border-[#2B231B]">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#D4AF37] to-[#8C6D23] flex items-center justify-center font-serif font-bold text-xs text-[#1C1814] tracking-wider">
                  YAM
                </div>
                <span className="font-serif tracking-widest text-sm text-[#FAF8F5]">
                  YOU ARE MINE
                </span>
              </div>
              <button
                type="button"
                onClick={() => setMobileDrawerOpen(false)}
                className="p-1.5 rounded-lg text-[#A69B8D] hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-4 py-6 space-y-6">
              {NAV_SECTIONS.map((section) => (
                <div key={section.title} className="space-y-1">
                  <div className="px-3 pb-1 text-[10px] uppercase tracking-wider font-semibold text-[#827566]">
                    {section.title}
                  </div>
                  {section.items.map((item) => {
                    const isActive = pathname === item.href;
                    const Icon = item.icon;
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setMobileDrawerOpen(false)}
                        className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium ${
                          isActive
                            ? 'bg-[#D4AF37] text-[#1C1814] font-semibold'
                            : 'text-[#C7BCAD] hover:bg-[#28221B]'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                        <span>{item.name}</span>
                      </Link>
                    );
                  })}
                </div>
              ))}
            </div>

            <div className="p-4 border-t border-[#2B231B] flex items-center justify-between">
              <span className="text-xs text-[#A69B8D]">{actor?.email}</span>
              <button onClick={logout} className="text-xs text-red-400 font-semibold">
                Sign Out
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MAIN APPLICATION SHELL                                         */}
      {/* ============================================================== */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Header Bar */}
        <header className="h-16 sm:h-20 bg-[#FCFAF6] border-b border-[#E8DFC8] px-4 sm:px-8 flex items-center justify-between sticky top-0 z-20 shadow-xs">
          {/* Left: Mobile Toggle & Breadcrumbs */}
          <div className="flex items-center gap-3 sm:gap-4">
            <button
              type="button"
              onClick={() => setMobileDrawerOpen(true)}
              className="md:hidden p-2 rounded-lg text-[#695034] hover:bg-[#EDE2CF] transition-colors"
              aria-label="Open Navigation"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-1.5 text-xs text-[#7A634E]">
              <span className="font-semibold text-[#8F6E3B]">Admin</span>
              {getBreadcrumbs().map((b, idx) => (
                <React.Fragment key={b.href}>
                  <span className="text-[#BAA790]">/</span>
                  <span
                    className={
                      idx === getBreadcrumbs().length - 1
                        ? 'font-bold text-[#2C2114]'
                        : 'text-[#7A634E]'
                    }
                  >
                    {b.label}
                  </span>
                </React.Fragment>
              ))}
            </div>
          </div>

          {/* Right: Quick Search, Role Badge & Public Store Link */}
          <div className="flex items-center gap-3 sm:gap-4">
            {/* Quick Search */}
            <div className="relative hidden lg:block w-64">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#9E8975]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Universal search..."
                className="w-full pl-8 pr-3 py-1.5 text-xs rounded-full bg-[#F4EFE6] border border-[#DFCEAF] text-[#2C2114] placeholder-[#9E8975] focus:outline-none focus:ring-1 focus:ring-[#8F6E3B]"
              />
            </div>

            {/* View Public Store */}
            <Link
              href="/"
              target="_blank"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#EDE2CF]/60 hover:bg-[#EDE2CF] text-[#695034] text-[11px] font-medium transition-colors"
            >
              <span>Store</span>
              <ExternalLink className="w-3 h-3" />
            </Link>

            {/* Role Chip */}
            <span
              className={`hidden sm:inline-block text-[10px] font-bold px-2.5 py-1 rounded-full border uppercase tracking-wider ${getRoleBadgeStyle(
                actor?.role || 'SUPER_ADMIN'
              )}`}
            >
              {actor?.role || 'SUPER_ADMIN'}
            </span>

            {/* Quick Logout (Desktop) */}
            <button
              type="button"
              onClick={logout}
              className="hidden sm:flex items-center gap-1 text-xs text-[#7A634E] hover:text-red-700 transition-colors cursor-pointer px-2 py-1 rounded-lg"
              title="Log Out"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="text-[11px]">Logout</span>
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminProvider>
      <AdminShell>{children}</AdminShell>
    </AdminProvider>
  );
}
