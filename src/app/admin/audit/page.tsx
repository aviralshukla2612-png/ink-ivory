'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  FileCode,
  Search,
  Filter,
  RefreshCw,
  Loader2,
  Calendar,
  User,
  ShieldAlert,
  Eye,
  X,
  Sparkles,
} from 'lucide-react';
import { useAdmin } from '@/context/AdminContext';
import { apiRequest } from '@/lib/api/client';

interface AuditLog {
  id: string;
  userId: string;
  action: string;
  entityType: string;
  entityId?: string;
  metadata?: any;
  createdAt: string;
}

export default function AdminAuditPage() {
  const { hasPermission } = useAdmin();

  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [meta, setMeta] = useState({ page: 1, limit: 25, total: 0, totalPages: 1 });
  const [search, setSearch] = useState('');
  const [actionFilter, setActionFilter] = useState('All');
  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null);

  const fetchLogs = useCallback(async (page = 1) => {
    setLoading(true);
    try {
      const q = new URLSearchParams({
        page: page.toString(),
        limit: '25',
        ...(search ? { search } : {}),
        ...(actionFilter !== 'All' ? { action: actionFilter } : {}),
      });

      const res = await apiRequest<AuditLog[]>(`/api/admin/audit?${q.toString()}`);
      if (res.success && res.data) {
        setLogs(res.data);
        if (res.meta) {
          setMeta({
            page: res.meta.page || 1,
            limit: res.meta.limit || 25,
            total: res.meta.total || 0,
            totalPages: res.meta.totalPages || 1,
          });
        }
      }
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }, [search, actionFilter]);

  useEffect(() => {
    fetchLogs(1);
  }, [fetchLogs]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-800">
        <div>
          <h1 className="text-2xl font-serif text-amber-100 flex items-center gap-3">
            <FileCode className="w-6 h-6 text-amber-400" />
            Immutable Audit Trail
          </h1>
          <p className="text-sm text-stone-400 mt-1">
            Chronological, cryptographically signed ledger of administrative mutations, refunds, and security actions.
          </p>
        </div>
        <button
          onClick={() => fetchLogs(meta.page)}
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
            placeholder="Search by action, actor, entity ID, or resource..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-xs bg-stone-900/80 border border-stone-800 rounded-lg text-stone-200 placeholder:text-stone-500 focus:outline-none focus:border-amber-600 transition-colors"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-stone-500" />
          <select
            value={actionFilter}
            onChange={(e) => setActionFilter(e.target.value)}
            className="px-3 py-2 text-xs bg-stone-900/80 border border-stone-800 rounded-lg text-stone-200 focus:outline-none focus:border-amber-600 transition-colors"
          >
            <option value="All">All Actions</option>
            <option value="LOGIN">Admin Logins</option>
            <option value="PAYMENT">Payments & Refunds</option>
            <option value="TEMPLATE">Templates & Builder</option>
            <option value="COUPON">Coupons</option>
            <option value="STAFF">Staff & Roles</option>
            <option value="SETTINGS">Settings</option>
          </select>
        </div>
      </div>

      {/* Audit Log Table */}
      <div className="bg-stone-900/50 border border-stone-800/80 rounded-xl overflow-hidden backdrop-blur-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-950/70 border-b border-stone-800 text-stone-400 font-medium">
              <tr>
                <th className="py-3 px-4">Timestamp</th>
                <th className="py-3 px-4">Action</th>
                <th className="py-3 px-4">Actor</th>
                <th className="py-3 px-4">Entity Type</th>
                <th className="py-3 px-4">Entity ID</th>
                <th className="py-3 px-4 text-right">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-800/50 text-stone-300">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-stone-500">
                    <Loader2 className="w-5 h-5 animate-spin mx-auto mb-2 text-amber-500" />
                    Querying audit stream...
                  </td>
                </tr>
              ) : logs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-stone-500">
                    No audit records matching query.
                  </td>
                </tr>
              ) : (
                logs.map((l) => (
                  <tr key={l.id} className="hover:bg-stone-800/30 transition-colors">
                    <td className="py-3 px-4 font-mono text-[11px] text-stone-400 whitespace-nowrap">
                      {new Date(l.createdAt).toLocaleString()}
                    </td>
                    <td className="py-3 px-4 font-semibold text-amber-300 font-mono">
                      {l.action}
                    </td>
                    <td className="py-3 px-4 font-mono text-stone-300">
                      {l.userId}
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded text-[10px] bg-stone-800 text-stone-300 border border-stone-700">
                        {l.entityType}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-mono text-[11px] text-stone-400">
                      {l.entityId || '—'}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => setSelectedLog(l)}
                        className="p-1.5 rounded-md hover:bg-stone-800 text-stone-400 hover:text-amber-200 transition-colors"
                        title="View Full Metadata"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {meta.totalPages > 1 && (
          <div className="p-4 border-t border-stone-800 flex items-center justify-between text-xs text-stone-400">
            <span>Showing {logs.length} of {meta.total} audit records</span>
            <div className="flex items-center gap-2">
              <button
                disabled={meta.page <= 1}
                onClick={() => fetchLogs(meta.page - 1)}
                className="px-2.5 py-1 bg-stone-900 border border-stone-800 rounded disabled:opacity-40 hover:border-amber-700/50 transition-colors"
              >
                Previous
              </button>
              <span>Page {meta.page} of {meta.totalPages}</span>
              <button
                disabled={meta.page >= meta.totalPages}
                onClick={() => fetchLogs(meta.page + 1)}
                className="px-2.5 py-1 bg-stone-900 border border-stone-800 rounded disabled:opacity-40 hover:border-amber-700/50 transition-colors"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Metadata JSON Modal */}
      {selectedLog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-stone-900 border border-stone-800 rounded-xl p-6 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-stone-800">
              <h3 className="text-base font-serif text-amber-100 flex items-center gap-2 font-mono">
                {selectedLog.action}
              </h3>
              <button onClick={() => setSelectedLog(null)} className="text-stone-400 hover:text-stone-100">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between text-stone-400">
                <span>Timestamp:</span>
                <span className="font-mono text-stone-200">{new Date(selectedLog.createdAt).toISOString()}</span>
              </div>
              <div className="flex justify-between text-stone-400">
                <span>Actor ID:</span>
                <span className="font-mono text-stone-200">{selectedLog.userId}</span>
              </div>
              <div className="flex justify-between text-stone-400">
                <span>Target:</span>
                <span className="font-mono text-stone-200">{selectedLog.entityType} ({selectedLog.entityId || 'N/A'})</span>
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-stone-400 mb-1">Sanitized Metadata Payload:</label>
              <pre className="p-3 bg-stone-950 border border-stone-800 rounded-lg text-amber-300 font-mono text-[11px] overflow-x-auto max-h-60">
                {JSON.stringify(selectedLog.metadata || {}, null, 2)}
              </pre>
            </div>
            <div className="flex justify-end pt-2">
              <button
                onClick={() => setSelectedLog(null)}
                className="px-4 py-1.5 text-xs font-semibold bg-stone-800 hover:bg-stone-700 text-stone-200 rounded-lg"
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
