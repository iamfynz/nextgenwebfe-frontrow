<script setup lang="ts">
const { speakers } = await useConferenceData()
useHead({ title: 'Speaker — FrontRow' })
</script>

<template>
  <div>
    <h1 class="text-3xl font-bold">Speaker</h1>
    <ul class="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <li v-for="sp in speakers" :key="sp.id">
        <SpeakerCard :speaker="sp" :session-count="sp.sessionIds.length" />
      </li>
    </ul>
  </div>
</template>
