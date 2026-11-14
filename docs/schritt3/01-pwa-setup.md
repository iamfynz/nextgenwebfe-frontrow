# 01 — PWA-Setup

FrontRow registriert den Service Worker manuell über ein eigenes Client-Plugin. Gebaut wird er aus `app/service-worker/sw.ts` mit Workbox über `@vite-pwa/nuxt` (Strategie `buildSW`): Die Caching-Regeln bleiben als Quelltext im Projekt lesbar, Workbox ergänzt beim Build die Precache-Liste aller Bundles. Der zuerst handgeschriebene Worker cachte sie erst beim ersten Abruf. Das Web App Manifest definiert „FrontRow — FrontendNow 2026“ als Namen, `/` als Start-URL und `standalone` als Darstellungsmodus. Die Farben stammen aus den Design-Tokens: Dunkelgrün (`#102928`) dient als `theme_color`, das helle Creme (`#FEFCF7`) als `background_color`. Zwei quadratische PNG-Icons in 192 × 192 und 512 × 512 Pixeln erfüllen die Installationsanforderungen und greifen Dunkelgrün, Lime und Blau aus dem Branding auf. Der Client registriert `/sw.js` nach dem `load`-Ereignis für den gesamten Scope `/`. Manifest-Link, Theme-Metadaten und Apple-Touch-Icon werden zentral über die Nuxt-Head-Konfiguration ausgeliefert.

## Caching-Zuordnung

- **Precache (Cache First):** Nuxt-Bundles, CSS, Manifest, Icons und Favicon aus der Build-Liste von Workbox.
- **Network First (3 s Zeitlimit), sonst Cache, sonst App-Shell:** alle HTML-Seiten. Startseite und App-Shell (`/mein-programm`) liegen ab der Installation im Cache.
- **Stale While Revalidate:** `/api/conference-data`, da alle dynamischen Sessions-/Speaker-Inhalte aus dieser JSON-basierten Route stammen. Wird bei der Installation vorgeladen.
- **Google Fonts:** Cache First für die Font-Dateien, Stale While Revalidate für das Stylesheet.
