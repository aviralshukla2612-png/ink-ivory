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
  Loader2,
  RefreshCw,
  X,
  CreditCard,
  Layers,
  ArrowUpDown,
  ExternalLink,
  Phone,
  Copy,
  Check,
  UserCheck,
  UserX,
  Zap,
  ShoppingCart,
  IndianRupee,
  ShieldCheck,
  Camera,
  User,
  Plus,
  Edit2,
  MoreVertical,
  CheckCircle,
  Clock,
  Smartphone,
  Globe,
  Maximize2,
  Send,
  MessageSquare,
} from 'lucide-react';
import { useAdmin } from '@/context/AdminContext';
import { apiRequest } from '@/lib/api/client';
import AdminPagination from '@/components/admin/AdminPagination';

interface CustomerListItem {
  id: string;
  identifier: string;
  type: 'REGISTERED' | 'GUEST';
  email?: string;
  phone?: string;
  phoneVerified: boolean;
  profileImageUrl?: string;
  profileImageUpdatedAt?: string;
  platform: 'WEBSITE' | 'ANDROID APP' | 'BOTH';
  isActive: boolean;
  registeredAt?: string;
  draftsCount: number;
  paidOrdersCount: number;
  totalSpentINR: number;
  firstSeenAt: string;
  lastActiveAt: string;
}

interface CustomerStats {
  totalCustomers: number;
  registeredCount: number;
  guestCount: number;
  totalOrdersCount: number;
  totalRevenueINR: number;
}

