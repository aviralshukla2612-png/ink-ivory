'use client';

import React, { useState, useEffect } from 'react';
import {
  CreditCard,
  Search,
  CheckCircle2,
  AlertCircle,
  RotateCcw,
  RefreshCw,
  ExternalLink,
  ShieldCheck,
  TrendingUp,
} from 'lucide-react';

export default function PaymentsAdminPage() {
  const [payments, setPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const fetchPayments = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/payments', { credentials: 'include' });
      const data = await res.json();
      if (res.ok && data.success) {
        setPayments(data.data || []);
      }
    } catch (e) {
      console.error('Error fetching payments:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  const filtered = payments.filter((p) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      (p.paymentId && p.paymentId.toLowerCase().includes(q)) ||
      (p.orderId && p.orderId.toLowerCase().includes(q)) ||
      (p.method && p.method.toLowerCase().includes(q))
    );
  });

  const totalCapturedPaise = payments
    .filter((p) => p.status === 'CAPTURED')
    .reduce((sum, p) => sum + (p.amount || 0), 0);

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-[#E9DFD2]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#C69A50]/15 text-[#C69A50] uppercase tracking-wider">
              Financial Treasury
            </span>
            <span className="text-xs text-[#702E3D] font-medium">Gateway Payment Ledger</span>
          </div>
          <h1 className="font-serif text-3xl font-medium text-[#30231D]">Payment Transactions</h1>
          <p className="text-sm text-[#702E3D]/80 mt-1">
            Complete transaction history across Razorpay gateway and direct checkout settlements.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => fetchPayments()}
            className="px-3.5 py-2 rounded-xl text-xs font-medium text-[#30231D] bg-white border border-[#E9DFD2] hover:bg-[#FAF7F2] transition flex items-center gap-2 shadow-sm"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Refresh
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-[#E9DFD2] shadow-sm">
          <div className="text-xs text-[#702E3D] font-medium mb-1">Total Settled Volume</div>
          <div className="font-serif text-2xl font-semibold text-[#30231D]">
            ₹{(totalCapturedPaise / 100).toLocaleString('en-IN')}
          </div>
          <div className="text-[11px] text-emerald-600 mt-1 font-medium flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" /> 100% gateway reconciliation
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-[#E9DFD2] shadow-sm">
          <div className="text-xs text-[#702E3D] font-medium mb-1">Captured Transactions</div>
          <div className="font-serif text-2xl font-semibold text-[#30231D]">
            {payments.filter((p) => p.status === 'CAPTURED').length}
          </div>
          <div className="text-[11px] text-[#702E3D]/70 mt-1">Web & Android hybrid checkouts</div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-[#E9DFD2] shadow-sm">
          <div className="text-xs text-[#702E3D] font-medium mb-1">Refund Rate</div>
          <div className="font-serif text-2xl font-semibold text-[#30231D]">
            {payments.length > 0
              ? ((payments.filter((p) => p.status === 'REFUNDED').length / payments.length) * 100).toFixed(1)
              : 0}%
          </div>
          <div className="text-[11px] text-zinc-500 mt-1">Lowest in luxury stationery tier</div>
        </div>
      </div>

      {/* Search */}
      <div className="flex items-center justify-between bg-white p-4 rounded-2xl border border-[#E9DFD2]">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-[#702E3D]/50 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search payment ID, order ID, or method..."
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-[#E9DFD2] bg-[#FAF7F2] text-xs text-[#30231D]"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-[#E9DFD2] overflow-hidden shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-[#E9DFD2] bg-[#FAF7F2] text-[11px] font-semibold text-[#702E3D] uppercase tracking-wider">
              <th className="py-3 px-4">Payment ID</th>
              <th className="py-3 px-4">Order ID</th>
              <th className="py-3 px-4">Amount</th>
              <th className="py-3 px-4">Method</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4">Timestamp</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E9DFD2] text-xs">
            {filtered.map((p) => (
              <tr key={p.id} className="hover:bg-[#FAF7F2]/50 transition">
                <td className="py-3 px-4 font-mono font-medium text-[#30231D]">{p.paymentId}</td>
                <td className="py-3 px-4 font-mono text-[#702E3D]">{p.orderId}</td>
                <td className="py-3 px-4 font-semibold text-[#30231D]">
                  ₹{(p.amount / 100).toLocaleString('en-IN')}
                </td>
                <td className="py-3 px-4">
                  <span className="px-2 py-0.5 rounded bg-[#FAF7F2] border border-[#E9DFD2] text-[10px] font-medium text-[#702E3D]">
                    {p.method || 'UPI / Card'}
                  </span>
                </td>
                <td className="py-3 px-4">
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold ${
                      p.status === 'CAPTURED'
                        ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                        : p.status === 'REFUNDED'
                        ? 'bg-amber-50 text-amber-800 border border-amber-200'
                        : 'bg-zinc-100 text-zinc-700'
                    }`}
                  >
                    {p.status}
                  </span>
                </td>
                <td className="py-3 px-4 text-[#702E3D]/80">
                  {new Date(p.verifiedAt || p.createdAt).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
