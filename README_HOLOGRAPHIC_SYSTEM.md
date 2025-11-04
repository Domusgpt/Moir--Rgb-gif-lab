# 🌟 Clear Seas Solution - Holographic Cost Optimization System

**A futuristic, cyberpunk-themed cost tracking and quality management system for AI-generated animations.**

---

## ✨ Features

### 🎨 **Holographic UI Components**
- **Glass morphism** design with backdrop blur effects
- **Neon glowing** buttons, badges, and cards
- **Skeuomorphic 3D depth** in unexpected places
- **Animated gradients** that shimmer and pulse
- **Smooth micro-interactions** with hardware acceleration

### 💰 **Cost Tracking & Analytics**
- **Real-time usage monitoring** with localStorage persistence
- **Tier-based breakdown** (Nano, Preview, Standard, HD)
- **Free tier enforcement** (10 nano + 2 standard per day)
- **Cost projections** and efficiency scores
- **Export to CSV/JSON** for external analysis

### 🎯 **Quality Tier System**
- **Nano Mode**: 256×256, 4 frames, $0.001 (83% savings!)
- **Preview Mode**: 512×512, 9 frames, $0.003
- **Standard Mode**: 1024×1024, 9 frames, $0.006
- **HD Mode**: 1024×1024, 16 frames, $0.006

### 📊 **Analytics Dashboard**
- **Visual metrics** with animated progress bars
- **Cost distribution** charts by tier
- **Smart insights** and recommendations
- **Efficiency scoring** system
- **One-click exports** (CSV, JSON, clipboard)

### 🔔 **Notification System**
- **Toast notifications** with neon styling
- **Auto-dismissing** with configurable duration
- **Multiple types**: info, success, warning, error
- **Position controls**: 6 different placements
- **Queue management**: Max 5 concurrent notifications

### 📦 **Enhanced Metadata Export**
- **5 export formats**: JSON, CSV, XML, TXT, Frame-only JSON
- **One-click export all** formats
- **Copy to clipboard** functionality
- **Rich frame metadata** with grid positions and transformations
- **Cost tracking** embedded in metadata

---

## 🚀 Quick Start

### Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

### Basic Usage

```tsx
import { NotificationProvider } from './components/NotificationSystem';
import { QualitySelector } from './components/QualitySelector';
import { CostTracker } from './components/CostTracker';
import { CostAnalyticsDashboard } from './components/CostAnalyticsDashboard';
import { HoloButton, HoloCard, HoloBadge } from './components/HoloUI';
import { HoloUIStyles } from './components/HoloUI';

function App() {
  const [qualityTier, setQualityTier] = useState('nano');

  return (
    <NotificationProvider position="top-right">
      {/* Add HoloUI styles */}
      <style>{HoloUIStyles}</style>

      {/* Quality selector with holographic styling */}
      <QualitySelector
        value={qualityTier}
        onChange={setQualityTier}
      />

      {/* Cost tracker with real-time updates */}
      <CostTracker
        currentQualityTier={qualityTier}
        pendingGenerations={5}
      />

      {/* Analytics dashboard */}
      <CostAnalyticsDashboard />

      {/* Use holographic UI components */}
      <HoloButton variant="primary" size="lg">
        Generate Animation
      </HoloButton>

      <HoloCard title="Info" variant="glass">
        Content goes here
      </HoloCard>
    </NotificationProvider>
  );
}
```

---

## 📚 Component API

### QualitySelector

Select animation quality tier with visual cards.

```tsx
<QualitySelector
  value={qualityTier}
  onChange={(tier) => setQualityTier(tier)}
  disabled={false}
/>
```

**Props:**
- `value`: Current selected tier (`'nano' | 'preview' | 'standard' | 'hd'`)
- `onChange`: Callback when tier changes
- `disabled`: Disable all selections

**Features:**
- Holographic borders when selected
- Neon pulse rings on hover (tier-specific colors)
- Glass shine reflection animation
- Skeuomorphic FREE badge for nano tier
- Visual specs with emoji icons

---

### CostTracker

Track usage costs in real-time with expandable details.

