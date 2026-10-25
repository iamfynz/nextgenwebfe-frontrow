<script setup lang="ts">
import type { SessionDetails } from '~/types/conference'

const props = defineProps<{
  session: SessionDetails
}>()

const formattedDay = computed(() =>
  new Intl.DateTimeFormat('de-AT', {
    weekday: 'short',
    day: '2-digit',
    month: '2-digit',
    timeZone: 'Europe/Vienna',
  }).format(new Date(`${props.session.day}T12:00:00`)),
)
</script>

<template>
  <BaseCard class="group flex h-full flex-col overflow-hidden bg-background-contrast text-text-contrast-primary transition duration-200 hover:shadow-xl">
    <div class="flex flex-wrap items-center gap-section-margin text-small uppercase tracking-wide">
      <span class="rounded-button bg-background px-control py-1 text-text-primary">
        {{ session.format }}
      </span>
      <span class="text-text">
        {{ session.track?.name }}
      </span>
    </div>

    <div class="mt-card flex flex-1 flex-col">
      <p class="text-small font-semibold text-text-contrast-light">
        {{ formattedDay }} · {{ session.startTime }}–{{ session.endTime }} Uhr
      </p>

      <h2 class="mt-section-margin text-text text-heading-small font-bold leading-tight">
        {{ session.title }}
      </h2>

      <dl class="mt-card grid grid-cols-2 gap-control border-t border-border-contrast-dark pt-card text-small text-text-contrast-light">
        <div>
          <dt class="font-bold uppercase tracking-wide">Raum</dt>
          <dd class="mt-1 text-text-contrast-light">{{ session.room?.name ?? 'Noch offen' }}</dd>
        </div>
        <div>
          <dt class="font-bold uppercase tracking-wide">Level</dt>
          <dd class="mt-1 text-text-contrast-light">{{ session.level }}</dd>
        </div>
      </dl>

      <div class="mt-card">
        <p class="text-small font-bold uppercase tracking-wide">
          {{ session.speakers.length === 1 ? 'Speaker' : 'Speaker:innen' }}
        </p>
        <p class="mt-1 text-text-contrast-light">
          {{ session.speakers.map(speaker => speaker.name).join(', ') }}
        </p>
      </div>
    </div>

    <template #footer>
      <BaseLinkButton :to="`/programm/${session.id}`">
        Details ansehen <span aria-hidden="true">→</span>
      </BaseLinkButton>
    </template>
  </BaseCard>
</template>
