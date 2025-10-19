/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import { AnimationType } from './types';

export const promptSuggestions: {emoji: string, prompt: string}[] = [];

export const buildCreativeInstruction = (
  originalImage: string | null, 
  frameCount: number,
  animationType: AnimationType
): string => {
  let storyPrompt = '';

  switch (animationType) {
    case AnimationType.Zoom:
      storyPrompt = `Create a specific type of 'endless zoom' or 'Droste effect' animation with a powerful sense of depth and recursion.
- The animation should feel like flying through a tunnel made of the image itself.
- **Frame 1:** Start with the original, unmodified image.
- **The Zoom Mechanism:** For each subsequent frame, zoom aggressively into the center of the image.
- **The Overlay Effect:** As the zoom happens, a smaller version of the original image must appear in the center. This smaller version should start very small and rapidly expand. It is overlaid on top of the zooming background.
- **Expansion and Replacement:** This expanding central image should grow until it completely covers the previous frame, effectively pushing the old boundaries out of view. As it becomes the new "full" image, an even smaller version of the image should be visible in its center, continuing the cycle.
- **Seamless Loop:** The final frame must be visually identical to the first frame to create a perfect, hypnotic loop. The small image that started at the center should have expanded to become the full frame by the end of the animation.
- Maintain the sharpness, details, and color palette of the source image throughout the entire animation. Avoid blurriness.`;
      break;
    
    case AnimationType.Sketch:
      storyPrompt = `Create a 'sketch-to-reality' animation that shows the image being drawn and colored in.
- **Frame 1:** Start with a clean, simple, monochrome pencil or ink line sketch of the main subject on a plain white or off-white background.
- **Frames 2-4:** Begin adding basic, flat colors to the sketch, like the first pass of a painting. Outlines should still be visible.
- **Frames 5-8:** Gradually introduce more detailed shading, highlights, textures, and richer colors. The image should become progressively more realistic.
- **Frame 9:** The final frame must be visually identical to the original source image, fully rendered and detailed.
- The transition between frames should be smooth, giving the illusion of an artist at work.
- Maintain the composition and core shapes of the source image throughout the entire animation. Avoid any distortion.`;
      break;

    case AnimationType.Pixel:
      storyPrompt = `Create a 'pixel art resolve' animation.
- **Frame 1:** Start with a very low-resolution, blocky, pixelated version of the source image. The core colors should be present but in large blocks.
- **Frames 2-4:** Gradually increase the resolution. The pixel blocks should become smaller and more numerous, revealing more detail about the subject's form.
- **Frames 5-8:** Continue to refine the image, smoothing out the pixelated edges and adding finer color gradients and details, transitioning from pixel art to a more realistic look.
- **Frame 9:** The final frame must be identical to the original, high-resolution source image.
- The transition should feel like a classic video game graphic loading or upgrading.
- Maintain the composition and core shapes of the source image throughout the entire animation.`;
      break;

    case AnimationType.Watercolor:
      storyPrompt = `Create an animation that looks like the image is being painted with watercolors.
- **Frame 1:** Start with a faint pencil outline of the subject on a textured paper background.
- **Frames 2-4:** Apply light, watery color washes. The colors should bleed and blend into each other softly.
- **Frames 5-8:** Build up the color with more saturated layers. Add details, shadows, and highlights, still retaining the characteristic transparency and soft edges of watercolor.
- **Frame 9:** The final frame should be a vibrant, fully realized watercolor painting that is a stylized version of the source image.
- The animation should capture the fluid and slightly unpredictable nature of watercolor painting.
- The final frame should be visually similar to the source image, but clearly in a watercolor style.`;
      break;

    case AnimationType.Neon:
      storyPrompt = `Create a 'neon sign' animation.
- **Frame 1:** A completely black background.
- **Frames 2-4:** The main outlines of the subject appear as thin, flickering neon tubes in a primary color (e.g., blue, pink, or green).
- **Frames 5-8:** Additional details and secondary colors flicker on. The glow from the neon tubes should intensify, casting light on the background.
- **Frame 9:** The full image is illuminated as a stable, brightly glowing neon sign. The final frame should be a stylized but recognizable version of the source image.
- The animation should have a buzzing, electric feel, with subtle flickering throughout to mimic a real neon sign.
- The final image should be a simplified, glowing line-art representation of the source.`;
      break;

    case AnimationType.Glitch:
      storyPrompt = `Create a 'digital glitch' animation.
- **Frame 1:** The original, clean image.
- **Frames 2-4:** Introduce minor glitches: a few scan lines, slight color channel separation (RGB shift), and minor blocky artifacts (macroblocking).
- **Frames 5-8:** The glitch effect intensifies significantly. The image should distort, tear, and show heavy artifacts and datamoshing effects, but the subject should still be vaguely recognizable.
- **Frame 9:** The glitches resolve, and the image returns to being identical to Frame 1, creating a perfect loop.
- The animation should feel like a corrupted video file or a bad data transmission that momentarily corrects itself.
- The loop should be seamless, with the glitch effect building and then completely disappearing.`;
      break;

    case AnimationType.Origami:
      storyPrompt = `Create an animation of the subject folding itself into existence like origami.
- **Frame 1:** A flat, blank piece of paper (e.g., white or a color from the image's palette).
- **Frames 2-4:** The paper begins to fold itself along crisp lines, forming a complex, abstract shape.
- **Frames 5-8:** The folding becomes more intricate, and the final shape of the subject starts to become recognizable. Colors and patterns from the source image begin to appear on the folded surfaces.
- **Frame 9:** The final folded paper model is complete, perfectly resembling the subject from the source image in a stylized, geometric, low-poly form.
- The animation should look like a stop-motion video of a piece of paper being folded by an invisible expert.
- The final frame should be a stylized, paper-craft version of the source image.`;
      break;

    case AnimationType.Cosmic:
      storyPrompt = `Create an animation of the image forming from cosmic dust and stars.
- **Frame 1:** A dark, deep space background with a few distant stars.
- **Frames 2-4:** A faint, glowing nebula of colored gas and dust begins to swirl into the shape of the subject.
- **Frames 5-8:** The nebula coalesces. Bright stars and cosmic energy form within the shape, defining its features and details more clearly.
- **Frame 9:** The cosmic energy solidifies into the final, vibrant image, which appears to be made of stardust and light, set against the space background.
- The animation should feel majestic and celestial, with smooth, flowing movement.
- The final frame should be a stylized, ethereal version of the source image.`;
      break;
      
    case AnimationType.Claymation:
      storyPrompt = `Create a stop-motion 'claymation' style animation.
- **Frame 1:** A simple lump of colored clay on a plain background.
- **Frames 2-4:** The lump is quickly molded and shaped by unseen hands, beginning to take the basic form of the subject. You might see subtle fingerprint textures.
- **Frames 5-8:** The shape is refined. Details are added (e.g., eyes, patterns), and the colors are applied as if they are different pieces of clay being joined together. The object should have a tangible, slightly imperfect, handcrafted look.
- **Frame 9:** The final clay model is complete, a recognizable representation of the source image. Add a subtle 'breathing' motion or a slight shift to imply it's a living stop-motion puppet, making the loop back to frame 1 more natural.
- The animation should have the characteristic charm of stop-motion, with slight imperfections between frames.
- The final frame should be a stylized, clay version of the source image.`;
      break;

    case AnimationType.Blueprint:
      storyPrompt = `Create an animation that transitions from a technical blueprint to the finished object.
- **Frame 1:** A classic blueprint background (dark blue) with white grid lines. The subject is drawn in simple, white schematic lines. Callouts and dimensions might be visible.
- **Frames 2-4:** The blueprint lines begin to fade as a wireframe 3D model appears over the drawing.
- **Frames 5-8:** Flat colors and basic textures start to fill in the wireframe model, replacing the blueprint entirely. The background transitions to a neutral studio gray.
- **Frame 9:** The object is fully rendered, with realistic lighting, shadows, and materials, identical to the source image.
- The animation should feel like a product design or architectural visualization.
- The transition from 2D schematic to 3D rendered object should be smooth and logical.`;
      break;
    
    default: // Fallback to zoom
      storyPrompt = `Create a specific type of 'endless zoom' or 'Droste effect' animation with a powerful sense of depth and recursion.
- Frame 1: Start with the original, unmodified image.
- For each subsequent frame, zoom aggressively into the center of the image. A smaller version of the original image must appear in the center and expand to cover the previous frame.
- The final frame must be visually identical to the first frame to create a perfect loop.`;
      break;
  }
  
  const baseInstruction = `Create a short, ${frameCount}-frame animation based on the creative direction. The movement should be smooth, and the final frame must loop perfectly back to the first.`;
  const styleConsistencyInstruction = `It is crucial that all ${frameCount} frames are in the same, consistent artistic style, matching the provided source image.`;
  const identityLockInstruction = `Maintain the subject's integrity and core shapes consistently across all frames. The subject should be clearly recognizable from one frame to the next.`;
  
  const frameDurationInstruction = `
Based on the creative direction, determine the optimal frame duration for the animation. A duration around 100-150ms is likely appropriate for this smooth rotation.
`;

  let creativeDirection = `
CREATIVE DIRECTION:
${storyPrompt}
${baseInstruction}
${styleConsistencyInstruction}
${identityLockInstruction}`;
  
  return `
${creativeDirection}
${frameDurationInstruction}

REQUIRED RESPONSE FORMAT:
Your response MUST contain two parts:
1. A valid JSON object containing a single key: "frameDuration". The value must be a number representing the milliseconds per frame (between 80 and 2000, per instructions above). Do not wrap the JSON in markdown backticks.
2. The ${frameCount}-frame sprite sheet image.

Example of the JSON part:
{"frameDuration": 120}
`;
};