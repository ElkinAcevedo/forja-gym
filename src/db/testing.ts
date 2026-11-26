/// <reference types="node" />
// Solo para pruebas: usa Node para leer las migraciones del disco. La app no lo importa.
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

import { drizzle, type SQLJsDatabase } from 'drizzle-orm/sql-js';
import initSqlJs from 'sql.js';

import * as schema from './schema';
import { seedCatalog } from './seed';

const MIGRATIONS_DIR = join(__dirname, 'migrations');

/** Sentencias SQL de todas las migraciones, en orden, listas para ejecutar una a una. */
export function migrationStatements(): string[] {
  return readdirSync(MIGRATIONS_DIR)
    .filter((file) => file.endsWith('.sql'))
    .sort()
    .flatMap((file) =>
      readFileSync(join(MIGRATIONS_DIR, file), 'utf8').split('--> statement-breakpoint'),
    );
}

export type TestDatabase = SQLJsDatabase<typeof schema>;

/**
 * Base de datos real en memoria (sql.js) con el esquema completo y las claves foráneas
 * activas. Con `seed: true` carga además el catálogo.
 */
export async function createTestDatabase({ seed = false } = {}): Promise<TestDatabase> {
  const SQL = await initSqlJs();
  const sqlite = new SQL.Database();
  sqlite.run('PRAGMA foreign_keys = ON');
  for (const statement of migrationStatements()) sqlite.run(statement);
  const db = drizzle(sqlite, { schema });
  if (seed) seedCatalog(db);
  return db;
}

/** Generador de ids predecible para las pruebas: id-1, id-2… */
export function sequentialIds() {
  let n = 0;
  return () => `id-${++n}`;
}
