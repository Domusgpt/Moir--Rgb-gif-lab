/**
 * Video Export Service - Export music-responsive animations with audio
 * Uses MediaRecorder API to capture canvas + audio into MP4/WebM
 */

import { FrameTimeline } from './frameChoreographer';
import { LoadedAudio } from './musicService';

export type VideoFormat = 'webm' | 'mp4';
export type VideoQuality = 'low' | 'medium' | 'high' | 'ultra';

export interface VideoExportOptions {
  format: VideoFormat;
  quality: VideoQuality;
  fps: number;              // Target frame rate (12, 24, 30, 60)
  includeAudio: boolean;    // Whether to include audio track
  videoBitrate?: number;    // Optional video bitrate in bps
  audioBitrate?: number;    // Optional audio bitrate in bps
}

export interface VideoExportProgress {
  stage: 'preparing' | 'rendering' | 'encoding' | 'complete';
  progress: number;         // 0-1
  currentFrame?: number;
  totalFrames?: number;
  message: string;
}

interface QualityPreset {
  videoBitrate: number;     // bits per second
  audioBitrate: number;     // bits per second
  width: number;
  height: number;
}

export class VideoExportService {
  private static readonly QUALITY_PRESETS: Record<VideoQuality, QualityPreset> = {
    'low': {
      videoBitrate: 1_000_000,    // 1 Mbps
      audioBitrate: 96_000,       // 96 kbps
      width: 480,
      height: 480
    },
    'medium': {
      videoBitrate: 2_500_000,    // 2.5 Mbps
      audioBitrate: 128_000,      // 128 kbps
      width: 720,
      height: 720
    },
    'high': {
      videoBitrate: 5_000_000,    // 5 Mbps
      audioBitrate: 192_000,      // 192 kbps
      width: 1080,
      height: 1080
    },
    'ultra': {
      videoBitrate: 10_000_000,   // 10 Mbps
      audioBitrate: 256_000,      // 256 kbps
      width: 1920,
      height: 1920
    }
  };

