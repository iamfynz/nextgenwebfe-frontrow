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
