# Komponentenübersicht – frontrow

## Komponentenbaum

- `app.vue`
  - `layouts/default.vue`: Gemeinsamer Seitenrahmen
    - `AppHeader.vue`: Header
    - Aktuelle Seite
      - `pages/index.vue`: Startseite / Sessionübersicht
        - `BaseCard.vue`: Wiederverwendbare Karte
    - `AppFooter.vue`: Footer

Der Baum beschreibt die vorgesehene Zusammensetzung der vorhandenen
Dateien. Die tatsächliche Verwendung hängt von den Imports und Templates ab.

## Ordnerstruktur

- `app/`
  - `assets/css/`
    - `main.css`
  - `components/`
    - `base/`
      - `BaseCard.vue`
    - `layout/`
      - `AppHeader.vue`
      - `AppFooter.vue`
  - `composables/`
    - `useConferenceData.ts`
  - `layouts/`
    - `default.vue`
  - `pages/`
    - `index.vue`
  - `types/`
  - `app.vue`
- `docs/`
  - `ard/`
  - `schritt1/`
  - `component-structure.md`
- `public/`

## Komponentenschichten

### Base/UI

- `BaseCard.vue`: Allgemeine Karte, die auf verschiedenen Seiten
  wiederverwendet werden kann.

### Layout

- `AppHeader.vue`: Header mit Branding und gegebenenfalls Navigation.
- `AppFooter.vue`: Gemeinsamer Footer.
- `layouts/default.vue`: Verbindet Header, Seiteninhalt und Footer.

### Feature

Im aktuellen Grundgerüst sind noch keine eigenen Feature-Komponenten vorhanden.
Bei der Umsetzung werden beispielsweise `SessionFilters`, `SessionList`
und `ProgramToggleButton` ergänzt.

### Seiten und Einstiegspunkt

- `pages/index.vue`: Inhalt der Startseite und Verbindung zu den Daten.
- `app.vue`: Einstiegspunkt der Anwendung und Einbindung von Layout und Seite.

## Composables

| Composable | Aufgabe |
|---|---|
| `useConferenceData.ts` | Gemeinsamen Konferenzdatensatz laden und bereitstellen |

Weitere Composables für Filter, Speaker, Räume und das persönliche Programm
werden bei der Umsetzung der jeweiligen Funktionen ergänzt.