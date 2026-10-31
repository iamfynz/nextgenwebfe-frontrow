<script setup lang="ts">
/**
 * Feature-Komponente: Session zum persönlichen Programm hinzufügen / entfernen.
 * Ruft useMyProgram() direkt auf (ADR B: bewusst nicht headless, ein toggle(id) braucht
 * keine eigene Abstraktion). Bis zur Rehydration deaktiviert, damit SSR-HTML und
 * erster Client-Render identisch sind.
 */
const props = defineProps<{
  sessionId: string
}>()

const { has, toggle, isHydrated } = useMyProgram()

const saved = computed(() => has(props.sessionId))
</script>

<template>
  <BaseButton
    :variant="saved ? 'secondary' : 'primary'"
    :disabled="!isHydrated"
    :aria-pressed="saved"
    :aria-label="saved ? 'Aus meinem Programm entfernen' : 'Zu meinem Programm hinzufügen'"
    @click="toggle(sessionId)"
  >
    <span aria-hidden="true">{{ saved ? '✓' : '+' }}</span>
    {{ saved ? 'Gemerkt' : 'Merken' }}
  </BaseButton>
</template>
