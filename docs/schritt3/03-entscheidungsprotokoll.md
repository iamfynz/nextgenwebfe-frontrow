# 03 — Entscheidungsprotokoll: Offline und Caching

Stand: 2026-11-14, Entwurf (Markus). Offen: Abstimmung mit Andrea, beide Testdurchläufe.
Begründung je Datentyp: [02-offline-strategie-konzept.md](02-offline-strategie-konzept.md). Umsetzung: `app/service-worker/sw.ts`.

## Kontext

FrontRow wird auf der Konferenz bei überlastetem WLAN und im Flugmodus zwischen zwei Sessions benutzt. Aus Schritt 2 sind `/programm` und `/mein-programm` clientseitig gerendert, alle anderen Seiten serverseitig; sämtliche Programmdaten kommen aus `/api/conference-data`. Die erste Fassung des Service Workers (PR #4) war handgeschrieben: Cache First für `/` und `/mein-programm` sowie für Assets beim ersten Abruf, Stale While Revalidate für die Daten. Ein Offline-Test zeigte zwei Lücken: `/programm` neu geladen ergab die Browser-Fehlerseite, und „Mein Programm" zeigte nach Einstieg über die Startseite keine gemerkten Sessions, weil die Daten aus dem SSR-Payload kamen und nie im Cache lagen.

## Optionen

**Werkzeug.** (a) Handgeschriebener Service Worker: keine Abhängigkeit, aber Precache-Liste, Cache-Aufräumen und Strategien müssen selbst gepflegt werden. (b) Workbox mit generiertem Worker (`generateSW`): wenig Code, Regeln stehen aber nur in der Konfiguration. (c) Workbox mit eigenem Quelltext (`buildSW`): Regeln bleiben lesbar, Workbox liefert die Precache-Liste.

**Programmdaten.** Cache First (schnell, aber Raumänderungen kommen nie an), Network First (aktuell, aber langsam bei schlechtem Netz), Stale While Revalidate (schnell, eine Ladung verzögert aktuell).

**Seiten (HTML).** Cache First (friert den Datenstand im SSR-HTML ein), Network First mit Zeitlimit, Stale While Revalidate.

**Nie besuchte Seiten offline.** Browser-Fehlerseite, eigene `/offline.html`, oder die leere CSR-Shell als Rückfall.

## Entscheidung

1. Workbox über `@vite-pwa/nuxt` mit eigenem Quelltext (Option c).
2. Statische Assets: Precache, also Cache First ab der Installation.
3. Programmdaten: Stale While Revalidate, zusätzlich bei der Installation vorgeladen.
4. Seiten: Network First mit 3 Sekunden Zeitlimit, danach Cache, danach die CSR-Shell.
5. Google Fonts: Cache First für Font-Dateien, Stale While Revalidate für das Stylesheet.

## Konsequenzen

- Nach einem einzigen Online-Besuch sind alle Routen offline erreichbar, auch nie geöffnete Detailseiten.
- Eine Raumänderung ist erst beim zweiten Laden nach der Änderung sichtbar; offline bleibt der letzte Stand ohne Hinweis stehen.
- Bei sehr langsamem Netz wartet ein Seitenaufruf bis zu 3 Sekunden, bevor der Cache antwortet.
- Zwei zusätzliche Build-Abhängigkeiten; der Service Worker existiert nur im Build, nicht im Dev-Server.
- Schriften fehlen offline, wenn die App erst einmal geladen wurde.

## Testszenarien

Testumgebung je Person: `npm run build`, `node .output/server/index.mjs`, Chrome, DevTools → Network → „Offline". Vor jedem Szenario: Application → Storage → „Clear site data".

### Szenario i — Programm online geladen, dann Flugmodus, Session-Übersicht erneut geöffnet

- **Ausgangslage:** Frisches Profil. `/programm` einmal online geladen, Service Worker ist aktiv.
- **Aktion:** Offline schalten, `/programm` neu laden.
- **Erwartung laut Regeln:** Seite kommt aus `frontrow-pages`, die 20 Sessions aus `frontrow-data`, Filter funktionieren.
- **Beobachtet (Markus):** _noch einzutragen_
- **Beobachtet (Andrea):** _noch einzutragen_
- **Ergebnis:** _noch einzutragen_

### Szenario ii — „Mein Programm" offline, nachdem Sessions hinzugefügt wurden

- **Ausgangslage:** Frisches Profil. Startseite online geöffnet, per Klick ins Programm, zwei Sessions gemerkt.
- **Aktion:** Offline schalten, `/mein-programm` direkt aufrufen bzw. neu laden.
- **Erwartung laut Regeln:** App-Shell aus `frontrow-pages`, IDs aus dem `localStorage`, Auflösung über `frontrow-data`; beide Sessions erscheinen, Entfernen funktioniert.
- **Beobachtet (Markus):** _noch einzutragen_
- **Beobachtet (Andrea):** _noch einzutragen_
- **Ergebnis:** _noch einzutragen_

### Szenario iii — Erstbesuch im Offline-Zustand (Grenzfall)

- **Ausgangslage:** Frisches Profil, App nie geöffnet, kein Service Worker installiert.
- **Aktion:** Offline schalten, `/` aufrufen.
- **Erwartung laut Regeln:** Browser-Fehlerseite. Ohne ersten Online-Kontakt gibt es weder Service Worker noch Cache; das kann eine Web-App nicht verhindern. Akzeptabel, weil die App vor der Konferenz (Ticket-Mail, Website) mindestens einmal online geöffnet wird.
- **Beobachtet (Markus):** _noch einzutragen_
- **Beobachtet (Andrea):** _noch einzutragen_
- **Ergebnis:** _noch einzutragen_
