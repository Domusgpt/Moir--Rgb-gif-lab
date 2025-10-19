/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/


import React, { useState, useCallback, useRef } from 'react';
import { AnimationCategory, ANIMATION_DATA, UploadedImage, AnimationModifier, MODIFIERS } from './types';
import { generateAnimationAssets, AnimationAssets } from './services/geminiService';
import { buildCreativeInstruction, AnimationOptions } from './prompts';
import AnimationPlayer from './components/AnimationPlayer';
import BatchResultsView from './components/BatchResultsView';
import { XCircleIcon, UploadIcon, ChevronDownIcon, SettingsIcon } from './components/icons';
import { v4 as uuidv4 } from 'uuid';


const resizeImage = (dataUrl: string, maxWidth: number, maxHeight: number): Promise<string> => {
  // We assume maxWidth and maxHeight are the same and represent the target square size.
  const targetSize = maxWidth; 
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
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
      
      ctx.drawImage(img, sx, sy, sWidth, sHeight, 0, 0, targetSize, targetSize);
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
  const [currentTab, setCurrentTab] = useState<'setup' | 'results'>('setup');
  const [selectedVariantId, setSelectedVariantId] = useState<string>(ANIMATION_DATA[0].variants[0].id);
  const [openCategory, setOpenCategory] = useState<AnimationCategory | null>(ANIMATION_DATA[0].id);
  
  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([]);
  const [completedAnimations, setCompletedAnimations] = useState<AnimationAssets[]>([]);
  const [failedImages, setFailedImages] = useState<UploadedImage[]>([]);
  const [viewingAnimation, setViewingAnimation] = useState<AnimationAssets | null>(null);

  const [isProcessing, setIsProcessing] = useState(false);
  const [processingMessage, setProcessingMessage] = useState<string>('');
  const [newResultsCount, setNewResultsCount] = useState(0);

  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Advanced Options State
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [frameCount, setFrameCount] = useState<9 | 16>(9);
  const [frameDuration, setFrameDuration] = useState(120);
  const [isLooping, setIsLooping] = useState(true);
  const [effectIntensity, setEffectIntensity] = useState<'low' | 'medium' | 'high'>('medium');
  const [animationModifier, setAnimationModifier] = useState<AnimationModifier>('none');
  
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      setError(null);
      const newImages: UploadedImage[] = [];
      // FIX: Explicitly type `file` as `File` to fix type inference issues.
      Array.from(files).forEach((file: File) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          const baseName = file.name.split('.').slice(0, -1).join('.') || 'animation';
          newImages.push({
            id: uuidv4(),
            dataUrl: reader.result as string,
            name: baseName
          });
          // Once all files are read, update the state
          if (newImages.length === files.length) {
            setUploadedImages(prev => [...prev, ...newImages]);
          }
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const removeImage = (id: string) => {
    setUploadedImages(prev => prev.filter(image => image.id !== id));
  };

  const handleStartBatchProcessing = useCallback(async () => {
    if (uploadedImages.length === 0) {
        setError('No images selected. Cannot create animation.');
        return;
    }
    
    setIsProcessing(true);
    setError(null);
    setNewResultsCount(0);
    
    // Copy images and settings for background processing
    const imagesToProcess = [...uploadedImages];
    const animationOptions: AnimationOptions = {
      variantId: selectedVariantId,
      frameCount,
      frameDuration,
      isLooping,
      effectIntensity,
      modifier: animationModifier,
    };

    // Immediately clear the queue for the next batch
    setUploadedImages([]);

    for (let i = 0; i < imagesToProcess.length; i++) {
        const image = imagesToProcess[i];
        try {
            setProcessingMessage(`Processing ${i + 1} of ${imagesToProcess.length}: ${image.name}`);
            
            const finalCreativeInstruction = buildCreativeInstruction(animationOptions);

            const resizedImage = await resizeImage(image.dataUrl, 1024, 1024);
            const imageParts = resizedImage.match(/^data:(image\/(?:jpeg|png|webp));base64,(.*)$/);
            if (!imageParts || imageParts.length !== 3) {
              throw new Error("Could not process the resized image data.");
            }
            const mimeType = imageParts[1];
            const base64Image = imageParts[2];
            
            const imageGenerationPrompt = `
PRIMARY GOAL: Generate a single animated sprite sheet image based on the user's creative direction.

You are an expert animator. Your task is to create an animated sprite sheet.
${finalCreativeInstruction}

IMAGE OUTPUT REQUIREMENTS:
- The output MUST be a single, square image file.
- The image MUST be precisely 1024x1024 pixels.
- The image must contain the requested number of frames arranged in a square grid (3x3 for 9 frames, 4x4 for 16 frames).
- Do not add numbers to the frames.
- DO NOT return any text or JSON outside of the required format.`;
            
            const generatedAsset = await generateAnimationAssets(
                base64Image,
                mimeType,
                imageGenerationPrompt,
                image.id,
                isLooping
            );

            if (!generatedAsset || !generatedAsset.imageData.data) {
              throw new Error(`Sprite sheet generation failed. Did not receive a valid image.`);
            }

            setCompletedAnimations(prev => [...prev, { ...generatedAsset, sourceImageName: image.name }]);
            setNewResultsCount(prev => prev + 1);

        } catch (err) {
            console.error(`Failed to process image ${image.name}:`, err);
            setFailedImages(prev => [...prev, image]);
        }
    }
    
    setIsProcessing(false);
    setProcessingMessage('');
    setCurrentTab('results');

  }, [uploadedImages, selectedVariantId, frameCount, frameDuration, isLooping, effectIntensity, animationModifier]);
  
  const setupTab = (
    <div className="flex flex-col items-center justify-center w-full max-w-lg mx-auto text-center">
      <h1 className="text-4xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-500">
        Image Animator
      </h1>
      <p className="text-gray-400 mb-6">
        Create mesmerizing, looping animations from your images.
      </p>

      {/* Global Modifiers */}
      <div className="w-full mb-4">
        <label className="block text-sm font-medium text-gray-300 mb-2 text-center">Global Animation Modifier</label>
        <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
          {MODIFIERS.map(mod => (
            <button
              key={mod.id}
              onClick={() => setAnimationModifier(mod.id)}
              className={`w-full p-2 rounded-md text-sm text-center transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-900 focus-visible:ring-indigo-500 ${animationModifier === mod.id
                  ? 'bg-indigo-600 text-white font-semibold'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`
              }
              aria-pressed={animationModifier === mod.id}
            >
              {mod.name}
            </button>
          ))}
        </div>
      </div>

      <div className="w-full mb-4 space-y-2 max-h-[30vh] overflow-y-auto no-scrollbar pr-2">
        {ANIMATION_DATA.map((category) => (
          <div key={category.id} className="border border-gray-800 rounded-lg bg-gray-900/50">
            <button
              onClick={() => setOpenCategory(openCategory === category.id ? null : category.id)}
              className="w-full flex justify-between items-center p-3 text-left font-medium text-gray-200 hover:bg-gray-800 transition-colors rounded-t-lg"
              aria-expanded={openCategory === category.id}
            >
              <span>{category.name}</span>
              <ChevronDownIcon className={`w-5 h-5 transition-transform ${openCategory === category.id ? 'rotate-180' : ''}`} />
            </button>
            {openCategory === category.id && (
              <div className="p-3 border-t border-gray-800 grid grid-cols-1 sm:grid-cols-2 gap-2">
                {category.variants.map((variant) => (
                  <button
                    key={variant.id}
                    onClick={() => setSelectedVariantId(variant.id)}
                    className={`w-full p-2 rounded-md text-sm text-center transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-900 focus-visible:ring-indigo-500 ${selectedVariantId === variant.id 
                        ? 'bg-indigo-600 text-white font-semibold' 
                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`
                    }
                    aria-pressed={selectedVariantId === variant.id}
                  >
                    {variant.name}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Advanced Options */}
      <div className="w-full mb-6 border border-gray-800 rounded-lg bg-gray-900/50">
        <button
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="w-full flex justify-between items-center p-3 text-left font-medium text-gray-200 hover:bg-gray-800 transition-colors rounded-t-lg"
        >
          <div className="flex items-center gap-2">
            <SettingsIcon className="w-5 h-5" />
            <span>Advanced Options</span>
          </div>
          <ChevronDownIcon className={`w-5 h-5 transition-transform ${showAdvanced ? 'rotate-180' : ''}`} />
        </button>
        {showAdvanced && (
          <div className="p-4 border-t border-gray-800 space-y-4 text-left">
            {/* Frame Count */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Frame Count</label>
              <div className="grid grid-cols-2 gap-2">
                  <button onClick={() => setFrameCount(9)} className={`p-2 rounded-md text-center ${frameCount === 9 ? 'bg-indigo-600 text-white' : 'bg-gray-700 hover:bg-gray-600'}`}>9 Frames (3x3)</button>
                  <button onClick={() => setFrameCount(16)} className={`p-2 rounded-md text-center ${frameCount === 16 ? 'bg-indigo-600 text-white' : 'bg-gray-700 hover:bg-gray-600'}`}>16 Frames (4x4)</button>
              </div>
            </div>
            {/* Animation Speed */}
            <div>
              <label htmlFor="speed-slider" className="block text-sm font-medium text-gray-300">Animation Speed</label>
              <div className="flex items-center gap-3 mt-1">
                <input id="speed-slider" type="range" min="30" max="500" value={frameDuration} onChange={e => setFrameDuration(Number(e.target.value))} className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer accent-indigo-500"/>
                <span className="text-sm text-gray-200 w-20 text-center">{frameDuration} ms</span>
              </div>
            </div>
             {/* Effect Intensity */}
             <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Effect Intensity</label>
              <div className="grid grid-cols-3 gap-2">
                  <button onClick={() => setEffectIntensity('low')} className={`p-2 rounded-md text-center ${effectIntensity === 'low' ? 'bg-indigo-600 text-white' : 'bg-gray-700 hover:bg-gray-600'}`}>Low</button>
                  <button onClick={() => setEffectIntensity('medium')} className={`p-2 rounded-md text-center ${effectIntensity === 'medium' ? 'bg-indigo-600 text-white' : 'bg-gray-700 hover:bg-gray-600'}`}>Medium</button>
                  <button onClick={() => setEffectIntensity('high')} className={`p-2 rounded-md text-center ${effectIntensity === 'high' ? 'bg-indigo-600 text-white' : 'bg-gray-700 hover:bg-gray-600'}`}>High</button>
              </div>
            </div>
            {/* Loop Toggle */}
            <div className="flex items-center justify-between">
              <label htmlFor="loop-toggle" className="text-sm font-medium text-gray-300">Loop Animation</label>
              <button onClick={() => setIsLooping(!isLooping)} id="loop-toggle" className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors ${isLooping ? 'bg-green-500' : 'bg-gray-600'}`}>
                <span className={`inline-block w-4 h-4 transform transition-transform bg-white rounded-full ${isLooping ? 'translate-x-6' : 'translate-x-1'}`} />
              </button>
            </div>
          </div>
        )}
      </div>

      {error && (
        <div className="w-full bg-red-900/50 border border-red-700 text-red-100 px-4 py-3 rounded-lg relative mb-4 flex items-center justify-between animate-shake" role="alert">
          <div className="pr-4 text-left">
            <strong className="font-bold block">Error.</strong>
            <span className="block sm:inline">{error}</span>
          </div>
          <button onClick={() => setError(null)} className="p-1 -mr-2 flex-shrink-0" aria-label="Close error message"><XCircleIcon className="w-6 h-6" /></button>
        </div>
      )}
      
      <div
        onClick={() => fileInputRef.current?.click()}
        onDrop={(e) => {
          e.preventDefault();
          if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            handleImageUpload({ target: { files: e.dataTransfer.files } } as React.ChangeEvent<HTMLInputElement>);
          }
        }}
        onDragOver={(e) => e.preventDefault()}
        className="relative w-full min-h-[200px] bg-gray-900/50 border-2 border-dashed border-gray-600 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:bg-gray-800/50 transition-colors mb-6 p-4"
        role="button"
        aria-label="Upload an image"
      >
        {uploadedImages.length === 0 ? (
          <>
            <UploadIcon className="w-12 h-12 text-gray-500 mb-2" />
            <p className="text-gray-400 font-semibold">Click or drag to upload images</p>
            <p className="text-xs text-gray-500 mt-1">PNG, JPG, or WEBP</p>
          </>
        ) : (
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
            {uploadedImages.map(image => (
              <div key={image.id} className="relative aspect-square">
                <img src={image.dataUrl} alt={image.name} className="w-full h-full object-cover rounded-md" />
                <button 
                  onClick={(e) => { e.stopPropagation(); removeImage(image.id); }}
                  className="absolute top-1 right-1 bg-black/60 p-0.5 rounded-full text-white hover:bg-black/80 transition-colors"
                  aria-label={`Remove ${image.name}`}
                >
                  <XCircleIcon className="w-5 h-5" />
                </button>
              </div>
            ))}
          </div>
        )}
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleImageUpload}
          accept="image/png,image/jpeg,image/webp"
          className="hidden"
          multiple
          aria-hidden="true"
        />
      </div>

      <button
        onClick={() => handleStartBatchProcessing()}
        disabled={uploadedImages.length === 0 || isProcessing}
        className="px-8 py-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold text-xl rounded-lg hover:from-purple-500 hover:to-indigo-500 transition-all duration-300 transform hover:scale-105 focus:outline-none focus-visible:ring-4 focus-visible:ring-indigo-500/50 disabled:grayscale disabled:opacity-50 disabled:cursor-not-allowed"
        aria-label="Create Animation"
      >
        {isProcessing ? 'Processing...' : `Animate ${uploadedImages.length > 0 ? uploadedImages.length : ''} Image${uploadedImages.length === 1 ? '' : 's'}`}
      </button>
    </div>
  );

  return (
    <div className="h-dvh bg-black text-gray-100 flex flex-col items-center p-4">
      {viewingAnimation && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="relative w-full max-w-2xl">
            <AnimationPlayer 
              assets={viewingAnimation} 
              onBack={() => setViewingAnimation(null)}
              fileName={viewingAnimation.sourceImageName || 'animation'}
            />
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="w-full max-w-lg mb-4">
        <div className="flex border-b border-gray-700">
          <button onClick={() => setCurrentTab('setup')} className={`px-4 py-2 text-sm font-medium transition-colors ${currentTab === 'setup' ? 'border-b-2 border-indigo-500 text-white' : 'text-gray-400 hover:text-white'}`}>
            Setup
          </button>
          <button onClick={() => { setCurrentTab('results'); setNewResultsCount(0); }} className={`relative px-4 py-2 text-sm font-medium transition-colors ${currentTab === 'results' ? 'border-b-2 border-indigo-500 text-white' : 'text-gray-400 hover:text-white'}`}>
            Results
            {newResultsCount > 0 && (
              <span className="absolute top-1 right-1 flex h-5 w-5 items-center justify-center rounded-full bg-indigo-500 text-xs text-white">
                {newResultsCount}
              </span>
            )}
          </button>
        </div>
      </div>
      
      <div className="w-full grow flex items-center justify-center overflow-y-auto">
        {currentTab === 'setup' ? setupTab : (
          <BatchResultsView 
            completed={completedAnimations}
            failed={failedImages}
            onSelectAnimation={(assets) => setViewingAnimation(assets)}
          />
        )}
      </div>

      {isProcessing && (
        <div className="fixed bottom-14 left-1/2 -translate-x-1/2 w-full max-w-md bg-gray-800/80 backdrop-blur-sm text-white p-3 rounded-lg shadow-lg text-center text-sm">
          <p>{processingMessage}</p>
        </div>
      )}

      <footer className="w-full shrink-0 p-4 text-center text-gray-500 text-xs">
        Built with the Gemini API. Use of this tool may incur costs based on 
        <a href="https://ai.google.dev/gemini-api/pricing" target="_blank" rel="noopener noreferrer" className="text-indigo-400 hover:underline ml-1">
          Gemini API pricing
        </a>.
      </footer>
    </div>
  );
};

export default App;