```tsx
<CostTracker
  currentQualityTier="standard"
  pendingGenerations={3}
/>
```

**Props:**
- `currentQualityTier`: Currently selected tier
- `pendingGenerations`: Number of queued generations

**Features:**
- Embossed header panel (skeuomorphic)
- Holographic shimmer on cost value
- Glass morphism cards with blur
- Neon tier badges in usage table
- Modal with entrance animation
- Export options (summary, reset)

---

### CostAnalyticsDashboard

Comprehensive analytics with insights and recommendations.

```tsx
<CostAnalyticsDashboard />
```

**Features:**
- 4 key metric cards (total cost, generations, avg cost, efficiency)
- Animated progress bars for each tier
- Cost distribution breakdown
- Smart insights based on usage patterns
- Export to CSV, JSON, or copy to clipboard
- Projected monthly cost calculator

---

### HoloButton

Holographic button with multiple variants and states.

```tsx
<HoloButton
  variant="primary"
  size="md"
  onClick={handleClick}
  loading={isLoading}
  icon={<Icon />}
  fullWidth={false}
  disabled={false}
>
  Click Me
</HoloButton>
```

**Variants:**
- `primary`: Purple-magenta-yellow gradient with shimmer
- `secondary`: Dark with purple border and glow
- `danger`: Magenta gradient for destructive actions
- `success`: Yellow gradient for confirmations

**Sizes:** `sm`, `md`, `lg`

---

### HoloBadge

Neon glowing badge component.

```tsx
<HoloBadge
  variant="purple"
  size="md"
  pulse={true}
>
  NANO
</HoloBadge>
```

**Variants:**
- `purple`: Neon purple with glow
- `magenta`: Neon magenta with glow
- `yellow`: Neon yellow with glow
- `gradient`: Full holographic gradient

---

### HoloCard

Glass morphism card with optional header.

```tsx
<HoloCard
  title="Card Title"
  icon={<Icon />}
  variant="glass"
  hoverable={true}
  onClick={() => console.log('clicked')}
>
  Card content
</HoloCard>
```

**Variants:**
- `default`: Standard dark card
- `elevated`: Raised with stronger shadows
- `glass`: Full glass morphism effect

---

### HoloProgress

Animated progress bar with neon styling.

```tsx
<HoloProgress
  value={75}
  max={100}
  variant="gradient"
  showLabel={true}
  animated={true}
/>
```

**Variants:** `purple`, `magenta`, `yellow`, `gradient`

---

### NotificationProvider

Context provider for toast notifications.

```tsx
<NotificationProvider
  maxNotifications={5}
  position="top-right"
>
  {children}
</NotificationProvider>
```

**Positions:**
- `top-right`, `top-left`, `top-center`
- `bottom-right`, `bottom-left`, `bottom-center`

---

## 🎣 Hooks

### useNotifications

Access notification system from any component.

```tsx
const { notify, success, error, warning, info } = useNotifications();

// Show notifications
success('Operation completed!');
error('Something went wrong');
warning('Please check your input');
info('FYI: New feature available');

// Custom notification
notify('Custom message', 'info', 5000); // 5 second duration
```

---

### useKeyboardShortcut

Add keyboard shortcuts to your components.

```tsx
useKeyboardShortcut('s', handleSave, { ctrl: true });
// Triggers on Ctrl+S

useKeyboardShortcut('Escape', handleClose);
// Triggers on Escape key
```

---

### useCopyToClipboard

Copy text with automatic success/error notifications.

```tsx
const copyToClipboard = useCopyToClipboard();

const handleCopy = () => {
  copyToClipboard('Text to copy', 'Custom success message');
};
```

---

### useDownload

Download files with automatic notifications.

```tsx
const download = useDownload();

const handleExport = () => {
  download(csvContent, 'data.csv', 'text/csv');
  download(jsonContent, 'data.json', 'application/json');
};
```

---

## 🎨 Design System

### Brand Colors

