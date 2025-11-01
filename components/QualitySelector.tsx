/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
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
      <label className="quality-selector-label">Quality Tier</label>
      <div className="quality-options">
        {(Object.keys(QUALITY_TIERS) as QualityTier[]).map((tier) => {
          const config = QUALITY_TIERS[tier];
          const isSelected = value === tier;
          const isFree = tier === 'nano';

          return (
            <div
              key={tier}
              className={`quality-option ${isSelected ? 'selected' : ''} ${disabled ? 'disabled' : ''}`}
              onClick={() => !disabled && onChange(tier)}
            >
              <div className="quality-header">
                <span className="quality-name">{config.label}</span>
                {isFree && <span className="free-badge">FREE</span>}
              </div>
              <div className="quality-specs">
                <div className="spec-item">
                  <span className="spec-label">Resolution:</span>
                  <span className="spec-value">{config.resolution}×{config.resolution}</span>
                </div>
                <div className="spec-item">
                  <span className="spec-label">Frames:</span>
                  <span className="spec-value">{config.frameCount}</span>
                </div>
                <div className="spec-item">
                  <span className="spec-label">Cost:</span>
                  <span className="spec-value">{formatCost(config.estimatedCost)}</span>
                </div>
              </div>
              <div className="quality-description">{config.description}</div>
              {isSelected && <div className="selected-indicator">✓</div>}
            </div>
          );
        })}
      </div>

      <style>{`
        .quality-selector {
          margin: 16px 0;
        }

        .quality-selector-label {
          display: block;
          font-weight: 600;
          margin-bottom: 12px;
          font-size: 14px;
          color: #212529;
        }

        .quality-options {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 12px;
        }

        .quality-option {
          position: relative;
          border: 2px solid #dee2e6;
          border-radius: 8px;
          padding: 16px;
          cursor: pointer;
          transition: all 0.2s;
          background: white;
        }

        .quality-option:hover:not(.disabled) {
          border-color: #007bff;
          box-shadow: 0 2px 8px rgba(0, 123, 255, 0.1);
          transform: translateY(-2px);
        }

        .quality-option.selected {
          border-color: #007bff;
          background: #f0f8ff;
        }

        .quality-option.disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .quality-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 12px;
        }

        .quality-name {
          font-weight: 600;
          font-size: 15px;
          color: #212529;
        }

        .free-badge {
          background: #28a745;
          color: white;
          padding: 2px 8px;
          border-radius: 12px;
          font-size: 11px;
          font-weight: 700;
        }

        .quality-specs {
          display: flex;
          flex-direction: column;
          gap: 6px;
          margin-bottom: 12px;
        }

        .spec-item {
          display: flex;
          justify-content: space-between;
          font-size: 13px;
        }

        .spec-label {
          color: #6c757d;
        }

        .spec-value {
          font-weight: 600;
          color: #212529;
        }

        .quality-description {
          font-size: 12px;
          color: #6c757d;
          line-height: 1.4;
        }

        .selected-indicator {
          position: absolute;
          top: 8px;
          right: 8px;
          width: 24px;
          height: 24px;
          background: #007bff;
          color: white;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-size: 14px;
        }

        @media (max-width: 768px) {
          .quality-options {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};

export default QualitySelector;
