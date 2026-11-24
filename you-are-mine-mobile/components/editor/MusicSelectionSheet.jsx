import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  TextInput,
} from 'react-native';
import { Music2, Play, Pause, Check, Search, X, Volume2 } from 'lucide-react-native';
import { Colors } from '../../constants/colors';
import { MusicService } from '../../services/music.service';
import { useEditorStore } from '../../store/editor.store';

export function MusicSelectionSheet() {
  const { music, selectMusicTrack, setActiveTool } = useEditorStore();

  const [category, setCategory] = useState('All');
  const [search, setSearch] = useState('');
  const [tracks, setTracks] = useState([]);
  const [categories, setCategories] = useState(['All', 'Wedding', 'Birthday', 'Proposal', 'Valentine']);
  const [loading, setLoading] = useState(true);
  const [playingSource, setPlayingSource] = useState(null);

  useEffect(() => {
    let isMounted = true;

    async function loadTracks() {
      try {
        setLoading(true);
        const data = await MusicService.getCuratedTracks(category, search);
        if (isMounted) {
          setTracks(data.tracks);
          setCategories(data.categories);
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
      // Cleanly stop audio playback when sheet is unmounted
      MusicService.stopPreview();
    };
  }, []);

  const handlePlayToggle = async (track) => {
    try {
      if (playingSource === track.fullAudioUrl) {
        await MusicService.stopPreview();
        setPlayingSource(null);
      } else {
        setPlayingSource(track.fullAudioUrl);
        await MusicService.playPreview(track.fullAudioUrl, (status) => {
          if (status.didJustFinish) {
            setPlayingSource(null);
          }
        });
      }
    } catch (e) {
      setPlayingSource(null);
    }
  };

  const handleSelect = (track) => {
    selectMusicTrack(track);
  };

  return (
    <View style={styles.sheetContainer}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <Music2 size={18} color={Colors.primary} />
          <Text style={styles.title}>Royal Soundtrack Library</Text>
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

      {/* Category Pills */}
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
          keyExtractor={(item) => item.id}
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
                    <Pause size={14} color={Colors.textLight} />
                  ) : (
                    <Play size={14} color={Colors.primary} fill={Colors.primary} />
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
                </TouchableOpacity>

                {/* Duration & Select Indicator */}
                <TouchableOpacity
                  style={styles.selectAction}
                  onPress={() => handleSelect(item)}
                  activeOpacity={0.7}
                >
                  <Text style={styles.durationText}>{item.formattedDuration}</Text>
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
    height: 320,
    elevation: 12,
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
    paddingBottom: 10,
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
    color: Colors.textLight,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    gap: 8,
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
});

export default MusicSelectionSheet;
