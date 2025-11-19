/**
 * FrameChoreographer - Maps audio features to GIF frame sequences
 * Adapted from vib34d choreography engine for frame-based animation
 *
 * Instead of modulating 3D parameters, this sequences a small set of frames
 * in rhythm with the music to create music-responsive GIF animations.
 */

import { AudioFeatures } from './audioAnalyzer';

export type ChoreographyStyle =
  | 'chill'       // Gentle, smooth transitions on major beats
  | 'bounce'      // Energetic, reactive to all beats
  | 'strobe'      // Rapid changes on strong beats
  | 'logo-safe'   // Subtle, professional (mostly holds anchor)
  | 'glitch'      // Chaotic, fragmented
  | 'pulse'       // Rhythmic breathing effect
  | 'wave';       // Smooth cycling through frames

export interface FrameSet {
  anchorFrames: string[];    // URLs/paths to frames close to original
  animatedFrames: string[];  // URLs/paths to animated variant frames
}

export interface ChoreographyConfig {
  style: ChoreographyStyle;
  intensity: number;         // 0-1, how aggressively frames change
  fps: number;               // Target frame rate for output
  duration: number;          // Target duration in seconds
}

export interface FrameTimeline {
  frameIndices: number[];    // Index into combined frame array at each timestamp
  frameSet: FrameSet;        // The frames being sequenced
  fps: number;               // Frames per second
  duration: number;          // Total duration in seconds
}

/**
 * Frame choreographer - creates music-responsive frame sequences
 */
export class FrameChoreographer {
  private config: ChoreographyConfig;
  private frameSet: FrameSet | null = null;
  private allFrames: string[] = [];
  private currentFrameIndex: number = 0;
  private lastBeatFrame: number = 0;

  // Pattern state
  private patternPhase: number = 0;
  private holdCounter: number = 0;

  constructor(config: ChoreographyConfig) {
    this.config = config;
  }

  /**
   * Set the frame set to choreograph
   */
  public setFrameSet(frameSet: FrameSet): void {
    this.frameSet = frameSet;
    // Combine anchor and animated frames into single array
    this.allFrames = [...frameSet.anchorFrames, ...frameSet.animatedFrames];
  }

  /**
   * Generate a complete frame timeline based on audio analysis
   * This pre-computes the entire animation sequence
   */
  public generateTimeline(
    audioFeatures: AudioFeatures[],
    frameSet: FrameSet
  ): FrameTimeline {
    this.setFrameSet(frameSet);

    const totalFrames = Math.ceil(this.config.duration * this.config.fps);
    const frameIndices: number[] = new Array(totalFrames);

    // Map each output frame to a source frame based on audio
    for (let i = 0; i < totalFrames; i++) {
      const timeInSeconds = i / this.config.fps;

      // Find closest audio analysis sample
      const audioIndex = Math.floor(
        (timeInSeconds / this.config.duration) * audioFeatures.length
      );
      const features = audioFeatures[Math.min(audioIndex, audioFeatures.length - 1)];

      // Choose frame based on style and audio features
      frameIndices[i] = this.chooseFrame(features, i, timeInSeconds);
    }

    return {
      frameIndices,
      frameSet,
      fps: this.config.fps,
      duration: this.config.duration
    };
  }

  /**
   * Choose which frame to display based on audio features and style
   */
  private chooseFrame(
    audio: AudioFeatures,
    frameNumber: number,
    time: number
  ): number {
    const { anchorFrames, animatedFrames } = this.frameSet!;
    const anchorCount = anchorFrames.length;
    const animatedCount = animatedFrames.length;
    const totalFrames = this.allFrames.length;

    switch (this.config.style) {
      case 'chill':
        return this.chillStyle(audio, anchorCount, animatedCount, time);

      case 'bounce':
        return this.bounceStyle(audio, anchorCount, animatedCount);

      case 'strobe':
        return this.strobeStyle(audio, anchorCount, animatedCount);

      case 'logo-safe':
        return this.logoSafeStyle(audio, anchorCount, animatedCount);

      case 'glitch':
        return this.glitchStyle(audio, totalFrames);

      case 'pulse':
        return this.pulseStyle(audio, anchorCount, animatedCount, time);

      case 'wave':
        return this.waveStyle(audio, totalFrames, time);

      default:
        return 0; // Default to first anchor frame
    }
  }

  /**
   * CHILL: Gentle transitions, mostly anchors with subtle animation on strong beats
   */
  private chillStyle(
    audio: AudioFeatures,
    anchorCount: number,
    animatedCount: number,
    time: number
  ): number {
    const intensity = this.config.intensity * 0.5; // Reduce intensity for chill

    // On strong beats, briefly show animated frame
    if (audio.beat && audio.bass > 0.6) {
      const animIndex = Math.floor(audio.mid * animatedCount);
      return anchorCount + animIndex;
    }

    // Otherwise, slowly cycle through anchor frames
    const cycleSpeed = 0.2; // Hz
    const anchorIndex = Math.floor((time * cycleSpeed) % anchorCount);
    return anchorIndex;
  }

