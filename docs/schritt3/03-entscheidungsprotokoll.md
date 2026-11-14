# 03 — Entscheidungsprotokoll: Offline und Caching

Stand: 2026-11-15, Entwurf (Markus). Offen: Abstimmung mit Andrea, Andreas Testdurchlauf.
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
- Schriften können offline fehlen, wenn die App erst einmal geladen wurde: Der Service Worker cacht sie erst ab dem zweiten Aufruf. In Markus' Durchlauf kamen sie aus dem Disk-Cache des Browsers.

## Testszenarien

Testumgebung je Person: `npm run build`, `node .output/server/index.mjs`, Chrome, DevTools → Network → „Offline". Vor jedem Szenario: Application → Storage → „Clear site data".

Markus' Durchlauf: 2026-11-15, Chrome 157.0.8103.78 (arm64) auf macOS, Build auf `http://localhost:3777`. „Update on reload" und „Bypass for network" waren aus ([Beleg](assets/sw-einstellungen.png)). Offline geschaltet wurde über „Offline" im Service-Workers-Panel und im Network-Tab. Alle Belege und ihre Einordnung: [04-verifikations-nachweis.md](04-verifikations-nachweis.md).

### Szenario i — Programm online geladen, dann Flugmodus, Session-Übersicht erneut geöffnet

- **Ausgangslage:** Frisches Profil. `/programm` einmal online geladen, Service Worker ist aktiv.
- **Aktion:** Offline schalten, `/programm` neu laden.
- **Erwartung laut Regeln:** Seite kommt aus `frontrow-pages`, die 20 Sessions aus `frontrow-data`, Filter funktionieren.
- **Beobachtet (Markus, 2026-11-15):** Online lädt `/programm` mit 20 Ergebnissen, der Service Worker steht auf „activated and is running". Nach dem Umschalten auf Offline und Neuladen erscheint die Seite vollständig, wieder mit 20 Ergebnissen und in den richtigen Schriften. Der Track-Filter „Frontend Architecture & Patterns" reduziert die Liste offline auf 4 Ergebnisse. Im Network-Tab sind zwei Zeilen rot: die Netzversuche des Service Workers für `programm` und `conference-data`. Die Seite selbst bekommt `conference-data` mit Status 200 aus dem Service Worker, das Font-Stylesheet kommt aus dem Disk-Cache. Belege: [online](assets/s1-01-online-sw-aktiv.png), [offline neu geladen](assets/s1-02-offline-neu-geladen.png), [Filter](assets/s1-03-offline-filter.png), [Network-Tab](assets/s1-04-offline-network.png).
- **Beobachtet (Andrea):** _noch einzutragen_
- **Ergebnis:** Erfüllt. Andreas Durchlauf steht noch aus.

### Szenario ii — „Mein Programm" offline, nachdem Sessions hinzugefügt wurden

- **Ausgangslage:** Site-Daten gelöscht. Zwei Durchläufe: (a) `/programm` direkt online geöffnet, zwei Sessions gemerkt. (b) Startseite online geladen, per Klick ins Programm, zwei Sessions gemerkt. In (b) ruft der Browser `/api/conference-data` nicht selbst ab; das ist der Ablauf, der mit dem ersten Service Worker scheiterte.
- **Aktion:** Offline schalten, `/mein-programm` direkt aufrufen bzw. neu laden.
- **Erwartung laut Regeln:** App-Shell aus `frontrow-pages`, IDs aus dem `localStorage`, Auflösung über `frontrow-data`; beide Sessions erscheinen, Entfernen funktioniert.
- **Beobachtet (Markus, 2026-11-15):** Durchlauf (a): Online im Programm zwei Sessions gemerkt („Die Zukunft der Web-Frontends", „Headless Components in der Praxis"), beide Buttons zeigen „Gemerkt". Offline bleibt der Zustand auf `/programm` nach dem Neuladen erhalten. `/mein-programm` lädt offline und zeigt „2 Sessions gemerkt" mit beiden Karten samt Zeit, Raum, Level und Speaker. Im Network-Tab schlagen nur die Netzversuche des Service Workers fehl, die Daten kommen aus dem Service Worker. Eine Session offline entfernt und neu geladen: „1 Session gemerkt". Belege: [online](assets/s2-01-online-programm.png), [gemerkt](assets/s2-02-online-gemerkt.png), [offline Programm](assets/s2-03-offline-programm.png), [offline Mein Programm](assets/s2-04-offline-mein-programm.png), [nach Entfernen](assets/s2-05-offline-nach-entfernen.png). Durchlauf (b): Nach dem Neuladen der Startseite ist der Service Worker aktiv. Offline lädt `/programm` neu, obwohl die Seite nie als Dokument online geladen wurde, mit 20 Ergebnissen und Zähler 2 im Header. `/mein-programm` zeigt offline „2 Sessions gemerkt" mit beiden Karten; die Daten kommen aus dem Service Worker. Vom Online-Teil vor dem Umschalten gibt es keinen Screenshot. Belege: [Startseite](assets/s2b-01-startseite-sw-aktiv.png), [offline Programm](assets/s2b-02-offline-programm.png), [offline Mein Programm](assets/s2b-03-offline-mein-programm.png).
- **Beobachtet (Andrea):** _noch einzutragen_
- **Ergebnis:** Erfüllt in beiden Abläufen. Andreas Durchlauf steht noch aus.

### Szenario iii — Erstbesuch im Offline-Zustand (Grenzfall)

- **Ausgangslage:** Frisches Profil, App nie geöffnet, kein Service Worker installiert.
- **Aktion:** Offline schalten, `/` aufrufen.
- **Erwartung laut Regeln:** Browser-Fehlerseite. Ohne ersten Online-Kontakt gibt es weder Service Worker noch Cache; das kann eine Web-App nicht verhindern. Akzeptabel, weil die App vor der Konferenz (Ticket-Mail, Website) mindestens einmal online geöffnet wird.
- **Beobachtet (Markus, 2026-11-15):** Ein erster Versuch war ungültig: Die App war noch in einem zweiten Tab offen, nach „Clear site data" installierte sich sofort ein neuer Service Worker und die Startseite lud offline. Wiederholung: Site-Daten gelöscht, der Service Worker steht auf „deleted" und „redundant", dann offline `http://localhost:3777/` aufgerufen. Von FrontRow lädt nichts. Chrome zeigt seine eingebaute Seite „You're offline" mit dem App-Icon, weil die App auf diesem Rechner noch installiert war. Ohne Installation wäre es die übliche Fehlerseite `ERR_INTERNET_DISCONNECTED`; das wurde nicht eigens getestet. Belege: [Ausgangslage](assets/s3-01-ausgangslage-sw-geloescht.png), [Aufruf offline](assets/s3-02-erstbesuch-offline.png).
- **Beobachtet (Andrea):** _noch einzutragen_
- **Ergebnis:** Wie erwartet nicht nutzbar. Wir akzeptieren das als Grenzfall, weil auch eine eigene Offline-Seite erst einmal geladen werden müsste. Andreas Durchlauf steht noch aus.
