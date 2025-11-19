/**
 * Music Animation Orchestrator - Combines audio analysis with frame choreography
 * This is the main service that coordinates:
 * 1. Audio analysis (beat detection, frequency analysis)
 * 2. Frame generation (via existing Gemini service)
 * 3. Frame choreography (sequencing frames to music)
 * 4. Export (GIF/video with audio)
 */

import { AudioAnalyzer, AudioFeatures } from './audioAnalyzer';
import {
  FrameChoreographer,
  ChoreographyConfig,
  FrameSet,
  FrameTimeline
} from './frameChoreographer';
import { LoadedAudio } from './musicService';

export interface MusicAnimationConfig {
  // Audio
  audio: LoadedAudio;

  // Frames (generated from Gemini)
  frames: string[];              // Array of frame URLs/data URLs
  anchorFrameCount: number;      // How many frames are "anchor" (close to original)

  // Choreography
  style: ChoreographyConfig['style'];
  intensity: number;             // 0-1
  duration: number;              // Target duration in seconds
  fps: number;                   // Output frame rate
}

export interface AnimationProgress {
  stage: 'analyzing' | 'choreographing' | 'rendering' | 'complete';
  progress: number;              // 0-1
  message: string;
}

export class MusicAnimationOrchestrator {
  private analyzer: AudioAnalyzer;
  private choreographer: FrameChoreographer;
  private audioFeatures: AudioFeatures[] = [];

  constructor() {
    this.analyzer = new AudioAnalyzer();
    this.choreographer = new FrameChoreographer({
      style: 'bounce',
      intensity: 0.5,
      fps: 12,
      duration: 15
    });
  }

  /**
   * Generate music-responsive animation
   * Main orchestration method
   */
  public async generateAnimation(
    config: MusicAnimationConfig,
    onProgress?: (progress: AnimationProgress) => void
  ): Promise<FrameTimeline> {
    try {
      // Stage 1: Analyze audio
      onProgress?.({
        stage: 'analyzing',
        progress: 0.1,
        message: 'Analyzing audio features...'
      });

      await this.analyzeAudio(config.audio, config.duration);

      onProgress?.({
        stage: 'analyzing',
        progress: 0.4,
        message: `Detected ${this.audioFeatures.length} audio samples`
      });

      // Stage 2: Set up choreography
      onProgress?.({
        stage: 'choreographing',
        progress: 0.5,
        message: 'Creating choreography...'
      });

      const frameSet = this.prepareFrameSet(config.frames, config.anchorFrameCount);

      this.choreographer.setConfig({
        style: config.style,
        intensity: config.intensity,
        fps: config.fps,
        duration: config.duration
      });

      onProgress?.({
        stage: 'choreographing',
        progress: 0.7,
        message: `Sequencing ${config.frames.length} frames...`
      });

      // Stage 3: Generate timeline
      const timeline = this.choreographer.generateTimeline(
        this.audioFeatures,
        frameSet
      );

      onProgress?.({
        stage: 'complete',
        progress: 1.0,
        message: `Generated ${timeline.frameIndices.length} frame timeline`
      });

      return timeline;
    } catch (error) {
      console.error('❌ Animation generation failed:', error);
      throw error;
    }
  }

  /**
   * Analyze audio over the target duration
   * Collects audio features at regular intervals
   */
  private async analyzeAudio(
    audio: LoadedAudio,
    duration: number
  ): Promise<void> {
    // Initialize analyzer with audio element
    await this.analyzer.initialize(audio.element);

    // Calculate sample rate (features per second)
    const sampleRate = 30; // 30 samples/second = smooth analysis
    const totalSamples = Math.ceil(duration * sampleRate);

    this.audioFeatures = [];

    // Play through audio and collect features
    // Note: This is a simplified approach. In production, we'd use
    // OfflineAudioContext for faster, non-real-time analysis
    return new Promise((resolve, reject) => {
      const audioElement = audio.element;
      audioElement.currentTime = 0;

      let sampleIndex = 0;
      const sampleInterval = 1 / sampleRate;

      const analyzeFrame = () => {
        if (sampleIndex >= totalSamples || audioElement.currentTime >= duration) {
          audioElement.pause();
          audioElement.currentTime = 0;
          resolve();
          return;
        }

        // Get audio features at current time
        const features = this.analyzer.analyze(audioElement.currentTime);
        this.audioFeatures.push(features);

        sampleIndex++;
        setTimeout(analyzeFrame, sampleInterval * 1000);
      };

      // Start playback (muted) and analysis
      audioElement.volume = 0; // Mute during analysis
      audioElement.play()
        .then(() => analyzeFrame())
        .catch(reject);
    });
  }

  /**
   * Prepare frame set from generated frames
   */
  private prepareFrameSet(
    frames: string[],
    anchorFrameCount: number
  ): FrameSet {
    return {
      anchorFrames: frames.slice(0, anchorFrameCount),
      animatedFrames: frames.slice(anchorFrameCount)
    };
  }

  /**
   * Get collected audio features
   */
  public getAudioFeatures(): AudioFeatures[] {
    return this.audioFeatures;
  }

  /**
   * Get detected BPM (average across all samples)
   */
  public getAverageBPM(): number {
    if (this.audioFeatures.length === 0) return 0;

    const bpms = this.audioFeatures
      .map(f => f.bpm)
      .filter(bpm => bpm > 0);

    if (bpms.length === 0) return 0;

    return Math.round(bpms.reduce((a, b) => a + b, 0) / bpms.length);
  }

  /**
   * Get beat timestamps
   */
  public getBeatTimestamps(): number[] {
    return this.audioFeatures
      .filter(f => f.beat)
      .map(f => f.time);
  }

  /**
   * Analyze audio without generating timeline (for preview)
   */
  public async analyzeOnly(
    audio: LoadedAudio,
    duration: number,
    onProgress?: (progress: number) => void
  ): Promise<void> {
    await this.analyzer.initialize(audio.element);

    const sampleRate = 30;
    const totalSamples = Math.ceil(duration * sampleRate);

    this.audioFeatures = [];

    return new Promise((resolve, reject) => {
      const audioElement = audio.element;
      audioElement.currentTime = 0;

      let sampleIndex = 0;
      const sampleInterval = 1 / sampleRate;

      const analyzeFrame = () => {
        if (sampleIndex >= totalSamples || audioElement.currentTime >= duration) {
          audioElement.pause();
          audioElement.currentTime = 0;
          audioElement.volume = 1; // Restore volume
          resolve();
          return;
        }

        const features = this.analyzer.analyze(audioElement.currentTime);
        this.audioFeatures.push(features);

        sampleIndex++;
        onProgress?.(sampleIndex / totalSamples);

        setTimeout(analyzeFrame, sampleInterval * 1000);
      };

      audioElement.volume = 0; // Mute during analysis
      audioElement.play()
        .then(() => analyzeFrame())
        .catch(reject);
    });
  }

  /**
   * Get energy curve for visualization
   */
  public getEnergyCurve(): number[] {
    return this.audioFeatures.map(f => f.rms);
  }

  /**
   * Get bass curve for visualization
   */
  public getBassCurve(): number[] {
    return this.audioFeatures.map(f => f.bass);
  }

  /**
   * Cleanup resources
   */
  public dispose(): void {
    this.analyzer.disconnect();
    this.choreographer.reset();
    this.audioFeatures = [];
  }

  /**
   * Get analyzer instance (for real-time playback)
   */
  public getAnalyzer(): AudioAnalyzer {
    return this.analyzer;
  }

  /**
   * Get choreographer instance
   */
  public getChoreographer(): FrameChoreographer {
    return this.choreographer;
  }
}
