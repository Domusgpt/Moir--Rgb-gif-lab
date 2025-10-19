/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/


import React, { useState, useEffect, useRef, useCallback } from 'react';
import { AnimationAssets } from '../services/geminiService';
import { Frame } from '../types';
import BananaLoader from './BananaLoader';
import { InfoIcon, XCircleIcon, SettingsIcon, DownloadIcon, ArrowLeftIcon, CheckIcon } from './icons';
import { createGifFromFrames } from '../services/gifService';

interface AnimationPlayerProps {
  assets: AnimationAssets;
  onBack: () => void;
  fileName: string;
}

interface AnimationConfig {
  speed: number;
}

const DEFAULT_CONFIG: AnimationConfig = {
  speed: 120, // ms per frame
};

type ExportFormat = 'gif' | 'video';
type GifQuality = 'low' | 'medium' | 'high';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStartExport: (format: ExportFormat, quality: GifQuality, fileName: string) => void;
  defaultFileName: string;
}

const ExportModal: React.FC<ExportModalProps> = ({ isOpen, onClose, onStartExport, defaultFileName }) => {
    const [format, setFormat] = useState<ExportFormat>('gif');
    const [quality, setQuality] = useState<GifQuality>('medium');
    const [customFileName, setCustomFileName] = useState(defaultFileName);
    const [addIdentifier, setAddIdentifier] = useState(true);

    if (!isOpen) return null;
    
    const handleExportClick = () => {
        let finalName = customFileName.trim() || defaultFileName;
        if (addIdentifier) {
            finalName = `${finalName}_${Date.now()}`;
        }
        onStartExport(format, quality, finalName);
    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50" onClick={onClose}>
            <div className="bg-gray-800 rounded-lg shadow-xl w-full max-w-sm p-6 space-y-6" onClick={e => e.stopPropagation()}>
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-bold text-white">Export Options</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-white">
                        <XCircleIcon className="w-6 h-6" />
                    </button>
                </div>
                
                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Format</label>
                    <div className="grid grid-cols-2 gap-2">
                        <button onClick={() => setFormat('gif')} className={`p-2 rounded-md text-center ${format === 'gif' ? 'bg-indigo-600 text-white' : 'bg-gray-700 hover:bg-gray-600'}`}>GIF</button>
                        <button onClick={() => setFormat('video')} className={`p-2 rounded-md text-center ${format === 'video' ? 'bg-indigo-600 text-white' : 'bg-gray-700 hover:bg-gray-600'}`}>Video</button>
                    </div>
                </div>

                <div className={`space-y-2 transition-opacity ${format === 'gif' ? 'opacity-100' : 'opacity-50'}`}>
                    <label className="block text-sm font-medium text-gray-300">Quality (GIF only)</label>
                     <div className="grid grid-cols-3 gap-2">
                        <button onClick={() => setQuality('low')} disabled={format !== 'gif'} className={`p-2 rounded-md text-center ${quality === 'low' ? 'bg-indigo-600 text-white' : 'bg-gray-700 hover:bg-gray-600'} disabled:cursor-not-allowed`}>Low</button>
                        <button onClick={() => setQuality('medium')} disabled={format !== 'gif'} className={`p-2 rounded-md text-center ${quality === 'medium' ? 'bg-indigo-600 text-white' : 'bg-gray-700 hover:bg-gray-600'} disabled:cursor-not-allowed`}>Medium</button>
                        <button onClick={() => setQuality('high')} disabled={format !== 'gif'} className={`p-2 rounded-md text-center ${quality === 'high' ? 'bg-indigo-600 text-white' : 'bg-gray-700 hover:bg-gray-600'} disabled:cursor-not-allowed`}>High</button>
                    </div>
                    <p className="text-xs text-gray-400">Low quality results in a smaller file size.</p>
                </div>

                <div className='space-y-2'>
                  <label htmlFor="filename-input" className="block text-sm font-medium text-gray-300">Filename</label>
                  <input
                    id="filename-input"
                    type="text"
                    value={customFileName}
                    onChange={(e) => setCustomFileName(e.target.value)}
                    className="w-full bg-gray-900 text-white border border-gray-600 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500"
                  />
                  <div className="flex items-center gap-2 mt-2">
                      <button onClick={() => setAddIdentifier(!addIdentifier)} className={`w-5 h-5 rounded border-2 flex items-center justify-center ${addIdentifier ? 'bg-indigo-600 border-indigo-500' : 'bg-gray-700 border-gray-500'}`}>
                          {addIdentifier && <CheckIcon className="w-4 h-4 text-white" />}
                      </button>
                      <label onClick={() => setAddIdentifier(!addIdentifier)} className="text-sm text-gray-300 cursor-pointer">Add unique identifier</label>
                  </div>
                </div>
                
                <button 
                  onClick={handleExportClick} 
                  className="w-full bg-green-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-green-500 transition-colors duration-200 flex items-center justify-center"
                >
                  <DownloadIcon className="w-5 h-5 mr-2" />
                  Start Export
                </button>
            </div>
        </div>
    );
};

