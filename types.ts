/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

export interface UploadedImage {
  id: string;
  dataUrl: string;
  name: string;
}

export type AnimationModifier = 'none' | 'rotate' | 'zoomIn' | 'zoomOut' | 'pan';

export interface AnimationOptions {
  variantId: string;
  frameCount: 9 | 16;
  frameDuration: number;
  isLooping: boolean;
  effectIntensity: 'low' | 'medium' | 'high';
  modifier: AnimationModifier;
  enableAntiJitter: boolean;
}

export interface AnimationRequest {
  id: string;
  sourceImage: UploadedImage;
  options: AnimationOptions;
}


export const MODIFIERS: { id: AnimationModifier; name: string; }[] = [
  { id: 'none', name: 'None' },
  { id: 'rotate', name: 'Rotate 360°' },
  { id: 'zoomIn', name: 'Zoom In' },
  { id: 'zoomOut', name: 'Zoom Out' },
  { id: 'pan', name: 'Pan Left-Right' },
];

export enum AnimationCategory {
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
  Retro = 'retro',
  Nature = 'nature',
  SciFi = 'scifi',
  Fantasy = 'fantasy',
  Artistic = 'artistic',
  Textile = 'textile',
  Liquid = 'liquid',
  Mechanical = 'mechanical',
  Food = 'food',
  Papercraft = 'papercraft',
}

export interface AnimationVariant {
  id: string;
  name: string;
}

export interface AnimationCategoryData {
  id: AnimationCategory;
  name: string;
  variants: AnimationVariant[];
}

