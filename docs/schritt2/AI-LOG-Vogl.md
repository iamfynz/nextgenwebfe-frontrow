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
