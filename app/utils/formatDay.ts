/** Formatiert einen ISO-Tag (YYYY-MM-DD) für die Anzeige, immer in der Konferenz-Zeitzone. */
export function formatDay(isoDay: string, style: 'short' | 'long' = 'short') {
  return new Intl.DateTimeFormat('de-AT', {
    weekday: style,
    day: '2-digit',
    month: style === 'long' ? 'long' : '2-digit',
    year: style === 'long' ? 'numeric' : undefined,
    timeZone: 'Europe/Vienna',
  }).format(new Date(`${isoDay}T12:00:00`))
}
