import { defineConfig } from 'drizzle-kit';

// Configuración de drizzle-kit: genera las migraciones SQL a partir del esquema.
// Uso: npm run db:generate
export default defineConfig({
  dialect: 'sqlite',
  driver: 'expo',
  schema: './src/db/schema',
  out: './src/db/migrations',
});
