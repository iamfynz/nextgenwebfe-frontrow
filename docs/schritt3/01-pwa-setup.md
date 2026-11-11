# 01 — PWA-Setup

FrontRow verwendet einen bewusst manuell registrierten Service Worker statt eines zusätzlichen PWA-Moduls. Für den überschaubaren Umfang bleiben Registrierung, Cache-Namen und Routing-Regeln dadurch direkt im Projekt sichtbar und ohne weitere Build-Abhängigkeit nachvollziehbar. Das Web App Manifest definiert „FrontRow — FrontendNow 2026“ als Namen, `/` als Start-URL und `standalone` als Darstellungsmodus. Die Farben stammen aus den Design-Tokens: Dunkelgrün (`#102928`) dient als `theme_color`, das helle Creme (`#FEFCF7`) als `background_color`. Zwei quadratische PNG-Icons in 192 × 192 und 512 × 512 Pixeln erfüllen die Installationsanforderungen und greifen Dunkelgrün, Lime und Blau aus dem Branding auf. Der Client registriert `/sw.js` nach dem `load`-Ereignis für den gesamten Scope `/`. Manifest-Link, Theme-Metadaten und Apple-Touch-Icon werden zentral über die Nuxt-Head-Konfiguration ausgeliefert.

## Caching-Zuordnung

- **Cache First:** App-Shell-Routen `/` und `/mein-programm`, Nuxt-Bundles, Styles, Fonts, Bilder, Manifest und Icons.
- **Stale While Revalidate:** `/api/conference-data`, da alle dynamischen Sessions-/Speaker-Inhalte aus dieser JSON-basierten Route stammen.
