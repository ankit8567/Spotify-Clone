import React, { useState, useRef, useEffect } from 'react';
import { useMusic } from '../../context/MusicContext';
import {
  ChevronLeft,
  ChevronRight,
  Search,
  WifiOff,
  Wifi,
  Sparkles,
  Crown,
  Laptop,
  Smartphone,
  Tv,
  Speaker,
  RefreshCw,
  User,
  Sliders,
  LogOut,
  Check,
  Zap
} from 'lucide-react';

export const TopBar: React.FC = () => {
  const {
    currentView,
    navigate,
    searchQuery,
    setSearchQuery,
    user,
    isOfflineMode,
    toggleOfflineMode,
    activeDevice,
    toggleDevicesModal,
    openCheckoutModal,
    triggerCrossPlatformSync,
    syncNotification,
    toggleEqualizerModal,
    streamingQuality
  } = useMusic();

  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close profile dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsProfileMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSyncClick = () => {
    setIsSyncing(true);
    triggerCrossPlatformSync();
    setTimeout(() => setIsSyncing(false), 800);
  };

  const getDeviceIcon = () => {
    switch (activeDevice.type) {
      case 'smartphone': return <Smartphone className="w-3.5 h-3.5 text-[#1DB954]" />;
      case 'speaker': return <Speaker className="w-3.5 h-3.5 text-[#1DB954]" />;
      case 'tv': return <Tv className="w-3.5 h-3.5 text-[#1DB954]" />;
      default: return <Laptop className="w-3.5 h-3.5 text-[#1DB954]" />;
    }
  };

  return (
    <header className="sticky top-0 z-30 h-16 px-6 flex items-center justify-between bg-[#101010]/85 backdrop-blur-md border-b border-white/5 transition-all">
      {/* Zone 1: Navigation controls & Search */}
      <div className="flex items-center gap-3 flex-1 max-w-xl">
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            onClick={() => window.history.back()}
            title="Go back"
            className="w-8 h-8 rounded-full bg-black/60 hover:bg-black/90 text-neutral-300 hover:text-white flex items-center justify-center transition-colors disabled:opacity-40"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={() => window.history.forward()}
            title="Go forward"
            className="w-8 h-8 rounded-full bg-black/60 hover:bg-black/90 text-neutral-300 hover:text-white flex items-center justify-center transition-colors disabled:opacity-40"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Global / Contextual Search bar */}
        <div className="relative flex-1 max-w-md group">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400 group-focus-within:text-white transition-colors" />
          <input
            type="text"
            placeholder="What do you want to play?"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              if (currentView !== 'search') {
                navigate('search');
              }
            }}
            onFocus={() => {
              if (currentView !== 'search') navigate('search');
            }}
            className="w-full h-10 pl-10 pr-4 rounded-full bg-[#242424] hover:bg-[#2a2a2a] focus:bg-[#2a2a2a] border border-transparent focus:border-white/20 text-sm text-white placeholder-neutral-400 focus:outline-none transition-all shadow-inner"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-neutral-400 hover:text-white"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Zone 2: Sync alert or status ticker */}
      {syncNotification && (
        <div className="hidden lg:flex items-center gap-2 px-3 py-1 bg-[#1DB954]/10 border border-[#1DB954]/30 rounded-full text-xs text-[#1DB954] animate-fadeIn">
          <Zap className="w-3.5 h-3.5 animate-pulse" />
          <span className="truncate max-w-xs">{syncNotification}</span>
        </div>
      )}

      {/* Zone 3: Actions, Offline Mode, Spotify Connect & Profile */}
      <div className="flex items-center gap-3 shrink-0">
        {/* Offline Mode Switch */}
        <button
          onClick={() => toggleOfflineMode()}
          title={isOfflineMode ? 'Offline Mode Active (Playing downloaded tracks only)' : 'Go Offline'}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium transition-all border ${
            isOfflineMode
              ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 shadow-sm shadow-amber-500/20'
              : 'bg-white/5 hover:bg-white/10 text-neutral-300 border-white/5'
          }`}
        >
          {isOfflineMode ? (
            <>
              <WifiOff className="w-3.5 h-3.5 text-amber-400" />
              <span>Offline Mode</span>
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
            </>
          ) : (
            <>
              <Wifi className="w-3.5 h-3.5 text-neutral-400" />
              <span className="hidden sm:inline">Go Offline</span>
            </>
          )}
        </button>

        {/* Audio Quality indicator */}
        <button
          onClick={() => toggleEqualizerModal(true)}
          title="Hardware Equalizer & Audio Streaming Quality"
          className="hidden md:flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-white/5 hover:bg-white/10 text-xs font-mono border border-white/5 text-neutral-300 hover:text-white transition-colors"
        >
          <Sliders className="w-3.5 h-3.5 text-[#1DB954]" />
          <span className="text-[11px] font-semibold text-[#1DB954]">
            {streamingQuality === 'lossless' ? 'Hi-Fi FLAC' : streamingQuality.toUpperCase()}
          </span>
        </button>

        {/* Spotify Connect Quick Device Status */}
        <button
          onClick={() => toggleDevicesModal(true)}
          title={`Streaming on: ${activeDevice.name}`}
          className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-white/5 hover:bg-white/10 text-xs text-neutral-300 hover:text-white transition-colors border border-white/5"
        >
          {getDeviceIcon()}
          <span className="max-w-[100px] truncate text-[11px]">{activeDevice.name.split(' ')[0]}</span>
        </button>

        {/* Cloud Sync trigger */}
        <button
          onClick={handleSyncClick}
          title="Sync library & playback across devices"
          className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 text-neutral-300 hover:text-white flex items-center justify-center transition-colors"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin text-[#1DB954]' : ''}`} />
        </button>

        {/* Upgrade / Premium Plan Button */}
        {user.plan === 'free' ? (
          <button
            onClick={() => openCheckoutModal('individual')}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-white text-black hover:bg-neutral-200 text-xs font-bold transition-transform hover:scale-105"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
            <span>Upgrade</span>
          </button>
        ) : (
          <button
            onClick={() => navigate('premium')}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/15 text-[#1DB954] text-xs font-semibold border border-[#1DB954]/30"
          >
            <Crown className="w-3.5 h-3.5 fill-[#1DB954]" />
            <span className="capitalize">{user.plan}</span>
          </button>
        )}

        {/* Profile Avatar & Dropdown */}
        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
            className="w-8 h-8 rounded-full overflow-hidden border border-white/20 hover:border-white transition-all ring-2 ring-transparent focus:ring-[#1DB954]"
            title={user.name}
          >
            <img
              src={user.avatarUrl}
              alt={user.name}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
          </button>

          {isProfileMenuOpen && (
            <div className="absolute right-0 mt-2 w-56 rounded-lg bg-[#282828] border border-white/10 shadow-2xl py-1 text-sm text-neutral-200 z-50 animate-fadeIn">
              <div className="px-4 py-2.5 border-b border-white/10">
                <div className="font-semibold text-white truncate">{user.name}</div>
                <div className="text-xs text-neutral-400 truncate">{user.email}</div>
                <div className="mt-1 flex items-center gap-1 text-[11px] text-[#1DB954]">
                  <Check className="w-3 h-3" />
                  <span className="capitalize">{user.plan} Subscription</span>
                </div>
              </div>

              <button
                onClick={() => {
                  navigate('profile');
                  setIsProfileMenuOpen(false);
                }}
                className="w-full px-4 py-2 text-left hover:bg-white/10 flex items-center gap-2.5 transition-colors"
              >
                <User className="w-4 h-4 text-neutral-400" />
                <span>Account Profile</span>
              </button>

              <button
                onClick={() => {
                  navigate('premium');
                  setIsProfileMenuOpen(false);
                }}
                className="w-full px-4 py-2 text-left hover:bg-white/10 flex items-center gap-2.5 transition-colors"
              >
                <Crown className="w-4 h-4 text-amber-400" />
                <span>Premium Plans</span>
              </button>

              <button
                onClick={() => {
                  toggleEqualizerModal(true);
                  setIsProfileMenuOpen(false);
                }}
                className="w-full px-4 py-2 text-left hover:bg-white/10 flex items-center gap-2.5 transition-colors"
              >
                <Sliders className="w-4 h-4 text-[#1DB954]" />
                <span>Audio Equalizer & Settings</span>
              </button>

              <button
                onClick={() => {
                  toggleDevicesModal(true);
                  setIsProfileMenuOpen(false);
                }}
                className="w-full px-4 py-2 text-left hover:bg-white/10 flex items-center gap-2.5 transition-colors"
              >
                <Laptop className="w-4 h-4 text-blue-400" />
                <span>Spotify Connect</span>
              </button>

              <div className="my-1 border-t border-white/10" />

              <button
                onClick={() => {
                  setIsProfileMenuOpen(false);
                }}
                className="w-full px-4 py-2 text-left hover:bg-white/10 text-neutral-400 hover:text-white flex items-center gap-2.5 transition-colors text-xs"
              >
                <LogOut className="w-4 h-4" />
                <span>Log out</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
