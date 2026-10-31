<script setup lang="ts">
/**
 * „Mein Programm". Rendering: CSR (`ssr: false` in nuxt.config.ts, ADR Schritt 2, Punkt E).
 * Zeigt den in localStorage persistierten State (nur IDs), aufgelöst gegen den Datensatz.
 */
const { getSession } = await useSessions()
const { sessionIds, isHydrated, count, clear } = useMyProgram()

const mySessions = computed(() =>
  sessionIds.value
    .map(getSession)
    .filter(session => session !== undefined)
    .sort((a, b) => `${a.day}${a.startTime}`.localeCompare(`${b.day}${b.startTime}`)),
)

// Gruppierung nach Konferenztag, damit der eigene Zeitplan lesbar ist.
const byDay = computed(() => {
  const groups = new Map<string, typeof mySessions.value>()
  for (const session of mySessions.value) {
    groups.set(session.day, [...(groups.get(session.day) ?? []), session])
  }
  return [...groups.entries()].map(([day, sessions]) => ({ day, sessions }))
})

useSeoMeta({
  title: 'Mein Programm · FrontRow',
  description: 'Deine persönliche Auswahl an Sessions der FrontendNow 2026.',
})
</script>

<template>
  <div class="space-y-group">
    <section class="rounded-card bg-background-contrast px-card py-group text-text-contrast-light md:px-group">
      <p class="text-small font-bold uppercase tracking-wide text-primary">
        FrontendNow 2026
      </p>
      <h1 class="mt-section-margin text-heading-large font-bold">Mein Programm</h1>
      <p class="mt-control max-w-2xl text-lead leading-relaxed text-text-contrast-light">
        Deine gemerkten Sessions, gespeichert auf diesem Gerät. Bleibt auch nach einem Neuladen erhalten.
      </p>
    </section>

    <BaseCard v-if="!isHydrated" class="text-center" aria-busy="true">
      <p class="text-text-light">Programm wird geladen …</p>
    </BaseCard>

    <BaseCard v-else-if="mySessions.length === 0" class="text-center">
      <p class="text-lead font-bold">Noch keine Sessions gemerkt</p>
      <p class="mt-section-margin text-text-light">
        Im Programm kannst du Sessions mit „Merken" hier ablegen.
      </p>
      <div class="mt-card flex justify-center">
        <BaseLinkButton to="/programm">
          Zum Programm <span aria-hidden="true">→</span>
        </BaseLinkButton>
      </div>
    </BaseCard>

    <template v-else>
      <div class="flex flex-wrap items-center justify-between gap-control">
        <span class="rounded-button bg-background-card px-control py-section-margin text-small font-bold">
          {{ count }} {{ count === 1 ? 'Session' : 'Sessions' }} gemerkt
        </span>
        <BaseButton variant="secondary" @click="clear()">
          Alle entfernen
        </BaseButton>
      </div>

      <section v-for="group in byDay" :key="group.day" :aria-labelledby="`day-${group.day}`">
        <h2 :id="`day-${group.day}`" class="mb-control text-heading-small font-bold">
          {{ formatDay(group.day, 'long') }}
        </h2>
        <SessionList :sessions="group.sessions" />
      </section>
    </template>
  </div>
</template>
