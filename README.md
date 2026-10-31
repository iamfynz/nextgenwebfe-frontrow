# FrontRow — Konferenz-Begleiter zur FrontendNow 2026

> FH-Projekt „Next Generation Web Frontends", Team FrontRow · Schritt 2: Rendering-Strategie & Kernfunktionen

FrontRow ist die Begleit-App zur fiktiven zweitägigen Konferenz **FrontendNow** (15.–16. 9. 2026, Wien):
Programm filtern, Speaker ansehen, eigenen Zeitplan („Mein Programm") zusammenstellen.
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
npm run preview    # Build lokal ausliefern (aus dem Projektroot starten, siehe unten)
npm run generate   # nicht der Zielpfad: seit Schritt 2 sind SSR-Routen dabei, siehe ADR Schritt 2
```

## Seiten und Rendering (Schritt 2)

Die Rendering-Strategie ist pro Anwendungsteil in der [Rendering-ADR](docs/schritt2/01-rendering-strategie-adr.md) begründet
und in `nuxt.config.ts` (`routeRules`) umgesetzt. Alles ohne Regel ist SSR.

| Route | Teil | Rendering | Warum (Kurzform) |
|---|---|---|---|
| `/programm` | B Übersicht + Filter | CSR | Filterzustand lebt nur im Browser; Hülle vom Server, Daten und Filter im Client |
| `/programm/[id]` | C Session-Detail | SSR | Geteilter Inhalt, muss bei Zeitplanänderung beim nächsten Aufruf aktuell sein |
| `/speakers`, `/speakers/[id]` | D Speaker | SSR | Session-Liste ist ein Join über dieselben Daten wie C; bewusste Abweichung von SSG |
| `/mein-programm` | E Mein Programm | CSR | Liest nur IDs aus `localStorage`, der Server kennt den Zustand nicht |

**SSR-Simulation.** Der Server liest `public/data/conference-data.json` bei jedem Request (Nitro-Route `/api/conference-data`,
fs-Treiber). Zum Ausprobieren: `npm run build && node .output/server/index.mjs` aus dem Projektroot starten, eine Session
in der JSON ändern, `/programm/s01` neu laden. Die Änderung ist ohne Build sichtbar. Der Pfad ist relativ zum
Arbeitsverzeichnis des Server-Prozesses, deshalb aus dem Projektroot starten.

**Mein Programm.** Persistiert werden nur Session-IDs unter `frontrow:my-program:v1` in `localStorage` (Konzept C).
Rehydration einmalig in `onMounted`, bis dahin sind die Merken-Buttons deaktiviert. Nach einem Reload bleibt die Auswahl erhalten.

## Stack

Nuxt 4 · Vue 3 · TypeScript · Tailwind CSS v4

## Struktur

```
app/                      ← Quellcode (Nuxt-4-Konvention; entspricht /src der Abgabe)
├── assets/css/main.css   Tailwind-Einstieg (tokens werden hier importiert)
├── components/
│   ├── base/             Base/UI-Layer: BaseCard, BaseButton (button oder NuxtLink via `to`)
│   ├── layout/           AppHeader (Navigation + Zähler), AppFooter
│   ├── program/          ProgramToggle (Merken / Gemerkt)
│   ├── session/          SessionCard, SessionList, SessionFilter, SessionDetail*
│   └── speaker/          SpeakerCard, SpeakerDetailHero, SpeakerSessionList
├── composables/
│   ├── useConferenceData Datenschicht: laden, indizieren, joinen (einzige Ladestelle)
│   ├── useSessions       Domänenschicht: Sessions mit Track, Raum, Speakern aufgelöst
│   ├── useSpeakers       Domänenschicht: Speaker mit Sessions aufgelöst
│   ├── useSessionFilter  Headless-Filterlogik (Track, Tag, Level, UND-verknüpft)
│   └── useMyProgram      Persönlicher State, localStorage, Rehydration
├── pages/                index, programm/, programm/[id], speakers/, speakers/[id], mein-programm
├── utils/formatDay.ts
└── types/conference.ts
server/api/conference-data.get.ts  liest den Datensatz pro Request (SSR-Simulation)
tokens/tokens.css
public/data/conference-data.json   geteilter, schreibgeschützter Datensatz
docs/schritt1/                     Deliverables Schritt 1 (A–D)
docs/schritt2/                     Rendering-ADR, AI-LOGs
```

## Dokumente

| | Dokument |
|---|---|
| Schritt 1 A | [Branding-Konzept & Design Tokens](docs/schritt1/01-branding-design-tokens.md) |
| Schritt 1 B | [ADR Komponenten- & Ordnerstruktur](docs/schritt1/02-architektur-adr.md) |
| Schritt 1 C | [State-Management-Konzept](docs/schritt1/03-state-management-konzept.md) |
| Schritt 1 D | [ADR Projekt-Setup](docs/schritt1/04-technologie-adr.md) |
| Schritt 2 A | [ADR Rendering-Strategie](docs/schritt2/01-rendering-strategie-adr.md) |
| Schritt 2 F | [AI-LOG Windisch](docs/schritt2/AI-LOG-Windisch.md) · [AI-LOG Vogl](docs/schritt2/AI-LOG-Vogl.md) |

## Aufgabenteilung Schritt 2

Die Angabe sieht Person 1 für B + D und Person 2 für C + E vor. Wir haben nach Arbeitsfortschritt aufgeteilt:
Andrea B (Übersicht + Filter) + C (Detailseiten), Markus D (Speaker) + E (Mein Programm) sowie die Laufzeit-Datenquelle.
ADR-Punkte entsprechend; Cross-Review und Klick-Test jeweils durch die andere Person. Begründung im [ADR-Nachtrag](docs/schritt2/01-rendering-strategie-adr.md#nachtrag-zur-umsetzung).

## Tooling-Notizen

- TypeScript ist auf 5.x gepinnt, weil `vue-tsc` TypeScript 7 noch nicht unterstützt.
- Science Gothic und Inter werden derzeit über Google Fonts geladen; lokales Hosting wird mit dem Offline-Ziel in Schritt 3 entschieden.
- Kein Pinia, kein VueUse: Begründung in [ADR D](docs/schritt1/04-technologie-adr.md) und [Konzept C](docs/schritt1/03-state-management-konzept.md).

## Konventionen

- Komponenten werden ohne Pfad-Präfix auto-importiert → Dateinamen projektweit eindeutig.
- `useConferenceData()`, `useSessions()`, `useSpeakers()` immer mit `await` in `<script setup>` aufrufen.
- Client-abhängige Logik (`localStorage`, `window`) nur hinter `import.meta.client` / `onMounted`.
- Rendering pro Route ausschließlich über `routeRules` in `nuxt.config.ts`, nicht in Komponenten.
