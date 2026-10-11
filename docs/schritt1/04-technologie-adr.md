# D — ADR: Projekt-Setup

> Federführung: Person 1 · Status: **Entwurf** (Cross-Review ausständig) · Datum: 2026-10-06
> Scope: Setup/Tooling. Rendering-Strategien folgen in Schritt 2.

## Kontext

Drei Seitentypen: Übersichten mit Filter, Detailseiten mit dynamischen Parametern (`/sessions/:id`) und ein personalisiertes Dashboard. Kein Backend, Daten aus einer statischen JSON-Datei. Folgesprints bringen weitere Anforderungen pro Seitentyp (Schritt 2) und PWA/Offline (Schritt 3). Das Team (2 Personen) kennt Vite + Vue 3 + TypeScript + Tailwind aus den Hausübungen, aber weder Nuxt noch Vue Router.

Kriterien: Routing-Bedarf, Team-Erfahrung, spätere Anforderungen, Einarbeitungsaufwand.

## Optionen

**Option 1 — Vue 3 + Vite + vue-router (manuell)**
+ Vertraut aus den Hausübungen; minimaler Magie-Anteil; schnellster Start.
− Routing, Layouts, `<head>`-Management und geteiltes Daten-Fetching müssen selbst verdrahtet werden. Wächst der Bedarf in Schritt 2 über reines Client-Rendering hinaus, wäre ein zweites Setup (z. B. vite-ssg) nötig — Migrationsaufwand.

**Option 2 — Nuxt 4**
+ Dateibasiertes Routing deckt alle drei Seitentypen ab (`pages/sessions/[id].vue`), Layouts inklusive.
+ `useAsyncData`/`useState` lösen Daten-Deduplizierung und geteilten State ohne Zusatzbibliothek.
+ Die Rendering-Entscheidung von Schritt 2 bleibt offen: Nuxt erlaubt sie später pro Route, ohne Setup-Wechsel.
+ Module für Schritt 3 vorhanden (`@vite-pwa/nuxt`).
− Lernkurve: Auto-Imports, Server/Client-Unterscheidung, kein `localStorage` beim Server-Render. Mehr Konzepte als nötig, falls am Ende alles im Browser gerendert würde.

**Option 3 — Astro + Vue-Islands**
+ Stark bei statischen Inhalten und Partial Hydration.
− Vue nur als Insel, zweites Template-System; Composable-/State-Konzepte der LV nur eingeschränkt anwendbar.

## Entscheidung

**Nuxt 4** mit TypeScript, **Tailwind CSS v4** (via `@tailwindcss/vite`) und npm.

| Kriterium | Vite + vue-router | Nuxt 4 | Astro |
|---|---|---|---|
| Routing-Bedarf (3 Seitentypen, dynamische Parameter) | manuell | dateibasiert | dateibasiert |
| Team-Erfahrung | hoch | keine | keine |
| Spätere Anforderungen (Schritt 2/3) | zweites Setup nötig | im Framework | nur mit Inseln |
| Einarbeitungsaufwand | gering | mittel | mittel bis hoch |

Tailwind: aus Hausübung 2 vertraut; die Design Tokens aus A werden über `@theme` als Utilities eingebunden. Bewusst **nicht** aufgenommen: Pinia und VueUse — ein ID-Array rechtfertigt weder Store noch Bibliothek (siehe [Konzept C](./03-state-management-konzept.md)). Weitere Tooling-Details stehen in der README.

## Konsequenzen

- (+) Neue Seite = neue Datei; Schritt 2 und 3 brauchen keinen Setup-Wechsel.
- (+) Nuxt-Konventionen geben die Ordnerstruktur teilweise vor (siehe ADR B).
- (−) Beide Personen lernen Nuxt [Routing](https://nuxt.com/docs/getting-started/routing), [Data Fetching](https://nuxt.com/docs/getting-started/data-fetching) und die Server/Client-Trennung.
- (−) Clientabhängige Logik (`localStorage`, `window`) muss explizit geschützt werden.
- (−) `app/` statt `src/` ist Nuxt-4-Konvention und entspricht dem `/src/` der Abgabe.
