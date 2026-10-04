import React, { useState } from 'react';
import { useMusic } from '../../context/MusicContext';
import {
  User,
  Crown,
  Laptop,
  Smartphone,
  Speaker,
  Tv,
  RefreshCw,
  Sliders,
  Check,
  HardDrive,
  Sparkles,
  ShieldCheck,
  Zap,
  Music,
  Edit3
} from 'lucide-react';

const AVATAR_OPTIONS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=200&auto=format&fit=crop&q=80'
];

export const ProfileView: React.FC = () => {
  const {
    user,
    updateUser,
    streamingQuality,
    setStreamingQuality,
    devices,
    triggerCrossPlatformSync,
    syncNotification,
    downloadedTrackIds,
    isOfflineMode,
    toggleOfflineMode,
    navigate,
    openCheckoutModal,
    cancelPlan,
    toggleEqualizerModal
  } = useMusic();

  const [isEditingName, setIsEditingName] = useState(false);
  const [displayName, setDisplayName] = useState(user.name);
  const [isSyncing, setIsSyncing] = useState(false);
  const [crossfade, setCrossfade] = useState(user.settings.crossfadeSeconds);

  const handleSaveName = () => {
    if (displayName.trim()) {
      updateUser({ name: displayName.trim() });
    }
    setIsEditingName(false);
  };

  const handleAvatarSelect = (url: string) => {
    updateUser({ avatarUrl: url });
  };

  const handleSync = () => {
    setIsSyncing(true);
    triggerCrossPlatformSync();
    setTimeout(() => setIsSyncing(false), 900);
  };

  const storageMB = (downloadedTrackIds.length * 9.4).toFixed(1);

  return (
    <div className="p-6 md:p-8 space-y-10 max-w-6xl mx-auto pb-32">
      {/* 1. Profile Header */}
      <section className="flex flex-col md:flex-row items-center md:items-start gap-6 bg-gradient-to-b from-[#242424] to-[#121212] p-8 rounded-2xl border border-white/5 shadow-xl">
        {/* Avatar */}
        <div className="relative group shrink-0">
          <div className="w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden shadow-2xl border-2 border-white/20 bg-neutral-800">
            <img
              src={user.avatarUrl}
              alt={user.name}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
          </div>
          {/* Quick Avatar picker triggers */}
          <div className="absolute -bottom-2 -right-1 bg-[#1DB954] text-black p-2 rounded-full shadow-lg cursor-pointer hover:scale-110 transition-transform">
            <Edit3 className="w-4 h-4" />
          </div>
        </div>

        {/* User Info */}
        <div className="flex-1 text-center md:text-left space-y-2">
          <div className="flex items-center justify-center md:justify-start gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-neutral-400">Profile</span>
            <span className="text-neutral-500">·</span>
            <div className="flex items-center gap-1 text-xs font-semibold px-2.5 py-0.5 rounded-full bg-[#1DB954]/20 text-[#1DB954] border border-[#1DB954]/30 capitalize">
              <Crown className="w-3 h-3 fill-current" />
              <span>{user.plan} Subscription</span>
            </div>
          </div>

          {/* Name Editor */}
          {isEditingName ? (
            <div className="flex items-center gap-2 max-w-sm mt-1">
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="w-full px-3 py-1.5 rounded-md bg-[#333] border border-white/20 text-white font-bold text-2xl focus:outline-none focus:border-[#1DB954]"
                autoFocus
              />
              <button
                onClick={handleSaveName}
                className="px-3 py-1.5 rounded-md bg-[#1DB954] text-black font-bold text-xs"
              >
                Save
              </button>
            </div>
          ) : (
            <h1
              onClick={() => setIsEditingName(true)}
              className="text-3xl md:text-5xl font-extrabold text-white tracking-tight cursor-pointer hover:text-neutral-200 flex items-center justify-center md:justify-start gap-3"
            >
              <span>{user.name}</span>
              <Edit3 className="w-4 h-4 text-neutral-400 opacity-60 hover:opacity-100" />
            </h1>
          )}

          <div className="text-xs text-neutral-400 font-mono">{user.email}</div>

          {/* Stats Bar */}
          <div className="flex items-center justify-center md:justify-start gap-4 pt-3 text-xs text-neutral-300">
            <div>
              <span className="font-bold text-white tabular-nums text-sm">{user.followersCount}</span>{' '}
              <span className="text-neutral-400">Followers</span>
            </div>
            <span>·</span>
            <div>
              <span className="font-bold text-white tabular-nums text-sm">{user.followingCount}</span>{' '}
              <span className="text-neutral-400">Following</span>
            </div>
            <span>·</span>
            <div>
              <span className="font-bold text-white tabular-nums text-sm">
                {(user.minutesListened / 60).toFixed(0)} hrs
              </span>{' '}
              <span className="text-neutral-400">Listened</span>
            </div>
          </div>

          {/* Avatar Switcher Carousel */}
          <div className="pt-3">
            <span className="text-[11px] text-neutral-400 block mb-1.5">Change Avatar:</span>
            <div className="flex items-center justify-center md:justify-start gap-2">
              {AVATAR_OPTIONS.map((url, i) => (
                <button
                  key={i}
                  onClick={() => handleAvatarSelect(url)}
                  className={`w-8 h-8 rounded-full overflow-hidden border-2 transition-transform hover:scale-110 ${
                    user.avatarUrl === url ? 'border-[#1DB954] scale-105' : 'border-transparent opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={url} alt="Option" referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 2. Cross-Platform Synchronization Section */}
      <section className="bg-[#181818] p-6 rounded-2xl border border-white/5 space-y-5">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-[#1DB954]" />
              <h2 className="text-lg font-bold text-white">Cross-Platform Synchronization</h2>
            </div>
            <p className="text-xs text-neutral-400 mt-1">
              Your Liked Songs, custom playlists, listening queue, and volume levels stay perfectly synced in real-time across all your authorized devices.
            </p>
          </div>

          <button
            onClick={handleSync}
            disabled={isSyncing}
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-white text-black hover:bg-neutral-200 text-xs font-bold transition-all shadow-md shrink-0"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin text-[#1DB954]' : ''}`} />
            <span>{isSyncing ? 'Syncing...' : 'Sync All Devices'}</span>
          </button>
        </div>

        {syncNotification && (
          <div className="p-3 bg-[#1DB954]/10 border border-[#1DB954]/30 rounded-lg text-xs text-[#1DB954] flex items-center gap-2 animate-fadeIn">
            <Check className="w-4 h-4 shrink-0" />
            <span>{syncNotification}</span>
          </div>
        )}

        {/* Connected Devices Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-2">
          {devices.map(device => {
            return (
              <div
                key={device.id}
                className={`p-3.5 rounded-xl border flex items-center justify-between transition-colors ${
                  device.isActive
                    ? 'bg-[#1DB954]/10 border-[#1DB954]/30'
                    : 'bg-white/5 border-white/5 hover:border-white/10'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2.5 rounded-lg ${device.isActive ? 'bg-[#1DB954] text-black' : 'bg-white/10 text-white'}`}>
                    {device.type === 'smartphone' ? <Smartphone className="w-4 h-4" /> :
                     device.type === 'speaker' ? <Speaker className="w-4 h-4" /> :
                     device.type === 'tv' ? <Tv className="w-4 h-4" /> :
                     <Laptop className="w-4 h-4" />}
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-white">{device.name}</div>
                    <div className="text-[11px] text-neutral-400">Last active: {device.lastSynced}</div>
                  </div>
                </div>

                {device.isActive ? (
                  <span className="text-[10px] font-bold text-[#1DB954] uppercase tracking-wider px-2 py-0.5 rounded bg-[#1DB954]/20">
                    Active
                  </span>
                ) : (
                  <span className="text-[10px] text-neutral-500">Standby</span>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* 3. Audio Streaming Quality & Equalizer Settings */}
      <section className="bg-[#181818] p-6 rounded-2xl border border-white/5 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sliders className="w-5 h-5 text-[#1DB954]" />
            <h2 className="text-lg font-bold text-white">Audio Streaming & Hardware Equalizer</h2>
          </div>
          <button
            onClick={() => toggleEqualizerModal(true)}
            className="text-xs font-bold text-[#1DB954] hover:underline"
          >
            Open 5-Band Equalizer
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Streaming Quality Selector */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-neutral-300 block">
              Audio Streaming Quality
            </label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { id: 'normal', label: 'Normal (96 kbps)', desc: 'Low data usage' },
                { id: 'high', label: 'High (160 kbps)', desc: 'Standard clarity' },
                { id: 'very_high', label: 'Very High (320 kbps)', desc: 'MP3 maximum bitrate' },
                { id: 'lossless', label: 'Hi-Fi Lossless (FLAC)', desc: '24-bit / 96kHz Master', badge: 'PRO' }
              ].map(opt => {
                const isSelected = streamingQuality === opt.id;
                return (
                  <button
                    key={opt.id}
                    onClick={() => setStreamingQuality(opt.id as any)}
                    className={`p-3 rounded-xl text-left border transition-all ${
                      isSelected
                        ? 'bg-[#1DB954]/15 border-[#1DB954] text-white'
                        : 'bg-white/5 border-white/5 hover:border-white/15 text-neutral-300'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold">{opt.label}</span>
                      {opt.badge && (
                        <span className="text-[9px] font-extrabold px-1.5 py-0.5 rounded bg-amber-400 text-black">
                          {opt.badge}
                        </span>
                      )}
                    </div>
                    <span className="text-[11px] text-neutral-400 block">{opt.desc}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Playback Controls & Crossfade */}
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between text-xs font-semibold text-neutral-300 mb-1.5">
                <span>Song Crossfade</span>
                <span className="font-mono text-[#1DB954]">{crossfade} seconds</span>
              </div>
              <input
                type="range"
                min={0}
                max={12}
                step={1}
                value={crossfade}
                onChange={(e) => {
                  const val = parseInt(e.target.value);
                  setCrossfade(val);
                  updateUser({
                    settings: { ...user.settings, crossfadeSeconds: val }
                  });
                }}
                className="w-full h-2 bg-neutral-700 rounded-lg accent-[#1DB954]"
              />
              <span className="text-[11px] text-neutral-500 mt-1 block">
                Crossfades the audio between tracks to eliminate dead silence.
              </span>
            </div>

            {/* Offline Mode Switch */}
            <div className="pt-2 flex items-center justify-between border-t border-white/10">
              <div>
                <div className="text-xs font-semibold text-white">Offline Mode</div>
                <div className="text-[11px] text-neutral-400">
                  Only play songs that are downloaded to this device ({storageMB} MB stored)
                </div>
              </div>
              <button
                onClick={() => toggleOfflineMode()}
                className={`w-12 h-6 rounded-full transition-colors relative p-0.5 ${
                  isOfflineMode ? 'bg-[#1DB954]' : 'bg-neutral-700'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white transition-transform ${
                    isOfflineMode ? 'translate-x-6' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Subscription Management */}
      <section className="bg-gradient-to-r from-neutral-900 to-[#181818] p-6 rounded-2xl border border-white/10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-400">
            <ShieldCheck className="w-4 h-4" />
            <span>Active Subscription</span>
          </div>
          <h3 className="text-2xl font-bold text-white capitalize">
            {user.plan} Plan
          </h3>
          <p className="text-xs text-neutral-300 max-w-lg">
            {user.plan === 'free'
              ? 'You are on the Free tier. Upgrade to unlock ad-free streaming, offline playback, and 24-bit studio sound.'
              : `Billed monthly. Your plan renews on ${user.planExpiryDate || 'October 2026'}.`}
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          {user.plan === 'free' ? (
            <button
              onClick={() => openCheckoutModal('individual')}
              className="px-6 py-2.5 rounded-full bg-[#1DB954] hover:bg-[#1ed760] text-black font-extrabold text-xs transition-transform hover:scale-105"
            >
              Upgrade to Premium
            </button>
          ) : (
            <>
              <button
                onClick={() => navigate('premium')}
                className="px-4 py-2 rounded-full bg-white text-black hover:bg-neutral-200 text-xs font-bold transition-colors"
              >
                Change Plan
              </button>
              <button
                onClick={cancelPlan}
                className="px-4 py-2 rounded-full border border-white/20 text-neutral-300 hover:text-white hover:border-white text-xs font-medium transition-colors"
              >
                Cancel Subscription
              </button>
            </>
          )}
        </div>
      </section>
    </div>
  );
};
