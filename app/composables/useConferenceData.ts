import type { ConferenceData, Session, Speaker } from '~/types/conference'

const DATA_URL = '/data/conference-data.json'
const ASYNC_KEY = 'conference-data'

/**
 * Einzige Stelle, die weiß, WOHER die Daten kommen (hier austauschbar: GitHub-Raw-URL, Nitro-Route …).
 * Server/Prerender: direkter Import der Datei (ein relativer $fetch landet in Dev beim Vue-Router statt
 * beim statischen Asset). Client: HTTP-Fetch desselben Assets aus /public — später vom Service Worker cachebar.
 */
async function loadConferenceData(): Promise<ConferenceData> {
  if (import.meta.server) {
    const mod = await import('~~/public/data/conference-data.json')
    return mod.default as ConferenceData
  }
  return $fetch<ConferenceData>(DATA_URL)
}

/**
 * Lädt den geteilten, schreibgeschützten Datensatz genau einmal und stellt ihn
 * reaktiv inkl. ID-Lookups und Joins bereit.
 *
 * - `useAsyncData` mit festem Key: Nuxt dedupliziert parallele Aufrufe aus mehreren
 *   Komponenten, überträgt das Ergebnis vom Server in den Client-Payload (kein Doppel-Fetch)
 *   und cached es bei Client-Navigation.
 * - Muss in `<script setup>` mit `await` aufgerufen werden, damit SSR/SSG die Daten
 *   bereits im HTML rendern.
 * - Datenschicht: laden, indizieren, joinen. Domänenlogik (Sortierung, Gruppierung, Filter)
 *   gehört in Domänen-Composables, die hierauf aufbauen (ab Schritt 2: useSessionFilter, useMyProgram, …).
 *   Nur diese Datei ruft useAsyncData für den Datensatz auf.
 */
export async function useConferenceData() {
  const { data, status, error, refresh } = await useAsyncData<ConferenceData>(ASYNC_KEY, loadConferenceData)

  const conference = computed(() => data.value?.conference ?? null)
  const sessions = computed(() => data.value?.sessions ?? [])
  const speakers = computed(() => data.value?.speakers ?? [])
  const tracks = computed(() => data.value?.tracks ?? [])
  const rooms = computed(() => data.value?.rooms ?? [])

  // Indizes für O(1)-Lookups; werden nur neu gebaut, wenn sich der Datensatz ändert.
  const sessionById = computed(() => new Map(sessions.value.map(s => [s.id, s])))
  const speakerById = computed(() => new Map(speakers.value.map(s => [s.id, s])))
  const trackById = computed(() => new Map(tracks.value.map(t => [t.id, t])))
  const roomById = computed(() => new Map(rooms.value.map(r => [r.id, r])))

  const getSession = (id: string) => sessionById.value.get(id)
  const getSpeaker = (id: string) => speakerById.value.get(id)
  const getTrack = (id: string) => trackById.value.get(id)
  const getRoom = (id: string) => roomById.value.get(id)

  const speakersForSession = (session: Session): Speaker[] =>
    session.speakerIds.map(getSpeaker).filter((s): s is Speaker => Boolean(s))

  const sessionsForSpeaker = (speaker: Speaker): Session[] =>
    speaker.sessionIds.map(getSession).filter((s): s is Session => Boolean(s))

  return {
    conference,
    sessions,
    speakers,
    tracks,
    rooms,
    getSession,
    getSpeaker,
    getTrack,
    getRoom,
    speakersForSession,
    sessionsForSpeaker,
    status,
    error,
    refresh,
  }
}
