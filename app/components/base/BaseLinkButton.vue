<script setup lang="ts">
defineProps<{
  to: string
  label?: string
}>()
</script>

<template>
  <NuxtLink
    :to="to"
    class="inline-flex items-center justify-center rounded-button bg-background-contrast px-control py-section-margin text-small font-bold text-text-contrast-primary transition hover:-translate-y-0.5 hover:bg-surface hover:text-text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-border-dark"
  >
    <slot>{{ label }}</slot>
  </NuxtLink>
</template>
