/**
 * Web Audio API synthesizer for instant, reliable notification chimes.
 * Does not rely on remote MP3 files, works 100% offline, and handles browser audio autoplay policies gracefully.
 */

let audioCtx: AudioContext | null = null

const getAudioContext = (): AudioContext | null => {
  if (typeof window === 'undefined') return null
  try {
    if (!audioCtx) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext
      if (AudioCtx) {
        audioCtx = new AudioCtx()
      }
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      void audioCtx.resume()
    }
    return audioCtx
  } catch (e) {
    return null
  }
}

/**
 * Plays a modern, crisp dual-tone notification chime (D5 -> A5).
 */
export const playNotificationSound = () => {
  if (typeof window === 'undefined') return
  try {
    const ctx = getAudioContext()
    if (!ctx) return

    const now = ctx.currentTime

    // Tone 1: 587.33 Hz (D5)
    const osc1 = ctx.createOscillator()
    const gain1 = ctx.createGain()
    osc1.type = 'sine'
    osc1.frequency.setValueAtTime(587.33, now)
    gain1.gain.setValueAtTime(0.18, now)
    gain1.gain.exponentialRampToValueAtTime(0.0001, now + 0.16)
    osc1.connect(gain1)
    gain1.connect(ctx.destination)
    osc1.start(now)
    osc1.stop(now + 0.16)

    // Tone 2: 880.00 Hz (A5)
    const osc2 = ctx.createOscillator()
    const gain2 = ctx.createGain()
    osc2.type = 'sine'
    osc2.frequency.setValueAtTime(880.0, now + 0.09)
    gain2.gain.setValueAtTime(0.22, now + 0.09)
    gain2.gain.exponentialRampToValueAtTime(0.0001, now + 0.38)
    osc2.connect(gain2)
    gain2.connect(ctx.destination)
    osc2.start(now + 0.09)
    osc2.stop(now + 0.38)
  } catch (err) {
    console.debug('Notification sound playback notice:', err)
  }
}
