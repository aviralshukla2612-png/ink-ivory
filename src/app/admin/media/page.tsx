'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import {
  Image as LucideImage,
  Search,
  Filter,
  Trash2,
  RefreshCw,
  Loader2,
  Plus,
  Copy,
  Check,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  X,
  FileImage,
  Sparkles,
} from 'lucide-react';
import { useAdmin } from '@/context/AdminContext';
import { apiRequest } from '@/lib/api/client';
import AdminPagination from '@/components/admin/AdminPagination';

interface MediaItem {
  id: string;
  url: string;
  name: string;
  type: string;
  tag?: string;
  dimensions?: string;
  size?: string;
  createdAt: string;
}

const CATEGORIES = ['All', 'Cover Artworks', 'Stickers', 'Palace Gates', 'Mandap Assets'];

export default function AdminMediaPage() {
  const { hasPermission } = useAdmin();
  const canManage = hasPermission('MEDIA_MANAGE');

  const [mediaList, setMediaList] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(12);
  const [total, setTotal] = useState(24);

  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const showToast = (type: 'success' | 'error', message: string) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 4000);
  };

  const fetchMedia = useCallback(async () => {
    setLoading(true);
    try {
      const q = new URLSearchParams({
        page: page.toString(),
        limit: pageSize.toString(),
        ...(search ? { search } : {}),
      });

      const res = await apiRequest<any[]>(`/api/admin/media?${q.toString()}`);
      if (res && res.data) {
        setMediaList(
          res.data.map((m: any, idx: number) => ({
            id: m.id || `med_${idx}`,
            url: m.url || '/images/templates/udaipur-palace-wedding-card.webp',
            name: m.name || m.title || `asset_artwork_${idx + 1}.webp`,
            type: m.type || 'IMAGE',
            dimensions: '1200 x 800',
            size: '280 KB',
            createdAt: m.createdAt || new Date().toISOString(),
          }))
        );
        if (res.meta) setTotal(res.meta.total);
      }
    } catch (err: any) {
      console.error('Failed to load media:', err);
    } finally {
      setLoading(false);
    }
  }, [page, pageSize, search]);

  useEffect(() => {
    fetchMedia();
  }, [fetchMedia]);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-[#EAD8C8]">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-[11px] font-mono tracking-wider uppercase px-2.5 py-0.5 rounded-full bg-[#FAF5EE] text-[#8C6D3B] border border-[#EAD8C8] font-semibold">
              MEDIA &amp; ASSET ENGINE • Cloud Storage &amp; Optimizations
            </span>
          </div>
          <h1 className="text-2xl lg:text-3xl font-serif font-bold text-[#1F1916] tracking-tight">
            Asset &amp; Media Library
          </h1>
          <p className="text-xs text-[#705E55] mt-1">
            Centralized storage for template artworks, couple portraits, stickers, and decorative assets.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          {canManage && (
            <button
              onClick={() => {}}
              className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-[#641A2A] hover:bg-[#4E1421] rounded-xl transition shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Upload New Media Asset</span>
            </button>
          )}
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {CATEGORIES.map((cat) => {
          const isSelected = selectedCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
                isSelected
                  ? 'bg-[#641A2A] text-white shadow-xs'
                  : 'bg-white text-[#705E55] border border-[#EAD8C8] hover:bg-[#FAF5EE]'
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* Search and Filter Bar */}
      <div className="bg-white p-3.5 rounded-2xl border border-[#EAD8C8] shadow-xs flex flex-col md:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8C6D3B]" />
          <input
            type="text"
            placeholder="Search assets by filename or tag..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-[#FAF5EE]/60 border border-[#EAD8C8] rounded-xl text-xs text-[#1F1916] placeholder-[#8C6D3B]/50 focus:outline-none focus:border-[#8C6D3B] focus:bg-white"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            className="px-3 py-2 bg-[#FAF5EE]/60 border border-[#EAD8C8] rounded-xl text-xs font-medium text-[#1F1916] focus:outline-none focus:border-[#8C6D3B] cursor-pointer"
          >
            <option>Sort by Date: Newest First</option>
            <option>Sort by Date: Oldest First</option>
            <option>Sort by Name: A-Z</option>
          </select>

          <button
            onClick={() => fetchMedia()}
            className="p-2 text-[#705E55] hover:text-[#1F1916] bg-[#FAF5EE] border border-[#EAD8C8] rounded-xl hover:border-[#8C6D3B] transition"
            title="Refresh Table"
            aria-label="Refresh Table"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Media Grid */}
      {loading ? (
        <div className="py-24 flex flex-col items-center justify-center gap-2 text-[#705E55]">
          <RefreshCw className="w-6 h-6 animate-spin text-[#8C6D3B]" />
          <span className="text-xs font-mono">Loading assets...</span>
        </div>
      ) : mediaList.length === 0 ? (
        <div className="py-20 text-center text-[#705E55] bg-white rounded-2xl border border-[#EAD8C8]">
          <LucideImage className="w-10 h-10 text-[#8C6D3B]/40 mx-auto mb-2" />
          <h3 className="font-serif font-bold text-base text-[#1F1916]">No Media Assets Found</h3>
          <p className="text-xs mt-1">Try clearing your search query or upload a new asset.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {mediaList.map((m) => (
            <div
              key={m.id}
              className="bg-white rounded-2xl border border-[#EAD8C8] overflow-hidden shadow-xs hover:shadow-md transition group flex flex-col justify-between"
            >
              {/* Image Preview Box */}
              <div className="relative aspect-4/3 w-full bg-[#FAF5EE] overflow-hidden">
                <Image
                  src={m.url}
                  alt={m.name}
                  fill
                  sizes="(max-width: 768px) 50vw, 25vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-2 left-2">
                  <span className="px-2 py-0.5 rounded-full text-[9px] font-mono uppercase font-bold bg-[#FAF5EE]/90 backdrop-blur-xs text-[#8C6D3B] border border-[#EAD8C8]">
                    {m.type}
                  </span>
                </div>
              </div>

              {/* Card Meta & Actions */}
              <div className="p-3.5 space-y-2">
                <div>
                  <div className="font-semibold text-xs text-[#1F1916] truncate" title={m.name}>
                    {m.name}
                  </div>
                  <div className="text-[10px] text-[#705E55] font-mono mt-0.5">
                    {m.dimensions} • {m.size}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-[#EAD8C8]/60">
                  <button
                    onClick={() => copyToClipboard(m.url, m.id)}
                    className="inline-flex items-center gap-1.5 text-[11px] font-medium text-[#8C6D3B] hover:text-[#1F1916] transition"
                  >
                    {copiedId === m.id ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-600" />
                        <span className="text-emerald-700">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        <span>Copy URL</span>
                      </>
                    )}
                  </button>

                  {canManage && (
                    <button
                      onClick={() => {}}
                      className="p-1 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition"
                      title="Delete asset"
                      aria-label="Delete asset"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Standard Pagination Footer */}
      <AdminPagination
        currentPage={page}
        totalItems={total}
        pageSize={pageSize}
        pageSizeOptions={[12, 24, 48]}
        itemName="assets"
        onPageChange={(p) => setPage(p)}
        onPageSizeChange={(s) => {
          setPageSize(s);
          setPage(1);
        }}
      />
    </div>
  );
}
