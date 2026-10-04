import { Track, Playlist, Artist, ConnectedDevice, PremiumPlan, UserProfile } from '../types';

export const INITIAL_TRACKS: Track[] = [
  {
    id: 'track-1',
    title: 'Midnight Horizon',
    artist: 'Luna Eclipse',
    artistId: 'artist-1',
    album: 'Neon Reverie',
    duration: 198,
    coverUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&auto=format&fit=crop&q=80',
    accentColor: '#6366f1',
    genre: 'Synthwave',
    releaseYear: 2025,
    bpm: 120,
    key: 'F# Minor',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    plays: 8432090,
    audioSignature: {
      rootNote: 54, // F#3
      scaleType: 'minor',
      tempo: 120,
      timbre: 'synth'
    },
    lyrics: [
      { time: 0, text: '♪ (Atmospheric synth intro plays) ♪' },
      { time: 12, text: 'Streetlights flashing under purple skies' },
      { time: 24, text: 'Electric city mirrors in your eyes' },
      { time: 36, text: 'We took the highway out of memory lane' },
      { time: 48, text: 'Wash away the shadows in the neon rain' },
      { time: 60, text: 'Hold on, don\'t look back tonight' },
      { time: 72, text: 'We are chasing the midnight horizon' },
      { time: 84, text: 'Underneath the neon glow so bright' },
      { time: 96, text: 'Stars collide and the rhythm goes on' },
      { time: 110, text: 'Can you feel the frequency rising?' },
      { time: 124, text: 'Speeding till the morning sun' },
      { time: 140, text: 'We are boundless, we are one' },
      { time: 160, text: 'Midnight horizon...' },
      { time: 180, text: '♪ (Synth outro fades into infinity) ♪' }
    ]
  },
  {
    id: 'track-2',
    title: 'Levitating Gravity',
    artist: 'Aria Nova',
    artistId: 'artist-2',
    album: 'Solaris Glow',
    duration: 215,
    coverUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=400&auto=format&fit=crop&q=80',
    accentColor: '#ec4899',
    genre: 'Pop / Dance',
    releaseYear: 2025,
    bpm: 124,
    key: 'B Minor',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
    plays: 14210980,
    audioSignature: {
      rootNote: 59, // B3
      scaleType: 'minor',
      tempo: 124,
      timbre: 'punchy'
    },
    lyrics: [
      { time: 0, text: '♪ (Four-on-the-floor beat kick starts) ♪' },
      { time: 10, text: 'I feel a pull that defies the ground' },
      { time: 22, text: 'Echoes vibrating without a sound' },
      { time: 34, text: 'You take my hand and the gravity breaks' },
      { time: 46, text: 'Every heartbeat is a rhythm it makes' },
      { time: 58, text: 'We are levitating high above the clouds' },
      { time: 70, text: 'Hear the bass drop through the roaring crowds' },
      { time: 84, text: 'Zero gravity, love so deep' },
      { time: 98, text: 'This is the promise that we gotta keep' },
      { time: 115, text: 'Dancing in the stratosphere' },
      { time: 135, text: 'All our worries disappear' },
      { time: 155, text: 'Higher, higher, we take flight' },
      { time: 180, text: 'Levitating gravity tonight' }
    ]
  },
  {
    id: 'track-3',
    title: 'Rainy Cafe Study Beats',
    artist: 'Kaito Lo-Fi',
    artistId: 'artist-3',
    album: 'Tokyo Raindrops',
    duration: 164,
    coverUrl: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=400&auto=format&fit=crop&q=80',
    accentColor: '#10b981',
    genre: 'Lo-Fi Chill',
    releaseYear: 2024,
    bpm: 82,
    key: 'C Major',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
    plays: 5912400,
    audioSignature: {
      rootNote: 60, // C4
      scaleType: 'major',
      tempo: 82,
      timbre: 'chill'
    },
    lyrics: [
      { time: 0, text: '☕ (Warm vinyl crackle & rain on glass) ☕' },
      { time: 15, text: 'Gentle piano notes float in the air' },
      { time: 32, text: 'Steaming cup of coffee by the corner chair' },
      { time: 50, text: 'Books and memories open on the wooden desk' },
      { time: 75, text: 'Taking a breath, time to rest' },
      { time: 100, text: 'Raindrops tap a gentle lullaby' },
      { time: 125, text: 'Clouds drifting across the quiet sky' },
      { time: 145, text: 'Peaceful thoughts, calm mind' }
    ]
  },
  {
    id: 'track-4',
    title: 'Metro Skyline Hustle',
    artist: 'Marcus Saint',
    artistId: 'artist-4',
    album: 'Concrete Gold',
    duration: 204,
    coverUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400&auto=format&fit=crop&q=80',
    accentColor: '#f59e0b',
    genre: 'Hip-Hop',
    releaseYear: 2025,
    bpm: 95,
    key: 'D Minor',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3',
    plays: 11450200,
    audioSignature: {
      rootNote: 50, // D3
      scaleType: 'minor',
      tempo: 95,
      timbre: 'punchy'
    },
    lyrics: [
      { time: 0, text: '♪ (Heavy 808 sub bass & crisp hi-hats roll) ♪' },
      { time: 12, text: 'From the subway platform to the penthouse view' },
      { time: 24, text: 'Built this from zero, they had no clue' },
      { time: 36, text: 'Grinding at midnight, dreaming at dawn' },
      { time: 48, text: 'King on the board, never just a pawn' },
      { time: 60, text: 'Skyline glowing in the rearview glass' },
      { time: 75, text: 'Everything they doubted coming to pass' },
      { time: 90, text: 'Count the blessings, count the moves' },
      { time: 110, text: 'We set the rhythm and we break the rules' },
      { time: 135, text: 'Concrete gold in the city of dreams' },
      { time: 160, text: 'Nothing is impossible as it seems' }
    ]
  },
  {
    id: 'track-5',
    title: 'Velvet Silk & Honey',
    artist: 'Chloe Nicole',
    artistId: 'artist-5',
    album: 'Sensory Nocturne',
    duration: 232,
    coverUrl: 'https://images.unsplash.com/photo-1518609878373-06d740f60d8b?w=400&auto=format&fit=crop&q=80',
    accentColor: '#e11d48',
    genre: 'R&B / Soul',
    releaseYear: 2025,
    bpm: 88,
    key: 'Ab Major',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3',
    plays: 7210340,
    audioSignature: {
      rootNote: 56, // G#3
      scaleType: 'major',
      tempo: 88,
      timbre: 'ambient'
    },
    lyrics: [
      { time: 0, text: '♪ (Warm Rhodes chord progression & finger snaps) ♪' },
      { time: 14, text: 'Tasting like honey in the midnight hour' },
      { time: 28, text: 'Soft whispering words with all of your power' },
      { time: 45, text: 'Wrap me in velvet, pull me in close' },
      { time: 62, text: 'You\'re the one blessing I cherish the most' },
      { time: 80, text: 'Silk on my skin, melody sweet' },
      { time: 100, text: 'Synchronized pulses in every heartbeat' },
      { time: 130, text: 'Stay till the morning light breaks through' },
      { time: 165, text: 'Every sweet moment belongs to you' }
    ]
  },
  {
    id: 'track-8',
    title: 'Clair de Lune (Peaceful Piano)',
    artist: 'Elena Rostova',
    artistId: 'artist-8',
    album: 'Piano Reveries',
    duration: 220,
    coverUrl: 'https://images.unsplash.com/photo-1520523839898-50712825e3a7?w=400&auto=format&fit=crop&q=80',
    accentColor: '#8b5cf6',
    genre: 'Classical / Ambient',
    releaseYear: 2024,
    bpm: 72,
    key: 'Db Major',
    audioUrl: 'https://upload.wikimedia.org/wikipedia/commons/2/22/Clair_de_lune_%28Claude_Debussy%29_Suite_bergamasque.ogg',
    plays: 4310500,
    audioSignature: {
      rootNote: 61, // Db4
      scaleType: 'major',
      tempo: 72,
      timbre: 'ambient'
    },
    lyrics: [
      { time: 0, text: '🎹 (Tender, cascading grand piano arpeggios) 🎹' },
      { time: 20, text: 'Silver moonlight spilling across still water' },
      { time: 50, text: 'Gentle nocturne echoing through quiet gardens' },
      { time: 90, text: 'A tranquil melody for the wandering soul' },
      { time: 130, text: 'Soft harmonic waves beneath starry skies' },
      { time: 175, text: 'Subtle crescendo of deep reflection' },
      { time: 205, text: 'Fading like a dream into the quiet dawn' }
    ]
  },
  {
    id: 'track-rain',
    title: 'Gentle Midnight Rainfall (Sleep Ambience)',
    artist: 'Nature Soundscapes',
    artistId: 'artist-sleep',
    album: 'Deep Sleep & Relaxation',
    duration: 360,
    coverUrl: 'https://images.unsplash.com/photo-1519692933481-e162a57d6721?w=400&auto=format&fit=crop&q=80',
    accentColor: '#0284c7',
    genre: 'Sleep / Nature',
    releaseYear: 2025,
    bpm: 60,
    key: 'F Major',
    audioUrl: 'https://actions.google.com/sounds/v1/weather/rain_heavy.ogg',
    plays: 18920100,
    audioSignature: {
      rootNote: 65,
      scaleType: 'pentatonic',
      tempo: 60,
      timbre: 'chill'
    },
    lyrics: [
      { time: 0, text: '🌧️ (Steady, soothing summer rainfall outside window) 🌧️' },
      { time: 30, text: 'Deep rhythmic droplets tapping softly against the glass' },
      { time: 90, text: 'Breathe in slowly... let your mind release the busy day' },
      { time: 180, text: 'Peaceful rain soundscapes for restorative sleep' },
      { time: 270, text: 'Continuous calm white noise into the night' },
      { time: 330, text: 'Drifting off into quiet slumber...' }
    ]
  },
  {
    id: 'track-windchimes',
    title: 'Soft Rain & Wind Chimes',
    artist: 'Nature Soundscapes',
    artistId: 'artist-sleep',
    album: 'Deep Sleep & Relaxation',
    duration: 310,
    coverUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=400&auto=format&fit=crop&q=80',
    accentColor: '#38bdf8',
    genre: 'Sleep / Nature',
    releaseYear: 2025,
    bpm: 55,
    key: 'C Major',
    audioUrl: 'https://actions.google.com/sounds/v1/weather/soft_wind_chimes_and_rain.ogg',
    plays: 9140200,
    audioSignature: {
      rootNote: 60,
      scaleType: 'pentatonic',
      tempo: 55,
      timbre: 'ambient'
    },
    lyrics: [
      { time: 0, text: '🎐 (Delicate harmonic wind chimes swaying in rainfall) 🎐' },
      { time: 40, text: 'Resonant bronze chimes bring stillness to the room' },
      { time: 120, text: 'Slow, calm breathing rhythm' },
      { time: 200, text: 'Deep restful delta-wave relaxation' },
      { time: 280, text: 'Quiet serenity and restorative rest' }
    ]
  },
  {
    id: 'track-6',
    title: 'Cyberpunk Odyssey 2088',
    artist: 'Vector Prime',
    artistId: 'artist-6',
    album: 'Synthetic Future',
    duration: 248,
    coverUrl: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=400&auto=format&fit=crop&q=80',
    accentColor: '#06b6d4',
    genre: 'Electronic',
    releaseYear: 2026,
    bpm: 128,
    key: 'A Minor',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
    plays: 9840120,
    audioSignature: {
      rootNote: 57, // A3
      scaleType: 'minor',
      tempo: 128,
      timbre: 'synth'
    },
    lyrics: [
      { time: 0, text: '⚡ (Pulse modulation & arpeggiated synth) ⚡' },
      { time: 16, text: 'Grid online. Neural network synced.' },
      { time: 32, text: 'Streaming down the optic fiber lines' },
      { time: 48, text: 'Glitches illuminating ancient signs' },
      { time: 64, text: 'We found freedom in the digital dawn' },
      { time: 80, text: 'The old physical world is gone' },
      { time: 105, text: 'Overdrive engaged... system overload!' },
      { time: 130, text: 'Breaking free from the master code' },
      { time: 160, text: 'Synthetic future, electric pulse' },
      { time: 200, text: 'Pure binary energy flows through us' }
    ]
  },
  {
    id: 'track-7',
    title: 'Summer Coastline Highway',
    artist: 'The Wild Palms',
    artistId: 'artist-7',
    album: 'Pacific Sunset',
    duration: 188,
    coverUrl: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=400&auto=format&fit=crop&q=80',
    accentColor: '#14b8a6',
    genre: 'Indie Rock',
    releaseYear: 2024,
    bpm: 112,
    key: 'E Major',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
    plays: 6340200,
    audioSignature: {
      rootNote: 52, // E3
      scaleType: 'major',
      tempo: 112,
      timbre: 'acoustic'
    },
    lyrics: [
      { time: 0, text: '🎸 (Jangling acoustic & electric guitar riff) 🎸' },
      { time: 14, text: 'Windows rolled down, ocean breeze in my hair' },
      { time: 28, text: 'Not a single trouble or a single care' },
      { time: 42, text: 'Pacific Highway winding on the coast' },
      { time: 56, text: 'Here\'s to the summer days we loved the most' },
      { time: 70, text: 'Golden sun setting on the blue ocean tides' },
      { time: 90, text: 'Nothing beats these coastal highway rides' },
      { time: 115, text: 'Sing it loud with the radio song' },
      { time: 140, text: 'Where the wild warm memories belong' }
    ]
  },
  {
    id: 'track-9',
    title: 'Starlight Overdrive',
    artist: 'Luna Eclipse',
    artistId: 'artist-1',
    album: 'Neon Reverie',
    duration: 210,
    coverUrl: 'https://images.unsplash.com/photo-1506157786151-b8491531f063?w=400&auto=format&fit=crop&q=80',
    accentColor: '#3b82f6',
    genre: 'Synthwave',
    releaseYear: 2025,
    bpm: 126,
    key: 'G Minor',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    plays: 5219400,
    audioSignature: {
      rootNote: 55, // G3
      scaleType: 'minor',
      tempo: 126,
      timbre: 'synth'
    },
    lyrics: [
      { time: 0, text: '♪ (Driving retro synth bassline starts) ♪' },
      { time: 15, text: 'Cruising past the rings of Saturn' },
      { time: 30, text: 'Laser lights in a geometric pattern' },
      { time: 48, text: 'Punch the throttle, leave the dust behind' },
      { time: 65, text: 'A new dimension in the overdrive of mind' },
      { time: 85, text: 'Starlight burning, cosmic speed' },
      { time: 110, text: 'Music is the only compass that we need' }
    ]
  },
  {
    id: 'track-10',
    title: 'Espresso Sunset',
    artist: 'Kaito Lo-Fi',
    artistId: 'artist-3',
    album: 'Tokyo Raindrops',
    duration: 175,
    coverUrl: 'https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?w=400&auto=format&fit=crop&q=80',
    accentColor: '#d97706',
    genre: 'Lo-Fi Chill',
    releaseYear: 2024,
    bpm: 85,
    key: 'G Major',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3',
    plays: 3890200,
    audioSignature: {
      rootNote: 55, // G3
      scaleType: 'major',
      tempo: 85,
      timbre: 'chill'
    },
    lyrics: [
      { time: 0, text: '🌇 (Chilled jazz guitar & tape flutter) 🌇' },
      { time: 20, text: 'Golden hour filtering through the cafe blinds' },
      { time: 45, text: 'Leaving all the noisy world behind' },
      { time: 80, text: 'Warm espresso and cozy company' },
      { time: 115, text: 'Life unfolding in sweet harmony' }
    ]
  },
  {
    id: 'track-11',
    title: 'Diamond Crown',
    artist: 'Marcus Saint',
    artistId: 'artist-4',
    album: 'Concrete Gold',
    duration: 195,
    coverUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=400&auto=format&fit=crop&q=80',
    accentColor: '#eab308',
    genre: 'Hip-Hop',
    releaseYear: 2025,
    bpm: 100,
    key: 'C# Minor',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3',
    plays: 8900400,
    audioSignature: {
      rootNote: 49, // C#3
      scaleType: 'minor',
      tempo: 100,
      timbre: 'punchy'
    },
    lyrics: [
      { time: 0, text: '👑 (Punchy kick and trap snare combo) 👑' },
      { time: 12, text: 'Heavy is the head, but we wear it proud' },
      { time: 26, text: 'Making moves in silence, never loud' },
      { time: 45, text: 'Diamond crown carved out of perseverance' },
      { time: 70, text: 'No shortcuts, that\'s the real coherence' }
    ]
  },
  {
    id: 'track-12',
    title: 'Midnight Echoes',
    artist: 'Chloe Nicole',
    artistId: 'artist-5',
    album: 'Sensory Nocturne',
    duration: 218,
    coverUrl: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=400&auto=format&fit=crop&q=80',
    accentColor: '#9333ea',
    genre: 'R&B / Soul',
    releaseYear: 2025,
    bpm: 90,
    key: 'Bb Minor',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3',
    plays: 6105300,
    audioSignature: {
      rootNote: 58, // Bb3
      scaleType: 'minor',
      tempo: 90,
      timbre: 'ambient'
    },
    lyrics: [
      { time: 0, text: '🌙 (Lush reverbed vocal harmonies) 🌙' },
      { time: 16, text: 'When the clock strikes two, I hear you calling' },
      { time: 35, text: 'Shadows on the wall softly falling' },
      { time: 60, text: 'Can\'t resist the pull of midnight echoes' },
      { time: 95, text: 'Where the gentle rhythm overflow' }
    ]
  }
];

