import React, { useEffect, useRef } from 'react';
import { useMusic } from '../../context/MusicContext';
import { globalAudioEngine } from '../../services/audioEngine';
import { X, Mic2, Sparkles, Sliders } from 'lucide-react';

export const LyricsView: React.FC = () => {
  const { currentTrack, currentTime, seekTo, toggleLyrics, isPlaying, streamingQuality } = useMusic();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const activeLineRef = useRef<HTMLParagraphElement>(null);

  // Auto-scroll to active lyric line
  useEffect(() => {
    if (activeLineRef.current) {
      activeLineRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'center'
      });
    }
  }, [currentTime]);

  // Audio Visualizer Canvas animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;

    const render = () => {
      const width = canvas.width;
      const height = canvas.height;
      ctx.clearRect(0, 0, width, height);

      const freqData = globalAudioEngine.getFrequencyData();
      const numBars = 48;
      const barWidth = width / numBars;

      for (let i = 0; i < numBars; i++) {
        const val = freqData[i % freqData.length] || 10;
        const percent = val / 255;
        const barHeight = Math.max(4, percent * height * 0.85);

        // Gradient for bars
        const grad = ctx.createLinearGradient(0, height, 0, height - barHeight);
        grad.addColorStop(0, 'rgba(29, 185, 84, 0.1)');
        grad.addColorStop(1, 'rgba(29, 185, 84, 0.7)');

        ctx.fillStyle = grad;
        ctx.fillRect(i * barWidth, height - barHeight, barWidth - 2, barHeight);
      }

      animId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animId);
  }, []);

  if (!currentTrack) return null;

  const lyrics = currentTrack.lyrics || [];

  // Determine current active lyric index
  let activeIndex = 0;
  for (let i = 0; i < lyrics.length; i++) {
    if (currentTime >= lyrics[i].time) {
      activeIndex = i;
    } else {
      break;
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col transition-all duration-700 overflow-hidden"
      style={{
        background: `radial-gradient(circle at 50% 20%, ${currentTrack.accentColor} 0%, #0d0d0d 75%)`
      }}
    >
      {/* Top Header */}
      <div className="h-20 px-8 flex items-center justify-between z-10 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-lg overflow-hidden shadow-lg bg-neutral-900">
            <img
              src={currentTrack.coverUrl}
              alt={currentTrack.title}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <div className="font-bold text-white text-base truncate max-w-xs sm:max-w-md">{currentTrack.title}</div>
            <div className="text-xs text-white/70 truncate">{currentTrack.artist}</div>
          </div>
          <div className="ml-3 hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/40 backdrop-blur border border-white/10 text-[11px] font-mono font-bold text-[#1DB954]">
            <Sparkles className="w-3 h-3 fill-current" />
            <span>{streamingQuality === 'lossless' ? 'Hi-Fi 24-bit FLAC' : '320 kbps'}</span>
          </div>
        </div>

        <button
          onClick={() => toggleLyrics(false)}
          className="w-10 h-10 rounded-full bg-black/60 hover:bg-black/90 text-white flex items-center justify-center transition-all hover:scale-105"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Main Lyrics Scroll Area */}
      <div className="flex-1 overflow-y-auto px-6 sm:px-16 md:px-24 lg:px-36 py-12 space-y-6 sm:space-y-8 no-scrollbar text-center sm:text-left z-10">
        {lyrics.length === 0 ? (
          <div className="text-center py-32 text-white/60">
            <Mic2 className="w-12 h-12 mx-auto mb-3 opacity-40" />
            <p className="text-lg">Looks like we don't have the lyrics for this song yet.</p>
          </div>
        ) : (
          lyrics.map((line, idx) => {
            const isActive = idx === activeIndex;
            const isPassed = idx < activeIndex;

            return (
              <p
                key={idx}
                ref={isActive ? activeLineRef : null}
                onClick={() => seekTo(line.time)}
                className={`text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight transition-all duration-300 cursor-pointer select-none leading-snug ${
                  isActive
                    ? 'text-white scale-[1.02] origin-left drop-shadow-md'
                    : isPassed
                    ? 'text-white/40 hover:text-white/70'
                    : 'text-white/30 hover:text-white/60'
                }`}
              >
                {line.text}
              </p>
            );
          })
        )}
      </div>

      {/* Bottom Live Audio Visualizer Canvas */}
      <div className="h-28 w-full shrink-0 relative overflow-hidden pointer-events-none opacity-50">
        <canvas ref={canvasRef} width={800} height={112} className="w-full h-full" />
      </div>
    </div>
  );
};
