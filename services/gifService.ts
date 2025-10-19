/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

// Add declaration for the gifshot library loaded from CDN
declare var gifshot: any;

type GifQuality = 'low' | 'medium' | 'high';

export const createGifFromFrames = (frames: HTMLImageElement[], frameDuration: number, quality: GifQuality = 'medium'): Promise<string> => {
    return new Promise((resolve, reject) => {
        if (frames.length === 0) {
            return reject(new Error('No frames provided for GIF creation.'));
        }

        const qualitySettings = {
            low: { sampleInterval: 20, numWorkers: 2 },
            medium: { sampleInterval: 10, numWorkers: 4 },
            high: { sampleInterval: 1, numWorkers: 4 },
        };

        const imageUrls = frames.map(frame => frame.src);
        const intervalInSeconds = frameDuration / 1000;

        gifshot.createGIF({
            images: imageUrls,
            gifWidth: frames[0].width,
            gifHeight: frames[0].height,
            interval: intervalInSeconds,
            ...qualitySettings[quality],
        }, (obj: { error: boolean; image: string; errorMsg: string }) => {
            if (!obj.error) {
                resolve(obj.image);
            } else {
                reject(new Error(obj.errorMsg));
            }
        });
    });
};
