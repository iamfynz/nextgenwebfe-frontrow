<script setup lang="ts">
import type { Speaker } from '~/types/conference'

defineProps<{
  speaker: Speaker
}>()
</script>

<template>
  <header class="overflow-hidden rounded-card bg-background-contrast text-text-contrast-primary">
    <div class="px-card py-group md:px-group md:py-section">
      <p class="text-small font-bold uppercase tracking-wide text-text-color">
        Speaker:in
      </p>
      <h1 class="mt-card max-w-3xl text-heading-medium font-bold leading-tight md:text-heading-large">
        {{ speaker.name }}
      </h1>
      <p class="mt-section-margin text-lead text-text-contrast-light">
        {{ speaker.title }} · {{ speaker.company }}
      </p>
      <p class="mt-card max-w-3xl text-lead leading-relaxed text-text-contrast-light">
        {{ speaker.bio }}
      </p>
    </div>
  </header>
</template>
