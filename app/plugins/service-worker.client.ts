export default defineNuxtPlugin(() => {
  if (!('serviceWorker' in navigator)) return

  // /sw.js entsteht erst beim Build (app/service-worker/sw.ts); im Dev-Server gibt es die Datei nicht.
  // Ein Service Worker aus einem früheren Build auf demselben Port würde dort sonst weiter alte
  // Seiten und Daten ausliefern, deshalb wird er im Dev-Modus abgemeldet.
  if (import.meta.dev) {
    navigator.serviceWorker.getRegistrations()
      .then(registrations => Promise.all(registrations.map(registration => registration.unregister())))
      .catch(() => undefined)
    return
  }

  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js', { scope: '/' }).catch((error: unknown) => {
      console.error('Service Worker konnte nicht registriert werden:', error)
    })
  })
})
