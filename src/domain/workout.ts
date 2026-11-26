/**
 * Reglas del registro de un entrenamiento: qué se anota en cada serie según el tipo de
 * ejercicio, cómo se precargan las series y cuándo una sesión abierta ya no se retoma.
 */
import type { TrackingMode } from './enums';
import { LIMITS } from './limits';

/** Valores de una serie. Según el tipo de ejercicio, algunos quedan vacíos (null). */
export type SetValues = {
  weightKg: number | null;
  reps: number | null;
  durationS: number | null;
  distanceM: number | null;
};

export type SetField = keyof SetValues;

/** Cómo se muestra y ajusta un campo de la serie en la pantalla de registro. */
export type FieldSpec = {
  field: SetField;
  label: string;
  unit?: string;
  min: number;
  max: number;
  precision: number;
};

const FIELD_SPECS: Record<SetField, FieldSpec> = {
  weightKg: { field: 'weightKg', label: 'Peso', unit: 'kg', ...LIMITS.weightKg },
  reps: { field: 'reps', label: 'Reps', ...LIMITS.reps },
  durationS: { field: 'durationS', label: 'Tiempo', unit: 's', ...LIMITS.durationS },
  distanceM: { field: 'distanceM', label: 'Distancia', unit: 'm', ...LIMITS.distanceM },
};

const FIELDS_BY_TRACKING: Record<TrackingMode, SetField[]> = {
  weight_reps: ['weightKg', 'reps'],
  time: ['durationS'],
  distance: ['distanceM'],
  time_distance: ['durationS', 'distanceM'],
};

/** Campos que se anotan en cada serie de un ejercicio, en orden de pantalla. */
export const fieldsFor = (tracking: TrackingMode): FieldSpec[] =>
  FIELDS_BY_TRACKING[tracking].map((field) => FIELD_SPECS[field]);

export const EMPTY_SET: SetValues = {
  weightKg: null,
  reps: null,
  durationS: null,
  distanceM: null,
};

/** Una serie en pantalla: sus valores y, si ya se confirmó con ✓, el id con que se guardó. */
export type DraftSet = { values: SetValues; savedSetId: string | null };

/**
 * Series con las que empieza un ejercicio. Con autollenado, la serie N copia la serie N de
 * la última sesión (o la última que hubo, si aquella tuvo menos). Sin autollenado, o sin
 * historial, los campos del ejercicio empiezan en 0.
 */
export function planSets(
  count: number,
  tracking: TrackingMode,
  lastSession: readonly SetValues[],
  autofill: boolean,
): DraftSet[] {
  const zeros: SetValues = { ...EMPTY_SET };
  for (const { field } of fieldsFor(tracking)) zeros[field] = 0;

  return Array.from({ length: count }, (_, i) => {
    const previous = lastSession[i] ?? lastSession.at(-1);
    return { values: autofill && previous ? { ...previous } : { ...zeros }, savedSetId: null };
  });
}

/** "+ Serie": añade una serie nueva con los valores de la última. */
export function addSetCopy(sets: readonly DraftSet[], tracking: TrackingMode): DraftSet[] {
  const last = sets.at(-1);
  const values = last ? { ...last.values } : planSets(1, tracking, [], false)[0].values;
  return [...sets, { values, savedSetId: null }];
}

/** Un ejercicio está hecho cuando todas sus series están confirmadas. */
export const isExerciseDone = (sets: readonly DraftSet[]) =>
  sets.length > 0 && sets.every((s) => s.savedSetId !== null);

/** Horas tras las que una sesión que quedó abierta ya no se retoma: se da por terminada. */
export const STALE_SESSION_HOURS = 12;

export const isSessionStale = (startedAt: string, now: Date) =>
  now.getTime() - new Date(startedAt).getTime() > STALE_SESSION_HOURS * 60 * 60 * 1000;

/**
 * Series en pantalla al abrir un ejercicio: las ya confirmadas en esta sesión (con su id) y,
 * hasta completar las sugeridas, las precargadas desde la última sesión.
 */
export function buildDraftSets(
  plannedCount: number,
  tracking: TrackingMode,
  lastSession: readonly SetValues[],
  autofill: boolean,
  saved: readonly { id: string; position: number; values: SetValues }[],
): DraftSet[] {
  const count = Math.max(plannedCount, ...saved.map((s) => s.position + 1));
  const drafts = planSets(count, tracking, lastSession, autofill);
  for (const set of saved) drafts[set.position] = { values: { ...set.values }, savedSetId: set.id };
  return drafts;
}
