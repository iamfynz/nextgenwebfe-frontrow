<script setup lang="ts">
/**
 * „Zum Programm hinzufügen" — bewusst NICHT headless aufgeteilt: die Logik ist ein
 * einzeiliges toggle(id) im geteilten useMyProgram()-State. Eine weitere Abstraktionsschicht
 * brächte hier keinen Nutzen (siehe ADR B).
 */
const props = defineProps<{ sessionId: string }>()
const { has, toggle, isHydrated } = useMyProgram()
const active = computed(() => has(props.sessionId))
</script>

<template>
  <BaseButton
    :variant="active ? 'secondary' : 'primary'"
    :aria-pressed="active"
    :disabled="!isHydrated"
    @click="toggle(sessionId)"
  >
    {{ active ? '✓ Im Programm' : '+ Zum Programm' }}
  </BaseButton>
</template>
