/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
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
      {/* Compact View */}
      <div
        className="cost-tracker-header"
        onClick={() => setExpanded(!expanded)}
        style={{ cursor: 'pointer' }}
      >
        <div className="cost-tracker-summary">
          <span className="cost-label">Session Cost:</span>
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
          {/* Free Tier Status */}
          <div className="free-tier-status">
            <h4>Free Tier Status</h4>
            <div className="free-tier-limits">
              <div className="limit-item">
                <span>Nano Remaining:</span>
                <span className={freeTierStatus.nanoRemaining > 0 ? 'available' : 'depleted'}>
                  {freeTierStatus.nanoRemaining}/10
                </span>
              </div>
              <div className="limit-item">
                <span>Standard Remaining:</span>
                <span className={freeTierStatus.standardRemaining > 0 ? 'available' : 'depleted'}>
                  {freeTierStatus.standardRemaining}/2
                </span>
              </div>
              <div className="limit-item">
                <span>Budget Remaining:</span>
                <span className={freeTierStatus.costRemaining > 0 ? 'available' : 'depleted'}>
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

          {/* Usage Breakdown */}
          <div className="usage-breakdown">
            <h4>Usage Breakdown</h4>
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
                  <td>Nano</td>
                  <td>{stats.generationsByTier.nano}</td>
                  <td>{formatCost(stats.costByTier.nano)}</td>
                </tr>
                <tr>
                  <td>Preview</td>
                  <td>{stats.generationsByTier.preview}</td>
                  <td>{formatCost(stats.costByTier.preview)}</td>
                </tr>
                <tr>
                  <td>Standard</td>
                  <td>{stats.generationsByTier.standard}</td>
                  <td>{formatCost(stats.costByTier.standard)}</td>
                </tr>
                <tr>
                  <td>HD</td>
                  <td>{stats.generationsByTier.hd}</td>
                  <td>{formatCost(stats.costByTier.hd)}</td>
                </tr>
                <tr className="total-row">
                  <td><strong>Total</strong></td>
                  <td><strong>{stats.totalGenerations}</strong></td>
                  <td><strong>{formatCost(stats.totalCost)}</strong></td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Current Selection */}
          <div className="current-selection">
            <h4>Current Quality Tier</h4>
            <div className="tier-info">
              <div className="tier-name">{QUALITY_TIERS[currentQualityTier].label}</div>
              <div className="tier-description">
                {QUALITY_TIERS[currentQualityTier].description}
              </div>
              <div className="tier-cost">
                Cost per generation: {formatCost(currentCost)}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="cost-tracker-actions">
            <button
              onClick={() => setShowSummary(true)}
              className="btn-secondary"
            >
              View Summary
            </button>
            <button
              onClick={handleReset}
              className="btn-danger"
            >
              Reset Stats
            </button>
          </div>
        </div>
      )}

      {/* Summary Modal */}
      {showSummary && (
        <div className="modal-overlay" onClick={() => setShowSummary(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>Cost Summary</h3>
            <pre className="summary-text">{getCostSummary()}</pre>
            <button onClick={() => setShowSummary(false)} className="btn-primary">
              Close
            </button>
          </div>
        </div>
      )}

      <style>{`
        .cost-tracker {
          background: #f8f9fa;
          border: 1px solid #dee2e6;
          border-radius: 8px;
          padding: 12px;
          margin: 12px 0;
          font-size: 14px;
        }

        .cost-tracker-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 4px 0;
        }

        .cost-tracker-summary {
          display: flex;
          gap: 12px;
          align-items: center;
        }

        .cost-label {
          font-weight: 500;
          color: #495057;
        }

        .cost-value {
          font-weight: 700;
          font-size: 16px;
          color: #212529;
        }

        .cost-estimate {
          color: #6c757d;
          font-size: 12px;
        }

        .expand-icon {
          transition: transform 0.2s;
          font-size: 12px;
          color: #6c757d;
        }

        .expand-icon.expanded {
          transform: rotate(180deg);
        }

        .cost-tracker-details {
          margin-top: 16px;
          padding-top: 16px;
          border-top: 1px solid #dee2e6;
        }

        .cost-tracker-details h4 {
          margin: 0 0 12px 0;
          font-size: 14px;
          font-weight: 600;
          color: #212529;
        }

        .free-tier-status {
          margin-bottom: 16px;
        }

        .free-tier-limits {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .limit-item {
          display: flex;
          justify-content: space-between;
          padding: 6px 8px;
          background: white;
          border-radius: 4px;
        }

        .limit-item span.available {
          color: #28a745;
          font-weight: 600;
        }

        .limit-item span.depleted {
          color: #dc3545;
          font-weight: 600;
        }

        .limit-warning {
          margin-top: 8px;
          padding: 8px;
          background: #fff3cd;
          border: 1px solid #ffc107;
          border-radius: 4px;
          color: #856404;
          font-size: 13px;
        }

        .usage-breakdown {
          margin-bottom: 16px;
        }

        .usage-table {
          width: 100%;
          border-collapse: collapse;
          background: white;
          border-radius: 4px;
          overflow: hidden;
        }

        .usage-table th,
        .usage-table td {
          padding: 8px 12px;
          text-align: left;
        }

        .usage-table thead {
          background: #e9ecef;
          font-weight: 600;
        }

        .usage-table tbody tr {
          border-bottom: 1px solid #f1f3f5;
        }

        .usage-table tbody tr:last-child {
          border-bottom: none;
        }

        .usage-table .total-row {
          background: #f8f9fa;
        }

        .current-selection {
          margin-bottom: 16px;
        }

        .tier-info {
          background: white;
          padding: 12px;
          border-radius: 4px;
        }

        .tier-name {
          font-weight: 600;
          font-size: 15px;
          margin-bottom: 4px;
        }

        .tier-description {
          color: #6c757d;
          font-size: 13px;
          margin-bottom: 8px;
        }

        .tier-cost {
          color: #28a745;
          font-weight: 600;
          font-size: 13px;
        }

        .cost-tracker-actions {
          display: flex;
          gap: 8px;
        }

        .cost-tracker-actions button {
          flex: 1;
          padding: 8px;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-size: 13px;
          font-weight: 500;
        }

        .btn-secondary {
          background: #6c757d;
          color: white;
        }

        .btn-secondary:hover {
          background: #5a6268;
        }

        .btn-danger {
          background: #dc3545;
          color: white;
        }

        .btn-danger:hover {
          background: #c82333;
        }

        .btn-primary {
          background: #007bff;
          color: white;
          padding: 8px 16px;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-weight: 500;
        }

        .btn-primary:hover {
          background: #0056b3;
        }

        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
        }

        .modal-content {
          background: white;
          padding: 24px;
          border-radius: 8px;
          max-width: 600px;
          max-height: 80vh;
          overflow-y: auto;
        }

        .modal-content h3 {
          margin-top: 0;
        }

        .summary-text {
          background: #f8f9fa;
          padding: 16px;
          border-radius: 4px;
          font-size: 12px;
          overflow-x: auto;
          white-space: pre-wrap;
          margin: 16px 0;
        }
      `}</style>
    </div>
  );
};

export default CostTracker;
