/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Clear Seas Solution - Holographic Cyberpunk Theme
*/

import React, { useState, useEffect } from 'react';
import {
  getUsageStats,
  formatCost,
  checkFreeTierStatus,
  getCostSummary,
  resetUsageStats
} from '../services/costTrackingService';
import { QualityTier, QUALITY_TIERS } from '../types';

interface CostTrackerProps {
  currentQualityTier?: QualityTier;
  pendingGenerations?: number;
}

const CostTracker: React.FC<CostTrackerProps> = ({
  currentQualityTier = 'standard',
  pendingGenerations = 0
}) => {
  const [stats, setStats] = useState(getUsageStats());
  const [expanded, setExpanded] = useState(false);
  const [showSummary, setShowSummary] = useState(false);

  // Refresh stats periodically
  useEffect(() => {
    const interval = setInterval(() => {
      setStats(getUsageStats());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const freeTierStatus = checkFreeTierStatus();
  const currentCost = QUALITY_TIERS[currentQualityTier].estimatedCost;
  const estimatedBatchCost = currentCost * pendingGenerations;

  const handleReset = () => {
    if (confirm('Reset usage statistics? This cannot be undone.')) {
      resetUsageStats();
      setStats(getUsageStats());
    }
  };

  return (
    <div className="cost-tracker">
      {/* Compact View - Skeuomorphic embossed panel */}
      <div
        className="cost-tracker-header"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="cost-tracker-summary">
          <span className="cost-label">⚡ Session Cost:</span>
          <span className="cost-value">{formatCost(stats.totalCost)}</span>
          {pendingGenerations > 0 && (
            <span className="cost-estimate">
              (+{formatCost(estimatedBatchCost)} pending)
            </span>
          )}
        </div>
        <span className={`expand-icon ${expanded ? 'expanded' : ''}`}>▼</span>
      </div>

      {/* Expanded View */}
      {expanded && (
        <div className="cost-tracker-details">
          {/* Free Tier Status - Glass morphism card */}
          <div className="free-tier-status">
            <h4>🎯 Free Tier Status</h4>
            <div className="free-tier-limits">
              <div className="limit-item">
                <span>Nano Remaining:</span>
                <span className={`limit-value ${freeTierStatus.nanoRemaining > 0 ? 'available' : 'depleted'}`}>
                  {freeTierStatus.nanoRemaining}/10
                </span>
              </div>
              <div className="limit-item">
                <span>Standard Remaining:</span>
                <span className={`limit-value ${freeTierStatus.standardRemaining > 0 ? 'available' : 'depleted'}`}>
                  {freeTierStatus.standardRemaining}/2
                </span>
              </div>
              <div className="limit-item">
                <span>Budget Remaining:</span>
                <span className={`limit-value ${freeTierStatus.costRemaining > 0 ? 'available' : 'depleted'}`}>
                  {formatCost(freeTierStatus.costRemaining)}
                </span>
              </div>
            </div>
            {!freeTierStatus.withinLimits && (
              <div className="limit-warning">
                ⚠️ Free tier limit reached. Upgrade to continue.
              </div>
            )}
          </div>

          {/* Usage Breakdown - Holographic table */}
          <div className="usage-breakdown">
            <h4>📊 Usage Breakdown</h4>
            <div className="usage-table-container">
              <table className="usage-table">
                <thead>
                  <tr>
                    <th>Tier</th>
                    <th>Count</th>
                    <th>Cost</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><span className="tier-badge nano">Nano</span></td>
                    <td>{stats.generationsByTier.nano}</td>
                    <td className="cost-cell">{formatCost(stats.costByTier.nano)}</td>
                  </tr>
                  <tr>
                    <td><span className="tier-badge preview">Preview</span></td>
                    <td>{stats.generationsByTier.preview}</td>
                    <td className="cost-cell">{formatCost(stats.costByTier.preview)}</td>
                  </tr>
                  <tr>
                    <td><span className="tier-badge standard">Standard</span></td>
                    <td>{stats.generationsByTier.standard}</td>
                    <td className="cost-cell">{formatCost(stats.costByTier.standard)}</td>
                  </tr>
                  <tr>
                    <td><span className="tier-badge hd">HD</span></td>
                    <td>{stats.generationsByTier.hd}</td>
                    <td className="cost-cell">{formatCost(stats.costByTier.hd)}</td>
                  </tr>
                  <tr className="total-row">
                    <td><strong>Total</strong></td>
                    <td><strong>{stats.totalGenerations}</strong></td>
                    <td className="cost-cell"><strong>{formatCost(stats.totalCost)}</strong></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Current Selection - Skeuomorphic raised card */}
          <div className="current-selection">
            <h4>🎨 Current Quality Tier</h4>
            <div className="tier-info">
              <div className="tier-name">{QUALITY_TIERS[currentQualityTier].label}</div>
              <div className="tier-description">
                {QUALITY_TIERS[currentQualityTier].description}
              </div>
              <div className="tier-cost">
                Cost per generation: <span className="cost-highlight">{formatCost(currentCost)}</span>
              </div>
            </div>
          </div>

          {/* Actions - Neon buttons */}
          <div className="cost-tracker-actions">
            <button
              onClick={() => setShowSummary(true)}
              className="btn-holographic"
            >
              <span className="btn-text">View Summary</span>
            </button>
            <button
              onClick={handleReset}
              className="btn-danger-neon"
            >
              <span className="btn-text">Reset Stats</span>
            </button>
          </div>
        </div>
      )}

      {/* Summary Modal - Glass morphism overlay */}
      {showSummary && (
        <div className="modal-overlay" onClick={() => setShowSummary(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3 className="modal-title">💎 Cost Summary</h3>
            <pre className="summary-text">{getCostSummary()}</pre>
            <button onClick={() => setShowSummary(false)} className="btn-close">
              Close
            </button>
          </div>
        </div>
      )}

      <style>{`
        /* Cost Tracker - Holographic Cyberpunk Theme */
        .cost-tracker {
          position: relative;
          background: linear-gradient(135deg, rgba(176, 38, 255, 0.1) 0%, rgba(255, 0, 110, 0.05) 100%);
          border: 2px solid transparent;
          background-clip: padding-box;
          border-radius: 16px;
          padding: 16px;
          margin: 16px 0;
          font-size: 14px;
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          box-shadow: 0 8px 32px rgba(176, 38, 255, 0.3),
                      inset 0 1px 0 rgba(255, 255, 255, 0.1);
        }

        /* Skeuomorphic embossed header */
        .cost-tracker-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 12px;
          cursor: pointer;
          border-radius: 12px;
          background: linear-gradient(145deg, rgba(26, 26, 26, 0.9), rgba(10, 10, 10, 0.9));
          box-shadow: inset 0 2px 4px rgba(255, 255, 255, 0.05),
                      inset 0 -2px 4px rgba(0, 0, 0, 0.5),
                      0 4px 12px rgba(176, 38, 255, 0.2);
          transition: all 0.3s ease;
        }

        .cost-tracker-header:hover {
          background: linear-gradient(145deg, rgba(176, 38, 255, 0.15), rgba(255, 0, 110, 0.1));
          box-shadow: inset 0 2px 4px rgba(255, 255, 255, 0.1),
                      inset 0 -2px 4px rgba(0, 0, 0, 0.5),
                      0 6px 20px rgba(255, 0, 110, 0.4);
        }

        .cost-tracker-summary {
          display: flex;
          gap: 16px;
          align-items: center;
        }

        .cost-label {
          font-weight: 600;
          color: #E0E0E0;
          text-shadow: 0 0 10px rgba(176, 38, 255, 0.5);
        }

        .cost-value {
          font-weight: 700;
          font-size: 18px;
          background: linear-gradient(135deg, #B026FF 0%, #FF006E 50%, #FFBE0B 100%);
          background-size: 200% 200%;
          animation: holoShimmer 3s ease-in-out infinite;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          filter: drop-shadow(0 0 8px rgba(176, 38, 255, 0.6));
        }

        .cost-estimate {
          color: #FFBE0B;
          font-size: 12px;
          text-shadow: 0 0 10px rgba(255, 190, 11, 0.6);
        }

        .expand-icon {
          transition: transform 0.3s ease;
          font-size: 14px;
          color: #B026FF;
          filter: drop-shadow(0 0 6px rgba(176, 38, 255, 0.8));
        }

        .expand-icon.expanded {
          transform: rotate(180deg);
          color: #FF006E;
          filter: drop-shadow(0 0 6px rgba(255, 0, 110, 0.8));
        }

        .cost-tracker-details {
          margin-top: 20px;
          padding-top: 20px;
          border-top: 1px solid rgba(176, 38, 255, 0.3);
        }

        .cost-tracker-details h4 {
          margin: 0 0 16px 0;
          font-size: 16px;
          font-weight: 700;
          color: #FFFFFF;
          text-shadow: 0 0 12px rgba(255, 0, 110, 0.6);
        }

        /* Glass morphism free tier card */
        .free-tier-status {
          margin-bottom: 24px;
          background: rgba(0, 0, 0, 0.6);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 1px solid rgba(176, 38, 255, 0.3);
          border-radius: 12px;
          padding: 16px;
          box-shadow: 0 4px 24px rgba(255, 0, 110, 0.2);
        }

        .free-tier-limits {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        /* Skeuomorphic embossed limit items */
        .limit-item {
          display: flex;
          justify-content: space-between;
          padding: 12px 16px;
          background: linear-gradient(145deg, rgba(10, 10, 10, 0.8), rgba(26, 26, 26, 0.6));
          border-radius: 8px;
          box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.6),
                      inset 0 -1px 2px rgba(255, 255, 255, 0.05),
                      0 2px 8px rgba(176, 38, 255, 0.15);
          color: #E0E0E0;
        }

        .limit-value {
          font-weight: 700;
          font-size: 16px;
        }

        .limit-value.available {
          color: #FFBE0B;
          text-shadow: 0 0 10px rgba(255, 190, 11, 0.8);
        }

        .limit-value.depleted {
          color: #FF006E;
          text-shadow: 0 0 10px rgba(255, 0, 110, 0.8);
        }

        .limit-warning {
          margin-top: 12px;
          padding: 12px;
          background: rgba(255, 0, 110, 0.1);
          border: 1px solid #FF006E;
          border-radius: 8px;
          color: #FFBE0B;
          font-size: 13px;
          text-shadow: 0 0 8px rgba(255, 190, 11, 0.6);
          box-shadow: 0 0 20px rgba(255, 0, 110, 0.3);
        }

        /* Holographic table */
        .usage-breakdown {
          margin-bottom: 24px;
        }

        .usage-table-container {
          border-radius: 12px;
          overflow: hidden;
          border: 1px solid rgba(176, 38, 255, 0.4);
          box-shadow: 0 4px 24px rgba(176, 38, 255, 0.3);
        }

        .usage-table {
          width: 100%;
          border-collapse: collapse;
          background: rgba(10, 10, 10, 0.8);
        }

        .usage-table th,
        .usage-table td {
          padding: 12px 16px;
          text-align: left;
        }

        .usage-table thead {
          background: linear-gradient(135deg, rgba(176, 38, 255, 0.3) 0%, rgba(255, 0, 110, 0.2) 100%);
          font-weight: 700;
          color: #FFFFFF;
          text-shadow: 0 0 10px rgba(176, 38, 255, 0.8);
        }

        .usage-table tbody tr {
          border-bottom: 1px solid rgba(176, 38, 255, 0.2);
          transition: all 0.3s ease;
        }

        .usage-table tbody tr:hover {
          background: rgba(176, 38, 255, 0.1);
        }

        .usage-table tbody tr:last-child {
          border-bottom: none;
        }

        .usage-table .total-row {
          background: linear-gradient(135deg, rgba(255, 0, 110, 0.2) 0%, rgba(255, 190, 11, 0.15) 100%);
          font-weight: 700;
          border-top: 2px solid rgba(176, 38, 255, 0.5);
        }

        /* Tier badges with neon glow */
        .tier-badge {
          display: inline-block;
          padding: 4px 12px;
          border-radius: 6px;
          font-size: 11px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .tier-badge.nano {
          background: rgba(176, 38, 255, 0.2);
          color: #B026FF;
          border: 1px solid #B026FF;
          box-shadow: 0 0 10px rgba(176, 38, 255, 0.5);
        }

        .tier-badge.preview {
          background: rgba(255, 0, 110, 0.2);
          color: #FF006E;
          border: 1px solid #FF006E;
          box-shadow: 0 0 10px rgba(255, 0, 110, 0.5);
        }

        .tier-badge.standard {
          background: rgba(255, 190, 11, 0.2);
          color: #FFBE0B;
          border: 1px solid #FFBE0B;
          box-shadow: 0 0 10px rgba(255, 190, 11, 0.5);
        }

        .tier-badge.hd {
          background: linear-gradient(135deg, rgba(176, 38, 255, 0.2) 0%, rgba(255, 0, 110, 0.2) 100%);
          color: #FFFFFF;
          border: 1px solid transparent;
          border-image: linear-gradient(135deg, #B026FF 0%, #FF006E 100%) 1;
          box-shadow: 0 0 15px rgba(176, 38, 255, 0.6);
        }

        .cost-cell {
          color: #FFBE0B;
          font-weight: 600;
          text-shadow: 0 0 8px rgba(255, 190, 11, 0.6);
        }

        /* Skeuomorphic raised current selection card */
        .current-selection {
          margin-bottom: 24px;
        }

        .tier-info {
          background: linear-gradient(145deg, rgba(26, 26, 26, 0.9), rgba(10, 10, 10, 0.9));
          padding: 16px;
          border-radius: 12px;
          border: 1px solid rgba(176, 38, 255, 0.3);
          box-shadow: 0 6px 20px rgba(176, 38, 255, 0.4),
                      inset 0 1px 0 rgba(255, 255, 255, 0.1);
        }

        .tier-name {
          font-weight: 700;
          font-size: 18px;
          margin-bottom: 8px;
          background: linear-gradient(135deg, #B026FF 0%, #FF006E 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .tier-description {
          color: #808080;
          font-size: 13px;
          margin-bottom: 12px;
        }

        .tier-cost {
          color: #E0E0E0;
          font-weight: 500;
          font-size: 14px;
        }

        .cost-highlight {
          color: #FFBE0B;
          font-weight: 700;
          text-shadow: 0 0 10px rgba(255, 190, 11, 0.8);
        }

        /* Neon holographic buttons */
        .cost-tracker-actions {
          display: flex;
          gap: 12px;
        }

        .cost-tracker-actions button {
          position: relative;
          flex: 1;
          padding: 12px 24px;
          border: none;
          border-radius: 10px;
          cursor: pointer;
          font-size: 14px;
          font-weight: 700;
          overflow: hidden;
          transition: all 0.3s ease;
        }

        .btn-holographic {
          background: linear-gradient(135deg, #B026FF 0%, #FF006E 50%, #FFBE0B 100%);
          background-size: 200% 200%;
          animation: holoShimmer 3s ease-in-out infinite;
          box-shadow: 0 0 20px rgba(176, 38, 255, 0.6),
                      inset 0 1px 0 rgba(255, 255, 255, 0.2);
        }

        .btn-holographic:hover {
          transform: translateY(-2px);
          box-shadow: 0 0 30px rgba(176, 38, 255, 0.8),
                      0 6px 20px rgba(255, 0, 110, 0.6),
                      inset 0 1px 0 rgba(255, 255, 255, 0.3);
        }

        .btn-danger-neon {
          background: linear-gradient(145deg, rgba(255, 0, 110, 0.8), rgba(255, 0, 110, 0.6));
          box-shadow: 0 0 20px rgba(255, 0, 110, 0.5),
                      inset 0 2px 4px rgba(255, 255, 255, 0.1),
                      inset 0 -2px 4px rgba(0, 0, 0, 0.5);
        }

        .btn-danger-neon:hover {
          transform: translateY(-2px);
          background: linear-gradient(145deg, rgba(255, 0, 110, 1), rgba(255, 0, 110, 0.8));
          box-shadow: 0 0 30px rgba(255, 0, 110, 0.8),
                      0 6px 20px rgba(255, 0, 110, 0.6),
                      inset 0 2px 4px rgba(255, 255, 255, 0.2);
        }

        .btn-text {
          position: relative;
          z-index: 1;
          color: #FFFFFF;
          text-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
        }

        /* Glass morphism modal */
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.85);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          animation: fadeIn 0.3s ease;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        .modal-content {
          background: linear-gradient(145deg, rgba(26, 26, 26, 0.95), rgba(10, 10, 10, 0.95));
          backdrop-filter: blur(40px);
          -webkit-backdrop-filter: blur(40px);
          padding: 32px;
          border-radius: 20px;
          max-width: 600px;
          max-height: 80vh;
          overflow-y: auto;
          border: 2px solid transparent;
          background-clip: padding-box;
          box-shadow: 0 0 40px rgba(176, 38, 255, 0.6),
                      0 0 80px rgba(255, 0, 110, 0.4),
                      inset 0 1px 0 rgba(255, 255, 255, 0.1);
          animation: modalSlideIn 0.4s ease;
        }

        @keyframes modalSlideIn {
          from {
            transform: translateY(-50px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }

        .modal-title {
          margin-top: 0;
          margin-bottom: 24px;
          background: linear-gradient(135deg, #B026FF 0%, #FF006E 50%, #FFBE0B 100%);
          background-size: 200% 200%;
          animation: holoShimmer 3s ease-in-out infinite;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          font-size: 28px;
          font-weight: 700;
        }

        .summary-text {
          background: rgba(0, 0, 0, 0.6);
          padding: 20px;
          border-radius: 12px;
          font-size: 13px;
          overflow-x: auto;
          white-space: pre-wrap;
          margin: 20px 0;
          color: #E0E0E0;
          border: 1px solid rgba(176, 38, 255, 0.3);
          box-shadow: inset 0 2px 8px rgba(0, 0, 0, 0.6);
        }

        .btn-close {
          width: 100%;
          padding: 12px 24px;
          background: linear-gradient(135deg, #B026FF 0%, #FF006E 100%);
          background-size: 200% 200%;
          animation: holoShimmer 3s ease-in-out infinite;
          color: #FFFFFF;
          border: none;
          border-radius: 10px;
          cursor: pointer;
          font-weight: 700;
          font-size: 16px;
          box-shadow: 0 0 20px rgba(176, 38, 255, 0.6),
                      inset 0 1px 0 rgba(255, 255, 255, 0.2);
          transition: all 0.3s ease;
        }

        .btn-close:hover {
          transform: translateY(-2px);
          box-shadow: 0 0 30px rgba(176, 38, 255, 0.8),
                      0 6px 20px rgba(255, 0, 110, 0.6);
        }

        @media (max-width: 768px) {
          .modal-content {
            max-width: 90vw;
            padding: 24px;
          }
        }
      `}</style>
    </div>
  );
};

export default CostTracker;
