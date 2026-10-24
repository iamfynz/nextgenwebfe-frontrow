<script setup lang="ts">
import type { Speaker } from '~/types/conference'

defineProps<{
  speaker: Speaker
}>()
</script>

<template>
  <BaseCard class="border border-border-light">
    <div class="flex flex-col gap-card sm:flex-row sm:items-center sm:justify-between">
      <div>
        <p class="text-lead font-bold text-text-primary">
          {{ speaker.name }}
        </p>
        <p class="mt-section-margin text-text-light">
          {{ speaker.title }} · {{ speaker.company }}
        </p>
      </div>

      <BaseLinkButton :to="`/speakers/${speaker.id}`">
        Profil ansehen <span aria-hidden="true">→</span>
      </BaseLinkButton>
    </div>
  </BaseCard>
</template>
