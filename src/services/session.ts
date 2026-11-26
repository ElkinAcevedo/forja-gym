/**
 * Servicio del entrenamiento en curso: qué toca registrar, guardar y quitar series,
 * y abrir, retomar y terminar la sesión.
 *
 * Cada serie se guarda en el momento en que se confirma con ✓: si la app se cierra a mitad
 * del entrenamiento no se pierde nada y la sesión se retoma al volver.
 */
import { and, asc, desc, eq, isNull, ne, sql } from 'drizzle-orm';

import * as schema from '@/db/schema';
import type { AppDatabase, IdGenerator } from '@/db/types';
import { weekdayIndex } from '@/domain/dates';
import { isNewRecord } from '@/domain/records';
import { suggestedScheme, type RepScheme } from '@/domain/training';
import { isSessionStale, type SetValues } from '@/domain/workout';

import { getExerciseCards, type ExerciseCard } from './catalog';
import { getProfile, getRepSchemes } from './profile';
import { getActiveRoutine } from './routines';

export type SavedSet = { id: string; position: number; values: SetValues };

export type WorkoutExercise = {
  card: ExerciseCard;
  scheme: RepScheme;
  /** Series de la última sesión en que se hizo este ejercicio (para precargar y comparar). */
  lastSession: SetValues[];
  /** Mejor peso histórico, incluidas las series de hoy; nulo si nunca se registró. */
  bestWeightKg: number | null;
  /** Series ya confirmadas en la sesión actual. */
  savedSets: SavedSet[];
};

export type WorkoutPlan = {
  session: { id: string; startedAt: string } | null;
  /** Día de la rutina que se entrena; nulo si hoy es descanso y aún no se eligió otro. */
  day: { id: string; name: string } | null;
  /** Días de entrenamiento de la rutina, para elegir uno en un día de descanso. */
  trainableDays: { id: string; name: string }[];
  exercises: WorkoutExercise[];
  settings: { restSeconds: number; autofill: boolean; incrementKg: number };
};

const valuesOf = (row: typeof schema.setLog.$inferSelect): SetValues => ({
  weightKg: row.weightKg,
  reps: row.reps,
  durationS: row.durationS,
  distanceM: row.distanceM,
});

/** Sesión sin terminar. Si quedó abierta hace demasiado, la da por terminada y no la devuelve. */
function getOpenSession(db: AppDatabase, now: Date) {
  const { workoutSession, setLog } = schema;
  const open = db
    .select()
    .from(workoutSession)
    .where(and(isNull(workoutSession.endedAt), isNull(workoutSession.deletedAt)))
    .orderBy(desc(workoutSession.startedAt))
    .get();
  if (!open || !isSessionStale(open.startedAt, now)) return open ?? null;

  // Termina cuando se registró su última serie (o cuando empezó, si no tiene ninguna).
  const last = db
    .select({ at: sql<string | null>`max(${setLog.completedAt})` })
    .from(setLog)
    .where(and(eq(setLog.sessionId, open.id), isNull(setLog.deletedAt)))
    .get();
  finishSession(db, open.id, new Date(last?.at ?? open.startedAt));
  return null;
}

/** Series de la sesión más reciente (distinta de `excludeSessionId`) que incluyó el ejercicio. */
function getLastSessionSets(db: AppDatabase, exerciseId: string, excludeSessionId: string | null) {
  const { setLog } = schema;
  const notThisSession = excludeSessionId ? ne(setLog.sessionId, excludeSessionId) : undefined;
  const latest = db
    .select({ sessionId: setLog.sessionId })
    .from(setLog)
    .where(and(eq(setLog.exerciseId, exerciseId), isNull(setLog.deletedAt), notThisSession))
    .orderBy(desc(setLog.completedAt))
    .get();
  if (!latest) return [];

  return db
    .select()
    .from(setLog)
    .where(
      and(
        eq(setLog.sessionId, latest.sessionId),
        eq(setLog.exerciseId, exerciseId),
        isNull(setLog.deletedAt),
      ),
    )
    .orderBy(asc(setLog.position))
    .all()
    .map(valuesOf);
}

function getBestWeight(db: AppDatabase, exerciseId: string): number | null {
  const { setLog } = schema;
  const row = db
    .select({ best: sql<number | null>`max(${setLog.weightKg})` })
    .from(setLog)
    .where(and(eq(setLog.exerciseId, exerciseId), isNull(setLog.deletedAt)))
    .get();
  return row?.best ?? null;
}

