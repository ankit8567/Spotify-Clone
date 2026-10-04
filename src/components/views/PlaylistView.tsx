import React, { useState } from 'react';
import { useMusic } from '../../context/MusicContext';
import {
  Play,
  Pause,
  Clock,
  Heart,
  MoreHorizontal,
  Edit2,
  Trash2,
  ArrowDownCircle,
  CheckCircle2,
  Search,
  Music,
  Plus
} from 'lucide-react';

export const PlaylistView: React.FC = () => {
  const {
    selectedPlaylistId,
    playlists,
    tracks,
    currentTrack,
    isPlaying,
    playTrack,
    togglePlayPause,
    isLiked,
    toggleLike,
    isDownloaded,
    toggleDownloadTrack,
    downloadPlaylist,
    removeTrackFromPlaylist,
    deletePlaylist,
    openEditPlaylistModal,
    addToQueue,
    user,
    navigate
  } = useMusic();

  const [playlistSearch, setPlaylistSearch] = useState('');
  const [activeMenuTrackId, setActiveMenuTrackId] = useState<string | null>(null);

  const playlist = playlists.find(p => p.id === selectedPlaylistId) || playlists[0];
  if (!playlist) return null;

  // Resolve tracks for this playlist
  const playlistTracks = tracks.filter(t => playlist.trackIds.includes(t.id));

  // Filtered by internal playlist search
  const filteredTracks = playlistSearch
    ? playlistTracks.filter(
        t =>
          t.title.toLowerCase().includes(playlistSearch.toLowerCase()) ||
          t.artist.toLowerCase().includes(playlistSearch.toLowerCase()) ||
          t.album.toLowerCase().includes(playlistSearch.toLowerCase())
      )
    : playlistTracks;

  // Total duration in minutes
  const totalSeconds = playlistTracks.reduce((acc, t) => acc + t.duration, 0);
  const totalMinutes = Math.floor(totalSeconds / 60);

  const formatDuration = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const isCurrentPlaylistPlaying =
    isPlaying && currentTrack && playlist.trackIds.includes(currentTrack.id);

  const isUserPlaylist = !playlist.isLikedSongs && playlist.creator.id === user.id;

  return (
    <div className="pb-32">
      {/* 1. Dynamic Hero Gradient Header */}
      <div
        className="relative px-6 md:px-8 pt-10 pb-8 flex flex-col md:flex-row items-start md:items-end gap-6 transition-colors duration-500"
        style={{
          background: `linear-gradient(180deg, ${playlist.accentColor || '#4f46e5'} 0%, rgba(18,18,18,0.95) 100%)`
        }}
      >
        {/* Cover Art (Interactive click to edit) */}
        <div
          onClick={() => isUserPlaylist && openEditPlaylistModal(playlist)}
          className={`relative w-44 h-44 sm:w-56 sm:h-56 rounded-md shadow-2xl overflow-hidden shrink-0 bg-neutral-800 ${
            isUserPlaylist ? 'cursor-pointer group' : ''
          }`}
          style={{ backgroundColor: playlist.accentColor }}
        >
          {playlist.isLikedSongs ? (
            <div className="w-full h-full bg-gradient-to-br from-[#450af5] to-[#8e8ee5] flex items-center justify-center">
              <Heart className="w-20 h-20 fill-white text-white" />
            </div>
          ) : playlist.coverUrl ? (
            <img
              src={playlist.coverUrl}
              alt={playlist.name}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Music className="w-16 h-16 text-white/50" />
            </div>
          )}

          {isUserPlaylist && (
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center gap-2 text-white transition-opacity">
              <Edit2 className="w-8 h-8" />
              <span className="text-xs font-semibold">Choose photo / edit</span>
            </div>
          )}
        </div>

        {/* Playlist Meta Details */}
        <div className="flex-1 min-w-0 flex flex-col justify-end">
          <span className="text-xs font-bold uppercase tracking-wider text-white/80 mb-2">
            {playlist.isLikedSongs ? 'Playlist' : 'Public Playlist'}
          </span>

          <h1
            onClick={() => isUserPlaylist && openEditPlaylistModal(playlist)}
            className={`text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-none mb-4 ${
              isUserPlaylist ? 'cursor-pointer hover:underline' : ''
            }`}
          >
            {playlist.name}
          </h1>

          {playlist.description && (
            <p className="text-sm text-neutral-300 max-w-2xl leading-relaxed mb-4">
              {playlist.description}
            </p>
          )}

          <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm text-white font-medium">
            <span className="font-bold">{playlist.creator.name}</span>
            <span>·</span>
            <span>{playlistTracks.length} songs,</span>
            <span className="text-neutral-300">about {totalMinutes} min</span>
            {playlist.isDownloaded && (
              <>
                <span>·</span>
                <span className="flex items-center gap-1 text-[#1DB954] text-xs font-semibold">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Downloaded offline</span>
                </span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* 2. Action Controls Bar */}
      <div className="px-6 md:px-8 py-5 flex items-center justify-between gap-4 bg-[#121212]/90 backdrop-blur border-b border-white/5">
        <div className="flex items-center gap-6">
          {/* Main Play / Pause Button */}
          <button
            onClick={() => {
              if (isCurrentPlaylistPlaying) {
                togglePlayPause();
              } else if (playlistTracks.length > 0) {
                playTrack(playlistTracks[0], playlistTracks, playlist);
              }
            }}
            disabled={playlistTracks.length === 0}
            className="w-14 h-14 rounded-full bg-[#1DB954] hover:bg-[#1ed760] text-black flex items-center justify-center shadow-xl hover:scale-105 active:scale-95 transition-all disabled:opacity-40"
          >
            {isCurrentPlaylistPlaying ? (
              <Pause className="w-7 h-7 fill-current" />
            ) : (
              <Play className="w-7 h-7 fill-current ml-1" />
            )}
          </button>

          {/* Offline Download Button for Whole Playlist */}
          <button
            onClick={() => downloadPlaylist(playlist.id)}
            title={playlist.isDownloaded ? 'Downloaded offline' : 'Download whole playlist offline'}
            className={`flex items-center gap-1.5 p-2 rounded-full transition-colors ${
              playlist.isDownloaded
                ? 'text-[#1DB954]'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            {playlist.isDownloaded ? (
              <CheckCircle2 className="w-7 h-7 fill-[#1DB954] text-black" />
            ) : (
              <ArrowDownCircle className="w-7 h-7" />
            )}
          </button>

          {/* Edit Details (if custom playlist) */}
          {isUserPlaylist && (
            <button
              onClick={() => openEditPlaylistModal(playlist)}
              title="Edit playlist info"
              className="text-neutral-400 hover:text-white p-2 transition-colors"
            >
              <Edit2 className="w-6 h-6" />
            </button>
          )}

          {/* Delete Playlist (if custom playlist) */}
          {isUserPlaylist && (
            <button
              onClick={() => deletePlaylist(playlist.id)}
              title="Delete playlist"
              className="text-neutral-400 hover:text-rose-400 p-2 transition-colors"
            >
              <Trash2 className="w-6 h-6" />
            </button>
          )}
        </div>

        {/* Filter within playlist search */}
        <div className="relative w-48 sm:w-64">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
          <input
            type="text"
            placeholder="Search in playlist..."
            value={playlistSearch}
            onChange={(e) => setPlaylistSearch(e.target.value)}
            className="w-full h-9 pl-9 pr-3 rounded-full bg-white/5 hover:bg-white/10 focus:bg-white/10 border border-white/5 focus:border-white/20 text-xs text-white placeholder-neutral-400 focus:outline-none transition-all"
          />
        </div>
      </div>

      {/* 3. Playlist Tracks Table */}
      <div className="px-6 md:px-8 mt-4">
        {filteredTracks.length === 0 ? (
          <div className="text-center py-16">
            <Music className="w-12 h-12 text-neutral-600 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-white mb-1">No songs here yet</h3>
            <p className="text-xs text-neutral-400 max-w-sm mx-auto mb-4">
              Explore your favorite artists and add songs to build your dream playlist.
            </p>
            <button
              onClick={() => navigate('search')}
              className="px-5 py-2.5 rounded-full bg-white text-black font-bold text-xs hover:scale-105 transition-transform"
            >
              Find songs
            </button>
          </div>
        ) : (
          <table className="w-full text-left text-sm text-neutral-300">
            {/* Table Header */}
            <thead>
              <tr className="border-b border-white/10 text-neutral-400 text-xs uppercase font-medium">
                <th className="py-2.5 px-3 w-12 text-center">#</th>
                <th className="py-2.5 px-3">Title</th>
                <th className="py-2.5 px-3 hidden md:table-cell">Album</th>
                <th className="py-2.5 px-3 hidden lg:table-cell">Year</th>
                <th className="py-2.5 px-3 w-16 text-right">
                  <Clock className="w-4 h-4 inline-block" />
                </th>
                <th className="py-2.5 px-3 w-12 text-center"></th>
              </tr>
            </thead>

            {/* Rows */}
            <tbody className="divide-y divide-transparent">
              {filteredTracks.map((track, index) => {
                const isCurrent = currentTrack?.id === track.id;
                const trackLiked = isLiked(track.id);
                const trackDownloaded = isDownloaded(track.id);

                return (
                  <tr
                    key={track.id}
                    onClick={() => playTrack(track, filteredTracks, playlist)}
                    className={`group rounded-md cursor-pointer transition-colors ${
                      isCurrent ? 'bg-white/10' : 'hover:bg-white/5'
                    }`}
                  >
                    {/* Index or Animated Play Icon */}
                    <td className="py-3 px-3 text-center text-xs font-mono tabular-nums text-neutral-400 w-12">
                      <div className="flex items-center justify-center">
                        {isCurrent && isPlaying ? (
                          <div className="flex items-end gap-0.5 h-3.5 w-3.5">
                            <span className="w-0.5 bg-[#1DB954] h-full animate-bounce" />
                            <span className="w-0.5 bg-[#1DB954] h-2/3 animate-bounce [animation-delay:0.15s]" />
                            <span className="w-0.5 bg-[#1DB954] h-4/5 animate-bounce [animation-delay:0.3s]" />
                          </div>
                        ) : (
                          <>
                            <span className="group-hover:hidden">{index + 1}</span>
                            <Play className="w-3.5 h-3.5 fill-current text-white hidden group-hover:block" />
                          </>
                        )}
                      </div>
                    </td>

                    {/* Title & Artist */}
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded overflow-hidden shrink-0 bg-neutral-800">
                          <img
                            src={track.coverUrl}
                            alt={track.title}
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover"
                          />
                        </div>

                        <div className="min-w-0">
                          <div className={`font-semibold text-sm truncate ${isCurrent ? 'text-[#1DB954]' : 'text-white'}`}>
                            {track.title}
                          </div>
                          <div
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate('artist', track.artistId);
                            }}
                            className="text-xs text-neutral-400 hover:text-white hover:underline truncate"
                          >
                            {track.artist}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Album */}
                    <td className="py-3 px-3 text-neutral-400 text-xs hidden md:table-cell truncate max-w-xs">
                      {track.album}
                    </td>

                    {/* Year */}
                    <td className="py-3 px-3 text-neutral-400 text-xs hidden lg:table-cell font-mono">
                      {track.releaseYear}
                    </td>

                    {/* Duration & Like Button */}
                    <td className="py-3 px-3 text-right">
                      <div className="flex items-center justify-end gap-3">
                        {trackDownloaded && (
                          <span title="Downloaded offline" className="shrink-0">
                            <CheckCircle2 className="w-3.5 h-3.5 text-[#1DB954]" />
                          </span>
                        )}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleLike(track.id);
                          }}
                          className={`opacity-0 group-hover:opacity-100 transition-opacity p-1 ${
                            trackLiked ? '!opacity-100' : ''
                          }`}
                        >
                          <Heart className={`w-4 h-4 ${trackLiked ? 'text-[#1DB954] fill-[#1DB954]' : 'text-neutral-400 hover:text-white'}`} />
                        </button>
                        <span className="text-xs text-neutral-400 font-mono tabular-nums">
                          {formatDuration(track.duration)}
                        </span>
                      </div>
                    </td>

                    {/* Row Context Menu */}
                    <td className="py-3 px-3 text-center relative">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveMenuTrackId(activeMenuTrackId === track.id ? null : track.id);
                        }}
                        className="opacity-0 group-hover:opacity-100 text-neutral-400 hover:text-white p-1 transition-opacity"
                      >
                        <MoreHorizontal className="w-4 h-4" />
                      </button>

                      {activeMenuTrackId === track.id && (
                        <div
                          onClick={(e) => e.stopPropagation()}
                          className="absolute right-4 top-10 w-48 bg-[#282828] border border-white/10 rounded-lg shadow-2xl py-1 text-xs text-neutral-200 z-50 animate-fadeIn"
                        >
                          <button
                            onClick={() => {
                              addToQueue(track);
                              setActiveMenuTrackId(null);
                            }}
                            className="w-full px-3 py-2 text-left hover:bg-white/10 flex items-center gap-2"
                          >
                            <Plus className="w-3.5 h-3.5" />
                            <span>Add to queue</span>
                          </button>
                          <button
                            onClick={() => {
                              toggleDownloadTrack(track.id);
                              setActiveMenuTrackId(null);
                            }}
                            className="w-full px-3 py-2 text-left hover:bg-white/10 flex items-center gap-2"
                          >
                            <ArrowDownCircle className="w-3.5 h-3.5 text-[#1DB954]" />
                            <span>{trackDownloaded ? 'Remove download' : 'Download song'}</span>
                          </button>
                          {isUserPlaylist && (
                            <button
                              onClick={() => {
                                removeTrackFromPlaylist(playlist.id, track.id);
                                setActiveMenuTrackId(null);
                              }}
                              className="w-full px-3 py-2 text-left hover:bg-white/10 text-rose-400 flex items-center gap-2"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              <span>Remove from playlist</span>
                            </button>
                          )}
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};
