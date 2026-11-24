import { Audio } from 'expo-av';
import { apiClient } from './api';
import { Config } from '../constants/config';

let activeSound = null;
let currentPlayingSource = null;

export const MusicService = {
  /**
   * Fetches curated soundtrack library from existing GET /api/music endpoint.
   */
  async getCuratedTracks(category = 'All', search = '') {
    try {
      const params = {};
      if (category && category !== 'All') params.category = category;
      if (search && search.trim()) params.search = search.trim();

      const raw = await apiClient.get('/api/music', { params });
      const tracks = Array.isArray(raw) ? raw : (raw?.data || []);
      const categories = raw?.categories || ['All', 'Wedding', 'Birthday', 'Proposal', 'Valentine'];

      return {
        categories,
        total: raw?.total || tracks.length,
        tracks: tracks.map((t) => ({
          ...t,
          fullAudioUrl: t.source?.startsWith('http')
            ? t.source
            : `${Config.API_BASE_URL}${t.source}`,
          formattedDuration: t.duration
            ? `${Math.floor(t.duration / 60)}:${String(t.duration % 60).padStart(2, '0')}`
            : '3:45',
        })),
      };
    } catch (error) {
      console.warn('Failed to load music tracks:', error.message);
      return {
        categories: ['All', 'Wedding', 'Birthday', 'Proposal', 'Valentine'],
        total: 0,
        tracks: [],
      };
    }
  },

  /**
   * Starts playback preview for a track. Stops any currently playing audio.
   */
  async playPreview(audioUrl, onStatusUpdate = null) {
    try {
      // If already playing this track, pause/toggle
      if (activeSound && currentPlayingSource === audioUrl) {
        const status = await activeSound.getStatusAsync();
        if (status.isLoaded) {
          if (status.isPlaying) {
            await activeSound.pauseAsync();
            return { isPlaying: false, isLoaded: true };
          } else {
            await activeSound.playAsync();
            return { isPlaying: true, isLoaded: true };
          }
        }
      }

      // Unload previous sound if any
      await this.stopPreview();

      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
        playsInSilentModeIOS: true,
        staysActiveInBackground: false,
        shouldDuckAndroid: true,
      });

      const { sound } = await Audio.Sound.createAsync(
        { uri: audioUrl },
        { shouldPlay: true, isLooping: true },
        onStatusUpdate
      );

      activeSound = sound;
      currentPlayingSource = audioUrl;

      return { isPlaying: true, isLoaded: true };
    } catch (error) {
      console.warn('Audio playback error:', error.message);
      await this.stopPreview();
      throw error;
    }
  },

  /**
   * Stops and releases current audio preview.
   */
  async stopPreview() {
    try {
      if (activeSound) {
        await activeSound.stopAsync();
        await activeSound.unloadAsync();
      }
    } catch (e) {
      // Ignore unload errors on disposed sounds
    } finally {
      activeSound = null;
      currentPlayingSource = null;
    }
  },

  /**
   * Returns current playing source URL if any.
   */
  getCurrentPlayingSource() {
    return currentPlayingSource;
  },
};

export default MusicService;
