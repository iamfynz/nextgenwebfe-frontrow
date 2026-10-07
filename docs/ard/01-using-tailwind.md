# ADR 1: Verwendung von Tailwind CSS

## Kontext

Wir benötigen eine einfache Möglichkeit, die Oberfläche schnell und konsistent zu gestalten. Farben, Abstände, Schriftgrößen und Radien sollen auf unseren Design-Tokens basieren.

## Optionen

- **Klassisches CSS/SCSS:** Eigene Klassen bieten viel Kontrolle, erfordern aber zusätzliche Namenskonventionen und können wiederholte Regeln erzeugen.
- **Tailwind CSS:** Utility-Klassen ermöglichen die direkte Gestaltung in Komponenten und lassen sich mit unseren Tokens verbinden.

## Entscheidung

Wir verwenden Tailwind CSS, weil es die Umsetzung für unser Team vereinfacht. Wiederkehrende Gestaltung wird in UI-Komponenten zusammengefasst. Unsere Design-Tokens bleiben die zentrale Grundlage für die verwendeten Werte.

## Konsequenzen

Wir können Komponenten schnell gestalten und gemeinsame Werte konsequent verwenden. Umfangreiche Klassenlisten können die Templates unübersichtlich machen. Wiederholte Muster werden deshalb in Komponenten gebündelt.

