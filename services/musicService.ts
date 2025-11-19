/**
 * Music Service - Handles audio file upload, processing, and playback
 * Supports multiple input methods (file upload, YouTube URL, microphone)
 */

export interface AudioMetadata {
  title?: string;
  artist?: string;
  duration: number;      // seconds
  sampleRate?: number;
  format?: string;       // mp3, wav, etc.
  source: 'file' | 'youtube' | 'microphone';
}

export interface LoadedAudio {
  element: HTMLAudioElement;
  metadata: AudioMetadata;
  blob?: Blob;           // Original file blob
  url: string;           // Object URL for playback
}

export class MusicService {
  private static readonly SUPPORTED_FORMATS = [
    'audio/mpeg',        // MP3
    'audio/wav',         // WAV
    'audio/ogg',         // OGG
    'audio/webm',        // WebM
    'audio/mp4',         // M4A
    'audio/aac',         // AAC
  ];

  private static readonly MAX_FILE_SIZE = 100 * 1024 * 1024; // 100MB

  /**
   * Load audio from file upload
   */
  public static async loadFromFile(file: File): Promise<LoadedAudio> {
    // Validate file type
    if (!this.SUPPORTED_FORMATS.includes(file.type)) {
      throw new Error(
        `Unsupported audio format: ${file.type}. ` +
        `Supported formats: MP3, WAV, OGG, WebM, M4A, AAC`
      );
    }

    // Validate file size
    if (file.size > this.MAX_FILE_SIZE) {
      throw new Error(
        `File too large: ${(file.size / 1024 / 1024).toFixed(1)}MB. ` +
        `Maximum size: ${this.MAX_FILE_SIZE / 1024 / 1024}MB`
      );
    }

    // Create object URL for audio playback
    const url = URL.createObjectURL(file);

    // Create audio element and wait for metadata
    const element = new Audio(url);
    await this.waitForMetadata(element);

    const metadata: AudioMetadata = {
      title: file.name.replace(/\.[^/.]+$/, ''), // Remove extension
      duration: element.duration,
      format: file.type.split('/')[1],
      source: 'file'
    };

    console.log('✅ Audio loaded from file:', metadata);

    return {
      element,
      metadata,
      blob: file,
      url
    };
  }

  /**
   * Load audio from YouTube URL (stub for now)
   * In production, this would use a backend service to extract audio
   */
  public static async loadFromYouTube(url: string): Promise<LoadedAudio> {
    // TODO: Implement YouTube audio extraction
    // This requires a backend service (ytdl, yt-dlp, etc.)
    // For now, return a stub implementation

    throw new Error(
      'YouTube audio extraction not yet implemented. ' +
      'This feature requires a backend service. ' +
      'Please upload an audio file instead.'
    );

    // Future implementation would:
    // 1. Validate YouTube URL
    // 2. Call backend API to extract audio
    // 3. Stream/download audio file
    // 4. Return LoadedAudio object
  }

  /**
   * Record audio from microphone (stub for now)
   */
  public static async loadFromMicrophone(
    durationSeconds: number = 30
  ): Promise<LoadedAudio> {
    // TODO: Implement microphone recording
    // This would use MediaRecorder API

    throw new Error(
      'Microphone recording not yet implemented. ' +
      'Please upload an audio file instead.'
    );

    // Future implementation would:
    // 1. Request microphone permissions
    // 2. Use MediaRecorder to capture audio
    // 3. Convert to blob/file
    // 4. Return LoadedAudio object
  }

  /**
   * Wait for audio metadata to load
   */
  private static waitForMetadata(audio: HTMLAudioElement): Promise<void> {
    return new Promise((resolve, reject) => {
      if (audio.readyState >= 1) {
        resolve();
        return;
      }

      const timeout = setTimeout(() => {
        reject(new Error('Audio metadata load timeout'));
      }, 10000);

      audio.addEventListener('loadedmetadata', () => {
        clearTimeout(timeout);
        resolve();
      }, { once: true });

      audio.addEventListener('error', () => {
        clearTimeout(timeout);
        reject(new Error(`Audio load error: ${audio.error?.message}`));
      }, { once: true });
    });
  }

  /**
   * Validate audio duration for plan limits
   */
  public static validateDuration(
    duration: number,
    maxDuration: number = 300 // 5 minutes default
  ): boolean {
    return duration > 0 && duration <= maxDuration;
  }

  /**
   * Get suggested clip durations based on audio length
   */
  public static getSuggestedDurations(audioDuration: number): number[] {
    const suggestions: number[] = [];

    // Always offer these standard durations if they fit
    [10, 15, 20, 30].forEach(duration => {
      if (duration <= audioDuration) {
        suggestions.push(duration);
      }
    });

    // Add full duration if it's reasonable
    if (audioDuration <= 60) {
      suggestions.push(Math.floor(audioDuration));
    }

    return suggestions;
  }

  /**
   * Extract audio segment (trim to desired length)
   */
  public static async extractSegment(
    audio: LoadedAudio,
    startTime: number,
    duration: number
  ): Promise<Blob> {
    // TODO: Implement audio trimming using Web Audio API
    // For now, we'll use the full audio and let the player handle timing

    if (!audio.blob) {
      throw new Error('Original audio blob not available');
    }

    // This is a placeholder - in production, we'd use OfflineAudioContext
    // to render just the desired segment
    return audio.blob;
  }

  /**
   * Cleanup audio resources
   */
  public static cleanup(audio: LoadedAudio): void {
    if (audio.url) {
      URL.revokeObjectURL(audio.url);
    }
    if (audio.element) {
      audio.element.pause();
      audio.element.src = '';
      audio.element.load();
    }
  }

  /**
   * Format duration for display (MM:SS)
   */
  public static formatDuration(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }

  /**
   * Detect if URL is YouTube
   */
  public static isYouTubeURL(url: string): boolean {
    const patterns = [
      /^https?:\/\/(www\.)?youtube\.com\/watch\?v=/,
      /^https?:\/\/(www\.)?youtu\.be\//,
      /^https?:\/\/(www\.)?youtube\.com\/embed\//,
    ];
    return patterns.some(pattern => pattern.test(url));
  }

  /**
   * Get supported format extensions for file picker
   */
  public static getSupportedExtensions(): string {
    return '.mp3,.wav,.ogg,.webm,.m4a,.aac';
  }

  /**
   * Check browser audio support
   */
  public static checkBrowserSupport(): {
    audioContext: boolean;
    mediaRecorder: boolean;
    formats: Record<string, boolean>;
  } {
    const audio = document.createElement('audio');

    return {
      audioContext: !!(window.AudioContext || (window as any).webkitAudioContext),
      mediaRecorder: !!window.MediaRecorder,
      formats: {
        mp3: audio.canPlayType('audio/mpeg') !== '',
        wav: audio.canPlayType('audio/wav') !== '',
        ogg: audio.canPlayType('audio/ogg') !== '',
        webm: audio.canPlayType('audio/webm') !== '',
        m4a: audio.canPlayType('audio/mp4') !== '',
        aac: audio.canPlayType('audio/aac') !== '',
      }
    };
  }
}
