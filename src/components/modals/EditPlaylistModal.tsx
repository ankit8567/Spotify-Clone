import React, { useState, useEffect } from 'react';
import { useMusic } from '../../context/MusicContext';
import { X, Music } from 'lucide-react';

const COLOR_CHOICES = [
  '#6366f1', // Indigo
  '#ec4899', // Pink
  '#10b981', // Emerald
  '#f59e0b', // Amber
  '#e11d48', // Rose
  '#06b6d4', // Cyan
  '#8b5cf6', // Violet
  '#3b82f6'  // Blue
];

export const EditPlaylistModal: React.FC = () => {
  const {
    isEditPlaylistModalOpen,
    closeEditPlaylistModal,
    playlistToEdit,
    createPlaylist,
    updatePlaylist,
    navigate
  } = useMusic();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [accentColor, setAccentColor] = useState(COLOR_CHOICES[0]);

  useEffect(() => {
    if (playlistToEdit) {
      setName(playlistToEdit.name);
      setDescription(playlistToEdit.description);
      setAccentColor(playlistToEdit.accentColor || COLOR_CHOICES[0]);
    } else {
      setName(`My Playlist #${Math.floor(Math.random() * 90) + 10}`);
      setDescription('');
      setAccentColor(COLOR_CHOICES[Math.floor(Math.random() * COLOR_CHOICES.length)]);
    }
  }, [playlistToEdit, isEditPlaylistModalOpen]);

  if (!isEditPlaylistModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    if (playlistToEdit) {
      updatePlaylist(playlistToEdit.id, {
        name: name.trim(),
        description: description.trim(),
        accentColor
      });
    } else {
      const newPlaylist = createPlaylist(name.trim(), description.trim(), accentColor);
      navigate('playlist', newPlaylist.id);
    }
    closeEditPlaylistModal();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
      <div className="bg-[#282828] border border-white/10 rounded-2xl w-full max-w-md shadow-2xl p-6 space-y-6 text-white">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <h2 className="text-lg font-bold">
            {playlistToEdit ? 'Edit details' : 'Create new playlist'}
          </h2>
          <button
            onClick={closeEditPlaylistModal}
            className="w-8 h-8 rounded-full hover:bg-white/10 flex items-center justify-center text-neutral-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex gap-4 items-start">
            {/* Cover Preview */}
            <div
              className="w-36 h-36 rounded-lg flex flex-col items-center justify-center shrink-0 shadow-lg text-white"
              style={{ backgroundColor: accentColor }}
            >
              <Music className="w-12 h-12 mb-2 text-white/80" />
              <span className="text-[10px] uppercase font-bold tracking-wider opacity-80">
                Custom Cover
              </span>
            </div>

            {/* Inputs */}
            <div className="flex-1 space-y-3">
              <div>
                <label className="text-[11px] font-semibold text-neutral-400 block mb-1">
                  Playlist Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="My Playlist"
                  className="w-full px-3 py-2 rounded-md bg-[#3e3e3e] border border-transparent focus:border-white/40 text-sm text-white focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-neutral-400 block mb-1">
                  Description
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Add an optional description"
                  rows={3}
                  className="w-full px-3 py-2 rounded-md bg-[#3e3e3e] border border-transparent focus:border-white/40 text-xs text-white focus:outline-none resize-none"
                />
              </div>
            </div>
          </div>

          {/* Color Palette Selector */}
          <div>
            <label className="text-[11px] font-semibold text-neutral-400 block mb-2">
              Atmosphere / Theme Color
            </label>
            <div className="flex items-center gap-2">
              {COLOR_CHOICES.map((col) => (
                <button
                  type="button"
                  key={col}
                  onClick={() => setAccentColor(col)}
                  className={`w-7 h-7 rounded-full transition-transform ${
                    accentColor === col ? 'ring-2 ring-white scale-110' : 'opacity-70 hover:opacity-100'
                  }`}
                  style={{ backgroundColor: col }}
                />
              ))}
            </div>
          </div>

          {/* Footer Save */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/10">
            <button
              type="button"
              onClick={closeEditPlaylistModal}
              className="px-4 py-2 rounded-full text-xs font-bold text-neutral-300 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 rounded-full bg-white text-black font-extrabold text-xs hover:scale-105 active:scale-95 transition-all shadow-md"
            >
              Save Playlist
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
