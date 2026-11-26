import type { BaseSQLiteDatabase } from 'drizzle-orm/sqlite-core';

import type * as schema from './schema';

/**
 * Cualquier base SQLite síncrona con el esquema de FORJA: la de Expo en la app y sql.js
 * en las pruebas. Los servicios la reciben como parámetro para poder probarse.
 */
export type AppDatabase = BaseSQLiteDatabase<'sync', unknown, typeof schema>;

/** Genera ids únicos para las filas nuevas (UUID en la app; contador en las pruebas). */
export type IdGenerator = () => string;
