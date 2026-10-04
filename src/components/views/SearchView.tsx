import React from 'react';
import { useMusic } from '../../context/MusicContext';
import { GENRE_CATEGORIES } from '../../data/mockData';
import { Play, Pause, Heart, CheckCircle2, Clock, Music } from 'lucide-react';

export const SearchView: React.FC = () => {
  const {
    searchQuery,
    setSearchQuery,
    tracks,
    artists,
    playlists,
    playTrack,
    currentTrack,
    isPlaying,
    isLiked,
    toggleLike,
    isDownloaded,
    navigate
  } = useMusic();

  const query = searchQuery.trim().toLowerCase();

  // Search matches
  const matchedTracks = query
    ? tracks.filter(
        t =>
          t.title.toLowerCase().includes(query) ||
          t.artist.toLowerCase().includes(query) ||
          t.album.toLowerCase().includes(query) ||
          t.genre.toLowerCase().includes(query)
      )
    : [];

  const matchedArtists = query
    ? artists.filter(
        a =>
          a.name.toLowerCase().includes(query) ||
          a.genres.some(g => g.toLowerCase().includes(query))
      )
    : [];

  const matchedPlaylists = query
    ? playlists.filter(
        p =>
          p.name.toLowerCase().includes(query) ||
          p.description.toLowerCase().includes(query)
      )
    : [];

  const topResult = matchedTracks[0];

  const formatDuration = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="p-6 md:p-8 space-y-8 max-w-7xl mx-auto pb-24">
      {/* If No Query: Show Genre & Category Browse Grid */}
      {!query ? (
        <section>
          <h1 className="text-2xl font-extrabold text-white mb-6">Browse all</h1>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {GENRE_CATEGORIES.map((cat) => {
              return (
                <div
                  key={cat.name}
                  onClick={() => setSearchQuery(cat.name)}
                  className={`group relative h-48 rounded-xl overflow-hidden p-4 cursor-pointer bg-gradient-to-br ${cat.color} transition-all duration-300 hover:scale-[1.02] shadow-lg`}
                >
                  <span className="font-extrabold text-xl text-white block max-w-[80%] leading-tight">
                    {cat.name}
                  </span>

                  {/* Rotated decorative album artwork */}
                  <div className="absolute -right-3 -bottom-2 w-24 h-24 rounded-lg overflow-hidden shadow-2xl transform rotate-[25deg] group-hover:rotate-[15deg] group-hover:scale-105 transition-all duration-300">
                    <img
                      src={cat.image}
                      alt={cat.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      ) : (
        <div className="space-y-8">
          {matchedTracks.length === 0 && matchedArtists.length === 0 && matchedPlaylists.length === 0 ? (
            <div className="text-center py-20">
              <Music className="w-12 h-12 text-neutral-600 mx-auto mb-3" />
              <h2 className="text-xl font-bold text-white mb-1">No results found for "{searchQuery}"</h2>
              <p className="text-sm text-neutral-400">Please make sure your words are spelled correctly or try using different keywords.</p>
            </div>
          ) : (
            <>
              {/* Top Result + Songs 2-Column Section */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Top Result Card */}
                {topResult && (
                  <div className="lg:col-span-5 flex flex-col">
                    <h2 className="text-xl font-bold text-white mb-4">Top result</h2>
                    <div
                      onClick={() => playTrack(topResult, matchedTracks)}
                      className="group relative flex-1 bg-[#181818] hover:bg-[#282828] p-6 rounded-xl transition-all duration-200 cursor-pointer flex flex-col justify-between shadow-xl"
                    >
                      <div>
                        <div className="w-24 h-24 rounded-lg overflow-hidden mb-5 shadow-2xl bg-neutral-800">
                          <img
                            src={topResult.coverUrl}
                            alt={topResult.title}
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <h3 className="text-2xl font-extrabold text-white mb-1 group-hover:underline">
                          {topResult.title}
                        </h3>
                        <div className="flex items-center gap-2 text-sm text-neutral-400">
                          <span className="text-white font-medium hover:underline" onClick={(e) => { e.stopPropagation(); navigate('artist', topResult.artistId); }}>
                            {topResult.artist}
                          </span>
                          <span>·</span>
                          <span className="uppercase text-[11px] font-bold px-2 py-0.5 rounded bg-black/40 text-neutral-300">
                            Song
                          </span>
                        </div>
                      </div>

                      {/* Play Button */}
                      <div className="mt-6 flex justify-end">
                        <div className="w-12 h-12 rounded-full bg-[#1DB954] text-black flex items-center justify-center shadow-xl group-hover:scale-105 active:scale-95 transition-transform">
                          {isPlaying && currentTrack?.id === topResult.id ? (
                            <Pause className="w-6 h-6 fill-current" />
                          ) : (
                            <Play className="w-6 h-6 fill-current ml-0.5" />
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Matching Songs List */}
                <div className={`flex flex-col ${topResult ? 'lg:col-span-7' : 'lg:col-span-12'}`}>
                  <h2 className="text-xl font-bold text-white mb-4">Songs</h2>
                  <div className="space-y-1">
                    {matchedTracks.slice(0, 5).map((track, i) => {
                      const isCurrent = currentTrack?.id === track.id;
                      const trackLiked = isLiked(track.id);
                      return (
                        <div
                          key={track.id}
                          onClick={() => playTrack(track, matchedTracks)}
                          className={`group flex items-center justify-between p-2 rounded-md transition-colors cursor-pointer ${
                            isCurrent ? 'bg-[#282828]' : 'hover:bg-white/5'
                          }`}
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <div className="relative w-10 h-10 rounded overflow-hidden shrink-0 bg-neutral-800">
                              <img
                                src={track.coverUrl}
                                alt={track.title}
                                referrerPolicy="no-referrer"
                                className="w-full h-full object-cover"
                              />
                              <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                {isCurrent && isPlaying ? (
                                  <Pause className="w-4 h-4 text-white fill-current" />
                                ) : (
                                  <Play className="w-4 h-4 text-white fill-current ml-0.5" />
                                )}
                              </div>
                            </div>

                            <div className="min-w-0">
                              <div className={`font-medium text-sm truncate ${isCurrent ? 'text-[#1DB954]' : 'text-white'}`}>
                                {track.title}
                              </div>
                              <div className="text-xs text-neutral-400 truncate">
                                {track.artist}
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-4 shrink-0">
                            {isDownloaded(track.id) && (
                              <span title="Downloaded" className="shrink-0">
                                <CheckCircle2 className="w-3.5 h-3.5 text-[#1DB954]" />
                              </span>
                            )}
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleLike(track.id);
                              }}
                              className="text-neutral-400 hover:text-white"
                            >
                              <Heart className={`w-4 h-4 ${trackLiked ? 'text-[#1DB954] fill-[#1DB954]' : ''}`} />
                            </button>
                            <span className="text-xs text-neutral-400 font-mono tabular-nums w-10 text-right">
                              {formatDuration(track.duration)}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Matching Artists */}
              {matchedArtists.length > 0 && (
                <section>
                  <h2 className="text-xl font-bold text-white mb-4">Artists</h2>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                    {matchedArtists.map(artist => (
                      <div
                        key={artist.id}
                        onClick={() => navigate('artist', artist.id)}
                        className="group bg-[#181818] hover:bg-[#282828] p-3.5 rounded-lg transition-colors cursor-pointer text-center"
                      >
                        <div className="w-full aspect-square rounded-full overflow-hidden mb-3 bg-neutral-800 shadow-md">
                          <img
                            src={artist.imageUrl}
                            alt={artist.name}
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="font-bold text-sm text-white truncate">{artist.name}</div>
                        <div className="text-xs text-neutral-400 mt-0.5">Artist</div>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Matching Playlists */}
              {matchedPlaylists.length > 0 && (
                <section>
                  <h2 className="text-xl font-bold text-white mb-4">Playlists</h2>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {matchedPlaylists.map(playlist => (
                      <div
                        key={playlist.id}
                        onClick={() => navigate('playlist', playlist.id)}
                        className="group bg-[#181818] hover:bg-[#282828] p-4 rounded-lg transition-colors cursor-pointer"
                      >
                        <div
                          className="w-full aspect-square rounded-md overflow-hidden mb-3 shadow-md"
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
                            <div className="w-full h-full flex items-center justify-center">
                              <Music className="w-10 h-10 text-white/60" />
                            </div>
                          )}
                        </div>
                        <div className="font-bold text-sm text-white truncate">{playlist.name}</div>
                        <div className="text-xs text-neutral-400 line-clamp-1 mt-0.5">{playlist.creator.name}</div>
                      </div>
                    ))}
                  </div>
                </section>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
};
