import type { TrackingMode } from '../../domain/enums';
import type { EquipmentId } from './equipment';
import type { MuscleId } from './muscles';

export type ExerciseSeed = {
  id: string;
  name: string;
  equipment: EquipmentId;
  /** Multiarticular: define las series × reps sugeridas (más pesadas). */
  compound: boolean;
  primary: readonly MuscleId[];
  secondary: readonly MuscleId[];
  /** Descanso recomendado entre series, en segundos (múltiplo de 15). */
  rest: number;
  tracking?: TrackingMode; // por defecto, peso y reps
};

/** Ejercicios iniciales del catálogo (mockup). Una línea por ejercicio: se lee como una tabla. */
// prettier-ignore
export const EXERCISES = [
  // Empuje
  { id: 'banca', name: 'Press de banca', equipment: 'barra', compound: true, rest: 180, primary: ['pecho'], secondary: ['triceps', 'hombros'] },
  { id: 'inclinado', name: 'Press inclinado', equipment: 'mancuernas', compound: false, rest: 120, primary: ['pecho'], secondary: ['hombros', 'triceps'] },
  { id: 'peckdeck', name: 'Peck deck', equipment: 'maquina', compound: false, rest: 90, primary: ['pecho'], secondary: ['hombros'] },
  { id: 'militar', name: 'Press militar', equipment: 'barra', compound: true, rest: 150, primary: ['hombros'], secondary: ['triceps', 'trapecio'] },
  { id: 'laterales', name: 'Elevaciones laterales', equipment: 'mancuernas', compound: false, rest: 60, primary: ['hombros'], secondary: ['trapecio'] },
  { id: 'triceppolea', name: 'Extensión tríceps', equipment: 'polea', compound: false, rest: 60, primary: ['triceps'], secondary: [] },
  { id: 'fondos', name: 'Fondos', equipment: 'corporal', compound: false, rest: 120, primary: ['triceps', 'pecho'], secondary: ['hombros'] },
  // Tirón
  { id: 'dominadas', name: 'Dominadas', equipment: 'corporal', compound: true, rest: 150, primary: ['dorsales'], secondary: ['biceps', 'antebrazos'] },
  { id: 'jalon', name: 'Jalón al pecho', equipment: 'maquina', compound: false, rest: 120, primary: ['dorsales'], secondary: ['biceps'] },
  { id: 'remo', name: 'Remo con barra', equipment: 'barra', compound: true, rest: 150, primary: ['dorsales', 'trapecio'], secondary: ['biceps', 'lumbar'] },
  { id: 'facepull', name: 'Face pull', equipment: 'polea', compound: false, rest: 60, primary: ['hombros', 'trapecio'], secondary: [] },
  { id: 'curl', name: 'Curl con barra', equipment: 'barra', compound: false, rest: 90, primary: ['biceps'], secondary: ['antebrazos'] },
  { id: 'martillo', name: 'Curl martillo', equipment: 'mancuernas', compound: false, rest: 60, primary: ['biceps', 'antebrazos'], secondary: [] },
  // Pierna
  { id: 'sentadilla', name: 'Sentadilla', equipment: 'barra', compound: true, rest: 180, primary: ['cuadriceps', 'gluteos'], secondary: ['isquios', 'lumbar'] },
  { id: 'prensa', name: 'Prensa de piernas', equipment: 'maquina', compound: false, rest: 150, primary: ['cuadriceps'], secondary: ['gluteos'] },
  { id: 'rumano', name: 'Peso muerto rumano', equipment: 'barra', compound: true, rest: 150, primary: ['isquios', 'gluteos'], secondary: ['lumbar'] },
  { id: 'femoral', name: 'Curl femoral', equipment: 'maquina', compound: false, rest: 90, primary: ['isquios'], secondary: [] },
  { id: 'extension', name: 'Extensión cuádriceps', equipment: 'maquina', compound: false, rest: 90, primary: ['cuadriceps'], secondary: [] },
  { id: 'gemelos', name: 'Elevación de gemelos', equipment: 'maquina', compound: false, rest: 60, primary: ['gemelos'], secondary: [] },
  // Core
  { id: 'crunch', name: 'Crunch en polea', equipment: 'polea', compound: false, rest: 60, primary: ['abs'], secondary: ['oblicuos'] },
] as const satisfies readonly ExerciseSeed[];

export type ExerciseId = (typeof EXERCISES)[number]['id'];

/** Los mismos ejercicios con tipos generales, para filtrar y buscar sin conversiones. */
export const EXERCISE_LIST: readonly ExerciseSeed[] = EXERCISES;

/** Ejercicio por id. Lanza un error si no existe: indica un dato roto en el catálogo. */
export function exerciseById(id: ExerciseId): ExerciseSeed {
  const found = EXERCISE_LIST.find((e) => e.id === id);
  if (!found) throw new Error(`Ejercicio no encontrado en el catálogo: ${id}`);
  return found;
}
