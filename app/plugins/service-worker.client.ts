export default defineNuxtPlugin(() => {
  // /sw.js entsteht erst beim Build (app/service-worker/sw.ts); im Dev-Server gibt es die Datei nicht.
  if (import.meta.dev || !('serviceWorker' in navigator)) return

  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js', { scope: '/' }).catch((error: unknown) => {
      console.error('Service Worker konnte nicht registriert werden:', error)
    })
  })
})
