/// <reference types="node" />
// Solo para pruebas: usa Node para leer las migraciones del disco. La app no lo importa.
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

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
