# 01 — ADR: Rendering-Strategie

## Allgemeine Auswahlkriterien

Die Rendering-Strategie richtet sich nach Aktualität und Interaktion. SSG wurde für die Konferenzdaten verworfen, weil Änderungen an Uhrzeiten, Räumen oder Speakern sofort sichtbar sein sollen und nicht erst nach einem erneuten Build. Seiten mit überwiegend lesenden Inhalten werden deshalb per SSR bei jedem Aufruf mit aktuellen Daten erzeugt. Bereiche mit Filtern, persönlichem Zustand oder `localStorage` verwenden CSR, da ihre Darstellung von Interaktionen und browserseitigen Daten abhängt. ISR wäre eine mögliche Zwischenlösung, erlaubt aber weiterhin kurzzeitig veraltete Informationen und bringt für den kleinen Datensatz keinen wesentlichen Vorteil. Voraussetzung für die SSR-Argumentation ist, dass der Server den Datensatz zur Laufzeit liest und nicht beim Build einbettet; wie wir das simulieren, steht im [Nachtrag](#nachtrag-zur-umsetzung).

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

Ein Speaker-Profil zeigt Name, Titel, Firma, Bio und die gehaltenen Sessions. Die Daten sind für alle gleich und werden nur gelesen; es gibt 18 Profile. Das Szenario legt damit SSG nahe. Tatsächlich ändern sich Profile aber bis kurz vor der Konferenz: Ein Speaker fällt aus, eine Session wird neu zugeordnet. Die Session-Liste im Profil ist ein Join über die Sessions und erbt jede Änderung an Raum oder Uhrzeit.

### Optionen

**SSG:** alle 18 Profile beim Build vorrendern, Auslieferung ohne Server, schnellster First Paint; jede Korrektur braucht Build und Deployment. **SSR:** Profil pro Aufruf aus dem aktuellen Datenstand; Änderungen sofort sichtbar, dafür Rendering pro Request und ein laufender Node-Prozess. **ISR:** statisch mit Revalidierung nach n Sekunden; braucht ein Hosting mit ISR-Unterstützung, und ein Zeitfenster mit veralteten Daten bleibt. **CSR:** verworfen, kein persönlicher Zustand, und Profile ohne Inhalt im HTML sind für Teilen und Suche schlecht.

### Entscheidung

**SSR**, als bewusste Abweichung vom nahegelegten SSG. Ausschlaggebend ist die Session-Liste: Sie hängt an denselben Daten wie die Detailseiten (C), für die SSR gewählt wurde. Zwei Rendering-Wege für dieselbe Quelle würden inkonsistente Stände zwischen Profil und Session erzeugen. Bei 18 Profilen und einem Datensatz von wenigen Kilobyte ist der Rendering-Aufwand vernachlässigbar.

### Konsequenzen

Profile sind beim nächsten Aufruf aktuell und vollständig im HTML enthalten. Der Server liest den Datensatz pro Request von der Platte (siehe Nachtrag); ein reiner Static-Host reicht nicht mehr. Fällt die Datenquelle aus, liefert die Seite einen Fehler statt einer veralteten Kopie. Wird die Hosting-Frage in Schritt 3 anders entschieden, ist ISR über eine `routeRules`-Zeile nachrüstbar.

## E — „Mein Programm“

> Verantwortlich: Markus

### Kontext

„Mein Programm“ zeigt die Sessions, die eine Person für sich markiert hat. Laut Konzept C (Schritt 1) liegen im `localStorage` nur Session-IDs; die Objekte werden beim Anzeigen gegen `useConferenceData()` aufgelöst. Dieser Zustand existiert nur im Browser des jeweiligen Geräts, der Server kennt ihn nicht. Die Seite wird durch Hinzufügen und Entfernen laufend verändert und muss einen Reload überstehen.

### Optionen

**CSR** (`ssr: false`): Die Seite wird komplett im Browser aufgebaut, liest die IDs aus `localStorage` und löst sie gegen den Datensatz auf; der Server liefert nur die App-Hülle. **SSR mit Client-Rehydration:** Der Server rendert Rahmen und Leerzustand, der Client ersetzt ihn nach dem Mount durch den persönlichen Inhalt. Das erzeugt ein Aufblitzen des leeren Zustands und erzwingt identisches Server- und Erst-Client-HTML. **SSG:** wie SSR, nur vorgerendert, mit derselben Einschränkung. **Serverseitiger Zustand** (Cookie oder Account): würde personalisiertes SSR erlauben, braucht aber Login und Backend, beides außerhalb des Szenarios.

### Entscheidung

**CSR.** Es gibt auf dieser Seite nichts, was der Server sinnvoll rendern könnte; jeder serverseitige Inhalt wäre ein Platzhalter, der sofort ersetzt wird. Die Merken-Buttons auf Übersicht und Detailseiten bleiben dagegen in SSR-Seiten eingebettet und rehydrieren den Zustand in `onMounted`, damit Server- und erstes Client-HTML identisch sind.

### Konsequenzen

Persistenz über einen Reload funktioniert ohne Server. Ohne JavaScript gibt es die Seite nicht. Bis zur Rehydration zeigt die Seite einen Ladehinweis, Merken-Buttons sind bis dahin deaktiviert. Sessions, die aus dem Datensatz verschwinden, fallen still aus dem Programm. Tab-Synchronisation gibt es nicht; ein `storage`-Listener wäre nachrüstbar.

## Nachtrag zur Umsetzung

> Datum: 2026-10-31 · Markus, reviewt von Andrea

**Datenquelle zur Laufzeit.** Bis Schritt 1 importierte `useConferenceData()` die JSON-Datei serverseitig beim Build. Damit hätte SSR denselben Stand gerendert wie SSG, und die Begründung in C und D wäre leer gewesen; Konzept C sagt zudem „ändert sich nur per Deployment“. Seit Schritt 2 liest eine Nitro-Route (`server/api/conference-data.get.ts`) die Datei `public/data/conference-data.json` bei jedem Request über den Nitro-Storage mit fs-Treiber. Das ist unsere Simulation eines veränderlichen Backends: Wird die Datei bei laufendem Server geändert, zeigt der nächste Aufruf einer SSR-Seite den neuen Stand, ohne Build (Anleitung im README). Server und Client laden dieselbe Route; Konzept C bleibt ansonsten gültig (ein Loader, keine Kopie des Datensatzes im `localStorage`). Die Lebensdauer-Aussage ist damit präzisiert: Der Datensatz ändert sich ohne Deployment, aber nicht pro Nutzer:in.

**Routen.** ADR B (Schritt 1) plante `/sessions`, `/sessions/[id]`, `/speakers/[id]` und `/mein-programm`. Umgesetzt sind `/programm`, `/programm/[id]`, `/speakers`, `/speakers/[id]` und `/mein-programm`. „Programm“ ist der Begriff, den Besucher:innen für die Session-Übersicht verwenden; die Benennung gilt für die weiteren Schritte.

**Aufgabenteilung.** Die Angabe sieht Person 1 für B + D und Person 2 für C + E vor. Wir haben nach Arbeitsfortschritt aufgeteilt: Andrea B + C, Markus D + E. Beide Teile wurden von der jeweils anderen Person reviewt und durchgeklickt.
