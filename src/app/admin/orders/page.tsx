'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import {
  ShoppingBag,
  Search,
  Filter,
  Eye,
  RefreshCw,
  Loader2,
  DollarSign,
  Calendar,
  Layers,
  ArrowRight,
  RotateCcw,
  AlertCircle,
  CheckCircle2,
  X,
  CreditCard,
  User,
  ShieldCheck,
  Phone,
} from 'lucide-react';
import { useAdmin } from '@/context/AdminContext';
import { apiRequest } from '@/lib/api/client';

interface OrderItem {
  id: string;
  orderId: string;
  draftId: string;
  amount: number;
  amountRupees: number;
  currency: string;
  status: 'CREATED' | 'ATTEMPTED' | 'PAID' | 'FAILED' | 'CANCELLED' | 'REFUNDED';
  customer: string;
  customerName?: string;
  customerPhone?: string;
  guestToken: string;
  userId?: string;
  templateId: string;
  templateTitle: string;
  templateSlug: string;
  paymentId: string | null;
  paymentStatus: string | null;
  paymentMethod: string;
  publicSlug: string | null;
  createdAt: string;
  updatedAt: string;
}

export default function AdminOrdersPage() {
  const { hasPermission } = useAdmin();
  const canRefund = hasPermission('REFUNDS_MANAGE');

  const [orders, setOrders] = useState<OrderItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [meta, setMeta] = useState({ page: 1, limit: 15, total: 0, totalPages: 1 });
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [refundModalOrder, setRefundModalOrder] = useState<OrderItem | null>(null);
  const [refundReason, setRefundReason] = useState('');
  const [refundSubmitting, setRefundSubmitting] = useState(false);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const showToast = (type: 'success' | 'error', message: string) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 4000);
  };

  const fetchOrders = useCallback(async (page = 1) => {
    setLoading(true);
    try {
      const q = new URLSearchParams({
        page: page.toString(),
        limit: '15',
        ...(search ? { search } : {}),
        ...(statusFilter !== 'All' ? { status: statusFilter } : {}),
      });

      const res = await apiRequest<OrderItem[]>(`/api/admin/orders?${q.toString()}`);
      if (res.success && res.data) {
        setOrders(res.data);
        if (res.meta) {
          setMeta({
            page: res.meta.page || 1,
            limit: res.meta.limit || 15,
            total: res.meta.total || 0,
            totalPages: res.meta.totalPages || 1,
          });
        }
      } else {
        showToast('error', res.error?.message || 'Failed to load orders.');
      }
    } catch {
      showToast('error', 'Network error fetching orders.');
    } finally {
      setLoading(false);
    }
  }, [search, statusFilter]);

  useEffect(() => {
    fetchOrders(1);
  }, [fetchOrders]);

  const openOrderDetails = async (orderId: string) => {
    setDetailLoading(true);
    setSelectedOrder(null);
    try {
      const res = await apiRequest<any>(`/api/admin/orders/${encodeURIComponent(orderId)}`);
      if (res.success && res.data) {
        setSelectedOrder(res.data);
      } else {
        showToast('error', res.error?.message || 'Could not load order details.');
      }
    } catch {
      showToast('error', 'Error fetching order details.');
    } finally {
      setDetailLoading(false);
    }
  };

  const handleProcessRefund = async () => {
    if (!refundModalOrder || !refundModalOrder.paymentId) return;
    if (!refundReason.trim() || refundReason.trim().length < 5) {
      showToast('error', 'Please provide a valid refund reason (minimum 5 characters).');
      return;
    }

    setRefundSubmitting(true);
    try {
      const res = await apiRequest<any>(
        `/api/admin/payments/${encodeURIComponent(refundModalOrder.paymentId)}/refund`,
        {
          method: 'POST',
          body: JSON.stringify({ reason: refundReason.trim() }),
        }
      );

      if (res.success) {
        showToast('success', res.message || 'Refund successfully processed.');
        setRefundModalOrder(null);
        setRefundReason('');
        fetchOrders(meta.page);
        if (selectedOrder?.order?.orderId === refundModalOrder.orderId) {
          openOrderDetails(refundModalOrder.orderId);
        }
      } else {
        showToast('error', res.error?.message || 'Failed to process refund.');
      }
    } catch {
      showToast('error', 'Network error initiating refund.');
    } finally {
      setRefundSubmitting(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PAID':
        return <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-950/60 text-emerald-300 border border-emerald-800/40">Paid</span>;
      case 'REFUNDED':
        return <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-rose-950/60 text-rose-300 border border-rose-800/40">Refunded</span>;
      case 'CREATED':
      case 'ATTEMPTED':
        return <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-amber-950/60 text-amber-300 border border-amber-800/40">Pending</span>;
      default:
        return <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-stone-800 text-stone-400 border border-stone-700">{status}</span>;
    }
  };

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
            <ShoppingBag className="w-6 h-6 text-amber-400" />
            Orders & Transactions
          </h1>
          <p className="text-sm text-stone-400 mt-1">
            Reconcile verified Razorpay checkout payments, order breakdowns, and authorize refunds.
          </p>
        </div>
        <button
          onClick={() => fetchOrders(meta.page)}
          className="flex items-center gap-2 px-3.5 py-2 text-xs font-medium text-stone-300 bg-stone-900 border border-stone-800 rounded-lg hover:border-amber-700/50 hover:text-amber-200 transition-all"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-stone-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by order ID, payment ID, customer token, or template..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-xs bg-stone-900/80 border border-stone-800 rounded-lg text-stone-200 placeholder:text-stone-500 focus:outline-none focus:border-amber-600 transition-colors"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-stone-500" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 text-xs bg-stone-900/80 border border-stone-800 rounded-lg text-stone-200 focus:outline-none focus:border-amber-600 transition-colors"
          >
            <option value="All">All Statuses</option>
            <option value="PAID">Paid</option>
            <option value="REFUNDED">Refunded</option>
            <option value="CREATED">Pending / Created</option>
          </select>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-stone-900/50 border border-stone-800/80 rounded-xl overflow-hidden backdrop-blur-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-950/70 border-b border-stone-800 text-stone-400 font-medium">
              <tr>
                <th className="py-3 px-4">Order ID</th>
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4">Template</th>
                <th className="py-3 px-4">Amount</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Payment Ref</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-800/50 text-stone-300">
              {loading ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-stone-500">
                    <Loader2 className="w-5 h-5 animate-spin mx-auto mb-2 text-amber-500" />
                    Loading orders...
                  </td>
                </tr>
              ) : orders.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-stone-500">
                    No orders found matching your search.
                  </td>
                </tr>
              ) : (
                orders.map((o) => (
                  <tr key={o.id} className="hover:bg-stone-800/30 transition-colors">
                    <td className="py-3 px-4 font-mono text-amber-300/90 font-medium">
                      {o.orderId}
                    </td>
                    <td className="py-3 px-4">
                      <div className="text-stone-100 font-medium truncate max-w-[170px]">
                        {o.customerName || o.customer}
                      </div>
                      {o.customerPhone && o.customerPhone !== '—' ? (
                        <div className="flex items-center gap-1.5 text-[11px] text-amber-300 font-mono mt-0.5">
                          <Phone className="w-2.5 h-2.5 shrink-0 opacity-80" />
                          <span>{o.customerPhone}</span>
                        </div>
                      ) : (
                        <div className="text-[10px] text-stone-500 font-mono truncate max-w-[140px]">
                          {o.customer}
                        </div>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <div className="text-stone-300 font-medium truncate max-w-[160px]">{o.templateTitle}</div>
                      {o.publicSlug && (
                        <Link href={`/invite/${o.publicSlug}`} target="_blank" className="text-[10px] text-amber-400/80 hover:underline flex items-center gap-1 mt-0.5">
                          /invite/{o.publicSlug}
                        </Link>
                      )}
                    </td>
                    <td className="py-3 px-4 font-semibold text-stone-100">
                      ₹{o.amountRupees}
                    </td>
                    <td className="py-3 px-4">
                      {getStatusBadge(o.status)}
                    </td>
                    <td className="py-3 px-4 font-mono text-[11px] text-stone-400">
                      {o.paymentId || '—'}
                    </td>
                    <td className="py-3 px-4 text-stone-400">
                      {new Date(o.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => openOrderDetails(o.orderId)}
                          className="p-1.5 rounded-md hover:bg-stone-800 text-stone-400 hover:text-amber-200 transition-colors"
                          title="View Order Details"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        {canRefund && o.status === 'PAID' && o.paymentId && (
                          <button
                            onClick={() => {
                              setRefundModalOrder(o);
                              setRefundReason('');
                            }}
                            className="p-1.5 rounded-md hover:bg-rose-950/60 text-stone-400 hover:text-rose-300 transition-colors"
                            title="Process Authorized Refund"
                          >
                            <RotateCcw className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        <div className="p-4 border-t border-stone-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-stone-400 bg-stone-950/40">
          <span>
            Showing {orders.length > 0 ? (meta.page - 1) * meta.limit + 1 : 0} to{' '}
            {Math.min(meta.page * meta.limit, meta.total)} of {meta.total} orders
          </span>
          <div className="flex items-center gap-2">
            <button
              disabled={meta.page <= 1}
              onClick={() => fetchOrders(meta.page - 1)}
              className="px-3 py-1.5 bg-stone-900 border border-stone-800 rounded-lg disabled:opacity-40 hover:border-amber-700/50 hover:text-amber-200 transition-colors cursor-pointer disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <span className="font-mono text-stone-200 px-2">
              Page {meta.page} of {Math.max(1, meta.totalPages)}
            </span>
            <button
              disabled={meta.page >= meta.totalPages}
              onClick={() => fetchOrders(meta.page + 1)}
              className="px-3 py-1.5 bg-stone-900 border border-stone-800 rounded-lg disabled:opacity-40 hover:border-amber-700/50 hover:text-amber-200 transition-colors cursor-pointer disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Slide-over Drawer for Order Details */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-stone-900 border-l border-stone-800 h-full p-6 overflow-y-auto space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-stone-800">
              <div>
                <h3 className="text-lg font-serif text-amber-100 flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-amber-400" />
                  Order Breakdown
                </h3>
                <p className="font-mono text-xs text-stone-400 mt-1">{selectedOrder.order?.orderId}</p>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="p-1.5 rounded-lg text-stone-400 hover:text-stone-100 hover:bg-stone-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="bg-stone-950/60 p-4 rounded-lg border border-stone-800/80 space-y-2.5">
                <div className="flex justify-between">
                  <span className="text-stone-400">Status:</span>
                  <span>{getStatusBadge(selectedOrder.order?.status)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-400">Total Charged:</span>
                  <span className="font-semibold text-amber-300">₹{Math.round(selectedOrder.order?.amount / 100)} {selectedOrder.order?.currency}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-400">Created:</span>
                  <span className="text-stone-300">{new Date(selectedOrder.order?.createdAt).toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-400">Customer Identity:</span>
                  <span className="font-mono text-stone-300">{selectedOrder.order?.userId || selectedOrder.order?.guestToken}</span>
                </div>
              </div>

              {selectedOrder.payment && (
                <div className="bg-stone-950/60 p-4 rounded-lg border border-stone-800/80 space-y-2">
                  <div className="text-xs font-semibold text-amber-200">Payment Gateway Reconciliation</div>
                  <div className="flex justify-between"><span className="text-stone-400">Payment ID:</span><span className="font-mono text-stone-300">{selectedOrder.payment.paymentId}</span></div>
                  <div className="flex justify-between"><span className="text-stone-400">Status:</span><span className="text-emerald-400 font-medium">{selectedOrder.payment.status}</span></div>
                  <div className="flex justify-between"><span className="text-stone-400">Verified Signature:</span><span className="text-stone-400">Verified HMAC SHA-256</span></div>
                  {selectedOrder.payment.refundReason && (
                    <div className="pt-2 border-t border-stone-800 text-rose-300">
                      Refund Reason: {selectedOrder.payment.refundReason}
                    </div>
                  )}
                </div>
              )}

              {selectedOrder.template && (
                <div className="bg-stone-950/60 p-4 rounded-lg border border-stone-800/80 space-y-2">
                  <div className="text-xs font-semibold text-amber-200">Purchased Invitation Template</div>
                  <div className="flex justify-between"><span className="text-stone-400">Template:</span><span className="text-stone-200">{selectedOrder.template.title}</span></div>
                  <div className="flex justify-between"><span className="text-stone-400">Tier:</span><span className="text-stone-300">{selectedOrder.template.tier}</span></div>
                  {selectedOrder.invitation && (
                    <div className="flex justify-between pt-1"><span className="text-stone-400">Public Invitation:</span><Link href={`/invite/${selectedOrder.invitation.slug}`} target="_blank" className="text-amber-400 hover:underline">/invite/{selectedOrder.invitation.slug}</Link></div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Refund Confirmation Modal */}
      {refundModalOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="w-full max-w-md bg-stone-900 border border-stone-800 rounded-xl p-6 space-y-4">
            <h3 className="text-base font-serif text-amber-100 flex items-center gap-2">
              <RotateCcw className="w-4 h-4 text-rose-400" />
              Authorize Customer Refund
            </h3>
            <p className="text-xs text-stone-400">
              You are refunding order <span className="font-mono text-amber-300">{refundModalOrder.orderId}</span> for amount <span className="font-semibold text-stone-200">₹{refundModalOrder.amountRupees}</span>. This records an immutable audit log.
            </p>
            <div>
              <label className="block text-xs font-medium text-stone-300 mb-1">
                Mandatory Reason for Cancellation / Refund:
              </label>
              <textarea
                rows={3}
                value={refundReason}
                onChange={(e) => setRefundReason(e.target.value)}
                placeholder="Explain reason for administrative refund (e.g., date cancelled by customer)..."
                className="w-full p-2.5 text-xs bg-stone-950 border border-stone-800 rounded-lg text-stone-200 focus:outline-none focus:border-amber-600"
              />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setRefundModalOrder(null)}
                className="px-3.5 py-1.5 text-xs font-medium text-stone-400 hover:text-stone-200 bg-stone-800/60 rounded-lg"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={refundSubmitting}
                onClick={handleProcessRefund}
                className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-medium bg-rose-900/80 hover:bg-rose-800 text-rose-100 border border-rose-700/60 rounded-lg disabled:opacity-50"
              >
                {refundSubmitting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <RotateCcw className="w-3.5 h-3.5" />}
                Confirm Refund
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
