import { asc, inArray, sql } from 'drizzle-orm';

import * as schema from '@/db/schema';
import { EQUIPMENT, type EquipmentId } from '@/db/seed/equipment';
import { MUSCLES, type MuscleId } from '@/db/seed/muscles';
import type { AppDatabase, IdGenerator } from '@/db/types';
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

/** Largo máximo del nombre de un ejercicio propio. */
export const EXERCISE_NAME_MAX = 60;

/** Descanso de un ejercicio propio: el de un accesorio; se ajusta luego con ±15 s. */
const CUSTOM_REST_S = 90;

export type NewExercise = { name: string; equipmentId: EquipmentId; primary: MuscleId[] };

/** El nombre tal como se guarda: sin espacios sobrantes. */
export const cleanExerciseName = (name: string) => name.trim().replace(/\s+/g, ' ');

/** Si ya hay un ejercicio con ese nombre (sin distinguir mayúsculas). */
export function exerciseNameTaken(db: AppDatabase, name: string): boolean {
  const clean = cleanExerciseName(name).toLowerCase();
  return !!db
    .select({ id: schema.exercise.id })
    .from(schema.exercise)
    .where(sql`lower(${schema.exercise.name}) = ${clean}`)
    .get();
}

/**
 * Crea un ejercicio propio para lo que falte en el catálogo. Su imagen es el mapa muscular,
 * como la del resto, así que no rompe el estilo visual. Valida aquí y no solo en la pantalla.
 */
export function createExercise(
  db: AppDatabase,
  input: NewExercise,
  newId: IdGenerator,
): ExerciseCard {
  const name = cleanExerciseName(input.name);
  if (name.length === 0 || name.length > EXERCISE_NAME_MAX) {
    throw new Error(`Nombre de ejercicio no válido: "${name}"`);
  }
  if (!EQUIPMENT.some((e) => e.id === input.equipmentId)) {
    throw new Error(`Equipo no válido: ${input.equipmentId}`);
  }
  const primary = [...new Set(input.primary)];
  if (primary.length === 0 || primary.some((m) => !MUSCLES.some((x) => x.id === m))) {
    throw new Error('Elige al menos un músculo válido');
  }
  if (exerciseNameTaken(db, name)) throw new Error(`Ya existe un ejercicio llamado "${name}"`);

  const id = newId();
  db.transaction((tx) => {
    tx.insert(schema.exercise)
      .values({
        id,
        name,
        equipmentId: input.equipmentId,
        isCompound: false,
        restSeconds: CUSTOM_REST_S,
        isCustom: true,
      })
      .run();
    tx.insert(schema.exerciseMuscle)
      .values(primary.map((muscleId) => ({ exerciseId: id, muscleId, role: 'primary' as const })))
      .run();
  });
  return getExerciseCards(db, [id])[0];
}
