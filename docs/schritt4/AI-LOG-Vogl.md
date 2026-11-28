# AI-LOG — Schritt 4 (Markus Vogl)

Live mitgeschrieben während der Arbeit, ein Eintrag pro Prompt. Tool durchgehend: Claude Code (Modell Fable 5.2).

## 2026-11-28

### Eintrag 1

- **Tool:** Claude Code
- **Prompt im Wortlaut:** „Vergleiche ESLint und Biome als Qualitäts-Gate für unser Nuxt-4-Projekt mit Vue-SFCs und TypeScript: Unterstützung für .vue-Dateien inklusive Templates, Regeln gegen any, ungenutzte Variablen und Magic Numbers, Einbindung in CI und Pre-Commit-Hook. Belege die Aussagen mit der aktuellen Doku beider Tools und gib eine Empfehlung."
- **Zweck:** Das Tool für das Qualitäts-Gate (Teil B) wählen. Die Angabe lässt ESLint oder Biome zu.
- **Übernommen:** ESLint mit dem Nuxt-Modul `@nuxt/eslint`. Grundkonfiguration in `eslint.config.js`, `npm run lint` bricht auch bei Warnungen ab (`--max-warnings 0`). Regeln, CI-Workflow und Pre-Commit-Hook folgen in eigenen Schritten.
- **Korrigiert/Abgelehnt:** Biome abgelehnt. Die Unterstützung für Vue-Dateien gilt laut Biome-Doku seit v2.3.0 als „experimental", braucht ein Opt-in (`html.experimentalFullSupportEnabled`) und kann in Vue-Dateien False Positives melden. Für ein Gate, das Commits blocken soll, ist das in einem Projekt aus `.vue`-Dateien zu unsicher. Die erste Begründung von Claude Code, Biome prüfe Templates gar nicht, war veraltet und wurde nach dem Blick in die Doku korrigiert.
- **Prüfmethode:** Aussagen gegen die Doku geprüft (biomejs.dev: Language Support, Regelseiten zu `noExplicitAny`, `noUnusedVariables`, `noMagicNumbers`, Rezepte für CI und Git-Hooks; eslint.vuejs.org; Modulseite von `@nuxt/eslint`). Lokal mit `npm ls` kontrolliert, dass das Modul `eslint-plugin-vue` 10.12 und `@typescript-eslint` 8.74 mitbringt. `npm run lint` läuft auf dem Bestand und meldet vier Befunde (ein Fehler in `useMyProgram.ts`, drei Warnungen in `SessionFilter.vue`). Nicht verifiziert: wie viele der Vue-Regeln von Biome stabil sind.

### Eintrag 2

- **Tool:** Claude Code
- **Prompt im Wortlaut:** „Dann fangen wir mit dem CI-Workflow als GitHub Action an und nehmen Husky für den Pre-Commit-Hook."
- **Zweck:** Den Block-Mechanismus für Teil B bauen: ein CI-Check, der sich nicht lokal umgehen lässt, und ein Pre-Commit-Hook, der einen fehlerhaften Commit schon am eigenen Rechner abbricht.
- **Übernommen:** `.github/workflows/lint.yml` (bei jedem Push und bei Pull Requests gegen `main`: `npm ci`, `nuxt prepare`, `npm run lint`, `npm run typecheck`, Node 24). Husky mit `.husky/pre-commit`, der `npm run lint` ausführt; `prepare: husky` in `package.json` richtet den Hook bei `npm install` ein.
- **Korrigiert/Abgelehnt:** Den Typecheck habe ich nicht in den Hook genommen, er läuft nur in der Action, damit ein Commit schnell bleibt. `npx husky init` brach auf meinem Rechner mit „git command not found" ab: unter `/usr/local/bin/git` liegt ein alter Intel-Build, den Node-Prozesse vor `/usr/bin/git` finden. Einrichtung deshalb einmalig mit angepasstem `PATH`; das ist ein Problem meines Rechners, nicht des Repos. Die von `husky init` erzeugte Vorlage (`npm test`) wurde ersetzt, das Projekt hat kein Test-Skript.
- **Prüfmethode:** Probe-Commit mit einer Datei `app/utils/gate-probe.ts`, die ein `any` und eine ungenutzte Variable enthält. Der Commit wurde abgebrochen, `git log` zeigte danach unverändert den vorherigen Commit; die Probedatei ist wieder gelöscht. Ausgabe:

  ```
  $ git commit -m "test: absichtlich fehlerhaft"

  > lint
  > eslint . --max-warnings 0

  app/utils/gate-probe.ts
    1:30  error  Unexpected any. Specify a different type     @typescript-eslint/no-explicit-any
    2:9   error  'unused' is assigned a value but never used  @typescript-eslint/no-unused-vars

  ✖ 2 problems (2 errors, 0 warnings)

  husky - pre-commit script failed (code 1)
  ```

  Der Commit, der Husky selbst einführt, lief durch den Hook (Lint ohne Befund). Die GitHub Action war zum Zeitpunkt dieses Eintrags noch nicht gelaufen; der gemeinsame Test mit Andrea steht aus.
