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
} from 'lucide-react';
import { useAdmin } from '@/context/AdminContext';
import { apiRequest } from '@/lib/api/client';
import AdminPagination from '@/components/admin/AdminPagination';

interface SupportTicket {
  id: string;
  ticketNumber: string;
  customerEmail: string;
  customerPhone?: string;
  subject: string;
  status: string;
  priority: string;
  assignedTo?: { name: string; initials: string };
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
  const [total, setTotal] = useState(412);

  const [stats, setStats] = useState({
    totalInquiries: 412,
    resolved: 368,
    inProgress: 32,
    pending: 8,
    escalated: 4,
  });

  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);

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

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
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
          <button
            onClick={() => fetchTickets()}
            disabled={loading}
            className="p-2 text-[#705E55] hover:text-[#1F1916] bg-white border border-[#EAD8C8] rounded-xl hover:bg-[#FAF5EE] transition shadow-xs"
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
                    <tr key={t.id || idx} className="hover:bg-[#FAF5EE]/40 transition-colors">
                      {/* Sr. No. */}
                      <td className="py-3.5 px-4 text-center font-mono font-medium text-[#705E55]">
                        {srNo}
                      </td>

                      {/* Ticket ID */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-1.5">
                          <span className="font-mono font-bold text-xs text-[#1F1916]">
                            {t.ticketNumber}
                          </span>
                          <button
                            onClick={() => copyToClipboard(t.ticketNumber, `tck-${idx}`)}
                            className="p-1 text-[#8C6D3B] hover:text-[#1F1916] rounded transition"
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
                          onClick={() => setSelectedTicket(t)}
                          className="p-1.5 text-[#705E55] hover:text-[#1F1916] hover:bg-[#FAF5EE] rounded-lg transition-colors"
                          title="View Conversation"
                          aria-label="View Conversation"
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
        pageSizeOptions={[10, 25, 50]}
        itemName="tickets"
        onPageChange={(p) => setPage(p)}
        onPageSizeChange={(s) => {
          setPageSize(s);
          setPage(1);
        }}
      />
    </div>
  );
}