  /**
   * Export music-responsive animation as video with audio
   */
  public static async exportVideo(
    timeline: FrameTimeline,
    audio: LoadedAudio,
    options: VideoExportOptions,
    onProgress?: (progress: VideoExportProgress) => void
  ): Promise<Blob> {
    try {
      onProgress?.({
        stage: 'preparing',
        progress: 0.1,
        message: 'Preparing video export...'
      });

      // Get quality preset
      const preset = this.QUALITY_PRESETS[options.quality];
      const videoBitrate = options.videoBitrate || preset.videoBitrate;
      const audioBitrate = options.audioBitrate || preset.audioBitrate;

      // Create canvas for rendering
      const canvas = document.createElement('canvas');
      canvas.width = preset.width;
      canvas.height = preset.height;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        throw new Error('Could not get canvas context');
      }

      // Load all frames
      onProgress?.({
        stage: 'preparing',
        progress: 0.2,
        message: 'Loading frames...'
      });

      const allFrames = [
        ...timeline.frameSet.anchorFrames,
        ...timeline.frameSet.animatedFrames
      ];

      const loadedFrames = await this.loadFrameImages(allFrames);

      // Determine MIME type based on format and browser support
      const mimeType = this.getMimeType(options.format);

      if (!MediaRecorder.isTypeSupported(mimeType)) {
        throw new Error(`Format ${options.format} not supported by browser. Try WebM instead.`);
      }

      onProgress?.({
        stage: 'rendering',
        progress: 0.3,
        message: 'Starting video recording...'
      });

      // Create MediaRecorder with canvas stream
      const canvasStream = canvas.captureStream(options.fps);

      // Add audio track if requested
      if (options.includeAudio && audio.element.srcObject === null) {
        // Create audio context and stream
        const audioContext = new AudioContext();
        const audioSource = audioContext.createMediaElementSource(audio.element);
        const destination = audioContext.createMediaStreamDestination();
        audioSource.connect(destination);
        audioSource.connect(audioContext.destination); // Also play to speakers

        // Add audio track to canvas stream
        destination.stream.getAudioTracks().forEach(track => {
          canvasStream.addTrack(track);
        });
      }

      const recorder = new MediaRecorder(canvasStream, {
        mimeType,
        videoBitsPerSecond: videoBitrate,
        audioBitsPerSecond: options.includeAudio ? audioBitrate : undefined
      });

      const chunks: Blob[] = [];

      return new Promise((resolve, reject) => {
        recorder.ondataavailable = (event) => {
          if (event.data.size > 0) {
            chunks.push(event.data);
          }
        };

        recorder.onstop = () => {
          onProgress?.({
            stage: 'encoding',
            progress: 0.95,
            message: 'Finalizing video...'
          });

          const videoBlob = new Blob(chunks, { type: mimeType });

          onProgress?.({
            stage: 'complete',
            progress: 1.0,
            message: 'Video export complete!'
          });

          resolve(videoBlob);
        };

        recorder.onerror = (event) => {
          reject(new Error(`MediaRecorder error: ${event}`));
        };

        // Start recording
        recorder.start(100); // Collect data every 100ms

        // Render frames and sync with audio
        this.renderFrames(
          canvas,
          ctx,
          timeline,
          loadedFrames,
          audio,
          options.fps,
          (frameProgress) => {
            onProgress?.({
              stage: 'rendering',
              progress: 0.3 + (frameProgress * 0.6), // 30% to 90%
              currentFrame: Math.floor(frameProgress * timeline.frameIndices.length),
              totalFrames: timeline.frameIndices.length,
              message: `Rendering frame ${Math.floor(frameProgress * timeline.frameIndices.length)} / ${timeline.frameIndices.length}`
            });
          }
        ).then(() => {
          // Stop recording when rendering complete
          recorder.stop();

          // Stop canvas stream
          canvasStream.getTracks().forEach(track => track.stop());
        }).catch(reject);
      });
    } catch (error) {
      console.error('❌ Video export failed:', error);
      throw error;
    }
  }

  /**
   * Load all frame images
   */
  private static loadFrameImages(frameUrls: string[]): Promise<HTMLImageElement[]> {
    return Promise.all(
      frameUrls.map(url => {
        return new Promise<HTMLImageElement>((resolve, reject) => {
          const img = new Image();
          img.onload = () => resolve(img);
          img.onerror = () => reject(new Error(`Failed to load frame: ${url}`));
          img.src = url;
        });
      })
    );
  }

  /**
   * Render all frames to canvas synchronized with audio
   */
  private static async renderFrames(
    canvas: HTMLCanvasElement,
    ctx: CanvasRenderingContext2D,
    timeline: FrameTimeline,
    loadedFrames: HTMLImageElement[],
    audio: LoadedAudio,
    fps: number,
    onProgress: (progress: number) => void
  ): Promise<void> {
    const totalFrames = timeline.frameIndices.length;
    const frameDuration = 1000 / fps; // milliseconds per frame

    // Reset audio to start
    audio.element.currentTime = 0;

    return new Promise((resolve, reject) => {
      let currentFrameIndex = 0;
      let startTime = performance.now();

      // Start audio playback
      audio.element.play().catch(reject);

      const renderNextFrame = () => {
        if (currentFrameIndex >= totalFrames) {
          // Rendering complete
          audio.element.pause();
          audio.element.currentTime = 0;
          onProgress(1.0);
          resolve();
          return;
        }

        // Get the frame to render
        const frameIndexInSet = timeline.frameIndices[currentFrameIndex];
        const frame = loadedFrames[frameIndexInSet];

        if (!frame) {
          reject(new Error(`Frame ${frameIndexInSet} not found`));
          return;
        }

        // Clear canvas and draw frame (centered, fit to canvas)
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Calculate scaling to fit frame in canvas while maintaining aspect ratio
        const scale = Math.min(
          canvas.width / frame.width,
          canvas.height / frame.height
        );

        const scaledWidth = frame.width * scale;
        const scaledHeight = frame.height * scale;
        const x = (canvas.width - scaledWidth) / 2;
        const y = (canvas.height - scaledHeight) / 2;

        ctx.drawImage(frame, x, y, scaledWidth, scaledHeight);

        // Update progress
        onProgress(currentFrameIndex / totalFrames);

        currentFrameIndex++;

        // Schedule next frame
        const elapsedTime = performance.now() - startTime;
        const expectedTime = currentFrameIndex * frameDuration;
        const delay = Math.max(0, expectedTime - elapsedTime);

        setTimeout(renderNextFrame, delay);
      };

      // Start rendering
      renderNextFrame();
    });
  }

  /**
   * Get MIME type for video format
   */
  private static getMimeType(format: VideoFormat): string {
    switch (format) {
      case 'webm':
        // Try VP9 first, fall back to VP8
        if (MediaRecorder.isTypeSupported('video/webm;codecs=vp9')) {
          return 'video/webm;codecs=vp9';
        }
        return 'video/webm;codecs=vp8';

      case 'mp4':
        // H.264 codec for MP4
        if (MediaRecorder.isTypeSupported('video/mp4;codecs=h264')) {
          return 'video/mp4;codecs=h264';
        }
        // Fall back to basic MP4
        return 'video/mp4';

      default:
        return 'video/webm';
    }
  }

  /**
   * Check browser support for video export
   */
  public static checkSupport(): {
    supported: boolean;
    formats: {
      webm: boolean;
      mp4: boolean;
    };
    codecs: string[];
  } {
    const supported = !!(window.MediaRecorder && HTMLCanvasElement.prototype.captureStream);

    const codecs = [
      'video/webm;codecs=vp9',
      'video/webm;codecs=vp8',
      'video/webm',
      'video/mp4;codecs=h264',
      'video/mp4'
    ].filter(codec => MediaRecorder.isTypeSupported(codec));

    return {
      supported,
      formats: {
        webm: codecs.some(c => c.includes('webm')),
        mp4: codecs.some(c => c.includes('mp4'))
      },
      codecs
    };
  }

  /**
   * Get recommended format for current browser
   */
  public static getRecommendedFormat(): VideoFormat {
    const support = this.checkSupport();

    // Prefer WebM as it has better browser support
    if (support.formats.webm) {
      return 'webm';
    }

    if (support.formats.mp4) {
      return 'mp4';
    }

    // Default to WebM (will show error if not supported)
    return 'webm';
  }

  /**
   * Estimate file size based on options
   */
  public static estimateFileSize(
    durationSeconds: number,
    options: VideoExportOptions
  ): number {
    const preset = this.QUALITY_PRESETS[options.quality];
    const videoBitrate = options.videoBitrate || preset.videoBitrate;
    const audioBitrate = options.includeAudio
      ? (options.audioBitrate || preset.audioBitrate)
      : 0;

    const totalBitrate = videoBitrate + audioBitrate;

    // Convert bits per second to bytes, multiply by duration
    // Add 10% overhead for container format
    const estimatedBytes = (totalBitrate / 8) * durationSeconds * 1.1;

    return Math.ceil(estimatedBytes);
  }

  /**
   * Format file size for display
   */
  public static formatFileSize(bytes: number): string {
    if (bytes < 1024) {
      return `${bytes} B`;
    } else if (bytes < 1024 * 1024) {
      return `${(bytes / 1024).toFixed(1)} KB`;
    } else if (bytes < 1024 * 1024 * 1024) {
      return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    } else {
      return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`;
    }
  }

  /**
   * Download video blob as file
   */
  public static downloadVideo(blob: Blob, filename: string): void {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }
}
