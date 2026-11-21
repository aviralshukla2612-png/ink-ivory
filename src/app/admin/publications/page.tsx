'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import {
  Globe,
  Search,
  Filter,
  Eye,
  ShieldAlert,
  ShieldCheck,
  ExternalLink,
  Loader2,
  RefreshCw,
  X,
  Calendar,
  Layers,
  Sparkles,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';
import { useAdmin } from '@/context/AdminContext';
import { apiRequest } from '@/lib/api/client';

interface PublicationListItem {
  id: string;
  slug: string;
  templateId: string;
  templateTitle: string;
  userId?: string;
  guestToken?: string;
  version: number;
  status: 'ACTIVE' | 'SUSPENDED' | 'EXPIRED';
  viewCount: number;
  publicUrl: string;
  publishedAt: string;
  suspensionReason?: string;
  snapshotData?: {
    fields?: Record<string, any>;
    design?: Record<string, any>;
  };
}

export default function AdminPublicationsPage() {
  const { hasPermission } = useAdmin();
  const canManage = hasPermission('PUBLICATIONS_MANAGE');

  const [publications, setPublications] = useState<PublicationListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [meta, setMeta] = useState({ page: 1, limit: 15, total: 0, totalPages: 1 });

  // Filters
  const [search, setSearch] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('All');

  // Modals
  const [suspendModalItem, setSuspendModalItem] = useState<PublicationListItem | null>(null);
  const [suspendReason, setSuspendReason] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const loadPublications = useCallback(async () => {
    setLoading(true);
    try {
      const query = new URLSearchParams();
      query.set('page', meta.page.toString());
      query.set('limit', meta.limit.toString());
      if (search) query.set('search', search);
      if (selectedStatus !== 'All') query.set('status', selectedStatus);

      const res = await apiRequest<PublicationListItem[]>(`/api/admin/publications?${query.toString()}`);
      setPublications(res.data);
      if (res.meta) setMeta(res.meta);
    } catch (err: any) {
      console.error('Failed to load publications:', err);
    } finally {
      setLoading(false);
    }
  }, [meta.page, meta.limit, search, selectedStatus]);

  useEffect(() => {
    loadPublications();
  }, [loadPublications]);

  const handleSuspend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!suspendModalItem || !canManage) return;

    setSubmitting(true);
    try {
      await apiRequest(`/api/admin/publications/${encodeURIComponent(suspendModalItem.id)}/suspend`, {
        method: 'POST',
        body: JSON.stringify({ reason: suspendReason.trim() }),
      });

      setFeedback({ type: 'success', text: `Publication "${suspendModalItem.slug}" suspended successfully.` });
      setSuspendModalItem(null);
      setSuspendReason('');
      await loadPublications();
    } catch (err: any) {
      setFeedback({ type: 'error', text: err.message || 'Failed to suspend publication.' });
    } finally {
      setSubmitting(false);
    }
  };

  const handleRestore = async (item: PublicationListItem) => {
    if (!canManage) return;
    setSubmitting(true);
    try {
      await apiRequest(`/api/admin/publications/${encodeURIComponent(item.id)}/restore`, {
        method: 'POST',
      });

      setFeedback({ type: 'success', text: `Publication "${item.slug}" restored to Active status.` });
      await loadPublications();
    } catch (err: any) {
      setFeedback({ type: 'error', text: err.message || 'Failed to restore publication.' });
    } finally {
      setSubmitting(false);
    }
  };

  const totalViews = publications.reduce((sum, p) => sum + (p.viewCount || 0), 0);
  const activeCount = publications.filter((p) => p.status === 'ACTIVE').length;

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-[#EAD8C8]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-mono tracking-widest uppercase px-2 py-0.5 rounded bg-[#FAF5EE] text-[#8C6D3B] border border-[#EAD8C8]">
              Milestone 6 Deliverable
            </span>
            <span className="text-xs text-[#8C6D3B]/70">•</span>
            <span className="text-xs text-[#8C6D3B]/70 font-mono">Public URL Engine</span>
          </div>
          <h1 className="text-2xl lg:text-3xl font-serif font-bold text-[#1F1916] tracking-tight">
            Published Websites &amp; Invitations
          </h1>
          <p className="text-xs text-[#705E55] mt-0.5">
            Monitor live public guest links, track engagement analytics, and enforce platform trust &amp; safety policies.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => loadPublications()}
            disabled={loading}
            className="p-2 text-[#705E55] hover:text-[#1F1916] bg-white border border-[#EAD8C8] rounded-xl hover:bg-[#FAF5EE] transition-colors"
            title="Refresh"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* KPI Highlight Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-[#EAD8C8] shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[10px] font-mono uppercase text-[#705E55]">Active Invitations</span>
            <div className="text-xl font-serif font-bold text-emerald-800 mt-0.5">{activeCount}</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700">
            <Globe className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-[#EAD8C8] shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[10px] font-mono uppercase text-[#705E55]">Total Publications</span>
            <div className="text-xl font-serif font-bold text-[#1F1916] mt-0.5">{meta.total}</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-[#FAF5EE] border border-[#EAD8C8] flex items-center justify-center text-[#8C6D3B]">
            <Layers className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-[#EAD8C8] shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[10px] font-mono uppercase text-[#705E55]">Guest Views Tracked</span>
            <div className="text-xl font-serif font-bold text-[#641A2A] mt-0.5">{totalViews.toLocaleString('en-IN')}</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-[#FAF5EE] border border-[#EAD8C8] flex items-center justify-center text-[#8C6D3B]">
            <Eye className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Feedback Toast */}
      {feedback && (
        <div
          className={`flex items-center justify-between p-3.5 rounded-xl border text-xs font-medium ${
            feedback.type === 'success'
              ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
              : 'bg-rose-50 border-rose-200 text-rose-800'
          }`}
        >
          <div className="flex items-center gap-2">
            {feedback.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            ) : (
              <AlertCircle className="w-4 h-4 text-rose-600" />
            )}
            <span>{feedback.text}</span>
          </div>
          <button onClick={() => setFeedback(null)} className="p-0.5">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="bg-white p-3 rounded-2xl border border-[#EAD8C8] shadow-sm flex flex-col md:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#8C6D3B]" />
          <input
            type="text"
            placeholder="Search publications by slug, celebrant names or template title..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-[#FAF5EE]/60 border border-[#EAD8C8] rounded-xl text-xs text-[#1F1916] placeholder-[#8C6D3B]/50 focus:outline-none focus:border-[#8C6D3B] focus:bg-white"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-3 py-2 bg-[#FAF5EE]/60 border border-[#EAD8C8] rounded-xl text-xs text-[#1F1916] focus:outline-none focus:border-[#8C6D3B]"
          >
            <option value="All">All Statuses</option>
            <option value="ACTIVE">Active (Live)</option>
            <option value="SUSPENDED">Suspended</option>
            <option value="EXPIRED">Expired</option>
          </select>

          <div className="text-xs font-mono text-[#8C6D3B] px-3 py-2 rounded-xl bg-[#FAF5EE] border border-[#EAD8C8]">
            Count: <span className="font-bold text-[#1F1916]">{meta.total}</span>
          </div>
        </div>
      </div>

      {/* Publications Table */}
      <div className="bg-white rounded-2xl border border-[#EAD8C8] shadow-sm overflow-hidden">
        {loading ? (
          <div className="py-24 flex flex-col items-center justify-center gap-2 text-[#705E55]">
            <Loader2 className="w-6 h-6 animate-spin text-[#8C6D3B]" />
            <span className="text-xs font-mono">Loading publications...</span>
          </div>
        ) : publications.length === 0 ? (
          <div className="py-20 text-center text-[#705E55]">
            <Globe className="w-10 h-10 text-[#8C6D3B]/40 mx-auto mb-2" />
            <h3 className="font-serif font-bold text-base text-[#1F1916]">No Published Invitations Found</h3>
            <p className="text-xs mt-1">Try clearing your search query or status filter.</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
              <thead className="bg-[#FAF5EE] text-[#705E55] uppercase text-[10px] font-mono tracking-wider border-b border-[#EAD8C8]">
                <tr>
                  <th className="py-3 px-4">Live Website URL</th>
                  <th className="py-3 px-4">Template &amp; Occasion</th>
                  <th className="py-3 px-4">Celebrants / Names</th>
                  <th className="py-3 px-4 text-center">Guest Views</th>
                  <th className="py-3 px-4 text-center">Status</th>
                  <th className="py-3 px-4">Published Date</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EAD8C8]/60">
                {publications.map((p) => (
                  <tr key={p.id} className="hover:bg-[#FAF5EE]/40 transition-colors">
                    {/* Live Website URL */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-semibold text-xs text-[#1F1916] block">
                          /invite/{p.slug}
                        </span>
                        <a
                          href={p.publicUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1 hover:bg-[#FAF5EE] text-[#8C6D3B] rounded transition-colors"
                          title="Open invitation in new tab"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      </div>
                    </td>

                    {/* Template */}
                    <td className="py-3.5 px-4">
                      <span className="font-medium text-[#1F1916] block">
                        {p.templateTitle}
                      </span>
                      <span className="text-[10px] font-mono text-[#705E55]">
                        {p.templateId}
                      </span>
                    </td>

                    {/* Names */}
                    <td className="py-3.5 px-4 font-serif font-semibold text-[#1F1916]">
                      {p.snapshotData?.fields?.names || <span className="text-[#705E55]/50 italic">Bespoke Event</span>}
                    </td>

                    {/* Guest Views */}
                    <td className="py-3.5 px-4 text-center font-mono font-bold text-[#641A2A]">
                      {p.viewCount}
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-4 text-center">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase font-semibold ${
                          p.status === 'ACTIVE'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : p.status === 'SUSPENDED'
                            ? 'bg-rose-50 text-rose-700 border border-rose-200'
                            : 'bg-stone-100 text-stone-700 border border-stone-200'
                        }`}
                      >
                        {p.status}
                      </span>
                    </td>

                    {/* Published Date */}
                    <td className="py-3.5 px-4 text-[#705E55] font-mono text-[11px]">
                      {new Date(p.publishedAt).toLocaleDateString()}
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right">
                      {canManage && (
                        <div className="flex items-center justify-end gap-1.5">
                          {p.status === 'ACTIVE' ? (
                            <button
                              onClick={() => {
                                setSuspendModalItem(p);
                                setSuspendReason('');
                              }}
                              className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-lg bg-rose-50 border border-rose-200 text-rose-700 hover:bg-rose-100 transition-colors"
                            >
                              <ShieldAlert className="w-3 h-3" />
                              <span>Suspend</span>
                            </button>
                          ) : (
                            <button
                              onClick={() => handleRestore(p)}
                              className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-700 hover:bg-emerald-100 transition-colors"
                            >
                              <ShieldCheck className="w-3 h-3" />
                              <span>Restore</span>
                            </button>
                          )}
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination Bar */}
          <div className="p-4 border-t border-[#EAD8C8] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#705E55] bg-[#FAF5EE]">
            <span>
              Showing {publications.length > 0 ? (meta.page - 1) * meta.limit + 1 : 0} to{' '}
              {Math.min(meta.page * meta.limit, meta.total)} of {meta.total} live publications
            </span>
            <div className="flex items-center gap-2">
              <button
                disabled={meta.page <= 1}
                onClick={() => setMeta((m) => ({ ...m, page: m.page - 1 }))}
                className="px-3 py-1.5 rounded-lg border border-[#EAD8C8] bg-white disabled:opacity-40 hover:bg-[#FAF5EE] text-[#1F1916] font-medium transition cursor-pointer disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <span className="font-mono text-[#1F1916] px-2">
                Page {meta.page} of {Math.max(1, meta.totalPages)}
              </span>
              <button
                disabled={meta.page >= meta.totalPages}
                onClick={() => setMeta((m) => ({ ...m, page: m.page + 1 }))}
                className="px-3 py-1.5 rounded-lg border border-[#EAD8C8] bg-white disabled:opacity-40 hover:bg-[#FAF5EE] text-[#1F1916] font-medium transition cursor-pointer disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
          </>
        )}
      </div>

      {/* SUSPEND MODAL */}
      {suspendModalItem && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-[#EAD8C8] shadow-2xl max-w-md w-full overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="px-6 py-4 bg-rose-50/70 border-b border-rose-100 flex items-center justify-between">
              <div className="flex items-center gap-2 text-rose-800">
                <ShieldAlert className="w-5 h-5 text-rose-600" />
                <h3 className="font-serif font-bold text-base">Suspend Public Invitation</h3>
              </div>
              <button
                onClick={() => setSuspendModalItem(null)}
                className="p-1.5 rounded-xl hover:bg-white text-[#705E55] transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSuspend} className="p-6 space-y-4">
              <p className="text-xs text-[#705E55] leading-relaxed">
                Suspending will immediately render a polite administrative notice when guests visit <span className="font-mono font-bold text-[#1F1916]">/invite/{suspendModalItem.slug}</span>.
              </p>

              <div>
                <label className="block text-[11px] font-mono uppercase text-[#705E55] mb-1 font-semibold">
                  Suspension Reason (Logged in Audit Trail) *
                </label>
                <textarea
                  required
                  rows={3}
                  placeholder="e.g. Inappropriate content, copyright infringement claim, customer request..."
                  value={suspendReason}
                  onChange={(e) => setSuspendReason(e.target.value)}
                  className="w-full px-3 py-2 bg-[#FAF5EE]/60 border border-[#EAD8C8] rounded-xl text-xs text-[#1F1916] focus:outline-none focus:border-[#8C6D3B] focus:bg-white"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2 border-t border-[#EAD8C8]">
                <button
                  type="button"
                  onClick={() => setSuspendModalItem(null)}
                  className="px-4 py-2 text-xs font-medium text-[#705E55] hover:bg-[#FAF5EE] rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex items-center gap-2 px-5 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold rounded-xl shadow-sm transition-all disabled:opacity-50"
                >
                  {submitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>Suspend Invitation</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
