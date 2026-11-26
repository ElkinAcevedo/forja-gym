/**
 * Rangos válidos de los valores que registra el usuario (documento de diseño, apartado 10).
 * Los usan los controles de la interfaz y las restricciones CHECK de la base de datos.
 */
export const LIMITS = {
  weightKg: { min: 0, max: 500, precision: 0.5 },
  reps: { min: 0, max: 100, precision: 1 },
  bodyWeightKg: { min: 30, max: 300, precision: 0.1 },
  heightCm: { min: 100, max: 250 },
  /** 0 = lunes … 6 = domingo */
  weekday: { min: 0, max: 6 },
  /** 0 = Principiante … 4 = Élite */
  level: { min: 0, max: 4 },
} as const;
