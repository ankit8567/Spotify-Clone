import React, { useState } from 'react';
import { useMusic } from '../../context/MusicContext';
import { X, Play, Pause, Trash2, Heart, ListMusic, History, Sparkles } from 'lucide-react';

export const QueueModal: React.FC = () => {
  const {
    isQueueOpen,
    toggleQueue,
    currentTrack,
    isPlaying,
    togglePlayPause,
    playTrack,
    queue,
    removeFromQueue,
    clearQueue,
    history,
    currentPlaylist,
    tracks,
    isLiked,
    toggleLike
  } = useMusic();

  const [activeTab, setActiveTab] = useState<'queue' | 'history'>('queue');

  if (!isQueueOpen) return null;

  // Next up tracks from current playlist or all tracks
  const contextTracks = currentPlaylist
    ? tracks.filter(t => currentPlaylist.trackIds.includes(t.id))
    : tracks;

  const currentIdx = currentTrack ? contextTracks.findIndex(t => t.id === currentTrack.id) : -1;
  const nextFromPlaylist = currentIdx >= 0 ? contextTracks.slice(currentIdx + 1, currentIdx + 8) : [];

  const formatDuration = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-end bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="h-full w-full max-w-md bg-[#181818] border-l border-white/10 shadow-2xl flex flex-col p-6 text-white overflow-hidden">
        {/* Header with Tabs */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10 shrink-0">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('queue')}
              className={`px-3 py-1.5 rounded-full text-xs font-bold transition-colors ${
                activeTab === 'queue' ? 'bg-white text-black' : 'text-neutral-400 hover:text-white'
              }`}
            >
              Play Queue
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`px-3 py-1.5 rounded-full text-xs font-bold transition-colors ${
                activeTab === 'history' ? 'bg-white text-black' : 'text-neutral-400 hover:text-white'
              }`}
            >
              Listening History
            </button>
          </div>

          <button
            onClick={() => toggleQueue(false)}
            className="w-8 h-8 rounded-full hover:bg-white/10 flex items-center justify-center text-neutral-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto py-4 space-y-6">
          {activeTab === 'queue' ? (
            <>
              {/* Now Playing Item */}
              {currentTrack && (
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-3">
                    Now Playing
                  </h3>
                  <div className="p-3 bg-white/10 rounded-xl flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-12 h-12 rounded-lg overflow-hidden shrink-0 bg-neutral-800">
                        <img
                          src={currentTrack.coverUrl}
                          alt={currentTrack.title}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="min-w-0">
                        <div className="font-bold text-sm text-[#1DB954] truncate">{currentTrack.title}</div>
                        <div className="text-xs text-neutral-300 truncate">{currentTrack.artist}</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={togglePlayPause}
                        className="w-8 h-8 rounded-full bg-white text-black flex items-center justify-center hover:scale-105"
                      >
                        {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current ml-0.5" />}
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Next In Queue (User Enqueued) */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-400">
                    Next In Queue ({queue.length})
                  </h3>
                  {queue.length > 0 && (
                    <button
                      onClick={clearQueue}
                      className="text-xs text-neutral-400 hover:text-rose-400 flex items-center gap-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Clear</span>
                    </button>
                  )}
                </div>

                {queue.length === 0 ? (
                  <p className="text-xs text-neutral-500 italic p-2">
                    No songs in queue. Add songs from any playlist or search result.
                  </p>
                ) : (
                  <div className="space-y-1.5">
                    {queue.map((track, i) => (
                      <div
                        key={`${track.id}-${i}`}
                        className="group p-2 rounded-lg hover:bg-white/5 flex items-center justify-between gap-2 text-xs"
                      >
                        <div
                          onClick={() => playTrack(track)}
                          className="flex items-center gap-2.5 min-w-0 cursor-pointer flex-1"
                        >
                          <div className="w-9 h-9 rounded overflow-hidden shrink-0 bg-neutral-800">
                            <img
                              src={track.coverUrl}
                              alt={track.title}
                              referrerPolicy="no-referrer"
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="min-w-0">
                            <div className="font-semibold text-white truncate">{track.title}</div>
                            <div className="text-neutral-400 truncate">{track.artist}</div>
                          </div>
                        </div>

                        <button
                          onClick={() => removeFromQueue(i)}
                          className="text-neutral-400 hover:text-rose-400 p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Next From Playlist */}
              {nextFromPlaylist.length > 0 && (
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-3">
                    Next from {currentPlaylist ? currentPlaylist.name : 'Library'}
                  </h3>
                  <div className="space-y-1.5">
                    {nextFromPlaylist.map((track) => (
                      <div
                        key={track.id}
                        onClick={() => playTrack(track, contextTracks, currentPlaylist || undefined)}
                        className="group p-2 rounded-lg hover:bg-white/5 flex items-center justify-between gap-2 text-xs cursor-pointer"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className="w-9 h-9 rounded overflow-hidden shrink-0 bg-neutral-800">
                            <img
                              src={track.coverUrl}
                              alt={track.title}
                              referrerPolicy="no-referrer"
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="min-w-0">
                            <div className="font-semibold text-white group-hover:text-[#1DB954] transition-colors truncate">
                              {track.title}
                            </div>
                            <div className="text-neutral-400 truncate">{track.artist}</div>
                          </div>
                        </div>
                        <span className="text-neutral-500 font-mono tabular-nums">
                          {formatDuration(track.duration)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          ) : (
            /* History Tab */
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-3">
                Recently Played Tracks
              </h3>
              {history.length === 0 ? (
                <p className="text-xs text-neutral-500 italic p-2">
                  No recently played history yet. Play some tracks!
                </p>
              ) : (
                <div className="space-y-1.5">
                  {history.map((track, i) => (
                    <div
                      key={`${track.id}-${i}`}
                      onClick={() => playTrack(track)}
                      className="group p-2 rounded-lg hover:bg-white/5 flex items-center justify-between gap-2 text-xs cursor-pointer"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="w-9 h-9 rounded overflow-hidden shrink-0 bg-neutral-800">
                          <img
                            src={track.coverUrl}
                            alt={track.title}
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="min-w-0">
                          <div className="font-semibold text-white group-hover:text-[#1DB954] truncate">
                            {track.title}
                          </div>
                          <div className="text-neutral-400 truncate">{track.artist}</div>
                        </div>
                      </div>
                      <span className="text-neutral-500 font-mono tabular-nums">
                        {formatDuration(track.duration)}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
