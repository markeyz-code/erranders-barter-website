/**
 * High-reliability audio and ringtone synthesizer with dual-engine architecture:
 * 1. HTML5 Audio with in-memory synthesized WAV blobs (bypasses iOS Safari Web Audio suspension)
 * 2. Web Audio API synthesizer for rich layered harmonics
 * Works 100% offline, zero network requests, zero external MP3 dependencies, and works reliably on iPhone / iOS Safari.
 */

let audioCtx: AudioContext | null = null
let ringtoneInterval: any = null
let ringbackInterval: any = null
let activeOscillators: OscillatorNode[] = []

let ringAudio: HTMLAudioElement | null = null
let ringbackAudio: HTMLAudioElement | null = null
let notificationAudio: HTMLAudioElement | null = null
let isUnlocked = false
let isRingtoneActive = false
let isRingbackActive = false

/**
 * Synthesizes a clean 16-bit PCM WAV in memory and returns a Blob URL.
 */
const createWavBlobUrl = (type: 'ringtone' | 'ringback' | 'notification'): string | null => {
  if (typeof window === 'undefined') return null
  try {
    const sampleRate = 22050
    const duration = type === 'ringtone' ? 2.4 : type === 'ringback' ? 2.4 : 0.45
    const numSamples = Math.floor(sampleRate * duration)
    const buffer = new ArrayBuffer(44 + numSamples * 2)
    const view = new DataView(buffer)

    // RIFF Header
    const writeString = (offset: number, str: string) => {
      for (let i = 0; i < str.length; i++) {
        view.setUint8(offset + i, str.charCodeAt(i))
      }
    }

    writeString(0, 'RIFF')
    view.setUint32(4, 36 + numSamples * 2, true)
    writeString(8, 'WAVE')
    writeString(12, 'fmt ')
    view.setUint32(16, 16, true) // subchunk1size (16 for PCM)
    view.setUint16(20, 1, true) // PCM format
    view.setUint16(22, 1, true) // mono channel
    view.setUint32(24, sampleRate, true) // sample rate
    view.setUint32(28, sampleRate * 2, true) // byte rate
    view.setUint16(32, 2, true) // block align
    view.setUint16(34, 16, true) // bits per sample
    writeString(36, 'data')
    view.setUint32(40, numSamples * 2, true)

    if (type === 'ringtone') {
      // Harmonic phone chime: E5 (659Hz), G#5 (831Hz), B5 (988Hz), E6 (1319Hz)
      const notes = [659.25, 830.61, 987.77, 1318.51]
      for (let i = 0; i < numSamples; i++) {
        const t = i / sampleRate
        let sample = 0

        // Phrase 1 (0.0s to 0.7s)
        if (t < 0.7) {
          notes.forEach((freq, idx) => {
            const noteStart = idx * 0.13
            if (t >= noteStart && t < noteStart + 0.35) {
              const nt = t - noteStart
              const env = Math.exp(-nt * 9)
              sample += Math.sin(2 * Math.PI * freq * nt) * env * 0.4
              sample += Math.sin(2 * Math.PI * freq * 2 * nt) * env * 0.12
            }
          })
        }

        // Phrase 2 (0.8s to 1.6s)
        if (t >= 0.8 && t < 1.6) {
          const t2 = t - 0.8
          notes.forEach((freq, idx) => {
            const noteStart = idx * 0.12
            if (t2 >= noteStart && t2 < noteStart + 0.3) {
              const nt = t2 - noteStart
              const env = Math.exp(-nt * 10)
              sample += Math.sin(2 * Math.PI * freq * nt) * env * 0.42
              sample += Math.sin(2 * Math.PI * freq * 2 * nt) * env * 0.14
            }
          })
        }

        const val = Math.max(-1, Math.min(1, sample))
        view.setInt16(44 + i * 2, val < 0 ? val * 32768 : val * 32767, true)
      }
    } else if (type === 'ringback') {
      // Classic 440Hz + 480Hz dial ringback tone (1.2s on, 1.2s off)
      for (let i = 0; i < numSamples; i++) {
        const t = i / sampleRate
        let sample = 0
        if (t < 1.2) {
          sample = (Math.sin(2 * Math.PI * 440 * t) + Math.sin(2 * Math.PI * 480 * t)) * 0.28
        }
        const val = Math.max(-1, Math.min(1, sample))
        view.setInt16(44 + i * 2, val < 0 ? val * 32768 : val * 32767, true)
      }
    } else {
      // Notification chime: E5 (659Hz) into B5 (988Hz)
      for (let i = 0; i < numSamples; i++) {
        const t = i / sampleRate
        let sample = 0
        if (t < 0.2) {
          sample += Math.sin(2 * Math.PI * 659.25 * t) * Math.exp(-t * 12) * 0.4
        }
        if (t >= 0.08) {
          const t2 = t - 0.08
          sample += Math.sin(2 * Math.PI * 987.77 * t2) * Math.exp(-t2 * 8) * 0.5
        }
        const val = Math.max(-1, Math.min(1, sample))
        view.setInt16(44 + i * 2, val < 0 ? val * 32768 : val * 32767, true)
      }
    }

    const blob = new Blob([buffer], { type: 'audio/wav' })
    return URL.createObjectURL(blob)
  } catch (err) {
    return null
  }
}

