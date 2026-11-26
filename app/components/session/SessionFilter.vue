<script setup lang="ts">
import type { SessionLevel, Track } from '~/types/conference'

defineProps<{
  tracks: Track[]
  days: string[]
  levels: SessionLevel[]
  hasActiveFilters: boolean
}>()

const emit = defineEmits<{
  reset: []
}>()

const trackId = defineModel<string | null>('trackId', { required: true })
const day = defineModel<string | null>('day', { required: true })
const level = defineModel<SessionLevel | null>('level', { required: true })
</script>

<template>
  <section aria-labelledby="session-filter-heading" class="rounded-card bg-surface p-card">
    <div class="flex flex-col gap-card lg:flex-row lg:items-end">
      <div class="min-w-0 flex-1">
        <p class="text-small font-bold uppercase tracking-wide text-text-light">Programm eingrenzen</p>
        <h2 id="session-filter-heading" class="mt-section-margin text-heading-small font-bold">
          Sessions filtern
        </h2>
      </div>

      <div class="grid flex-[3] gap-control sm:grid-cols-3">
        <SessionFilterSelect v-model="trackId" label="Track" :options="[
          { value: null, label: 'Alle Tracks' },
          ...tracks.map(track => ({ value: track.id, label: track.name })),
        ]" />
        <SessionFilterSelect v-model="day" label="Konferenztag" :options="[
          { value: null, label: 'Alle Tage' },
          ...days.map(day => ({ value: day, label: formatDay(day, 'medium') })),
        ]" />
        <SessionFilterSelect v-model="level" label="Level" :options="[
          { value: null, label: 'Alle Levels' },
          ...levels.map(level => ({ value: level, label: level })),
        ]" />
      </div>

      <BaseButton
        class="min-h-12"
        variant="secondary"
        :disabled="!hasActiveFilters"
        @click="emit('reset')"
      >
        Zurücksetzen
      </BaseButton>
    </div>
  </section>
</template>
