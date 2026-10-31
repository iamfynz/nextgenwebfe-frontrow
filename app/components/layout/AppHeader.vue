<script setup lang="ts">
/** Layout-Layer: kennt Navigation und den globalen Zähler von „Mein Programm" (ADR B). */
const { count, isHydrated } = useMyProgram()

const links = [
  { to: '/programm', label: 'Programm' },
  { to: '/speakers', label: 'Speaker' },
  { to: '/mein-programm', label: 'Mein Programm' },
]
</script>

<template>
  <header class="border-b border-border-light">
    <div class="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-card px-control py-control">
      <NuxtLink to="/" class="flex items-center gap-section-margin font-heading text-lead font-bold text-text-primary">
        <span class="text-primary" aria-hidden="true">OO</span>FrontRow
      </NuxtLink>
      <nav aria-label="Hauptnavigation" class="flex flex-wrap items-center gap-control text-small font-bold text-text-light">
        <NuxtLink
          v-for="link in links"
          :key="link.to"
          :to="link.to"
          class="inline-flex items-center gap-section-margin hover:text-text-primary"
          active-class="text-text-primary underline underline-offset-4"
        >
          {{ link.label }}
          <span
            v-if="link.to === '/mein-programm' && isHydrated && count > 0"
            class="rounded-button bg-primary px-section-margin text-text-primary tabular-nums"
            :aria-label="`${count} gemerkte Sessions`"
          >{{ count }}</span>
        </NuxtLink>
      </nav>
    </div>
  </header>
</template>
