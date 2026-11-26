import { drizzle } from 'drizzle-orm/expo-sqlite';
import { openDatabaseSync } from 'expo-sqlite';

import * as schema from './schema';

const DATABASE_NAME = 'forja.db';

const sqlite = openDatabaseSync(DATABASE_NAME);

// WAL: cada serie se guarda rápido sin bloquear las lecturas (recomendado por Expo).
// foreign_keys: SQLite las trae desactivadas; sin esto no se cumplen las relaciones.
sqlite.execSync('PRAGMA journal_mode = WAL; PRAGMA foreign_keys = ON;');

/** Base de datos local de la app. Única instancia para toda la app. */
export const db = drizzle(sqlite, { schema });
