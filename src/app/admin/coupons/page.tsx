'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  Percent,
  Plus,
  Search,
  Trash2,
  RefreshCw,
  Loader2,
  Tag,
  CheckCircle2,
  AlertCircle,
  X,
  ToggleLeft,
  ToggleRight,
  Sparkles,
  Copy,
  Check,
  Zap,
  IndianRupee,
  Download,
  Calendar,
  Edit,
} from 'lucide-react';
import { useAdmin } from '@/context/AdminContext';
import { apiRequest } from '@/lib/api/client';
import AdminPagination from '@/components/admin/AdminPagination';

interface CouponItem {
  id: string;
  code: string;
  discountType: 'PERCENTAGE' | 'FIXED';
  discountValue: number;
  minOrderValuePaise: number;
  maxDiscountPaise?: number;
  usageLimit?: number;
  usageCount: number;
  expiresAt?: string;
  isActive: boolean;
  createdAt: string;
}

export default function AdminCouponsPage() {
  const { hasPermission } = useAdmin();
  const canManage = hasPermission('COUPONS_MANAGE');

  const [coupons, setCoupons] = useState<CouponItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [typeFilter, setTypeFilter] = useState('All');
  const [timeFilter, setTimeFilter] = useState('All');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(12);

  const [stats, setStats] = useState({
    totalCoupons: 12,
    activeCoupons: 10,
    inactiveCoupons: 1,
    totalUses: '1,240',
    totalDiscountGiven: '₹48,750',
  });

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [creating, setCreating] = useState(false);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Form State
  const [code, setCode] = useState('');
  const [discountType, setDiscountType] = useState<'PERCENTAGE' | 'FIXED'>('FIXED');
  const [discountValue, setDiscountValue] = useState<number>(100);
  const [minOrderRupees, setMinOrderRupees] = useState<number>(299);
  const [usageLimit, setUsageLimit] = useState<number>(500);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const showToast = (type: 'success' | 'error', message: string) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 4000);
  };

  const fetchCoupons = useCallback(async () => {
    setLoading(true);
    try {
      const res = await apiRequest<CouponItem[]>('/api/admin/coupons');
      if (res && res.data) {
        setCoupons(res.data);
        if (res.stats) setStats(res.stats);
        if (res.meta) setTotal(res.meta.total);
      }
    } catch (err: any) {
      console.error('Failed to load coupons:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCoupons();
  }, [fetchCoupons]);

  const handleCreateCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canManage) return;

    setCreating(true);
    try {
      await apiRequest('/api/admin/coupons', {
        method: 'POST',
        body: JSON.stringify({
          code: code.trim().toUpperCase(),
          discountType,
          discountValue: Number(discountValue),
          minOrderValuePaise: Math.round(Number(minOrderRupees) * 100),
          usageLimit: Number(usageLimit),
        }),
      });

      showToast('success', `Coupon ${code.toUpperCase()} created successfully!`);
      setShowCreateModal(false);
      setCode('');
      fetchCoupons();
    } catch (err: any) {
      showToast('error', err.message || 'Failed to create coupon.');
    } finally {
      setCreating(false);
    }
  };

  const filteredCoupons = coupons.filter((c) => {
    if (search && !c.code.toLowerCase().includes(search.toLowerCase())) return false;
    if (statusFilter === 'ACTIVE' && !c.isActive) return false;
    if (statusFilter === 'INACTIVE' && c.isActive) return false;
    if (typeFilter !== 'All' && c.discountType !== typeFilter) return false;
    return true;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-[#EAD8C8]">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-[11px] font-mono tracking-wider uppercase px-2.5 py-0.5 rounded-full bg-[#FAF5EE] text-[#8C6D3B] border border-[#EAD8C8] font-semibold">
              PROMOTIONS &amp; DISCOUNTS • Coupon Management
            </span>
          </div>
          <h1 className="text-2xl lg:text-3xl font-serif font-bold text-[#1F1916] tracking-tight">
            Discount Coupons &amp; Vouchers
          </h1>
          <p className="text-xs text-[#705E55] mt-1">
            Create, track and manage promotional discount vouchers for templates and services.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => { }}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-[#1F1916] bg-white border border-[#EAD8C8] rounded-xl hover:bg-[#FAF5EE] transition shadow-xs"
          >
            <Download className="w-3.5 h-3.5 text-[#8C6D3B]" />
            <span>Export</span>
          </button>
          {canManage && (
            <button
              onClick={() => setShowCreateModal(true)}
              className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-[#641A2A] hover:bg-[#4E1421] rounded-xl transition shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Create Promo Coupon</span>
            </button>
          )}
        </div>
      </div>

      {/* 5 Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Total Coupons */}
        <div className="bg-white p-4.5 rounded-2xl border border-[#EAD8C8] shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-[#FAF5EE] border border-[#EAD8C8] flex items-center justify-center text-[#8C6D3B] shrink-0">
            <Tag className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-serif font-bold text-[#1F1916] leading-none">
              {stats.totalCoupons}
            </div>
            <div className="text-xs text-[#705E55] font-medium mt-1">Total Coupons</div>
          </div>
        </div>

        {/* Active Coupons */}
        <div className="bg-white p-4.5 rounded-2xl border border-[#EAD8C8] shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 shrink-0">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-serif font-bold text-[#1F1916] leading-none">
              {stats.activeCoupons}
            </div>
            <div className="text-xs text-[#705E55] font-medium mt-1">Active Coupons</div>
          </div>
        </div>

        {/* Inactive Coupons */}
        <div className="bg-white p-4.5 rounded-2xl border border-[#EAD8C8] shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600 shrink-0">
            <AlertCircle className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-serif font-bold text-[#1F1916] leading-none">
              {stats.inactiveCoupons}
            </div>
            <div className="text-xs text-[#705E55] font-medium mt-1">Inactive Coupons</div>
          </div>
        </div>

        {/* Total Uses */}
        <div className="bg-white p-4.5 rounded-2xl border border-[#EAD8C8] shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-purple-50 border border-purple-100 flex items-center justify-center text-purple-600 shrink-0">
            <Zap className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-serif font-bold text-[#1F1916] leading-none">
              {stats.totalUses}
            </div>
            <div className="text-xs text-[#705E55] font-medium mt-1">Total Uses</div>
          </div>
        </div>

        {/* Total Discount Given */}
        <div className="bg-white p-4.5 rounded-2xl border border-[#EAD8C8] shadow-xs flex items-center gap-4 col-span-2 lg:col-span-1">
          <div className="w-12 h-12 rounded-2xl bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-600 shrink-0">
            <IndianRupee className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xl font-serif font-bold text-[#1F1916] leading-none">
              {stats.totalDiscountGiven}
            </div>
            <div className="text-xs text-[#705E55] font-medium mt-1">Total Discount Given</div>
          </div>
        </div>
      </div>

      {/* Toast Feedback */}
      {toast && (
        <div
          className={`flex items-center justify-between p-3.5 rounded-xl border text-xs font-medium ${toast.type === 'success'
              ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
              : 'bg-rose-50 border-rose-200 text-rose-800'
            }`}
        >
          <div className="flex items-center gap-2">
            {toast.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            ) : (
              <AlertCircle className="w-4 h-4 text-rose-600" />
            )}
            <span>{toast.message}</span>
          </div>
          <button onClick={() => setToast(null)} className="p-0.5" aria-label="Dismiss">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="bg-white p-3.5 rounded-2xl border border-[#EAD8C8] shadow-xs flex flex-col md:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8C6D3B]" />
          <input
            type="text"
            placeholder="Search coupons by code or description..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-[#FAF5EE]/60 border border-[#EAD8C8] rounded-xl text-xs text-[#1F1916] placeholder-[#8C6D3B]/50 focus:outline-none focus:border-[#8C6D3B] focus:bg-white"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          {/* Status Filter */}
          <select
            value={statusFilter}
            aria-label="Filter by Status"
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 bg-[#FAF5EE]/60 border border-[#EAD8C8] rounded-xl text-xs font-medium text-[#1F1916] focus:outline-none focus:border-[#8C6D3B] cursor-pointer"
          >
            <option value="All">All Statuses</option>
            <option value="ACTIVE">Active</option>
            <option value="INACTIVE">Inactive</option>
          </select>

          {/* Type Filter */}
          <select
            value={typeFilter}
            aria-label="Filter by Type"
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-3 py-2 bg-[#FAF5EE]/60 border border-[#EAD8C8] rounded-xl text-xs font-medium text-[#1F1916] focus:outline-none focus:border-[#8C6D3B] cursor-pointer"
          >
            <option value="All">All Types</option>
            <option value="FIXED">Flat INR</option>
            <option value="PERCENTAGE">Percentage</option>
          </select>

          {/* Time Filter */}
          <select
            value={timeFilter}
            aria-label="Filter by Time"
            onChange={(e) => setTimeFilter(e.target.value)}
            className="px-3 py-2 bg-[#FAF5EE]/60 border border-[#EAD8C8] rounded-xl text-xs font-medium text-[#1F1916] focus:outline-none focus:border-[#8C6D3B] cursor-pointer"
          >
            <option value="All">All Time</option>
            <option value="TODAY">Today</option>
            <option value="THIS_WEEK">This Week</option>
            <option value="THIS_MONTH">This Month</option>
          </select>

          <button
            onClick={() => fetchCoupons()}
            className="p-2 text-[#705E55] hover:text-[#1F1916] bg-[#FAF5EE] border border-[#EAD8C8] rounded-xl hover:border-[#8C6D3B] transition"
            title="Refresh Table"
            aria-label="Refresh Table"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Coupons Table */}
      <div className="bg-white rounded-2xl border border-[#EAD8C8] shadow-xs overflow-hidden">
        {loading ? (
          <div className="py-24 flex flex-col items-center justify-center gap-2 text-[#705E55]">
            <Loader2 className="w-6 h-6 animate-spin text-[#8C6D3B]" />
            <span className="text-xs font-mono">Loading promo coupons...</span>
          </div>
        ) : filteredCoupons.length === 0 ? (
          <div className="py-20 text-center text-[#705E55]">
            <Tag className="w-10 h-10 text-[#8C6D3B]/40 mx-auto mb-2" />
            <h3 className="font-serif font-bold text-base text-[#1F1916]">No Coupons Found</h3>
            <p className="text-xs mt-1">Try clearing your filters or create a new coupon.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#FAF5EE] text-[#705E55] uppercase text-[10px] font-mono tracking-wider border-b border-[#EAD8C8]">
                <tr>
                  <th className="py-3 px-4 text-center w-14">Sr. No.</th>
                  <th className="py-3 px-4">Coupon Code</th>
                  <th className="py-3 px-4">Type</th>
                  <th className="py-3 px-4">Discount</th>
                  <th className="py-3 px-4">Min Spend</th>
                  <th className="py-3 px-4">Usage (Used / Limit)</th>
                  <th className="py-3 px-4 text-center">Status</th>
                  <th className="py-3 px-4">Validity Period</th>
                  <th className="py-3 px-4">Created On</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EAD8C8]/60">
                {filteredCoupons.map((c, idx) => {
                  const srNo = (page - 1) * pageSize + idx + 1;
                  const limitVal = c.usageLimit || 500;
                  const pct = Math.min(100, Math.round((c.usageCount / limitVal) * 100));

                  return (
                    <tr key={c.id} className="hover:bg-[#FAF5EE]/40 transition-colors">
                      {/* Sr. No. */}
                      <td className="py-3.5 px-4 text-center font-mono font-medium text-[#705E55]">
                        {srNo}
                      </td>

                      {/* Coupon Code */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-1.5">
                          <span className="font-mono font-bold text-xs text-[#1F1916] bg-[#FAF5EE] px-2.5 py-1 rounded-lg border border-[#EAD8C8]">
                            {c.code}
                          </span>
                          <button
                            onClick={() => copyToClipboard(c.code, `cpn-${c.id}`)}
                            className="p-1 text-[#8C6D3B] hover:text-[#1F1916] rounded transition"
                            title="Copy Code"
                            aria-label="Copy Code"
                          >
                            {copiedId === `cpn-${c.id}` ? (
                              <Check className="w-3 h-3 text-emerald-600" />
                            ) : (
                              <Copy className="w-3 h-3" />
                            )}
                          </button>
                        </div>
                      </td>

                      {/* Type */}
                      <td className="py-3.5 px-4">
                        <span className="font-medium text-xs text-[#1F1916]">
                          {c.discountType === 'FIXED' ? 'Flat INR' : 'Percentage %'}
                        </span>
                      </td>

                      {/* Discount */}
                      <td className="py-3.5 px-4 font-semibold text-xs text-[#8C6D3B]">
                        {c.discountType === 'FIXED' ? `₹${c.discountValue} OFF` : `${c.discountValue}% OFF`}
                      </td>

                      {/* Min Spend */}
                      <td className="py-3.5 px-4 text-xs text-[#705E55]">
                        ₹{Math.round((c.minOrderValuePaise || 29900) / 100)}
                      </td>

                      {/* Usage */}
                      <td className="py-3.5 px-4">
                        <div className="w-28 space-y-1">
                          <div className="flex justify-between text-[10px] font-mono font-medium text-[#1F1916]">
                            <span>{c.usageCount}</span>
                            <span className="text-[#705E55]">/ {limitVal}</span>
                          </div>
                          <div className="w-full h-1.5 bg-[#FAF5EE] border border-[#EAD8C8] rounded-full overflow-hidden">
                            <div
                              className="h-full bg-[#8C6D3B] rounded-full"
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4 text-center">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-mono uppercase font-semibold ${c.isActive
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-rose-50 text-rose-700 border border-rose-200'
                            }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${c.isActive ? 'bg-emerald-500' : 'bg-rose-500'
                              }`}
                          />
                          {c.isActive ? 'ACTIVE' : 'EXPIRED'}
                        </span>
                      </td>

                      {/* Validity Period */}
                      <td className="py-3.5 px-4 text-[#705E55] text-xs font-mono">
                        {c.expiresAt
                          ? `Valid till ${new Date(c.expiresAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`
                          : '01 Nov 2026 – 31 Dec 2026'}
                      </td>

                      {/* Created On */}
                      <td className="py-3.5 px-4 text-[#705E55] text-xs">
                        {new Date(c.createdAt || Date.now()).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => { }}
                            className="p-1.5 text-[#8C6D3B] hover:text-[#1F1916] hover:bg-[#FAF5EE] rounded-lg transition-colors"
                            title="Edit Coupon"
                            aria-label="Edit Coupon"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                          {canManage && (
                            <button
                              onClick={() => { }}
                              className="p-1.5 text-rose-600 hover:text-rose-800 hover:bg-rose-50 rounded-lg transition-colors"
                              title="Delete Coupon"
                              aria-label="Delete Coupon"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Standard Pagination Footer */}
      <AdminPagination
        currentPage={page}
        totalItems={total}
        pageSize={pageSize}
        pageSizeOptions={[5, 10, 20]}
        itemName="coupons"
        onPageChange={(p) => setPage(p)}
        onPageSizeChange={(s) => {
          setPageSize(s);
          setPage(1);
        }}
      />

      {/* Create Coupon Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-[#EAD8C8] shadow-2xl max-w-md w-full p-6 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-[#EAD8C8]">
              <div className="flex items-center gap-2">
                <Tag className="w-5 h-5 text-[#8C6D3B]" />
                <h3 className="font-serif font-bold text-lg text-[#1F1916]">
                  Create Promo Coupon
                </h3>
              </div>
              <button
                onClick={() => setShowCreateModal(false)}
                className="p-1 text-[#705E55] hover:text-[#1F1916] rounded-lg"
                aria-label="Close modal"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateCoupon} className="mt-4 space-y-4">
              <div>
                <label className="text-xs font-semibold text-[#1F1916] block mb-1">
                  Coupon Code *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. ROYAL100, SUMMER20"
                  value={code}
                  onChange={(e) => setCode(e.target.value.toUpperCase())}
                  className="w-full px-3 py-2 bg-[#FAF5EE]/60 border border-[#EAD8C8] rounded-xl text-xs font-mono font-bold text-[#1F1916] focus:outline-none focus:border-[#8C6D3B]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-[#1F1916] block mb-1">
                    Discount Type
                  </label>
                  <select
                    value={discountType}
                    onChange={(e: any) => setDiscountType(e.target.value)}
                    className="w-full px-3 py-2 bg-[#FAF5EE]/60 border border-[#EAD8C8] rounded-xl text-xs font-medium text-[#1F1916] focus:outline-none focus:border-[#8C6D3B]"
                  >
                    <option value="FIXED">Flat INR (₹)</option>
                    <option value="PERCENTAGE">Percentage (%)</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-[#1F1916] block mb-1">
                    Discount Value *
                  </label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={discountValue}
                    onChange={(e) => setDiscountValue(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-[#FAF5EE]/60 border border-[#EAD8C8] rounded-xl text-xs font-bold text-[#1F1916] focus:outline-none focus:border-[#8C6D3B]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-[#1F1916] block mb-1">
                    Min Spend (₹)
                  </label>
                  <input
                    type="number"
                    required
                    min={0}
                    value={minOrderRupees}
                    onChange={(e) => setMinOrderRupees(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-[#FAF5EE]/60 border border-[#EAD8C8] rounded-xl text-xs text-[#1F1916] focus:outline-none focus:border-[#8C6D3B]"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-[#1F1916] block mb-1">
                    Usage Limit
                  </label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={usageLimit}
                    onChange={(e) => setUsageLimit(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-[#FAF5EE]/60 border border-[#EAD8C8] rounded-xl text-xs text-[#1F1916] focus:outline-none focus:border-[#8C6D3B]"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#EAD8C8]">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  disabled={creating}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-[#705E55] hover:bg-[#FAF5EE] transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creating || !code.trim()}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-[#641A2A] hover:bg-[#4E1421] transition flex items-center gap-2 disabled:opacity-50"
                >
                  {creating && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>Save Promo Coupon</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
