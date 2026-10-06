<script setup lang="ts">
const { sessions, tracks, getTrack, getRoom, speakersForSession } = await useConferenceData()
const { filters, filteredSessions, availableDays, activeFilterCount, reset } = useSessionFilter(sessions)

useHead({ title: 'Programm — FrontRow' })
</script>

<template>
  <div>
    <h1 class="text-3xl font-bold">Programm</h1>
    <p class="mt-1 text-slate-700">{{ filteredSessions.length }} von {{ sessions.length }} Sessions</p>

    <SessionFilterBar
      v-model:track-id="filters.trackId"
      v-model:day="filters.day"
      v-model:level="filters.level"
      v-model:query="filters.query"
      :tracks="tracks"
      :days="availableDays"
      :active-count="activeFilterCount"
      class="mt-6"
      @reset="reset"
    />

    <ul class="mt-6 grid gap-4 md:grid-cols-2">
      <li v-for="session in filteredSessions" :key="session.id">
        <SessionCard
          :session="session"
          :track="getTrack(session.trackId)"
          :room="getRoom(session.roomId)"
          :speakers="speakersForSession(session)"
        />
      </li>
    </ul>
    <p v-if="filteredSessions.length === 0" class="mt-6 text-slate-500">Keine Session passt zu den Filtern.</p>
  </div>
</template>
