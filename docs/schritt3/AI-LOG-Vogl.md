# AI-LOG — Schritt 3 (Markus Vogl)

Live mitgeschrieben während der Arbeit, ein Eintrag pro Prompt. Tool durchgehend: Claude Code (Modell Fable 5.2).

## 2026-11-14

### Eintrag 1

- **Tool:** Claude Code
- **Prompt im Wortlaut:** „/Users/markusvogl/Downloads/MCT-BB-1-WS2026-FRONT-DE_177604_177605_20261114_2330.zip hier liegen die Kursinhalte für NextGen Web Frontends - im Repo findest du einen Branch von Andrea, den ich noch mergen muss - wie stehen wir damit gegen folgende Angabe? /Users/markusvogl/Downloads/05b\ Team\ Assignment\ \(2\).pdf"
- **Zweck:** Standortbestimmung für Schritt 3 vor dem Merge von PR #4 (`feature/manifest`): Angabe und Folien 05a lesen, Andreas Branch bauen und das Offline-Verhalten tatsächlich testen (Headless-Chrome über CDP, Server gestoppt, Netzwerk-Emulation offline), statt nur den Diff zu lesen.
- **Ergebnis:** A weitgehend erfüllt (Manifest valide, keine Installierbarkeitsfehler). B, D, E fehlen. Im Service Worker zwei Lücken: `/programm` offline neu geladen zeigt die Browser-Fehlerseite (nur `/` und `/mein-programm` werden als Navigation behandelt), und „Mein Programm" löst gemerkte Sessions offline nicht auf, wenn der Einstieg über die SSR-Startseite lief, weil `/api/conference-data` dann nie im Cache landet. Dazu: HTML der Startseite liegt Cache-First im Cache und veraltet.
