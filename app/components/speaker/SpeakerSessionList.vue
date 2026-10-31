<script setup lang="ts">
import type { SessionDetails } from '~/types/conference'

/** Sessions eines Speakers, chronologisch, mit Link zur Detailseite. */
defineProps<{
  sessions: SessionDetails[]
}>()
</script>

<template>
  <section aria-labelledby="speaker-sessions-heading">
    <div class="mb-control flex items-end justify-between gap-control">
      <div>
        <p class="text-small font-bold uppercase tracking-wide text-text-light">
          Auf dem Programm
        </p>
        <h2 id="speaker-sessions-heading" class="mt-section-margin text-heading-small font-bold">
          {{ sessions.length === 1 ? 'Session' : 'Sessions' }}
        </h2>
      </div>
      <span class="rounded-button bg-surface px-control py-section-margin text-small font-bold">
        {{ sessions.length }}
      </span>
    </div>

    <ul class="grid gap-control">
      <li v-for="session in sessions" :key="session.id">
        <BaseCard>
          <div class="flex flex-col gap-card sm:flex-row sm:items-center sm:justify-between">
            <div class="min-w-0">
              <p class="text-small font-semibold text-text-light">
                {{ formatDay(session.day) }} · {{ session.startTime }}–{{ session.endTime }} Uhr
                · {{ session.room?.name ?? 'Raum offen' }}
              </p>
              <p class="mt-section-margin text-lead font-bold text-text-primary">
                {{ session.title }}
              </p>
              <p class="mt-section-margin text-small text-text-light">
                {{ session.track?.name }} · {{ session.format }} · {{ session.level }}
              </p>
            </div>

            <BaseLinkButton :to="`/programm/${session.id}`">
              Zur Session <span aria-hidden="true">→</span>
            </BaseLinkButton>
          </div>
        </BaseCard>
      </li>
    </ul>
  </section>
</template>
