export default defineNuxtPlugin(() => {
  if (typeof window === 'undefined') return

  // Register Service Worker
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker
        .register('/sw.js')
        .then((registration) => {
          console.debug('Decluttered PWA ServiceWorker registered with scope:', registration.scope)
        })
        .catch((error) => {
          console.debug('Decluttered ServiceWorker registration failed:', error)
        })
    })
  }

  // Capture beforeinstallprompt for installable banner/buttons
  window.addEventListener('beforeinstallprompt', (e: Event) => {
    // Stash the event so it can be triggered later if needed
    ;(window as any).deferredPwaInstallPrompt = e
  })
})
