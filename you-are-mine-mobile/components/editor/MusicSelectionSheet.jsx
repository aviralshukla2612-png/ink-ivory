import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  TextInput,
  ScrollView,
} from 'react-native';
import {
  Music2,
  Play,
  Pause,
  Check,
  Search,
  X,
  Volume2,
  Sliders,
  Clock,
  Sparkles,
  RotateCcw,
} from 'lucide-react-native';
import { Colors } from '../../constants/colors';
import { MusicService } from '../../services/music.service';
import { useEditorStore } from '../../store/editor.store';

const WAVEFORM_BARS = [
  35, 60, 40, 80, 100, 70, 45, 90, 60, 80, 95, 40, 75, 100, 85, 60,
  90, 70, 50, 95, 100, 80, 60, 45, 85, 95, 70, 90, 60, 85, 50, 70,
  40, 65, 85, 55,
];

const CLIP_DURATIONS = [
  { label: '15s', sec: 15, sub: 'Story' },
  { label: '30s', sec: 30, sub: 'Reel' },
  { label: '45s', sec: 45, sub: 'Clip' },
  { label: '60s', sec: 60, sub: 'Long' },
  { label: 'Full', sec: 0, sub: 'All' },
];

const PRESETS = [
  { label: '0s (Intro)', sec: 0 },
  { label: '15s', sec: 15 },
  { label: '30s (Chorus)', sec: 30 },
  { label: '45s', sec: 45 },
  { label: '60s (Drop)', sec: 60 },
];

function formatTime(totalSeconds) {
  const s = Math.max(0, Math.floor(totalSeconds));
  const mins = Math.floor(s / 60);
  const secs = s % 60;
  return `${mins}:${String(secs).padStart(2, '0')}`;
}

