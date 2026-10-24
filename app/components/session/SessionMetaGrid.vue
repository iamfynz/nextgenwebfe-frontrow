<script setup lang="ts">
interface MetaItem {
  label: string
  value: string
}

defineProps<{
  items: MetaItem[]
}>()
</script>

<template>
  <section aria-labelledby="session-details-heading">
    <h2 id="session-details-heading" class="text-heading-small font-bold">
      Auf einen Blick
    </h2>

    <dl class="mt-control grid gap-control sm:grid-cols-2 lg:grid-cols-3">
      <BaseCard v-for="item in items" :key="item.label" as="div" class="border border-border-light">
        <dt class="text-small font-bold uppercase tracking-wide text-text-light">
          {{ item.label }}
        </dt>
        <dd class="mt-section-margin text-lead font-semibold text-text-primary">
          {{ item.value }}
        </dd>
      </BaseCard>
    </dl>
  </section>
</template>
