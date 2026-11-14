# AI-LOG — Schritt 3 (Markus Vogl)

Live mitgeschrieben während der Arbeit, ein Eintrag pro Prompt. Tool durchgehend: Claude Code (Modell Fable 5.2).

## 2026-11-14

### Eintrag 1

- **Tool:** Claude Code
- **Prompt im Wortlaut:** „/Users/markusvogl/Downloads/MCT-BB-1-WS2026-FRONT-DE_177604_177605_20261114_2330.zip hier liegen die Kursinhalte für NextGen Web Frontends - im Repo findest du einen Branch von Andrea, den ich noch mergen muss - wie stehen wir damit gegen folgende Angabe? /Users/markusvogl/Downloads/05b\ Team\ Assignment\ \(2\).pdf"
- **Zweck:** Standortbestimmung für Schritt 3 vor dem Merge von PR #4 (`feature/manifest`): Angabe und Folien 05a lesen, Andreas Branch bauen und das Offline-Verhalten tatsächlich testen (Headless-Chrome über CDP, Server gestoppt, Netzwerk-Emulation offline), statt nur den Diff zu lesen.
- **Ergebnis:** A weitgehend erfüllt (Manifest valide, keine Installierbarkeitsfehler). B, D, E fehlen. Im Service Worker zwei Lücken: `/programm` offline neu geladen zeigt die Browser-Fehlerseite (nur `/` und `/mein-programm` werden als Navigation behandelt), und „Mein Programm" löst gemerkte Sessions offline nicht auf, wenn der Einstieg über die SSR-Startseite lief, weil `/api/conference-data` dann nie im Cache landet. Dazu: HTML der Startseite liegt Cache-First im Cache und veraltet.

### Eintrag 2

- **Tool:** Claude Code
- **Prompt (gekürzt):** „Fangen wir gerne an. Können wir für das Caching Googles Workbox verwenden oder spricht da was dagegen?"
- **Zweck:** PR #4 per Merge-Commit mergen und meinen Teil von C (Sessions-/Speaker-Daten) auf Branch `feature/offline-caching` beginnen. Klären, ob Workbox statt des handgeschriebenen Service Workers zulässig und sinnvoll ist, und die beiden Lücken aus Eintrag 1 in einzelnen, jeweils offline getesteten Schritten schließen.
- **Übernommen / geprüft:** Workbox über `@vite-pwa/nuxt` (Strategie `buildSW`, eigener Quelltext in `app/service-worker/sw.ts`). Nach jedem Schritt Build, Typecheck und Offline-Test in Headless-Chrome: zuerst 1:1-Port (Verhalten unverändert, `/programm` offline weiterhin Fehlerseite), dann Daten-Cache bei der Installation vorgeladen („Mein Programm" zeigt gemerkte Sessions nach Einstieg über die Startseite), dann Seiten per Network First mit App-Shell-Rückfall (alle Routen laden offline nach einem einzigen Besuch der Startseite), zuletzt Google Fonts.
- **Geändert / verstanden:** In Version 2 des Moduls heißt die Strategie für einen selbst geschriebenen, gebündelten Service Worker `buildSW`, nicht mehr `injectManifest`. Die leere HTML-Shell einer CSR-Route rendert im Browser jede Route und taugt deshalb als Offline-Rückfall für nie besuchte Seiten. Offen: Schriften fehlen offline nach nur einem Seitenaufruf; Erstbesuch offline bleibt die Browser-Fehlerseite. Network First für HTML weicht von Andreas Cache First ab und muss in B gemeinsam entschieden werden.
