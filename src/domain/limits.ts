/**
 * Rangos válidos de los valores que registra el usuario (documento de diseño, apartado 10).
 * Los usan los controles de la interfaz y las restricciones CHECK de la base de datos.
 */
export const LIMITS = {
  weightKg: { min: 0, max: 500, precision: 0.5 },
  reps: { min: 0, max: 100, precision: 1 },
  /** Series por tiempo (plancha…): de 5 en 5 segundos, hasta 1 hora. */
  durationS: { min: 0, max: 3600, precision: 5 },
  /** Series por distancia (cardio…): de 10 en 10 metros, hasta 100 km. */
  distanceM: { min: 0, max: 100000, precision: 10 },
  /** Descanso entre series de un ejercicio, ajustable de 15 en 15 segundos. */
  restSeconds: { min: 15, max: 600, precision: 15 },
  bodyWeightKg: { min: 30, max: 300, precision: 0.1 },
  heightCm: { min: 100, max: 250 },
  /** 0 = lunes … 6 = domingo */
  weekday: { min: 0, max: 6 },
  /** 0 = Principiante … 4 = Élite */
  level: { min: 0, max: 4 },
} as const;
