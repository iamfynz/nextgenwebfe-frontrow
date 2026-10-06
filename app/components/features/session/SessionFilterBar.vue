<script setup lang="ts">
import type { SessionLevel, Track } from '~/types/conference'

/**
 * Darstellung der Session-Filter. Enthält KEINE Filterlogik — die lebt in useSessionFilter().
 * Diese Komponente ist austauschbar (z. B. Chips oder Bottom-Sheet auf Mobile), ohne die Logik zu berühren.
 */
defineProps<{
  tracks: Track[]
  days: string[]
  activeCount: number
}>()

const emit = defineEmits<{ reset: [] }>()

const trackId = defineModel<string | null>('trackId', { default: null })
const day = defineModel<string | null>('day', { default: null })
const level = defineModel<SessionLevel | null>('level', { default: null })
const query = defineModel<string>('query', { default: '' })

const levels: SessionLevel[] = ['Einsteiger', 'Fortgeschritten', 'Experte']
const selectClass = 'rounded-md border border-slate-400 bg-white px-3 py-2 text-sm text-slate-900'
</script>

<template>
  <form class="flex flex-wrap items-end gap-3" role="search" @submit.prevent>
    <label class="flex flex-col gap-1 text-xs font-medium text-slate-700">
      Suche
      <input v-model="query" type="search" placeholder="Titel oder Abstract" :class="selectClass">
    </label>

    <label class="flex flex-col gap-1 text-xs font-medium text-slate-700">
      Tag
      <select v-model="day" :class="selectClass">
        <option :value="null">Alle Tage</option>
        <option v-for="d in days" :key="d" :value="d">{{ d }}</option>
      </select>
    </label>

    <label class="flex flex-col gap-1 text-xs font-medium text-slate-700">
      Track
      <select v-model="trackId" :class="selectClass">
        <option :value="null">Alle Tracks</option>
        <option v-for="t in tracks" :key="t.id" :value="t.id">{{ t.name }}</option>
      </select>
    </label>

    <label class="flex flex-col gap-1 text-xs font-medium text-slate-700">
      Level
      <select v-model="level" :class="selectClass">
        <option :value="null">Alle Level</option>
        <option v-for="l in levels" :key="l" :value="l">{{ l }}</option>
      </select>
    </label>

    <BaseButton v-if="activeCount > 0" variant="ghost" @click="emit('reset')">
      Zurücksetzen ({{ activeCount }})
    </BaseButton>
  </form>
</template>
