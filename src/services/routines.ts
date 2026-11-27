import { and, asc, eq, inArray, isNull } from 'drizzle-orm';

import * as schema from '@/db/schema';
import type { AppDatabase } from '@/db/types';

/** Un día de la rutina: su nombre (nulo = descanso) y sus ejercicios en orden. */
export type RoutineDayPlan = {
  id: string;
  /** 0 = lunes … 6 = domingo */
  weekday: number;
  name: string | null;
  exerciseIds: string[];
};

export type ActiveRoutine = { id: string; name: string; days: RoutineDayPlan[] };

/** La rutina activa del usuario con sus 7 días, o `null` si no tiene ninguna. */
export function getActiveRoutine(db: AppDatabase): ActiveRoutine | null {
  const routine = db
    .select({ id: schema.routine.id, name: schema.routine.name })
    .from(schema.routine)
    .where(and(eq(schema.routine.isActive, true), isNull(schema.routine.deletedAt)))
    .get();
  if (!routine) return null;

  const days = db
    .select()
    .from(schema.routineDay)
    .where(and(eq(schema.routineDay.routineId, routine.id), isNull(schema.routineDay.deletedAt)))
    .orderBy(asc(schema.routineDay.weekday))
    .all();

  const exercises = db
    .select()
    .from(schema.routineDayExercise)
    .where(
      and(
        inArray(
          schema.routineDayExercise.routineDayId,
          days.map((d) => d.id),
        ),
        isNull(schema.routineDayExercise.deletedAt),
      ),
    )
    .orderBy(asc(schema.routineDayExercise.position))
    .all();

  return {
    ...routine,
    days: days.map((day) => ({
      id: day.id,
      weekday: day.weekday,
      name: day.name,
      exerciseIds: exercises.filter((e) => e.routineDayId === day.id).map((e) => e.exerciseId),
    })),
  };
}
