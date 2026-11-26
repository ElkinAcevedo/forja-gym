/**
 * Conjuntos cerrados de valores del dominio. Son la única fuente de verdad:
 * el esquema de la base de datos y la interfaz los importan de aquí.
 */

/** Objetivo de entrenamiento: define las series × reps sugeridas. */
export const TRAINING_GOALS = ['strength', 'hypertrophy', 'endurance'] as const;
export type TrainingGoal = (typeof TRAINING_GOALS)[number];

/** Vista del mapa muscular en la que se dibuja un músculo. */
export const BODY_VIEWS = ['front', 'back'] as const;
export type BodyView = (typeof BODY_VIEWS)[number];

/** Papel de un músculo en un ejercicio. */
export const MUSCLE_ROLES = ['primary', 'secondary'] as const;
export type MuscleRole = (typeof MUSCLE_ROLES)[number];

/** Qué se registra en cada serie de un ejercicio. */
export const TRACKING_MODES = ['weight_reps', 'time', 'distance', 'time_distance'] as const;
export type TrackingMode = (typeof TRACKING_MODES)[number];

export const WEIGHT_UNITS = ['kg', 'lb'] as const;
export type WeightUnit = (typeof WEIGHT_UNITS)[number];

export const SEXES = ['male', 'female'] as const;
export type Sex = (typeof SEXES)[number];

/** Tipos de meta del perfil. */
export const GOAL_KINDS = ['max_weight', 'reps', 'volume', 'body_weight'] as const;
export type GoalKind = (typeof GOAL_KINDS)[number];

/** Lo que suman los botones + / − del peso, en kg. */
export const WEIGHT_INCREMENTS_KG = [1, 2.5, 5] as const;

/** Segundos de descanso entre series que se pueden elegir. */
export const REST_OPTIONS_S = [60, 90, 120, 180] as const;
