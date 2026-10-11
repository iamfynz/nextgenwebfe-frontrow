<template>
  <div class="flex min-h-screen flex-col">
    <AppHeader />
    <main class="mx-auto w-full max-w-5xl flex-1 px-control py-group">
      <slot />
    </main>
    <AppFooter />
  </div>
</template>
