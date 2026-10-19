const CACHE_NAME = 'decluttered-cache-v2'
const OFFLINE_URL = '/offline.html'

const PRECACHE_ASSETS = [
  '/',
  '/offline.html',
  '/manifest.webmanifest',
  '/favicon.ico',
  '/favicon-192x192.png',
  '/favicon-512x512.png',
  '/apple-touch-icon.png',
]

// Install: Cache offline assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(PRECACHE_ASSETS).catch((err) => {
        console.warn('Pre-caching partial failure', err)
      })
    })
  )
  self.skipWaiting()
})

// Activate: Clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key)
          }
        })
      )
    })
  )
  self.clients.claim()
})

// Fetch strategy: Network first for HTML navigation, Stale-while-revalidate for static assets
self.addEventListener('fetch', (event) => {
  const req = event.request

  // Skip non-GET requests and API calls
  if (req.method !== 'GET') return
  const url = new URL(req.url)

  // API calls and websocket bypass service worker cache
  if (url.pathname.startsWith('/api/') || url.pathname.startsWith('/socket.io/')) {
    return
  }

  // HTML page navigations: Network first, fallback to offline.html
  if (req.mode === 'navigate') {
    event.respondWith(
      fetch(req)
        .then((networkRes) => {
          if (networkRes && networkRes.status === 200) {
            const resClone = networkRes.clone()
            caches.open(CACHE_NAME).then((cache) => cache.put(req, resClone))
          }
          return networkRes
        })
        .catch(async () => {
          const cached = await caches.match(req)
          if (cached) return cached
          const offlineFallback = await caches.match(OFFLINE_URL)
          if (offlineFallback) return offlineFallback
          return new Response('Offline - Decluttered', {
            status: 503,
            headers: { 'Content-Type': 'text/plain' },
          })
        })
    )
    return
  }

  // Static assets (CSS, JS, Fonts, Images): Stale-while-revalidate
  if (
    url.pathname.match(/\.(css|js|woff2|woff|ttf|png|jpg|jpeg|svg|webp|ico)$/) ||
    url.origin.includes('fonts.googleapis.com') ||
    url.origin.includes('fonts.gstatic.com')
  ) {
    event.respondWith(
      caches.match(req).then((cached) => {
        const fetchPromise = fetch(req)
          .then((networkRes) => {
            if (networkRes && networkRes.status === 200) {
              const resClone = networkRes.clone()
              caches.open(CACHE_NAME).then((cache) => cache.put(req, resClone))
            }
            return networkRes
          })
          .catch(() => cached)

        return cached || fetchPromise
      })
    )
  }
})

// Web Push Notifications
self.addEventListener('push', (event) => {
  let data = { title: 'Decluttered Alert 📦', body: 'New campus marketplace update.' }
  try {
    if (event.data) {
      data = event.data.json()
    }
  } catch (e) {
    if (event.data) {
      data.body = event.data.text()
    }
  }

  const options = {
    body: data.body || data.message || 'New update on Decluttered',
    icon: '/favicon-192x192.png',
    badge: '/favicon-32x32.png',
    data: data.link || '/',
    vibrate: [100, 50, 100],
    actions: [
      { action: 'open', title: 'View Listing' },
      { action: 'close', title: 'Dismiss' },
    ],
  }

  event.waitUntil(self.registration.showNotification(data.title || 'Decluttered', options))
})

// Notification Click Handler
self.addEventListener('notificationclick', (event) => {
  event.notification.close()
  const targetUrl = event.notification.data || '/'
  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if (client.url === targetUrl && 'focus' in client) {
          return client.focus()
        }
      }
      if (self.clients.openWindow) {
        return self.clients.openWindow(targetUrl)
      }
    })
  )
})
