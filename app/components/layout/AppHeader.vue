<script setup lang="ts">
const { count } = useMyProgram()

const nav = [
  { to: '/sessions', label: 'Programm' },
  { to: '/speakers', label: 'Speaker' },
]
</script>

<template>
  <header class="border-b border-slate-200 bg-white">
    <div class="mx-auto flex max-w-5xl items-center justify-between gap-6 px-4 py-3">
      <NuxtLink to="/" class="flex items-center gap-2 text-lg font-bold text-slate-900">
        <span class="inline-block size-3 rounded-full bg-amber-400" aria-hidden="true" />
        FrontRow
      </NuxtLink>

      <nav aria-label="Hauptnavigation" class="flex items-center gap-1">
        <NuxtLink
          v-for="item in nav"
          :key="item.to"
          :to="item.to"
          class="rounded-md px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 hover:text-slate-900"
          active-class="text-indigo-600!"
        >
          {{ item.label }}
        </NuxtLink>
        <NuxtLink
          to="/mein-programm"
          class="ml-2 inline-flex items-center gap-2 rounded-md bg-indigo-100 px-3 py-2 text-sm font-medium text-indigo-800 hover:bg-indigo-600 hover:text-white"
        >
          Mein Programm
          <ClientOnly>
            <span class="rounded-full bg-white px-1.5 text-xs text-slate-900 tabular-nums">{{ count }}</span>
          </ClientOnly>
        </NuxtLink>
      </nav>
    </div>
  </header>
</template>
