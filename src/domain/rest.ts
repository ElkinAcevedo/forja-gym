/**
 * Descanso entre series de cada ejercicio. Los compuestos (sentadilla, banca, remo…) mueven
 * más peso y cansan más, así que descansan más que los accesorios. Si el usuario ajustó el
 * descanso de un ejercicio, se respeta su elección.
 */
import { LIMITS } from './limits';
import { roundTo } from './numbers';

/** Descanso extra de los ejercicios compuestos sobre el descanso general del perfil. */
export const COMPOUND_EXTRA_REST_S = 60;

/** Lo que suma o resta cada toque de −15 s / +15 s en la barra de descanso. */
export const REST_ADJUST_STEP_S = LIMITS.restSeconds.precision;

/**
 * Descanso de un ejercicio: el que eligió el usuario para él o, si no eligió, el general del
 * perfil (más `COMPOUND_EXTRA_REST_S` si es compuesto).
 */
export function restSecondsFor(
  profileRestSeconds: number,
  isCompound: boolean,
  preferredSeconds: number | null,
): number {
  if (preferredSeconds !== null) return preferredSeconds;
  return profileRestSeconds + (isCompound ? COMPOUND_EXTRA_REST_S : 0);
}

/** Ajusta un descanso y lo deja en múltiplos de 15 s dentro del rango permitido. */
export function adjustRest(seconds: number, delta: number): number {
  const { min, max, precision } = LIMITS.restSeconds;
  return Math.min(max, Math.max(min, roundTo(seconds + delta, precision)));
}
