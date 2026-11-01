# C — State-Management-Konzept: „Mein Programm" & conference-data.json

> Federführung: Person 2 · Aktualisiert: 2026-10-31 auf den Stand nach Schritt 2 (Datenquelle zur Laufzeit, Dashboard als CSR-Route)
> Umsetzungsstand: `useConferenceData()` seit Schritt 1, `useMyProgram()` seit Schritt 2 implementiert.

## Zwei Arten von State

| | Geteilter Datensatz | „Mein Programm" |
|---|---|---|
| Quelle | `conference-data.json` (schreibgeschützt für die App) | Nutzer:in |
| Lebensdauer | für alle gleich; kann sich ohne Deployment ändern (Datei wird pro Request gelesen), nie pro Nutzer:in | pro Gerät, dauerhaft |
| Größe | 20 Sessions, 18 Speaker | einige IDs |
| Rendering | server-/statisch renderbar | nur im Browser bekannt |

Beide werden getrennt in eigenen Composables modelliert, ohne zusätzliche Library.

## Geteilter Datensatz: `useConferenceData()`

**Laden.** Ein `useAsyncData('conference-data', …)` mit festem Key: Nuxt dedupliziert parallele Aufrufe, überträgt das Ergebnis im Payload zum Client (kein zweiter Fetch) und cached es bei Client-Navigation. Server und Client holen den Datensatz von der Nitro-Route `/api/conference-data`, die `public/data/conference-data.json` bei jedem Request liest (Simulation einer veränderlichen Datenquelle, Begründung in der [Rendering-ADR Schritt 2](../schritt2/01-rendering-strategie-adr.md#nachtrag-zur-umsetzung)). Während SSR beantwortet Nitro den `$fetch` intern ohne HTTP; im Browser ist es ein Request, den in Schritt 3 der Service Worker cachen kann. In `localStorage` wird der Datensatz bewusst nicht kopiert: Er ist für alle gleich, eine lokale Kopie veraltet, und Offline-Verfügbarkeit löst der Service Worker auf HTTP-Ebene.

**Modellieren.** Vier Listen als `computed`, `Map`-Indizes für O(1)-Lookups (`getSession(id)` …) und die Joins `speakersForSession()` / `sessionsForSpeaker()`. Komponenten erhalten aufgelöste Objekte per Props.

**Schichtung.** Nur diese Datenschicht ruft `useAsyncData` auf. Domänen-Composables (`useSessions()`, `useSpeakers()`, `useSessionFilter()`, `useMyProgram()`) bauen darauf auf, statt selbst zu laden — sonst würde der Datensatz mehrfach geladen und die Joins zerrissen. Schicht-Regeln siehe [ADR B](./02-architektur-adr.md).

## Persönlicher State: `useMyProgram()`

**Datenstruktur: nur IDs** (`string[]`), keine Session-Objekte. Ändert sich im Datensatz ein Raum oder eine Uhrzeit, zeigt „Mein Programm" automatisch den aktuellen Stand statt einer veralteten Kopie; kein Migrationsproblem bei Schema-Änderungen, winziger Storage-Footprint. Der Preis: Der Datensatz muss geladen sein — er ist auf jeder Seite geladen und wird in Schritt 3 offline gecached. Gelöschte IDs werden beim Auflösen still gefiltert.

**Reaktive Verteilung: `useState`.** Pro Key app-weit geteilt und SSR-sicher; Header-Zähler, Toggle und Dashboard lesen dieselbe Referenz. Pinia wäre für ein Array mit vier Mutationen eine Abhängigkeit ohne Mehrwert; ein Modul-`ref` wäre unter SSR ein Shared-State-Leck zwischen Requests.

**Persistenz.** Key `frontrow:my-program:v1` (Versionssuffix für Migrationen). Geschrieben wird explizit in den Mutationen, nicht über einen Watcher am Scope einer Komponente. Fehler (Quota, Private Mode) schlagen still fehl.

**Rehydration.** Einmalig in `onMounted` (Flag `isHydrated`), damit Server-HTML und erster Client-Render identisch sind. Bis dahin zeigt das Dashboard einen Ladehinweis und die Merken-Buttons auf SSR-Seiten sind deaktiviert. Das Dashboard `/mein-programm` selbst ist eine CSR-Route (`ssr: false`), weil der Server dort nichts Sinnvolles rendern könnte (Rendering-ADR, Punkt E).

## Datenfluss

```mermaid
sequenceDiagram
  participant JSON as conference-data.json
  participant API as /api/conference-data
  participant CD as useConferenceData()
  participant Page as Page / SessionCard
  participant MP as useMyProgram()
  participant LS as localStorage

  Note over Page: Erstaufruf oder Neuladen der Seite
  Page->>CD: await useSessions() → useConferenceData()
  CD->>API: $fetch (SSR: intern · Client: HTTP)
  API->>JSON: Datei pro Request lesen
  JSON-->>API: ConferenceData
  API-->>CD: ConferenceData
  CD-->>Page: sessions, getSession(), …
  Page->>MP: useMyProgram()
  MP-->>Page: sessionIds = [] (Server & 1. Client-Render identisch)

  Note over MP,LS: onMounted → Rehydration
  MP->>LS: getItem("frontrow:my-program:v1")
  LS-->>MP: ["s02","s07"]
  MP-->>Page: sessionIds reaktiv aktualisiert → Toggle/Zähler/Dashboard

  Note over Page: Interaktion
  Page->>MP: toggle("s12")
  MP->>MP: sessionIds = [...ids, "s12"]
  MP->>LS: setItem(JSON.stringify(ids))
  MP-->>Page: alle Konsumenten re-rendern

  Note over Page: Dashboard löst IDs auf
  Page->>CD: getSession(id) für jede ID
  CD-->>Page: volle Session-Objekte (immer aktuell)
```

## Konsequenzen

- (+) Eine Datenquelle, keine Kopien; Programmänderungen schlagen überall durch.
- (+) Kein Store-Framework, zwei kleine typisierte Composables.
- (−) Kurzes Aufblitzen des leeren Zustands vor der Rehydration (umgesetzt: Dashboard als CSR-Route mit Ladehinweis, Toggles bis zur Rehydration deaktiviert).
- (−) Die App hängt an einer erreichbaren Datenroute; fällt sie aus, gibt es keine veraltete Kopie als Fallback (bewusst, siehe Rendering-ADR).
- (−) Keine Tab-Synchronisation (per `storage`-Event ergänzbar).
