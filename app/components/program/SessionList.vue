<script lang="ts" setup>

interface Props {
  sessions: Session[]
}

const props = defineProps<Props>();
</script>

<template>
  <ul class="">
    <li v-for="session in sessions" :key="session.id">
      <SessionCard :session="session" />
    </li>
  </ul>
</template>

<style></style>