export function MusicSelectionSheet() {
  const { music, selectMusicTrack, setMusicTiming, setActiveTool } = useEditorStore();

  const [activeTab, setActiveTab] = useState('browse'); // 'browse' | 'trim'
  const [category, setCategory] = useState('All');
  const [search, setSearch] = useState('');
  const [tracks, setTracks] = useState([]);
  const [categories, setCategories] = useState(['All', 'Wedding', 'Birthday', 'Proposal', 'Valentine']);
  const [loading, setLoading] = useState(true);
  const [playingSource, setPlayingSource] = useState(null);

  // Instagram-style trimming states
  const [startTime, setStartTime] = useState(Number(music.audioStartTime) || 0);
  const [clipDuration, setClipDuration] = useState(Number(music.audioClipDuration) || 0);
  const [currentTime, setCurrentTime] = useState(0);
  const [trackDuration, setTrackDuration] = useState(225); // default ~3:45
  const [appliedToast, setAppliedToast] = useState(false);

  // Sync state if store updates
  useEffect(() => {
    setStartTime(Number(music.audioStartTime) || 0);
    setClipDuration(Number(music.audioClipDuration) || 0);
  }, [music.audioStartTime, music.audioClipDuration]);

  // Load track list
  useEffect(() => {
    let isMounted = true;

    async function loadTracks() {
      try {
        setLoading(true);
        const data = await MusicService.getCuratedTracks(category, search);
        if (isMounted) {
          setTracks(data.tracks || []);
          if (data.categories?.length) {
            setCategories(data.categories);
          }
        }
      } catch (e) {
        console.warn('Track load error:', e);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadTracks();

    return () => {
      isMounted = false;
    };
  }, [category, search]);

  useEffect(() => {
    return () => {
      MusicService.stopPreview();
    };
  }, []);

  // Find active track details
  const activeTrackObj = useMemo(() => {
    return tracks.find((t) => t.title === music.songTitle || t.source === music.audioSource) || {
      title: music.songTitle || 'Selected Song',
      artist: 'Curated Indian Melodies',
      source: music.audioSource,
      fullAudioUrl: music.audioSource?.startsWith('http')
        ? music.audioSource
        : `http://localhost:3000${music.audioSource}`,
      duration: 225,
    };
  }, [tracks, music]);

  useEffect(() => {
    if (activeTrackObj?.duration) {
      setTrackDuration(activeTrackObj.duration);
    }
  }, [activeTrackObj]);

  const handlePlayToggle = async (track, forcedStart = null) => {
    try {
      const url = track.fullAudioUrl || track.source;
      if (playingSource === url && forcedStart === null) {
        await MusicService.stopPreview();
        setPlayingSource(null);
      } else {
        setPlayingSource(url);
        const startSec = forcedStart !== null ? forcedStart : (track.title === music.songTitle ? startTime : 0);

        await MusicService.playPreview(
          url,
          (status) => {
            if (status.isLoaded) {
              const currentPosSec = (status.positionMillis || 0) / 1000;
              setCurrentTime(currentPosSec);
              if (status.durationMillis) {
                setTrackDuration(Math.floor(status.durationMillis / 1000));
              }

              // Loop within clip segment if clipDuration is set (Instagram Story behavior)
              if (clipDuration > 0 && currentPosSec >= startTime + clipDuration) {
                MusicService.seekTo(startTime);
              }

              if (status.didJustFinish) {
                if (clipDuration > 0) {
                  MusicService.seekTo(startTime);
                } else {
                  setPlayingSource(null);
                }
              }
            }
          },
          startSec
        );
      }
    } catch {
      setPlayingSource(null);
    }
  };

  const handleSeek = (newSec) => {
    const clamped = Math.max(0, Math.min(newSec, Math.max(0, trackDuration - 5)));
    setStartTime(clamped);
    if (playingSource) {
      MusicService.seekTo(clamped);
    }
  };

  const handleSelect = (track) => {
    selectMusicTrack(track);
    setStartTime(0);
    setClipDuration(0);
  };

  const handleApplyTrim = () => {
    setMusicTiming(startTime, clipDuration);
    setAppliedToast(true);
    setTimeout(() => setAppliedToast(false), 2200);
  };

  return (
    <View style={styles.sheetContainer}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <Music2 size={18} color={Colors.primary} />
          <Text style={styles.title}>Royal Soundtrack Studio</Text>
        </View>
        <TouchableOpacity
          style={styles.closeBtn}
          onPress={async () => {
            await MusicService.stopPreview();
            setActiveTool(null);
          }}
          activeOpacity={0.7}
        >
          <X size={18} color={Colors.textSecondary} />
        </TouchableOpacity>
      </View>

      {/* Mode Navigation: [Choose Song] vs [✂️ Trim (Instagram Style)] */}
      <View style={styles.modeTabsRow}>
        <TouchableOpacity
          style={[styles.modeTab, activeTab === 'browse' && styles.activeModeTab]}
          onPress={() => setActiveTab('browse')}
          activeOpacity={0.8}
        >
          <Music2 size={13} color={activeTab === 'browse' ? Colors.surface : Colors.textPrimary} />
          <Text style={[styles.modeTabText, activeTab === 'browse' && styles.activeModeTabText]}>
            Choose Song
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.modeTab, activeTab === 'trim' && styles.activeModeTab]}
          onPress={() => setActiveTab('trim')}
          activeOpacity={0.8}
        >
          <Sliders size={13} color={activeTab === 'trim' ? Colors.surface : Colors.textPrimary} />
          <Text style={[styles.modeTabText, activeTab === 'trim' && styles.activeModeTabText]}>
            ✂️ Trim (Instagram Style)
          </Text>
          {(startTime > 0 || clipDuration > 0) && (
            <View style={styles.trimmedIndicator}>
              <Text style={styles.trimmedIndicatorText}>
                {clipDuration > 0 ? `${clipDuration}s` : `${startTime}s`}
              </Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      {/* TAB 1: BROWSE TRACKS */}
      {activeTab === 'browse' && (
        <View style={styles.tabContent}>
          {/* Category Filter Pills */}
          <View style={styles.categoryRow}>
            {categories.map((cat) => {
              const isSelected = category.toLowerCase() === cat.toLowerCase();
              return (
                <TouchableOpacity
                  key={cat}
                  style={[styles.catChip, isSelected && styles.activeCatChip]}
                  onPress={() => setCategory(cat)}
                  activeOpacity={0.7}
                >
                  <Text style={[styles.catChipText, isSelected && styles.activeCatChipText]}>
                    {cat}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Track List */}
          {loading ? (
            <View style={styles.centerContainer}>
              <ActivityIndicator size="small" color={Colors.primary} />
              <Text style={styles.loadingText}>Loading curated soundtracks...</Text>
            </View>
          ) : (
            <FlatList
              data={tracks}
              keyExtractor={(item) => String(item.id || item.number || item.title)}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.listContent}
              renderItem={({ item }) => {
                const isPlaying = playingSource === item.fullAudioUrl;
                const isSelected = music.songTitle === item.title;

                return (
                  <View style={[styles.trackItem, isSelected && styles.selectedTrackItem]}>
                    {/* Play/Pause Button */}
                    <TouchableOpacity
                      style={[styles.playBtn, isPlaying && styles.activePlayBtn]}
                      onPress={() => handlePlayToggle(item)}
                      activeOpacity={0.7}
                    >
                      {isPlaying ? (
                        <Pause size={14} color={Colors.surface} />
                      ) : (
                        <Play size={14} color={Colors.primary} fill={Colors.primary} style={{ marginLeft: 2 }} />
                      )}
                    </TouchableOpacity>

                    {/* Track Info */}
                    <TouchableOpacity
                      style={styles.infoWrapper}
                      onPress={() => handleSelect(item)}
                      activeOpacity={0.7}
                    >
                      <Text style={styles.trackTitle} numberOfLines={1}>
                        {item.title}
                      </Text>
                      <Text style={styles.trackSubtitle} numberOfLines={1}>
                        {item.movie ? `${item.movie} • ` : ''}
                        {item.artist}
                      </Text>
                      {isSelected && (
                        <TouchableOpacity
                          style={styles.inlineTrimBtn}
                          onPress={() => setActiveTab('trim')}
                          activeOpacity={0.8}
                        >
                          <Sliders size={11} color={Colors.primary} />
                          <Text style={styles.inlineTrimBtnText}>
                            ✂️ Cut / Trim Start & Duration (Instagram Style)
                          </Text>
                        </TouchableOpacity>
                      )}
                    </TouchableOpacity>

                    {/* Duration & Select Indicator */}
                    <TouchableOpacity
                      style={styles.selectAction}
                      onPress={() => handleSelect(item)}
                      activeOpacity={0.7}
                    >
                      <Text style={styles.durationText}>{item.formattedDuration || '3:30'}</Text>
                      <View style={[styles.radioCircle, isSelected && styles.radioCircleActive]}>
                        {isSelected ? <Check size={12} color="#FFFFFF" strokeWidth={3} /> : null}
                      </View>
                    </TouchableOpacity>
                  </View>
                );
              }}
            />
          )}
        </View>
      )}

      {/* TAB 2: INSTAGRAM-STYLE MUSIC TRIMMER */}
      {activeTab === 'trim' && (
        <ScrollView style={styles.trimScrollView} showsVerticalScrollIndicator={false}>
          <View style={styles.trimContent}>
            {/* Active Track Banner */}
            <View style={styles.activeTrackBanner}>
              <TouchableOpacity
                style={styles.trimPlayBtn}
                onPress={() => handlePlayToggle(activeTrackObj, startTime)}
                activeOpacity={0.8}
              >
                {playingSource ? (
                  <Pause size={16} color={Colors.surface} />
                ) : (
                  <Play size={16} color={Colors.surface} style={{ marginLeft: 2 }} />
                )}
              </TouchableOpacity>
              <View style={styles.activeTrackText}>
                <Text style={styles.activeTrackTitle} numberOfLines={1}>
                  {activeTrackObj.title}
                </Text>
                <Text style={styles.activeTrackArtist} numberOfLines={1}>
                  {activeTrackObj.artist || 'Curated Sound'}
                </Text>
              </View>
              <View style={styles.timingPill}>
                <Clock size={11} color={Colors.champagneGold} />
                <Text style={styles.timingPillText}>
                  {formatTime(currentTime)} / {formatTime(trackDuration)}
                </Text>
              </View>
            </View>

            {/* Waveform Scrubber (Tap or Drag anywhere along waveform) */}
            <View style={styles.waveformContainer}>
              <View style={styles.waveformHeader}>
                <Text style={styles.waveformLabel}>🎵 AUDIO WAVEFORM (TAP TO CROP START):</Text>
                <Text style={styles.waveformTimeRange}>
                  From: <Text style={styles.highlightText}>{formatTime(startTime)}</Text> → To:{' '}
                  <Text style={styles.highlightText}>
                    {clipDuration > 0
                      ? formatTime(startTime + clipDuration)
                      : formatTime(trackDuration)}
                  </Text>
                  {clipDuration > 0 && <Text style={styles.clipDurationBadge}> ({clipDuration}s)</Text>}
                </Text>
              </View>

              {/* 36 Waveform Bars */}
              <View style={styles.barsRow}>
                {WAVEFORM_BARS.map((height, i) => {
                  const barTime = (i / WAVEFORM_BARS.length) * trackDuration;
                  const isHighlighted =
                    clipDuration === 0
                      ? barTime >= startTime
                      : barTime >= startTime && barTime <= startTime + clipDuration;
                  const isPlayed = playingSource && barTime <= currentTime;

                  return (
                    <TouchableOpacity
                      key={i}
                      onPress={() => handleSeek(Math.round(barTime))}
                      style={styles.barTouchable}
                      activeOpacity={0.6}
                    >
                      <View
                        style={[
                          styles.barLine,
                          { height: `${height}%` },
                          isHighlighted && styles.barLineHighlighted,
                          isPlayed && styles.barLinePlayed,
                        ]}
                      />
                    </TouchableOpacity>
                  );
                })}
              </View>

              {/* Stepper Controls */}
              <View style={styles.stepperRow}>
                <TouchableOpacity
                  style={styles.stepperBtn}
                  onPress={() => handleSeek(startTime - 5)}
                  activeOpacity={0.7}
                >
                  <Text style={styles.stepperBtnText}>- 5s</Text>
                </TouchableOpacity>

                <View style={styles.scrubberPositionBadge}>
                  <Text style={styles.scrubberPositionText}>
                    Start at: <Text style={{ fontWeight: '800', color: Colors.champagneGold }}>{formatTime(startTime)}</Text>
                  </Text>
                </View>

                <TouchableOpacity
                  style={styles.stepperBtn}
                  onPress={() => handleSeek(startTime + 5)}
                  activeOpacity={0.7}
                >
                  <Text style={styles.stepperBtnText}>+ 5s</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Instagram Story Clip Duration Selector */}
            <View style={styles.sectionBox}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>⏱️ CLIP DURATION (LIKE INSTAGRAM STORY):</Text>
                <Text style={styles.sectionStatus}>
                  {clipDuration > 0 ? `${clipDuration}s Loop` : 'Full Song'}
                </Text>
              </View>
              <View style={styles.clipGrid}>
                {CLIP_DURATIONS.map((dur) => {
                  const isSelected = clipDuration === dur.sec;
                  return (
                    <TouchableOpacity
                      key={dur.sec}
                      style={[styles.clipBtn, isSelected && styles.activeClipBtn]}
                      onPress={() => {
                        setClipDuration(dur.sec);
                        if (playingSource) {
                          MusicService.seekTo(startTime);
                        }
                      }}
                      activeOpacity={0.7}
                    >
                      <Text style={[styles.clipBtnLabel, isSelected && styles.activeClipBtnLabel]}>
                        {dur.label}
                      </Text>
                      <Text style={[styles.clipBtnSub, isSelected && styles.activeClipBtnSub]}>
                        {dur.sub}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            {/* Quick Start Presets */}
            <View style={styles.sectionBox}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>⚡ START TIME PRESETS:</Text>
              </View>
              <View style={styles.presetRow}>
                {PRESETS.map((preset) => {
                  const isSelected = startTime === preset.sec;
                  return (
                    <TouchableOpacity
                      key={preset.sec}
                      style={[styles.presetChip, isSelected && styles.activePresetChip]}
                      onPress={() => handleSeek(preset.sec)}
                      activeOpacity={0.7}
                    >
                      <Text style={[styles.presetChipText, isSelected && styles.activePresetChipText]}>
                        {preset.label}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            {/* Apply & Save Action */}
            <View style={styles.actionRow}>
              <TouchableOpacity
                style={styles.applyBtn}
                onPress={handleApplyTrim}
                activeOpacity={0.8}
              >
                <Sparkles size={16} color={Colors.surface} />
                <Text style={styles.applyBtnText}>
                  {appliedToast ? '✓ Trim Applied & Saved!' : 'Apply & Save Segment'}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.resetBtn}
                onPress={() => {
                  setStartTime(0);
                  setClipDuration(0);
                  setMusicTiming(0, 0);
                  if (playingSource) MusicService.seekTo(0);
                }}
                activeOpacity={0.7}
              >
                <RotateCcw size={14} color={Colors.textSecondary} />
                <Text style={styles.resetBtnText}>Reset to Full Song</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  sheetContainer: {
    backgroundColor: Colors.surface,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 12,
    borderTopWidth: 1,
    borderColor: Colors.border,
    height: 420,
    elevation: 14,
    shadowColor: Colors.textPrimary,
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 8,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Colors.divider,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  title: {
    fontFamily: 'serif',
    fontSize: 15,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  closeBtn: {
    padding: 4,
  },
  modeTabsRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 8,
    gap: 8,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Colors.divider,
    backgroundColor: '#FAF5EE',
  },
  modeTab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 7,
    borderRadius: 16,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    gap: 6,
  },
  activeModeTab: {
    backgroundColor: Colors.primary,
    borderColor: Colors.deepBurgundy,
  },
  modeTabText: {
    fontSize: 11.5,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  activeModeTabText: {
    color: Colors.surface,
  },
  trimmedIndicator: {
    backgroundColor: Colors.champagneGold,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  trimmedIndicatorText: {
    fontSize: 9,
    fontWeight: '800',
    color: Colors.deepBurgundy,
  },
  tabContent: {
    flex: 1,
  },
  categoryRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 8,
    gap: 6,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Colors.divider,
  },
  catChip: {
    paddingVertical: 5,
    paddingHorizontal: 11,
    borderRadius: 14,
    backgroundColor: Colors.cream,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  activeCatChip: {
    backgroundColor: Colors.primary,
    borderColor: Colors.deepBurgundy,
  },
  catChipText: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  activeCatChipText: {
    color: Colors.surface,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    gap: 8,
    paddingBottom: 20,
  },
  trackItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 14,
    backgroundColor: '#FFFDF9',
    borderWidth: 1,
    borderColor: Colors.border,
    gap: 10,
  },
  selectedTrackItem: {
    borderColor: Colors.champagneGold,
    backgroundColor: 'rgba(216, 183, 123, 0.1)',
  },
  playBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.cream,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  activePlayBtn: {
    backgroundColor: Colors.primary,
    borderColor: Colors.deepBurgundy,
  },
  infoWrapper: {
    flex: 1,
  },
  trackTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  trackSubtitle: {
    fontSize: 11,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  inlineTrimBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    gap: 4,
  },
  inlineTrimBtnText: {
    fontSize: 10.5,
    fontWeight: '700',
    color: Colors.primary,
    textDecorationLine: 'underline',
  },
  selectAction: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  durationText: {
    fontSize: 11,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  radioCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioCircleActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  centerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  loadingText: {
    fontSize: 12,
    color: Colors.textSecondary,
  },

  /* TRIMMER STYLES */
  trimScrollView: {
    flex: 1,
  },
  trimContent: {
    padding: 14,
    gap: 12,
    paddingBottom: 24,
  },
  activeTrackBanner: {
    backgroundColor: Colors.deepBurgundy,
    borderRadius: 14,
    padding: 10,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.champagneGold,
    gap: 10,
  },
  trimPlayBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeTrackText: {
    flex: 1,
  },
  activeTrackTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.surface,
  },
  activeTrackArtist: {
    fontSize: 11,
    color: Colors.champagneGold,
    marginTop: 1,
  },
  timingPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 10,
  },
  timingPillText: {
    fontSize: 10.5,
    fontFamily: 'monospace',
    color: Colors.surface,
  },
  waveformContainer: {
    backgroundColor: '#1E1418',
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: 'rgba(216, 183, 123, 0.4)',
  },
  waveformHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  waveformLabel: {
    fontSize: 9.5,
    fontWeight: '700',
    color: Colors.champagneGold,
    letterSpacing: 0.5,
  },
  waveformTimeRange: {
    fontSize: 10,
    color: '#E0D0C5',
    fontFamily: 'monospace',
  },
  highlightText: {
    color: Colors.champagneGold,
    fontWeight: '700',
  },
  clipDurationBadge: {
    color: '#F4D28D',
    fontWeight: '800',
  },
  barsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 48,
    paddingHorizontal: 4,
    gap: 2,
  },
  barTouchable: {
    flex: 1,
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  barLine: {
    width: 3.5,
    borderRadius: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  barLineHighlighted: {
    backgroundColor: Colors.champagneGold,
    shadowColor: Colors.champagneGold,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
  },
  barLinePlayed: {
    backgroundColor: '#FF7B90',
  },
  stepperRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 10,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
  },
  stepperBtn: {
    paddingVertical: 5,
    paddingHorizontal: 12,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
  },
  stepperBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.surface,
  },
  scrubberPositionBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  scrubberPositionText: {
    fontSize: 11,
    color: '#E0D0C5',
  },
  sectionBox: {
    backgroundColor: Colors.surface,
    borderRadius: 14,
    padding: 10,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.primary,
    letterSpacing: 0.5,
  },
  sectionStatus: {
    fontSize: 10,
    fontFamily: 'monospace',
    color: Colors.champagneGold,
    fontWeight: '700',
  },
  clipGrid: {
    flexDirection: 'row',
    gap: 6,
  },
  clipBtn: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 6,
    borderRadius: 10,
    backgroundColor: Colors.cream,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  activeClipBtn: {
    backgroundColor: Colors.primary,
    borderColor: Colors.deepBurgundy,
  },
  clipBtnLabel: {
    fontSize: 11.5,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  activeClipBtnLabel: {
    color: Colors.surface,
  },
  clipBtnSub: {
    fontSize: 9,
    color: Colors.textSecondary,
    marginTop: 1,
  },
  activeClipBtnSub: {
    color: Colors.champagneGold,
  },
  presetRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  presetChip: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 12,
    backgroundColor: Colors.cream,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  activePresetChip: {
    backgroundColor: Colors.deepBurgundy,
    borderColor: Colors.champagneGold,
  },
  presetChipText: {
    fontSize: 10.5,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  activePresetChipText: {
    color: Colors.champagneGold,
  },
  actionRow: {
    gap: 8,
    marginTop: 4,
  },
  applyBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 11,
    borderRadius: 16,
    backgroundColor: Colors.primary,
    gap: 6,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 5,
    elevation: 4,
  },
  applyBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.surface,
  },
  resetBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Colors.border,
    gap: 6,
  },
  resetBtnText: {
    fontSize: 11.5,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
});

export default MusicSelectionSheet;
