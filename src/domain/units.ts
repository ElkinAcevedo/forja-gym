/**
 * Unidades de peso. La base de datos guarda siempre kilos; la interfaz muestra y recibe los
 * pesos en la unidad que elija el usuario (todo en kg o todo en lb).
 */
import type { WeightUnit } from './enums';
import { LIMITS } from './limits';
import { roundTo } from './numbers';

const KG_PER_LB = 0.45359237;

/** Paso mínimo de los pesos en pantalla: 0.5 kg o 0.5 lb. */
export const WEIGHT_PRECISION = 0.5;

/** Peso máximo en pantalla, equivalente al máximo que admite la base de datos. */
export const MAX_WEIGHT: Record<WeightUnit, number> = {
  kg: LIMITS.weightKg.max,
  lb: Math.floor(LIMITS.weightKg.max / KG_PER_LB),
};

/** Kilos guardados → valor en pantalla, redondeado a 0.5 de la unidad. */
export const toDisplayWeight = (kg: number, unit: WeightUnit) =>
  roundTo(unit === 'kg' ? kg : kg / KG_PER_LB, WEIGHT_PRECISION);

/**
 * Valor escrito en pantalla → kilos para guardar. En libras no se redondea a 0.5 kg: así
 * 135 lb se guarda exacto y se vuelve a mostrar como 135 lb.
 */
export const fromDisplayWeight = (value: number, unit: WeightUnit) =>
  unit === 'kg' ? value : Math.round(value * KG_PER_LB * 1000) / 1000;

/**
 * Opciones de "Incremento de peso" en cada unidad. Se guardan como su equivalente en kg
 * (1 / 2.5 / 5), de modo que la misma opción sirve en las dos unidades: 1 kg ↔ 2.5 lb.
 */
export const INCREMENT_OPTIONS: Record<WeightUnit, readonly number[]> = {
  kg: [1, 2.5, 5],
  lb: [2.5, 5, 10],
};

/** Paso de los botones + / − del peso en la unidad de pantalla. */
export function incrementFor(incrementKg: number, unit: WeightUnit): number {
  const index = INCREMENT_OPTIONS.kg.indexOf(incrementKg);
  return INCREMENT_OPTIONS[unit][index === -1 ? 1 : index];
}

/**
 * Con mancuernas se anota el peso de UNA (así se habla en el gym: "press con 15"). Con barra,
 * el total con la barra incluida, que es lo estándar para comparar récords.
 */
export const isWeightPerDumbbell = (equipmentId: string) => equipmentId === 'mancuernas';

/** "82.5 kg" / "176.5 lb"; con `each`, "15 kg c/u" (peso de cada mancuerna). */
export const formatWeight = (kg: number, unit: WeightUnit, each = false) =>
  `${toDisplayWeight(kg, unit)} ${unit}${each ? ' c/u' : ''}`;

/** Volumen total en miles: "18.4 t" en kg, "40.6k lb" en libras. */
export function formatVolume(kg: number, unit: WeightUnit): string {
  const thousands = (unit === 'kg' ? kg : kg / KG_PER_LB) / 1000;
  return unit === 'kg' ? `${thousands.toFixed(1)} t` : `${thousands.toFixed(1)}k lb`;
}
