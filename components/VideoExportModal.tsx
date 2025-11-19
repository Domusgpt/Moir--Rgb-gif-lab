/**
 * VideoExportModal - UI for exporting music-responsive animations as video
 * Supports format selection, quality options, and progress tracking
 */

import React, { useState, useEffect } from 'react';
import { FrameTimeline } from '../services/frameChoreographer';
import { LoadedAudio } from '../services/musicService';
import {
  VideoExportService,
  VideoFormat,
  VideoQuality,
  VideoExportOptions,
  VideoExportProgress
} from '../services/videoExportService';

interface VideoExportModalProps {
  timeline: FrameTimeline;
  audio: LoadedAudio;
  projectName?: string;
  onClose: () => void;
}

const QUALITY_DESCRIPTIONS: Record<VideoQuality, string> = {
  'low': '480p - Small file size, good for previews',
  'medium': '720p - Balanced quality and size',
  'high': '1080p - High quality, recommended',
  'ultra': '1920p - Maximum quality, large file'
};

const QUALITY_ICONS: Record<VideoQuality, string> = {
  'low': '📱',
  'medium': '💻',
  'high': '🎬',
  'ultra': '🎥'
};

export const VideoExportModal: React.FC<VideoExportModalProps> = ({
  timeline,
  audio,
  projectName = 'animation',
  onClose
}) => {
  const [format, setFormat] = useState<VideoFormat>('webm');
  const [quality, setQuality] = useState<VideoQuality>('high');
  const [fps, setFps] = useState<number>(30);
  const [includeAudio, setIncludeAudio] = useState<boolean>(true);

  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState<VideoExportProgress | null>(null);
  const [exportedBlob, setExportedBlob] = useState<Blob | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Check browser support
  const [browserSupport, setBrowserSupport] = useState(
    VideoExportService.checkSupport()
  );

  useEffect(() => {
    const support = VideoExportService.checkSupport();
    setBrowserSupport(support);

    // Set recommended format
    if (!support.formats[format]) {
      setFormat(VideoExportService.getRecommendedFormat());
    }
  }, []);

  const estimatedSize = VideoExportService.estimateFileSize(timeline.duration, {
    format,
    quality,
    fps,
    includeAudio
  });

  const handleExport = async () => {
    setIsExporting(true);
    setError(null);
    setExportedBlob(null);

    try {
      const options: VideoExportOptions = {
        format,
        quality,
        fps,
        includeAudio
      };

      const blob = await VideoExportService.exportVideo(
        timeline,
        audio,
        options,
        setExportProgress
      );

      setExportedBlob(blob);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setIsExporting(false);
    }
  };

  const handleDownload = () => {
    if (!exportedBlob) return;

    const extension = format === 'webm' ? 'webm' : 'mp4';
    const filename = `${projectName}_music_responsive.${extension}`;

    VideoExportService.downloadVideo(exportedBlob, filename);
  };

  if (!browserSupport.supported) {
    return (
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div className="bg-gray-900 border border-gray-700 rounded-xl p-6 max-w-md">
          <h2 className="text-xl font-bold text-white mb-4">
            ❌ Video Export Not Supported
          </h2>
          <p className="text-gray-400 mb-4">
            Your browser doesn't support video export with MediaRecorder API.
            Please try Chrome, Firefox, or Edge.
          </p>
          <button
            onClick={onClose}
            className="w-full px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gray-900 border border-gray-700 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gray-900 border-b border-gray-700 p-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-white">
            🎬 Export Video with Audio
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            ✕
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Format Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-3">
              Video Format
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setFormat('webm')}
                disabled={!browserSupport.formats.webm}
                className={`p-4 rounded-lg border-2 transition-all ${
                  format === 'webm'
                    ? 'border-purple-500 bg-purple-500/20'
                    : 'border-gray-700 bg-gray-800 hover:border-gray-600'
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                <div className="text-lg font-semibold text-white mb-1">WebM</div>
                <div className="text-xs text-gray-400">
                  {browserSupport.formats.webm
                    ? 'Better compression, wide support'
                    : 'Not supported in your browser'}
                </div>
              </button>

              <button
                onClick={() => setFormat('mp4')}
                disabled={!browserSupport.formats.mp4}
                className={`p-4 rounded-lg border-2 transition-all ${
                  format === 'mp4'
                    ? 'border-purple-500 bg-purple-500/20'
                    : 'border-gray-700 bg-gray-800 hover:border-gray-600'
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                <div className="text-lg font-semibold text-white mb-1">MP4</div>
                <div className="text-xs text-gray-400">
                  {browserSupport.formats.mp4
                    ? 'Universal compatibility'
                    : 'Not supported in your browser'}
                </div>
              </button>
            </div>
          </div>

          {/* Quality Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-3">
              Quality
            </label>
            <div className="grid grid-cols-2 gap-3">
              {(['low', 'medium', 'high', 'ultra'] as VideoQuality[]).map((q) => (
                <button
                  key={q}
                  onClick={() => setQuality(q)}
                  className={`p-3 rounded-lg border-2 transition-all ${
                    quality === q
                      ? 'border-purple-500 bg-purple-500/20'
                      : 'border-gray-700 bg-gray-800 hover:border-gray-600'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-lg">{QUALITY_ICONS[q]}</span>
                    <span className="font-semibold text-white capitalize">{q}</span>
                  </div>
                  <div className="text-xs text-gray-400">
                    {QUALITY_DESCRIPTIONS[q]}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* FPS Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Frame Rate: {fps} FPS
            </label>
            <input
              type="range"
              min="12"
              max="60"
              step="6"
              value={fps}
              onChange={(e) => setFps(parseInt(e.target.value))}
              className="w-full h-2 bg-gray-700 rounded-full appearance-none cursor-pointer
                       [&::-webkit-slider-thumb]:appearance-none
                       [&::-webkit-slider-thumb]:w-4
                       [&::-webkit-slider-thumb]:h-4
                       [&::-webkit-slider-thumb]:bg-purple-500
                       [&::-webkit-slider-thumb]:rounded-full"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>12 FPS (Smooth)</span>
              <span>60 FPS (Buttery)</span>
            </div>
          </div>

          {/* Audio Toggle */}
          <div className="flex items-center justify-between p-4 bg-gray-800 rounded-lg">
            <div>
              <div className="font-medium text-white">Include Audio Track</div>
              <div className="text-xs text-gray-400">
                Export with synchronized music
              </div>
            </div>
            <button
              onClick={() => setIncludeAudio(!includeAudio)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                includeAudio ? 'bg-purple-600' : 'bg-gray-600'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  includeAudio ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          {/* File Info */}
          <div className="p-4 bg-gray-800/50 border border-gray-700 rounded-lg space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Duration:</span>
              <span className="text-white font-mono">{timeline.duration}s</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Total Frames:</span>
              <span className="text-white font-mono">{timeline.frameIndices.length}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Estimated Size:</span>
              <span className="text-white font-mono">
                ~{VideoExportService.formatFileSize(estimatedSize)}
              </span>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
              <div className="text-red-400 text-sm">{error}</div>
            </div>
          )}

          {/* Export Progress */}
          {isExporting && exportProgress && (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-400">{exportProgress.message}</span>
                <span className="text-purple-400 font-mono">
                  {Math.round(exportProgress.progress * 100)}%
                </span>
              </div>
              <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-purple-600 to-pink-600 transition-all duration-300"
                  style={{ width: `${exportProgress.progress * 100}%` }}
                />
              </div>
              {exportProgress.currentFrame !== undefined && (
                <div className="text-xs text-gray-500 text-center">
                  Frame {exportProgress.currentFrame} / {exportProgress.totalFrames}
                </div>
              )}
            </div>
          )}

          {/* Success Message */}
          {exportedBlob && (
            <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
              <div className="text-green-400 text-sm mb-2">
                ✅ Video exported successfully!
              </div>
              <div className="text-xs text-gray-400">
                Size: {VideoExportService.formatFileSize(exportedBlob.size)}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3">
            {!exportedBlob ? (
              <>
                <button
                  onClick={onClose}
                  disabled={isExporting}
                  className="flex-1 px-4 py-3 bg-gray-700 hover:bg-gray-600 disabled:bg-gray-800 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleExport}
                  disabled={isExporting}
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:from-gray-700 disabled:to-gray-700 text-white font-semibold rounded-lg transition-all"
                >
                  {isExporting ? '⏳ Exporting...' : '🎬 Export Video'}
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => {
                    setExportedBlob(null);
                    setExportProgress(null);
                  }}
                  className="flex-1 px-4 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
                >
                  Export Again
                </button>
                <button
                  onClick={handleDownload}
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold rounded-lg transition-all"
                >
                  💾 Download Video
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
