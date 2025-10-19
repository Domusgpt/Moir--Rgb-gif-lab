/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React from 'react';
import { AnimationAssets } from '../services/geminiService';
import { UploadedImage } from '../types';
import { PlayIcon } from './icons';

interface BatchResultsViewProps {
    completed: AnimationAssets[];
    failed: UploadedImage[];
    onSelectAnimation: (assets: AnimationAssets) => void;
}

const AnimationThumbnail: React.FC<{ assets: AnimationAssets, onSelect: () => void }> = ({ assets, onSelect }) => {
    const [thumbnailUrl, setThumbnailUrl] = React.useState<string | null>(null);

    React.useEffect(() => {
        // Extract the first frame to use as a static thumbnail
        const img = new Image();
        img.onload = () => {
            const gridSize = Math.sqrt(assets.frameCount);
            const frameWidth = Math.floor(img.naturalWidth / gridSize);
            const frameHeight = Math.floor(img.naturalHeight / gridSize);
            
            const canvas = document.createElement('canvas');
            canvas.width = frameWidth;
            canvas.height = frameHeight;
            const ctx = canvas.getContext('2d');
            if (ctx) {
                // Draw the first frame (top-left)
                ctx.drawImage(img, 0, 0, frameWidth, frameHeight, 0, 0, frameWidth, frameHeight);
                setThumbnailUrl(canvas.toDataURL());
            }
        };
        img.src = `data:${assets.imageData.mimeType};base64,${assets.imageData.data}`;
    }, [assets]);

    return (
        <div 
            className="relative aspect-square bg-black rounded-lg overflow-hidden cursor-pointer group"
            onClick={onSelect}
        >
            {thumbnailUrl ? (
                <img src={thumbnailUrl} alt={assets.sourceImageName} className="w-full h-full object-cover" />
            ) : (
                <div className="w-full h-full bg-gray-800 animate-pulse"></div>
            )}
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center p-2">
                <PlayIcon className="w-10 h-10 text-white" />
                <p className="text-white text-xs text-center font-semibold truncate mt-1">{assets.sourceImageName}</p>
            </div>
        </div>
    );
};

const BatchResultsView: React.FC<BatchResultsViewProps> = ({ completed, failed, onSelectAnimation }) => {
    if (completed.length === 0 && failed.length === 0) {
        return (
            <div className="text-center text-gray-400">
                <h2 className="text-2xl font-bold mb-2">No Results Yet</h2>
                <p>Your completed animations will appear here.</p>
            </div>
        );
    }
    
    return (
        <div className="w-full max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-4 text-center text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-500">
                Animation Results
            </h2>
            <p className="text-center text-gray-400 mb-6">{completed.length} successful, {failed.length} failed.</p>

            {completed.length > 0 && (
                <div className="mb-8">
                    <h3 className="text-xl font-semibold mb-3 text-gray-200">Successful Animations</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                        {completed.map(assets => (
                            <AnimationThumbnail key={assets.sourceImageId} assets={assets} onSelect={() => onSelectAnimation(assets)} />
                        ))}
                    </div>
                </div>
            )}

            {failed.length > 0 && (
                <div className="mb-8">
                    <h3 className="text-xl font-semibold mb-3 text-red-400">Failed Images</h3>
                    <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-3">
                        <ul className="space-y-2">
                            {failed.map(image => (
                                <li key={image.id} className="flex items-center gap-3 text-sm text-gray-300">
                                    <img src={image.dataUrl} alt={image.name} className="w-10 h-10 object-cover rounded" />
                                    <span className="truncate">{image.name}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BatchResultsView;
