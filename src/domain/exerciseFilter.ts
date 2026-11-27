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
 * Ejercicios que cumplen el filtro, separados: `main` los que trabajan el músculo como
 * principal (o todos, sin músculo) y `also` los que solo lo trabajan como secundario, que
 * se muestran aparte para no tapar los propios del músculo (un remo no es "de bíceps").
 */
export function filterExercises<T extends Filterable>(
  exercises: readonly T[],
  { muscle, equipment }: ExerciseFilter,
): { main: T[]; also: T[] } {
  const byEquipment = exercises.filter((e) => !equipment || e.equipmentId === equipment);
  if (!muscle) return { main: byEquipment, also: [] };
  return {
    main: byEquipment.filter((e) => e.primary.includes(muscle)),
    also: byEquipment.filter((e) => !e.primary.includes(muscle) && e.secondary.includes(muscle)),
  };
}
