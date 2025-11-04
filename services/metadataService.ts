/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Clear Seas Solution - Enhanced Metadata Service
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

/**
 * Export metadata as CSV file
 */
export const exportMetadataAsCSV = (metadata: AnimationMetadata, filename?: string): void => {
  const csv = [
    // Header
    ['Property', 'Value'],
    ['Source Image ID', metadata.sourceImageId],
    ['Source Image Name', metadata.sourceImageName],
    ['Variant ID', metadata.variantId],
    ['Variant Name', metadata.variantName || ''],
    ['Quality Tier', metadata.qualityTier],
    ['Resolution', `${metadata.resolution}×${metadata.resolution}`],
    ['Total Frames', metadata.totalFrames.toString()],
    ['Frame Duration', `${metadata.frameDuration}ms`],
    ['Total Duration', `${metadata.totalDuration}ms`],
    ['Is Looping', metadata.isLooping ? 'Yes' : 'No'],
    ['Grid Size', `${metadata.gridSize}×${metadata.gridSize}`],
    ['Effect Intensity', metadata.generationOptions.effectIntensity],
    ['Modifier', metadata.generationOptions.modifier],
    ['Anti-Jitter', metadata.generationOptions.enableAntiJitter ? 'Enabled' : 'Disabled'],
    ['Cost Estimate', `$${metadata.costEstimate.toFixed(4)}`],
    ['Generated At', new Date(metadata.generatedAt).toLocaleString()],
    [''],
    ['Frame Data'],
    ['Frame', 'Timestamp (ms)', 'Grid Row', 'Grid Col', 'Source X', 'Source Y', 'Width', 'Height', 'Key Frame'],
    ...metadata.frames.map(frame => [
      frame.frameNumber.toString(),
      frame.timestamp.toString(),
      frame.gridPosition.row.toString(),
      frame.gridPosition.col.toString(),
      frame.sourceRect.x.toString(),
      frame.sourceRect.y.toString(),
      frame.sourceRect.width.toString(),
      frame.sourceRect.height.toString(),
      frame.isKeyFrame ? 'Yes' : 'No'
    ])
  ].map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');

  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.download = filename || `animation-metadata-${metadata.sourceImageId}-${Date.now()}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

/**
 * Export metadata as XML file
 */
export const exportMetadataAsXML = (metadata: AnimationMetadata, filename?: string): void => {
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<animation>
  <metadata>
    <version>${metadata.version}</version>
    <generatedAt>${metadata.generatedAt}</generatedAt>
  </metadata>
  <source>
    <imageId>${metadata.sourceImageId}</imageId>
    <imageName>${metadata.sourceImageName}</imageName>
    <variantId>${metadata.variantId}</variantId>
    <variantName>${metadata.variantName || ''}</variantName>
  </source>
  <quality>
    <tier>${metadata.qualityTier}</tier>
    <resolution>${metadata.resolution}</resolution>
    <costEstimate>${metadata.costEstimate}</costEstimate>
  </quality>
  <animation>
    <totalFrames>${metadata.totalFrames}</totalFrames>
    <frameDuration>${metadata.frameDuration}</frameDuration>
    <totalDuration>${metadata.totalDuration}</totalDuration>
    <isLooping>${metadata.isLooping}</isLooping>
    <gridSize>${metadata.gridSize}</gridSize>
  </animation>
  <generationOptions>
    <effectIntensity>${metadata.generationOptions.effectIntensity}</effectIntensity>
    <modifier>${metadata.generationOptions.modifier}</modifier>
    <enableAntiJitter>${metadata.generationOptions.enableAntiJitter}</enableAntiJitter>
  </generationOptions>
  <frames>
${metadata.frames.map(frame => `    <frame number="${frame.frameNumber}">
      <timestamp>${frame.timestamp}</timestamp>
      <gridPosition row="${frame.gridPosition.row}" col="${frame.gridPosition.col}" />
      <sourceRect x="${frame.sourceRect.x}" y="${frame.sourceRect.y}" width="${frame.sourceRect.width}" height="${frame.sourceRect.height}" />
      <isKeyFrame>${frame.isKeyFrame || false}</isKeyFrame>
    </frame>`).join('\n')}
  </frames>
</animation>`;

  const blob = new Blob([xml], { type: 'application/xml' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.download = filename || `animation-metadata-${metadata.sourceImageId}-${Date.now()}.xml`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

/**
 * Copy metadata to clipboard as formatted text
 */
export const copyMetadataToClipboard = async (metadata: AnimationMetadata): Promise<boolean> => {
  try {
    const text = generateMetadataReport(metadata);
    await navigator.clipboard.writeText(text);
    return true;
  } catch (error) {
    console.error('Failed to copy to clipboard:', error);
    return false;
  }
};

/**
 * Export all formats at once (ZIP would require additional library)
 */
export const exportAllFormats = (metadata: AnimationMetadata): void => {
  const timestamp = Date.now();
  const baseName = `animation-${metadata.sourceImageId}-${timestamp}`;

  // Export all formats with consistent naming
  exportMetadataAsJson(metadata, `${baseName}.json`);
  setTimeout(() => exportFrameDataAsJson(metadata, `${baseName}-frames.json`), 100);
  setTimeout(() => exportMetadataReport(metadata, `${baseName}-report.txt`), 200);
  setTimeout(() => exportMetadataAsCSV(metadata, `${baseName}.csv`), 300);
  setTimeout(() => exportMetadataAsXML(metadata, `${baseName}.xml`), 400);
};

/**
 * Preview metadata as formatted string (for display in UI)
 */
export const previewMetadata = (metadata: AnimationMetadata): string => {
  return `${metadata.variantName || metadata.variantId} | ${metadata.qualityTier.toUpperCase()} | ${metadata.totalFrames} frames | ${metadata.totalDuration}ms | $${metadata.costEstimate.toFixed(4)}`;
};
