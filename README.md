# FrontRow — Konferenz-Begleiter zur FrontendNow 2026

> FH-Projekt „Next Generation Web Frontends", Team FrontRow · Schritt 1: Planung & Architekturentscheidungen

FrontRow ist die Begleit-App zur fiktiven zweitägigen Konferenz **FrontendNow** (15.–16. 9. 2026, Wien):
Programm filtern, Speaker ansehen, eigenen Zeitplan („Mein Programm") zusammenstellen.
In Schritt 1 steht nur das Grundgerüst: Layout, Startseite mit Kennzahlen aus dem Datensatz, Composables.
Funktionalität und Datensatz sind für alle Teams gleich, Branding ist unseres.

## Setup

Voraussetzung: Node ≥ 20.19 (getestet mit Node 26), npm.

```sh
npm install
npm run dev        # http://localhost:3000
```

Weitere Skripte:

```sh
npm run typecheck  # vue-tsc
npm run build      # Server-Build nach .output/
npm run generate   # statische Site nach .output/public/ (alle Routen vorgerendert)
npm run preview    # Build lokal ausliefern
```

## Stack

Nuxt 4 · Vue 3 · TypeScript · Tailwind CSS v4

## Struktur

```
app/                      ← Quellcode (Nuxt-4-Konvention; entspricht /src der Abgabe)
├── assets/css/main.css   Tailwind-Einstieg (tokens werden hier importiert)
├── components/
│   ├── base/             Base/UI-Layer (BaseCard)
│   ├── features/         Feature-Layer (ab Schritt 2)
│   └── layout/           AppHeader, AppFooter
├── composables/          useConferenceData (weitere ab Schritt 2)
├── layouts/default.vue
├── pages/                index (weitere Seiten ab Schritt 2)
└── types/conference.ts
tokens/token.css        
public/data/conference-data.json   geteilter, schreibgeschützter Datensatz
docs/schritt1/                     Deliverables A–D
```

## Dokumente (Schritt 1)

| | Dokument |
|---|---|
| A | [Branding-Konzept & Design Tokens](docs/schritt1/01-branding-konzept.md) |
| B | [ADR Komponenten- & Ordnerstruktur](docs/schritt1/02-architektur-adr.md) |
| C | [State-Management-Konzept](docs/schritt1/03-state-management-konzept.md) |
| D | [ADR Projekt-Setup](docs/schritt1/04-technologie-adr.md) |

## Konventionen

- Komponenten werden ohne Pfad-Präfix auto-importiert → Dateinamen projektweit eindeutig.
- `useConferenceData()` immer mit `await` in `<script setup>` aufrufen.
- Client-abhängige Logik (`localStorage`, `window`) nur hinter `import.meta.client` / `onMounted`.
