const { getDefaultConfig } = require('expo/metro-config');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// Permite importar las migraciones .sql generadas por drizzle-kit.
config.resolver.sourceExts.push('sql');

module.exports = config;
