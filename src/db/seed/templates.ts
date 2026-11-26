import type { ExerciseId } from './exercises';

/** Días tipo reutilizables por las rutinas populares y el asistente (mockup). */
// prettier-ignore
export const DAY_TEMPLATES = [
  { id: 'push', name: 'Push', focus: 'Empuje', exercises: ['banca', 'inclinado', 'militar', 'laterales', 'triceppolea'] },
  { id: 'pull', name: 'Pull', focus: 'Tirón', exercises: ['dominadas', 'remo', 'jalon', 'facepull', 'curl'] },
  { id: 'legs', name: 'Legs', focus: 'Pierna', exercises: ['sentadilla', 'rumano', 'prensa', 'femoral', 'gemelos'] },
  { id: 'upper', name: 'Upper', focus: 'Tren superior', exercises: ['banca', 'remo', 'militar', 'jalon', 'curl', 'triceppolea'] },
  { id: 'lower', name: 'Lower', focus: 'Tren inferior', exercises: ['sentadilla', 'rumano', 'extension', 'femoral', 'gemelos', 'crunch'] },
  { id: 'full', name: 'Full Body', focus: 'Cuerpo completo', exercises: ['sentadilla', 'banca', 'remo', 'militar', 'rumano', 'crunch'] },
  { id: 'chestback', name: 'Pecho + Espalda', focus: 'Pecho y espalda', exercises: ['banca', 'dominadas', 'inclinado', 'remo', 'peckdeck'] },
  { id: 'armsh', name: 'Hombro + Brazo', focus: 'Hombros y brazos', exercises: ['militar', 'laterales', 'curl', 'triceppolea', 'martillo'] },
  { id: 'chest', name: 'Pecho', focus: 'Pecho', exercises: ['banca', 'inclinado', 'peckdeck', 'fondos'] },
  { id: 'back', name: 'Espalda', focus: 'Espalda', exercises: ['dominadas', 'remo', 'jalon', 'facepull'] },
  { id: 'shoulders', name: 'Hombros', focus: 'Hombros', exercises: ['militar', 'laterales', 'facepull', 'crunch'] },
  { id: 'arms', name: 'Brazos', focus: 'Brazos', exercises: ['curl', 'martillo', 'triceppolea', 'fondos'] },
] as const satisfies readonly { id: string; name: string; focus: string; exercises: readonly ExerciseId[] }[];

export type DayTemplateId = (typeof DAY_TEMPLATES)[number]['id'];

/** Consejo de progresión común a todas las rutinas populares. */
export const PROGRESSION_TIPS =
  'Empieza cada día con el ejercicio compuesto más pesado. Sube 2.5 kg cuando completes ' +
  'todas las series en el tope del rango de repeticiones.';

/** Rutinas populares. `plan` es la secuencia de días tipo que se repite. */
export const PROGRAMS = [
  {
    id: 'ppl',
    name: 'Push / Pull / Legs',
    abbr: 'PPL',
    tag: 'Más popular',
    level: 'Intermedio',
    daysLabel: '3–6 días',
    plan: ['push', 'pull', 'legs'],
    description:
      'Divide el entrenamiento por patrón de movimiento: empuje (pecho, hombro, tríceps), ' +
      'tirón (espalda, bíceps) y pierna. Con 6 días entrenas cada músculo 2 veces por semana; ' +
      'con 3 días, una.',
  },
  {
    id: 'ul',
    name: 'Upper / Lower',
    abbr: 'U/L',
    tag: 'Equilibrada',
    level: 'Principiante–Intermedio',
    daysLabel: '4 días',
    plan: ['upper', 'lower'],
    description:
      'Alterna tren superior y tren inferior. Con solo 4 días cada músculo se entrena 2 veces ' +
      'por semana. Muy buena para ganar fuerza.',
  },
  {
    id: 'fb',
    name: 'Full Body',
    abbr: 'FB',
    tag: 'Principiantes',
    level: 'Principiante',
    daysLabel: '2–3 días',
    plan: ['full'],
    description:
      'Todo el cuerpo en cada sesión con ejercicios compuestos. Es la opción más eficiente si ' +
      'tienes poco tiempo o estás empezando.',
  },
  {
    id: 'arnold',
    name: 'Arnold Split',
    abbr: 'AS',
    tag: 'Clásica',
    level: 'Avanzado',
    daysLabel: '6 días',
    plan: ['chestback', 'armsh', 'legs'],
    description:
      'Popularizada en los 70: pecho + espalda, hombros + brazos y pierna, dos veces por ' +
      'semana. Volumen alto que pide buena recuperación.',
  },
  {
    id: 'bro',
    name: 'Bro Split',
    abbr: 'BRO',
    tag: 'Culturismo',
    level: 'Intermedio',
    daysLabel: '5 días',
    plan: ['chest', 'back', 'legs', 'shoulders', 'arms'],
    description:
      'Un grupo muscular por día. Mucho volumen por sesión, pero cada músculo se entrena solo ' +
      'una vez por semana.',
  },
] as const satisfies readonly {
  id: string;
  name: string;
  abbr: string;
  tag: string;
  level: string;
  daysLabel: string;
  plan: readonly DayTemplateId[];
  description: string;
}[];

export type ProgramId = (typeof PROGRAMS)[number]['id'];
