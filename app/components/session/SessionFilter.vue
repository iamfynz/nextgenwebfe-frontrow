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

function formatDay(value: string) {
  return new Intl.DateTimeFormat('de-AT', {
    weekday: 'long',
    day: '2-digit',
    month: '2-digit',
    timeZone: 'Europe/Vienna',
  }).format(new Date(`${value}T12:00:00`))
}
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
        <label class="grid gap-section-margin text-small font-bold" for="session-track-filter">
          Track
          <select
            id="session-track-filter"
            v-model="trackId"
            class="min-h-12 w-full rounded-input border border-border-light bg-background px-control py-section-margin font-body text-body font-normal text-text-primary focus:border-border-dark focus:outline-2 focus:outline-offset-2 focus:outline-border-dark"
          >
            <option :value="null">Alle Tracks</option>
            <option v-for="track in tracks" :key="track.id" :value="track.id">{{ track.name }}</option>
          </select>
        </label>

        <label class="grid gap-section-margin text-small font-bold" for="session-day-filter">
          Konferenztag
          <select
            id="session-day-filter"
            v-model="day"
            class="min-h-12 w-full rounded-input border border-border-light bg-background px-control py-section-margin font-body text-body font-normal text-text-primary focus:border-border-dark focus:outline-2 focus:outline-offset-2 focus:outline-border-dark"
          >
            <option :value="null">Alle Tage</option>
            <option v-for="availableDay in days" :key="availableDay" :value="availableDay">
              {{ formatDay(availableDay) }}
            </option>
          </select>
        </label>

        <label class="grid gap-section-margin text-small font-bold" for="session-level-filter">
          Level
          <select
            id="session-level-filter"
            v-model="level"
            class="min-h-12 w-full rounded-input border border-border-light bg-background px-control py-section-margin font-body text-body font-normal text-text-primary focus:border-border-dark focus:outline-2 focus:outline-offset-2 focus:outline-border-dark"
          >
            <option :value="null">Alle Levels</option>
            <option v-for="availableLevel in levels" :key="availableLevel" :value="availableLevel">
              {{ availableLevel }}
            </option>
          </select>
        </label>
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
