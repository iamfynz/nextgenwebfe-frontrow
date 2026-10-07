
# ADR 2: Verwendung von Nuxt

## Kontext

Die Plattform benötigt mehrere Seiten, beispielsweise eine Programmübersicht, Sessiondetails und das persönliche Programm. Dafür brauchen wir eine gemeinsame Projektstruktur und Routing.

## Optionen

- **Vue mit Vite und Vue Router:** Flexible Basis, bei der Routing und Projektkonventionen selbst eingerichtet werden.
- **Nuxt:** Liefert gemeinsame Konventionen für Seiten, Layouts und Composables sowie dateibasiertes Routing.

## Entscheidung

Wir haben uns für Nuxt entschieden, weil es die Organisation unserer mehrseitigen Plattform erleichtert. Außerdem bietet es eine Grundlage für die spätere Umsetzung von SSG. Die konkrete Rendering-Strategie wird erst im nächsten Projektschritt festgelegt.

## Konsequenzen

Das Team arbeitet mit einer einheitlichen Struktur und muss weniger grundlegende Infrastruktur selbst aufbauen. Dafür müssen wir uns mit den Nuxt-Konventionen vertraut machen. Nuxt ist in der Angabe eine mögliche Technologie, keine verpflichtende Vorgabe.

