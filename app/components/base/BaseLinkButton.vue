<script setup lang="ts">
defineProps<{
  to: string
  label?: string
  variant?: 'primary' | 'secondary'
}>()

const NuxtLinkComponent = resolveComponent('NuxtLink')
</script>

<template>
  <BaseButtonVisual
    :as="NuxtLinkComponent"
    :to="to"
    :variant="variant"
  >
    <slot>{{ label }}</slot>
  </BaseButtonVisual>
</template>
