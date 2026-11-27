import { asc, inArray, sql } from 'drizzle-orm';

import * as schema from '@/db/schema';
import type { EquipmentId } from '@/db/seed/equipment';
import type { MuscleId } from '@/db/seed/muscles';
import type { AppDatabase } from '@/db/types';
import type { TrackingMode } from '@/domain/enums';

/** Lo que la interfaz necesita para mostrar un ejercicio: nombre, equipo y músculos. */
export type ExerciseCard = {
  id: string;
  name: string;
  equipmentId: EquipmentId;
  isCompound: boolean;
  /** Descanso recomendado entre series (catálogo). */
  restSeconds: number;
  /** Qué se anota en cada serie: peso y reps, tiempo, distancia… */
  tracking: TrackingMode;
  primary: MuscleId[];
  secondary: MuscleId[];
};

/**
 * Ejercicios del catálogo con sus músculos, en el orden de `ids` (o todos por nombre).
 * Los ids de músculo y equipo vienen del catálogo tipado, por eso se pueden afirmar sus tipos.
 */
export function getExerciseCards(db: AppDatabase, ids?: readonly string[]): ExerciseCard[] {
  const exercises = db
    .select()
    .from(schema.exercise)
    .where(ids ? inArray(schema.exercise.id, [...ids]) : undefined)
    .orderBy(asc(schema.exercise.name))
    .all();
  const muscles = db
    .select()
    .from(schema.exerciseMuscle)
    .where(ids ? inArray(schema.exerciseMuscle.exerciseId, [...ids]) : undefined)
    // En el orden en que se cargaron desde el catálogo, para que la interfaz sea estable.
    .orderBy(sql`rowid`)
    .all();

  const cards = exercises.map((e) => {
    const own = muscles.filter((m) => m.exerciseId === e.id);
    const byRole = (role: 'primary' | 'secondary') =>
      own.filter((m) => m.role === role).map((m) => m.muscleId as MuscleId);
    return {
      id: e.id,
      name: e.name,
      equipmentId: e.equipmentId as EquipmentId,
      isCompound: e.isCompound,
      restSeconds: e.restSeconds,
      tracking: e.tracking,
      primary: byRole('primary'),
      secondary: byRole('secondary'),
    };
  });

  if (!ids) return cards;
  return ids.flatMap((id) => cards.find((c) => c.id === id) ?? []);
}
