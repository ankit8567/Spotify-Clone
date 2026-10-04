import React, { useState } from 'react';
import { useMusic } from '../../context/MusicContext';
import {
  Home,
  Search,
  Library,
  Plus,
  Heart,
  Pin,
  CheckCircle2,
  HardDrive,
  Crown,
  Music,
  Trash2,
  MoreVertical,
  ArrowDownCircle
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const {
    currentView,
    navigate,
    playlists,
    selectedPlaylistId,
    likedTrackIds,
    downloadedTrackIds,
    isOfflineMode,
    toggleOfflineMode,
    openEditPlaylistModal,
    deletePlaylist,
    togglePinPlaylist,
    downloadPlaylist
  } = useMusic();

  const [libraryFilter, setLibraryFilter] = useState<'all' | 'downloaded' | 'playlists'>('all');
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

  // Filtered playlists
  const displayPlaylists = playlists.filter(p => {
    if (libraryFilter === 'downloaded') return p.isDownloaded || p.isLikedSongs;
    return true;
  });

  const pinnedPlaylists = displayPlaylists.filter(p => p.isPinned && !p.isLikedSongs);
  const unpinnedPlaylists = displayPlaylists.filter(p => !p.isPinned && !p.isLikedSongs);
  const likedSongsPlaylist = playlists.find(p => p.isLikedSongs);

  // Approximate downloaded storage
  const storageMB = (downloadedTrackIds.length * 9.4).toFixed(1);

  return (
    <aside className="w-64 md:w-72 bg-black flex flex-col gap-2 p-2 select-none h-full shrink-0">
      {/* Top Navigation Box */}
      <div className="bg-[#121212] rounded-lg p-4 flex flex-col gap-4">
        {/* Spotify Brand */}
        <div
          onClick={() => navigate('home')}
          className="flex items-center gap-2 cursor-pointer text-white group"
        >
          <div className="w-8 h-8 rounded-full bg-[#1DB954] flex items-center justify-center text-black shadow-lg shadow-[#1DB954]/20 group-hover:scale-105 transition-transform">
            <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
              <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.503 17.309c-.216.353-.679.467-1.031.252-2.825-1.727-6.381-2.117-10.569-1.162-.404.093-.807-.162-.9-.565-.093-.404.162-.806.566-.9 4.584-1.047 8.525-.601 11.682 1.344.352.215.467.678.252 1.031zm1.468-3.264c-.272.443-.854.583-1.296.311-3.234-1.988-8.163-2.564-11.988-1.403-.497.151-1.026-.135-1.177-.632-.15-.497.135-1.026.632-1.177 4.374-1.328 9.816-.687 13.518 1.589.442.271.583.854.311 1.312zm.126-3.41c-3.878-2.303-10.28-2.515-13.989-1.389-.594.18-1.226-.157-1.406-.751-.18-.594.157-1.226.751-1.406 4.266-1.295 11.332-1.048 15.807 1.607.534.317.708 1.011.392 1.545-.317.535-1.011.709-1.555.394z"/>
            </svg>
          </div>
          <span className="font-bold text-lg tracking-tight">Spotify</span>
          <span className="ml-auto text-[10px] tracking-wider uppercase font-bold px-1.5 py-0.5 rounded bg-white/10 text-neutral-400">
            Hi-Fi
          </span>
        </div>

        {/* Primary Links */}
        <nav className="flex flex-col gap-1">
          <button
            onClick={() => navigate('home')}
            className={`flex items-center gap-4 px-2 py-2 rounded-md font-semibold text-sm transition-colors ${
              currentView === 'home'
                ? 'text-white'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <Home className="w-5 h-5" />
            <span>Home</span>
          </button>

          <button
            onClick={() => navigate('search')}
            className={`flex items-center gap-4 px-2 py-2 rounded-md font-semibold text-sm transition-colors ${
              currentView === 'search'
                ? 'text-white'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <Search className="w-5 h-5" />
            <span>Search</span>
          </button>

          <button
            onClick={() => navigate('premium')}
            className={`flex items-center gap-4 px-2 py-2 rounded-md font-semibold text-sm transition-colors ${
              currentView === 'premium'
                ? 'text-[#1DB954]'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <Crown className="w-5 h-5 text-amber-400" />
            <span>Premium Plans</span>
          </button>
        </nav>
      </div>

      {/* Your Library Section */}
      <div className="bg-[#121212] rounded-lg p-3 flex-1 flex flex-col min-h-0 overflow-hidden">
        {/* Library Header */}
        <div className="flex items-center justify-between px-2 py-1 mb-2">
          <div className="flex items-center gap-2.5 text-neutral-400 hover:text-white transition-colors cursor-pointer">
            <Library className="w-5 h-5" />
            <span className="font-bold text-sm">Your Library</span>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => openEditPlaylistModal()}
              title="Create new playlist"
              className="w-7 h-7 rounded-full hover:bg-[#282828] text-neutral-400 hover:text-white flex items-center justify-center transition-colors"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Filter buttons */}
        <div className="flex items-center gap-1.5 px-1 py-1 mb-2 text-xs overflow-x-auto no-scrollbar">
          <button
            onClick={() => setLibraryFilter('all')}
            className={`px-3 py-1 rounded-full font-medium transition-colors shrink-0 ${
              libraryFilter === 'all'
                ? 'bg-white text-black'
                : 'bg-[#232323] text-neutral-300 hover:bg-[#2a2a2a]'
            }`}
          >
            Playlists
          </button>
          <button
            onClick={() => setLibraryFilter('downloaded')}
            className={`flex items-center gap-1 px-3 py-1 rounded-full font-medium transition-colors shrink-0 ${
              libraryFilter === 'downloaded'
                ? 'bg-[#1DB954] text-black font-semibold'
                : 'bg-[#232323] text-neutral-300 hover:bg-[#2a2a2a]'
            }`}
          >
            <CheckCircle2 className="w-3 h-3" />
            <span>Downloaded</span>
          </button>
        </div>

        {/* Playlists List Container */}
        <div className="flex-1 overflow-y-auto space-y-1 pr-1">
          {/* Liked Songs Entry */}
          {likedSongsPlaylist && (
            <div
              onClick={() => navigate('playlist', likedSongsPlaylist.id)}
              className={`group flex items-center gap-3 p-2 rounded-md cursor-pointer transition-colors ${
                currentView === 'playlist' && selectedPlaylistId === likedSongsPlaylist.id
                  ? 'bg-[#282828]'
                  : 'hover:bg-[#1a1a1a]'
              }`}
            >
              <div className="w-11 h-11 rounded bg-gradient-to-br from-[#450af5] to-[#8e8ee5] flex items-center justify-center shrink-0 shadow-md">
                <Heart className="w-5 h-5 fill-white text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-sm text-white truncate">Liked Songs</div>
                <div className="flex items-center gap-1.5 text-xs text-neutral-400">
                  <Pin className="w-3 h-3 text-[#1DB954] fill-[#1DB954] shrink-0" />
                  <span>Playlist</span>
                  <span>·</span>
                  <span>{likedTrackIds.length} songs</span>
                </div>
              </div>
              <span title="Offline ready" className="shrink-0">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#1DB954]" />
              </span>
            </div>
          )}

          {/* Pinned Playlists */}
          {pinnedPlaylists.map(playlist => {
            const isSelected = currentView === 'playlist' && selectedPlaylistId === playlist.id;
            return (
              <div
                key={playlist.id}
                onClick={() => navigate('playlist', playlist.id)}
                className={`group relative flex items-center gap-3 p-2 rounded-md cursor-pointer transition-colors ${
                  isSelected ? 'bg-[#282828]' : 'hover:bg-[#1a1a1a]'
                }`}
              >
                <div
                  className="w-11 h-11 rounded flex items-center justify-center shrink-0 overflow-hidden shadow-sm"
                  style={{ backgroundColor: playlist.accentColor || '#333' }}
                >
                  {playlist.coverUrl ? (
                    <img
                      src={playlist.coverUrl}
                      alt={playlist.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Music className="w-5 h-5 text-white/80" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className={`font-semibold text-sm truncate ${isSelected ? 'text-[#1DB954]' : 'text-white'}`}>
                    {playlist.name}
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-neutral-400 truncate">
                    <Pin className="w-3 h-3 text-[#1DB954] fill-[#1DB954] shrink-0" />
                    <span>Playlist</span>
                    <span>·</span>
                    <span className="truncate">{playlist.creator.name}</span>
                  </div>
                </div>

                {playlist.isDownloaded && (
                  <span title="Downloaded offline" className="shrink-0">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#1DB954]" />
                  </span>
                )}

                {/* More options button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveMenuId(activeMenuId === playlist.id ? null : playlist.id);
                  }}
                  className="opacity-0 group-hover:opacity-100 p-1 hover:text-white text-neutral-400 transition-opacity"
                >
                  <MoreVertical className="w-3.5 h-3.5" />
                </button>

                {activeMenuId === playlist.id && (
                  <div
                    onClick={(e) => e.stopPropagation()}
                    className="absolute right-2 top-10 w-44 bg-[#282828] border border-white/10 rounded-lg shadow-xl py-1 text-xs text-neutral-200 z-50 animate-fadeIn"
                  >
                    <button
                      onClick={() => {
                        togglePinPlaylist(playlist.id);
                        setActiveMenuId(null);
                      }}
                      className="w-full px-3 py-1.5 text-left hover:bg-white/10 flex items-center gap-2"
                    >
                      <Pin className="w-3.5 h-3.5" />
                      <span>Unpin playlist</span>
                    </button>
                    <button
                      onClick={() => {
                        downloadPlaylist(playlist.id);
                        setActiveMenuId(null);
                      }}
                      className="w-full px-3 py-1.5 text-left hover:bg-white/10 flex items-center gap-2"
                    >
                      <ArrowDownCircle className="w-3.5 h-3.5 text-[#1DB954]" />
                      <span>{playlist.isDownloaded ? 'Remove download' : 'Download playlist'}</span>
                    </button>
                    <button
                      onClick={() => {
                        deletePlaylist(playlist.id);
                        setActiveMenuId(null);
                      }}
                      className="w-full px-3 py-1.5 text-left hover:bg-white/10 text-rose-400 flex items-center gap-2"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Delete playlist</span>
                    </button>
                  </div>
                )}
              </div>
            );
          })}

          {/* Unpinned Playlists */}
          {unpinnedPlaylists.map(playlist => {
            const isSelected = currentView === 'playlist' && selectedPlaylistId === playlist.id;
            return (
              <div
                key={playlist.id}
                onClick={() => navigate('playlist', playlist.id)}
                className={`group relative flex items-center gap-3 p-2 rounded-md cursor-pointer transition-colors ${
                  isSelected ? 'bg-[#282828]' : 'hover:bg-[#1a1a1a]'
                }`}
              >
                <div
                  className="w-11 h-11 rounded flex items-center justify-center shrink-0 overflow-hidden shadow-sm"
                  style={{ backgroundColor: playlist.accentColor || '#222' }}
                >
                  {playlist.coverUrl ? (
                    <img
                      src={playlist.coverUrl}
                      alt={playlist.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Music className="w-5 h-5 text-white/70" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className={`font-semibold text-sm truncate ${isSelected ? 'text-[#1DB954]' : 'text-white'}`}>
                    {playlist.name}
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-neutral-400 truncate">
                    <span>Playlist</span>
                    <span>·</span>
                    <span className="truncate">{playlist.creator.name}</span>
                  </div>
                </div>

                {playlist.isDownloaded && (
                  <span title="Downloaded offline" className="shrink-0">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#1DB954]" />
                  </span>
                )}

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveMenuId(activeMenuId === playlist.id ? null : playlist.id);
                  }}
                  className="opacity-0 group-hover:opacity-100 p-1 hover:text-white text-neutral-400 transition-opacity"
                >
                  <MoreVertical className="w-3.5 h-3.5" />
                </button>

                {activeMenuId === playlist.id && (
                  <div
                    onClick={(e) => e.stopPropagation()}
                    className="absolute right-2 top-10 w-44 bg-[#282828] border border-white/10 rounded-lg shadow-xl py-1 text-xs text-neutral-200 z-50 animate-fadeIn"
                  >
                    <button
                      onClick={() => {
                        togglePinPlaylist(playlist.id);
                        setActiveMenuId(null);
                      }}
                      className="w-full px-3 py-1.5 text-left hover:bg-white/10 flex items-center gap-2"
                    >
                      <Pin className="w-3.5 h-3.5" />
                      <span>Pin playlist</span>
                    </button>
                    <button
                      onClick={() => {
                        downloadPlaylist(playlist.id);
                        setActiveMenuId(null);
                      }}
                      className="w-full px-3 py-1.5 text-left hover:bg-white/10 flex items-center gap-2"
                    >
                      <ArrowDownCircle className="w-3.5 h-3.5 text-[#1DB954]" />
                      <span>{playlist.isDownloaded ? 'Remove download' : 'Download playlist'}</span>
                    </button>
                    <button
                      onClick={() => {
                        deletePlaylist(playlist.id);
                        setActiveMenuId(null);
                      }}
                      className="w-full px-3 py-1.5 text-left hover:bg-white/10 text-rose-400 flex items-center gap-2"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Delete playlist</span>
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Offline Storage Status Footer */}
        <div className="pt-2 mt-2 border-t border-white/10 flex flex-col gap-1.5">
          <div className="flex items-center justify-between text-[11px] text-neutral-400">
            <div className="flex items-center gap-1.5">
              <HardDrive className="w-3 h-3 text-[#1DB954]" />
              <span>Offline Cache</span>
            </div>
            <span className="font-mono text-neutral-300">{storageMB} MB</span>
          </div>

          <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-[#1DB954] transition-all"
              style={{ width: `${Math.min(100, Math.max(5, downloadedTrackIds.length * 8))}%` }}
            />
          </div>

          <div className="flex items-center justify-between pt-1">
            <button
              onClick={() => toggleOfflineMode()}
              className="text-[11px] text-neutral-400 hover:text-white transition-colors"
            >
              {isOfflineMode ? 'Status: Offline' : 'Status: Online'}
            </button>
            <span className="text-[10px] text-neutral-500">{downloadedTrackIds.length} tracks</span>
          </div>
        </div>
      </div>
    </aside>
  );
};
