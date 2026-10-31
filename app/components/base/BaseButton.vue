<script setup lang="ts">
/**
 * Base-Layer: der eine Button der App.
 * - Ohne `to`: natives <button>, emittiert `click` (MouseEvent). `disabled` wirkt nativ.
 * - Mit `to`: NuxtLink in Button-Optik. `type` ist hier ohne Bedeutung; `disabled` wird als
 *   `aria-disabled` gesetzt, die Navigation unterbunden und kein `click` emittiert.
 * Inhalt kommt ausschließlich über den Default-Slot. Icons als eigene Kinder
 * (z. B. <span aria-hidden="true">→</span>) bekommen über `gap` ihren Abstand.
 * Weitere Attribute (aria-*, class) fallen auf das gerenderte Root-Element durch.
 */
const props = withDefaults(
  defineProps<{
    to?: string
    type?: 'button' | 'submit' | 'reset'
    variant?: 'primary' | 'secondary'
    disabled?: boolean
  }>(),
  {
    to: undefined,
    type: 'button',
    variant: 'primary',
    disabled: false,
  },
)

const emit = defineEmits<{
  click: [event: MouseEvent]
}>()

function onClick(event: MouseEvent) {
  if (props.disabled) {
    event.preventDefault()
    return
  }
  emit('click', event)
}

const baseClass
  = 'inline-flex items-center justify-center gap-2 rounded-button border px-5 py-3 text-small font-bold leading-4 transition '
    + 'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-border-dark '
    + 'disabled:cursor-not-allowed disabled:opacity-50 aria-disabled:cursor-not-allowed aria-disabled:opacity-50'

const variantClass = {
  primary: 'border-transparent bg-primary text-text-primary hover:brightness-90 hover:text-text-primary focus:text-text-primary active:text-text-primary visited:text-text-primary',
  secondary: 'border-border-dark bg-transparent text-text-primary hover:bg-background-contrast hover:text-text-contrast-primary',
} as const
</script>

<template>
  <NuxtLink
    v-if="to"
    :to="to"
    :class="[baseClass, variantClass[variant]]"
    :aria-disabled="disabled || undefined"
    :tabindex="disabled ? -1 : undefined"
    @click="onClick"
  >
    <slot />
  </NuxtLink>

  <button
    v-else
    :type="type"
    :disabled="disabled"
    :class="[baseClass, variantClass[variant]]"
    @click="onClick"
  >
    <slot />
  </button>
</template>
