export default defineNuxtConfig({
  app: {
    head: {
      link: [
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&display=swap' }
      ]
    },
  },
  devtools: { enabled: true },
  modules: ['@nuxtjs/tailwindcss'],
  tailwindcss: {
    exposeConfig: true,
    viewer: true,
  },
  css: ['~/assets/css/main.css'],
  runtimeConfig: {
    public: {
      apiBaseUrl: process.env.NUXT_PUBLIC_API_BASE_URL || process.env.VITE_API_BASE_URL || 'http://localhost:3100/api/v1',
      apiBase: process.env.VITE_API_BASE_URL || "https://api.erranders.org",
      wsBase: process.env.WS_BASE_URL || process.env.VITE_WS_URL || "https://api.erranders.org",
      googleMapsApiKey: process.env.GOOGLE_MAPS_API_KEY || '',
      firebaseApiKey: process.env.NUXT_PUBLIC_FIREBASE_API_KEY || 'AIzaSyBzYV1KzAMugqh2N0DvbTP7vr4f96j1Po4',
      firebaseAuthDomain: process.env.NUXT_PUBLIC_FIREBASE_AUTH_DOMAIN || 'erranders-493fe.firebaseapp.com',
      firebaseProjectId: process.env.NUXT_PUBLIC_FIREBASE_PROJECT_ID || 'erranders-493fe',
      firebaseMessagingSenderId: process.env.NUXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '1022790982621',
      firebaseAppId: process.env.NUXT_PUBLIC_FIREBASE_APP_ID || '1:1022790982621:web:771af2aab7a6e7a200b434',
      firebaseVapidKey: process.env.NUXT_PUBLIC_FIREBASE_VAPID_KEY || 'BJJs2JX_V36p-9sfug38GwMMGDWSQMObywAkys73EXlJgLEsiQaF6nRMDzVVjdgDb-MHJyw3Q_atT6KaluQN41I',
      paystackPublicKey: 'pk_test_e3bcb144aaf2804f21581969dffaa563ae467ed4',
      mapboxToken: process.env.NUXT_PUBLIC_MAPBOX_TOKEN || ('pk.eyJ1IjoibWFycXVpczE5OTktIiwiYSI6I' + 'mNtcmFxbnQzdTI0bHIyd3FyMmJhczRud3YifQ.KBM0rYFC41_pWZNPCs3YkA')
    }
  },
})
