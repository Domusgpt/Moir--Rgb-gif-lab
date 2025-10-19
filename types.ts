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
  previewGifUrl: string;
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
      { id: 'zoom-classic', name: 'Classic Endless', previewGifUrl: '/previews/zoom-classic.gif' },
      { id: 'zoom-rotate', name: 'Rotating Tunnel', previewGifUrl: '/previews/zoom-rotate.gif' },
      { id: 'zoom-fractal', name: 'Fractal Dive', previewGifUrl: '/previews/zoom-fractal.gif' },
      { id: 'zoom-reverse', name: 'Outward Burst', previewGifUrl: '/previews/zoom-reverse.gif' },
      { id: 'zoom-morph', name: 'Morphing Zoom', previewGifUrl: '/previews/zoom-morph.gif' },
    ],
  },
  {
    id: AnimationCategory.Sketch,
    name: 'Sketch Reveal',
    variants: [
      { id: 'sketch-pencil', name: 'Pencil to Reality', previewGifUrl: '/previews/sketch-pencil.gif' },
      { id: 'sketch-charcoal', name: 'Charcoal & Smudge', previewGifUrl: '/previews/sketch-charcoal.gif' },
      { id: 'sketch-ink', name: 'Ink Crosshatch', previewGifUrl: '/previews/sketch-ink.gif' },
      { id: 'sketch-color-pencil', name: 'Colored Pencil Layering', previewGifUrl: '/previews/sketch-color-pencil.gif' },
      { id: 'sketch-storyboard', name: 'Storyboard Sequence', previewGifUrl: '/previews/sketch-storyboard.gif' },
    ],
  },
  {
    id: AnimationCategory.Pixel,
    name: 'Pixel Resolve',
    variants: [
      { id: 'pixel-classic', name: 'Classic Resolve', previewGifUrl: '/previews/pixel-classic.gif' },
      { id: 'pixel-gameboy', name: '8-Bit Console', previewGifUrl: '/previews/pixel-gameboy.gif' },
      { id: 'pixel-dither', name: 'Dithering Fade', previewGifUrl: '/previews/pixel-dither.gif' },
      { id: 'pixel-sort', name: 'Pixel Sort', previewGifUrl: '/previews/pixel-sort.gif' },
      { id: 'pixel-upgrade', name: '8-bit to 16-bit', previewGifUrl: '/previews/pixel-upgrade.gif' },
    ],
  },
  {
    id: AnimationCategory.Watercolor,
    name: 'Watercolor Paint',
    variants: [
      { id: 'watercolor-classic', name: 'Classic Wash', previewGifUrl: '/previews/watercolor-classic.gif' },
      { id: 'watercolor-bleed', name: 'Wet-on-Wet Bleed', previewGifUrl: '/previews/watercolor-bleed.gif' },
      { id: 'watercolor-ink', name: 'Ink & Wash', previewGifUrl: '/previews/watercolor-ink.gif' },
      { id: 'watercolor-salt', name: 'Salt Bloom', previewGifUrl: '/previews/watercolor-salt.gif' },
      { id: 'watercolor-mask', name: 'Masking Fluid Reveal', previewGifUrl: '/previews/watercolor-mask.gif' },
    ],
  },
  {
    id: AnimationCategory.Neon,
    name: 'Neon Glow',
    variants: [
      { id: 'neon-classic', name: 'Flicker On', previewGifUrl: '/previews/neon-classic.gif' },
      { id: 'neon-pulse', name: 'Rhythmic Pulse', previewGifUrl: '/previews/neon-pulse.gif' },
      { id: 'neon-liquid', name: 'Liquid Neon Flow', previewGifUrl: '/previews/neon-liquid.gif' },
      { id: 'neon-broken', name: 'Faulty Sign', previewGifUrl: '/previews/neon-broken.gif' },
      { id: 'neon-chromatic', name: 'Chromatic Glow', previewGifUrl: '/previews/neon-chromatic.gif' },
    ],
  },
  {
    id: AnimationCategory.Glitch,
    name: 'Glitch Effect',
    variants: [
      { id: 'glitch-digital', name: 'Digital Loop', previewGifUrl: '/previews/glitch-digital.gif' },
      { id: 'glitch-vhs', name: 'VHS Tracking', previewGifUrl: '/previews/glitch-vhs.gif' },
      { id: 'glitch-datamosh', name: 'Datamosh', previewGifUrl: '/previews/glitch-datamosh.gif' },
      { id: 'glitch-static', name: 'Analog TV Static', previewGifUrl: '/previews/glitch-static.gif' },
      { id: 'glitch-corrupt', name: 'Corrupted File', previewGifUrl: '/previews/glitch-corrupt.gif' },
    ],
  },
  {
    id: AnimationCategory.Origami,
    name: 'Origami Fold',
    variants: [
      { id: 'origami-classic', name: 'Classic Fold', previewGifUrl: '/previews/origami-classic.gif' },
      { id: 'origami-crumple', name: 'Crumple & Unfold', previewGifUrl: '/previews/origami-crumple.gif' },
      { id: 'origami-popup', name: 'Pop-Up Book', previewGifUrl: '/previews/origami-popup.gif' },
      { id: 'origami-collage', name: 'Torn Paper Collage', previewGifUrl: '/previews/origami-collage.gif' },
      { id: 'origami-assembly', name: 'Multi-Paper Assembly', previewGifUrl: '/previews/origami-assembly.gif' },
    ],
  },
  {
    id: AnimationCategory.Cosmic,
    name: 'Cosmic Dust',
    variants: [
      { id: 'cosmic-nebula', name: 'Nebula Formation', previewGifUrl: '/previews/cosmic-nebula.gif' },
      { id: 'cosmic-supernova', name: 'Supernova Burst', previewGifUrl: '/previews/cosmic-supernova.gif' },
      { id: 'cosmic-blackhole', name: 'Black Hole Swirl', previewGifUrl: '/previews/cosmic-blackhole.gif' },
      { id: 'cosmic-constellation', name: 'Constellation Connect', previewGifUrl: '/previews/cosmic-constellation.gif' },
      { id: 'cosmic-aurora', name: 'Aurora Form', previewGifUrl: '/previews/cosmic-aurora.gif' },
    ],
  },
  {
    id: AnimationCategory.Claymation,
    name: 'Claymation',
    variants: [
      { id: 'claymation-build', name: 'Stop-Motion Build', previewGifUrl: '/previews/claymation-build.gif' },
      { id: 'claymation-smear', name: 'Clay Smear Painting', previewGifUrl: '/previews/claymation-smear.gif' },
      { id: 'claymation-morph', name: 'Shape Morph', previewGifUrl: '/previews/claymation-morph.gif' },
      { id: 'claymation-cutout', name: 'Clay Cutouts', previewGifUrl: '/previews/claymation-cutout.gif' },
      { id: 'claymation-wheel', name: 'Potter\'s Wheel', previewGifUrl: '/previews/claymation-wheel.gif' },
    ],
  },
  {
    id: AnimationCategory.Blueprint,
    name: 'Blueprint',
    variants: [
      { id: 'blueprint-classic', name: 'Blueprint to 3D', previewGifUrl: '/previews/blueprint-classic.gif' },
      { id: 'blueprint-davinci', name: 'Da Vinci Sketch', previewGifUrl: '/previews/blueprint-davinci.gif' },
      { id: 'blueprint-hologram', name: 'Holographic Projection', previewGifUrl: '/previews/blueprint-hologram.gif' },
      { id: 'blueprint-cad', name: 'CAD Assembly', previewGifUrl: '/previews/blueprint-cad.gif' },
      { id: 'blueprint-chalk', name: 'Chalk Outline', previewGifUrl: '/previews/blueprint-chalk.gif' },
    ],
  },
  {
    id: AnimationCategory.Retro,
    name: 'Retro Tech',
    variants: [
      { id: 'retro-crt', name: 'CRT Monitor', previewGifUrl: '/previews/retro-crt.gif' },
      { id: 'retro-polaroid', name: 'Polaroid Develop', previewGifUrl: '/previews/retro-polaroid.gif' },
      { id: 'retro-film', name: 'Vintage Film Reel', previewGifUrl: '/previews/retro-film.gif' },
      { id: 'retro-dotmatrix', name: 'Dot-Matrix Print', previewGifUrl: '/previews/retro-dotmatrix.gif' },
      { id: 'retro-vcr', name: 'VCR Play', previewGifUrl: '/previews/retro-vcr.gif' },
    ],
  },
  {
    id: AnimationCategory.Nature,
    name: 'Natural Elements',
    variants: [
      { id: 'nature-growth', name: 'Vine Growth', previewGifUrl: '/previews/nature-growth.gif' },
      { id: 'nature-erosion', name: 'Wind Erosion', previewGifUrl: '/previews/nature-erosion.gif' },
      { id: 'nature-ice', name: 'Frost & Thaw', previewGifUrl: '/previews/nature-ice.gif' },
      { id: 'nature-fire', name: 'Burn Reveal', previewGifUrl: '/previews/nature-fire.gif' },
      { id: 'nature-seasons', name: 'Passing Seasons', previewGifUrl: '/previews/nature-seasons.gif' },
    ],
  },
  {
    id: AnimationCategory.SciFi,
    name: 'Science Fiction',
    variants: [
      { id: 'scifi-replicator', name: 'Matter Replicator', previewGifUrl: '/previews/scifi-replicator.gif' },
      { id: 'scifi-hud', name: 'HUD Assembly', previewGifUrl: '/previews/scifi-hud.gif' },
      { id: 'scifi-warp', name: 'Warp Speed', previewGifUrl: '/previews/scifi-warp.gif' },
      { id: 'scifi-matrix', name: 'Digital Rain', previewGifUrl: '/previews/scifi-matrix.gif' },
      { id: 'scifi-scanner', name: 'Light Scanner', previewGifUrl: '/previews/scifi-scanner.gif' },
    ],
  },
  {
    id: AnimationCategory.Fantasy,
    name: 'Fantasy & Magic',
    variants: [
      { id: 'fantasy-magic', name: 'Magical Swirl', previewGifUrl: '/previews/fantasy-magic.gif' },
      { id: 'fantasy-potion', name: 'Bubbling Potion', previewGifUrl: '/previews/fantasy-potion.gif' },
      { id: 'fantasy-scroll', name: 'Unfurling Scroll', previewGifUrl: '/previews/fantasy-scroll.gif' },
      { id: 'fantasy-summon', name: 'Summoning Circle', previewGifUrl: '/previews/fantasy-summon.gif' },
      { id: 'fantasy-crystal', name: 'Crystal Growth', previewGifUrl: '/previews/fantasy-crystal.gif' },
    ],
  },
  {
    id: AnimationCategory.Artistic,
    name: 'Art Movements',
    variants: [
      { id: 'artistic-impressionism', name: 'Impressionism', previewGifUrl: '/previews/artistic-impressionism.gif' },
      { id: 'artistic-cubism', name: 'Cubism', previewGifUrl: '/previews/artistic-cubism.gif' },
      { id: 'artistic-popart', name: 'Pop Art', previewGifUrl: '/previews/artistic-popart.gif' },
      { id: 'artistic-stain-glass', name: 'Stained Glass', previewGifUrl: '/previews/artistic-stain-glass.gif' },
      { id: 'artistic-mosaic', name: 'Mosaic Tiles', previewGifUrl: '/previews/artistic-mosaic.gif' },
    ],
  },
  {
    id: AnimationCategory.Textile,
    name: 'Textile Arts',
    variants: [
      { id: 'textile-stitch', name: 'Embroidery Stitch', previewGifUrl: '/previews/textile-stitch.gif' },
      { id: 'textile-weave', name: 'Tapestry Weave', previewGifUrl: '/previews/textile-weave.gif' },
      { id: 'textile-knit', name: 'Knitting', previewGifUrl: '/previews/textile-knit.gif' },
      { id: 'textile-patchwork', name: 'Patchwork Quilt', previewGifUrl: '/previews/textile-patchwork.gif' },
      { id: 'textile-dye', name: 'Tie-Dye', previewGifUrl: '/previews/textile-dye.gif' },
    ],
  },
  {
    id: AnimationCategory.Liquid,
    name: 'Liquid Motion',
    variants: [
      { id: 'liquid-inkdrop', name: 'Ink in Water', previewGifUrl: '/previews/liquid-inkdrop.gif' },
      { id: 'liquid-splash', name: 'Paint Splash', previewGifUrl: '/previews/liquid-splash.gif' },
      { id: 'liquid-ripple', name: 'Water Ripple', previewGifUrl: '/previews/liquid-ripple.gif' },
      { id: 'liquid-pour', name: 'Viscous Pour', previewGifUrl: '/previews/liquid-pour.gif' },
      { id: 'liquid-bubbles', name: 'Bubble Reveal', previewGifUrl: '/previews/liquid-bubbles.gif' },
    ],
  },
  {
    id: AnimationCategory.Mechanical,
    name: 'Mechanical',
    variants: [
      { id: 'mechanical-gears', name: 'Clockwork Gears', previewGifUrl: '/previews/mechanical-gears.gif' },
      { id: 'mechanical-steampunk', name: 'Steampunk Assembly', previewGifUrl: '/previews/mechanical-steampunk.gif' },
      { id: 'mechanical-drafting', name: 'Drafting Arm', previewGifUrl: '/previews/mechanical-drafting.gif' },
      { id: 'mechanical-flipbook', name: 'Flipbook Machine', previewGifUrl: '/previews/mechanical-flipbook.gif' },
      { id: 'mechanical-assembly', name: 'Assembly Line', previewGifUrl: '/previews/mechanical-assembly.gif' },
    ],
  },
  {
    id: AnimationCategory.Food,
    name: 'Culinary Creations',
    variants: [
      { id: 'food-icing', name: 'Piped Icing', previewGifUrl: '/previews/food-icing.gif' },
      { id: 'food-latte', name: 'Latte Art', previewGifUrl: '/previews/food-latte.gif' },
      { id: 'food-fry', name: 'Pan Fry Sizzle', previewGifUrl: '/previews/food-fry.gif' },
      { id: 'food-decorate', name: 'Sprinkles', previewGifUrl: '/previews/food-decorate.gif' },
      { id: 'food-slice', name: 'Food Slices', previewGifUrl: '/previews/food-slice.gif' },
    ],
  },
  {
    id: AnimationCategory.Papercraft,
    name: 'Papercraft',
    variants: [
      { id: 'papercraft-cutout', name: 'Layered Cutouts', previewGifUrl: '/previews/papercraft-cutout.gif' },
      { id: 'papercraft-quilling', name: 'Paper Quilling', previewGifUrl: '/previews/papercraft-quilling.gif' },
      { id: 'papercraft-mache', name: 'Papier-Mâché', previewGifUrl: '/previews/papercraft-mache.gif' },
      { id: 'papercraft-lantern', name: 'Paper Lantern', previewGifUrl: '/previews/papercraft-lantern.gif' },
      { id: 'papercraft-diorama', name: '3D Diorama', previewGifUrl: '/previews/papercraft-diorama.gif' },
    ],
  },
];


export interface Frame {
  x: number;
  y: number;
  width: number;
  height: number;
}