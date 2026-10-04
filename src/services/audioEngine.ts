import { Track, EqualizerBands, EqualizerPreset } from '../types';

export const EQUALIZER_PRESETS: Record<EqualizerPreset, EqualizerBands> = {
  flat: { bass: 0, lowMid: 0, mid: 0, highMid: 0, treble: 0 },
  bass_boost: { bass: 8, lowMid: 4, mid: 0, highMid: 1, treble: 2 },
  vocal_booster: { bass: -2, lowMid: 1, mid: 6, highMid: 5, treble: 1 },
  electronic: { bass: 6, lowMid: 2, mid: -1, highMid: 4, treble: 6 },
  acoustic: { bass: 3, lowMid: 1, mid: 2, highMid: 3, treble: 4 },
  hifi_clarity: { bass: 4, lowMid: 0, mid: 1, highMid: 3, treble: 7 },
  custom: { bass: 0, lowMid: 0, mid: 0, highMid: 0, treble: 0 }
};

export class AudioEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private analyser: AnalyserNode | null = null;
  private eqFilters: {
    bass: BiquadFilterNode;
    lowMid: BiquadFilterNode;
    mid: BiquadFilterNode;
    highMid: BiquadFilterNode;
    treble: BiquadFilterNode;
  } | null = null;
  private qualityFilter: BiquadFilterNode | null = null;
  private audioEl: HTMLAudioElement | null = null;
  private mediaSourceNode: MediaElementAudioSourceNode | null = null;
  private isUsingRealAudio: boolean = false;

  // Synthesis playback state
  private isPlaying: boolean = false;
  private currentTrack: Track | null = null;
  private currentTime: number = 0;
  private playbackInterval: number | null = null;
  private synthStepInterval: number | null = null;
  private onTimeUpdateCallback: ((time: number) => void) | null = null;
  private onEndedCallback: (() => void) | null = null;
  private volume: number = 0.8;
  private currentQuality: 'normal' | 'high' | 'very_high' | 'lossless' = 'lossless';

  // Musical scales for procedural harmony
  private getScaleFrequencies(rootMidi: number, scaleType: 'major' | 'minor' | 'dorian' | 'pentatonic'): number[] {
    const intervalsMap: Record<string, number[]> = {
      major: [0, 2, 4, 5, 7, 9, 11, 12, 14, 16],
      minor: [0, 2, 3, 5, 7, 8, 10, 12, 14, 15],
      dorian: [0, 2, 3, 5, 7, 9, 10, 12, 14, 15],
      pentatonic: [0, 3, 5, 7, 10, 12, 15, 17, 19, 22]
    };
    const intervals = intervalsMap[scaleType] || intervalsMap.minor;
    return intervals.map(semitones => {
      const midi = rootMidi + semitones;
      return 440 * Math.pow(2, (midi - 69) / 12);
    });
  }

  public init() {
    if (!this.ctx) {
      const AudioCtxClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtxClass();

      // Master gain
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(this.volume, this.ctx.currentTime);

      // Analyser for real-time visualization
      this.analyser = this.ctx.createAnalyser();
      this.analyser.fftSize = 64;
      this.analyser.smoothingTimeConstant = 0.8;

      // Equalizer filters
      const bass = this.ctx.createBiquadFilter();
      bass.type = 'lowshelf';
      bass.frequency.value = 60;

      const lowMid = this.ctx.createBiquadFilter();
      lowMid.type = 'peaking';
      lowMid.frequency.value = 250;
      lowMid.Q.value = 1.0;

      const mid = this.ctx.createBiquadFilter();
      mid.type = 'peaking';
      mid.frequency.value = 1000;
      mid.Q.value = 1.0;

      const highMid = this.ctx.createBiquadFilter();
      highMid.type = 'peaking';
      highMid.frequency.value = 4000;
      highMid.Q.value = 1.0;

      const treble = this.ctx.createBiquadFilter();
      treble.type = 'highshelf';
      treble.frequency.value = 12000;

      // Audio Quality simulation filter
      this.qualityFilter = this.ctx.createBiquadFilter();
      this.qualityFilter.type = 'lowpass';
      this.qualityFilter.frequency.value = 22000; // pristine lossless default

      // Audio node chain: Sources -> EQ filters -> Quality Filter -> Master Gain -> Analyser -> Destination
      bass.connect(lowMid);
      lowMid.connect(mid);
      mid.connect(highMid);
      highMid.connect(treble);
      treble.connect(this.qualityFilter);
      this.qualityFilter.connect(this.masterGain);
      this.masterGain.connect(this.analyser);
      this.analyser.connect(this.ctx.destination);

      this.eqFilters = { bass, lowMid, mid, highMid, treble };

      // Initialize HTMLAudioElement for real streaming
      try {
        this.audioEl = new Audio();
        this.audioEl.crossOrigin = 'anonymous';
        this.mediaSourceNode = this.ctx.createMediaElementSource(this.audioEl);
        this.mediaSourceNode.connect(bass);

        this.audioEl.addEventListener('timeupdate', () => {
          if (this.isUsingRealAudio && this.audioEl) {
            this.currentTime = this.audioEl.currentTime;
            if (this.onTimeUpdateCallback) {
              this.onTimeUpdateCallback(this.currentTime);
            }
          }
        });

        this.audioEl.addEventListener('ended', () => {
          if (this.isUsingRealAudio) {
            this.pause();
            if (this.onEndedCallback) {
              this.onEndedCallback();
            }
          }
        });

        this.audioEl.addEventListener('error', () => {
          // If real audio fails, fallback seamlessly to procedural synth
          if (this.isPlaying && this.currentTrack) {
            this.isUsingRealAudio = false;
            this.startSynthSchedule();
          }
        });
      } catch (e) {
        // Fallback to synth if MediaElementSource not permitted
      }
    }

    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public setQuality(quality: 'normal' | 'high' | 'very_high' | 'lossless') {
    this.currentQuality = quality;
    if (!this.qualityFilter || !this.ctx) return;
    const freqMap = {
      normal: 10500, // 96 kbps cutoff
      high: 15500, // 160 kbps cutoff
      very_high: 19500, // 320 kbps cutoff
      lossless: 22050 // FLAC full band
    };
    this.qualityFilter.frequency.setValueAtTime(freqMap[quality], this.ctx.currentTime);
  }

  public setEqualizer(bands: EqualizerBands) {
    if (!this.eqFilters || !this.ctx) return;
    const now = this.ctx.currentTime;
    this.eqFilters.bass.gain.setValueAtTime(bands.bass, now);
    this.eqFilters.lowMid.gain.setValueAtTime(bands.lowMid, now);
    this.eqFilters.mid.gain.setValueAtTime(bands.mid, now);
    this.eqFilters.highMid.gain.setValueAtTime(bands.highMid, now);
    this.eqFilters.treble.gain.setValueAtTime(bands.treble, now);
  }

  public setVolume(vol: number) {
    this.volume = Math.max(0, Math.min(1, vol));
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(this.volume, this.ctx.currentTime);
    }
  }

  public fadeVolume(targetVol: number, durationMs: number = 3000) {
    if (!this.masterGain || !this.ctx) return;
    const now = this.ctx.currentTime;
    this.masterGain.gain.linearRampToValueAtTime(targetVol, now + durationMs / 1000);
  }

  public play(track: Track, startTime: number = 0) {
    this.init();
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }

    this.currentTrack = track;
    this.currentTime = startTime;
    this.isPlaying = true;

    // Reset both playback modes
    this.stopSynthSchedule();
    if (this.playbackInterval) {
      window.clearInterval(this.playbackInterval);
      this.playbackInterval = null;
    }

    if (this.audioEl && track.audioUrl) {
      try {
        this.isUsingRealAudio = true;
        this.audioEl.src = track.audioUrl;
        this.audioEl.currentTime = startTime;
        const playPromise = this.audioEl.play();
        if (playPromise !== undefined) {
          playPromise.catch(() => {
            // Browser autoplay policy or CORS blocked - fallback to procedural synth immediately
            this.isUsingRealAudio = false;
            this.startSynthSchedule();
            this.startSynthInterval();
          });
        }
      } catch {
        this.isUsingRealAudio = false;
        this.startSynthSchedule();
        this.startSynthInterval();
      }
    } else {
      this.isUsingRealAudio = false;
      this.startSynthSchedule();
      this.startSynthInterval();
    }
  }

  private startSynthInterval() {
    if (this.playbackInterval) {
      window.clearInterval(this.playbackInterval);
    }

    this.playbackInterval = window.setInterval(() => {
      if (!this.isPlaying) return;
      this.currentTime += 0.5;

      if (this.currentTrack && this.currentTime >= this.currentTrack.duration) {
        this.currentTime = this.currentTrack.duration;
        this.pause();
        if (this.onEndedCallback) {
          this.onEndedCallback();
        }
      } else {
        if (this.onTimeUpdateCallback) {
          this.onTimeUpdateCallback(this.currentTime);
        }
      }
    }, 500);
  }

  public pause() {
    this.isPlaying = false;
    if (this.isUsingRealAudio && this.audioEl) {
      this.audioEl.pause();
    }
    this.stopSynthSchedule();
    if (this.playbackInterval) {
      window.clearInterval(this.playbackInterval);
      this.playbackInterval = null;
    }
  }

  public resume() {
    if (!this.currentTrack) return;
    if (this.isUsingRealAudio && this.audioEl) {
      this.isPlaying = true;
      this.audioEl.play().catch(() => {
        this.play(this.currentTrack!, this.currentTime);
      });
    } else {
      this.play(this.currentTrack, this.currentTime);
    }
  }

  public seek(seconds: number) {
    if (!this.currentTrack) return;
    this.currentTime = Math.max(0, Math.min(seconds, this.currentTrack.duration));

    if (this.isUsingRealAudio && this.audioEl) {
      try {
        this.audioEl.currentTime = this.currentTime;
      } catch {
        // ignore
      }
    }

    if (this.onTimeUpdateCallback) {
      this.onTimeUpdateCallback(this.currentTime);
    }
  }

  public getFrequencyData(): Uint8Array {
    if (!this.analyser) {
      return new Uint8Array(32).fill(0);
    }
    const data = new Uint8Array(this.analyser.frequencyBinCount);
    this.analyser.getByteFrequencyData(data);
    return data;
  }

  public getIsPlaying(): boolean {
    return this.isPlaying;
  }

  public getCurrentTime(): number {
    return this.currentTime;
  }

  public onTimeUpdate(cb: (time: number) => void) {
    this.onTimeUpdateCallback = cb;
  }

  public onEnded(cb: () => void) {
    this.onEndedCallback = cb;
  }

  private startSynthSchedule() {
    if (!this.currentTrack || !this.ctx || !this.eqFilters) return;

    const bpm = this.currentTrack.bpm || 110;
    const stepDuration = (60 / bpm) / 2; // 8th note steps
    const signature = this.currentTrack.audioSignature || {
      rootNote: 57,
      scaleType: 'minor',
      tempo: bpm,
      timbre: 'synth'
    };

    const scale = this.getScaleFrequencies(signature.rootNote, signature.scaleType);
    let stepCount = Math.floor(this.currentTime / stepDuration);

    this.synthStepInterval = window.setInterval(() => {
      if (!this.isPlaying || !this.ctx || !this.eqFilters) return;

      const now = this.ctx.currentTime;
      const stepInMeasure = stepCount % 16;
      const inputNode = this.eqFilters.bass;

      // 1. Kick Drum on beats 0, 4, 8, 12
      if (stepInMeasure % 4 === 0) {
        this.triggerKick(now, inputNode);
      }

      // 2. Hi-Hat on offbeats (2, 6, 10, 14)
      if (stepInMeasure % 2 === 1) {
        this.triggerHiHat(now, inputNode);
      }

      // 3. Bass line
      if (stepInMeasure % 2 === 0) {
        const rootFreq = scale[0] / 2;
        const bassFreq = (stepInMeasure === 8 || stepInMeasure === 10) ? scale[2] / 2 : rootFreq;
        this.triggerBass(now, bassFreq, stepDuration * 0.9, inputNode, signature.timbre);
      }

      // 4. Melodic arpeggio chord note
      if (stepInMeasure % 2 === 0 || (stepInMeasure === 7 || stepInMeasure === 15)) {
        const chordIndex = (stepCount % 4 === 0) ? 0 : (stepCount % 4 === 1 ? 2 : (stepCount % 4 === 2 ? 4 : 3));
        const noteFreq = scale[chordIndex % scale.length];
        this.triggerMelody(now, noteFreq, stepDuration * 1.2, inputNode, signature.timbre);
      }

      // 5. Ambient pad chord on first beat of every 16 steps
      if (stepInMeasure === 0) {
        this.triggerPad(now, [scale[0], scale[2], scale[4]], stepDuration * 14, inputNode);
      }

      stepCount++;
    }, stepDuration * 1000);
  }

  private stopSynthSchedule() {
    if (this.synthStepInterval) {
      window.clearInterval(this.synthStepInterval);
      this.synthStepInterval = null;
    }
  }

  // Synthesis Voice Helpers
  private triggerKick(time: number, dest: AudioNode) {
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.frequency.setValueAtTime(140, time);
    osc.frequency.exponentialRampToValueAtTime(35, time + 0.08);

    gain.gain.setValueAtTime(0.4, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.15);

    osc.connect(gain);
    gain.connect(dest);

    osc.start(time);
    osc.stop(time + 0.16);
  }

  private triggerHiHat(time: number, dest: AudioNode) {
    if (!this.ctx) return;
    // White noise buffer for crisp hi-hat
    const bufferSize = this.ctx.sampleRate * 0.04;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }

    const whiteNoise = this.ctx.createBufferSource();
    whiteNoise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.value = 7500;

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.06, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.04);

    whiteNoise.connect(filter);
    filter.connect(gain);
    gain.connect(dest);

    whiteNoise.start(time);
    whiteNoise.stop(time + 0.05);
  }

  private triggerBass(time: number, freq: number, duration: number, dest: AudioNode, timbre: string) {
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    osc.type = (timbre === 'punchy' || timbre === 'synth') ? 'sawtooth' : 'triangle';
    osc.frequency.setValueAtTime(freq, time);

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(450, time);
    filter.frequency.exponentialRampToValueAtTime(120, time + duration);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.22, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + duration);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(dest);

    osc.start(time);
    osc.stop(time + duration);
  }

  private triggerMelody(time: number, freq: number, duration: number, dest: AudioNode, timbre: string) {
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    osc.type = (timbre === 'chill' || timbre === 'ambient') ? 'sine' : 'triangle';
    osc.frequency.setValueAtTime(freq, time);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.12, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + duration);

    osc.connect(gain);
    gain.connect(dest);

    osc.start(time);
    osc.stop(time + duration);
  }

  private triggerPad(time: number, chordFreqs: number[], duration: number, dest: AudioNode) {
    if (!this.ctx) return;
    chordFreqs.forEach(freq => {
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, time);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.001, time);
      gain.gain.linearRampToValueAtTime(0.05, time + 0.4);
      gain.gain.exponentialRampToValueAtTime(0.001, time + duration);

      osc.connect(gain);
      gain.connect(dest);

      osc.start(time);
      osc.stop(time + duration);
    });
  }
}

export const globalAudioEngine = new AudioEngine();
