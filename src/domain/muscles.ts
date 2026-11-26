/** Músculos que trabaja algo (un ejercicio, un día de rutina…), por papel. */
export type MuscleSet<Id extends string = string> = {
  primary: readonly Id[];
  secondary: readonly Id[];
};

/**
 * Músculos que trabaja un conjunto de ejercicios, p. ej. un día de rutina.
 * Un músculo es principal si lo es en algún ejercicio; secundario solo si no es principal
 * en ninguno (así el mapa no pinta como secundario lo que ya se trabaja a fondo).
 * Conserva el orden de aparición y no repite músculos.
 */
export function combineMuscles<Id extends string>(
  exercises: readonly MuscleSet<Id>[],
): MuscleSet<Id> {
  const primary = new Set(exercises.flatMap((e) => e.primary));
  const secondary = new Set(exercises.flatMap((e) => e.secondary).filter((m) => !primary.has(m)));
  return { primary: [...primary], secondary: [...secondary] };
}
