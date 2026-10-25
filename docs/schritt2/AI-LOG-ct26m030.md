# AI-LOG — Schritt 2

## 2026-10-24

### Eintrag 1

- **Tool:** Codex (OpenAI)
- **Prompt im Wortlaut:** „Im Person 2, and i want to setup the links, how do i do that in nuxt?“
- **Zweck:** Klären, welche Aufgaben Person 2 übernimmt und wie Session-, Speaker- und Programmseiten in Nuxt miteinander verlinkt werden.

### Eintrag 2

- **Tool:** Codex (OpenAI)
- **Prompt im Wortlaut:** „http://localhost:3000/s01 — page not found“
- **Zweck:** Ursache für die nicht gefundene dynamische Session-Route ermitteln.

### Eintrag 3

- **Tool:** Codex (OpenAI)
- **Prompt im Wortlaut:** „Can you style my id page a bit nicer and but everything into reusable components? Use a good architecture for that“
- **Zweck:** Die Session-Detailseite gestalten und ihre Darstellung in wiederverwendbare Base- und Session-Komponenten aufteilen.

### Eintrag 4

- **Tool:** Codex (OpenAI)
- **Prompt im Wortlaut:** „Make non-headlines sans and change that in the tokens too“
- **Zweck:** Die Typografie über die Design Tokens vereinheitlichen und für Fließtext eine Sans-Serif-Schrift verwenden.

### Eintrag 5

- **Tool:** Codex (OpenAI)
- **Prompt im Wortlaut:** „kannst du mir für die sessions ein composable erstellen was seine daten von useConferenceData bezieht?“
- **Zweck:** Eine Session-Domänenschicht erstellen, die den zentral geladenen Datensatz weiterverwendet und Beziehungen zu Track, Raum und Speakern auflöst.

## 2026-10-25

### Eintrag 6

- **Tool:** Codex (OpenAI)
- **Prompt im Wortlaut:** „why is typescript broken and shows \"Cannot find name 'useConferenceData'.ts(2304)\" yesterday it worked fine“
- **Zweck:** Den TypeScript-Fehler bei Nuxt-Auto-Imports untersuchen und die generierten Typdeklarationen wiederherstellen.

### Eintrag 7

- **Tool:** Codex (OpenAI)
- **Prompt im Wortlaut:** „lies dir das state management in \"03-state-management-konzept.md\" konzept durch und teil die conference data auf die unter composables auf, so dass es clean ist“
- **Zweck:** Die Composable-Struktur mit dem dokumentierten State-Management-Konzept abgleichen und fachliche Zuständigkeiten trennen.

### Eintrag 8

- **Tool:** Codex (OpenAI)
- **Prompt im Wortlaut:** „Kannst du mir genau erklären wie genau die jetzt zusammenspilen und wo verwendet werden? Ich verstehe noch nicht genau warum es jetzt ein useConferenceOverview gibt das stand doch nirgends“
- **Zweck:** Den Datenfluss zwischen den Composables nachvollziehen und eine nicht dokumentierte Abstraktion kritisch prüfen.

### Eintrag 9

- **Tool:** Codex (OpenAI)
- **Prompt im Wortlaut:** „Lies dir alle adrs durch und baue exact nur die composables mit ihren zuständigkeiten wie dort angegeben“
- **Zweck:** Die Implementierung exakt an die bestehenden Architekturentscheidungen anpassen und nicht vorgesehene Composables entfernen.

### Eintrag 10

- **Tool:** Codex (OpenAI)
- **Prompt im Wortlaut:** „Can you style my cards on the Session overview Page a mit more beauftiful? Like in the other session detail page“
- **Zweck:** Die Session-Karten der Programmübersicht visuell an die Detailseite angleichen und aufgelöste statt roher IDs anzeigen.

### Eintrag 11

- **Tool:** Codex (OpenAI)
- **Prompt im Wortlaut:** „Can you make my button bulletproof with colors? On the darf background card the text color is white but it should always stay dark like default“
- **Zweck:** Die Textfarbe des Link-Buttons in allen Zuständen fest auf den dunklen semantischen Farbtoken setzen.

### Eintrag 12

- **Tool:** Codex (OpenAI)
- **Prompt im Wortlaut:** „create session filter pls“
- **Zweck:** Die vorhandene Headless-Filterlogik mit einer bedienbaren Filterkomponente für Track, Tag und Level verbinden.

### Eintrag 13

- **Tool:** Codex (OpenAI)
- **Prompt im Wortlaut:** „can you unity the button system by making a base button visually so u just have to change one place and then making two sub buttons for link and for button functionality?“
- **Zweck:** Doppelte Button-Styles zentralisieren und getrennte Wrapper für Navigation und native Button-Aktionen erstellen.

### Eintrag 14

- **Tool:** Codex (OpenAI)
- **Prompt im Wortlaut:** „the nuxtlink doesnt work now“
- **Zweck:** Die Komponentenauflösung und Attributweitergabe des abstrahierten Nuxt-Link-Buttons korrigieren.

### Eintrag 15

- **Tool:** Codex (OpenAI)
- **Prompt im Wortlaut:** „when it comes to task A, about the arcitecture, we decided to make package B and E with CSR and C and D with SSR, our reasoning was that SSG is not useful cause the changes of the fake database should be instantly applied when they change in a conference site and not in two days, so its important changes from the database are visible immediately, and the B and E are both sites that require interaction on the site, while the other just display static data, pls formulate a nice ADR statement inside the existing, follow numbering, and just write the essentials, not too much like in the existing ones“
- **Zweck:** Die gemeinsame Rendering-Entscheidung für alle vier Anwendungsteile als ADR dokumentieren.

### Eintrag 16

- **Tool:** Codex (OpenAI)
- **Prompt im Wortlaut:** „Make it waaaay smaller and shorter pls, so you see the descicion on first glance“
- **Zweck:** Die Rendering-Entscheidungen übersichtlicher und schneller erfassbar darstellen.

### Eintrag 17

- **Tool:** Codex (OpenAI)
- **Prompt im Wortlaut:** „Neinnein, bitte nochmal von anfang, wie in angabe, bitte formuliere es doch etwas mehr aus für jede der 4 kriterien, aber der allgemeine erste punkt bitte lassen“
- **Zweck:** Den ADR wieder an das verlangte Schema Kontext, Optionen, Entscheidung und Konsequenzen anpassen, ohne die allgemeine Einleitung zu entfernen.

### Eintrag 18

- **Tool:** Codex (OpenAI)
- **Prompt im Wortlaut:** „Füge im Adr noch pro Paket den verantwortlichen hinzu Andrea B + C anderen markus.“
- **Zweck:** Die federführende Verantwortung für die vier ADR-Entscheidungspunkte dokumentieren.

### Eintrag 19

- **Tool:** Codex (OpenAI)
- **Prompt im Wortlaut:** „Jetzt erstelle mir aus diesem chat verlauf bitte ein AI log mit den ganzen anweiungen, im altbekannten stil“
- **Zweck:** Den Einsatz des AI-Tools für Schritt 2 transparent, chronologisch und gemäß Abgabeformat dokumentieren.
