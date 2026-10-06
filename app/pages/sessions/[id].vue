<script setup lang="ts">
const route = useRoute()
const { getSession, getTrack, getRoom, speakersForSession } = await useConferenceData()

const session = computed(() => getSession(String(route.params.id)))
if (!session.value) {
  throw createError({ statusCode: 404, statusMessage: 'Session nicht gefunden', fatal: true })
}

useHead({ title: () => `${session.value?.title ?? 'Session'} — FrontRow` })
</script>

<template>
  <article v-if="session">
    <NuxtLink to="/sessions" class="text-sm text-indigo-600">← Programm</NuxtLink>
    <div class="mt-4 flex flex-wrap gap-2">
      <BaseBadge tone="brand">{{ getTrack(session.trackId)?.name }}</BaseBadge>
      <BaseBadge>{{ session.level }}</BaseBadge>
      <BaseBadge tone="accent">{{ session.format }}</BaseBadge>
    </div>
    <h1 class="mt-3 text-3xl font-bold">{{ session.title }}</h1>
    <p class="mt-2 text-slate-500">
      {{ session.day }} · {{ session.startTime }}–{{ session.endTime }} · {{ getRoom(session.roomId)?.name }}
    </p>
    <p class="mt-6 max-w-prose text-lg leading-relaxed text-slate-700">{{ session.abstract }}</p>

    <h2 class="mt-8 text-sm font-medium uppercase tracking-wide text-slate-500">Speaker</h2>
    <ul class="mt-2 flex flex-wrap gap-3">
      <li v-for="sp in speakersForSession(session)" :key="sp.id">
        <NuxtLink :to="`/speakers/${sp.id}`" class="font-medium text-indigo-600 hover:underline">{{ sp.name }}</NuxtLink>
        <span class="text-slate-500"> · {{ sp.company }}</span>
      </li>
    </ul>

    <div class="mt-8">
      <ProgramToggle :session-id="session.id" />
    </div>
  </article>
</template>
