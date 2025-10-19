/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

export enum AppState {
  Capturing,
  Processing,
  Animating,
  Error,
}

export enum AnimationType {
  Zoom = 'zoom',
  Sketch = 'sketch',
  Pixel = 'pixel',
  Watercolor = 'watercolor',
  Neon = 'neon',
  Glitch = 'glitch',
  Origami = 'origami',
  Cosmic = 'cosmic',
  Claymation = 'claymation',
  Blueprint = 'blueprint',
}

export const ANIMATION_TYPES = [
  { id: AnimationType.Zoom, name: 'Polytopal Zoom' },
  { id: AnimationType.Sketch, name: 'Sketch Reveal' },
  { id: AnimationType.Pixel, name: 'Pixel Resolve' },
  { id: AnimationType.Watercolor, name: 'Watercolor Paint' },
  { id: AnimationType.Neon, name: 'Neon Glow' },
  { id: AnimationType.Glitch, name: 'Glitch Effect' },
  { id: AnimationType.Origami, name: 'Origami Fold' },
  { id: AnimationType.Cosmic, name: 'Cosmic Dust' },
  { id: AnimationType.Claymation, name: 'Claymation' },
  { id: AnimationType.Blueprint, name: 'Blueprint' },
];

export interface Frame {
  x: number;
  y: number;
  width: number;
  height: number;
}