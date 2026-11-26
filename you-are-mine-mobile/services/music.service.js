import { requireOptionalNativeModule } from 'expo-modules-core';
import { apiClient } from './api';
import { Config } from '../constants/config';

// Safe lazy loading of expo-av to prevent top-level module crash when ExponentAV is absent in client
let cachedAudio = null;
let hasCheckedAudio = false;

function getAudio() {
  if (hasCheckedAudio) return cachedAudio;
  hasCheckedAudio = true;

  try {
    const hasNativeAV = typeof requireOptionalNativeModule === 'function'
      ? requireOptionalNativeModule('ExponentAV')
      : (globalThis.expo?.modules?.ExponentAV || null);

    if (!hasNativeAV) {
      console.warn('[MusicService] ExponentAV native audio module not available in this environment. Audio playback gracefully disabled.');
      cachedAudio = null;
      return null;
    }

    const expoAv = require('expo-av');
    cachedAudio = expoAv?.Audio || null;
  } catch (err) {
    console.warn('[MusicService] ExponentAV native audio module not available in this environment:', err?.message);
    cachedAudio = null;
  }
  return cachedAudio;
}

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
      const Audio = getAudio();
      if (!Audio) {
        console.warn('[MusicService] Playback skipped: ExponentAV native audio module is not available.');
        return { isPlaying: false, isLoaded: false };
      }

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

      let resolvedUri = audioUrl;
      if (typeof audioUrl === 'string') {
        if (!audioUrl.startsWith('http://') && !audioUrl.startsWith('https://') && !audioUrl.startsWith('file://')) {
          const cleanPath = audioUrl.startsWith('/') ? audioUrl : `/${audioUrl}`;
          resolvedUri = `${Config.API_BASE_URL}${cleanPath}`;
        }
      }

      const { sound } = await Audio.Sound.createAsync(
        { uri: resolvedUri },
        { shouldPlay: true, isLooping: true, positionMillis: initialPositionMillis },
        onStatusUpdate
      );

      activeSound = sound;
      currentPlayingSource = audioUrl;

      return { isPlaying: true, isLoaded: true };
    } catch (error) {
      console.warn('Audio playback error:', error.message);
      await this.stopPreview();
      return { isPlaying: false, isLoaded: false };
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
   * Resilient alias for playPreview supporting both callback functions and options objects.
   */
  async playSound(audioUrl, optionsOrStatusUpdate = null, startSeconds = 0) {
    let onStatusUpdate = null;
    let actualStartSec = startSeconds;

    if (typeof optionsOrStatusUpdate === 'function') {
      onStatusUpdate = optionsOrStatusUpdate;
    } else if (optionsOrStatusUpdate && typeof optionsOrStatusUpdate === 'object') {
      if (typeof optionsOrStatusUpdate.onStatusUpdate === 'function') {
        onStatusUpdate = optionsOrStatusUpdate.onStatusUpdate;
      }
      if (typeof optionsOrStatusUpdate.startTime === 'number') {
        actualStartSec = optionsOrStatusUpdate.startTime;
      }
    }

    return this.playPreview(audioUrl, onStatusUpdate, actualStartSec);
  },

  /**
   * Alias for stopPreview.
   */
  async stopSound() {
    return this.stopPreview();
  },

  /**
   * Standard audio playback aliases for modern templates
   */
  async stop() {
    return this.stopPreview();
  },

  async pause() {
    return this.pauseSound();
  },

  async play(audioUrl = null, optionsOrStatusUpdate = null, startSeconds = 0) {
    if (audioUrl) {
      return this.playSound(audioUrl, optionsOrStatusUpdate, startSeconds);
    }
    try {
      if (activeSound) {
        await activeSound.playAsync();
        return { isPlaying: true, isLoaded: true };
      }
    } catch (e) {}
    return { isPlaying: false, isLoaded: false };
  },

  async loadTrack(audioUrl, options = null) {
    return this.playSound(audioUrl, options);
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
