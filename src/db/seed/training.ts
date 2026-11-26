import type { TrainingGoal } from '../../domain/enums';
import type { ExerciseId } from './exercises';

/** Series × reps sugeridas según el objetivo, para ejercicios compuestos y accesorios. */
export const REP_SCHEMES = [
  { goal: 'strength', compound: true, sets: 5, repMin: 3, repMax: 5 },
  { goal: 'strength', compound: false, sets: 3, repMin: 6, repMax: 8 },
  { goal: 'hypertrophy', compound: true, sets: 4, repMin: 6, repMax: 8 },
  { goal: 'hypertrophy', compound: false, sets: 3, repMin: 10, repMax: 12 },
  { goal: 'endurance', compound: true, sets: 3, repMin: 12, repMax: 15 },
  { goal: 'endurance', compound: false, sets: 3, repMin: 15, repMax: 20 },
] as const satisfies readonly {
  goal: TrainingGoal;
  compound: boolean;
  sets: number;
  repMin: number;
  repMax: number;
}[];

/**
 * Peso (kg) para alcanzar cada nivel, de Principiante a Élite, en una persona de 75 kg.
 * La app lo escala al peso corporal del usuario. Solo los básicos tienen tabla (mockup).
 */
export const LEVEL_STANDARDS: Partial<Record<ExerciseId, readonly number[]>> = {
  banca: [45, 60, 80, 105, 130],
  sentadilla: [60, 80, 110, 140, 175],
  rumano: [60, 80, 105, 135, 165],
  militar: [30, 40, 52, 68, 85],
  remo: [40, 55, 72, 95, 115],
};
