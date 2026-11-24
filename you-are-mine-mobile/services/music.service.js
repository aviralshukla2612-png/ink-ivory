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
  async playPreview(audioUrl, onStatusUpdate = null, startSeconds = 0) {
    try {
      // If already playing this track, pause/toggle
      if (activeSound && currentPlayingSource === audioUrl) {
        const status = await activeSound.getStatusAsync();
        if (status.isLoaded) {
          if (status.isPlaying) {
            await activeSound.pauseAsync();
            return { isPlaying: false, isLoaded: true };
          } else {
            if (startSeconds > 0 && Math.abs((status.positionMillis || 0) / 1000 - startSeconds) > 2) {
              await activeSound.setPositionAsync(Math.max(0, Math.floor(startSeconds * 1000)));
            }
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

      const initialPositionMillis = Math.max(0, Math.floor((Number(startSeconds) || 0) * 1000));

      const { sound } = await Audio.Sound.createAsync(
        { uri: audioUrl },
        { shouldPlay: true, isLooping: true, positionMillis: initialPositionMillis },
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
   * Seeks currently playing audio to target position in seconds.
   */
  async seekTo(seconds) {
    try {
      if (activeSound) {
        const targetMillis = Math.max(0, Math.floor(seconds * 1000));
        await activeSound.setPositionAsync(targetMillis);
      }
    } catch (err) {
      console.warn('Seek error:', err.message);
    }
  },

  /**
   * Pauses active audio.
   */
  async pauseSound() {
    try {
      if (activeSound) {
        await activeSound.pauseAsync();
      }
    } catch (e) {}
  },

  /**
   * Alias for playPreview to support floating audio player.
   */
  async playSound(audioUrl, onStatusUpdate, startSeconds = 0) {
    return this.playPreview(audioUrl, onStatusUpdate, startSeconds);
  },

  /**
   * Alias for stopPreview.
   */
  async stopSound() {
    return this.stopPreview();
  },

  /**
   * Direct handle to active Expo Audio.Sound instance.
   */
  get soundInstance() {
    return activeSound;
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
