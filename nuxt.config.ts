export default defineNuxtConfig({
  app: {
    head: {
      title: 'Decluttered | Campus Declutter & Student Marketplace',
      htmlAttrs: { lang: 'en' },
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover' },
        { name: 'theme-color', content: '#FF5C1A' },
        { name: 'apple-mobile-web-app-capable', content: 'yes' },
        { name: 'apple-mobile-web-app-status-bar-style', content: 'black-translucent' },
        { name: 'apple-mobile-web-app-title', content: 'Decluttered' },
        { name: 'mobile-web-app-capable', content: 'yes' },
        { name: 'format-detection', content: 'telephone=no' },
        {
          name: 'description',
          content: 'Clear your hostel room in 2 minutes. Buy, sell, and swap verified campus student gear with instant escrows and fast delivery.'
        },
        { property: 'og:site_name', content: 'Decluttered' },
        { property: 'og:title', content: 'Decluttered | Campus Declutter & Student Marketplace' },
        { property: 'og:description', content: 'Automated hostel room clearance and peer-to-peer campus marketplace.' },
        { property: 'og:type', content: 'website' },
        { property: 'og:image', content: '/og-image-1200x630.png' },
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:title', content: 'Decluttered | Campus Declutter & Student Marketplace' },
        { name: 'twitter:description', content: 'Clear your hostel room in 2 minutes. Buy, sell, and swap verified student gear.' }
      ],
      link: [
        { rel: 'manifest', href: '/manifest.webmanifest' },
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
        { rel: 'icon', type: 'image/png', sizes: '192x192', href: '/favicon-192x192.png' },
        { rel: 'apple-touch-icon', href: '/apple-touch-icon.png' },
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
      // The fallbacks are the BARTER backend, not `api.erranders.org`.
      //
      // They used to default to the Erranders marketplace API. `.env` sets
      // VITE_API_BASE_URL so this never fired in practice — but on a fresh clone
      // or a deploy with a missing env var, the entire site would have silently
      // talked to a DIFFERENT PRODUCT and 401'd on every call, which is far
      // harder to diagnose than an obviously-wrong host.
      apiBaseUrl: process.env.NUXT_PUBLIC_API_BASE_URL || process.env.VITE_API_BASE_URL || 'http://localhost:3100/api/v1',
      apiBase: process.env.VITE_API_BASE_URL || 'http://localhost:3100/api/v1',
      wsBase: process.env.WS_BASE_URL || process.env.VITE_WS_URL || 'http://localhost:3100',
      // Every business gets `<business-name>.erranders.org`.
      //
      // The middleware only treats a host as a tenant when it ends in this apex AND the
      // first label is not a reserved one — `decluttered` above all, since that is this
      // site. Set this empty to disable subdomain routing entirely.
      businessApexDomain: process.env.NUXT_PUBLIC_BUSINESS_APEX_DOMAIN || 'erranders.org',
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
