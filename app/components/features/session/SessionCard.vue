<script setup lang="ts">
import type { Room, Session, Speaker, Track } from '~/types/conference'

/** Feature-Layer: kennt die Domäne, erhält aufgelöste Daten per Props, komponiert Base-Komponenten. */
defineProps<{
  session: Session
  track?: Track
  room?: Room
  speakers: Speaker[]
}>()
</script>

<template>
  <BaseCard>
    <template #header>
      <div class="flex flex-wrap items-center gap-2">
        <BaseBadge v-if="track" tone="brand">{{ track.name }}</BaseBadge>
        <BaseBadge>{{ session.level }}</BaseBadge>
        <BaseBadge v-if="session.format !== 'Vortrag'" tone="accent">{{ session.format }}</BaseBadge>
      </div>
    </template>

    <h3 class="text-lg font-semibold">
      <NuxtLink :to="`/sessions/${session.id}`" class="hover:text-indigo-600">{{ session.title }}</NuxtLink>
    </h3>
    <p class="mt-1 text-sm text-slate-700">
      {{ speakers.map(s => s.name).join(', ') }}
    </p>
    <p class="mt-2 text-sm text-slate-500">
      <time :datetime="`${session.day}T${session.startTime}`">{{ session.day }} · {{ session.startTime }}–{{ session.endTime }}</time>
      <span v-if="room"> · {{ room.name }}</span>
    </p>

    <template #footer>
      <ProgramToggle :session-id="session.id" />
    </template>
  </BaseCard>
</template>
