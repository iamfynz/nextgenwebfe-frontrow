import tailwindcss from '@tailwindcss/vite'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

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
