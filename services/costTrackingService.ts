/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import { QualityTier, QUALITY_TIERS } from "../types";

export interface UsageRecord {
  timestamp: string;
  qualityTier: QualityTier;
  variantId: string;
  cost: number;
  success: boolean;
}

export interface UsageStats {
  totalGenerations: number;
  totalCost: number;
  generationsByTier: Record<QualityTier, number>;
  costByTier: Record<QualityTier, number>;
  sessionStart: string;
  lastGeneration?: string;
}

const STORAGE_KEY = 'animation_usage_stats';
const RECORDS_KEY = 'animation_usage_records';

/**
 * Get current session usage statistics
 */
export const getUsageStats = (): UsageStats => {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    return initializeStats();
  }
  return JSON.parse(stored);
};

/**
 * Initialize new usage stats
 */
const initializeStats = (): UsageStats => {
  const stats: UsageStats = {
    totalGenerations: 0,
    totalCost: 0,
    generationsByTier: {
      nano: 0,
      preview: 0,
      standard: 0,
      hd: 0
    },
    costByTier: {
      nano: 0,
      preview: 0,
      standard: 0,
      hd: 0
    },
    sessionStart: new Date().toISOString()
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(stats));
  return stats;
};

/**
 * Track a new generation
 */
export const trackGeneration = (
  qualityTier: QualityTier,
  variantId: string,
  success: boolean = true
): void => {
  const stats = getUsageStats();
  const cost = QUALITY_TIERS[qualityTier].estimatedCost;

  // Update stats
  stats.totalGenerations += 1;
  stats.totalCost += cost;
  stats.generationsByTier[qualityTier] += 1;
  stats.costByTier[qualityTier] += cost;
  stats.lastGeneration = new Date().toISOString();

  // Save stats
  localStorage.setItem(STORAGE_KEY, JSON.stringify(stats));

  // Save individual record
  const record: UsageRecord = {
    timestamp: new Date().toISOString(),
    qualityTier,
    variantId,
    cost,
    success
  };

  const records = getUsageRecords();
  records.push(record);
  // Keep only last 100 records to avoid storage bloat
  const trimmedRecords = records.slice(-100);
  localStorage.setItem(RECORDS_KEY, JSON.stringify(trimmedRecords));
};

/**
 * Get usage records
 */
export const getUsageRecords = (): UsageRecord[] => {
  const stored = localStorage.getItem(RECORDS_KEY);
  return stored ? JSON.parse(stored) : [];
};

/**
 * Reset usage statistics
 */
export const resetUsageStats = (): void => {
  localStorage.removeItem(STORAGE_KEY);
  localStorage.removeItem(RECORDS_KEY);
  initializeStats();
};

/**
 * Estimate cost for batch operations
 */
export const estimateBatchCost = (
  generations: Array<{ qualityTier: QualityTier }>
): number => {
  return generations.reduce((total, gen) => {
    return total + QUALITY_TIERS[gen.qualityTier].estimatedCost;
  }, 0);
};

/**
 * Format cost as string
 */
export const formatCost = (cost: number): string => {
  if (cost < 0.001) {
    return '< $0.001';
  }
  if (cost < 0.01) {
    return `$${cost.toFixed(4)}`;
  }
  return `$${cost.toFixed(3)}`;
};

/**
 * Get cost summary report
 */
export const getCostSummary = (): string => {
  const stats = getUsageStats();
  const sessionDuration = Date.now() - new Date(stats.sessionStart).getTime();
  const hours = Math.floor(sessionDuration / (1000 * 60 * 60));
  const minutes = Math.floor((sessionDuration % (1000 * 60 * 60)) / (1000 * 60));

  return `
=== Cost Summary ===

Session Duration: ${hours}h ${minutes}m
Total Generations: ${stats.totalGenerations}
Total Cost: ${formatCost(stats.totalCost)}

Breakdown by Quality Tier:
---------------------------
Nano (Free):     ${stats.generationsByTier.nano} generations | ${formatCost(stats.costByTier.nano)}
Preview:         ${stats.generationsByTier.preview} generations | ${formatCost(stats.costByTier.preview)}
Standard:        ${stats.generationsByTier.standard} generations | ${formatCost(stats.costByTier.standard)}
HD:              ${stats.generationsByTier.hd} generations | ${formatCost(stats.costByTier.hd)}

Average Cost per Generation: ${formatCost(stats.totalCost / (stats.totalGenerations || 1))}
  `.trim();
};

/**
 * Check if user is within free tier limits
 */
export interface FreeTierLimits {
  nanoPerDay: number;
  standardPerDay: number;
  totalCostPerDay: number;
}

export const DEFAULT_FREE_TIER: FreeTierLimits = {
  nanoPerDay: 10,
  standardPerDay: 2,
  totalCostPerDay: 0.022 // 10 nano ($0.01) + 2 standard ($0.012)
};

export const checkFreeTierStatus = (limits: FreeTierLimits = DEFAULT_FREE_TIER): {
  withinLimits: boolean;
  nanoRemaining: number;
  standardRemaining: number;
  costRemaining: number;
} => {
  const stats = getUsageStats();
  const today = new Date().toDateString();
  const sessionStart = new Date(stats.sessionStart).toDateString();

  // Reset if it's a new day
  if (today !== sessionStart) {
    resetUsageStats();
    return {
      withinLimits: true,
      nanoRemaining: limits.nanoPerDay,
      standardRemaining: limits.standardPerDay,
      costRemaining: limits.totalCostPerDay
    };
  }

  const nanoUsed = stats.generationsByTier.nano;
  const standardUsed = stats.generationsByTier.standard + stats.generationsByTier.hd;
  const nanoRemaining = Math.max(0, limits.nanoPerDay - nanoUsed);
  const standardRemaining = Math.max(0, limits.standardPerDay - standardUsed);
  const costRemaining = Math.max(0, limits.totalCostPerDay - stats.totalCost);

  return {
    withinLimits: nanoRemaining > 0 || standardRemaining > 0,
    nanoRemaining,
    standardRemaining,
    costRemaining
  };
};
