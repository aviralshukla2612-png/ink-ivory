'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  Image as LucideImage,
  Search,
  Filter,
  Trash2,
  RefreshCw,
  Loader2,
  Music,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  FileImage,
} from 'lucide-react';
import { useAdmin } from '@/context/AdminContext';
import { apiRequest } from '@/lib/api/client';

interface MediaItem {
  id: string;
  url: string;
  name: string;
  type: 'IMAGE' | 'AUDIO';
  source: 'TEMPLATE' | 'DRAFT' | 'PUBLICATION';
  associatedTitle: string;
  createdAt: string;
}

export default function AdminMediaPage() {
  const { hasPermission } = useAdmin();
  const canManage = hasPermission('MEDIA_MANAGE');

  const [mediaList, setMediaList] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('All');
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const showToast = (type: 'success' | 'error', message: string) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 4000);
  };

  const fetchMedia = useCallback(async () => {
    setLoading(true);
    try {
      const q = new URLSearchParams({
        page: '1',
        limit: '50',
        ...(search ? { search } : {}),
        ...(typeFilter !== 'All' ? { type: typeFilter } : {}),
      });

      const res = await apiRequest<MediaItem[]>(`/api/admin/media?${q.toString()}`);
      if (res.success && res.data) {
        setMediaList(res.data);
      } else {
        showToast('error', res.error?.message || 'Failed to load media items.');
      }
    } catch {
      showToast('error', 'Network error fetching media library.');
    } finally {
      setLoading(false);
    }
  }, [search, typeFilter]);

  useEffect(() => {
    fetchMedia();
  }, [fetchMedia]);

  const handleDeleteMedia = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to remove "${name}" from media tracking?`)) return;

    try {
      const res = await apiRequest(`/api/admin/media/${encodeURIComponent(id)}`, {
        method: 'DELETE',
      });

      if (res.success) {
        showToast('success', `Asset "${name}" removed.`);
        fetchMedia();
      } else {
        showToast('error', res.error?.message || 'Failed to delete asset.');
      }
    } catch {
      showToast('error', 'Network error deleting media.');
    }
  };

  return (
    <div className="space-y-6">
      {toast && (
        <div className={`fixed top-4 right-4 z-50 flex items-center gap-2 px-4 py-3 rounded-lg shadow-xl text-sm border backdrop-blur-md transition-all ${toast.type === 'success' ? 'bg-emerald-950/90 border-emerald-800 text-emerald-200' : 'bg-rose-950/90 border-rose-800 text-rose-200'}`}>
          {toast.type === 'success' ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <AlertCircle className="w-4 h-4 text-rose-400" />}
          {toast.message}
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-800">
        <div>
          <h1 className="text-2xl font-serif text-amber-100 flex items-center gap-3">
            <LucideImage className="w-6 h-6 text-amber-400" />
            Media & Asset Library
          </h1>
          <p className="text-sm text-stone-400 mt-1">
            Browse photographs, bespoke soundtracks, and background audio uploaded across templates and invitations.
          </p>
        </div>
        <button
          onClick={fetchMedia}
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
            placeholder="Search by asset name, URL, or template..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-xs bg-stone-900/80 border border-stone-800 rounded-lg text-stone-200 placeholder:text-stone-500 focus:outline-none focus:border-amber-600 transition-colors"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-stone-500" />
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-3 py-2 text-xs bg-stone-900/80 border border-stone-800 rounded-lg text-stone-200 focus:outline-none focus:border-amber-600 transition-colors"
          >
            <option value="All">All Types</option>
            <option value="IMAGE">Photographs & Images</option>
            <option value="AUDIO">Soundtracks & Audio</option>
          </select>
        </div>
      </div>

      {/* Media Grid */}
      {loading ? (
        <div className="py-20 text-center text-stone-500">
          <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-amber-500" />
          Loading media assets...
        </div>
      ) : mediaList.length === 0 ? (
        <div className="py-20 text-center text-stone-500 bg-stone-900/40 rounded-xl border border-stone-800">
          No media assets found matching filter.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {mediaList.map((m) => (
            <div key={m.id} className="bg-stone-900/60 border border-stone-800/80 rounded-xl overflow-hidden flex flex-col group hover:border-amber-800/50 transition-all">
              {m.type === 'IMAGE' ? (
                <div className="h-44 bg-stone-950 relative overflow-hidden flex items-center justify-center">
                  <img
                    src={m.url}
                    alt={m.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = 'none';
                    }}
                  />
                  <div className="absolute top-2 left-2 px-2 py-0.5 rounded text-[10px] font-medium bg-black/70 text-amber-300 backdrop-blur-sm border border-amber-900/40">
                    IMAGE
                  </div>
                </div>
              ) : (
                <div className="h-44 bg-stone-950/80 p-4 flex flex-col justify-between border-b border-stone-800/60">
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-purple-950/60 text-purple-300 border border-purple-800/40 flex items-center gap-1">
                      <Music className="w-3 h-3" /> AUDIO
                    </span>
                  </div>
                  <div className="text-center py-2">
                    <Music className="w-8 h-8 text-amber-400/80 mx-auto mb-2" />
                    <audio controls className="w-full h-8 mt-2" src={m.url} preload="none" />
                  </div>
                </div>
              )}

              <div className="p-3.5 flex-1 flex flex-col justify-between text-xs space-y-2">
                <div>
                  <h4 className="font-medium text-stone-200 truncate" title={m.name}>{m.name}</h4>
                  <p className="text-[11px] text-stone-400 truncate mt-0.5">{m.associatedTitle}</p>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-stone-800/60">
                  <span className="text-[10px] text-stone-500 font-mono truncate max-w-[120px]">{m.source}</span>
                  <div className="flex items-center gap-1">
                    <a
                      href={m.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1 text-stone-400 hover:text-amber-200 rounded"
                      title="Open Source URL"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                    {canManage && (
                      <button
                        onClick={() => handleDeleteMedia(m.id, m.name)}
                        className="p-1 text-stone-400 hover:text-rose-400 rounded"
                        title="Delete Asset"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
