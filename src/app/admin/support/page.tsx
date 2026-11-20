'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  LifeBuoy,
  Search,
  Filter,
  Eye,
  RefreshCw,
  Loader2,
  CheckCircle2,
  AlertCircle,
  X,
  Send,
  MessageSquare,
  User,
  ShieldCheck,
  Clock,
} from 'lucide-react';
import { useAdmin } from '@/context/AdminContext';
import { apiRequest } from '@/lib/api/client';

interface SupportMessage {
  id: string;
  ticketId: string;
  sender: 'CUSTOMER' | 'STAFF';
  senderName: string;
  message: string;
  createdAt: string;
}

interface SupportTicket {
  id: string;
  ticketNumber: string;
  customerEmail: string;
  subject: string;
  status: 'OPEN' | 'IN_PROGRESS' | 'WAITING_FOR_CUSTOMER' | 'RESOLVED' | 'CLOSED';
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  internalNotes?: string;
  messages: SupportMessage[];
  createdAt: string;
  updatedAt: string;
}

export default function AdminSupportPage() {
  const { hasPermission } = useAdmin();
  const canManage = hasPermission('SUPPORT_MANAGE');

  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);
  const [replyMessage, setReplyMessage] = useState('');
  const [sendingReply, setSendingReply] = useState(false);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const showToast = (type: 'success' | 'error', message: string) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 4000);
  };

  const fetchTickets = useCallback(async () => {
    setLoading(true);
    try {
      const q = new URLSearchParams({
        page: '1',
        limit: '30',
        ...(search ? { search } : {}),
        ...(statusFilter !== 'All' ? { status: statusFilter } : {}),
      });

      const res = await apiRequest<SupportTicket[]>(`/api/admin/support?${q.toString()}`);
      if (res.success && res.data) {
        setTickets(res.data);
      } else {
        showToast('error', res.error?.message || 'Failed to load support tickets.');
      }
    } catch {
      showToast('error', 'Network error fetching support tickets.');
    } finally {
      setLoading(false);
    }
  }, [search, statusFilter]);

  useEffect(() => {
    fetchTickets();
  }, [fetchTickets]);

  const handleSendReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTicket || !replyMessage.trim()) return;

    setSendingReply(true);
    try {
      const res = await apiRequest<SupportTicket>(
        `/api/admin/support/${encodeURIComponent(selectedTicket.id)}/reply`,
        {
          method: 'POST',
          body: JSON.stringify({ message: replyMessage.trim() }),
        }
      );

      if (res.success && res.data) {
        showToast('success', 'Reply dispatched to customer.');
        setSelectedTicket(res.data);
        setReplyMessage('');
        fetchTickets();
      } else {
        showToast('error', res.error?.message || 'Failed to dispatch reply.');
      }
    } catch {
      showToast('error', 'Network error sending response.');
    } finally {
      setSendingReply(false);
    }
  };

  const handleUpdateStatus = async (ticketId: string, status: string) => {
    try {
      const res = await apiRequest<SupportTicket>(`/api/admin/support/${encodeURIComponent(ticketId)}`, {
        method: 'PATCH',
        body: JSON.stringify({ status }),
      });

      if (res.success && res.data) {
        showToast('success', `Ticket status updated to ${status}.`);
        if (selectedTicket?.id === ticketId) {
          setSelectedTicket(res.data);
        }
        fetchTickets();
      } else {
        showToast('error', res.error?.message || 'Failed to update ticket status.');
      }
    } catch {
      showToast('error', 'Network error updating ticket status.');
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'OPEN':
        return <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-amber-950/60 text-amber-300 border border-amber-800/40">Open</span>;
      case 'WAITING_FOR_CUSTOMER':
        return <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-blue-950/60 text-blue-300 border border-blue-800/40">Waiting</span>;
      case 'RESOLVED':
        return <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-950/60 text-emerald-300 border border-emerald-800/40">Resolved</span>;
      default:
        return <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-stone-800 text-stone-400 border border-stone-700">{status}</span>;
    }
  };

  const getPriorityBadge = (p: string) => {
    switch (p) {
      case 'URGENT':
      case 'HIGH':
        return <span className="text-[11px] font-semibold text-rose-400">● High Priority</span>;
      default:
        return <span className="text-[11px] text-stone-400">Normal</span>;
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
            <LifeBuoy className="w-6 h-6 text-amber-400" />
            Concierge Support Inquiries
          </h1>
          <p className="text-sm text-stone-400 mt-1">
            Resolve guest questions, RSVP support inquiries, and send threaded concierge messages.
          </p>
        </div>
        <button
          onClick={fetchTickets}
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
            placeholder="Search tickets by ticket #, customer email, or subject..."
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
            <option value="All">All Inquiries</option>
            <option value="OPEN">Open</option>
            <option value="WAITING_FOR_CUSTOMER">Waiting on Customer</option>
            <option value="RESOLVED">Resolved</option>
          </select>
        </div>
      </div>

      {/* Tickets List */}
      <div className="bg-stone-900/50 border border-stone-800/80 rounded-xl overflow-hidden backdrop-blur-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-950/70 border-b border-stone-800 text-stone-400 font-medium">
              <tr>
                <th className="py-3 px-4">Ticket</th>
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4">Subject</th>
                <th className="py-3 px-4">Priority</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Last Activity</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-800/50 text-stone-300">
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-stone-500">
                    <Loader2 className="w-5 h-5 animate-spin mx-auto mb-2 text-amber-500" />
                    Loading support tickets...
                  </td>
                </tr>
              ) : tickets.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-stone-500">
                    No support tickets found matching query.
                  </td>
                </tr>
              ) : (
                tickets.map((t) => (
                  <tr key={t.id} className="hover:bg-stone-800/30 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-semibold text-amber-300">
                      {t.ticketNumber}
                    </td>
                    <td className="py-3.5 px-4 text-stone-200">
                      {t.customerEmail}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="text-stone-300 font-medium truncate max-w-[220px]">{t.subject}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      {getPriorityBadge(t.priority)}
                    </td>
                    <td className="py-3.5 px-4">
                      {getStatusBadge(t.status)}
                    </td>
                    <td className="py-3.5 px-4 text-stone-400">
                      {new Date(t.updatedAt).toLocaleDateString()}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => setSelectedTicket(t)}
                        className="px-2.5 py-1 text-xs font-medium text-amber-200 bg-stone-800/80 hover:bg-stone-800 border border-stone-700/80 rounded transition-colors"
                      >
                        Inspect Thread
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Ticket Slide-over Conversation Drawer */}
      {selectedTicket && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-xl bg-stone-900 border-l border-stone-800 h-full p-6 flex flex-col justify-between">
            {/* Top Bar */}
            <div className="pb-4 border-b border-stone-800 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-amber-300">{selectedTicket.ticketNumber}</span>
                  {getStatusBadge(selectedTicket.status)}
                </div>
                <h3 className="text-base font-serif text-amber-100 mt-1">{selectedTicket.subject}</h3>
                <p className="text-xs text-stone-400">{selectedTicket.customerEmail}</p>
              </div>
              <button onClick={() => setSelectedTicket(null)} className="p-1.5 rounded text-stone-400 hover:text-stone-100">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Conversation Messages */}
            <div className="flex-1 overflow-y-auto py-4 space-y-3">
              {selectedTicket.messages.map((m) => (
                <div
                  key={m.id}
                  className={`p-3.5 rounded-xl text-xs space-y-1 ${
                    m.sender === 'STAFF'
                      ? 'bg-amber-950/30 border border-amber-900/40 ml-6 text-amber-100'
                      : 'bg-stone-950/60 border border-stone-800 mr-6 text-stone-200'
                  }`}
                >
                  <div className="flex justify-between text-[11px] font-medium text-stone-400">
                    <span className={m.sender === 'STAFF' ? 'text-amber-400' : 'text-stone-300'}>
                      {m.senderName} ({m.sender})
                    </span>
                    <span>{new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                  <p className="whitespace-pre-wrap leading-relaxed">{m.message}</p>
                </div>
              ))}
            </div>

            {/* Reply & Action Bar */}
            <div className="pt-4 border-t border-stone-800 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {selectedTicket.status !== 'RESOLVED' && (
                    <button
                      onClick={() => handleUpdateStatus(selectedTicket.id, 'RESOLVED')}
                      className="px-2.5 py-1 text-xs font-medium bg-emerald-950/60 border border-emerald-800/40 text-emerald-300 rounded hover:bg-emerald-900/40"
                    >
                      Mark Resolved
                    </button>
                  )}
                  {selectedTicket.status === 'RESOLVED' && (
                    <button
                      onClick={() => handleUpdateStatus(selectedTicket.id, 'OPEN')}
                      className="px-2.5 py-1 text-xs font-medium bg-stone-800 text-stone-300 rounded hover:bg-stone-700"
                    >
                      Reopen Inquiry
                    </button>
                  )}
                </div>
              </div>

              {canManage && (
                <form onSubmit={handleSendReply} className="space-y-2">
                  <textarea
                    rows={3}
                    required
                    placeholder="Type official You Are Mine Concierge response..."
                    value={replyMessage}
                    onChange={(e) => setReplyMessage(e.target.value)}
                    className="w-full p-2.5 text-xs bg-stone-950 border border-stone-800 rounded-lg text-stone-200 focus:outline-none focus:border-amber-600"
                  />
                  <div className="flex justify-end">
                    <button
                      type="submit"
                      disabled={sendingReply}
                      className="flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold bg-amber-500 hover:bg-amber-400 text-stone-950 rounded-lg disabled:opacity-50"
                    >
                      {sendingReply ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
                      Send Concierge Reply
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
