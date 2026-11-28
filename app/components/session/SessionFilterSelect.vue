<script setup lang="ts" generic="Value extends string">
const props = defineProps<{
  label: string
  options: { value: Value | null, label: string }[]
}>()

const value = defineModel<Value | null>({ required: true })
const open = ref(false)
const trigger = useTemplateRef<HTMLButtonElement>('trigger')
const choices = useTemplateRef<HTMLUListElement>('choices')
const labelId = useId()
const valueId = useId()
const choicesId = useId()
const hintId = useId()
const selectedLabel = computed(() => props.options.find(option => option.value === value.value)?.label)

async function toggle() {
  open.value = !open.value
  if (!open.value) return
  await nextTick()
  const buttons = choices.value?.querySelectorAll('button')
  const selected = choices.value?.querySelector<HTMLButtonElement>('button[aria-pressed="true"]')
  const nextButton = selected ?? buttons?.[0]
  nextButton?.focus()
}

function close() {
  if (!open.value) return
  open.value = false
  trigger.value?.focus()
}

function select(option: Value | null) {
  value.value = option
  close()
}

function handleTab(event: KeyboardEvent) {
  const buttons = Array.from(choices.value?.querySelectorAll('button') ?? [])
  if (!buttons.length) return
  const current = buttons.findIndex(button => button === event.target)
  if (current < 0) return
  event.preventDefault()
  const offset = event.shiftKey ? -1 : 1
  buttons[(current + offset + buttons.length) % buttons.length]?.focus()
}

function handleFocusOut(event: FocusEvent) {
  if (event.currentTarget instanceof HTMLElement
    && event.relatedTarget instanceof Node
    && event.currentTarget.contains(event.relatedTarget)) return
  open.value = false
}

function handleEscape(event: KeyboardEvent) {
  if (!open.value) return
  event.preventDefault()
  event.stopPropagation()
  close()
}
</script>

<template>
  <div
    class="relative grid gap-section-margin text-small font-bold"
    @focusout="handleFocusOut"
    @keydown.esc="handleEscape"
  >
    <span :id="labelId">{{ label }}</span>
    <span :id="hintId" class="sr-only">Enter öffnet und wählt aus. Tab wechselt die Optionen. Escape schließt.</span>
    <button
      ref="trigger"
      type="button"
      :aria-labelledby="`${labelId} ${valueId}`"
      :aria-describedby="hintId"
      :aria-expanded="open"
      :aria-controls="choicesId"
      class="flex min-h-12 w-full items-center justify-between gap-control rounded-input border border-border-light bg-background px-control py-section-margin text-left text-body font-normal text-text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-border-dark"
      @click="toggle"
    >
      <span :id="valueId">{{ selectedLabel }}</span>
      <span aria-hidden="true">▾</span>
    </button>
    <ul
      v-show="open"
      :id="choicesId"
      ref="choices"
      :aria-labelledby="labelId"
      class="absolute inset-x-0 top-full z-10 max-h-64 overflow-auto rounded-input border border-border-light bg-background p-1 shadow-lg"
      @keydown.tab="handleTab"
    >
      <li v-for="option in options" :key="option.value ?? ''">
        <button
          type="button"
          :aria-pressed="option.value === value"
          class="flex w-full items-center justify-between rounded-input px-control py-section-margin text-left text-body font-normal text-text-primary hover:bg-surface focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-border-dark"
          @click="select(option.value)"
        >
          {{ option.label }}
          <span v-if="option.value === value" aria-hidden="true">✓</span>
        </button>
      </li>
    </ul>
  </div>
</template>
