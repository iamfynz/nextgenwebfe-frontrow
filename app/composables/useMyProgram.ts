const STATE_KEY = 'my-program'
const HYDRATED_KEY = 'my-program-hydrated'
const STORAGE_KEY = 'frontrow:my-program:v1'

/**
 * Persönlicher Zeitplan („Mein Programm").
 *
 * Datenstruktur: NUR Session-IDs. Die vollen Objekte kommen immer aus dem geteilten
 * Datensatz (useConferenceData) → eine einzige Quelle der Wahrheit, keine veralteten
 * Kopien bei Programmänderungen, winziger localStorage-Footprint.
 *
 * Reaktivität: `useState` ist Nuxt-weit pro Key geteilt — alle Komponenten sehen dieselbe
 * Liste, ohne Pinia/Props-Drilling.
 *
 * Persistenz: Rehydration aus localStorage erst in `onMounted` (nach der Hydration), damit
 * Server-HTML und erster Client-Render identisch sind (kein Hydration-Mismatch). Schreiben
 * passiert explizit in den Mutationen, nicht über einen Watcher, der an einen Komponenten-
 * Scope gebunden wäre.
 */
export function useMyProgram() {
  const sessionIds = useState<string[]>(STATE_KEY, () => [])
  const isHydrated = useState<boolean>(HYDRATED_KEY, () => false)

  if (import.meta.client && getCurrentInstance()) {
    onMounted(() => {
      if (isHydrated.value) return
      sessionIds.value = readFromStorage()
      isHydrated.value = true
    })
  }

  const count = computed(() => sessionIds.value.length)
  const has = (id: string) => sessionIds.value.includes(id)

  function add(id: string) {
    if (has(id)) return
    sessionIds.value = [...sessionIds.value, id]
    persist()
  }

  function remove(id: string) {
    sessionIds.value = sessionIds.value.filter(x => x !== id)
    persist()
  }

  function toggle(id: string) {
    has(id) ? remove(id) : add(id)
  }

  function clear() {
    sessionIds.value = []
    persist()
  }

  function persist() {
    if (!import.meta.client) return
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(sessionIds.value))
    }
    catch {
      // Quota/Private Mode: State bleibt im Speicher, Persistenz schlägt still fehl.
    }
  }

  return { sessionIds: readonly(sessionIds), isHydrated: readonly(isHydrated), count, has, add, remove, toggle, clear }
}

function readFromStorage(): string[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    const parsed: unknown = raw ? JSON.parse(raw) : []
    return Array.isArray(parsed) ? parsed.filter((x): x is string => typeof x === 'string') : []
  }
  catch {
    return []
  }
}
