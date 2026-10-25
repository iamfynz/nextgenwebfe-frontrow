<script lang="ts" setup>

const { sessions } = await useSessions();
const { filteredSessions } = await useSessionFilter(sessions);

</script>

<template>
  <div>
    <h1 class="text-heading-large">Programm</h1>

    <SessionFilter />
    <SessionList :sessions="filteredSessions" />

  </div>
</template>

<style></style>