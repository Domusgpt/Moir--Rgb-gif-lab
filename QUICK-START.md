# 🎵 Quick Start Guide: Music-Responsive GIF Animator

## Getting Started in 3 Steps

### Prerequisites
- Modern web browser (Chrome, Firefox, Edge, Safari)
- Node.js 18+ installed
- An image file (PNG, JPG, etc.)
- An audio file (MP3, WAV, OGG, etc.)

### Installation

```bash
# Clone the repository
git clone https://github.com/Domusgpt/Moir--Rgb-gif-lab.git
cd Moir--Rgb-gif-lab

# Checkout the music-responsive branch
git checkout claude/music-responsive-gif-animator-018d11GGadNn3nAa5WKLJLxU

# Install dependencies
npm install

# Start development server
npm run dev
```

The app will open at `http://localhost:5173`

### Environment Setup

Create a `.env` file in the project root:

```env
VITE_GEMINI_API_KEY=your_gemini_api_key_here
```

Get a Gemini API key from [Google AI Studio](https://makersuite.google.com/app/apikey)

---

## How to Use

### Step 1: Setup Tab - Generate Animation Frames

1. **Upload an image:**
   - Click "Choose File" or drag-drop your image
   - Image will be resized to 512x512px square

2. **Choose animation style:**
   - Browse categories (Zoom, Sketch, Pixel, Neon, Glitch, etc.)
   - Click a variant to preview
   - Adjust settings:
     - Frame count: 9 or 16 frames
     - Frame duration: Speed of animation
     - Effect intensity: Low/Medium/High
     - Modifiers: Rotate, Zoom, Pan

3. **Generate frames:**
   - Click "Animate 1 Task" button
   - Wait for Gemini AI to generate your sprite sheet
   - Frames will appear in Results tab

### Step 2: Music Tab - Sync with Audio ⭐ NEW

1. **Upload audio:**
   - Click "Music" tab
   - Drag-drop your audio file (MP3, WAV, etc.)
   - Or click "Choose Audio File"
   - Audio player appears with waveform

2. **Choose choreography style:**
   - Select from 7 styles:
     - 😌 **Chill:** Smooth, gentle transitions
     - 🎾 **Bounce:** Energetic, beat-reactive
     - ⚡ **Strobe:** Rapid changes on strong beats
     - 🏢 **Logo-Safe:** Subtle, professional
     - 🔀 **Glitch:** Chaotic, fragmented
     - 💗 **Pulse:** Rhythmic breathing
     - 🌊 **Wave:** Smooth cycling
   - Adjust intensity slider (0-100%)

3. **Set clip duration:**
   - Choose preset (10s, 15s, 20s, 30s)
   - Or use custom slider (5-60s)
   - System suggests durations based on your audio

4. **Generate music animation:**
   - Click "✨ Generate Music Animation" button
   - System analyzes audio (bass, mid, high frequencies)
   - Detects beats and BPM
   - Creates choreographed frame timeline
   - Preview appears automatically

5. **Preview and play:**
   - Click ▶ to play synchronized animation
   - Watch frames change in sync with music
   - Real-time frequency visualization
   - Beat indicator pulses on hits

6. **Export video with audio:** ⭐ NEW
   - Click "💾 Export Video with Audio" button
   - Choose format (WebM or MP4)
   - Select quality (Low/Medium/High/Ultra)
   - Adjust FPS (12-60)
   - Toggle audio track on/off
   - Click "🎬 Export Video"
   - Wait for rendering (progress bar shows status)
   - Download your music-responsive video!

### Step 3: Results Tab - View Completed

- View all completed animations
- Click to view full-screen
- Export GIF animations from the Results tab
- Export music-responsive videos from the Music tab ⭐

---

## Tips & Tricks

### For Best Results:

**Images:**
- High contrast works well with Glitch and Neon styles
- Simple shapes/logos work great for Logo-Safe
- Detailed images shine with Sketch and Watercolor

**Audio:**
- Electronic/EDM: Try **Strobe** or **Bounce** styles
- Hip-hop/Trap: Use **Bounce** with high intensity
- Ambient/Chill: Select **Chill** or **Wave** styles
- Corporate/Logo: Choose **Logo-Safe** or **Pulse**

**Settings:**
- Start with **70% intensity** and adjust
- **15-20s clips** are perfect for social media
- Use **9 frames** for faster generation
- Enable **Anti-Jitter** for smoother loops

### Workflow Optimization:

1. **Generate frames first** in Setup tab
2. Then **switch to Music tab** to sync
3. Experiment with **different styles** on same frames
4. Adjust **intensity** to fine-tune responsiveness

---

## Troubleshooting

### "Please generate animation frames first"
- Go to **Setup tab** and create animation
- Must complete frame generation before using Music tab

### Audio won't play
- Check file format (MP3, WAV supported)
- Ensure file size < 100MB
- Try different browser if issues persist

### No beat detection
- Increase **beat threshold** (coming soon)
- Use audio with clear bass/drums
- Try different choreography style

### Build errors
```bash
# Clear cache and reinstall
rm -rf node_modules dist
npm install
npm run build
```

### API errors
- Check your `VITE_GEMINI_API_KEY` in `.env`
- Verify API key is valid
- Check API quota limits

---

## Example Workflow

### Creating a Logo Loop for YouTube Intro:

1. **Setup:**
   - Upload `logo.png`
   - Choose "Neon Glow → Flicker On"
   - Set 9 frames, medium intensity
   - Generate frames

2. **Music:**
   - Upload `intro-music.mp3` (15 seconds)
   - Select "Pulse" style
   - Set 60% intensity
   - Duration: 15s (full song)
   - Generate animation

3. **Result:**
   - Logo pulses gently with beat
   - Neon glow intensifies on bass hits
   - Perfect loop for video intro

### Creating a Meme for Social Media:

1. **Setup:**
   - Upload `meme-image.jpg`
   - Choose "Glitch → Digital Loop"
   - Set 16 frames, high intensity
   - Generate frames

2. **Music:**
   - Upload `viral-sound.mp3` (10 seconds)
   - Select "Strobe" style
   - Set 90% intensity
   - Duration: 10s
   - Generate animation

3. **Result:**
   - Chaotic, attention-grabbing effect
   - Glitches intensify with drops
   - Viral-ready content

---

## Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `Space` | Play/Pause audio (when focused) |
| `Tab` | Switch between tabs |
| `←` `→` | Seek audio (coming soon) |

---

## Browser Support

| Browser | Audio Analysis | File Upload | Video Export |
|---------|---------------|-------------|--------------|
| Chrome 90+ | ✅ Full | ✅ Full | ✅ WebM/MP4 |
| Firefox 88+ | ✅ Full | ✅ Full | ✅ WebM |
| Safari 14+ | ✅ Full | ✅ Full | ⚠️ Limited |
| Edge 90+ | ✅ Full | ✅ Full | ✅ WebM/MP4 |

---

## What's Next?

Coming in future updates:

- **YouTube URL support** (extract audio from links)
- **Advanced beat detection** (onset analysis, section detection)
- **Timeline editor** (manual frame adjustment)
- **Multi-layer composition** (combine multiple animated objects)
- **Backend integration** (save projects, user accounts, cloud rendering)

---

## Need Help?

- 📖 Read [MUSIC-RESPONSIVE-IMPLEMENTATION.md](./MUSIC-RESPONSIVE-IMPLEMENTATION.md) for technical details
- 🐛 Report issues on GitHub
- 💡 Suggest features in discussions

---

**Enjoy creating music-responsive animations! 🎨🎵**
