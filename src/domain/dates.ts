/**
 * Fechas de la semana de entrenamiento. La semana empieza el lunes (0 = lunes … 6 = domingo).
 * Los nombres van escritos a mano: el motor de JavaScript de Android no siempre trae los
 * nombres en español.
 */

export const WEEKDAY_NAMES = [
  'Lunes',
  'Martes',
  'Miércoles',
  'Jueves',
  'Viernes',
  'Sábado',
  'Domingo',
] as const;

/** Iniciales de los días para la tira de la semana (X = miércoles). */
export const WEEKDAY_LETTERS = ['L', 'M', 'X', 'J', 'V', 'S', 'D'] as const;

const MONTH_NAMES = [
  'enero',
  'febrero',
  'marzo',
  'abril',
  'mayo',
  'junio',
  'julio',
  'agosto',
  'septiembre',
  'octubre',
  'noviembre',
  'diciembre',
] as const;

/** Día de la semana empezando en lunes: 0 = lunes … 6 = domingo. */
export const weekdayIndex = (date: Date) => (date.getDay() + 6) % 7;

/** Medianoche local del lunes de la semana de `date`. */
export function startOfWeek(date: Date): Date {
  const monday = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  monday.setDate(monday.getDate() - weekdayIndex(date));
  return monday;
}

/** Los 7 días (lunes a domingo, a medianoche local) de la semana de `date`. */
export function weekDates(date: Date): Date[] {
  const monday = startOfWeek(date);
  return Array.from(
    { length: 7 },
    (_, i) => new Date(monday.getFullYear(), monday.getMonth(), monday.getDate() + i),
  );
}

/** "Jueves, 26 de noviembre" */
export const formatLongDate = (date: Date) =>
  `${WEEKDAY_NAMES[weekdayIndex(date)]}, ${date.getDate()} de ${MONTH_NAMES[date.getMonth()]}`;
