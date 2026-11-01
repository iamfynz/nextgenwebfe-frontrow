import type { ConferenceData } from '../../app/types/conference'

/**
 * Liefert den geteilten Datensatz und liest ihn bei JEDEM Request von der Platte
 * (Nitro-Storage „data", fs-Treiber auf ./public/data, siehe nuxt.config.ts).
 *
 * Das ist unsere SSR-Simulation aus der Rendering-ADR (Schritt 2): Ändert sich die Datei
 * bei laufendem Server, zeigt der nächste Aufruf einer SSR-Seite den neuen Stand, ohne Build.
 * Ein Build-Zeit-Import würde SSR auf denselben Stand wie SSG festnageln.
 */
export default defineEventHandler(async () => {
  const data = await useStorage('data').getItem<ConferenceData>('conference-data.json')

  if (!data || !Array.isArray(data.sessions)) {
    throw createError({ statusCode: 503, statusMessage: 'Konferenzdaten nicht verfügbar' })
  }

  return data
})
