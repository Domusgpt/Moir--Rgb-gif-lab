/**
 * ChoreographyStyleSelector - UI for selecting music-responsive animation styles
 */

import React from 'react';
import { ChoreographyStyle } from '../types';
import { FrameChoreographer } from '../services/frameChoreographer';

interface ChoreographyStyleSelectorProps {
  selectedStyle: ChoreographyStyle;
  intensity: number;
  onStyleChange: (style: ChoreographyStyle) => void;
  onIntensityChange: (intensity: number) => void;
}

const STYLE_ICONS: Record<ChoreographyStyle, string> = {
  'chill': '😌',
  'bounce': '🎾',
  'strobe': '⚡',
  'logo-safe': '🏢',
  'glitch': '🔀',
  'pulse': '💗',
  'wave': '🌊'
};

const STYLE_COLORS: Record<ChoreographyStyle, string> = {
  'chill': 'from-blue-500 to-cyan-500',
  'bounce': 'from-orange-500 to-yellow-500',
  'strobe': 'from-purple-500 to-pink-500',
  'logo-safe': 'from-gray-500 to-slate-500',
  'glitch': 'from-red-500 to-purple-500',
  'pulse': 'from-pink-500 to-rose-500',
  'wave': 'from-teal-500 to-blue-500'
};

export const ChoreographyStyleSelector: React.FC<ChoreographyStyleSelectorProps> = ({
  selectedStyle,
  intensity,
  onStyleChange,
  onIntensityChange
}) => {
  const styles = FrameChoreographer.getAvailableStyles();

  return (
    <div className="choreography-selector">
      {/* Header */}
      <div className="mb-4">
        <h3 className="text-lg font-medium text-white mb-2">
          Animation Style
        </h3>
        <p className="text-sm text-gray-400">
          Choose how your animation responds to the music
        </p>
      </div>

      {/* Style Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 mb-6">
        {styles.map((style) => {
          const isSelected = selectedStyle === style;
          const description = FrameChoreographer.getStyleDescription(style);

          return (
            <button
              key={style}
              onClick={() => onStyleChange(style)}
              className={`
                relative p-4 rounded-xl border-2 transition-all
                ${isSelected
                  ? 'border-purple-500 bg-purple-500/20 scale-105'
                  : 'border-gray-700 bg-gray-800/50 hover:border-gray-600 hover:bg-gray-800'
                }
              `}
              title={description}
            >
              {/* Icon */}
              <div className="text-4xl mb-2">{STYLE_ICONS[style]}</div>

              {/* Name */}
              <div className="text-sm font-medium text-white capitalize mb-1">
                {style}
              </div>

              {/* Gradient indicator */}
              {isSelected && (
                <div
                  className={`absolute bottom-2 left-2 right-2 h-1 rounded-full bg-gradient-to-r ${STYLE_COLORS[style]}`}
                />
              )}
            </button>
          );
        })}
      </div>

      {/* Description of selected style */}
      <div className="mb-6 p-4 bg-gray-800/50 border border-gray-700 rounded-lg">
        <div className="flex items-start gap-3">
          <div className="text-3xl">{STYLE_ICONS[selectedStyle]}</div>
          <div>
            <h4 className="text-sm font-medium text-white capitalize mb-1">
              {selectedStyle} Style
            </h4>
            <p className="text-xs text-gray-400">
              {FrameChoreographer.getStyleDescription(selectedStyle)}
            </p>
          </div>
        </div>
      </div>

      {/* Intensity Slider */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm font-medium text-gray-300">
            Music Intensity
          </label>
          <span className="text-sm font-mono text-purple-400">
            {Math.round(intensity * 100)}%
          </span>
        </div>

        <div className="relative">
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={intensity}
            onChange={(e) => onIntensityChange(parseFloat(e.target.value))}
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

          {/* Visual feedback bar */}
          <div
            className="absolute top-0 left-0 h-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full pointer-events-none"
            style={{ width: `${intensity * 100}%` }}
          />
        </div>

        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>😌 Subtle</span>
          <span>🔥 Intense</span>
        </div>

        <p className="text-xs text-gray-500 mt-3">
          Higher intensity makes the animation more responsive to music changes.
          Lower intensity creates smoother, more subtle effects.
        </p>
      </div>
    </div>
  );
};