```typescript
import { CLEAR_SEAS_BRAND } from './design-tokens';

// Neon colors
const purple = '#B026FF';
const magenta = '#FF006E';
const yellow = '#FFBE0B';

// Backgrounds
const black = '#000000';
const darkGray = '#0A0A0A';
const midGray = '#1A1A1A';

// Text
const textPrimary = '#FFFFFF';
const textSecondary = '#E0E0E0';
const textMuted = '#808080';
```

### Shadows & Effects

```css
/* Neon glow (purple) */
box-shadow:
  0 0 20px rgba(176, 38, 255, 0.6),
  0 0 40px rgba(176, 38, 255, 0.4),
  0 0 60px rgba(176, 38, 255, 0.2);

/* Skeuomorphic emboss */
box-shadow:
  inset 0 2px 4px rgba(255, 255, 255, 0.1),
  inset 0 -2px 4px rgba(0, 0, 0, 0.5);

/* Glass morphism */
background: rgba(0, 0, 0, 0.7);
backdrop-filter: blur(20px);
-webkit-backdrop-filter: blur(20px);

/* Holographic border */
border: 2px solid transparent;
background:
  linear-gradient(#000, #000) padding-box,
  linear-gradient(135deg, #B026FF 0%, #FF006E 50%, #FFBE0B 100%) border-box;
```

### Animations

```css
/* Available global animations */
animation: holoShimmer 3s ease-in-out infinite;
animation: neonPulse 2s ease-in-out infinite;
animation: glitchEffect 0.3s ease-in-out;
animation: holoText 4s linear infinite;
animation: glassReflection 2s ease infinite;
```

---

## 💾 Metadata Export

### Export Formats

```tsx
import {
  exportMetadataAsJson,
  exportMetadataAsCSV,
  exportMetadataAsXML,
  exportMetadataReport,
  exportFrameDataAsJson,
  exportAllFormats,
  copyMetadataToClipboard,
  previewMetadata
} from './services/metadataService';

// Export single format
exportMetadataAsJson(metadata);
exportMetadataAsCSV(metadata);
exportMetadataAsXML(metadata);
exportMetadataReport(metadata); // TXT

// Export all formats at once (5 files)
exportAllFormats(metadata);

// Copy to clipboard
await copyMetadataToClipboard(metadata);

// Preview as string
const preview = previewMetadata(metadata);
// Returns: "zoom-classic | STANDARD | 9 frames | 1080ms | $0.0060"
```

### Metadata Structure

```typescript
interface AnimationMetadata {
  version: string;
  generatedAt: string; // ISO timestamp
  sourceImageId: string;
  sourceImageName: string;
  variantId: string;
  variantName: string;
  qualityTier: 'nano' | 'preview' | 'standard' | 'hd';
  resolution: number;
  totalFrames: number;
  frameDuration: number;
  totalDuration: number;
  isLooping: boolean;
  gridSize: number;
  frames: FrameMetadata[];
  generationOptions: {
    effectIntensity: 'low' | 'medium' | 'high';
    modifier: AnimationModifier;
    enableAntiJitter: boolean;
  };
  costEstimate: number;
  spriteSheetUrl: string; // Base64 data URL
}
```

---

## 📊 Cost Tracking

### Usage Statistics

```tsx
import {
  getUsageStats,
  trackGeneration,
  estimateBatchCost,
  checkFreeTierStatus,
  formatCost,
  getCostSummary,
  resetUsageStats
} from './services/costTrackingService';

// Get current stats
const stats = getUsageStats();
console.log(stats.totalCost); // 0.042
console.log(stats.totalGenerations); // 15

// Track a generation
trackGeneration('nano', 'zoom-classic', true);

// Estimate batch cost
const estimate = estimateBatchCost([
  { qualityTier: 'nano' },
  { qualityTier: 'standard' },
  { qualityTier: 'hd' }
]);
console.log(formatCost(estimate)); // "$0.013"

// Check free tier status
const status = checkFreeTierStatus();
if (!status.withinLimits) {
  console.log('Free tier limit reached!');
}

// Get text summary
const summary = getCostSummary();
console.log(summary);

// Reset all stats
resetUsageStats();
```

---

## 🎯 Cost Optimization Strategies

