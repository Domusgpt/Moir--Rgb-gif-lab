# Cost Breakdown Analysis - Moir RGB GIF Lab

## Executive Summary

This application uses the **Gemini 2.5 Flash Image API** for generating animated sprite sheets. Each API call processes an input image and detailed prompt to generate an animated sprite sheet with 4-16 frames.

---

## Cost Structure

### Per-Request Cost Components

Each API request incurs costs based on:

| Component | Size/Amount | Cost Impact |
|-----------|-------------|-------------|
| **Input Image** | 512×512 (preview) or 1024×1024 (full) | Token count varies by image complexity |
| **Input Prompt** | ~2000 tokens (147 lines) | Fixed per request |
| **Output Image** | 512×512 (preview) or 1024×1024 (full) sprite sheet | Token count for generated image |
| **Output JSON** | ~50 tokens (frameCount, frameDuration) | Minimal |

### Gemini 2.5 Flash Image Pricing (Estimated)

Based on Google's pricing structure:
- **Input**: ~$0.001 per 1000 tokens
- **Image Input**: 1024×1024 image = ~258 tokens, 512×512 = ~65 tokens
- **Output**: ~$0.004 per 1000 tokens
- **Image Output**: 1024×1024 image = ~258 tokens, 512×512 = ~65 tokens

### Cost Per Generation Type

| Type | Input Size | Output Size | Est. Tokens | Est. Cost |
|------|-----------|-------------|-------------|-----------|
| **Nano (NEW)** | 256×256 | 256×256 (4 frames) | ~2,100 | **$0.001** |
| **Preview** | 512×512 | 512×512 (9 frames) | ~2,130 | **$0.003** |
| **Standard** | 1024×1024 | 1024×1024 (9 frames) | ~2,516 | **$0.006** |
| **HD** | 1024×1024 | 1024×1024 (16 frames) | ~2,516 | **$0.006** |

---

## Usage Patterns & Cost Scenarios

### Current User Flow Cost Analysis

#### Scenario 1: Casual User (Exploring)
```
Actions:
- Upload 1 image
- Expand 2 categories (10 preview generations)
- Generate 1 full animation

Cost Calculation:
- 10 previews × $0.003 = $0.030
- 1 full × $0.006 = $0.006
Total: $0.036
```

#### Scenario 2: Power User (Batch Processing)
```
Actions:
- Upload 5 images
- Expand 10 categories (50 preview generations)
- Generate 25 animations (5 per image)

Cost Calculation:
- 50 previews × $0.003 = $0.150
- 25 full × $0.006 = $0.150
Total: $0.300
```

#### Scenario 3: Heavy User (Professional)
```
Actions:
- Upload 20 images
- Expand all 20 categories (100 previews)
- Generate 100 animations

Cost Calculation:
- 100 previews × $0.003 = $0.300
- 100 full × $0.006 = $0.600
Total: $0.900
```

---

## Cost Optimization Opportunities

### 1. Nano Generation Mode (NEW) 🎯
**Implementation**: 256×256 images, 4 frames (2×2 grid)
- **Cost Reduction**: 70% cheaper than preview
- **Use Case**: Initial exploration, free tier
- **Quality Trade-off**: Lower resolution but faster

### 2. Lazy Preview Loading
**Current**: Generates 5 previews when category expanded
**Optimized**: Generate preview only on hover/click
- **Cost Reduction**: ~60-80% on preview costs
- **User Impact**: Slight delay on first view

### 3. Preview Caching
**Current**: Previews regenerated per session
**Optimized**: Cache previews across sessions
- **Cost Reduction**: 100% on repeated visits
- **Storage**: ~500KB per cached preview

### 4. Batch Request Optimization
**Current**: Sequential processing (one at a time)
**Optimized**: Parallel requests (configurable concurrency)
- **Cost Impact**: Neutral (same total cost)
- **User Benefit**: Faster completion

### 5. Resolution Tiering
**Current**: Fixed 1024×1024 for all
**Optimized**: User selects quality tier
- **Tiers**:
  - Nano: 256×256, 4 frames - $0.001
  - Low: 512×512, 9 frames - $0.003
  - Standard: 1024×1024, 9 frames - $0.006
  - HD: 1024×1024, 16 frames - $0.006

