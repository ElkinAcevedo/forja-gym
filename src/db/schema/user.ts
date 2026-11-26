/**
 * Datos del usuario: perfil, rutinas, entrenamientos, series, metas…
 * Toda tabla lleva `user_id` y las columnas de sincronización (ver `syncColumns`).
 * Los ids son UUID generados en el dispositivo, así no dependen del servidor.
 *
 * Las importaciones de `domain` son relativas porque drizzle-kit lee este archivo
 * fuera de la app y no conoce el alias `@/`.
 */
import { sql } from 'drizzle-orm';
import {
  check,
  index,
  integer,
  primaryKey,
  real,
  sqliteTable,
  text,
  uniqueIndex,
} from 'drizzle-orm/sqlite-core';

import {
  GOAL_KINDS,
  REST_OPTIONS_S,
  SEXES,
  TRAINING_GOALS,
  WEIGHT_INCREMENTS_KG,
  WEIGHT_UNITS,
} from '../../domain/enums';
import { LIMITS } from '../../domain/limits';
import { achievement, exercise, programTemplate } from './catalog';
import { between, nowUtc, syncColumns } from './columns';

/** `columna IN (a, b, c)` para una CHECK; los valores van como texto literal. */
const oneOf = (column: Parameters<typeof between>[0], values: readonly number[]) =>
  sql`${column} IN (${sql.raw(values.join(', '))})`;

export const userProfile = sqliteTable(
  'user_profile',
  {
    id: text('id').primaryKey(),
    displayName: text('display_name').notNull(),
    sex: text('sex', { enum: SEXES }),
    birthDate: text('birth_date'), // YYYY-MM-DD
    heightCm: integer('height_cm'),
    goal: text('goal', { enum: TRAINING_GOALS }).notNull().default('hypertrophy'),
    unit: text('unit', { enum: WEIGHT_UNITS }).notNull().default('kg'),
    incrementKg: real('increment_kg').notNull().default(2.5),
    restSeconds: integer('rest_seconds').notNull().default(90),
    /** Precargar cada serie con el peso y las reps de la última sesión. */
    autofill: integer('autofill', { mode: 'boolean' }).notNull().default(true),
    reminders: integer('reminders', { mode: 'boolean' }).notNull().default(true),
    createdAt: text('created_at').notNull().default(nowUtc),
    ...syncColumns(),
  },
  (t) => [
    check('user_profile_height', between(t.heightCm, LIMITS.heightCm)),
    check('user_profile_increment', oneOf(t.incrementKg, WEIGHT_INCREMENTS_KG)),
    check('user_profile_rest', oneOf(t.restSeconds, REST_OPTIONS_S)),
  ],
);

/** Dueño de la fila. Función: cada tabla necesita su propia instancia de columna. */
const userId = () =>
  text('user_id')
    .notNull()
    .references(() => userProfile.id, { onDelete: 'cascade' });

/** Una medición de peso corporal por día. */
export const bodyWeight = sqliteTable(
  'body_weight',
  {
    id: text('id').primaryKey(),
    userId: userId(),
    date: text('date').notNull(), // YYYY-MM-DD
    kg: real('kg').notNull(),
    ...syncColumns(),
  },
  (t) => [
    uniqueIndex('body_weight_user_date').on(t.userId, t.date),
    check('body_weight_kg', between(t.kg, LIMITS.bodyWeightKg)),
  ],
);

export const routine = sqliteTable(
  'routine',
  {
    id: text('id').primaryKey(),
    userId: userId(),
    name: text('name').notNull(),
    isActive: integer('is_active', { mode: 'boolean' }).notNull().default(false),
    /** Rutina popular de la que salió, si se creó con el asistente. */
    sourceProgramId: text('source_program_id').references(() => programTemplate.id),
    createdAt: text('created_at').notNull().default(nowUtc),
    ...syncColumns(),
  },
  (t) => [
    // Solo puede haber una rutina activa (no borrada) por usuario.
    uniqueIndex('routine_one_active')
      .on(t.userId)
      .where(sql`${t.isActive} = 1 AND ${t.deletedAt} IS NULL`),
  ],
);

/** Siempre 7 filas por rutina, una por día de la semana; `name` nulo = descanso. */
export const routineDay = sqliteTable(
  'routine_day',
  {
    id: text('id').primaryKey(),
    userId: userId(),
    routineId: text('routine_id')
      .notNull()
      .references(() => routine.id, { onDelete: 'cascade' }),
    weekday: integer('weekday').notNull(),
    name: text('name'),
    ...syncColumns(),
  },
  (t) => [
    uniqueIndex('routine_day_weekday').on(t.routineId, t.weekday),
    check('routine_day_weekday_range', between(t.weekday, LIMITS.weekday)),
  ],
);

