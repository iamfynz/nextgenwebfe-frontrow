<script setup lang="ts">
/** Generische Karte. Base-Layer: kennt keine Domäne. */
defineProps<{ as?: string }>()
</script>

<template>
  <component
    :is="as ?? 'article'"
    class="rounded-lg border border-slate-200 bg-white p-4 shadow-sm"
  >
    <header v-if="$slots.header" class="mb-3">
      <slot name="header" />
    </header>
    <slot />
    <footer v-if="$slots.footer" class="mt-4 flex items-center justify-between gap-3">
      <slot name="footer" />
    </footer>
  </component>
</template>
