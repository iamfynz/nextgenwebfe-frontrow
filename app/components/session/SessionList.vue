<script setup lang="ts">
import type { SessionDetails } from '~/types/conference'

const props = defineProps<{
  sessions: SessionDetails[]
}>()

const list = useTemplateRef<HTMLUListElement>('list')
const container = useTemplateRef<HTMLDivElement>('container')
const keyboardHintId = useId()

function navigate(event: KeyboardEvent) {
  if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return
  if (!['ArrowUp', 'ArrowDown', 'Home', 'End'].includes(event.key)) return
  if (!(event.target instanceof HTMLElement)) return

  const currentItem = event.target.closest('li')
  const items = Array.from(list.value?.children ?? [])
  if (!currentItem) return
  const currentIndex = items.indexOf(currentItem)
  if (currentIndex < 0) return

  let destination = currentIndex
  if (event.key === 'Home') destination = 0
  if (event.key === 'End') destination = items.length - 1
  if (event.key === 'ArrowUp') destination = Math.max(0, currentIndex - 1)
  if (event.key === 'ArrowDown') destination = Math.min(items.length - 1, currentIndex + 1)

  event.preventDefault()
  if (destination !== currentIndex) {
    items[destination]?.querySelector<HTMLAnchorElement>('a[href]')?.focus()
  }
}

watch(() => props.sessions.map(session => session.id), async (sessionIds) => {
  if (!import.meta.client) return
  const focusedItem = document.activeElement?.closest<HTMLElement>('li[data-session-id]')
  if (!focusedItem || focusedItem.parentElement !== list.value) return
  if (sessionIds.some(id => id === focusedItem.dataset.sessionId)) return

  await nextTick()
  if (document.activeElement === document.body) {
    const nextLink = list.value?.querySelector<HTMLAnchorElement>('a[href]')
    if (nextLink) nextLink.focus()
    else container.value?.focus()
  }
})
</script>

<template>
  <div ref="container" tabindex="-1" class="space-y-control focus:outline-2 focus:outline-offset-4 focus:outline-border-dark">
    <p v-if="sessions.length" :id="keyboardHintId" class="text-small">
      Mit Pfeil hoch oder runter zwischen Sessions wechseln. Pos1 und Ende springen zur ersten oder letzten Session.
    </p>
    <ul
      v-if="sessions.length"
      ref="list"
      aria-label="Sessions"
      :aria-describedby="keyboardHintId"
      class="grid gap-card lg:grid-cols-2"
      @keydown="navigate"
    >
      <li v-for="session in sessions" :key="session.id" :data-session-id="session.id" class="min-w-0">
        <SessionCard :session="session" />
      </li>
    </ul>

    <BaseCard v-else class="text-center">
      <p class="text-lead font-bold">Keine Sessions gefunden</p>
      <p class="mt-section-margin text-text-light">Passe deine Filter an, um weitere Sessions zu sehen.</p>
    </BaseCard>
  </div>
</template>
