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
  <BaseCard class="group flex h-full flex-col overflow-hidden">
    <div class="flex flex-wrap gap-2 items-center text-small uppercase tracking-wide font-bold">
      <span class="rounded-button bg-surface px-control py-1 text-text-primary">
        {{ session.format }}
      </span>
      <span class="text-text-light">
        {{ session.track?.name }}
      </span>
    </div>

    <div class="mt-card flex flex-1 flex-col">
      <p class="text-small font-semibold text-text-light">
        {{ formattedDay }} · {{ session.startTime }}–{{ session.endTime }} Uhr
      </p>

      <h2 class="mt-section-margin text-text text-heading-small font-bold leading-tight">
        {{ session.title }}
      </h2>

      <dl class="mt-card grid grid-cols-2 gap-control border-t border-border-contrast-dark pt-card text-small text-text-light">
        <div>
          <dt class="font-bold uppercase tracking-wide">Raum</dt>
          <dd class="mt-1 text-text-light">{{ session.room?.name ?? 'Noch offen' }}</dd>
        </div>
        <div>
          <dt class="font-bold uppercase tracking-wide">Level</dt>
          <dd class="mt-1 text-text-light">{{ session.level }}</dd>
        </div>
      </dl>

      <div class="mt-card">
        <p class="text-small text-text-light font-bold uppercase tracking-wide">
          {{ session.speakers.length === 1 ? 'Speaker' : 'Speaker:innen' }}
        </p>
        <p class="mt-1 text-text-light">
          {{ session.speakers.map(speaker => speaker.name).join(', ') }}
        </p>
      </div>
    </div>

    <template #footer>
      <BaseLinkButton :to="`/programm/${session.id}`" variant="secondary">
        Details ansehen <span aria-hidden="true">→</span>
      </BaseLinkButton>
      <BaseButton :to="`/programm/${session.id}`">
        Merken
      </BaseButton>
    </template>
  </BaseCard>
</template>
