import { Track, Playlist, UserProfile, EqualizerBands, EqualizerPreset } from '../types';
import { INITIAL_PLAYLISTS, INITIAL_USER } from '../data/mockData';

const STORAGE_KEYS = {
  PLAYLISTS: 'spotify_clone_playlists',
  LIKED_TRACKS: 'spotify_clone_liked_tracks',
  DOWNLOADED_TRACKS: 'spotify_clone_downloaded_tracks',
  USER_PROFILE: 'spotify_clone_user_profile',
  EQ_BANDS: 'spotify_clone_eq_bands',
  EQ_PRESET: 'spotify_clone_eq_preset',
  RECENT_TRACKS: 'spotify_clone_recent_tracks',
  STREAMING_QUALITY: 'spotify_clone_streaming_quality',
  OFFLINE_MODE: 'spotify_clone_offline_mode'
};

export const storageService = {
  getPlaylists(): Playlist[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.PLAYLISTS);
      if (data) return JSON.parse(data);
    } catch {
      // ignore
    }
    return INITIAL_PLAYLISTS;
  },

  savePlaylists(playlists: Playlist[]) {
    try {
      localStorage.setItem(STORAGE_KEYS.PLAYLISTS, JSON.stringify(playlists));
    } catch {
      // ignore
    }
  },

  getLikedTrackIds(): string[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.LIKED_TRACKS);
      if (data) return JSON.parse(data);
    } catch {
      // ignore
    }
    return ['track-1', 'track-2', 'track-5', 'track-3'];
  },

  saveLikedTrackIds(ids: string[]) {
    try {
      localStorage.setItem(STORAGE_KEYS.LIKED_TRACKS, JSON.stringify(ids));
    } catch {
      // ignore
    }
  },

  getDownloadedTrackIds(): string[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.DOWNLOADED_TRACKS);
      if (data) return JSON.parse(data);
    } catch {
      // ignore
    }
    return ['track-1', 'track-3', 'track-8']; // Initially 3 downloaded tracks
  },

  saveDownloadedTrackIds(ids: string[]) {
    try {
      localStorage.setItem(STORAGE_KEYS.DOWNLOADED_TRACKS, JSON.stringify(ids));
    } catch {
      // ignore
    }
  },

  getUserProfile(): UserProfile {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.USER_PROFILE);
      if (data) return JSON.parse(data);
    } catch {
      // ignore
    }
    return INITIAL_USER;
  },

  saveUserProfile(profile: UserProfile) {
    try {
      localStorage.setItem(STORAGE_KEYS.USER_PROFILE, JSON.stringify(profile));
    } catch {
      // ignore
    }
  },

  getRecentTrackIds(): string[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.RECENT_TRACKS);
      if (data) return JSON.parse(data);
    } catch {
      // ignore
    }
    return ['track-1', 'track-2', 'track-4'];
  },

  saveRecentTrackIds(ids: string[]) {
    try {
      localStorage.setItem(STORAGE_KEYS.RECENT_TRACKS, JSON.stringify(ids.slice(0, 30)));
    } catch {
      // ignore
    }
  },

  getEqPreset(): EqualizerPreset {
    try {
      const p = localStorage.getItem(STORAGE_KEYS.EQ_PRESET);
      if (p) return p as EqualizerPreset;
    } catch {
      // ignore
    }
    return 'hifi_clarity';
  },

  saveEqPreset(preset: EqualizerPreset) {
    try {
      localStorage.setItem(STORAGE_KEYS.EQ_PRESET, preset);
    } catch {
      // ignore
    }
  },

  getEqBands(): EqualizerBands | null {
    try {
      const b = localStorage.getItem(STORAGE_KEYS.EQ_BANDS);
      if (b) return JSON.parse(b);
    } catch {
      // ignore
    }
    return null;
  },

  saveEqBands(bands: EqualizerBands) {
    try {
      localStorage.setItem(STORAGE_KEYS.EQ_BANDS, JSON.stringify(bands));
    } catch {
      // ignore
    }
  },

  getOfflineMode(): boolean {
    try {
      return localStorage.getItem(STORAGE_KEYS.OFFLINE_MODE) === 'true';
    } catch {
      return false;
    }
  },

  saveOfflineMode(active: boolean) {
    try {
      localStorage.setItem(STORAGE_KEYS.OFFLINE_MODE, active ? 'true' : 'false');
    } catch {
      // ignore
    }
  }
};
