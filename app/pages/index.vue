<script setup lang="ts">
/**
 * Startseite = Funktionsnachweis für Schritt 1: Branding sichtbar, Tokens eingebunden,
 * conference-data.json geladen (Kennzahlen).
 */
const { conference, sessions, speakers, tracks, rooms } = await useConferenceData()

const stats = computed(() => [
  { label: 'Sessions', value: sessions.value.length },
  { label: 'Speaker', value: speakers.value.length },
  { label: 'Tracks', value: tracks.value.length },
  { label: 'Räume', value: rooms.value.length },
])
</script>

<template>
  <div>
    <section class="rounded-lg bg-slate-900 px-6 py-12 text-slate-50 md:px-12 md:py-16">
      <p class="text-sm font-medium uppercase tracking-wide text-amber-300">
        {{ conference?.name }} · {{ conference?.dates.join(' – ') }} · {{ conference?.location }}
      </p>
      <h1 class="mt-3 text-4xl font-bold">Dein Platz in der ersten Reihe.</h1>
      <p class="mt-4 max-w-2xl text-lg text-slate-300">
        FrontRow ist kein Konferenz-Prospekt, sondern dein Begleiter vor Ort: Programm filtern,
        Speaker kennenlernen, den eigenen Zeitplan zusammenstellen — lesbar im abgedunkelten Saal,
        verlässlich auch ohne WLAN.
      </p>
    </section>

    <section aria-labelledby="stats-heading" class="mt-10">
      <h2 id="stats-heading" class="text-sm font-medium uppercase tracking-wide text-slate-500">
        Datensatz geladen (conference-data.json)
      </h2>
      <dl class="mt-3 grid grid-cols-2 gap-4 md:grid-cols-4">
        <BaseCard v-for="s in stats" :key="s.label" as="div">
          <dt class="text-sm text-slate-700">{{ s.label }}</dt>
          <dd class="mt-1 text-3xl font-bold text-indigo-600 tabular-nums">{{ s.value }}</dd>
        </BaseCard>
      </dl>
    </section>
  </div>
</template>
