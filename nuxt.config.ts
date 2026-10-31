import tailwindcss from '@tailwindcss/vite'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

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
      ],
    },
  },
})