export const INITIAL_ARTISTS: Artist[] = [
  {
    id: 'artist-1',
    name: 'Luna Eclipse',
    monthlyListeners: 12450800,
    imageUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
    accentColor: '#6366f1',
    genres: ['Synthwave', 'Electronic', 'Retrowave'],
    bio: 'Pioneering futuristic synthwave soundscapes that blend 80s nostalgia with modern heavy basslines.'
  },
  {
    id: 'artist-2',
    name: 'Aria Nova',
    monthlyListeners: 24190400,
    imageUrl: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400&auto=format&fit=crop&q=80',
    accentColor: '#ec4899',
    genres: ['Pop / Dance', 'Electropop'],
    bio: 'Chart-topping dance pop icon known for viral energetic stadium anthems and infectious vocal hooks.'
  },
  {
    id: 'artist-3',
    name: 'Kaito Lo-Fi',
    monthlyListeners: 8401300,
    imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
    accentColor: '#10b981',
    genres: ['Lo-Fi Chill', 'Jazzhop', 'Ambient'],
    bio: 'Tokyo-based producer curating warm vinyl grooves, cozy tape saturation, and calm late-night study beats.'
  },
  {
    id: 'artist-4',
    name: 'Marcus Saint',
    monthlyListeners: 16800200,
    imageUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80',
    accentColor: '#f59e0b',
    genres: ['Hip-Hop', 'Trap', 'Boom Bap'],
    bio: 'East coast lyricist delivering razor-sharp wordplay over booming 808s and cinematic brass melodies.'
  },
  {
    id: 'artist-5',
    name: 'Chloe Nicole',
    monthlyListeners: 10920400,
    imageUrl: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=400&auto=format&fit=crop&q=80',
    accentColor: '#e11d48',
    genres: ['R&B / Soul', 'Neo-Soul'],
    bio: 'Grammy-nominated songstress infusing silky neo-soul chords with intimate storytelling.'
  },
  {
    id: 'artist-6',
    name: 'Vector Prime',
    monthlyListeners: 7340900,
    imageUrl: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=400&auto=format&fit=crop&q=80',
    accentColor: '#06b6d4',
    genres: ['Electronic', 'Cyberpunk', 'Industrial'],
    bio: 'Berlin-based audio designer crafting high-voltage electronic odysseys with modular synthesizers.'
  },
  {
    id: 'artist-sleep',
    name: 'Nature Soundscapes',
    monthlyListeners: 19800400,
    imageUrl: 'https://images.unsplash.com/photo-1519692933481-e162a57d6721?w=400&auto=format&fit=crop&q=80',
    accentColor: '#0284c7',
    genres: ['Sleep / Nature', 'Ambient', 'White Noise'],
    bio: 'Pristine environmental recordings, rainstorms, and peaceful acoustics engineered for deep delta-wave sleep and tranquility.'
  }
];

