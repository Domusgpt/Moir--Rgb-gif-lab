/**
 * AudioPlayer - Audio playback controls with waveform visualization
 * Shows loaded audio with play/pause, scrubbing, and real-time analysis
 */

import React, { useState, useEffect, useRef } from 'react';
import { LoadedAudio } from '../services/musicService';
import { AudioAnalyzer, AudioFeatures } from '../services/audioAnalyzer';
import { MusicService } from '../services/musicService';

interface AudioPlayerProps {
  audio: LoadedAudio;
  analyzer?: AudioAnalyzer;
  onRemove?: () => void;
  showAnalysis?: boolean;
}

export const AudioPlayer: React.FC<AudioPlayerProps> = ({
  audio,
  analyzer,
  onRemove,
  showAnalysis = false
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(1);
  const [features, setFeatures] = useState<AudioFeatures | null>(null);
  const animationFrameRef = useRef<number>();

  useEffect(() => {
    const audioElement = audio.element;

    // Set up event listeners
    const handleTimeUpdate = () => {
      setCurrentTime(audioElement.currentTime);
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
    };

    audioElement.addEventListener('timeupdate', handleTimeUpdate);
    audioElement.addEventListener('ended', handleEnded);

    return () => {
      audioElement.removeEventListener('timeupdate', handleTimeUpdate);
      audioElement.removeEventListener('ended', handleEnded);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [audio]);

  // Update audio features if analyzer is provided
  useEffect(() => {
    if (!analyzer || !showAnalysis) return;

    const updateFeatures = () => {
      const audioFeatures = analyzer.analyze(currentTime);
      setFeatures(audioFeatures);
      animationFrameRef.current = requestAnimationFrame(updateFeatures);
    };

    if (isPlaying) {
      updateFeatures();
    } else if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [analyzer, isPlaying, currentTime, showAnalysis]);

  const togglePlayPause = () => {
    if (isPlaying) {
      audio.element.pause();
    } else {
      audio.element.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    audio.element.currentTime = time;
    setCurrentTime(time);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const vol = parseFloat(e.target.value);
    audio.element.volume = vol;
    setVolume(vol);
  };

  const progress = (currentTime / audio.metadata.duration) * 100;

  return (
    <div className="audio-player bg-gray-800 border border-gray-700 rounded-xl p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center text-2xl">
            🎵
          </div>
          <div>
            <h3 className="text-lg font-medium text-white">
              {audio.metadata.title || 'Untitled'}
            </h3>
            <p className="text-sm text-gray-400">
              {MusicService.formatDuration(audio.metadata.duration)}
              {audio.metadata.format && ` • ${audio.metadata.format.toUpperCase()}`}
            </p>
          </div>
        </div>
        {onRemove && (
          <button
            onClick={onRemove}
            className="px-3 py-2 text-gray-400 hover:text-red-400 transition-colors"
            title="Remove audio"
          >
            ✕
          </button>
        )}
      </div>

      {/* Waveform / Progress Bar */}
      <div className="mb-4">
        <div className="relative h-2 bg-gray-700 rounded-full overflow-hidden">
          <div
            className="absolute top-0 left-0 h-full bg-gradient-to-r from-purple-600 to-pink-600 transition-all"
            style={{ width: `${progress}%` }}
          />
          <input
            type="range"
            min="0"
            max={audio.metadata.duration}
            step="0.1"
            value={currentTime}
            onChange={handleSeek}
            className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
          />
        </div>
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>{MusicService.formatDuration(currentTime)}</span>
          <span>{MusicService.formatDuration(audio.metadata.duration)}</span>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-4">
        {/* Play/Pause */}
        <button
          onClick={togglePlayPause}
          className="w-12 h-12 bg-purple-600 hover:bg-purple-700 rounded-full flex items-center justify-center text-white text-xl transition-colors"
        >
          {isPlaying ? '⏸' : '▶'}
        </button>

        {/* Volume */}
        <div className="flex items-center gap-2 flex-1">
          <span className="text-gray-400">{volume === 0 ? '🔇' : '🔊'}</span>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={volume}
            onChange={handleVolumeChange}
            className="flex-1 h-2 bg-gray-700 rounded-full appearance-none cursor-pointer
                     [&::-webkit-slider-thumb]:appearance-none
                     [&::-webkit-slider-thumb]:w-4
                     [&::-webkit-slider-thumb]:h-4
                     [&::-webkit-slider-thumb]:bg-purple-600
                     [&::-webkit-slider-thumb]:rounded-full
                     [&::-webkit-slider-thumb]:cursor-pointer"
          />
        </div>
      </div>

      {/* Audio Analysis Display */}
      {showAnalysis && features && (
        <div className="mt-6 pt-6 border-t border-gray-700">
          <h4 className="text-sm font-medium text-gray-300 mb-3">Audio Analysis</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {/* Bass */}
            <div>
              <div className="text-xs text-gray-400 mb-1">Bass</div>
              <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-500 transition-all duration-100"
                  style={{ width: `${features.bass * 100}%` }}
                />
              </div>
            </div>

            {/* Mid */}
            <div>
              <div className="text-xs text-gray-400 mb-1">Mid</div>
              <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-green-500 transition-all duration-100"
                  style={{ width: `${features.mid * 100}%` }}
                />
              </div>
            </div>

            {/* High */}
            <div>
              <div className="text-xs text-gray-400 mb-1">High</div>
              <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-yellow-500 transition-all duration-100"
                  style={{ width: `${features.high * 100}%` }}
                />
              </div>
            </div>

            {/* Energy */}
            <div>
              <div className="text-xs text-gray-400 mb-1">
                Energy {features.beat && '🔴'}
              </div>
              <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-100 ${
                    features.beat ? 'bg-red-500' : 'bg-purple-500'
                  }`}
                  style={{ width: `${features.rms * 100}%` }}
                />
              </div>
            </div>
          </div>

          {/* BPM Display */}
          {features.bpm > 0 && (
            <div className="mt-3 text-center">
              <span className="text-xs text-gray-400">BPM: </span>
              <span className="text-sm font-mono text-purple-400">{features.bpm}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
