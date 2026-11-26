'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import Link from 'next/link';
import {
  Music,
  Play,
  Pause,
  Search,
  Volume2,
  Clock,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Disc3,
  Sliders,
} from 'lucide-react';
import { ALL_SONGS, SONG_CATEGORIES, SongItem } from '@/data/songs';

const PAGE_SIZE = 8; // Royal melody tracks per page for clean browsing

export default function WebMusicLibraryPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [playingSongId, setPlayingSongId] = useState<string | null>(null);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Filter songs based on category and search query
  const filteredSongs = useMemo(() => {
    return ALL_SONGS.filter((song) => {
      const matchesCategory =
        selectedCategory === 'All' ||
        song.category.toLowerCase() === selectedCategory.toLowerCase();
      const matchesSearch =
        !searchQuery.trim() ||
        song.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        song.movie.toLowerCase().includes(searchQuery.toLowerCase()) ||
        song.artist.toLowerCase().includes(searchQuery.toLowerCase()) ||
        song.tag.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  // Reset to page 1 on filter/search change
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, searchQuery]);

  // Paginated songs slice
  const totalPages = Math.ceil(filteredSongs.length / PAGE_SIZE) || 1;
  const paginatedSongs = useMemo(() => {
    const startIndex = (currentPage - 1) * PAGE_SIZE;
    return filteredSongs.slice(startIndex, startIndex + PAGE_SIZE);
  }, [filteredSongs, currentPage]);

  const currentlyPlayingSong = useMemo(() => {
    return ALL_SONGS.find((s) => s.id === playingSongId) || null;
  }, [playingSongId]);

  // Handle Play/Pause toggle
  const togglePlaySong = (song: SongItem) => {
    if (playingSongId === song.id) {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      setPlayingSongId(null);
    } else {
      setPlayingSongId(song.id);
      if (audioRef.current) {
        audioRef.current.src = song.source;
        audioRef.current.play().catch((err) => {
          console.warn('Audio play request interrupted:', err);
        });
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-[#2A0216] selection:bg-[#3B021F] selection:text-[#FAF5EE]">
      {/* Hidden Audio Element for Playback */}
      <audio
        ref={audioRef}
        onEnded={() => setPlayingSongId(null)}
        onError={() => setPlayingSongId(null)}
      />

      <main className="max-w-4xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Luxury Hero Header */}
        <section
          aria-label="Audio Library Banner"
          className="rounded-2xl bg-gradient-to-br from-[#2A0216] via-[#3B021F] to-[#1E0110] text-[#FAF5EE] p-6 sm:p-8 mb-8 border border-[#D4AF37]/30 shadow-lg relative overflow-hidden"
        >
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37]/40 text-[#D4AF37] text-xs font-semibold uppercase tracking-wider mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              Bespoke Audio Experience
            </div>
            <h1 className="text-2xl sm:text-4xl font-serif text-[#FFF2D1] mb-2 tracking-wide">
              Curated Soundtrack Library
            </h1>
            <p className="text-sm sm:text-base text-[#FAF5EE]/80 max-w-xl leading-relaxed">
              116+ Timeless Indian Wedding, Romantic & Celebration Anthems crafted for digital invitations.
            </p>
          </div>
          {/* Subtle Background Monogram Accent */}
          <div className="absolute -right-8 -bottom-8 w-44 h-44 rounded-full border border-[#D4AF37]/15 pointer-events-none" />
        </section>

        {/* Search Bar Input */}
        <div className="relative mb-6">
          <Search className="w-5 h-5 text-[#8C7A6B] absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search wedding songs, artists, movies..."
            className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-white border border-[#EADBCE] text-sm text-[#2A0216] placeholder-[#8C7A6B] shadow-sm focus:outline-none focus:ring-2 focus:ring-[#3B021F] transition-all"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-semibold text-[#8C7A6B] hover:text-[#2A0216]"
            >
              Clear
            </button>
          )}
        </div>

        {/* Category Filter Chips Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-6 scrollbar-none">
          {['All', ...SONG_CATEGORIES].map((cat) => {
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-5 py-2 rounded-full text-xs sm:text-sm font-medium whitespace-nowrap transition-all focus:outline-none focus:ring-2 focus:ring-[#D4AF37] ${
                  isSelected
                    ? 'bg-[#3B021F] text-[#FFF2D1] shadow-sm border border-[#D4AF37]/40'
                    : 'bg-white text-[#7A644E] border border-[#EADBCE] hover:bg-[#FAF5EE]'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* DEF-1304 REMEDIATION: pb-32 Ensures the Last Song Card & Pagination Never Clashes with the Player Bar */}
        <div className="space-y-3 pb-32">
          {paginatedSongs.length === 0 ? (
            <div className="py-16 text-center rounded-2xl bg-white border border-[#EADBCE] p-8">
              <Music className="w-12 h-12 text-[#8C7A6B] mx-auto mb-3 opacity-60" />
              <p className="text-base font-serif text-[#2A0216] mb-1">No Soundtracks Found</p>
              <p className="text-xs text-[#8C7A6B]">
                Try adjusting your search terms or selecting a different category.
              </p>
            </div>
          ) : (
            paginatedSongs.map((song) => {
              const isPlaying = playingSongId === song.id;
              return (
                <div
                  key={song.id}
                  className={`p-4 rounded-xl border transition-all flex items-center justify-between gap-4 ${
                    isPlaying
                      ? 'bg-[#FAF5EE] border-[#3B021F] shadow-sm ring-1 ring-[#3B021F]/20'
                      : 'bg-white border-[#EADBCE] hover:border-[#D4AF37]/60'
                  }`}
                >
                  <div className="flex items-center gap-4 min-w-0 flex-1">
                    {/* Play / Pause Toggle Button */}
                    <button
                      type="button"
                      onClick={() => togglePlaySong(song)}
                      aria-label={isPlaying ? `Pause ${song.title}` : `Play ${song.title}`}
                      className={`w-11 h-11 rounded-full flex items-center justify-center shrink-0 transition-transform active:scale-95 focus:outline-none focus:ring-2 focus:ring-[#D4AF37] ${
                        isPlaying
                          ? 'bg-[#3B021F] text-[#FFF2D1] shadow-md'
                          : 'bg-[#FAF5EE] text-[#3B021F] border border-[#EADBCE] hover:bg-[#3B021F] hover:text-[#FAF5EE]'
                      }`}
                    >
                      {isPlaying ? (
                        <Pause className="w-4 h-4 fill-current" />
                      ) : (
                        <Play className="w-4 h-4 fill-current ml-0.5" />
                      )}
                    </button>

                    {/* Metadata */}
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h2 className="text-sm sm:text-base font-serif font-bold text-[#2A0216] truncate">
                          {song.title}
                        </h2>
                        <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-[#FAF5EE] border border-[#EADBCE] text-[#8C7A6B] shrink-0">
                          {song.category}
                        </span>
                      </div>
                      <p className="text-xs text-[#7A644E] truncate">
                        {song.movie} • {song.artist}
                      </p>
                    </div>
                  </div>

                  {/* Duration and Tag */}
                  <div className="text-right shrink-0">
                    <span className="text-xs font-mono font-medium text-[#7A644E] flex items-center gap-1 justify-end">
                      <Clock className="w-3 h-3 text-[#8C7A6B]" />
                      {song.duration}
                    </span>
                    <span className="text-[10px] text-[#A38A75] hidden sm:block mt-1">
                      {song.tag}
                    </span>
                  </div>
                </div>
              );
            })
          )}

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between pt-6 border-t border-[#EADBCE] mt-6">
              <button
                type="button"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                className="px-4 py-2 rounded-lg border border-[#EADBCE] text-xs font-semibold text-[#3B021F] bg-white hover:bg-[#FAF5EE] disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1 transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
                Previous
              </button>

              <div className="text-xs font-medium text-[#7A644E]">
                Page <span className="font-bold text-[#2A0216]">{currentPage}</span> of{' '}
                <span className="font-bold text-[#2A0216]">{totalPages}</span>
              </div>

              <button
                type="button"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                className="px-4 py-2 rounded-lg border border-[#EADBCE] text-xs font-semibold text-[#3B021F] bg-white hover:bg-[#FAF5EE] disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1 transition-colors"
              >
                Next
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </main>

      {/* Floating Bottom Now-Playing Bar (Active when song is playing) */}
      {currentlyPlayingSong && (
        <div
          role="region"
          aria-label="Currently Playing Audio"
          className="fixed bottom-4 left-4 right-4 max-w-xl mx-auto rounded-2xl bg-[#2A0216] border border-[#D4AF37]/50 shadow-2xl p-3 sm:p-4 text-[#FAF5EE] flex items-center justify-between gap-3 z-50 animate-in fade-in slide-in-from-bottom-4 duration-300"
        >
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <div className="w-10 h-10 rounded-full bg-[#3B021F] border border-[#D4AF37]/40 flex items-center justify-center shrink-0">
              <Disc3 className="w-5 h-5 text-[#FFF2D1] animate-spin" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs sm:text-sm font-serif font-bold text-[#FFF2D1] truncate">
                {currentlyPlayingSong.title}
              </p>
              <p className="text-[11px] text-[#FAF5EE]/70 truncate">
                {currentlyPlayingSong.movie} • {currentlyPlayingSong.artist}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => togglePlaySong(currentlyPlayingSong)}
              aria-label="Pause Soundtrack"
              className="w-9 h-9 rounded-full bg-[#FFF2D1] text-[#2A0216] flex items-center justify-center hover:bg-white transition-colors"
            >
              <Pause className="w-4 h-4 fill-current" />
            </button>
            <button
              type="button"
              onClick={() => {
                if (audioRef.current) audioRef.current.pause();
                setPlayingSongId(null);
              }}
              className="text-xs text-[#FAF5EE]/60 hover:text-white px-2 py-1"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
