/**
 * AudioAnalyzer - Extracted and adapted from vib34d choreography engine
 * Provides real-time audio analysis for music-responsive animations
 *
 * Features:
 * - Three-band frequency analysis (bass, mid, high)
 * - RMS (root mean square) energy calculation
 * - Beat detection and BPM tracking
 * - Web Audio API integration
 */

export interface AudioFeatures {
  bass: number;      // 0-1, low frequencies (20-250 Hz)
  mid: number;       // 0-1, mid frequencies (250-2000 Hz)
  high: number;      // 0-1, high frequencies (2000-20000 Hz)
  rms: number;       // 0-1, overall energy level
  lowMid: number;    // 0-1, mid-range bass interaction
  beat: boolean;     // true when beat detected
  bpm: number;       // detected beats per minute
  time: number;      // current playback time in seconds
}

export interface BeatInfo {
  timestamp: number;  // time of beat in seconds
  strength: number;   // beat strength 0-1
  isOnset: boolean;   // true for strong onset
}

export class AudioAnalyzer {
  private audioContext: AudioContext | null = null;
  private analyser: AnalyserNode | null = null;
  private source: MediaElementAudioSourceNode | null = null;
  private dataArray: Uint8Array | null = null;
  private bufferLength: number = 0;

  // Frequency analysis settings
  private readonly FFT_SIZE = 2048;
  private readonly SMOOTHING = 0.8;

  // Beat detection
  private beatHistory: number[] = [];
  private lastBeatTime: number = 0;
  private beatThreshold: number = 0.7;
  private bpm: number = 0;

  // Frequency band ranges (indices into FFT output)
  private bassRange = { start: 0, end: 0 };
  private midRange = { start: 0, end: 0 };
  private highRange = { start: 0, end: 0 };

  constructor() {
    // Will be initialized when audio is loaded
  }

  /**
   * Initialize Web Audio API with an audio element
   */
  public async initialize(audioElement: HTMLAudioElement): Promise<void> {
    try {
      // Create or resume audio context
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();

      if (this.audioContext.state === 'suspended') {
        await this.audioContext.resume();
      }

      // Create analyser node
      this.analyser = this.audioContext.createAnalyser();
      this.analyser.fftSize = this.FFT_SIZE;
      this.analyser.smoothingTimeConstant = this.SMOOTHING;

      // Create source from audio element
      this.source = this.audioContext.createMediaElementSource(audioElement);

      // Connect: source → analyser → destination (speakers)
      this.source.connect(this.analyser);
      this.analyser.connect(this.audioContext.destination);

      // Set up data array for frequency data
      this.bufferLength = this.analyser.frequencyBinCount;
      this.dataArray = new Uint8Array(this.bufferLength);

      // Calculate frequency band ranges
      this.calculateFrequencyRanges();

      console.log('✅ AudioAnalyzer initialized', {
        sampleRate: this.audioContext.sampleRate,
        fftSize: this.FFT_SIZE,
        bufferLength: this.bufferLength
      });
    } catch (error) {
      console.error('❌ Failed to initialize AudioAnalyzer:', error);
      throw error;
    }
  }

  /**
   * Calculate which FFT bins correspond to bass, mid, and high frequencies
   */
  private calculateFrequencyRanges(): void {
    if (!this.audioContext) return;

    const nyquist = this.audioContext.sampleRate / 2;
    const binWidth = nyquist / this.bufferLength;

    // Bass: 20-250 Hz
    this.bassRange = {
      start: Math.floor(20 / binWidth),
      end: Math.floor(250 / binWidth)
    };

    // Mid: 250-2000 Hz
    this.midRange = {
      start: Math.floor(250 / binWidth),
      end: Math.floor(2000 / binWidth)
    };

    // High: 2000-20000 Hz
    this.highRange = {
      start: Math.floor(2000 / binWidth),
      end: Math.floor(20000 / binWidth)
    };
  }

