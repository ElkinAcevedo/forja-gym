import { and, desc, eq, gte, isNull, lt, sql } from 'drizzle-orm';

import * as schema from '@/db/schema';
import type { AppDatabase } from '@/db/types';

/** Resumen de una semana de entrenamiento. */
export type WeekSummary = {
  /** Entrenamientos con al menos una serie registrada. */
  sessions: number;
  /** Suma de peso × reps de todas las series, en kg. */
  volumeKg: number;
  records: number;
};

/** Resumen de las series completadas entre `from` (incluido) y `to` (excluido). */
export function getWeekSummary(db: AppDatabase, from: Date, to: Date): WeekSummary {
  const { setLog } = schema;
  const row = db
    .select({
      sessions: sql<number>`count(distinct ${setLog.sessionId})`,
      volumeKg: sql<number>`coalesce(sum(${setLog.weightKg} * ${setLog.reps}), 0)`,
      records: sql<number>`coalesce(sum(${setLog.isPr}), 0)`,
    })
    .from(setLog)
    .where(
      and(
        gte(setLog.completedAt, from.toISOString()),
        lt(setLog.completedAt, to.toISOString()),
        isNull(setLog.deletedAt),
      ),
    )
    .get();

  return { sessions: row?.sessions ?? 0, volumeKg: row?.volumeKg ?? 0, records: row?.records ?? 0 };
}

export type RecentRecord = {
  setId: string;
  exerciseId: string;
  weightKg: number;
  reps: number | null;
  completedAt: string;
  /** Cuánto superó al récord anterior, en kg. */
  gainKg: number;
};

/** Los últimos récords personales, del más reciente al más antiguo. */
export function getRecentRecords(db: AppDatabase, limit: number): RecentRecord[] {
  const { setLog } = schema;
  const records = db
    .select()
    .from(setLog)
    .where(and(eq(setLog.isPr, true), isNull(setLog.deletedAt)))
    .orderBy(desc(setLog.completedAt))
    .limit(limit)
    .all();

  return records.flatMap((record) => {
    if (record.weightKg === null) return [];
    // El récord anterior: el mejor peso de ese ejercicio antes de esta serie.
    const previous = db
      .select({ best: sql<number | null>`max(${setLog.weightKg})` })
      .from(setLog)
      .where(
        and(
          eq(setLog.exerciseId, record.exerciseId),
          lt(setLog.completedAt, record.completedAt),
          isNull(setLog.deletedAt),
        ),
      )
      .get();
    return {
      setId: record.id,
      exerciseId: record.exerciseId,
      weightKg: record.weightKg,
      reps: record.reps,
      completedAt: record.completedAt,
      gainKg: record.weightKg - (previous?.best ?? record.weightKg),
    };
  });
}