const ensureAudioElements = () => {
  if (typeof window === 'undefined') return
  if (!ringAudio) {
    const url = createWavBlobUrl('ringtone')
    if (url) {
      ringAudio = new Audio(url)
      ringAudio.loop = true
      ringAudio.preload = 'auto'
      ;(ringAudio as any).playsInline = true
    }
  }
  if (!ringbackAudio) {
    const url = createWavBlobUrl('ringback')
    if (url) {
      ringbackAudio = new Audio(url)
      ringbackAudio.loop = true
      ringbackAudio.preload = 'auto'
      ;(ringbackAudio as any).playsInline = true
    }
  }
  if (!notificationAudio) {
    const url = createWavBlobUrl('notification')
    if (url) {
      notificationAudio = new Audio(url)
      notificationAudio.preload = 'auto'
      ;(notificationAudio as any).playsInline = true
    }
  }
}

/**
 * Unlocks iOS Safari and mobile browser audio restrictions on the first touch/click.
 * Once HTML5 audio elements are played inside a user gesture, iOS Safari permanently
 * permits unprompted audio playback from WebSocket events.
 */
export const initAudioUnlock = () => {
  if (typeof window === 'undefined') return
  if (isUnlocked) return
  ensureAudioElements()

  /**
   * Bless the audio elements inside a user gesture so iOS Safari permits later playback
   * from a WebSocket event.
   *
   * It used to call play() on the ringtone, ringback and notification elements at their
   * normal volume, on touchstart, touchend *and* click, with the listeners never removed.
   * That meant every tap on the site played three sounds — the "noise on load" people
   * heard was the first click after a refresh.
   *
   * Now the elements are played muted once, and the listeners are removed afterwards.
   */
  const silentPlay = (el: HTMLAudioElement | null) => {
    if (!el) return
    const previousVolume = el.volume
    const restore = () => {
      el.muted = false
      el.volume = previousVolume || 1
    }
    try {
      el.muted = true
      el.volume = 0
      el.currentTime = 0
      el.play()
        .then(() => {
          el.pause()
          el.currentTime = 0
          restore()
        })
        .catch(restore)
    } catch {
      restore()
    } finally {
      // Belt and braces: whatever happens to that promise, the element must not stay
      // muted, or the ringtone is silent for the rest of the session.
      window.setTimeout(restore, 400)
    }
  }

  const unlock = () => {
    try {
      const ctx = getAudioContext()
      if (ctx && ctx.state === 'suspended') void ctx.resume()
    } catch {}

    // Never touch the elements that are legitimately playing.
    if (!isRingtoneActive && !isRingbackActive) {
      silentPlay(ringAudio)
      silentPlay(ringbackAudio)
    }
    silentPlay(notificationAudio)

    isUnlocked = true
    removeListeners()
  }

  const removeListeners = () => {
    window.removeEventListener('touchstart', unlock)
    window.removeEventListener('touchend', unlock)
    window.removeEventListener('pointerdown', unlock)
    window.removeEventListener('click', unlock)
  }

  window.addEventListener('touchstart', unlock, { passive: true })
  window.addEventListener('touchend', unlock, { passive: true })
  window.addEventListener('pointerdown', unlock, { passive: true })
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
 * Plays a modern notification chime (works on iPhone and desktop).
 */
export const playNotificationSound = () => {
  if (typeof window === 'undefined') return
  ensureAudioElements()

  // 1. Play HTML5 Audio (Mobile / iPhone reliable)
  if (notificationAudio) {
    try {
      notificationAudio.currentTime = 0
      notificationAudio.play().catch(() => {})
    } catch {}
  }

  // 2. Play Web Audio API synthesized layer
  try {
    const ctx = getAudioContext()
    if (ctx && ctx.state !== 'suspended') {
      const now = ctx.currentTime

      const osc1 = ctx.createOscillator()
      const gain1 = ctx.createGain()
      osc1.type = 'triangle'
      osc1.frequency.setValueAtTime(659.25, now)
      gain1.gain.setValueAtTime(0.4, now)
      gain1.gain.exponentialRampToValueAtTime(0.0001, now + 0.18)
      osc1.connect(gain1)
      gain1.connect(ctx.destination)
      osc1.start(now)
      osc1.stop(now + 0.18)

      const osc2 = ctx.createOscillator()
      const gain2 = ctx.createGain()
      osc2.type = 'sine'
      osc2.frequency.setValueAtTime(987.77, now + 0.08)
      gain2.gain.setValueAtTime(0.45, now + 0.08)
      gain2.gain.exponentialRampToValueAtTime(0.0001, now + 0.45)
      osc2.connect(gain2)
      gain2.connect(ctx.destination)
      osc2.start(now + 0.08)
      osc2.stop(now + 0.45)
    }
  } catch {}

  // 3. Vibration
  if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
    try {
      navigator.vibrate([150, 75, 150])
    } catch {}
  }
}

