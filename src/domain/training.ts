/** Reglas de prescripción del entrenamiento: series × reps sugeridas y 1RM estimado. */
import type { TrainingGoal } from './enums';
import { roundTo } from './numbers';

/** Series y rango de repeticiones de un ejercicio. */
export type RepScheme = { sets: number; repMin: number; repMax: number };

/** Fila del catálogo: el esquema que corresponde a un objetivo y un tipo de ejercicio. */
export type RepSchemeRule = RepScheme & { goal: TrainingGoal; isCompound: boolean };

/**
 * Series × reps sugeridas para un ejercicio según el objetivo del usuario.
 * Los compuestos (banca, sentadilla…) llevan menos reps y más peso que los accesorios.
 */
export function suggestedScheme(
  rules: readonly RepSchemeRule[],
  goal: TrainingGoal,
  isCompound: boolean,
): RepScheme {
  const rule = rules.find((r) => r.goal === goal && r.isCompound === isCompound);
  if (!rule) throw new Error(`Falta el esquema de series para ${goal} (compuesto: ${isCompound})`);
  return { sets: rule.sets, repMin: rule.repMin, repMax: rule.repMax };
}

/** Texto del esquema tal como lo muestra la app: "4 × 6–8" (o "3 × 10" si el rango es fijo). */
export function formatScheme({ sets, repMin, repMax }: RepScheme): string {
  const reps = repMin === repMax ? `${repMin}` : `${repMin}–${repMax}`;
  return `${sets} × ${reps}`;
}

/**
 * Peso máximo estimado para una sola repetición (1RM), con la fórmula de Epley:
 * peso × (1 + reps / 30). Se redondea a 0.5 kg, como cualquier peso de la app.
 * Con 1 repetición el 1RM es el propio peso; sin repeticiones no hay estimación (0).
 */
export function estimateOneRepMax(weightKg: number, reps: number): number {
  if (reps <= 0 || weightKg <= 0) return 0;
  if (reps === 1) return weightKg;
  return roundTo(weightKg * (1 + reps / 30), 0.5);
}
