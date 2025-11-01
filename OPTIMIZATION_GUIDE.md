# Optimization Guide - Cost Reduction Strategies

This document outlines the optimization features and cost reduction strategies implemented in the Moir RGB GIF Lab.

---

## Table of Contents

1. [Quality Tiers](#quality-tiers)
2. [Nano Mode](#nano-mode)
3. [Frame Metadata System](#frame-metadata-system)
4. [Cost Tracking](#cost-tracking)
5. [Free Tier Implementation](#free-tier-implementation)
6. [Best Practices](#best-practices)

---

## Quality Tiers

The system now supports **4 quality tiers**, each optimized for different use cases:

### Tier Comparison

| Tier | Resolution | Frames | Grid | Est. Cost | Best For |
|------|------------|--------|------|-----------|----------|
| **Nano** | 256×256 | 4 | 2×2 | $0.001 | Quick previews, free tier |
| **Preview** | 512×512 | 9 | 3×3 | $0.003 | Testing animations |
| **Standard** | 1024×1024 | 9 | 3×3 | $0.006 | Production use |
| **HD** | 1024×1024 | 16 | 4×4 | $0.006 | High-quality output |

### Cost Savings

Switching from Standard to Nano mode saves **83%** per generation:
- Standard: $0.006
- Nano: $0.001
- Savings: $0.005 (83%)

For 100 generations:
- Standard: $0.60
- Nano: $0.10
- **Total Savings: $0.50**

---

## Nano Mode

### What is Nano Mode?

Nano mode is a lightweight generation option designed for:
- **Rapid prototyping** - Test animations quickly
- **Free tier users** - Provide free access with minimal cost
- **Exploration** - Browse variants without commitment
- **Mobile users** - Smaller file sizes for faster loading

### Technical Details

- **Resolution**: 256×256 pixels
- **Frames**: 4 frames in a 2×2 grid
- **File Size**: ~20-40KB (vs 200-500KB for standard)
- **Generation Time**: ~2-3 seconds (vs 5-8 seconds)
- **Cost**: $0.001 per generation

### When to Use Nano

✅ **Good for:**
- Exploring different animation variants
- Testing effect intensity levels
- Quick previews before committing to full generation
- Educational/learning purposes
- Mobile viewing

❌ **Not ideal for:**
- Final production assets
- Print materials
- Large display screens
- Professional presentations

### Upgrading from Nano

Users can:
1. Generate in Nano mode to find the perfect variant
2. Switch to Standard or HD mode
3. Regenerate the same variant in higher quality
4. Only pay for the final high-quality version

**Example workflow:**
```
1. Upload image
2. Generate 10 nano previews ($0.01)
3. Select favorite variant
4. Generate 1 HD version ($0.006)
Total cost: $0.016 (vs $0.06 for 10 HD generations)
Savings: 73%
```

---

## Frame Metadata System

### Overview

Every generated animation now includes comprehensive metadata in JSON format, providing full context about the GIF frames.

### Metadata Structure

```typescript
interface AnimationMetadata {
  version: string;              // Schema version (currently 1.0.0)
  generatedAt: string;          // ISO timestamp
  sourceImageId: string;        // Original image identifier
  sourceImageName: string;      // Image filename
  variantId: string;            // Animation variant ID
  variantName: string;          // Human-readable variant name
  qualityTier: QualityTier;     // nano | preview | standard | hd
  resolution: number;           // Pixel dimensions (256, 512, or 1024)
  totalFrames: number;          // Number of frames (4, 9, or 16)
  frameDuration: number;        // Milliseconds per frame
  totalDuration: number;        // Total animation duration
  isLooping: boolean;           // Loop configuration
  gridSize: number;             // Grid dimensions (2, 3, or 4)
  frames: FrameMetadata[];      // Per-frame metadata
  generationOptions: {
    effectIntensity: string;
    modifier: string;
    enableAntiJitter: boolean;
  };
  costEstimate: number;         // Generation cost in USD
  spriteSheetUrl: string;       // Base64 sprite sheet data
}
```

### Per-Frame Metadata

Each frame includes:
```typescript
interface FrameMetadata {
  frameNumber: number;          // 0-indexed frame number
  timestamp: number;            // When frame appears (ms)
  gridPosition: {               // Position in sprite sheet
    row: number;
    col: number;
  };
  sourceRect: {                 // Extraction coordinates
    x: number;
    y: number;
    width: number;
    height: number;
  };
  isKeyFrame: boolean;          // First/last frames marked
  transformations: {            // Applied transformations
    antiJitterOffset?: { x, y };
    cropRect?: { x, y, width, height };
  };
}
```

### Exporting Metadata

Three export formats available:

#### 1. Full Metadata JSON
```javascript
exportMetadataAsJson(metadata, 'animation-full.json');
```
Complete metadata including all fields.

#### 2. Frame Data Only
```javascript
exportFrameDataAsJson(metadata, 'frames-only.json');
```
Simplified format with just frame positions and timing.

#### 3. Human-Readable Report
```javascript
exportMetadataReport(metadata, 'animation-report.txt');
```
Text report for documentation and debugging.

### Use Cases

1. **Animation Pipelines** - Import metadata into other tools
2. **Debugging** - Understand frame extraction issues
3. **Documentation** - Record generation settings
4. **Quality Control** - Verify frame counts and timing
5. **Cost Analysis** - Track actual costs vs estimates
6. **Archiving** - Preserve generation context

---

## Cost Tracking

### Real-Time Usage Monitoring

The system tracks all API usage in real-time:

```typescript
interface UsageStats {
  totalGenerations: number;
  totalCost: number;
  generationsByTier: {
    nano: number;
    preview: number;
    standard: number;
    hd: number;
  };
  costByTier: {
    nano: number;
    preview: number;
    standard: number;
    hd: number;
  };
  sessionStart: string;
  lastGeneration: string;
}
```

### Features

1. **Session Tracking** - Monitor costs per session
2. **Tier Breakdown** - See usage by quality tier
3. **Cost Estimation** - Preview batch operation costs
4. **Usage History** - Last 100 generations stored
5. **Daily Limits** - Free tier enforcement

### Accessing Cost Data

```javascript
// Get current stats
const stats = getUsageStats();
console.log(`Total cost: ${formatCost(stats.totalCost)}`);

// Track a generation
trackGeneration('nano', 'zoom-classic', true);

// Estimate batch cost
const estimate = estimateBatchCost([
  { qualityTier: 'nano' },
  { qualityTier: 'standard' },
  { qualityTier: 'hd' }
]);
console.log(`Batch will cost: ${formatCost(estimate)}`);

// Get summary report
console.log(getCostSummary());
```

### UI Components

#### CostTracker Component
```tsx
<CostTracker
  currentQualityTier="standard"
  pendingGenerations={5}
/>
```
Displays:
- Current session cost
- Pending batch estimate
- Free tier status
- Usage breakdown by tier

#### QualitySelector Component
```tsx
<QualitySelector
  value={qualityTier}
  onChange={setQualityTier}
/>
```
Shows:
- All available tiers
- Cost per generation
- Resolution and frame count
- Visual selection

---

## Free Tier Implementation

### Default Free Tier Limits

```typescript
{
  nanoPerDay: 10,        // 10 nano generations
  standardPerDay: 2,     // 2 standard/HD generations
  totalCostPerDay: 0.022 // $0.022 max daily cost
}
```

### Cost Breakdown
- 10 nano @ $0.001 = $0.010
- 2 standard @ $0.006 = $0.012
- **Total: $0.022/day**

### Daily Reset
- Limits reset at midnight local time
- Stats automatically refresh on new day
- Usage history preserved for analytics

### Checking Limits

```javascript
const status = checkFreeTierStatus();

if (status.withinLimits) {
  console.log(`Remaining: ${status.nanoRemaining} nano, ${status.standardRemaining} standard`);
} else {
  console.log('Daily limit reached. Upgrade to continue.');
}
```

### Custom Limits

Configure custom limits:
```javascript
const customLimits = {
  nanoPerDay: 50,
  standardPerDay: 10,
  totalCostPerDay: 0.10
};

const status = checkFreeTierStatus(customLimits);
```

---

## Best Practices

### For Users

1. **Start with Nano**
   - Test variants in nano mode first
   - Upgrade to standard only for final selections
   - Save 70-80% on exploration costs

2. **Batch Wisely**
   - Group similar requests
   - Use preview mode for initial testing
   - Reserve HD for final deliverables

3. **Monitor Costs**
   - Check CostTracker regularly
   - Set personal budgets
   - Review usage history

4. **Export Metadata**
   - Save metadata for important animations
   - Use for documentation
   - Track generation settings

### For Developers

1. **Quality Tier Selection**
   ```typescript
   // Default to nano for first-time users
   const defaultTier: QualityTier = 'nano';

   // Prompt upgrade for production use
   if (isProductionUse && tier === 'nano') {
     suggestUpgrade('standard');
   }
   ```

2. **Cost Estimation**
   ```typescript
   // Show cost before batch operations
   const estimate = estimateBatchCost(requests);
   if (estimate > 0.10) {
     confirmBatchOperation(estimate);
   }
   ```

3. **Free Tier Enforcement**
   ```typescript
   // Check limits before generation
   const status = checkFreeTierStatus();
   if (!status.withinLimits) {
     showUpgradePrompt();
     return;
   }
   ```

4. **Metadata Preservation**
   ```typescript
   // Always include metadata in responses
   const asset = await generateAnimationAssets(...args);

   // Auto-export for important generations
   if (asset.qualityTier === 'hd') {
     exportMetadataAsJson(asset.metadata);
   }
   ```

---

## Performance Optimizations

### Image Resizing

Images are automatically resized based on quality tier:
```typescript
const targetSize = {
  nano: 256,
  preview: 512,
  standard: 1024,
  hd: 1024
}[qualityTier];

await resizeImage(dataUrl, targetSize, targetSize);
```

### Caching Strategies

1. **Preview Caching**
   - Cache generated previews
   - Reuse across sessions
   - Reduce redundant API calls

2. **Metadata Caching**
   - Store in localStorage
   - Quick retrieval
   - Offline access

3. **Sprite Sheet Reuse**
   - One sprite sheet per generation
   - Extract multiple GIFs from same sheet
   - No re-generation needed

---

## Migration Guide

### Updating Existing Code

#### Before
```typescript
const options: AnimationOptions = {
  variantId: 'zoom-classic',
  frameCount: 9,
  frameDuration: 120,
  isLooping: true,
  effectIntensity: 'medium',
  modifier: 'none',
  enableAntiJitter: false
};
```

#### After
```typescript
const options: AnimationOptions = {
  variantId: 'zoom-classic',
  frameCount: 4, // Now supports 4, 9, or 16
  frameDuration: 120,
  isLooping: true,
  effectIntensity: 'medium',
  modifier: 'none',
  enableAntiJitter: false,
  qualityTier: 'nano' // NEW: Required field
};
```

### Adding Cost Tracking

```typescript
// At generation time
trackGeneration(
  options.qualityTier,
  options.variantId,
  true // success
);

// In UI
import CostTracker from './components/CostTracker';

<CostTracker
  currentQualityTier={currentOptions.qualityTier}
  pendingGenerations={animationRequests.length}
/>
```

---

## API Reference

### Services

#### costTrackingService.ts
- `getUsageStats()` - Current usage statistics
- `trackGeneration(tier, variant, success)` - Log generation
- `estimateBatchCost(requests)` - Cost estimate
- `checkFreeTierStatus(limits?)` - Free tier check
- `resetUsageStats()` - Clear statistics
- `formatCost(amount)` - Format currency

#### metadataService.ts
- `exportMetadataAsJson(metadata, filename?)` - Full JSON export
- `exportFrameDataAsJson(metadata, filename?)` - Frame data only
- `generateMetadataReport(metadata)` - Text report
- `exportMetadataReport(metadata, filename?)` - Export report

### Components

#### CostTracker
Props:
- `currentQualityTier?: QualityTier` - Selected tier
- `pendingGenerations?: number` - Queued requests

#### QualitySelector
Props:
- `value: QualityTier` - Current selection
- `onChange: (tier: QualityTier) => void` - Change handler
- `disabled?: boolean` - Disable selection

---

## Future Enhancements

### Planned Features

1. **Usage Analytics Dashboard**
   - Charts and graphs
   - Cost trends over time
   - Tier preference analysis

2. **Batch Optimization**
   - Automatic tier selection
   - Cost-based scheduling
   - Parallel generation

3. **Caching Layer**
   - Server-side preview cache
   - CDN integration
   - Reduced API calls

4. **Payment Integration**
   - Stripe/PayPal support
   - Credit system
   - Subscription tiers

5. **Enhanced Metadata**
   - Frame similarity scores
   - Quality metrics
   - Performance benchmarks

---

## Support

For questions or issues:
1. Check the [Cost Breakdown](./COST_BREAKDOWN.md) for detailed analysis
2. Review code examples in `/services/` and `/components/`
3. File issues on GitHub

---

Last Updated: 2025-11-01
Version: 1.0.0
