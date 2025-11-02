/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Clear Seas Solution - Holographic Cyberpunk Theme
*/

import React from 'react';
import { QualityTier, QUALITY_TIERS } from '../types';
import { formatCost } from '../services/costTrackingService';

interface QualitySelectorProps {
  value: QualityTier;
  onChange: (tier: QualityTier) => void;
  disabled?: boolean;
}

const QualitySelector: React.FC<QualitySelectorProps> = ({
  value,
  onChange,
  disabled = false
}) => {
  return (
    <div className="quality-selector">
      <label className="quality-selector-label">
        ⚡ Quality Tier Selection
      </label>
      <div className="quality-options">
        {(Object.keys(QUALITY_TIERS) as QualityTier[]).map((tier) => {
          const config = QUALITY_TIERS[tier];
          const isSelected = value === tier;
          const isFree = tier === 'nano';

          return (
            <div
              key={tier}
              className={`quality-option ${isSelected ? 'selected' : ''} ${disabled ? 'disabled' : ''} tier-${tier}`}
              onClick={() => !disabled && onChange(tier)}
            >
              {/* Skeuomorphic glass reflection shine */}
              <div className="glass-shine"></div>

              <div className="quality-header">
                <span className="quality-name">{config.label}</span>
                {isFree && <span className="free-badge">FREE</span>}
              </div>

              {/* Holographic separator line */}
              <div className="holo-divider"></div>

              <div className="quality-specs">
                <div className="spec-item">
                  <span className="spec-icon">📐</span>
                  <div className="spec-details">
                    <span className="spec-label">Resolution</span>
                    <span className="spec-value">{config.resolution}×{config.resolution}</span>
                  </div>
                </div>
                <div className="spec-item">
                  <span className="spec-icon">🎞️</span>
                  <div className="spec-details">
                    <span className="spec-label">Frames</span>
                    <span className="spec-value">{config.frameCount}</span>
                  </div>
                </div>
                <div className="spec-item">
                  <span className="spec-icon">💎</span>
                  <div className="spec-details">
                    <span className="spec-label">Cost</span>
                    <span className="spec-value cost-value">{formatCost(config.estimatedCost)}</span>
                  </div>
                </div>
              </div>

              <div className="quality-description">{config.description}</div>

              {/* Skeuomorphic selected indicator with 3D depth */}
              {isSelected && (
                <div className="selected-indicator">
                  <span className="check-mark">✓</span>
                </div>
              )}

              {/* Neon glow pulse effect on hover */}
              <div className="neon-pulse-ring"></div>
            </div>
          );
        })}
      </div>

      <style>{`
        /* Quality Selector - Holographic Cyberpunk Theme */
        .quality-selector {
          margin: 24px 0;
        }

        .quality-selector-label {
          display: block;
          font-weight: 700;
          margin-bottom: 20px;
          font-size: 18px;
          color: #FFFFFF;
          text-shadow: 0 0 15px rgba(176, 38, 255, 0.8),
                       0 0 30px rgba(255, 0, 110, 0.5);
          letter-spacing: 0.5px;
        }

        .quality-options {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: 20px;
        }

        /* Skeuomorphic 3D card with glass morphism */
        .quality-option {
          position: relative;
          border: 2px solid rgba(176, 38, 255, 0.3);
          border-radius: 16px;
          padding: 20px;
          cursor: pointer;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          background: linear-gradient(145deg, rgba(26, 26, 26, 0.8), rgba(10, 10, 10, 0.9));
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.5),
                      inset 0 1px 0 rgba(255, 255, 255, 0.05),
                      inset 0 -1px 0 rgba(0, 0, 0, 0.5);
          overflow: hidden;
        }

        /* Glass reflection shine effect */
        .glass-shine {
          position: absolute;
          top: -50%;
          left: -50%;
          width: 200%;
          height: 200%;
          background: linear-gradient(
            45deg,
            transparent 30%,
            rgba(255, 255, 255, 0.03) 50%,
            transparent 70%
          );
          transform: rotate(45deg);
          transition: all 0.6s ease;
          pointer-events: none;
        }

        .quality-option:hover .glass-shine {
          transform: rotate(45deg) translate(50%, 50%);
        }

        /* Neon pulse ring effect */
        .neon-pulse-ring {
          position: absolute;
          top: -2px;
          left: -2px;
          right: -2px;
          bottom: -2px;
          border-radius: 16px;
          opacity: 0;
          transition: all 0.4s ease;
          pointer-events: none;
        }

        .quality-option.tier-nano:hover .neon-pulse-ring {
          opacity: 1;
          box-shadow: 0 0 20px rgba(176, 38, 255, 0.6),
                      0 0 40px rgba(176, 38, 255, 0.4),
                      inset 0 0 20px rgba(176, 38, 255, 0.2);
        }

        .quality-option.tier-preview:hover .neon-pulse-ring {
          opacity: 1;
          box-shadow: 0 0 20px rgba(255, 0, 110, 0.6),
                      0 0 40px rgba(255, 0, 110, 0.4),
                      inset 0 0 20px rgba(255, 0, 110, 0.2);
        }

        .quality-option.tier-standard:hover .neon-pulse-ring {
          opacity: 1;
          box-shadow: 0 0 20px rgba(255, 190, 11, 0.6),
                      0 0 40px rgba(255, 190, 11, 0.4),
                      inset 0 0 20px rgba(255, 190, 11, 0.2);
        }

        .quality-option.tier-hd:hover .neon-pulse-ring {
          opacity: 1;
          box-shadow: 0 0 30px rgba(176, 38, 255, 0.8),
                      0 0 60px rgba(255, 0, 110, 0.6),
                      inset 0 0 30px rgba(176, 38, 255, 0.3);
        }

        .quality-option:hover:not(.disabled) {
          transform: translateY(-4px) scale(1.02);
          border-color: rgba(176, 38, 255, 0.6);
          box-shadow: 0 12px 32px rgba(176, 38, 255, 0.4),
                      0 6px 16px rgba(255, 0, 110, 0.3),
                      inset 0 2px 0 rgba(255, 255, 255, 0.1),
                      inset 0 -2px 0 rgba(0, 0, 0, 0.5);
        }

        /* Selected state - Holographic border */
        .quality-option.selected {
          border: 2px solid transparent;
          background: linear-gradient(145deg, rgba(26, 26, 26, 0.95), rgba(10, 10, 10, 0.95)) padding-box,
                      linear-gradient(135deg, #B026FF 0%, #FF006E 50%, #FFBE0B 100%) border-box;
          transform: translateY(-2px) scale(1.02);
          box-shadow: 0 8px 32px rgba(176, 38, 255, 0.6),
                      0 4px 16px rgba(255, 0, 110, 0.5),
                      inset 0 2px 0 rgba(255, 255, 255, 0.15),
                      inset 0 -2px 0 rgba(0, 0, 0, 0.6);
        }

        .quality-option.selected:hover {
          box-shadow: 0 12px 48px rgba(176, 38, 255, 0.7),
                      0 6px 24px rgba(255, 0, 110, 0.6),
                      inset 0 2px 0 rgba(255, 255, 255, 0.2);
        }

        .quality-option.disabled {
          opacity: 0.4;
          cursor: not-allowed;
          filter: grayscale(0.8);
        }

        .quality-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;
        }

        .quality-name {
          font-weight: 700;
          font-size: 17px;
          color: #FFFFFF;
          text-shadow: 0 0 10px rgba(176, 38, 255, 0.6);
        }

        /* Skeuomorphic embossed free badge */
        .free-badge {
          background: linear-gradient(145deg, rgba(255, 190, 11, 0.9), rgba(255, 190, 11, 0.7));
          color: #000000;
          padding: 4px 12px;
          border-radius: 12px;
          font-size: 10px;
          font-weight: 900;
          letter-spacing: 0.5px;
          box-shadow: 0 0 15px rgba(255, 190, 11, 0.8),
                      inset 0 1px 0 rgba(255, 255, 255, 0.4),
                      inset 0 -1px 0 rgba(0, 0, 0, 0.3);
          text-shadow: 0 1px 0 rgba(255, 255, 255, 0.5);
        }

        /* Holographic divider line */
        .holo-divider {
          height: 2px;
          margin: 16px 0;
          background: linear-gradient(90deg,
            transparent 0%,
            rgba(176, 38, 255, 0.5) 25%,
            rgba(255, 0, 110, 0.5) 50%,
            rgba(255, 190, 11, 0.5) 75%,
            transparent 100%
          );
          box-shadow: 0 0 10px rgba(176, 38, 255, 0.5);
        }

        .quality-specs {
          display: flex;
          flex-direction: column;
          gap: 12px;
          margin-bottom: 16px;
        }

        /* Skeuomorphic spec items with inset depth */
        .spec-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 10px 12px;
          background: linear-gradient(145deg, rgba(10, 10, 10, 0.9), rgba(0, 0, 0, 0.8));
          border-radius: 8px;
          box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.7),
                      inset 0 -1px 2px rgba(255, 255, 255, 0.03),
                      0 1px 0 rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(176, 38, 255, 0.2);
        }

        .spec-icon {
          font-size: 18px;
          filter: drop-shadow(0 0 8px rgba(176, 38, 255, 0.6));
        }

        .spec-details {
          display: flex;
          flex-direction: column;
          gap: 2px;
          flex: 1;
        }

        .spec-label {
          font-size: 11px;
          color: #808080;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          font-weight: 600;
        }

        .spec-value {
          font-weight: 700;
          font-size: 15px;
          color: #FFFFFF;
          text-shadow: 0 0 8px rgba(176, 38, 255, 0.5);
        }

        .spec-value.cost-value {
          background: linear-gradient(135deg, #FFBE0B 0%, #FF006E 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          text-shadow: none;
          filter: drop-shadow(0 0 6px rgba(255, 190, 11, 0.6));
        }

        .quality-description {
          font-size: 12px;
          color: #808080;
          line-height: 1.5;
          text-align: center;
          padding: 8px 0;
        }

        /* Skeuomorphic 3D selected indicator */
        .selected-indicator {
          position: absolute;
          top: 12px;
          right: 12px;
          width: 36px;
          height: 36px;
          background: linear-gradient(145deg, rgba(176, 38, 255, 0.9), rgba(255, 0, 110, 0.8));
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 0 20px rgba(176, 38, 255, 0.8),
                      0 0 40px rgba(255, 0, 110, 0.6),
                      inset 0 2px 4px rgba(255, 255, 255, 0.3),
                      inset 0 -2px 4px rgba(0, 0, 0, 0.5);
          animation: neonPulse 2s ease-in-out infinite;
        }

        .check-mark {
          color: #FFFFFF;
          font-weight: 900;
          font-size: 20px;
          text-shadow: 0 0 10px rgba(0, 0, 0, 0.8),
                       0 2px 0 rgba(0, 0, 0, 0.5);
          filter: drop-shadow(0 0 8px rgba(255, 255, 255, 0.8));
        }

        /* Tier-specific hover effects */
        .quality-option.tier-nano:hover {
          border-color: rgba(176, 38, 255, 0.6);
        }

        .quality-option.tier-preview:hover {
          border-color: rgba(255, 0, 110, 0.6);
        }

        .quality-option.tier-standard:hover {
          border-color: rgba(255, 190, 11, 0.6);
        }

        .quality-option.tier-hd:hover {
          border: 2px solid transparent;
          background: linear-gradient(145deg, rgba(26, 26, 26, 0.9), rgba(10, 10, 10, 0.95)) padding-box,
                      linear-gradient(135deg, #B026FF 0%, #FF006E 50%, #FFBE0B 100%) border-box;
        }

        @media (max-width: 768px) {
          .quality-options {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 480px) {
          .quality-option {
            padding: 16px;
          }

          .quality-name {
            font-size: 15px;
          }

          .spec-icon {
            font-size: 16px;
          }
        }
      `}</style>
    </div>
  );
};

export default QualitySelector;
