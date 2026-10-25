<script setup lang="ts">
const { sessions } = await useSessions()
const {
  trackId,
  day,
  level,
  filteredSessions,
  availableTracks,
  availableDays,
  availableLevels,
  hasActiveFilters,
  resetFilters,
} = useSessionFilter(sessions)
</script>

<template>
  <div class="space-y-group">
    <section class="rounded-card bg-background-contrast text-text-contrast-light px-card py-group md:px-group">
      <p class="text-small font-bold uppercase tracking-wide text-primary">
        FrontendNow 2026
      </p>
      <h1 class="mt-section-margin text-heading-large font-bold">Programm</h1>
      <p class="mt-control max-w-2xl text-lead leading-relaxed text-text-contrast-light">
        Entdecke alle Sessions und finde die Vorträge, Workshops und Diskussionen, die zu dir passen.
      </p>
    </section>

    <SessionFilter
      v-model:track-id="trackId"
      v-model:day="day"
      v-model:level="level"
      :tracks="availableTracks"
      :days="availableDays"
      :levels="availableLevels"
      :has-active-filters="hasActiveFilters"
      @reset="resetFilters"
    />

    <div class="flex items-center justify-between gap-control">
      <span class="rounded-button bg-background-card px-control py-section-margin text-small font-bold">
        {{ filteredSessions.length }} Ergebnisse
      </span>
    </div>

    <SessionList :sessions="filteredSessions" />
  </div>
</template>
