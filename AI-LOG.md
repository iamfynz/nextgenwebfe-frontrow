# AI-LOG

Dokumentation des Einsatzes von Claude Code im Projekt. Format wie in Hausübung 2: Anlass, was übernommen wurde, was geändert oder gelernt wurde.

## Schritt 1 — 2026-10-06

- Anlass: Projekt-Scaffolding auf Basis von Szenario, Team-Assignment, Datensatz und unseren vorläufigen Entscheidungen, mit der Bitte um kritische Prüfung dieser Entscheidungen.
  Übernommen: Nuxt-4-Grundgerüst mit Tailwind v4 und TypeScript, Schichtung Base/Feature/Layout, ein zentrales Daten-Composable mit Lookups und Joins, Typen für den Datensatz, erste Entwürfe für ADR B, Konzept C und ADR D.
  Geändert/verstanden: Unsere ursprüngliche Ordnerstruktur folgte Vue-Router-Konventionen, die in Nuxt nicht existieren. Volle Session-Objekte im localStorage wären eine zweite Quelle der Wahrheit, daher nur IDs. Ein ladendes Composable pro Entität würde den Datensatz mehrfach laden, daher eine Datenschicht mit Domänen-Composables darüber. Rendering-Argumente gehören nicht in die Setup-Entscheidung.

- Anlass: Abgleich des Umfangs mit der Angabe und Abgrenzung der individuellen Zuständigkeiten im Team.
  Übernommen: Rückbau auf das geforderte Minimum. Design Tokens, Branding-Dokument, Entity-Seiten, Feature-Komponenten und nicht genutzte Composables wurden entfernt; die Themen bleiben als geplant in den Dokumenten erwähnt.
  Geändert/verstanden: Die Angabe verlangt für das Grundgerüst nur ein Platzhalter-Layout und einen Funktionsnachweis für das Einlesen der Daten. Vorgezogener Feature-Code verfälscht die Zuordnung der Deliverables und die Commit-Historie. Die Headless-Entscheidung braucht eine Begründung, keinen Code.

- Anlass: Architekturfrage, ob domänenspezifische Composables einem einzelnen Daten-Composable vorzuziehen sind.
  Übernommen: Zweischichtiges Composable-Konzept in ADR B und Konzept C, mit der Regel, dass nur die Datenschicht den Datensatz lädt.
  Geändert/verstanden: Single Source of Truth und Domänen-Composables schließen sich nicht aus. Das eine regelt, wo geladen wird, das andere, welche Schnittstelle Komponenten sehen. Durchreich-Composables ohne eigene Logik wären Abstraktion ohne Nutzen.

- Anlass: Prüfung der Codebase und der Dokumente gegen die Angabe und den Bewertungsfokus.
  Übernommen: Bereinigung einer vom Editor wiederhergestellten Datei, Fokussierung von ADR D auf die Setup-Entscheidung, Kriterien-Tabelle in ADR D, neutrale Benennung der Optionen, explizite Abwägung der verworfenen Alternativen, sprachliche Trennung von vorhandenen und geplanten Teilen, Begründung, warum der Datensatz nicht im localStorage liegt.
  Geändert/verstanden: Eine Alternative, die nur Nachteile hat, gilt nicht als abgewogen. Eine Entscheidung, die nur durch Weglassen erkennbar ist, gilt nicht als begründet. Dokumentation und Code müssen denselben Stand beschreiben.

Umgebungsnotizen: `vue-tsc` läuft nicht mit TypeScript 7, deshalb ist TypeScript auf 5.x gepinnt. Ein relativer `$fetch` auf Dateien unter `public/` landet im Dev-Server beim Router statt beim statischen Asset, deshalb importiert das Daten-Composable serverseitig direkt.

Co-Authored Claude Code (Model: Fable 5.1)
