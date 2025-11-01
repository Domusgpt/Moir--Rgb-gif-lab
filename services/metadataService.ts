/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import { AnimationMetadata } from "../types";

/**
 * Export animation metadata as JSON file
 */
export const exportMetadataAsJson = (metadata: AnimationMetadata, filename?: string): void => {
  const jsonString = JSON.stringify(metadata, null, 2);
  const blob = new Blob([jsonString], { type: 'application/json' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.download = filename || `animation-metadata-${metadata.sourceImageId}-${Date.now()}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

/**
 * Export simplified frame data (just positions and timing)
 */
export const exportFrameDataAsJson = (metadata: AnimationMetadata, filename?: string): void => {
  const frameData = {
    animation: {
      totalFrames: metadata.totalFrames,
      frameDuration: metadata.frameDuration,
      totalDuration: metadata.totalDuration,
      isLooping: metadata.isLooping,
      resolution: metadata.resolution,
      gridSize: metadata.gridSize
    },
    frames: metadata.frames.map(frame => ({
      frameNumber: frame.frameNumber,
      timestamp: frame.timestamp,
      gridPosition: frame.gridPosition,
      sourceRect: frame.sourceRect
    }))
  };

  const jsonString = JSON.stringify(frameData, null, 2);
  const blob = new Blob([jsonString], { type: 'application/json' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.download = filename || `frames-${metadata.sourceImageId}-${Date.now()}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

/**
 * Generate a human-readable report of the animation
 */
export const generateMetadataReport = (metadata: AnimationMetadata): string => {
  return `
=== Animation Metadata Report ===

Generated: ${new Date(metadata.generatedAt).toLocaleString()}
Metadata Version: ${metadata.version}

SOURCE
------
Image ID: ${metadata.sourceImageId}
Image Name: ${metadata.sourceImageName}
Variant: ${metadata.variantName || metadata.variantId}

QUALITY
-------
Tier: ${metadata.qualityTier.toUpperCase()}
Resolution: ${metadata.resolution}×${metadata.resolution}
Estimated Cost: $${metadata.costEstimate.toFixed(4)}

ANIMATION DETAILS
-----------------
Total Frames: ${metadata.totalFrames}
Grid Layout: ${metadata.gridSize}×${metadata.gridSize}
Frame Duration: ${metadata.frameDuration}ms
Total Duration: ${metadata.totalDuration}ms (${(metadata.totalDuration / 1000).toFixed(2)}s)
Looping: ${metadata.isLooping ? 'Yes' : 'No'}

GENERATION OPTIONS
------------------
Effect Intensity: ${metadata.generationOptions.effectIntensity}
Modifier: ${metadata.generationOptions.modifier}
Anti-Jitter: ${metadata.generationOptions.enableAntiJitter ? 'Enabled' : 'Disabled'}

FRAME BREAKDOWN
---------------
${metadata.frames.map(frame =>
  `Frame ${frame.frameNumber}: ${frame.timestamp}ms | Grid(${frame.gridPosition.row},${frame.gridPosition.col}) | Rect(${frame.sourceRect.x},${frame.sourceRect.y},${frame.sourceRect.width}×${frame.sourceRect.height})${frame.isKeyFrame ? ' [KEY]' : ''}`
).join('\n')}

=================================
  `.trim();
};

/**
 * Export metadata report as text file
 */
export const exportMetadataReport = (metadata: AnimationMetadata, filename?: string): void => {
  const report = generateMetadataReport(metadata);
  const blob = new Blob([report], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.download = filename || `animation-report-${metadata.sourceImageId}-${Date.now()}.txt`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
