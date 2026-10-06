<script setup lang="ts">
import type { Speaker } from '~/types/conference'

defineProps<{ speaker: Speaker; sessionCount: number }>()
</script>

<template>
  <BaseCard>
    <h3 class="text-lg font-semibold">
      <NuxtLink :to="`/speakers/${speaker.id}`" class="hover:text-indigo-600">{{ speaker.name }}</NuxtLink>
    </h3>
    <p class="text-sm text-slate-700">{{ speaker.title }} · {{ speaker.company }}</p>
    <p class="mt-2 text-sm text-slate-500">{{ sessionCount }} {{ sessionCount === 1 ? 'Session' : 'Sessions' }}</p>
  </BaseCard>
</template>
