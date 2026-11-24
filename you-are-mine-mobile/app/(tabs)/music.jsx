import React, { useState, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  Music2,
  Play,
  Pause,
  Search,
  X,
  Volume2,
  Disc3,
  Clock,
  Sparkles,
} from 'lucide-react-native';
import { Header } from '../../components/common/Header';
import { Colors } from '../../constants/colors';
import { MusicService } from '../../services/music.service';

export default function MusicScreen() {
  const [category, setCategory] = useState('All');
  const [search, setSearch] = useState('');
  const [tracks, setTracks] = useState([]);
  const [categories, setCategories] = useState(['All', 'Wedding', 'Birthday', 'Proposal', 'Valentine']);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [playingSource, setPlayingSource] = useState(null);
  const [currentTrack, setCurrentTrack] = useState(null);

  const loadTracks = async (cat = category, q = search) => {
    try {
      setLoading(true);
      const data = await MusicService.getCuratedTracks(cat, q);
      setTracks(data.tracks || []);
      if (data.categories?.length) {
        setCategories(data.categories);
      }
    } catch (e) {
      console.warn('Track load error:', e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadTracks(category, search);
  }, [category, search]);

  useEffect(() => {
    return () => {
      MusicService.stopPreview();
    };
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    loadTracks(category, search);
  };

  const handlePlayToggle = async (track) => {
    try {
      if (playingSource === track.fullAudioUrl) {
        await MusicService.stopPreview();
        setPlayingSource(null);
        setCurrentTrack(null);
      } else {
        setPlayingSource(track.fullAudioUrl);
        setCurrentTrack(track);
        await MusicService.playPreview(track.fullAudioUrl, (status) => {
          if (status.didJustFinish) {
            setPlayingSource(null);
            setCurrentTrack(null);
          }
        });
      }
    } catch {
      setPlayingSource(null);
      setCurrentTrack(null);
    }
  };

  const renderTrackItem = ({ item, index }) => {
    const isPlaying = playingSource === item.fullAudioUrl;

    return (
      <View style={[styles.trackCard, isPlaying && styles.trackCardPlaying]}>
        {/* Track Icon / Number */}
        <TouchableOpacity
          style={[styles.playButtonCircle, isPlaying && styles.playButtonCircleActive]}
          onPress={() => handlePlayToggle(item)}
          activeOpacity={0.8}
        >
          {isPlaying ? (
            <Pause size={18} color={Colors.surface} />
          ) : (
            <Play size={18} color={Colors.surface} style={{ marginLeft: 2 }} />
          )}
        </TouchableOpacity>

        {/* Track Metadata */}
        <TouchableOpacity 
          style={styles.trackDetails} 
          onPress={() => handlePlayToggle(item)}
          activeOpacity={0.7}
        >
          <View style={styles.trackTitleRow}>
            <Text style={[styles.trackTitle, isPlaying && styles.trackTitleActive]} numberOfLines={1}>
              {item.title}
            </Text>
            {isPlaying && (
              <View style={styles.playingPill}>
                <Volume2 size={12} color={Colors.surface} />
                <Text style={styles.playingPillText}>PLAYING</Text>
              </View>
            )}
          </View>

          <Text style={styles.trackArtist} numberOfLines={1}>
            {item.movie ? `${item.movie} • ` : ''}{item.artist}
          </Text>

          <View style={styles.trackMetaRow}>
            <View style={styles.categoryBadge}>
              <Text style={styles.categoryBadgeText}>{(item.category || 'Wedding').toUpperCase()}</Text>
            </View>
            {item.tag ? (
              <Text style={styles.tagText} numberOfLines={1}>
                {item.tag}
              </Text>
            ) : null}
            <View style={styles.durationRow}>
              <Clock size={11} color={Colors.textSecondary} />
              <Text style={styles.durationText}>{item.formattedDuration || '3:30'}</Text>
            </View>
          </View>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <Header />

      {/* Hero Banner with Logo & Sound Library Title */}
      <View style={styles.heroBanner}>
        <View style={styles.heroTextContainer}>
          <View style={styles.heroBadge}>
            <Sparkles size={12} color={Colors.champagneGold} />
            <Text style={styles.heroBadgeText}>BESPOKE AUDIO EXPERIENCE</Text>
          </View>
          <Text style={styles.heroTitle}>Curated Soundtrack Library</Text>
          <Text style={styles.heroSubtitle}>
            116+ Timeless Indian Wedding, Romantic & Celebration Anthems
          </Text>
        </View>
        <Image
          source={require('../../assets/logo-icon.png')}
          style={styles.heroLogoIcon}
          resizeMode="contain"
        />
      </View>

      {/* Search Input */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Search size={18} color={Colors.textSecondary} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search wedding songs, artists, movies..."
            placeholderTextColor={Colors.textSecondary}
            value={search}
            onChangeText={setSearch}
            returnKeyType="search"
          />
          {search ? (
            <TouchableOpacity onPress={() => setSearch('')} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
              <X size={16} color={Colors.textSecondary} />
            </TouchableOpacity>
          ) : null}
        </View>
      </View>

      {/* Category Filter Pills */}
      <View style={styles.categoryScrollContainer}>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={categories}
          keyExtractor={(cat) => cat}
          contentContainerStyle={styles.categoryList}
          renderItem={({ item: cat }) => {
            const isSelected = category === cat;
            return (
              <TouchableOpacity
                style={[styles.categoryChip, isSelected && styles.categoryChipSelected]}
                onPress={() => setCategory(cat)}
                activeOpacity={0.7}
              >
                <Text style={[styles.categoryChipText, isSelected && styles.categoryChipTextSelected]}>
                  {cat}
                </Text>
              </TouchableOpacity>
            );
          }}
        />
      </View>

      {/* Track List */}
      {loading && !refreshing ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="small" color={Colors.primary} />
          <Text style={styles.loadingText}>Loading royal melodies...</Text>
        </View>
      ) : (
        <FlatList
          data={tracks}
          keyExtractor={(item) => String(item.id || item.number || item.title)}
          renderItem={renderTrackItem}
          contentContainerStyle={[styles.listContent, playingSource && { paddingBottom: 110 }]}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              colors={[Colors.primary]}
              tintColor={Colors.primary}
            />
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Disc3 size={44} color={Colors.champagneGold} />
              <Text style={styles.emptyTitle}>No melodies found</Text>
              <Text style={styles.emptySubtitle}>Try adjusting your search or category filter</Text>
            </View>
          }
        />
      )}

      {/* Floating Now-Playing Bar */}
      {currentTrack && (
        <View style={styles.nowPlayingBar}>
          <View style={styles.nowPlayingLeft}>
            <View style={styles.nowPlayingDisc}>
              <Disc3 size={20} color={Colors.champagneGold} />
            </View>
            <View style={styles.nowPlayingInfo}>
              <Text style={styles.nowPlayingTitle} numberOfLines={1}>
                {currentTrack.title}
              </Text>
              <Text style={styles.nowPlayingArtist} numberOfLines={1}>
                {currentTrack.artist}
              </Text>
            </View>
          </View>
          <TouchableOpacity
            style={styles.nowPlayingBtn}
            onPress={() => handlePlayToggle(currentTrack)}
            activeOpacity={0.8}
          >
            {playingSource ? (
              <Pause size={18} color={Colors.surface} />
            ) : (
              <Play size={18} color={Colors.surface} style={{ marginLeft: 2 }} />
            )}
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  heroBanner: {
    backgroundColor: Colors.deepBurgundy,
    marginHorizontal: 16,
    marginTop: 10,
    marginBottom: 8,
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: Colors.champagneGold,
  },
  heroTextContainer: {
    flex: 1,
    paddingRight: 12,
  },
  heroBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  heroBadgeText: {
    color: Colors.champagneGold,
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1,
  },
  heroTitle: {
    color: Colors.surface,
    fontSize: 17,
    fontWeight: '700',
    fontFamily: 'serif',
  },
  heroSubtitle: {
    color: Colors.mutedGold,
    fontSize: 12,
    marginTop: 2,
    lineHeight: 16,
  },
  heroLogoIcon: {
    width: 44,
    height: 44,
  },
  searchContainer: {
    paddingHorizontal: 16,
    paddingVertical: 6,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 44,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    color: Colors.textPrimary,
    marginLeft: 8,
  },
  categoryScrollContainer: {
    marginBottom: 6,
  },
  categoryList: {
    paddingHorizontal: 16,
    gap: 8,
    paddingVertical: 4,
  },
  categoryChip: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  categoryChipSelected: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  categoryChipText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  categoryChipTextSelected: {
    color: Colors.surface,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 40,
    paddingTop: 4,
  },
  trackCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: 14,
    padding: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: Colors.goldLight,
  },
  trackCardPlaying: {
    borderColor: Colors.primary,
    backgroundColor: '#FFF4F5',
  },
  playButtonCircle: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  playButtonCircleActive: {
    backgroundColor: Colors.deepBurgundy,
  },
  trackDetails: {
    flex: 1,
  },
  trackTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 2,
  },
  trackTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.textPrimary,
    fontFamily: 'serif',
    flex: 1,
    marginRight: 6,
  },
  trackTitleActive: {
    color: Colors.primary,
  },
  playingPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colors.primary,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  playingPillText: {
    color: Colors.surface,
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  trackArtist: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginBottom: 6,
  },
  trackMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  categoryBadge: {
    backgroundColor: '#F7EFE1',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  categoryBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.primary,
  },
  tagText: {
    fontSize: 11,
    color: Colors.textSecondary,
    flex: 1,
  },
  durationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  durationText: {
    fontSize: 11,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  centerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 60,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 13,
    color: Colors.textSecondary,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginTop: 12,
  },
  emptySubtitle: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginTop: 4,
  },
  nowPlayingBar: {
    position: 'absolute',
    bottom: 12,
    left: 16,
    right: 16,
    backgroundColor: Colors.deepBurgundy,
    borderRadius: 14,
    padding: 10,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: Colors.champagneGold,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
  },
  nowPlayingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 10,
  },
  nowPlayingDisc: {
    marginRight: 10,
  },
  nowPlayingInfo: {
    flex: 1,
  },
  nowPlayingTitle: {
    color: Colors.surface,
    fontSize: 13,
    fontWeight: '700',
  },
  nowPlayingArtist: {
    color: Colors.mutedGold,
    fontSize: 11,
    marginTop: 1,
  },
  nowPlayingBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
