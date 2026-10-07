# ADR 4: LocalStorage-Zugriffe über fachliche Composables

## Kontext

Verschiedene Bereiche benötigen Zugriff auf Daten und gegebenenfalls gespeicherte Einstellungen. Komponenten sollen weder Storage-Schlüssel kennen noch selbst Daten aus LocalStorage lesen und schreiben.

## Optionen

- **LocalStorage direkt in Komponenten verwenden:** Wenig zusätzlicher Aufbau, aber verteilte Speicherlogik und mögliche Duplikate.
- **Ein großes Composable für alle Bereiche:** Zentraler Zugriff, jedoch viele unterschiedliche Verantwortlichkeiten.
- **Separate fachliche Composables:** Beispielsweise `useSpeaker`, `useRoom` und `useMyProgram` kapseln den jeweiligen Bereich.

## Entscheidung

Wir verwenden separate fachliche Composables wie `useSpeaker` und `useRoom`. Sie stellen Daten und Aktionen für ihren Bereich bereit und kapseln notwendige Speicherzugriffe.

Gemeinsame technische Aufgaben wie Lesen, Schreiben und JSON-Verarbeitung werden in einem kleinen `useLocalStorage`-Composable gebündelt. Die fachlichen Composables verwenden diesen Baustein, damit die technische Speicherlogik nicht mehrfach implementiert wird.

Speaker und Räume stammen weiterhin aus dem gemeinsamen Konferenzdatensatz. LocalStorage speichert nur tatsächlich benötigte persönliche Einstellungen oder ausgewählte IDs.

## Konsequenzen

Die Zuständigkeiten bleiben klar und Komponenten werden von der Speicherung unabhängig. Speicherfehler können zentral behandelt werden. Dafür müssen eindeutige Storage-Schlüssel und eine gemeinsame Initialisierung vereinbart werden.

LocalStorage wird ausschließlich im Browser geladen, da es während der serverseitigen Verarbeitung nicht verfügbar ist.