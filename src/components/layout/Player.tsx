import React, { useState, useEffect, useRef } from 'react';
import { useMusic } from '../../context/MusicContext';
import { globalAudioEngine } from '../../services/audioEngine';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Shuffle,
  Repeat,
  Repeat1,
  Heart,
  Volume2,
  VolumeX,
  Volume1,
  Maximize2,
  ListMusic,
  Mic2,
  Laptop,
  CheckCircle2,
  ArrowDownCircle,
  Sliders,
  Moon
} from 'lucide-react';

export const Player: React.FC = () => {
  const {
    currentTrack,
    isPlaying,
    currentTime,
    duration,
    volume,
    isMuted,
    isShuffle,
    repeatMode,
    streamingQuality,
    togglePlayPause,
    seekTo,
    nextTrack,
    prevTrack,
    toggleShuffle,
    cycleRepeat,
    setVolumeLevel,
    toggleMute,
    isLiked,
    toggleLike,
    isDownloaded,
    toggleDownloadTrack,
    isLyricsOpen,
    toggleLyrics,
    isQueueOpen,
    toggleQueue,
    toggleDevicesModal,
    toggleEqualizerModal,
    sleepTimerRemaining,
    toggleSleepTimerModal,
    activeDevice,
    navigate
  } = useMusic();

  const [isSeeking, setIsSeeking] = useState(false);
  const [seekValue, setSeekValue] = useState(0);
  const [visualizerBars, setVisualizerBars] = useState<number[]>([15, 25, 40, 30, 20]);
  const animationFrameRef = useRef<number | null>(null);

  // Keep seekValue in sync with currentTime while not dragging
  useEffect(() => {
    if (!isSeeking) {
      setSeekValue(currentTime);
    }
  }, [currentTime, isSeeking]);

  // Real-time visualizer animation loop
  useEffect(() => {
    const updateBars = () => {
      if (isPlaying) {
        const freqData = globalAudioEngine.getFrequencyData();
        // Sample 5 representative frequency bands
        if (freqData.length >= 16) {
          const b1 = Math.min(100, Math.max(15, (freqData[1] / 255) * 100));
          const b2 = Math.min(100, Math.max(15, (freqData[3] / 255) * 100));
          const b3 = Math.min(100, Math.max(15, (freqData[6] / 255) * 100));
          const b4 = Math.min(100, Math.max(15, (freqData[10] / 255) * 100));
          const b5 = Math.min(100, Math.max(15, (freqData[14] / 255) * 100));
          setVisualizerBars([b1, b2, b3, b4, b5]);
        }
      } else {
        setVisualizerBars([15, 20, 15, 20, 15]);
      }
      animationFrameRef.current = requestAnimationFrame(updateBars);
    };

    animationFrameRef.current = requestAnimationFrame(updateBars);
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isPlaying]);

  const formatTime = (secs: number) => {
    const totalSecs = Math.floor(secs || 0);
    const m = Math.floor(totalSecs / 60);
    const s = totalSecs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const progressPercent = duration > 0 ? ((isSeeking ? seekValue : currentTime) / duration) * 100 : 0;
  const volumePercent = (isMuted ? 0 : volume) * 100;

  const handleSeekChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSeekValue(parseFloat(e.target.value));
  };

  const handleSeekMouseDown = () => {
    setIsSeeking(true);
  };

  const handleSeekMouseUp = () => {
    setIsSeeking(false);
    seekTo(seekValue);
  };

  if (!currentTrack) return null;

  const trackIsLiked = isLiked(currentTrack.id);
  const trackIsDownloaded = isDownloaded(currentTrack.id);

  return (
    <footer className="h-20 sm:h-22 bg-[#121212] border-t border-white/10 px-4 sm:px-6 flex items-center justify-between z-40 select-none">
      {/* 1. Track Info (Left) */}
      <div className="flex items-center gap-3.5 w-1/4 min-w-[180px] max-w-[320px]">
        <div
          onClick={() => toggleLyrics(true)}
          className="relative w-14 h-14 rounded-md overflow-hidden shrink-0 group cursor-pointer shadow-md bg-neutral-800"
        >
          <img
            src={currentTrack.coverUrl}
            alt={currentTrack.title}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
          />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
            <Maximize2 className="w-4 h-4 text-white" />
          </div>
        </div>

        <div className="flex-1 min-w-0">
          <div
            onClick={() => navigate('playlist', currentTrack.album)}
            className="font-medium text-sm text-white truncate cursor-pointer hover:underline"
          >
            {currentTrack.title}
          </div>
          <div
            onClick={() => navigate('artist', currentTrack.artistId)}
            className="text-xs text-neutral-400 truncate cursor-pointer hover:underline hover:text-white"
          >
            {currentTrack.artist}
          </div>
        </div>

        {/* Like Button */}
        <button
          onClick={() => toggleLike(currentTrack.id)}
          title={trackIsLiked ? 'Remove from Liked Songs' : 'Save to Liked Songs'}
          className="text-neutral-400 hover:text-white transition-colors shrink-0 p-1"
        >
          <Heart
            className={`w-5 h-5 transition-transform active:scale-125 ${
              trackIsLiked ? 'text-[#1DB954] fill-[#1DB954]' : ''
            }`}
          />
        </button>

        {/* Offline Download button */}
        <button
          onClick={() => toggleDownloadTrack(currentTrack.id)}
          title={trackIsDownloaded ? 'Downloaded for offline playback' : 'Download track offline'}
          className="text-neutral-400 hover:text-white transition-colors shrink-0 p-1"
        >
          {trackIsDownloaded ? (
            <CheckCircle2 className="w-5 h-5 text-[#1DB954]" />
          ) : (
            <ArrowDownCircle className="w-5 h-5 hover:text-[#1DB954]" />
          )}
        </button>
      </div>

      {/* 2. Playback Controls & Scrubber (Center) */}
      <div className="flex flex-col items-center gap-1.5 flex-1 max-w-2xl px-4">
        {/* Buttons */}
        <div className="flex items-center gap-4 sm:gap-6">
          <button
            onClick={toggleShuffle}
            title={isShuffle ? 'Disable shuffle' : 'Enable shuffle'}
            className={`transition-colors relative p-1 ${
              isShuffle ? 'text-[#1DB954]' : 'text-neutral-400 hover:text-white'
            }`}
          >
            <Shuffle className="w-4 h-4" />
            {isShuffle && (
              <span className="w-1 h-1 rounded-full bg-[#1DB954] absolute -bottom-1 left-1/2 -translate-x-1/2" />
            )}
          </button>

          <button
            onClick={prevTrack}
            title="Previous track"
            className="text-neutral-300 hover:text-white transition-colors p-1"
          >
            <SkipBack className="w-5 h-5 fill-current" />
          </button>

          <button
            onClick={togglePlayPause}
            title={isPlaying ? 'Pause' : 'Play'}
            className="w-9 h-9 rounded-full bg-white text-black hover:scale-105 active:scale-95 flex items-center justify-center transition-all shadow-md"
          >
            {isPlaying ? (
              <Pause className="w-5 h-5 fill-current" />
            ) : (
              <Play className="w-5 h-5 fill-current ml-0.5" />
            )}
          </button>

          <button
            onClick={nextTrack}
            title="Next track"
            className="text-neutral-300 hover:text-white transition-colors p-1"
          >
            <SkipForward className="w-5 h-5 fill-current" />
          </button>

          <button
            onClick={cycleRepeat}
            title={`Repeat mode: ${repeatMode}`}
            className={`transition-colors relative p-1 ${
              repeatMode !== 'off' ? 'text-[#1DB954]' : 'text-neutral-400 hover:text-white'
            }`}
          >
            {repeatMode === 'one' ? (
              <Repeat1 className="w-4 h-4" />
            ) : (
              <Repeat className="w-4 h-4" />
            )}
            {repeatMode !== 'off' && (
              <span className="w-1 h-1 rounded-full bg-[#1DB954] absolute -bottom-1 left-1/2 -translate-x-1/2" />
            )}
          </button>
        </div>

        {/* Scrubber Bar */}
        <div className="flex items-center gap-2.5 w-full group">
          <span className="text-[11px] text-neutral-400 tabular-nums w-9 text-right font-mono">
            {formatTime(isSeeking ? seekValue : currentTime)}
          </span>

          <div className="relative flex-1 flex items-center h-4 cursor-pointer">
            <input
              type="range"
              min={0}
              max={duration || 100}
              step={0.5}
              value={isSeeking ? seekValue : currentTime}
              onChange={handleSeekChange}
              onMouseDown={handleSeekMouseDown}
              onMouseUp={handleSeekMouseUp}
              onTouchStart={handleSeekMouseDown}
              onTouchEnd={handleSeekMouseUp}
              className="w-full absolute z-10 opacity-0 cursor-pointer h-4"
            />
            {/* Custom Track Background */}
            <div className="w-full h-1 bg-neutral-700/80 rounded-full overflow-hidden">
              <div
                className="h-full bg-white group-hover:bg-[#1DB954] transition-colors"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            {/* Scrubber Knob */}
            <div
              className="w-3 h-3 bg-white rounded-full absolute -ml-1.5 opacity-0 group-hover:opacity-100 shadow-md pointer-events-none transition-opacity"
              style={{ left: `${progressPercent}%` }}
            />
          </div>

          <span className="text-[11px] text-neutral-400 tabular-nums w-9 font-mono">
            {formatTime(duration)}
          </span>
        </div>
      </div>

      {/* 3. Audio Visualizer, Equalizer, Devices & Volume (Right) */}
      <div className="flex items-center justify-end gap-3 sm:gap-4 w-1/4 min-w-[200px]">
        {/* Real-time Visualizer Mini Bars */}
        <div
          onClick={() => toggleEqualizerModal(true)}
          title="Hardware Audio Frequency Visualizer"
          className="hidden xl:flex items-end gap-0.5 h-4 w-7 cursor-pointer py-0.5 group"
        >
          {visualizerBars.map((height, i) => (
            <div
              key={i}
              className="w-1 bg-[#1DB954] rounded-t-sm transition-all duration-75 group-hover:bg-white"
              style={{ height: `${height}%` }}
            />
          ))}
        </div>

        {/* Audio Streaming Quality Badge */}
        <button
          onClick={() => toggleEqualizerModal(true)}
          title="Streaming Audio Quality & 5-Band Equalizer"
          className="flex items-center gap-1 px-2 py-0.5 rounded bg-white/10 hover:bg-white/20 text-[10px] font-mono font-bold tracking-tight text-neutral-300 hover:text-white transition-colors"
        >
          <Sliders className="w-3 h-3 text-[#1DB954]" />
          <span className={streamingQuality === 'lossless' ? 'text-[#1DB954]' : ''}>
            {streamingQuality === 'lossless' ? 'FLAC' : streamingQuality === 'very_high' ? '320k' : '160k'}
          </span>
        </button>

        {/* Lyrics Toggle */}
        <button
          onClick={() => toggleLyrics()}
          title="Synchronized Lyrics"
          className={`p-1 transition-colors ${
            isLyricsOpen ? 'text-[#1DB954]' : 'text-neutral-400 hover:text-white'
          }`}
        >
          <Mic2 className="w-4 h-4" />
        </button>

        {/* Queue Drawer Toggle */}
        <button
          onClick={() => toggleQueue()}
          title="Queue"
          className={`p-1 transition-colors ${
            isQueueOpen ? 'text-[#1DB954]' : 'text-neutral-400 hover:text-white'
          }`}
        >
          <ListMusic className="w-4 h-4" />
        </button>

        {/* Spotify Connect Devices Picker */}
        <button
          onClick={() => toggleDevicesModal()}
          title={`Connect to a device (${activeDevice.name})`}
          className={`p-1 transition-colors ${
            activeDevice.id !== 'dev-web' ? 'text-[#1DB954]' : 'text-neutral-400 hover:text-white'
          }`}
        >
          <Laptop className="w-4 h-4" />
        </button>

        {/* Volume Controls */}
        <div className="hidden md:flex items-center gap-2 group w-28">
          <button
            onClick={toggleMute}
            title={isMuted ? 'Unmute' : 'Mute'}
            className="text-neutral-400 hover:text-white transition-colors"
          >
            {isMuted || volume === 0 ? (
              <VolumeX className="w-4 h-4 text-rose-400" />
            ) : volume < 0.5 ? (
              <Volume1 className="w-4 h-4" />
            ) : (
              <Volume2 className="w-4 h-4" />
            )}
          </button>

          <div className="relative flex-1 flex items-center h-4 cursor-pointer">
            <input
              type="range"
              min={0}
              max={1}
              step={0.01}
              value={isMuted ? 0 : volume}
              onChange={(e) => setVolumeLevel(parseFloat(e.target.value))}
              className="w-full absolute z-10 opacity-0 cursor-pointer h-4"
            />
            <div className="w-full h-1 bg-neutral-700/80 rounded-full overflow-hidden">
              <div
                className="h-full bg-white group-hover:bg-[#1DB954] transition-colors"
                style={{ width: `${volumePercent}%` }}
              />
            </div>
            <div
              className="w-2.5 h-2.5 bg-white rounded-full absolute -ml-1 opacity-0 group-hover:opacity-100 shadow-md pointer-events-none transition-opacity"
              style={{ left: `${volumePercent}%` }}
            />
          </div>
        </div>
      </div>
    </footer>
  );
};
