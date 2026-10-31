# AI-LOG — Schritt 2 (Markus Vogl)

Live mitgeschrieben während der Arbeit. Tool durchgehend: Claude Code (Modell Fable 5.1).

## 2026-10-31

### Eintrag 1

- **Tool:** Claude Code
- **Prompt im Wortlaut:** „/Users/markusvogl/Downloads/04c Team Assignment (1).pdf - Kannst du Andreas PR in dem Repo reviewen und auch gegen die Angabe hier abgleichen?"
- **Zweck:** Cross-Review von PR #1 (B + C, ADR, AI-LOG) wie in der Angabe gefordert. Das Tool sollte den Branch bauen, alle 20 Detailrouten gegen den Datensatz prüfen und ADR sowie AI-LOG mit den Anforderungen der Angabe (Schema, Wortzahl, Dateinamen, Bewertungsfokus) abgleichen, statt nur den Diff zu lesen.
- **Ergebnis:** B und C funktional sauber. Gefunden: ADR-Wortzahlen unter 150, SSR-Begründung durch Build-Zeit-Import nicht gedeckt, fehlender README-Bezug, AI-LOG-Dateiname, toter „Merken"-Platzhalter, Branding-Änderungen ohne Doku-Update.

### Eintrag 2

- **Tool:** Claude Code
- **Prompt im Wortlaut:** „Also wie sollen wir dann jetzt am besten vorgehen? Ich wuerde Andrea das gerne Feedbacken und im gleichen Zug dann die Abgabe meinerseits fertig machen"
- **Zweck:** Aus den Review-Befunden einen Arbeitsplan ableiten: Was geht an Andrea zurück, was übernehme ich (D, E, Laufzeit-Datenquelle, ADR D + E, README, AI-LOG), welche Entscheidungen müssen wir gemeinsam treffen (Routen, Aufgabenteilung). Dazu ein paste-fertiges Review für den PR-Kommentar.

### Eintrag 3

- **Tool:** Claude Code
- **Prompt im Wortlaut:** „was ist das mit dem BaseButton emit? ich find das nasty, dass da ein handleClick emittet wird das sollte ja eigentlich event handler naming sein und nicht im emit"
- **Zweck:** Verstehen, warum der Button trotz falsch benanntem Emit funktioniert (Attribut-Fallthrough über zwei Komponenten bis zum nativen Button) und welcher Fix korrekt ist (Emit `click` mit Event, oder Emit streichen). Ergebnis geht als Punkt ins Review an Andrea.

### Eintrag 4

- **Tool:** Claude Code
- **Prompt im Wortlaut:** „Okay ich hab Andreas PR jetzt mal gemerged"
- **Zweck:** Startsignal für meinen Teil auf Branch `feature/speakers-my-program`: Speaker-Übersicht und -Profile (D), `useMyProgram` + `ProgramToggle` + „Mein Programm"-Seite (E) nach Konzept C, Nitro-Route mit fs-Storage als SSR-Simulation, ADR D + E auf 150–250 Wörter mit Abweichungsbegründung, Nachtrag, README-Abschnitt, dieses Log.
- **Übernommen / geprüft:** Typecheck und Build grün; alle 18 Speaker-Seiten per Skript gegen den Datensatz geprüft (Name, Titel, Firma, Bio, Session-Links); Simulation getestet: Datei bei laufendem Server geändert, SSR-Detailseite und Speaker-Profil zeigten den neuen Stand ohne Build.
- **Geändert / verstanden:** Die ursprüngliche Idee, den Datensatz serverseitig zu importieren, macht SSR zu SSG mit Umweg. Erst ein Lesen pro Request löst die ADR-Begründung ein. Die Merken-Buttons müssen auf SSR-Seiten bis zur Rehydration deaktiviert sein, sonst unterscheiden sich Server-HTML und erster Client-Render.

### Eintrag 5

