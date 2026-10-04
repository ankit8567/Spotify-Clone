import React, { createContext, useContext, useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { Track, Playlist, Artist, ConnectedDevice, UserProfile, EqualizerBands, EqualizerPreset, SleepTimerOption } from '../types';
import { INITIAL_TRACKS, INITIAL_ARTISTS, INITIAL_DEVICES } from '../data/mockData';
import { globalAudioEngine, EQUALIZER_PRESETS } from '../services/audioEngine';
import { storageService } from '../services/storage';

interface MusicContextType {
  // Navigation
  currentView: string;
  selectedPlaylistId: string | null;
  selectedArtistId: string | null;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  navigate: (view: string, id?: string) => void;

  // Data
  tracks: Track[];
  artists: Artist[];
  playlists: Playlist[];
  likedTrackIds: string[];
  downloadedTrackIds: string[];
  user: UserProfile;

  // Playback state
  currentTrack: Track | null;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  isMuted: boolean;
  isShuffle: boolean;
  repeatMode: 'off' | 'all' | 'one';
  queue: Track[];
  history: Track[];
  currentPlaylist: Playlist | null;

  // Audio & Hardware Equalizer
  streamingQuality: 'normal' | 'high' | 'very_high' | 'lossless';
  setStreamingQuality: (quality: 'normal' | 'high' | 'very_high' | 'lossless') => void;
  eqPreset: EqualizerPreset;
  eqBands: EqualizerBands;
  setEqPreset: (preset: EqualizerPreset) => void;
  setBandGain: (band: keyof EqualizerBands, value: number) => void;

  // Playback controls
  playTrack: (track: Track, contextTracks?: Track[], playlist?: Playlist) => void;
  togglePlayPause: () => void;
  seekTo: (seconds: number) => void;
  nextTrack: () => void;
  prevTrack: () => void;
  toggleShuffle: () => void;
  cycleRepeat: () => void;
  setVolumeLevel: (vol: number) => void;
  toggleMute: () => void;
  addToQueue: (track: Track) => void;
  removeFromQueue: (index: number) => void;
  clearQueue: () => void;

  // Liked & Playlist Actions
  isLiked: (trackId: string) => boolean;
  toggleLike: (trackId: string) => void;
  createPlaylist: (name: string, description?: string, coverColor?: string) => Playlist;
  updatePlaylist: (id: string, updates: Partial<Playlist>) => void;
  deletePlaylist: (id: string) => void;
  addTrackToPlaylist: (playlistId: string, trackId: string) => void;
  removeTrackFromPlaylist: (playlistId: string, trackId: string) => void;
  togglePinPlaylist: (playlistId: string) => void;

  // Offline playback
  isOfflineMode: boolean;
  toggleOfflineMode: (val?: boolean) => void;
  isDownloaded: (trackId: string) => boolean;
  toggleDownloadTrack: (trackId: string) => void;
  downloadPlaylist: (playlistId: string) => void;
  offlineAlertMessage: string | null;
  dismissOfflineAlert: () => void;

  // Sleep Timer
  sleepTimerRemaining: number | null;
  activeSleepTimerOption: SleepTimerOption | null;
  isSleepTimerModalOpen: boolean;
  toggleSleepTimerModal: (open?: boolean) => void;
  setSleepTimer: (option: SleepTimerOption | null) => void;
  cancelSleepTimer: () => void;

  // Devices & Spotify Connect
  devices: ConnectedDevice[];
  activeDevice: ConnectedDevice;
  setActiveDevice: (deviceId: string) => void;
  syncNotification: string | null;
  triggerCrossPlatformSync: () => void;

  // User Profile & Subscription
  updateUser: (updates: Partial<UserProfile>) => void;
  upgradePlan: (planId: 'individual' | 'duo' | 'family' | 'student') => void;
  cancelPlan: () => void;

  // Modals & Panels
  isLyricsOpen: boolean;
  toggleLyrics: (open?: boolean) => void;
  isQueueOpen: boolean;
  toggleQueue: (open?: boolean) => void;
  isDevicesModalOpen: boolean;
  toggleDevicesModal: (open?: boolean) => void;
  isEqualizerModalOpen: boolean;
  toggleEqualizerModal: (open?: boolean) => void;
  isEditPlaylistModalOpen: boolean;
  playlistToEdit: Playlist | null;
  openEditPlaylistModal: (playlist?: Playlist) => void;
  closeEditPlaylistModal: () => void;
  isCheckoutModalOpen: boolean;
  selectedPlanToBuy: 'individual' | 'duo' | 'family' | 'student' | null;
  openCheckoutModal: (planId?: 'individual' | 'duo' | 'family' | 'student') => void;
  closeCheckoutModal: () => void;
}

const MusicContext = createContext<MusicContextType | null>(null);

export const MusicProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Navigation
  const [currentView, setCurrentView] = useState<string>('home');
  const [selectedPlaylistId, setSelectedPlaylistId] = useState<string | null>(null);
  const [selectedArtistId, setSelectedArtistId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Primary data states
  const [tracks] = useState<Track[]>(INITIAL_TRACKS);
  const [artists] = useState<Artist[]>(INITIAL_ARTISTS);
  const [playlists, setPlaylists] = useState<Playlist[]>(() => storageService.getPlaylists());
  const [likedTrackIds, setLikedTrackIds] = useState<string[]>(() => storageService.getLikedTrackIds());
  const [downloadedTrackIds, setDownloadedTrackIds] = useState<string[]>(() => storageService.getDownloadedTrackIds());
  const [user, setUser] = useState<UserProfile>(() => storageService.getUserProfile());

  // Audio Playback
  const [currentTrack, setCurrentTrack] = useState<Track | null>(INITIAL_TRACKS[0]);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(INITIAL_TRACKS[0]?.duration || 180);
  const [volume, setVolume] = useState<number>(0.8);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [prevVolume, setPrevVolume] = useState<number>(0.8);
  const [isShuffle, setIsShuffle] = useState<boolean>(false);
  const [repeatMode, setRepeatMode] = useState<'off' | 'all' | 'one'>('off');
  const [queue, setQueue] = useState<Track[]>([]);
  const [history, setHistory] = useState<Track[]>([]);
  const [currentPlaylist, setCurrentPlaylist] = useState<Playlist | null>(null);

  // Equalizer & Audio Quality
  const [streamingQuality, setStreamingQualityState] = useState<'normal' | 'high' | 'very_high' | 'lossless'>(
    user.settings.streamingQuality || 'lossless'
  );
  const [eqPreset, setEqPresetState] = useState<EqualizerPreset>(() => storageService.getEqPreset());
  const [eqBands, setEqBands] = useState<EqualizerBands>(() => {
    return storageService.getEqBands() || EQUALIZER_PRESETS[storageService.getEqPreset()] || EQUALIZER_PRESETS.hifi_clarity;
  });

  // Offline Mode
  const [isOfflineMode, setIsOfflineMode] = useState<boolean>(() => storageService.getOfflineMode());
  const [offlineAlertMessage, setOfflineAlertMessage] = useState<string | null>(null);

  // Devices & Sync
  const [devices, setDevices] = useState<ConnectedDevice[]>(INITIAL_DEVICES);
  const [syncNotification, setSyncNotification] = useState<string | null>(null);

  // Modals
  const [isLyricsOpen, setIsLyricsOpen] = useState<boolean>(false);
  const [isQueueOpen, setIsQueueOpen] = useState<boolean>(false);
  const [isDevicesModalOpen, setIsDevicesModalOpen] = useState<boolean>(false);
  const [isEqualizerModalOpen, setIsEqualizerModalOpen] = useState<boolean>(false);
  const [isEditPlaylistModalOpen, setIsEditPlaylistModalOpen] = useState<boolean>(false);
  const [playlistToEdit, setPlaylistToEdit] = useState<Playlist | null>(null);
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState<boolean>(false);
  const [selectedPlanToBuy, setSelectedPlanToBuy] = useState<'individual' | 'duo' | 'family' | 'student' | null>(null);

  // Sleep Timer state
  const [sleepTimerRemaining, setSleepTimerRemaining] = useState<number | null>(null);
  const [activeSleepTimerOption, setActiveSleepTimerOption] = useState<SleepTimerOption | null>(null);
  const [isSleepTimerModalOpen, setIsSleepTimerModalOpen] = useState<boolean>(false);
  const sleepTimerIntervalRef = useRef<number | null>(null);

  const toggleSleepTimerModal = useCallback((open?: boolean) => {
    setIsSleepTimerModalOpen(prev => (open !== undefined ? open : !prev));
  }, []);

  const cancelSleepTimer = useCallback(() => {
    if (sleepTimerIntervalRef.current) {
      window.clearInterval(sleepTimerIntervalRef.current);
      sleepTimerIntervalRef.current = null;
    }
    setSleepTimerRemaining(null);
    setActiveSleepTimerOption(null);
    globalAudioEngine.setVolume(isMuted ? 0 : volume);
  }, [isMuted, volume]);

  const setSleepTimer = useCallback((option: SleepTimerOption | null) => {
    if (sleepTimerIntervalRef.current) {
      window.clearInterval(sleepTimerIntervalRef.current);
      sleepTimerIntervalRef.current = null;
    }

    if (!option) {
      cancelSleepTimer();
      return;
    }

    setActiveSleepTimerOption(option);

    if (option === 'end_of_track') {
      const remainingSecs = Math.max(1, Math.round(duration - currentTime));
      setSleepTimerRemaining(remainingSecs);
      // Countdown track remaining
      sleepTimerIntervalRef.current = window.setInterval(() => {
        setSleepTimerRemaining(prev => {
          if (prev === null || prev <= 1) {
            if (sleepTimerIntervalRef.current) {
              window.clearInterval(sleepTimerIntervalRef.current);
              sleepTimerIntervalRef.current = null;
            }
            globalAudioEngine.pause();
            setIsPlaying(false);
            setActiveSleepTimerOption(null);
            return null;
          }
          return prev - 1;
        });
      }, 1000);
      setIsSleepTimerModalOpen(false);
      return;
    }

    const totalSeconds = option * 60;
    setSleepTimerRemaining(totalSeconds);

    sleepTimerIntervalRef.current = window.setInterval(() => {
      setSleepTimerRemaining(prev => {
        if (prev === null || prev <= 1) {
          if (sleepTimerIntervalRef.current) {
            window.clearInterval(sleepTimerIntervalRef.current);
            sleepTimerIntervalRef.current = null;
          }
          globalAudioEngine.pause();
          setIsPlaying(false);
          globalAudioEngine.setVolume(volume);
          setActiveSleepTimerOption(null);
          return null;
        }

        // Fade out in the last 15 seconds
        if (prev === 15) {
          globalAudioEngine.fadeVolume(0, 14000);
        }

        return prev - 1;
      });
    }, 1000);

    setIsSleepTimerModalOpen(false);
  }, [cancelSleepTimer, duration, currentTime, volume]);

  // Clean up interval on unmount
  useEffect(() => {
    return () => {
      if (sleepTimerIntervalRef.current) {
        window.clearInterval(sleepTimerIntervalRef.current);
      }
    };
  }, []);

  // Persist storage whenever playlists or user change
  useEffect(() => {
    storageService.savePlaylists(playlists);
  }, [playlists]);

  useEffect(() => {
    storageService.saveLikedTrackIds(likedTrackIds);
  }, [likedTrackIds]);

  useEffect(() => {
    storageService.saveDownloadedTrackIds(downloadedTrackIds);
  }, [downloadedTrackIds]);

  useEffect(() => {
    storageService.saveUserProfile(user);
  }, [user]);

  useEffect(() => {
    storageService.saveOfflineMode(isOfflineMode);
  }, [isOfflineMode]);

  // Audio engine time update & end handlers
  useEffect(() => {
    globalAudioEngine.onTimeUpdate((time) => {
      setCurrentTime(time);
    });

    globalAudioEngine.onEnded(() => {
      if (repeatMode === 'one' && currentTrack) {
        globalAudioEngine.play(currentTrack, 0);
        return;
      }
      nextTrack();
    });
  }, [currentTrack, repeatMode]);

  // Audio Engine initial parameters
  useEffect(() => {
    globalAudioEngine.setEqualizer(eqBands);
    globalAudioEngine.setQuality(streamingQuality);
    globalAudioEngine.setVolume(isMuted ? 0 : volume);
  }, []);

  const navigate = useCallback((view: string, id?: string) => {
    setCurrentView(view);
    if (view === 'playlist') {
      setSelectedPlaylistId(id || null);
    } else if (view === 'artist') {
      setSelectedArtistId(id || null);
    }
    // Auto scroll top when view changes
    const container = document.getElementById('main-scroll-container');
    if (container) container.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const isLiked = useCallback((trackId: string) => {
    return likedTrackIds.includes(trackId);
  }, [likedTrackIds]);

  const toggleLike = useCallback((trackId: string) => {
    setLikedTrackIds(prev => {
      const isAlreadyLiked = prev.includes(trackId);
      const next = isAlreadyLiked ? prev.filter(id => id !== trackId) : [...prev, trackId];

      // Update Liked Songs playlist track list
      setPlaylists(plist => plist.map(p => {
        if (p.isLikedSongs) {
          return { ...p, trackIds: next };
        }
        return p;
      }));

      return next;
    });
  }, []);

  const isDownloaded = useCallback((trackId: string) => {
    return downloadedTrackIds.includes(trackId);
  }, [downloadedTrackIds]);

  const toggleDownloadTrack = useCallback((trackId: string) => {
    if (user.plan === 'free') {
      setSelectedPlanToBuy('individual');
      setIsCheckoutModalOpen(true);
      return;
    }

    setDownloadedTrackIds(prev => {
      const exists = prev.includes(trackId);
      if (exists) {
        return prev.filter(id => id !== trackId);
      } else {
        return [...prev, trackId];
      }
    });
  }, [user.plan]);

  const downloadPlaylist = useCallback((playlistId: string) => {
    if (user.plan === 'free') {
      setSelectedPlanToBuy('individual');
      setIsCheckoutModalOpen(true);
      return;
    }

    const playlist = playlists.find(p => p.id === playlistId);
    if (!playlist) return;

    setPlaylists(prev => prev.map(p => {
      if (p.id === playlistId) {
        return { ...p, isDownloaded: !p.isDownloaded };
      }
      return p;
    }));

    if (!playlist.isDownloaded) {
      // Download all tracks in this playlist
      setDownloadedTrackIds(prev => Array.from(new Set([...prev, ...playlist.trackIds])));
    }
  }, [playlists, user.plan]);

  const playTrack = useCallback((track: Track, contextTracks?: Track[], playlist?: Playlist) => {
    // Offline protection check
    if (isOfflineMode && !downloadedTrackIds.includes(track.id)) {
      setOfflineAlertMessage(`"${track.title}" is not downloaded for Offline Mode. Download it to listen offline or turn off Offline Mode.`);
      return;
    }

    // Add previous track to history
    if (currentTrack && currentTrack.id !== track.id) {
      setHistory(prev => [currentTrack, ...prev.slice(0, 19)]);
    }

    setCurrentTrack(track);
    setDuration(track.duration);
    setCurrentTime(0);
    setIsPlaying(true);
    if (playlist) setCurrentPlaylist(playlist);

    // Setup queue if context tracks provided
    if (contextTracks && contextTracks.length > 0) {
      const trackIndex = contextTracks.findIndex(t => t.id === track.id);
      const remaining = contextTracks.slice(trackIndex + 1);
      setQueue(remaining);
    }

    // Synthesize real audio via AudioEngine
    globalAudioEngine.play(track, 0);

    // Update user minutes listened
    setUser(u => ({ ...u, minutesListened: u.minutesListened + 1 }));
  }, [isOfflineMode, downloadedTrackIds, currentTrack]);

  const togglePlayPause = useCallback(() => {
    if (!currentTrack) {
      if (tracks.length > 0) {
        playTrack(tracks[0]);
      }
      return;
    }

    if (isPlaying) {
      globalAudioEngine.pause();
      setIsPlaying(false);
    } else {
      if (isOfflineMode && !downloadedTrackIds.includes(currentTrack.id)) {
        setOfflineAlertMessage(`"${currentTrack.title}" is not downloaded for Offline Mode.`);
        return;
      }
      globalAudioEngine.resume();
      setIsPlaying(true);
    }
  }, [currentTrack, isPlaying, tracks, playTrack, isOfflineMode, downloadedTrackIds]);

  const seekTo = useCallback((seconds: number) => {
    setCurrentTime(seconds);
    globalAudioEngine.seek(seconds);
  }, []);

  const nextTrack = useCallback(() => {
    if (queue.length > 0) {
      const next = queue[0];
      setQueue(prev => prev.slice(1));
      playTrack(next);
      return;
    }

    // Default to tracks array
    if (currentTrack) {
      const currentIndex = tracks.findIndex(t => t.id === currentTrack.id);
      let nextIndex = (currentIndex + 1) % tracks.length;
      if (isShuffle) {
        nextIndex = Math.floor(Math.random() * tracks.length);
      }
      playTrack(tracks[nextIndex]);
    }
  }, [queue, currentTrack, tracks, isShuffle, playTrack]);

  const prevTrack = useCallback(() => {
    if (currentTime > 3) {
      seekTo(0);
      return;
    }

    if (history.length > 0) {
      const prev = history[0];
      setHistory(h => h.slice(1));
      playTrack(prev);
      return;
    }

    if (currentTrack) {
      const currentIndex = tracks.findIndex(t => t.id === currentTrack.id);
      const prevIndex = (currentIndex - 1 + tracks.length) % tracks.length;
      playTrack(tracks[prevIndex]);
    }
  }, [currentTime, history, currentTrack, tracks, playTrack, seekTo]);

  const toggleShuffle = useCallback(() => {
    setIsShuffle(prev => !prev);
  }, []);

  const cycleRepeat = useCallback(() => {
    setRepeatMode(prev => {
      if (prev === 'off') return 'all';
      if (prev === 'all') return 'one';
      return 'off';
    });
  }, []);

  const setVolumeLevel = useCallback((vol: number) => {
    const clamped = Math.max(0, Math.min(1, vol));
    setVolume(clamped);
    setIsMuted(clamped === 0);
    globalAudioEngine.setVolume(clamped);
  }, []);

  const toggleMute = useCallback(() => {
    if (isMuted) {
      setIsMuted(false);
      globalAudioEngine.setVolume(prevVolume || 0.8);
    } else {
      setPrevVolume(volume);
      setIsMuted(true);
      globalAudioEngine.setVolume(0);
    }
  }, [isMuted, prevVolume, volume]);

  const addToQueue = useCallback((track: Track) => {
    setQueue(prev => [...prev, track]);
  }, []);

  const removeFromQueue = useCallback((index: number) => {
    setQueue(prev => prev.filter((_, i) => i !== index));
  }, []);

  const clearQueue = useCallback(() => {
    setQueue([]);
  }, []);

  // Equalizer & Quality
  const setStreamingQuality = useCallback((quality: 'normal' | 'high' | 'very_high' | 'lossless') => {
    setStreamingQualityState(quality);
    globalAudioEngine.setQuality(quality);
    setUser(u => ({
      ...u,
      settings: { ...u.settings, streamingQuality: quality }
    }));
  }, []);

  const setEqPreset = useCallback((preset: EqualizerPreset) => {
    setEqPresetState(preset);
    storageService.saveEqPreset(preset);
    if (preset !== 'custom') {
      const bands = EQUALIZER_PRESETS[preset];
      setEqBands(bands);
      storageService.saveEqBands(bands);
      globalAudioEngine.setEqualizer(bands);
    }
  }, []);

  const setBandGain = useCallback((band: keyof EqualizerBands, value: number) => {
    setEqPresetState('custom');
    setEqBands(prev => {
      const updated = { ...prev, [band]: value };
      storageService.saveEqBands(updated);
      globalAudioEngine.setEqualizer(updated);
      return updated;
    });
  }, []);

  // Playlists
  const createPlaylist = useCallback((name: string, description: string = '', coverColor: string = '#6366f1'): Playlist => {
    const newPlaylist: Playlist = {
      id: `playlist-${Date.now()}`,
      name: name || 'My Playlist',
      description: description || 'A collection of your favorite tracks.',
      coverUrl: '',
      accentColor: coverColor,
      creator: { id: user.id, name: user.name },
      trackIds: [],
      createdAt: new Date().toISOString().split('T')[0]
    };

    setPlaylists(prev => [newPlaylist, ...prev]);
    return newPlaylist;
  }, [user]);

  const updatePlaylist = useCallback((id: string, updates: Partial<Playlist>) => {
    setPlaylists(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p));
  }, []);

  const deletePlaylist = useCallback((id: string) => {
    setPlaylists(prev => prev.filter(p => p.id !== id));
    if (selectedPlaylistId === id) {
      setCurrentView('home');
      setSelectedPlaylistId(null);
    }
  }, [selectedPlaylistId]);

  const addTrackToPlaylist = useCallback((playlistId: string, trackId: string) => {
    setPlaylists(prev => prev.map(p => {
      if (p.id === playlistId) {
        if (p.trackIds.includes(trackId)) return p;
        return { ...p, trackIds: [...p.trackIds, trackId] };
      }
      return p;
    }));
  }, []);

  const removeTrackFromPlaylist = useCallback((playlistId: string, trackId: string) => {
    setPlaylists(prev => prev.map(p => {
      if (p.id === playlistId) {
        return { ...p, trackIds: p.trackIds.filter(id => id !== trackId) };
      }
      return p;
    }));
  }, []);

  const togglePinPlaylist = useCallback((playlistId: string) => {
    setPlaylists(prev => prev.map(p => {
      if (p.id === playlistId) {
        return { ...p, isPinned: !p.isPinned };
      }
      return p;
    }));
  }, []);

  // Offline Mode
  const toggleOfflineMode = useCallback((val?: boolean) => {
    setIsOfflineMode(prev => (val !== undefined ? val : !prev));
  }, []);

  const dismissOfflineAlert = useCallback(() => {
    setOfflineAlertMessage(null);
  }, []);

  // Spotify Connect & Cross-Platform Sync
  const activeDevice = useMemo(() => {
    return devices.find(d => d.isActive) || devices[0];
  }, [devices]);

  const setActiveDevice = useCallback((deviceId: string) => {
    setDevices(prev => prev.map(d => ({
      ...d,
      isActive: d.id === deviceId,
      lastSynced: d.id === deviceId ? 'Just now' : d.lastSynced
    })));
    const target = devices.find(d => d.id === deviceId);
    if (target) {
      setSyncNotification(`Playback seamlessly transferred to ${target.name}`);
      setTimeout(() => setSyncNotification(null), 4000);
    }
  }, [devices]);

  const triggerCrossPlatformSync = useCallback(() => {
    setDevices(prev => prev.map(d => ({
      ...d,
      lastSynced: 'Just now'
    })));
    setSyncNotification('Cloud Sync Complete: Playlists, Liked Songs & Queue synced across 5 devices');
    setTimeout(() => setSyncNotification(null), 4000);
  }, []);

  // User Profile & Plans
  const updateUser = useCallback((updates: Partial<UserProfile>) => {
    setUser(prev => ({ ...prev, ...updates }));
  }, []);

  const upgradePlan = useCallback((planId: 'individual' | 'duo' | 'family' | 'student') => {
    setUser(prev => ({
      ...prev,
      plan: planId,
      planStatus: 'active',
      planExpiryDate: '2027-10-31',
      settings: {
        ...prev.settings,
        streamingQuality: 'lossless' // automatically unlock Hi-Fi FLAC
      }
    }));
    setStreamingQuality('lossless');
    setIsCheckoutModalOpen(false);
  }, [setStreamingQuality]);

  const cancelPlan = useCallback(() => {
    setUser(prev => ({
      ...prev,
      plan: 'free',
      planStatus: 'free',
      settings: {
        ...prev.settings,
        streamingQuality: 'high'
      }
    }));
    setStreamingQuality('high');
  }, [setStreamingQuality]);

  // Modal Openers
  const toggleLyrics = useCallback((open?: boolean) => {
    setIsLyricsOpen(prev => (open !== undefined ? open : !prev));
  }, []);

  const toggleQueue = useCallback((open?: boolean) => {
    setIsQueueOpen(prev => (open !== undefined ? open : !prev));
  }, []);

  const toggleDevicesModal = useCallback((open?: boolean) => {
    setIsDevicesModalOpen(prev => (open !== undefined ? open : !prev));
  }, []);

  const toggleEqualizerModal = useCallback((open?: boolean) => {
    setIsEqualizerModalOpen(prev => (open !== undefined ? open : !prev));
  }, []);

  const openEditPlaylistModal = useCallback((playlist?: Playlist) => {
    setPlaylistToEdit(playlist || null);
    setIsEditPlaylistModalOpen(true);
  }, []);

  const closeEditPlaylistModal = useCallback(() => {
    setIsEditPlaylistModalOpen(false);
    setPlaylistToEdit(null);
  }, []);

  const openCheckoutModal = useCallback((planId?: 'individual' | 'duo' | 'family' | 'student') => {
    setSelectedPlanToBuy(planId || 'individual');
    setIsCheckoutModalOpen(true);
  }, []);

  const closeCheckoutModal = useCallback(() => {
    setIsCheckoutModalOpen(false);
    setSelectedPlanToBuy(null);
  }, []);

  return (
    <MusicContext.Provider
      value={{
        currentView,
        selectedPlaylistId,
        selectedArtistId,
        searchQuery,
        setSearchQuery,
        navigate,

        tracks,
        artists,
        playlists,
        likedTrackIds,
        downloadedTrackIds,
        user,

        currentTrack,
        isPlaying,
        currentTime,
        duration,
        volume,
        isMuted,
        isShuffle,
        repeatMode,
        queue,
        history,
        currentPlaylist,

        streamingQuality,
        setStreamingQuality,
        eqPreset,
        eqBands,
        setEqPreset,
        setBandGain,

        playTrack,
        togglePlayPause,
        seekTo,
        nextTrack,
        prevTrack,
        toggleShuffle,
        cycleRepeat,
        setVolumeLevel,
        toggleMute,
        addToQueue,
        removeFromQueue,
        clearQueue,

        isLiked,
        toggleLike,
        createPlaylist,
        updatePlaylist,
        deletePlaylist,
        addTrackToPlaylist,
        removeTrackFromPlaylist,
        togglePinPlaylist,

        isOfflineMode,
        toggleOfflineMode,
        isDownloaded,
        toggleDownloadTrack,
        downloadPlaylist,
        offlineAlertMessage,
        dismissOfflineAlert,

        devices,
        activeDevice,
        setActiveDevice,
        syncNotification,
        triggerCrossPlatformSync,

        sleepTimerRemaining,
        activeSleepTimerOption,
        isSleepTimerModalOpen,
        toggleSleepTimerModal,
        setSleepTimer,
        cancelSleepTimer,

        updateUser,
        upgradePlan,
        cancelPlan,

        isLyricsOpen,
        toggleLyrics,
        isQueueOpen,
        toggleQueue,
        isDevicesModalOpen,
        toggleDevicesModal,
        isEqualizerModalOpen,
        toggleEqualizerModal,
        isEditPlaylistModalOpen,
        playlistToEdit,
        openEditPlaylistModal,
        closeEditPlaylistModal,
        isCheckoutModalOpen,
        selectedPlanToBuy,
        openCheckoutModal,
        closeCheckoutModal
      }}
    >
      {children}
    </MusicContext.Provider>
  );
};

export const useMusic = () => {
  const context = useContext(MusicContext);
  if (!context) {
    throw new Error('useMusic must be used within a MusicProvider');
  }
  return context;
};
