/**
 * Web Audio API synthesizer for instant, reliable notification chimes and call ringtones.
 * Does not rely on remote MP3 files, works 100% offline, and handles browser audio autoplay policies gracefully.
 */

let audioCtx: AudioContext | null = null
let ringtoneInterval: any = null
let ringbackInterval: any = null
let activeOscillators: OscillatorNode[] = []

/**
 * Proactively unlocks AudioContext on the first mobile gesture (touchstart/click)
 * so sounds and ringtones can ring immediately without browser blockage.
 */
export const initAudioUnlock = () => {
  if (typeof window === 'undefined') return
  const unlock = () => {
    try {
      const ctx = getAudioContext()
      if (ctx && ctx.state === 'suspended') {
        void ctx.resume()
      }
    } catch {}
  }
  window.addEventListener('touchstart', unlock, { passive: true })
  window.addEventListener('touchend', unlock, { passive: true })
  window.addEventListener('click', unlock, { passive: true })
}

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
    osc1.type = 'triangle'
    osc1.frequency.setValueAtTime(659.25, now) // E5
    gain1.gain.setValueAtTime(0.45, now)
    gain1.gain.exponentialRampToValueAtTime(0.0001, now + 0.18)
    osc1.connect(gain1)
    gain1.connect(ctx.destination)
    osc1.start(now)
    osc1.stop(now + 0.18)

    // Tone 2: 987.77 Hz (B5 chime)
    const osc2 = ctx.createOscillator()
    const gain2 = ctx.createGain()
    osc2.type = 'sine'
    osc2.frequency.setValueAtTime(987.77, now + 0.08)
    gain2.gain.setValueAtTime(0.5, now + 0.08)
    gain2.gain.exponentialRampToValueAtTime(0.0001, now + 0.48)
    osc2.connect(gain2)
    gain2.connect(ctx.destination)
    osc2.start(now + 0.08)
    osc2.stop(now + 0.48)

    // Mobile vibration if supported
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      navigator.vibrate([150, 75, 150])
    }
  } catch (err) {
    console.debug('Notification sound playback notice:', err)
  }
}

/**
 * Starts continuous looping ringtone for incoming calls.
 * Plays melodic ringtone cadence (E5 -> G#5 -> B5 -> E6) and triggers device vibration.
 */
export const startRingtone = () => {
  if (typeof window === 'undefined') return
  stopRingtone()

  const playChimeCycle = () => {
    try {
      const ctx = getAudioContext()
      if (!ctx) return
      const now = ctx.currentTime
      const notes = [659.25, 830.61, 987.77, 1318.51] // E5, G#5, B5, E6
      
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator()
        const gain = ctx.createGain()
        osc.type = 'triangle'
        osc.frequency.setValueAtTime(freq, now + idx * 0.14)
        gain.gain.setValueAtTime(0.35, now + idx * 0.14)
        gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.14 + 0.3)
        osc.connect(gain)
        gain.connect(ctx.destination)
        osc.start(now + idx * 0.14)
        osc.stop(now + idx * 0.14 + 0.3)
        activeOscillators.push(osc)
      })

      // Repeat rapid mini cadence in second half of cycle
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator()
        const gain = ctx.createGain()
        osc.type = 'sine'
        osc.frequency.setValueAtTime(freq, now + 0.7 + idx * 0.12)
        gain.gain.setValueAtTime(0.35, now + 0.7 + idx * 0.12)
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.7 + idx * 0.12 + 0.28)
        osc.connect(gain)
        gain.connect(ctx.destination)
        osc.start(now + 0.7 + idx * 0.12)
        osc.stop(now + 0.7 + idx * 0.12 + 0.28)
        activeOscillators.push(osc)
      })

      // Mobile phone vibration pulse
      if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
        navigator.vibrate([400, 200, 400, 200, 400])
      }
    } catch (e) {
      console.debug('Ringtone playback error', e)
    }
  }

  playChimeCycle()
  ringtoneInterval = setInterval(playChimeCycle, 2400)
}

/**
 * Starts continuous ringback tone for caller while calling out.
 * Plays classic standard ringback tone (440Hz + 480Hz) 1.2s on, 1.8s pause.
 */
export const startRingbackTone = () => {
  if (typeof window === 'undefined') return
  stopRingtone()

  const playRingback = () => {
    try {
      const ctx = getAudioContext()
      if (!ctx) return
      const now = ctx.currentTime

      const osc1 = ctx.createOscillator()
      const osc2 = ctx.createOscillator()
      const gain = ctx.createGain()

      osc1.type = 'sine'
      osc1.frequency.setValueAtTime(440, now) // 440 Hz
      osc2.type = 'sine'
      osc2.frequency.setValueAtTime(480, now) // 480 Hz

      gain.gain.setValueAtTime(0.12, now)
      gain.gain.setValueAtTime(0.12, now + 1.2)
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.25)

      osc1.connect(gain)
      osc2.connect(gain)
      gain.connect(ctx.destination)

      osc1.start(now)
      osc2.start(now)
      osc1.stop(now + 1.25)
      osc2.stop(now + 1.25)

      activeOscillators.push(osc1, osc2)
    } catch (e) {
      console.debug('Ringback tone error', e)
    }
  }

  playRingback()
  ringbackInterval = setInterval(playRingback, 3000)
}

/**
 * Stops all active ringtones and vibrations immediately.
 */
export const stopRingtone = () => {
  if (ringtoneInterval) {
    clearInterval(ringtoneInterval)
    ringtoneInterval = null
  }
  if (ringbackInterval) {
    clearInterval(ringbackInterval)
    ringbackInterval = null
  }
  activeOscillators.forEach((osc) => {
    try {
      osc.stop()
      osc.disconnect()
    } catch {}
  })
  activeOscillators = []
  if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
    try {
      navigator.vibrate(0)
    } catch {}
  }
}
