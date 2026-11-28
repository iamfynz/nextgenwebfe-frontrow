// Qualitäts-Gate (Schritt 4, B). Die Basis erzeugt @nuxt/eslint passend zum Projekt
// (Vue-SFCs, TypeScript, Auto-Imports) nach .nuxt/eslint.config.mjs; vorher muss
// `nuxt prepare` gelaufen sein (passiert bei `npm install` über postinstall).
import withNuxt from './.nuxt/eslint.config.mjs'

// Zahlen, die ohne Namen verständlich sind: Indexgrenzen und Schrittweiten.
const ALLOWED_NUMBERS = [-1, 0, 1]

export default withNuxt({
  name: 'frontrow/quality-gate',
  rules: {
    // Fehlende Typen: kein any als Ausweg.
    '@typescript-eslint/no-explicit-any': 'error',
    // Typische Reste aus generiertem Code: ungenutzte Variablen, Importe und Parameter.
    '@typescript-eslint/no-unused-vars': ['error', { args: 'after-used', caughtErrors: 'all' }],
    // Unbenannte Zahlen im Code; Konstanten, Enums und Typen sind ausgenommen.
    'no-magic-numbers': 'off',
    '@typescript-eslint/no-magic-numbers': ['error', {
      ignore: ALLOWED_NUMBERS,
      ignoreArrayIndexes: true,
      ignoreDefaultValues: true,
      ignoreEnums: true,
      ignoreNumericLiteralTypes: true,
      ignoreTypeIndexes: true,
      enforceConst: true,
    }],
  },
})
