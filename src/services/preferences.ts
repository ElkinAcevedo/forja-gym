import { and, eq, isNull } from 'drizzle-orm';

import * as schema from '@/db/schema';
import type { AppDatabase } from '@/db/types';

import { getProfile } from './profile';

/** Descanso elegido por el usuario para cada ejercicio que lo tenga, por id de ejercicio. */
export function getRestPreferences(db: AppDatabase): Map<string, number> {
  const rows = db
    .select()
    .from(schema.exercisePreference)
    .where(isNull(schema.exercisePreference.deletedAt))
    .all();
  return new Map(
    rows.flatMap((r) => (r.restSeconds !== null ? [[r.exerciseId, r.restSeconds] as const] : [])),
  );
}

/** Recuerda el descanso que el usuario eligió para un ejercicio. */
export function saveRestPreference(
  db: AppDatabase,
  exerciseId: string,
  restSeconds: number,
  now: Date,
) {
  const { exercisePreference: pref } = schema;
  const userId = getProfile(db).id;
  const updatedAt = now.toISOString();
  db.insert(pref)
    .values({ userId, exerciseId, restSeconds, updatedAt })
    .onConflictDoUpdate({
      target: [pref.userId, pref.exerciseId],
      set: { restSeconds, updatedAt, deletedAt: null },
    })
    .run();
}

/** Olvida el descanso elegido para un ejercicio: vuelve a usar el automático. */
export function clearRestPreference(db: AppDatabase, exerciseId: string, now: Date) {
  const { exercisePreference: pref } = schema;
  // Borrado lógico, como el resto de datos del usuario (para la sincronización futura).
  db.update(pref)
    .set({ deletedAt: now.toISOString(), updatedAt: now.toISOString() })
    .where(eq(pref.exerciseId, exerciseId))
    .run();
}

/** Para las pruebas: la preferencia guardada de un ejercicio, o null. */
export function getRestPreference(db: AppDatabase, exerciseId: string): number | null {
  const row = db
    .select({ restSeconds: schema.exercisePreference.restSeconds })
    .from(schema.exercisePreference)
    .where(and(eq(schema.exercisePreference.exerciseId, exerciseId)))
    .get();
  return row?.restSeconds ?? null;
}
