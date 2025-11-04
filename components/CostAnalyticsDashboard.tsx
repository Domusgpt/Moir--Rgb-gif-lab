/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Clear Seas Solution - Cost Analytics Dashboard
 */

import React, { useState, useMemo } from 'react';
import {
  getUsageStats,
  getUsageRecords,
  formatCost
} from '../services/costTrackingService';
import { QualityTier, QUALITY_TIERS } from '../types';
import { HoloCard, HoloBadge, HoloProgress, HoloButton } from './HoloUI';
import { useNotifications, useCopyToClipboard, useDownload } from './NotificationSystem';

export const CostAnalyticsDashboard: React.FC = () => {
  const [timeRange, setTimeRange] = useState<'today' | 'week' | 'month' | 'all'>('today');
  const stats = getUsageStats();
  const records = getUsageRecords();
  const { success } = useNotifications();
  const copyToClipboard = useCopyToClipboard();
  const download = useDownload();

  // Calculate statistics
  const analytics = useMemo(() => {
    const totalCost = stats.totalCost;
    const totalGens = stats.totalGenerations;
    const avgCost = totalGens > 0 ? totalCost / totalGens : 0;

    // Calculate cost per tier percentage
    const tierPercentages = {
      nano: totalCost > 0 ? (stats.costByTier.nano / totalCost) * 100 : 0,
      preview: totalCost > 0 ? (stats.costByTier.preview / totalCost) * 100 : 0,
      standard: totalCost > 0 ? (stats.costByTier.standard / totalCost) * 100 : 0,
      hd: totalCost > 0 ? (stats.costByTier.hd / totalCost) * 100 : 0,
    };

    // Most used tier
    const gensByTier = stats.generationsByTier;
    const mostUsedTier = Object.entries(gensByTier).reduce((a, b) =>
      b[1] > a[1] ? b : a
    )[0] as QualityTier;

    // Efficiency score (how much nano vs expensive tiers)
    const nanoRatio = totalGens > 0 ? gensByTier.nano / totalGens : 0;
    const efficiencyScore = Math.round(nanoRatio * 100);

    // Projected monthly cost
    const sessionDuration = Date.now() - new Date(stats.sessionStart).getTime();
    const daysInSession = Math.max(sessionDuration / (1000 * 60 * 60 * 24), 1);
    const projectedMonthlyCost = (totalCost / daysInSession) * 30;

    return {
      totalCost,
      totalGens,
      avgCost,
      tierPercentages,
      mostUsedTier,
      efficiencyScore,
      projectedMonthlyCost
    };
  }, [stats]);

  const handleExportCSV = () => {
    const csv = [
      ['Tier', 'Generations', 'Total Cost'],
      ['Nano', stats.generationsByTier.nano, formatCost(stats.costByTier.nano)],
      ['Preview', stats.generationsByTier.preview, formatCost(stats.costByTier.preview)],
      ['Standard', stats.generationsByTier.standard, formatCost(stats.costByTier.standard)],
      ['HD', stats.generationsByTier.hd, formatCost(stats.costByTier.hd)],
      ['', '', ''],
      ['Total', stats.totalGenerations, formatCost(stats.totalCost)],
      ['Average per Generation', '', formatCost(analytics.avgCost)],
      ['Efficiency Score', `${analytics.efficiencyScore}%`, ''],
      ['Projected Monthly Cost', '', formatCost(analytics.projectedMonthlyCost)]
    ].map(row => row.join(',')).join('\n');

    download(csv, `cost-analytics-${Date.now()}.csv`, 'text/csv');
  };

  const handleExportJSON = () => {
    const data = {
      timestamp: new Date().toISOString(),
      summary: {
        totalCost: stats.totalCost,
        totalGenerations: stats.totalGenerations,
        averageCost: analytics.avgCost,
        efficiencyScore: analytics.efficiencyScore,
        projectedMonthlyCost: analytics.projectedMonthlyCost
      },
      byTier: {
        nano: { generations: stats.generationsByTier.nano, cost: stats.costByTier.nano },
        preview: { generations: stats.generationsByTier.preview, cost: stats.costByTier.preview },
        standard: { generations: stats.generationsByTier.standard, cost: stats.costByTier.standard },
        hd: { generations: stats.generationsByTier.hd, cost: stats.costByTier.hd }
      },
      recentRecords: records
    };

    download(JSON.stringify(data, null, 2), `cost-analytics-${Date.now()}.json`, 'application/json');
  };

  const handleCopyStats = () => {
    const text = `
Cost Analytics Summary
======================
Total Cost: ${formatCost(stats.totalCost)}
Total Generations: ${stats.totalGenerations}
Average Cost: ${formatCost(analytics.avgCost)}
Efficiency Score: ${analytics.efficiencyScore}%
Projected Monthly: ${formatCost(analytics.projectedMonthlyCost)}

By Tier:
- Nano: ${stats.generationsByTier.nano} generations (${formatCost(stats.costByTier.nano)})
- Preview: ${stats.generationsByTier.preview} generations (${formatCost(stats.costByTier.preview)})
- Standard: ${stats.generationsByTier.standard} generations (${formatCost(stats.costByTier.standard)})
- HD: ${stats.generationsByTier.hd} generations (${formatCost(stats.costByTier.hd)})
    `.trim();

    copyToClipboard(text, 'Analytics copied to clipboard!');
  };

  return (
    <div className="cost-analytics-dashboard">
      {/* Header */}
      <div className="dashboard-header">
        <h2 className="dashboard-title">💎 Cost Analytics</h2>
        <div className="dashboard-actions">
          <HoloButton variant="secondary" size="sm" onClick={handleCopyStats}>
            📋 Copy
          </HoloButton>
          <HoloButton variant="secondary" size="sm" onClick={handleExportCSV}>
            📊 CSV
          </HoloButton>
          <HoloButton variant="secondary" size="sm" onClick={handleExportJSON}>
            💾 JSON
          </HoloButton>
        </div>
      </div>

      {/* Key Metrics Grid */}
      <div className="metrics-grid">
        <HoloCard variant="glass" hoverable>
          <div className="metric-card">
            <div className="metric-icon">💰</div>
            <div className="metric-value">{formatCost(analytics.totalCost)}</div>
            <div className="metric-label">Total Spent</div>
          </div>
        </HoloCard>

        <HoloCard variant="glass" hoverable>
          <div className="metric-card">
            <div className="metric-icon">🎯</div>
            <div className="metric-value">{analytics.totalGens}</div>
            <div className="metric-label">Total Generations</div>
          </div>
        </HoloCard>

        <HoloCard variant="glass" hoverable>
          <div className="metric-card">
            <div className="metric-icon">📈</div>
            <div className="metric-value">{formatCost(analytics.avgCost)}</div>
            <div className="metric-label">Average Cost</div>
          </div>
        </HoloCard>

        <HoloCard variant="glass" hoverable>
          <div className="metric-card">
            <div className="metric-icon">⚡</div>
            <div className="metric-value">{analytics.efficiencyScore}%</div>
            <div className="metric-label">Efficiency Score</div>
            <HoloProgress value={analytics.efficiencyScore} variant="gradient" showLabel={false} />
          </div>
        </HoloCard>
      </div>

      {/* Tier Breakdown */}
      <HoloCard title="Cost Distribution by Tier" icon="📊" variant="elevated">
        <div className="tier-breakdown">
          {(Object.keys(QUALITY_TIERS) as QualityTier[]).map(tier => {
            const config = QUALITY_TIERS[tier];
            const percentage = analytics.tierPercentages[tier];
            const count = stats.generationsByTier[tier];
            const cost = stats.costByTier[tier];

            return (
              <div key={tier} className="tier-row">
                <div className="tier-row-header">
                  <HoloBadge variant={tier === 'nano' ? 'purple' : tier === 'preview' ? 'magenta' : tier === 'standard' ? 'yellow' : 'gradient'}>
                    {config.label}
                  </HoloBadge>
                  <span className="tier-count">{count} generations</span>
                  <span className="tier-cost">{formatCost(cost)}</span>
                </div>
                <HoloProgress
                  value={percentage}
                  variant={tier === 'nano' ? 'purple' : tier === 'preview' ? 'magenta' : tier === 'standard' ? 'yellow' : 'gradient'}
                  showLabel={true}
                />
              </div>
            );
          })}
        </div>
      </HoloCard>

      {/* Insights */}
      <HoloCard title="💡 Insights & Recommendations" icon="🧠" variant="elevated">
        <div className="insights-list">
          {analytics.efficiencyScore >= 70 && (
            <div className="insight insight-success">
              <span className="insight-icon">✓</span>
              <div>
                <div className="insight-title">Excellent Efficiency!</div>
                <div className="insight-text">
                  You're using nano mode {analytics.efficiencyScore}% of the time. Keep it up!
                </div>
              </div>
            </div>
          )}

          {analytics.efficiencyScore < 30 && (
            <div className="insight insight-warning">
              <span className="insight-icon">💡</span>
              <div>
                <div className="insight-title">Consider Using Nano Mode</div>
                <div className="insight-text">
                  You could save up to 70% by using nano mode for initial testing.
                </div>
              </div>
            </div>
          )}

          {analytics.projectedMonthlyCost > 1 && (
            <div className="insight insight-info">
              <span className="insight-icon">📊</span>
              <div>
                <div className="insight-title">Projected Monthly Cost</div>
                <div className="insight-text">
                  At your current usage rate: {formatCost(analytics.projectedMonthlyCost)}/month
                </div>
              </div>
            </div>
          )}

          {stats.generationsByTier[analytics.mostUsedTier] > 0 && (
            <div className="insight insight-info">
              <span className="insight-icon">⭐</span>
              <div>
                <div className="insight-title">Most Used Tier</div>
                <div className="insight-text">
                  {QUALITY_TIERS[analytics.mostUsedTier].label} - {stats.generationsByTier[analytics.mostUsedTier]} generations
                </div>
              </div>
            </div>
          )}
        </div>
      </HoloCard>

      <style>{`
        .cost-analytics-dashboard {
          display: flex;
          flex-direction: column;
          gap: 24px;
          padding: 24px 0;
        }

        .dashboard-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 16px;
        }

        .dashboard-title {
          margin: 0;
          font-size: 28px;
          font-weight: 700;
          background: linear-gradient(135deg, #B026FF 0%, #FF006E 50%, #FFBE0B 100%);
          background-size: 200% 200%;
          animation: holoShimmer 3s ease-in-out infinite;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .dashboard-actions {
          display: flex;
          gap: 8px;
        }

        .metrics-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 20px;
        }

        .metric-card {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
          padding: 8px 0;
        }

        .metric-icon {
          font-size: 36px;
          filter: drop-shadow(0 0 15px rgba(176, 38, 255, 0.8));
        }

        .metric-value {
          font-size: 32px;
          font-weight: 700;
          background: linear-gradient(135deg, #B026FF 0%, #FF006E 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          line-height: 1;
        }

        .metric-label {
          font-size: 14px;
          color: #808080;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          font-weight: 600;
        }

        .tier-breakdown {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .tier-row {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .tier-row-header {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .tier-count {
          color: #E0E0E0;
          font-size: 14px;
        }

        .tier-cost {
          margin-left: auto;
          color: #FFBE0B;
          font-weight: 700;
          font-size: 16px;
          text-shadow: 0 0 10px rgba(255, 190, 11, 0.6);
        }

        .insights-list {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .insight {
          display: flex;
          gap: 16px;
          padding: 16px;
          border-radius: 12px;
          background: linear-gradient(145deg, rgba(10, 10, 10, 0.8), rgba(0, 0, 0, 0.6));
          border: 1px solid rgba(176, 38, 255, 0.3);
        }

        .insight-success {
          border-color: rgba(255, 190, 11, 0.5);
          background: linear-gradient(145deg, rgba(255, 190, 11, 0.05), rgba(255, 190, 11, 0.02));
        }

        .insight-warning {
          border-color: rgba(255, 0, 110, 0.5);
          background: linear-gradient(145deg, rgba(255, 0, 110, 0.05), rgba(255, 0, 110, 0.02));
        }

        .insight-info {
          border-color: rgba(176, 38, 255, 0.5);
          background: linear-gradient(145deg, rgba(176, 38, 255, 0.05), rgba(176, 38, 255, 0.02));
        }

        .insight-icon {
          font-size: 24px;
          filter: drop-shadow(0 0 10px rgba(176, 38, 255, 0.8));
        }

        .insight-title {
          font-weight: 700;
          font-size: 16px;
          color: #FFFFFF;
          margin-bottom: 4px;
        }

        .insight-text {
          font-size: 14px;
          color: #E0E0E0;
          line-height: 1.5;
        }

        @media (max-width: 768px) {
          .metrics-grid {
            grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
          }

          .dashboard-header {
            flex-direction: column;
            align-items: stretch;
          }

          .dashboard-actions {
            justify-content: stretch;
          }

          .dashboard-actions > * {
            flex: 1;
          }
        }
      `}</style>
    </div>
  );
};

export default CostAnalyticsDashboard;
