<script setup lang="ts">
/** Kleine Kennzeichnung (Track, Level, Format). Base-Layer. */
withDefaults(defineProps<{ tone?: 'neutral' | 'brand' | 'accent' }>(), { tone: 'neutral' })
</script>

<template>
  <span
    class="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium"
    :class="{
      'bg-slate-50 text-slate-700': tone === 'neutral',
      'bg-indigo-100 text-indigo-800': tone === 'brand',
      'bg-amber-400 text-slate-900': tone === 'accent',
    }"
  >
    <slot />
  </span>
</template>
