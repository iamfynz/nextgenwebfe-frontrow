
# ADR 3: Filtering-Logik in Composables

## Kontext

Sessions sollen nach verschiedenen Kriterien gefiltert werden können. Die Filterdarstellung kann sich zwischen Desktop und mobilen Geräten unterscheiden, während die Regeln gleich bleiben.

## Optionen

- **Logik direkt in der Filterkomponente:** Einfacher Einstieg, aber eng an die Darstellung gebunden.
- **Logik in einem Composable:** Filterregeln und Darstellung bleiben getrennt. Mehrere Ansichten können dieselbe Logik verwenden.

## Entscheidung

Wir verwenden ein Composable namens `useSessionFilters`. Es verwaltet die Filterwerte und berechnet die gefilterten Sessions. Die Komponenten übernehmen die Darstellung und geben Benutzeraktionen an das Composable weiter.

## Konsequenzen

Die Darstellung kann verändert werden, ohne die Filterregeln neu zu schreiben. Die Logik ist wiederverwendbar und unabhängig prüfbar. Zusammengehörige Filter- und Ergebnisansichten müssen dieselbe Composable-Instanz verwenden, damit ihr Zustand synchron bleibt.

