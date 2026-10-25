<script setup lang="ts">
import type { SessionDetails } from '~/types/conference'

defineProps<{
  sessions: SessionDetails[]
}>()
</script>

<template>
  <ul v-if="sessions.length" class="grid gap-card lg:grid-cols-2">
    <li v-for="session in sessions" :key="session.id" class="min-w-0">
      <SessionCard :session="session" />
    </li>
  </ul>

  <BaseCard v-else class="text-center">
    <p class="text-lead font-bold">Keine Sessions gefunden</p>
    <p class="mt-section-margin text-text-light">Passe deine Filter an, um weitere Sessions zu sehen.</p>
  </BaseCard>
</template>