export const INITIAL_PLAYLISTS: Playlist[] = [
  {
    id: 'playlist-liked',
    name: 'Liked Songs',
    description: 'Your favorite tracks in one personal playlist.',
    coverUrl: 'https://images.unsplash.com/photo-1518609878373-06d740f60d8b?w=400&auto=format&fit=crop&q=80',
    accentColor: '#4f46e5',
    creator: { id: 'user-me', name: 'Alex Parker' },
    trackIds: ['track-1', 'track-2', 'track-5', 'track-3', 'track-8'],
    isLikedSongs: true,
    isPinned: true,
    isDownloaded: true,
    createdAt: '2025-01-15'
  },
  {
    id: 'playlist-top-hits',
    name: 'Today\'s Top Hits',
    description: 'Aria Nova and Luna Eclipse are on top of the world. The hottest tracks right now.',
    coverUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=400&auto=format&fit=crop&q=80',
    accentColor: '#ec4899',
    creator: { id: 'spotify-curated', name: 'Spotify' },
    trackIds: ['track-2', 'track-1', 'track-4', 'track-5', 'track-6', 'track-7'],
    isPinned: true,
    isDownloaded: false,
    createdAt: '2025-02-01'
  },
  {
    id: 'playlist-peaceful-piano',
    name: 'Peaceful Piano & Sleep',
    description: 'Soft, delicate piano melodies to drift off to. Set your Sleep Timer and let gentle harmonics lull you to rest.',
    coverUrl: 'https://images.unsplash.com/photo-1520523839898-50712825e3a7?w=400&auto=format&fit=crop&q=80',
    accentColor: '#8b5cf6',
    creator: { id: 'spotify-curated', name: 'Spotify' },
    trackIds: ['track-8', 'track-rain', 'track-windchimes', 'track-3', 'track-5'],
    isPinned: true,
    isDownloaded: true,
    createdAt: '2025-02-10'
  },
  {
    id: 'playlist-sleep-rain',
    name: 'Night Rain & Cozy Atmosphere',
    description: 'Calming summer rain, gentle wind chimes, and deep restful frequency for bedtime and meditation.',
    coverUrl: 'https://images.unsplash.com/photo-1519692933481-e162a57d6721?w=400&auto=format&fit=crop&q=80',
    accentColor: '#0284c7',
    creator: { id: 'spotify-curated', name: 'Spotify' },
    trackIds: ['track-rain', 'track-windchimes', 'track-8', 'track-10'],
    isPinned: false,
    isDownloaded: true,
    createdAt: '2025-02-12'
  },
  {
    id: 'playlist-rap-caviar',
    name: 'RapCaviar',
    description: 'Hip-Hop\'s heavyweight anthems. Booming 808s, diamond flows, and city anthems.',
    coverUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=400&auto=format&fit=crop&q=80',
    accentColor: '#f59e0b',
    creator: { id: 'spotify-curated', name: 'Spotify' },
    trackIds: ['track-4', 'track-11', 'track-6', 'track-1'],
    isPinned: false,
    isDownloaded: false,
    createdAt: '2025-02-18'
  },
  {
    id: 'playlist-chill-lofi',
    name: 'Chill Lo-Fi Study Beats',
    description: 'Mellow beats, cozy coffee vibes, and peaceful focus sounds.',
    coverUrl: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=400&auto=format&fit=crop&q=80',
    accentColor: '#10b981',
    creator: { id: 'spotify-curated', name: 'Spotify' },
    trackIds: ['track-3', 'track-10', 'track-8', 'track-5'],
    isPinned: false,
    isDownloaded: true,
    createdAt: '2025-01-10'
  },
  {
    id: 'playlist-synth-drive',
    name: 'Synthwave Night Drive',
    description: 'Neon skylines, retro synthesizers, and midnight highway cruises.',
    coverUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&auto=format&fit=crop&q=80',
    accentColor: '#6366f1',
    creator: { id: 'spotify-curated', name: 'Spotify' },
    trackIds: ['track-1', 'track-9', 'track-6', 'track-2'],
    isPinned: false,
    isDownloaded: false,
    createdAt: '2025-02-14'
  },
  {
    id: 'playlist-workout',
    name: 'High Octane Workout',
    description: 'Unstoppable energy, explosive basslines, and maximum motivation.',
    coverUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400&auto=format&fit=crop&q=80',
    accentColor: '#ef4444',
    creator: { id: 'spotify-curated', name: 'Spotify' },
    trackIds: ['track-4', 'track-11', 'track-6', 'track-2', 'track-9'],
    isPinned: false,
    isDownloaded: false,
    createdAt: '2025-02-20'
  }
];