/** Ejercicio de un día. Series y reps nulas = usar las sugeridas por el objetivo. */
export const routineDayExercise = sqliteTable(
  'routine_day_exercise',
  {
    id: text('id').primaryKey(),
    userId: userId(),
    routineDayId: text('routine_day_id')
      .notNull()
      .references(() => routineDay.id, { onDelete: 'cascade' }),
    exerciseId: text('exercise_id')
      .notNull()
      .references(() => exercise.id),
    position: integer('position').notNull(),
    sets: integer('sets'),
    repMin: integer('rep_min'),
    repMax: integer('rep_max'),
    ...syncColumns(),
  },
  (t) => [index('routine_day_exercise_day').on(t.routineDayId)],
);

/** Un entrenamiento. `endedAt` nulo = sesión en curso (se retoma al reabrir la app). */
export const workoutSession = sqliteTable(
  'workout_session',
  {
    id: text('id').primaryKey(),
    userId: userId(),
    /** Día de la rutina que se entrenó; nulo = entrenamiento libre. */
    routineDayId: text('routine_day_id').references(() => routineDay.id, {
      onDelete: 'set null',
    }),
    startedAt: text('started_at').notNull().default(nowUtc),
    endedAt: text('ended_at'),
    ...syncColumns(),
  },
  (t) => [index('workout_session_started').on(t.userId, t.startedAt)],
);

/**
 * Una serie registrada; es la tabla que más se escribe.
 * Según el tipo de ejercicio se llenan peso y reps, tiempo, distancia o ambos.
 */
export const setLog = sqliteTable(
  'set_log',
  {
    id: text('id').primaryKey(),
    userId: userId(),
    sessionId: text('session_id')
      .notNull()
      .references(() => workoutSession.id, { onDelete: 'cascade' }),
    exerciseId: text('exercise_id')
      .notNull()
      .references(() => exercise.id),
    position: integer('position').notNull(),
    weightKg: real('weight_kg'),
    reps: integer('reps'),
    durationS: integer('duration_s'),
    distanceM: real('distance_m'),
    completedAt: text('completed_at').notNull().default(nowUtc),
    /** Se marcó como récord al confirmarla. */
    isPr: integer('is_pr', { mode: 'boolean' }).notNull().default(false),
    ...syncColumns(),
  },
  (t) => [
    // Historial y récord de un ejercicio: la consulta más frecuente.
    index('set_log_exercise_completed').on(t.exerciseId, t.completedAt),
    index('set_log_session').on(t.sessionId),
    check('set_log_weight', between(t.weightKg, LIMITS.weightKg)),
    check('set_log_reps', between(t.reps, LIMITS.reps)),
    check('set_log_duration', sql`${t.durationS} >= 0`),
    check('set_log_distance', sql`${t.distanceM} >= 0`),
  ],
);

/** Meta del perfil. `exerciseId` es nulo en las metas de peso corporal. */
export const goal = sqliteTable('goal', {
  id: text('id').primaryKey(),
  userId: userId(),
  kind: text('kind', { enum: GOAL_KINDS }).notNull(),
  exerciseId: text('exercise_id').references(() => exercise.id),
  startValue: real('start_value').notNull(),
  targetValue: real('target_value').notNull(),
  createdAt: text('created_at').notNull().default(nowUtc),
  achievedAt: text('achieved_at'),
  ...syncColumns(),
});

export const userAchievement = sqliteTable(
  'user_achievement',
  {
    userId: userId(),
    achievementId: text('achievement_id')
      .notNull()
      .references(() => achievement.id),
    unlockedAt: text('unlocked_at').notNull().default(nowUtc),
    ...syncColumns(),
  },
  (t) => [primaryKey({ columns: [t.userId, t.achievementId] })],
);

/**
 * Recuperación de racha gastada: un día de entrenamiento que se saltó sin romper la racha.
 * Se permiten 5 cada dos meses (la regla vive en `domain`, no aquí).
 */
export const streakRestore = sqliteTable(
  'streak_restore',
  {
    id: text('id').primaryKey(),
    userId: userId(),
    date: text('date').notNull(), // YYYY-MM-DD del día saltado
    ...syncColumns(),
  },
  (t) => [uniqueIndex('streak_restore_user_date').on(t.userId, t.date)],
);
