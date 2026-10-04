import React from 'react';
import { useMusic } from '../../context/MusicContext';
import { EqualizerPreset } from '../../types';
import { Sliders, X, Sparkles, Volume2, Check } from 'lucide-react';

export const EqualizerModal: React.FC = () => {
  const {
    isEqualizerModalOpen,
    toggleEqualizerModal,
    eqPreset,
    setEqPreset,
    eqBands,
    setBandGain,
    streamingQuality,
    setStreamingQuality,
    user,
    openCheckoutModal
  } = useMusic();

  if (!isEqualizerModalOpen) return null;

  const presets: { id: EqualizerPreset; label: string }[] = [
    { id: 'flat', label: 'Flat' },
    { id: 'bass_boost', label: 'Bass Boost' },
    { id: 'vocal_booster', label: 'Vocal Booster' },
    { id: 'electronic', label: 'Electronic Club' },
    { id: 'acoustic', label: 'Acoustic' },
    { id: 'hifi_clarity', label: 'Hi-Fi Clarity' }
  ];

  const bandsList: { key: keyof typeof eqBands; label: string; freq: string }[] = [
    { key: 'bass', label: 'Bass', freq: '60 Hz' },
    { key: 'lowMid', label: 'Low Mid', freq: '250 Hz' },
    { key: 'mid', label: 'Mid', freq: '1 kHz' },
    { key: 'highMid', label: 'High Mid', freq: '4 kHz' },
    { key: 'treble', label: 'Treble', freq: '12 kHz' }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
      <div className="bg-[#242424] border border-white/10 rounded-2xl w-full max-w-xl shadow-2xl p-6 space-y-6 text-white">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <Sliders className="w-5 h-5 text-[#1DB954]" />
            <h2 className="text-lg font-bold">Hardware Audio Equalizer & Quality</h2>
          </div>
          <button
            onClick={() => toggleEqualizerModal(false)}
            className="w-8 h-8 rounded-full hover:bg-white/10 flex items-center justify-center text-neutral-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 1. Audio Streaming Quality Switcher */}
        <div>
          <label className="text-xs font-semibold text-neutral-300 block mb-2">
            Streaming Bitrate & Audio Resolution
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {[
              { id: 'normal', name: 'Normal', rate: '96 kbps' },
              { id: 'high', name: 'High', rate: '160 kbps' },
              { id: 'very_high', name: 'Very High', rate: '320 kbps' },
              { id: 'lossless', name: 'Hi-Fi Lossless', rate: '24-bit FLAC', pro: true }
            ].map((q) => {
              const active = streamingQuality === q.id;
              return (
                <button
                  key={q.id}
                  onClick={() => {
                    if (q.pro && user.plan === 'free') {
                      openCheckoutModal('individual');
                      return;
                    }
                    setStreamingQuality(q.id as any);
                  }}
                  className={`p-2.5 rounded-xl text-center border transition-all ${
                    active
                      ? 'bg-[#1DB954]/20 border-[#1DB954] text-[#1DB954]'
                      : 'bg-white/5 border-white/5 hover:border-white/10 text-neutral-300'
                  }`}
                >
                  <div className="text-xs font-bold truncate">{q.name}</div>
                  <div className="text-[10px] font-mono text-neutral-400">{q.rate}</div>
                  {q.pro && (
                    <span className="mt-1 inline-block text-[9px] font-extrabold uppercase px-1.5 py-0.2 rounded bg-amber-400 text-black">
                      Master
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* 2. Equalizer Presets */}
        <div>
          <label className="text-xs font-semibold text-neutral-300 block mb-2">
            Equalizer Presets
          </label>
          <div className="flex flex-wrap gap-2">
            {presets.map(p => (
              <button
                key={p.id}
                onClick={() => setEqPreset(p.id)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                  eqPreset === p.id
                    ? 'bg-[#1DB954] text-black font-bold'
                    : 'bg-white/10 hover:bg-white/15 text-neutral-300'
                }`}
              >
                {p.label}
              </button>
            ))}
            {eqPreset === 'custom' && (
              <span className="px-3 py-1.5 rounded-full text-xs font-bold bg-white/20 text-white">
                Custom Sliders
              </span>
            )}
          </div>
        </div>

        {/* 3. 5-Band Graphic Sliders */}
        <div className="bg-[#1a1a1a] p-5 rounded-xl border border-white/5">
          <div className="flex items-center justify-between h-44 px-4">
            {bandsList.map(({ key, label, freq }) => {
              const val = eqBands[key];
              return (
                <div key={key} className="flex flex-col items-center h-full justify-between w-16">
                  {/* Gain label */}
                  <span className="text-[11px] font-mono text-neutral-300 tabular-nums">
                    {val > 0 ? `+${val}` : val} dB
                  </span>

                  {/* Vertical Slider */}
                  <div className="relative flex items-center justify-center h-28 w-8">
                    <input
                      type="range"
                      min={-12}
                      max={12}
                      step={1}
                      value={val}
                      onChange={(e) => setBandGain(key, parseInt(e.target.value))}
                      className="w-24 -rotate-90 origin-center accent-[#1DB954] cursor-pointer"
                    />
                  </div>

                  {/* Band Frequency info */}
                  <div className="text-center">
                    <span className="text-xs font-bold text-white block">{label}</span>
                    <span className="text-[10px] text-neutral-500 font-mono">{freq}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between text-xs text-neutral-400 pt-2">
          <span>Real-time BiquadFilter DSP engine active</span>
          <button
            onClick={() => setEqPreset('flat')}
            className="text-neutral-400 hover:text-white underline text-xs"
          >
            Reset to Flat
          </button>
        </div>
      </div>
    </div>
  );
};
