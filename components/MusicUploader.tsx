/**
 * MusicUploader - Component for uploading and managing audio files
 * Supports drag-and-drop, file picker, and YouTube URL input
 */

import React, { useState, useRef, useCallback } from 'react';
import { MusicService, LoadedAudio } from '../services/musicService';

interface MusicUploaderProps {
  onAudioLoaded: (audio: LoadedAudio) => void;
  onError: (error: Error) => void;
}

export const MusicUploader: React.FC<MusicUploaderProps> = ({
  onAudioLoaded,
  onError
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [inputMode, setInputMode] = useState<'file' | 'url'>('file');
  const [urlInput, setUrlInput] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle file drop
  const handleDrop = useCallback(async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files);
    const audioFile = files.find(file => file.type.startsWith('audio/'));

    if (audioFile) {
      await loadAudioFile(audioFile);
    } else {
      onError(new Error('Please drop an audio file (MP3, WAV, etc.)'));
    }
  }, []);

  // Handle file selection from picker
  const handleFileSelect = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      await loadAudioFile(file);
    }
  }, []);

  // Load audio file
  const loadAudioFile = async (file: File) => {
    setIsLoading(true);
    try {
      const audio = await MusicService.loadFromFile(file);
      onAudioLoaded(audio);
    } catch (error) {
      onError(error as Error);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle URL submit (YouTube or direct audio link)
  const handleUrlSubmit = async () => {
    if (!urlInput.trim()) {
      onError(new Error('Please enter a valid URL'));
      return;
    }

    setIsLoading(true);
    try {
      if (MusicService.isYouTubeURL(urlInput)) {
        const audio = await MusicService.loadFromYouTube(urlInput);
        onAudioLoaded(audio);
      } else {
        // Try loading as direct audio URL
        onError(new Error('Direct audio URLs not yet supported. Please use file upload.'));
      }
    } catch (error) {
      onError(error as Error);
    } finally {
      setIsLoading(false);
      setUrlInput('');
    }
  };

  return (
    <div className="music-uploader">
      {/* Mode Selector */}
      <div className="mode-selector mb-4 flex gap-2">
        <button
          className={`px-4 py-2 rounded-lg transition-all ${
            inputMode === 'file'
              ? 'bg-purple-600 text-white'
              : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
          }`}
          onClick={() => setInputMode('file')}
        >
          📁 Upload File
        </button>
        <button
          className={`px-4 py-2 rounded-lg transition-all ${
            inputMode === 'url'
              ? 'bg-purple-600 text-white'
              : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
          }`}
          onClick={() => setInputMode('url')}
        >
          🔗 YouTube/URL
        </button>
      </div>

      {/* File Upload Mode */}
      {inputMode === 'file' && (
        <div
          className={`drop-zone relative border-2 border-dashed rounded-xl p-12 text-center transition-all ${
            isDragging
              ? 'border-purple-500 bg-purple-500/10 scale-105'
              : 'border-gray-600 bg-gray-800/50 hover:border-gray-500'
          }`}
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept={MusicService.getSupportedExtensions()}
            onChange={handleFileSelect}
            className="hidden"
          />

          {isLoading ? (
            <div className="flex flex-col items-center gap-4">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-500 border-t-transparent"></div>
              <p className="text-gray-400">Loading audio...</p>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-4">
              <div className="text-6xl">🎵</div>
              <div>
                <p className="text-lg font-medium text-gray-200 mb-2">
                  Drop your audio file here
                </p>
                <p className="text-sm text-gray-400 mb-4">
                  or click to browse
                </p>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors"
                >
                  Choose Audio File
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Supported: MP3, WAV, OGG, WebM, M4A, AAC (max 100MB)
              </p>
            </div>
          )}
        </div>
      )}

      {/* URL Input Mode */}
      {inputMode === 'url' && (
        <div className="url-input-zone bg-gray-800/50 border-2 border-gray-600 rounded-xl p-8">
          <div className="flex flex-col gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                YouTube URL or Direct Audio Link
              </label>
              <input
                type="url"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                placeholder="https://www.youtube.com/watch?v=..."
                className="w-full px-4 py-3 bg-gray-900 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleUrlSubmit();
                  }
                }}
              />
            </div>

            <button
              onClick={handleUrlSubmit}
              disabled={!urlInput.trim() || isLoading}
              className="px-6 py-3 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-700 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors"
            >
              {isLoading ? 'Loading...' : 'Load Audio'}
            </button>

            <p className="text-xs text-gray-500">
              ⚠️ YouTube audio extraction requires a backend service (coming soon).
              Please use file upload for now.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
