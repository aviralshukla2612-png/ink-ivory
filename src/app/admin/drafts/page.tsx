'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import {
  FileText,
  Search,
  Filter,
  Eye,
  Trash2,
  ExternalLink,
  Loader2,
  RefreshCw,
  X,
  Layers,
  CheckCircle2,
  AlertCircle,
  Code,
  Music,
} from 'lucide-react';
import { useAdmin } from '@/context/AdminContext';
import { apiRequest } from '@/lib/api/client';
import { getTemplates, TemplateListItem } from '@/lib/api/templates-api';

interface DraftListItem {
  id: string;
  templateId: string;
  templateTitle: string;
  title: string;
  guestToken?: string;
  userId?: string;
  status: string;
  version: number;
  previewUrl: string;
  customAudioUrl?: string;
  customAudioTitle?: string;
  fields?: Record<string, any>;
  design?: Record<string, any>;
  updatedAt: string;
  createdAt: string;
}

export default function AdminDraftsPage() {
  const { hasPermission } = useAdmin();
  const canManage = hasPermission('CUSTOMERS_MANAGE');

  const [drafts, setDrafts] = useState<DraftListItem[]>([]);
  const [templates, setTemplates] = useState<TemplateListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [meta, setMeta] = useState({ page: 1, limit: 15, total: 0, totalPages: 1 });

  // Filters
  const [search, setSearch] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');

  // Modals
  const [inspectDraft, setInspectDraft] = useState<DraftListItem | null>(null);
  const [deleteConfirmDraft, setDeleteConfirmDraft] = useState<DraftListItem | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const loadDrafts = useCallback(async () => {
    setLoading(true);
    try {
      const query = new URLSearchParams();
      query.set('page', meta.page.toString());
      query.set('limit', meta.limit.toString());
      if (search) query.set('search', search);
      if (selectedTemplate !== 'All') query.set('templateId', selectedTemplate);
      if (selectedStatus !== 'All') query.set('status', selectedStatus);

      const res = await apiRequest<DraftListItem[]>(`/api/admin/drafts?${query.toString()}`);
      setDrafts(res.data);
      if (res.meta) setMeta(res.meta);
    } catch (err: any) {
      console.error('Failed to load drafts:', err);
    } finally {
      setLoading(false);
    }
  }, [meta.page, meta.limit, search, selectedTemplate, selectedStatus]);

  useEffect(() => {
    async function loadInitial() {
      try {
        const tplsRes = await getTemplates({ limit: 50 });
        setTemplates(tplsRes.items);
      } catch (e) {}
      await loadDrafts();
    }
    loadInitial();
  }, [loadDrafts]);

  const handleDelete = async () => {
    if (!deleteConfirmDraft || !canManage) return;
    setSubmitting(true);
    try {
      await apiRequest(`/api/admin/drafts/${encodeURIComponent(deleteConfirmDraft.id)}`, {
        method: 'DELETE',
      });
      setFeedback({ type: 'success', text: `Draft "${deleteConfirmDraft.id}" deleted successfully.` });
      setDeleteConfirmDraft(null);
      await loadDrafts();
    } catch (err: any) {
      setFeedback({ type: 'error', text: err.message || 'Failed to delete draft.' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-[#EAD8C8]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-mono tracking-widest uppercase px-2 py-0.5 rounded bg-[#FAF5EE] text-[#8C6D3B] border border-[#EAD8C8]">
              Milestone 5 Deliverable
            </span>
            <span className="text-xs text-[#8C6D3B]/70">•</span>
            <span className="text-xs text-[#8C6D3B]/70 font-mono">Bespoke Drafts Inspector</span>
          </div>
          <h1 className="text-2xl lg:text-3xl font-serif font-bold text-[#1F1916] tracking-tight">
            Customer Drafts
          </h1>
          <p className="text-xs text-[#705E55] mt-0.5">
            Inspect private customer drafts, customize state payload inspection, and draft diagnostics.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/admin/customers"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-[#705E55] bg-white border border-[#EAD8C8] rounded-xl hover:border-[#8C6D3B] transition-colors"
          >
            <span>Customers Directory</span>
          </Link>
          <button
            onClick={() => loadDrafts()}
            disabled={loading}
            className="p-2 text-[#705E55] hover:text-[#1F1916] bg-white border border-[#EAD8C8] rounded-xl hover:bg-[#FAF5EE] transition-colors"
            title="Refresh"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          </button>
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
            placeholder="Search drafts by title, draft ID, customer name or token..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-[#FAF5EE]/60 border border-[#EAD8C8] rounded-xl text-xs text-[#1F1916] placeholder-[#8C6D3B]/50 focus:outline-none focus:border-[#8C6D3B] focus:bg-white"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          {/* Template Filter */}
          <select
            value={selectedTemplate}
            onChange={(e) => setSelectedTemplate(e.target.value)}
            className="px-3 py-2 bg-[#FAF5EE]/60 border border-[#EAD8C8] rounded-xl text-xs text-[#1F1916] focus:outline-none focus:border-[#8C6D3B]"
          >
            <option value="All">All Templates</option>
            {templates.map((t) => (
              <option key={t.id} value={t.id}>
                {t.title}
              </option>
            ))}
          </select>

          {/* Status Filter */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-3 py-2 bg-[#FAF5EE]/60 border border-[#EAD8C8] rounded-xl text-xs text-[#1F1916] focus:outline-none focus:border-[#8C6D3B]"
          >
            <option value="All">All Statuses</option>
            <option value="DRAFT">Draft</option>
            <option value="READY_TO_PUBLISH">Ready To Publish</option>
            <option value="PAYMENT_PENDING">Payment Pending</option>
            <option value="PUBLISHED">Published</option>
          </select>

          <div className="text-xs font-mono text-[#8C6D3B] px-3 py-2 rounded-xl bg-[#FAF5EE] border border-[#EAD8C8]">
            Count: <span className="font-bold text-[#1F1916]">{meta.total}</span>
          </div>
        </div>
      </div>

      {/* Drafts Table */}
      <div className="bg-white rounded-2xl border border-[#EAD8C8] shadow-sm overflow-hidden">
        {loading ? (
          <div className="py-24 flex flex-col items-center justify-center gap-2 text-[#705E55]">
            <Loader2 className="w-6 h-6 animate-spin text-[#8C6D3B]" />
            <span className="text-xs font-mono">Loading customer drafts...</span>
          </div>
        ) : drafts.length === 0 ? (
          <div className="py-20 text-center text-[#705E55]">
            <FileText className="w-10 h-10 text-[#8C6D3B]/40 mx-auto mb-2" />
            <h3 className="font-serif font-bold text-base text-[#1F1916]">No Drafts Found</h3>
            <p className="text-xs mt-1">Try clearing your filters or search query.</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
              <thead className="bg-[#FAF5EE] text-[#705E55] uppercase text-[10px] font-mono tracking-wider border-b border-[#EAD8C8]">
                <tr>
                  <th className="py-3 px-4">Draft Title &amp; ID</th>
                  <th className="py-3 px-4">Template</th>
                  <th className="py-3 px-4">Owner Identity</th>
                  <th className="py-3 px-4 text-center">Version</th>
                  <th className="py-3 px-4 text-center">Status</th>
                  <th className="py-3 px-4">Last Updated</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EAD8C8]/60">
                {drafts.map((d) => (
                  <tr key={d.id} className="hover:bg-[#FAF5EE]/40 transition-colors">
                    {/* Draft Title */}
                    <td className="py-3.5 px-4">
                      <div>
                        <span className="font-semibold text-sm text-[#1F1916] block">
                          {d.title || 'Untitled Draft'}
                        </span>
                        <span className="text-[10px] font-mono text-[#8C6D3B]">
                          {d.id}
                        </span>
                      </div>
                    </td>

                    {/* Template */}
                    <td className="py-3.5 px-4">
                      <span className="font-medium text-[#1F1916] block">
                        {d.templateTitle}
                      </span>
                      <span className="text-[10px] font-mono text-[#705E55]">
                        {d.templateId}
                      </span>
                    </td>

                    {/* Owner */}
                    <td className="py-3.5 px-4 font-mono text-[11px] text-[#705E55]">
                      {d.userId ? `User: ${d.userId}` : `Guest: ${d.guestToken?.slice(0, 14)}...`}
                    </td>

                    {/* Version */}
                    <td className="py-3.5 px-4 text-center">
                      <span className="px-2 py-0.5 rounded font-mono text-[10px] font-bold bg-[#FAF5EE] text-[#8C6D3B] border border-[#EAD8C8]">
                        v{d.version}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-4 text-center">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase font-semibold ${
                          d.status === 'PUBLISHED'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : d.status === 'READY_TO_PUBLISH'
                            ? 'bg-blue-50 text-blue-700 border border-blue-200'
                            : 'bg-stone-100 text-stone-700 border border-stone-200'
                        }`}
                      >
                        {d.status}
                      </span>
                    </td>

                    {/* Updated At */}
                    <td className="py-3.5 px-4 text-[#705E55] font-mono text-[11px]">
                      {new Date(d.updatedAt).toLocaleString()}
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Link
                          href={`/customize/${d.templateId}?draftId=${d.id}`}
                          target="_blank"
                          className="p-1.5 text-[#705E55] hover:text-[#1F1916] hover:bg-[#FAF5EE] rounded-lg transition-colors"
                          title="Open in Customizer"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </Link>
                        <button
                          onClick={() => setInspectDraft(d)}
                          className="p-1.5 text-[#8C6D3B] hover:text-[#1F1916] hover:bg-[#FAF5EE] rounded-lg transition-colors"
                          title="Inspect Payload"
                        >
                          <Code className="w-3.5 h-3.5" />
                        </button>
                        {canManage && (
                          <button
                            onClick={() => setDeleteConfirmDraft(d)}
                            className="p-1.5 text-rose-600 hover:text-rose-800 hover:bg-rose-50 rounded-lg transition-colors"
                            title="Delete Draft"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination Bar */}
          <div className="p-4 border-t border-[#EAD8C8] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#705E55] bg-[#FAF5EE]">
            <span>
              Showing {drafts.length > 0 ? (meta.page - 1) * meta.limit + 1 : 0} to{' '}
              {Math.min(meta.page * meta.limit, meta.total)} of {meta.total} drafts
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

      {/* INSPECT DRAFT MODAL */}
      {inspectDraft && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-[#EAD8C8] shadow-2xl max-w-xl w-full overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="px-6 py-4 bg-[#FAF5EE] border-b border-[#EAD8C8] flex items-center justify-between">
              <div>
                <h3 className="font-serif font-bold text-base text-[#1F1916]">Draft Inspector</h3>
                <p className="text-[11px] text-[#705E55] font-mono">{inspectDraft.id}</p>
              </div>
              <button
                onClick={() => setInspectDraft(null)}
                className="p-1.5 rounded-xl hover:bg-white text-[#705E55] transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 max-h-[70vh] overflow-y-auto space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3 p-3.5 bg-[#FAF5EE]/60 rounded-xl border border-[#EAD8C8]">
                <div>
                  <span className="font-mono text-[10px] uppercase text-[#705E55] block">Template:</span>
                  <span className="font-bold text-[#1F1916]">{inspectDraft.templateTitle}</span>
                </div>
                <div>
                  <span className="font-mono text-[10px] uppercase text-[#705E55] block">Status:</span>
                  <span className="font-bold text-[#641A2A]">{inspectDraft.status}</span>
                </div>
              </div>

              {inspectDraft.customAudioUrl && (
                <div className="p-3 bg-amber-50/70 rounded-xl border border-amber-200 flex items-center gap-2">
                  <Music className="w-4 h-4 text-amber-700" />
                  <div>
                    <span className="font-semibold text-amber-900 block">Custom Soundtrack Attached</span>
                    <span className="font-mono text-[10px] text-amber-700">{inspectDraft.customAudioTitle || inspectDraft.customAudioUrl}</span>
                  </div>
                </div>
              )}

              <div>
                <span className="font-mono text-[10px] uppercase text-[#705E55] block mb-1 font-semibold">
                  Customized Form Fields
                </span>
                <pre className="p-3 bg-stone-900 text-stone-100 rounded-xl font-mono text-[11px] overflow-x-auto">
                  {JSON.stringify(inspectDraft.fields || {}, null, 2)}
                </pre>
              </div>

              <div>
                <span className="font-mono text-[10px] uppercase text-[#705E55] block mb-1 font-semibold">
                  Customized Design Config
                </span>
                <pre className="p-3 bg-stone-900 text-stone-100 rounded-xl font-mono text-[11px] overflow-x-auto">
                  {JSON.stringify(inspectDraft.design || {}, null, 2)}
                </pre>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {deleteConfirmDraft && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-[#EAD8C8] shadow-2xl max-w-sm w-full p-6 text-center animate-in fade-in zoom-in-95 duration-150">
            <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mx-auto mb-3">
              <Trash2 className="w-6 h-6" />
            </div>
            <h3 className="font-serif font-bold text-lg text-[#1F1916] mb-1">Delete Draft?</h3>
            <p className="text-xs text-[#705E55] mb-5 leading-relaxed">
              Are you sure you want to delete draft <span className="font-bold text-[#1F1916]">"{deleteConfirmDraft.title}"</span>? This action is permanent and cannot be undone.
            </p>
            <div className="flex items-center justify-center gap-2">
              <button
                type="button"
                onClick={() => setDeleteConfirmDraft(null)}
                className="px-4 py-2 text-xs font-medium text-[#705E55] hover:bg-[#FAF5EE] rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDelete}
                disabled={submitting}
                className="inline-flex items-center gap-2 px-5 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold rounded-xl shadow-sm transition-all disabled:opacity-50"
              >
                {submitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                <span>Yes, Delete</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
