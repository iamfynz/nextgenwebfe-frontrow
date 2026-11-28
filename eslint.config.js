// Qualitäts-Gate (Schritt 4, B). Die Basis erzeugt @nuxt/eslint passend zum Projekt
// (Vue-SFCs, TypeScript, Auto-Imports) nach .nuxt/eslint.config.mjs; vorher muss
// `nuxt prepare` gelaufen sein (passiert bei `npm install` über postinstall).
import withNuxt from './.nuxt/eslint.config.mjs'

export default withNuxt()