export const INITIAL_DEVICES: ConnectedDevice[] = [
  {
    id: 'dev-web',
    name: 'Web Player (Current)',
    type: 'computer',
    isActive: true,
    lastSynced: 'Just now',
    volume: 80
  },
  {
    id: 'dev-iphone',
    name: 'iPhone 15 Pro (Alex\'s Phone)',
    type: 'smartphone',
    isActive: false,
    lastSynced: '1m ago',
    volume: 65
  },
  {
    id: 'dev-macbook',
    name: 'MacBook Pro 16" (Studio)',
    type: 'computer',
    isActive: false,
    lastSynced: '12m ago',
    volume: 90
  },
  {
    id: 'dev-sonos',
    name: 'Sonos Era 300 (Bedroom / Sleep)',
    type: 'speaker',
    isActive: false,
    lastSynced: '2h ago',
    volume: 50
  },
  {
    id: 'dev-tv',
    name: 'Samsung 65" OLED TV',
    type: 'tv',
    isActive: false,
    lastSynced: 'Yesterday',
    volume: 40
  }
];

export const PREMIUM_PLANS: PremiumPlan[] = [
  {
    id: 'individual',
    name: 'Premium Individual',
    price: '$10.99',
    billingPeriod: 'month',
    accounts: '1 account',
    description: 'Ad-free music listening, offline downloads, unlimited skips, and Hi-Fi Lossless audio.',
    popular: true,
    features: [
      '1 Premium account with personal recommendations',
      'Cancel anytime with zero commitments',
      'Download songs to listen offline anywhere',
      'Ad-free uninterrupted music streaming',
      '24-bit Hi-Fi Lossless FLAC audio quality',
      'Unlimited skips & on-demand playback',
      'Spotify Connect cross-device seamless switching'
    ]
  },
  {
    id: 'duo',
    name: 'Premium Duo',
    price: '$14.99',
    billingPeriod: 'month',
    accounts: '2 accounts',
    description: 'For couples or two people living together. Two separate accounts under one discounted bill.',
    popular: false,
    features: [
      '2 independent Premium accounts',
      'Duo Mix: shared playlist curated for two',
      'Offline playback for both accounts',
      'Ad-free high-fidelity sound on all devices',
      'Individual liked songs & customized algorithms'
    ]
  },
  {
    id: 'family',
    name: 'Premium Family',
    price: '$16.99',
    billingPeriod: 'month',
    accounts: 'Up to 6 accounts',
    description: 'For families under one roof. Parental controls, Spotify Kids app, and Family Mix.',
    popular: false,
    features: [
      'Up to 6 Premium accounts for family members',
      'Block explicit music with parental controls',
      'Spotify Kids dedicated mobile application',
      'Family Mix playlist regularly updated',
      'Offline downloads for every member'
    ]
  },
  {
    id: 'student',
    name: 'Premium Student',
    price: '$5.99',
    billingPeriod: 'month',
    accounts: '1 account',
    description: 'Special verified student discount including ad-supported Hulu and SHOWTIME.',
    popular: false,
    features: [
      '1 verified college/university account',
      'Includes access to Hulu (with ads)',
      '50% discount for up to 4 academic years',
      'Offline listening & high-quality streaming',
      'Cancel anytime'
    ]
  }
];

