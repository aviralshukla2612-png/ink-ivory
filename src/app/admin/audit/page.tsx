'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  ShieldAlert,
  Search,
  Filter,
  RefreshCw,
  Loader2,
  Calendar,
  User,
  Eye,
  X,
  Sparkles,
  Layers,
  Clock,
  Shield,
  Users,
  Copy,
  Check,
} from 'lucide-react';
import { useAdmin } from '@/context/AdminContext';
import { apiRequest } from '@/lib/api/client';
import AdminPagination from '@/components/admin/AdminPagination';

interface AuditLog {
  id: string;
  actor: string;
  action: string;
  entityType: string;
  entityId?: string;
  details?: string;
  createdAt: string;
}

export default function AdminAuditPage() {
  const { hasPermission } = useAdmin();

  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [actionFilter, setActionFilter] = useState('All');
  const [actorFilter, setActorFilter] = useState('All');
  const [timeFilter, setTimeFilter] = useState('All');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(4892);

  const [stats, setStats] = useState({
    totalLogs: '4,892',
    activeAdmins: 18,
    actionTypes: 12,
    lastActivity: 'Just now',
  });

  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const fetchLogs = useCallback(async () => {
    setLoading(true);
    try {
      const q = new URLSearchParams({
        page: page.toString(),
        limit: pageSize.toString(),
        ...(search ? { search } : {}),
        ...(actionFilter !== 'All' ? { action: actionFilter } : {}),
      });

      const res = await apiRequest<AuditLog[]>(
        `/api/admin/audit?${q.toString()}`
      );
      if (res && res.data) {
        setLogs(res.data);
        if (res.stats) setStats(res.stats);
        if (res.meta) setTotal(res.meta.total);
      }
    } catch (err: any) {
      console.error('Failed to load audit logs:', err);
    } finally {
      setLoading(false);
    }
  }, [page, pageSize, search, actionFilter]);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-[#EAD8C8]">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-[11px] font-mono tracking-wider uppercase px-2.5 py-0.5 rounded-full bg-[#FAF5EE] text-[#8C6D3B] border border-[#EAD8C8] font-semibold">
              AUDIT &amp; ACTIVITY LOGS • System Activity Tracker
            </span>
          </div>
          <h1 className="text-2xl lg:text-3xl font-serif font-bold text-[#1F1916] tracking-tight">
            Administrative Audit Logs
          </h1>
          <p className="text-xs text-[#705E55] mt-1">
            Traceability records for security compliance, admin logins, template edits and deletions.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => fetchLogs()}
            disabled={loading}
            className="p-2 text-[#705E55] hover:text-[#1F1916] bg-white border border-[#EAD8C8] rounded-xl hover:bg-[#FAF5EE] transition shadow-xs"
            title="Refresh"
            aria-label="Refresh audit logs"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* 4 Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Logs */}
        <div className="bg-white p-4.5 rounded-2xl border border-[#EAD8C8] shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 shrink-0">
            <Shield className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-serif font-bold text-[#1F1916] leading-none">
              {stats.totalLogs}
            </div>
            <div className="text-xs text-[#705E55] font-medium mt-1">Total Logs</div>
          </div>
        </div>

        {/* Active Admins */}
        <div className="bg-white p-4.5 rounded-2xl border border-[#EAD8C8] shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 shrink-0">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-serif font-bold text-[#1F1916] leading-none">
              {stats.activeAdmins}
            </div>
            <div className="text-xs text-[#705E55] font-medium mt-1">Active Admins</div>
          </div>
        </div>

        {/* Action Types */}
        <div className="bg-white p-4.5 rounded-2xl border border-[#EAD8C8] shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-purple-50 border border-purple-100 flex items-center justify-center text-purple-600 shrink-0">
            <Layers className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-serif font-bold text-[#1F1916] leading-none">
              {stats.actionTypes}
            </div>
            <div className="text-xs text-[#705E55] font-medium mt-1">Action Types</div>
          </div>
        </div>

        {/* Last Activity */}
        <div className="bg-white p-4.5 rounded-2xl border border-[#EAD8C8] shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600 shrink-0">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xl font-serif font-bold text-[#1F1916] leading-none">
              {stats.lastActivity}
            </div>
            <div className="text-xs text-[#705E55] font-medium mt-1">Last Activity</div>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-3.5 rounded-2xl border border-[#EAD8C8] shadow-xs flex flex-col md:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8C6D3B]" />
          <input
            type="text"
            placeholder="Search logs by action, admin, entity ID or details..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-[#FAF5EE]/60 border border-[#EAD8C8] rounded-xl text-xs text-[#1F1916] placeholder-[#8C6D3B]/50 focus:outline-none focus:border-[#8C6D3B] focus:bg-white"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          {/* Action Filter */}
          <select
            value={actionFilter}
            aria-label="Filter by Action"
            onChange={(e) => setActionFilter(e.target.value)}
            className="px-3 py-2 bg-[#FAF5EE]/60 border border-[#EAD8C8] rounded-xl text-xs font-medium text-[#1F1916] focus:outline-none focus:border-[#8C6D3B] cursor-pointer"
          >
            <option value="All">All Action Types</option>
            <option value="ADMIN_PUBLICATION_RESTORE">Publication Restore</option>
            <option value="DRAFT_SAVED">Draft Saved</option>
            <option value="ORDER_REFUND">Order Refund</option>
            <option value="COUPON_CREATE">Coupon Create</option>
          </select>

          {/* Actor Filter */}
          <select
            value={actorFilter}
            aria-label="Filter by Admin Actor"
            onChange={(e) => setActorFilter(e.target.value)}
            className="px-3 py-2 bg-[#FAF5EE]/60 border border-[#EAD8C8] rounded-xl text-xs font-medium text-[#1F1916] focus:outline-none focus:border-[#8C6D3B] cursor-pointer"
          >
            <option value="All">All Admins</option>
            <option value="usr_super_admin">usr_super_admin</option>
            <option value="admin_srajan">admin_srajan</option>
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
            onClick={() => fetchLogs()}
            className="p-2 text-[#705E55] hover:text-[#1F1916] bg-[#FAF5EE] border border-[#EAD8C8] rounded-xl hover:border-[#8C6D3B] transition"
            title="Refresh Table"
            aria-label="Refresh Table"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Audit Logs Table */}
      <div className="bg-white rounded-2xl border border-[#EAD8C8] shadow-xs overflow-hidden">
        {loading ? (
          <div className="py-24 flex flex-col items-center justify-center gap-2 text-[#705E55]">
            <Loader2 className="w-6 h-6 animate-spin text-[#8C6D3B]" />
            <span className="text-xs font-mono">Loading audit logs...</span>
          </div>
        ) : logs.length === 0 ? (
          <div className="py-20 text-center text-[#705E55]">
            <ShieldAlert className="w-10 h-10 text-[#8C6D3B]/40 mx-auto mb-2" />
            <h3 className="font-serif font-bold text-base text-[#1F1916]">No Audit Logs</h3>
            <p className="text-xs mt-1">Try clearing your filters or check back later.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#FAF5EE] text-[#705E55] uppercase text-[10px] font-mono tracking-wider border-b border-[#EAD8C8]">
                <tr>
                  <th className="py-3 px-4 text-center w-14">Sr. No.</th>
                  <th className="py-3 px-4">Timestamp</th>
                  <th className="py-3 px-4">Action</th>
                  <th className="py-3 px-4">Actor</th>
                  <th className="py-3 px-4">Entity Type</th>
                  <th className="py-3 px-4">Entity ID</th>
                  <th className="py-3 px-4">Details</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EAD8C8]/60">
                {logs.map((l, idx) => {
                  const srNo = (page - 1) * pageSize + idx + 1;

                  return (
                    <tr key={l.id || idx} className="hover:bg-[#FAF5EE]/40 transition-colors">
                      {/* Sr. No. */}
                      <td className="py-3.5 px-4 text-center font-mono font-medium text-[#705E55]">
                        {srNo}
                      </td>

                      {/* Timestamp */}
                      <td className="py-3.5 px-4 text-[#705E55] font-mono text-[11px]">
                        <div>
                          {new Date(l.createdAt).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })}
                        </div>
                        <div className="text-[10px] text-[#705E55]">
                          {new Date(l.createdAt).toLocaleTimeString('en-US', {
                            hour: '2-digit',
                            minute: '2-digit',
                            second: '2-digit',
                          })}
                        </div>
                      </td>

                      {/* Action */}
                      <td className="py-3.5 px-4">
                        <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase font-semibold bg-[#FAF5EE] text-[#8C6D3B] border border-[#EAD8C8]">
                          {l.action}
                        </span>
                      </td>

                      {/* Actor */}
                      <td className="py-3.5 px-4 font-mono text-xs text-[#1F1916]">
                        {l.actor}
                      </td>

                      {/* Entity Type */}
                      <td className="py-3.5 px-4 font-mono text-xs text-[#705E55]">
                        {l.entityType}
                      </td>

                      {/* Entity ID */}
                      <td className="py-3.5 px-4">
                        {l.entityId ? (
                          <div className="flex items-center gap-1.5">
                            <span className="font-mono text-xs text-[#1F1916]">
                              {l.entityId}
                            </span>
                            <button
                              onClick={() => copyToClipboard(l.entityId!, `log-${idx}`)}
                              className="p-1 text-[#8C6D3B] hover:text-[#1F1916] rounded transition"
                              title="Copy ID"
                              aria-label="Copy ID"
                            >
                              {copiedId === `log-${idx}` ? (
                                <Check className="w-3 h-3 text-emerald-600" />
                              ) : (
                                <Copy className="w-3 h-3" />
                              )}
                            </button>
                          </div>
                        ) : (
                          <span className="text-[#705E55]">—</span>
                        )}
                      </td>

                      {/* Details */}
                      <td className="py-3.5 px-4 text-[#705E55] text-xs max-w-xs truncate" title={l.details}>
                        {l.details || '—'}
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={() => setSelectedLog(l)}
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
        itemName="logs"
        onPageChange={(p) => setPage(p)}
        onPageSizeChange={(s) => {
          setPageSize(s);
          setPage(1);
        }}
      />

      {/* Log Details Modal */}
      {selectedLog && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-[#EAD8C8] shadow-2xl max-w-lg w-full p-6 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-[#EAD8C8]">
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-[#8C6D3B]" />
                <h3 className="font-serif font-bold text-lg text-[#1F1916]">
                  Audit Log Details
                </h3>
              </div>
              <button
                onClick={() => setSelectedLog(null)}
                className="p-1 text-[#705E55] hover:text-[#1F1916] rounded-lg"
                aria-label="Close modal"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="mt-4 space-y-3 text-xs">
              <div className="flex justify-between py-1.5 border-b border-[#EAD8C8]/60">
                <span className="text-[#705E55]">Action</span>
                <span className="font-mono font-bold text-[#1F1916]">{selectedLog.action}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-[#EAD8C8]/60">
                <span className="text-[#705E55]">Actor</span>
                <span className="font-mono text-[#1F1916]">{selectedLog.actor}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-[#EAD8C8]/60">
                <span className="text-[#705E55]">Entity Type</span>
                <span className="font-mono text-[#1F1916]">{selectedLog.entityType}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-[#EAD8C8]/60">
                <span className="text-[#705E55]">Entity ID</span>
                <span className="font-mono text-[#1F1916]">{selectedLog.entityId || '—'}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-[#EAD8C8]/60">
                <span className="text-[#705E55]">Timestamp</span>
                <span className="font-mono text-[#1F1916]">{new Date(selectedLog.createdAt).toLocaleString()}</span>
              </div>
              <div className="pt-2">
                <span className="text-[#705E55] block mb-1">Details</span>
                <div className="p-3 bg-[#FAF5EE] rounded-xl border border-[#EAD8C8] text-[#1F1916] font-mono whitespace-pre-wrap">
                  {selectedLog.details}
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setSelectedLog(null)}
                className="px-4 py-2 bg-[#FAF5EE] border border-[#EAD8C8] rounded-xl text-xs font-semibold text-[#1F1916] hover:bg-[#EAD8C8]/50 transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
