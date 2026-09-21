// Ambient Web Audio Focus Synthesizer
// Generates soothing harmonic ambient waves and soft binaural focus tones in real-time
class FocusAudioSynth {
  constructor() {
    this.ctx = null;
    this.isPlaying = false;
    this.gainNode = null;
    this.oscillators = [];
  }

  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  start() {
    this.init();
    if (this.isPlaying) return;

    this.isPlaying = true;
    const now = this.ctx.currentTime;

    // Master Gain
    this.gainNode = this.ctx.createGain();
    this.gainNode.gain.setValueAtTime(0.001, now);
    this.gainNode.gain.exponentialRampToValueAtTime(0.18, now + 3);

    // Master Lowpass Filter for cozy, warm acoustic texture
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(420, now);
    filter.Q.setValueAtTime(1.5, now);

    this.gainNode.connect(filter);
    filter.connect(this.ctx.destination);

    // Relaxing 432Hz harmonic chord drone (A432 tuning: A4=432, E4=324, C#4=272, F#3=183)
    const freqs = [108, 162, 216, 272, 324];
    this.oscillators = [];

    freqs.forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      osc.type = idx % 2 === 0 ? 'sine' : 'triangle';
      osc.frequency.setValueAtTime(freq, now);

      // Subtle slow frequency modulation (LFO) for organic breathing movement
      const lfo = this.ctx.createOscillator();
      lfo.frequency.setValueAtTime(0.08 + idx * 0.03, now);
      const lfoGain = this.ctx.createGain();
      lfoGain.gain.setValueAtTime(1.2, now);
      lfo.connect(lfoGain);
      lfoGain.connect(osc.frequency);
      lfo.start(now);

      const oscGain = this.ctx.createGain();
      oscGain.gain.setValueAtTime(0.3 / (idx + 1), now);

      osc.connect(oscGain);
      oscGain.connect(this.gainNode);
      osc.start(now);

      this.oscillators.push(osc, lfo);
    });
  }

  stop() {
    if (!this.isPlaying || !this.ctx) return;
    const now = this.ctx.currentTime;
    if (this.gainNode) {
      this.gainNode.gain.exponentialRampToValueAtTime(0.0001, now + 1.2);
    }
    setTimeout(() => {
      this.oscillators.forEach(osc => {
        try { osc.stop(); osc.disconnect(); } catch (e) {}
      });
      this.oscillators = [];
      this.isPlaying = false;
    }, 1300);
  }

  toggle() {
    if (this.isPlaying) {
      this.stop();
      return false;
    } else {
      this.start();
      return true;
    }
  }
}

export const focusAudio = new FocusAudioSynth();