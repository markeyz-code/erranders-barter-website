/**
 * Campus Notification Sound Synthesizer via Web Audio API.
 * Synthesizes a crisp, pleasant two-tone chime bell with zero network latency
 * and no external audio file dependencies.
 */
let audioCtx: AudioContext | null = null;

export const playNotificationChime = () => {
  try {
    if (typeof window === 'undefined') return;
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;

    if (!audioCtx) {
      audioCtx = new AudioContextClass();
    }
    if (audioCtx.state === 'suspended') {
      void audioCtx.resume();
    }

    const now = audioCtx.currentTime;

    // Tone 1: Warm foundation bell (880Hz / A5)
    const osc1 = audioCtx.createOscillator();
    const gain1 = audioCtx.createGain();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(880, now);
    gain1.gain.setValueAtTime(0.25, now);
    gain1.gain.exponentialRampToValueAtTime(0.0001, now + 0.35);
    osc1.connect(gain1);
    gain1.connect(audioCtx.destination);
    osc1.start(now);
    osc1.stop(now + 0.35);

    // Tone 2: Ascending bright chime (1318.5Hz / E6)
    const osc2 = audioCtx.createOscillator();
    const gain2 = audioCtx.createGain();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(1318.5, now + 0.09);
    gain2.gain.setValueAtTime(0.3, now + 0.09);
    gain2.gain.exponentialRampToValueAtTime(0.0001, now + 0.6);
    osc2.connect(gain2);
    gain2.connect(audioCtx.destination);
    osc2.start(now + 0.09);
    osc2.stop(now + 0.6);
  } catch (err) {
    console.debug('Notification sound suppressed:', err);
  }
};

export const useNotificationSound = () => {
  return {
    playNotificationChime,
  };
};
