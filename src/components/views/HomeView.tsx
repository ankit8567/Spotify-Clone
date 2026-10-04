import React from 'react';
import { useMusic } from '../../context/MusicContext';
import { Play, Pause, Heart, CheckCircle2, HardDrive, Sparkles, Crown } from 'lucide-react';

interface QuickItem {
  id: string;
  title: string;
  type: string;
  gradient?: string;
  isLiked?: boolean;
  coverUrl?: string;
  accentColor?: string;
  onClick: () => void;
  onPlay: () => void;
}

export const HomeView: React.FC = () => {
  const {
    playlists,
    tracks,
    artists,
    currentTrack,
    isPlaying,
    playTrack,
    togglePlayPause,
    navigate,
    downloadedTrackIds,
    isOfflineMode,
    user,
    openCheckoutModal
  } = useMusic();

  // Dynamic time greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const topHitsPlaylist = playlists.find(p => p.id === 'playlist-top-hits') || playlists[0];
  const likedSongsPlaylist = playlists.find(p => p.isLikedSongs);

  // Quick 6 access items
  const quickItems: QuickItem[] = [
    {
      id: likedSongsPlaylist?.id || 'liked',
      title: 'Liked Songs',
      type: 'playlist',
      gradient: 'from-[#450af5] to-[#8e8ee5]',
      isLiked: true,
      onClick: () => likedSongsPlaylist && navigate('playlist', likedSongsPlaylist.id),
      onPlay: () => {
        if (likedSongsPlaylist) {
          const pTracks = tracks.filter(t => likedSongsPlaylist.trackIds.includes(t.id));
          if (pTracks.length > 0) playTrack(pTracks[0], pTracks, likedSongsPlaylist);
        }
      }
    },
    ...playlists.filter(p => !p.isLikedSongs).slice(0, 5).map(p => ({
      id: p.id,
      title: p.name,
      type: 'playlist',
      coverUrl: p.coverUrl,
      accentColor: p.accentColor,
      onClick: () => navigate('playlist', p.id),
      onPlay: () => {
        const pTracks = tracks.filter(t => p.trackIds.includes(t.id));
        if (pTracks.length > 0) playTrack(pTracks[0], pTracks, p);
      }
    }))
  ];

  // Downloaded offline tracks list
  const offlineTracks = tracks.filter(t => downloadedTrackIds.includes(t.id));

  return (
    <div className="p-6 md:p-8 space-y-8 max-w-7xl mx-auto pb-24">
      {/* Offline Mode Banner (when active) */}
      {isOfflineMode && (
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-amber-500/20 flex items-center justify-center text-amber-400">
              <HardDrive className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-white text-sm">Offline Mode Active</div>
              <div className="text-xs text-neutral-300">
                You are listening offline without using data. {offlineTracks.length} tracks are saved locally.
              </div>
            </div>
          </div>
          <span className="text-xs font-mono text-amber-400 border border-amber-500/30 px-2.5 py-1 rounded-full">
            Local Storage
          </span>
        </div>
      )}

      {/* Greeting & Quick 6 Grid */}
      <section>
        <h1 className="text-3xl font-extrabold tracking-tight text-white mb-5">
          {getGreeting()}
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {quickItems.map((item) => {
            const isItemPlaying = isPlaying && currentTrack && item.type === 'playlist';
            return (
              <div
                key={item.id}
                onClick={item.onClick}
                className="group relative flex items-center bg-[#242424]/60 hover:bg-[#2e2e2e] transition-all rounded-md overflow-hidden cursor-pointer shadow-md pr-4"
              >
                {item.isLiked ? (
                  <div className={`w-16 h-16 bg-gradient-to-br ${item.gradient} flex items-center justify-center shrink-0 shadow-sm`}>
                    <Heart className="w-7 h-7 fill-white text-white" />
                  </div>
                ) : (
                  <div
                    className="w-16 h-16 shrink-0 flex items-center justify-center"
                    style={{ backgroundColor: item.accentColor || '#333' }}
                  >
                    {item.coverUrl ? (
                      <img
                        src={item.coverUrl}
                        alt={item.title}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                    ) : null}
                  </div>
                )}

                <div className="font-bold text-sm text-white px-3 flex-1 truncate">
                  {item.title}
                </div>

                {/* Instant Play Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    item.onPlay();
                  }}
                  className="w-10 h-10 rounded-full bg-[#1DB954] text-black flex items-center justify-center shadow-xl opacity-0 group-hover:opacity-100 group-hover:scale-105 active:scale-95 transition-all shrink-0 hover:bg-[#1ed760]"
                >
                  {isItemPlaying ? (
                    <Pause className="w-5 h-5 fill-current" />
                  ) : (
                    <Play className="w-5 h-5 fill-current ml-0.5" />
                  )}
                </button>
              </div>
            );
          })}
        </div>
      </section>

      {/* Premium Upgrade Teaser if on Free */}
      {user.plan === 'free' && (
        <section className="bg-gradient-to-r from-emerald-900/40 via-indigo-900/40 to-purple-900/40 border border-white/10 rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="space-y-1 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-2 text-amber-400 font-semibold text-xs tracking-wider uppercase">
              <Sparkles className="w-4 h-4 fill-amber-400" />
              <span>Unlock Lossless FLAC & Unlimited Skips</span>
            </div>
            <h2 className="text-xl md:text-2xl font-bold text-white">Experience Spotify Premium for 3 Months Free</h2>
            <p className="text-xs md:text-sm text-neutral-300">
              Listen ad-free, download songs to play anywhere offline, and experience 24-bit Hi-Fi studio master quality.
            </p>
          </div>
          <button
            onClick={() => openCheckoutModal('individual')}
            className="px-6 py-3 rounded-full bg-[#1DB954] hover:bg-[#1ed760] text-black font-extrabold text-sm transition-transform hover:scale-105 shadow-xl shrink-0"
          >
            Upgrade to Premium
          </button>
        </section>
      )}

      {/* Offline Ready Shelf */}
      {offlineTracks.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-[#1DB954]" />
              <h2 className="text-xl font-bold text-white tracking-tight">Downloaded For Offline Playback</h2>
            </div>
            <span className="text-xs text-neutral-400 font-medium">
              {offlineTracks.length} saved songs
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {offlineTracks.map(track => {
              const isCurrent = currentTrack?.id === track.id;
              return (
                <div
                  key={track.id}
                  onClick={() => playTrack(track, offlineTracks)}
                  className="group relative bg-[#181818] hover:bg-[#282828] p-3.5 rounded-lg transition-all duration-200 cursor-pointer flex flex-col"
                >
                  <div className="relative aspect-square rounded-md overflow-hidden mb-3 bg-neutral-800 shadow-md">
                    <img
                      src={track.coverUrl}
                      alt={track.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-sm rounded-full p-1 text-[#1DB954]">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                    </div>
                    {/* Hover Play Button */}
                    <div className="absolute right-2 bottom-2 w-10 h-10 rounded-full bg-[#1DB954] text-black flex items-center justify-center shadow-xl opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-200 hover:scale-105">
                      {isCurrent && isPlaying ? (
                        <Pause className="w-4 h-4 fill-current" />
                      ) : (
                        <Play className="w-4 h-4 fill-current ml-0.5" />
                      )}
                    </div>
                  </div>

                  <div className={`font-semibold text-sm truncate ${isCurrent ? 'text-[#1DB954]' : 'text-white'}`}>
                    {track.title}
                  </div>
                  <div className="text-xs text-neutral-400 truncate mt-0.5">
                    {track.artist}
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Featured Playlists */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-white tracking-tight">Today's Featured Playlists</h2>
          <button
            onClick={() => navigate('search')}
            className="text-xs font-bold text-neutral-400 hover:text-white transition-colors"
          >
            Show all
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {playlists.map(playlist => {
            return (
              <div
                key={playlist.id}
                onClick={() => navigate('playlist', playlist.id)}
                className="group relative bg-[#181818] hover:bg-[#242424] p-4 rounded-lg transition-all duration-200 cursor-pointer flex flex-col"
              >
                <div
                  className="relative aspect-square rounded-md overflow-hidden mb-3 shadow-lg"
                  style={{ backgroundColor: playlist.accentColor || '#333' }}
                >
                  {playlist.isLikedSongs ? (
                    <div className="w-full h-full bg-gradient-to-br from-[#450af5] to-[#8e8ee5] flex items-center justify-center">
                      <Heart className="w-12 h-12 fill-white text-white" />
                    </div>
                  ) : playlist.coverUrl ? (
                    <img
                      src={playlist.coverUrl}
                      alt={playlist.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : null}

                  {/* Play shortcut */}
                  <div
                    onClick={(e) => {
                      e.stopPropagation();
                      const pTracks = tracks.filter(t => playlist.trackIds.includes(t.id));
                      if (pTracks.length > 0) playTrack(pTracks[0], pTracks, playlist);
                    }}
                    className="absolute right-2 bottom-2 w-11 h-11 rounded-full bg-[#1DB954] text-black flex items-center justify-center shadow-xl opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-200 hover:scale-105 hover:bg-[#1ed760]"
                  >
                    <Play className="w-5 h-5 fill-current ml-0.5" />
                  </div>
                </div>

                <div className="font-bold text-sm text-white truncate mb-1">
                  {playlist.name}
                </div>
                <div className="text-xs text-neutral-400 line-clamp-2 leading-relaxed">
                  {playlist.description}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Recommended Songs Row */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight">Recommended For Today</h2>
            <p className="text-xs text-neutral-400">Based on your recent listening habits</p>
          </div>
          <button
            onClick={() => topHitsPlaylist && navigate('playlist', topHitsPlaylist.id)}
            className="text-xs font-bold text-neutral-400 hover:text-white transition-colors"
          >
            See more
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {tracks.slice(0, 6).map(track => {
            const isCurrent = currentTrack?.id === track.id;
            return (
              <div
                key={track.id}
                onClick={() => playTrack(track, tracks)}
                className="group relative bg-[#181818] hover:bg-[#242424] p-3.5 rounded-lg transition-all duration-200 cursor-pointer flex flex-col"
              >
                <div className="relative aspect-square rounded-md overflow-hidden mb-3 bg-neutral-800 shadow-md">
                  <img
                    src={track.coverUrl}
                    alt={track.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute right-2 bottom-2 w-10 h-10 rounded-full bg-[#1DB954] text-black flex items-center justify-center shadow-xl opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-200 hover:scale-105">
                    {isCurrent && isPlaying ? (
                      <Pause className="w-4 h-4 fill-current" />
                    ) : (
                      <Play className="w-4 h-4 fill-current ml-0.5" />
                    )}
                  </div>
                </div>

                <div className={`font-semibold text-sm truncate ${isCurrent ? 'text-[#1DB954]' : 'text-white'}`}>
                  {track.title}
                </div>
                <div className="text-xs text-neutral-400 truncate mt-0.5">
                  {track.artist}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Featured Artists */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-white tracking-tight">Popular Artists</h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {artists.map(artist => {
            return (
              <div
                key={artist.id}
                onClick={() => navigate('artist', artist.id)}
                className="group relative bg-[#181818] hover:bg-[#242424] p-3.5 rounded-lg transition-all duration-200 cursor-pointer flex flex-col items-center text-center"
              >
                <div className="relative w-full aspect-square rounded-full overflow-hidden mb-3 bg-neutral-800 shadow-lg">
                  <img
                    src={artist.imageUrl}
                    alt={artist.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>

                <div className="font-bold text-sm text-white truncate w-full">
                  {artist.name}
                </div>
                <div className="text-xs text-neutral-400 mt-0.5">
                  Artist
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};
