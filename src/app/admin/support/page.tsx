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
  AlertTriangle,
  Clock,
  X,
  Send,
  MessageSquare,
  User,
  ShieldCheck,
  Copy,
  Check,
  Headphones,
  Plus,
  Mail,
  Phone,
  Sparkles,
} from 'lucide-react';
import { useAdmin } from '@/context/AdminContext';
import { apiRequest } from '@/lib/api/client';
import AdminPagination from '@/components/admin/AdminPagination';

interface SupportMessage {
  id: string;
  sender: 'CUSTOMER' | 'STAFF';
  senderName: string;
  message: string;
  createdAt: string;
}

interface SupportTicket {
  id: string;
  ticketNumber: string;
  customerEmail: string;
  customerPhone?: string;
  subject: string;
  status: string;
  priority: string;
  assignedTo?: { name: string; initials: string };
  messages?: SupportMessage[];
  updatedAt: string;
  createdAt: string;
}

export default function AdminSupportPage() {
  const { hasPermission } = useAdmin();
  const canManage = hasPermission('SUPPORT_MANAGE');

  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [priorityFilter, setPriorityFilter] = useState('All');
  const [timeFilter, setTimeFilter] = useState('All');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);

  const [stats, setStats] = useState({
    totalInquiries: 0,
    resolved: 0,
    inProgress: 0,
    pending: 0,
    escalated: 0,
  });

  // Modal States
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);
  const [detailedTicket, setDetailedTicket] = useState<SupportTicket | null>(null);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [replyMessage, setReplyMessage] = useState('');
  const [sendingReply, setSendingReply] = useState(false);
  const [resolveOnReply, setResolveOnReply] = useState(false);

  // New Inquiry Modal State
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [creatingTicket, setCreatingTicket] = useState(false);
  const [newEmail, setNewEmail] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newSubject, setNewSubject] = useState('');
  const [newPriority, setNewPriority] = useState<'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'>('MEDIUM');
  const [newMessage, setNewMessage] = useState('');

  // Toast State
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 3500);
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const fetchTickets = useCallback(async () => {
    setLoading(true);
    try {
      const q = new URLSearchParams({
        page: page.toString(),
        limit: pageSize.toString(),
        ...(search ? { search } : {}),
        ...(statusFilter !== 'All' ? { status: statusFilter } : {}),
        ...(priorityFilter !== 'All' ? { priority: priorityFilter } : {}),
      });

      const res = await apiRequest<SupportTicket[]>(
        `/api/admin/support?${q.toString()}`
      );
      if (res && res.data) {
        setTickets(res.data);
        if (res.stats) setStats(res.stats);
        if (res.meta) setTotal(res.meta.total);
      }
    } catch (err: any) {
      console.error('Failed to load tickets:', err);
    } finally {
      setLoading(false);
    }
  }, [page, pageSize, search, statusFilter, priorityFilter]);

  useEffect(() => {
    fetchTickets();
  }, [fetchTickets]);

  // Load ticket details when selected
  useEffect(() => {
    if (!selectedTicket) {
      setDetailedTicket(null);
      return;
    }

    setLoadingDetails(true);
    // Initialize detailedTicket with selectedTicket data
    setDetailedTicket({
      ...selectedTicket,
      messages: selectedTicket.messages || [
        {
          id: 'msg_init',
          sender: 'CUSTOMER',
          senderName: selectedTicket.customerEmail.split('@')[0],
          message: selectedTicket.subject,
          createdAt: selectedTicket.createdAt,
        },
      ],
    });

    // Attempt to fetch full ticket record with complete thread
    apiRequest<SupportTicket>(`/api/admin/support/${selectedTicket.id}`)
      .then((res) => {
        if (res && res.data) {
          setDetailedTicket(res.data);
        }
      })
      .catch(() => {
        // Keep fallback data
      })
      .finally(() => {
        setLoadingDetails(false);
      });
  }, [selectedTicket]);

  // Send Reply Handler
  const handleSendReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!detailedTicket || !replyMessage.trim()) return;

    setSendingReply(true);
    try {
      const res = await apiRequest<SupportTicket>(
        `/api/admin/support/${detailedTicket.id}/reply`,
        {
          method: 'POST',
          body: JSON.stringify({ message: replyMessage }),
        }
      );

      if (res && res.data) {
        setDetailedTicket(res.data);
        setReplyMessage('');
        showToast('Reply delivered to customer successfully!');
        fetchTickets();

        // Optionally resolve
        if (resolveOnReply) {
          await handleStatusChange('RESOLVED');
        }
      } else {
        // Fallback optimistic update
        const newMsg: SupportMessage = {
          id: `msg_${Date.now()}`,
          sender: 'STAFF',
          senderName: 'Srajan Shukla',
          message: replyMessage,
          createdAt: new Date().toISOString(),
        };
        setDetailedTicket((prev) =>
          prev ? { ...prev, messages: [...(prev.messages || []), newMsg] } : null
        );
        setReplyMessage('');
        showToast('Reply dispatched to customer!');
      }
    } catch (err: any) {
      console.error('Failed to send reply:', err);
      showToast(err.message || 'Failed to dispatch reply.', 'error');
    } finally {
      setSendingReply(false);
    }
  };

  // Status Change Handler
  const handleStatusChange = async (newStatus: string) => {
    if (!detailedTicket) return;

    try {
      await apiRequest(`/api/admin/support/${detailedTicket.id}`, {
        method: 'PATCH',
        body: JSON.stringify({ status: newStatus }),
      });
      setDetailedTicket((prev) => (prev ? { ...prev, status: newStatus } : null));
      setTickets((prev) =>
        prev.map((t) => (t.id === detailedTicket.id ? { ...t, status: newStatus } : t))
      );
      showToast(`Ticket status updated to ${newStatus}.`);
    } catch (err: any) {
      console.error('Failed to update status:', err);
      showToast(err.message || 'Status update failed.', 'error');
    }
  };

  // Priority Change Handler
  const handlePriorityChange = async (newPriority: string) => {
    if (!detailedTicket) return;

    try {
      await apiRequest(`/api/admin/support/${detailedTicket.id}`, {
        method: 'PATCH',
        body: JSON.stringify({ priority: newPriority }),
      });
      setDetailedTicket((prev) => (prev ? { ...prev, priority: newPriority } : null));
      setTickets((prev) =>
        prev.map((t) => (t.id === detailedTicket.id ? { ...t, priority: newPriority } : t))
      );
      showToast(`Priority set to ${newPriority}.`);
    } catch (err: any) {
      console.error('Failed to update priority:', err);
      showToast(err.message || 'Priority update failed.', 'error');
    }
  };

  // Create New Ticket Handler
  const handleCreateTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmail.trim() || !newSubject.trim() || !newMessage.trim()) {
      showToast('Please fill in all required fields.', 'error');
      return;
    }

    setCreatingTicket(true);
    try {
      const res = await apiRequest<SupportTicket>('/api/admin/support', {
        method: 'POST',
        body: JSON.stringify({
          customerEmail: newEmail.trim(),
          customerPhone: newPhone.trim() || undefined,
          subject: newSubject.trim(),
          priority: newPriority,
          message: newMessage.trim(),
        }),
      });

      if (res && res.data) {
        showToast(`Inquiry ${res.data.ticketNumber || 'ticket'} registered successfully!`);
        setShowCreateModal(false);
        setNewEmail('');
        setNewPhone('');
        setNewSubject('');
        setNewMessage('');
        fetchTickets();
      }
    } catch (err: any) {
      console.error('Failed to create ticket:', err);
      showToast(err.message || 'Failed to create inquiry.', 'error');
    } finally {
      setCreatingTicket(false);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Toast Feedback */}
      {toast && (
        <div
          className={`fixed top-4 right-4 z-50 flex items-center gap-2 px-4 py-3 rounded-xl border shadow-lg text-xs font-semibold animate-fade-in ${
            toast.type === 'success'
              ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
              : 'bg-rose-50 border-rose-200 text-rose-800'
          }`}
        >
          {toast.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          )}
          <span>{toast.message}</span>
        </div>
      )}

      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-[#EAD8C8]">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-[11px] font-mono tracking-wider uppercase px-2.5 py-0.5 rounded-full bg-[#FAF5EE] text-[#8C6D3B] border border-[#EAD8C8] font-semibold">
              CONCIERGE SUPPORT • Guest RSVP &amp; Customer Inquiries
            </span>
          </div>
          <h1 className="text-2xl lg:text-3xl font-serif font-bold text-[#1F1916] tracking-tight">
            Concierge Support Inquiries
          </h1>
          <p className="text-xs text-[#705E55] mt-1">
            Resolve guest questions, RSVP inquiries, and threaded messages.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          {/* Create Inquiry Button */}
          <button
            type="button"
            onClick={() => setShowCreateModal(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-[#641A2A] hover:bg-[#4E1421] rounded-xl transition shadow-xs cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>+ Create Inquiry</span>
          </button>

          <button
            onClick={() => fetchTickets()}
            disabled={loading}
            className="p-2 text-[#705E55] hover:text-[#1F1916] bg-white border border-[#EAD8C8] rounded-xl hover:bg-[#FAF5EE] transition shadow-xs cursor-pointer"
            title="Refresh"
            aria-label="Refresh support inquiries"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* 5 Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Total Inquiries */}
        <div className="bg-white p-4.5 rounded-2xl border border-[#EAD8C8] shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 shrink-0">
            <Headphones className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-serif font-bold text-[#1F1916] leading-none">
              {stats.totalInquiries}
            </div>
            <div className="text-xs text-[#705E55] font-medium mt-1">Total Inquiries</div>
          </div>
        </div>

        {/* Resolved */}
        <div className="bg-white p-4.5 rounded-2xl border border-[#EAD8C8] shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 shrink-0">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-serif font-bold text-[#1F1916] leading-none">
              {stats.resolved}
            </div>
            <div className="text-xs text-[#705E55] font-medium mt-1">Resolved</div>
          </div>
        </div>

        {/* In Progress */}
        <div className="bg-white p-4.5 rounded-2xl border border-[#EAD8C8] shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 shrink-0">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-serif font-bold text-[#1F1916] leading-none">
              {stats.inProgress}
            </div>
            <div className="text-xs text-[#705E55] font-medium mt-1">In Progress</div>
          </div>
        </div>

        {/* Pending */}
        <div className="bg-white p-4.5 rounded-2xl border border-[#EAD8C8] shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600 shrink-0">
            <AlertCircle className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-serif font-bold text-[#1F1916] leading-none">
              {stats.pending}
            </div>
            <div className="text-xs text-[#705E55] font-medium mt-1">Pending</div>
          </div>
        </div>

        {/* Escalated */}
        <div className="bg-white p-4.5 rounded-2xl border border-[#EAD8C8] shadow-xs flex items-center gap-4 col-span-2 lg:col-span-1">
          <div className="w-12 h-12 rounded-2xl bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-600 shrink-0">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-serif font-bold text-[#1F1916] leading-none">
              {stats.escalated}
            </div>
            <div className="text-xs text-[#705E55] font-medium mt-1">Escalated</div>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-3.5 rounded-2xl border border-[#EAD8C8] shadow-xs flex flex-col md:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8C6D3B]" />
          <input
            type="text"
            placeholder="Search by ticket ID, customer, phone or subject..."
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
            <option value="OPEN">Open</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="RESOLVED">Resolved</option>
          </select>

          {/* Priority Filter */}
          <select
            value={priorityFilter}
            aria-label="Filter by Priority"
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="px-3 py-2 bg-[#FAF5EE]/60 border border-[#EAD8C8] rounded-xl text-xs font-medium text-[#1F1916] focus:outline-none focus:border-[#8C6D3B] cursor-pointer"
          >
            <option value="All">All Priorities</option>
            <option value="HIGH">High</option>
            <option value="MEDIUM">Medium</option>
            <option value="LOW">Low</option>
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
            onClick={() => fetchTickets()}
            className="p-2 text-[#705E55] hover:text-[#1F1916] bg-[#FAF5EE] border border-[#EAD8C8] rounded-xl hover:border-[#8C6D3B] transition"
            title="Refresh Table"
            aria-label="Refresh Table"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Tickets Table */}
      <div className="bg-white rounded-2xl border border-[#EAD8C8] shadow-xs overflow-hidden">
        {loading ? (
          <div className="py-24 flex flex-col items-center justify-center gap-2 text-[#705E55]">
            <Loader2 className="w-6 h-6 animate-spin text-[#8C6D3B]" />
            <span className="text-xs font-mono">Loading concierge inquiries...</span>
          </div>
        ) : tickets.length === 0 ? (
          <div className="py-20 text-center text-[#705E55]">
            <Headphones className="w-10 h-10 text-[#8C6D3B]/40 mx-auto mb-2" />
            <h3 className="font-serif font-bold text-base text-[#1F1916]">No Support Inquiries</h3>
            <p className="text-xs mt-1">Try clearing your filters or check back later.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#FAF5EE] text-[#705E55] uppercase text-[10px] font-mono tracking-wider border-b border-[#EAD8C8]">
                <tr>
                  <th className="py-3 px-4 text-center w-14">Sr. No.</th>
                  <th className="py-3 px-4">Ticket ID</th>
                  <th className="py-3 px-4">Customer</th>
                  <th className="py-3 px-4">Subject</th>
                  <th className="py-3 px-4 text-center">Priority</th>
                  <th className="py-3 px-4 text-center">Status</th>
                  <th className="py-3 px-4">Last Activity</th>
                  <th className="py-3 px-4">Assigned To</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EAD8C8]/60">
                {tickets.map((t, idx) => {
                  const srNo = (page - 1) * pageSize + idx + 1;
                  const isResolved = t.status === 'RESOLVED';
                  const isInProgress = t.status === 'IN_PROGRESS';
                  const isHigh = t.priority === 'HIGH' || t.priority === 'URGENT';
                  const isMedium = t.priority === 'MEDIUM';

                  return (
                    <tr
                      key={t.id || idx}
                      onClick={() => setSelectedTicket(t)}
                      className="hover:bg-[#FAF5EE]/60 transition-colors cursor-pointer"
                    >
                      {/* Sr. No. */}
                      <td className="py-3.5 px-4 text-center font-mono font-medium text-[#705E55]">
                        {srNo}
                      </td>

                      {/* Ticket ID */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                          <span className="font-mono font-bold text-xs text-[#1F1916]">
                            {t.ticketNumber}
                          </span>
                          <button
                            onClick={() => copyToClipboard(t.ticketNumber, `tck-${idx}`)}
                            className="p-1 text-[#8C6D3B] hover:text-[#1F1916] rounded transition cursor-pointer"
                            title="Copy Ticket ID"
                            aria-label="Copy Ticket ID"
                          >
                            {copiedId === `tck-${idx}` ? (
                              <Check className="w-3 h-3 text-emerald-600" />
                            ) : (
                              <Copy className="w-3 h-3" />
                            )}
                          </button>
                        </div>
                      </td>

                      {/* Customer */}
                      <td className="py-3.5 px-4 font-medium text-xs text-[#1F1916]">
                        {t.customerEmail}
                      </td>

                      {/* Subject */}
                      <td className="py-3.5 px-4">
                        <span className="font-medium text-xs text-[#1F1916] line-clamp-1" title={t.subject}>
                          {t.subject}
                        </span>
                      </td>

                      {/* Priority */}
                      <td className="py-3.5 px-4 text-center">
                        <span
                          className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase font-semibold ${
                            isHigh
                              ? 'bg-rose-50 text-rose-700 border border-rose-200'
                              : isMedium
                              ? 'bg-amber-50 text-amber-700 border border-amber-200'
                              : 'bg-stone-100 text-stone-700 border border-stone-200'
                          }`}
                        >
                          {t.priority}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4 text-center">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-mono uppercase font-semibold ${
                            isResolved
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : isInProgress
                              ? 'bg-blue-50 text-blue-700 border border-blue-200'
                              : 'bg-amber-50 text-amber-700 border border-amber-200'
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              isResolved ? 'bg-emerald-500' : isInProgress ? 'bg-blue-500' : 'bg-amber-500'
                            }`}
                          />
                          {t.status}
                        </span>
                      </td>

                      {/* Last Activity */}
                      <td className="py-3.5 px-4 text-[#705E55] text-xs">
                        <div className="font-medium text-[#1F1916]">
                          {new Date(t.updatedAt || Date.now()).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })}
                        </div>
                        <div className="text-[10px] text-[#705E55]">
                          {new Date(t.updatedAt || Date.now()).toLocaleTimeString('en-US', {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </div>
                      </td>

                      {/* Assigned To */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-[#FAF5EE] border border-[#EAD8C8] flex items-center justify-center font-bold text-[10px] text-[#8C6D3B] shrink-0">
                            {t.assignedTo?.initials || 'SS'}
                          </div>
                          <span className="font-medium text-xs text-[#1F1916]">
                            {t.assignedTo?.name || 'Srajan Shukla'}
                          </span>
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedTicket(t);
                          }}
                          className="p-1.5 text-[#705E55] hover:text-[#1F1916] hover:bg-[#FAF5EE] rounded-lg transition-colors cursor-pointer"
                          title="Open Inquiry Details"
                          aria-label="Open Inquiry Details"
                        >
                          <Eye className="w-4 h-4 text-[#8C6D3B]" />
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
        pageSizeOptions={[10, 25, 50]}
        itemName="tickets"
        onPageChange={(p) => setPage(p)}
        onPageSizeChange={(s) => {
          setPageSize(s);
          setPage(1);
        }}
      />

      {/* ============================================================== */}
      {/* SUPPORT INQUIRY CONVERSATION / DETAILS MODAL                    */}
      {/* ============================================================== */}
      {selectedTicket && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
          <div className="relative w-full max-w-2xl bg-white rounded-2xl border border-[#EAD8C8] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            {/* Header */}
            <div className="p-5 border-b border-[#EAD8C8] bg-[#FAF5EE] flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-mono text-xs font-bold px-2 py-0.5 rounded-md bg-[#641A2A] text-white">
                    {detailedTicket?.ticketNumber || selectedTicket.ticketNumber}
                  </span>
                  <span
                    className={`text-[10px] font-mono uppercase font-bold px-2 py-0.5 rounded-full border ${
                      detailedTicket?.status === 'RESOLVED'
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        : detailedTicket?.status === 'IN_PROGRESS'
                        ? 'bg-blue-50 text-blue-700 border-blue-200'
                        : 'bg-amber-50 text-amber-700 border-amber-200'
                    }`}
                  >
                    {detailedTicket?.status || selectedTicket.status}
                  </span>
                </div>
                <h3 className="font-serif font-bold text-lg text-[#1F1916]">
                  {detailedTicket?.subject || selectedTicket.subject}
                </h3>
                <div className="flex items-center gap-3 text-xs text-[#705E55] mt-1">
                  <span className="flex items-center gap-1">
                    <Mail className="w-3 h-3 text-[#8C6D3B]" />
                    {detailedTicket?.customerEmail || selectedTicket.customerEmail}
                  </span>
                  {(detailedTicket?.customerPhone || selectedTicket.customerPhone) && (
                    <span className="flex items-center gap-1">
                      <Phone className="w-3 h-3 text-[#8C6D3B]" />
                      {detailedTicket?.customerPhone || selectedTicket.customerPhone}
                    </span>
                  )}
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSelectedTicket(null)}
                className="p-1.5 rounded-lg text-[#705E55] hover:text-[#1F1916] hover:bg-[#FAF5EE] transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Status & Priority Control Strip */}
            <div className="px-5 py-2.5 bg-white border-b border-[#EAD8C8]/60 flex items-center justify-between text-xs flex-wrap gap-3">
              <div className="flex items-center gap-4">
                {/* Status Switcher */}
                <div className="flex items-center gap-1.5">
                  <span className="text-[11px] font-semibold text-[#705E55]">Status:</span>
                  <select
                    value={detailedTicket?.status || selectedTicket.status}
                    onChange={(e) => handleStatusChange(e.target.value)}
                    className="px-2 py-1 rounded-lg border border-[#EAD8C8] bg-[#FAF5EE] text-xs font-semibold text-[#1F1916] focus:outline-none focus:ring-1 focus:ring-[#8C6D3B] cursor-pointer"
                  >
                    <option value="OPEN">OPEN</option>
                    <option value="IN_PROGRESS">IN PROGRESS</option>
                    <option value="RESOLVED">RESOLVED</option>
                    <option value="ESCALATED">ESCALATED</option>
                  </select>
                </div>

                {/* Priority Switcher */}
                <div className="flex items-center gap-1.5">
                  <span className="text-[11px] font-semibold text-[#705E55]">Priority:</span>
                  <select
                    value={detailedTicket?.priority || selectedTicket.priority}
                    onChange={(e) => handlePriorityChange(e.target.value)}
                    className="px-2 py-1 rounded-lg border border-[#EAD8C8] bg-[#FAF5EE] text-xs font-semibold text-[#1F1916] focus:outline-none focus:ring-1 focus:ring-[#8C6D3B] cursor-pointer"
                  >
                    <option value="LOW">LOW</option>
                    <option value="MEDIUM">MEDIUM</option>
                    <option value="HIGH">HIGH</option>
                    <option value="URGENT">URGENT</option>
                  </select>
                </div>
              </div>

              {/* Staff Agent */}
              <div className="flex items-center gap-1.5 text-[11px] text-[#705E55]">
                <ShieldCheck className="w-3.5 h-3.5 text-[#8C6D3B]" />
                <span>Concierge Lead: <strong>Srajan Shukla (Admin)</strong></span>
              </div>
            </div>

            {/* Threaded Message Conversation */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-[#FAF5EE]/30 min-h-[220px] max-h-[360px]">
              {loadingDetails ? (
                <div className="py-12 flex flex-col items-center justify-center text-[#705E55] gap-2">
                  <Loader2 className="w-5 h-5 animate-spin text-[#8C6D3B]" />
                  <span className="text-xs">Loading inquiry conversation...</span>
                </div>
              ) : (detailedTicket?.messages || []).length === 0 ? (
                <div className="py-8 text-center text-xs text-[#705E55]">
                  No previous messages logged for this ticket.
                </div>
              ) : (
                (detailedTicket?.messages || []).map((msg) => {
                  const isStaff = msg.sender === 'STAFF';
                  return (
                    <div
                      key={msg.id}
                      className={`flex flex-col ${isStaff ? 'items-end' : 'items-start'}`}
                    >
                      <div className="flex items-center gap-1.5 mb-1 px-1 text-[10px] text-[#705E55]">
                        <span className="font-bold text-[#1F1916]">{msg.senderName}</span>
                        <span>&bull;</span>
                        <span>{new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                      <div
                        className={`max-w-[85%] rounded-2xl p-3.5 text-xs leading-relaxed shadow-2xs ${
                          isStaff
                            ? 'bg-[#641A2A] text-white rounded-tr-xs'
                            : 'bg-white border border-[#EAD8C8] text-[#1F1916] rounded-tl-xs'
                        }`}
                      >
                        {msg.message}
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Quick Canned Response Chips */}
            <div className="px-5 pt-2 pb-1 bg-white border-t border-[#EAD8C8]/60 flex items-center gap-1.5 overflow-x-auto">
              <span className="text-[10px] font-semibold text-[#8C6D3B] whitespace-nowrap">Quick Replies:</span>
              {[
                'RSVP guest list verified & synced.',
                'Payment captured and receipt dispatched.',
                'Couple portrait updated on live website.',
                'Audio track loop timing adjusted.',
              ].map((canned) => (
                <button
                  key={canned}
                  type="button"
                  onClick={() => setReplyMessage(canned)}
                  className="px-2 py-0.5 rounded-full bg-[#FAF5EE] border border-[#EAD8C8] text-[10px] text-[#705E55] hover:text-[#1F1916] hover:border-[#8C6D3B] whitespace-nowrap transition cursor-pointer"
                >
                  {canned}
                </button>
              ))}
            </div>

            {/* Reply Form */}
            <form onSubmit={handleSendReply} className="p-4 bg-white border-t border-[#EAD8C8]">
              <div className="space-y-2">
                <textarea
                  rows={2}
                  value={replyMessage}
                  onChange={(e) => setReplyMessage(e.target.value)}
                  placeholder="Type your concierge reply or resolution message to customer..."
                  className="w-full p-2.5 bg-[#FAF5EE]/40 border border-[#EAD8C8] rounded-xl text-xs text-[#1F1916] placeholder-[#705E55]/60 focus:outline-none focus:border-[#8C6D3B] resize-none"
                  required
                />

                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 text-xs text-[#705E55] cursor-pointer">
                    <input
                      type="checkbox"
                      checked={resolveOnReply}
                      onChange={(e) => setResolveOnReply(e.target.checked)}
                      className="rounded text-[#641A2A] focus:ring-[#8C6D3B]"
                    />
                    <span>Mark ticket as Resolved upon sending</span>
                  </label>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setSelectedTicket(null)}
                      className="px-3 py-1.5 rounded-xl text-xs font-semibold text-[#705E55] hover:bg-[#FAF5EE] transition cursor-pointer"
                    >
                      Close
                    </button>
                    <button
                      type="submit"
                      disabled={sendingReply || !replyMessage.trim()}
                      className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-xl text-xs font-semibold text-white bg-[#641A2A] hover:bg-[#4E1421] transition shadow-xs disabled:opacity-40 cursor-pointer"
                    >
                      {sendingReply ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <Send className="w-3.5 h-3.5" />
                      )}
                      <span>Send Reply</span>
                    </button>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* CREATE NEW SUPPORT INQUIRY MODAL                               */}
      {/* ============================================================== */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
          <div className="relative w-full max-w-lg bg-white rounded-2xl border border-[#EAD8C8] shadow-2xl p-6 overflow-hidden">
            <div className="flex items-center justify-between pb-4 border-b border-[#EAD8C8]">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-[#FDF2F4] border border-[#7D1935]/20 flex items-center justify-center text-[#7D1935]">
                  <LifeBuoy className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-base text-[#1F1916]">
                    Create Support Inquiry
                  </h3>
                  <p className="text-[11px] text-[#705E55]">
                    Open a new customer inquiry or guest concierge ticket.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowCreateModal(false)}
                className="p-1.5 rounded-lg text-[#705E55] hover:text-[#1F1916] hover:bg-[#FAF5EE] transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateTicket} className="mt-4 space-y-3.5 text-xs">
              {/* Customer Email */}
              <div>
                <label className="block text-[11px] font-semibold text-[#705E55] mb-1">
                  Customer Email *
                </label>
                <input
                  type="email"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  placeholder="customer@example.com"
                  required
                  className="w-full px-3 py-2 rounded-xl border border-[#EAD8C8] bg-[#FAF5EE]/40 text-[#1F1916] focus:outline-none focus:border-[#8C6D3B]"
                />
              </div>

              {/* Customer Phone (Optional) */}
              <div>
                <label className="block text-[11px] font-semibold text-[#705E55] mb-1">
                  Customer Phone (Optional)
                </label>
                <input
                  type="text"
                  value={newPhone}
                  onChange={(e) => setNewPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="w-full px-3 py-2 rounded-xl border border-[#EAD8C8] bg-[#FAF5EE]/40 text-[#1F1916] focus:outline-none focus:border-[#8C6D3B]"
                />
              </div>

              {/* Subject */}
              <div>
                <label className="block text-[11px] font-semibold text-[#705E55] mb-1">
                  Inquiry Subject *
                </label>
                <input
                  type="text"
                  value={newSubject}
                  onChange={(e) => setNewSubject(e.target.value)}
                  placeholder="e.g. Urgent RSVP Question or Audio Adjustment"
                  required
                  className="w-full px-3 py-2 rounded-xl border border-[#EAD8C8] bg-[#FAF5EE]/40 text-[#1F1916] focus:outline-none focus:border-[#8C6D3B]"
                />
              </div>

              {/* Priority */}
              <div>
                <label className="block text-[11px] font-semibold text-[#705E55] mb-1">
                  Priority Level
                </label>
                <select
                  value={newPriority}
                  onChange={(e) => setNewPriority(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl border border-[#EAD8C8] bg-[#FAF5EE]/40 text-[#1F1916] focus:outline-none focus:border-[#8C6D3B] cursor-pointer"
                >
                  <option value="LOW">LOW</option>
                  <option value="MEDIUM">MEDIUM</option>
                  <option value="HIGH">HIGH</option>
                  <option value="URGENT">URGENT</option>
                </select>
              </div>

              {/* Message */}
              <div>
                <label className="block text-[11px] font-semibold text-[#705E55] mb-1">
                  Inquiry Message / Request Details *
                </label>
                <textarea
                  rows={3}
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Detail the guest question or customer request..."
                  required
                  className="w-full p-2.5 rounded-xl border border-[#EAD8C8] bg-[#FAF5EE]/40 text-[#1F1916] focus:outline-none focus:border-[#8C6D3B] resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-[#EAD8C8]">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-[#705E55] hover:bg-[#FAF5EE] transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creatingTicket}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-[#641A2A] hover:bg-[#4E1421] transition shadow-xs disabled:opacity-40 cursor-pointer"
                >
                  {creatingTicket ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Plus className="w-3.5 h-3.5" />
                  )}
                  <span>Create Inquiry</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
