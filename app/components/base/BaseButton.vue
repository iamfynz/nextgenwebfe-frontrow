<script setup lang="ts">
withDefaults(
  defineProps<{
    label?: string
    type?: 'button' | 'submit' | 'reset'
    variant?: 'primary' | 'secondary'
    disabled?: boolean
  }>(),
  {
    type: 'button',
    variant: 'primary',
    disabled: false,
  },
)

const emit = defineEmits<{
  handleClick: []
}>()
</script>

<template>
  <BaseButtonVisual
    as="button"
    :type="type"
    :variant="variant"
    :disabled="disabled"
    @click="emit('handleClick')"
  >
    <slot>{{ label }}</slot>
  </BaseButtonVisual>
</template>
