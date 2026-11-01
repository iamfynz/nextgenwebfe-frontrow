const STORAGE_KEY = 'frontrow:my-program:v1'

/**
 * Persönlicher State „Mein Programm" (Konzept C, Schritt 1):
 * - nur Session-IDs (string[]), keine Session-Objekte → Aufgelöst wird gegen useConferenceData,
 *   damit Raum-/Zeitänderungen im Datensatz automatisch durchschlagen.
 * - `useState`: ein app-weit geteilter, SSR-sicherer Ref. Header-Zähler, Toggle und Dashboard
 *   lesen dieselbe Referenz.
 * - Persistenz explizit in den Mutationen; Rehydration einmalig in `onMounted`, damit Server-HTML
 *   und erster Client-Render identisch bleiben (bis dahin: `isHydrated === false`).
 * - Storage-Fehler (Quota, Private Mode) schlagen still fehl; der State bleibt dann nur im Speicher.
 */
export function useMyProgram() {
  const sessionIds = useState<string[]>('my-program', () => [])
  const isHydrated = useState<boolean>('my-program-hydrated', () => false)

  function persist() {
    if (!import.meta.client) return
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(sessionIds.value))
    }
    catch {
      // Quota / Private Mode: still ignorieren, State bleibt im Speicher.
    }
  }

  function hydrate() {
    if (!import.meta.client || isHydrated.value) return
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      const parsed: unknown = raw ? JSON.parse(raw) : []
      if (Array.isArray(parsed)) {
        // Nur Strings, ohne Duplikate (hand-editierter oder älterer Storage-Inhalt).
        sessionIds.value = [...new Set(parsed.filter((id): id is string => typeof id === 'string'))]
      }
    }
    catch {
      // Beschädigter oder gesperrter Storage: mit leerem Programm starten.
    }
    isHydrated.value = true
  }

  // Composable wird in <script setup> aufgerufen → onMounted ist verfügbar. Mehrfache Aufrufe
  // (Header + Karten + Seite) sind durch das Flag idempotent.
  onMounted(hydrate)

  const count = computed(() => sessionIds.value.length)
  const has = (id: string) => sessionIds.value.includes(id)

  function add(id: string) {
    if (has(id)) return
    sessionIds.value = [...sessionIds.value, id]
    persist()
  }

  function remove(id: string) {
    if (!has(id)) return
    sessionIds.value = sessionIds.value.filter(existing => existing !== id)
    persist()
  }

  function toggle(id: string) {
    has(id) ? remove(id) : add(id)
  }

  function clear() {
    sessionIds.value = []
    persist()
  }

  return {
    sessionIds: readonly(sessionIds),
    isHydrated: readonly(isHydrated),
    count,
    has,
    add,
    remove,
    toggle,
    clear,
  }
}
