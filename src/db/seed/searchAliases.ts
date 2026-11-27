import { EQUIPMENT, type EquipmentId } from './equipment';
import { MUSCLES, type MuscleId } from './muscles';

/**
 * Otras formas de llamar a cada músculo y equipo en el gym ("pantorrilla", "barra guiada"…),
 * para que el buscador encuentre el ejercicio aunque no se use el nombre del catálogo.
 * Sin tildes: el buscador las quita antes de comparar.
 */
export const MUSCLE_ALIASES: Record<MuscleId, string> = {
  pecho: 'pectoral pectorales chest',
  deltoide_anterior: 'hombro hombros deltoides frontal shoulder',
  deltoide_lateral: 'hombro hombros deltoides shoulder',
  deltoide_posterior: 'hombro hombros deltoides trasero rear delt',
  biceps: 'brazo brazos',
  antebrazos: 'antebrazo forearm agarre',
  abs: 'abdomen abs core',
  oblicuos: 'abdomen cintura core',
  cuadriceps: 'pierna piernas muslo quads',
  aductores: 'aductor cerrar piernas pierna interna',
  trapecio: 'traps cuello',
  espalda_alta: 'espalda romboides espalda media',
  dorsales: 'dorsal espalda lats',
  triceps: 'brazo brazos',
  lumbar: 'lumbares espalda lower back',
  gluteos: 'gluteo cola nalgas glutes',
  abductores: 'abductor abrir piernas gluteo medio',
  isquios: 'isquiotibiales femoral femorales pierna hamstrings',
  gemelos: 'pantorrilla pantorrillas chamorro calves',
};

export const EQUIPMENT_ALIASES: Record<EquipmentId, string> = {
  barra: 'barbell',
  mancuernas: 'mancuerna dumbbell',
  maquina: 'machine',
  polea: 'cable',
  smith: 'barra guiada multipower',
  corporal: 'sin peso bodyweight calistenia',
};

/**
 * Texto en el que el buscador busca un ejercicio: su nombre, sus músculos principales y su
 * equipo, cada uno con sus sinónimos. Los secundarios no cuentan: "bíceps" no debe dar remos.
 */
export function exerciseSearchText(exercise: {
  name: string;
  primary: readonly MuscleId[];
  equipmentId: string;
}): string {
  const muscles = exercise.primary.map((id) => {
    const muscle = MUSCLES.find((m) => m.id === id);
    return `${muscle?.name ?? ''} ${MUSCLE_ALIASES[id]}`;
  });
  const equipment = EQUIPMENT.find((e) => e.id === exercise.equipmentId);
  const equipmentAliases = equipment ? EQUIPMENT_ALIASES[equipment.id] : '';
  return [exercise.name, ...muscles, equipment?.name ?? '', equipmentAliases].join(' ');
}
