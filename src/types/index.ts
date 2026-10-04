export interface Track {
  id: string;
  title: string;
  artist: string;
  artistId: string;
  album: string;
  duration: number; // in seconds
  coverUrl: string;
  accentColor: string;
  genre: string;
  releaseYear: number;
  bpm: number;
  key: string;
  audioUrl?: string; // Optional real streamable audio URL
  lyrics: { time: number; text: string }[];
  plays: number;
  audioSignature?: {
    rootNote: number; // MIDI note (e.g. 60 for C4)
    scaleType: 'major' | 'minor' | 'dorian' | 'pentatonic';
    tempo: number;
    timbre: 'synth' | 'acoustic' | 'ambient' | 'chill' | 'punchy';
  };
}

export type SleepTimerOption = 5 | 10 | 15 | 30 | 45 | 60 | 'end_of_track';

export interface Playlist {
  id: string;
  name: string;
  description: string;
  coverUrl: string;
  accentColor: string;
  creator: {
    id: string;
    name: string;
  };
  trackIds: string[];
  isPinned?: boolean;
  isLikedSongs?: boolean;
  isDownloaded?: boolean;
  createdAt: string;
}

export interface Artist {
  id: string;
  name: string;
  monthlyListeners: number;
  imageUrl: string;
  accentColor: string;
  genres: string[];
  bio: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatarUrl: string;
  plan: 'free' | 'individual' | 'duo' | 'family' | 'student';
  planStatus: 'active' | 'trial' | 'free';
  planExpiryDate?: string;
  minutesListened: number;
  followersCount: number;
  followingCount: number;
  topGenres: string[];
  settings: {
    streamingQuality: 'normal' | 'high' | 'very_high' | 'lossless';
    downloadQuality: 'high' | 'lossless';
    crossfadeSeconds: number;
    normalizeVolume: boolean;
    autoplaySimilar: boolean;
    crossPlatformSync: boolean;
    offlineMode: boolean;
  };
}

export interface ConnectedDevice {
  id: string;
  name: string;
  type: 'computer' | 'smartphone' | 'speaker' | 'tv';
  isActive: boolean;
  lastSynced: string;
  volume: number;
}

export interface PremiumPlan {
  id: 'individual' | 'duo' | 'family' | 'student';
  name: string;
  price: string;
  billingPeriod: string;
  accounts: string;
  description: string;
  popular?: boolean;
  features: string[];
}

export type EqualizerPreset = 'flat' | 'bass_boost' | 'vocal_booster' | 'electronic' | 'acoustic' | 'hifi_clarity' | 'custom';

export interface EqualizerBands {
  bass: number; // 60Hz (-12dB to +12dB)
  lowMid: number; // 250Hz
  mid: number; // 1kHz
  highMid: number; // 4kHz
  treble: number; // 12kHz
}
