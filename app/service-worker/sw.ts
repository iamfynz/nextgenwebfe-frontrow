/// <reference lib="webworker" />
import { CacheableResponsePlugin } from 'workbox-cacheable-response'
import { clientsClaim } from 'workbox-core'
import { cleanupOutdatedCaches, precacheAndRoute } from 'workbox-precaching'
import { googleFontsCache } from 'workbox-recipes'
import { registerRoute } from 'workbox-routing'
import { NetworkFirst, StaleWhileRevalidate } from 'workbox-strategies'

declare let self: ServiceWorkerGlobalScope

const HTTP_OK = 200
const HTTP_SERVER_ERROR_MIN = 500

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

// --- Schriften (Google Fonts): Cache First für die Font-Dateien, SWR für das Stylesheet -----
// Inter und Science Gothic kommen von fonts.googleapis.com / fonts.gstatic.com, liegen also nicht
// in der Precache-Liste. Lücke: Greift erst ab dem zweiten Seitenaufruf, weil der Service Worker
// beim allerersten Laden noch nicht aktiv ist, wenn der Browser die Schriften anfordert.
googleFontsCache({ cachePrefix: 'frontrow-fonts' })

// --- Seiten (HTML-Dokumente): Network First mit Zeitlimit, sonst Cache, sonst App-Shell ----
// Betrifft nur echte Dokument-Requests (Erstaufruf, Neuladen, Start der installierten App). Klicks
// innerhalb der App laufen über den Vue-Router und brauchen kein neues Dokument.
// Network First statt Cache First, weil das HTML der SSR-Seiten den Datenstand enthält und sonst
// einfriert. Antwortet das Netz nicht binnen 3 Sekunden (überlastetes Konferenz-WLAN), kommt die
// zuletzt gesehene Fassung aus dem Cache.
const PAGE_CACHE = 'frontrow-pages'
const SPA_SHELL_URL = '/mein-programm'
const pageStrategy = new NetworkFirst({
  cacheName: PAGE_CACHE,
  networkTimeoutSeconds: 3,
  plugins: [
    new CacheableResponsePlugin({ statuses: [HTTP_OK] }),
    {
      // Seiten hängen nicht von Query-Parametern ab. Ohne sie im Cache-Schlüssel trifft auch
      // /?utm_source=mail den Eintrag für / und der Cache wächst nicht mit jeder Variante.
      cacheKeyWillBeUsed: async ({ request }) => {
        const url = new URL(request.url)
        url.search = ''
        return url.href
      },
      // Ein Serverfehler (5xx) zählt wie ein Netzfehler: Dann greift der Cache, statt dass die
      // Fehlerseite des Servers angezeigt wird, obwohl eine brauchbare Fassung vorliegt.
      // 404 und andere 4xx bleiben echte Antworten.
      fetchDidSucceed: async ({ response }) => {
        if (response.status >= HTTP_SERVER_ERROR_MIN) throw new Error(`Serverfehler ${response.status}`)
        return response
      },
    },
  ],
})
// Startseite und App-Shell liegen ab der Installation im Cache. /mein-programm ist eine CSR-Route:
// Ihr HTML ist die leere Nuxt-Shell ohne seitenspezifischen Inhalt, der Router rendert im Browser
// die Seite zur aktuellen URL. Sie dient deshalb als Rückfall für jede Seite, die noch nie online
// geöffnet wurde. Die Inhalte kommen dann aus dem Daten-Cache unten. Vorgeladen wird beides im
// install-Schritt am Ende der Datei.
// /api/ und /data/ liefern JSON, keine Seiten: Wer sie direkt in der Adresszeile öffnet, soll
// weder die App-Shell bekommen noch den Seiten-Cache füllen.
registerRoute(
  ({ request, url }) => request.mode === 'navigate'
    && !url.pathname.startsWith('/api/') && !url.pathname.startsWith('/data/'),
  async (options) => {
    try {
      return await pageStrategy.handle(options)
    }
    catch {
      const shell = await caches.match(SPA_SHELL_URL, { cacheName: PAGE_CACHE })
      return shell ?? Response.error()
    }
  },
)

// --- Sessions-/Speaker-Daten (Person 2, C): Stale While Revalidate ------------------------
// Alle Programmdaten kommen aus dieser einen JSON-Route (useConferenceData).
const CONFERENCE_DATA_URL = '/api/conference-data'
const DATA_CACHE = 'frontrow-data'
const conferenceDataStrategy = new StaleWhileRevalidate({
  cacheName: DATA_CACHE,
  plugins: [new CacheableResponsePlugin({ statuses: [HTTP_OK] })],
})
// Die Daten werden schon bei der Installation geladen (install-Schritt unten): Auf SSR-Seiten
// stecken sie im HTML-Payload, der Browser ruft die Route dann gar nicht ab. Ohne das Vorladen wäre
// der Daten-Cache nach einem Einstieg über die Startseite leer und „Mein Programm" könnte offline
// keine Session auflösen.
registerRoute(
  ({ url, sameOrigin }) => sameOrigin && url.pathname === CONFERENCE_DATA_URL,
  conferenceDataStrategy,
)

// --- Installation: Startseite, App-Shell und Programmdaten vorladen ------------------------
// cache.add() schlägt bei Netzfehlern und bei jeder Antwort außer 2xx fehl. Dann scheitert die
// ganze Installation und der Browser versucht sie beim nächsten Seitenaufruf erneut. So wird der
// Service Worker nie aktiv, ohne dass App-Shell und Daten wirklich im Cache liegen. (Workbox'
// warmStrategyCache würde solche Fehler verschlucken.)
self.addEventListener('install', (event) => {
  const preload = async (cacheName: string, urls: string[]) => {
    const cache = await caches.open(cacheName)
    await Promise.all(urls.map(url => cache.add(new Request(url, { cache: 'reload' }))))
  }
  event.waitUntil(Promise.all([
    preload(PAGE_CACHE, ['/', SPA_SHELL_URL]),
    preload(DATA_CACHE, [CONFERENCE_DATA_URL]),
  ]))
})

// --- Aktivierung: Reste älterer Fassungen entfernen ---------------------------------------
// 1. Gecachte Seiten gehören zum Build, mit dem sie geladen wurden: Ihr HTML verweist auf dessen
//    Bundles, und die löscht cleanupOutdatedCaches() beim Update aus dem Precache. Deshalb fliegen
//    alle Seiten außer den beiden gerade frisch vorgeladenen raus; sie kommen beim nächsten
//    Online-Aufruf wieder, offline springt bis dahin die App-Shell ein.
// 2. Die Caches des ersten, handgeschriebenen Service Workers (frontrow-v1-*) nutzt niemand mehr.
self.addEventListener('activate', (event) => {
  const dropStalePages = async () => {
    const cache = await caches.open(PAGE_CACHE)
    const keep = new Set(['/', SPA_SHELL_URL])
    const requests = await cache.keys()
    await Promise.all(requests
      .filter(request => !keep.has(new URL(request.url).pathname))
      .map(request => cache.delete(request)))
  }
  const dropLegacyCaches = async () => {
    const names = await caches.keys()
    await Promise.all(names.filter(name => name.startsWith('frontrow-v1-')).map(name => caches.delete(name)))
  }
  event.waitUntil(Promise.all([dropStalePages(), dropLegacyCaches()]))
})
