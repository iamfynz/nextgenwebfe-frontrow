import { computed, ref, toValue } from 'vue'
import type { MaybeRefOrGetter } from 'vue'
import type { SessionDetails, SessionLevel } from '~/types/conference'

/**
 * Headless Filterlogik für Session-Listen.
 * Alle gesetzten Filter werden mit UND verknüpft; Darstellung und DOM bleiben
 * vollständig in der verwendenden Komponente.
 */
export function useSessionFilter(sessions: MaybeRefOrGetter<readonly SessionDetails[]>) {
  const trackId = ref<string | null>(null)
  const day = ref<string | null>(null)
  const level = ref<SessionLevel | null>(null)

  const filteredSessions = computed(() =>
    toValue(sessions).filter(session =>
      (!trackId.value || session.trackId === trackId.value)
      && (!day.value || session.day === day.value)
      && (!level.value || session.level === level.value),
    ),
  )

  const availableTracks = computed(() => {
    const tracks = toValue(sessions)
      .map(session => session.track)
      .filter(track => track !== undefined)

    return [...new Map(tracks.map(track => [track.id, track])).values()]
  })

  const availableDays = computed(() =>
    [...new Set(toValue(sessions).map(session => session.day))].sort(),
  )

  const availableLevels = computed<SessionLevel[]>(() =>
    [...new Set(toValue(sessions).map(session => session.level))],
  )

  const hasActiveFilters = computed(() =>
    Boolean(trackId.value || day.value || level.value),
  )

  function resetFilters() {
    trackId.value = null
    day.value = null
    level.value = null
  }

  return {
    trackId,
    day,
    level,
    filteredSessions,
    availableTracks,
    availableDays,
    availableLevels,
    hasActiveFilters,
    resetFilters,
  }
}
