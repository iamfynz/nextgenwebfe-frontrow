# Event-Plattform "Frontrow"
## Markenkonzept und Design-Tokens
> Aktualisiert: 2026-11-01 auf den Stand nach Schritt 2 (Inter für Fließtext, Token-Anpassungen)

Unser Team heißt Frontrow. Wir entwickeln eine Plattform für die Konferenz FrontendNow, auf der Besucher passende Sessions finden und ihr persönliches Programm zusammenstellen können. Die Website soll frisch und dynamisch wirken, aber trotzdem einfach zu bedienen sein. Statt viele Informationen gleichzeitig anzuzeigen, wollen wir die wichtigsten Inhalte klar darstellen. Die Gestaltung soll beim Orientieren helfen und nicht vom eigentlichen Programm ablenken.  
Unsere Farbpalette besteht aus Dunkelgrün, Blau, Mint, Lime, Rosa, Rot und Creme. Creme verwenden wir als Hintergrund, weil es ruhiger und etwas wärmer wirkt als reines Weiß. Dunkelgrün ist hauptsächlich für Texte vorgesehen. Lime hebt wichtige Aktionen hervor, beispielsweise das Hinzufügen einer Session zum eigenen Programm. Mint verwenden wir für Inhaltsflächen, Blau und Rosa für weitere Akzente. Rot bekommt mit Warnungen einen eigenen Verwendungszweck. Warnungen sollen zusätzlich beschriftet sein, damit ihre Bedeutung nicht nur von der Farbe abhängt.  
Für Überschriften verwenden wir „Science Gothic“. Sie passt zum technischen Thema der Konferenz und gibt der Website einen eigenen Charakter. Fließtext und Bedienelemente verwenden „Inter“, da die neutrale Sans-Serif-Schrift auch in längeren Texten und kleinen Beschriftungen gut lesbar bleibt. Die Trennung ist über `--font-heading` und `--font-body` semantisch abgebildet. Die Schriftgrößen reichen von 14 bis 48 Pixeln bei einer Basisgröße von 16 Pixeln. Dadurch können wir kleinere Zusatzinformationen, normale Texte und größere Überschriften unterscheiden.
## Aufbau der Tokens
Das Token-Set ist in primitive und semantische Tokens aufgeteilt. Primitive Tokens enthalten konkrete Werte, beispielsweise Farbcodes, Abstände oder Schriftgrößen. Semantische Tokens beschreiben, wofür diese Werte verwendet werden. Beispielsweise enthält --primitive-color-cream den Farbwert, während --color-background diesen Wert als Hintergrund festlegt. Diese Aufteilung verwenden wir auch für Fonts, Spaces, Radien und Schriftgrößen.
### Wartbarkeit
Ein wichtiges Kriterium ist die Wartbarkeit. Wenn wir eine Farbe ändern, müssen wir nur den primitiven Token anpassen. Alle Verwendungen, die darauf verweisen, übernehmen den neuen Wert. Wir müssen dadurch nicht in jeder Komponente nach einzelnen Farbcodes suchen. Semantische Namen machen außerdem verständlicher, welche Aufgabe ein Wert hat. Bei --space-card erkennt man beispielsweise direkt, dass der Abstand für Karten vorgesehen ist.
### Theming-Erweiterbarkeit
Die Trennung erleichtert auch einen späteren Theme-Wechsel. Komponenten verwenden die semantischen Tokens, während das Theme deren Zuordnung festlegt. Im vorhandenen Dark-Mode-Selektor werden Hintergrund und primäre Textfarbe geändert. Die Namen bleiben gleich, deshalb müssen die Komponenten dafür nicht umgebaut werden.
Für Texte auf hellen Farbflächen gibt es zusätzlich --color-text-on-color. Dieser bleibt dunkelgrün, auch wenn der normale Text im Dark Mode cremefarben wird. Die jeweiligen Text-Hintergrund-Paare müssen trotzdem auf ausreichenden Kontrast geprüft werden.
### Konsistenz
Das dritte Kriterium ist Konsistenz. Gemeinsame Skalen verhindern, dass jede Komponente eigene Abstände, Rundungen und Schriftgrößen bekommt. Kleine Spaces sind für Elemente innerhalb einer Gruppe gedacht, größere für Karten und Seitenabschnitte. Die drei Radien unterscheiden Eingabefelder, Karten und Buttons.
Vorerst beschränken wir uns auf diese grundlegenden Kategorien. Dadurch bleibt das Set für beide Teammitglieder übersichtlich. Weitere Tokens können wir ergänzen, wenn sie bei der Umsetzung tatsächlich gebraucht werden.

Seit Schritt 2 verweist `--spacing-section-margin` auf `--primitive-space-1` (0,25 rem) statt auf `--primitive-space-2`. Der engere Abstand trennt unmittelbar zusammengehörige Inhalte, ohne einen neuen primitiven Wert einzuführen. Außerdem wurde der Karten- und Footer-Hintergrund `--primitive-color-cream-600` auf `#f4f2ee` angepasst. Der etwas dunklere Creme-Ton hebt Flächen vom Seitenhintergrund ab; die semantischen Zuordnungen und das Token-System bleiben unverändert.
## Kontrastprüfung (WCAG 2.1 AA)

Ergebnis des Cross-Reviews (Markus V., 2026-10-10), Werte mit dem WebAIM Contrast Checker nachgerechnet. Grenzwert: 4,5:1 für Normaltext, 3:1 für Großtext.

| Text / Hintergrund (Light) | Ratio | AA |
|---|---|---|
| text-primary / background | 14,95:1 | ✓ |
| text-primary / background-card | 13,97:1 | ✓ |
| text-primary / surface (Mint) | 12,70:1 | ✓ |
| text-primary / primary (Lime) | 12,83:1 | ✓ |
| text-primary / secondary (Blau) | 6,44:1 | ✓ |
| text-primary / tertiary (Rosa) | 11,81:1 | ✓ |
| text-contrast-primary / background-contrast | 14,95:1 | ✓ |
| text-contrast-light / background-contrast | 11,88:1 | ✓ |
| text-color (Lime) / background-contrast | 12,83:1 | ✓ |
| warning / background | 4,75:1 | ✓ |
| text-light / background | 3,82:1 | nur Großtext |
| text-light / background-card | 3,57:1 | nur Großtext |

Alle Paare des Dark-Themes liegen über 7:1.

Befund: `text-light` erreicht nur AA für Großtext, wird im Grundgerüst aber für kleine Beschriftungen verwendet. Lime ist als Textfarbe nur auf Dunkelgrün zulässig (auf Creme 1,17:1). Beides wird in Schritt 2 behoben, entweder durch `green-300` (#3D5A59) als `text-light` oder durch Beschränkung auf Großtext.
