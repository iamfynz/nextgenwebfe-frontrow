import type { Room, Session, Speaker, Track } from '~/types/conference'

export interface SessionDetails extends Session {
  track?: Track
  room?: Room
  speakers: Speaker[]
}

/**
 * Domänenschicht für Sessions.
 * Bezieht die Rohdaten ausschließlich aus useConferenceData und stellt
 * fertig verknüpfte Session-Daten für Seiten und Komponenten bereit.
 */
export async function useSessions() {
  const {
    sessions,
    getTrack,
    getRoom,
    speakersForSession,
    status,
    error,
    refresh,
  } = await useConferenceData()

  const sessionDetails = computed<SessionDetails[]>(() =>
    sessions.value.map(session => ({
      ...session,
      track: getTrack(session.trackId),
      room: getRoom(session.roomId),
      speakers: speakersForSession(session),
    })),
  )

  const sessionDetailsById = computed(() =>
    new Map(sessionDetails.value.map(session => [session.id, session])),
  )

  const getSession = (id: string) => sessionDetailsById.value.get(id)

  return {
    sessions: sessionDetails,
    getSession,
    status,
    error,
    refresh,
  }
}
