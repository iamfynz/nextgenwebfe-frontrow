<script setup lang="ts">
/** Generische Karte. Base-Layer: kennt keine Domäne. */
defineProps<{ as?: string }>()
</script>

<template>
  <component
    :is="as ?? 'article'"
    class="rounded-card bg-background-card p-card"
  >
    <header v-if="$slots.header" class="mb-control">
      <slot name="header" />
    </header>
    <slot />
    <footer v-if="$slots.footer" class="mt-card flex items-center justify-between gap-control">
      <slot name="footer" />
    </footer>
  </component>
</template>
