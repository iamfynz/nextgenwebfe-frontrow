# 01 — ADR: Rendering-Strategie

## Allgemeine Auswahlkriterien

Die Rendering-Strategie richtet sich nach Aktualität und Interaktion. SSG wurde für die Konferenzdaten verworfen, weil Änderungen an Uhrzeiten, Räumen oder Speakern sofort sichtbar sein sollen und nicht erst nach einem erneuten Build. Seiten mit überwiegend lesenden Inhalten werden deshalb per SSR bei jedem Aufruf mit aktuellen Daten erzeugt. Bereiche mit Filtern, persönlichem Zustand oder `localStorage` verwenden CSR, da ihre Darstellung von Interaktionen und browserseitigen Daten abhängt. ISR wäre eine mögliche Zwischenlösung, erlaubt aber weiterhin kurzzeitig veraltete Informationen und bringt für den kleinen Datensatz keinen wesentlichen Vorteil.

## B — Session-Übersicht mit Filtern

> Verantwortlich: Andrea

### Kontext

Die Übersicht zeigt alle Sessions und bietet kombinierbare Filter nach Track, Konferenztag und Level. Die Ergebnisse verändern sich unmittelbar durch die Auswahl der Nutzer:innen. Zusätzlich sollen Änderungen im Konferenzprogramm ohne erneuten Build verfügbar sein.

### Optionen

Bei **CSR** werden Daten und Filterlogik im Browser verarbeitet. **SSR** könnte die erste Übersicht am Server erzeugen, für die anschließende Filterung wäre jedoch weiterhin clientseitiges JavaScript notwendig. **SSG** würde eine schnelle statische Seite liefern, aber Änderungen erst nach einem neuen Build anzeigen.

### Entscheidung

Die Session-Übersicht wird mit **CSR** umgesetzt. Der wichtigste Teil dieser Seite ist die direkte Interaktion mit den Filtern. Der Filterzustand ist nur für die aktuelle Nutzung relevant und muss nicht serverseitig gespeichert werden.

### Konsequenzen

Die Filter reagieren ohne Neuladen oder zusätzliche Serveranfrage. Aktuelle Daten können zur Laufzeit geladen werden. Dafür benötigt die Seite JavaScript und der vollständige Inhalt wird erst nach dem Laden der Daten im Browser dargestellt.

## C — Session-Detailseiten

> Verantwortlich: Andrea

### Kontext

Die Detailseiten zeigen Titel, Abstract, Zeit, Raum, Track, Level, Format und Speaker einer Session. Die Darstellung ist hauptsächlich lesend. Während einer Konferenz können sich besonders Uhrzeit oder Raum kurzfristig ändern und müssen beim nächsten Aufruf aktuell sein.

### Optionen

Mit **SSR** wird die Seite bei jedem Aufruf aus dem aktuellen Datenstand erzeugt. **SSG** würde die Detailseiten beim Build vorbereiten, könnte danach aber veraltete Informationen enthalten. **ISR** könnte die Seiten regelmäßig aktualisieren, lässt zwischen den Aktualisierungen jedoch ein Zeitfenster mit alten Daten.

### Entscheidung

Die Session-Detailseiten verwenden **SSR**. Obwohl die Seite selbst kaum Interaktion benötigt, ist die Aktualität der angezeigten Informationen wichtiger als eine vollständig statische Auslieferung.

### Konsequenzen

Änderungen sind beim nächsten Seitenaufruf sichtbar, ohne dass die gesamte Anwendung neu gebaut werden muss. Dafür entsteht bei jedem Aufruf serverseitiger Rendering-Aufwand und die Seite benötigt eine erreichbare Datenquelle.

## D — Speaker-Profile

> Verantwortlich: Markus

### Kontext

Speaker-Profile enthalten Name, Position, Unternehmen, Biografie und Links zu den gehaltenen Sessions. Die Inhalte werden hauptsächlich gelesen, können aber durch Profilkorrekturen oder geänderte Session-Zuordnungen aktualisiert werden.

### Optionen

**SSR** erzeugt das Profil bei jedem Aufruf mit den aktuellen Daten. **SSG** wäre für selten veränderte Profile grundsätzlich geeignet, würde Aktualisierungen aber erst nach einem neuen Build übernehmen. **ISR** reduziert die Anzahl der Server-Renderings, kann dafür zeitweise veraltete Profile ausliefern.

### Entscheidung

Die Speaker-Profile werden mit **SSR** umgesetzt. Dadurch bleiben sowohl die Profildaten als auch die Verknüpfungen zu Sessions aktuell. Eine rein clientseitige Darstellung ist nicht erforderlich, weil die Seite keinen persönlichen Zustand und kaum Interaktion enthält.

### Konsequenzen

Nutzer:innen sehen bei jedem Aufruf den neuesten Stand. Die Inhalte können außerdem bereits vollständig als HTML ausgeliefert werden. Im Gegenzug wird das Profil bei jeder Anfrage erneut serverseitig erzeugt.

## E — „Mein Programm“

> Verantwortlich: Markus

### Kontext

„Mein Programm“ zeigt die persönlich ausgewählten Sessions. Gespeichert werden nur deren IDs im `localStorage` des jeweiligen Geräts. Dieser Zustand ist individuell und kann dem Server beim Rendern nicht bekannt sein.

### Optionen

Bei **CSR** wird der Zustand nach dem Laden im Browser aus `localStorage` rehydriert. **SSR** könnte lediglich eine leere oder unpersönliche Ausgangsseite erzeugen, weil der Server keinen Zugriff auf den lokalen Speicher hat. **SSG** kann den individuellen Zustand ebenfalls nicht berücksichtigen.

### Entscheidung

„Mein Programm“ verwendet **CSR**. Nur der Browser kann die gespeicherten Session-IDs lesen und die persönliche Ansicht nach dem Laden zusammensetzen. Auch das Hinzufügen und Entfernen von Sessions geschieht clientseitig.

### Konsequenzen

Das persönliche Programm bleibt über einen Reload hinweg erhalten und muss nicht an einen Server übertragen werden. Bis die Rehydration abgeschlossen ist, zeigt die Seite einen neutralen Lade- oder Leerzustand. Ohne JavaScript steht die personalisierte Ansicht nicht zur Verfügung.