// FIX: Define the missing ControlSlider component.
const ControlSlider: React.FC<{
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (value: number) => void;
  helpText?: string;
}> = ({ label, value, min, max, step, onChange, helpText }) => {
  const id = React.useId ? React.useId() : `slider-${Math.random()}`;
  return (
    <div className="text-sm">
      <label htmlFor={id} className="block text-gray-300 font-medium">{label}</label>
      <div className="flex items-center gap-2 mt-1">
        <input
          id={id}
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={e => onChange(Number(e.target.value))}
          className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer accent-indigo-500"
        />
        <span className="text-gray-200 w-20 text-center">{value}</span>
      </div>
      {helpText && <p className="text-xs text-gray-400 mt-1">{helpText}</p>}
    </div>
  );
};


const AnimationPlayer: React.FC<AnimationPlayerProps> = ({ assets, onBack, fileName }) => {
  const [frames, setFrames] = useState<HTMLImageElement[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isExporting, setIsExporting] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [showControls, setShowControls] = useState(false);
  const [config, setConfig] = useState<AnimationConfig>({
    ...DEFAULT_CONFIG,
    speed: assets.frameDuration || DEFAULT_CONFIG.speed,
  });
  const [viewMode, setViewMode] = useState<'animation' | 'spritesheet'>('animation');
  const animationFrameId = useRef<number | null>(null);
  const animationStartTimeRef = useRef<number>(0);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  
  const [spriteSheetImage, setSpriteSheetImage] = useState<HTMLImageElement | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const overlayCanvasRef = useRef<HTMLCanvasElement>(null);
  const [displayFrames, setDisplayFrames] = useState<Frame[]>([]);
  
  const performAntiJitter = async (rawFrames: HTMLImageElement[]): Promise<HTMLImageElement[]> => {
    const getBoundingBox = (img: HTMLImageElement): Promise<{x: number, y: number, width: number, height: number}> => {
      return new Promise(resolve => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d', { willReadFrequently: true });
        if(!ctx) return resolve({ x: 0, y: 0, width: img.width, height: img.height });
        ctx.drawImage(img, 0, 0);
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;
        let minX = canvas.width, minY = canvas.height, maxX = -1, maxY = -1;
        const threshold = 30; // Consider pixels with alpha > threshold

        for (let y = 0; y < canvas.height; y++) {
          for (let x = 0; x < canvas.width; x++) {
            const alpha = data[(y * canvas.width + x) * 4 + 3];
            if (alpha > threshold) {
              if (x < minX) minX = x;
              if (x > maxX) maxX = x;
              if (y < minY) minY = y;
              if (y > maxY) maxY = y;
            }
          }
        }
        
        if (maxX === -1) { // Empty frame
          resolve({ x: 0, y: 0, width: img.width, height: img.height });
        } else {
          resolve({ x: minX, y: minY, width: maxX - minX + 1, height: maxY - minY + 1 });
        }
      });
    };
  
    const boundingBoxes = await Promise.all(rawFrames.map(getBoundingBox));
  
    // Calculate the union of all bounding boxes
    let unionBox = { x1: Infinity, y1: Infinity, x2: -Infinity, y2: -Infinity };
    boundingBoxes.forEach(box => {
      unionBox.x1 = Math.min(unionBox.x1, box.x);
      unionBox.y1 = Math.min(unionBox.y1, box.y);
      unionBox.x2 = Math.max(unionBox.x2, box.x + box.width);
      unionBox.y2 = Math.max(unionBox.y2, box.y + box.height);
    });
  
    const unionWidth = unionBox.x2 - unionBox.x1;
    const unionHeight = unionBox.y2 - unionBox.y1;
  
    if (unionWidth <= 0 || unionHeight <= 0) return rawFrames; // No content found
  
    const stabilizedFramesPromises = rawFrames.map(frame => {
      return new Promise<HTMLImageElement>((resolve, reject) => {
        const frameCanvas = document.createElement('canvas');
        frameCanvas.width = unionWidth;
        frameCanvas.height = unionHeight;
        const ctx = frameCanvas.getContext('2d');
        if(!ctx) return reject(new Error('Canvas context failed for stabilization'));
  
        // Draw the original frame centered within the new canvas based on the union box
        ctx.drawImage(frame, -unionBox.x1, -unionBox.y1);
        
        const newFrameImg = new Image();
        newFrameImg.onload = () => resolve(newFrameImg);
        newFrameImg.onerror = reject;
        newFrameImg.src = frameCanvas.toDataURL();
      });
    });
  
    return Promise.all(stabilizedFramesPromises);
  };
  
  const processSpriteSheet = useCallback(async (img: HTMLImageElement, frameCount: number, enableAntiJitter: boolean) => {
    const gridSize = Math.sqrt(frameCount);
    if (!Number.isInteger(gridSize)) {
        console.error(`Invalid frame count for square grid: ${frameCount}`);
        setIsLoading(false);
        return;
    }

    const { naturalWidth, naturalHeight } = img;
    const frameWidth = Math.floor(naturalWidth / gridSize);
    const frameHeight = Math.floor(naturalHeight / gridSize);
    
    // First, slice the spritesheet into raw frames
    const rawFramePromises: Promise<HTMLImageElement>[] = Array.from({length: frameCount}).map((_, i) => {
      return new Promise((resolve, reject) => {
        const frameCanvas = document.createElement('canvas');
        frameCanvas.width = frameWidth;
        frameCanvas.height = frameHeight;
        const ctx = frameCanvas.getContext('2d');
        if(!ctx) return reject(new Error('Canvas context failed'));
        const row = Math.floor(i / gridSize);
        const col = i % gridSize;
        ctx.drawImage(img, col * frameWidth, row * frameHeight, frameWidth, frameHeight, 0, 0, frameWidth, frameHeight);
        
        const frameImage = new Image();
        frameImage.onload = () => resolve(frameImage);
        frameImage.onerror = reject;
        frameImage.src = frameCanvas.toDataURL();
      });
    });
    
    try {
      const rawFrames = await Promise.all(rawFramePromises);
      
      if(enableAntiJitter && rawFrames.length > 0) {
        const stabilizedFrames = await performAntiJitter(rawFrames);
        setFrames(stabilizedFrames);
      } else {
        setFrames(rawFrames);
      }
      setIsLoading(false);
    } catch(error) {
       console.error("Error processing frames:", error);
       setIsLoading(false);
    }
  }, []);

    const performGifExport = useCallback(async (quality: GifQuality, finalFileName: string) => {
        if (frames.length === 0 || !canvasRef.current) return;
        setIsExporting(true);
        try {
          const gifUrl = await createGifFromFrames(frames, config.speed, quality);
          const a = document.createElement('a');
          a.href = gifUrl;
          a.download = `${finalFileName}.gif`;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
        } catch(e) {
          console.error('GIF export failed:', e);
          alert(`GIF export failed: ${e}`);
        } finally {
           setIsExporting(false);
        }
    }, [frames, config.speed]);
    
    const performVideoExport = useCallback(async (finalFileName: string) => {
      if (frames.length === 0 || !canvasRef.current) return;
      
      if (!('MediaRecorder' in window)) {
        alert('Video recording is not supported in your browser.');
        return;
      }

      setIsExporting(true);
      
      const offscreenCanvas = document.createElement('canvas');
      // Use the dimensions of the first stabilized frame for the video
      offscreenCanvas.width = frames[0].width;
      offscreenCanvas.height = frames[0].height;
      const ctx = offscreenCanvas.getContext('2d');

      if (!ctx) {
          setIsExporting(false);
          alert('Could not create canvas context for video export.');
          return;
      }
      
      const recordedChunks: Blob[] = [];
      const stream = offscreenCanvas.captureStream(30); // 30 FPS
      
      const mimeTypes = ['video/mp4; codecs=avc1', 'video/webm; codecs=vp9', 'video/webm'];
      const supportedMimeType = mimeTypes.find(type => MediaRecorder.isTypeSupported(type));

      if (!supportedMimeType) {
        setIsExporting(false);
        alert('No supported video format found for recording (MP4 or WebM).');
        return;
      }
      
      const recorder = new MediaRecorder(stream, { mimeType: supportedMimeType });
      const fileExtension = supportedMimeType.startsWith('video/mp4') ? 'mp4' : 'webm';
      
      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
            recordedChunks.push(event.data);
        }
      };
      
      recorder.onstop = () => {
          const blob = new Blob(recordedChunks, { type: supportedMimeType });
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `${finalFileName}.${fileExtension}`;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(url);
          setIsExporting(false);
      };

      recorder.start();

      let frameIndex = 0;
      const totalAnimationTime = frames.length * config.speed;
      const loopCount = 3;
      const totalRecordTime = assets.isLooping ? Math.max(3000, totalAnimationTime * loopCount) : totalAnimationTime; // Record for at least 3 seconds if looping
      const startTime = performance.now();

      const drawFrame = () => {
        const elapsedTime = performance.now() - startTime;
        if (elapsedTime >= totalRecordTime) {
            recorder.stop();
            return;
        }

        frameIndex = Math.floor((elapsedTime % totalAnimationTime) / config.speed);

        ctx.clearRect(0, 0, offscreenCanvas.width, offscreenCanvas.height);
        ctx.drawImage(frames[frameIndex], 0, 0, offscreenCanvas.width, offscreenCanvas.height);

        requestAnimationFrame(drawFrame);
      };
      drawFrame();

    }, [frames, config.speed, assets.isLooping]);
  
  useEffect(() => {
    if (!assets.imageData || !assets.imageData.data) {
        setIsLoading(false);
        return;
    }
    
    setIsLoading(true);
    setFrames([]);

    const img = new Image();
    img.onload = () => {
        setSpriteSheetImage(img);
        processSpriteSheet(img, assets.frameCount, assets.enableAntiJitter);
    }
    img.onerror = () => {
        console.error("Failed to load generated image.");
        setIsLoading(false);
    }
    img.src = `data:${assets.imageData.mimeType};base64,${assets.imageData.data}`;
  }, [assets, processSpriteSheet]);

  useEffect(() => {
    if (frames.length === 0 || !canvasRef.current || isLoading || viewMode !== 'animation') {
      if(animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
        animationFrameId.current = null;
      }
      return;
    }

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Set canvas dimensions based on the processed frames
    canvas.width = frames[0].width;
    canvas.height = frames[0].height;
    
    const animate = (timestamp: number) => {
      if(animationStartTimeRef.current === 0) animationStartTimeRef.current = timestamp;
      
      const totalDuration = frames.length * config.speed;
      let elapsedTime = timestamp - animationStartTimeRef.current;
      
      if (assets.isLooping) {
        elapsedTime = elapsedTime % totalDuration;
      }

      if (!assets.isLooping && elapsedTime >= totalDuration) {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          if (frames[frames.length - 1]) {
              ctx.drawImage(frames[frames.length - 1], 0, 0, canvas.width, canvas.height);
          }
          if (animationFrameId.current) {
              cancelAnimationFrame(animationFrameId.current);
              animationFrameId.current = null;
          }
          return;
      }

      const currentFrameIndex = Math.min(frames.length - 1, Math.floor(elapsedTime / config.speed));

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      if (frames[currentFrameIndex]) {
        ctx.drawImage(frames[currentFrameIndex], 0, 0, canvas.width, canvas.height);
      }
      
      animationFrameId.current = requestAnimationFrame(animate);
    };

    animationFrameId.current = requestAnimationFrame(animate);

    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
        animationFrameId.current = null;
      }
    };
  }, [frames, config, isLoading, viewMode, assets.isLooping]);
  
  const handleStartExport = (format: ExportFormat, quality: GifQuality, finalFileName: string) => {
    setIsExportModalOpen(false);
    if (viewMode === 'spritesheet') {
      setViewMode('animation');
      setTimeout(() => {
        if (format === 'gif') performGifExport(quality, finalFileName);
        else performVideoExport(finalFileName);
      }, 100);
    } else {
      if (format === 'gif') performGifExport(quality, finalFileName);
      else performVideoExport(finalFileName);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center w-full max-w-lg bg-gray-900/50 rounded-lg p-4 border border-gray-700">
      <ExportModal 
        isOpen={isExportModalOpen} 
        onClose={() => setIsExportModalOpen(false)} 
        onStartExport={handleStartExport}
        defaultFileName={fileName}
      />
      <div 
        ref={containerRef} 
        className="relative w-full max-w-lg aspect-square bg-black rounded-lg overflow-hidden shadow-2xl mb-4 flex items-center justify-center"
        >
        {isLoading ? (
           <div className="flex flex-col items-center justify-center text-center p-8">
            <BananaLoader className="w-60 h-60" />
            <p className="mt-4 text-gray-300">Processing Frames...</p>
          </div>
        ) : (
            <>
              <div className="absolute top-4 right-4 z-20 flex items-center gap-2">
                {viewMode === 'animation' && (
                  <button
                    onClick={() => setShowControls(prev => !prev)}
                    className="bg-black/50 p-2 rounded-full text-white hover:bg-black/75 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-black focus-visible:ring-indigo-500"
                    aria-label={showControls ? 'Hide animation controls' : 'Show animation controls'}
                  >
                    <SettingsIcon className={`w-6 h-6 transition-colors ${showControls ? 'text-yellow-400' : ''}`} />
                  </button>
                )}
                <button
                  onClick={() => {
                    const newMode = viewMode === 'animation' ? 'spritesheet' : 'animation';
                    setViewMode(newMode);
                    if (newMode === 'spritesheet') setShowControls(false);
                  }}
                  className="bg-black/50 p-2 rounded-full text-white hover:bg-black/75 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-black focus-visible:ring-indigo-500"
                  aria-label={viewMode === 'animation' ? 'Show info and sprite sheet' : 'Close info and show animation'}
                >
                  {viewMode === 'animation' ? <InfoIcon className="w-6 h-6" /> : <XCircleIcon className="w-6 h-6 text-yellow-400" />}
                </button>
              </div>

              {viewMode === 'animation' && (
                <canvas ref={canvasRef} className={'w-full aspect-square object-contain'} />
              )}
              {viewMode === 'spritesheet' && spriteSheetImage && (
                <>
                  <img 
                      src={spriteSheetImage.src} 
                      alt="Generated Sprite Sheet" 
                      className="max-w-full max-h-full object-contain bg-gray-800" 
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-black/60 p-4 text-center z-10 backdrop-blur-sm">
                    <p className="text-sm text-gray-200 max-w-prose mx-auto">
                        This {assets.frameCount}-frame animation was created with just one call to the Gemini model.
                    </p>
                  </div>
                </>
              )}
               {frames.length === 0 && !isLoading && viewMode === 'animation' && (
                  <div className="text-center text-red-400 p-4">
                      <h3 className="text-lg font-bold">No frames found</h3>
                      <p className="text-sm">Could not extract frames from the source image.</p>
                  </div>
              )}
            </>
        )}
        <canvas ref={overlayCanvasRef} className="absolute top-0 left-0 pointer-events-none" />
        {showControls && viewMode === 'animation' && (
          <div className="absolute bottom-0 left-0 right-0 bg-black/70 p-4 z-30 backdrop-blur-sm space-y-2">
            <ControlSlider label="Animation Speed (ms/frame)" value={config.speed} min={16} max={2000} step={1} onChange={v => setConfig(c => ({...c, speed: v}))} helpText="Lower values are faster."/>
            <button onClick={() => setConfig({ ...DEFAULT_CONFIG, speed: assets.frameDuration || DEFAULT_CONFIG.speed })} className="text-sm text-indigo-400 hover:text-indigo-300">Reset to Defaults</button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-2 w-full">
        <button onClick={onBack} className="bg-gray-700 text-white font-bold py-3 px-4 rounded-lg hover:bg-gray-600 transition-colors duration-200 flex items-center justify-center focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-black focus-visible:ring-gray-500">
            <ArrowLeftIcon className="w-5 h-5 mr-2" />
            Back
        </button>
        <button onClick={() => setIsExportModalOpen(true)} disabled={isExporting} className="bg-green-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-green-500 transition-colors duration-200 flex items-center justify-center disabled:bg-green-800 disabled:cursor-not-allowed focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-black focus-visible:ring-green-500">
            <DownloadIcon className="w-5 h-5 mr-2" />
            {isExporting ? 'Exporting...' : 'Export'}
        </button>
      </div>
    </div>
  );
};

export default AnimationPlayer;