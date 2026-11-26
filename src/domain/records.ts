/**
 * ¿Es esta serie un récord personal? Lo es si su peso supera el mejor peso anterior
 * del ejercicio.
 *
 * - Igualar el récord no cuenta: hay que superarlo.
 * - La primera vez que se hace un ejercicio no hay nada que superar: no es récord (si no,
 *   cada ejercicio nuevo celebraría un "récord" sin mérito).
 * - Las series sin peso (por tiempo o distancia) no cuentan como récord de peso.
 */
export function isNewRecord(weightKg: number | null, previousBestKg: number | null): boolean {
  if (weightKg === null || previousBestKg === null) return false;
  return weightKg > previousBestKg;
}
