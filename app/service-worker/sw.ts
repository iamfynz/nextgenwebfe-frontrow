/// <reference lib="webworker" />
import { CacheableResponsePlugin } from 'workbox-cacheable-response'
import { clientsClaim } from 'workbox-core'
import { cleanupOutdatedCaches, precacheAndRoute } from 'workbox-precaching'
import { warmStrategyCache } from 'workbox-recipes'
import { registerRoute } from 'workbox-routing'
import { CacheFirst, StaleWhileRevalidate } from 'workbox-strategies'

declare let self: ServiceWorkerGlobalScope

// Service Worker von FrontRow. Gebaut mit Workbox über @vite-pwa/nuxt (Strategie buildSW):
// Die Regeln stehen hier im Quelltext, Workbox liefert beim Build nur die Precache-Liste dazu.
// Welche Regel zu welcher Entscheidung gehört: docs/schritt3/02-offline-strategie-konzept.md

self.skipWaiting()
clientsClaim()

// --- Statische Assets (Person 1, C): Precache = Cache First -------------------------------
// self.__WB_MANIFEST wird beim Build durch die Liste aller Build-Dateien ersetzt (Nuxt-Bundles,
// CSS, Icons, Manifest), jeweils mit Revisions-Hash. Sie liegen damit schon nach der Installation
// vollständig im Cache und nicht erst, wenn eine Seite sie zufällig angefordert hat.
precacheAndRoute(self.__WB_MANIFEST)
cleanupOutdatedCaches()

// --- App-Shell-Routen (Person 1, C): Cache First ------------------------------------------
const APP_SHELL_ROUTES = ['/', '/mein-programm']
const appShellStrategy = new CacheFirst({
  cacheName: 'frontrow-shell',
  plugins: [new CacheableResponsePlugin({ statuses: [200] })],
})
warmStrategyCache({ urls: APP_SHELL_ROUTES, strategy: appShellStrategy })
registerRoute(
  ({ request, url }) => request.mode === 'navigate' && APP_SHELL_ROUTES.includes(url.pathname),
  appShellStrategy,
)

// --- Sessions-/Speaker-Daten (Person 2, C): Stale While Revalidate ------------------------
// Alle Programmdaten kommen aus dieser einen JSON-Route (useConferenceData).
const CONFERENCE_DATA_URL = '/api/conference-data'
registerRoute(
  ({ url, sameOrigin }) => sameOrigin && url.pathname === CONFERENCE_DATA_URL,
  new StaleWhileRevalidate({
    cacheName: 'frontrow-data',
    plugins: [new CacheableResponsePlugin({ statuses: [200] })],
  }),
)
