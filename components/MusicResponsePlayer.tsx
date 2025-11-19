/**
 * MusicResponsePlayer - Preview music-responsive animations
 * Shows animated frames synchronized with audio playback
 */

import React, { useState, useEffect, useRef } from 'react';
import { LoadedAudio } from '../services/musicService';
import { FrameTimeline } from '../services/frameChoreographer';
import { AudioAnalyzer, AudioFeatures } from '../services/audioAnalyzer';

interface MusicResponsePlayerProps {
  audio: LoadedAudio;
  timeline: FrameTimeline;
  analyzer?: AudioAnalyzer;
  showAnalysis?: boolean;
}

export const MusicResponsePlayer: React.FC<MusicResponsePlayerProps> = ({
  audio,
  timeline,
  analyzer,
  showAnalysis = false
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [currentFrameIndex, setCurrentFrameIndex] = useState(0);
  const [features, setFeatures] = useState<AudioFeatures | null>(null);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number>();

  // Get current frame URL based on timeline
  const currentFrame = timeline.frameSet.anchorFrames.concat(
    timeline.frameSet.animatedFrames
  )[timeline.frameIndices[currentFrameIndex]] || timeline.frameSet.anchorFrames[0];

  // Update frame index based on playback time
  useEffect(() => {
    const frameIndex = Math.floor(currentTime * timeline.fps);
    const clampedIndex = Math.min(frameIndex, timeline.frameIndices.length - 1);
    setCurrentFrameIndex(Math.max(0, clampedIndex));
  }, [currentTime, timeline.fps, timeline.frameIndices.length]);

  // Render current frame to canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !currentFrame) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new Image();
    img.onload = () => {
      // Set canvas size to match image
      canvas.width = img.width;
      canvas.height = img.height;

      // Draw frame
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);
    };
    img.src = currentFrame;
  }, [currentFrame]);

  // Audio time update loop
  useEffect(() => {
    const audioElement = audio.element;

    const updateLoop = () => {
      if (isPlaying) {
        setCurrentTime(audioElement.currentTime);

        // Update audio features if analyzer available
        if (analyzer && showAnalysis) {
          const audioFeatures = analyzer.analyze(audioElement.currentTime);
          setFeatures(audioFeatures);
        }

        animationFrameRef.current = requestAnimationFrame(updateLoop);
      }
    };

    if (isPlaying) {
      updateLoop();
    }

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isPlaying, audio, analyzer, showAnalysis]);

  // Handle audio ended
  useEffect(() => {
    const audioElement = audio.element;

    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
      setCurrentFrameIndex(0);
    };

    audioElement.addEventListener('ended', handleEnded);

    return () => {
      audioElement.removeEventListener('ended', handleEnded);
    };
  }, [audio]);

  const togglePlayPause = () => {
    if (isPlaying) {
      audio.element.pause();
    } else {
      audio.element.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleSeek = (time: number) => {
    audio.element.currentTime = time;
    setCurrentTime(time);
  };

  const progress = (currentTime / timeline.duration) * 100;

  return (
    <div className="music-response-player bg-gray-900 border border-gray-700 rounded-xl overflow-hidden">
      {/* Canvas Display */}
      <div className="relative bg-black aspect-square flex items-center justify-center">
        <canvas
          ref={canvasRef}
          className="max-w-full max-h-full object-contain"
        />

        {/* Play overlay */}
        {!isPlaying && (
          <button
            onClick={togglePlayPause}
            className="absolute inset-0 flex items-center justify-center bg-black/50 hover:bg-black/70 transition-all cursor-pointer"
          >
            <div className="w-20 h-20 bg-purple-600 rounded-full flex items-center justify-center text-white text-4xl">
              ▶
            </div>
          </button>
        )}

        {/* Frame counter */}
        <div className="absolute top-4 right-4 px-3 py-1 bg-black/70 rounded-lg text-white text-sm font-mono">
          Frame {currentFrameIndex + 1} / {timeline.frameIndices.length}
        </div>

        {/* Beat indicator */}
        {showAnalysis && features?.beat && (
          <div className="absolute top-4 left-4 w-8 h-8 bg-red-500 rounded-full animate-ping" />
        )}
      </div>

      {/* Controls */}
      <div className="p-4 space-y-4">
        {/* Progress bar */}
        <div>
          <div className="relative h-2 bg-gray-700 rounded-full overflow-hidden cursor-pointer"
            onClick={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const x = e.clientX - rect.left;
              const percent = x / rect.width;
              handleSeek(percent * timeline.duration);
            }}
          >
            <div
              className="absolute top-0 left-0 h-full bg-gradient-to-r from-purple-600 to-pink-600"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>{currentTime.toFixed(1)}s</span>
            <span>{timeline.duration}s</span>
          </div>
        </div>

        {/* Play/Pause */}
        <div className="flex items-center justify-center gap-4">
          <button
            onClick={togglePlayPause}
            className="w-14 h-14 bg-purple-600 hover:bg-purple-700 rounded-full flex items-center justify-center text-white text-2xl transition-colors"
          >
            {isPlaying ? '⏸' : '▶'}
          </button>
        </div>

        {/* Audio Analysis Visualization */}
        {showAnalysis && features && (
          <div className="pt-4 border-t border-gray-700">
            <div className="grid grid-cols-3 gap-2">
              <div>
                <div className="text-xs text-gray-400 mb-1">Bass</div>
                <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-500 transition-all duration-100"
                    style={{ width: `${features.bass * 100}%` }}
                  />
                </div>
              </div>
              <div>
                <div className="text-xs text-gray-400 mb-1">Mid</div>
                <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-green-500 transition-all duration-100"
                    style={{ width: `${features.mid * 100}%` }}
                  />
                </div>
              </div>
              <div>
                <div className="text-xs text-gray-400 mb-1">High</div>
                <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-yellow-500 transition-all duration-100"
                    style={{ width: `${features.high * 100}%` }}
                  />
                </div>
              </div>
            </div>
            {features.bpm > 0 && (
              <div className="text-center text-xs text-gray-400 mt-2">
                BPM: <span className="text-purple-400 font-mono">{features.bpm}</span>
              </div>
            )}
          </div>
        )}

        {/* Timeline info */}
        <div className="text-xs text-gray-500 text-center">
          {timeline.fps} FPS • {timeline.frameSet.anchorFrames.length} anchor +{' '}
          {timeline.frameSet.animatedFrames.length} animated frames
        </div>
      </div>
    </div>
  );
};
