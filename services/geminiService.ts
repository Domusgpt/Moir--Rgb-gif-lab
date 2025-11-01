/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/



import { GoogleGenAI, GenerateContentResponse, Modality } from "@google/genai";
import { QualityTier, AnimationMetadata } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
const imageModel = 'gemini-2.5-flash-image';

export interface AnimationAssets {
  sourceImageId: string;
  sourceImageName?: string;
  imageData: { data: string, mimeType: string };
  frameCount: number;
  frameDuration: number;
  isLooping: boolean;
  enableAntiJitter: boolean;
  qualityTier?: QualityTier;
  metadata?: AnimationMetadata; // Full metadata structure
}

const base64ToGenerativePart = (base64: string, mimeType: string) => {
    return {
      inlineData: {
        data: base64,
        mimeType,
      },
    };
};

export const generateAnimationAssets = async (
    base64UserImage: string | null,
    mimeType: string | null,
    imagePrompt: string,
    sourceImageId: string,
    isLooping: boolean,
    enableAntiJitter: boolean,
    expectsJson: boolean = true, // Default to true for main generation
    qualityTier: QualityTier = 'standard',
    variantId?: string,
    variantName?: string,
    sourceImageName?: string,
    effectIntensity?: 'low' | 'medium' | 'high',
    modifier?: string
): Promise<AnimationAssets | null> => {
  try {
    const imageGenTextPart = { text: imagePrompt };
    const parts = [];

    if (base64UserImage && mimeType) {
        const userImagePart = base64ToGenerativePart(base64UserImage, mimeType);
        parts.push(userImagePart);
    }
    parts.push(imageGenTextPart);
    
    const imageGenResponse: GenerateContentResponse = await ai.models.generateContent({
        model: imageModel,
        contents: [{
            role: "user",
            parts: parts,
        }],
    });

    const responseParts = imageGenResponse.candidates?.[0]?.content?.parts;
    if (!responseParts) {
        throw new Error("Invalid response from model. No parts found.");
    }

    const imagePart = responseParts.find(p => p.inlineData);
    if (!imagePart?.inlineData?.data) {
        console.error("No image part found in response from image generation model", imageGenResponse);
        const text = responseParts.find(p => p.text)?.text;
        throw new Error(`Model did not return an image. Response: ${text ?? "<no text>"}`);
    }
    const imageData = { data: imagePart.inlineData.data, mimeType: imagePart.inlineData.mimeType };
    
    let frameDuration = 120;
    let frameCount = 9;
    
    if (expectsJson) {
      const textPart = responseParts.find(p => p.text);
      if (textPart?.text) {
          try {
              const jsonStringMatch = textPart.text.match(/{.*}/s);
              if (jsonStringMatch) {
                  const parsed = JSON.parse(jsonStringMatch[0]);
                  if (parsed.frameDuration && typeof parsed.frameDuration === 'number') {
                      frameDuration = parsed.frameDuration;
                  }
                  if (parsed.frameCount && typeof parsed.frameCount === 'number') {
                    frameCount = parsed.frameCount;
                }
              }
          } catch (e) {
              console.warn("Could not parse animation data from model response. Using defaults.", e);
          }
      }
    }


    // Generate metadata
    const metadata = generateMetadata(
      sourceImageId,
      sourceImageName || 'Unknown',
      variantId || 'unknown',
      variantName,
      qualityTier,
      frameCount,
      frameDuration,
      isLooping,
      effectIntensity || 'medium',
      modifier as any || 'none',
      enableAntiJitter,
      imageData.data
    );

    return {
      sourceImageId,
      sourceImageName,
      imageData,
      frameCount,
      frameDuration,
      isLooping,
      enableAntiJitter,
      qualityTier,
      metadata
    };
  } catch (error) {
    console.error("Error during asset generation:", error);
    throw new Error(`Failed to process image. ${error instanceof Error ? error.message : ''}`);
  }
};

// Helper function to generate animation metadata
const generateMetadata = (
  sourceImageId: string,
  sourceImageName: string,
  variantId: string,
  variantName: string | undefined,
  qualityTier: QualityTier,
  totalFrames: number,
  frameDuration: number,
  isLooping: boolean,
  effectIntensity: 'low' | 'medium' | 'high',
  modifier: any,
  enableAntiJitter: boolean,
  spriteSheetData: string
): AnimationMetadata => {
  const gridSize = Math.sqrt(totalFrames);
  const resolution = qualityTier === 'nano' ? 256 : qualityTier === 'preview' ? 512 : 1024;
  const frameWidth = resolution / gridSize;
  const frameHeight = resolution / gridSize;

  // Generate frame metadata
  const frames = Array.from({ length: totalFrames }, (_, i) => {
    const row = Math.floor(i / gridSize);
    const col = i % gridSize;

    return {
      frameNumber: i,
      timestamp: i * frameDuration,
      gridPosition: { row, col },
      sourceRect: {
        x: col * frameWidth,
        y: row * frameHeight,
        width: frameWidth,
        height: frameHeight
      },
      isKeyFrame: i === 0 || i === totalFrames - 1 // First and last frames are key frames
    };
  });

  // Estimate cost based on quality tier
  const costEstimates: Record<QualityTier, number> = {
    nano: 0.001,
    preview: 0.003,
    standard: 0.006,
    hd: 0.006
  };

  return {
    version: '1.0.0',
    generatedAt: new Date().toISOString(),
    sourceImageId,
    sourceImageName,
    variantId,
    variantName,
    qualityTier,
    resolution,
    totalFrames,
    frameDuration,
    totalDuration: totalFrames * frameDuration,
    isLooping,
    gridSize,
    frames,
    generationOptions: {
      effectIntensity,
      modifier,
      enableAntiJitter
    },
    costEstimate: costEstimates[qualityTier],
    spriteSheetUrl: `data:image/png;base64,${spriteSheetData}`
  };
};
