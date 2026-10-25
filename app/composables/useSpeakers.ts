import type { SpeakerDetails } from '~/types/conference'

/**
 * Domänenschicht für Speaker.
 * Löst die Session-IDs aus dem zentral geladenen Konferenzdatensatz auf.
 */
export async function useSpeakers() {
  const {
    speakers,
    sessionsForSpeaker,
    status,
    error,
    refresh,
  } = await useConferenceData()

  const speakerDetails = computed<SpeakerDetails[]>(() =>
    speakers.value.map(speaker => ({
      ...speaker,
      sessions: sessionsForSpeaker(speaker),
    })),
  )

  const speakerDetailsById = computed(() =>
    new Map(speakerDetails.value.map(speaker => [speaker.id, speaker])),
  )

  const getSpeaker = (id: string) => speakerDetailsById.value.get(id)

  return {
    speakers: speakerDetails,
    getSpeaker,
    status,
    error,
    refresh,
  }
}
