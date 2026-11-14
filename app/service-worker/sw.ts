/// <reference lib="webworker" />
import { CacheableResponsePlugin } from 'workbox-cacheable-response'
import { clientsClaim } from 'workbox-core'
import { cleanupOutdatedCaches, precacheAndRoute } from 'workbox-precaching'
import { warmStrategyCache } from 'workbox-recipes'
import { registerRoute } from 'workbox-routing'
import { NetworkFirst, StaleWhileRevalidate } from 'workbox-strategies'

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

// --- Seiten (HTML-Dokumente): Network First mit Zeitlimit, sonst Cache, sonst App-Shell ----
// Betrifft nur echte Dokument-Requests (Erstaufruf, Neuladen, Start der installierten App). Klicks
// innerhalb der App laufen über den Vue-Router und brauchen kein neues Dokument.
// Network First statt Cache First, weil das HTML der SSR-Seiten den Datenstand enthält und sonst
// einfriert. Antwortet das Netz nicht binnen 3 Sekunden (überlastetes Konferenz-WLAN), kommt die
// zuletzt gesehene Fassung aus dem Cache.
const SPA_SHELL_URL = '/mein-programm'
const pageStrategy = new NetworkFirst({
  cacheName: 'frontrow-pages',
  networkTimeoutSeconds: 3,
  plugins: [new CacheableResponsePlugin({ statuses: [200] })],
})
// Startseite und App-Shell liegen ab der Installation im Cache. /mein-programm ist eine CSR-Route:
// Ihr HTML ist die leere Nuxt-Shell ohne seitenspezifischen Inhalt, der Router rendert im Browser
// die Seite zur aktuellen URL. Sie dient deshalb als Rückfall für jede Seite, die noch nie online
// geöffnet wurde. Die Inhalte kommen dann aus dem Daten-Cache unten.
warmStrategyCache({ urls: ['/', SPA_SHELL_URL], strategy: pageStrategy })
registerRoute(
  ({ request }) => request.mode === 'navigate',
  async (options) => {
    try {
      return await pageStrategy.handle(options)
    }
    catch {
      const shell = await caches.match(SPA_SHELL_URL, { cacheName: 'frontrow-pages' })
      return shell ?? Response.error()
    }
  },
)

// --- Sessions-/Speaker-Daten (Person 2, C): Stale While Revalidate ------------------------
// Alle Programmdaten kommen aus dieser einen JSON-Route (useConferenceData).
const CONFERENCE_DATA_URL = '/api/conference-data'
const conferenceDataStrategy = new StaleWhileRevalidate({
  cacheName: 'frontrow-data',
  plugins: [new CacheableResponsePlugin({ statuses: [200] })],
})
// Schon bei der Installation laden: Auf SSR-Seiten stecken die Daten im HTML-Payload, der Browser
// ruft die Route dann gar nicht ab. Ohne dieses Vorwärmen wäre der Daten-Cache nach einem Einstieg
// über die Startseite leer und „Mein Programm" könnte offline keine Session auflösen.
warmStrategyCache({ urls: [CONFERENCE_DATA_URL], strategy: conferenceDataStrategy })
registerRoute(
  ({ url, sameOrigin }) => sameOrigin && url.pathname === CONFERENCE_DATA_URL,
  conferenceDataStrategy,
)