---

## Free Tier Proposal

### Option A: Limited Generations
- **Daily Limit**: 10 nano generations + 2 standard generations
- **Features**: All animation types, no watermark
- **Cost per User per Day**: $0.022

### Option B: Nano-Only Free
- **Daily Limit**: Unlimited nano, pay for standard/HD
- **Features**: All animation types, upgrade for quality
- **Cost per User per Day**: Variable (~$0.05 for heavy use)

### Option C: Credit-Based System
- **Free Credits**: 100 credits per week
- **Credit Costs**:
  - Nano: 1 credit
  - Preview: 3 credits
  - Standard: 6 credits
  - HD: 6 credits
- **Cost per User per Week**: ~$0.06

---

## Cost Monitoring & Usage Tracking

### Recommended Metrics to Track

1. **Per-User Metrics**
   - Total API calls
   - Total cost incurred
   - Generation type distribution
   - Average cost per session

2. **System-Wide Metrics**
   - Daily API call volume
   - Daily cost
   - Cost per active user
   - Preview vs. full generation ratio

3. **Optimization Metrics**
   - Cache hit rate
   - Average preview requests per user
   - Conversion rate (preview → full generation)

---

## Revenue Model Suggestions

### Freemium Model
- **Free**: 10 nano + 2 standard per day
- **Basic ($5/month)**: 100 nano + 50 standard
- **Pro ($15/month)**: 500 nano + 200 standard + 50 HD
- **Enterprise ($50/month)**: Unlimited

### Pay-As-You-Go
- **Nano**: $0.002 per generation
- **Standard**: $0.01 per generation
- **HD**: $0.01 per generation
- **Bulk Discounts**: 20% off for >100 generations

---

## Implementation Priorities

### Phase 1: Cost Visibility (Week 1)
- [ ] Add cost estimation to UI
- [ ] Show per-generation cost
- [ ] Display session total cost
- [ ] Add usage tracking

### Phase 2: Optimization (Week 2)
- [ ] Implement nano generation mode
- [ ] Add resolution tier selection
- [ ] Implement preview caching
- [ ] Add lazy preview loading

### Phase 3: Monetization (Week 3)
- [ ] Implement credit system
- [ ] Add usage limits
- [ ] Create upgrade flow
- [ ] Add payment integration

---

## Technical Debt & Risks

### Current Issues
1. **No rate limiting**: Users can spam API
2. **No cost tracking**: No visibility into actual costs
3. **No user quotas**: Unlimited usage
4. **No cache invalidation**: Stale previews possible

### Security Considerations
1. **API Key Exposure**: Ensure key is server-side only
2. **Request Validation**: Validate all user inputs
3. **Rate Limiting**: Implement per-user/IP limits
4. **Cost Caps**: Set maximum cost per user per day

---

## Estimated Monthly Costs

| User Tier | Users | Avg Cost/User/Month | Total |
|-----------|-------|---------------------|-------|
| Free (Limited) | 1,000 | $0.66 | $660 |
| Free (Nano) | 1,000 | $1.50 | $1,500 |
| Basic | 100 | $3.00 | $300 |
| Pro | 20 | $9.00 | $180 |
| **Total** | **1,120** | - | **$2,640** |

**Revenue Potential** (Basic + Pro): $680/month
**Net Cost**: -$1,960/month

**With 10% conversion to paid**:
- Free: 900 users × $1.50 = $1,350
- Basic: 180 users × $3.00 = $540 (revenue: $900)
- Pro: 40 users × $9.00 = $360 (revenue: $600)
- **Total Cost**: $2,250
- **Total Revenue**: $1,500
- **Net**: -$750/month

---

## Recommendations

1. **Implement nano mode immediately** - Reduces baseline costs by 70%
2. **Add cost visibility** - Users understand value
3. **Implement caching** - Reduces repeat costs
4. **Start with freemium model** - 10 nano + 2 standard per day
5. **Add usage analytics** - Track actual costs vs. projections
6. **Consider server-side API key** - Prevent abuse
7. **Implement rate limiting** - Protect against cost spikes

---

Last Updated: 2025-11-01
