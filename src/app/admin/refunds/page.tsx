'use client';

import React, { useState, useEffect } from 'react';
import {
  RotateCcw,
  Search,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  ExternalLink,
  ShieldAlert,
} from 'lucide-react';
import { useAdmin } from '@/context/AdminContext';

export default function RefundsAdminPage() {
  const { hasPermission } = useAdmin();
  const canRefund = hasPermission('REFUNDS_MANAGE');

  const [refunds, setRefunds] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const fetchRefunds = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/payments', { credentials: 'include' });
      const data = await res.json();
      if (res.ok && data.success) {
        const refundedItems = (data.data || []).filter((p: any) => p.status === 'REFUNDED');
        setRefunds(refundedItems);
      }
    } catch (e) {
      console.error('Error fetching refunds:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRefunds();
  }, []);

  const filtered = refunds.filter((r) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      (r.paymentId && r.paymentId.toLowerCase().includes(q)) ||
      (r.orderId && r.orderId.toLowerCase().includes(q)) ||
      (r.refundReason && r.refundReason.toLowerCase().includes(q))
    );
  });

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-[#E9DFD2]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#702E3D]/15 text-[#702E3D] uppercase tracking-wider">
              Dispute & Return Operations
            </span>
            <span className="text-xs text-[#C69A50] font-medium">Reconciliation Audit Trail</span>
          </div>
          <h1 className="font-serif text-3xl font-medium text-[#30231D]">Refunds & Reversals</h1>
          <p className="text-sm text-[#702E3D]/80 mt-1">
            Audit approved refunds, track reversal reasons, and verify Razorpay payment reversals.
          </p>
        </div>

        <button
          onClick={() => fetchRefunds()}
          className="px-3.5 py-2 rounded-xl text-xs font-medium text-[#30231D] bg-white border border-[#E9DFD2] hover:bg-[#FAF7F2] transition flex items-center gap-2 shadow-sm"
        >
          <RefreshCw className="w-3.5 h-3.5" /> Refresh
        </button>
      </div>

      {/* Search */}
      <div className="flex items-center justify-between bg-white p-4 rounded-2xl border border-[#E9DFD2]">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-[#702E3D]/50 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search refund ID, order ID, or reason..."
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-[#E9DFD2] bg-[#FAF7F2] text-xs text-[#30231D]"
          />
        </div>
      </div>

      {/* Refunds Table */}
      <div className="bg-white rounded-2xl border border-[#E9DFD2] overflow-hidden shadow-sm">
        {filtered.length === 0 ? (
          <div className="p-12 text-center text-xs text-[#702E3D]">
            <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
            <p className="font-serif text-sm font-semibold text-[#30231D]">No Pending or Historical Disputes</p>
            <p className="text-[11px] text-[#702E3D]/70 mt-1">
              All processed orders are active and settled with zero outstanding chargebacks.
            </p>
          </div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#E9DFD2] bg-[#FAF7F2] text-[11px] font-semibold text-[#702E3D] uppercase tracking-wider">
                <th className="py-3 px-4">Refunded Payment</th>
                <th className="py-3 px-4">Order ID</th>
                <th className="py-3 px-4">Reversal Amount</th>
                <th className="py-3 px-4">Reason / Notes</th>
                <th className="py-3 px-4">Processed By</th>
                <th className="py-3 px-4">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E9DFD2] text-xs">
              {filtered.map((r) => (
                <tr key={r.id} className="hover:bg-[#FAF7F2]/50 transition">
                  <td className="py-3 px-4 font-mono font-medium text-[#30231D]">{r.paymentId}</td>
                  <td className="py-3 px-4 font-mono text-[#702E3D]">{r.orderId}</td>
                  <td className="py-3 px-4 font-semibold text-rose-700">
                    -₹{(r.amount / 100).toLocaleString('en-IN')}
                  </td>
                  <td className="py-3 px-4 text-[#30231D] max-w-xs truncate">
                    {r.refundReason || 'Customer requested cancellation'}
                  </td>
                  <td className="py-3 px-4 text-[11px] font-mono text-[#702E3D]">
                    {r.refundedBy || 'usr_super_admin'}
                  </td>
                  <td className="py-3 px-4 text-[#702E3D]/80">
                    {new Date(r.refundedAt || r.createdAt).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
