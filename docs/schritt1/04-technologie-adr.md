# D — ADR: Projekt-Setup

> Federführung: Person 1 · Status: **Entwurf** (Cross-Review ausständig) · Datum: 2026-10-06
> Scope: Setup/Tooling. Rendering-Strategien folgen in Schritt 2.

## Kontext

Drei Seitentypen: Übersichten mit Filter, Detailseiten mit dynamischen Parametern (`/sessions/:id`, `/speakers/:id`) und ein personalisiertes Dashboard. Kein Backend, Daten aus einer statischen JSON-Datei. Folgesprints bringen Rendering-Entscheidungen pro Seitentyp (Schritt 2) und PWA/Offline (Schritt 3). Das Team (2 Personen) kennt Vite + Vue 3 + TypeScript + Tailwind aus den Hausübungen, aber weder Nuxt noch Vue Router. Das Szenario empfiehlt Nuxt.

## Optionen

**Option 1 — Vue 3 + Vite + vue-router (manuell)**
+ Vertraut aus den Hausübungen; minimaler Magie-Anteil; schnellster Start.
− Routing, Layouts, `<head>`-Management, Daten-Fetching mit SSR-Transfer müssen selbst verdrahtet werden. Für SSG/SSR/ISR in Schritt 2 wäre ein eigenes Setup (z. B. vite-ssg oder Vike) nötig — eine zweite, spätere Technologieentscheidung mit Migrationsaufwand.

**Option 2 — Nuxt 4 (gewählt)**
+ Dateibasiertes Routing deckt alle drei Seitentypen ab (`pages/sessions/[id].vue`), Layouts und `useHead` inklusive.
+ `useAsyncData`/`useState` lösen Daten-Deduplizierung und SSR-sicheren geteilten State ohne Zusatzbibliothek.
+ Rendering-Strategie ist später **pro Route** konfigurierbar (`routeRules`), ohne das Setup zu wechseln — die Entscheidung von Schritt 2 bleibt offen, aber umsetzbar.
+ Module für Schritt 3 vorhanden (`@vite-pwa/nuxt`).
− Lernkurve: Auto-Imports, Server/Client-Unterscheidung (`import.meta.server`), kein `localStorage` beim Server-Render. Mehr Konzepte als nötig, falls am Ende alles CSR wäre.

**Option 3 — Astro + Vue-Islands**
+ Stark bei statischen Inhalten und Partial Hydration.
− Vue nur als Insel, zweites Template-System; Composable-/State-Konzepte der LV nur eingeschränkt anwendbar. Verworfen.

## Entscheidung

**Nuxt 4** mit TypeScript, **Tailwind CSS v4** (via `@tailwindcss/vite`) und npm.

Tailwind-Begründung: Das Team kennt es aus Hausübung 2. Die Design Tokens aus A werden separat über Tailwinds `@theme` eingebunden, damit Komponenten später nur benannte Tokens statt Rohwerte verwenden.

Bewusst **nicht** aufgenommen: Pinia (ein ID-Array rechtfertigt keinen Store), VueUse (`useLocalStorage` würde das Hydration-Problem verdecken), Webfonts (Offline-Ziel). TypeScript ist auf 5.x gepinnt, weil `vue-tsc` TypeScript 7 noch nicht unterstützt.

## Konsequenzen

- (+) Neue Seite = neue Datei; Schritt 2 (Rendering) und Schritt 3 (PWA) brauchen keinen Setup-Wechsel.
- (+) Nuxt-Konventionen geben die Ordnerstruktur teilweise vor (siehe ADR B).
- (−) Beide Personen lernen Nuxt Routing, `useAsyncData` und die Server/Client-Trennung ([Routing](https://nuxt.com/docs/getting-started/routing), [Data Fetching](https://nuxt.com/docs/getting-started/data-fetching)).
- (−) Clientabhängige Logik (`localStorage`, `window`) muss explizit geschützt werden.
- (−) `app/` statt `src/` ist Nuxt-4-Konvention; `app/` entspricht dem `/src/` der Abgabe.
