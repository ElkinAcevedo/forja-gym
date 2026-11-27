/** Filtro del selector de ejercicios: por músculo (tocado en el mapa) y por equipo. */

export type ExerciseFilter = {
  /** Músculo tocado en el mapa; nulo = todos. */
  muscle: string | null;
  /** Equipo elegido; nulo = todos. */
  equipment: string | null;
};

type Filterable = {
  primary: readonly string[];
  secondary: readonly string[];
  equipmentId: string;
};

export const NO_FILTER: ExerciseFilter = { muscle: null, equipment: null };

/**
 * Ejercicios que cumplen el filtro. Un músculo cuenta si el ejercicio lo trabaja como
 * principal o secundario; los que lo trabajan como principal van primero.
 */
export function filterExercises<T extends Filterable>(
  exercises: readonly T[],
  { muscle, equipment }: ExerciseFilter,
): T[] {
  const matches = exercises.filter(
    (e) =>
      (!equipment || e.equipmentId === equipment) &&
      (!muscle || e.primary.includes(muscle) || e.secondary.includes(muscle)),
  );
  if (!muscle) return matches;
  return [
    ...matches.filter((e) => e.primary.includes(muscle)),
    ...matches.filter((e) => !e.primary.includes(muscle)),
  ];
}
