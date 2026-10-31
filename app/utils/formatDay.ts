/**
 * Einzige Stelle, die Konferenztage formatiert (Locale de-AT, Zeitzone der Konferenz).
 * Drei Stile, einmalig erzeugte Formatter:
 *   short  → „Di., 15.09."                 (Karten, Listen)
 *   medium → „Dienstag, 15.09."            (Filter-Optionen)
 *   long   → „Dienstag, 15. September 2026" (Detailseiten, Tagesüberschriften)
 */
export type DayStyle = 'short' | 'medium' | 'long'

const TIME_ZONE = 'Europe/Vienna'

const formatters: Record<DayStyle, Intl.DateTimeFormat> = {
  short: new Intl.DateTimeFormat('de-AT', { weekday: 'short', day: '2-digit', month: '2-digit', timeZone: TIME_ZONE }),
  medium: new Intl.DateTimeFormat('de-AT', { weekday: 'long', day: '2-digit', month: '2-digit', timeZone: TIME_ZONE }),
  long: new Intl.DateTimeFormat('de-AT', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric', timeZone: TIME_ZONE }),
}

/** Formatiert einen ISO-Tag (YYYY-MM-DD) für die Anzeige. */
export function formatDay(isoDay: string, style: DayStyle = 'short') {
  return formatters[style].format(new Date(`${isoDay}T12:00:00`))
}
