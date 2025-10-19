/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/


import React from 'react';

const BananaLoader: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <div className={`relative ${className || 'w-24 h-24'}`}>
      <svg viewBox="0 0 100 100" className="w-full h-full">
        {/* Static outer circle */}
        <circle cx="50" cy="50" r="45" stroke="rgba(139, 92, 246, 0.3)" strokeWidth="4" fill="none" />
        {/* Rotating diamond */}
        <path
          d="M50 10 L90 50 L50 90 L10 50 Z"
          stroke="#a78bfa"
          strokeWidth="4"
          fill="none"
          strokeLinecap="round"
          className="animate-spin"
          style={{ transformOrigin: '50% 50%' }}
        />
      </svg>
    </div>
  );
};

export default BananaLoader;