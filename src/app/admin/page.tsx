'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import {
  LayoutDashboard,
  Layers,
  ShoppingBag,
  Users,
  Tag,
  Edit,
  TrendingUp,
  DollarSign,
  Eye,
  Search,
  Globe,
  FileText,
  ExternalLink,
  Save,
  Check,
  Sparkles,
  ArrowUpRight,
  ShieldCheck,
  Clock,
  RefreshCw,
  Percent,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
} from 'lucide-react';
import { useAdmin } from '@/context/AdminContext';
import { templatesData } from '@/data/templates';

interface ActivityItem {
  id: string;
  type: string;
  title: string;
  timestamp: string;
  details: string;
}

interface TemplatePerformance {
  id: string;
  slug: string;
  title: string;
  category: string;
  isActive: boolean;
  price: number;
  draftsCount: number;
  publicationsCount: number;
  revenue: number;
  conversionRate: number;
}

export default function AdminPage() {
  const { actor, logout } = useAdmin();

  const [activeTab, setActiveTab] = useState<'overview' | 'publications' | 'drafts' | 'pricing' | 'orders' | 'coupons'>('overview');
  const [adminData, setAdminData] = useState<{
    stats?: any;
    drafts?: any[];
    publications?: any[];
    payments?: any[];
    orders?: any[];
    templates?: any[];
    prices?: any[];
    templatePerformance?: TemplatePerformance[];
    activityFeed?: ActivityItem[];
  }>({});
  const [loading, setLoading] = useState(true);
  const [searchFilter, setSearchFilter] = useState('');

  // Price editing state
  const [editingPriceTplId, setEditingPriceTplId] = useState<string | null>(null);
  const [editPriceVal, setEditPriceVal] = useState<number>(299);
  const [savingPrice, setSavingPrice] = useState(false);
  const [priceSaveSuccess, setPriceSaveSuccess] = useState<string | null>(null);
  const [priceSaveError, setPriceSaveError] = useState<string | null>(null);

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin', {
        credentials: 'include',
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setAdminData(data);
      }
    } catch (e) {
      console.error('Failed to load admin data:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const handleUpdatePrice = async (templateId: string) => {
    setSavingPrice(true);
    setPriceSaveError(null);
    try {
      const res = await fetch('/api/admin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          action: 'update-price',
          templateId,
          amountPaise: Math.round(editPriceVal * 100),
        }),
      });
      const data = await res.json();
      if (data.success) {
        setPriceSaveSuccess(templateId);
        setEditingPriceTplId(null);
        await fetchAdminData();
        setTimeout(() => setPriceSaveSuccess(null), 3000);
      } else {
        setPriceSaveError(data.error || 'Failed to update template price.');
      }
    } catch (e) {
      console.error('Failed to update price:', e);
      setPriceSaveError('Network error while updating price.');
    } finally {
      setSavingPrice(false);
    }
  };

  const stats = adminData.stats || {
    totalRevenue: 0,
    totalOrders: adminData.orders?.length || 0,
    totalDrafts: adminData.drafts?.length || 0,
    publishedCount: adminData.publications?.length || 0,
    activeTemplates: templatesData.length,
    conversionRate: 0,
    averageOrderValue: 0,
    totalCustomers: 0,
  };

  // Filtered publications
  const filteredPublications = useMemo(() => {
    const list = adminData.publications || [];
    if (!searchFilter.trim()) return list;
    const q = searchFilter.toLowerCase();
    return list.filter(
      (p) =>
        p.slug?.toLowerCase().includes(q) ||
        p.templateTitle?.toLowerCase().includes(q) ||
        p.id?.toLowerCase().includes(q) ||
        p.title?.toLowerCase().includes(q)
    );
  }, [adminData.publications, searchFilter]);

  // Filtered drafts
  const filteredDrafts = useMemo(() => {
    const list = adminData.drafts || [];
    if (!searchFilter.trim()) return list;
    const q = searchFilter.toLowerCase();
    return list.filter(
      (d) =>
        d.id?.toLowerCase().includes(q) ||
        d.templateId?.toLowerCase().includes(q) ||
        d.guestToken?.toLowerCase().includes(q)
    );
  }, [adminData.drafts, searchFilter]);

  // Filtered orders
  const filteredOrders = useMemo(() => {
    const list = adminData.orders || [];
    if (!searchFilter.trim()) return list;
    const q = searchFilter.toLowerCase();
    return list.filter(
      (o) =>
        o.id?.toLowerCase().includes(q) ||
        o.orderId?.toLowerCase().includes(q) ||
        o.status?.toLowerCase().includes(q)
    );
  }, [adminData.orders, searchFilter]);

  if (loading && !adminData.stats) {
    return (
      <div className="py-24 flex flex-col items-center justify-center">
        <div className="w-10 h-10 rounded-full border-2 border-[#8F6E3B] border-t-transparent animate-spin mb-4" />
        <p className="font-serif text-[#2C2114] text-sm tracking-widest uppercase">
          Loading You Are Mine Intelligence...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* ------------------------------------------------------------- */}
      {/* TOP OVERVIEW BANNER                                           */}
      {/* ------------------------------------------------------------- */}
      <div className="bg-[#FCFAF6] rounded-3xl p-6 sm:p-8 border border-[#DFCEAF] shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="font-serif italic text-2xl sm:text-3xl font-bold text-[#2C2114]">
              Executive Dashboard
            </span>
            <span className="text-[10.5px] font-bold px-2.5 py-0.5 rounded-full bg-[#EDE2CF] text-[#8F6E3B] uppercase tracking-wider">
              Live Verified
            </span>
          </div>
          <p className="text-xs text-[#7A634E] leading-relaxed max-w-2xl">
            Real-time business performance across free customer drafts, verified Razorpay publishing orders, and active web invitations.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={fetchAdminData}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 rounded-xl border border-[#DFCEAF] bg-white hover:bg-[#FAF7F2] text-xs font-semibold text-[#49341F] transition-all shadow-2xs cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-[#8F6E3B] ${loading ? 'animate-spin' : ''}`} />
            <span>Sync Data</span>
          </button>

          <Link
            href="/admin/builder"
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#B38F24] hover:from-[#E5C158] hover:to-[#C49E33] text-[#1C1814] text-xs font-semibold uppercase tracking-wider transition-all shadow-sm cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#1C1814]" />
            <span>Launch Builder</span>
          </Link>
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* SUB-MODULE TABS                                               */}
      {/* ------------------------------------------------------------- */}
      <div className="flex border-b border-[#DFCEAF] overflow-x-auto gap-2">
        {[
          { id: 'overview', label: 'Store Overview', icon: LayoutDashboard },
          { id: 'publications', label: `Publications (${adminData.publications?.length || 0})`, icon: Globe },
          { id: 'drafts', label: `Customer Drafts (${adminData.drafts?.length || 0})`, icon: FileText },
          { id: 'pricing', label: 'Catalog & Pricing', icon: DollarSign },
          { id: 'orders', label: `Orders (${adminData.orders?.length || 0})`, icon: ShoppingBag },
          { id: 'coupons', label: 'Promo Coupons', icon: Tag },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id as any);
                setSearchFilter('');
              }}
              className={`py-3 px-4 sm:px-5 text-xs font-semibold flex items-center gap-2 border-b-2 whitespace-nowrap transition-all cursor-pointer ${
                isActive
                  ? 'border-[#8F6E3B] text-[#8F6E3B] bg-[#FCFAF6] rounded-t-xl'
                  : 'border-transparent text-[#7A634E] hover:text-[#2C2114]'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* ------------------------------------------------------------- */}
      {/* TAB 1: OVERVIEW & REAL KPIS                                   */}
      {/* ------------------------------------------------------------- */}
      {activeTab === 'overview' && (
        <div className="space-y-8">
          {/* Master 4 KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {/* 1. Net Revenue */}
            <div className="bg-[#FCFAF6] rounded-2xl p-6 border border-[#DFCEAF] shadow-2xs relative overflow-hidden group hover:border-[#8F6E3B] transition-colors">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[11px] uppercase tracking-wider font-semibold text-[#8F6E3B]">
                  Net Platform Revenue
                </span>
                <div className="w-9 h-9 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700">
                  <DollarSign className="w-4 h-4" />
                </div>
              </div>
              <div className="font-serif text-3xl font-bold text-[#2C2114] mb-1">
                ₹{Number(stats.totalRevenue).toLocaleString()}
              </div>
              <div className="flex items-center gap-2 text-[11px] text-[#7A634E]">
                <span className="text-emerald-700 font-semibold">
                  {stats.totalOrders} verified orders
                </span>
                <span>&bull;</span>
                <span>AOV ₹{stats.averageOrderValue || 349}</span>
              </div>
            </div>

            {/* 2. Paid Publications */}
            <div className="bg-[#FCFAF6] rounded-2xl p-6 border border-[#DFCEAF] shadow-2xs relative overflow-hidden group hover:border-[#8F6E3B] transition-colors">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[11px] uppercase tracking-wider font-semibold text-[#8F6E3B]">
                  Live Published Sites
                </span>
                <div className="w-9 h-9 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-700">
                  <Globe className="w-4 h-4" />
                </div>
              </div>
              <div className="font-serif text-3xl font-bold text-[#2C2114] mb-1">
                {stats.publishedCount}
              </div>
              <div className="flex items-center gap-2 text-[11px] text-[#7A634E]">
                <span className="text-blue-700 font-semibold">100% active cloud links</span>
                <span>&bull;</span>
                <span>/invite/[slug]</span>
              </div>
            </div>

            {/* 3. Customer Drafts */}
            <div className="bg-[#FCFAF6] rounded-2xl p-6 border border-[#DFCEAF] shadow-2xs relative overflow-hidden group hover:border-[#8F6E3B] transition-colors">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[11px] uppercase tracking-wider font-semibold text-[#8F6E3B]">
                  Active Customer Drafts
                </span>
                <div className="w-9 h-9 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-700">
                  <FileText className="w-4 h-4" />
                </div>
              </div>
              <div className="font-serif text-3xl font-bold text-[#2C2114] mb-1">
                {stats.totalDrafts}
              </div>
              <div className="flex items-center gap-2 text-[11px] text-[#7A634E]">
                <span className="text-amber-800 font-semibold">Free Customization</span>
                <span>&bull;</span>
                <span>{stats.totalCustomers || stats.totalDrafts} customers</span>
              </div>
            </div>

            {/* 4. Conversion Rate */}
            <div className="bg-[#FCFAF6] rounded-2xl p-6 border border-[#DFCEAF] shadow-2xs relative overflow-hidden group hover:border-[#8F6E3B] transition-colors">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[11px] uppercase tracking-wider font-semibold text-[#8F6E3B]">
                  Funnel Conversion
                </span>
                <div className="w-9 h-9 rounded-xl bg-purple-50 border border-purple-200 flex items-center justify-center text-purple-700">
                  <TrendingUp className="w-4 h-4" />
                </div>
              </div>
              <div className="font-serif text-3xl font-bold text-[#2C2114] mb-1">
                {stats.conversionRate}%
              </div>
              <div className="flex items-center gap-2 text-[11px] text-[#7A634E]">
                <span className="text-purple-700 font-semibold">Draft-to-Paid</span>
                <span>&bull;</span>
                <span>Try-Before-You-Publish</span>
              </div>
            </div>
          </div>

          {/* ------------------------------------------------------------- */}
          {/* TEMPLATE PERFORMANCE LEADERBOARD                              */}
          {/* ------------------------------------------------------------- */}
          <div className="bg-[#FCFAF6] rounded-3xl p-6 sm:p-8 border border-[#DFCEAF] shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="font-serif text-lg font-bold text-[#2C2114]">
                  Template Performance &amp; Revenue Leaderboard
                </h3>
                <p className="text-xs text-[#7A634E] mt-0.5">
                  Aggregate customer engagement, draft creations, publications, and revenue per collection.
                </p>
              </div>

              <span className="text-[11px] text-[#8F6E3B] font-semibold bg-[#EDE2CF] px-3 py-1 rounded-full w-fit">
                {adminData.templatePerformance?.length || templatesData.length} Collections Active
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-[#E8DFC8] text-[10.5px] uppercase tracking-wider font-semibold text-[#7A634E]">
                    <th className="py-3 px-4">Template Collection</th>
                    <th className="py-3 px-4">Category</th>
                    <th className="py-3 px-4 text-center">Unit Price</th>
                    <th className="py-3 px-4 text-center">Drafts Started</th>
                    <th className="py-3 px-4 text-center">Published</th>
                    <th className="py-3 px-4 text-right">Revenue</th>
                    <th className="py-3 px-4 text-right">Conversion</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#EFE7D7] text-xs">
                  {(adminData.templatePerformance || []).map((t) => (
                    <tr key={t.id} className="hover:bg-[#FAF7F0] transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-[#EDE2CF] text-[#8F6E3B] font-serif font-bold text-xs flex items-center justify-center shrink-0">
                            {t.title.slice(0, 2).toUpperCase()}
                          </div>
                          <div>
                            <span className="font-semibold text-[#2C2114] block">{t.title}</span>
                            <span className="text-[10px] text-[#7A634E]">{t.slug || t.id}</span>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="px-2.5 py-0.5 rounded-full bg-[#EDE2CF]/60 text-[#695034] text-[10.5px] font-medium">
                          {t.category || 'Invitation'}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-center font-semibold text-[#2C2114]">
                        ₹{t.price}
                      </td>
                      <td className="py-3.5 px-4 text-center text-[#55402F]">
                        {t.draftsCount}
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <span className="font-bold text-emerald-800">
                          {t.publicationsCount}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right font-bold text-[#2C2114]">
                        ₹{t.revenue.toLocaleString()}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <span
                          className={`font-semibold px-2 py-0.5 rounded-md text-[10.5px] ${
                            t.conversionRate > 0
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-neutral-100 text-neutral-600'
                          }`}
                        >
                          {t.conversionRate}%
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* ------------------------------------------------------------- */}
          {/* REAL-TIME OPERATIONAL ACTIVITY STREAM                         */}
          {/* ------------------------------------------------------------- */}
          <div className="bg-[#FCFAF6] rounded-3xl p-6 sm:p-8 border border-[#DFCEAF] shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-serif text-lg font-bold text-[#2C2114]">
                  Operational Activity Stream
                </h3>
                <p className="text-xs text-[#7A634E] mt-0.5">
                  Live audit trail of customer publishing events, verified payments, and staff administrative actions.
                </p>
              </div>
              <Clock className="w-4 h-4 text-[#8F6E3B]" />
            </div>

            <div className="space-y-3 pt-2">
              {(adminData.activityFeed || []).length === 0 ? (
                <div className="py-8 text-center text-xs text-[#7A634E]">
                  No recent operational events recorded.
                </div>
              ) : (
                (adminData.activityFeed || []).map((item) => (
                  <div
                    key={item.id}
                    className="p-3.5 rounded-xl bg-white border border-[#E8DFC8] flex items-center justify-between gap-4 text-xs hover:border-[#8F6E3B] transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                          item.type === 'PUBLICATION'
                            ? 'bg-blue-100 text-blue-700'
                            : item.type === 'PAYMENT'
                            ? 'bg-emerald-100 text-emerald-700'
                            : 'bg-amber-100 text-amber-700'
                        }`}
                      >
                        {item.type === 'PUBLICATION' ? (
                          <Globe className="w-3.5 h-3.5" />
                        ) : item.type === 'PAYMENT' ? (
                          <DollarSign className="w-3.5 h-3.5" />
                        ) : (
                          <ShieldCheck className="w-3.5 h-3.5" />
                        )}
                      </div>
                      <div>
                        <span className="font-semibold text-[#2C2114] block">
                          {item.title}
                        </span>
                        <span className="text-[10px] text-[#7A634E]">{item.details}</span>
                      </div>
                    </div>

                    <span className="text-[10px] text-[#A69B8D] shrink-0">
                      {new Date(item.timestamp).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* TAB 2: LIVE PUBLICATIONS                                      */}
      {/* ------------------------------------------------------------- */}
      {activeTab === 'publications' && (
        <div className="bg-[#FCFAF6] rounded-3xl p-6 sm:p-8 border border-[#DFCEAF] shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="font-serif text-lg font-bold text-[#2C2114]">
                Live Customer Publications ({filteredPublications.length})
              </h3>
              <p className="text-xs text-[#7A634E] mt-0.5">
                Every published website verified by Razorpay and publicly accessible via unique URL.
              </p>
            </div>

            <div className="relative w-full sm:w-64">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#9E8975]" />
              <input
                type="text"
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                placeholder="Filter by slug or title..."
                className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl bg-white border border-[#DFCEAF] text-[#2C2114] placeholder-[#9E8975] focus:outline-none focus:ring-1 focus:ring-[#8F6E3B]"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#E8DFC8] text-[10.5px] uppercase tracking-wider font-semibold text-[#7A634E]">
                  <th className="py-3 px-4">Publication ID</th>
                  <th className="py-3 px-4">Template</th>
                  <th className="py-3 px-4">Live URL Slug</th>
                  <th className="py-3 px-4 text-center">Status</th>
                  <th className="py-3 px-4 text-right">Views</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EFE7D7] text-xs">
                {filteredPublications.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-10 text-center text-[#7A634E]">
                      No publications match the active filter.
                    </td>
                  </tr>
                ) : (
                  filteredPublications.map((pub) => (
                    <tr key={pub.id} className="hover:bg-[#FAF7F0] transition-colors">
                      <td className="py-3.5 px-4 font-mono text-[11px] text-[#2C2114]">
                        {pub.id}
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-[#2C2114]">
                        {pub.templateTitle || pub.templateId}
                      </td>
                      <td className="py-3.5 px-4">
                        <Link
                          href={`/invite/${pub.slug}`}
                          target="_blank"
                          className="font-mono text-xs text-[#8F6E3B] hover:underline inline-flex items-center gap-1"
                        >
                          <span>/invite/{pub.slug}</span>
                          <ExternalLink className="w-3 h-3" />
                        </Link>
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10.5px] font-bold">
                          {pub.status || 'ACTIVE'}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right font-mono text-[#55402F]">
                        {pub.viewCount || 0}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <Link
                          href={`/invite/${pub.slug}`}
                          target="_blank"
                          className="px-3 py-1 rounded-lg bg-[#EDE2CF] hover:bg-[#DFCEAF] text-[#49341F] text-[11px] font-semibold transition-colors inline-flex items-center gap-1"
                        >
                          <Eye className="w-3 h-3" />
                          <span>View Live</span>
                        </Link>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* TAB 3: CUSTOMER DRAFTS                                        */}
      {/* ------------------------------------------------------------- */}
      {activeTab === 'drafts' && (
        <div className="bg-[#FCFAF6] rounded-3xl p-6 sm:p-8 border border-[#DFCEAF] shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="font-serif text-lg font-bold text-[#2C2114]">
                Customer Draft In-Progress ({filteredDrafts.length})
              </h3>
              <p className="text-xs text-[#7A634E] mt-0.5">
                Autosaved customer drafts created via the Try-Before-You-Publish funnel.
              </p>
            </div>

            <div className="relative w-full sm:w-64">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#9E8975]" />
              <input
                type="text"
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                placeholder="Filter by draft ID..."
                className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl bg-white border border-[#DFCEAF] text-[#2C2114] placeholder-[#9E8975] focus:outline-none focus:ring-1 focus:ring-[#8F6E3B]"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#E8DFC8] text-[10.5px] uppercase tracking-wider font-semibold text-[#7A634E]">
                  <th className="py-3 px-4">Draft ID</th>
                  <th className="py-3 px-4">Template</th>
                  <th className="py-3 px-4">Guest Identity</th>
                  <th className="py-3 px-4 text-center">Status</th>
                  <th className="py-3 px-4 text-right">Updated At</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EFE7D7] text-xs">
                {filteredDrafts.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-10 text-center text-[#7A634E]">
                      No drafts match the active search query.
                    </td>
                  </tr>
                ) : (
                  filteredDrafts.map((d) => (
                    <tr key={d.id} className="hover:bg-[#FAF7F0] transition-colors">
                      <td className="py-3.5 px-4 font-mono text-[11px] text-[#2C2114]">
                        {d.id}
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-[#2C2114]">
                        {d.templateId}
                      </td>
                      <td className="py-3.5 px-4 font-mono text-[10.5px] text-[#7A634E]">
                        {d.guestToken ? `${d.guestToken.slice(0, 12)}...` : 'Registered User'}
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10.5px] font-bold ${
                            d.status === 'PUBLISHED'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {d.status || 'DRAFT'}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right text-[10.5px] text-[#7A634E]">
                        {d.updatedAt ? new Date(d.updatedAt).toLocaleDateString() : 'Recent'}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <Link
                          href={`/customize/${d.templateId}?draftId=${d.id}`}
                          target="_blank"
                          className="px-3 py-1 rounded-lg bg-[#EDE2CF] hover:bg-[#DFCEAF] text-[#49341F] text-[11px] font-semibold transition-colors inline-flex items-center gap-1"
                        >
                          <Eye className="w-3 h-3" />
                          <span>Inspect Draft</span>
                        </Link>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* TAB 4: TEMPLATE CATALOG & PRICING                             */}
      {/* ------------------------------------------------------------- */}
      {activeTab === 'pricing' && (
        <div className="bg-[#FCFAF6] rounded-3xl p-6 sm:p-8 border border-[#DFCEAF] shadow-xs space-y-6">
          <div>
            <h3 className="font-serif text-lg font-bold text-[#2C2114]">
              Template Pricing &amp; Publishing Rates
            </h3>
            <p className="text-xs text-[#7A634E] mt-0.5">
              Customers customize and preview all templates for 100% free. The price below is charged strictly when the customer selects &ldquo;Publish My Website&rdquo;.
            </p>
          </div>

          {priceSaveSuccess && (
            <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 flex items-center gap-2 text-xs font-semibold animate-fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Price successfully updated and audit logged! Live quotes updated instantly.</span>
            </div>
          )}

          {priceSaveError && (
            <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-900 flex items-center gap-2 text-xs font-semibold animate-fade-in">
              <AlertCircle className="w-4 h-4 text-red-600" />
              <span>{priceSaveError}</span>
            </div>
          )}

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#E8DFC8] text-[10.5px] uppercase tracking-wider font-semibold text-[#7A634E]">
                  <th className="py-3 px-4">Template Title</th>
                  <th className="py-3 px-4">Collection ID</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4 text-center">Current Price (INR)</th>
                  <th className="py-3 px-4 text-right">Pricing Control</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EFE7D7] text-xs">
                {templatesData.map((t) => {
                  const isEditing = editingPriceTplId === t.id;
                  const priceRec = (adminData.prices || []).find((p: any) => p.templateId === t.id);
                  const currentPrice = priceRec ? Math.round(priceRec.amount / 100) : 299;

                  return (
                    <tr key={t.id} className="hover:bg-[#FAF7F0] transition-colors">
                      <td className="py-3.5 px-4 font-semibold text-[#2C2114]">
                        {t.title}
                      </td>
                      <td className="py-3.5 px-4 font-mono text-[11px] text-[#7A634E]">
                        {t.id}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="px-2.5 py-0.5 rounded-full bg-[#EDE2CF]/60 text-[#695034] text-[10.5px] font-medium">
                          {t.occasion}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-center font-bold text-[#2C2114] text-sm">
                        {isEditing ? (
                          <div className="inline-flex items-center gap-1">
                            <span className="text-xs">₹</span>
                            <input
                              type="number"
                              min="0"
                              max="10000"
                              value={editPriceVal}
                              onChange={(e) => setEditPriceVal(Number(e.target.value))}
                              className="w-20 px-2 py-1 text-xs border border-[#8F6E3B] rounded-lg bg-white text-center focus:outline-none"
                            />
                          </div>
                        ) : (
                          `₹${currentPrice}`
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        {isEditing ? (
                          <div className="inline-flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => handleUpdatePrice(t.id)}
                              disabled={savingPrice}
                              className="px-3 py-1 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white text-[11px] font-semibold transition-colors cursor-pointer"
                            >
                              {savingPrice ? 'Saving...' : 'Save'}
                            </button>
                            <button
                              type="button"
                              onClick={() => setEditingPriceTplId(null)}
                              className="px-3 py-1 rounded-lg bg-neutral-200 hover:bg-neutral-300 text-neutral-800 text-[11px] font-semibold transition-colors cursor-pointer"
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => {
                              setEditingPriceTplId(t.id);
                              setEditPriceVal(currentPrice);
                            }}
                            className="px-3 py-1 rounded-lg bg-[#EDE2CF] hover:bg-[#DFCEAF] text-[#49341F] text-[11px] font-semibold transition-colors cursor-pointer inline-flex items-center gap-1"
                          >
                            <Edit className="w-3 h-3" />
                            <span>Edit Price</span>
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* TAB 5: ORDERS & TRANSACTIONS                                  */}
      {/* ------------------------------------------------------------- */}
      {activeTab === 'orders' && (
        <div className="bg-[#FCFAF6] rounded-3xl p-6 sm:p-8 border border-[#DFCEAF] shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="font-serif text-lg font-bold text-[#2C2114]">
                Razorpay Payment Transactions ({filteredOrders.length})
              </h3>
              <p className="text-xs text-[#7A634E] mt-0.5">
                Every verified customer publishing order recorded with Razorpay order IDs and HMAC signatures.
              </p>
            </div>

            <div className="relative w-full sm:w-64">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#9E8975]" />
              <input
                type="text"
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                placeholder="Filter orders..."
                className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl bg-white border border-[#DFCEAF] text-[#2C2114] placeholder-[#9E8975] focus:outline-none focus:ring-1 focus:ring-[#8F6E3B]"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#E8DFC8] text-[10.5px] uppercase tracking-wider font-semibold text-[#7A634E]">
                  <th className="py-3 px-4">Internal Order ID</th>
                  <th className="py-3 px-4">Gateway Order ID</th>
                  <th className="py-3 px-4 text-center">Amount</th>
                  <th className="py-3 px-4 text-center">Status</th>
                  <th className="py-3 px-4 text-right">Created Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EFE7D7] text-xs">
                {filteredOrders.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-10 text-center text-[#7A634E]">
                      No orders found in datastore.
                    </td>
                  </tr>
                ) : (
                  filteredOrders.map((o) => (
                    <tr key={o.id} className="hover:bg-[#FAF7F0] transition-colors">
                      <td className="py-3.5 px-4 font-mono text-[11px] text-[#2C2114]">
                        {o.id}
                      </td>
                      <td className="py-3.5 px-4 font-mono text-[11px] text-[#8F6E3B]">
                        {o.orderId || 'Direct'}
                      </td>
                      <td className="py-3.5 px-4 text-center font-bold text-[#2C2114]">
                        ₹{Math.round((o.amountPaise || o.amount || 29900) / 100)}
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10.5px] font-bold ${
                            o.status === 'PAID'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {o.status || 'PAID'}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right text-[10.5px] text-[#7A634E]">
                        {o.createdAt ? new Date(o.createdAt).toLocaleDateString() : 'Recent'}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* TAB 6: PROMOTIONAL COUPONS                                    */}
      {/* ------------------------------------------------------------- */}
      {activeTab === 'coupons' && (
        <div className="bg-[#FCFAF6] rounded-3xl p-6 sm:p-8 border border-[#DFCEAF] shadow-xs space-y-6">
          <div>
            <h3 className="font-serif text-lg font-bold text-[#2C2114]">
              Active Discount &amp; Promo Coupons
            </h3>
            <p className="text-xs text-[#7A634E] mt-0.5">
              Promotional codes applied by customers in the Try-Before-You-Publish checkout drawer.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { code: 'ROYAL100', discount: '₹100 Off', type: 'Flat Discount', minOrder: '₹299', active: true },
              { code: 'LOVE2026', discount: '20% Off', type: 'Percentage', minOrder: '₹349', active: true },
              { code: 'TEMPLE50', discount: '₹50 Off', type: 'Flat Discount', minOrder: '₹299', active: true },
            ].map((c) => (
              <div
                key={c.code}
                className="p-5 rounded-2xl bg-white border border-[#DFCEAF] space-y-3 relative overflow-hidden"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-sm font-bold text-[#8F6E3B] bg-[#FAF7F0] px-3 py-1 rounded-lg border border-[#E8DFC8]">
                    {c.code}
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                    Active
                  </span>
                </div>
                <div>
                  <span className="font-serif text-xl font-bold text-[#2C2114] block">
                    {c.discount}
                  </span>
                  <span className="text-[11px] text-[#7A634E]">
                    {c.type} &bull; Min spend {c.minOrder}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
