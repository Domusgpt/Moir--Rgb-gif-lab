/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Clear Seas Solution - Holographic Cyberpunk Design System
 */

export const CLEAR_SEAS_BRAND = {
  colors: {
    // Neon Primary Colors
    neonPurple: '#B026FF',
    neonMagenta: '#FF006E',
    neonYellow: '#FFBE0B',

    // Holographic Gradients
    holoGradient1: 'linear-gradient(135deg, #B026FF 0%, #FF006E 50%, #FFBE0B 100%)',
    holoGradient2: 'linear-gradient(45deg, #FF006E 0%, #B026FF 50%, #FFBE0B 100%)',
    holoGradient3: 'linear-gradient(90deg, #FFBE0B 0%, #B026FF 50%, #FF006E 100%)',

    // Background Colors
    black: '#000000',
    darkGray: '#0A0A0A',
    midGray: '#1A1A1A',

    // Glass/Skeuomorphic
    glassBlack: 'rgba(0, 0, 0, 0.7)',
    glassPurple: 'rgba(176, 38, 255, 0.15)',
    glassMagenta: 'rgba(255, 0, 110, 0.15)',
    glassYellow: 'rgba(255, 190, 11, 0.15)',

    // Text Colors
    textPrimary: '#FFFFFF',
    textSecondary: '#E0E0E0',
    textMuted: '#808080',
  },

  shadows: {
    neonGlowPurple: '0 0 20px rgba(176, 38, 255, 0.6), 0 0 40px rgba(176, 38, 255, 0.4), 0 0 60px rgba(176, 38, 255, 0.2)',
    neonGlowMagenta: '0 0 20px rgba(255, 0, 110, 0.6), 0 0 40px rgba(255, 0, 110, 0.4), 0 0 60px rgba(255, 0, 110, 0.2)',
    neonGlowYellow: '0 0 20px rgba(255, 190, 11, 0.6), 0 0 40px rgba(255, 190, 11, 0.4), 0 0 60px rgba(255, 190, 11, 0.2)',

    // Skeuomorphic depth
    embossed: 'inset 0 2px 4px rgba(255, 255, 255, 0.1), inset 0 -2px 4px rgba(0, 0, 0, 0.5)',
    debossed: 'inset 0 2px 4px rgba(0, 0, 0, 0.5), inset 0 -2px 4px rgba(255, 255, 255, 0.1)',
    raised: '0 4px 8px rgba(176, 38, 255, 0.3), 0 8px 16px rgba(255, 0, 110, 0.2)',
    floatingCard: '0 8px 32px rgba(176, 38, 255, 0.4), 0 16px 64px rgba(255, 0, 110, 0.3)',
  },

  borders: {
    neonPurple: '2px solid #B026FF',
    neonMagenta: '2px solid #FF006E',
    neonYellow: '2px solid #FFBE0B',
    holoGradient: '2px solid transparent',
  },

  fonts: {
    heading: "'Neue Haas Grotesk', 'Helvetica Neue', 'Arial', sans-serif",
    body: "system-ui, -apple-system, 'Segoe UI', sans-serif",
    mono: "'JetBrains Mono', 'Fira Code', monospace",
  },

  animations: {
    holoShimmer: 'holoShimmer 3s ease-in-out infinite',
    neonPulse: 'neonPulse 2s ease-in-out infinite',
    glitchEffect: 'glitchEffect 0.3s ease-in-out',
  },

  effects: {
    backdropBlur: 'blur(20px)',
    glassEffect: 'backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px);',
  }
};

export type ClearSeasTheme = typeof CLEAR_SEAS_BRAND;
