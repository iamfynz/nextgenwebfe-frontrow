<script setup lang="ts">
withDefaults(
  defineProps<{
    label?: string
    type?: "button" | "submit" | "reset"
    variant?: "primary" | "secondary"
    disabled?: boolean
  }>(),
  {
    type: "button",
    variant: "primary",
    disabled: false,
  }
)

const emit = defineEmits<{
  (e: "handleClick"): void
}>()

const handleClick = () => {
  emit("handleClick")
}
</script>

<template>
  <button @click="handleClick" :type="type" :disabled="disabled" class="inline-flex items-center justify-center rounded-button
      px-5 py-3 text-small font-bold leading-4 transition
      hover:brightness-90
      focus-visible:outline-2 focus-visible:outline-offset-2
      focus-visible:outline-border-dark
      disabled:cursor-not-allowed disabled:opacity-50" :class="{
        'bg-primary text-text-primary border border-transparent':
          variant === 'primary',

        'bg-transparent text-primary border border-primary':
          variant === 'secondary',
      }">
    <slot>{{ label }}</slot>
  </button>
</template>