export default function AdminCustomersPage() {
  const { hasPermission } = useAdmin();
  const [customers, setCustomers] = useState<CustomerListItem[]>([]);
  const [stats, setStats] = useState<CustomerStats>({
    totalCustomers: 142,
    registeredCount: 118,
    guestCount: 24,
    totalOrdersCount: 57,
    totalRevenueINR: 42760,
  });
  const [loading, setLoading] = useState(true);
  const [meta, setMeta] = useState({ page: 1, limit: 10, total: 142, totalPages: 15 });

  // Filters
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<'ALL' | 'REGISTERED' | 'GUEST'>('ALL');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'ACTIVE' | 'INACTIVE'>('ALL');
  const [platformFilter, setPlatformFilter] = useState<'ALL' | 'WEBSITE' | 'ANDROID APP' | 'BOTH'>('ALL');
  const [sortBy, setSortBy] = useState<
    'registeredAt' | 'lastActive' | 'totalSpent' | 'paidOrders' | 'draftsCount'
  >('lastActive');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // Customer Detail Drawer
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(null);
  const [customerDetail, setCustomerDetail] = useState<any | null>(null);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [drawerTab, setDrawerTab] = useState<'personal' | 'invitations' | 'financial' | 'activity' | 'notes'>('personal');

  // New Note state in drawer
  const [newNoteText, setNewNoteText] = useState('');
  const [savingNote, setSavingNote] = useState(false);

  // Enlarged Profile Image Preview Modal
  const [previewImageModal, setPreviewImageModal] = useState<{
    imageUrl: string;
    phone: string;
    id: string;
  } | null>(null);

  // Add Customer Modal
  const [showAddCustomerModal, setShowAddCustomerModal] = useState(false);
  const [addCustomerForm, setAddCustomerForm] = useState({
    phone: '',
    email: '',
    platform: 'WEBSITE' as 'WEBSITE' | 'ANDROID APP' | 'BOTH',
    phoneVerified: true,
  });
  const [submittingCustomer, setSubmittingCustomer] = useState(false);

  // Edit Customer Modal
  const [editingCustomer, setEditingCustomer] = useState<CustomerListItem | null>(null);
  const [editCustomerForm, setEditCustomerForm] = useState({
    phone: '',
    email: '',
    platform: 'WEBSITE' as 'WEBSITE' | 'ANDROID APP' | 'BOTH',
    isActive: true,
    phoneVerified: true,
  });
  const [savingEdit, setSavingEdit] = useState(false);

  // Copy feedback state
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const loadCustomers = useCallback(async () => {
    setLoading(true);
    try {
      const query = new URLSearchParams();
      query.set('page', meta.page.toString());
      query.set('limit', meta.limit.toString());
      if (search) query.set('search', search);
      if (typeFilter !== 'ALL') query.set('type', typeFilter);
      if (statusFilter !== 'ALL') query.set('status', statusFilter);
      if (platformFilter !== 'ALL') query.set('platform', platformFilter);
      query.set('sortBy', sortBy);
      query.set('sortOrder', sortOrder);

      const res = await apiRequest<CustomerListItem[]>(`/api/admin/customers?${query.toString()}`);
      if (res.data) setCustomers(res.data);
      if (res.meta) setMeta(res.meta);
      if ((res as any).stats) setStats((res as any).stats);
    } catch (err) {
      console.error('Failed to load customers:', err);
    } finally {
      setLoading(false);
    }
  }, [meta.page, meta.limit, search, typeFilter, statusFilter, platformFilter, sortBy, sortOrder]);

  useEffect(() => {
    loadCustomers();
  }, [loadCustomers]);

  const viewCustomerProfile = async (id: string) => {
    setSelectedCustomerId(id);
    setDrawerTab('personal');
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

  const handleCopyText = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleAddNote = async () => {
    if (!newNoteText.trim() || !selectedCustomerId) return;
    setSavingNote(true);
    try {
      const res = await fetch(`/api/admin/customers/${encodeURIComponent(selectedCustomerId)}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'add_note',
          text: newNoteText.trim(),
          author: 'Admin',
        }),
      });
      const data = await res.json();
      if (data.success) {
        setNewNoteText('');
        // Refresh customer details
        const refreshed = await apiRequest<any>(`/api/admin/customers/${encodeURIComponent(selectedCustomerId)}`);
        setCustomerDetail(refreshed.data);
      }
    } catch (err) {
      console.error('Failed to add note:', err);
    } finally {
      setSavingNote(false);
    }
  };

  const handleCreateCustomer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!addCustomerForm.phone.trim()) {
      alert('Phone number is required.');
      return;
    }
    setSubmittingCustomer(true);
    try {
      const res = await fetch('/api/admin/customers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(addCustomerForm),
      });
      const data = await res.json();
      if (data.success) {
        setShowAddCustomerModal(false);
        setAddCustomerForm({ phone: '', email: '', platform: 'WEBSITE', phoneVerified: true });
        loadCustomers();
      } else {
        alert(data.error?.message || 'Failed to create customer');
      }
    } catch (err) {
      console.error('Failed to create customer:', err);
      alert('Network error while creating customer');
    } finally {
      setSubmittingCustomer(false);
    }
  };

  const handleOpenEdit = (customer: CustomerListItem) => {
    setEditingCustomer(customer);
    setEditCustomerForm({
      phone: customer.phone || '',
      email: customer.email || '',
      platform: customer.platform || 'WEBSITE',
      isActive: customer.isActive,
      phoneVerified: customer.phoneVerified,
    });
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCustomer) return;
    setSavingEdit(true);
    try {
      const res = await fetch(`/api/admin/customers/${encodeURIComponent(editingCustomer.id)}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editCustomerForm),
      });
      const data = await res.json();
      if (data.success) {
        setEditingCustomer(null);
        loadCustomers();
        if (selectedCustomerId === editingCustomer.id) {
          viewCustomerProfile(editingCustomer.id);
        }
      } else {
        alert(data.error?.message || 'Failed to update customer');
      }
    } catch (err) {
      console.error('Failed to update customer:', err);
      alert('Network error while updating customer');
    } finally {
      setSavingEdit(false);
    }
  };

  const formatDateDisplay = (dateStr?: string) => {
    if (!dateStr) return '—';
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      }) + ' ' + d.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner Matching Screenshot */}
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
            Unified directory of registered customers, their contact details, activity and orders.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Link
            href="/admin/drafts"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-[#705E55] bg-white border border-[#EAD8C8] rounded-xl hover:border-[#8C6D3B] shadow-xs transition-colors"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Drafts Inspector</span>
          </Link>
          <button
            onClick={() => setShowAddCustomerModal(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-[#641A2A] hover:bg-[#501421] rounded-xl shadow-xs transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Customer</span>
          </button>
        </div>
      </div>

      {/* 5 Top Stat Highlight Cards Matching Screenshot */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
        {/* Total Customers */}
        <div className="bg-white p-4 rounded-2xl border border-[#EAD8C8] shadow-xs flex items-center justify-between">
          <div>
            <div className="text-2xl font-serif font-bold text-[#1F1916]">
              {stats.totalCustomers}
            </div>
            <span className="text-[11px] text-[#705E55] font-medium block mt-0.5">
              Total Customers
            </span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-[#FAF5EE] border border-[#DFCEAF] flex items-center justify-center text-[#8C6D3B]">
            <Users className="w-5 h-5" />
          </div>
        </div>

        {/* Registered */}
        <div className="bg-white p-4 rounded-2xl border border-[#EAD8C8] shadow-xs flex items-center justify-between">
          <div>
            <div className="text-2xl font-serif font-bold text-[#1F1916]">
              {stats.registeredCount}
            </div>
            <span className="text-[11px] text-[#705E55] font-medium block mt-0.5">
              Registered
            </span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600">
            <CheckCircle className="w-5 h-5" />
          </div>
        </div>

        {/* Guests */}
        <div className="bg-white p-4 rounded-2xl border border-[#EAD8C8] shadow-xs flex items-center justify-between">
          <div>
            <div className="text-2xl font-serif font-bold text-[#1F1916]">
              {stats.guestCount}
            </div>
            <span className="text-[11px] text-[#705E55] font-medium block mt-0.5">
              Guests
            </span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600">
            <Zap className="w-5 h-5" />
          </div>
        </div>

        {/* Total Orders */}
        <div className="bg-white p-4 rounded-2xl border border-[#EAD8C8] shadow-xs flex items-center justify-between">
          <div>
            <div className="text-2xl font-serif font-bold text-[#1F1916]">
              {stats.totalOrdersCount}
            </div>
            <span className="text-[11px] text-[#705E55] font-medium block mt-0.5">
              Total Orders
            </span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-purple-50 border border-purple-200 flex items-center justify-center text-purple-600">
            <ShoppingCart className="w-5 h-5" />
          </div>
        </div>

        {/* Total Revenue */}
        <div className="bg-white p-4 rounded-2xl border border-[#EAD8C8] shadow-xs flex items-center justify-between col-span-2 sm:col-span-1">
          <div>
            <div className="text-2xl font-serif font-bold text-[#641A2A]">
              ₹{stats.totalRevenueINR.toLocaleString('en-IN')}
            </div>
            <span className="text-[11px] text-[#705E55] font-medium block mt-0.5">
              Total Revenue
            </span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-rose-50 border border-rose-200 flex items-center justify-center text-[#641A2A]">
            <IndianRupee className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Filter and Search Bar Matching Screenshot */}
      <div className="bg-white p-3 rounded-2xl border border-[#EAD8C8] shadow-xs flex flex-col lg:flex-row items-center gap-3">
        {/* Server-Side Search (Strictly Phone, Email, ID - NO name) */}
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8C6D3B]" />
          <input
            type="text"
            placeholder="Search by phone, email or customer ID..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setMeta((m) => ({ ...m, page: 1 }));
            }}
            className="w-full pl-9 pr-4 py-2 bg-[#FAF5EE]/50 border border-[#EAD8C8] rounded-xl text-xs text-[#1F1916] placeholder-[#8C6D3B]/60 focus:outline-none focus:border-[#8C6D3B] focus:bg-white"
          />
        </div>

        {/* Dropdowns */}
        <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto">
          {/* Type Filter */}
          <select
            value={typeFilter}
            onChange={(e: any) => {
              setTypeFilter(e.target.value);
              setMeta((m) => ({ ...m, page: 1 }));
            }}
            className="px-3 py-2 bg-[#FAF5EE]/50 border border-[#EAD8C8] rounded-xl text-xs text-[#1F1916] focus:outline-none focus:border-[#8C6D3B] cursor-pointer"
          >
            <option value="ALL">All Types</option>
            <option value="REGISTERED">Registered</option>
            <option value="GUEST">Guest</option>
          </select>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e: any) => {
              setStatusFilter(e.target.value);
              setMeta((m) => ({ ...m, page: 1 }));
            }}
            className="px-3 py-2 bg-[#FAF5EE]/50 border border-[#EAD8C8] rounded-xl text-xs text-[#1F1916] focus:outline-none focus:border-[#8C6D3B] cursor-pointer"
          >
            <option value="ALL">All Status</option>
            <option value="ACTIVE">Active</option>
            <option value="INACTIVE">Inactive</option>
          </select>

          {/* Platform Filter */}
          <select
            value={platformFilter}
            onChange={(e: any) => {
              setPlatformFilter(e.target.value);
              setMeta((m) => ({ ...m, page: 1 }));
            }}
            className="px-3 py-2 bg-[#FAF5EE]/50 border border-[#EAD8C8] rounded-xl text-xs text-[#1F1916] focus:outline-none focus:border-[#8C6D3B] cursor-pointer"
          >
            <option value="ALL">All Platforms</option>
            <option value="WEBSITE">Website</option>
            <option value="ANDROID APP">Android App</option>
            <option value="BOTH">Both</option>
          </select>

          {/* Refresh Button */}
          <button
            onClick={() => loadCustomers()}
            disabled={loading}
            className="p-2 border border-[#EAD8C8] rounded-xl bg-white hover:bg-[#FAF5EE] text-[#705E55] transition-colors cursor-pointer"
            title="Refresh Directory"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Main Customers Table Matching Screenshot Layout */}
      <div className="bg-white rounded-2xl border border-[#EAD8C8] shadow-xs overflow-hidden">
        {loading ? (
          <div className="py-24 flex flex-col items-center justify-center gap-2 text-[#705E55]">
            <Loader2 className="w-6 h-6 animate-spin text-[#8C6D3B]" />
            <span className="text-xs font-mono">Loading customer records...</span>
          </div>
        ) : customers.length === 0 ? (
          <div className="py-20 text-center text-[#705E55]">
            <Users className="w-10 h-10 text-[#8C6D3B]/40 mx-auto mb-2" />
            <h3 className="font-serif font-bold text-base text-[#1F1916]">No Customers Found</h3>
            <p className="text-xs mt-1">Try clearing or adjusting your search filters.</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#FAF5EE] text-[#705E55] text-[11px] font-semibold border-b border-[#EAD8C8]">
                  <tr>
                    <th className="py-3.5 px-4 w-14 text-center">Sr. No.</th>
                    <th className="py-3.5 px-3 w-16 text-center">Photo</th>
                    <th className="py-3.5 px-4 font-semibold">Phone Number</th>
                    <th className="py-3.5 px-4">Type</th>
                    <th className="py-3.5 px-4">Registered On</th>
                    <th className="py-3.5 px-4 text-center">Orders (Paid / Draft)</th>
                    <th className="py-3.5 px-4 text-right">Total Spent</th>
                    <th className="py-3.5 px-4">Last Active</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#EAD8C8]/60">
                  {customers.map((c, idx) => {
                    const serialNumber = (meta.page - 1) * meta.limit + idx + 1;
                    const displayPhone = c.phone || (c.identifier.startsWith('+') ? c.identifier : null);

                    return (
                      <tr key={c.id} className="hover:bg-[#FAF5EE]/40 transition-colors group">
                        {/* 1. Sr. No. Continuous across pages */}
                        <td className="py-3.5 px-4 text-center font-mono font-medium text-[#705E55]">
                          {serialNumber}
                        </td>

                        {/* 2. Customer Profile Image Thumbnail (Enlargeable) */}
                        <td className="py-3.5 px-3 text-center">
                          <button
                            type="button"
                            onClick={() => {
                              if (c.profileImageUrl) {
                                setPreviewImageModal({
                                  imageUrl: c.profileImageUrl,
                                  phone: displayPhone || c.identifier,
                                  id: c.id,
                                });
                              }
                            }}
                            className={`w-9 h-9 rounded-full overflow-hidden border border-[#DFCEAF] mx-auto flex items-center justify-center transition-transform hover:scale-110 shadow-xs ${
                              c.profileImageUrl ? 'cursor-pointer hover:border-[#8C6D3B]' : 'cursor-default'
                            }`}
                            title={c.profileImageUrl ? 'Click to enlarge' : 'No photo uploaded'}
                          >
                            {c.profileImageUrl ? (
                              <img
                                src={c.profileImageUrl}
                                alt="Customer"
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full bg-[#FAF5EE] flex items-center justify-center text-[#8C6D3B]/70">
                                <User className="w-4 h-4" />
                              </div>
                            )}
                          </button>
                        </td>

                        {/* 3. Phone Number (Primary Identifier) */}
                        <td className="py-3.5 px-4 font-mono">
                          <div className="flex items-center gap-2">
                            {displayPhone ? (
                              <>
                                <a
                                  href={`https://wa.me/${displayPhone.replace(/[^0-9]/g, '')}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="w-5 h-5 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center shrink-0 hover:bg-emerald-100 transition-colors"
                                  title="Open in WhatsApp"
                                >
                                  <Phone className="w-2.5 h-2.5" />
                                </a>
                                <span className="font-semibold text-[#1F1916]">
                                  {displayPhone}
                                </span>
                                {c.phoneVerified && (
                                  <span title="Verified Phone" className="text-emerald-600">
                                    <CheckCircle className="w-3.5 h-3.5" />
                                  </span>
                                )}
                              </>
                            ) : (
                              <span className="text-[#705E55] italic">
                                {c.identifier}
                              </span>
                            )}

                            <button
                              type="button"
                              onClick={() => handleCopyText(displayPhone || c.identifier, c.id)}
                              className="text-[#8C6D3B]/60 hover:text-[#8C6D3B] p-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                              title="Copy identifier"
                            >
                              {copiedId === c.id ? (
                                <Check className="w-3 h-3 text-emerald-600" />
                              ) : (
                                <Copy className="w-3 h-3" />
                              )}
                            </button>
                          </div>
                          {c.email && (
                            <span className="text-[10px] text-[#705E55] block mt-0.5 font-sans">
                              {c.email}
                            </span>
                          )}
                        </td>

                        {/* 4. Type Badge */}
                        <td className="py-3.5 px-4">
                          <span
                            className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase font-bold tracking-wider ${
                              c.type === 'REGISTERED'
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                : 'bg-stone-100 text-stone-600 border border-stone-200'
                            }`}
                          >
                            {c.type}
                          </span>
                        </td>

                        {/* 5. Registered On */}
                        <td className="py-3.5 px-4 font-mono text-[11px] text-[#705E55]">
                          {formatDateDisplay(c.registeredAt)}
                        </td>

                        {/* 6. Orders (Paid / Draft) */}
                        <td className="py-3.5 px-4 text-center font-mono font-bold text-xs">
                          <span className="text-emerald-700">{c.paidOrdersCount}</span>
                          <span className="text-stone-400 mx-1">/</span>
                          <span className="text-amber-700">{c.draftsCount}</span>
                        </td>

                        {/* 7. Total Spent */}
                        <td className="py-3.5 px-4 text-right font-serif font-bold text-[#1F1916] text-sm">
                          ₹{c.totalSpentINR.toLocaleString('en-IN')}
                        </td>

                        {/* 8. Last Active */}
                        <td className="py-3.5 px-4 font-mono text-[11px] text-[#705E55]">
                          {formatDateDisplay(c.lastActiveAt)}
                        </td>

                        {/* 9. Actions */}
                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-1">
                            {/* View Profile Eye */}
                            <button
                              onClick={() => viewCustomerProfile(c.id)}
                              className="p-1.5 rounded-lg border border-[#EAD8C8] bg-white hover:bg-[#FAF5EE] text-[#8C6D3B] hover:border-[#8C6D3B] transition-colors cursor-pointer"
                              title="View Customer Profile"
                            >
                              <Eye className="w-3.5 h-3.5" />
                            </button>

                            {/* Edit Customer */}
                            <button
                              onClick={() => handleOpenEdit(c)}
                              className="p-1.5 rounded-lg border border-[#EAD8C8] bg-white hover:bg-[#FAF5EE] text-[#705E55] hover:border-[#8C6D3B] transition-colors cursor-pointer"
                              title="Edit Customer"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Pagination Component matching Screenshot */}
            <AdminPagination
              currentPage={meta.page}
              totalItems={meta.total}
              pageSize={meta.limit}
              pageSizeOptions={[10, 25, 50, 100]}
              itemName="customers"
              onPageChange={(page) => setMeta((m) => ({ ...m, page }))}
              onPageSizeChange={(limit) => setMeta((m) => ({ ...m, limit, page: 1 }))}
            />
          </>
        )}
      </div>

      {/* 1. ENLARGED PROFILE IMAGE PREVIEW MODAL */}
      {previewImageModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 border border-[#DFCEAF] shadow-2xl relative text-center">
            <button
              onClick={() => setPreviewImageModal(null)}
              className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-[#FAF5EE] text-[#705E55] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <span className="text-[10px] font-mono tracking-widest uppercase text-[#8C6D3B] block mb-3">
              Customer Profile Photograph
            </span>

            <div className="w-48 h-48 rounded-full overflow-hidden border-4 border-[#DFCEAF] mx-auto shadow-luxury mb-4">
              <img
                src={previewImageModal.imageUrl}
                alt="Enlarged Profile"
                className="w-full h-full object-cover"
              />
            </div>

            <div className="font-mono text-sm font-bold text-[#1F1916]">
              {previewImageModal.phone}
            </div>
            <div className="text-[11px] font-mono text-[#8C6D3B] mt-0.5">
              Customer ID: {previewImageModal.id}
            </div>

            <div className="mt-5 pt-4 border-t border-[#EAD8C8]">
              <button
                type="button"
                onClick={() => setPreviewImageModal(null)}
                className="w-full py-2 bg-[#8C6D3B] hover:bg-[#785B2F] text-white rounded-xl text-xs font-semibold shadow-xs cursor-pointer transition-colors"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. CUSTOMER PROFILE SLIDE-OVER DRAWER */}
      {selectedCustomerId && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-end">
          <div className="bg-white w-full max-w-2xl h-full shadow-2xl border-l border-[#EAD8C8] flex flex-col overflow-hidden animate-in slide-in-from-right duration-200">
            {/* Header: NO customer name shown! */}
            <div className="p-6 bg-[#FAF5EE] border-b border-[#EAD8C8]">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-4">
                  {/* Circular Avatar */}
                  <div
                    onClick={() => {
                      if (customerDetail?.profileImageUrl) {
                        setPreviewImageModal({
                          imageUrl: customerDetail.profileImageUrl,
                          phone: customerDetail.phone || customerDetail.identifier,
                          id: customerDetail.id,
                        });
                      }
                    }}
                    className={`relative w-16 h-16 rounded-full overflow-hidden border-2 border-[#DFCEAF] flex items-center justify-center shrink-0 shadow-sm ${
                      customerDetail?.profileImageUrl ? 'cursor-pointer hover:border-[#8C6D3B]' : ''
                    }`}
                    title={customerDetail?.profileImageUrl ? 'Click to enlarge' : 'No photo'}
                  >
                    {customerDetail?.profileImageUrl ? (
                      <img
                        src={customerDetail.profileImageUrl}
                        alt="Customer Profile"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="flex flex-col items-center justify-center text-[#8C6D3B]/70 bg-white w-full h-full">
                        <User className="w-7 h-7" />
                      </div>
                    )}
                  </div>

                  <div>
                    {/* Primary Identifier: Phone Number */}
                    <div className="flex items-center gap-2">
                      <h3 className="font-mono font-bold text-lg text-[#1F1916]">
                        {customerDetail?.phone || customerDetail?.identifier || selectedCustomerId}
                      </h3>
                      {customerDetail?.phoneVerified && (
                        <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          <CheckCircle className="w-3 h-3" />
                          Verified
                        </span>
                      )}
                    </div>

                    {customerDetail?.email && (
                      <p className="text-xs text-[#705E55] mt-0.5">
                        {customerDetail.email}
                      </p>
                    )}

                    <div className="flex items-center gap-2 mt-2">
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase font-bold tracking-wider bg-white border border-[#EAD8C8] text-[#8C6D3B]">
                        {customerDetail?.type || 'CUSTOMER'}
                      </span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase font-bold tracking-wider bg-white border border-[#EAD8C8] text-[#705E55]">
                        {customerDetail?.platform || 'WEBSITE'}
                      </span>
                      <span className="text-[10px] font-mono text-[#705E55]">
                        ID: {customerDetail?.id || selectedCustomerId}
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setSelectedCustomerId(null);
                    setCustomerDetail(null);
                  }}
                  className="p-2 rounded-xl hover:bg-white text-[#705E55] transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Drawer Tabs Navigation */}
              <div className="flex items-center gap-1 mt-6 border-b border-[#EAD8C8]/80 pb-0">
                {[
                  { id: 'personal', label: 'Personal Info' },
                  { id: 'invitations', label: `Invitations (${customerDetail?.drafts?.length || 0})` },
                  { id: 'financial', label: `Financial (${customerDetail?.orders?.length || 0})` },
                  { id: 'activity', label: 'Activity Log' },
                  { id: 'notes', label: `Admin Notes (${customerDetail?.notes?.length || 0})` },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setDrawerTab(tab.id as any)}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-t-lg transition-colors cursor-pointer border-b-2 -mb-[2px] ${
                      drawerTab === tab.id
                        ? 'border-[#8C6D3B] text-[#8C6D3B] bg-white'
                        : 'border-transparent text-[#705E55] hover:text-[#1F1916]'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Drawer Body Content */}
            <div className="flex-1 p-6 overflow-y-auto space-y-6">
              {loadingDetail ? (
                <div className="py-20 flex flex-col items-center justify-center gap-2 text-[#705E55]">
                  <Loader2 className="w-6 h-6 animate-spin text-[#8C6D3B]" />
                  <span className="text-xs font-mono">Loading complete customer record...</span>
                </div>
              ) : !customerDetail ? (
                <p className="text-xs text-[#705E55]">Unable to load customer profile details.</p>
              ) : (
                <>
                  {/* TAB 1: PERSONAL INFO */}
                  {drawerTab === 'personal' && (
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-3 p-4 bg-[#FAF5EE]/70 rounded-2xl border border-[#EAD8C8]">
                        <div>
                          <span className="text-[10px] font-mono uppercase text-[#705E55]">Primary Phone</span>
                          <div className="text-sm font-mono font-bold text-[#1F1916] mt-0.5">
                            {customerDetail.phone || '—'}
                          </div>
                        </div>
                        <div>
                          <span className="text-[10px] font-mono uppercase text-[#705E55]">Phone Verified</span>
                          <div className="text-xs font-semibold text-emerald-700 mt-0.5">
                            {customerDetail.phoneVerified ? 'Verified' : 'Unverified'}
                          </div>
                        </div>
                        <div>
                          <span className="text-[10px] font-mono uppercase text-[#705E55]">Email Address</span>
                          <div className="text-xs text-[#1F1916] mt-0.5 font-medium truncate">
                            {customerDetail.email || '—'}
                          </div>
                        </div>
                        <div>
                          <span className="text-[10px] font-mono uppercase text-[#705E55]">Registration Platform</span>
                          <div className="text-xs font-semibold text-[#8C6D3B] mt-0.5">
                            {customerDetail.platform || 'WEBSITE'}
                          </div>
                        </div>
                        <div>
                          <span className="text-[10px] font-mono uppercase text-[#705E55]">Account Registered</span>
                          <div className="text-xs font-mono text-[#705E55] mt-0.5">
                            {formatDateDisplay(customerDetail.registeredAt)}
                          </div>
                        </div>
                        <div>
                          <span className="text-[10px] font-mono uppercase text-[#705E55]">Last Activity</span>
                          <div className="text-xs font-mono text-[#705E55] mt-0.5">
                            {formatDateDisplay(customerDetail.lastActiveAt)}
                          </div>
                        </div>
                      </div>

                      {/* Quick Summary Cards */}
                      <div className="grid grid-cols-3 gap-3">
                        <div className="p-3 bg-white rounded-xl border border-[#EAD8C8] text-center">
                          <span className="text-[10px] font-mono uppercase text-[#705E55]">Total Spend</span>
                          <div className="text-lg font-serif font-bold text-[#641A2A] mt-1">
                            ₹{customerDetail.totalSpentINR.toLocaleString('en-IN')}
                          </div>
                        </div>
                        <div className="p-3 bg-white rounded-xl border border-[#EAD8C8] text-center">
                          <span className="text-[10px] font-mono uppercase text-[#705E55]">Paid Orders</span>
                          <div className="text-lg font-serif font-bold text-emerald-700 mt-1">
                            {customerDetail.paidOrdersCount}
                          </div>
                        </div>
                        <div className="p-3 bg-white rounded-xl border border-[#EAD8C8] text-center">
                          <span className="text-[10px] font-mono uppercase text-[#705E55]">Saved Drafts</span>
                          <div className="text-lg font-serif font-bold text-[#1F1916] mt-1">
                            {customerDetail.draftsCount}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* TAB 2: INVITATIONS */}
                  {drawerTab === 'invitations' && (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <h4 className="font-serif font-bold text-sm text-[#1F1916]">
                          Saved Drafts &amp; Invitations ({customerDetail.drafts?.length || 0})
                        </h4>
                        <Link
                          href="/admin/drafts"
                          className="text-[11px] font-mono text-[#8C6D3B] hover:underline"
                        >
                          Open Drafts Inspector →
                        </Link>
                      </div>

                      {customerDetail.drafts?.length === 0 ? (
                        <div className="p-8 text-center bg-[#FAF5EE]/40 rounded-xl border border-[#EAD8C8] text-xs text-[#705E55]">
                          No invitation drafts created yet.
                        </div>
                      ) : (
                        <div className="space-y-2.5">
                          {customerDetail.drafts?.map((d: any) => (
                            <div
                              key={d.id}
                              className="p-3.5 bg-white rounded-xl border border-[#EAD8C8] flex items-center justify-between gap-3 shadow-xs"
                            >
                              <div>
                                <span className="font-semibold text-xs text-[#1F1916] block">
                                  {d.title || 'Untitled Celebration'}
                                </span>
                                <span className="text-[10px] font-mono text-[#8C6D3B] block mt-0.5">
                                  Template: {d.templateId} • Status: {d.status}
                                </span>
                                <span className="text-[10px] font-mono text-[#705E55]">
                                  Updated: {formatDateDisplay(d.updatedAt)}
                                </span>
                              </div>
                              <Link
                                href={`/customize/${d.templateId}?draftId=${d.id}`}
                                target="_blank"
                                className="px-3 py-1.5 bg-[#FAF5EE] hover:bg-[#8C6D3B] hover:text-white text-[#8C6D3B] rounded-lg text-xs font-semibold transition-colors flex items-center gap-1"
                              >
                                <span>Preview</span>
                                <ExternalLink className="w-3 h-3" />
                              </Link>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* TAB 3: FINANCIAL INFO */}
                  {drawerTab === 'financial' && (
                    <div className="space-y-3">
                      <h4 className="font-serif font-bold text-sm text-[#1F1916]">
                        Orders &amp; Payment History ({customerDetail.orders?.length || 0})
                      </h4>

                      {customerDetail.orders?.length === 0 ? (
                        <div className="p-8 text-center bg-[#FAF5EE]/40 rounded-xl border border-[#EAD8C8] text-xs text-[#705E55]">
                          No orders or transactions recorded.
                        </div>
                      ) : (
                        <div className="space-y-2.5">
                          {customerDetail.orders?.map((o: any) => (
                            <div
                              key={o.id}
                              className="p-3.5 bg-white rounded-xl border border-[#EAD8C8] flex items-center justify-between gap-3 shadow-xs"
                            >
                              <div>
                                <span className="font-mono text-xs font-bold text-[#1F1916] block">
                                  Order #{o.id.toUpperCase()}
                                </span>
                                <span className="text-[10px] font-mono text-[#705E55]">
                                  {formatDateDisplay(o.createdAt)}
                                </span>
                              </div>
                              <div className="text-right">
                                <span className="font-serif font-bold text-sm text-[#641A2A] block">
                                  ₹{Math.round((o.amount || 0) / 100).toLocaleString('en-IN')}
                                </span>
                                <span
                                  className={`inline-block px-2 py-0.5 rounded text-[9px] font-mono uppercase font-bold ${
                                    o.status === 'PAID'
                                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                      : 'bg-stone-100 text-stone-600'
                                  }`}
                                >
                                  {o.status}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* TAB 4: ACTIVITY LOG */}
                  {drawerTab === 'activity' && (
                    <div className="space-y-3">
                      <h4 className="font-serif font-bold text-sm text-[#1F1916]">
                        Activity Timeline
                      </h4>

                      {customerDetail.activities?.length === 0 ? (
                        <p className="text-xs text-[#705E55] italic">No activity logged.</p>
                      ) : (
                        <div className="space-y-2.5 relative pl-4 border-l-2 border-[#DFCEAF]">
                          {customerDetail.activities?.map((act: any) => (
                            <div key={act.id} className="relative group">
                              <div className="absolute -left-[21px] top-1.5 w-2.5 h-2.5 rounded-full bg-[#8C6D3B] border-2 border-white" />
                              <div className="p-3 bg-white rounded-xl border border-[#EAD8C8] shadow-xs">
                                <div className="flex items-center justify-between">
                                  <span className="font-semibold text-xs text-[#1F1916]">
                                    {act.title}
                                  </span>
                                  <span className="text-[10px] font-mono text-[#705E55]">
                                    {formatDateDisplay(act.timestamp)}
                                  </span>
                                </div>
                                <p className="text-[11px] text-[#705E55] mt-0.5">
                                  {act.description}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* TAB 5: ADMIN NOTES */}
                  {drawerTab === 'notes' && (
                    <div className="space-y-4">
                      <h4 className="font-serif font-bold text-sm text-[#1F1916]">
                        Internal Staff Notes
                      </h4>

                      {/* Add note input */}
                      <div className="space-y-2">
                        <textarea
                          rows={2}
                          value={newNoteText}
                          onChange={(e) => setNewNoteText(e.target.value)}
                          placeholder="Add internal confidential note about this customer..."
                          className="w-full p-2.5 text-xs rounded-xl border border-[#DFCEAF] bg-[#FAF5EE]/30 text-[#1F1916] placeholder-[#8C6D3B]/50 focus:outline-none focus:border-[#8C6D3B] focus:bg-white resize-none"
                        />
                        <button
                          type="button"
                          onClick={handleAddNote}
                          disabled={savingNote || !newNoteText.trim()}
                          className="px-3.5 py-1.5 bg-[#8C6D3B] hover:bg-[#785B2F] text-white rounded-lg text-xs font-semibold shadow-xs disabled:opacity-50 transition-colors cursor-pointer flex items-center gap-1.5 ml-auto"
                        >
                          <Send className="w-3 h-3" />
                          <span>Save Note</span>
                        </button>
                      </div>

                      {/* Notes list */}
                      {customerDetail.notes?.length === 0 ? (
                        <p className="text-xs text-[#705E55] italic text-center py-4">
                          No internal notes recorded.
                        </p>
                      ) : (
                        <div className="space-y-2">
                          {customerDetail.notes?.map((n: any) => (
                            <div
                              key={n.id}
                              className="p-3 bg-[#FAF5EE]/60 rounded-xl border border-[#EAD8C8] text-xs space-y-1"
                            >
                              <p className="text-[#1F1916]">{n.text}</p>
                              <div className="flex items-center justify-between text-[10px] text-[#705E55] font-mono pt-1 border-t border-[#DFCEAF]/50">
                                <span>Author: {n.author || 'Staff'}</span>
                                <span>{formatDateDisplay(n.createdAt)}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 3. ADD CUSTOMER MODAL */}
      {showAddCustomerModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 border border-[#DFCEAF] shadow-2xl relative">
            <button
              onClick={() => setShowAddCustomerModal(false)}
              className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-[#FAF5EE] text-[#705E55] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="font-serif font-bold text-lg text-[#1F1916]">
              Add New Customer
            </h3>
            <p className="text-xs text-[#705E55] mt-1">
              Register customer with primary phone number identifier.
            </p>

            <form onSubmit={handleCreateCustomer} className="mt-4 space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-[#1F1916] mb-1">
                  Primary Phone Number *
                </label>
                <input
                  type="tel"
                  required
                  placeholder="+91 98765 43210"
                  value={addCustomerForm.phone}
                  onChange={(e) => setAddCustomerForm({ ...addCustomerForm, phone: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-[#DFCEAF] font-mono focus:outline-none focus:border-[#8C6D3B]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1F1916] mb-1">
                  Email Address (Optional)
                </label>
                <input
                  type="email"
                  placeholder="client@youaremine.online"
                  value={addCustomerForm.email}
                  onChange={(e) => setAddCustomerForm({ ...addCustomerForm, email: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-[#DFCEAF] focus:outline-none focus:border-[#8C6D3B]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1F1916] mb-1">
                  Registration Platform
                </label>
                <select
                  value={addCustomerForm.platform}
                  onChange={(e: any) => setAddCustomerForm({ ...addCustomerForm, platform: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-[#DFCEAF] focus:outline-none focus:border-[#8C6D3B]"
                >
                  <option value="WEBSITE">Website</option>
                  <option value="ANDROID APP">Android App</option>
                  <option value="BOTH">Both</option>
                </select>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  id="add-phone-verified"
                  type="checkbox"
                  checked={addCustomerForm.phoneVerified}
                  onChange={(e) => setAddCustomerForm({ ...addCustomerForm, phoneVerified: e.target.checked })}
                  className="rounded text-[#8C6D3B] focus:ring-[#8C6D3B]"
                />
                <label htmlFor="add-phone-verified" className="text-xs text-[#1F1916] cursor-pointer">
                  Mark phone number as verified
                </label>
              </div>

              <div className="pt-3 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddCustomerModal(false)}
                  className="px-4 py-2 text-xs rounded-xl border border-[#EAD8C8] text-[#705E55] hover:bg-[#FAF5EE]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingCustomer}
                  className="px-4 py-2 text-xs rounded-xl bg-[#641A2A] hover:bg-[#501421] text-white font-semibold disabled:opacity-50"
                >
                  {submittingCustomer ? 'Saving...' : 'Create Customer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 4. EDIT CUSTOMER MODAL */}
      {editingCustomer && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 border border-[#DFCEAF] shadow-2xl relative">
            <button
              onClick={() => setEditingCustomer(null)}
              className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-[#FAF5EE] text-[#705E55] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="font-serif font-bold text-lg text-[#1F1916]">
              Edit Customer
            </h3>
            <p className="text-xs text-[#705E55] mt-1 font-mono">
              ID: {editingCustomer.id}
            </p>

            <form onSubmit={handleSaveEdit} className="mt-4 space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-[#1F1916] mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={editCustomerForm.phone}
                  onChange={(e) => setEditCustomerForm({ ...editCustomerForm, phone: e.target.value })}
                  placeholder="+91 98765 43210"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-[#DFCEAF] font-mono focus:outline-none focus:border-[#8C6D3B]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1F1916] mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  value={editCustomerForm.email}
                  onChange={(e) => setEditCustomerForm({ ...editCustomerForm, email: e.target.value })}
                  placeholder="client@youaremine.online"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-[#DFCEAF] focus:outline-none focus:border-[#8C6D3B]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1F1916] mb-1">
                  Platform
                </label>
                <select
                  value={editCustomerForm.platform}
                  onChange={(e: any) => setEditCustomerForm({ ...editCustomerForm, platform: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-[#DFCEAF] focus:outline-none focus:border-[#8C6D3B]"
                >
                  <option value="WEBSITE">Website</option>
                  <option value="ANDROID APP">Android App</option>
                  <option value="BOTH">Both</option>
                </select>
              </div>

              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2 text-xs text-[#1F1916] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editCustomerForm.phoneVerified}
                    onChange={(e) => setEditCustomerForm({ ...editCustomerForm, phoneVerified: e.target.checked })}
                    className="rounded text-[#8C6D3B] focus:ring-[#8C6D3B]"
                  />
                  <span>Phone Verified</span>
                </label>

                <label className="flex items-center gap-2 text-xs text-[#1F1916] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editCustomerForm.isActive}
                    onChange={(e) => setEditCustomerForm({ ...editCustomerForm, isActive: e.target.checked })}
                    className="rounded text-[#8C6D3B] focus:ring-[#8C6D3B]"
                  />
                  <span>Account Active</span>
                </label>
              </div>

              <div className="pt-3 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingCustomer(null)}
                  className="px-4 py-2 text-xs rounded-xl border border-[#EAD8C8] text-[#705E55] hover:bg-[#FAF5EE]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingEdit}
                  className="px-4 py-2 text-xs rounded-xl bg-[#8C6D3B] hover:bg-[#785B2F] text-white font-semibold disabled:opacity-50"
                >
                  {savingEdit ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
