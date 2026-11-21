'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import {
  Users,
  Search,
  Filter,
  Eye,
  FileText,
  DollarSign,
  Calendar,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Loader2,
  RefreshCw,
  X,
  CreditCard,
  Layers,
  ArrowUpDown,
  ExternalLink,
} from 'lucide-react';
import { useAdmin } from '@/context/AdminContext';
import { apiRequest } from '@/lib/api/client';

interface CustomerListItem {
  id: string;
  identifier: string;
  type: 'USER' | 'GUEST';
  email?: string;
  name?: string;
  phone?: string;
  draftsCount: number;
  publishedCount: number;
  totalSpentINR: number;
  firstSeenAt: string;
  lastActiveAt: string;
}

export default function AdminCustomersPage() {
  const { hasPermission } = useAdmin();
  const [customers, setCustomers] = useState<CustomerListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [meta, setMeta] = useState({ page: 1, limit: 15, total: 0, totalPages: 1 });

  // Filters
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState<'lastActive' | 'totalSpent' | 'draftsCount'>('lastActive');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // Customer Detail Drawer
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(null);
  const [customerDetail, setCustomerDetail] = useState<any | null>(null);
  const [loadingDetail, setLoadingDetail] = useState(false);

  const loadCustomers = useCallback(async () => {
    setLoading(true);
    try {
      const query = new URLSearchParams();
      query.set('page', meta.page.toString());
      query.set('limit', meta.limit.toString());
      if (search) query.set('search', search);
      query.set('sortBy', sortBy);
      query.set('sortOrder', sortOrder);

      const res = await apiRequest<CustomerListItem[]>(`/api/admin/customers?${query.toString()}`);
      setCustomers(res.data);
      if (res.meta) setMeta(res.meta);
    } catch (err) {
      console.error('Failed to load customers:', err);
    } finally {
      setLoading(false);
    }
  }, [meta.page, meta.limit, search, sortBy, sortOrder]);

  useEffect(() => {
    loadCustomers();
  }, [loadCustomers]);

  const viewCustomerProfile = async (id: string) => {
    setSelectedCustomerId(id);
    setLoadingDetail(true);
    try {
      const res = await apiRequest<any>(`/api/admin/customers/${encodeURIComponent(id)}`);
      setCustomerDetail(res.data);
    } catch (err) {
      console.error('Failed to load customer profile:', err);
    } finally {
      setLoadingDetail(false);
    }
  };

  const totalSpentAll = customers.reduce((sum, c) => sum + c.totalSpentINR, 0);
  const totalDraftsAll = customers.reduce((sum, c) => sum + c.draftsCount, 0);

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
            <span className="text-xs text-[#8C6D3B]/70 font-mono">User &amp; Guest Registry</span>
          </div>
          <h1 className="text-2xl lg:text-3xl font-serif font-bold text-[#1F1916] tracking-tight">
            Customer Directory
          </h1>
          <p className="text-xs text-[#705E55] mt-0.5">
            Unified directory of registered customers, bespoke invitation creators, and guest drafts.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/admin/drafts"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-[#705E55] bg-white border border-[#EAD8C8] rounded-xl hover:border-[#8C6D3B] transition-colors"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Drafts Inspector</span>
          </Link>
          <button
            onClick={() => loadCustomers()}
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
            <span className="text-[10px] font-mono uppercase text-[#705E55]">Total Customers</span>
            <div className="text-xl font-serif font-bold text-[#1F1916] mt-0.5">{meta.total}</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-[#FAF5EE] border border-[#EAD8C8] flex items-center justify-center text-[#8C6D3B]">
            <Users className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-[#EAD8C8] shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[10px] font-mono uppercase text-[#705E55]">Active Drafts</span>
            <div className="text-xl font-serif font-bold text-[#1F1916] mt-0.5">{totalDraftsAll}</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-[#FAF5EE] border border-[#EAD8C8] flex items-center justify-center text-[#8C6D3B]">
            <Layers className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-[#EAD8C8] shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[10px] font-mono uppercase text-[#705E55]">Total Revenue</span>
            <div className="text-xl font-serif font-bold text-[#641A2A] mt-0.5">₹{totalSpentAll.toLocaleString('en-IN')}</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-[#FAF5EE] border border-[#EAD8C8] flex items-center justify-center text-[#8C6D3B]">
            <DollarSign className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-3 rounded-2xl border border-[#EAD8C8] shadow-sm flex flex-col md:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#8C6D3B]" />
          <input
            type="text"
            placeholder="Search customers by email, name or guest token..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-[#FAF5EE]/60 border border-[#EAD8C8] rounded-xl text-xs text-[#1F1916] placeholder-[#8C6D3B]/50 focus:outline-none focus:border-[#8C6D3B] focus:bg-white"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <select
            value={sortBy}
            onChange={(e: any) => setSortBy(e.target.value)}
            className="px-3 py-2 bg-[#FAF5EE]/60 border border-[#EAD8C8] rounded-xl text-xs text-[#1F1916] focus:outline-none focus:border-[#8C6D3B]"
          >
            <option value="lastActive">Sort: Recently Active</option>
            <option value="totalSpent">Sort: Highest Spend</option>
            <option value="draftsCount">Sort: Most Drafts</option>
          </select>

          <button
            onClick={() => setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'))}
            className="p-2 border border-[#EAD8C8] rounded-xl bg-white hover:bg-[#FAF5EE] text-[#705E55] transition-colors"
            title="Toggle Sort Order"
          >
            <ArrowUpDown className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Customers Table */}
      <div className="bg-white rounded-2xl border border-[#EAD8C8] shadow-sm overflow-hidden">
        {loading ? (
          <div className="py-24 flex flex-col items-center justify-center gap-2 text-[#705E55]">
            <Loader2 className="w-6 h-6 animate-spin text-[#8C6D3B]" />
            <span className="text-xs font-mono">Loading customer records...</span>
          </div>
        ) : customers.length === 0 ? (
          <div className="py-20 text-center text-[#705E55]">
            <Users className="w-10 h-10 text-[#8C6D3B]/40 mx-auto mb-2" />
            <h3 className="font-serif font-bold text-base text-[#1F1916]">No Customers Found</h3>
            <p className="text-xs mt-1">Try clearing your search query.</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
              <thead className="bg-[#FAF5EE] text-[#705E55] uppercase text-[10px] font-mono tracking-wider border-b border-[#EAD8C8]">
                <tr>
                  <th className="py-3 px-4">Customer Identity</th>
                  <th className="py-3 px-4">Type</th>
                  <th className="py-3 px-4 text-center">Drafts</th>
                  <th className="py-3 px-4 text-center">Published</th>
                  <th className="py-3 px-4 text-right">Total Spent</th>
                  <th className="py-3 px-4">Last Active</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EAD8C8]/60">
                {customers.map((c) => (
                  <tr key={c.id} className="hover:bg-[#FAF5EE]/40 transition-colors">
                    {/* Identity */}
                    <td className="py-3.5 px-4">
                      <div>
                        <span className="font-semibold text-[#1F1916] block">
                          {c.name || c.email || c.identifier}
                        </span>
                        {c.email && (
                          <span className="text-[11px] text-[#705E55] font-mono block">
                            {c.email}
                          </span>
                        )}
                        <span className="text-[10px] text-[#8C6D3B] font-mono">
                          ID: {c.id.slice(0, 16)}...
                        </span>
                      </div>
                    </td>

                    {/* Type Badge */}
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase font-semibold ${
                          c.type === 'USER'
                            ? 'bg-purple-50 text-purple-700 border border-purple-200'
                            : 'bg-stone-100 text-stone-700 border border-stone-200'
                        }`}
                      >
                        {c.type === 'USER' ? 'Registered' : 'Guest'}
                      </span>
                    </td>

                    {/* Drafts */}
                    <td className="py-3.5 px-4 text-center font-mono font-bold text-[#1F1916]">
                      {c.draftsCount}
                    </td>

                    {/* Published */}
                    <td className="py-3.5 px-4 text-center font-mono font-bold text-emerald-700">
                      {c.publishedCount}
                    </td>

                    {/* Total Spent */}
                    <td className="py-3.5 px-4 text-right font-mono font-bold text-[#641A2A]">
                      ₹{c.totalSpentINR.toLocaleString('en-IN')}
                    </td>

                    {/* Last Active */}
                    <td className="py-3.5 px-4 text-[#705E55] font-mono text-[11px]">
                      {new Date(c.lastActiveAt).toLocaleDateString()}
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => viewCustomerProfile(c.id)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-lg bg-white border border-[#EAD8C8] hover:border-[#8C6D3B] text-[#8C6D3B] transition-colors"
                      >
                        <Eye className="w-3 h-3" />
                        <span>Profile</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination Bar */}
          <div className="p-4 border-t border-[#EAD8C8] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#705E55] bg-[#FAF5EE]">
            <span>
              Showing {customers.length > 0 ? (meta.page - 1) * meta.limit + 1 : 0} to{' '}
              {Math.min(meta.page * meta.limit, meta.total)} of {meta.total} customers
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

      {/* CUSTOMER PROFILE DRAWER / MODAL */}
      {selectedCustomerId && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-end">
          <div className="bg-white w-full max-w-xl h-full shadow-2xl border-l border-[#EAD8C8] flex flex-col overflow-hidden animate-in slide-in-from-right duration-200">
            {/* Header */}
            <div className="p-5 bg-[#FAF5EE] border-b border-[#EAD8C8] flex items-center justify-between">
              <div>
                <h3 className="font-serif font-bold text-lg text-[#1F1916]">Customer Profile</h3>
                <p className="text-xs text-[#705E55] font-mono">
                  {customerDetail?.identifier || selectedCustomerId}
                </p>
              </div>
              <button
                onClick={() => {
                  setSelectedCustomerId(null);
                  setCustomerDetail(null);
                }}
                className="p-1.5 rounded-xl hover:bg-white text-[#705E55] transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body */}
            <div className="flex-1 p-6 overflow-y-auto space-y-6">
              {loadingDetail ? (
                <div className="py-20 flex flex-col items-center justify-center gap-2 text-[#705E55]">
                  <Loader2 className="w-6 h-6 animate-spin text-[#8C6D3B]" />
                  <span className="text-xs font-mono">Loading profile history...</span>
                </div>
              ) : !customerDetail ? (
                <p className="text-xs text-[#705E55]">Unable to load customer profile details.</p>
              ) : (
                <>
                  {/* Summary Box */}
                  <div className="grid grid-cols-3 gap-3 p-4 bg-[#FAF5EE]/70 rounded-2xl border border-[#EAD8C8]">
                    <div>
                      <span className="text-[10px] font-mono uppercase text-[#705E55]">Total Spend</span>
                      <div className="text-base font-serif font-bold text-[#641A2A] mt-0.5">
                        ₹{customerDetail.totalSpentINR}
                      </div>
                    </div>
                    <div>
                      <span className="text-[10px] font-mono uppercase text-[#705E55]">Drafts</span>
                      <div className="text-base font-serif font-bold text-[#1F1916] mt-0.5">
                        {customerDetail.drafts?.length || 0}
                      </div>
                    </div>
                    <div>
                      <span className="text-[10px] font-mono uppercase text-[#705E55]">Published</span>
                      <div className="text-base font-serif font-bold text-emerald-700 mt-0.5">
                        {customerDetail.publications?.length || 0}
                      </div>
                    </div>
                  </div>

                  {/* Customer Drafts Section */}
                  <div className="space-y-3">
                    <h4 className="font-serif font-bold text-sm text-[#1F1916] flex items-center justify-between">
                      <span>Saved Drafts ({customerDetail.drafts?.length || 0})</span>
                      <Link
                        href="/admin/drafts"
                        className="text-[11px] font-mono text-[#8C6D3B] hover:underline"
                      >
                        View in Drafts Inspector
                      </Link>
                    </h4>

                    {customerDetail.drafts?.length === 0 ? (
                      <p className="text-xs text-[#705E55] italic">No drafts saved.</p>
                    ) : (
                      <div className="space-y-2">
                        {customerDetail.drafts?.map((d: any) => (
                          <div
                            key={d.id}
                            className="p-3 bg-white rounded-xl border border-[#EAD8C8] flex items-center justify-between gap-3 shadow-xs"
                          >
                            <div>
                              <span className="font-semibold text-xs text-[#1F1916] block">
                                {d.title || 'Untitled Draft'}
                              </span>
                              <span className="text-[10px] font-mono text-[#8C6D3B]">
                                Template: {d.templateId} • Status: {d.status}
                              </span>
                            </div>
                            <Link
                              href={`/customize/${d.templateId}?draftId=${d.id}`}
                              target="_blank"
                              className="p-1.5 hover:bg-[#FAF5EE] text-[#705E55] rounded-lg transition-colors"
                              title="Open in editor"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                            </Link>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Customer Orders Section */}
                  <div className="space-y-3">
                    <h4 className="font-serif font-bold text-sm text-[#1F1916]">
                      Order &amp; Payment History ({customerDetail.orders?.length || 0})
                    </h4>

                    {customerDetail.orders?.length === 0 ? (
                      <p className="text-xs text-[#705E55] italic">No completed orders yet.</p>
                    ) : (
                      <div className="space-y-2">
                        {customerDetail.orders?.map((o: any) => (
                          <div
                            key={o.id}
                            className="p-3 bg-white rounded-xl border border-[#EAD8C8] flex items-center justify-between gap-3 shadow-xs"
                          >
                            <div>
                              <span className="font-mono text-xs font-semibold text-[#1F1916] block">
                                Order #{o.orderId}
                              </span>
                              <span className="text-[10px] font-mono text-[#705E55]">
                                {new Date(o.createdAt).toLocaleString()}
                              </span>
                            </div>
                            <div className="text-right">
                              <span className="font-mono font-bold text-xs text-[#641A2A] block">
                                ₹{Math.round((o.amount || 0) / 100)}
                              </span>
                              <span className="text-[10px] font-mono font-semibold text-emerald-700">
                                {o.status}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
