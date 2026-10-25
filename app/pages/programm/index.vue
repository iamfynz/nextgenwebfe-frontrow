<script setup lang="ts">
const { sessions } = await useSessions()
const { filteredSessions } = useSessionFilter(sessions)
</script>

<template>
  <div class="space-y-group">
    <header class="rounded-card bg-surface px-card py-group md:px-group">
      <p class="text-small font-bold uppercase tracking-wide text-text-primary">
        FrontendNow 2026
      </p>
      <h1 class="mt-section-margin text-heading-large font-bold">Programm</h1>
      <p class="mt-control max-w-2xl text-lead leading-relaxed text-text-primary">
        Entdecke alle Sessions und finde die Vorträge, Workshops und Diskussionen, die zu dir passen.
      </p>
    </header>

    <SessionFilter />

    <div class="flex items-center justify-between gap-control">
      <h2 class="text-heading-small font-bold">Alle Sessions</h2>
      <span class="rounded-button bg-background-card px-control py-section-margin text-small font-bold">
        {{ filteredSessions.length }} Ergebnisse
      </span>
    </div>

    <SessionList :sessions="filteredSessions" />
  </div>
</template>
