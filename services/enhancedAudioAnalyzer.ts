/**
 * Enhanced Audio Analyzer with OfflineAudioContext
 * Much faster than real-time analysis - processes audio in milliseconds instead of playing entire track
 */

import { AudioFeatures, BeatInfo } from './audioAnalyzer';

export interface AdvancedAudioFeatures extends AudioFeatures {
  spectralCentroid: number;  // 0-1, brightness of sound
  spectralRolloff: number;   // 0-1, frequency below which 85% of energy is contained
  zcr: number;               // Zero crossing rate (percussive vs tonal)
  onset: boolean;            // More sophisticated onset detection
  energy: number;            // Instantaneous energy
}

export interface Section {
  start: number;             // Start time in seconds
  end: number;               // End time in seconds
  label: 'intro' | 'verse' | 'chorus' | 'bridge' | 'drop' | 'outro' | 'build' | 'breakdown';
  energy: 'low' | 'medium' | 'high';
  confidence: number;        // 0-1
}

export class EnhancedAudioAnalyzer {
  /**
   * Analyze audio file using OfflineAudioContext (fast, non-blocking)
   */
  public static async analyzeAudioOffline(
    audioBuffer: ArrayBuffer,
    duration: number,
    sampleRate: number = 30 // samples per second
  ): Promise<AdvancedAudioFeatures[]> {
    // Create offline context for fast processing
    const totalSamples = Math.ceil(duration * sampleRate);
    const offlineContext = new OfflineAudioContext(2, totalSamples * 1024, 44100);

    // Decode audio data
    const audioBufferData = await offlineContext.decodeAudioData(audioBuffer.slice(0));

    // Create analyser
    const analyser = offlineContext.createAnalyser();
    analyser.fftSize = 2048;
    analyser.smoothingTimeConstant = 0;

    // Create buffer source
    const source = offlineContext.createBufferSource();
    source.buffer = audioBufferData;
    source.connect(analyser);
    analyser.connect(offlineContext.destination);

    // Start rendering
    source.start(0);

    const features: AdvancedAudioFeatures[] = [];
    const dataArray = new Uint8Array(analyser.frequencyBinCount);
    const timeDataArray = new Uint8Array(analyser.fftSize);

    // Sample at regular intervals
    const interval = 1 / sampleRate;
    let lastEnergy = 0;
    const energyHistory: number[] = [];

    for (let i = 0; i < totalSamples; i++) {
      const currentTime = i * interval;

      if (currentTime >= audioBufferData.duration) break;

      // Get frequency and time domain data
      analyser.getByteFrequencyData(dataArray);
      analyser.getByteTimeDomainData(timeDataArray);

      // Calculate advanced features
      const bass = this.getAverageBandEnergy(dataArray, 0, 10);
      const mid = this.getAverageBandEnergy(dataArray, 10, 100);
      const high = this.getAverageBandEnergy(dataArray, 100, 512);
      const rms = this.calculateRMS(dataArray);
      const energy = this.calculateEnergy(dataArray);

      // Spectral features
      const spectralCentroid = this.calculateSpectralCentroid(dataArray);
      const spectralRolloff = this.calculateSpectralRolloff(dataArray, 0.85);
      const zcr = this.calculateZeroCrossingRate(timeDataArray);

      // Onset detection (more sophisticated than simple beat detection)
      const onset = this.detectOnset(energy, lastEnergy, energyHistory);

      // Beat detection (threshold-based)
      const beat = bass > 0.7;

      energyHistory.push(energy);
      if (energyHistory.length > 10) energyHistory.shift();

      features.push({
        bass,
        mid,
        high,
        rms,
        lowMid: bass * 0.6 + mid * 0.4,
        beat,
        bpm: 0, // Will be calculated separately
        time: currentTime,
        spectralCentroid,
        spectralRolloff,
        zcr,
        onset,
        energy
      });

      lastEnergy = energy;
    }

    // Calculate BPM from detected beats
    const bpm = this.calculateBPM(features);
    features.forEach(f => f.bpm = bpm);

    return features;
  }

  /**
   * Detect sections (intro/verse/chorus/drop/etc.) using energy and structure analysis
   */
  public static detectSections(features: AdvancedAudioFeatures[]): Section[] {
    if (features.length === 0) return [];

    const sections: Section[] = [];
    const windowSize = 30; // 1 second at 30 samples/sec
    const minSectionLength = 4; // Minimum 4 seconds per section

    // Calculate energy envelope
    const energyEnvelope = this.smoothArray(
      features.map(f => f.energy),
      windowSize
    );

    // Find energy peaks and valleys
    const peaks = this.findPeaks(energyEnvelope, 0.1);
    const valleys = this.findValleys(energyEnvelope, 0.1);

    // Segment by energy changes
    let currentSectionStart = 0;
    let lastLabel: Section['label'] = 'intro';

    for (let i = windowSize; i < energyEnvelope.length - windowSize; i++) {
      const isPeak = peaks.includes(i);
      const isValley = valleys.includes(i);
      const sectionDuration = i - currentSectionStart;

      // Check if we should start a new section
      if ((isPeak || isValley) && sectionDuration >= minSectionLength) {
        const avgEnergy = this.average(
          energyEnvelope.slice(currentSectionStart, i)
        );

        const energy: Section['energy'] =
          avgEnergy > 0.7 ? 'high' :
          avgEnergy > 0.4 ? 'medium' : 'low';

        // Determine label based on position and energy
        const position = currentSectionStart / energyEnvelope.length;
        let label: Section['label'];

        if (position < 0.1) {
          label = 'intro';
        } else if (position > 0.9) {
          label = 'outro';
        } else if (isPeak && energy === 'high') {
          label = 'chorus';
        } else if (isValley && energy === 'low') {
          label = 'verse';
        } else if (isPeak && lastLabel === 'verse') {
          label = 'chorus';
        } else if (isPeak) {
          label = 'drop';
        } else {
          label = 'bridge';
        }

        sections.push({
          start: features[currentSectionStart].time,
          end: features[i].time,
          label,
          energy,
          confidence: 0.8 // Simple confidence for now
        });

        currentSectionStart = i;
        lastLabel = label;
      }
    }

    // Add final section
    if (currentSectionStart < energyEnvelope.length) {
      const avgEnergy = this.average(
        energyEnvelope.slice(currentSectionStart)
      );

      sections.push({
        start: features[currentSectionStart].time,
        end: features[features.length - 1].time,
        label: 'outro',
        energy: avgEnergy > 0.5 ? 'high' : 'low',
        confidence: 0.8
      });
    }

    return sections;
  }

