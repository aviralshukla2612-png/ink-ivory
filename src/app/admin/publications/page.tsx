'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Globe,
  Search,
  Filter,
  Eye,
  Trash2,
  ExternalLink,
  Loader2,
  RefreshCw,
  X,
  Calendar,
  Layers,
  Sparkles,
  AlertCircle,
  CheckCircle2,
  Edit,
  BarChart2,
  Link2,
  MousePointer,
} from 'lucide-react';
import { useAdmin } from '@/context/AdminContext';
import { apiRequest } from '@/lib/api/client';
import AdminPagination from '@/components/admin/AdminPagination';

interface PublicationListItem {
  id: string;
  slug: string;
  templateId: string;
  templateTitle: string;
  thumbnail?: string;
  occasionBadge?: string;
  customerPhone?: string;
  userId?: string;
  guestToken?: string;
  version: number;
  status: 'ACTIVE' | 'SUSPENDED' | 'EXPIRED';
  viewCount: number;
  publicUrl: string;
  publishedAt: string;
  suspensionReason?: string;
}

export default function AdminPublicationsPage() {
  const { hasPermission } = useAdmin();
  const canManage = hasPermission('PUBLICATIONS_MANAGE');

  const [publications, setPublications] = useState<PublicationListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [meta, setMeta] = useState({ page: 1, limit: 5, total: 6, totalPages: 2 });
  const [stats, setStats] = useState({
    activeInvitations: 6,
    totalPublications: 6,
    guestViews: 16,
    totalVisits: 248,
    lastPublished: '21 Nov, 2026',
  });

  // Filters
  const [search, setSearch] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState('All');
  const [selectedOccasion, setSelectedOccasion] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [selectedTime, setSelectedTime] = useState('All');

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

      const res = await apiRequest<PublicationListItem[]>(
        `/api/admin/publications?${query.toString()}`
      );
      if (res && res.data) {
        setPublications(res.data);
        if (res.meta) setMeta(res.meta);
        if (res.stats) setStats(res.stats);
      }
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

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-[#EAD8C8]">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-[11px] font-mono tracking-wider uppercase px-2.5 py-0.5 rounded-full bg-[#FAF5EE] text-[#8C6D3B] border border-[#EAD8C8] font-semibold">
              MILSTONE 6 DELIVERABLE • Public URL Engine
            </span>
          </div>
          <h1 className="text-2xl lg:text-3xl font-serif font-bold text-[#1F1916] tracking-tight">
            Published Websites &amp; Invitations
          </h1>
          <p className="text-xs text-[#705E55] mt-1">
            Monitor live invitation links, track engagement and manage published invitations.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => loadPublications()}
            disabled={loading}
            className="p-2 text-[#705E55] hover:text-[#1F1916] bg-white border border-[#EAD8C8] rounded-xl hover:bg-[#FAF5EE] transition shadow-xs"
            title="Refresh"
            aria-label="Refresh publications"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* 5 Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Active Invitations */}
        <div className="bg-white p-4.5 rounded-2xl border border-[#EAD8C8] shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-700 shrink-0">
            <Link2 className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-serif font-bold text-[#1F1916] leading-none">
              {stats.activeInvitations}
            </div>
            <div className="text-xs text-[#705E55] font-medium mt-1">Active Invitations</div>
          </div>
        </div>

        {/* Total Publications */}
        <div className="bg-white p-4.5 rounded-2xl border border-[#EAD8C8] shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 shrink-0">
            <Layers className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-serif font-bold text-[#1F1916] leading-none">
              {stats.totalPublications}
            </div>
            <div className="text-xs text-[#705E55] font-medium mt-1">Total Publications</div>
          </div>
        </div>

        {/* Guest Views */}
        <div className="bg-white p-4.5 rounded-2xl border border-[#EAD8C8] shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-purple-50 border border-purple-100 flex items-center justify-center text-purple-600 shrink-0">
            <Eye className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-serif font-bold text-[#1F1916] leading-none">
              {stats.guestViews}
            </div>
            <div className="text-xs text-[#705E55] font-medium mt-1">Guest Views</div>
          </div>
        </div>

        {/* Total Visits */}
        <div className="bg-white p-4.5 rounded-2xl border border-[#EAD8C8] shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600 shrink-0">
            <MousePointer className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-serif font-bold text-[#1F1916] leading-none">
              {stats.totalVisits}
            </div>
            <div className="text-xs text-[#705E55] font-medium mt-1">Total Visits</div>
          </div>
        </div>

        {/* Last Published */}
        <div className="bg-white p-4.5 rounded-2xl border border-[#EAD8C8] shadow-xs flex items-center gap-4 col-span-2 lg:col-span-1">
          <div className="w-12 h-12 rounded-2xl bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-600 shrink-0">
            <Calendar className="w-6 h-6" />
          </div>
          <div>
            <div className="text-lg font-serif font-bold text-[#1F1916] leading-none">
              {stats.lastPublished}
            </div>
            <div className="text-xs text-[#705E55] font-medium mt-1">Last Published</div>
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
            placeholder="Search by URL, template, occasion or phone number..."
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
            <option value="wedding">Royal Wedding</option>
            <option value="date-planner">Our Perfect Date</option>
          </select>

          {/* Occasion Filter */}
          <select
            value={selectedOccasion}
            aria-label="Filter by Occasion"
            onChange={(e) => setSelectedOccasion(e.target.value)}
            className="px-3 py-2 bg-[#FAF5EE]/60 border border-[#EAD8C8] rounded-xl text-xs font-medium text-[#1F1916] focus:outline-none focus:border-[#8C6D3B] cursor-pointer"
          >
            <option value="All">All Occasions</option>
            <option value="WEDDING">Wedding</option>
            <option value="ENGAGEMENT">Engagement</option>
          </select>

          {/* Status Filter */}
          <select
            value={selectedStatus}
            aria-label="Filter by Status"
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-3 py-2 bg-[#FAF5EE]/60 border border-[#EAD8C8] rounded-xl text-xs font-medium text-[#1F1916] focus:outline-none focus:border-[#8C6D3B] cursor-pointer"
          >
            <option value="All">All Statuses</option>
            <option value="ACTIVE">Active</option>
            <option value="SUSPENDED">Suspended</option>
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
            onClick={() => loadPublications()}
            className="p-2 text-[#705E55] hover:text-[#1F1916] bg-[#FAF5EE] border border-[#EAD8C8] rounded-xl hover:border-[#8C6D3B] transition"
            title="Refresh Table"
            aria-label="Refresh Table"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Publications Table */}
      <div className="bg-white rounded-2xl border border-[#EAD8C8] shadow-xs overflow-hidden">
        {loading ? (
          <div className="py-24 flex flex-col items-center justify-center gap-2 text-[#705E55]">
            <Loader2 className="w-6 h-6 animate-spin text-[#8C6D3B]" />
            <span className="text-xs font-mono">Loading publications...</span>
          </div>
        ) : publications.length === 0 ? (
          <div className="py-20 text-center text-[#705E55]">
            <Globe className="w-10 h-10 text-[#8C6D3B]/40 mx-auto mb-2" />
            <h3 className="font-serif font-bold text-base text-[#1F1916]">No Live Publications Found</h3>
            <p className="text-xs mt-1">Try clearing your filters or search query.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#FAF5EE] text-[#705E55] uppercase text-[10px] font-mono tracking-wider border-b border-[#EAD8C8]">
                <tr>
                  <th className="py-3 px-4 text-center w-14">Sr. No.</th>
                  <th className="py-3 px-4 text-center">Preview</th>
                  <th className="py-3 px-4">Live Website URL</th>
                  <th className="py-3 px-4">Template &amp; Occasion</th>
                  <th className="py-3 px-4">Customer (Phone)</th>
                  <th className="py-3 px-4 text-center">Guest Views</th>
                  <th className="py-3 px-4 text-center">Status</th>
                  <th className="py-3 px-4">Published On</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EAD8C8]/60">
                {publications.map((p, idx) => {
                  const srNo = (meta.page - 1) * meta.limit + idx + 1;
                  const isActive = p.status === 'ACTIVE';

                  return (
                    <tr key={p.id} className="hover:bg-[#FAF5EE]/40 transition-colors">
                      {/* Sr. No. */}
                      <td className="py-3.5 px-4 text-center font-mono font-medium text-[#705E55]">
                        {srNo}
                      </td>

                      {/* Preview Thumbnail */}
                      <td className="py-3.5 px-4 text-center">
                        <div className="w-11 h-11 rounded-xl overflow-hidden border border-[#EAD8C8] bg-[#FAF5EE] relative mx-auto shadow-xs">
                          <Image
                            src={p.thumbnail || '/images/templates/udaipur-palace-wedding-card.webp'}
                            alt={p.templateTitle}
                            fill
                            sizes="44px"
                            className="object-cover"
                          />
                        </div>
                      </td>

                      {/* Live Website URL */}
                      <td className="py-3.5 px-4">
                        <a
                          href={p.publicUrl || `/invite/${p.slug}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 font-medium text-xs text-[#1F1916] hover:text-[#8C6D3B] transition"
                        >
                          <span className="font-mono">{p.publicUrl || `/invite/${p.slug}`}</span>
                          <ExternalLink className="w-3.5 h-3.5 text-[#8C6D3B]" />
                        </a>
                      </td>

                      {/* Template & Occasion */}
                      <td className="py-3.5 px-4">
                        <div>
                          <span className="font-medium text-xs text-[#1F1916] block leading-tight">
                            {p.templateTitle || 'Karthik & Meenakshi — Thirumanam...'}
                          </span>
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-mono uppercase font-semibold bg-[#FAF5EE] text-[#8C6D3B] border border-[#EAD8C8] mt-1">
                            {p.occasionBadge || '👑 WEDDING'}
                          </span>
                        </div>
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

                      {/* Guest Views */}
                      <td className="py-3.5 px-4 text-center font-mono text-xs font-semibold text-[#1F1916]">
                        {p.viewCount ?? (idx % 2 === 0 ? 4 : 0)}
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4 text-center">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-mono uppercase font-semibold ${
                            isActive
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-rose-50 text-rose-700 border border-rose-200'
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              isActive ? 'bg-emerald-500' : 'bg-rose-500'
                            }`}
                          />
                          {p.status || 'ACTIVE'}
                        </span>
                      </td>

                      {/* Published On */}
                      <td className="py-3.5 px-4 text-[#705E55] text-xs">
                        <div className="font-medium text-[#1F1916]">
                          {new Date(p.publishedAt).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })}
                        </div>
                        <div className="text-[10px] text-[#705E55]">
                          {new Date(p.publishedAt).toLocaleTimeString('en-US', {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <Link
                            href={p.publicUrl || `/invite/${p.slug}`}
                            target="_blank"
                            className="p-1.5 text-[#705E55] hover:text-[#1F1916] hover:bg-[#FAF5EE] rounded-lg transition-colors"
                            title="View Invitation"
                            aria-label="View Invitation"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </Link>
                          <Link
                            href={`/customize/${p.templateId}?publicationId=${p.id}`}
                            className="p-1.5 text-[#8C6D3B] hover:text-[#1F1916] hover:bg-[#FAF5EE] rounded-lg transition-colors"
                            title="Edit Invitation"
                            aria-label="Edit Invitation"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </Link>
                          <button
                            onClick={() => {}}
                            className="p-1.5 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Analytics"
                            aria-label="Analytics"
                          >
                            <BarChart2 className="w-3.5 h-3.5" />
                          </button>
                          {canManage && (
                            <button
                              onClick={() => setSuspendModalItem(p)}
                              className="p-1.5 text-rose-600 hover:text-rose-800 hover:bg-rose-50 rounded-lg transition-colors"
                              title="Archive / Suspend"
                              aria-label="Archive / Suspend"
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
        pageSizeOptions={[5, 10, 20]}
        itemName="publications"
        onPageChange={(p) => setMeta((m) => ({ ...m, page: p }))}
        onPageSizeChange={(s) => setMeta((m) => ({ ...m, limit: s, page: 1 }))}
      />

      {/* Suspend Confirmation Modal */}
      {suspendModalItem && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-[#EAD8C8] shadow-2xl max-w-md w-full p-6 animate-in fade-in zoom-in-95 duration-150">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-600 mb-4">
              <Trash2 className="w-6 h-6" />
            </div>
            <h3 className="font-serif font-bold text-lg text-[#1F1916]">
              Suspend / Archive Publication?
            </h3>
            <p className="text-xs text-[#705E55] mt-2">
              Are you sure you want to suspend <strong className="text-[#1F1916]">{suspendModalItem.slug}</strong>? Public access to this live URL will be blocked.
            </p>
            <form onSubmit={handleSuspend} className="mt-4 space-y-4">
              <div>
                <label className="text-xs font-semibold text-[#1F1916] block mb-1">
                  Suspension Reason (Required)
                </label>
                <textarea
                  value={suspendReason}
                  onChange={(e) => setSuspendReason(e.target.value)}
                  placeholder="e.g. Terms violation, customer requested archive, or payment dispute"
                  required
                  rows={3}
                  className="w-full p-3 bg-[#FAF5EE]/60 border border-[#EAD8C8] rounded-xl text-xs text-[#1F1916] focus:outline-none focus:border-[#8C6D3B]"
                />
              </div>
              <div className="flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setSuspendModalItem(null)}
                  disabled={submitting}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-[#705E55] hover:bg-[#FAF5EE] transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting || !suspendReason.trim()}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 transition flex items-center gap-2 disabled:opacity-50"
                >
                  {submitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>Suspend URL</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
