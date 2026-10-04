import React from 'react';
import { useMusic } from '../../context/MusicContext';
import { WifiOff, Download, Wifi, X } from 'lucide-react';

export const OfflineAlertModal: React.FC = () => {
  const {
    offlineAlertMessage,
    dismissOfflineAlert,
    toggleOfflineMode,
    currentTrack,
    toggleDownloadTrack
  } = useMusic();

  if (!offlineAlertMessage) return null;

  const handleTurnOffOffline = () => {
    toggleOfflineMode(false);
    dismissOfflineAlert();
  };

  const handleDownloadNow = () => {
    if (currentTrack) {
      toggleDownloadTrack(currentTrack.id);
    }
    dismissOfflineAlert();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
      <div className="bg-[#242424] border border-amber-500/40 rounded-2xl w-full max-w-md shadow-2xl p-6 space-y-5 text-white">
        <div className="flex items-start justify-between">
          <div className="w-12 h-12 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
            <WifiOff className="w-6 h-6" />
          </div>
          <button
            onClick={dismissOfflineAlert}
            className="w-8 h-8 rounded-full hover:bg-white/10 flex items-center justify-center text-neutral-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-2">
          <h3 className="text-xl font-bold text-white">Offline Mode Active</h3>
          <p className="text-xs text-neutral-300 leading-relaxed">
            {offlineAlertMessage}
          </p>
        </div>

        <div className="flex flex-col gap-2 pt-2">
          <button
            onClick={handleTurnOffOffline}
            className="w-full py-2.5 rounded-full bg-white text-black font-bold text-xs hover:bg-neutral-200 flex items-center justify-center gap-2 transition-colors"
          >
            <Wifi className="w-4 h-4" />
            <span>Turn Off Offline Mode & Play</span>
          </button>

          <button
            onClick={handleDownloadNow}
            className="w-full py-2.5 rounded-full bg-[#1DB954] hover:bg-[#1ed760] text-black font-bold text-xs flex items-center justify-center gap-2 transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Download Track Offline</span>
          </button>

          <button
            onClick={dismissOfflineAlert}
            className="w-full py-2 text-neutral-400 hover:text-white text-xs font-semibold"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};
