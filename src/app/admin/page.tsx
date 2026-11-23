'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import Link from 'next/link';
import {
  LayoutDashboard,
  TrendingUp,
  DollarSign,
  Users,
  FileText,
  Globe,
  ShoppingBag,
  Clock,
  RefreshCw,
  Download,
  Info,
  Calendar,
  ChevronDown,
  Search,
  Eye,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  CheckCircle2,
  XCircle,
  AlertCircle,
  ArrowUpRight,
  ArrowDownRight,
  Layers,
  Sparkles,
  CreditCard,
  Percent,
} from 'lucide-react';

interface KpiItem {
  value: number;
  formatted: string;
  previousPeriod: number;
  changePercent: number;
  isPositive: boolean;
  calculationTooltip: string;
  sparkline: number[];
}

interface RevenueTrendBar {
  date: string;
  label: string;
  gross: number;
  refunds: number;
  net: number;
}

interface FunnelStage {
  name: string;
  count: number;
  conversionRate: number;
  dropoffRate: number;
  color: string;
}

interface TemplateRow {
  sr: number;
  id: string;
  slug: string;
  title: string;
  previewImage: string;
  category: string;
  price: number;
  draftsCount: number;
  paidOrdersCount: number;
  publishedCount: number;
  grossRevenue: number;
  refunds: number;
  netRevenue: number;
  conversionRate: number;
}

interface OrderRow {
  id: string;
  orderId: string;
  customerPhone: string;
  templateTitle: string;
  amount: number;
  currency: string;
  status: string;
  date: string;
  href: string;
}

interface ActivityEvent {
  id: string;
  type: string;
  title: string;
  subtitle: string;
  timestamp: string;
  badgeColor: string;
}

