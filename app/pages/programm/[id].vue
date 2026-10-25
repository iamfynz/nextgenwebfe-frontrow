<script setup lang="ts">
const route = useRoute()
const { getSession } = await useSessions()

const session = computed(() => getSession(route.params.id as string))

if (!session.value) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Session nicht gefunden',
  })
}

const formattedDay = computed(() =>
  new Intl.DateTimeFormat('de-AT', {
    weekday: 'long',
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    timeZone: 'Europe/Vienna',
  }).format(new Date(`${session.value!.day}T12:00:00`)),
)

const metaItems = computed(() => [
  { label: 'Datum', value: formattedDay.value },
  { label: 'Uhrzeit', value: `${session.value!.startTime}–${session.value!.endTime} Uhr` },
  { label: 'Raum', value: session.value!.room?.name ?? 'Noch offen' },
  { label: 'Track', value: session.value!.track?.name ?? 'Ohne Track' },
  { label: 'Level', value: session.value!.level },
  { label: 'Format', value: session.value!.format },
])

useSeoMeta({
  title: () => `${session.value!.title} · FrontRow`,
  description: () => session.value!.abstract,
})
</script>

<template>
  <article v-if="session" class="space-y-section">
    <NuxtLink
      to="/programm"
      class="inline-flex items-center gap-section-margin font-bold text-text-primary hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-border-dark"
    >
      <span aria-hidden="true">←</span> Alle Sessions
    </NuxtLink>

    <SessionDetailHero :session="session" :track-name="session.track?.name" />

    <SessionDetailGrid :items="metaItems" />

    <section aria-labelledby="session-speakers-heading">
      <div class="mb-control flex items-end justify-between gap-control">
        <div>
          <p class="text-small font-bold uppercase tracking-wide text-text-light">
            Auf der Bühne
          </p>
          <h2 id="session-speakers-heading" class="mt-section-margin text-heading-small font-bold">
            {{ session.speakers.length === 1 ? 'Speaker:in' : 'Speaker:innen' }}
          </h2>
        </div>
        <span class="rounded-button bg-surface px-control py-section-margin text-small font-bold">
          {{ session.speakers.length }} {{ session.speakers.length === 1 ? 'Person' : 'Personen' }}
        </span>
      </div>

      <div class="grid gap-control md:grid-cols-2">
        <SessionDetailSpeakerCard
          v-for="speaker in session.speakers"
          :key="speaker.id"
          :speaker="speaker"
        />
      </div>
    </section>
  </article>
</template>
