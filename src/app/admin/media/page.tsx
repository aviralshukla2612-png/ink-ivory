'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
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
  Edit3,
  Upload,
  Eye,
  Camera,
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
  templateId?: string;
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
  const [total, setTotal] = useState(8);

  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Change Image Modal State
  const [editingItem, setEditingItem] = useState<MediaItem | null>(null);
  const [newImageUrl, setNewImageUrl] = useState('');
  const [uploadingFile, setUploadingFile] = useState(false);
  const [savingChange, setSavingChange] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // New Media Asset Modal State
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [newAssetName, setNewAssetName] = useState('');
  const [newAssetUrl, setNewAssetUrl] = useState('');
  const [uploadingNewAsset, setUploadingNewAsset] = useState(false);
  const newAssetFileInputRef = useRef<HTMLInputElement | null>(null);

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
            templateId: m.templateId,
            dimensions: m.dimensions || '1200 x 800',
            size: m.size || '280 KB',
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

  // Handle uploading file to /api/upload/image for "Change Image" modal
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingFile(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/upload/image', {
        method: 'POST',
        body: formData,
        credentials: 'include',
      });
      const data = await res.json();

      if (res.ok && data.success && data.url) {
        setNewImageUrl(data.url);
        showToast('success', 'Image uploaded! Click "Save Changes" to apply.');
      } else {
        showToast('error', data.error || 'Failed to upload image file.');
      }
    } catch (err: any) {
      showToast('error', err.message || 'Error uploading image file.');
    } finally {
      setUploadingFile(false);
    }
  };

  // Handle saving changed image
  const handleSaveImageChange = async () => {
    if (!editingItem || !newImageUrl.trim()) return;

    setSavingChange(true);
    try {
      const res = await fetch(`/api/admin/media/${encodeURIComponent(editingItem.id)}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          url: newImageUrl.trim(),
          name: editingItem.name,
        }),
      });
      const data = await res.json();

      if (res.ok && data.success) {
        showToast('success', `Image updated successfully for "${editingItem.name}"!`);
        setEditingItem(null);
        setNewImageUrl('');
        await fetchMedia();
      } else {
        showToast('error', data.error || 'Failed to update media image.');
      }
    } catch (err: any) {
      showToast('error', err.message || 'Error updating image.');
    } finally {
      setSavingChange(false);
    }
  };

  // Handle uploading file for "New Media Asset" modal
  const handleNewAssetFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingNewAsset(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/upload/image', {
        method: 'POST',
        body: formData,
        credentials: 'include',
      });
      const data = await res.json();

      if (res.ok && data.success && data.url) {
        setNewAssetUrl(data.url);
        if (!newAssetName) {
          setNewAssetName(file.name.replace(/\.[^/.]+$/, ''));
        }
        showToast('success', 'File uploaded successfully!');
      } else {
        showToast('error', data.error || 'Failed to upload image.');
      }
    } catch (err: any) {
      showToast('error', err.message || 'Error uploading image file.');
    } finally {
      setUploadingNewAsset(false);
    }
  };

  const handleSaveNewAsset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAssetUrl.trim()) return;

    try {
      const res = await fetch('/api/admin/media', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          name: newAssetName.trim() || 'New Media Asset',
          url: newAssetUrl.trim(),
          type: 'IMAGE',
        }),
      });
      const data = await res.json();

      if (res.ok && data.success) {
        showToast('success', 'New asset added to library!');
        setShowUploadModal(false);
        setNewAssetName('');
        setNewAssetUrl('');
        await fetchMedia();
      } else {
        showToast('error', data.error || 'Failed to save new asset.');
      }
    } catch (err: any) {
      showToast('error', err.message || 'Error saving new asset.');
    }
  };

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
              onClick={() => setShowUploadModal(true)}
              className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-[#641A2A] hover:bg-[#4E1421] rounded-xl transition shadow-xs cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Upload New Media Asset</span>
            </button>
          )}
        </div>
      </div>

      {/* Toast Feedback */}
      {toast && (
        <div
          className={`flex items-center justify-between p-3.5 rounded-xl border text-xs font-medium ${
            toast.type === 'success'
              ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
              : 'bg-rose-50 border-rose-200 text-rose-800'
          }`}
        >
          <div className="flex items-center gap-2">
            {toast.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            ) : (
              <AlertCircle className="w-4 h-4 text-rose-600" />
            )}
            <span>{toast.message}</span>
          </div>
          <button onClick={() => setToast(null)} className="p-0.5" aria-label="Dismiss">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

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
              {/* Image Preview Box with Explicit Height so images are ALWAYS seen */}
              <div className="relative w-full h-48 bg-[#F7F2E9] overflow-hidden border-b border-[#EAD8C8]/70 group">
                <img
                  src={m.url}
                  alt={m.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  onError={(e) => {
                    // Fallback to beautiful palace image if URL fails
                    (e.target as HTMLImageElement).src = '/images/templates/udaipur-palace-wedding-card.webp';
                  }}
                />

                {/* Category Pill Tag */}
                <div className="absolute top-2.5 left-2.5 z-10">
                  <span className="px-2.5 py-0.5 rounded-full text-[9px] font-mono uppercase font-bold bg-white/95 backdrop-blur-xs text-[#8C6D3B] border border-[#EAD8C8] shadow-xs">
                    {m.type}
                  </span>
                </div>

                {/* Hover Quick Action: Change Image button directly on image */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center gap-2">
                  <button
                    onClick={() => {
                      setEditingItem(m);
                      setNewImageUrl(m.url);
                    }}
                    className="px-3 py-1.5 rounded-xl bg-white text-[#1F1916] text-xs font-semibold flex items-center gap-1.5 shadow-md hover:bg-[#FAF5EE] transition cursor-pointer"
                    title="Change this image"
                  >
                    <Camera className="w-3.5 h-3.5 text-[#8C6D3B]" />
                    <span>Change Image</span>
                  </button>
                  <a
                    href={m.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1.5 rounded-xl bg-white text-[#1F1916] hover:bg-[#FAF5EE] shadow-md transition"
                    title="View Full Resolution"
                  >
                    <Eye className="w-3.5 h-3.5 text-[#8C6D3B]" />
                  </a>
                </div>
              </div>

              {/* Card Meta & Actions */}
              <div className="p-3.5 space-y-2.5">
                <div>
                  <div className="font-semibold text-xs text-[#1F1916] truncate" title={m.name}>
                    {m.name}
                  </div>
                  <div className="text-[10px] text-[#705E55] font-mono mt-0.5">
                    {m.dimensions} • {m.size}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-[#EAD8C8]/60">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => copyToClipboard(m.url, m.id)}
                      className="inline-flex items-center gap-1.5 text-[11px] font-medium text-[#8C6D3B] hover:text-[#1F1916] transition cursor-pointer"
                    >
                      {copiedId === m.id ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-600" />
                          <span className="text-emerald-700 font-semibold">Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span>Copy URL</span>
                        </>
                      )}
                    </button>

                    <button
                      onClick={() => {
                        setEditingItem(m);
                        setNewImageUrl(m.url);
                      }}
                      className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#641A2A] hover:text-[#8C6D3B] transition ml-1 cursor-pointer"
                      title="Change image"
                    >
                      <Edit3 className="w-3 h-3" />
                      <span>Change</span>
                    </button>
                  </div>

                  {canManage && (
                    <button
                      onClick={() => {
                        if (confirm(`Delete asset "${m.name}"?`)) {
                          fetch(`/api/admin/media/${encodeURIComponent(m.id)}`, { method: 'DELETE', credentials: 'include' })
                            .then(() => {
                              showToast('success', 'Asset deleted.');
                              fetchMedia();
                            });
                        }
                      }}
                      className="p-1 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition cursor-pointer"
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

      {/* CHANGE IMAGE MODAL */}
      {editingItem && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-[#EAD8C8] shadow-2xl max-w-xl w-full p-6 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-[#EAD8C8]">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-[#FAF5EE] border border-[#EAD8C8] flex items-center justify-center text-[#8C6D3B]">
                  <Camera className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-base text-[#1F1916]">
                    Change Media Image
                  </h3>
                  <p className="text-[11px] text-[#705E55] truncate max-w-xs">{editingItem.name}</p>
                </div>
              </div>
              <button
                onClick={() => {
                  setEditingItem(null);
                  setNewImageUrl('');
                }}
                className="p-1.5 text-[#705E55] hover:text-[#1F1916] rounded-xl hover:bg-[#FAF5EE]"
                aria-label="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="mt-4 space-y-4">
              {/* Live Image Comparison Preview */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <span className="text-[11px] font-semibold text-[#705E55] block">Current Image</span>
                  <div className="relative h-36 w-full rounded-xl overflow-hidden border border-[#EAD8C8] bg-[#F7F2E9]">
                    <img
                      src={editingItem.url}
                      alt="Current"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <span className="text-[11px] font-semibold text-[#8C6D3B] block">New Image Preview</span>
                  <div className="relative h-36 w-full rounded-xl overflow-hidden border border-[#8C6D3B] bg-[#F7F2E9] flex items-center justify-center">
                    {newImageUrl ? (
                      <img
                        src={newImageUrl}
                        alt="New Preview"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = '/images/templates/udaipur-palace-wedding-card.webp';
                        }}
                      />
                    ) : (
                      <div className="text-center p-3 text-[#705E55]">
                        <LucideImage className="w-6 h-6 mx-auto mb-1 text-[#8C6D3B]/40" />
                        <span className="text-[10px]">Select or upload a new image below</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Option 1: Upload from computer */}
              <div className="p-3.5 bg-[#FAF5EE]/70 rounded-2xl border border-[#EAD8C8] space-y-2">
                <span className="text-xs font-semibold text-[#1F1916] block">
                  Option 1: Upload from Computer
                </span>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  accept=".jpg,.jpeg,.png,.webp"
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploadingFile}
                  className="w-full py-2.5 px-4 rounded-xl border border-dashed border-[#8C6D3B] bg-white text-xs font-semibold text-[#8C6D3B] hover:bg-[#FAF5EE] transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {uploadingFile ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-[#8C6D3B]" />
                      <span>Uploading to Secure Storage...</span>
                    </>
                  ) : (
                    <>
                      <Upload className="w-4 h-4 text-[#8C6D3B]" />
                      <span>Click to Select &amp; Upload New Image (JPG, PNG, WEBP)</span>
                    </>
                  )}
                </button>
              </div>

              {/* Option 2: Image URL or CDN Path */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-[#1F1916] block">
                  Option 2: Image Path or URL
                </label>
                <input
                  type="text"
                  value={newImageUrl}
                  onChange={(e) => setNewImageUrl(e.target.value)}
                  placeholder="e.g. /images/templates/royal-navy-wedding-card.webp or https://..."
                  className="w-full px-3 py-2 bg-[#FAF5EE]/60 border border-[#EAD8C8] rounded-xl text-xs text-[#1F1916] font-mono focus:outline-none focus:border-[#8C6D3B]"
                />
              </div>
            </div>

            {/* Modal Actions */}
            <div className="mt-6 flex items-center justify-end gap-3 pt-3 border-t border-[#EAD8C8]">
              <button
                type="button"
                onClick={() => {
                  setEditingItem(null);
                  setNewImageUrl('');
                }}
                disabled={savingChange}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-[#705E55] hover:bg-[#FAF5EE] transition"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveImageChange}
                disabled={savingChange || !newImageUrl.trim() || newImageUrl === editingItem.url}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-[#641A2A] hover:bg-[#4E1421] transition flex items-center gap-2 disabled:opacity-40 cursor-pointer shadow-xs"
              >
                {savingChange && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                <span>Save &amp; Update Image</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* UPLOAD NEW MEDIA ASSET MODAL */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-[#EAD8C8] shadow-2xl max-w-md w-full p-6 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-[#EAD8C8]">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-[#FAF5EE] border border-[#EAD8C8] flex items-center justify-center text-[#8C6D3B]">
                  <Upload className="w-4 h-4" />
                </div>
                <h3 className="font-serif font-bold text-base text-[#1F1916]">
                  Upload New Media Asset
                </h3>
              </div>
              <button
                onClick={() => setShowUploadModal(false)}
                className="p-1.5 text-[#705E55] hover:text-[#1F1916] rounded-xl hover:bg-[#FAF5EE]"
                aria-label="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveNewAsset} className="mt-4 space-y-4">
              <div>
                <label className="text-xs font-semibold text-[#1F1916] block mb-1">
                  Asset Title / Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Udaipur Palace Gate Golden Foil"
                  value={newAssetName}
                  onChange={(e) => setNewAssetName(e.target.value)}
                  className="w-full px-3 py-2 bg-[#FAF5EE]/60 border border-[#EAD8C8] rounded-xl text-xs text-[#1F1916] focus:outline-none focus:border-[#8C6D3B]"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-[#1F1916] block mb-1">
                  Upload Image File *
                </label>
                <input
                  type="file"
                  ref={newAssetFileInputRef}
                  onChange={handleNewAssetFileUpload}
                  accept=".jpg,.jpeg,.png,.webp"
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => newAssetFileInputRef.current?.click()}
                  disabled={uploadingNewAsset}
                  className="w-full py-3 px-4 rounded-xl border border-dashed border-[#8C6D3B] bg-[#FAF5EE]/50 text-xs font-semibold text-[#8C6D3B] hover:bg-[#FAF5EE] transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {uploadingNewAsset ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-[#8C6D3B]" />
                      <span>Uploading File...</span>
                    </>
                  ) : (
                    <>
                      <Upload className="w-4 h-4 text-[#8C6D3B]" />
                      <span>{newAssetUrl ? 'Replace Selected File' : 'Click to Upload Image File'}</span>
                    </>
                  )}
                </button>
              </div>

              {newAssetUrl && (
                <div className="space-y-1">
                  <span className="text-[11px] font-semibold text-[#705E55] block">Uploaded Image Preview</span>
                  <div className="relative h-32 w-full rounded-xl overflow-hidden border border-[#EAD8C8] bg-[#F7F2E9]">
                    <img
                      src={newAssetUrl}
                      alt="New Asset"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              )}

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#EAD8C8]">
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-[#705E55] hover:bg-[#FAF5EE] transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!newAssetUrl.trim()}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-[#641A2A] hover:bg-[#4E1421] transition disabled:opacity-40 shadow-xs cursor-pointer"
                >
                  Add to Media Library
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
