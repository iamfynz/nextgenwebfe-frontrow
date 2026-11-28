import tailwindcss from '@tailwindcss/vite'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: false },

  // PWA (Schritt 3): Der Service Worker wird aus app/service-worker/sw.ts gebaut (Workbox, buildSW)
  // und als /sw.js ausgeliefert. Manifest und Registrierung bleiben eigene Dateien:
  // public/manifest.webmanifest und app/plugins/service-worker.client.ts.
  modules: ['@vite-pwa/nuxt', '@nuxt/eslint'],
  pwa: {
    strategies: 'buildSW',
    filename: 'sw.js',
    manifest: false,
    injectRegister: false,
    buildSW: {
      swSrc: 'app/service-worker/sw.ts',
      globPatterns: ['**/*.{js,css,png,svg,ico,webmanifest}'],
      // Vorlage für die PNG-Icons, wird zur Laufzeit nirgends geladen.
      globIgnores: ['**/icon-source.svg'],
    },
  },

  // Rendering-Strategie pro Anwendungsteil: docs/schritt2/01-rendering-strategie-adr.md
  // Alles ohne Regel ist SSR (Session-Detail, Speaker-Übersicht, Speaker-Profil, Startseite).
  routeRules: {
    '/programm': { ssr: false }, // B: Übersicht mit Filtern → CSR
    '/mein-programm': { ssr: false }, // E: personalisiert, nur localStorage → CSR
  },

  nitro: {
    // Datensatz wird bei jedem Request von der Platte gelesen (SSR-Simulation, ADR-Nachtrag).
    // Pfad relativ zum Arbeitsverzeichnis des Server-Prozesses → Server aus dem Projektroot starten.
    storage: {
      data: { driver: 'fs', base: './public/data' },
    },
  },

  // Eine zentrale CSS-Einstiegsdatei; sie importiert tokens/tokens.css + Tailwind.
  css: ['~/assets/css/main.css'],

  vite: {
    plugins: [tailwindcss()],
  },

  // Komponenten werden ohne Pfad-Präfix registriert (BaseCard statt BaseBaseCard, SessionCard statt
  // FeaturesSessionCard). Konsequenz: Dateinamen müssen projektweit eindeutig sein — siehe ADR B.
  components: [{ path: '~/components', pathPrefix: false }],

  app: {
    head: {
      htmlAttrs: { lang: 'de' },
      title: 'FrontRow — FrontendNow 2026',
      meta: [
        { name: 'description', content: 'FrontRow: dein Platz in der ersten Reihe der FrontendNow 2026 in Wien.' },
        { name: 'theme-color', content: '#102928' },
        { name: 'mobile-web-app-capable', content: 'yes' },
        { name: 'apple-mobile-web-app-capable', content: 'yes' },
        { name: 'apple-mobile-web-app-status-bar-style', content: 'black-translucent' },
      ],
      link: [
        { rel: 'manifest', href: '/manifest.webmanifest' },
        { rel: 'apple-touch-icon', href: '/icons/icon-192.png' },
      ],
    },
  },
})
