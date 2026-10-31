<script setup lang="ts">
/**
 * Speaker-Übersicht. Rendering: SSR (ADR Schritt 2, Punkt D) — geteilter, nicht personalisierter
 * Inhalt, der zur Laufzeit aktuell sein soll.
 */
const { speakers } = await useSpeakers()

const sortedSpeakers = computed(() =>
  [...speakers.value].sort((a, b) => a.name.localeCompare(b.name, 'de')),
)

useSeoMeta({
  title: 'Speaker · FrontRow',
  description: 'Alle Speaker:innen der FrontendNow 2026 mit ihren Sessions.',
})
</script>

<template>
  <div class="space-y-group">
    <section class="rounded-card bg-background-contrast px-card py-group text-text-contrast-light md:px-group">
      <p class="text-small font-bold uppercase tracking-wide text-primary">
        FrontendNow 2026
      </p>
      <h1 class="mt-section-margin text-heading-large font-bold">Speaker</h1>
      <p class="mt-control max-w-2xl text-lead leading-relaxed text-text-contrast-light">
        {{ sortedSpeakers.length }} Speaker:innen an zwei Tagen. Jedes Profil verlinkt die gehaltenen Sessions.
      </p>
    </section>

    <ul class="grid gap-card sm:grid-cols-2 lg:grid-cols-3">
      <li v-for="speaker in sortedSpeakers" :key="speaker.id" class="min-w-0">
        <SpeakerCard :speaker="speaker" />
      </li>
    </ul>
  </div>
</template>
