import React from 'react';
import { useMusic } from '../../context/MusicContext';
import { SleepTimerOption } from '../../types';
import { Moon, X, Check, Clock, Volume2, Sparkles } from 'lucide-react';

export const SleepTimerModal: React.FC = () => {
  const {
    isSleepTimerModalOpen,
    toggleSleepTimerModal,
    activeSleepTimerOption,
    sleepTimerRemaining,
    setSleepTimer,
    cancelSleepTimer,
    currentTrack
  } = useMusic();

  if (!isSleepTimerModalOpen) return null;

  const timerOptions: { id: SleepTimerOption; label: string; desc: string }[] = [
    { id: 5, label: '5 minutes', desc: 'Quick relaxation' },
    { id: 10, label: '10 minutes', desc: 'Short power nap' },
    { id: 15, label: '15 minutes', desc: 'Standard bedtime timer' },
    { id: 30, label: '30 minutes', desc: 'Deep sleep transition' },
    { id: 45, label: '45 minutes', desc: 'Extended rest' },
    { id: 60, label: '1 hour', desc: 'Night sleep session' },
    { id: 'end_of_track', label: 'End of Track', desc: `Stops after "${currentTrack?.title || 'current song'}" finishes` }
  ];

  const formatRemaining = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
      <div className="bg-[#242424] border border-white/10 rounded-2xl w-full max-w-md shadow-2xl p-6 space-y-6 text-white">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <Moon className="w-5 h-5 text-indigo-400 fill-indigo-400/30" />
            <h2 className="text-lg font-bold">Sleep Timer</h2>
          </div>
          <button
            onClick={() => toggleSleepTimerModal(false)}
            className="w-8 h-8 rounded-full hover:bg-white/10 flex items-center justify-center text-neutral-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Active Countdown Card (if running) */}
        {sleepTimerRemaining !== null && (
          <div className="bg-gradient-to-r from-indigo-950/60 to-purple-950/60 border border-indigo-500/30 rounded-xl p-4 flex items-center justify-between shadow-lg">
            <div className="space-y-0.5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-300">
                Music Stops In
              </span>
              <div className="text-3xl font-black font-mono tracking-tight text-white">
                {formatRemaining(sleepTimerRemaining)}
              </div>
              <div className="text-xs text-neutral-300">
                Gentle volume fade-out active in the last 15s
              </div>
            </div>

            <button
              onClick={cancelSleepTimer}
              className="px-3 py-1.5 rounded-full bg-white/10 hover:bg-rose-500/20 text-neutral-300 hover:text-rose-400 border border-white/10 hover:border-rose-500/30 text-xs font-semibold transition-all"
            >
              Turn off timer
            </button>
          </div>
        )}

        {/* Options List */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-neutral-400 uppercase tracking-wider block mb-2">
            Select duration
          </label>

          {timerOptions.map(opt => {
            const isSelected = activeSleepTimerOption === opt.id;
            return (
              <button
                key={String(opt.id)}
                onClick={() => setSleepTimer(opt.id)}
                className={`w-full p-3 rounded-xl flex items-center justify-between transition-colors text-left ${
                  isSelected
                    ? 'bg-[#1DB954]/20 border border-[#1DB954]/50 text-white shadow-md'
                    : 'bg-white/5 hover:bg-white/10 border border-white/5 text-neutral-300 hover:text-white'
                }`}
              >
                <div>
                  <div className={`text-sm font-bold ${isSelected ? 'text-[#1DB954]' : 'text-white'}`}>
                    {opt.label}
                  </div>
                  <div className="text-xs text-neutral-400">{opt.desc}</div>
                </div>

                {isSelected ? (
                  <Check className="w-5 h-5 text-[#1DB954]" />
                ) : (
                  <Clock className="w-4 h-4 text-neutral-500" />
                )}
              </button>
            );
          })}
        </div>

        {/* Footer info */}
        <div className="flex items-center justify-between text-xs text-neutral-400 pt-2 border-t border-white/10">
          <div className="flex items-center gap-1.5">
            <Volume2 className="w-3.5 h-3.5 text-indigo-400" />
            <span>Gentle sleep fade-out</span>
          </div>
          {activeSleepTimerOption && (
            <button
              onClick={cancelSleepTimer}
              className="text-rose-400 hover:underline text-xs"
            >
              Cancel timer
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
