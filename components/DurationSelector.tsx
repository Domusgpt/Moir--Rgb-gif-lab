/**
 * DurationSelector - Component for selecting output animation duration
 */

import React from 'react';
import { MusicService } from '../services/musicService';

interface DurationSelectorProps {
  selectedDuration: number;
  audioDuration?: number;
  onDurationChange: (duration: number) => void;
  suggestedDurations?: number[];
}

export const DurationSelector: React.FC<DurationSelectorProps> = ({
  selectedDuration,
  audioDuration,
  onDurationChange,
  suggestedDurations
}) => {
  // Default suggested durations if not provided
  const durations = suggestedDurations || (
    audioDuration
      ? MusicService.getSuggestedDurations(audioDuration)
      : [10, 15, 20, 30]
  );

  return (
    <div className="duration-selector">
      {/* Header */}
      <div className="mb-4">
        <h3 className="text-lg font-medium text-white mb-2">
          Clip Duration
        </h3>
        <p className="text-sm text-gray-400">
          Choose how long your animation should be
          {audioDuration && ` (audio is ${MusicService.formatDuration(audioDuration)})`}
        </p>
      </div>

      {/* Duration Presets */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        {durations.map((duration) => {
          const isSelected = selectedDuration === duration;
          const isFullSong = audioDuration && Math.abs(duration - audioDuration) < 1;

          return (
            <button
              key={duration}
              onClick={() => onDurationChange(duration)}
              className={`
                relative p-4 rounded-xl border-2 transition-all
                ${isSelected
                  ? 'border-purple-500 bg-purple-500/20 scale-105'
                  : 'border-gray-700 bg-gray-800/50 hover:border-gray-600 hover:bg-gray-800'
                }
              `}
            >
              {/* Duration */}
              <div className="text-2xl font-bold text-white mb-1">
                {duration}s
              </div>

              {/* Label */}
              <div className="text-xs text-gray-400">
                {isFullSong ? '🎵 Full Song' : duration <= 10 ? 'Quick' : duration <= 20 ? 'Medium' : 'Long'}
              </div>

              {/* Selection indicator */}
              {isSelected && (
                <div className="absolute top-2 right-2 w-3 h-3 bg-purple-500 rounded-full" />
              )}
            </button>
          );
        })}
      </div>

      {/* Custom Duration Slider */}
      <div className="mb-6 p-4 bg-gray-800/50 border border-gray-700 rounded-lg">
        <div className="flex items-center justify-between mb-3">
          <label className="text-sm font-medium text-gray-300">
            Custom Duration
          </label>
          <span className="text-sm font-mono text-purple-400">
            {selectedDuration}s ({MusicService.formatDuration(selectedDuration)})
          </span>
        </div>

        <input
          type="range"
          min="5"
          max={audioDuration ? Math.min(audioDuration, 60) : 60}
          step="1"
          value={selectedDuration}
          onChange={(e) => onDurationChange(parseInt(e.target.value))}
          className="w-full h-3 bg-gray-700 rounded-full appearance-none cursor-pointer
                   [&::-webkit-slider-thumb]:appearance-none
                   [&::-webkit-slider-thumb]:w-6
                   [&::-webkit-slider-thumb]:h-6
                   [&::-webkit-slider-thumb]:bg-gradient-to-r
                   [&::-webkit-slider-thumb]:from-purple-500
                   [&::-webkit-slider-thumb]:to-pink-500
                   [&::-webkit-slider-thumb]:rounded-full
                   [&::-webkit-slider-thumb]:cursor-pointer
                   [&::-webkit-slider-thumb]:shadow-lg"
        />

        <div className="flex justify-between text-xs text-gray-500 mt-2">
          <span>5s</span>
          <span>{audioDuration ? `${Math.round(Math.min(audioDuration, 60))}s` : '60s'}</span>
        </div>
      </div>

      {/* Info Messages */}
      <div className="space-y-2">
        {/* Frame budget info */}
        <div className="flex items-start gap-2 text-xs text-gray-400 p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg">
          <span className="text-blue-400">ℹ️</span>
          <p>
            Shorter clips (10-15s) work best for social media and loops.
            Longer clips use more generation credits.
          </p>
        </div>

        {/* Audio length warning */}
        {audioDuration && selectedDuration > audioDuration && (
          <div className="flex items-start gap-2 text-xs text-yellow-400 p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
            <span>⚠️</span>
            <p>
              Selected duration is longer than your audio ({MusicService.formatDuration(audioDuration)}).
              The audio will loop to fill the duration.
            </p>
          </div>
        )}

        {/* Pro tier message for long clips */}
        {selectedDuration > 30 && (
          <div className="flex items-start gap-2 text-xs text-purple-400 p-3 bg-purple-500/10 border border-purple-500/30 rounded-lg">
            <span>⭐</span>
            <p>
              Clips longer than 30s are available on Pro tier.
              Free tier is limited to 30s.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
