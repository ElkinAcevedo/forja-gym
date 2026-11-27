import type { BodyView } from '../../domain/enums';

/**
 * Los 17 músculos del mapa muscular. `view` es la vista en la que se dibuja la
 * miniatura de un ejercicio cuyo músculo principal es este.
 * `group` agrupa músculos para la frecuencia semanal del asistente.
 */
export const MUSCLES = [
  { id: 'pecho', name: 'Pecho', view: 'front', group: 'Pecho' },
  { id: 'deltoide_anterior', name: 'Deltoide anterior', view: 'front', group: 'Hombros' },
  // El lateral se ve de frente y de espalda; su miniatura va de frente.
  { id: 'deltoide_lateral', name: 'Deltoide lateral', view: 'front', group: 'Hombros' },
  { id: 'biceps', name: 'Bíceps', view: 'front', group: 'Brazos' },
  { id: 'antebrazos', name: 'Antebrazos', view: 'front', group: 'Brazos' },
  { id: 'abs', name: 'Abdominales', view: 'front', group: 'Core' },
  { id: 'oblicuos', name: 'Oblicuos', view: 'front', group: 'Core' },
  { id: 'cuadriceps', name: 'Cuádriceps', view: 'front', group: 'Cuádriceps' },
  { id: 'trapecio', name: 'Trapecio', view: 'back', group: 'Espalda' },
  { id: 'espalda_alta', name: 'Espalda alta', view: 'back', group: 'Espalda' },
  { id: 'dorsales', name: 'Dorsales', view: 'back', group: 'Espalda' },
  { id: 'deltoide_posterior', name: 'Deltoide posterior', view: 'back', group: 'Hombros' },
  { id: 'triceps', name: 'Tríceps', view: 'back', group: 'Brazos' },
  { id: 'lumbar', name: 'Espalda baja', view: 'back', group: 'Espalda' },
  { id: 'gluteos', name: 'Glúteos', view: 'back', group: 'Isquios/Glúteo' },
  { id: 'isquios', name: 'Isquiotibiales', view: 'back', group: 'Isquios/Glúteo' },
  { id: 'gemelos', name: 'Gemelos', view: 'back', group: 'Gemelos' },
] as const satisfies readonly { id: string; name: string; view: BodyView; group: string }[];

export type MuscleId = (typeof MUSCLES)[number]['id'];
