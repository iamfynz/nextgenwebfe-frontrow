<script setup lang="ts">
/**
 * Personalisiertes Dashboard. Liest nur IDs aus useMyProgram() und löst sie gegen den
 * geteilten Datensatz auf. Inhalt ist client-abhängig (localStorage) → wird erst nach der
 * Rehydration angezeigt. (Rendering-Strategie dieser Seite: Entscheidung in Schritt 2.)
 */
const { sessionIds, isHydrated, clear } = useMyProgram()
const { getSession, getTrack, getRoom, speakersForSession } = await useConferenceData()

const mySessions = computed(() =>
  sessionIds.value
    .map(getSession)
    .filter(s => s !== undefined)
    .sort((a, b) => `${a.day}${a.startTime}`.localeCompare(`${b.day}${b.startTime}`)),
)

useHead({ title: 'Mein Programm — FrontRow' })
</script>

<template>
  <div>
    <div class="flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 class="text-3xl font-bold">Mein Programm</h1>
        <p class="mt-1 text-slate-700">Dein persönlicher Zeitplan — lokal auf diesem Gerät gespeichert.</p>
      </div>
      <BaseButton v-if="mySessions.length" variant="secondary" @click="clear">Alles entfernen</BaseButton>
    </div>

    <p v-if="!isHydrated" class="mt-8 text-slate-500">Lade dein Programm …</p>
    <p v-else-if="mySessions.length === 0" class="mt-8 text-slate-500">
      Noch leer. Füge Sessions im <NuxtLink to="/sessions" class="text-indigo-600 underline">Programm</NuxtLink> hinzu.
    </p>
    <ul v-else class="mt-8 grid gap-4 md:grid-cols-2">
      <li v-for="session in mySessions" :key="session.id">
        <SessionCard
          :session="session"
          :track="getTrack(session.trackId)"
          :room="getRoom(session.roomId)"
          :speakers="speakersForSession(session)"
        />
      </li>
    </ul>
  </div>
</template>
