<script setup lang="ts">
defineProps<{
  to: string
  label?: string
}>()
</script>

<template>
  <NuxtLink
    :to="to"
    class="inline-flex items-center justify-center rounded-button bg-primary px-5 py-3 text-small font-bold leading-4 text-text-primary transition hover:brightness-90 hover:text-text-primary focus:text-text-primary focus-visible:text-text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-border-dark active:text-text-primary visited:text-text-primary"
  >
    <slot>{{ label }}</slot>
  </NuxtLink>
</template>