  /**
   * BOUNCE: Reactive to all beats, animated frames on bass hits
   */
  private bounceStyle(
    audio: AudioFeatures,
    anchorCount: number,
    animatedCount: number
  ): number {
    const intensity = this.config.intensity;

    // Strong bass → animated frame
    if (audio.bass > 0.5 * intensity) {
      const animIndex = Math.floor(audio.bass * animatedCount);
      return anchorCount + animIndex;
    }

    // Mid frequencies → cycle anchors faster
    if (audio.mid > 0.4) {
      this.patternPhase = (this.patternPhase + audio.mid * 0.1) % 1;
      const anchorIndex = Math.floor(this.patternPhase * anchorCount);
      return anchorIndex;
    }

    // Low energy → hold first anchor
    return 0;
  }

  /**
   * STROBE: Rapid changes on strong beats, hold on weak
   */
  private strobeStyle(
    audio: AudioFeatures,
    anchorCount: number,
    animatedCount: number
  ): number {
    const threshold = 0.7;

    // On beat above threshold, rapidly alternate
    if (audio.beat || audio.rms > threshold * this.config.intensity) {
      // Alternate between anchor and animated
      const useAnimated = Math.random() > 0.5;
      if (useAnimated) {
        const animIndex = Math.floor(Math.random() * animatedCount);
        return anchorCount + animIndex;
      }
    }

    // Hold on first anchor during quiet parts
    return 0;
  }

  /**
   * LOGO-SAFE: Mostly static, very subtle movement
   */
  private logoSafeStyle(
    audio: AudioFeatures,
    anchorCount: number,
    animatedCount: number
  ): number {
    const intensity = this.config.intensity * 0.3; // Very subtle

    // Only on very strong beats, briefly show first animated frame
    if (audio.beat && audio.bass > 0.8) {
      return anchorCount; // Just first animated frame
    }

    // Occasionally alternate between first 2 anchors
    if (audio.rms > 0.5 && Math.random() < 0.1 * intensity) {
      return Math.min(1, anchorCount - 1);
    }

    // Mostly hold on first anchor
    return 0;
  }

  /**
   * GLITCH: Chaotic, random frame selection weighted by audio
   */
  private glitchStyle(
    audio: AudioFeatures,
    totalFrames: number
  ): number {
    const chaos = audio.rms * this.config.intensity;

    // Higher chaos = more random jumps
    if (Math.random() < chaos) {
      return Math.floor(Math.random() * totalFrames);
    }

    // Otherwise stay on current frame
    return this.currentFrameIndex;
  }

  /**
   * PULSE: Rhythmic breathing effect, synced to BPM
   */
  private pulseStyle(
    audio: AudioFeatures,
    anchorCount: number,
    animatedCount: number,
    time: number
  ): number {
    const bpm = audio.bpm || 120;
    const beatDuration = 60 / bpm;
    const phaseInBeat = (time % beatDuration) / beatDuration;

    // Expand on first half of beat, contract on second half
    if (phaseInBeat < 0.5) {
      // Expanding: show animated frames
      const animIndex = Math.floor((phaseInBeat * 2) * animatedCount);
      return anchorCount + animIndex;
    } else {
      // Contracting: show anchor frames
      const anchorIndex = Math.floor(((phaseInBeat - 0.5) * 2) * anchorCount);
      return anchorIndex;
    }
  }

  /**
   * WAVE: Smooth cycling through all frames, speed modulated by audio
   */
  private waveStyle(
    audio: AudioFeatures,
    totalFrames: number,
    time: number
  ): number {
    // Base speed modulated by overall energy
    const speed = 0.5 + audio.rms * 2 * this.config.intensity;
    this.patternPhase = (this.patternPhase + speed * 0.01) % 1;

    const frameIndex = Math.floor(this.patternPhase * totalFrames);
    this.currentFrameIndex = frameIndex;
    return frameIndex;
  }

  /**
   * Update configuration
   */
  public setConfig(config: Partial<ChoreographyConfig>): void {
    this.config = { ...this.config, ...config };
  }

  /**
   * Get current configuration
   */
  public getConfig(): ChoreographyConfig {
    return { ...this.config };
  }

  /**
   * Reset internal state
   */
  public reset(): void {
    this.currentFrameIndex = 0;
    this.lastBeatFrame = 0;
    this.patternPhase = 0;
    this.holdCounter = 0;
  }

  /**
   * Get all available styles
   */
  public static getAvailableStyles(): ChoreographyStyle[] {
    return ['chill', 'bounce', 'strobe', 'logo-safe', 'glitch', 'pulse', 'wave'];
  }

  /**
   * Get style description for UI
   */
  public static getStyleDescription(style: ChoreographyStyle): string {
    const descriptions: Record<ChoreographyStyle, string> = {
      'chill': 'Gentle, smooth transitions on major beats',
      'bounce': 'Energetic, reactive to all beats',
      'strobe': 'Rapid changes on strong beats',
      'logo-safe': 'Subtle, professional movement',
      'glitch': 'Chaotic, fragmented aesthetic',
      'pulse': 'Rhythmic breathing effect',
      'wave': 'Smooth cycling through frames'
    };
    return descriptions[style];
  }
}
