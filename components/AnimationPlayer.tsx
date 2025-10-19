/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/


import React, { useState, useEffect, useRef, useCallback } from 'react';
import { AnimationAssets } from '../services/geminiService';
import { Frame } from '../types';
import BananaLoader from './BananaLoader';
import { InfoIcon, XCircleIcon, SettingsIcon, DownloadIcon, ArrowLeftIcon } from './icons';

// Add declaration for the gifshot library loaded from CDN
declare var gifshot: any;

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

const dataURLtoBlob = (dataurl: string): Blob => {
    const arr = dataurl.split(',');
    if (arr.length < 2) {
        throw new Error('Invalid data URL');
    }
    const mimeMatch = arr[0].match(/:(.*?);/);
    if (!mimeMatch) {
        throw new Error('Could not parse MIME type from data URL');
    }
    const mime = mimeMatch[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], { type: mime });
}


const ControlSlider: React.FC<{
    label: string;
    value: number;
    min: number;
    max: number;
    step: number;
    onChange: (value: number) => void;
    helpText: string;
}> = ({ label, value, min, max, step, onChange, helpText }) => (
    <div>
        <label htmlFor={label} className="block text-sm font-medium text-gray-300">
            {label}
        </label>
        <div className="flex items-center gap-3 mt-1">
            <input
                id={label}
                type="range"
                min={min}
                max={max}
                step={step}
                value={value}
                onChange={e => onChange(Number(e.target.value))}
                className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer accent-indigo-500"
            />
            <input
                type="number"
                value={value}
                min={min}
                max={max}
                onChange={e => onChange(Number(e.target.value))}
                className="w-20 bg-gray-900 text-white border border-gray-600 rounded-md px-2 py-1 text-center"
            />
        </div>
        <p className="text-xs text-gray-400 mt-2">{helpText}</p>
    </div>
);


type ExportFormat = 'gif' | 'video';
type GifQuality = 'low' | 'medium' | 'high';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStartExport: (format: ExportFormat, quality: GifQuality) => void;
}