/**
 * Qué registrar ahora: la sesión abierta (si hay), el día que se entrena y, por cada
 * ejercicio, su esquema de series, la última sesión y lo ya confirmado hoy.
 * `chosenDayId` permite entrenar otro día de la rutina, p. ej. en un día de descanso.
 */
export function getWorkoutPlan(db: AppDatabase, now: Date, chosenDayId?: string): WorkoutPlan {
  const profile = getProfile(db);
  const routineDays = getActiveRoutine(db)?.days ?? [];
  const session = getOpenSession(db, now);

  const trainableDays = routineDays.flatMap((d) => (d.name ? [{ id: d.id, name: d.name }] : []));
  const dayId =
    session?.routineDayId ??
    chosenDayId ??
    routineDays.find((d) => d.weekday === weekdayIndex(now) && d.name)?.id;
  const day = routineDays.find((d) => d.id === dayId) ?? null;

  const saved = session
    ? db
        .select()
        .from(schema.setLog)
        .where(and(eq(schema.setLog.sessionId, session.id), isNull(schema.setLog.deletedAt)))
        .orderBy(asc(schema.setLog.completedAt))
        .all()
    : [];

  // Los ejercicios del día y, detrás, los que se añadieron durante la sesión.
  const exerciseIds = [
    ...new Set([...(day?.exerciseIds ?? []), ...saved.map((s) => s.exerciseId)]),
  ];
  const rules = getRepSchemes(db);

  return {
    session: session ? { id: session.id, startedAt: session.startedAt } : null,
    day: day?.name ? { id: day.id, name: day.name } : null,
    trainableDays,
    exercises: getExerciseCards(db, exerciseIds).map((card) => ({
      card,
      scheme: suggestedScheme(rules, profile.goal, card.isCompound),
      lastSession: getLastSessionSets(db, card.id, session?.id ?? null),
      bestWeightKg: getBestWeight(db, card.id),
      savedSets: saved
        .filter((s) => s.exerciseId === card.id)
        .sort((a, b) => a.position - b.position)
        .map((s) => ({ id: s.id, position: s.position, values: valuesOf(s) })),
    })),
    settings: {
      restSeconds: profile.restSeconds,
      autofill: profile.autofill,
      incrementKg: profile.incrementKg,
    },
  };
}

export type SaveSetInput = {
  /** Sesión en curso; si es nula se abre una al guardar la primera serie. */
  sessionId: string | null;
  routineDayId: string | null;
  exerciseId: string;
  position: number;
  values: SetValues;
};

/** Guarda una serie confirmada con ✓. Indica si es un récord personal. */
export function saveSet(
  db: AppDatabase,
  input: SaveSetInput,
  now: Date,
  newId: IdGenerator,
): { setId: string; sessionId: string; isPr: boolean } {
  return db.transaction((tx) => {
    const userId = getProfile(tx).id;
    const at = now.toISOString();

    let sessionId = input.sessionId;
    if (!sessionId) {
      sessionId = newId();
      tx.insert(schema.workoutSession)
        .values({ id: sessionId, userId, routineDayId: input.routineDayId, startedAt: at })
        .run();
    }

    const isPr = isNewRecord(input.values.weightKg, getBestWeight(tx, input.exerciseId));
    const setId = newId();
    tx.insert(schema.setLog)
      .values({
        id: setId,
        userId,
        sessionId,
        exerciseId: input.exerciseId,
        position: input.position,
        ...input.values,
        completedAt: at,
        isPr,
      })
      .run();

    return { setId, sessionId, isPr };
  });
}

/** Quita una serie confirmada (al desmarcar ✓). Borrado lógico, para poder sincronizarlo. */
export function deleteSet(db: AppDatabase, setId: string, now: Date) {
  const at = now.toISOString();
  db.update(schema.setLog)
    .set({ deletedAt: at, updatedAt: at })
    .where(eq(schema.setLog.id, setId))
    .run();
}

/** Da por terminado el entrenamiento. */
export function finishSession(db: AppDatabase, sessionId: string, now: Date) {
  const at = now.toISOString();
  db.update(schema.workoutSession)
    .set({ endedAt: at, updatedAt: at })
    .where(eq(schema.workoutSession.id, sessionId))
    .run();
}
