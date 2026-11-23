'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
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
  Code,
  CheckCircle2,
  AlertCircle,
  Clock,
  Sparkles,
  Smartphone,
  Globe,
  Copy,
  Check,
  Edit3,
  Calendar,
  Users,
} from 'lucide-react';
import { useAdmin } from '@/context/AdminContext';
import { apiRequest } from '@/lib/api/client';
import { getTemplates, TemplateListItem } from '@/lib/api/templates-api';
import AdminPagination from '@/components/admin/AdminPagination';

interface DraftListItem {
  id: string;
  templateId: string;
  templateTitle: string;
  templateCategory?: string;
  thumbnail?: string;
  title: string;
  guestToken?: string;
  userId?: string;
  customerPhone?: string;
  customerPlatform?: string;
  status: string;
  version: number;
  previewUrl: string;
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
  const [meta, setMeta] = useState({ page: 1, limit: 10, total: 31, totalPages: 4 });
  const [stats, setStats] = useState({
    totalDrafts: 31,
    inProgress: 24,
    published: 5,
    inactive: 2,
  });

  // Filters
  const [search, setSearch] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [selectedPlatform, setSelectedPlatform] = useState('All');
  const [selectedTime, setSelectedTime] = useState('All');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Modals
  const [inspectDraft, setInspectDraft] = useState<DraftListItem | null>(null);
  const [deleteConfirmDraft, setDeleteConfirmDraft] = useState<DraftListItem | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const loadDrafts = useCallback(async () => {
    setLoading(true);
    try {
      const query = new URLSearchParams();
      query.set('page', meta.page.toString());
      query.set('limit', meta.limit.toString());
      if (search) query.set('search', search);
      if (selectedTemplate !== 'All') query.set('templateId', selectedTemplate);
      if (selectedStatus !== 'All') query.set('status', selectedStatus);

      const res = await apiRequest<DraftListItem[]>(
        `/api/admin/drafts?${query.toString()}`
      );
      if (res && res.data) {
        setDrafts(res.data);
        if (res.meta) setMeta(res.meta);
        if (res.stats) setStats(res.stats);
      }
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
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-[#EAD8C8]">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-[11px] font-mono tracking-wider uppercase px-2.5 py-0.5 rounded-full bg-[#FAF5EE] text-[#8C6D3B] border border-[#EAD8C8] font-semibold">
              MILESTONE 5 DELIVERABLE • Drafts &amp; Work in Progress
            </span>
          </div>
          <h1 className="text-2xl lg:text-3xl font-serif font-bold text-[#1F1916] tracking-tight">
            Customer Drafts
          </h1>
          <p className="text-xs text-[#705E55] mt-1">
            View and manage invitation drafts created by your customers.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Link
            href="/admin/customers"
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-[#1F1916] bg-white border border-[#EAD8C8] rounded-xl hover:border-[#8C6D3B] hover:bg-[#FAF5EE] transition shadow-xs"
          >
            <Users className="w-3.5 h-3.5 text-[#8C6D3B]" />
            <span>Customers Directory</span>
          </Link>
          <button
            onClick={() => loadDrafts()}
            disabled={loading}
            className="p-2 text-[#705E55] hover:text-[#1F1916] bg-white border border-[#EAD8C8] rounded-xl hover:bg-[#FAF5EE] transition shadow-xs"
            title="Refresh"
            aria-label="Refresh drafts"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* 4 Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Drafts */}
        <div className="bg-white p-4.5 rounded-2xl border border-[#EAD8C8] shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-[#FAF5EE] border border-[#EAD8C8] flex items-center justify-center text-[#8C6D3B] shrink-0">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-serif font-bold text-[#1F1916] leading-none">
              {stats.totalDrafts}
            </div>
            <div className="text-xs text-[#705E55] font-medium mt-1">Total Drafts</div>
          </div>
        </div>

        {/* In Progress */}
        <div className="bg-white p-4.5 rounded-2xl border border-[#EAD8C8] shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 shrink-0">
            <Edit3 className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-serif font-bold text-[#1F1916] leading-none">
              {stats.inProgress}
            </div>
            <div className="text-xs text-[#705E55] font-medium mt-1">In Progress</div>
          </div>
        </div>

        {/* Published */}
        <div className="bg-white p-4.5 rounded-2xl border border-[#EAD8C8] shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-purple-50 border border-purple-100 flex items-center justify-center text-purple-600 shrink-0">
            <Eye className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-serif font-bold text-[#1F1916] leading-none">
              {stats.published}
            </div>
            <div className="text-xs text-[#705E55] font-medium mt-1">Published</div>
          </div>
        </div>

        {/* Inactive */}
        <div className="bg-white p-4.5 rounded-2xl border border-[#EAD8C8] shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600 shrink-0">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-serif font-bold text-[#1F1916] leading-none">
              {stats.inactive}
            </div>
            <div className="text-xs text-[#705E55] font-medium mt-1">Inactive</div>
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
          <button onClick={() => setFeedback(null)} className="p-0.5" aria-label="Dismiss">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="bg-white p-3.5 rounded-2xl border border-[#EAD8C8] shadow-xs flex flex-col md:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8C6D3B]" />
          <input
            type="text"
            placeholder="Search by draft title, draft ID or template..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-[#FAF5EE]/60 border border-[#EAD8C8] rounded-xl text-xs text-[#1F1916] placeholder-[#8C6D3B]/50 focus:outline-none focus:border-[#8C6D3B] focus:bg-white"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          {/* Template Filter */}
          <select
            value={selectedTemplate}
            aria-label="Filter by Template"
            onChange={(e) => setSelectedTemplate(e.target.value)}
            className="px-3 py-2 bg-[#FAF5EE]/60 border border-[#EAD8C8] rounded-xl text-xs font-medium text-[#1F1916] focus:outline-none focus:border-[#8C6D3B] cursor-pointer"
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
            aria-label="Filter by Status"
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-3 py-2 bg-[#FAF5EE]/60 border border-[#EAD8C8] rounded-xl text-xs font-medium text-[#1F1916] focus:outline-none focus:border-[#8C6D3B] cursor-pointer"
          >
            <option value="All">All Statuses</option>
            <option value="DRAFT">Draft</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="PUBLISHED">Published</option>
          </select>

          {/* Platform Filter */}
          <select
            value={selectedPlatform}
            aria-label="Filter by Platform"
            onChange={(e) => setSelectedPlatform(e.target.value)}
            className="px-3 py-2 bg-[#FAF5EE]/60 border border-[#EAD8C8] rounded-xl text-xs font-medium text-[#1F1916] focus:outline-none focus:border-[#8C6D3B] cursor-pointer"
          >
            <option value="All">All Platforms</option>
            <option value="WEBSITE">Website</option>
            <option value="ANDROID_APP">Android App</option>
          </select>

          {/* Time Filter */}
          <select
            value={selectedTime}
            aria-label="Filter by Time"
            onChange={(e) => setSelectedTime(e.target.value)}
            className="px-3 py-2 bg-[#FAF5EE]/60 border border-[#EAD8C8] rounded-xl text-xs font-medium text-[#1F1916] focus:outline-none focus:border-[#8C6D3B] cursor-pointer"
          >
            <option value="All">All Time</option>
            <option value="TODAY">Today</option>
            <option value="THIS_WEEK">This Week</option>
            <option value="THIS_MONTH">This Month</option>
          </select>

          <button
            onClick={() => loadDrafts()}
            className="p-2 text-[#705E55] hover:text-[#1F1916] bg-[#FAF5EE] border border-[#EAD8C8] rounded-xl hover:border-[#8C6D3B] transition"
            title="Refresh Table"
            aria-label="Refresh Table"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Drafts Table */}
      <div className="bg-white rounded-2xl border border-[#EAD8C8] shadow-xs overflow-hidden">
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
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#FAF5EE] text-[#705E55] uppercase text-[10px] font-mono tracking-wider border-b border-[#EAD8C8]">
                <tr>
                  <th className="py-3 px-4 text-center w-14">Sr. No.</th>
                  <th className="py-3 px-4">Draft</th>
                  <th className="py-3 px-4">Template</th>
                  <th className="py-3 px-4">Customer (Phone)</th>
                  <th className="py-3 px-4 text-center">Version</th>
                  <th className="py-3 px-4 text-center">Status</th>
                  <th className="py-3 px-4">Last Updated</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EAD8C8]/60">
                {drafts.map((d, idx) => {
                  const srNo = (meta.page - 1) * meta.limit + idx + 1;
                  const isPublished = d.status === 'PUBLISHED';
                  const isWedding = (d.templateCategory || '').includes('WEDDING');

                  return (
                    <tr key={d.id} className="hover:bg-[#FAF5EE]/40 transition-colors">
                      {/* Sr. No. */}
                      <td className="py-3.5 px-4 text-center font-mono font-medium text-[#705E55]">
                        {srNo}
                      </td>

                      {/* Draft */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-11 h-11 rounded-xl overflow-hidden border border-[#EAD8C8] bg-[#FAF5EE] relative shrink-0 shadow-xs">
                            <Image
                              src={d.thumbnail || '/images/templates/udaipur-palace-wedding-card.webp'}
                              alt={d.title}
                              fill
                              sizes="44px"
                              className="object-cover"
                            />
                          </div>
                          <div>
                            <span className="font-semibold text-xs text-[#1F1916] block leading-tight">
                              {d.title || 'Bespoke Celebration'}
                            </span>
                            <span className="text-[10px] font-mono text-[#8C6D3B] mt-0.5 block">
                              {d.id}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Template */}
                      <td className="py-3.5 px-4">
                        <div>
                          <span className="font-medium text-xs text-[#1F1916] block leading-tight">
                            {d.templateTitle}
                          </span>
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-mono uppercase font-semibold bg-[#FAF5EE] text-[#8C6D3B] border border-[#EAD8C8] mt-1">
                            {isWedding ? '👑 WEDDING' : '💍 ENGAGEMENT'}
                          </span>
                        </div>
                      </td>

                      {/* Customer (Phone) */}
                      <td className="py-3.5 px-4">
                        <div className="space-y-0.5">
                          <a
                            href={`https://wa.me/${(d.customerPhone || '9876543210').replace(/[^0-9]/g, '')}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 font-medium text-xs text-[#1F1916] hover:text-[#25D366] transition group"
                          >
                            <span className="w-4 h-4 rounded-full bg-[#25D366]/15 flex items-center justify-center text-[#25D366]">
                              <svg className="w-2.5 h-2.5 fill-current" viewBox="0 0 24 24">
                                <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.312.045-.698.056-1.109-.074-.539-.17-1.229-.446-2.126-1.246-.994-.886-1.637-1.956-1.879-2.368-.243-.412-.026-.635.18-.84.185-.185.411-.479.617-.719.206-.24.275-.411.411-.686.137-.275.069-.514-.034-.72-.103-.205-.837-2.02-.974-2.355-.137-.336-.275-.29-.411-.29h-.357c-.123 0-.323.046-.492.23-.17.185-.648.634-.648 1.546s.664 1.792.756 1.916c.092.124 1.306 1.994 3.164 2.795.442.19.787.304 1.056.39.444.141.848.121 1.168.073.356-.053 1.096-.448 1.251-.88.154-.432.154-.803.108-.88-.046-.077-.17-.123-.356-.216z"/>
                              </svg>
                            </span>
                            <span>{d.customerPhone || '+91 98765 43210'}</span>
                          </a>
                          <div className="flex items-center gap-1 text-[10px] text-[#705E55]">
                            {d.customerPlatform === 'Android App' ? (
                              <Smartphone className="w-3 h-3 text-[#8C6D3B]" />
                            ) : (
                              <Globe className="w-3 h-3 text-[#8C6D3B]" />
                            )}
                            <span>{d.customerPlatform || 'Website'}</span>
                          </div>
                        </div>
                      </td>

                      {/* Version */}
                      <td className="py-3.5 px-4 text-center">
                        <span className="font-mono text-[11px] text-[#705E55]">
                          v{d.version || 1}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4 text-center">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-mono uppercase font-semibold ${
                            isPublished
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-stone-100 text-stone-700 border border-stone-200'
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              isPublished ? 'bg-emerald-500' : 'bg-stone-400'
                            }`}
                          />
                          {d.status || 'DRAFT'}
                        </span>
                      </td>

                      {/* Updated At */}
                      <td className="py-3.5 px-4 text-[#705E55] text-xs">
                        <div className="font-medium text-[#1F1916]">
                          {new Date(d.updatedAt).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })}
                        </div>
                        <div className="text-[10px] text-[#705E55]">
                          {new Date(d.updatedAt).toLocaleTimeString('en-US', {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <Link
                            href={d.previewUrl || `/customize/${d.templateId}?draftId=${d.id}`}
                            target="_blank"
                            className="p-1.5 text-[#705E55] hover:text-[#1F1916] hover:bg-[#FAF5EE] rounded-lg transition-colors"
                            title="Open in Customizer"
                            aria-label="Open in Customizer"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </Link>
                          <button
                            onClick={() => setInspectDraft(d)}
                            className="p-1.5 text-[#8C6D3B] hover:text-[#1F1916] hover:bg-[#FAF5EE] rounded-lg transition-colors"
                            title="View Fields Payload"
                            aria-label="View Fields Payload"
                          >
                            <Code className="w-3.5 h-3.5" />
                          </button>
                          {canManage && (
                            <button
                              onClick={() => setDeleteConfirmDraft(d)}
                              className="p-1.5 text-rose-600 hover:text-rose-800 hover:bg-rose-50 rounded-lg transition-colors"
                              title="Delete Draft"
                              aria-label="Delete Draft"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
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
        currentPage={meta.page}
        totalItems={meta.total}
        pageSize={meta.limit}
        pageSizeOptions={[5, 10, 25, 50]}
        itemName="drafts"
        onPageChange={(p) => setMeta((m) => ({ ...m, page: p }))}
        onPageSizeChange={(s) => setMeta((m) => ({ ...m, limit: s, page: 1 }))}
      />

      {/* Inspect Draft Modal */}
      {inspectDraft && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-[#EAD8C8] shadow-2xl max-w-2xl w-full max-h-[85vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="p-4 border-b border-[#EAD8C8] flex items-center justify-between bg-[#FAF5EE]">
              <div>
                <h3 className="font-serif font-bold text-base text-[#1F1916]">
                  Draft Payload: {inspectDraft.title}
                </h3>
                <span className="text-[10px] font-mono text-[#8C6D3B]">{inspectDraft.id}</span>
              </div>
              <button
                onClick={() => setInspectDraft(null)}
                className="p-1.5 text-[#705E55] hover:text-[#1F1916] hover:bg-white rounded-xl transition"
                aria-label="Close modal"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-4 overflow-y-auto font-mono text-xs bg-[#1F1916] text-[#EAD8C8] flex-1">
              <pre className="whitespace-pre-wrap">{JSON.stringify(inspectDraft, null, 2)}</pre>
            </div>
            <div className="p-4 border-t border-[#EAD8C8] bg-white flex justify-end">
              <button
                onClick={() => setInspectDraft(null)}
                className="px-4 py-2 bg-[#FAF5EE] border border-[#EAD8C8] rounded-xl text-xs font-semibold text-[#1F1916] hover:bg-[#EAD8C8]/50 transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmDraft && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-[#EAD8C8] shadow-2xl max-w-md w-full p-6 animate-in fade-in zoom-in-95 duration-150">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-600 mb-4">
              <Trash2 className="w-6 h-6" />
            </div>
            <h3 className="font-serif font-bold text-lg text-[#1F1916]">
              Permanently Delete Draft?
            </h3>
            <p className="text-xs text-[#705E55] mt-2">
              Are you sure you want to delete draft <strong className="text-[#1F1916]">{deleteConfirmDraft.title}</strong> ({deleteConfirmDraft.id})? This action cannot be undone.
            </p>
            <div className="mt-6 flex items-center justify-end gap-3">
              <button
                onClick={() => setDeleteConfirmDraft(null)}
                disabled={submitting}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-[#705E55] hover:bg-[#FAF5EE] transition"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={submitting}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 transition flex items-center gap-2"
              >
                {submitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                <span>Delete Draft</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
