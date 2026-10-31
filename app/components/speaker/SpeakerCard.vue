<script setup lang="ts">
import type { SpeakerDetails } from '~/types/conference'

defineProps<{
  speaker: SpeakerDetails
}>()
</script>

<template>
  <BaseCard class="flex h-full flex-col">
    <div class="flex flex-1 flex-col">
      <h2 class="text-heading-small font-bold leading-tight text-text-primary">
        {{ speaker.name }}
      </h2>
      <p class="mt-section-margin text-text-light">
        {{ speaker.title }} · {{ speaker.company }}
      </p>
      <p class="mt-card text-small text-text-light">
        {{ speaker.sessions.length }} {{ speaker.sessions.length === 1 ? 'Session' : 'Sessions' }}
      </p>
    </div>

    <template #footer>
      <BaseLinkButton :to="`/speakers/${speaker.id}`" variant="secondary">
        Profil ansehen <span aria-hidden="true">→</span>
      </BaseLinkButton>
    </template>
  </BaseCard>
</template>
