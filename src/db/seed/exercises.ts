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

/**
 * Ejercicios del catálogo. Una línea por ejercicio: se lee como una tabla. Cada variante de
 * equipo (barra o mancuernas, máquina…) es un ejercicio aparte para no mezclar récords.
 */
// prettier-ignore
export const EXERCISES = [
  // Pecho
  { id: 'banca', name: 'Press de banca con barra', equipment: 'barra', compound: true, rest: 180, primary: ['pecho'], secondary: ['triceps', 'deltoide_anterior'] },
  { id: 'bancamancuernas', name: 'Press de banca con mancuernas', equipment: 'mancuernas', compound: true, rest: 150, primary: ['pecho'], secondary: ['triceps', 'deltoide_anterior'] },
  { id: 'bancasmith', name: 'Press de banca en Smith', equipment: 'smith', compound: true, rest: 150, primary: ['pecho'], secondary: ['triceps', 'deltoide_anterior'] },
  { id: 'inclinadobarra', name: 'Press inclinado con barra', equipment: 'barra', compound: true, rest: 150, primary: ['pecho'], secondary: ['deltoide_anterior', 'triceps'] },
  { id: 'inclinado', name: 'Press inclinado con mancuernas', equipment: 'mancuernas', compound: false, rest: 120, primary: ['pecho'], secondary: ['deltoide_anterior', 'triceps'] },
  { id: 'inclinadosmith', name: 'Press inclinado en Smith', equipment: 'smith', compound: true, rest: 150, primary: ['pecho'], secondary: ['deltoide_anterior', 'triceps'] },
  { id: 'declinado', name: 'Press declinado con barra', equipment: 'barra', compound: true, rest: 150, primary: ['pecho'], secondary: ['triceps'] },
  { id: 'pechomaquina', name: 'Press de pecho en máquina', equipment: 'maquina', compound: true, rest: 120, primary: ['pecho'], secondary: ['triceps', 'deltoide_anterior'] },
  { id: 'peckdeck', name: 'Peck deck', equipment: 'maquina', compound: false, rest: 90, primary: ['pecho'], secondary: ['deltoide_anterior'] },
  { id: 'aperturas', name: 'Aperturas con mancuernas', equipment: 'mancuernas', compound: false, rest: 90, primary: ['pecho'], secondary: ['deltoide_anterior'] },
  { id: 'cruces', name: 'Cruces en polea', equipment: 'polea', compound: false, rest: 60, primary: ['pecho'], secondary: ['deltoide_anterior'] },
  { id: 'flexiones', name: 'Flexiones', equipment: 'corporal', compound: true, rest: 90, primary: ['pecho'], secondary: ['triceps', 'deltoide_anterior'] },
  { id: 'fondos', name: 'Fondos en paralelas', equipment: 'corporal', compound: false, rest: 120, primary: ['triceps', 'pecho'], secondary: ['deltoide_anterior'] },
  // Hombro y trapecio
  { id: 'militar', name: 'Press militar con barra', equipment: 'barra', compound: true, rest: 150, primary: ['deltoide_anterior', 'deltoide_lateral'], secondary: ['triceps', 'trapecio'] },
  { id: 'hombromancuernas', name: 'Shoulder press con mancuernas', equipment: 'mancuernas', compound: true, rest: 120, primary: ['deltoide_anterior', 'deltoide_lateral'], secondary: ['triceps', 'trapecio'] },
  { id: 'hombromaquina', name: 'Shoulder press en máquina', equipment: 'maquina', compound: true, rest: 120, primary: ['deltoide_anterior', 'deltoide_lateral'], secondary: ['triceps'] },
  { id: 'hombrosmith', name: 'Press de hombro en Smith', equipment: 'smith', compound: true, rest: 120, primary: ['deltoide_anterior', 'deltoide_lateral'], secondary: ['triceps'] },
  { id: 'arnold', name: 'Press Arnold', equipment: 'mancuernas', compound: true, rest: 120, primary: ['deltoide_anterior', 'deltoide_lateral'], secondary: ['triceps'] },
  { id: 'laterales', name: 'Elevaciones laterales con mancuernas', equipment: 'mancuernas', compound: false, rest: 60, primary: ['deltoide_lateral'], secondary: ['trapecio'] },
  { id: 'lateralespolea', name: 'Elevaciones laterales en polea', equipment: 'polea', compound: false, rest: 60, primary: ['deltoide_lateral'], secondary: [] },
  { id: 'lateralesmaquina', name: 'Elevaciones laterales en máquina', equipment: 'maquina', compound: false, rest: 60, primary: ['deltoide_lateral'], secondary: [] },
  { id: 'frontales', name: 'Elevaciones frontales con mancuernas', equipment: 'mancuernas', compound: false, rest: 60, primary: ['deltoide_anterior'], secondary: [] },
  { id: 'remomenton', name: 'Remo al mentón con barra', equipment: 'barra', compound: false, rest: 90, primary: ['deltoide_lateral', 'trapecio'], secondary: ['biceps'] },
  { id: 'pajaros', name: 'Pájaros con mancuernas', equipment: 'mancuernas', compound: false, rest: 60, primary: ['deltoide_posterior'], secondary: ['espalda_alta'] },
  { id: 'peckinvertido', name: 'Peck deck invertido', equipment: 'maquina', compound: false, rest: 60, primary: ['deltoide_posterior'], secondary: ['espalda_alta', 'trapecio'] },
  { id: 'facepull', name: 'Face pull', equipment: 'polea', compound: false, rest: 60, primary: ['deltoide_posterior', 'espalda_alta'], secondary: ['trapecio'] },
  { id: 'encogimientos', name: 'Encogimientos con mancuernas', equipment: 'mancuernas', compound: false, rest: 60, primary: ['trapecio'], secondary: ['antebrazos'] },
  { id: 'encogimientosbarra', name: 'Encogimientos con barra', equipment: 'barra', compound: false, rest: 60, primary: ['trapecio'], secondary: ['antebrazos'] },
  // Espalda
  { id: 'dominadas', name: 'Dominadas', equipment: 'corporal', compound: true, rest: 150, primary: ['dorsales'], secondary: ['biceps', 'antebrazos'] },
  { id: 'dominadasasistidas', name: 'Dominadas asistidas en máquina', equipment: 'maquina', compound: true, rest: 120, primary: ['dorsales'], secondary: ['biceps'] },
  { id: 'jalon', name: 'Jalón al pecho', equipment: 'maquina', compound: false, rest: 120, primary: ['dorsales'], secondary: ['biceps'] },
  { id: 'jaloncerrado', name: 'Jalón con agarre cerrado', equipment: 'maquina', compound: false, rest: 120, primary: ['dorsales'], secondary: ['biceps', 'espalda_alta'] },
  { id: 'remo', name: 'Remo con barra', equipment: 'barra', compound: true, rest: 150, primary: ['dorsales', 'espalda_alta'], secondary: ['trapecio', 'deltoide_posterior', 'biceps', 'lumbar'] },
  { id: 'remot', name: 'Remo T', equipment: 'barra', compound: true, rest: 150, primary: ['dorsales', 'espalda_alta'], secondary: ['trapecio', 'deltoide_posterior', 'biceps', 'lumbar'] },
  { id: 'remomancuerna', name: 'Remo con mancuerna a una mano', equipment: 'mancuernas', compound: true, rest: 120, primary: ['dorsales'], secondary: ['espalda_alta', 'deltoide_posterior', 'biceps'] },
  { id: 'remocerrado', name: 'Remo cerrado en polea', equipment: 'polea', compound: true, rest: 120, primary: ['dorsales'], secondary: ['espalda_alta', 'deltoide_posterior', 'biceps'] },
  { id: 'remomaquina', name: 'Remo en máquina', equipment: 'maquina', compound: true, rest: 120, primary: ['dorsales', 'espalda_alta'], secondary: ['deltoide_posterior', 'biceps'] },
  { id: 'pullover', name: 'Pullover en polea', equipment: 'polea', compound: false, rest: 90, primary: ['dorsales'], secondary: ['pecho', 'triceps'] },
  { id: 'pullovermancuerna', name: 'Pullover con mancuerna', equipment: 'mancuernas', compound: false, rest: 90, primary: ['dorsales'], secondary: ['pecho', 'triceps'] },
  // Espalda baja
  { id: 'pesomuerto', name: 'Peso muerto', equipment: 'barra', compound: true, rest: 180, primary: ['isquios', 'gluteos', 'lumbar'], secondary: ['cuadriceps', 'trapecio', 'antebrazos'] },
  { id: 'hiperextensiones', name: 'Hiperextensiones', equipment: 'corporal', compound: false, rest: 90, primary: ['lumbar'], secondary: ['gluteos', 'isquios'] },
  { id: 'lumbarmaquina', name: 'Extensión lumbar en máquina', equipment: 'maquina', compound: false, rest: 90, primary: ['lumbar'], secondary: ['gluteos'] },
  { id: 'buenosdias', name: 'Buenos días con barra', equipment: 'barra', compound: true, rest: 120, primary: ['lumbar', 'isquios'], secondary: ['gluteos'] },
  // Bíceps y antebrazos
  { id: 'curl', name: 'Curl con barra', equipment: 'barra', compound: false, rest: 90, primary: ['biceps'], secondary: ['antebrazos'] },
  { id: 'curlmancuernas', name: 'Curl con mancuernas', equipment: 'mancuernas', compound: false, rest: 60, primary: ['biceps'], secondary: ['antebrazos'] },
  { id: 'curlinclinado', name: 'Curl inclinado con mancuernas', equipment: 'mancuernas', compound: false, rest: 60, primary: ['biceps'], secondary: [] },
  { id: 'martillo', name: 'Curl martillo', equipment: 'mancuernas', compound: false, rest: 60, primary: ['biceps', 'antebrazos'], secondary: [] },
  { id: 'concentrado', name: 'Curl concentrado', equipment: 'mancuernas', compound: false, rest: 60, primary: ['biceps'], secondary: [] },
  { id: 'curlpolea', name: 'Curl en polea', equipment: 'polea', compound: false, rest: 60, primary: ['biceps'], secondary: ['antebrazos'] },
  { id: 'predicador', name: 'Curl predicador en máquina', equipment: 'maquina', compound: false, rest: 60, primary: ['biceps'], secondary: [] },
  { id: 'predicadorbarra', name: 'Curl predicador con barra', equipment: 'barra', compound: false, rest: 60, primary: ['biceps'], secondary: [] },
  { id: 'curlmuneca', name: 'Curl de muñeca con barra', equipment: 'barra', compound: false, rest: 60, primary: ['antebrazos'], secondary: [] },
  { id: 'curlinverso', name: 'Curl inverso con barra', equipment: 'barra', compound: false, rest: 60, primary: ['antebrazos'], secondary: ['biceps'] },
  // Tríceps
  { id: 'triceppolea', name: 'Extensión de tríceps en polea', equipment: 'polea', compound: false, rest: 60, primary: ['triceps'], secondary: [] },
  { id: 'tricepscuerda', name: 'Extensión de tríceps con cuerda', equipment: 'polea', compound: false, rest: 60, primary: ['triceps'], secondary: [] },
  { id: 'tricepscabeza', name: 'Extensión de tríceps sobre la cabeza', equipment: 'mancuernas', compound: false, rest: 60, primary: ['triceps'], secondary: [] },
  { id: 'tricepscabezapolea', name: 'Extensión de tríceps sobre la cabeza en polea', equipment: 'polea', compound: false, rest: 60, primary: ['triceps'], secondary: [] },
  { id: 'pressfrances', name: 'Press francés con barra', equipment: 'barra', compound: false, rest: 90, primary: ['triceps'], secondary: [] },
  { id: 'patadatriceps', name: 'Patada de tríceps', equipment: 'mancuernas', compound: false, rest: 60, primary: ['triceps'], secondary: [] },
  { id: 'bancacerrado', name: 'Press de banca agarre cerrado', equipment: 'barra', compound: true, rest: 120, primary: ['triceps', 'pecho'], secondary: ['deltoide_anterior'] },
  { id: 'fondosbanco', name: 'Fondos en banco', equipment: 'corporal', compound: false, rest: 60, primary: ['triceps'], secondary: ['pecho', 'deltoide_anterior'] },
  { id: 'fondosmaquina', name: 'Fondos en máquina', equipment: 'maquina', compound: false, rest: 90, primary: ['triceps'], secondary: ['pecho'] },
  // Cuádriceps
  { id: 'sentadilla', name: 'Sentadilla con barra', equipment: 'barra', compound: true, rest: 180, primary: ['cuadriceps', 'gluteos'], secondary: ['isquios', 'lumbar'] },
  { id: 'sentadillafrontal', name: 'Sentadilla frontal con barra', equipment: 'barra', compound: true, rest: 180, primary: ['cuadriceps'], secondary: ['gluteos', 'abs'] },
  { id: 'sentadillasmith', name: 'Sentadilla en Smith', equipment: 'smith', compound: true, rest: 150, primary: ['cuadriceps', 'gluteos'], secondary: ['aductores', 'isquios'] },
  { id: 'hack', name: 'Sentadilla hack', equipment: 'maquina', compound: true, rest: 150, primary: ['cuadriceps'], secondary: ['gluteos'] },
  { id: 'goblet', name: 'Sentadilla goblet', equipment: 'mancuernas', compound: true, rest: 120, primary: ['cuadriceps', 'gluteos'], secondary: ['aductores'] },
  { id: 'bulgara', name: 'Sentadilla búlgara', equipment: 'mancuernas', compound: true, rest: 120, primary: ['cuadriceps', 'gluteos'], secondary: ['aductores', 'isquios'] },
  { id: 'zancadas', name: 'Zancadas con mancuernas', equipment: 'mancuernas', compound: true, rest: 120, primary: ['cuadriceps', 'gluteos'], secondary: ['aductores', 'isquios'] },
  { id: 'prensa', name: 'Prensa de piernas', equipment: 'maquina', compound: false, rest: 150, primary: ['cuadriceps'], secondary: ['gluteos'] },
  { id: 'extension', name: 'Extensión de cuádriceps', equipment: 'maquina', compound: false, rest: 90, primary: ['cuadriceps'], secondary: [] },
  // Aductores y abductores
  { id: 'aductoresmaquina', name: 'Máquina de aductores', equipment: 'maquina', compound: false, rest: 60, primary: ['aductores'], secondary: [] },
  { id: 'sentadillasumo', name: 'Sentadilla sumo con mancuerna', equipment: 'mancuernas', compound: true, rest: 120, primary: ['aductores', 'gluteos'], secondary: ['cuadriceps'] },
  { id: 'pesomuertosumo', name: 'Peso muerto sumo', equipment: 'barra', compound: true, rest: 180, primary: ['gluteos', 'aductores'], secondary: ['isquios', 'cuadriceps', 'lumbar'] },
  { id: 'abductoresmaquina', name: 'Máquina de abductores', equipment: 'maquina', compound: false, rest: 60, primary: ['abductores'], secondary: ['gluteos'] },
  { id: 'abduccionpolea', name: 'Abducción de cadera en polea', equipment: 'polea', compound: false, rest: 60, primary: ['abductores'], secondary: ['gluteos'] },
  { id: 'abducciontumbado', name: 'Abducción tumbado de lado', equipment: 'corporal', compound: false, rest: 60, primary: ['abductores'], secondary: [] },
  // Isquios y glúteos
  { id: 'rumano', name: 'Peso muerto rumano', equipment: 'barra', compound: true, rest: 150, primary: ['isquios', 'gluteos'], secondary: ['lumbar'] },
  { id: 'rumanomancuernas', name: 'Peso muerto rumano con mancuernas', equipment: 'mancuernas', compound: true, rest: 120, primary: ['isquios', 'gluteos'], secondary: ['lumbar'] },
  { id: 'femoral', name: 'Curl femoral tumbado', equipment: 'maquina', compound: false, rest: 90, primary: ['isquios'], secondary: [] },
  { id: 'femoralsentado', name: 'Curl femoral sentado', equipment: 'maquina', compound: false, rest: 90, primary: ['isquios'], secondary: [] },
  { id: 'hipthrust', name: 'Hip thrust con barra', equipment: 'barra', compound: true, rest: 120, primary: ['gluteos'], secondary: ['isquios'] },
  { id: 'hipthrustsmith', name: 'Hip thrust en Smith', equipment: 'smith', compound: true, rest: 120, primary: ['gluteos'], secondary: ['isquios'] },
  { id: 'hipthrustmaquina', name: 'Hip thrust en máquina', equipment: 'maquina', compound: true, rest: 120, primary: ['gluteos'], secondary: ['isquios'] },
  { id: 'patadagluteo', name: 'Patada de glúteo en polea', equipment: 'polea', compound: false, rest: 60, primary: ['gluteos'], secondary: ['isquios'] },
  // Gemelos
  { id: 'gemelos', name: 'Elevación de gemelos de pie', equipment: 'maquina', compound: false, rest: 60, primary: ['gemelos'], secondary: [] },
  { id: 'gemelossentado', name: 'Elevación de gemelos sentado', equipment: 'maquina', compound: false, rest: 60, primary: ['gemelos'], secondary: [] },
  { id: 'gemelosprensa', name: 'Gemelos en prensa', equipment: 'maquina', compound: false, rest: 60, primary: ['gemelos'], secondary: [] },
  { id: 'gemelossmith', name: 'Elevación de gemelos en Smith', equipment: 'smith', compound: false, rest: 60, primary: ['gemelos'], secondary: [] },
  // Core
  { id: 'crunch', name: 'Crunch en polea', equipment: 'polea', compound: false, rest: 60, primary: ['abs'], secondary: ['oblicuos'] },
  { id: 'crunchmaquina', name: 'Abdomen en máquina', equipment: 'maquina', compound: false, rest: 60, primary: ['abs'], secondary: ['oblicuos'] },
  { id: 'crunchsuelo', name: 'Crunch abdominal', equipment: 'corporal', compound: false, rest: 60, primary: ['abs'], secondary: [] },
  { id: 'elevpiernas', name: 'Elevación de piernas colgado', equipment: 'corporal', compound: false, rest: 60, primary: ['abs'], secondary: ['oblicuos'] },
  { id: 'rueda', name: 'Rueda abdominal', equipment: 'corporal', compound: false, rest: 60, primary: ['abs'], secondary: ['oblicuos', 'lumbar'] },
  { id: 'plancha', name: 'Plancha', equipment: 'corporal', compound: false, rest: 60, primary: ['abs'], secondary: ['oblicuos'], tracking: 'time' },
  { id: 'planchalateral', name: 'Plancha lateral', equipment: 'corporal', compound: false, rest: 60, primary: ['oblicuos'], secondary: ['abs'], tracking: 'time' },
  { id: 'rusos', name: 'Giros rusos', equipment: 'corporal', compound: false, rest: 60, primary: ['oblicuos'], secondary: ['abs'] },
  { id: 'lenador', name: 'Leñador en polea', equipment: 'polea', compound: false, rest: 60, primary: ['oblicuos'], secondary: ['abs'] },
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
