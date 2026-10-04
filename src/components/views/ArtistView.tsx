import React, { useState } from 'react';
import { useMusic } from '../../context/MusicContext';
import { Play, Pause, Heart, CheckCircle2, Clock, Users, Award, Radio } from 'lucide-react';

export const ArtistView: React.FC = () => {
  const {
    selectedArtistId,
    artists,
    tracks,
    currentTrack,
    isPlaying,
    playTrack,
    togglePlayPause,
    isLiked,
    toggleLike,
    isDownloaded,
    navigate
  } = useMusic();

  const [isFollowing, setIsFollowing] = useState(false);

  const artist = artists.find(a => a.id === selectedArtistId) || artists[0];
  if (!artist) return null;

  // Tracks by this artist
  const artistTracks = tracks.filter(t => t.artistId === artist.id || t.artist === artist.name);
  const isCurrentArtistPlaying = isPlaying && currentTrack && artistTracks.some(t => t.id === currentTrack.id);

  const formatDuration = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-US').format(num);
  };

  return (
    <div className="pb-32">
      {/* 1. Artist Header */}
      <div
        className="relative h-72 sm:h-96 px-6 md:px-8 pb-8 flex flex-col justify-end bg-cover bg-center transition-all"
        style={{
          backgroundImage: `linear-gradient(180deg, rgba(0,0,0,0.2) 0%, rgba(18,18,18,0.95) 100%), url(${artist.imageUrl})`
        }}
      >
        <div className="flex items-center gap-1.5 text-xs font-semibold text-white/90 mb-2">
          <Award className="w-4 h-4 text-blue-400 fill-blue-400" />
          <span>Verified Artist</span>
        </div>

        <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold text-white tracking-tight leading-none mb-4">
          {artist.name}
        </h1>

        <div className="text-sm font-medium text-white/90 flex items-center gap-2">
          <Users className="w-4 h-4 text-neutral-300" />
          <span>{formatNumber(artist.monthlyListeners)} monthly listeners</span>
        </div>
      </div>

      {/* 2. Action Controls */}
      <div className="px-6 md:px-8 py-5 flex items-center gap-6 bg-[#121212] border-b border-white/5">
        <button
          onClick={() => {
            if (isCurrentArtistPlaying) {
              togglePlayPause();
            } else if (artistTracks.length > 0) {
              playTrack(artistTracks[0], artistTracks);
            }
          }}
          className="w-14 h-14 rounded-full bg-[#1DB954] hover:bg-[#1ed760] text-black flex items-center justify-center shadow-xl hover:scale-105 active:scale-95 transition-all"
        >
          {isCurrentArtistPlaying ? (
            <Pause className="w-7 h-7 fill-current" />
          ) : (
            <Play className="w-7 h-7 fill-current ml-1" />
          )}
        </button>

        <button
          onClick={() => setIsFollowing(!isFollowing)}
          className={`px-5 py-2 rounded-full text-xs font-extrabold tracking-wide uppercase transition-all border ${
            isFollowing
              ? 'bg-transparent text-white border-white/40 hover:border-white'
              : 'bg-white text-black hover:scale-105'
          }`}
        >
          {isFollowing ? 'Following' : 'Follow'}
        </button>

        <div className="flex items-center gap-2 text-xs text-neutral-400">
          <Radio className="w-4 h-4 text-[#1DB954]" />
          <span>Artist Radio Active</span>
        </div>
      </div>

      {/* 3. Popular Tracks & Bio Section */}
      <div className="px-6 md:px-8 py-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Popular Tracks Table */}
        <div className="lg:col-span-8">
          <h2 className="text-xl font-bold text-white mb-4">Popular</h2>

          <div className="space-y-1">
            {artistTracks.map((track, index) => {
              const isCurrent = currentTrack?.id === track.id;
              const trackLiked = isLiked(track.id);
              const trackDownloaded = isDownloaded(track.id);

              return (
                <div
                  key={track.id}
                  onClick={() => playTrack(track, artistTracks)}
                  className={`group flex items-center justify-between p-2.5 rounded-md cursor-pointer transition-colors ${
                    isCurrent ? 'bg-white/10' : 'hover:bg-white/5'
                  }`}
                >
                  <div className="flex items-center gap-4 min-w-0">
                    <span className="w-5 text-center text-xs font-mono text-neutral-400">
                      {index + 1}
                    </span>

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
                      <div className="text-xs text-neutral-400 truncate">
                        {formatNumber(track.plays)} plays
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 shrink-0">
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

        {/* Artist About & Discography */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          <div>
            <h2 className="text-xl font-bold text-white mb-4">About</h2>
            <div className="bg-[#181818] p-5 rounded-xl border border-white/5 space-y-4">
              <div className="aspect-video rounded-lg overflow-hidden bg-neutral-800">
                <img
                  src={artist.imageUrl}
                  alt={artist.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="flex items-center justify-between text-xs text-neutral-400">
                <span className="font-semibold text-white">{formatNumber(artist.monthlyListeners)}</span>
                <span>Monthly Listeners</span>
              </div>

              <p className="text-xs text-neutral-300 leading-relaxed">
                {artist.bio}
              </p>

              <div className="flex flex-wrap gap-1.5 pt-2">
                {artist.genres.map(g => (
                  <span
                    key={g}
                    className="text-[11px] font-mono px-2 py-0.5 rounded bg-white/10 text-neutral-300"
                  >
                    {g}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
