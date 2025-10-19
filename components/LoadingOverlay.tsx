/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React from 'react';
import BananaLoader from './BananaLoader';

interface LoadingOverlayProps {
  message: string;
}

const LoadingOverlay: React.FC<LoadingOverlayProps> = ({ message }) => {
  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center z-50">
      <BananaLoader className="w-36 h-36" />
      <p className="mt-4 text-lg text-gray-200 animate-pulse">{message}</p>
    </div>
  );
};

export default LoadingOverlay;