/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/


import React, { useState, useCallback, useRef } from 'react';
import { AppState } from './types';
import { generateAnimationAssets, AnimationAssets } from './services/geminiService';
import { buildCreativeInstruction } from './prompts';
import AnimationPlayer from './components/AnimationPlayer';
import LoadingOverlay from './components/LoadingOverlay';
import { XCircleIcon, UploadIcon } from './components/icons';

const resizeImage = (dataUrl: string, maxWidth: number, maxHeight: number): Promise<string> => {
  // We assume maxWidth and maxHeight are the same and represent the target square size.
  const targetSize = maxWidth; 
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      console.log(`[DEBUG] Original image dimensions: ${img.naturalWidth}x${img.naturalHeight}`);
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      if (!ctx) {
        return reject(new Error('Could not get canvas context for resizing.'));
      }

      canvas.width = targetSize;
      canvas.height = targetSize;

      const { width, height } = img;
      let sx, sy, sWidth, sHeight;

      // This logic finds the largest possible square in the center of the image
      if (width > height) { // Landscape
        sWidth = height;
        sHeight = height;
        sx = (width - height) / 2;
        sy = 0;
      } else { // Portrait or square
        sWidth = width;
        sHeight = width;
        sx = 0;
        sy = (height - width) / 2;
      }
      
      // Draw the cropped square from the source image onto the target canvas, resizing it in the process.
      ctx.drawImage(img, sx, sy, sWidth, sHeight, 0, 0, targetSize, targetSize);
      
      // Force JPEG format for smaller file size, which is better for uploads.
      const resizedDataUrl = canvas.toDataURL('image/jpeg', 0.9);
      resolve(resizedDataUrl);
    };
    img.onerror = () => {
      reject(new Error('Failed to load image for resizing.'));
    };
    img.src = dataUrl;
  });
};

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>(AppState.Capturing);
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [animationAssets, setAnimationAssets] = useState<AnimationAssets | null>(null);
  const [loadingMessage, setLoadingMessage] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setOriginalImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const FRAME_COUNT = 9;
  const SPRITE_SHEET_WIDTH = 1024;
  const SPRITE_SHEET_HEIGHT = 1024;

  const handleCreateAnimation = useCallback(async (isRegeneration: boolean = false) => {
    if (!originalImage) {
        setError('No image selected. Cannot create animation.');
        return;
    }

    const finalCreativeInstruction = buildCreativeInstruction(originalImage, FRAME_COUNT);

    setAppState(AppState.Processing);
    setError(null);
    
    let base64Image: string | null = null;
    let mimeType: string | null = null;

    try {
      if (originalImage) {
        setLoadingMessage('Optimizing image...');
        const resizedImage = await resizeImage(originalImage, 1024, 1024);
        const imageParts = resizedImage.match(/^data:(image\/(?:jpeg|png|webp));base64,(.*)$/);
        if (!imageParts || imageParts.length !== 3) {
          throw new Error("Could not process the resized image data.");
        }
        mimeType = imageParts[1];
        base64Image = imageParts[2];
      }
      
      setLoadingMessage('Generating sprite sheet...');

      const imageGenerationPrompt = `
PRIMARY GOAL: Generate a single animated sprite sheet image.

You are an expert animator. Your task is to create a ${FRAME_COUNT}-frame animated sprite sheet.
${finalCreativeInstruction}

IMAGE OUTPUT REQUIREMENTS:
- The output MUST be a single, square image file.
- The image MUST be precisely ${SPRITE_SHEET_WIDTH}x${SPRITE_SHEET_HEIGHT} pixels.
- The image must contain ${FRAME_COUNT} animation frames arranged in a 3x3 grid (3 rows, 3 columns).
- Do not add numbers to the frames.
- DO NOT return any text or JSON. Only the image is required.`;
      
      const generatedAsset = await generateAnimationAssets(
          base64Image,
          mimeType,
          imageGenerationPrompt,
          (message: string) => setLoadingMessage(message)
      );

      if (!generatedAsset || !generatedAsset.imageData.data) {
        throw new Error(`Sprite sheet generation failed. Did not receive a valid image.`);
      }

      setAnimationAssets(generatedAsset);
      setAppState(AppState.Animating);

    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
      setAppState(AppState.Capturing);
    }
  }, [originalImage]);
  
  const handleBack = () => {
    setAppState(AppState.Capturing);
    setAnimationAssets(null);
  };

  const renderContent = () => {
    switch (appState) {
      case AppState.Capturing:
        return (
          <div className="flex flex-col items-center justify-center w-full max-w-md mx-auto text-center">
            <h1 className="text-4xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-500">
              Polytopal Animator
            </h1>
            <p className="text-gray-400 mb-8">
              Create a mesmerizing, looping animation of any image.
            </p>

            {error && (
              <div className="w-full bg-red-900/50 border border-red-700 text-red-100 px-4 py-3 rounded-lg relative mb-4 flex items-center justify-between animate-shake" role="alert">
                <div className="pr-4 text-left">
                  <strong className="font-bold block">Animation failed.</strong>
                  <span className="block sm:inline">{error}</span>
                </div>
                <button
                  onClick={() => setError(null)}
                  className="p-1 -mr-2 flex-shrink-0"
                  aria-label="Close error message"
                >
                  <XCircleIcon className="w-6 h-6" />
                </button>
              </div>
            )}
            
            <div className="relative w-full max-w-sm aspect-square flex items-center justify-center mb-8">
              {originalImage ? (
                <>
                  <img src={originalImage} alt="Image to be animated" className="w-full h-full object-contain rounded-lg shadow-2xl shadow-indigo-500/20" />
                  <button
                    onClick={() => {
                      setOriginalImage(null);
                      if (fileInputRef.current) fileInputRef.current.value = '';
                    }}
                    className="absolute top-2 right-2 bg-black/50 p-1 rounded-full text-white hover:bg-black/75 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-black focus-visible:ring-white"
                    aria-label="Clear image"
                  >
                    <XCircleIcon className="w-6 h-6" />
                  </button>
                </>
              ) : (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  onDrop={(e) => {
                    e.preventDefault();
                    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                      handleImageUpload({ target: { files: e.dataTransfer.files } } as React.ChangeEvent<HTMLInputElement>);
                    }
                  }}
                  onDragOver={(e) => e.preventDefault()}
                  className="w-full h-full bg-gray-900/50 border-2 border-dashed border-gray-600 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:bg-gray-800/50 transition-colors"
                  role="button"
                  aria-label="Upload an image"
                >
                  <UploadIcon className="w-12 h-12 text-gray-500 mb-2" />
                  <p className="text-gray-400 font-semibold">Click or drag to upload</p>
                  <p className="text-xs text-gray-500 mt-1">PNG, JPG, or WEBP</p>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleImageUpload}
                    accept="image/png,image/jpeg,image/webp"
                    className="hidden"
                    aria-hidden="true"
                  />
                </div>
              )}
            </div>

            <button
              onClick={() => handleCreateAnimation()}
              disabled={!originalImage || appState === AppState.Processing}
              className="px-8 py-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold text-xl rounded-lg hover:from-purple-500 hover:to-indigo-500 transition-all duration-300 transform hover:scale-105 focus:outline-none focus-visible:ring-4 focus-visible:ring-indigo-500/50 disabled:grayscale disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Create Animation"
            >
              Animate Image
            </button>
          </div>
        );
      case AppState.Processing:
        return <LoadingOverlay message={loadingMessage} />;
      case AppState.Animating:
        return animationAssets ? <AnimationPlayer assets={animationAssets} onRegenerate={() => handleCreateAnimation(true)} onBack={handleBack} /> : null;
      case AppState.Error:
        return (
          <div className="text-center bg-red-900/50 p-8 rounded-lg max-w-md w-full">
            <p className="text-gray-200 mb-6 font-medium text-lg">{error}</p>
            <button
              onClick={handleBack}
              className="bg-indigo-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-indigo-500 transition-colors duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-black focus-visible:ring-indigo-500"
            >
              Try Again
            </button>
          </div>
        );
    }
  };

  return (
    <div className="h-dvh bg-black text-gray-100 flex flex-col items-center p-4 overflow-y-auto">
      <div className="w-full grow flex items-center justify-center">
        {renderContent()}
      </div>
      <footer className="w-full shrink-0 p-4 text-center text-gray-500 text-xs">
        Built with the Gemini API
      </footer>
    </div>
  );
};

export default App;
