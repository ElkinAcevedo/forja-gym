import { REP_SCHEMES } from '@/db/seed/training';

import { TRAINING_GOALS } from './enums';
import {
  estimateOneRepMax,
  estimateWorkoutMinutes,
  formatScheme,
  suggestedScheme,
  type RepSchemeRule,
} from './training';

// Las reglas del catálogo real.
const RULES: readonly RepSchemeRule[] = REP_SCHEMES;

describe('suggestedScheme', () => {
  it('sugiere menos reps y más series a los compuestos en fuerza', () => {
    expect(suggestedScheme(RULES, 'strength', true)).toEqual({ sets: 5, repMin: 3, repMax: 5 });
    expect(suggestedScheme(RULES, 'strength', false)).toEqual({ sets: 3, repMin: 6, repMax: 8 });
  });

  it('el catálogo tiene esquema para cada objetivo y tipo de ejercicio', () => {
    for (const goal of TRAINING_GOALS) {
      for (const isCompound of [true, false]) {
        expect(() => suggestedScheme(RULES, goal, isCompound)).not.toThrow();
      }
    }
  });

  it('avisa si falta un esquema', () => {
    expect(() => suggestedScheme([], 'hypertrophy', true)).toThrow(/hypertrophy/);
  });
});

describe('formatScheme', () => {
  it('muestra series × rango de reps', () => {
    expect(formatScheme({ sets: 4, repMin: 6, repMax: 8 })).toBe('4 × 6–8');
  });

  it('muestra un solo número si el rango es fijo', () => {
    expect(formatScheme({ sets: 3, repMin: 10, repMax: 10 })).toBe('3 × 10');
  });
});

describe('estimateOneRepMax', () => {
  it('aplica Epley y redondea a 0.5 kg', () => {
    expect(estimateOneRepMax(80, 8)).toBe(101.5); // 80 × (1 + 8/30) = 101.33
    expect(estimateOneRepMax(100, 5)).toBe(116.5); // 116.67
  });

  it('con una repetición el 1RM es el propio peso', () => {
    expect(estimateOneRepMax(120, 1)).toBe(120);
  });

  it('sin repeticiones o sin peso no estima nada', () => {
    expect(estimateOneRepMax(80, 0)).toBe(0);
    expect(estimateOneRepMax(0, 10)).toBe(0);
  });
});

describe('estimateWorkoutMinutes', () => {
  it('suma trabajo y descanso de cada serie y redondea a 5 minutos', () => {
    // 17 series × (40 s + 90 s) = 2210 s ≈ 36.8 min → 35
    expect(estimateWorkoutMinutes(17, 90)).toBe(35);
  });

  it('nunca estima menos de 5 minutos si hay series', () => {
    expect(estimateWorkoutMinutes(1, 60)).toBe(5);
  });

  it('un día sin series dura 0 minutos', () => {
    expect(estimateWorkoutMinutes(0, 90)).toBe(0);
  });
});
