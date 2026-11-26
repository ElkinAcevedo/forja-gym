/**
 * Carga el catálogo (músculos, ejercicios, plantillas…) en la base de datos local.
 *
 * Solo se ejecuta cuando cambia `CATALOG_VERSION`: la versión cargada se guarda en
 * `PRAGMA user_version`, un número que SQLite reserva para la app.
 */
import { getTableColumns, sql, type SQL } from 'drizzle-orm';
import type { BaseSQLiteDatabase, SQLiteColumn, SQLiteTable } from 'drizzle-orm/sqlite-core';

import * as schema from '../schema';
import { ACHIEVEMENTS } from './achievements';
import { buildAssistantOptions, DAYS_PER_WEEK } from './assistant';
import { EQUIPMENT } from './equipment';
import { EXERCISE_LIST } from './exercises';
import { MUSCLES } from './muscles';
import { DAY_TEMPLATES, PROGRAMS, PROGRESSION_TIPS } from './templates';
import { LEVEL_STANDARDS, REP_SCHEMES } from './training';

/** Súbelo cada vez que cambien los datos del catálogo para que se recarguen. */
export const CATALOG_VERSION = 1;

/** Cualquier base SQLite síncrona con nuestro esquema: la de Expo en la app, sql.js en las pruebas. */
type Database = BaseSQLiteDatabase<'sync', unknown, typeof schema>;

/**
 * Columnas no clave de una tabla con el valor que se intentó insertar (`excluded`),
 * para actualizar en un upsert todo lo que haya cambiado.
 */
function excludedColumns(table: SQLiteTable): Record<string, SQL> {
  return Object.fromEntries(
    Object.entries(getTableColumns(table))
      .filter(([, column]) => !column.primary)
      .map(([key, column]) => [key, sql.raw(`excluded."${column.name}"`)]),
  );
}

/**
 * Carga o actualiza el catálogo si su versión cambió. Devuelve `true` si lo cargó.
 *
 * Las tablas que referencian los datos del usuario (ejercicios, rutinas populares, logros…)
 * se actualizan con upsert para no romper esas referencias. Las tablas de relación, que nadie
 * referencia, se vacían y se vuelven a llenar.
 */
export function seedCatalog(db: Database): boolean {
  const loaded = db.get<{ user_version: number }>(sql`PRAGMA user_version`);
  if (loaded.user_version >= CATALOG_VERSION) return false;

  // shortcut: un ejercicio que se quite del catálogo seguirá en la base de datos;
  // cuando haga falta retirar uno, marcarlo como oculto en lugar de borrarlo.
  db.transaction((tx) => {
    tx.delete(schema.assistantConfig).run();
    tx.delete(schema.programTemplateDay).run();
    tx.delete(schema.dayTemplateExercise).run();
    tx.delete(schema.dayTemplate).run();
    tx.delete(schema.exerciseMuscle).run();
    tx.delete(schema.levelStandard).run();
    tx.delete(schema.repScheme).run();

    const upsert = <T extends SQLiteTable>(
      table: T,
      rows: T['$inferInsert'][],
      target: SQLiteColumn,
    ) =>
      tx
        .insert(table)
        .values(rows)
        .onConflictDoUpdate({ target, set: excludedColumns(table) })
        .run();

    upsert(
      schema.muscle,
      MUSCLES.map(({ id, name, view, group }) => ({ id, name, view, muscleGroup: group })),
      schema.muscle.id,
    );
    upsert(schema.equipment, [...EQUIPMENT], schema.equipment.id);

    const exercises = EXERCISE_LIST;
    upsert(
      schema.exercise,
      exercises.map((e) => ({
        id: e.id,
        name: e.name,
        equipmentId: e.equipment,
        isCompound: e.compound,
        tracking: e.tracking ?? 'weight_reps',
      })),
      schema.exercise.id,
    );
    tx.insert(schema.exerciseMuscle)
      .values(
        exercises.flatMap((e) => [
          ...e.primary.map((muscleId) => ({
            exerciseId: e.id,
            muscleId,
            role: 'primary' as const,
          })),
          ...e.secondary.map((muscleId) => ({
            exerciseId: e.id,
            muscleId,
            role: 'secondary' as const,
          })),
        ]),
      )
      .run();

    tx.insert(schema.levelStandard)
      .values(
        Object.entries(LEVEL_STANDARDS).flatMap(([exerciseId, kgByLevel]) =>
          (kgByLevel ?? []).map((kgAt75, level) => ({ exerciseId, level, kgAt75 })),
        ),
      )
      .run();

    tx.insert(schema.repScheme)
      .values(REP_SCHEMES.map(({ compound, ...rest }) => ({ ...rest, isCompound: compound })))
      .run();

    tx.insert(schema.dayTemplate)
      .values(DAY_TEMPLATES.map(({ id, name, focus }) => ({ id, name, focus })))
      .run();
    tx.insert(schema.dayTemplateExercise)
      .values(
        DAY_TEMPLATES.flatMap((day) =>
          day.exercises.map((exerciseId, position) => ({
            dayTemplateId: day.id,
            position,
            exerciseId,
          })),
        ),
      )
      .run();

    upsert(
      schema.programTemplate,
      PROGRAMS.map(({ plan, ...program }) => ({ ...program, tips: PROGRESSION_TIPS })),
      schema.programTemplate.id,
    );
    tx.insert(schema.programTemplateDay)
      .values(
        PROGRAMS.flatMap((program) =>
          program.plan.map((dayTemplateId, position) => ({
            programId: program.id,
            position,
            dayTemplateId,
          })),
        ),
      )
      .run();

    tx.insert(schema.assistantConfig)
      .values(
        PROGRAMS.flatMap((program) =>
          DAYS_PER_WEEK.flatMap((daysPerWeek) =>
            buildAssistantOptions(program.id, daysPerWeek).map((option, position) => ({
              programId: program.id,
              daysPerWeek,
              position,
              name: option.name,
              explanation: option.explanation,
              week: [...option.week],
            })),
          ),
        ),
      )
      .run();

    upsert(
      schema.achievement,
      ACHIEVEMENTS.map((a) => ({ ...a })),
      schema.achievement.id,
    );

    // Dentro de la transacción: si algo falla, tampoco se marca la versión como cargada.
    tx.run(sql.raw(`PRAGMA user_version = ${CATALOG_VERSION}`));
  });

  return true;
}
