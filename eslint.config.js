// https://docs.expo.dev/guides/using-eslint/
const { defineConfig } = require('eslint/config');
const expoConfig = require('eslint-config-expo/flat');
const prettierRecommended = require('eslint-plugin-prettier/recommended');

module.exports = defineConfig([
  expoConfig,
  // Último: desactiva reglas de estilo que chocan con Prettier y reporta el formato como error.
  prettierRecommended,
  {
    ignores: ['dist/*', '.expo/*', 'expo-env.d.ts', 'src/db/migrations/*'],
  },
]);
