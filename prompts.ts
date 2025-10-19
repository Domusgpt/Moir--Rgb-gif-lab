/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

export const promptSuggestions: {emoji: string, prompt: string}[] = [];

export const buildCreativeInstruction = (
  originalImage: string | null, 
  frameCount: number
): string => {
  const storyPrompt = `Animate the provided image using a chromatic moiré effect to simulate rotation while keeping the main subject stationary.

- The main subject of the image must remain perfectly still, centered, and in full color in every frame. This is the base layer.
- Create three additional, semi-transparent layers from the subject: one pure red, one pure green, and one pure blue.
- Animate these three color layers rotating around the static central subject.
- In the first frame, all layers are perfectly aligned, showing the original image.
- As the animation progresses, the R, G, and B layers should separate and rotate outwards from the center in different directions, creating a vibrant, shifting, moiré-like interference pattern.
- The layers should move smoothly in a circular or elliptical path before returning to the center.
- By the final frame, the layers must return to their original, perfectly aligned position to create a seamless loop.
- The effect should be subtle but hypnotic, giving a sense of depth and complex movement without the subject actually moving.
- The background must remain completely static.`;
  
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