export const ANIMATION_DATA: AnimationCategoryData[] = [
  {
    id: AnimationCategory.Zoom,
    name: 'Polytopal Zoom',
    variants: [
      { id: 'zoom-classic', name: 'Classic Endless' },
      { id: 'zoom-rotate', name: 'Rotating Tunnel' },
      { id: 'zoom-fractal', name: 'Fractal Dive' },
      { id: 'zoom-reverse', name: 'Outward Burst' },
      { id: 'zoom-morph', name: 'Morphing Zoom' },
    ],
  },
  {
    id: AnimationCategory.Sketch,
    name: 'Sketch Reveal',
    variants: [
      { id: 'sketch-pencil', name: 'Pencil to Reality' },
      { id: 'sketch-charcoal', name: 'Charcoal & Smudge' },
      { id: 'sketch-ink', name: 'Ink Crosshatch' },
      { id: 'sketch-color-pencil', name: 'Colored Pencil Layering' },
      { id: 'sketch-storyboard', name: 'Storyboard Sequence' },
    ],
  },
  {
    id: AnimationCategory.Pixel,
    name: 'Pixel Resolve',
    variants: [
      { id: 'pixel-classic', name: 'Classic Resolve' },
      { id: 'pixel-gameboy', name: '8-Bit Console' },
      { id: 'pixel-dither', name: 'Dithering Fade' },
      { id: 'pixel-sort', name: 'Pixel Sort' },
      { id: 'pixel-upgrade', name: '8-bit to 16-bit' },
    ],
  },
  {
    id: AnimationCategory.Watercolor,
    name: 'Watercolor Paint',
    variants: [
      { id: 'watercolor-classic', name: 'Classic Wash' },
      { id: 'watercolor-bleed', name: 'Wet-on-Wet Bleed' },
      { id: 'watercolor-ink', name: 'Ink & Wash' },
      { id: 'watercolor-salt', name: 'Salt Bloom' },
      { id: 'watercolor-mask', name: 'Masking Fluid Reveal' },
    ],
  },
  {
    id: AnimationCategory.Neon,
    name: 'Neon Glow',
    variants: [
      { id: 'neon-classic', name: 'Flicker On' },
      { id: 'neon-pulse', name: 'Rhythmic Pulse' },
      { id: 'neon-liquid', name: 'Liquid Neon Flow' },
      { id: 'neon-broken', name: 'Faulty Sign' },
      { id: 'neon-chromatic', name: 'Chromatic Glow' },
    ],
  },
  {
    id: AnimationCategory.Glitch,
    name: 'Glitch Effect',
    variants: [
      { id: 'glitch-digital', name: 'Digital Loop' },
      { id: 'glitch-vhs', name: 'VHS Tracking' },
      { id: 'glitch-datamosh', name: 'Datamosh' },
      { id: 'glitch-static', name: 'Analog TV Static' },
      { id: 'glitch-corrupt', name: 'Corrupted File' },
    ],
  },
  {
    id: AnimationCategory.Origami,
    name: 'Origami Fold',
    variants: [
      { id: 'origami-classic', name: 'Classic Fold' },
      { id: 'origami-crumple', name: 'Crumple & Unfold' },
      { id: 'origami-popup', name: 'Pop-Up Book' },
      { id: 'origami-collage', name: 'Torn Paper Collage' },
      { id: 'origami-assembly', name: 'Multi-Paper Assembly' },
    ],
  },
  {
    id: AnimationCategory.Cosmic,
    name: 'Cosmic Dust',
    variants: [
      { id: 'cosmic-nebula', name: 'Nebula Formation' },
      { id: 'cosmic-supernova', name: 'Supernova Burst' },
      { id: 'cosmic-blackhole', name: 'Black Hole Swirl' },
      { id: 'cosmic-constellation', name: 'Constellation Connect' },
      { id: 'cosmic-aurora', name: 'Aurora Form' },
    ],
  },
  {
    id: AnimationCategory.Claymation,
    name: 'Claymation',
    variants: [
      { id: 'claymation-build', name: 'Stop-Motion Build' },
      { id: 'claymation-smear', name: 'Clay Smear Painting' },
      { id: 'claymation-morph', name: 'Shape Morph' },
      { id: 'claymation-cutout', name: 'Clay Cutouts' },
      { id: 'claymation-wheel', name: 'Potter\'s Wheel' },
    ],
  },
  {
    id: AnimationCategory.Blueprint,
    name: 'Blueprint',
    variants: [
      { id: 'blueprint-classic', name: 'Blueprint to 3D' },
      { id: 'blueprint-davinci', name: 'Da Vinci Sketch' },
      { id: 'blueprint-hologram', name: 'Holographic Projection' },
      { id: 'blueprint-cad', name: 'CAD Assembly' },
      { id: 'blueprint-chalk', name: 'Chalk Outline' },
    ],
  },
  {
    id: AnimationCategory.Retro,
    name: 'Retro Tech',
    variants: [
      { id: 'retro-crt', name: 'CRT Monitor' },
      { id: 'retro-polaroid', name: 'Polaroid Develop' },
      { id: 'retro-film', name: 'Vintage Film Reel' },
      { id: 'retro-dotmatrix', name: 'Dot-Matrix Print' },
      { id: 'retro-vcr', name: 'VCR Play' },
    ],
  },
  {
    id: AnimationCategory.Nature,
    name: 'Natural Elements',
    variants: [
      { id: 'nature-growth', name: 'Vine Growth' },
      { id: 'nature-erosion', name: 'Wind Erosion' },
      { id: 'nature-ice', name: 'Frost & Thaw' },
      { id: 'nature-fire', name: 'Burn Reveal' },
      { id: 'nature-seasons', name: 'Passing Seasons' },
    ],
  },
  {
    id: AnimationCategory.SciFi,
    name: 'Science Fiction',
    variants: [
      { id: 'scifi-replicator', name: 'Matter Replicator' },
      { id: 'scifi-hud', name: 'HUD Assembly' },
      { id: 'scifi-warp', name: 'Warp Speed' },
      { id: 'scifi-matrix', name: 'Digital Rain' },
      { id: 'scifi-scanner', name: 'Light Scanner' },
    ],
  },
  {
    id: AnimationCategory.Fantasy,
    name: 'Fantasy & Magic',
    variants: [
      { id: 'fantasy-magic', name: 'Magical Swirl' },
      { id: 'fantasy-potion', name: 'Bubbling Potion' },
      { id: 'fantasy-scroll', name: 'Unfurling Scroll' },
      { id: 'fantasy-summon', name: 'Summoning Circle' },
      { id: 'fantasy-crystal', name: 'Crystal Growth' },
    ],
  },
  {
    id: AnimationCategory.Artistic,
    name: 'Art Movements',
    variants: [
      { id: 'artistic-impressionism', name: 'Impressionism' },
      { id: 'artistic-cubism', name: 'Cubism' },
      { id: 'artistic-popart', name: 'Pop Art' },
      { id: 'artistic-stain-glass', name: 'Stained Glass' },
      { id: 'artistic-mosaic', name: 'Mosaic Tiles' },
    ],
  },
  {
    id: AnimationCategory.Textile,
    name: 'Textile Arts',
    variants: [
      { id: 'textile-stitch', name: 'Embroidery Stitch' },
      { id: 'textile-weave', name: 'Tapestry Weave' },
      { id: 'textile-knit', name: 'Knitting' },
      { id: 'textile-patchwork', name: 'Patchwork Quilt' },
      { id: 'textile-dye', name: 'Tie-Dye' },
    ],
  },
  {
    id: AnimationCategory.Liquid,
    name: 'Liquid Motion',
    variants: [
      { id: 'liquid-inkdrop', name: 'Ink in Water' },
      { id: 'liquid-splash', name: 'Paint Splash' },
      { id: 'liquid-ripple', name: 'Water Ripple' },
      { id: 'liquid-pour', name: 'Viscous Pour' },
      { id: 'liquid-bubbles', name: 'Bubble Reveal' },
    ],
  },
  {
    id: AnimationCategory.Mechanical,
    name: 'Mechanical',
    variants: [
      { id: 'mechanical-gears', name: 'Clockwork Gears' },
      { id: 'mechanical-steampunk', name: 'Steampunk Assembly' },
      { id: 'mechanical-drafting', name: 'Drafting Arm' },
      { id: 'mechanical-flipbook', name: 'Flipbook Machine' },
      { id: 'mechanical-assembly', name: 'Assembly Line' },
    ],
  },
  {
    id: AnimationCategory.Food,
    name: 'Culinary Creations',
    variants: [
      { id: 'food-icing', name: 'Piped Icing' },
      { id: 'food-latte', name: 'Latte Art' },
      { id: 'food-fry', name: 'Pan Fry Sizzle' },
      { id: 'food-decorate', name: 'Sprinkles' },
      { id: 'food-slice', name: 'Food Slices' },
    ],
  },
  {
    id: AnimationCategory.Papercraft,
    name: 'Papercraft',
    variants: [
      { id: 'papercraft-cutout', name: 'Layered Cutouts' },
      { id: 'papercraft-quilling', name: 'Paper Quilling' },
      { id: 'papercraft-mache', name: 'Papier-Mâché' },
      { id: 'papercraft-lantern', name: 'Paper Lantern' },
      { id: 'papercraft-diorama', name: '3D Diorama' },
    ],
  },
];


