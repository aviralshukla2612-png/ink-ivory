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
} from 'lucide-react';
import { useAdmin } from '@/context/AdminContext';
import { apiRequest } from '@/lib/api/client';

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
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [creating, setCreating] = useState(false);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // New Coupon Form State
  const [code, setCode] = useState('');
  const [discountType, setDiscountType] = useState<'PERCENTAGE' | 'FIXED'>('FIXED');
  const [discountValue, setDiscountValue] = useState<number>(50); // in Rupees or %
  const [minOrderRupees, setMinOrderRupees] = useState<number>(299);
  const [usageLimit, setUsageLimit] = useState<number>(500);

  const showToast = (type: 'success' | 'error', message: string) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 4000);
  };

  const fetchCoupons = useCallback(async () => {
    setLoading(true);
    try {
      const res = await apiRequest<CouponItem[]>('/api/admin/coupons');
      if (res.success && res.data) {
        setCoupons(res.data);
      } else {
        showToast('error', res.error?.message || 'Failed to load coupons.');
      }
    } catch {
      showToast('error', 'Network error fetching coupons.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCoupons();
  }, [fetchCoupons]);

  const handleCreateCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim() || code.length < 3) {
      showToast('error', 'Coupon code must be at least 3 characters.');
      return;
    }

    setCreating(true);
    try {
      const payload = {
        code: code.trim().toUpperCase(),
        discountType,
        discountValue: discountType === 'FIXED' ? discountValue * 100 : discountValue,
        minOrderValuePaise: minOrderRupees * 100,
        usageLimit,
      };

      const res = await apiRequest<CouponItem>('/api/admin/coupons', {
        method: 'POST',
        body: JSON.stringify(payload),
      });

      if (res.success && res.data) {
        showToast('success', res.message || 'Coupon successfully created.');
        setShowCreateModal(false);
        setCode('');
        fetchCoupons();
      } else {
        showToast('error', res.error?.message || 'Failed to create coupon.');
      }
    } catch {
      showToast('error', 'Network error creating coupon.');
    } finally {
      setCreating(false);
    }
  };

  const handleToggleActive = async (coupon: CouponItem) => {
    try {
      const res = await apiRequest<CouponItem>(`/api/admin/coupons/${encodeURIComponent(coupon.id)}`, {
        method: 'PATCH',
        body: JSON.stringify({ isActive: !coupon.isActive }),
      });

      if (res.success) {
        showToast('success', `Coupon ${coupon.code} ${!coupon.isActive ? 'activated' : 'deactivated'}.`);
        fetchCoupons();
      } else {
        showToast('error', res.error?.message || 'Failed to update coupon.');
      }
    } catch {
      showToast('error', 'Network error updating coupon status.');
    }
  };

  const handleDeleteCoupon = async (id: string, couponCode: string) => {
    if (!confirm(`Are you sure you want to permanently delete coupon "${couponCode}"?`)) return;

    try {
      const res = await apiRequest(`/api/admin/coupons/${encodeURIComponent(id)}`, {
        method: 'DELETE',
      });

      if (res.success) {
        showToast('success', `Coupon "${couponCode}" deleted.`);
        fetchCoupons();
      } else {
        showToast('error', res.error?.message || 'Failed to delete coupon.');
      }
    } catch {
      showToast('error', 'Network error deleting coupon.');
    }
  };

  const filteredCoupons = coupons.filter(
    (c) =>
      c.code.toLowerCase().includes(search.toLowerCase()) ||
      c.discountType.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {toast && (
        <div className={`fixed top-4 right-4 z-50 flex items-center gap-2 px-4 py-3 rounded-lg shadow-xl text-sm border backdrop-blur-md transition-all ${toast.type === 'success' ? 'bg-emerald-950/90 border-emerald-800 text-emerald-200' : 'bg-rose-950/90 border-rose-800 text-rose-200'}`}>
          {toast.type === 'success' ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <AlertCircle className="w-4 h-4 text-rose-400" />}
          {toast.message}
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-800">
        <div>
          <h1 className="text-2xl font-serif text-amber-100 flex items-center gap-3">
            <Percent className="w-6 h-6 text-amber-400" />
            Coupons & Promotional Discounts
          </h1>
          <p className="text-sm text-stone-400 mt-1">
            Manage 100% database-backed discount vouchers, percentage promos, and campaign usage limits.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={fetchCoupons}
            className="flex items-center gap-2 px-3.5 py-2 text-xs font-medium text-stone-300 bg-stone-900 border border-stone-800 rounded-lg hover:border-amber-700/50 hover:text-amber-200 transition-all"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
          {canManage && (
            <button
              onClick={() => setShowCreateModal(true)}
              className="flex items-center gap-2 px-4 py-2 text-xs font-semibold bg-amber-500 hover:bg-amber-400 text-stone-950 rounded-lg shadow-md transition-all"
            >
              <Plus className="w-4 h-4" />
              Create Promo Coupon
            </button>
          )}
        </div>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="w-4 h-4 text-stone-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder="Search coupons by code or type..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2 text-xs bg-stone-900/80 border border-stone-800 rounded-lg text-stone-200 placeholder:text-stone-500 focus:outline-none focus:border-amber-600 transition-colors"
        />
      </div>

      {/* Coupons Table */}
      <div className="bg-stone-900/50 border border-stone-800/80 rounded-xl overflow-hidden backdrop-blur-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-950/70 border-b border-stone-800 text-stone-400 font-medium">
              <tr>
                <th className="py-3 px-4">Coupon Code</th>
                <th className="py-3 px-4">Type</th>
                <th className="py-3 px-4">Discount</th>
                <th className="py-3 px-4">Min Spend</th>
                <th className="py-3 px-4">Usage (Used / Limit)</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-800/50 text-stone-300">
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-stone-500">
                    <Loader2 className="w-5 h-5 animate-spin mx-auto mb-2 text-amber-500" />
                    Loading coupons...
                  </td>
                </tr>
              ) : filteredCoupons.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-stone-500">
                    No active or historical coupons found.
                  </td>
                </tr>
              ) : (
                filteredCoupons.map((c) => (
                  <tr key={c.id} className="hover:bg-stone-800/30 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-amber-300 tracking-wider">
                      {c.code}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded text-[11px] bg-stone-800 text-stone-300 border border-stone-700">
                        {c.discountType === 'FIXED' ? 'Flat INR' : 'Percentage'}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-stone-100">
                      {c.discountType === 'FIXED' ? `₹${Math.round(c.discountValue / 100)} OFF` : `${c.discountValue}% OFF`}
                    </td>
                    <td className="py-3.5 px-4 text-stone-400">
                      ₹{Math.round(c.minOrderValuePaise / 100)}
                    </td>
                    <td className="py-3.5 px-4 text-stone-300">
                      {c.usageCount} / {c.usageLimit || '∞'}
                    </td>
                    <td className="py-3.5 px-4">
                      {c.isActive ? (
                        <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-950/60 text-emerald-300 border border-emerald-800/40">Active</span>
                      ) : (
                        <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-stone-800 text-stone-400 border border-stone-700">Disabled</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      {canManage && (
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleToggleActive(c)}
                            className="p-1.5 rounded-md hover:bg-stone-800 text-stone-400 hover:text-amber-200 transition-colors"
                            title={c.isActive ? 'Disable Coupon' : 'Enable Coupon'}
                          >
                            {c.isActive ? <ToggleRight className="w-5 h-5 text-emerald-400" /> : <ToggleLeft className="w-5 h-5 text-stone-500" />}
                          </button>
                          <button
                            onClick={() => handleDeleteCoupon(c.id, c.code)}
                            className="p-1.5 rounded-md hover:bg-rose-950/60 text-stone-400 hover:text-rose-300 transition-colors"
                            title="Delete Coupon"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Coupon Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="w-full max-w-md bg-stone-900 border border-stone-800 rounded-xl p-6 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-stone-800">
              <h3 className="text-base font-serif text-amber-100 flex items-center gap-2">
                <Tag className="w-4 h-4 text-amber-400" />
                Create New Promo Code
              </h3>
              <button onClick={() => setShowCreateModal(false)} className="text-stone-400 hover:text-stone-100">
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleCreateCoupon} className="space-y-3 text-xs">
              <div>
                <label className="block text-stone-300 font-medium mb-1">Coupon Code (Uppercase)</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. WEDDING20"
                  value={code}
                  onChange={(e) => setCode(e.target.value.toUpperCase())}
                  className="w-full p-2.5 bg-stone-950 border border-stone-800 rounded-lg text-stone-200 font-mono tracking-wider focus:outline-none focus:border-amber-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-stone-300 font-medium mb-1">Discount Type</label>
                  <select
                    value={discountType}
                    onChange={(e: any) => setDiscountType(e.target.value)}
                    className="w-full p-2.5 bg-stone-950 border border-stone-800 rounded-lg text-stone-200 focus:outline-none focus:border-amber-600"
                  >
                    <option value="FIXED">Flat INR Off (₹)</option>
                    <option value="PERCENTAGE">Percentage (%)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-stone-300 font-medium mb-1">
                    {discountType === 'FIXED' ? 'Discount (₹)' : 'Discount (%)'}
                  </label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={discountValue}
                    onChange={(e) => setDiscountValue(Number(e.target.value))}
                    className="w-full p-2.5 bg-stone-950 border border-stone-800 rounded-lg text-stone-200 focus:outline-none focus:border-amber-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-stone-300 font-medium mb-1">Min Spend (₹)</label>
                  <input
                    type="number"
                    min={0}
                    value={minOrderRupees}
                    onChange={(e) => setMinOrderRupees(Number(e.target.value))}
                    className="w-full p-2.5 bg-stone-950 border border-stone-800 rounded-lg text-stone-200 focus:outline-none focus:border-amber-600"
                  />
                </div>
                <div>
                  <label className="block text-stone-300 font-medium mb-1">Max Redemptions</label>
                  <input
                    type="number"
                    min={1}
                    value={usageLimit}
                    onChange={(e) => setUsageLimit(Number(e.target.value))}
                    className="w-full p-2.5 bg-stone-950 border border-stone-800 rounded-lg text-stone-200 focus:outline-none focus:border-amber-600"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-3.5 py-1.5 text-stone-400 hover:text-stone-200 bg-stone-800/60 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creating}
                  className="flex items-center gap-1.5 px-4 py-1.5 font-semibold bg-amber-500 hover:bg-amber-400 text-stone-950 rounded-lg disabled:opacity-50"
                >
                  {creating && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  Save Coupon
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
