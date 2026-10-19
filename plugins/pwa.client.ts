/**
 * Nuxt 3 Client Plugin: PWA Service Worker Registration & Install Trigger
 */
export default defineNuxtPlugin(() => {
  if (typeof window === 'undefined' || !('serviceWorker' in navigator)) return;

  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/sw.js')
      .then((registration) => {
        console.debug('Decluttered PWA Service Worker registered:', registration.scope);
      })
      .catch((error) => {
        console.warn('Decluttered PWA Service Worker registration failed:', error);
      });
  });

  // Track install prompt availability
  window.addEventListener('beforeinstallprompt', (e: Event) => {
    e.preventDefault();
    (window as any).__pwaInstallPrompt = e;
  });
});