  // ============================================================================
  // Helper Methods
  // ============================================================================

  private static getAverageBandEnergy(
    data: Uint8Array,
    startBin: number,
    endBin: number
  ): number {
    let sum = 0;
    const actualEnd = Math.min(endBin, data.length);

    for (let i = startBin; i < actualEnd; i++) {
      sum += data[i];
    }

    return (sum / (actualEnd - startBin)) / 255;
  }

  private static calculateRMS(data: Uint8Array): number {
    let sum = 0;
    for (let i = 0; i < data.length; i++) {
      const normalized = data[i] / 255;
      sum += normalized * normalized;
    }
    return Math.sqrt(sum / data.length);
  }

  private static calculateEnergy(data: Uint8Array): number {
    let sum = 0;
    for (let i = 0; i < data.length; i++) {
      sum += (data[i] / 255) ** 2;
    }
    return sum / data.length;
  }

  private static calculateSpectralCentroid(data: Uint8Array): number {
    let numerator = 0;
    let denominator = 0;

    for (let i = 0; i < data.length; i++) {
      const magnitude = data[i] / 255;
      numerator += i * magnitude;
      denominator += magnitude;
    }

    return denominator > 0 ? (numerator / denominator) / data.length : 0;
  }

  private static calculateSpectralRolloff(
    data: Uint8Array,
    threshold: number
  ): number {
    const totalEnergy = data.reduce((sum, val) => sum + val, 0);
    const targetEnergy = totalEnergy * threshold;

    let cumulativeEnergy = 0;
    for (let i = 0; i < data.length; i++) {
      cumulativeEnergy += data[i];
      if (cumulativeEnergy >= targetEnergy) {
        return i / data.length;
      }
    }

    return 1;
  }

  private static calculateZeroCrossingRate(timeData: Uint8Array): number {
    let crossings = 0;
    for (let i = 1; i < timeData.length; i++) {
      if ((timeData[i] >= 128 && timeData[i - 1] < 128) ||
          (timeData[i] < 128 && timeData[i - 1] >= 128)) {
        crossings++;
      }
    }
    return crossings / timeData.length;
  }

  private static detectOnset(
    energy: number,
    lastEnergy: number,
    history: number[]
  ): boolean {
    if (history.length < 5) return false;

    const avgEnergy = this.average(history);
    const threshold = avgEnergy * 1.5;

    return energy > threshold && energy > lastEnergy * 1.2;
  }

  private static calculateBPM(features: AdvancedAudioFeatures[]): number {
    const onsets = features.filter(f => f.onset);

    if (onsets.length < 2) return 120; // Default BPM

    // Calculate intervals between onsets
    const intervals: number[] = [];
    for (let i = 1; i < onsets.length; i++) {
      intervals.push(onsets[i].time - onsets[i - 1].time);
    }

    // Cluster intervals to find most common tempo
    const avgInterval = this.median(intervals);
    const bpm = 60 / avgInterval;

    // Clamp to reasonable range
    return Math.max(60, Math.min(200, Math.round(bpm)));
  }

  private static smoothArray(data: number[], windowSize: number): number[] {
    const smoothed: number[] = [];

    for (let i = 0; i < data.length; i++) {
      const start = Math.max(0, i - Math.floor(windowSize / 2));
      const end = Math.min(data.length, i + Math.ceil(windowSize / 2));

      const sum = data.slice(start, end).reduce((a, b) => a + b, 0);
      smoothed.push(sum / (end - start));
    }

    return smoothed;
  }

  private static findPeaks(data: number[], minProminence: number): number[] {
    const peaks: number[] = [];

    for (let i = 1; i < data.length - 1; i++) {
      if (data[i] > data[i - 1] && data[i] > data[i + 1] && data[i] > minProminence) {
        peaks.push(i);
      }
    }

    return peaks;
  }

  private static findValleys(data: number[], maxDepth: number): number[] {
    const valleys: number[] = [];

    for (let i = 1; i < data.length - 1; i++) {
      if (data[i] < data[i - 1] && data[i] < data[i + 1] && data[i] < maxDepth) {
        valleys.push(i);
      }
    }

    return valleys;
  }

  private static average(data: number[]): number {
    return data.reduce((a, b) => a + b, 0) / data.length;
  }

  private static median(data: number[]): number {
    const sorted = [...data].sort((a, b) => a - b);
    const mid = Math.floor(sorted.length / 2);

    if (sorted.length % 2 === 0) {
      return (sorted[mid - 1] + sorted[mid]) / 2;
    }

    return sorted[mid];
  }
}
