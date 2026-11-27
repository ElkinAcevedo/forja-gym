/**
 * Ajuste del descanso entre series. El recomendado viene de cada ejercicio del catálogo; si el
 * usuario lo ajustó, se respeta su elección.
 */
import { LIMITS } from './limits';
import { roundTo } from './numbers';

/** Lo que suma o resta cada toque de −15 s / +15 s en la barra de descanso. */
export const REST_ADJUST_STEP_S = LIMITS.restSeconds.precision;

/** Ajusta un descanso y lo deja en múltiplos de 15 s dentro del rango permitido. */
export function adjustRest(seconds: number, delta: number): number {
  const { min, max, precision } = LIMITS.restSeconds;
  return Math.min(max, Math.max(min, roundTo(seconds + delta, precision)));
}
