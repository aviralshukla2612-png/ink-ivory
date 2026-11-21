'use client';

import React, { useState, useEffect, useRef } from 'react';
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
  ExternalLink,
  Volume2,
  Sliders,
  Scissors,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { MusicTrackRecord } from '@/lib/android-store';

export default function MusicLibraryAdminPage() {
  const [tracks, setTracks] = useState<MusicTrackRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

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
    source: '/audio/mangal-rang.mp3',
    duration: 180,
  });

  const fetchTracks = async () => {
    setLoading(true);
    try {
      const url = new URL('/api/admin/music', window.location.origin);
      if (selectedCategory !== 'All') url.searchParams.set('category', selectedCategory);
      if (searchQuery.trim()) url.searchParams.set('search', searchQuery.trim());

      const res = await fetch(url.toString(), { credentials: 'include' });
      const data = await res.json();
      if (res.ok && data.success) {
        setTracks(data.data);
      }
    } catch (e) {
      console.error('Failed to load tracks:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setCurrentPage(1);
    fetchTracks();
  }, [selectedCategory, searchQuery]);

  const togglePlay = (track: MusicTrackRecord) => {
    if (playingId === track.id) {
      audioRef.current?.pause();
      setPlayingId(null);
    } else {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = track.source;
        audioRef.current.play().catch((e) => console.log('Audio play failed:', e));
        setPlayingId(track.id);
      }
    }
  };

  const handleAddTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/admin/music', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(newTrack),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setShowAddModal(false);
        setNewTrack({
          title: '',
          movie: '',
          artist: '',
          category: 'Wedding',
          tag: 'Celebration Sangeet',
          source: '/audio/mangal-rang.mp3',
          duration: 180,
        });
        fetchTracks();
      }
    } catch (e) {
      console.error('Error adding track:', e);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to remove this music track?')) return;
    try {
      const res = await fetch(`/api/admin/music?id=${encodeURIComponent(id)}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      if (res.ok) {
        fetchTracks();
      }
    } catch (e) {
      console.error('Error deleting track:', e);
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Hidden audio element */}
      <audio
        ref={audioRef}
        onEnded={() => setPlayingId(null)}
      />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-[#E9DFD2]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#C69A50]/15 text-[#C69A50] uppercase tracking-wider">
              Audio Studio Ops
            </span>
            <span className="text-xs text-[#702E3D] font-medium">100+ Curated Celebratory Soundtracks</span>
          </div>
          <h1 className="font-serif text-3xl font-medium text-[#30231D]">Centralized Music Library</h1>
          <p className="text-sm text-[#702E3D]/80 mt-1">
            Manage audio tracks, story trimmers, category assignments, and MP3 files for Web and Android invitation creators.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-[#C69A50] hover:bg-[#b08742] transition flex items-center gap-2 shadow-sm"
          >
            <Plus className="w-3.5 h-3.5" /> Add Track
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-white p-4 rounded-2xl border border-[#E9DFD2]">
        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto">
          {['All', 'Wedding', 'Birthday', 'Proposal', 'Valentine'].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition ${
                selectedCategory === cat
                  ? 'bg-[#30231D] text-white shadow-sm'
                  : 'bg-[#FAF7F2] text-[#702E3D] hover:bg-[#E9DFD2]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-[#702E3D]/50 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search song, movie or artist..."
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-[#E9DFD2] bg-[#FAF7F2] text-xs text-[#30231D] focus:outline-none focus:ring-1 focus:ring-[#C69A50]"
          />
        </div>
      </div>

      {/* Add Track Modal */}
      {showAddModal && (
        <form onSubmit={handleAddTrack} className="p-6 rounded-2xl bg-[#FAF7F2] border border-[#E9DFD2] space-y-4">
          <h3 className="font-serif text-sm font-semibold text-[#30231D]">Add New Audio Soundtrack</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-semibold text-[#702E3D] uppercase mb-1">Song Title</label>
              <input
                type="text"
                required
                value={newTrack.title}
                onChange={(e) => setNewTrack({ ...newTrack, title: e.target.value })}
                placeholder="e.g. Mangal Rang"
                className="w-full px-3.5 py-2 rounded-xl border border-[#E9DFD2] bg-white text-xs text-[#30231D]"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-[#702E3D] uppercase mb-1">Movie / Album</label>
              <input
                type="text"
                required
                value={newTrack.movie}
                onChange={(e) => setNewTrack({ ...newTrack, movie: e.target.value })}
                placeholder="e.g. Ramayana"
                className="w-full px-3.5 py-2 rounded-xl border border-[#E9DFD2] bg-white text-xs text-[#30231D]"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-[#702E3D] uppercase mb-1">Artist / Credits</label>
              <input
                type="text"
                required
                value={newTrack.artist}
                onChange={(e) => setNewTrack({ ...newTrack, artist: e.target.value })}
                placeholder="e.g. A.R. Rahman, Arijit Singh"
                className="w-full px-3.5 py-2 rounded-xl border border-[#E9DFD2] bg-white text-xs text-[#30231D]"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-[#702E3D] uppercase mb-1">Category</label>
              <select
                value={newTrack.category}
                onChange={(e) => setNewTrack({ ...newTrack, category: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl border border-[#E9DFD2] bg-white text-xs text-[#30231D]"
              >
                <option value="Wedding">Wedding</option>
                <option value="Birthday">Birthday</option>
                <option value="Proposal">Proposal</option>
                <option value="Valentine">Valentine</option>
              </select>
            </div>
            <div className="sm:col-span-2">
              <label className="block text-[11px] font-semibold text-[#702E3D] uppercase mb-1">Audio Source URL (MP3)</label>
              <input
                type="text"
                required
                value={newTrack.source}
                onChange={(e) => setNewTrack({ ...newTrack, source: e.target.value })}
                placeholder="/audio/mangal-rang.mp3"
                className="w-full px-3.5 py-2 rounded-xl border border-[#E9DFD2] bg-white text-xs text-[#30231D]"
              />
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setShowAddModal(false)}
              className="px-4 py-2 rounded-xl text-xs font-medium text-[#702E3D] bg-white border border-[#E9DFD2]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl text-xs font-semibold text-white bg-[#C69A50] hover:bg-[#b08742]"
            >
              Save Track
            </button>
          </div>
        </form>
      )}

      {/* Tracks Table */}
      <div className="bg-white rounded-2xl border border-[#E9DFD2] overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#E9DFD2] bg-[#FAF7F2] text-[11px] font-semibold text-[#702E3D] uppercase tracking-wider">
                <th className="py-3 px-4 w-10 text-center">
                  <Music className="w-3.5 h-3.5 mx-auto text-[#C69A50]" />
                </th>
                <th className="py-3 px-4">Song &amp; Movie</th>
                <th className="py-3 px-4">Artist Credits</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Waveform Audio</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E9DFD2] text-xs">
              {tracks.slice((currentPage - 1) * pageSize, currentPage * pageSize).map((track) => (
                <tr key={track.id} className="hover:bg-[#FAF7F2]/50 transition">
                  <td className="py-3 px-4 text-center">
                    <div className="w-7 h-7 rounded-lg bg-[#FAF7F2] text-[#C69A50] flex items-center justify-center mx-auto border border-[#E9DFD2]">
                      <Volume2 className="w-3.5 h-3.5" />
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="font-semibold text-[#30231D]">{track.title}</div>
                    <div className="text-[11px] text-[#702E3D]/80">{track.movie}</div>
                  </td>
                  <td className="py-3 px-4 text-[#702E3D] max-w-xs truncate">{track.artist}</td>
                  <td className="py-3 px-4">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-[#E9DFD2] text-[#30231D]">
                      {track.category}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <button
                      onClick={() => togglePlay(track)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer ${
                        playingId === track.id
                          ? 'bg-[#C69A50] text-white shadow-sm'
                          : 'bg-[#FAF7F2] text-[#30231D] hover:bg-[#E9DFD2]'
                      }`}
                    >
                      {playingId === track.id ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                      {playingId === track.id ? 'Playing' : 'Listen'}
                    </button>
                  </td>
                  <td className="py-3 px-4 text-right">
                    {track.isCustomUpload ? (
                      <button
                        onClick={() => handleDelete(track.id)}
                        className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg transition"
                        title="Delete track"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    ) : (
                      <span className="text-[10px] text-zinc-400 font-mono">Built-in</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Music Library Pagination Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between p-4 border-t border-[#E9DFD2] bg-[#FAF7F2] text-xs text-[#702E3D] gap-3">
          <div>
            Showing{' '}
            <span className="font-bold text-[#30231D]">
              {tracks.length === 0 ? 0 : (currentPage - 1) * pageSize + 1}
            </span>{' '}
            to{' '}
            <span className="font-bold text-[#30231D]">
              {Math.min(currentPage * pageSize, tracks.length)}
            </span>{' '}
            of <span className="font-bold text-[#30231D]">{tracks.length}</span> tracks
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={currentPage <= 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className="px-3 py-1.5 rounded-lg border border-[#E9DFD2] bg-white hover:bg-[#FAF7F2] disabled:opacity-40 text-xs font-medium flex items-center gap-1 transition cursor-pointer"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              <span>Previous</span>
            </button>
            <span className="font-semibold px-2 text-[#30231D]">
              Page {currentPage} of {Math.max(1, Math.ceil(tracks.length / pageSize))}
            </span>
            <button
              type="button"
              disabled={currentPage >= Math.ceil(tracks.length / pageSize)}
              onClick={() => setCurrentPage((p) => Math.min(Math.ceil(tracks.length / pageSize), p + 1))}
              className="px-3 py-1.5 rounded-lg border border-[#E9DFD2] bg-white hover:bg-[#FAF7F2] disabled:opacity-40 text-xs font-medium flex items-center gap-1 transition cursor-pointer"
            >
              <span>Next</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
