/**
 * Nivel de fuerza del usuario en un ejercicio, de Principiante a Élite.
 * Los umbrales del catálogo son para una persona de 75 kg y se escalan a su peso corporal:
 * levantar 80 kg no significa lo mismo pesando 60 kg que pesando 100 kg.
 */
import { roundTo } from './numbers';

export const LEVEL_NAMES = ['Principiante', 'Novato', 'Intermedio', 'Avanzado', 'Élite'] as const;

/** Peso corporal de referencia de los umbrales del catálogo. */
export const REFERENCE_BODY_WEIGHT_KG = 75;

/** Los umbrales se redondean a 2.5 kg: es el salto mínimo habitual con discos. */
const THRESHOLD_PRECISION_KG = 2.5;

/** Umbrales (kg) de cada nivel para el peso corporal del usuario. */
export function scaleThresholds(kgAt75: readonly number[], bodyWeightKg: number): number[] {
  return kgAt75.map((kg) =>
    roundTo((kg * bodyWeightKg) / REFERENCE_BODY_WEIGHT_KG, THRESHOLD_PRECISION_KG),
  );
}

export type StrengthLevel = {
  /** 0 = Principiante … 4 = Élite */
  level: number;
  name: (typeof LEVEL_NAMES)[number];
  /** Siguiente nivel y los kg que faltan; `null` si ya es Élite. */
  next: { level: number; name: (typeof LEVEL_NAMES)[number]; kgToGo: number } | null;
};

/**
 * Nivel alcanzado con el mejor peso del usuario: el más alto cuyo umbral iguala o supera.
 * Por debajo del primer umbral se considera Principiante.
 */
export function strengthLevel(bestKg: number, thresholds: readonly number[]): StrengthLevel {
  if (thresholds.length !== LEVEL_NAMES.length) {
    throw new Error(`Se esperaban ${LEVEL_NAMES.length} umbrales y hay ${thresholds.length}`);
  }

  const reached = thresholds.filter((kg) => bestKg >= kg).length;
  const level = Math.max(reached - 1, 0);
  const nextLevel = level + 1;

  return {
    level,
    name: LEVEL_NAMES[level],
    next:
      nextLevel < LEVEL_NAMES.length
        ? {
            level: nextLevel,
            name: LEVEL_NAMES[nextLevel],
            kgToGo: roundTo(thresholds[nextLevel] - bestKg, 0.5),
          }
        : null,
  };
}
