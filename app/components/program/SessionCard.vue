<script lang="ts" setup>

interface Props {
  session: Session
}

const props = defineProps<Props>();
</script>

<template>
  <BaseCard class="bg-background-contrast text-text-contrast-light">
    <p>{{ session.day }} <span>{{ session.startTime }}–{{ session.endTime }}</span></p>
    <h2 class="text-heading-small">{{ session.title }}</h2>
    <div class="flex gap-2">
      <p>{{ session.roomId }}</p>
      <p>·</p>
      <p>{{ session.level }}</p>
    </div>
    <div>
      <p>{{ session.speakerIds }}</p>
    </div>
    <BaseLinkButton :to="`/sessions/${session.id}`">
      Details ansehen <span aria-hidden="true">→</span>
    </BaseLinkButton>
  </BaseCard>
</template>

<style></style>