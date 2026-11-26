import { sql, type SQL } from 'drizzle-orm';
import { text, type AnySQLiteColumn } from 'drizzle-orm/sqlite-core';

/** Fecha y hora actual en UTC, formato ISO 8601 (2026-11-26T18:30:00.000Z). */
export const nowUtc = sql`(strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))`;

/**
 * Columnas que necesita toda tabla de datos del usuario para poder sincronizarse:
 * cuándo cambió por última vez y borrado lógico (la fila se marca, no se elimina).
 * Es una función porque cada tabla necesita sus propias instancias de columna.
 */
export const syncColumns = () => ({
  updatedAt: text('updated_at').notNull().default(nowUtc),
  deletedAt: text('deleted_at'),
});

/**
 * Restricción `columna BETWEEN min AND max` para una CHECK.
 * Los límites van como texto literal porque una CHECK no admite parámetros.
 * Un valor NULL la cumple, así que sirve también para columnas opcionales.
 */
export const between = (column: AnySQLiteColumn, range: { min: number; max: number }): SQL =>
  sql`${column} BETWEEN ${sql.raw(String(range.min))} AND ${sql.raw(String(range.max))}`;