const ExportModal: React.FC<ExportModalProps> = ({ isOpen, onClose, onStartExport }) => {
    const [format, setFormat] = useState<ExportFormat>('gif');
    const [quality, setQuality] = useState<GifQuality>('medium');

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50" onClick={onClose}>
            <div className="bg-gray-800 rounded-lg shadow-xl w-full max-w-sm p-6 space-y-4" onClick={e => e.stopPropagation()}>
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-bold text-white">Export Options</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-white">
                        <XCircleIcon className="w-6 h-6" />
                    </button>
                </div>
                
                <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-300">Format</label>
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
                
                <button 
                  onClick={() => onStartExport(format, quality)} 
                  className="w-full bg-green-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-green-500 transition-colors duration-200 flex items-center justify-center"
                >
                  <DownloadIcon className="w-5 h-5 mr-2" />
                  Start Export
                </button>
            </div>
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
  
  const processSpriteSheet = useCallback((img: HTMLImageElement, frameCount: number) => {
    const gridSize = Math.sqrt(frameCount);
    if (!Number.isInteger(gridSize)) {
        console.error(`Invalid frame count for square grid: ${frameCount}`);
        setIsLoading(false);
        return;
    }

    const { naturalWidth, naturalHeight } = img;
    const frameWidth = Math.floor(naturalWidth / gridSize);
    const frameHeight = Math.floor(naturalHeight / gridSize);
    const frameLayout: Frame[] = [];
    const cropAmount = 10; // Crop a bit to remove potential grid line artifacts

    for (let i = 0; i < frameCount; i++) {
        const row = Math.floor(i / gridSize);
        const col = i % gridSize;
        const initialX = col * frameWidth;
        const initialY = row * frameHeight;
        frameLayout.push({ 
            x: initialX + cropAmount, 
            y: initialY + cropAmount, 
            width: frameWidth - (cropAmount * 2), 
            height: frameHeight - (cropAmount * 2) 
        });
    }

    setDisplayFrames(frameLayout);

    const framePromises: Promise<HTMLImageElement>[] = frameLayout.map(frame => {
      return new Promise((resolve, reject) => {
        if (frame.width <= 0 || frame.height <= 0) {
            const emptyImage = new Image();
            emptyImage.onload = () => resolve(emptyImage);
            emptyImage.src = "data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=";
            return;
        }
        const frameCanvas = document.createElement('canvas');
        frameCanvas.width = frame.width;
        frameCanvas.height = frame.height;
        const frameCtx = frameCanvas.getContext('2d');
        if (frameCtx) {
          frameCtx.drawImage(img, frame.x, frame.y, frame.width, frame.height, 0, 0, frame.width, frame.height);
        }
        const frameImage = new Image();
        frameImage.onload = () => resolve(frameImage);
        frameImage.onerror = () => reject(new Error('Failed to load sliced frame image'));
        frameImage.src = frameCanvas.toDataURL();
      });
    });

    Promise.all(framePromises).then(loadedFrames => {
      setFrames(loadedFrames);
      setIsLoading(false);
    }).catch(error => {
        console.error("Error loading frame images:", error);
        setIsLoading(false);
    });
  }, []);

    const performGifExport = useCallback((quality: GifQuality) => {
        if (frames.length === 0 || !canvasRef.current) return;
        setIsExporting(true);

        const qualitySettings = {
            low: { sampleInterval: 20, numWorkers: 2 },
            medium: { sampleInterval: 10, numWorkers: 4 },
            high: { sampleInterval: 1, numWorkers: 4 },
        };

        const imageUrls = frames.map(frame => frame.src);
        const intervalInSeconds = config.speed / 1000;

        gifshot.createGIF({
            images: imageUrls,
            gifWidth: canvasRef.current.width,
            gifHeight: canvasRef.current.height,
            interval: intervalInSeconds,
            ...qualitySettings[quality],
        }, (obj: { error: boolean; image: string; errorMsg: string }) => {
            setIsExporting(false);
            if (!obj.error) {
                const a = document.createElement('a');
                a.href = obj.image;
                a.download = `${fileName}.gif`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
            } else {
                console.error('GIF export failed:', obj.errorMsg);
                alert(`GIF export failed: ${obj.errorMsg}`);
            }
        });
    }, [frames, config.speed, fileName]);
    
    const performVideoExport = useCallback(async () => {
      if (frames.length === 0 || !canvasRef.current) return;
      
      if (!('MediaRecorder' in window)) {
        alert('Video recording is not supported in your browser.');
        return;
      }

      setIsExporting(true);
      
      const offscreenCanvas = document.createElement('canvas');
      offscreenCanvas.width = canvasRef.current.width;
      offscreenCanvas.height = canvasRef.current.height;
      const ctx = offscreenCanvas.getContext('2d');

      if (!ctx) {
          setIsExporting(false);
          alert('Could not create canvas context for video export.');
          return;
      }
      
      const recordedChunks: Blob[] = [];
      const stream = offscreenCanvas.captureStream(1000 / config.speed);
      
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
          a.download = `${fileName}.${fileExtension}`;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(url);
          setIsExporting(false);
      };

      recorder.start();

      let frameIndex = 0;
      const drawFrame = () => {
          if (frameIndex < frames.length) {
              ctx.clearRect(0, 0, offscreenCanvas.width, offscreenCanvas.height);
              ctx.drawImage(frames[frameIndex], 0, 0, offscreenCanvas.width, offscreenCanvas.height);
              frameIndex++;
              setTimeout(drawFrame, config.speed);
          } else {
              // Loop the video for a few cycles to make it longer
              if (frameIndex < frames.length * 3) {
                ctx.clearRect(0, 0, offscreenCanvas.width, offscreenCanvas.height);
                ctx.drawImage(frames[frameIndex % frames.length], 0, 0, offscreenCanvas.width, offscreenCanvas.height);
                frameIndex++;
                setTimeout(drawFrame, config.speed);
              } else {
                recorder.stop();
              }
          }
      };
      drawFrame();

    }, [frames, config.speed, fileName]);
  
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
        processSpriteSheet(img, assets.frameCount);
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
    
    canvas.width = 512;
    canvas.height = 512;
    
    const animate = (timestamp: number) => {
      if(animationStartTimeRef.current === 0) animationStartTimeRef.current = timestamp;
      
      const totalDuration = frames.length * config.speed;
      let elapsedTime = timestamp - animationStartTimeRef.current;
      
      if (assets.isLooping) {
        elapsedTime = elapsedTime % totalDuration;
      }

      // If not looping and animation is finished, stop at the last frame
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
  
  const getImageDisplayDimensions = useCallback(() => {
    if (!spriteSheetImage || !containerRef.current) {
      return { x: 0, y: 0, width: 0, height: 0, scale: 1 };
    }
    const container = containerRef.current;
    const containerRect = container.getBoundingClientRect();
    const imgRatio = spriteSheetImage.naturalWidth / spriteSheetImage.naturalHeight;
    const containerRatio = containerRect.width / containerRect.height;
    let finalWidth, finalHeight, offsetX, offsetY;
  
    if (imgRatio > containerRatio) { // Image is wider than container
      finalWidth = containerRect.width;
      finalHeight = finalWidth / imgRatio;
      offsetX = 0;
      offsetY = (containerRect.height - finalHeight) / 2;
    } else { // Image is taller or same aspect ratio
      finalHeight = containerRect.height;
      finalWidth = finalHeight * imgRatio;
      offsetY = 0;
      offsetX = (containerRect.width - finalWidth) / 2;
    }
  
    return {
      width: finalWidth,
      height: finalHeight,
      x: offsetX,
      y: offsetY,
      scale: finalWidth / spriteSheetImage.naturalWidth,
    };
  }, [spriteSheetImage]);

  useEffect(() => {
    const canvas = overlayCanvasRef.current;
    const container = containerRef.current;
    const img = spriteSheetImage;

    if (viewMode !== 'spritesheet' || !canvas || !container || !img || displayFrames.length === 0) {
      if (canvas) {
        const ctx = canvas.getContext('2d');
        if (ctx) ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
      return;
    }

    const drawGrid = () => {
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const containerRect = container.getBoundingClientRect();
      canvas.width = containerRect.width;
      canvas.height = containerRect.height;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const color = '#10B981'; // green-500 for the calculated grid
      
      const { scale, x: offsetX, y: offsetY } = getImageDisplayDimensions();
      
      ctx.strokeStyle = color;
      ctx.lineWidth = 2;
      
      displayFrames.forEach((frame) => {
          const rectX = frame.x * scale + offsetX;
          const rectY = frame.y * scale + offsetY;
          const rectW = frame.width * scale;
          const rectH = frame.height * scale;
          ctx.strokeRect(rectX, rectY, rectW, rectH);
      });
    };

    const resizeObserver = new ResizeObserver(drawGrid);
    resizeObserver.observe(container);
    drawGrid(); // Initial draw

    return () => {
      resizeObserver.disconnect();
    };
  }, [viewMode, spriteSheetImage, displayFrames, getImageDisplayDimensions]);

 
  const handleStartExport = (format: ExportFormat, quality: GifQuality) => {
    setIsExportModalOpen(false);
    if (viewMode === 'spritesheet') {
      setViewMode('animation');
      setTimeout(() => {
        if (format === 'gif') performGifExport(quality);
        else performVideoExport();
      }, 100);
    } else {
      if (format === 'gif') performGifExport(quality);
      else performVideoExport();
    }
  };

  return (
    <div className="flex flex-col items-center justify-center w-full max-w-lg bg-gray-900/50 rounded-lg p-4 border border-gray-700">
      <ExportModal isOpen={isExportModalOpen} onClose={() => setIsExportModalOpen(false)} onStartExport={handleStartExport} />
      <div 
        ref={containerRef} 
        className="relative w-full max-w-lg aspect-square bg-black rounded-lg overflow-hidden shadow-2xl mb-4 flex items-center justify-center"
        >
        {isLoading ? (
           <div className="flex flex-col items-center justify-center text-center p-8">
            <BananaLoader className="w-60 h-60" />
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
                        This {assets.frameCount}-frame animation was created with just one call to the 🍌 Gemini model.
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