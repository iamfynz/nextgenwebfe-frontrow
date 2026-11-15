# 04 — Verifikations-Nachweis

Stand: 2026-11-15 (Markus). Bezug: Szenarien i–iii in [03-entscheidungsprotokoll.md](03-entscheidungsprotokoll.md).
Umgebung: Chrome 157.0.8103.78 (arm64), macOS, Produktions-Build auf `http://localhost:3777`.

## Belege je Szenario

### Szenario i — Session-Übersicht offline

| Schritt | Beleg |
|---|---|
| Online geladen, Service Worker „activated and is running" | ![](assets/s1-01-online-sw-aktiv.png) |
| Offline neu geladen: 20 Ergebnisse | ![](assets/s1-02-offline-neu-geladen.png) |
| Filter offline: 4 Ergebnisse | ![](assets/s1-03-offline-filter.png) |
| Network-Tab im Offline-Modus | ![](assets/s1-04-offline-network.png) |

### Szenario ii — „Mein Programm" offline

| Schritt | Beleg |
|---|---|
| `/programm` online | ![](assets/s2-01-online-programm.png) |
| Zwei Sessions gemerkt | ![](assets/s2-02-online-gemerkt.png) |
| Offline neu geladen, Zustand bleibt | ![](assets/s2-03-offline-programm.png) |
| `/mein-programm` offline: 2 Sessions | ![](assets/s2-04-offline-mein-programm.png) |
| Eine entfernt, neu geladen: 1 Session | ![](assets/s2-05-offline-nach-entfernen.png) |
| Zweiter Durchlauf über die Startseite: Service Worker aktiv | ![](assets/s2b-01-startseite-sw-aktiv.png) |
| Per Klick ins Programm, gemerkt, offline neu geladen | ![](assets/s2b-02-offline-programm.png) |
| `/mein-programm` offline: 2 Sessions | ![](assets/s2b-03-offline-mein-programm.png) |

### Szenario iii — Erstbesuch offline

| Schritt | Beleg |
|---|---|
| Site-Daten gelöscht, Service Worker „deleted", Offline an | ![](assets/s3-01-ausgangslage-sw-geloescht.png) |
| Aufruf offline: Chrome-Seite „You're offline" | ![](assets/s3-02-erstbesuch-offline.png) |

### Installierbarkeit

| Was | Beleg |
|---|---|
| Einstellungen im Service-Workers-Panel | ![](assets/sw-einstellungen.png) |
| Manifest: Name, Farben, `standalone`, Warnungen | ![](assets/install-01-manifest.png) |
| Icons 192 und 512 | ![](assets/install-02-icons.png) |
| Installier-Symbol in der Adresszeile | ![](assets/install-03-adresszeile.png) |
| Installier-Dialog | ![](assets/install-04-dialog.png) |
| Installierte App im eigenen Fenster | ![](assets/install-05-app-fenster.png) |
| Lighthouse in Chrome 157: keine PWA-Kategorie | ![](assets/lighthouse-kategorien.png) |
| Lighthouse 11.7.1 (Kommandozeile), Kategorie PWA: alle 6 automatischen Prüfungen bestanden | ![](assets/lighthouse-11-pwa.png) |

## Einordnung

Getestet wurde der Produktions-Build von Hand in Chrome, weil der Service Worker erst beim Build entsteht. Offline geschaltet wurde in den DevTools, im Service-Workers-Panel und im Network-Tab. Der Network-Tab zeigt, was tatsächlich passiert: Die Netzversuche des Service Workers für Seite und Daten schlagen fehl, die Seite bekommt beides trotzdem mit Status 200 aus dem Service Worker. Das entspricht den Regeln Network First für Seiten und Stale While Revalidate für die Daten. Szenario i und ii sind erfüllt, inklusive Filter und Entfernen einer Session ohne Netz. Chrome bietet die Installation an, die App startet im eigenen Fenster ohne Adressleiste.

In Szenario iii lädt ohne Service Worker nichts von FrontRow; Chrome zeigt seine eigene Offline-Seite.

Lücken: Szenario iii lief auf einem Rechner, auf dem die App noch installiert war, deshalb „You're offline" statt der üblichen Fehlerseite. Das Lighthouse-Audit lief mit der alten Version 11.7.1, weil Chrome 157 die PWA-Kategorie nicht mehr anbietet; es besteht alle sechs automatischen Prüfungen. Das Manifest hat Warnungen: `purpose: "any maskable"` wird nicht empfohlen, und für den erweiterten Installier-Dialog fehlen Screenshots. Getestet wurde nur Chrome auf macOS gegen `localhost`, kein Handy, kein Safari, kein HTTPS. Andreas Durchlauf steht aus.
