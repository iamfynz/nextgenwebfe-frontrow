<script setup lang="ts">
/** Button. Base-Layer: Varianten über Tailwind-Utilities. */
withDefaults(defineProps<{
  variant?: 'primary' | 'secondary' | 'ghost'
  type?: 'button' | 'submit'
}>(), { variant: 'primary', type: 'button' })
</script>

<template>
  <button
    :type="type"
    class="inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors duration-150 disabled:cursor-not-allowed disabled:opacity-50"
    :class="{
      'bg-indigo-600 text-white hover:bg-indigo-700': variant === 'primary',
      'border border-slate-400 bg-white text-slate-900 hover:bg-slate-100': variant === 'secondary',
      'text-indigo-600 hover:bg-indigo-50': variant === 'ghost',
    }"
  >
    <slot />
  </button>
</template>
