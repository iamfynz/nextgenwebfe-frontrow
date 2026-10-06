<script setup lang="ts">
const route = useRoute()
const { getSpeaker, sessionsForSpeaker, getTrack, getRoom, speakersForSession } = await useConferenceData()

const speaker = computed(() => getSpeaker(String(route.params.id)))
if (!speaker.value) {
  throw createError({ statusCode: 404, statusMessage: 'Speaker nicht gefunden', fatal: true })
}

useHead({ title: () => `${speaker.value?.name ?? 'Speaker'} — FrontRow` })
</script>

<template>
  <article v-if="speaker">
    <NuxtLink to="/speakers" class="text-sm text-indigo-600">← Alle Speaker</NuxtLink>
    <h1 class="mt-4 text-3xl font-bold">{{ speaker.name }}</h1>
    <p class="mt-1 text-slate-700">{{ speaker.title }} · {{ speaker.company }}</p>
    <p class="mt-6 max-w-prose text-lg leading-relaxed text-slate-700">{{ speaker.bio }}</p>

    <h2 class="mt-8 text-sm font-medium uppercase tracking-wide text-slate-500">Sessions</h2>
    <ul class="mt-3 grid gap-4 md:grid-cols-2">
      <li v-for="session in sessionsForSpeaker(speaker)" :key="session.id">
        <SessionCard
          :session="session"
          :track="getTrack(session.trackId)"
          :room="getRoom(session.roomId)"
          :speakers="speakersForSession(session)"
        />
      </li>
    </ul>
  </article>
</template>
