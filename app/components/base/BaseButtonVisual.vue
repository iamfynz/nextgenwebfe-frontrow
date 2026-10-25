<script setup lang="ts">
import type { Component } from 'vue'

defineOptions({ inheritAttrs: false })

const attrs = useAttrs()

withDefaults(
  defineProps<{
    as?: string | Component
    variant?: 'primary' | 'secondary'
  }>(),
  {
    as: 'button',
    variant: 'primary',
  },
)
</script>

<template>
  <component
    :is="as"
    v-bind="attrs"
    class="inline-flex items-center justify-center rounded-button border px-5 py-3 text-small font-bold leading-4 transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-border-dark disabled:cursor-not-allowed disabled:opacity-50"
    :class="{
      'border-transparent bg-primary text-text-primary hover:brightness-90 hover:text-text-primary focus:text-text-primary active:text-text-primary visited:text-text-primary': variant === 'primary',
      'border-border-dark bg-transparent text-text-primary hover:bg-background-contrast hover:text-text-contrast-primary': variant === 'secondary',
    }"
  >
    <slot />
  </component>
</template>
