import React, { useState } from 'react';
import { useMusic } from '../../context/MusicContext';
import {
  X,
  Laptop,
  Smartphone,
  Speaker,
  Tv,
  Check,
  Zap,
  Users,
  Copy,
  RefreshCw
} from 'lucide-react';

export const DeviceModal: React.FC = () => {
  const {
    isDevicesModalOpen,
    toggleDevicesModal,
    devices,
    activeDevice,
    setActiveDevice,
    triggerCrossPlatformSync
  } = useMusic();

  const [copiedCode, setCopiedCode] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

  if (!isDevicesModalOpen) return null;

  const handleSyncAll = () => {
    setIsSyncing(true);
    triggerCrossPlatformSync();
    setTimeout(() => setIsSyncing(false), 800);
  };

  const copyJamCode = () => {
    navigator.clipboard?.writeText?.('JAM-SPOTIFY-8942');
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const getDeviceIcon = (type: string, active: boolean) => {
    const cls = `w-5 h-5 ${active ? 'text-[#1DB954]' : 'text-neutral-400'}`;
    switch (type) {
      case 'smartphone': return <Smartphone className={cls} />;
      case 'speaker': return <Speaker className={cls} />;
      case 'tv': return <Tv className={cls} />;
      default: return <Laptop className={cls} />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
      <div className="bg-[#242424] border border-white/10 rounded-2xl w-full max-w-md shadow-2xl p-6 space-y-6 text-white">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <Laptop className="w-5 h-5 text-[#1DB954]" />
            <h2 className="text-lg font-bold">Connect to a device</h2>
          </div>
          <button
            onClick={() => toggleDevicesModal(false)}
            className="w-8 h-8 rounded-full hover:bg-white/10 flex items-center justify-center text-neutral-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Current Active Device Banner */}
        <div className="bg-[#1DB954]/10 border border-[#1DB954]/30 rounded-xl p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-full bg-[#1DB954] text-black">
              {getDeviceIcon(activeDevice.type, false)}
            </div>
            <div>
              <div className="text-xs text-neutral-400">Current listening on</div>
              <div className="text-sm font-bold text-white">{activeDevice.name}</div>
            </div>
          </div>
          <span className="w-2.5 h-2.5 rounded-full bg-[#1DB954] animate-ping" />
        </div>

        {/* Device Picker List */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-neutral-400 uppercase tracking-wider block">
            Select a device
          </label>
          <div className="space-y-1">
            {devices.map(dev => {
              const isSelected = dev.id === activeDevice.id;
              return (
                <button
                  key={dev.id}
                  onClick={() => {
                    setActiveDevice(dev.id);
                  }}
                  className={`w-full p-3 rounded-xl flex items-center justify-between transition-colors ${
                    isSelected
                      ? 'bg-white/10 text-[#1DB954]'
                      : 'hover:bg-white/5 text-neutral-300 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-3 text-left">
                    {getDeviceIcon(dev.type, isSelected)}
                    <div>
                      <div className={`text-sm font-semibold ${isSelected ? 'text-[#1DB954]' : 'text-white'}`}>
                        {dev.name}
                      </div>
                      <div className="text-xs text-neutral-400">
                        Spotify Connect · {dev.lastSynced}
                      </div>
                    </div>
                  </div>

                  {isSelected && <Check className="w-5 h-5 text-[#1DB954]" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Group Jam Listening Session */}
        <div className="bg-[#181818] p-4 rounded-xl border border-white/5 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-bold text-white">
              <Users className="w-4 h-4 text-[#1DB954]" />
              <span>Start a Remote Group Jam</span>
            </div>
            <span className="text-[10px] font-bold text-black bg-[#1DB954] px-2 py-0.5 rounded-full">
              LIVE
            </span>
          </div>
          <p className="text-xs text-neutral-400">
            Invite friends anywhere to add songs, listen in real-time, and control playback together.
          </p>
          <div className="flex items-center gap-2">
            <div className="flex-1 bg-black/40 border border-white/10 px-3 py-1.5 rounded-lg font-mono text-xs text-neutral-300">
              JAM-SPOTIFY-8942
            </div>
            <button
              onClick={copyJamCode}
              className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              {copiedCode ? <Check className="w-3.5 h-3.5 text-[#1DB954]" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedCode ? 'Copied' : 'Copy'}</span>
            </button>
          </div>
        </div>

        {/* Sync Button Footer */}
        <div className="flex items-center justify-between pt-2">
          <button
            onClick={handleSyncAll}
            className="flex items-center gap-1.5 text-xs text-neutral-400 hover:text-white transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin text-[#1DB954]' : ''}`} />
            <span>Sync Cloud Playback State</span>
          </button>
          <button
            onClick={() => toggleDevicesModal(false)}
            className="px-4 py-1.5 rounded-full bg-white text-black font-bold text-xs hover:bg-neutral-200"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
