<script setup lang="ts">
import type { Session } from '~/types/conference'

defineProps<{
  session: Session
  trackName?: string
}>()
</script>

<template>
  <header class="overflow-hidden rounded-card bg-background-contrast text-text-contrast-primary">
    <div class="h-2 bg-primary" />
    <div class="px-card py-group md:px-group md:py-section">
      <div class="flex flex-wrap items-center gap-section-margin text-small font-bold uppercase tracking-wide">
        <span class="rounded-button bg-primary px-control py-1 text-text-primary">
          {{ session.format }}
        </span>
        <span class="text-text-color">{{ trackName }}</span>
      </div>

      <h1 class="mt-card max-w-3xl text-heading-medium font-bold leading-tight md:text-heading-large">
        {{ session.title }}
      </h1>
      <p class="mt-card max-w-3xl text-lead leading-relaxed text-text-contrast-light">
        {{ session.abstract }}
      </p>
    </div>
  </header>
</template>