export const INITIAL_USER: UserProfile = {
  id: 'user-me',
  name: 'Alex Parker',
  email: 'alex.parker@streamify.io',
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
  plan: 'individual',
  planStatus: 'active',
  planExpiryDate: '2026-12-31',
  minutesListened: 14820,
  followersCount: 38,
  followingCount: 142,
  topGenres: ['Synthwave', 'Lo-Fi Chill', 'Pop / Dance', 'Classical / Ambient', 'Sleep / Nature'],
  settings: {
    streamingQuality: 'lossless',
    downloadQuality: 'lossless',
    crossfadeSeconds: 3,
    normalizeVolume: true,
    autoplaySimilar: true,
    crossPlatformSync: true,
    offlineMode: false
  }
};

export const GENRE_CATEGORIES = [
  { name: 'Pop', color: 'from-pink-600 to-rose-700', icon: 'Sparkles', image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=300&auto=format&fit=crop&q=80' },
  { name: 'Sleep & Nature', color: 'from-sky-700 to-indigo-950', icon: 'Moon', image: 'https://images.unsplash.com/photo-1519692933481-e162a57d6721?w=300&auto=format&fit=crop&q=80' },
  { name: 'Hip-Hop', color: 'from-amber-600 to-orange-700', icon: 'Flame', image: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=300&auto=format&fit=crop&q=80' },
  { name: 'Lo-Fi Chill', color: 'from-emerald-600 to-teal-800', icon: 'Coffee', image: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=300&auto=format&fit=crop&q=80' },
  { name: 'Peaceful Piano', color: 'from-purple-700 to-slate-900', icon: 'Music', image: 'https://images.unsplash.com/photo-1520523839898-50712825e3a7?w=300&auto=format&fit=crop&q=80' },
  { name: 'Synthwave', color: 'from-indigo-600 to-purple-800', icon: 'Radio', image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=300&auto=format&fit=crop&q=80' },
  { name: 'Electronic', color: 'from-cyan-600 to-blue-800', icon: 'Zap', image: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=300&auto=format&fit=crop&q=80' },
  { name: 'Indie Rock', color: 'from-red-600 to-stone-800', icon: 'Guitar', image: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=300&auto=format&fit=crop&q=80' },
  { name: 'R&B / Soul', color: 'from-purple-600 to-pink-800', icon: 'Heart', image: 'https://images.unsplash.com/photo-1518609878373-06d740f60d8b?w=300&auto=format&fit=crop&q=80' },
  { name: 'Classical', color: 'from-slate-600 to-zinc-800', icon: 'Music', image: 'https://images.unsplash.com/photo-1520523839898-50712825e3a7?w=300&auto=format&fit=crop&q=80' }
];