- **Tool:** Claude Code
- **Prompt im Wortlaut:** „Setzen wir bitte folgende Refactorings um: - Button Abstraktion - aktuell gliedert sich der Button in ein ButtonVisual und einen Wrapper davon in Summe wirkt das sehr unsauber - auch der Slot im Button der random drinnen ist - den sollten wir sauber refactoren - auch mit dem handleClick emit - handleClick sollte ja eigentlich vom naming her nur fuer event handler verwendet werden und ist semantisch einfach falsch im Emit - Ich haeete auch ger]ne etwas mehr space zw. Label & Icon in den Buttons - klebt aktuell sehr zusammen"
- **Zweck:** Die dreiteilige Button-Abstraktion (BaseButton → BaseButtonVisual, BaseLinkButton → BaseButtonVisual) aus dem Cross-Review auf eine Base-Komponente reduzieren: ein `BaseButton`, der mit `to` als NuxtLink und sonst als `<button>` rendert, nur Default-Slot statt Slot plus `label`-Prop, Emit `click` mit MouseEvent statt `handleClick`, Abstand zwischen Label und Icon über `gap`.
- **Übernommen / geprüft:** Zwei Dateien gelöscht, sechs Verwendungen umgestellt, Typecheck und Build grün, gerendertes HTML auf Detail- und Speaker-Seite geprüft (Attribut-Fallthrough für `aria-pressed`, `disabled`, `class` bleibt erhalten).
- **Geändert / verstanden:** Das alte Konstrukt funktionierte nur, weil ein nicht deklariertes `@click` als Attribut über zwei Komponenten bis zum nativen Button durchfiel. Ein deklarierter Emit macht den Vertrag der Base-Komponente typisierbar und nimmt die Abhängigkeit vom Fallthrough.

### Eintrag 6

- **Tool:** Claude Code
- **Prompt im Wortlaut:** „Bitte mach ein Review von unsreren lokalen Changes & challange die Changes gegen die Angabe"
- **Zweck:** Zweite Review-Runde über meinen eigenen Branch, diesmal mit dem eingebauten Code-Review-Agenten als unabhängiger Leser plus Abgleich gegen Angabe und Schritt-1-Dokumente. Ergebnis: vier Must-haves (dreifache Datumsformatierung neben `formatDay`, hart kodiertes „an zwei Tagen", `aria-label` auf `<span>`, `BaseButton` mit `to` ignoriert `disabled`), dazu ADR B und Konzept C, die noch den Planungsstand beschreiben (`components/features/`, `/sessions`, Build-Import, `<ClientOnly>`).

### Eintrag 7

- **Tool:** Claude Code
- **Prompt im Wortlaut:** „Fixen wir mal die must-haves vor der Abgabe also den reuse der Formatierung aber fass mir die Aenderungen bitte in einen extra Branch zusammen damit ich sie Andrea als Feedback schicken kann. Bitte bessern wir im gleichen Zug auch noch die Changes aus, wo die ADRs von der aktuell implementierten Architektur abweichen. Die sollen immer aktuell gehalten werden."
- **Zweck:** Must-haves auf eigenem Branch `fix/review-formatierung-adr`, getrennt in Code- und Doku-Commit, damit Andrea das Feedback als Diff lesen kann. Regel für das Team festgehalten: ADRs werden in-place auf den Ist-Stand gebracht (mit Aktualisierungsdatum), nicht nur per Nachtrag ergänzt.

### Eintrag 8

- **Tool:** Claude Code
- **Prompt im Wortlaut:** „Bitte teste jetzt nocheinmal gegen die Angabe und mache noch ein finales Code Review" und danach „Lass uns die 5 Punkte noch fixen - koennen wir danach als Uebergabe an Andrea ein Github Issue im Repo anlegen mit dem Feedback Branch inkl. den Themen die bei ihr noch gefixt gehoeren?"
- **Zweck:** Abschließende Prüfung: alle 20 Detail- und 18 Speaker-Seiten per Skript gegen den Datensatz, CSR/SSR pro Route gegen die ADR, ADR-Schema und Wortzahlen, AI-LOG-Felder. Finales Code-Review brachte fünf Punkte, die noch gefixt wurden: deaktivierter Link-Button navigierte trotzdem (RouterLink navigiert vor dem äußeren Handler, jetzt wird ein deaktivierter `<button>` gerendert), Zeitzonen-Falle in `formatDay` (fester UTC-Zeitpunkt), `aria-label` auf dem Toggle überschrieb den sichtbaren Text, doppelte IDs aus `localStorage`, toter Link auf `AI-LOG-Windisch.md`. Übergabe an Andrea als GitHub-Issue mit Feedback-Branch und ihrer Restliste.
