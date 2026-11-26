/**
 * Condición para desbloquear un logro. Se guarda como JSON en el catálogo y la evalúa
 * el dominio; el tipo garantiza que cada regla tenga los datos que necesita.
 */
export type AchievementRule =
  | { type: 'first_pr' }
  | { type: 'streak'; days: number }
  | { type: 'workouts'; count: number }
  | { type: 'day_volume'; kg: number }
  | { type: 'consecutive_months'; months: number }
  | { type: 'exercise_weight'; exerciseId: string; kg: number }
  | { type: 'level'; level: number };