/**
 * Starts continuous looping ringtone for incoming calls.
 * Works on iPhone / iOS Safari via pre-blessed HTML5 audio and Web Audio synthesis.
 */
export const startRingtone = () => {
  if (typeof window === 'undefined') return
  stopRingtone()
  isRingtoneActive = true

  // 1. Primary Engine for Mobile/iPhone: HTML5 Audio Loop
  ensureAudioElements()
  if (ringAudio) {
    try {
      ringAudio.loop = true
      // A silent element is indistinguishable from a broken feature, so never inherit
      // whatever mute state an earlier unlock attempt left behind.
      ringAudio.muted = false
      ringAudio.volume = 1
      ringAudio.currentTime = 0
      const promise = ringAudio.play()
      if (promise !== undefined) {
        promise.catch((err) => {
          console.debug('ringAudio play caught, will unlock on first tap', err)
        })
      }
    } catch (e) {}
  }

  // 2. Layered Web Audio Synthesis Engine
  const playWebAudioCycle = () => {
    try {
      const ctx = getAudioContext()
      if (!ctx) return
      if (ctx.state === 'suspended') void ctx.resume()
      const now = ctx.currentTime
      const notes = [659.25, 830.61, 987.77, 1318.51]

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
    } catch (e) {}
  }

  playWebAudioCycle()
  ringtoneInterval = setInterval(() => {
    if (isRingtoneActive) {
      playWebAudioCycle()
      if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
        try {
          navigator.vibrate([400, 200, 400, 200, 400])
        } catch {}
      }
    }
  }, 2400)

  // Initial vibration
  if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
    try {
      navigator.vibrate([400, 200, 400, 200, 400])
    } catch {}
  }
}

/**
 * Starts continuous ringback tone for caller while calling out.
 */
export const startRingbackTone = () => {
  if (typeof window === 'undefined') return
  stopRingtone()
  isRingbackActive = true

  // 1. Primary Engine: HTML5 Audio Loop
  ensureAudioElements()
  if (ringbackAudio) {
    try {
      ringbackAudio.loop = true
      ringbackAudio.muted = false
      ringbackAudio.volume = 1
      ringbackAudio.currentTime = 0
      ringbackAudio.play().catch(() => {})
    } catch {}
  }

  // 2. Layered Web Audio Synthesis
  const playWebAudioRingback = () => {
    try {
      const ctx = getAudioContext()
      if (!ctx || ctx.state === 'suspended') return
      const now = ctx.currentTime

      const osc1 = ctx.createOscillator()
      const osc2 = ctx.createOscillator()
      const gain = ctx.createGain()

      osc1.type = 'sine'
      osc1.frequency.setValueAtTime(440, now)
      osc2.type = 'sine'
      osc2.frequency.setValueAtTime(480, now)

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
    } catch {}
  }

  playWebAudioRingback()
  ringbackInterval = setInterval(() => {
    if (isRingbackActive) {
      playWebAudioRingback()
    }
  }, 3000)
}

/**
 * Stops all active ringtones and vibrations immediately.
 */
export const stopRingtone = () => {
  isRingtoneActive = false
  isRingbackActive = false

  // 1. Stop HTML5 Audio Elements
  if (ringAudio) {
    try {
      ringAudio.pause()
      ringAudio.currentTime = 0
    } catch {}
  }
  if (ringbackAudio) {
    try {
      ringbackAudio.pause()
      ringbackAudio.currentTime = 0
    } catch {}
  }

  // 2. Stop Web Audio Intervals & Oscillators
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

  // 3. Stop Vibration
  if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
    try {
      navigator.vibrate(0)
    } catch {}
  }
}