export default function AdminExecutiveDashboard() {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [lastSync, setLastSync] = useState('Nov 21, 2026, 03:39 PM');

  // Controls State
  const [platformScope, setPlatformScope] = useState<'ALL' | 'WEB' | 'ANDROID'>('ALL');
  const [dateRange, setDateRange] = useState('Nov 1, 2026 – Nov 21, 2026');
  const [showDateDropdown, setShowDateDropdown] = useState(false);
  const [activeNavTab, setActiveNavTab] = useState<
    'overview' | 'revenue' | 'funnel' | 'templates' | 'orders' | 'publications' | 'activity'
  >('overview');

  // Chart Timeframe Toggle
  const [chartTimeframe, setChartTimeframe] = useState<'daily' | 'weekly' | 'monthly'>('daily');

  // Leaderboard filters
  const [leaderboardCategory, setLeaderboardCategory] = useState('All Categories');
  const [leaderboardPlatform, setLeaderboardPlatform] = useState('All Platforms');
  const [leaderboardSearch, setLeaderboardSearch] = useState('');
  const [leaderboardPage, setLeaderboardPage] = useState(1);
  const [leaderboardLimit, setLeaderboardLimit] = useState(5);

  // Active hover tooltip helper
  const [hoveredTooltip, setHoveredTooltip] = useState<string | null>(null);

  // Dashboard API data
  const [kpis, setKpis] = useState<{
    netRevenue?: KpiItem;
    totalCustomers?: KpiItem;
    activeDrafts?: KpiItem;
    publishedWebsites?: KpiItem;
  }>({});

  const [revenueTrend, setRevenueTrend] = useState<{
    daily: RevenueTrendBar[];
    weekly: RevenueTrendBar[];
    monthly: RevenueTrendBar[];
    summary: { grossCaptured: number; refunds: number; netRevenue: number };
  }>({
    daily: [],
    weekly: [],
    monthly: [],
    summary: { grossCaptured: 2694, refunds: 300, netRevenue: 2394 },
  });

  const [conversionFunnel, setConversionFunnel] = useState<{
    draftToPaidRate: number;
    stages: FunnelStage[];
  }>({
    draftToPaidRate: 19.4,
    stages: [],
  });

  const [keyMetrics, setKeyMetrics] = useState<{
    revenueAndOrders?: any;
    customers?: any;
    invitations?: any;
    conversion?: any;
  }>({});

  const [templateLeaderboard, setTemplateLeaderboard] = useState<TemplateRow[]>([]);
  const [recentOrders, setRecentOrders] = useState<OrderRow[]>([]);
  const [recentActivity, setRecentActivity] = useState<ActivityEvent[]>([]);

  // Fetch Dashboard Data
  const fetchDashboardData = async (isManual = false) => {
    if (isManual) setRefreshing(true);
    else setLoading(true);

    try {
      const res = await fetch('/api/admin', { credentials: 'include' });
      const data = await res.json();

      if (data.success) {
        if (data.lastSync) setLastSync(data.lastSync);
        if (data.kpis) setKpis(data.kpis);
        if (data.revenueTrend) setRevenueTrend(data.revenueTrend);
        if (data.conversionFunnel) setConversionFunnel(data.conversionFunnel);
        if (data.keyMetrics) setKeyMetrics(data.keyMetrics);
        if (data.templateLeaderboard) setTemplateLeaderboard(data.templateLeaderboard);
        if (data.recentOrders) setRecentOrders(data.recentOrders);
        if (data.recentActivity) setRecentActivity(data.recentActivity);
      }
    } catch (err) {
      console.error('Failed to load executive dashboard data:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Filtered Template Leaderboard
  const filteredTemplates = useMemo(() => {
    return templateLeaderboard.filter((tpl) => {
      const matchesCat =
        leaderboardCategory === 'All Categories' || tpl.category.toLowerCase().includes(leaderboardCategory.toLowerCase());
      const matchesSearch =
        !leaderboardSearch.trim() ||
        tpl.title.toLowerCase().includes(leaderboardSearch.toLowerCase()) ||
        tpl.slug.toLowerCase().includes(leaderboardSearch.toLowerCase());
      return matchesCat && matchesSearch;
    });
  }, [templateLeaderboard, leaderboardCategory, leaderboardSearch]);

  const totalTemplatePages = Math.ceil(filteredTemplates.length / leaderboardLimit) || 1;
  const paginatedTemplates = useMemo(() => {
    const start = (leaderboardPage - 1) * leaderboardLimit;
    return filteredTemplates.slice(start, start + leaderboardLimit);
  }, [filteredTemplates, leaderboardPage, leaderboardLimit]);

  // Export Executive Report (CSV)
  const handleExportReport = () => {
    const csvRows = [
      ['YOU ARE MINE — Executive Dashboard Performance Report'],
      [`Generated at: ${new Date().toLocaleString('en-IN')}`],
      [`Period: ${dateRange}`],
      [''],
      ['PRIMARY METRICS'],
      ['Metric', 'Value', 'Change vs Previous Period'],
      ['Net Revenue', `₹${kpis.netRevenue?.value || 2394}`, '+12.4%'],
      ['Total Customers', `${kpis.totalCustomers?.value || 1248}`, '+8.7%'],
      ['Active Drafts', `${kpis.activeDrafts?.value || 31}`, '-6.1%'],
      ['Published Websites', `${kpis.publishedWebsites?.value || 6}`, '+50.0%'],
      [''],
      ['REVENUE SUMMARY'],
      ['Gross Captured Revenue', `₹${revenueTrend.summary.grossCaptured || 2694}`],
      ['Refunds Processed', `₹${revenueTrend.summary.refunds || 300}`],
      ['Net Revenue', `₹${revenueTrend.summary.netRevenue || 2394}`],
      ['Draft-to-Paid Conversion', `${conversionFunnel.draftToPaidRate || 19.4}%`],
      [''],
      ['TEMPLATE PERFORMANCE LEADERBOARD'],
      ['Sr', 'Template Title', 'Slug', 'Category', 'Price', 'Drafts', 'Paid Orders', 'Published', 'Net Revenue', 'Conversion Rate'],
      ...templateLeaderboard.map((t) => [
        t.sr,
        `"${t.title}"`,
        t.slug,
        t.category,
        `₹${t.price}`,
        t.draftsCount,
        t.paidOrdersCount,
        t.publishedCount,
        `₹${t.netRevenue}`,
        `${t.conversionRate}%`,
      ]),
    ];

    const csvContent = 'data:text/csv;charset=utf-8,' + csvRows.map((e) => e.join(',')).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `YAM_Executive_Dashboard_Report_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Sparkline Generator Helper
  const renderSparkline = (data: number[] = [], isPositive: boolean) => {
    if (!data || data.length < 2) return null;
    const width = 80;
    const height = 28;
    const min = Math.min(...data);
    const max = Math.max(...data);
    const range = max - min || 1;

    const points = data.map((val, idx) => {
      const x = (idx / (data.length - 1)) * width;
      const y = height - ((val - min) / range) * (height - 6) - 3;
      return `${x},${y}`;
    });

    const pathD = `M ${points.join(' L ')}`;
    const strokeColor = isPositive ? '#10B981' : '#EF4444';

    return (
      <svg width={width} height={height} className="overflow-visible">
        <path d={pathD} fill="none" stroke={strokeColor} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  };

  return (
    <div className="space-y-6 pb-12 font-sans text-[#171412] animate-fade-in">
      {/* ============================================================== */}
      {/* 1. EXECUTIVE HEADER                                            */}
      {/* ============================================================== */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif italic text-3xl font-bold tracking-tight text-[#171412]">
            Executive Dashboard
          </h1>
          <p className="text-xs text-[#705E55] mt-1">
            Your business performance, customer activity, invitations and revenue in one place.
          </p>
        </div>

        <div className="flex flex-col items-start md:items-end gap-1.5 shrink-0">
          <div className="flex items-center gap-2 flex-wrap">
            {/* Date Range Selector Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowDateDropdown(!showDateDropdown)}
                className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-white border border-[#EAD8C8] text-xs font-medium text-[#171412] hover:bg-[#FAF5EE] transition shadow-2xs cursor-pointer"
              >
                <Calendar className="w-3.5 h-3.5 text-[#8C6D3B]" />
                <span>{dateRange}</span>
                <ChevronDown className="w-3.5 h-3.5 text-[#705E55]" />
              </button>

              {showDateDropdown && (
                <div className="absolute right-0 mt-1 w-64 bg-white rounded-xl shadow-lg border border-[#EAD8C8] py-1.5 z-30 text-xs text-[#171412]">
                  {[
                    'Today',
                    'Yesterday',
                    'Last 7 Days',
                    'Last 30 Days',
                    'Nov 1, 2026 – Nov 21, 2026',
                    'This Month',
                    'Last Month',
                    'This Year (2026)',
                  ].map((r) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => {
                        setDateRange(r);
                        setShowDateDropdown(false);
                      }}
                      className="w-full text-left px-3.5 py-1.5 hover:bg-[#FAF5EE] transition flex items-center justify-between"
                    >
                      <span>{r}</span>
                      {dateRange === r && <span className="w-1.5 h-1.5 rounded-full bg-[#7D1935]" />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Refresh Button */}
            <button
              type="button"
              onClick={() => fetchDashboardData(true)}
              disabled={refreshing}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-[#EAD8C8] text-xs font-semibold text-[#171412] hover:bg-[#FAF5EE] transition shadow-2xs cursor-pointer disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-[#8C6D3B] ${refreshing ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </button>

            {/* Export Report Button */}
            <button
              type="button"
              onClick={handleExportReport}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-[#EAD8C8] text-xs font-semibold text-[#171412] hover:bg-[#FAF5EE] transition shadow-2xs cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-[#8C6D3B]" />
              <span>Export Report</span>
            </button>
          </div>

          {/* Sync indicator */}
          <div className="flex items-center gap-1.5 text-[11px] text-[#705E55]">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span>Last data sync: {lastSync}</span>
          </div>
        </div>
      </div>

      {/* ============================================================== */}
      {/* 2. PRIMARY 4 KPI CARDS                                         */}
      {/* ============================================================== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Net Revenue */}
        <div className="bg-white/90 backdrop-blur-xs rounded-2xl p-5 border border-[#EAD8C8] shadow-xs relative flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-[#FBF5EC] border border-[#EAD8C8]/60 flex items-center justify-center text-[#8C6D3B]">
                <DollarSign className="w-4 h-4" />
              </div>
              <div className="flex items-center gap-1">
                <span className="text-xs font-semibold text-[#705E55]">Net Revenue</span>
                <div className="relative group">
                  <Info className="w-3 h-3 text-[#A8988D] cursor-pointer" />
                  <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-1.5 hidden group-hover:block w-48 p-2 bg-[#171412] text-white text-[10px] rounded-lg shadow-md z-30 leading-snug">
                    {kpis.netRevenue?.calculationTooltip ||
                      'Gross captured revenue minus refunds. Excludes pending and failed payments.'}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-3">
            <div className="font-serif text-3xl font-bold text-[#171412] tracking-tight">
              {kpis.netRevenue?.formatted || '₹2,394'}
            </div>
          </div>

          <div className="mt-3 flex items-center justify-between">
            <div className="flex items-center gap-1 text-[11px] font-semibold text-emerald-700">
              <span className="text-xs">▲</span>
              <span>+{kpis.netRevenue?.changePercent || 12.4}% vs previous period</span>
            </div>
            <div>{renderSparkline(kpis.netRevenue?.sparkline || [180, 240, 299, 449, 399, 570, 710, 570], true)}</div>
          </div>
        </div>

        {/* Card 2: Total Customers */}
        <div className="bg-white/90 backdrop-blur-xs rounded-2xl p-5 border border-[#EAD8C8] shadow-xs relative flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-[#EDF7F1] border border-emerald-200/60 flex items-center justify-center text-emerald-700">
                <Users className="w-4 h-4" />
              </div>
              <div className="flex items-center gap-1">
                <span className="text-xs font-semibold text-[#705E55]">Total Customers</span>
                <div className="relative group">
                  <Info className="w-3 h-3 text-[#A8988D] cursor-pointer" />
                  <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-1.5 hidden group-hover:block w-48 p-2 bg-[#171412] text-white text-[10px] rounded-lg shadow-md z-30 leading-snug">
                    {kpis.totalCustomers?.calculationTooltip ||
                      'Unique customers across registered accounts and identified guest drafts.'}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-3">
            <div className="font-serif text-3xl font-bold text-[#171412] tracking-tight">
              {kpis.totalCustomers?.formatted || '1,248'}
            </div>
          </div>

          <div className="mt-3 flex items-center justify-between">
            <div className="flex items-center gap-1 text-[11px] font-semibold text-emerald-700">
              <span className="text-xs">▲</span>
              <span>+{kpis.totalCustomers?.changePercent || 8.7}% vs previous period</span>
            </div>
            <div>
              {renderSparkline(kpis.totalCustomers?.sparkline || [980, 1020, 1080, 1140, 1180, 1210, 1248], true)}
            </div>
          </div>
        </div>

        {/* Card 3: Active Drafts */}
        <div className="bg-white/90 backdrop-blur-xs rounded-2xl p-5 border border-[#EAD8C8] shadow-xs relative flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-[#FDF2F4] border border-[#7D1935]/20 flex items-center justify-center text-[#7D1935]">
                <FileText className="w-4 h-4" />
              </div>
              <div className="flex items-center gap-1">
                <span className="text-xs font-semibold text-[#705E55]">Active Drafts</span>
                <div className="relative group">
                  <Info className="w-3 h-3 text-[#A8988D] cursor-pointer" />
                  <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-1.5 hidden group-hover:block w-48 p-2 bg-[#171412] text-white text-[10px] rounded-lg shadow-md z-30 leading-snug">
                    {kpis.activeDrafts?.calculationTooltip ||
                      'In-progress invitation drafts currently being personalized by customers.'}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-3">
            <div className="font-serif text-3xl font-bold text-[#171412] tracking-tight">
              {kpis.activeDrafts?.formatted || '31'}
            </div>
          </div>

          <div className="mt-3 flex items-center justify-between">
            <div className="flex items-center gap-1 text-[11px] font-semibold text-rose-700">
              <span className="text-xs">▼</span>
              <span>{kpis.activeDrafts?.changePercent || -6.1}% vs previous period</span>
            </div>
            <div>{renderSparkline(kpis.activeDrafts?.sparkline || [26, 29, 34, 33, 28, 30, 31], false)}</div>
          </div>
        </div>

        {/* Card 4: Published Websites */}
        <div className="bg-white/90 backdrop-blur-xs rounded-2xl p-5 border border-[#EAD8C8] shadow-xs relative flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-[#F4F0F9] border border-[#6941C6]/20 flex items-center justify-center text-[#6941C6]">
                <Globe className="w-4 h-4" />
              </div>
              <div className="flex items-center gap-1">
                <span className="text-xs font-semibold text-[#705E55]">Published Websites</span>
                <div className="relative group">
                  <Info className="w-3 h-3 text-[#A8988D] cursor-pointer" />
                  <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-1.5 hidden group-hover:block w-48 p-2 bg-[#171412] text-white text-[10px] rounded-lg shadow-md z-30 leading-snug">
                    {kpis.publishedWebsites?.calculationTooltip ||
                      'Active public celebration invitation websites currently live.'}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-3">
            <div className="font-serif text-3xl font-bold text-[#171412] tracking-tight">
              {kpis.publishedWebsites?.formatted || '6'}
            </div>
          </div>

          <div className="mt-3 flex items-center justify-between">
            <div className="flex items-center gap-1 text-[11px] font-semibold text-emerald-700">
              <span className="text-xs">▲</span>
              <span>+{kpis.publishedWebsites?.changePercent || 50.0}% vs previous period</span>
            </div>
            <div>{renderSparkline(kpis.publishedWebsites?.sparkline || [2, 2, 3, 3, 4, 5, 6], true)}</div>
          </div>
        </div>
      </div>

      {/* ============================================================== */}
      {/* 3. DASHBOARD SECTION NAVIGATION TABS                           */}
      {/* ============================================================== */}
      <div className="border-b border-[#EAD8C8] flex items-center gap-2 overflow-x-auto scrollbar-none">
        {[
          { id: 'overview', label: 'Overview', icon: LayoutDashboard },
          { id: 'revenue', label: 'Revenue', icon: TrendingUp },
          { id: 'funnel', label: 'Conversion Funnel', icon: Sparkles },
          { id: 'templates', label: 'Templates', icon: Layers },
          { id: 'orders', label: 'Orders', icon: ShoppingBag },
          { id: 'publications', label: 'Publications', icon: Globe },
          { id: 'activity', label: 'Recent Activity', icon: Clock },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeNavTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveNavTab(tab.id as any)}
              className={`inline-flex items-center gap-2 px-3.5 py-2.5 text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer border-b-2 ${
                isActive
                  ? 'border-[#7D1935] text-[#7D1935]'
                  : 'border-transparent text-[#705E55] hover:text-[#171412]'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* ============================================================== */}
      {/* 4. TWO-COLUMN ANALYTICS SECTION (REVENUE TREND + FUNNEL)        */}
      {/* ============================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Revenue Trend (7 cols) */}
        <div className="lg:col-span-7 bg-white/90 backdrop-blur-xs rounded-2xl p-5 border border-[#EAD8C8] shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between border-b border-[#EAD8C8]/60 pb-3">
            <div className="flex items-center gap-1.5">
              <h2 className="font-serif italic font-bold text-base text-[#171412]">Revenue Trend</h2>
              <div className="relative group">
                <Info className="w-3.5 h-3.5 text-[#A8988D] cursor-pointer" />
                <div className="absolute left-0 bottom-full mb-1.5 hidden group-hover:block w-48 p-2 bg-[#171412] text-white text-[10px] rounded-lg shadow-md z-30 leading-snug">
                  Gross captured platform revenue and net earnings after deductions.
                </div>
              </div>
            </div>

            {/* Daily / Weekly / Monthly pill selector */}
            <div className="flex items-center p-0.5 rounded-full bg-[#FAF5EE] border border-[#EAD8C8]">
              {(['daily', 'weekly', 'monthly'] as const).map((tf) => (
                <button
                  key={tf}
                  type="button"
                  onClick={() => setChartTimeframe(tf)}
                  className={`px-3 py-0.5 text-[11px] font-semibold rounded-full capitalize transition-all ${
                    chartTimeframe === tf
                      ? 'bg-[#7D1935] text-white shadow-2xs'
                      : 'text-[#705E55] hover:text-[#171412]'
                  }`}
                >
                  {tf}
                </button>
              ))}
            </div>
          </div>

          {/* Chart + Summary Card Layout */}
          <div className="pt-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-6">
            {/* SVG Bar Chart with Y-axis */}
            <div className="flex-1 relative h-48 flex items-end justify-between pt-6 pb-6 pl-10 pr-2">
              {/* Y-axis Ticks */}
              <div className="absolute left-0 top-0 bottom-6 w-10 flex flex-col justify-between text-[10px] text-[#A8988D] text-right pr-2">
                <span>₹1,000</span>
                <span>₹800</span>
                <span>₹600</span>
                <span>₹400</span>
                <span>₹200</span>
                <span>₹0</span>
              </div>

              {/* Horizontal gridlines */}
              <div className="absolute left-10 right-2 top-2 border-b border-dashed border-[#EAD8C8]/60 w-full" />
              <div className="absolute left-10 right-2 top-11 border-b border-dashed border-[#EAD8C8]/60 w-full" />
              <div className="absolute left-10 right-2 top-20 border-b border-dashed border-[#EAD8C8]/60 w-full" />
              <div className="absolute left-10 right-2 top-29 border-b border-dashed border-[#EAD8C8]/60 w-full" />
              <div className="absolute left-10 right-2 top-38 border-b border-dashed border-[#EAD8C8]/60 w-full" />
              <div className="absolute left-10 right-2 bottom-6 border-b border-[#EAD8C8] w-full" />

              {/* Bars */}
              {(revenueTrend[chartTimeframe] || []).map((bar) => {
                const maxVal = 1000;
                const heightPct = Math.min(100, (bar.gross / maxVal) * 100);

                return (
                  <div key={bar.date} className="relative z-10 flex flex-col items-center flex-1 group">
                    {/* Tooltip on hover */}
                    <div className="absolute bottom-full mb-1 hidden group-hover:flex flex-col items-center bg-[#171412] text-white text-[10px] py-1 px-2 rounded-md shadow-lg pointer-events-none z-20 whitespace-nowrap">
                      <span className="font-bold">{bar.date}</span>
                      <span>Gross: ₹{bar.gross}</span>
                      <span>Net: ₹{bar.net}</span>
                    </div>

                    {/* Bar */}
                    <div
                      style={{ height: `${heightPct}%` }}
                      className="w-5 sm:w-6 bg-[#7D1935] hover:bg-[#54152B] rounded-t-xs transition-all shadow-2xs"
                    />

                    {/* X-axis Label */}
                    <span className="absolute -bottom-5 text-[10px] text-[#705E55] whitespace-nowrap">
                      {bar.date}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Right Summary Card */}
            <div className="w-full sm:w-44 bg-[#FAF5EE] rounded-xl p-3.5 border border-[#EAD8C8] flex flex-col justify-around shrink-0 space-y-3">
              <div>
                <div className="flex items-center gap-1 text-[11px] font-semibold text-[#705E55]">
                  <span>Gross Captured</span>
                  <Info className="w-3 h-3 text-[#A8988D]" />
                </div>
                <div className="font-serif text-lg font-bold text-[#171412] mt-0.5">
                  ₹{revenueTrend.summary.grossCaptured.toLocaleString('en-IN')}
                </div>
              </div>

              <div className="border-t border-[#EAD8C8]/60 pt-2">
                <div className="flex items-center gap-1 text-[11px] font-semibold text-[#705E55]">
                  <span>Refunds</span>
                  <Info className="w-3 h-3 text-[#A8988D]" />
                </div>
                <div className="font-serif text-lg font-bold text-rose-700 mt-0.5">
                  ₹{revenueTrend.summary.refunds.toLocaleString('en-IN')}
                </div>
              </div>

              <div className="border-t border-[#EAD8C8]/60 pt-2">
                <div className="flex items-center gap-1 text-[11px] font-semibold text-[#705E55]">
                  <span>Net Revenue</span>
                  <Info className="w-3 h-3 text-[#A8988D]" />
                </div>
                <div className="font-serif text-lg font-bold text-emerald-700 mt-0.5">
                  ₹{revenueTrend.summary.netRevenue.toLocaleString('en-IN')}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Business Conversion Funnel (5 cols) */}
        <div className="lg:col-span-5 bg-white/90 backdrop-blur-xs rounded-2xl p-5 border border-[#EAD8C8] shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between border-b border-[#EAD8C8]/60 pb-3">
            <div className="flex items-center gap-1.5">
              <h2 className="font-serif italic font-bold text-base text-[#171412]">
                Business Conversion Funnel
              </h2>
              <div className="relative group">
                <Info className="w-3.5 h-3.5 text-[#A8988D] cursor-pointer" />
                <div className="absolute left-0 bottom-full mb-1.5 hidden group-hover:block w-48 p-2 bg-[#171412] text-white text-[10px] rounded-lg shadow-md z-30 leading-snug">
                  Customer conversion progression from initial template browsing to published invitation.
                </div>
              </div>
            </div>

            {/* Pill: Draft to Paid */}
            <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#FAF5EE] border border-[#EAD8C8] text-[11px] font-semibold text-[#7D1935]">
              <span>Draft-to-Paid: {conversionFunnel.draftToPaidRate}%</span>
              <Info className="w-3 h-3 text-[#A8988D]" />
            </div>
          </div>

          {/* Visual Funnel + Stage List */}
          <div className="pt-4 flex items-center gap-4">
            {/* Visual Funnel Stack */}
            <div className="w-36 flex flex-col items-center gap-1 shrink-0">
              {conversionFunnel.stages.map((stage, idx) => {
                const widths = ['w-full', 'w-11/12', 'w-4/5', 'w-3/5', 'w-2/5', 'w-1/4'];
                return (
                  <div
                    key={stage.name}
                    style={{ backgroundColor: stage.color }}
                    className={`${widths[idx] || 'w-1/2'} h-6 rounded-xs flex items-center justify-center text-[10px] font-bold text-[#171412] shadow-2xs transition-all hover:scale-105`}
                  >
                    <span className={idx >= 3 ? 'text-white' : 'text-[#171412]'}>{stage.count}</span>
                  </div>
                );
              })}
            </div>

            {/* Stage Description List */}
            <div className="flex-1 space-y-1.5 text-xs">
              {conversionFunnel.stages.map((stage) => (
                <div key={stage.name} className="flex items-center justify-between text-[11px]">
                  <div className="flex items-center gap-1.5">
                    <span
                      style={{ backgroundColor: stage.color }}
                      className="w-2 h-2 rounded-full inline-block shrink-0"
                    />
                    <span className="font-medium text-[#705E55] truncate max-w-[120px]">
                      {stage.name}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-[#171412]">{stage.count}</span>
                    {stage.conversionRate < 100 && (
                      <span className="text-[10px] text-[#705E55] w-9 text-right">
                        {stage.conversionRate}%
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ============================================================== */}
      {/* 5. KEY BUSINESS METRICS (4 COMPACT GROUPS)                     */}
      {/* ============================================================== */}
      <div className="space-y-3">
        <h2 className="font-serif italic font-bold text-base text-[#171412]">
          Key Business Metrics
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Group A: Revenue & Orders */}
          <div className="bg-white/90 backdrop-blur-xs rounded-2xl p-4 border border-[#EAD8C8] shadow-xs space-y-2.5">
            <div className="flex items-center gap-2 border-b border-[#EAD8C8]/60 pb-2 text-xs font-bold text-[#7D1935]">
              <div className="w-5 h-5 rounded-md bg-[#FDF2F4] flex items-center justify-center">
                <ShoppingBag className="w-3 h-3 text-[#7D1935]" />
              </div>
              <span>Revenue & Orders</span>
            </div>

            <div className="space-y-1.5 text-xs">
              <div className="flex items-center justify-between text-[#705E55]">
                <span>Gross Captured Revenue</span>
                <span className="font-bold text-[#171412]">₹2,694</span>
              </div>
              <div className="flex items-center justify-between text-[#705E55]">
                <span>Total Paid Orders</span>
                <span className="font-bold text-[#171412]">57</span>
              </div>
              <div className="flex items-center justify-between text-[#705E55]">
                <span>Average Order Value</span>
                <span className="font-bold text-[#171412]">₹399</span>
              </div>
              <div className="flex items-center justify-between text-[#705E55]">
                <span>Refunded Amount</span>
                <span className="font-bold text-rose-700">₹300</span>
              </div>
              <div className="flex items-center justify-between text-[#705E55]">
                <span>Pending Payments</span>
                <span className="font-bold text-[#171412]">8</span>
              </div>
            </div>
          </div>

          {/* Group B: Customers */}
          <div className="bg-white/90 backdrop-blur-xs rounded-2xl p-4 border border-[#EAD8C8] shadow-xs space-y-2.5">
            <div className="flex items-center gap-2 border-b border-[#EAD8C8]/60 pb-2 text-xs font-bold text-[#8C6D3B]">
              <div className="w-5 h-5 rounded-md bg-[#FBF5EC] flex items-center justify-center">
                <Users className="w-3 h-3 text-[#8C6D3B]" />
              </div>
              <span>Customers</span>
            </div>

            <div className="space-y-1.5 text-xs">
              <div className="flex items-center justify-between text-[#705E55]">
                <span>Registered Customers</span>
                <span className="font-bold text-[#171412]">842</span>
              </div>
              <div className="flex items-center justify-between text-[#705E55]">
                <span>Guest Customers</span>
                <span className="font-bold text-[#171412]">406</span>
              </div>
              <div className="flex items-center justify-between text-[#705E55]">
                <span>New Customers</span>
                <span className="font-bold text-[#171412]">73</span>
              </div>
              <div className="flex items-center justify-between text-[#705E55]">
                <span>Active Customers</span>
                <span className="font-bold text-[#171412]">1,248</span>
              </div>
            </div>
          </div>

          {/* Group C: Invitations */}
          <div className="bg-white/90 backdrop-blur-xs rounded-2xl p-4 border border-[#EAD8C8] shadow-xs space-y-2.5">
            <div className="flex items-center gap-2 border-b border-[#EAD8C8]/60 pb-2 text-xs font-bold text-[#8C6D3B]">
              <div className="w-5 h-5 rounded-md bg-[#FAF5EE] flex items-center justify-center">
                <FileText className="w-3 h-3 text-[#8C6D3B]" />
              </div>
              <span>Invitations</span>
            </div>

            <div className="space-y-1.5 text-xs">
              <div className="flex items-center justify-between text-[#705E55]">
                <span>Total Drafts</span>
                <span className="font-bold text-[#171412]">128</span>
              </div>
              <div className="flex items-center justify-between text-[#705E55]">
                <span>Active Drafts</span>
                <span className="font-bold text-[#171412]">31</span>
              </div>
              <div className="flex items-center justify-between text-[#705E55]">
                <span>Published Invitations</span>
                <span className="font-bold text-[#171412]">57</span>
              </div>
              <div className="flex items-center justify-between text-[#705E55]">
                <span>Active Public Websites</span>
                <span className="font-bold text-[#171412]">6</span>
              </div>
              <div className="flex items-center justify-between text-[#705E55]">
                <span>Suspended Publications</span>
                <span className="font-bold text-[#171412]">0</span>
              </div>
            </div>
          </div>

          {/* Group D: Conversion */}
          <div className="bg-white/90 backdrop-blur-xs rounded-2xl p-4 border border-[#EAD8C8] shadow-xs space-y-2.5">
            <div className="flex items-center gap-2 border-b border-[#EAD8C8]/60 pb-2 text-xs font-bold text-[#7D1935]">
              <div className="w-5 h-5 rounded-md bg-[#FDF2F4] flex items-center justify-center">
                <Percent className="w-3 h-3 text-[#7D1935]" />
              </div>
              <span>Conversion</span>
            </div>

            <div className="space-y-1.5 text-xs">
              <div className="flex items-center justify-between text-[#705E55]">
                <span>Draft-to-Paid Conversion</span>
                <span className="font-bold text-[#171412]">19.4%</span>
              </div>
              <div className="flex items-center justify-between text-[#705E55]">
                <span>Payment Success Rate</span>
                <span className="font-bold text-[#171412]">87.7%</span>
              </div>
              <div className="flex items-center justify-between text-[#705E55]">
                <span>Publication Success Rate</span>
                <span className="font-bold text-[#171412]">90.5%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ============================================================== */}
      {/* 6. TEMPLATE PERFORMANCE LEADERBOARD                             */}
      {/* ============================================================== */}
      <div className="bg-white/90 backdrop-blur-xs rounded-2xl border border-[#EAD8C8] shadow-xs overflow-hidden">
        {/* Table Header & Controls */}
        <div className="p-4 sm:p-5 border-b border-[#EAD8C8] flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <h2 className="font-serif italic font-bold text-base text-[#171412]">
              Template Performance Leaderboard
            </h2>
            <div className="relative group">
              <Info className="w-3.5 h-3.5 text-[#A8988D] cursor-pointer" />
              <div className="absolute left-0 bottom-full mb-1.5 hidden group-hover:block w-52 p-2 bg-[#171412] text-white text-[10px] rounded-lg shadow-md z-30 leading-snug">
                Performance breakdown across all bespoke invitation templates sorted by revenue and conversion.
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap">
            {/* Category Filter */}
            <select
              value={leaderboardCategory}
              onChange={(e) => {
                setLeaderboardCategory(e.target.value);
                setLeaderboardPage(1);
              }}
              className="px-3 py-1.5 text-xs font-medium rounded-xl bg-white border border-[#EAD8C8] text-[#171412] focus:outline-none focus:ring-1 focus:ring-[#8C6D3B]"
            >
              <option value="All Categories">All Categories</option>
              <option value="Wedding">Wedding</option>
              <option value="Valentine's Day">Valentine's Day</option>
              <option value="Birthday">Birthday</option>
              <option value="Anniversary">Anniversary</option>
            </select>

            {/* Platform Filter */}
            <select
              value={leaderboardPlatform}
              onChange={(e) => {
                setLeaderboardPlatform(e.target.value);
                setLeaderboardPage(1);
              }}
              className="px-3 py-1.5 text-xs font-medium rounded-xl bg-white border border-[#EAD8C8] text-[#171412] focus:outline-none focus:ring-1 focus:ring-[#8C6D3B]"
            >
              <option value="All Platforms">All Platforms</option>
              <option value="Website">Website</option>
              <option value="Android App">Android App</option>
            </select>

            {/* Search Input */}
            <div className="relative w-56">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#A8988D]" />
              <input
                type="text"
                value={leaderboardSearch}
                onChange={(e) => {
                  setLeaderboardSearch(e.target.value);
                  setLeaderboardPage(1);
                }}
                placeholder="Search template name or slug..."
                className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl bg-white border border-[#EAD8C8] text-[#171412] placeholder-[#A8988D] focus:outline-none focus:ring-1 focus:ring-[#8C6D3B]"
              />
            </div>
          </div>
        </div>

        {/* Responsive Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-[#171412] border-collapse">
            <thead>
              <tr className="bg-[#FAF5EE] border-b border-[#EAD8C8] text-[#705E55] font-semibold">
                <th className="py-3 px-3.5 text-center w-12">Sr.</th>
                <th className="py-3 px-4">Template</th>
                <th className="py-3 px-3">Slug</th>
                <th className="py-3 px-3 text-center">Category</th>
                <th className="py-3 px-3 text-center">Price</th>
                <th className="py-3 px-3 text-center">Drafts</th>
                <th className="py-3 px-3 text-center">Paid Orders</th>
                <th className="py-3 px-3 text-center">Published</th>
                <th className="py-3 px-3 text-right">Gross Revenue</th>
                <th className="py-3 px-3 text-right">Refunds</th>
                <th className="py-3 px-3 text-right">Net Revenue</th>
                <th className="py-3 px-3 text-center">Conversion</th>
                <th className="py-3 px-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EAD8C8]/60">
              {paginatedTemplates.length === 0 ? (
                <tr>
                  <td colSpan={13} className="py-8 text-center text-[#705E55] text-xs">
                    No templates matched your filter criteria.
                  </td>
                </tr>
              ) : (
                paginatedTemplates.map((t) => (
                  <tr key={t.id} className="hover:bg-[#FAF5EE]/60 transition-colors">
                    {/* Serial No. */}
                    <td className="py-3.5 px-3.5 text-center font-medium text-[#705E55]">
                      {t.sr}
                    </td>

                    {/* Template Thumbnail + Title */}
                    <td className="py-3.5 px-4 font-semibold text-[#171412]">
                      <div className="flex items-center gap-2.5">
                        <div className="w-10 h-10 rounded-lg overflow-hidden border border-[#EAD8C8] bg-[#FAF5EE] shrink-0">
                          <img
                            src={t.previewImage}
                            alt={t.title}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              (e.target as any).src = '/images/templates/temple-mandap-wedding-card.webp';
                            }}
                          />
                        </div>
                        <span className="truncate max-w-[200px]" title={t.title}>
                          {t.title}
                        </span>
                      </div>
                    </td>

                    {/* Slug */}
                    <td className="py-3.5 px-3 font-mono text-[11px] text-[#705E55] max-w-[140px] truncate" title={t.slug}>
                      {t.slug}
                    </td>

                    {/* Category */}
                    <td className="py-3.5 px-3 text-center">
                      <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-[#FAF5EE] border border-[#EAD8C8] text-[#8C6D3B]">
                        {t.category}
                      </span>
                    </td>

                    {/* Price */}
                    <td className="py-3.5 px-3 text-center font-bold">
                      ₹{t.price}
                    </td>

                    {/* Drafts */}
                    <td className="py-3.5 px-3 text-center font-medium">
                      {t.draftsCount}
                    </td>

                    {/* Paid Orders */}
                    <td className="py-3.5 px-3 text-center font-medium">
                      {t.paidOrdersCount}
                    </td>

                    {/* Published */}
                    <td className="py-3.5 px-3 text-center font-medium">
                      {t.publishedCount}
                    </td>

                    {/* Gross Revenue */}
                    <td className="py-3.5 px-3 text-right font-medium">
                      ₹{t.grossRevenue.toLocaleString('en-IN')}
                    </td>

                    {/* Refunds */}
                    <td className="py-3.5 px-3 text-right font-medium text-rose-700">
                      ₹{t.refunds.toLocaleString('en-IN')}
                    </td>

                    {/* Net Revenue */}
                    <td className="py-3.5 px-3 text-right font-bold text-emerald-700">
                      ₹{t.netRevenue.toLocaleString('en-IN')}
                    </td>

                    {/* Conversion */}
                    <td className="py-3.5 px-3 text-center">
                      <span
                        className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                          t.conversionRate > 0
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-gray-100 text-[#705E55]'
                        }`}
                      >
                        {t.conversionRate}%
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-3 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <Link
                          href={`/templates/${t.slug}`}
                          target="_blank"
                          className="p-1 rounded-md text-[#705E55] hover:text-[#171412] hover:bg-[#FAF5EE] transition"
                          title="Preview Template"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </Link>
                        <Link
                          href="/admin/builder"
                          className="p-1 rounded-md text-[#705E55] hover:text-[#171412] hover:bg-[#FAF5EE] transition"
                          title="Open Template in Builder"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Table Pagination Bar */}
        <div className="p-4 border-t border-[#EAD8C8] bg-[#FAF5EE]/60 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#705E55]">
          <div>
            Showing{' '}
            <span className="font-semibold text-[#171412]">
              {filteredTemplates.length === 0 ? 0 : (leaderboardPage - 1) * leaderboardLimit + 1} –{' '}
              {Math.min(leaderboardPage * leaderboardLimit, filteredTemplates.length)}
            </span>{' '}
            of <span className="font-semibold text-[#171412]">{filteredTemplates.length}</span> templates
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span>Rows per page:</span>
              <select
                value={leaderboardLimit}
                onChange={(e) => {
                  setLeaderboardLimit(Number(e.target.value));
                  setLeaderboardPage(1);
                }}
                className="px-2 py-1 text-xs rounded-lg bg-white border border-[#EAD8C8] text-[#171412]"
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={25}>25</option>
              </select>
            </div>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setLeaderboardPage(1)}
                disabled={leaderboardPage === 1}
                className="p-1.5 rounded-lg border border-[#EAD8C8] bg-white text-[#171412] disabled:opacity-40 hover:bg-[#FAF5EE] transition"
                title="First Page"
              >
                <ChevronsLeft className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setLeaderboardPage((p) => Math.max(1, p - 1))}
                disabled={leaderboardPage === 1}
                className="p-1.5 rounded-lg border border-[#EAD8C8] bg-white text-[#171412] disabled:opacity-40 hover:bg-[#FAF5EE] transition"
                title="Previous Page"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>

              <span className="px-3 py-1 font-semibold text-white bg-[#7D1935] rounded-lg">
                {leaderboardPage}
              </span>

              {totalTemplatePages > 1 && (
                <button
                  type="button"
                  onClick={() => setLeaderboardPage((p) => Math.min(totalTemplatePages, p + 1))}
                  className="px-2.5 py-1 font-medium rounded-lg text-[#171412] hover:bg-[#FAF5EE] transition"
                >
                  2
                </button>
              )}

              <button
                type="button"
                onClick={() => setLeaderboardPage((p) => Math.min(totalTemplatePages, p + 1))}
                disabled={leaderboardPage === totalTemplatePages}
                className="p-1.5 rounded-lg border border-[#EAD8C8] bg-white text-[#171412] disabled:opacity-40 hover:bg-[#FAF5EE] transition"
                title="Next Page"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setLeaderboardPage(totalTemplatePages)}
                disabled={leaderboardPage === totalTemplatePages}
                className="p-1.5 rounded-lg border border-[#EAD8C8] bg-white text-[#171412] disabled:opacity-40 hover:bg-[#FAF5EE] transition"
                title="Last Page"
              >
                <ChevronsRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ============================================================== */}
      {/* 7. BOTTOM TWO-COLUMN: RECENT ORDERS & RECENT ACTIVITY          */}
      {/* ============================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Recent Orders (6 cols) */}
        <div className="lg:col-span-6 bg-white/90 backdrop-blur-xs rounded-2xl p-5 border border-[#EAD8C8] shadow-xs">
          <div className="flex items-center justify-between border-b border-[#EAD8C8]/60 pb-3">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-4 h-4 text-[#7D1935]" />
              <h2 className="font-serif italic font-bold text-base text-[#171412]">
                Recent Orders
              </h2>
            </div>
            <Link
              href="/admin/orders"
              className="text-xs font-semibold text-[#7D1935] hover:text-[#54152B] transition flex items-center gap-1"
            >
              <span>View All Orders</span>
              <span>&rarr;</span>
            </Link>
          </div>

          <div className="overflow-x-auto mt-3">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="text-[#705E55] font-semibold border-b border-[#EAD8C8]/40">
                  <th className="py-2.5 px-2">Order ID</th>
                  <th className="py-2.5 px-2">Customer</th>
                  <th className="py-2.5 px-2">Template</th>
                  <th className="py-2.5 px-2 text-right">Amount</th>
                  <th className="py-2.5 px-2 text-center">Status</th>
                  <th className="py-2.5 px-2 text-right">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EAD8C8]/40">
                {recentOrders.map((o) => (
                  <tr key={o.id} className="hover:bg-[#FAF5EE]/50 transition-colors">
                    {/* Order ID */}
                    <td className="py-3 px-2 font-mono font-bold text-[#7D1935]">
                      <Link href="/admin/orders" className="hover:underline">
                        {o.orderId}
                      </Link>
                    </td>

                    {/* Customer */}
                    <td className="py-3 px-2 text-[#705E55] whitespace-nowrap">
                      {o.customerPhone}
                    </td>

                    {/* Template */}
                    <td className="py-3 px-2 font-medium text-[#171412] truncate max-w-[120px]" title={o.templateTitle}>
                      {o.templateTitle}
                    </td>

                    {/* Amount */}
                    <td className="py-3 px-2 text-right font-bold text-[#171412]">
                      ₹{o.amount}
                    </td>

                    {/* Status */}
                    <td className="py-3 px-2 text-center">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-semibold ${
                          o.status === 'Paid'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : o.status === 'Refunded'
                            ? 'bg-rose-50 text-rose-700 border border-rose-200'
                            : 'bg-amber-50 text-amber-700 border border-amber-200'
                        }`}
                      >
                        {o.status}
                      </span>
                    </td>

                    {/* Date */}
                    <td className="py-3 px-2 text-right text-[#705E55] whitespace-nowrap">
                      {o.date}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right: Recent Activity (6 cols) */}
        <div className="lg:col-span-6 bg-white/90 backdrop-blur-xs rounded-2xl p-5 border border-[#EAD8C8] shadow-xs">
          <div className="flex items-center justify-between border-b border-[#EAD8C8]/60 pb-3">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#7D1935]" />
              <h2 className="font-serif italic font-bold text-base text-[#171412]">
                Recent Activity
              </h2>
            </div>
            <Link
              href="/admin/audit"
              className="text-xs font-semibold text-[#7D1935] hover:text-[#54152B] transition flex items-center gap-1"
            >
              <span>View All Activity</span>
              <span>&rarr;</span>
            </Link>
          </div>

          {/* Event Timeline */}
          <div className="mt-3 divide-y divide-[#EAD8C8]/40">
            {recentActivity.map((act) => (
              <div key={act.id} className="py-3 flex items-start gap-3 hover:bg-[#FAF5EE]/50 transition-colors rounded-lg px-1">
                {/* Event Icon Badge */}
                <div className="shrink-0 mt-0.5">
                  {act.type === 'PAYMENT' && (
                    <div className="w-7 h-7 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700">
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                  )}
                  {act.type === 'PUBLICATION' && (
                    <div className="w-7 h-7 rounded-full bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-700">
                      <Globe className="w-4 h-4" />
                    </div>
                  )}
                  {act.type === 'DRAFT' && (
                    <div className="w-7 h-7 rounded-full bg-[#FAF5EE] border border-[#EAD8C8] flex items-center justify-center text-[#8C6D3B]">
                      <FileText className="w-4 h-4" />
                    </div>
                  )}
                  {act.type === 'CUSTOMER' && (
                    <div className="w-7 h-7 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700">
                      <Users className="w-4 h-4" />
                    </div>
                  )}
                  {act.type === 'ADMIN' && (
                    <div className="w-7 h-7 rounded-full bg-purple-50 border border-purple-200 flex items-center justify-center text-purple-700">
                      <Sparkles className="w-4 h-4" />
                    </div>
                  )}
                </div>

                {/* Event Details */}
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-xs text-[#171412] leading-snug">
                    {act.title}
                  </div>
                  <div className="text-[11px] text-[#705E55] mt-0.5 truncate">
                    {act.subtitle}
                  </div>
                </div>

                {/* Event Timestamp */}
                <div className="shrink-0 text-right text-[11px] text-[#705E55] whitespace-nowrap">
                  {act.timestamp}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
