<script setup lang="ts">
/**
 * Startseite = Funktionsnachweis für Schritt 1: Branding sichtbar, Tokens eingebunden,
 * conference-data.json geladen (Kennzahlen).
 */
const { conference, sessions, speakers, tracks, rooms } = await useConferenceData()

const statItems = computed(() => [
  { label: 'Sessions', value: sessions.value.length },
  { label: 'Speaker', value: speakers.value.length },
  { label: 'Tracks', value: tracks.value.length },
  { label: 'Räume', value: rooms.value.length },
])
</script>

<template>
  <div>
    <section class="rounded-card bg-background-contrast px-card py-section text-text-contrast-primary md:px-group">
      <p class="text-small font-medium uppercase tracking-wide text-text-color">
        {{ conference?.name }} · {{ conference?.dates.join(' – ') }} · {{ conference?.location }}
      </p>
      <h1 class="mt-control text-heading-large font-bold">Dein Platz in der ersten Reihe.</h1>
      <p class="mt-card max-w-2xl text-lead text-text-contrast-light">
        FrontRow ist kein Konferenz-Prospekt, sondern dein Begleiter vor Ort: Programm filtern,
        Speaker kennenlernen, den eigenen Zeitplan zusammenstellen — lesbar im abgedunkelten Saal,
        verlässlich auch ohne WLAN.
      </p>
    </section>

    <section aria-labelledby="stats-heading" class="mt-section">
      <h2 id="stats-heading" class="text-small font-medium uppercase tracking-wide text-text-light">
        Datensatz geladen (conference-data.json)
      </h2>
      <dl class="mt-control grid grid-cols-2 gap-control md:grid-cols-4">
        <BaseCard v-for="s in statItems" :key="s.label" as="div">
          <dt class="text-small text-text-light">{{ s.label }}</dt>
          <dd class="mt-section-margin text-heading-medium font-bold text-text-primary tabular-nums">{{ s.value }}</dd>
        </BaseCard>
      </dl>
    </section>
  </div>
</template>
