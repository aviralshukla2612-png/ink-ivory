'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  CreditCard,
  Search,
  CheckCircle2,
  AlertCircle,
  RotateCcw,
  RefreshCw,
  Copy,
  Check,
  Clock,
  TrendingUp,
  Eye,
  IndianRupee,
  ShieldCheck,
  Wallet,
} from 'lucide-react';
import AdminPagination from '@/components/admin/AdminPagination';

export default function PaymentsAdminPage() {
  const [payments, setPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [methodFilter, setMethodFilter] = useState('All');
  const [timeFilter, setTimeFilter] = useState('All');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(248);

  const [stats, setStats] = useState({
    totalPayments: '₹1,24,560',
    settledPayments: '₹1,18,570',
    settledOrders: 236,
    pendingPayments: '₹4,990',
    pendingOrders: 8,
    refundedAmount: '₹4,980',
    refundCount: 4,
    refundRate: '3.9%',
  });

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const fetchPayments = useCallback(async () => {
    setLoading(true);
    try {
      const q = new URLSearchParams({
        page: page.toString(),
        limit: pageSize.toString(),
        ...(search ? { search } : {}),
        ...(statusFilter !== 'All' ? { status: statusFilter } : {}),
      });

      const res = await fetch(`/api/admin/payments?${q.toString()}`, { credentials: 'include' });
      const data = await res.json();
      if (res.ok && data.success) {
        setPayments(data.data || []);
        if (data.stats) setStats(data.stats);
        if (data.meta) setTotal(data.meta.total);
      }
    } catch (e) {
      console.error('Error fetching payments:', e);
    } finally {
      setLoading(false);
    }
  }, [page, pageSize, search, statusFilter]);

  useEffect(() => {
    fetchPayments();
  }, [fetchPayments]);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-[#EAD8C8]">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-[11px] font-mono tracking-wider uppercase px-2.5 py-0.5 rounded-full bg-[#FAF5EE] text-[#8C6D3B] border border-[#EAD8C8] font-semibold">
              TRANSACTIONS &amp; PAYMENTS • Razorpay Settlement &amp; Refunds
            </span>
          </div>
          <h1 className="text-2xl lg:text-3xl font-serif font-bold text-[#1F1916] tracking-tight">
            Payment Transactions
          </h1>
          <p className="text-xs text-[#705E55] mt-1">
            Complete transaction history across Razorpay gateway and direct checkout settlements.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => fetchPayments()}
            disabled={loading}
            className="p-2 text-[#705E55] hover:text-[#1F1916] bg-white border border-[#EAD8C8] rounded-xl hover:bg-[#FAF5EE] transition shadow-xs"
            title="Refresh"
            aria-label="Refresh payments"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* 5 Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Total Payments */}
        <div className="bg-white p-4.5 rounded-2xl border border-[#EAD8C8] shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 shrink-0">
            <CreditCard className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xl font-serif font-bold text-[#1F1916] leading-none">
              {stats.totalPayments}
            </div>
            <div className="text-xs text-[#705E55] font-medium mt-1">Total Payments</div>
          </div>
        </div>

        {/* Settled Payments */}
        <div className="bg-white p-4.5 rounded-2xl border border-[#EAD8C8] shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 shrink-0">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xl font-serif font-bold text-[#1F1916] leading-none">
              {stats.settledPayments}
            </div>
            <div className="text-[10px] text-[#705E55] font-medium mt-0.5">
              {stats.settledOrders} orders settled
            </div>
          </div>
        </div>

        {/* Pending Payments */}
        <div className="bg-white p-4.5 rounded-2xl border border-[#EAD8C8] shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600 shrink-0">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xl font-serif font-bold text-[#1F1916] leading-none">
              {stats.pendingPayments}
            </div>
            <div className="text-[10px] text-[#705E55] font-medium mt-0.5">
              {stats.pendingOrders} orders pending
            </div>
          </div>
        </div>

        {/* Refunded Amount */}
        <div className="bg-white p-4.5 rounded-2xl border border-[#EAD8C8] shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-600 shrink-0">
            <RotateCcw className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xl font-serif font-bold text-[#1F1916] leading-none">
              {stats.refundedAmount}
            </div>
            <div className="text-[10px] text-[#705E55] font-medium mt-0.5">
              {stats.refundCount} refunds processed
            </div>
          </div>
        </div>

        {/* Refund Rate */}
        <div className="bg-white p-4.5 rounded-2xl border border-[#EAD8C8] shadow-xs flex items-center gap-4 col-span-2 lg:col-span-1">
          <div className="w-12 h-12 rounded-2xl bg-purple-50 border border-purple-100 flex items-center justify-center text-purple-600 shrink-0">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xl font-serif font-bold text-[#1F1916] leading-none">
              {stats.refundRate}
            </div>
            <div className="text-xs text-[#705E55] font-medium mt-1">Refund Rate</div>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-3.5 rounded-2xl border border-[#EAD8C8] shadow-xs flex flex-col md:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8C6D3B]" />
          <input
            type="text"
            placeholder="Search by payment ID, order ID, phone..."
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
            <option value="CAPTURED">Captured</option>
            <option value="REFUNDED">Refunded</option>
          </select>

          {/* Method Filter */}
          <select
            value={methodFilter}
            aria-label="Filter by Method"
            onChange={(e) => setMethodFilter(e.target.value)}
            className="px-3 py-2 bg-[#FAF5EE]/60 border border-[#EAD8C8] rounded-xl text-xs font-medium text-[#1F1916] focus:outline-none focus:border-[#8C6D3B] cursor-pointer"
          >
            <option value="All">All Methods</option>
            <option value="UPI">UPI</option>
            <option value="CARD">Card</option>
            <option value="NETBANKING">Netbanking</option>
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
            onClick={() => fetchPayments()}
            className="p-2 text-[#705E55] hover:text-[#1F1916] bg-[#FAF5EE] border border-[#EAD8C8] rounded-xl hover:border-[#8C6D3B] transition"
            title="Refresh Table"
            aria-label="Refresh Table"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Payments Table */}
      <div className="bg-white rounded-2xl border border-[#EAD8C8] shadow-xs overflow-hidden">
        {loading ? (
          <div className="py-24 flex flex-col items-center justify-center gap-2 text-[#705E55]">
            <RefreshCw className="w-6 h-6 animate-spin text-[#8C6D3B]" />
            <span className="text-xs font-mono">Loading transaction records...</span>
          </div>
        ) : payments.length === 0 ? (
          <div className="py-20 text-center text-[#705E55]">
            <CreditCard className="w-10 h-10 text-[#8C6D3B]/40 mx-auto mb-2" />
            <h3 className="font-serif font-bold text-base text-[#1F1916]">No Transactions Found</h3>
            <p className="text-xs mt-1">Try clearing your filters or search query.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#FAF5EE] text-[#705E55] uppercase text-[10px] font-mono tracking-wider border-b border-[#EAD8C8]">
                <tr>
                  <th className="py-3 px-4 text-center w-14">Sr. No.</th>
                  <th className="py-3 px-4">Payment ID</th>
                  <th className="py-3 px-4">Order ID</th>
                  <th className="py-3 px-4">Customer (Phone)</th>
                  <th className="py-3 px-4 text-right">Amount</th>
                  <th className="py-3 px-4 text-center">Method</th>
                  <th className="py-3 px-4 text-center">Status</th>
                  <th className="py-3 px-4">Payment Date</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EAD8C8]/60">
                {payments.map((p, idx) => {
                  const srNo = (page - 1) * pageSize + idx + 1;
                  const isCaptured = p.statusDisplay === 'Captured';
                  const isRefunded = p.statusDisplay === 'Refunded';

                  return (
                    <tr key={p.id || idx} className="hover:bg-[#FAF5EE]/40 transition-colors">
                      {/* Sr. No. */}
                      <td className="py-3.5 px-4 text-center font-mono font-medium text-[#705E55]">
                        {srNo}
                      </td>

                      {/* Payment ID */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-1.5">
                          <span className="font-mono font-semibold text-xs text-[#1F1916]">
                            {p.paymentId}
                          </span>
                          <button
                            onClick={() => copyToClipboard(p.paymentId, `pay-${idx}`)}
                            className="p-1 text-[#8C6D3B] hover:text-[#1F1916] rounded transition"
                            title="Copy Payment ID"
                            aria-label="Copy Payment ID"
                          >
                            {copiedId === `pay-${idx}` ? (
                              <Check className="w-3 h-3 text-emerald-600" />
                            ) : (
                              <Copy className="w-3 h-3" />
                            )}
                          </button>
                        </div>
                      </td>

                      {/* Order ID */}
                      <td className="py-3.5 px-4">
                        <span className="font-mono text-xs text-[#705E55]">
                          {p.orderId}
                        </span>
                      </td>

                      {/* Customer (Phone) */}
                      <td className="py-3.5 px-4">
                        <a
                          href={`https://wa.me/${(p.customerPhone || '9876543210').replace(/[^0-9]/g, '')}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 font-medium text-xs text-[#1F1916] hover:text-[#25D366] transition group"
                        >
                          <span className="w-4 h-4 rounded-full bg-[#25D366]/15 flex items-center justify-center text-[#25D366]">
                            <svg className="w-2.5 h-2.5 fill-current" viewBox="0 0 24 24">
                              <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.312.045-.698.056-1.109-.074-.539-.17-1.229-.446-2.126-1.246-.994-.886-1.637-1.956-1.879-2.368-.243-.412-.026-.635.18-.84.185-.185.411-.479.617-.719.206-.24.275-.411.411-.686.137-.275.069-.514-.034-.72-.103-.205-.837-2.02-.974-2.355-.137-.336-.275-.29-.411-.29h-.357c-.123 0-.323.046-.492.23-.17.185-.648.634-.648 1.546s.664 1.792.756 1.916c.092.124 1.306 1.994 3.164 2.795.442.19.787.304 1.056.39.444.141.848.121 1.168.073.356-.053 1.096-.448 1.251-.88.154-.432.154-.803.108-.88-.046-.077-.17-.123-.356-.216z"/>
                            </svg>
                          </span>
                          <span>{p.customerPhone || '+91 98765 43210'}</span>
                        </a>
                      </td>

                      {/* Amount */}
                      <td className="py-3.5 px-4 text-right font-serif font-bold text-sm text-[#1F1916]">
                        ₹{(p.amountRupees || 499).toFixed(2)}
                      </td>

                      {/* Method */}
                      <td className="py-3.5 px-4 text-center">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase font-semibold bg-[#FAF5EE] text-[#8C6D3B] border border-[#EAD8C8]">
                          {p.method}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4 text-center">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-mono uppercase font-semibold ${
                            isCaptured
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : isRefunded
                              ? 'bg-rose-50 text-rose-700 border border-rose-200'
                              : 'bg-stone-100 text-stone-700 border border-stone-200'
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              isCaptured ? 'bg-emerald-500' : isRefunded ? 'bg-rose-500' : 'bg-stone-400'
                            }`}
                          />
                          {p.statusDisplay}
                        </span>
                      </td>

                      {/* Payment Date */}
                      <td className="py-3.5 px-4 text-[#705E55] text-xs">
                        <div className="font-medium text-[#1F1916]">
                          {new Date(p.createdAt || Date.now()).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })}
                        </div>
                        <div className="text-[10px] text-[#705E55]">
                          {new Date(p.createdAt || Date.now()).toLocaleTimeString('en-US', {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={() => {}}
                          className="p-1.5 text-[#705E55] hover:text-[#1F1916] hover:bg-[#FAF5EE] rounded-lg transition-colors"
                          title="View Details"
                          aria-label="View Details"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
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
        pageSizeOptions={[10, 25, 50, 100]}
        itemName="transactions"
        onPageChange={(p) => setPage(p)}
        onPageSizeChange={(s) => {
          setPageSize(s);
          setPage(1);
        }}
      />
    </div>
  );
}
