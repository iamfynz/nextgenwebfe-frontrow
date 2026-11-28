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

## PWA und Offline (Schritt 3)

Die App ist installierbar und nach einem Online-Besuch offline nutzbar. Der Service Worker entsteht erst beim Build
(`app/service-worker/sw.ts` → `/sw.js`), im Dev-Server ist er nicht aktiv. Offline testen deshalb so:

```sh
npm run build
node .output/server/index.mjs   # aus dem Projektroot, http://localhost:3000
```

Dann in Chrome einmal laden, DevTools → Network → „Offline" und neu laden.

| Datentyp | Strategie |
|---|---|
| Nuxt-Bundles, CSS, Icons, Manifest | Precache (Cache First) |
| `/api/conference-data` | Stale While Revalidate, bei Installation vorgeladen |
| Seiten (HTML) | Network First mit 3 s Zeitlimit, sonst Cache, sonst App-Shell |
| Google Fonts | Cache First (Dateien), Stale While Revalidate (Stylesheet) |

Begründung: [Konzept](docs/schritt3/02-offline-strategie-konzept.md) und [Entscheidungsprotokoll](docs/schritt3/03-entscheidungsprotokoll.md).

## Stack

Nuxt 4 · Vue 3 · TypeScript · Tailwind CSS v4 · Workbox (über `@vite-pwa/nuxt`)

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
├── plugins/              service-worker.client: registriert /sw.js (nur im Build)
├── service-worker/sw.ts  Service Worker mit den Caching-Regeln (Workbox)
├── pages/                index, programm/, programm/[id], speakers/, speakers/[id], mein-programm
├── utils/formatDay.ts
└── types/conference.ts
server/api/conference-data.get.ts  liest den Datensatz pro Request (SSR-Simulation)
tokens/tokens.css
public/data/conference-data.json   geteilter, schreibgeschützter Datensatz
public/manifest.webmanifest        Web App Manifest
public/icons/                      App-Icons 192 und 512
docs/schritt1/                     Deliverables Schritt 1 (A–D), AI-LOG Schritt 1
docs/schritt2/                     Rendering-ADR, AI-LOGs
docs/schritt3/                     PWA-Setup, Offline-Konzept, Entscheidungsprotokoll, AI-LOGs
```

## Dokumente

| | Dokument |
|---|---|
| Schritt 1 A | [Branding-Konzept & Design Tokens](docs/schritt1/01-branding-design-tokens.md) |
| Schritt 1 B | [ADR Komponenten- & Ordnerstruktur](docs/schritt1/02-architektur-adr.md) |
| Schritt 1 C | [State-Management-Konzept](docs/schritt1/03-state-management-konzept.md) |
| Schritt 1 D | [ADR Projekt-Setup](docs/schritt1/04-technologie-adr.md) |
| Schritt 1 | [AI-LOG Schritt 1 (Team)](docs/schritt1/AI-LOG.md) |
| Schritt 2 A | [ADR Rendering-Strategie](docs/schritt2/01-rendering-strategie-adr.md) |
| Schritt 2 F | [AI-LOG Windisch](docs/schritt2/AI-LOG-Windisch.md) · [AI-LOG Vogl](docs/schritt2/AI-LOG-Vogl.md) |
| Schritt 3 A | [PWA-Setup](docs/schritt3/01-pwa-setup.md) |
| Schritt 3 B | [Offline-Strategie: Konzept](docs/schritt3/02-offline-strategie-konzept.md) |
| Schritt 3 D | [Entscheidungsprotokoll](docs/schritt3/03-entscheidungsprotokoll.md) (beide unabhängigen Testdurchläufe abgeschlossen) |
| Schritt 3 E | [Verifikations-Nachweis](docs/schritt3/04-verifikations-nachweis.md) |
| Schritt 3 | [AI-LOG Windisch](docs/schritt3/AI-LOG-Windisch.md) · [AI-LOG Vogl](docs/schritt3/AI-LOG-Vogl.md) |

## Aufgabenteilung Schritt 2

Die Angabe sieht Person 1 für B + D und Person 2 für C + E vor. Wir haben nach Arbeitsfortschritt aufgeteilt:
Andrea B (Übersicht + Filter) + C (Detailseiten), Markus D (Speaker) + E (Mein Programm) sowie die Laufzeit-Datenquelle.
ADR-Punkte entsprechend; Cross-Review und Klick-Test jeweils durch die andere Person. Begründung im [ADR-Nachtrag](docs/schritt2/01-rendering-strategie-adr.md#nachtrag-zur-umsetzung).

## Tooling-Notizen

- TypeScript ist auf 5.x gepinnt, weil `vue-tsc` TypeScript 7 noch nicht unterstützt.
- Science Gothic und Inter werden derzeit über Google Fonts geladen; der Service Worker cacht sie ab dem zweiten Seitenaufruf (Schritt 3). Lokales Hosting würde die Lücke beim ersten Aufruf schließen und ist noch offen.
- Kein Pinia, kein VueUse: Begründung in [ADR D](docs/schritt1/04-technologie-adr.md) und [Konzept C](docs/schritt1/03-state-management-konzept.md).

## Konventionen

- Komponenten werden ohne Pfad-Präfix auto-importiert → Dateinamen projektweit eindeutig.
- `useConferenceData()`, `useSessions()`, `useSpeakers()` immer mit `await` in `<script setup>` aufrufen.
- Client-abhängige Logik (`localStorage`, `window`) nur hinter `import.meta.client` / `onMounted`.
- Rendering pro Route ausschließlich über `routeRules` in `nuxt.config.ts`, nicht in Komponenten.

## AI-Reflexion

### Andrea Windisch

**1. Was hat mich beim AI-Einsatz am meisten überrascht?**

Am meisten überrascht hat mich, wie schnell aus einer allgemeinen Anforderung wie „Tastaturnavigation für die Session-Liste“ ein konkreter Vorschlag für unsere Vue-Komponenten wurde. Codex fand die wiederverwendete Session-Liste, die Kartenaktionen und die Trefferanzeige auf der Programmseite. Trotzdem fiel mir beim Ausprobieren ein weiterer Punkt auf: Die Filterauswahl passte noch nicht zu der Tastenfolge, die ich beim Durchgehen der Seite erwartet hatte. Erst als ich den Ablauf mit Enter, Tab und Esc konkret beschrieben hatte, wurde daraus eine überprüfbare Anforderung. Der praktische Test hat damit den Umfang der Verbesserung mitbestimmt.

**2. Welchen AI-Vorschlag habe ich bewusst verändert und warum?**

Den ersten Zuschnitt des von Codex vorgeschlagenen Features habe ich nach meinem Test erweitert. Die erste Umsetzung konzentrierte sich auf den Wechsel zwischen Session-Karten und auf verständlichere Beschriftungen der Kartenaktionen. Auf der Programmseite komme ich aber zuerst zu den Filtern. Dort fehlte mir ein durchgängiger Ablauf mit der Tastatur. Ich habe deshalb vorgegeben, dass Enter den Filter öffnet, Tab durch die Optionen wechselt, Enter die Auswahl übernimmt und Esc den Filter schließt. Codex setzte dafür eine gemeinsame Komponente für Track, Konferenztag und Level um. Auslöser für die Änderung war mein eigenes Ausprobieren des Ablaufs.

**3. Wo würde ich künftig bewusst auf AI verzichten?**

Den abschließenden Tastaturtest für FrontRow würde ich selbst durchführen. Bei den Filtern möchte ich direkt beobachten, welches Element nach dem Öffnen den Fokus hat, ob ich die letzte Option wieder verlassen kann und wo ich nach Enter oder Esc lande. Ein erfolgreicher Build zeigt, dass die Anwendung kompiliert, liefert aber keinen Nachweis für diesen Ablauf. Bei der Beurteilung ist auch wichtig, ob ich ohne Maus erkenne, wo ich gerade bin und wie ich zum nächsten Filter komme. Das Ergebnis würde ich mit Browser und beobachtetem Verhalten selbst im AI-LOG festhalten.