### 1. Use Nano Mode for Testing
```tsx
// Start with nano to test variants
<QualitySelector value="nano" onChange={setTier} />
// Save 83% compared to standard ($0.001 vs $0.006)
```

### 2. Batch Operations Wisely
```tsx
// Estimate before batch processing
const cost = estimateBatchCost(requests);
if (cost > 0.10) {
  if (!confirm(`This will cost ${formatCost(cost)}. Continue?`)) {
    return;
  }
}
```

### 3. Monitor Efficiency Score
```tsx
// Aim for 70%+ nano usage
const analytics = /* from dashboard */;
if (analytics.efficiencyScore < 50) {
  notify('Consider using nano mode more often to reduce costs', 'info');
}
```

### 4. Set Daily Limits
```tsx
// Check limits before generation
const status = checkFreeTierStatus();
if (!status.withinLimits) {
  notify('Daily limit reached. Upgrade or wait until tomorrow.', 'warning');
  return;
}
```

---

## 🔧 Customization

### Custom Brand Colors

Edit `design-tokens.ts`:

```typescript
export const CLEAR_SEAS_BRAND = {
  colors: {
    neonPurple: '#YOUR_COLOR',
    neonMagenta: '#YOUR_COLOR',
    neonYellow: '#YOUR_COLOR',
    // ... more colors
  },
  // ... other design tokens
};
```

### Custom Quality Tiers

Edit `types.ts`:

```typescript
export const QUALITY_TIERS: Record<QualityTier, QualityConfig> = {
  nano: {
    resolution: 256,
    frameCount: 4,
    estimatedCost: 0.001,
    label: 'Nano (Free)',
    description: '256×256, 4 frames - Fast preview'
  },
  // Add your custom tiers...
};
```

### Custom Animations

Add to `index.html`:

```css
@keyframes myCustomAnimation {
  from { /* start state */ }
  to { /* end state */ }
}

.my-class {
  animation: myCustomAnimation 2s ease-in-out infinite;
}
```

---

## 🐛 Troubleshooting

### Notifications Not Showing

Make sure `NotificationProvider` wraps your app:

```tsx
<NotificationProvider>
  <App />
</NotificationProvider>
```

### Styles Not Applying

Import and inject HoloUI styles:

```tsx
import { HoloUIStyles } from './components/HoloUI';

<style>{HoloUIStyles}</style>
```

### Stats Not Persisting

Stats are stored in `localStorage`. Check browser settings:
- Private/Incognito mode disables localStorage
- Some ad blockers may interfere
- Clear cache if data is corrupted

---

## 📈 Performance Tips

1. **Use CSS animations** over JavaScript for smooth 60fps
2. **Hardware acceleration**: Use `transform` and `opacity`
3. **Debounce expensive operations** (stats updates, exports)
4. **Lazy load** analytics dashboard (code splitting)
5. **Limit concurrent toasts** to 5 max
6. **Use `will-change`** sparingly on animated elements

---

## 📄 License

Apache 2.0 - See LICENSE file

---

## 🙏 Credits

**Clear Seas Solution** - Holographic Cyberpunk Design System

**Design Philosophy:**
- Glass morphism for depth and transparency
- Neon glows for cyberpunk aesthetic
- Skeuomorphism in unexpected places for tactile feel
- Animated gradients for futuristic vibe

**Technology Stack:**
- React 19+ with TypeScript
- CSS animations (no external animation library)
- LocalStorage for persistence
- Clipboard API for copy functionality
- Blob API for downloads

---

## 🚀 What's Next?

### Planned Features
- [ ] Interactive cost charts (line/bar graphs)
- [ ] Cost alerts when approaching limits
- [ ] AI-powered tier recommendations
- [ ] Batch export queue manager
- [ ] Dark/light theme toggle
- [ ] Custom keyboard shortcuts editor
- [ ] Usage history timeline
- [ ] Cost comparison calculator
- [ ] WebGL holographic effects
- [ ] Sound effects (optional)

---

**Made with 💜 by Clear Seas Solution**

*"Where creativity meets efficiency in a holographic cyberpunk paradise"*
