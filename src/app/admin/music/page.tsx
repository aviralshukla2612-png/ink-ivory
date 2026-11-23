'use client';

import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import {
  Music,
  Play,
  Pause,
  Plus,
  Trash2,
  Search,
  Filter,
  CheckCircle2,
  RefreshCw,
  Sliders,
  Disc,
  HardDrive,
  Clock,
  Edit,
  X,
  Upload,
} from 'lucide-react';
import AdminPagination from '@/components/admin/AdminPagination';

interface MusicTrackRecord {
  id: string;
  title: string;
  movie?: string;
  artist?: string;
  category: string;
  tag?: string;
  source: string;
  duration?: number;
  fileSize?: string;
  isActive?: boolean;
  createdAt?: string;
}

const CATEGORIES = ['All', 'Wedding', 'Birthday', 'Proposal', 'Valentine', 'Anniversary', 'Festive'];

export default function MusicLibraryAdminPage() {
  const [tracks, setTracks] = useState<MusicTrackRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(128);

  const [stats, setStats] = useState({
    totalTracks: 128,
    activeTracks: 124,
    inactiveTracks: 4,
    categories: 7,
    totalSize: '1.8 GB',
  });

  // Audio Playback state
  const [playingId, setPlayingId] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // New Track Modal
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTrack, setNewTrack] = useState({
    title: '',
    movie: '',
    artist: '',
    category: 'Wedding',
    tag: 'Celebration Sangeet',
    source: '/audio/kesariya-flute.mp3',
    duration: 246,
  });

  const fetchTracks = useCallback(async () => {
    setLoading(true);
    try {
      const url = new URL('/api/admin/music', window.location.origin);
      if (selectedCategory !== 'All') url.searchParams.set('category', selectedCategory);
      if (searchQuery.trim()) url.searchParams.set('search', searchQuery.trim());

      const res = await fetch(url.toString(), { credentials: 'include' });
      const data = await res.json();
      if (res.ok && data.success) {
        setTracks(data.data || []);
        if (data.stats) setStats(data.stats);
        if (data.total) setTotal(data.total);
      }
    } catch (e) {
      console.error('Failed to load tracks:', e);
    } finally {
      setLoading(false);
    }
  }, [selectedCategory, searchQuery]);

  useEffect(() => {
    fetchTracks();
  }, [fetchTracks]);

  const togglePlay = (track: MusicTrackRecord) => {
    if (playingId === track.id) {
      audioRef.current?.pause();
      setPlayingId(null);
    } else {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      const audio = new Audio(track.source);
      audio.onended = () => setPlayingId(null);
      audio.play().catch((e) => console.log('Audio autoplay blocked', e));
      audioRef.current = audio;
      setPlayingId(track.id);
    }
  };

  useEffect(() => {
    return () => {
      if (audioRef.current) audioRef.current.pause();
    };
  }, []);

  const formatDuration = (secs?: number) => {
    if (!secs) return '03:42';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const filteredTracks = useMemo<MusicTrackRecord[]>(() => {
    return tracks.filter((t) => {
      const matchesCat =
        selectedCategory === 'All' ||
        (t.category && t.category.toLowerCase().includes(selectedCategory.toLowerCase()));
      const matchesStatus =
        statusFilter === 'All' ||
        (statusFilter === 'ACTIVE' ? t.isActive !== false : t.isActive === false);
      const matchesSearch =
        !searchQuery.trim() ||
        t.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.movie?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.artist?.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCat && matchesStatus && matchesSearch;
    });
  }, [tracks, selectedCategory, statusFilter, searchQuery]);

  const paginatedTracks = useMemo<MusicTrackRecord[]>(() => {
    const start = (page - 1) * pageSize;
    return filteredTracks.slice(start, start + pageSize);
  }, [filteredTracks, page, pageSize]);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-[#EAD8C8]">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-[11px] font-mono tracking-wider uppercase px-2.5 py-0.5 rounded-full bg-[#FAF5EE] text-[#8C6D3B] border border-[#EAD8C8] font-semibold">
              AUDIO STUDIO OPS • 100+ Curated Celebratory Soundtracks
            </span>
          </div>
          <h1 className="text-2xl lg:text-3xl font-serif font-bold text-[#1F1916] tracking-tight">
            Curated Soundtrack Library
          </h1>
          <p className="text-xs text-[#705E55] mt-1">
            Royalty-free wedding, celebration, romance and party audio tracks for invitations.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-[#641A2A] hover:bg-[#4E1421] rounded-xl transition shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Upload Audio Track</span>
          </button>
        </div>
      </div>

      {/* 5 Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Total Tracks */}
        <div className="bg-white p-4.5 rounded-2xl border border-[#EAD8C8] shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-[#FAF5EE] border border-[#EAD8C8] flex items-center justify-center text-[#8C6D3B] shrink-0">
            <Music className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-serif font-bold text-[#1F1916] leading-none">
              {stats.totalTracks}
            </div>
            <div className="text-xs text-[#705E55] font-medium mt-1">Total Tracks</div>
          </div>
        </div>

        {/* Active Tracks */}
        <div className="bg-white p-4.5 rounded-2xl border border-[#EAD8C8] shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 shrink-0">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-serif font-bold text-[#1F1916] leading-none">
              {stats.activeTracks}
            </div>
            <div className="text-xs text-[#705E55] font-medium mt-1">Active Tracks</div>
          </div>
        </div>

        {/* Inactive Tracks */}
        <div className="bg-white p-4.5 rounded-2xl border border-[#EAD8C8] shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600 shrink-0">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-serif font-bold text-[#1F1916] leading-none">
              {stats.inactiveTracks}
            </div>
            <div className="text-xs text-[#705E55] font-medium mt-1">Inactive Tracks</div>
          </div>
        </div>

        {/* Categories */}
        <div className="bg-white p-4.5 rounded-2xl border border-[#EAD8C8] shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-purple-50 border border-purple-100 flex items-center justify-center text-purple-600 shrink-0">
            <Disc className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-serif font-bold text-[#1F1916] leading-none">
              {stats.categories}
            </div>
            <div className="text-xs text-[#705E55] font-medium mt-1">Categories</div>
          </div>
        </div>

        {/* Total Size */}
        <div className="bg-white p-4.5 rounded-2xl border border-[#EAD8C8] shadow-xs flex items-center gap-4 col-span-2 lg:col-span-1">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 shrink-0">
            <HardDrive className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xl font-serif font-bold text-[#1F1916] leading-none">
              {stats.totalSize}
            </div>
            <div className="text-xs text-[#705E55] font-medium mt-1">Total Size</div>
          </div>
        </div>
      </div>

      {/* Category Pills Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {CATEGORIES.map((cat) => {
          const isSelected = selectedCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => {
                setSelectedCategory(cat);
                setPage(1);
              }}
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

      {/* Filter and Search Bar */}
      <div className="bg-white p-3.5 rounded-2xl border border-[#EAD8C8] shadow-xs flex flex-col md:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8C6D3B]" />
          <input
            type="text"
            placeholder="Search by song title, movie, singer or mood..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setPage(1);
            }}
            className="w-full pl-10 pr-4 py-2 bg-[#FAF5EE]/60 border border-[#EAD8C8] rounded-xl text-xs text-[#1F1916] placeholder-[#8C6D3B]/50 focus:outline-none focus:border-[#8C6D3B] focus:bg-white"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          {/* Status Filter */}
          <select
            value={statusFilter}
            aria-label="Filter by Status"
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPage(1);
            }}
            className="px-3 py-2 bg-[#FAF5EE]/60 border border-[#EAD8C8] rounded-xl text-xs font-medium text-[#1F1916] focus:outline-none focus:border-[#8C6D3B] cursor-pointer"
          >
            <option value="All">All Statuses</option>
            <option value="ACTIVE">Active</option>
            <option value="INACTIVE">Inactive</option>
          </select>

          <button
            onClick={() => fetchTracks()}
            className="p-2 text-[#705E55] hover:text-[#1F1916] bg-[#FAF5EE] border border-[#EAD8C8] rounded-xl hover:border-[#8C6D3B] transition"
            title="Refresh Table"
            aria-label="Refresh Table"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Music Table */}
      <div className="bg-white rounded-2xl border border-[#EAD8C8] shadow-xs overflow-hidden">
        {loading ? (
          <div className="py-24 flex flex-col items-center justify-center gap-2 text-[#705E55]">
            <RefreshCw className="w-6 h-6 animate-spin text-[#8C6D3B]" />
            <span className="text-xs font-mono">Loading audio catalog...</span>
          </div>
        ) : filteredTracks.length === 0 ? (
          <div className="py-20 text-center text-[#705E55]">
            <Music className="w-10 h-10 text-[#8C6D3B]/40 mx-auto mb-2" />
            <h3 className="font-serif font-bold text-base text-[#1F1916]">No Tracks Found</h3>
            <p className="text-xs mt-1">Try clearing your filters or upload a new track.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#FAF5EE] text-[#705E55] uppercase text-[10px] font-mono tracking-wider border-b border-[#EAD8C8]">
                <tr>
                  <th className="py-3 px-4 text-center w-14">Sr. No.</th>
                  <th className="py-3 px-4 text-center">Preview</th>
                  <th className="py-3 px-4">Song &amp; Movie</th>
                  <th className="py-3 px-4">Artist Credits</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4 text-center">Duration</th>
                  <th className="py-3 px-4 text-center">File Size</th>
                  <th className="py-3 px-4 text-center">Status</th>
                  <th className="py-3 px-4">Added On</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EAD8C8]/60">
                {paginatedTracks.map((t, idx) => {
                  const srNo = (page - 1) * pageSize + idx + 1;
                  const isPlaying = playingId === t.id;
                  const isActive = t.isActive !== false;

                  return (
                    <tr key={t.id} className="hover:bg-[#FAF5EE]/40 transition-colors">
                      {/* Sr. No. */}
                      <td className="py-3.5 px-4 text-center font-mono font-medium text-[#705E55]">
                        {srNo}
                      </td>

                      {/* Preview (Circular Play + Waveform + Time) */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => togglePlay(t)}
                            className={`w-8 h-8 rounded-full flex items-center justify-center transition shadow-xs ${
                              isPlaying
                                ? 'bg-[#641A2A] text-white animate-pulse'
                                : 'bg-[#FAF5EE] text-[#8C6D3B] hover:bg-[#EAD8C8] border border-[#EAD8C8]'
                            }`}
                            title={isPlaying ? 'Pause' : 'Play Preview'}
                            aria-label={isPlaying ? 'Pause' : 'Play Preview'}
                          >
                            {isPlaying ? <Pause className="w-3.5 h-3.5 fill-current" /> : <Play className="w-3.5 h-3.5 fill-current ml-0.5" />}
                          </button>
                          {/* Mini Waveform visualization */}
                          <div className="flex items-center gap-0.5 h-5 px-1.5 py-0.5 rounded bg-[#FAF5EE] border border-[#EAD8C8]">
                            <span className={`w-0.5 rounded-full bg-[#8C6D3B] ${isPlaying ? 'h-4 animate-bounce' : 'h-2'}`} />
                            <span className={`w-0.5 rounded-full bg-[#8C6D3B] ${isPlaying ? 'h-2.5 animate-pulse' : 'h-3.5'}`} />
                            <span className={`w-0.5 rounded-full bg-[#8C6D3B] ${isPlaying ? 'h-4 animate-bounce' : 'h-1.5'}`} />
                            <span className={`w-0.5 rounded-full bg-[#8C6D3B] ${isPlaying ? 'h-3 animate-pulse' : 'h-3'}`} />
                          </div>
                          <span className="font-mono text-[10px] text-[#705E55]">
                            {formatDuration(t.duration)}
                          </span>
                        </div>
                      </td>

                      {/* Song & Movie */}
                      <td className="py-3.5 px-4">
                        <div>
                          <span className="font-semibold text-xs text-[#1F1916] block leading-tight">
                            {t.title}
                          </span>
                          <span className="text-[10px] text-[#705E55] mt-0.5 block">
                            {t.movie || 'Curated Soundscape'}
                          </span>
                        </div>
                      </td>

                      {/* Artist Credits */}
                      <td className="py-3.5 px-4 font-medium text-xs text-[#1F1916]">
                        {t.artist || 'Original Score'}
                      </td>

                      {/* Category */}
                      <td className="py-3.5 px-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase font-semibold bg-[#FAF5EE] text-[#8C6D3B] border border-[#EAD8C8]">
                          {t.category}
                        </span>
                      </td>

                      {/* Duration */}
                      <td className="py-3.5 px-4 text-center font-mono text-xs text-[#705E55]">
                        {formatDuration(t.duration)}
                      </td>

                      {/* File Size */}
                      <td className="py-3.5 px-4 text-center font-mono text-xs text-[#705E55]">
                        {t.fileSize || '7.8 MB'}
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4 text-center">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-mono uppercase font-semibold ${
                            isActive
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-amber-50 text-amber-700 border border-amber-200'
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              isActive ? 'bg-emerald-500' : 'bg-amber-500'
                            }`}
                          />
                          {isActive ? 'ACTIVE' : 'INACTIVE'}
                        </span>
                      </td>

                      {/* Added On */}
                      <td className="py-3.5 px-4 text-[#705E55] text-xs">
                        {new Date(t.createdAt || Date.now()).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => togglePlay(t)}
                            className="p-1.5 text-[#8C6D3B] hover:text-[#1F1916] hover:bg-[#FAF5EE] rounded-lg transition-colors"
                            title="Play Track"
                            aria-label="Play Track"
                          >
                            <Play className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => {}}
                            className="p-1.5 text-[#705E55] hover:text-[#1F1916] hover:bg-[#FAF5EE] rounded-lg transition-colors"
                            title="Edit Metadata"
                            aria-label="Edit Metadata"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => {}}
                            className="p-1.5 text-rose-600 hover:text-rose-800 hover:bg-rose-50 rounded-lg transition-colors"
                            title="Delete Track"
                            aria-label="Delete Track"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
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
        currentPage={page}
        totalItems={filteredTracks.length}
        pageSize={pageSize}
        pageSizeOptions={[10, 25, 50]}
        itemName="tracks"
        onPageChange={(p) => setPage(p)}
        onPageSizeChange={(s) => {
          setPageSize(s);
          setPage(1);
        }}
      />
    </div>
  );
}