export interface Frame {
  x: number;
  y: number;
  width: number;
  height: number;
}

// ============================================================================
// Music-Responsive Animation Types
// ============================================================================

/**
 * Choreography styles for music-responsive animations
 */
export type ChoreographyStyle =
  | 'chill'       // Gentle, smooth transitions on major beats
  | 'bounce'      // Energetic, reactive to all beats
  | 'strobe'      // Rapid changes on strong beats
  | 'logo-safe'   // Subtle, professional (mostly holds anchor)
  | 'glitch'      // Chaotic, fragmented
  | 'pulse'       // Rhythmic breathing effect
  | 'wave';       // Smooth cycling through frames

/**
 * Music-enhanced animation request
 */
export interface MusicAnimationRequest extends AnimationRequest {
  audioUrl?: string;              // Optional audio file URL
  choreographyStyle?: ChoreographyStyle;
  musicIntensity?: number;        // 0-1, how responsive to music
  clipDuration?: number;          // Desired output duration in seconds
}

/**
 * Audio source information
 */
export interface AudioSource {
  type: 'file' | 'youtube' | 'microphone';
  url?: string;                   // For file/youtube
  title?: string;
  duration: number;               // Total duration in seconds
}

/**
 * Music analysis result
 */
export interface MusicAnalysis {
  bpm: number;                    // Detected beats per minute
  beats: number[];                // Array of beat timestamps
  tempo: 'slow' | 'medium' | 'fast';
  energy: 'low' | 'medium' | 'high';
  sections?: {                    // Optional section detection
    start: number;
    end: number;
    label: string;                // intro, verse, chorus, drop, etc.
  }[];
}

/**
 * Complete music-responsive project
 */
export interface MusicProject {
  id: string;
  name: string;
  sourceImage: UploadedImage;
  audioSource?: AudioSource;
  animationOptions: AnimationOptions;
  choreographyStyle: ChoreographyStyle;
  musicIntensity: number;
  clipDuration: number;
  createdAt: Date;
  updatedAt: Date;
}