  /**
   * Analyze current audio and return features
   */
  public analyze(currentTime: number): AudioFeatures {
    if (!this.analyser || !this.dataArray) {
      return this.getDefaultFeatures(currentTime);
    }

    // Get frequency data
    this.analyser.getByteFrequencyData(this.dataArray);

    // Calculate band averages
    const bass = this.getAverageBandEnergy(this.bassRange);
    const mid = this.getAverageBandEnergy(this.midRange);
    const high = this.getAverageBandEnergy(this.highRange);

    // Calculate RMS (overall energy)
    const rms = this.calculateRMS();

    // Low-mid interaction (useful for rhythm detection)
    const lowMid = (bass * 0.6 + mid * 0.4);

    // Detect beats
    const beat = this.detectBeat(bass, currentTime);

    return {
      bass,
      mid,
      high,
      rms,
      lowMid,
      beat,
      bpm: this.bpm,
      time: currentTime
    };
  }

  /**
   * Get average energy in a frequency range
   */
  private getAverageBandEnergy(range: { start: number; end: number }): number {
    if (!this.dataArray) return 0;

    let sum = 0;
    let count = 0;

    for (let i = range.start; i < range.end && i < this.dataArray.length; i++) {
      sum += this.dataArray[i];
      count++;
    }

    // Normalize to 0-1 (FFT values are 0-255)
    return count > 0 ? (sum / count) / 255 : 0;
  }

  /**
   * Calculate overall energy (RMS)
   */
  private calculateRMS(): number {
    if (!this.dataArray) return 0;

    let sum = 0;
    for (let i = 0; i < this.dataArray.length; i++) {
      const normalized = this.dataArray[i] / 255;
      sum += normalized * normalized;
    }

    return Math.sqrt(sum / this.dataArray.length);
  }

  /**
   * Simple beat detection based on bass energy
   */
  private detectBeat(bassEnergy: number, currentTime: number): boolean {
    const MIN_BEAT_INTERVAL = 0.3; // Don't detect beats more than ~3/sec

    // Check if enough time has passed since last beat
    if (currentTime - this.lastBeatTime < MIN_BEAT_INTERVAL) {
      return false;
    }

    // Check if bass energy exceeds threshold
    if (bassEnergy > this.beatThreshold) {
      this.lastBeatTime = currentTime;
      this.updateBPM(currentTime);
      return true;
    }

    return false;
  }

  /**
   * Update BPM estimation based on beat intervals
   */
  private updateBPM(currentTime: number): void {
    this.beatHistory.push(currentTime);

    // Keep only last 8 beats
    if (this.beatHistory.length > 8) {
      this.beatHistory.shift();
    }

    // Calculate average interval
    if (this.beatHistory.length >= 2) {
      let totalInterval = 0;
      for (let i = 1; i < this.beatHistory.length; i++) {
        totalInterval += this.beatHistory[i] - this.beatHistory[i - 1];
      }
      const avgInterval = totalInterval / (this.beatHistory.length - 1);

      // Convert to BPM
      this.bpm = Math.round(60 / avgInterval);
    }
  }

  /**
   * Get default features when analyzer is not ready
   */
  private getDefaultFeatures(currentTime: number): AudioFeatures {
    return {
      bass: 0,
      mid: 0,
      high: 0,
      rms: 0,
      lowMid: 0,
      beat: false,
      bpm: 0,
      time: currentTime
    };
  }

  /**
   * Set beat detection threshold (0-1)
   */
  public setBeatThreshold(threshold: number): void {
    this.beatThreshold = Math.max(0, Math.min(1, threshold));
  }

  /**
   * Get current beat threshold
   */
  public getBeatThreshold(): number {
    return this.beatThreshold;
  }

  /**
   * Cleanup resources
   */
  public disconnect(): void {
    if (this.source) {
      this.source.disconnect();
      this.source = null;
    }
    if (this.analyser) {
      this.analyser.disconnect();
      this.analyser = null;
    }
    if (this.audioContext) {
      this.audioContext.close();
      this.audioContext = null;
    }
    this.dataArray = null;
  }

  /**
   * Check if analyzer is ready
   */
  public isReady(): boolean {
    return this.audioContext !== null && this.analyser !== null;
  }

  /**
   * Get audio context (for debugging)
   */
  public getAudioContext(): AudioContext | null {
    return this.audioContext;
  }
}
