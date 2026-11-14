const CACHE_VERSION = 'frontrow-v1'
const STATIC_CACHE = `${CACHE_VERSION}-static`
const DATA_CACHE = `${CACHE_VERSION}-data`
const APP_SHELL_ROUTES = new Set(['/', '/mein-programm'])
const PRECACHE_URLS = [
  '/',
  '/mein-programm',
  '/manifest.webmanifest',
  '/favicon.ico',
  '/icons/icon-192.png',
  '/icons/icon-512.png',
]

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE).then(cache => Promise.allSettled(PRECACHE_URLS.map(url => cache.add(url)))),
  )
  self.skipWaiting()
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys
        .filter(key => key.startsWith('frontrow-') && ![STATIC_CACHE, DATA_CACHE].includes(key))
        .map(key => caches.delete(key)),
    )),
  )
  self.clients.claim()
})

async function cacheFirst(request) {
  const cachedResponse = await caches.match(request)
  if (cachedResponse) return cachedResponse

  const networkResponse = await fetch(request)
  if (networkResponse.ok || networkResponse.type === 'opaque') {
    const cache = await caches.open(STATIC_CACHE)
    await cache.put(request, networkResponse.clone())
  }
  return networkResponse
}

async function staleWhileRevalidate(request, event) {
  const cache = await caches.open(DATA_CACHE)
  const cachedResponse = await cache.match(request)
  const networkResponse = fetch(request).then((response) => {
    if (response.ok) cache.put(request, response.clone())
    return response
  })

  if (cachedResponse) {
    event.waitUntil(networkResponse.catch(() => undefined))
    return cachedResponse
  }

  return networkResponse
}

self.addEventListener('fetch', (event) => {
  const { request } = event
  if (request.method !== 'GET') return

  const url = new URL(request.url)

  // Gemeinsame B-Entscheidung: JSON-basierte Konferenzdaten bleiben per SWR aktuell.
  if (url.origin === self.location.origin && url.pathname === '/api/conference-data') {
    event.respondWith(staleWhileRevalidate(request, event))
    return
  }

  // Person 1, C: App-Shell und statische Assets werden offline bevorzugt aus dem Cache geladen.
  const isAppShellNavigation = request.mode === 'navigate' && APP_SHELL_ROUTES.has(url.pathname)
  const isStaticAsset = request.destination === 'style'
    || request.destination === 'script'
    || request.destination === 'font'
    || request.destination === 'image'
    || url.pathname.startsWith('/_nuxt/')
    || url.pathname.startsWith('/icons/')
    || url.pathname === '/manifest.webmanifest'

  if (isAppShellNavigation || isStaticAsset) {
    event.respondWith(cacheFirst(request))
  }
})
