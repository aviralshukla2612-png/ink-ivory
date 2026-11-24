import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { Play, Pause, Volume2, VolumeX, Music } from 'lucide-react-native';
import { Colors } from '../../constants/colors';
import { MusicService } from '../../services/music.service.js';

/**
 * FloatingAudioPlayer
 * Floating audio control pill shown when an invitation draft/publication has an attached track.
 */
export function FloatingAudioPlayer({
  trackUrl,
  trackTitle = 'Bespoke Celebration Melody',
  autoPlay = false,
}) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [position, setPosition] = useState(0);
  const [duration, setDuration] = useState(180000); // 3 mins default
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    let isMounted = true;

    if (trackUrl && autoPlay) {
      handleTogglePlay();
    }

    return () => {
      isMounted = false;
      MusicService.stopSound().catch(() => {});
    };
  }, [trackUrl]);

  const handleTogglePlay = async () => {
    if (!trackUrl) return;

    if (isPlaying) {
      await MusicService.pauseSound();
      setIsPlaying(false);
    } else {
      setIsLoading(true);
      try {
        await MusicService.playSound(trackUrl, (status) => {
          if (status.isLoaded) {
            setPosition(status.positionMillis || 0);
            if (status.durationMillis) {
              setDuration(status.durationMillis);
            }
            if (status.didJustFinish) {
              setIsPlaying(false);
              setPosition(0);
            }
          }
        });
        setIsPlaying(true);
      } catch (err) {
        console.warn('FloatingAudioPlayer error:', err.message);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleToggleMute = async () => {
    if (MusicService.soundInstance) {
      const nextMuted = !isMuted;
      await MusicService.soundInstance.setIsMutedAsync(nextMuted);
      setIsMuted(nextMuted);
    }
  };

  const formatTime = (millis) => {
    const totalSeconds = Math.floor(millis / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  if (!trackUrl) return null;

  return (
    <View style={styles.floatingContainer}>
      <View style={styles.pillCard}>
        {/* Play/Pause Button */}
        <TouchableOpacity
          style={styles.playButton}
          onPress={handleTogglePlay}
          activeOpacity={0.8}
          disabled={isLoading}
          accessibilityLabel={isPlaying ? 'Pause music' : 'Play music'}
        >
          {isLoading ? (
            <ActivityIndicator size="small" color={Colors.champagne} />
          ) : isPlaying ? (
            <Pause size={18} color={Colors.champagne} fill={Colors.champagne} />
          ) : (
            <Play size={18} color={Colors.champagne} fill={Colors.champagne} />
          )}
        </TouchableOpacity>

        {/* Track Details */}
        <View style={styles.trackInfo}>
          <View style={styles.titleRow}>
            <Music size={12} color={Colors.gold} style={styles.musicNote} />
            <Text style={styles.trackTitle} numberOfLines={1}>
              {trackTitle}
            </Text>
          </View>
          <Text style={styles.timeCounter}>
            {formatTime(position)} / {formatTime(duration)}
          </Text>
        </View>

        {/* Mute/Volume Toggle */}
        <TouchableOpacity
          style={styles.volumeButton}
          onPress={handleToggleMute}
          activeOpacity={0.7}
          accessibilityLabel={isMuted ? 'Unmute audio' : 'Mute audio'}
        >
          {isMuted ? (
            <VolumeX size={18} color={Colors.textSecondary} />
          ) : (
            <Volume2 size={18} color={Colors.gold} />
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  floatingContainer: {
    position: 'absolute',
    bottom: 84, // Above bottom bar
    left: 20,
    right: 20,
    zIndex: 100,
    alignItems: 'center',
  },
  pillCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(31, 25, 22, 0.92)',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: 'rgba(216, 183, 123, 0.45)',
    elevation: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    width: '100%',
    maxWidth: 360,
  },
  playButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    borderWidth: 1,
    borderColor: Colors.gold,
  },
  trackInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  musicNote: {
    marginRight: 6,
  },
  trackTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFF9F2',
    fontFamily: 'serif',
    flex: 1,
  },
  timeCounter: {
    fontSize: 10,
    color: '#D8B77B',
    fontWeight: '500',
  },
  volumeButton: {
    width: 34,
    height: 34,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
});

export default FloatingAudioPlayer;
