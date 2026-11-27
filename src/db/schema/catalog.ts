/**
 * Catálogo: datos de solo lectura que vienen con la app (músculos, equipos, ejercicios,
 * plantillas de rutinas…). Se cargan con la semilla y el usuario no los modifica.
 *
 * Las importaciones de `domain` son relativas porque drizzle-kit lee este archivo
 * fuera de la app y no conoce el alias `@/`.
 */
import { check, integer, primaryKey, real, sqliteTable, text } from 'drizzle-orm/sqlite-core';

import type { AchievementRule } from '../../domain/achievements';
import { BODY_VIEWS, MUSCLE_ROLES, TRACKING_MODES, TRAINING_GOALS } from '../../domain/enums';
import { LIMITS } from '../../domain/limits';
import { between } from './columns';

export const muscle = sqliteTable('muscle', {
  id: text('id').primaryKey(), // slug: 'pecho', 'dorsales'…
  name: text('name').notNull(),
  view: text('view', { enum: BODY_VIEWS }).notNull(),
  /** Grupo para la frecuencia del asistente: Pecho, Espalda, Hombros… */
  muscleGroup: text('muscle_group').notNull(),
});

export const equipment = sqliteTable('equipment', {
  id: text('id').primaryKey(), // 'barra', 'mancuernas'…
  name: text('name').notNull(),
  icon: text('icon').notNull(),
});

export const exercise = sqliteTable('exercise', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  equipmentId: text('equipment_id')
    .notNull()
    .references(() => equipment.id),
  isCompound: integer('is_compound', { mode: 'boolean' }).notNull(),
  tracking: text('tracking', { enum: TRACKING_MODES }).notNull().default('weight_reps'),
  /**
   * Descanso recomendado entre series. Sin CHECK a propósito: añadirlo obliga a recrear la
   * tabla en SQLite; los valores los valida la prueba de la semilla.
   */
  restSeconds: integer('rest_seconds').notNull().default(90),
  /** Ilustración del ejercicio; si falta, se dibuja el mapa muscular. */
  image: text('image'),
});

export const exerciseMuscle = sqliteTable(
  'exercise_muscle',
  {
    exerciseId: text('exercise_id')
      .notNull()
      .references(() => exercise.id),
    muscleId: text('muscle_id')
      .notNull()
      .references(() => muscle.id),
    role: text('role', { enum: MUSCLE_ROLES }).notNull(),
  },
  (t) => [primaryKey({ columns: [t.exerciseId, t.muscleId] })],
);

/** Umbral de peso de cada nivel para una persona de 75 kg; se escala al peso real. */
export const levelStandard = sqliteTable(
  'level_standard',
  {
    exerciseId: text('exercise_id')
      .notNull()
      .references(() => exercise.id),
    level: integer('level').notNull(),
    kgAt75: real('kg_at_75').notNull(),
  },
  (t) => [
    primaryKey({ columns: [t.exerciseId, t.level] }),
    check('level_standard_level', between(t.level, LIMITS.level)),
  ],
);

/** Series × reps sugeridas según el objetivo y si el ejercicio es compuesto. */
export const repScheme = sqliteTable(
  'rep_scheme',
  {
    goal: text('goal', { enum: TRAINING_GOALS }).notNull(),
    isCompound: integer('is_compound', { mode: 'boolean' }).notNull(),
    sets: integer('sets').notNull(),
    repMin: integer('rep_min').notNull(),
    repMax: integer('rep_max').notNull(),
  },
  (t) => [primaryKey({ columns: [t.goal, t.isCompound] })],
);

/** Día tipo reutilizable: Push, Pull, Legs, Upper… */
export const dayTemplate = sqliteTable('day_template', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  focus: text('focus').notNull(),
});

export const dayTemplateExercise = sqliteTable(
  'day_template_exercise',
  {
    dayTemplateId: text('day_template_id')
      .notNull()
      .references(() => dayTemplate.id),
    position: integer('position').notNull(),
    exerciseId: text('exercise_id')
      .notNull()
      .references(() => exercise.id),
  },
  (t) => [primaryKey({ columns: [t.dayTemplateId, t.position] })],
);

/** Rutina popular: PPL, Upper/Lower, Full Body, Arnold, Bro Split. */
export const programTemplate = sqliteTable('program_template', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  abbr: text('abbr').notNull(),
  tag: text('tag').notNull(),
  level: text('level').notNull(),
  daysLabel: text('days_label').notNull(),
  description: text('description').notNull(),
  tips: text('tips').notNull(),
});

export const programTemplateDay = sqliteTable(
  'program_template_day',
  {
    programId: text('program_id')
      .notNull()
      .references(() => programTemplate.id),
    position: integer('position').notNull(),
    dayTemplateId: text('day_template_id')
      .notNull()
      .references(() => dayTemplate.id),
  },
  (t) => [primaryKey({ columns: [t.programId, t.position] })],
);

/**
 * Configuración que propone el asistente para un estilo y un número de días.
 * `week` tiene 7 valores (lunes a domingo): el id de un día tipo o 'rest'.
 */
export const assistantConfig = sqliteTable(
  'assistant_config',
  {
    programId: text('program_id')
      .notNull()
      .references(() => programTemplate.id),
    daysPerWeek: integer('days_per_week').notNull(),
    position: integer('position').notNull(),
    name: text('name').notNull(),
    explanation: text('explanation').notNull(),
    week: text('week', { mode: 'json' }).notNull().$type<string[]>(),
  },
  (t) => [
    primaryKey({ columns: [t.programId, t.daysPerWeek, t.position] }),
    check('assistant_config_days', between(t.daysPerWeek, { min: 2, max: 6 })),
  ],
);

/** Logro desbloqueable. `rule` describe la condición para conseguirlo. */
export const achievement = sqliteTable('achievement', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  icon: text('icon').notNull(),
  rule: text('rule', { mode: 'json' }).notNull().$type<AchievementRule>(),
});
