import { migrate } from 'drizzle-orm/expo-sqlite/migrator';

import { db } from './client';
import migrations from './migrations/migrations';
import { seedCatalog } from './seed';

let setup: Promise<void> | null = null;

/**
 * Deja la base de datos lista para usar: aplica las migraciones pendientes y carga el
 * catálogo si cambió. Se ejecuta una sola vez aunque se llame varias veces (por ejemplo,
 * si React monta dos veces el componente en desarrollo).
 */
export function setupDatabase(): Promise<void> {
  setup ??= (async () => {
    await migrate(db, migrations);
    seedCatalog(db);
  })();
  return setup;
}
