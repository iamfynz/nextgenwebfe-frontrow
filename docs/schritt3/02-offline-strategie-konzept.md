# 02 — Offline-Strategie: Konzept

Stand: 2026-11-14. Umsetzung: `app/service-worker/sw.ts`.

## Nutzungssituation

FrontRow wird im Vortragssaal benutzt: Hunderte Geräte teilen sich ein Konferenz-WLAN, zwischen zwei Sessions ist das Handy oft im Flugmodus. Wer in fünf Minuten den nächsten Raum finden muss, wartet nicht auf einen Ladebalken. Die App muss also nach einem einzigen Online-Besuch ohne Netz starten und das Programm zeigen.

## Entscheidung je Datentyp

| Datentyp | Strategie | Cache |
|---|---|---|
| Statische Assets (Nuxt-Bundles, Token-CSS, Icons, Manifest) | Precache, Cache First | `workbox-precache` |
| Schriften (Google Fonts) | Cache First (Dateien), Stale While Revalidate (Stylesheet) | `frontrow-fonts-*` |
| Sessions-/Speaker-Daten (`/api/conference-data`) | Stale While Revalidate, bei Installation vorgeladen | `frontrow-data` |
| Seiten (HTML) inkl. App-Shell für „Mein Programm" | Network First mit 3 s Zeitlimit, sonst Cache, sonst App-Shell | `frontrow-pages` |

**Statische Assets: Cache First.** Die Build-Dateien tragen einen Hash im Namen und ändern sich nie unter derselben URL. Ein Netz-Request bringt deshalb nichts außer Wartezeit. Workbox legt sie schon bei der Installation vollständig ab, nicht erst beim ersten Abruf.

**Programmdaten: Stale While Revalidate statt Cache First.** Cache First würde reichen, wenn das Programm nach der Veröffentlichung wirklich eingefroren wäre. Auf Konferenzen passiert aber genau das Gegenteil im ungünstigsten Moment: Ein Raum wird am Vormittag getauscht, ein Vortrag verschiebt sich. Mit Cache First bliebe der alte Raum auf dem Gerät stehen, bis ein neuer Service Worker ausgerollt wird. Stale While Revalidate antwortet genauso schnell aus dem Cache, holt aber bei jeder Gelegenheit im Hintergrund den aktuellen Stand. Der Preis: Eine Änderung ist erst beim nächsten Laden sichtbar, nicht sofort.

**„Mein Programm".** Die gemerkten Session-IDs liegen bereits im `localStorage`. Offen war, ob die Seite ohne Netz überhaupt erreichbar ist und die IDs auflösen kann. Beides hängt an zwei Dingen: Die App-Shell liegt ab der Installation im Seiten-Cache, und die Programmdaten werden bei der Installation vorgeladen. Ohne das Vorladen blieb die Liste leer, wenn der Einstieg über die servergerenderte Startseite lief.

**Seiten: Network First mit Zeitlimit.** Das HTML der SSR-Seiten enthält den Datenstand. Cache First würde ihn einfrieren. Antwortet das Netz nicht binnen drei Sekunden, kommt die zuletzt gesehene Fassung. Für nie besuchte Seiten dient die leere CSR-Shell als Rückfall, die jede Route im Browser rendert.

## Schlimmster Fall: Verbindungsabbruch mitten in der Nutzung

Klicks innerhalb der App brauchen kein Netz, weil Bundles und Daten lokal liegen. Merken und Entfernen von Sessions funktioniert weiter, da es nur den `localStorage` betrifft. Verloren geht allein die Aktualität: Eine Raumänderung nach dem letzten Online-Moment erreicht das Gerät erst wieder mit Netz. Das zeigt die App derzeit nicht an.

## Bekannte Lücken

- Erstbesuch ohne Netz: Browser-Fehlerseite, es gibt noch keinen Service Worker.
- Schriften fehlen offline, wenn die App erst einmal geladen wurde.
- Kein Hinweis „offline, Stand von …" in der Oberfläche.
