import type { MaybeRefOrGetter } from 'vue'
import type { Session, SessionLevel } from '~/types/conference'

export interface SessionFilters {
  trackId: string | null
  day: string | null
  level: SessionLevel | null
  speakerId: string | null
  query: string
}

const EMPTY_FILTERS: SessionFilters = {
  trackId: null,
  day: null,
  level: null,
  speakerId: null,
  query: '',
}

/**
 * Headless-Filterlogik für Sessions: kein DOM, kein Styling, nur State + Ableitung.
 * Die Darstellung (Select, Chips, Bottom-Sheet …) ist frei austauschbar und bindet
 * sich per v-model an `filters`. Dadurch ist die Logik ohne Mounting testbar und
 * in mehreren Views (Programmübersicht, „Mein Programm") wiederverwendbar.
 */
export function useSessionFilter(sessions: MaybeRefOrGetter<Session[]>) {
  const filters = reactive<SessionFilters>({ ...EMPTY_FILTERS })

  const filteredSessions = computed(() => {
    const q = filters.query.trim().toLowerCase()
    return toValue(sessions).filter(s =>
      (!filters.trackId || s.trackId === filters.trackId)
      && (!filters.day || s.day === filters.day)
      && (!filters.level || s.level === filters.level)
      && (!filters.speakerId || s.speakerIds.includes(filters.speakerId))
      && (!q || s.title.toLowerCase().includes(q) || s.abstract.toLowerCase().includes(q)),
    )
  })

  const availableDays = computed(() =>
    [...new Set(toValue(sessions).map(s => s.day))].sort(),
  )

  const activeFilterCount = computed(() =>
    Object.entries(filters).filter(([, v]) => v !== null && v !== '').length,
  )

  function reset() {
    Object.assign(filters, EMPTY_FILTERS)
  }

  return { filters, filteredSessions, availableDays, activeFilterCount, reset }
}
