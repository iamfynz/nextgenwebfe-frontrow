<script setup lang="ts">
/**
 * Speaker-Profil. Rendering: SSR (ADR Schritt 2, Punkt D).
 * Die Session-Liste wird über useSessions() aufgelöst, damit Track und Raum bereits
 * fertig verknüpft sind — dieselbe Datenquelle wie die Session-Detailseite.
 */
const route = useRoute()
const { getSpeaker } = await useSpeakers()
const { getSession } = await useSessions()

const speaker = computed(() => getSpeaker(route.params.id as string))

if (!speaker.value) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Speaker nicht gefunden',
  })
}

const sessions = computed(() =>
  speaker.value!.sessions
    .map(session => getSession(session.id))
    .filter(session => session !== undefined)
    .sort((a, b) => `${a.day}${a.startTime}`.localeCompare(`${b.day}${b.startTime}`)),
)

useSeoMeta({
  title: () => `${speaker.value!.name} · FrontRow`,
  description: () => speaker.value!.bio,
})
</script>

<template>
  <article v-if="speaker" class="space-y-section">
    <NuxtLink
      to="/speakers"
      class="inline-flex items-center gap-section-margin font-bold text-text-primary hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-border-dark"
    >
      <span aria-hidden="true">←</span> Alle Speaker
    </NuxtLink>

    <SpeakerDetailHero :speaker="speaker" />

    <SpeakerSessionList :sessions="sessions" />
  </article>
</template>
